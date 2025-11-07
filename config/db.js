// db.js
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

// Ambil dari file .env
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    db: { schema: 'makan_apa' } // sesuaikan schema kamu di Supabase
  }
)

export default supabase
