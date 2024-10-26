function openWindow(namaWind, elmnt){
    var m, tabWindow, button;

    tabWindow = document.getElementsByClassName('window');
    for(m = 0; m < tabWindow.length; m++){
        tabWindow[m].style.display = 'none';
    }
    console.log('window' + window.length);
    button = document.getElementsByClassName('windowLink');
    for(m = 0; m < button.length; m++){
        button[m].style.backgroundColor = '';
        button[m].style.color = 'black';
        button[m].classList.remove('isActive');

    }
    console.log(button.length);
    document.getElementById(namaWind).style.display = 'block';
    elmnt.classList.add('isActive');
}
document.getElementById('defaultOpen').click();
// openWindow('defaultOpen', this);
function openTab(namaTab, elemnt) {
    var i, tabContent, tablinks;
    
    // Hide all tab content
    tabContent = document.getElementsByClassName('tabContent');
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = 'none';

    }
    
    // Reset all tab button styles
    tablinks = document.getElementsByClassName('tablink');
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = '';
        tablinks[i].classList.remove('active');
        tablinks[i].style.color = ''; // Reset color if needed
    }
    
    // Show the selected tab content and style the clicked tab button
    document.getElementById(namaTab).style.display = 'block';
    elemnt.style.backgroundColor = '';
    elemnt.classList.add('active');
    elemnt.style.color = '#76FF03';
}

function FormatRupiah(angka){
    return 'Rp' + angka.toLocaleString('id-ID', {minimumFactionDigits: 0, maximumFactionDigits : 0});
}
let products = {
    "9786234006292": { name: "Buku html css js", price: Number(55500) || 0, quantity: 1, sisaStock: 50 },
    "8995757111005": { name: "Buku Tulis", price: Number("3000") || 0, quantity: 1, sisaStock: 50 },
    "0501117896574": { name: "Buku Tulis Vision", price: Number("2500") || 0, quantity: 1, sisaStock: 50 },
    "8934868015031": { name: "pulpen", price: Number(3500) || 0, quantity: 1, sisaStock: 50  },
    "8888166338401": { name: "crackers krekers", price: Number(10000) || 0, quantity: 1, sisaStock: 50  },
    "8994112731216": { name: "Penggaris Hello Kitty", price: Number(5000) || 0, quantity: 1, sisaStock: 20 },
    "6935912711048": { name: "Uno Game", price: Number(15000) || 0, quantity: 1, sisaStock: 50 },
};

document.getElementById("productForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Mencegah form agar tidak melakukan reload halaman

    // Mengambil nilai dari form
    const barcode = document.getElementById("barcode").value;
    const name = document.getElementById("name").value;
    const price = Number(document.getElementById("price").value) || 0;
    const quantity = Number(document.getElementById('quantity').value) || 0;

    // Menambahkan produk baru ke objek products
    products[barcode] = { name, price, quantity };

    console.log("Produk berhasil ditambahkan:", products);
    alert("Produk berhasil ditambahkan!");

    // Membersihkan input form setelah submit
    document.getElementById("barcode").value = '';
    document.getElementById("name").value = '';
    document.getElementById("price").value = '';
    document.getElementById('quantity').value = '';
});


Quagga.init({
    inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#video'), // Element video untuk pemindaian
        constraints: {
            facingMode: "environment" // Menggunakan kamera belakang
        }
    },
    decoder: {
        readers: [
            "code_128_reader", // Tipe barcode yang ingin dipindai
            "ean_reader",
            "ean_8_reader",
            "upc_reader",
            "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",
            "i2of5_reader"
        ]
    }
}, function(err) {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Quagga is ready!");
    Quagga.start();
});
let lastDetected = null;
Quagga.onDetected(function(data) {
    // Quagga.offDetected();
    const barcode = data.codeResult.code; // Mengambil hasil pemindaian
    const product = products[barcode]; // Mencari produk berdasarkan barcode
    if(barcode === lastDetected) return;

    lastDetected = barcode;
    if (product) {
        
        beepSound.play();
        // alert(`Nama: ${product.name}, Harga: Rp${product.price}`);
        tokoSaya.pelangganBeli(product.nama, product.price);
        addItem(product);
        cek();
        console.log('sisa' + product.sisaStock);
        console.log('x'+product.quantity);
        // setTimeout(() => {
        //     Quagga.onDetected();
        // }, 2000);
        updateSisaStock(product.sisaStock);
    } else {
        document.getElementById('result').innerText = "Produk tidak ditemukan.";
    }
    
    setTimeout(() => {
        lastDetected = null;
    }, 5000);
});
let tokoSaya = new Toko(0, 0, 20000, 15000, 0, []);

