   let menuCount = 1;
    const menuList = document.getElementById('menuList');
    const menuTabs = document.getElementById('menuTabs');
    const addMenuBtn = document.getElementById('addMenuBtn');
    const deleteMenuBtn = document.getElementById('deleteMenuBtn');
    const todayRadio = document.getElementById('today');
    const manualRadio = document.getElementById('manual');
    const manualDate = document.getElementById('manualDate');
    // === Tambahkan event listener untuk tab pertama (Menu 1) ===
const firstTab = document.querySelector('.menu-tab[data-index="1"]');
firstTab.addEventListener('click', () => setActiveMenu(1));

    // === Fungsi ganti tab menu ===
    function setActiveMenu(index) {
      document.querySelectorAll('.menu-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.index == index);
      });
      document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.toggle('active', item.dataset.index == index);
      });
    }

    // === Fungsi tambah menu ===
    addMenuBtn.addEventListener('click', () => {
      menuCount++;
      const index = menuCount;

      // buat tab baru
      const newTab = document.createElement('button');
      newTab.type = 'button';
      newTab.classList.add('menu-tab');
      newTab.dataset.index = index;
      newTab.textContent = `Menu ${index}`;
      newTab.addEventListener('click', () => setActiveMenu(index));
      menuTabs.appendChild(newTab);

      // buat form menu baru
      const newMenu = document.createElement('div');
      newMenu.classList.add('menu-item');
      newMenu.dataset.index = index;
      newMenu.innerHTML = `
        <div class="menu-box">
          <h3>Menu ${index}</h3>

          <label for="itemName${index}">Nama Menu</label>
          <select id="itemName${index}" class="itemName" required onchange="handleMenuChange(this)">
            <option value="">-- Pilih Menu --</option>
            <option value="Mie Goreng">Mie Goreng</option>
            <option value="Nasi Goreng">Nasi Goreng</option>
            <option value="Ayam Geprek">Ayam Geprek</option>
            <option value="Ifumie">Ifumie</option>
            <option value="Pisang Goreng">Pisang Goreng</option>
            <option value="Ubi Goreng">Ubi Goreng</option>
            <option value="Tempe Goreng">Tempe Goreng</option>
            <option value="Tahu Goreng">Tahu Goreng</option>
          </select>

          <label class="nasi-checkbox" style="display: none;">
            <input type="checkbox" class="addRice">
            Tambah Nasi
          </label>

          <label for="quantity${index}">Jumlah Pesanan</label>
          <input type="number" id="quantity${index}" class="quantity" required placeholder="Masukkan jumlah">
        </div>
      `;
      menuList.insertBefore(newMenu, menuList.querySelector('.menu-btns'));

      // aktifkan tab baru
      setActiveMenu(index);
    });

    // === Fungsi hapus menu ===
    deleteMenuBtn.addEventListener('click', () => {
      const activeTab = document.querySelector('.menu-tab.active');
      const activeIndex = parseInt(activeTab.dataset.index);

      if (menuCount > 1) {
        // hapus tab & menu
        document.querySelector(`.menu-tab[data-index="${activeIndex}"]`).remove();
        document.querySelector(`.menu-item[data-index="${activeIndex}"]`).remove();

        // geser urutan tab & menu setelahnya
        for (let i = activeIndex + 1; i <= menuCount; i++) {
          const nextTab = document.querySelector(`.menu-tab[data-index="${i}"]`);
          const nextItem = document.querySelector(`.menu-item[data-index="${i}"]`);
          if (nextTab && nextItem) {
            const newIndex = i - 1;
            nextTab.dataset.index = newIndex;
            nextTab.textContent = `Menu ${newIndex}`;
            nextItem.dataset.index = newIndex;
            nextItem.querySelector('h3').textContent = `Menu ${newIndex}`;
            nextItem.querySelector('.itemName').id = `itemName${newIndex}`;
            nextItem.querySelector('.quantity').id = `quantity${newIndex}`;
          }
        }

        menuCount--;
        setActiveMenu(Math.min(activeIndex, menuCount));
      } else {
        alert("Minimal 1 menu harus ada!");
      }
    });

    // === Fungsi tampilkan checkbox 'Tambah Nasi' ===
    window.handleMenuChange = function(selectElement) {
      const nasiCheckbox = selectElement.parentElement.querySelector('.nasi-checkbox');
      const nasiMenus = ["Mie Goreng", "Nasi Goreng", "Ayam Geprek", "Ifumie"];
      if (nasiMenus.includes(selectElement.value)) {
        nasiCheckbox.style.display = "block";
      } else {
        nasiCheckbox.style.display = "none";
        nasiCheckbox.querySelector('input').checked = false;
      }
    };

    // === Toggle tanggal manual ===
    todayRadio.addEventListener('change', () => manualDate.disabled = true);
    manualRadio.addEventListener('change', () => manualDate.disabled = false);

    // === Submit form ===
    salesForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = [];

      document.querySelectorAll('.menu-item').forEach(item => {
        const menu = item.querySelector('.itemName').value;
        const quantity = item.querySelector('.quantity').value;
        const addRice = item.querySelector('.addRice').checked;
        data.push({ menu, quantity, addRice });
      });

      const dateOption = document.querySelector('input[name="dateOption"]:checked').value;
      const date = dateOption === 'today' ? new Date().toISOString().split('T')[0] : manualDate.value;

      console.log({ tanggal: date, pesanan: data });
      alert("Pesanan berhasil disimpan!");
    });