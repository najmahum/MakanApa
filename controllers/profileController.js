import supabase from '../config/db.js'
import bcrypt from 'bcrypt';

// 1. AMBIL DATA PROFILE (GET)
export const getProfile = async (req, res) => {
    try {
        // Asumsi: Middleware auth sudah jalan dan menyimpan data user di req.user
        // Kalau belum ada middleware, sementara kita ambil ID dari params/body (tapi ini tidak aman ya)
        // Disini saya asumsikan kamu kirim id_user lewat query atau params buat tes dulu
        const { id_user } = req.params; 

        const { data: user, error } = await supabase
            .from('users')
            .select('id_user, username, email, role, created_at') // Password JANGAN diambil
            .eq('id_user', id_user)
            .single();

        if (error) throw error;

        if (!user) {
            return res.status(404).json({ error: "User tidak ditemukan" });
        }

        res.status(200).json({
            message: "Data profile berhasil diambil",
            user: {
                id_user: user.id_user,
                username: user.username,
                email: user.email,
                role: user.role,
                // Kita kirim dummy text buat tampilan bintang-bintang di frontend
                password_placeholder: "********" 
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. UPDATE PROFILE (PUT) - Ganti Username, Email, atau Password
export const updateProfile = async (req, res) => {
    try {
        const { id_user } = req.params;
        const { username, email, password } = req.body; // Password ini password BARU (kalau ada)

        // Siapkan objek penampung update
        let updates = {
            username,
            email
        };

        // Logika Khusus Password:
        // Kalau user ngisi kolom password, berarti dia mau ganti password
        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updates.password = hashedPassword; // Simpan yang sudah di-hash
        }

        // Update ke Database
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id_user', id_user)
            .select('id_user, username, email, role'); // Return data terbaru (tanpa password)

        if (error) throw error;

        res.status(200).json({
            message: "Profile berhasil diperbarui!",
            user: data[0]
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};