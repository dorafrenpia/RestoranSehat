// cetak.js
const saveBtn = document.getElementById("saveBtn"); // tombol simpan pesanan
const receiptDiv = document.getElementById("receipt");
const receiptDate = document.getElementById("receiptDate");
const receiptTableBody = document.querySelector("#receiptTable tbody");

// Fungsi isi data struk dari form
function fillReceipt() {
  receiptTableBody.innerHTML = "";

  // isi tanggal sesuai pilihan
  const dateOption = document.querySelector('input[name="dateOption"]:checked').value;
  const date = dateOption === 'today'
    ? new Date().toLocaleDateString('id-ID')
    : document.getElementById("manualDate").value;
  receiptDate.textContent = "Tanggal : " + date;

  // ambil data menu dari form
  document.querySelectorAll('.menu-item').forEach(item => {
    const menu = item.querySelector('.itemName').value;
    const quantity = item.querySelector('.quantity').value;
    if (menu && quantity) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${menu}</td>
        <td style="text-align:right;">${quantity}</td>
      `;
      receiptTableBody.appendChild(tr);
    }
  });
}

// fungsi cetak pdf
function printPDF() {
  // tampilkan sementara supaya html2pdf bisa baca
  receiptDiv.style.display = "block";
  const opt = {
    margin: 10,
    filename: 'struk-pesanan.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a5', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(receiptDiv).save().then(() => {
    receiptDiv.style.display = "none";
  });
}

// klik simpan → simpan data + cetak pdf
saveBtn.addEventListener("click", (e) => {
  e.preventDefault(); // jika tombol di dalam form, supaya tidak reload
  // di sini tempat kamu simpan data ke database / array kalau ada
  // …

  // isi struk dan cetak
  fillReceipt();
  printPDF();
});