function addItem(product) {
    // Menemukan barcode dari produk
    if (!product.barcode) {
        product.barcode = Object.keys(products).find(key => products[key] === product);
    }

    console.log("Barcode diproses:", product.barcode);

    // Mencari elemen yang sudah ada di DOM
    const existingItem = document.querySelector(`.item[data-barcode="${product.barcode}"]`);

    if (existingItem) {
        // Jika item sudah ada, tingkatkan jumlahnya
        product.quantity += 1;

        const quantitySpan = existingItem.querySelector('.quantity');
        if (quantitySpan) {
            quantitySpan.innerText = `x${product.quantity}`; // Memastikan quantitySpan tidak null
            console.log(`Produk ${product.name} sudah ada. Quantity sekarang: ${product.quantity}`);
        } else {
            console.error("Quantity span tidak ditemukan di existingItem.");
        }
    } else {
        // Jika item belum ada, buat elemen baru
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");
        itemDiv.setAttribute("data-barcode", product.barcode);

        const nameSpan = document.createElement("span");
        nameSpan.classList.add("item-name");
        nameSpan.innerText = product.name;

        const priceSpan = document.createElement("span");
        priceSpan.classList.add("item-price");
        priceSpan.innerText = `Rp${product.price.toLocaleString("id-ID")}`;

        const quantitySpan = document.createElement("span");
        quantitySpan.classList.add("quantity");
        quantitySpan.innerText = `x${product.quantity}`;

        itemDiv.appendChild(nameSpan);
        itemDiv.appendChild(priceSpan);
        itemDiv.appendChild(quantitySpan);

        document.getElementById("items").appendChild(itemDiv);

        console.log(`Produk baru ${product.name} ditambahkan dengan barcode: ${product.barcode}`);
    }
    items = document.getElementById('items');
    items.style.padding = 10;

    updateTotal(product.price);
}




    // Fungsi untuk memperbarui total harga
    let total = 0;
    function updateTotal(price) {
      total += price;
      document.getElementById("totalAmount").textContent = `Rp${total.toLocaleString("id-ID")}`;
    }
function cek(){
    result = tokoSaya.untungBersih;
    document.getElementById('result').innerText = 'untung Bersih mu adalah ' + FormatRupiah(result); 
}
function PelangganBeli(){
        const barcode = data.codeResult.code; // Mengambil hasil pemindaian
        const product = products[barcode];


        if (!product) {
            alert("Produk tidak ditemukan.");
            return;
        }
        
        let harga = product.price || 0;
    
        let result = tokoSaya.untungBersih += Number(harga);
    
        updateUntungBersih(result);
    
        document.getElementById('untungBersih').innerText = 'Untung Bersih anda ' + result;
    }
    
