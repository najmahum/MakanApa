import pickle
import uvicorn
import pandas as pd
import re
import io
from rapidfuzz import process, fuzz
from functools import lru_cache
from fastapi import FastAPI
from pydantic import BaseModel

# ==========================================
# 1. DEFINISI CLASS (HARUS ADA)
# ==========================================
class ResepRekomendasiModel:
    
    def __init__(self, dataframe_master, dataframe_bahan):
        self.df_master = dataframe_master.set_index('id_resep')
        self.df_bahan = dataframe_bahan
        
        self.NORMALISASI_MANUAL = {
            "cabai": "cabai", "cabe": "cabai", "cabaii": "cabai", "vabe": "cabai", "rawit": "cabai",
            "cabe rawit": "cabai", "cabe merah": "cabai", "cabe keriting": "cabai", "cabe ijo": "cabai",
            "cabai rawit": "cabai", "cabai merah": "cabai", "sambel": "sambal", "sambal": "sambal",
            "bawang": "bawang", "bwg": "bawang", "bawng": "bawang", "bwng": "bawang", "bamer": "bawang merah",
            "bawang merah": "bawang merah", "bwg merah": "bawang merah", "baput": "bawang putih",
            "bawang putih": "bawang putih", "bwg putih": "bawang putih", "bawang bombay": "bawang bombay",
            "bawang bombai": "bawang bombai", "bombay": "bawang bombay", "daun bawang": "daun bawang",
            "bawang prei": "daun bawang", "daun prei": "daun bawang", "loncang": "daun bawang",
            "jaheh": "jahe", "jhe": "jahe", "jahe": "jahe", "lengkoas": "lengkuas", "lengkuas": "lengkuas",
            "laos": "lengkuas", "kunyit": "kunyit", "kunir": "kunyit", "kencur": "kencur", "sereh": "serai",
            "serai": "serai", "jintan": "jinten", "jinten": "jinten", "ketumbar": "ketumbar",
            "tumbar": "ketumbar", "merica": "merica", "lada": "merica", "sahang": "merica", "kemiri": "kemiri",
            "daun salam": "daun salam", "salam": "daun salam", "daun jeruk": "daun jeruk",
            "daun jeruk purut": "daun jeruk", "daun kemangi": "kemangi", "kemangi": "kemangi",
            "nasi": "nasi", "beras": "beras", "mie": "mi", "mi": "mi", "kentang": "kentang",
            "ayam": "ayam", "ayam kampung": "ayam", "daging ayam": "ayam", "daging sapi": "sapi", "sapi": "sapi",
            "telor": "telur", "telur": "telur", "telor ayam": "telur", "telor bebek": "telur", "telur puyuh": "telur",
            "ikan": "ikan", "salmon": "ikan", "kakap": "ikan", "gurame": "ikan", "lele": "ikan", "mujaer": "ikan",
            "nila": "ikan", "tongkol": "ikan", "tuna": "ikan", "teri": "ikan", "udang": "udang", "cumi": "cumi",
            "cumi-cumi": "cumi",
            "tahoo": "tahu", "tah": "tahu", "tahu": "tahu", "tempeh": "tempe", "temp": "tempe", "tempe": "tempe",
            "tomate": "tomat", "tomatte": "tomat", "tomat": "tomat", "timun": "mentimun", "mentimun": "mentimun",
            "kangkung": "kangkung", "bayam": "bayam", "sawi": "sawi", "kol": "kubis", "kubis": "kubis",
            "tauge": "taoge", "toge": "taoge", "taoge": "taoge", "wortel": "wortel", "buncis": "buncis",
            "gule": "gula", "gula": "gula", "gula merah": "gula", "gula pasir": "gula", "gula aren": "gula",
            "gula jawa": "gula", "garem": "garam", "grm": "garam", "garam": "garam", "kecup": "kecap",
            "kecap": "kecap", "kecap manis": "kecap", "kecap asin": "kecap", "santan": "santan", "santen": "santan",
            "terasi": "terasi", "trasi": "terasi", "minyak": "minyak", "minyak goreng": "minyak", "minyak sayur": "minyak",
            "penyedap": "penyedap", "penyedap rasa": "penyedap", "kaldu": "penyedap", "kaldu bubuk": "penyedap",
            "kaldu jamur": "penyedap", "micin": "penyedap", "msg": "penyedap", "royco": "penyedap",
            "masako": "penyedap", "lemon": "jeruk nipis", "jeruk nipis": "jeruk nipis", "jeruk limau": "jeruk limau",
            "cuka": "cuka", "air": "air"
        }

        self.DAFTAR_BAHAN = list(self.df_bahan['nama_bahan'].str.lower().str.strip().unique())

        df_bahan_normalized = self.df_bahan.copy()
        df_bahan_normalized['bahan_normal'] = df_bahan_normalized['nama_bahan'].str.lower().str.strip()
        df_bahan_normalized['bahan_normal'] = df_bahan_normalized['bahan_normal'].apply(lambda x: self.NORMALISASI_MANUAL.get(x, x))
        self.df_bahan_normalized = df_bahan_normalized
        
    def _preprocessing(self, kata):
        kata = kata.lower().strip()
        kata = kata.replace("v", "c").replace("f", "p").replace("q", "k").replace("x", "s")
        kata = re.sub(r'(.)\1+', r'\1', kata)
        return kata

    @lru_cache(maxsize=1000)
    def _normalisasi_bahan(self, input_user):
        kata = self._preprocessing(input_user)
        if kata in self.NORMALISASI_MANUAL:
            return self.NORMALISASI_MANUAL[kata]
        hasil, skor, _ = process.extractOne(kata, self.DAFTAR_BAHAN, scorer=fuzz.ratio)
        return hasil if skor >= 70 else kata

    def rekomendasi(self, input_user, threshold=0.3):
        bahan_input = re.split(r'[\s,]+', input_user.strip().lower())
        bahan_input = [b for b in bahan_input if b]
        bahan_normal = [self._normalisasi_bahan(b) for b in bahan_input]
        total_bahan_input = len(bahan_normal)
        
        if total_bahan_input == 0:
            return {"bahan_input": [], "bahan_normal": [], "rekomendasi": []}

        cocok_df = self.df_bahan_normalized[
            self.df_bahan_normalized['bahan_normal'].isin(bahan_normal)
        ]
        resep_skor = cocok_df.groupby('id_resep').agg(
            jumlah_bahan_cocok=('id_resep', 'count')
        )
        resep_skor['skor'] = resep_skor['jumlah_bahan_cocok'] / total_bahan_input
        resep_skor_final = resep_skor[resep_skor['skor'] >= threshold]

        hasil_df = self.df_master.join(resep_skor_final, how='inner')
        hasil_df = hasil_df.sort_values(by='skor', ascending=False)

        hasil_list = []
        for id_resep, row in hasil_df.head(10).iterrows():
            hasil_list.append({
                "id_resep": id_resep,
                "nama_resep": row["nama_resep"],
                "durasi": row["durasi"],
                "porsi": row["porsi"],
                "kecocokan": round(row["skor"] * 100, 1),
                "jumlah_bahan_cocok": row["jumlah_bahan_cocok"],
                "total_bahan_input": total_bahan_input,
                "langkah": row["langkah"]
            })

        return {
            "bahan_input": bahan_input,
            "bahan_normal": bahan_normal,
            "rekomendasi": hasil_list
        }

