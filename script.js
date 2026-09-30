/* =========================================================
   SEGAR MART - SCRIPT
========================================================= */


/* =========================================================
   ELEMENT NAVBAR
========================================================= */

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");
const siteHeader = document.querySelector(".site-header");


/* =========================================================
   HAMBURGER MENU
========================================================= */

if (hamburger && navMenu) {

    hamburger.addEventListener("click", function () {

        navMenu.classList.toggle("active");

        const isOpen = navMenu.classList.contains("active");

        hamburger.setAttribute("aria-expanded", isOpen);

    });


    // Tutup menu setelah link diklik
    const navLinks = navMenu.querySelectorAll("a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navMenu.classList.remove("active");

            hamburger.setAttribute("aria-expanded", "false");

        });

    });

}


/* =========================================================
   NAVBAR SCROLL EFFECT
========================================================= */

window.addEventListener("scroll", function () {

    if (!siteHeader) return;

    if (window.scrollY > 20) {

        siteHeader.classList.add("scrolled");

    } else {

        siteHeader.classList.remove("scrolled");

    }

});


/* =========================================================
   ELEMENT KERANJANG
========================================================= */

const cartButton = document.getElementById("cart-button");
const cartSection = document.getElementById("keranjang");

const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

const orderForm = document.getElementById("order-form");
const sendOrderButton = document.getElementById("send-order");


/* =========================================================
   NOMOR WHATSAPP TOKO
=========================================================

   GANTI nomor di bawah dengan nomor WhatsApp SegarMart.

   Format:
   628xxxxxxxxxx

   Jangan menggunakan:
   +62
   08xxxxxxxxxx
========================================================= */

const WHATSAPP_NUMBER = "6281234567890";


/* =========================================================
   DATA KERANJANG
========================================================= */

let cart = [];


/* =========================================================
   TOMBOL MENUJU KERANJANG
========================================================= */