function tambahKaryawan(){
    let nama = document.getElementById('namaKaryawan').value;
    let gaji = parseInt(document.getElementById('gajiKaryawan').value);

    if(nama ==='' || isNaN.gaji || gaji <= 0){
        alert('Masukan nama dan gaji yang benar!');
        return;
    }

    let result = tokoSaya.TambahKaryawan(nama, gaji);

    updateDaftarKaryawan(result.karyawan);

    alert('Karyawan Sudah ditambahkan');
}
function updateDaftarKaryawan(karyawanList) {
    let daftarKaryawan = document.getElementById('daftarKaryawan');
    daftarKaryawan.innerHTML = ""; // Kosongkan list sebelumnya

    karyawanList.forEach(function(karyawan) {
        let li = document.createElement('li');
        li.id = 'daftar';
        li.innerText = karyawan;
        daftarKaryawan.appendChild(li);
    });
}
function addItemInProdukContainer(){
    function item(product){
        const itemProduk = document.createElement('div');
        const containerItem = document.createElement('div');
        const produkContainer = document.createElement('div');
        const produkCount = document.createElement('div');
        const countParent = document.createElement('div');
        const count = document.createElement('p');
        const countPlus = document.createElement('div');
        const countButton = document.createElement('button');
        const ikonPlus = document.createElement('img');
        const gambarProdukParent = document.createElement('div');
        const gambarProduk = document.createElement('img');
        const infoProduk = document.createElement('div');
        const nama = document.createElement('div');
        const harga = document.createElement('div');
        const namaProduk = document.createElement('p');
        const hargaProduk = document.createElement('p');
        const tebal = document.createElement('b');

        itemProduk.id = 'item-produk';
        containerItem.id = 'container-item';
        produkContainer.id = 'produk-container';
        produkCount.id = 'count-produk';
        countParent.id = 'count-parent';
        count.id ='count';
        countPlus.id = 'count-plus';
        ikonPlus.src = 'src/image 2.png';
        ikonPlus.width = '48';
        ikonPlus.height = '48';
        gambarProdukParent.id = 'gambar-produk';
        infoProduk.id = 'info-produk';
        nama.id = 'nama';
        harga.id = 'harga';
        namaProduk.id = 'nama-produk';
        hargaProduk.id = 'harga-produk';
        
        namaProduk.innerText = product.name;
        tebal.innerText = `Rp${product.price.toLocaleString("id-ID")}`;
        count.textContent = product.sisaStock;
        // for(a > product.sisaStock; a--;){
        //     console.log('sisa stock' + a);
        // }
        

        itemProduk.appendChild(containerItem);
        containerItem.appendChild(produkContainer);
        produkContainer.appendChild(gambarProdukParent);
        gambarProdukParent.appendChild(gambarProduk);
        produkContainer.appendChild(infoProduk);
        infoProduk.appendChild(nama);
        nama.appendChild(namaProduk);
        infoProduk.appendChild(harga);
        harga.appendChild(hargaProduk); 
        hargaProduk.appendChild(tebal);    
        produkContainer.appendChild(produkCount);
        produkCount.appendChild(countParent)
        countParent.appendChild(count);
        produkCount.appendChild(countPlus);
        countPlus.appendChild(countButton);
        countButton.appendChild(ikonPlus);
        
        document.getElementById('list-item').appendChild(itemProduk);
    }
    for (let kodeProduk in products) {
        if (products.hasOwnProperty(kodeProduk)) {
            const product = products[kodeProduk];
            console.log(`Kode Produk: ${kodeProduk}, Nama: ${product.name}, Harga: ${product.price}, Jumlah: ${product.quantity}, stock: ${product.sisaStock}`);
            item(product); // Tambahkan produk ke dalam container
        }
    }
    const jumlahProduk = Object.keys(products).length;
    console.log('Jumlah produk: ' + jumlahProduk);
}
function updateSisaStock(sisaStock){
    products.sisaStock -= 1;
    document.getElementsById('count').textContent = products.sisaStock;
}
document.getElementById('openProduk').addEventListener('click', function() {
    addItemInProdukContainer();
});
function Toko(untung, gajiKaryawan, pajak, kontrak, untungBersih, karyawan){
    this.untung = untung;
    this.pelangganBeli = function(barangDibeli, harga){
        this.untungBersih += harga;
        this.untung += harga;
        return {
            barangDibeli,
            harga
        };
    }
    this.gajiKaryawan = gajiKaryawan;
    this.pajak = pajak;
    this.kontrak = kontrak;
    this.karyawan = [];
    this.untungBersih = untung - gajiKaryawan - pajak - kontrak;

    this.pelanggaran = function(jenisPelanggaran, denda){
            this.untung -= denda;
            this.untungBersih -= denda;
            alert('Kamu telah melanggar ' + jenisPelanggaran + ' kamu denda ' + denda + ' Sekarang jumlah untung bersih kamu sebesar ' + this.untungBersih);


        return untungBersih;
    }
    this.karyawanKorup = function(namaKaryawan, uangYgDikorup){                
        if(this.karyawan == 0){
            alert('Kamu belum punya karyawan');
        }else{
            this.untung -= uangYgDikorup;
        this.untungBersih -= uangYgDikorup;
        console.log(namaKaryawan + " telah melakukan korupsi sebesar " + uangYgDikorup);
        }
        return untungBersih;
    }
    this.TambahKaryawan = function(namaKaryawan, gajiPerBulan){
        this.karyawan.push(namaKaryawan);
        this.gajiKaryawan += gajiPerBulan;
        this.untung -= gajiPerBulan;
        this.untungBersih -= gajiPerBulan;
        return {
            karyawan:this.karyawan,
            untungBersih: this.untungBersih
        };
    }
}
