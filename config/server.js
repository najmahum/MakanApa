import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import supabase from './db.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  const { data, error } = await supabase.from('resep').select('*').limit(3)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: '✅ Terhubung ke Supabase!', data })
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT || 3000}`)
})
