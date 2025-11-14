// controllers/tambahResepController.js
import supabase from '../config/db.js'
import { createLog } from '../services/logService.js'

export const tambahResep = async (req, res) => {
  try {
    const { nama_resep, deskripsi, bahan, langkah, porsi, durasi, gambar } = req.body

    // 🔒 Validasi input
    if (!nama_resep || !deskripsi || !bahan || !langkah || !porsi || !durasi || !gambar) {
      return res.status(400).json({ message: "Semua field wajib diisi" })
    }

    const userId = req.user.id_user  // 🔥 AMBIL dari JWT (udah bener)

    // 🟩 Insert mirip REGISTER USER → pakai array []
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

    // 🟢 Response rapi
    return res.status(201).json({
      message: "Resep berhasil ditambahkan",
      resep: {
        id_resep: resep.id_resep,
        nama_resep: resep.nama_resep,
        deskripsi: resep.deskripsi,
        bahan: resep.bahan,
        langkah: resep.langkah,
        porsi: resep.porsi,
        durasi: resep.durasi,
        gambar: resep.gambar,
        created_by: resep.created_by,
        tanggal_dibuat: resep.tanggal_dibuat
      }
    })

  } catch (err) {
    console.error("❌ ERROR TAMBAH RESEP:", err)
    return res.status(500).json({ message: err.message })
  }
}
