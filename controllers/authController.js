import supabase from '../config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { email, password, username, role = 'user', status = 'active' } = req.body

    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, username, dan password wajib diisi' })
    }

    // Cek username duplikat (karena UNIQUE)
    const { data: existingUser } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single()

    if (existingUser) {
      return res.status(400).json({ error: 'Username sudah terdaftar' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert data baru (tanpa id_user karena SERIAL)
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email,
        username,
        password: hashedPassword,
        role,
        status
      }])
      .select()

    if (error) throw error

    const user = data[0]

    res.status(201).json({
      message: "Registrasi berhasil!",
      user: {
        id_user: user.id_user,
        email: user.email,
        username: user.username
      }
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}



// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi' })
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return res.status(401).json({ error: 'Email tidak ditemukan' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ error: 'Password salah' })
    }

    // BUAT JWT
    const token = jwt.sign(
      { id_user: user.id_user, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(200).json({
      message: "Login berhasil!",
      token,
      user
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}



// LOGOUT
export const logoutUser = async (req, res) => {
  return res.status(200).json({ message: "Logout berhasil (hapus token di client)" })
}
