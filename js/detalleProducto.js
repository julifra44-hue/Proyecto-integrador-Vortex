(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("nombre");
    const imagePath = params.get("img");
    const priceParam = params.get("precio");
    const previousPriceParam = params.get("precioAnterior");
    const priceCop = priceParam === null || priceParam === "" ? NaN : Number(priceParam);
    const previousPriceCop = previousPriceParam === null || previousPriceParam === ""
        ? NaN
        : Number(previousPriceParam);
    const discount = params.get("descuento");
    const categoryReviews = {
        ram: [
            { author: "MemoriaPro", rating: 5, date: "18/5/2026", text: "El kit de memoria llegó bien protegido y fue sencillo instalarlo. El equipo lo reconoció sin problemas." },
            { author: "ByteMaster", rating: 5, date: "12/5/2026", text: "Buena capacidad para trabajar con varios programas abiertos. Revisé la compatibilidad con mi placa antes de comprar." },
            { author: "TechCol", rating: 4, date: "3/5/2026", text: "Rendimiento estable después de activar el perfil de memoria en la BIOS. Buena opción para ampliar el PC." }
        ],
        fans: [
            { author: "PCBuilder", rating: 5, date: "20/5/2026", text: "Los ventiladores mueven buen flujo de aire y mantienen temperaturas estables durante sesiones largas." },
            { author: "SetupGamer", rating: 4, date: "14/5/2026", text: "Fueron fáciles de instalar en el gabinete. El ruido es bajo a velocidad normal." },
            { author: "HardwareFan", rating: 5, date: "6/5/2026", text: "Buen rendimiento para mejorar la ventilación del equipo. El paquete llegó completo y en buen estado." }
        ]
    };
    const gameReviewComments = {
        "ea sports fc 25": ["El modo carrera y los partidos con amigos hacen que siempre haya algo que jugar.", "Buenos gráficos y muchas opciones para armar el equipo. Se disfruta más jugando en compañía."],
        "dragon ball: sparking! zero": ["Las peleas se sienten intensas y hay muchos personajes para probar.", "Muy divertido para jugar con amigos; los combates y las transformaciones se ven increíbles."],
        "god of war ragnarok": ["La historia y los combates me engancharon desde el principio.", "Tiene escenarios impresionantes y una aventura muy completa. Lo recomiendo mucho."],
        "elden ring": ["Explorar el mundo y descubrir sus secretos fue lo que más disfruté.", "Es desafiante, pero cada jefe que superas se siente como un gran logro."],
        "minecraft": ["Perfecto para construir y explorar a mi ritmo, solo o con amigos.", "Tiene muchísimas posibilidades y siempre termino empezando un proyecto nuevo."],
        "gta v": ["El mundo tiene muchas actividades y la historia sigue siendo muy entretenida.", "El modo en línea ofrece horas de juego y muchas cosas para hacer con amigos."],
        "spider-man 2": ["Moverse por la ciudad es divertidísimo y los combates son muy fluidos.", "La historia de Peter y Miles está muy bien llevada y luce genial."],
        "resident evil village": ["La ambientación mantiene la tensión y la historia me sorprendió.", "Buen equilibrio entre exploración, acción y terror. Lo jugué de principio a fin."],
        "the last of us": ["La historia y sus personajes me mantuvieron pendiente hasta el final.", "La aventura tiene momentos muy intensos y una ambientación excelente."],
        "resident evil 4": ["La acción y la exploración están muy bien combinadas.", "Tiene buen ritmo y muchos momentos memorables; vale la pena volver a jugarlo."],
        "call of duty: black ops 6": ["Las partidas son rápidas y el multijugador tiene buenos mapas.", "La campaña está entretenida y el modo zombis da para muchas horas."],
        "halo infinite": ["El combate se siente muy bien y las partidas en línea son divertidas.", "Me gustó explorar el mapa y usar las distintas armas y vehículos."],
        "gears of war 4": ["La campaña cooperativa fue muy entretenida para jugar en pareja.", "Buen sistema de cobertura y combates intensos durante toda la historia."],
        "doom": ["Acción directa y rápida; cada combate se siente satisfactorio.", "La música y el ritmo hacen que sea difícil dejar de jugar."],
        "cyberpunk 2077": ["La ciudad está llena de detalles y la historia ofrece decisiones interesantes.", "Me gustaron las misiones y las distintas formas de mejorar al personaje."],
        "mortal kombat 1": ["Los combates son espectaculares y hay muchos personajes para aprender.", "Muy bueno para jugar localmente con amigos; los movimientos se ven geniales."],
        "forza horizon 5": ["Conducir por el mapa es una pasada y hay muchos coches para conseguir.", "Las carreras son variadas y el mundo se ve precioso."],
        "street fighter 6": ["El sistema de combate es divertido y practicar combos engancha.", "Tiene modos para distintos niveles y las partidas en línea funcionan muy bien."],
        "batman": ["Me gustó recorrer la ciudad y resolver los combates usando sigilo.", "La ambientación de Batman está muy lograda y la historia entretiene."],
        "god of war 3": ["Los combates siguen siendo espectaculares y llenos de acción.", "Una aventura intensa con jefes memorables y buen ritmo."],
        "gta 6": ["La ambientación de Leonida y Vice City se ve increíble; tengo muchas ganas de explorar el mundo.", "Espero que la historia y las actividades del mundo abierto estén a la altura de la saga."]
    };
    const galleryImagesByProduct = {
        "ea sports fc 25": ["", "img/fc 25 carrusel.jpg", "img/fc 25 carrusel2.JPEG"],
        "dragon ball: sparking! zero": ["img/DBZSP.avif", "img/DBZ.webp"],
        "god of war ragnarok": ["img/God_of_War_Ragnarok.webp"],
        "elden ring": ["img/ELDEN.jpg", "img/Elden Ring Shadow of the Erdtree.jpg"],
        "minecraft": ["img/Minecraft PS5.webp", "img/Minecraft.webp"],
        "gta v": ["img/GTA_V.webp"],
        "spider-man 2": ["img/spiderman2.avif"],
        "the last of us": ["img/the last of us.jpg"],
        "resident evil 4": ["img/resident_evil_4_remake-5789986.webp"],
        "call of duty: black ops 6": ["img/Bo6.jpg", "img/bo6.png"],
        "halo infinite": ["img/Halo.png"],
        "red dead redemption 2": ["img/red2.jpg"],
        "cyberpunk 2077": ["img/cyberpunk.avif"],
        "mortal kombat 1": ["img/Mk.jpg"],
        "forza horizon 5": ["img/forza.jpg"],
        "street fighter 6": ["img/Street_Fighter_6.jpg", "img/street.jpg"]

    };
    let preferences = {};
    try {
        preferences = JSON.parse(localStorage.getItem("preferenciasTienda") || "{}");
    } catch {
        preferences = {};
    }
    let currency = params.get("moneda") === "USD"
        ? "USD"
        : params.get("moneda") === "COP"
            ? "COP"
            : preferences.currency === "USD" ? "USD" : "COP";

    const titleElement = document.getElementById("nombreJuego") || document.getElementById("nombreProducto");
    const imageElement = document.getElementById("imagenJuego") || document.getElementById("imagenProducto");
    const priceElement = document.getElementById("precioJuego") || document.getElementById("precioProducto");
    const currencyElement = document.getElementById("monedaJuego") || document.getElementById("monedaProducto");
    const previousPriceElement = document.getElementById("precioAnterior") || document.getElementById("precioAnteriorProducto");
    const discountElement = document.getElementById("descuento") || document.getElementById("descuentoProducto");
    const isComprasPage = titleElement?.id === "nombreProducto";

    if (!name) {
        if (!isComprasPage) {
            imageElement.closest(".col-md-5").hidden = true;
            priceElement.closest("h2").hidden = true;
            previousPriceElement.parentElement.hidden = true;
        }
        return;
    }

    titleElement.textContent = name;
    document.title = `${name} | Vortex Game Vault`;

    const productDescription = `${name} ${imagePath || ""}`.toLowerCase();
    const reviewCategory = /memoria|\bram\b|ddr[345]|\d+\s?gb/.test(productDescription)
        ? "ram"
        : /ventilador|\bfan\b|pwm|arctic|noctua|thermalright|p12|c12|rs120/.test(productDescription)
            ? "fans"
            : null;

    const gameReviews = gameReviewComments[name.trim().toLowerCase()]?.map((text, index) => ({
        author: index === 0 ? "Jugador verificado" : "Comunidad Vortex",
        rating: index === 0 ? 5 : 4,
        date: index === 0 ? "7/4/2026" : "20/3/2026",
        text
    }));
    const reviews = reviewCategory ? categoryReviews[reviewCategory] : gameReviews;

    if (reviews) {
        const reviewList = document.getElementById("lista-resenas");
        const reviewCount = document.getElementById("contador-reseñas");

        reviewList.replaceChildren(...reviews.map((review) => {
            const item = document.createElement("div");
            item.className = "mb-3 pb-3 border-bottom border-secondary border-opacity-25";

            const header = document.createElement("div");
            header.className = "d-flex justify-content-between mb-1";
            const reviewer = document.createElement("div");
            reviewer.className = "text-warning small";

            const author = document.createElement("strong");
            author.className = "eneba-text-blue small me-2";
            author.textContent = review.author;
            reviewer.appendChild(author);

            for (let index = 0; index < 5; index += 1) {
                const star = document.createElement("i");
                star.className = index < review.rating ? "bi bi-star-fill" : "bi bi-star";
                reviewer.appendChild(star);
            }

            const date = document.createElement("span");
            date.className = "text-muted small";
            date.textContent = review.date;
            header.append(reviewer, date);

            const comment = document.createElement("p");
            comment.className = "small eneba-text-blue mb-0";
            comment.textContent = review.text;
            item.append(header, comment);
            return item;
        }));

        const countLabel = document.documentElement.lang === "en" ? "Reviews" : "Reseñas";
        reviewCount.textContent = `${countLabel}: ${reviews.length}`;
    }

    if (imagePath) {
        imageElement.src = imagePath;
        imageElement.alt = name;
    } else if (!isComprasPage) {
        imageElement.closest(".col-md-5").hidden = true;
    }

    const gallery = document.getElementById("galeriaProducto");
    if (imagePath && gallery) {
        const slides = gallery.querySelector("[data-gallery-slides]");
        const indicators = gallery.querySelector("[data-gallery-indicators]");
        const productImages = [
            imagePath,
            ...(galleryImagesByProduct[name.trim().toLowerCase()] || []),
            ...params.getAll("imagen")
        ].filter((image, index, images) => image && images.indexOf(image) === index);
        productImages.forEach((src, index) => {
            const item = document.createElement("div");
            item.className = `carousel-item${index === 0 ? " active" : ""}`;

            const slide = document.createElement("img");
            slide.src = src;
            slide.className = "d-block w-100";
            slide.alt = `${name}, imagen ${index + 1}`;
            slide.loading = index === 0 ? "eager" : "lazy";
            item.appendChild(slide);
            slides.appendChild(item);

            const indicator = document.createElement("button");
            indicator.type = "button";
            indicator.className = index === 0 ? "active" : "";
            indicator.setAttribute("data-bs-target", "#carouselProducto");
            indicator.setAttribute("data-bs-slide-to", String(index));
            indicator.setAttribute("aria-label", `Ver imagen ${index + 1}`);
            if (index === 0) indicator.setAttribute("aria-current", "true");
            indicators.appendChild(indicator);
        });

        gallery.addEventListener("slid.bs.carousel", (event) => {
            indicators.querySelectorAll("button").forEach((indicator, indicatorIndex) => {
                if (indicatorIndex === event.to) {
                    indicator.setAttribute("aria-current", "true");
                } else {
                    indicator.removeAttribute("aria-current");
                }
            });
        });
        gallery.hidden = false;
    }

    function formatPrice(amountCop) {
        const amount = currency === "USD" ? amountCop / 4000 : amountCop;
        return new Intl.NumberFormat(currency === "USD" ? "en-US" : "es-CO", {
            minimumFractionDigits: currency === "USD" ? 2 : 0,
            maximumFractionDigits: currency === "USD" ? 2 : 0
        }).format(amount);
    }

    function renderPrices() {
        if (Number.isFinite(priceCop)) {
            priceElement.textContent = formatPrice(priceCop);
            priceElement.closest("h2").hidden = false;
            currencyElement.textContent = currency;
        } else {
            priceElement.closest("h2").hidden = true;
        }

        if (Number.isFinite(previousPriceCop) && previousPriceCop > 0) {
            previousPriceElement.textContent = `${formatPrice(previousPriceCop)} ${currency}`;
            previousPriceElement.hidden = false;
        } else {
            previousPriceElement.hidden = true;
        }
    }

    renderPrices();

    window.addEventListener("store-locale-change", (event) => {
        if (event.detail?.currency !== "USD" && event.detail?.currency !== "COP") return;
        currency = event.detail.currency;
        renderPrices();
    });

    if (discount) {
        discountElement.textContent = discount;
    } else {
        discountElement.hidden = true;
    }
})();