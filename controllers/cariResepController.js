import fetch from "node-fetch";

export const cariResep = async (req, res) => {
  try {
    const { bahanList } = req.body;
    if (!bahanList || bahanList.length === 0) {
      return res.status(400).json({ error: "Daftar bahan tidak boleh kosong" });
    }

    // URL API ML kamu di Render
    const ML_API_URL = "https://makanapa.onrender.com/rekomendasi/";

        //gantiin body
    const bahanString = bahanList.join(",");
    const params = new URLSearchParams({ bahan: bahanString });
    const finalUrl = `${ML_API_URL}?${params.toString()}`;
    console.log("Membuka URL:", finalUrl);
    
    // Kirim data bahan ke FastAPI di Render
    const response = await fetch(finalUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      //body: JSON.stringify({ bahan: bahanList }),
    });

    //const response = await fetch(
    //  ${ML_API_URL}?bahan=${encodeURIComponent(bahanList.join(","))},
    //  { method: "GET" }
    //);

    // Ambil hasil dari ML API
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gagal memanggil API ML: ${err}`);
    }

    const result = await response.json();

    // Kirim balik ke frontend
    res.status(200).json({
      success: true,
      message: "Rekomendasi resep berhasil diambil",
      data: result.resep || result, // sesuaikan sama struktur FastAPI kamu
    });
  } catch (err) {
    console.error("Error di cariResep:", err.message);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan saat memproses pencarian resep",
      details: err.message,
    });
  }
};
