import pickle
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel

# --- Konfigurasi Aplikasi ---
app = FastAPI(
    title="API Rekomendasi Resep",
    description="API sederhana untuk rekomendasi resep berdasarkan bahan makanan."
)

# --- Load Model ---
# Kita memuat model yang sudah Anda latih dan download dari Google Colab.
# Pastikan file 'rekomendasi_model.pkl' ada satu folder dengan file ini.
MODEL_FILE = "rekomendasi_model.pkl"
model = None

try:
    with open(MODEL_FILE, "rb") as f:
        model = pickle.load(f)
    print(f"✅ Berhasil memuat model dari {MODEL_FILE}")
except FileNotFoundError:
    print(f"❌ ERROR: File {MODEL_FILE} tidak ditemukan!")
    print("Pastikan Anda sudah meng-upload file .pkl ke repository GitHub Anda.")
except Exception as e:
    print(f"❌ ERROR: Gagal memuat model. Detail: {e}")

# --- Endpoint (Rute API) ---

@app.get("/")
def home():
    """
    Halaman utama untuk mengecek apakah server hidup.
    """
    return {
        "status": "online",
        "pesan": "Server Rekomendasi Resep berjalan! Gunakan endpoint /rekomendasi untuk memulai."
    }

@app.get("/rekomendasi/")
def get_rekomendasi(bahan: str):
    """
    Fungsi utama untuk meminta rekomendasi.
    Contoh pemakaian: /rekomendasi/?bahan=ayam,kecap,bawang
    """
    # 1. Cek apakah model siap
    if model is None:
        return {"error": "Model belum dimuat. Hubungi administrator."}
    
    # 2. Cek input user
    if not bahan or bahan.strip() == "":
        return {"error": "Mohon masukkan bahan makanan. Contoh: ?bahan=nasi,telur"}

    try:
        # 3. Panggil fungsi rekomendasi dari model (logika yang sama dengan di Colab)
        # Fungsi .rekomendasi() ini berasal dari class ResepRekomendasiModel yang ada di dalam .pkl
        hasil = model.rekomendasi(bahan)
        
        return {
            "status": "sukses",
            "data": hasil
        }
    except Exception as e:
        return {"error": f"Terjadi kesalahan saat memproses data: {str(e)}"}

# --- Menjalankan Server (Khusus Localhost) ---
# Kode di bawah ini hanya jalan kalau Anda run di laptop sendiri.
# Render akan menjalankan perintahnya sendiri via Gunicorn.
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)