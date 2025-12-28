// controllers/tambahResepController.js
import supabase from '../config/db.js'
import { createLog } from '../services/logService.js'

// --- FUNGSI 1: TAMBAH RESEP ---
export const tambahResep = async (req, res) => {
  try {
    const { nama_resep, deskripsi, bahan, langkah, porsi, durasi, gambar } = req.body

    // 🔒 Validasi input
    if (!nama_resep || !deskripsi || !bahan || !langkah || !porsi || !durasi || !gambar) {
      return res.status(400).json({ message: "Semua field wajib diisi" })
    }

    const userId = req.user.id_user  // 🔥 AMBIL dari JWT

    // 🟩 Insert Data
    const { data, error } = await supabase
      .from('resep')
      .insert([{
        nama_resep,
        deskripsi,
        bahan,
        langkah,
        porsi,
        durasi,
        gambar,
        created_by: userId
      }])
      .select()

    if (error) throw error

    const resep = data[0]

    // ✍️ Catat log
    await createLog(userId, 'TAMBAH_RESEP', `Menambahkan resep: ${nama_resep}`)

    // 🟢 Response
    return res.status(201).json({
      message: "Resep berhasil ditambahkan",
      resep: {
        id_resep: resep.id_resep,
        nama_resep: resep.nama_resep,
        // ... field lain opsional dikirim balik
      }
    })

  } catch (err) {
    console.error("❌ ERROR TAMBAH RESEP:", err)
    return res.status(500).json({ message: err.message })
  }
}

// --- FUNGSI 2: GET RESEP SAYA (INI YANG BARU) ---
export const getResepSaya = async (req, res) => {
  try {
    const userId = req.user.id_user

    const { data, error } = await supabase
      .from('resep')
      .select('*')
      .eq('created_by', userId)
      .order('tanggal_dibuat', { ascending: false })

    if (error) throw error

    return res.status(200).json({
      success: true,
      data: data
    })

  } catch (err) {
    console.error("❌ ERROR GET RESEP SAYA:", err.message)
    return res.status(500).json({ message: err.message })
  }
}

// --- FUNGSI 3: EDIT RESEP ---
export const editResep = async (req, res) => {
  try {
    const { id } = req.params; // Ambil ID dari URL
    const { nama_resep, deskripsi, bahan, langkah, porsi, durasi, gambar } = req.body;
    const userId = req.user.id_user;

    // 1. Cek Kepemilikan Resep
    const { data: existing, error: fetchError } = await supabase
        .from('resep')
        .select('created_by')
        .eq('id_resep', id)
        .maybeSingle(); // Gunakan maybeSingle() agar tidak throw error jika kosong, atau handle errornya

    // Handle jika resep tidak ditemukan
    if (!existing) {
        return res.status(404).json({ message: "Resep tidak ditemukan" });
    }

    // Handle jika error koneksi/query
    if (fetchError) {
        throw fetchError;
    }

    // Cek apakah user yang login adalah pemiliknya
    if (existing.created_by !== userId) {
        return res.status(403).json({ message: "Anda tidak berhak mengedit resep ini" });
    }

    // 2. Lakukan Update
    const { data, error } = await supabase
      .from('resep')
      .update({
        nama_resep,
        deskripsi,
        bahan,
        langkah,
        porsi,
        durasi,
        gambar
      })
      .eq('id_resep', id)
      .select();

    if (error) throw error;

    await createLog(userId, 'EDIT_RESEP', `Mengedit resep ID: ${id}`);

    return res.status(200).json({
      message: "Resep berhasil diupdate",
      data: data
    });

  } catch (err) {
    console.error("❌ ERROR EDIT:", err);
    return res.status(500).json({ message: err.message });
  }
}