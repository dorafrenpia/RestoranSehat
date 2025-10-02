// /manager/predict.js
// dataArr = array berisi dokumen penjualan {item, sales: [{date, quantity}]}

export function predictNeed(dataArr, period = 'daily') {
  if (!Array.isArray(dataArr) || dataArr.length === 0) return 0;

  let totalToday = 0;
  const todayStr = new Date().toISOString().split('T')[0];

  dataArr.forEach(d => {
    if (Array.isArray(d.sales)) {
      // cari penjualan hari ini
      d.sales.forEach(s => {
        if (s.date === todayStr) {
          totalToday += s.quantity;
        }
      });
    }
  });

  // default totalToday 0 jika hari ini tidak ada penjualan
  if (totalToday === 0) {
    // ambil penjualan terakhir jika hari ini belum ada
    dataArr.forEach(d => {
      if (Array.isArray(d.sales) && d.sales.length > 0) {
        const lastSale = d.sales[d.sales.length - 1];
        totalToday += lastSale.quantity;
      }
    });
  }

  let multiplier = 1;
  switch (period) {
    case 'daily': multiplier = 1; break;
    case 'weekly': multiplier = 7; break;
    case 'monthly': multiplier = 30; break;
    case 'yearly': multiplier = 365; break;
  }

  return Math.ceil(totalToday * multiplier);
}
