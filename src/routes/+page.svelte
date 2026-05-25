<script>
  // 1. Variabel Reaktif Svelte 5 (Runes) untuk Form Input
  let nama = $state('Laptop');
  let kategori = $state('elektronik');
  let stok = $state(8);
  let hargaSatuan = $state(10000000);
  let minimumStok = $state(5);
  let terjualBulanIni = $state(12);
  let hariDalamBulan = $state(30);

  let hasilLaporan = $state(null);
  let loading = $state(false);

  // State untuk Daftar Produk (Tabel) & Notifikasi Toast
  let daftarProduk = $state([]);
  let toastMessage = $state('');
  let showToast = $state(false);

  // 2. STATE TURUNAN (Derived Runes) - Otomatis Menghitung Total Rangkuman Gudang
  let totalJenisBarang = $derived(daftarProduk.length);
  let totalStokGudang = $derived(daftarProduk.reduce((sum, item) => sum + item.stok, 0));
  let totalAsetGudang = $derived(daftarProduk.reduce((sum, item) => sum + (item.harga * item.stok), 0));

  // 3. EFEK SVELTE 5: Muat data dari Local Storage saat pertama kali dibuka
  $effect(() => {
    const savedForm = localStorage.getItem('data_form_gudang');
    if (savedForm) {
      const parsed = JSON.parse(savedForm);
      nama = parsed.nama ?? 'Laptop';
      kategori = parsed.kategori ?? 'elektronik';
      stok = parsed.stok ?? 8;
      hargaSatuan = parsed.hargaSatuan ?? 10000000;
      minimumStok = parsed.minimumStok ?? 5;
      terjualBulanIni = parsed.terjualBulanIni ?? 12;
      hariDalamBulan = parsed.hariDalamBulan ?? 30;
    }

    const savedList = localStorage.getItem('daftar_produk_gudang');
    if (savedList) {
      daftarProduk = JSON.parse(savedList);
    }
  });

  // 4. EFEK SVELTE 5: Simpan ke Local Storage otomatis tiap kali ada perubahan
  $effect(() => {
    const formToSave = { nama, kategori, stok, hargaSatuan, minimumStok, terjualBulanIni, hariDalamBulan };
    localStorage.setItem('data_form_gudang', JSON.stringify(formToSave));
  });

  $effect(() => {
    localStorage.setItem('daftar_produk_gudang', JSON.stringify(daftarProduk));
  });

  // Fungsi memunculkan Toast Notifikasi
  function triggerToast(message) {
    toastMessage = message;
    showToast = true;
    setTimeout(() => {
      showToast = false;
    }, 3000);
  }

  // 5. Fungsi panggil backend + Masukin ke tabel
  async function hitungDanTambahStok() {
    loading = true;
    try {
      const response = await fetch('http://localhost:3000/api/hitung-stok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, kategori, stok, hargaSatuan, minimumStok, terjualBulanIni, hariDalamBulan })
      });

      if (response.ok) {
        hasilLaporan = await response.json();
        
        // BIKIN PRODUK BARU & MASUKIN KE DAFTAR TABEL
        const produkBaru = {
          id: Date.now(),
          nama: hasilLaporan.nama,
          kategori: hasilLaporan.kategori,
          harga: hargaSatuan,
          stok: hasilLaporan.stok,
          status: hasilLaporan.status
        };

        daftarProduk = [produkBaru, ...daftarProduk];
        triggerToast(`✅ ${nama} berhasil ditambahkan ke gudang!`);

      } else {
        alert('Gagal terhubung ke backend server');
      }
    } catch (error) {
      console.error(error);
      alert('Pastikan server.js backend kamu masih berjalan!');
    } finally {
      loading = false;
    }
  }

  // 6. Fungsi menghapus baris tabel
  function hapusProduk(id, namaProd) {
    daftarProduk = daftarProduk.filter(p => p.id !== id);
    triggerToast(`🗑️ ${namaProd} dihapus dari gudang.`);
  }

  // 7. Fungsi reset form ke default
  function resetForm() {
    nama = '';
    kategori = '';
    stok = 0;
    hargaSatuan = 0;
    minimumStok = 0;
    terjualBulanIni = 0;
    hariDalamBulan = 30;
    hasilLaporan = null;
  }
