import supabase from '../config/db.js'

// MENAMBAHKAN FAVORIT
export const tambahFavorit = async (req, res) => {
  try {
    const { id_resep } = req.body
    const id_user = req.user.id_user // Ambil dari Token (authMiddleware)

    if (!id_resep) {
      return res.status(400).json({ message: "ID Resep wajib diisi" })
    }

    // 1. Cek apakah sudah pernah difavoritkan (Mencegah duplikat)
    const { data: existingFav } = await supabase
      .from('favorit')
      .select('id_fav')
      .eq('id_user', id_user)
      .eq('id_resep', id_resep)
      .single()

    if (existingFav) {
      return res.status(400).json({ message: "Resep sudah ada di favorit" })
    }

    // 2. Insert ke tabel favorit
    const { data, error } = await supabase
      .from('favorit')
      .insert([{ id_user, id_resep }])
      .select()

    if (error) throw error

    return res.status(201).json({
      success: true,
      message: "Berhasil menambahkan ke favorit",
      data: data[0]
    })

  } catch (err) {
    console.error("Error tambahFavorit:", err.message)
    return res.status(500).json({ message: err.message })
  }
}

// MENGHAPUS FAVORIT
export const hapusFavorit = async (req, res) => {
  try {
    const { id_resep } = req.params // Kita hapus berdasarkan ID Resep di URL
    const id_user = req.user.id_user

    if (!id_resep) {
      return res.status(400).json({ message: "ID Resep diperlukan" })
    }

    const { error } = await supabase
      .from('favorit')
      .delete()
      .eq('id_user', id_user)
      .eq('id_resep', id_resep)

    if (error) throw error

    return res.status(200).json({
      success: true,
      message: "Resep dihapus dari favorit"
    })

  } catch (err) {
    console.error("Error hapusFavorit:", err.message)
    return res.status(500).json({ message: err.message })
  }
}

// MELIHAT DAFTAR FAVORIT USER
export const getFavoritUser = async (req, res) => {
  try {
    const id_user = req.user.id_user

    // Kita ambil data favorit dan JOIN dengan tabel 'resep' untuk dapat detailnya
    // Syntax: resep(*) artinya ambil semua kolom dari tabel resep yang berelasi
    const { data, error } = await supabase
      .from('favorit')
      .select(`
        id_fav,
        id_resep,
        resep:id_resep (
          id_resep,
          nama_resep,
          gambar,
          durasi,
          porsi,
          deskripsi
        )
      `)
      .eq('id_user', id_user)

    if (error) throw error

    return res.status(200).json({
      success: true,
      message: "Daftar favorit berhasil diambil",
      total: data.length,
      data: data
    })

  } catch (err) {
    console.error("Error getFavoritUser:", err.message)
    return res.status(500).json({ message: err.message })
  }
}