// file: saveData.js
import { db } from "../../javascript/firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

console.log("🔥 saveData.js loaded");

// Ambil elemen form
const salesForm = document.getElementById("salesForm");
const manualDate = document.getElementById("manualDate");

// === Popup ===
const popupOverlay = document.getElementById("popupOverlay");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const popupCloseBtn = document.getElementById("popupCloseBtn");

function showPopup(title, message, success = true) {
  popupTitle.textContent = title;
  popupMessage.textContent = message;
  popupOverlay.style.display = "flex";
  popupCloseBtn.style.background = success ? "#2ecc71" : "#e74c3c";
}
popupCloseBtn.addEventListener("click", () => {
  popupOverlay.style.display = "none";
});

// === DATA RESEP MENU ===
const recipes = {
  "ayam geprek": { "ayam": 1, "timun": 2, "tomat": 4 },
  "nasi goreng": {
    "kecap abc": 5,
    "saus sambal abc": 5,
    "daun bawang": 1,
    "bawang putih": 1,
    "timun": 2,
    "tomat": 4,
    "sayur kol": 1
  },
  "ikan patin": { "ikan patin": 1, "bawang merah": 1, "bawang putih": 1 },
  "ubi goreng": { "ubi": 30, "tepung": 30 },
  "pisang goreng": { "pisang": 30, "tepung": 30 },
  "tahu goreng": { "tahu": 30, "tepung": 30 },
  "tempe goreng": { "tempe": 30, "tepung": 30 },
  "mie goreng": {
    "mie": 1,
    "minyak": 10,
    "bawang putih": 1,
    "sayur kol": 1,
    "daun bawang": 1
  },
  "ifumie": { "mie": 1, "minyak": 10, "bawang putih": 1, "sayur kol": 1 }
};

// === Ambil stok gudang ===
async function getStockData() {
  const snap = await getDocs(collection(db, "stockgudang"));
  const stock = {};
  snap.forEach(docSnap => {
    const data = docSnap.data();
    stock[data.namaBarang.toLowerCase()] = {
      id: docSnap.id,
      jumlah: data.jumlahBarang
    };
  });
  return stock;
}

// === Cetak PDF ===
function printPDF(orders, date) {
  const w = window.open("", "_blank");
  if (!w) {
    alert("Popup diblokir. Izinkan pop-up untuk mencetak struk.");
    return;
  }
  w.document.write(`<h1>Struk Penjualan</h1>
  <p>Tanggal: ${date}</p>
  <ul>
    ${orders.map(o => `<li>${o.quantity} x ${o.menu}</li>`).join("")}
  </ul>`);
  w.document.close();
  w.print();
}

// === Submit Form ===
salesForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const orders = [];
  document.querySelectorAll(".menu-item").forEach(item => {
    const menu = item.querySelector(".itemName").value.trim().toLowerCase();
    const quantity = parseInt(item.querySelector(".quantity").value);
    if (menu && quantity > 0) {
      orders.push({ menu, quantity });
    }
  });

  if (orders.length === 0) {
    showPopup("⚠️ Tidak Ada Pesanan", "Kamu belum memilih menu apa pun.", false);
    return;
  }

  const dateOption = document.querySelector('input[name="dateOption"]:checked').value;
  const date = dateOption === "today"
    ? new Date().toISOString().split("T")[0]
    : manualDate.value;

  try {
    const stock = await getStockData();

    // === Validasi stok setiap menu ===
    for (const order of orders) {
      const recipe = recipes[order.menu];
      if (!recipe) {
        showPopup("❌ Resep Tidak Ditemukan", `Menu "${order.menu}" belum terdaftar di sistem.`, false);
        return;
      }

      for (const [bahan, rasio] of Object.entries(recipe)) {
        const stokBahan = stock[bahan]?.jumlah || 0;
        const butuh = Math.ceil(order.quantity / rasio);

        if (stokBahan < butuh) {
          showPopup("❌ Stok Tidak Cukup",
            `Stok "${bahan}" hanya ${stokBahan}, tapi butuh ${butuh} untuk menu "${order.menu}".`,
            false);
          return;
        }
      }
    }

    // === Kurangi stok di database ===
    for (const order of orders) {
      const recipe = recipes[order.menu];
      for (const [bahan, rasio] of Object.entries(recipe)) {
        const stokItem = stock[bahan];
        const butuh = Math.ceil(order.quantity / rasio);
        const sisa = stokItem.jumlah - butuh;

        await updateDoc(doc(db, "stockgudang", stokItem.id), {
          jumlahBarang: sisa
        });
      }
    }

    // === Cek apakah sudah ada dokumen dengan tanggal yang sama ===
    const q = query(collection(db, "penjualan"), where("tanggal", "==", date));
    const snap = await getDocs(q);

    if (!snap.empty) {
      // Sudah ada tanggal ini
      const docRef = snap.docs[0].ref;
      const data = snap.docs[0].data();
      let pesananLama = data.pesanan || [];

      // Gabungkan pesanan baru dengan yang lama
      for (const order of orders) {
        const existing = pesananLama.find(p => p.menu === order.menu);
        if (existing) {
          existing.quantity += order.quantity; // tambahkan quantity
        } else {
          pesananLama.push(order); // tambahkan menu baru
        }
      }

      await updateDoc(docRef, {
        pesanan: pesananLama
      });

      printPDF(orders, date);
      showPopup("✅ Berhasil!", "Pesanan ditambahkan ke tanggal yang sama.", true);

    } else {
      // Belum ada tanggal ini → buat dokumen baru
      await addDoc(collection(db, "penjualan"), {
        tanggal: date,
        pesanan: orders,
        dibuatPada: serverTimestamp()
      });

      printPDF(orders, date);
      showPopup("✅ Berhasil!", "Pesanan berhasil disimpan.", true);
    }

    salesForm.reset();

  } catch (error) {
    console.error("❌ Error:", error);
    showPopup("❌ Gagal!", error.message, false);
  }
});