</script>

{#if showToast}
  <div class="toast">
    {toastMessage}
  </div>
{/if}

<div class="container">
  <header>
    <h1>📦 Gudang Elektronik Arlettaa</h1>
    <p class="subtitle">Generator Pengelolaan & Analisis Stok Gudang Terintegrasi</p>
  </header>

  <div class="grid-layout">
    <section class="card form-card">
      <h3>Input Data Barang</h3>
      
      <div class="form-group">
        <label for="namaBarang">Nama Barang</label>
        <input id="namaBarang" type="text" value={nama} oninput={(e) => nama = e.target.value} placeholder="Contoh: Keyboard Mechanical" />
      </div>
      
      <div class="form-group">
        <label for="kategoriBarang">Kategori</label>
        <input id="kategoriBarang" type="text" value={kategori} oninput={(e) => kategori = e.target.value} placeholder="Contoh: Elektronik" />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="stokBarang">Stok Saat Ini</label>
          <input id="stokBarang" type="number" value={stok} oninput={(e) => stok = Number(e.target.value)} />
        </div>
        
        <div class="form-group">
          <label for="minStok">Minimum Stok</label>
          <input id="minStok" type="number" value={minimumStok} oninput={(e) => minimumStok = Number(e.target.value)} />
        </div>
      </div>
      
      <div class="form-group">
        <label for="hargaBarang">Harga Satuan (Rp)</label>
        <input id="hargaBarang" type="number" value={hargaSatuan} oninput={(e) => hargaSatuan = Number(e.target.value)} />
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="terjualBulan">Terjual Bulan Ini</label>
          <input id="terjualBulan" type="number" value={terjualBulanIni} oninput={(e) => terjualBulanIni = Number(e.target.value)} />
        </div>
        
        <div class="form-group">
          <label for="hariBulan">Hari Dalam Bulan</label>
          <input id="hariBulan" type="number" value={hariDalamBulan} oninput={(e) => hariDalamBulan = Number(e.target.value)} />
        </div>
      </div>

      <div class="action-buttons">
        <button onclick={hitungDanTambahStok} class="btn-primary" class:loading>
          {loading ? 'Memproses Data...' : 'Generate & Tambah ke Gudang ⚡'}
        </button>
        <button onclick={resetForm} class="btn-secondary">Clear Form</button>
      </div>
    </section>

    <section class="card output-card">
      <h3>Output Analisis Laporan</h3>
      
      {#if hasilLaporan}
        <div class="terminal-box">
          <div class="terminal-header">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
            <span class="terminal-title">stok_report.txt</span>
          </div>
          <div class="terminal-content">
            <div class="line title">--- LAPORAN STOK GUDANG ---</div>
            <div class="line">Barang: <span class="highlight">{hasilLaporan.nama}</span> ({hasilLaporan.kategori})</div>
            <div class="line">Stok Saat Ini: <span class="highlight">{hasilLaporan.stok} unit</span> = Rp {Number(hasilLaporan.totalNilaiStok).toLocaleString('id-ID')}</div>
            <div class="line">Rata-rata Penjualan/hari: <span class="highlight">{hasilLaporan.rataRataPenjualanHari} unit</span></div>
            <div class="line">Estimasi Stok 30 hari: <span class="highlight">{hasilLaporan.estimasiStok30Hari} unit</span></div>
            <div class="line divider">----------------------------</div>
            <div class="line">Minimum Stok: {hasilLaporan.minimumStok} unit</div>
            <div class="line">Status: <span class="badge" class:critical={hasilLaporan.status.includes('Kritis') || hasilLaporan.status.includes('Reorder')}>{hasilLaporan.status}</span></div>
            <div class="line divider">----------------------------</div>
            <div class="line">Reorder Quantity: {hasilLaporan.reorderQuantity} unit</div>
            <div class="line warning-text">Peringatan: {hasilLaporan.peringatan}</div>
          </div>
        </div>
      {:else}
        <div class="empty-state">
          <div class="empty-icon">📊</div>
          <p>Belum ada laporan analisis terbaru.</p>
          <p class="empty-sub">Isi formulir kiri lalu generate untuk melihat kalkulasi.</p>
        </div>
      {/if}
    </section>
  </div>

  <div class="widgets-container">
    <div class="widget-card">
      <div class="widget-icon" style="color: #38bdf8;">📂</div>
      <div class="widget-info">
        <span class="widget-label">Total Jenis Barang</span>
        <span class="widget-value">{totalJenisBarang} Item</span>
      </div>
    </div>
    <div class="widget-card">
      <div class="widget-icon" style="color: #fbbf24;">📦</div>
      <div class="widget-info">
        <span class="widget-label">Total Stok Terhitung</span>
        <span class="widget-value">{totalStokGudang} Unit</span>
      </div>
    </div>
    <div class="widget-card">
      <div class="widget-icon" style="color: #34d399;">💰</div>
      <div class="widget-info">
        <span class="widget-label">Total Nilai Aset</span>
        <span class="widget-value">Rp {totalAsetGudang.toLocaleString('id-ID')}</span>
      </div>
    </div>
  </div>

  <section class="card table-section">
    <div class="table-header-main">
      <h3>Daftar Stok Produk</h3>
      <span class="counter-badge">Live Inventory</span>
    </div>

    {#if daftarProduk.length > 0}
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th style="width: 60px; text-align: center;">NO</th>
              <th>NAMA PRODUK</th>
              <th>KATEGORI</th>
              <th>STOK</th>
              <th>HARGA</th>
              <th>STATUS</th>
              <th style="width: 100px; text-align: center;">AKSI</th>
            </tr>
          </thead>
          <tbody>
            {#each daftarProduk as prod, index (prod.id)}
              <tr>
                <td style="text-align: center;" class="dim-text">{index + 1}</td>
                <td class="bold-text">{prod.nama}</td>
                <td><span class="category-tag">{prod.kategori}</span></td>
                <td>{prod.stok} unit</td>
                <td class="price-text">Rp {prod.harga.toLocaleString('id-ID')}</td>
                <td>
                  <span class="status-badge" class:danger={prod.status.includes('Kritis') || prod.status.includes('Reorder')}>
                    {prod.status}
                  </span>
                </td>
                <td style="text-align: center;">
                  <button onclick={() => hapusProduk(prod.id, prod.nama)} class="btn-delete">Hapus</button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <div class="empty-table-state">
        <p>📭 Gudang masih kosong. Klik "Generate & Tambah ke Gudang" di atas untuk mengisi stok tabel.</p>
      </div>
    {/if}
  </section>
</div>

<style>
  /* TOAST FLOATING NOTIFICATION */
  .toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #0f172a;
    border: 2px solid #10b981;
    color: #4ade80;
    padding: 14px 24px;
    border-radius: 8px;
    font-weight: bold;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  /* GLOBAL STYLES */
  :global(body) {
    background-color: #0b0f19;
    color: #f1f5f9;
    font-family: 'Inter', system-ui, sans-serif;
    margin: 0;
    padding: 0;
  }

  .container {
    max-width: 1100px;
    margin: 40px auto;
    padding: 0 20px;
  }

  header {
    text-align: center;
    margin-bottom: 40px;
  }

  header h1 {
    font-size: 2.5rem;
    color: #38bdf8;
    margin: 0 0 10px 0;
    font-weight: 800;
  }

  .subtitle {
    color: #94a3b8;
    font-size: 1.1rem;
    margin: 0;
  }

  .grid-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-bottom: 30px;
  }

  @media (max-width: 768px) {
    .grid-layout { grid-template-columns: 1fr; }
    .widgets-container { grid-template-columns: 1fr !important; }
  }

  /* CARD STYLE */
  .card {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 16px;
    padding: 25px;
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
  }

  .card h3 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 1.25rem;
    color: #f8fafc;
    border-bottom: 2px solid #334155;
    padding-bottom: 10px;
  }

  .form-group { margin-bottom: 16px; }
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  label {
    display: block;
    font-size: 0.8rem;
    font-weight: 600;
    color: #94a3b8;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input {
    width: 100%;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid #475569;
    background: #0f172a;
    color: white;
    font-size: 0.95rem;
    box-sizing: border-box;
    transition: all 0.2s ease;
  }

  input:focus {
    outline: none;
    border-color: #38bdf8;
    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
  }

  /* BUTTONS SETUP */
  .action-buttons {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 10px;
    margin-top: 15px;
  }

  .btn-primary {
    padding: 14px;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
  }

  .btn-secondary {
    background: #334155;
    color: #cbd5e1;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.2s;
  }

  .btn-secondary:hover { background: #475569; }

  /* TERMINAL LOOK-ALIKE */
  .terminal-box {
    background: #052e16;
    border: 1px solid #10b981;
    border-radius: 12px;
    overflow: hidden;
  }

  .terminal-header {
    background: #022c22;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #10b981;
  }

  .dot { width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; }
  .dot.red { background: #ef4444; }
  .dot.yellow { background: #eab308; }
  .dot.green { background: #22c55e; }
  .terminal-title { font-family: monospace; font-size: 0.75rem; color: #6ee7b7; margin-left: 8px; }

  .terminal-content { padding: 18px; font-family: 'Courier New', Courier, monospace; color: #4ade80; line-height: 1.6; }
  .line.title { color: #a3e635; font-weight: bold; }
  .line .highlight { color: #fff; font-weight: bold; }
  .line.divider { color: #14532d; }
  .badge { background: #14532d; color: #4ade80; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; }
  .badge.critical { background: #7f1d1d; color: #fca5a5; }
  .warning-text { color: #facc15; font-weight: bold; margin-top: 8px; }

  /* WIDGET CARDS STYLE */
  .widgets-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
  }

  .widget-card {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 18px;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }

  .widget-icon {
    font-size: 2rem;
    margin-right: 15px;
  }

  .widget-info {
    display: flex;
    flex-direction: column;
  }

  .widget-label {
    font-size: 0.8rem;
    color: #94a3b8;
    text-transform: uppercase;
    font-weight: 600;
  }

  .widget-value {
    font-size: 1.2rem;
    font-weight: 800;
    color: white;
    margin-top: 2px;
  }

  /* TABEL MANAJEMEN STOK */
  .table-header-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #334155;
    margin-bottom: 15px;
    padding-bottom: 10px;
  }

  .table-header-main h3 { border: none; margin: 0; padding: 0; }

  .counter-badge {
    background: #022c22;
    border: 1px solid #10b981;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    color: #4ade80;
    font-weight: bold;
  }

  .table-responsive { overflow-x: auto; }

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.95rem;
  }

  th {
    background-color: #0f172a;
    color: #94a3b8;
    padding: 14px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #334155;
  }

  td {
    padding: 14px;
    border-bottom: 1px solid #334155;
    color: #e2e8f0;
  }

  tr:hover td { background-color: #243249; }

  .bold-text { font-weight: 600; color: #fff; }
  .dim-text { color: #64748b; }
  .price-text { color: #38bdf8; font-weight: 600; }
  
  .category-tag {
    background: #334155;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 0.8rem;
    color: #cbd5e1;
  }

  /* DYNAMIC STATUS BADGES */
  .status-badge {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    border: 1px solid #10b981;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: bold;
  }

  .status-badge.danger {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    border: 1px solid #ef4444;
  }

  .btn-delete {
    background-color: #ef4444;
    color: white;
    border: none;
    padding: 6px 14px;
    border-radius: 6px;
    font-weight: bold;
    font-size: 0.8rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-delete:hover { background-color: #dc2626; }
  .empty-table-state { text-align: center; padding: 40px; color: #64748b; font-style: italic; }
</style>