// services/logService.js
import supabase from '../config/db.js'

export const createLog = async (id_user, aksi, status) => {
  const { error } = await supabase
    .from("log_activity")
    .insert([
      {
        id_user,
        aksi,
        status,
        timestamp: new Date()
      }
    ])

  if (error) {
    console.error("Gagal menyimpan log:", error)
    return false
  }

  return true
}