import supabase from '../config/db.js'

// 1. Get List Resep (Ringkasan)
export const getAllResepAdmin = async (req, res) => {
    try {
        const { status } = req.query; // 'waiting', 'approved', 'rejected'

        // Kita perlu JOIN manual kalau di Supabase JS Client sederhana,
        // atau pakai sintaks select relasi:
        // Asumsi: di tabel resep ada foreign key 'id_user' yang nyambung ke public.users
        
        let query = supabase
            .from('resep')
            .select(`
                id_resep, 
                nama_resep, 
                status, 
                created_at,
                users (username) 
            `);
            // Syntax users(username) artinya ambil kolom username dari tabel users yg berelasi

        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        // Urutkan dari yang terbaru (biasanya admin mau liat yg baru masuk)
        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) throw error;

        // Flatten data sedikit biar frontend enak bacanya
        // Dari: { nama_resep: "Soto", users: { username: "Budi" } }
        // Jadi: { nama_resep: "Soto", pembuat: "Budi" }
        const formattedData = data.map(item => ({
            ...item,
            pembuat: item.users ? item.users.username : 'Unknown'
        }));

        res.status(200).json(formattedData);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Get Detail Resep (Full)
export const getResepDetailAdmin = async (req, res) => {
    try {
        const { id_resep } = req.params;

        const { data, error } = await supabase
            .from('resep')
            .select(`
                *,
                users (username, email)
            `)
            .eq('id_resep', id_resep)
            .single();

        if (error) throw error;

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Approval Action (Approve / Reject)
export const updateResepStatus = async (req, res) => {
    try {
        const { id_resep } = req.params;
        const { status } = req.body; // { "status": "approved" } atau "rejected"

        if (!['approved', 'rejected', 'waiting'].includes(status)) {
            return res.status(400).json({ error: "Status tidak valid" });
        }

        const { data, error } = await supabase
            .from('resep')
            .update({ status: status })
            .eq('id_resep', id_resep)
            .select();

        if (error) throw error;

        res.status(200).json({ message: `Resep berhasil diubah statusnya menjadi ${status}`, data });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};