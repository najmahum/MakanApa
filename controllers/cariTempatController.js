// controllers/cariTempatController.js
import dotenv from 'dotenv';
dotenv.config();

// Helper: Rumus Haversine untuk hitung jarak (km) antara dua koordinat
function hitungJarak(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius bumi dalam km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1)); // Return 1 angka di belakang koma (misal 1.2)
}

// Helper: Estimasi harga Rupiah dari Price Level Google (0-4)
function estimasiHarga(level) {
    switch (level) {
        case 0: return { min: 0, max: 10000 };        // Gratis/Sangat Murah
        case 1: return { min: 10000, max: 40000 };    // Murah
        case 2: return { min: 40000, max: 100000 };   // Sedang
        case 3: return { min: 100000, max: 250000 };  // Mahal
        case 4: return { min: 250000, max: 500000 };  // Sultan
        default: return { min: 15000, max: 50000 };   // Default kalau Google ga kasih info
    }
}

export const cariTempatMakan = async (req, res) => {
  try {
    // 1. Ambil parameter dari Frontend
    // query: kata kunci (misal "Nasi Goreng")
    // lat, lng: lokasi user
    // jarak: filter ("1", "2", "3")
    // harga, rating: filter tambahan
    const { query, lat, lng, jarak, minPrice, maxPrice, minRating } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Lokasi (lat, lng) wajib diisi!" });
    }

    const keyword = query || "Rumah Makan"; // Default keyword kalau kosong
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    // Tentukan radius pencarian awal (sedikit dilebihkan biar dapet banyak opsi)
    const searchRadius = 5000; // 5 km default

    // 2. Panggil Google Maps API (Text Search)
    const gmapsUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(keyword)}&location=${lat},${lng}&radius=${searchRadius}&type=restaurant&key=${apiKey}`;

    const response = await fetch(gmapsUrl);
    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new Error(`Google API Error: ${data.status}`);
    }

    // 3. Transformasi & Filter Data biar cocok sama Frontend
    let places = (data.results || []).map(r => {
        // Hitung jarak real
        const distanceKm = hitungJarak(
            parseFloat(lat), parseFloat(lng), 
            r.geometry.location.lat, r.geometry.location.lng
        );

        // Mapping Harga Google ke Rupiah
        const priceRange = estimasiHarga(r.price_level);

        return {
            id: r.place_id, // Frontend butuh 'id'
            name: r.name,
            address: r.formatted_address,
            specialty: "Aneka Makanan", // Google ga kasih ini, kita default aja
            rating: r.rating || 0,
            distance: distanceKm,
            priceRange: priceRange,
            price_level: r.price_level, // simpan data aslinya jg
            image: r.photos 
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${r.photos[0].photo_reference}&key=${apiKey}`
                : "https://via.placeholder.com/400x300?text=No+Image", // Gambar default
            // Buat menu dummy karena Google API Standard ga ngasih menu
            menu: [
                { name: "Menu Rekomendasi 1", price: priceRange.min },
                { name: "Menu Rekomendasi 2", price: priceRange.max }
            ]
        };
    });

    // 4. Terapkan Filter Tambahan dari Frontend

    // Filter Jarak
    if (jarak) {
        if (jarak === "1") places = places.filter(p => p.distance < 1);
        else if (jarak === "2") places = places.filter(p => p.distance >= 1 && p.distance <= 3);
        else if (jarak === "3") places = places.filter(p => p.distance > 3);
    }

    // Filter Rating
    if (minRating) {
        places = places.filter(p => p.rating >= parseFloat(minRating));
    }

    // Filter Harga (Opsional, kalau user kirim range Rupiah spesifik)
    if (minPrice && maxPrice) {
        // Logika sederhana: Cek apakah range harga restoran beririsan dengan budget user
        places = places.filter(p => p.priceRange.min <= parseInt(maxPrice));
    }

    // Urutkan berdasarkan jarak terdekat secara default
    places.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      message: "Berhasil mengambil data",
      total: places.length,
      data: places // Ini array yang akan dipakai Frontend
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};