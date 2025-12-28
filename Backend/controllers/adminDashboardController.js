import supabase from '../config/db.js'

export const getVisitorStats = async (req, res) => {
    try {
        const { period } = req.query; // 'last_week', 'last_month', 'last_3_days'
        
        let startDate = new Date();
        
        // Logika Slicer Waktu
        if (period === 'last_3_days') {
            startDate.setDate(startDate.getDate() - 3);
        } else if (period === 'last_week') {
            startDate.setDate(startDate.getDate() - 7);
        } else if (period === 'last_month') {
            startDate.setDate(startDate.getDate() - 30);
        } else {
            // Default 7 hari kalau tidak ada param
            startDate.setDate(startDate.getDate() - 7);
        }

        // Query ke log_activity
        // Asumsi: aksi 'login' atau 'visit' dianggap sebagai kunjungan
        const { data, error } = await supabase
            .from('log_activity')
            .select('timestamp, id_user')
            .gte('timestamp', startDate.toISOString())
            .in('aksi', ['login', 'visit']); // Sesuaikan string aksinya dengan datamu

        if (error) throw error;

        // OLAH DATA (Data Pre-processing) untuk Chart
        // Kita ubah raw data menjadi format: { "2025-11-20": 5, "2025-11-21": 10 }
        const stats = {};
        
        data.forEach(log => {
            // Ambil tanggalnya saja (YYYY-MM-DD), buang jam menit
            const dateKey = new Date(log.timestamp).toISOString().split('T')[0];
            stats[dateKey] = (stats[dateKey] || 0) + 1;
        });

        // Ubah jadi array biar enak dibaca Recharts/Chart.js
        const chartData = Object.keys(stats).map(date => ({
            date: date,
            visitors: stats[date]
        })).sort((a, b) => new Date(a.date) - new Date(b.date));

        res.status(200).json({
            message: "Data statistik berhasil diambil",
            period: period || 'last_week',
            total_visits: data.length,
            chart_data: chartData
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};