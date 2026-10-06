document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("buscadorInput");
    const suggestionsBox = document.getElementById("sugerenciasBox");
    const searchContainer = document.querySelector(".buscador-contenedor");
    const searchButton = document.getElementById("botonBuscar");

    if (!input || !suggestionsBox || !searchContainer) {
        console.error("No se encontró algún elemento del buscador.");
        return;
    }

    const catalogPages = [
        "index.html",
        "juegos90.html",
        "eafc.html",
        "fc27.html",
        "gta.html",
        "ofertasPC.html",
        "ventiladores.html",
        "memoriaRam.html",
        "steam.html",
        "tarjetaSteam.html"
    ];
    const pageLabels = {
        "index.html": "Inicio",
        "juegos90.html": "Juegos -90%",
        "eafc.html": "EA Sports FC",
        "fc27.html": "FC 27",
        "gta.html": "GTA",
        "ofertaspc.html": "Ofertas PC",
        "ventiladores.html": "Ventiladores",
        "memoriaram.html": "Memorias RAM",
        "steam.html": "Steam",
        "tarjetasteam.html": "Tarjetas Steam"
    };
    const products = new Map();
    let activePage = window.location.pathname.split("/").pop().toLowerCase();
    let searchTerm = "";

    function normalize(value) {
        return value
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLocaleLowerCase()
            .replace(/[^\p{L}\p{N}]+/gu, " ")
            .trim();
    }

    function productFromCard(card, page) {
        const title = card.querySelector(".card-title")?.textContent.trim();
        if (!title) return null;

        return {
            title,
            page,
            aliases: /grand theft auto vi|gta\s*6/i.test(title)
                ? "GTA 6 GTA VI"
                : "",
            price: card.querySelector(".text-info")?.textContent.trim() || "",
            image: card.querySelector(".card-img-top")?.getAttribute("src") || "",
            card
        };
    }

    function addProductsFromDocument(root, page) {
        root.querySelectorAll(".game-card").forEach((card) => {
            const product = productFromCard(card, page);
            if (!product) return;

            const key = `${page}:${normalize(product.title)}`;
            products.set(key, product);
        });
    }

    function matchingProducts(query) {
        const terms = normalize(query).split(/\s+/).filter(Boolean);
        if (!terms.length) return [];

        return [...products.values()]
            .filter((product) => {
                const searchableText = normalize(`${product.title} ${product.aliases} ${product.page}`);
                return terms.every((term) => searchableText.includes(term));
            })
            .sort((left, right) => {
                const leftPage = left.page === activePage ? 0 : 1;
                const rightPage = right.page === activePage ? 0 : 1;
                return leftPage - rightPage || left.title.localeCompare(right.title);
            });
    }

    function setCardVisibility(card, visible) {
        const column = card.closest(".col");
        if (column) {
            column.hidden = !visible;
        } else {
            card.hidden = !visible;
        }
    }

    function filterCurrentPage(query) {
        const terms = normalize(query).split(/\s+/).filter(Boolean);
        const cards = [...document.querySelectorAll(".game-card")];
        let visibleCount = 0;

        cards.forEach((card) => {
            const title = card.querySelector(".card-title")?.textContent || "";
            const imageAlt = card.querySelector(".card-img-top")?.getAttribute("alt") || "";
            const aliases = /grand theft auto vi|gta\s*6/i.test(title) ? "GTA 6 GTA VI" : "";
            const searchableText = normalize(`${title} ${imageAlt} ${aliases}`);
            const matches = !terms.length || terms.every((term) => searchableText.includes(term));
            setCardVisibility(card, matches);
            if (matches) visibleCount += 1;
        });

        return visibleCount;
    }

    function selectProduct(product) {
        input.value = product.title;
        searchTerm = product.title;
        suggestionsBox.hidden = true;

        if (product.page === activePage && product.card?.isConnected) {
            filterCurrentPage(product.title);
            product.card.scrollIntoView({ behavior: "smooth", block: "center" });
            product.card.classList.add("busqueda-encontrada");
            window.setTimeout(() => product.card.classList.remove("busqueda-encontrada"), 1800);
            return;
        }

        const destination = new URL(product.page, document.baseURI);
        destination.searchParams.set("buscar", product.title);
        window.location.assign(destination.href);
    }

    function renderSuggestions(query) {
        const matches = matchingProducts(query).slice(0, 8);
        suggestionsBox.replaceChildren();

        if (!query.trim()) {
            const header = document.createElement("div");
            header.className = "sugerencias-header";
            header.textContent = "BUSCA ENTRE LOS PRODUCTOS";
            suggestionsBox.append(header);

            const prompt = document.createElement("div");
            prompt.className = "sugerencia-item text-secondary";
            prompt.textContent = "Escribe el nombre de un juego o producto";
            suggestionsBox.append(prompt);
        } else if (!matches.length) {
            const empty = document.createElement("div");
            empty.className = "sugerencia-item text-secondary";
            empty.textContent = `No se encontró "${query}"`;
            suggestionsBox.append(empty);
        } else {
            const header = document.createElement("div");
            header.className = "sugerencias-header";
            header.textContent = "PRODUCTOS ENCONTRADOS";
            suggestionsBox.append(header);

            matches.forEach((product) => {
                const result = document.createElement("button");
                result.type = "button";
                result.className = "sugerencia-item";
                result.setAttribute("role", "option");
                result.style.width = "100%";
                result.style.border = "0";
                result.style.background = "transparent";
                result.style.font = "inherit";
                result.style.textAlign = "left";

                if (product.image) {
                    const image = document.createElement("img");
                    image.src = product.image;
                    image.alt = "";
                    image.width = 38;
                    image.height = 38;
                    image.loading = "lazy";
                    image.className = "rounded object-fit-cover";
                    result.append(image);
                }

                const details = document.createElement("span");
                details.className = "d-flex flex-column text-start";
                const title = document.createElement("span");
                title.textContent = product.title;
                details.append(title);

                const meta = document.createElement("small");
                meta.className = "text-white-50";
                meta.textContent = [pageLabels[product.page.toLowerCase()] || product.page, product.price]
                    .filter(Boolean)
                    .join(" · ");
                details.append(meta);
                result.append(details);
                result.addEventListener("click", () => selectProduct(product));
                suggestionsBox.append(result);
            });
        }

        suggestionsBox.hidden = false;
        suggestionsBox.style.display = "block";
    }

    function submitSearch() {
        const query = input.value.trim();
        if (!query) {
            filterCurrentPage("");
            renderSuggestions("");
            input.focus();
            return;
        }

        const matches = matchingProducts(query);
        if (!matches.length) {
            filterCurrentPage(query);
            renderSuggestions(query);
            return;
        }

        selectProduct(matches[0]);
    }

    input.addEventListener("focus", () => renderSuggestions(input.value));
    input.addEventListener("input", () => {
        searchTerm = input.value;
        const visibleCount = filterCurrentPage(searchTerm);
        renderSuggestions(searchTerm);

        const emptyState = document.getElementById("busquedaSinResultados");
        if (emptyState) emptyState.remove();
        if (searchTerm.trim() && visibleCount === 0) {
            const message = document.createElement("p");
            message.id = "busquedaSinResultados";
            message.className = "text-center text-white fs-5 py-5";
            message.textContent = `No se encontraron productos para "${searchTerm.trim()}" en esta página.`;
            document.querySelector("main")?.prepend(message);
        }
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            submitSearch();
        } else if (event.key === "Escape") {
            suggestionsBox.hidden = true;
            suggestionsBox.style.display = "none";
        }
    });

    searchButton?.addEventListener("click", submitSearch);

    document.addEventListener("click", (event) => {
        if (!searchContainer.contains(event.target)) {
            suggestionsBox.hidden = true;
            suggestionsBox.style.display = "none";
        }
    });

    const url = new URL(window.location.href);
    const initialQuery = url.searchParams.get("buscar") || "";
    if (initialQuery) {
        input.value = initialQuery;
        const visibleCount = filterCurrentPage(initialQuery);
        const firstMatch = [...document.querySelectorAll(".game-card")].find((card) => {
            const title = card.querySelector(".card-title")?.textContent || "";
            return normalize(title).includes(normalize(initialQuery));
        });
        firstMatch?.scrollIntoView({ behavior: "smooth", block: "center" });
        if (!visibleCount) {
            const message = document.createElement("p");
            message.id = "busquedaSinResultados";
            message.className = "text-center text-white fs-5 py-5";
            message.textContent = `No se encontraron productos para "${initialQuery}" en esta página.`;
            document.querySelector("main")?.prepend(message);
        }
    }

    addProductsFromDocument(document, activePage);

    const otherPages = catalogPages.filter((page) => page.toLowerCase() !== activePage);
    Promise.allSettled(otherPages.map(async (page) => {
        const response = await fetch(new URL(page, document.baseURI));
        if (!response.ok) throw new Error(`HTTP ${response.status} al cargar ${page}`);
        const markup = await response.text();
        const pageDocument = new DOMParser().parseFromString(markup, "text/html");
        addProductsFromDocument(pageDocument, page);
    })).then((results) => {
        const failedPages = results.filter((result) => result.status === "rejected");
        if (failedPages.length) {
            console.info("La búsqueda entre páginas no está disponible para todas las secciones; siguen disponibles los productos de esta página.");
        }
        if (input.value.trim()) renderSuggestions(input.value);
    });
});
