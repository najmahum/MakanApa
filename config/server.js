import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import supabase from './db.js'
import authRoutes from '../routes/authRoutes.js'
import tempatMakanRoutes from "../routes/cariTempatRoutes.js"
import cariResepRoutes from '../routes/cariResepRoutes.js'
import detailResepRoutes from '../routes/resepDetailRoutes.js'
import tambahResepRoutes from '../routes/tambahResepRoutes.js'
import activityLogRoutes from "../routes/activityLogRoutes.js"
import favoritRoutes from '../routes/favoritRoutes.js'
import adminDashboardRoutes from '../routes/adminDashboardRoutes.js'
import adminUserRoutes from '../routes/adminUserRoutes.js'
import adminResepRoutes from '../routes/adminResepRoutes.js'
import profile from '../routes/profileRoutes.js';
dotenv.config()

const app = express()
app.use(cors({
  origin: process.env.REACT_APP_FRONTEND_URL 
}))
app.use(express.json())

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: "JSON tidak valid! Periksa format body request." })
  }
  next()
})

// 🧭 route utama buat cek koneksi ke Supabase
app.get('/', async (req, res) => {
  const { data, error } = await supabase.from('resep').select('*').limit(3)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: '✅ Terhubung ke Supabase!', data })
})

// 🛠️ taruh semua route di atas sebelum listen()
app.use('/api/auth', authRoutes)
app.use("/api/tempatmakan", tempatMakanRoutes)
app.use('/api/resep', cariResepRoutes)
app.use("/api/resepDetail", detailResepRoutes)
app.use('/api/resep', tambahResepRoutes)
app.use("/api/logs", activityLogRoutes)
app.use('/api/favorit', favoritRoutes)
app.use('/api/admin/dashboard', adminDashboardRoutes) 
app.use('/api/admin/users', adminUserRoutes)          
app.use('/api/admin/recipes', adminResepRoutes)
app.use('/api/profile', profile);

// 🚀 jalankan server di bawah
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));