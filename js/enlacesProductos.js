(() => {
    const hardwarePages = new Set([
        "ventiladores.html",
        "memoriaram.html",
        "ofertaspc.html"
    ]);
    const currentPage = window.location.pathname.split("/").pop().toLowerCase();
    let preferences = {};

    try {
        preferences = JSON.parse(localStorage.getItem("preferenciasTienda") || "{}");
    } catch {
        preferences = {};
    }

    if (!preferences || typeof preferences !== "object") preferences = {};

    const language = preferences.language === "en" ? "en" : "es";
    const currency = language === "en" ? "USD" : "COP";

    function priceInCop(value) {
        if (!value) return "";
        const numericValue = value.match(/[\d.,]+/)?.[0] || "";
        if (preferences.currency === "USD" && !/\bCOP\b/.test(value)) {
            return String(Math.round(Number(numericValue.replace(/,/g, "")) * 4000));
        }
        return numericValue.replace(/\D/g, "");
    }

    function enlazarTarjeta(card) {
        const image = card.querySelector(".card-img-top");
        const title = card.querySelector(".card-title");
        let purchaseLink = card.querySelector(".card-body .btn-primary");

        if (!image || !title || !purchaseLink) {
            console.error("No se pudo enlazar la compra: falta imagen, nombre o botón en una tarjeta.", card);
            return null;
        }

        if (purchaseLink.tagName === "BUTTON") {
            const link = document.createElement("a");
            link.className = purchaseLink.className;
            link.textContent = purchaseLink.textContent.trim();
            purchaseLink.replaceWith(link);
            purchaseLink = link;
        }

        const previousHref = purchaseLink.getAttribute("href") || "";
        const savedDestination = currentPage === "favoritos.html"
            ? new URL(previousHref || "compras2.html", document.baseURI)
            : null;
        const purchasePage = savedDestination && /compras\.html$/i.test(savedDestination.pathname)
            ? "compras.html"
            : hardwarePages.has(currentPage) ? "compras.html" : "compras2.html";
        const destination = new URL(purchasePage, document.baseURI);
        const price = card.querySelector(".text-info")?.textContent.trim() || "";
        const previousPrice = card.querySelector(".text-decoration-line-through")?.textContent.trim() || "";
        const discount = card.querySelector(".badge.bg-danger")?.textContent.trim() || "";

        destination.searchParams.set("nombre", title.textContent.trim());
        destination.searchParams.set("precio", priceInCop(price));
        destination.searchParams.set("img", image.getAttribute("src") || image.src);
        destination.searchParams.set("idioma", language);
        destination.searchParams.set("moneda", currency);
        if (previousPrice) destination.searchParams.set("precioAnterior", priceInCop(previousPrice));
        if (discount) destination.searchParams.set("descuento", discount);
        purchaseLink.href = destination.href;

        [image, title].forEach((element) => {
            const existingLink = element.closest("a");
            if (existingLink) {
                existingLink.href = destination.href;
                return;
            }

            const link = document.createElement("a");
            link.href = destination.href;
            link.className = "d-block text-reset text-decoration-none";
            link.setAttribute("aria-label", `Ver ${title.textContent.trim()}`);
            element.before(link);
            link.append(element);
        });

        return purchaseLink;
    }

    function enlazarTarjetas() {
        document.querySelectorAll(".game-card").forEach((card) => {
            if (card.querySelector(".card-body .btn-primary")) enlazarTarjeta(card);

            const reservationLinks = card.querySelectorAll('.card-body a[href*="reservas.html"]');
            if (!reservationLinks.length) return;

            const image = card.querySelector(".card-img-top");
            const title = card.querySelector(".card-title");
            if (!image || !title) {
                console.error("No se pudo enlazar la reserva: falta imagen o nombre en una tarjeta.", card);
                return;
            }

            const destination = new URL("reservas.html", document.baseURI);
            const price = card.querySelector(".text-info")?.textContent.trim() || "";
            const previousPrice = card.querySelector(".text-decoration-line-through")?.textContent.trim() || "";
            const discount = card.querySelector(".badge.bg-danger")?.textContent.trim() || "";

            destination.searchParams.set("nombre", title.textContent.trim());
            destination.searchParams.set("precio", priceInCop(price));
            destination.searchParams.set("img", image.getAttribute("src") || image.src);
            destination.searchParams.set("idioma", language);
            destination.searchParams.set("moneda", currency);
            if (previousPrice) destination.searchParams.set("precioAnterior", priceInCop(previousPrice));
            if (discount) destination.searchParams.set("descuento", discount);
            destination.searchParams.delete("imagen");
            ["img/gta 6 carrusel.jpeg", "img/gta 6 carrusel2.jpg"].forEach((galleryImage) => {
                destination.searchParams.append("imagen", galleryImage);
            });

            reservationLinks.forEach((link) => {
                link.href = destination.href;
            });
        });
    }

    document.addEventListener("click", (event) => {
        const purchaseLink = event.target.closest(".game-card .card-body .btn-primary");
        if (!purchaseLink) return;

        const card = purchaseLink.closest(".game-card");
        if (!card) return;

        const linkedPurchase = enlazarTarjeta(card);
        if (purchaseLink.tagName === "BUTTON") {
            event.preventDefault();
            if (linkedPurchase) window.location.assign(linkedPurchase.href);
        }
    }, true);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", enlazarTarjetas, { once: true });
    } else {
        enlazarTarjetas();
    }

    new MutationObserver(enlazarTarjetas).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