# ==========================================
# 2. CUSTOM UNPICKLER (SOLUSI PAMUNGKAS)
# ==========================================
# Ini adalah "Jembatan" yang memaksa pickle menggunakan class di atas
class CustomUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        # Jika pickle mencari "ResepRekomendasiModel" di modul mana saja,
        # paksa dia menggunakan class yang kita definisikan di file ini.
        if name == 'ResepRekomendasiModel':
            return ResepRekomendasiModel
        return super().find_class(module, name)

# ==========================================
# 3. KONFIGURASI API
# ==========================================
app = FastAPI(
    title="API Rekomendasi Resep",
    description="API sederhana untuk rekomendasi resep berdasarkan bahan makanan."
)

# ==========================================
# 4. LOAD MODEL MENGGUNAKAN CUSTOM UNPICKLER
# ==========================================
MODEL_FILE = "rekomendasi_model.pkl"
model = None

try:
    with open(MODEL_FILE, "rb") as f:
        # GUNAKAN CustomUnpickler DI SINI
        model = CustomUnpickler(f).load()
        
    print(f"✅ Berhasil memuat model dari {MODEL_FILE}")
except FileNotFoundError:
    print(f"❌ ERROR: File {MODEL_FILE} tidak ditemukan!")
except Exception as e:
    print(f"❌ ERROR: Gagal memuat model. Detail: {e}")


# ==========================================
# 5. ENDPOINTS
# ==========================================
@app.get("/")
def home():
    return {"status": "online", "pesan": "Server Siap!"}

@app.get("/rekomendasi/")
def get_rekomendasi(bahan: str):
    if model is None:
        return {"error": "Model belum dimuat. Cek log server."}
    
    if not bahan:
        return {"error": "Mohon masukkan bahan makanan."}

    try:
        hasil = model.rekomendasi(bahan)
        return {"status": "sukses", "data": hasil}
    except Exception as e:
        return {"error": f"Error: {str(e)}"}