import { I as attr, L as escape_html, i as ensure_array_like, n as attr_class, r as derived } from "../../chunks/dev.js";
//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let nama = "Laptop";
		let kategori = "elektronik";
		let stok = 8;
		let hargaSatuan = 1e7;
		let minimumStok = 5;
		let terjualBulanIni = 12;
		let hariDalamBulan = 30;
		let loading = false;
		let daftarProduk = [];
		let totalJenisBarang = derived(() => daftarProduk.length);
		let totalStokGudang = derived(() => daftarProduk.reduce((sum, item) => sum + item.stok, 0));
		let totalAsetGudang = derived(() => daftarProduk.reduce((sum, item) => sum + item.harga * item.stok, 0));
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="container svelte-1uha8ag"><header class="svelte-1uha8ag"><h1 class="svelte-1uha8ag">📦 Gudang Elektronik Arlettaa</h1> <p class="subtitle svelte-1uha8ag">Generator Pengelolaan dan Analisis Stok Gudang Terintegrasi</p></header> <div class="grid-layout svelte-1uha8ag"><section class="card form-card svelte-1uha8ag"><h3 class="svelte-1uha8ag">Input Data Barang</h3> <div class="form-group svelte-1uha8ag"><label for="namaBarang" class="svelte-1uha8ag">Nama Barang</label> <input id="namaBarang" type="text"${attr("value", nama)} placeholder="Contoh: Keyboard Mechanical" class="svelte-1uha8ag"/></div> <div class="form-group svelte-1uha8ag"><label for="kategoriBarang" class="svelte-1uha8ag">Kategori</label> <input id="kategoriBarang" type="text"${attr("value", kategori)} placeholder="Contoh: Elektronik" class="svelte-1uha8ag"/></div> <div class="form-row svelte-1uha8ag"><div class="form-group svelte-1uha8ag"><label for="stokBarang" class="svelte-1uha8ag">Stok Saat Ini</label> <input id="stokBarang" type="number"${attr("value", stok)} class="svelte-1uha8ag"/></div> <div class="form-group svelte-1uha8ag"><label for="minStok" class="svelte-1uha8ag">Minimum Stok</label> <input id="minStok" type="number"${attr("value", minimumStok)} class="svelte-1uha8ag"/></div></div> <div class="form-group svelte-1uha8ag"><label for="hargaBarang" class="svelte-1uha8ag">Harga Satuan (Rp)</label> <input id="hargaBarang" type="number"${attr("value", hargaSatuan)} class="svelte-1uha8ag"/></div> <div class="form-row svelte-1uha8ag"><div class="form-group svelte-1uha8ag"><label for="terjualBulan" class="svelte-1uha8ag">Terjual Bulan Ini</label> <input id="terjualBulan" type="number"${attr("value", terjualBulanIni)} class="svelte-1uha8ag"/></div> <div class="form-group svelte-1uha8ag"><label for="hariBulan" class="svelte-1uha8ag">Hari Dalam Bulan</label> <input id="hariBulan" type="number"${attr("value", hariDalamBulan)} class="svelte-1uha8ag"/></div></div> <div class="action-buttons svelte-1uha8ag"><button${attr_class("btn-primary svelte-1uha8ag", void 0, { "loading": loading })}>${escape_html("Generate & Tambah ke Gudang ⚡")}</button> <button class="btn-secondary svelte-1uha8ag">Clear Form</button></div></section> <section class="card output-card svelte-1uha8ag"><h3 class="svelte-1uha8ag">Output Analisis Laporan</h3> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<div class="empty-state"><div class="empty-icon">📊</div> <p>Belum ada laporan analisis terbaru.</p> <p class="empty-sub">Isi formulir kiri lalu generate untuk melihat kalkulasi.</p></div>`);
		$$renderer.push(`<!--]--></section></div> <div class="widgets-container svelte-1uha8ag"><div class="widget-card svelte-1uha8ag"><div class="widget-icon svelte-1uha8ag" style="color: #38bdf8;">📂</div> <div class="widget-info svelte-1uha8ag"><span class="widget-label svelte-1uha8ag">Total Jenis Barang</span> <span class="widget-value svelte-1uha8ag">${escape_html(totalJenisBarang())} Item</span></div></div> <div class="widget-card svelte-1uha8ag"><div class="widget-icon svelte-1uha8ag" style="color: #fbbf24;">📦</div> <div class="widget-info svelte-1uha8ag"><span class="widget-label svelte-1uha8ag">Total Stok Terhitung</span> <span class="widget-value svelte-1uha8ag">${escape_html(totalStokGudang())} Unit</span></div></div> <div class="widget-card svelte-1uha8ag"><div class="widget-icon svelte-1uha8ag" style="color: #34d399;">💰</div> <div class="widget-info svelte-1uha8ag"><span class="widget-label svelte-1uha8ag">Total Nilai Aset</span> <span class="widget-value svelte-1uha8ag">Rp ${escape_html(totalAsetGudang().toLocaleString("id-ID"))}</span></div></div></div> <section class="card table-section svelte-1uha8ag"><div class="table-header-main svelte-1uha8ag"><h3 class="svelte-1uha8ag">Daftar Stok Produk</h3> <span class="counter-badge svelte-1uha8ag">Live Inventory</span></div> `);
		if (daftarProduk.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="table-responsive svelte-1uha8ag"><table class="svelte-1uha8ag"><thead><tr><th style="width: 60px; text-align: center;" class="svelte-1uha8ag">NO</th><th class="svelte-1uha8ag">NAMA PRODUK</th><th class="svelte-1uha8ag">KATEGORI</th><th class="svelte-1uha8ag">STOK</th><th class="svelte-1uha8ag">HARGA</th><th class="svelte-1uha8ag">STATUS</th><th style="width: 100px; text-align: center;" class="svelte-1uha8ag">AKSI</th></tr></thead><tbody><!--[-->`);
			const each_array = ensure_array_like(daftarProduk);
			for (let index = 0, $$length = each_array.length; index < $$length; index++) {
				let prod = each_array[index];
				$$renderer.push(`<tr class="svelte-1uha8ag"><td style="text-align: center;" class="dim-text svelte-1uha8ag">${escape_html(index + 1)}</td><td class="bold-text svelte-1uha8ag">${escape_html(prod.nama)}</td><td class="svelte-1uha8ag"><span class="category-tag svelte-1uha8ag">${escape_html(prod.kategori)}</span></td><td class="svelte-1uha8ag">${escape_html(prod.stok)} unit</td><td class="price-text svelte-1uha8ag">Rp ${escape_html(prod.harga.toLocaleString("id-ID"))}</td><td class="svelte-1uha8ag"><span${attr_class("status-badge svelte-1uha8ag", void 0, { "danger": prod.status.includes("Kritis") || prod.status.includes("Reorder") })}>${escape_html(prod.status)}</span></td><td style="text-align: center;" class="svelte-1uha8ag"><button class="btn-delete svelte-1uha8ag">Hapus</button></td></tr>`);
			}
			$$renderer.push(`<!--]--></tbody></table></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="empty-table-state svelte-1uha8ag"><p>📭 Gudang masih kosong. Klik "Generate &amp; Tambah ke Gudang" di atas untuk mengisi stok tabel.</p></div>`);
		}
		$$renderer.push(`<!--]--></section></div>`);
	});
}
//#endregion
export { _page as default };
