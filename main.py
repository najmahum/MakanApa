import pickle
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

# Deskripsi untuk model input (jika diperlukan, tapi kita pakai query)
class BahanInput(BaseModel):
    bahan: str

# Inisialisasi aplikasi FastAPI
app = FastAPI(
    title="API Rekomendasi Resep",
    description="API untuk merekomendasikan resep masakan berdasarkan bahan."
)

# Muat model .pkl saat aplikasi pertama kali dijalankan
try:
    with open("rekomendasi_model.pkl", "rb") as f:
        model = pickle.load(f)
    print("Model berhasil dimuat.")
except FileNotFoundError:
    print("Error: File rekomendasi_model.pkl tidak ditemukan.")
    model = None
except Exception as e:
    print(f"Error saat memuat model: {e}")
    model = None


@app.get("/")
def read_root():
    return {"status": "Selamat datang di API Rekomendasi Resep!"}


@app.get("/rekomendasi/")
def get_rekomendasi(bahan: str):
    """
    Endpoint untuk mendapatkan rekomendasi resep.
    
    Contoh penggunaan:
    /rekomendasi/?bahan=nasi,ayam,telur
    """
    if model is None:
        return {"error": "Model tidak berhasil dimuat."}
    
    if not bahan:
        return {"error": "Parameter 'bahan' tidak boleh kosong."}

    # Panggil fungsi .rekomendasi() dari model kita
    try:
        hasil = model.rekomendasi(bahan)
        return hasil
    except Exception as e:
        return {"error": f"Terjadi kesalahan saat memproses: {e}"}

# Perintah ini untuk menjalankan server jika file ini dieksekusi langsung
# (Render tidak akan menggunakan ini, tapi bagus untuk tes lokal)
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)