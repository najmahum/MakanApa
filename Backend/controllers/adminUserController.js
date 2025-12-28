import supabase from '../config/db.js'

// 1. Statistik User (Header Dashboard User)
export const getUserStats = async (req, res) => {
    try {
        // Hitung Total User (Role: User)
        const { count: totalUser, error: errTotal } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'user');

        if (errTotal) throw errTotal;

        // Hitung User Baru Hari Ini
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set ke jam 00:00 hari ini
        
        const { count: newUserToday, error: errNew } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'user')
            .gte('created_at', today.toISOString());

        if (errNew) throw errNew;

        res.status(200).json({
            total_users: totalUser,
            new_users_today: newUserToday
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Get All Users (Dengan Filter Status)
export const getAllUsers = async (req, res) => {
    try {
        const { status } = req.query; // 'active' atau 'blocked'
        
        let query = supabase
            .from('users')
            .select('id_user, username, email, role, status, created_at')
            .eq('role', 'user'); // ✅ DIPERBAIKI: Ambil user dengan role 'user', bukan 'admin'

        // Jika ada filter status (misal user klik tombol filter)
        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        // Urutkan berdasarkan created_at terbaru
        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) throw error;

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Blokir / Unblokir User (Toggle Status)
export const updateUserStatus = async (req, res) => {
    try {
        const { id_user } = req.params;
        const { status } = req.body; // Mengirim { "status": "blocked" } atau "active"

        // Validasi status
        if (!['active', 'blocked'].includes(status)) {
            return res.status(400).json({ error: "Status harus 'active' atau 'blocked'" });
        }

        const { data, error } = await supabase
            .from('users')
            .update({ status: status })
            .eq('id_user', id_user)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "User tidak ditemukan" });
        }

        res.status(200).json({ 
            message: `User berhasil diubah menjadi ${status}`, 
            data: data[0] 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};