if (cartButton && cartSection) {

    cartButton.addEventListener("click", function () {

        cartSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

}


/* =========================================================
   FORMAT RUPIAH
========================================================= */

function formatRupiah(number) {

    return "Rp" + Number(number).toLocaleString("id-ID");

}


/* =========================================================
   FORMAT JUMLAH PRODUK
========================================================= */

function formatQuantity(quantity, unit) {

    if (unit === "kg") {

        return Number(quantity).toFixed(1) + " kg";

    }

    return Number(quantity) + " ikat";

}


/* =========================================================
   HITUNG SUBTOTAL
========================================================= */

function calculateSubtotal(product) {

    return product.price * product.quantity;

}


/* =========================================================
   RENDER KERANJANG
========================================================= */

function renderCart() {

    if (!cartItems || !cartCount || !cartTotal) {
        return;
    }


    /* -----------------------------------------
       Jika keranjang kosong
    ----------------------------------------- */

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="cart-empty">

                <div class="cart-empty-icon">
                    🛒
                </div>

                <h3>Keranjang masih kosong</h3>

                <p>
                    Silakan pilih produk di atas untuk mulai
                    membuat pesanan.
                </p>

                <a href="#produk-pilihan" class="cart-empty-button">
                    Lihat Produk
                </a>

            </div>
        `;

        cartCount.textContent = "0";

        cartTotal.textContent = "Rp0";

        if (sendOrderButton) {
            sendOrderButton.disabled = true;
        }

        return;
    }


    /* -----------------------------------------
       Keranjang memiliki produk
    ----------------------------------------- */

    let total = 0;

    let html = "";


    cart.forEach(function (product, index) {

        const subtotal = calculateSubtotal(product);

        total += subtotal;


        const step = product.unit === "kg"
            ? "0.1"
            : "1";

        const min = product.unit === "kg"
            ? "0.1"
            : "1";


        html += `

            <div class="cart-item">

                <div class="cart-item-info">

                    <h4>
                        ${product.name}
                    </h4>

                    <div class="cart-item-price">
                        ${formatRupiah(product.price)}
                        / ${product.unit}
                    </div>

                    <div class="cart-item-subtotal">
                        Subtotal: ${formatRupiah(subtotal)}
                    </div>

                </div>


                <div class="cart-item-actions">

                    <div class="quantity-control">

                        <button
                            type="button"
                            class="quantity-minus"
                            data-index="${index}"
                            aria-label="Kurangi jumlah"
                        >
                            −
                        </button>


                        <input
                            type="number"
                            class="quantity-input"
                            data-index="${index}"
                            value="${product.quantity}"
                            min="${min}"
                            step="${step}"
                            inputmode="decimal"
                            aria-label="Jumlah ${product.name}"
                        >


                        <button
                            type="button"
                            class="quantity-plus"
                            data-index="${index}"
                            aria-label="Tambah jumlah"
                        >
                            +
                        </button>

                    </div>


                    <button
                        type="button"
                        class="remove-item"
                        data-index="${index}"
                        aria-label="Hapus ${product.name}"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `;

    });


    cartItems.innerHTML = html;

    cartTotal.textContent = formatRupiah(total);

    cartCount.textContent = cart.length;

    if (sendOrderButton) {
        sendOrderButton.disabled = false;
    }

}


/* =========================================================
   TAMBAH PRODUK KE KERANJANG
========================================================= */

const productButtons = document.querySelectorAll(".product-button");


productButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const productName = button.dataset.product;
        const productPrice = Number(button.dataset.price);
        const productUnit = button.dataset.unit;


        // Cek apakah produk sudah ada
        const existingProduct = cart.find(function (product) {

            return product.name === productName;

        });


        if (existingProduct) {

            /*
                Jika produk sudah ada:
                tambah 1 unit.

                kg:
                1 kg → 2 kg

                ikat:
                1 ikat → 2 ikat
            */

            existingProduct.quantity += 1;

        } else {

            /*
                Produk baru.
                Jumlah awal = 1
            */

            cart.push({

                name: productName,

                price: productPrice,

                unit: productUnit,

                quantity: 1

            });

        }


        renderCart();


        /* -----------------------------------------
           Efek visual tombol
        ----------------------------------------- */

        const originalText = button.textContent;

        button.textContent = "✓ Ditambahkan";

        button.classList.add("added");


        setTimeout(function () {

            button.textContent = originalText;

            button.classList.remove("added");

        }, 1000);


        console.log("Keranjang:", cart);

    });

});


/* =========================================================
   EVENT DI DALAM KERANJANG
========================================================= */

if (cartItems) {

    cartItems.addEventListener("click", function (event) {


        /* -----------------------------------------
           TOMBOL PLUS
        ----------------------------------------- */

        if (event.target.classList.contains("quantity-plus")) {

            const index = Number(
                event.target.dataset.index
            );

            if (!cart[index]) return;


            if (cart[index].unit === "kg") {

                cart[index].quantity =
                    Number(
                        (cart[index].quantity + 0.1).toFixed(1)
                    );

            } else {

                cart[index].quantity += 1;

            }


            renderCart();

        }


        /* -----------------------------------------
           TOMBOL MINUS
        ----------------------------------------- */

        if (event.target.classList.contains("quantity-minus")) {

            const index = Number(
                event.target.dataset.index
            );

            if (!cart[index]) return;


            if (cart[index].unit === "kg") {

                const newQuantity =
                    Number(
                        (cart[index].quantity - 0.1).toFixed(1)
                    );

                if (newQuantity < 0.1) {

                    cart[index].quantity = 0.1;

                } else {

                    cart[index].quantity = newQuantity;

                }

            } else {

                if (cart[index].quantity > 1) {

                    cart[index].quantity -= 1;

                }

            }


            renderCart();

        }


        /* -----------------------------------------
           TOMBOL HAPUS
        ----------------------------------------- */

        if (event.target.classList.contains("remove-item")) {

            const index = Number(
                event.target.dataset.index
            );

            if (!cart[index]) return;


            cart.splice(index, 1);

            renderCart();

        }

    });


    /* -----------------------------------------
       INPUT JUMLAH MANUAL
    ----------------------------------------- */

    cartItems.addEventListener("change", function (event) {

        if (!event.target.classList.contains("quantity-input")) {
            return;
        }


        const index = Number(
            event.target.dataset.index
        );

        if (!cart[index]) return;


        let value = Number(event.target.value);


        if (!Number.isFinite(value)) {

            value = cart[index].unit === "kg"
                ? 0.1
                : 1;

        }


        /* -----------------------------------------
           Produk kg
        ----------------------------------------- */

        if (cart[index].unit === "kg") {

            // Minimal 0.1 kg
            value = Math.max(0.1, value);

            // Bulatkan ke kelipatan 0.1 kg
            value = Math.round(value * 10) / 10;

        }


        /* -----------------------------------------
           Produk ikat
        ----------------------------------------- */

        else {

            // Harus bilangan bulat
            value = Math.round(value);

            // Minimal 1 ikat
            value = Math.max(1, value);

        }


        cart[index].quantity = value;

        renderCart();

    });

}


/* =========================================================
   KLIK "LIHAT PRODUK" DARI EMPTY STATE
========================================================= */

if (cartItems) {

    cartItems.addEventListener("click", function (event) {

        if (
            event.target.classList.contains("cart-empty-button")
        ) {

            const productSection =
                document.getElementById("produk-pilihan");

            if (productSection) {

                productSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }

    });

}


/* =========================================================
   HITUNG JADWAL PENGIRIMAN
========================================================= */

function getDeliverySchedule() {

    const now = new Date();

    const currentHour = now.getHours();

    const currentMinute = now.getMinutes();


    /*
        Batas pemesanan:
        22:00

        Sebelum 22:00
        → dikirim besok

        22:00 atau lebih
        → dikirim lusa
    */

    const afterCutoff =
        currentHour > 22 ||
        (currentHour === 22 && currentMinute >= 0);


    const deliveryDate = new Date(now);


    if (afterCutoff) {

        deliveryDate.setDate(
            deliveryDate.getDate() + 2
        );

    } else {

        deliveryDate.setDate(
            deliveryDate.getDate() + 1
        );

    }


    const formattedDate =
        new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(deliveryDate);


    return {
        date: formattedDate,
        time: "07.00 - 10.00"
    };

}


/* =========================================================
   MEMBUAT TEKS PESAN WHATSAPP
========================================================= */

function createWhatsAppMessage() {

    const customerName =
        document.getElementById("customer-name").value.trim();

    const customerPhone =
        document.getElementById("customer-phone").value.trim();

    const customerAddress =
        document.getElementById("customer-address").value.trim();

    const customerNote =
        document.getElementById("customer-note").value.trim();


    const delivery =
        getDeliverySchedule();


    let total = 0;


    let message =
`Halo SegarMart 👋

Saya ingin melakukan pemesanan.

*DATA PESANAN*
`;


    cart.forEach(function (product, index) {

        const subtotal =
            calculateSubtotal(product);

        total += subtotal;


        message += `
${index + 1}. ${product.name}
   Jumlah: ${formatQuantity(product.quantity, product.unit)}
   Harga: ${formatRupiah(product.price)} / ${product.unit}
   Subtotal: ${formatRupiah(subtotal)}
`;

    });


    message += `
*TOTAL PESANAN*
${formatRupiah(total)}

*DATA PENERIMA*
Nama: ${customerName}
WhatsApp: ${customerPhone}
Alamat: ${customerAddress}
`;


    if (customerNote !== "") {

        message +=
`
Catatan: ${customerNote}
`;

    }


    message += `
*JADWAL PENGIRIMAN*
${delivery.date}
Pukul ${delivery.time}

Pesanan maksimal pukul 22.00 akan diproses untuk pengiriman sesuai jadwal berikutnya.

Terima kasih. 🙏
`;


    return message;

}


/* =========================================================
   SUBMIT PESANAN
========================================================= */

if (orderForm) {

    orderForm.addEventListener("submit", function (event) {

        event.preventDefault();


        /* -----------------------------------------
           Cek keranjang
        ----------------------------------------- */

        if (cart.length === 0) {

            alert(
                "Keranjang masih kosong. Silakan pilih produk terlebih dahulu."
            );

            const productSection =
                document.getElementById("produk-pilihan");

            if (productSection) {

                productSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

            return;

        }


        /* -----------------------------------------
           Validasi form
        ----------------------------------------- */

        if (!orderForm.checkValidity()) {

            orderForm.reportValidity();

            return;

        }


        /* -----------------------------------------
           Buat pesan
        ----------------------------------------- */

        const message =
            createWhatsAppMessage();


        /* -----------------------------------------
           Encode pesan
        ----------------------------------------- */

        const encodedMessage =
            encodeURIComponent(message);


        /* -----------------------------------------
           Buat URL WhatsApp
        ----------------------------------------- */

        const whatsappURL =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;


        /* -----------------------------------------
           Buka WhatsApp
        ----------------------------------------- */

        window.open(
            whatsappURL,
            "_blank"
        );

    });

}


/* =========================================================
   RENDER AWAL
========================================================= */

renderCart();
