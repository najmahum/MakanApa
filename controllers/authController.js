import supabase from '../config/db.js'
import bcrypt from 'bcrypt'

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { email, password, username, role = 'user', status = 'active' } = req.body

    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, username, dan password wajib diisi' })
    }

    // Hash password agar aman
    const hashedPassword = await bcrypt.hash(password, 10)

    // 1️⃣ Buat user di Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    // 2️⃣ Simpan user ke tabel USER
    const { error: insertError } = await supabase
      .from('USER')
      .insert([
        {
          id_user: authData.user.id,
          email,
          username,
          password: hashedPassword,
          role,
          status,
          tanggal_dibuat: new Date().toISOString(),
        },
      ])

    if (insertError) throw insertError

    res.status(201).json({
      message: '✅ Registrasi berhasil!',
      user: { id: authData.user.id, email, username, role },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi' })
    }

    // 1️⃣ Login via Supabase Auth
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) throw loginError

    // 2️⃣ Ambil data user dari tabel USER
    const { data: userData, error: userError } = await supabase
      .from('USER')
      .select('*')
      .eq('email', email)
      .single()

    if (userError) throw userError

    res.status(200).json({
      message: '✅ Login berhasil!',
      token: loginData.session.access_token,
      user: userData,
    })
  } catch (err) {
    res.status(401).json({ error: err.message })
  }
}

// LOGOUT USER
export const logoutUser = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    res.status(200).json({ message: '👋 Logout berhasil!' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
