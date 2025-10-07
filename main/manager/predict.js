// /manager/predict.js
// input: dataArr = [{ item: 'nama', sales: [{ date: 'YYYY-MM-DD' or Timestamp, quantity: Number }, ...] }, ...]
// output: number (prediksi, dibulatkan ke atas)

export function predictNeed(dataArr, period = 'daily') {
  if (!Array.isArray(dataArr) || dataArr.length === 0) return 0;

  // kumpulkan total per tanggal (sum untuk semua item dalam dataArr)
  const dateSums = {}; // { '2025-10-06': 6, '2025-10-05': 3, ... }

  dataArr.forEach(d => {
    if (!Array.isArray(d.sales)) return;
    d.sales.forEach(s => {
      // normalisasi tanggal ke 'YYYY-MM-DD'
      let dateStr;
      if (typeof s.date === 'string') {
        dateStr = s.date;
      } else if (s.date && typeof s.date.toDate === 'function') {
        // Firestore Timestamp
        dateStr = s.date.toDate().toISOString().split('T')[0];
      } else {
        // fallback: buat Date dari value (number / Date / string)
        dateStr = new Date(s.date).toISOString().split('T')[0];
      }

      const qty = Number(s.quantity) || 0;
      dateSums[dateStr] = (dateSums[dateStr] || 0) + qty;
    });
  });

  const todayStr = new Date().toISOString().split('T')[0];
  let totalToday = dateSums[todayStr] || 0;

  // kalau hari ini tidak ada, ambil tanggal terbaru yang ada
  if (totalToday === 0) {
    const dates = Object.keys(dateSums);
    if (dates.length > 0) {
      dates.sort((a, b) => new Date(b) - new Date(a)); // urut desc
      totalToday = dateSums[dates[0]];
    }
  }

  const multipliers = {
    daily: 1,
    weekly: 7,
    monthly: 30,
    yearly: 365
  };
  const multiplier = multipliers[period] || 1;

  return Math.ceil(totalToday * multiplier);
}
