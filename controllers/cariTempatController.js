import fetch from "node-fetch";

export const cariTempatMakan = async (req, res) => {
  const { query, lat, lng, radius = 3000, minPrice, maxPrice, minRating } = req.query;

  if (!query || !lat || !lng) {
    return res.status(400).json({ message: "query, lat, dan lng wajib diisi" });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const gmapsUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    query
  )}&location=${lat},${lng}&radius=${radius}&type=restaurant&key=${apiKey}`;

  try {
    const response = await fetch(gmapsUrl);
    const data = await response.json();

    if (data.status !== "OK") {
      return res.status(500).json({ message: "Gagal mengambil data dari Google API", error: data.status });
    }

    // Filter hasil berdasar harga & rating kalau ada
    let results = data.results;
    if (minPrice) results = results.filter(r => r.price_level >= parseInt(minPrice));
    if (maxPrice) results = results.filter(r => r.price_level <= parseInt(maxPrice));
    if (minRating) results = results.filter(r => r.rating >= parseFloat(minRating));

    // Format hasil
    const places = results.map(r => ({
      nama: r.name,
      alamat: r.formatted_address,
      rating: r.rating || "N/A",
      harga: r.price_level || 0,
      foto: r.photos
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${r.photos[0].photo_reference}&key=${apiKey}`
        : null,
      maps_url: `https://www.google.com/maps/place/?q=place_id:${r.place_id}`,
    }));

    res.status(200).json({
      total_ditemukan: places.length,
      hasil: places,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};
