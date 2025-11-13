import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

// Inisialisasi koneksi ke Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

/**
 * Controller untuk menampilkan detail resep berdasarkan ID
 */
export const getDetailResep = async (req, res) => {
  try {
    const { id } = req.params; // ambil ID dari URL parameter

    if (!id) {
      return res.status(400).json({ error: "ID resep tidak ditemukan" });
    }

    // Query ke tabel resep
    const { data, error } = await supabase
      .from("resep")
      .select("id, nama_resep, gambar, porsi, durasi, bahan, langkah")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: "Resep tidak ditemukan" });
    }

    res.status(200).json({
      success: true,
      message: "Detail resep berhasil diambil",
      data,
    });
  } catch (err) {
    console.error("Error getDetailResep:", err.message);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan saat mengambil detail resep",
      details: err.message,
    });
  }
};
