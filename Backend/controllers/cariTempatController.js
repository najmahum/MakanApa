// controllers/cariTempatController.js
import dotenv from 'dotenv';
dotenv.config();

function hitungJarak(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1)); 
}

function mapPriceLevelToRupiahRange(level) {
     switch (level) {
        case 0: return { min: 0, max: 15000 };
        case 1: return { min: 10000, max: 40000 };
        case 2: return { min: 30000, max: 80000 };
        case 3: return { min: 70000, max: 200000 };
        case 4: return { min: 150000, max: 500000 };
        default: return { min: 15000, max: 50000 }; 
    }
}

export const cariTempatMakan = async (req, res) => {
    try {
        const { query, lat, lng, jarak, priceCategory, minRating } = req.query; 
        
        if (!lat || !lng) {
            return res.status(400).json({ message: "Lokasi (lat, lng) wajib diisi!" });
        }

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        // Reverse geocoding
        const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();
        const userAddress = geoData.status === "OK" ? geoData.results[0].formatted_address : "Lokasi Tidak Diketahui";
        
        const searchRadius = 5000; 
        const keyword = query || "Rumah Makan"; 
        const gmapsUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(keyword)}&location=${lat},${lng}&radius=${searchRadius}&type=restaurant&key=${apiKey}`;

        const response = await fetch(gmapsUrl);
        const data = await response.json();

        if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
            throw new Error(`Google API Error: ${data.status}`);
        }

        let places = (data.results || []).map(r => {
            const distanceKm = hitungJarak(
                parseFloat(lat), parseFloat(lng), 
                r.geometry.location.lat, r.geometry.location.lng
            );

            const priceRange = mapPriceLevelToRupiahRange(r.price_level); 

            // 🔥 PASTIKAN lat/lng SELALU ADA DI RESPONSE
            const restaurantData = {
                id: r.place_id,
                place_id: r.place_id, 
                name: r.name,
                address: r.formatted_address,
                specialty: "Aneka Makanan", 
                rating: r.rating || 0,
                distance: distanceKm, 
                priceRange: priceRange,
                price_level: r.price_level || 0, 
                image: r.photos 
                    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${r.photos[0].photo_reference}&key=${apiKey}`
                    : "https://via.placeholder.com/400x300?text=No+Image",
                types: r.types || [],
                menu: [{ name: "Menu Rekomendasi 1", price: priceRange.min }],
                // 🔥 CRITICAL: Pastikan lat/lng ada
                lat: r.geometry.location.lat,     
                lng: r.geometry.location.lng
            };

            // Debug log
            console.log(`✅ ${r.name}: lat=${restaurantData.lat}, lng=${restaurantData.lng}`);
            
            return restaurantData;
        });

        // Filter berdasarkan jarak
        if (jarak) {
            if (jarak === "1") places = places.filter(p => p.distance < 1);
            else if (jarak === "2") places = places.filter(p => p.distance >= 1 && p.distance <= 3);
            else if (jarak === "3") places = places.filter(p => p.distance > 3);
        }

        if (minRating) {
            places = places.filter(p => p.rating >= parseFloat(minRating));
        }

        if (priceCategory) {
            const category = parseInt(priceCategory);
            places = places.filter(p => {
                const level = p.price_level;
                if (category === 1) return level <= 1; 
                else if (category === 2) return level === 2; 
                else if (category === 3) return level >= 3; 
                return true; 
            });
        }

        places.sort((a, b) => a.distance - b.distance);

        console.log(`📍 Total restoran: ${places.length}`);

        res.status(200).json({
            message: "Berhasil mengambil data",
            total: places.length,
            user_address: userAddress,
            data: places 
        });

    } catch (err) {
        console.error("❌ Kesalahan di cariTempatMakan:", err);
        res.status(500).json({ 
            message: "Terjadi kesalahan server saat memproses data", 
            error: err.message 
        });
    }
};

// Endpoint detail
export const getDetailTempatMakan = async (req, res) => {
    try {
        const { place_id } = req.query;

        if (!place_id) {
            return res.status(400).json({ message: "place_id wajib diisi!" });
        }

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,formatted_address,geometry,rating,photos,price_level,types&key=${apiKey}`;

        const response = await fetch(detailUrl);
        const data = await response.json();

        if (data.status !== "OK") {
            throw new Error(`Google API Error: ${data.status}`);
        }

        const place = data.result;
        const priceRange = mapPriceLevelToRupiahRange(place.price_level);

        const detailData = {
            id: place_id,
            place_id: place_id,
            name: place.name,
            address: place.formatted_address,
            specialty: "Aneka Makanan",
            rating: place.rating || 0,
            priceRange: priceRange,
            price_level: place.price_level || 0,
            image: place.photos 
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
                : "https://via.placeholder.com/800x600?text=No+Image",
            types: place.types || [],
            // 🔥 CRITICAL: lat/lng harus ada
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng
        };

        console.log(`✅ Detail ${place.name}: lat=${detailData.lat}, lng=${detailData.lng}`);

        res.status(200).json({
            message: "Berhasil mengambil detail",
            data: detailData
        });

    } catch (err) {
        console.error("❌ Kesalahan di getDetailTempatMakan:", err);
        res.status(500).json({ 
            message: "Terjadi kesalahan server saat memproses detail", 
            error: err.message 
        });
    }
};