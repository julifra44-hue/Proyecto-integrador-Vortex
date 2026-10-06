(() => {
    const CART_KEY = "vortexCarrito";

    function obtenerCarrito() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch {
            return [];
        }
    }

    function agregarBotonesCarrito() {
        document.querySelectorAll(".game-card").forEach((tarjeta) => {
            const cuerpo = tarjeta.querySelector(".card-body");
            const compra = cuerpo?.querySelector(".btn-primary, .btn");
            if (!cuerpo || !compra || cuerpo.querySelector("[data-agregar-carrito]")) return;

            const boton = document.createElement("a");
            boton.href = new URL("carrito.html", document.baseURI).href;
            boton.className = "btn btn-warning fw-bold mb-2";
            boton.dataset.agregarCarrito = "true";
            boton.textContent = "Agregar al carrito";
            cuerpo.insertBefore(boton, compra);
        });
    }

    document.addEventListener("click", (evento) => {
        const boton = evento.target.closest("[data-agregar-carrito]");
        if (!boton) return;
        evento.preventDefault();
        evento.stopPropagation();

        const tarjeta = boton.closest(".game-card");
        const nombre = tarjeta?.querySelector(".card-title")?.textContent.trim();
        if (!nombre) return;

        const imagen = tarjeta.querySelector(".img-game");
        const precio = tarjeta.querySelector(".text-info")?.textContent.trim() || "";
        const carrito = obtenerCarrito();
        const existente = carrito.find((producto) => producto.id === nombre.toLocaleLowerCase());

        if (existente) {
            existente.cantidad += 1;
        } else {
            carrito.push({
                id: nombre.toLocaleLowerCase(),
                nombre,
                precio,
                imagen: imagen?.getAttribute("src") || "",
                cantidad: 1
            });
        }

        localStorage.setItem(CART_KEY, JSON.stringify(carrito));
        window.location.assign(new URL("carrito.html", document.baseURI).href);
    });

    function renderizarCarrito() {
        const lista = document.getElementById("listaCarrito");
        if (!lista) return;

        const carrito = obtenerCarrito();
        let total = 0;
        let cantidadTotal = 0;
        lista.replaceChildren();

        if (!carrito.length) {
            const vacio = document.createElement("p");
            vacio.className = "cart-empty";
            vacio.textContent = "Tu carrito está vacío.";
            lista.append(vacio);
        }

        carrito.forEach((producto) => {
            const cantidad = Number(producto.cantidad) || 1;
            const precio = Number((producto.precio || "").replace(/\D/g, "")) || 0;
            total += precio * cantidad;
            cantidadTotal += cantidad;

            const fila = document.createElement("article");
            fila.className = "cart-item";

            const imagen = document.createElement("img");
            imagen.src = producto.imagen || "";
            imagen.alt = producto.nombre;
            imagen.className = "cart-image";
            fila.append(imagen);

            const detalle = document.createElement("div");
            detalle.className = "cart-detail";

            const nombre = document.createElement("h2");
            nombre.className = "cart-product-name";
            nombre.textContent = producto.nombre;
            detalle.append(nombre);

            const precioTexto = document.createElement("p");
            precioTexto.className = "cart-product-price";
            precioTexto.textContent = `${producto.precio} · Cantidad: ${cantidad}`;
            detalle.append(precioTexto);
            fila.append(detalle);

            const quitar = document.createElement("button");
            quitar.type = "button";
            quitar.className = "btn btn-outline-light btn-sm";
            quitar.dataset.cartRemove = producto.id;
            quitar.textContent = "Quitar";
            fila.append(quitar);
            lista.append(fila);
        });

        document.getElementById("cartCount").textContent = `${cantidadTotal} ${cantidadTotal === 1 ? "producto" : "productos"}`;
        document.getElementById("cartTotal").textContent = `$${total.toLocaleString("es-CO")} COP`;
    }

    document.addEventListener("click", (evento) => {
        const quitar = evento.target.closest("[data-cart-remove]");
        const vaciar = evento.target.closest("[data-cart-clear]");
        if (!quitar && !vaciar) return;

        const carrito = vaciar
            ? []
            : obtenerCarrito().filter((producto) => producto.id !== quitar.dataset.cartRemove);
        localStorage.setItem(CART_KEY, JSON.stringify(carrito));
        renderizarCarrito();
    });

    agregarBotonesCarrito();
    renderizarCarrito();

    const listaFavoritos = document.getElementById("listaFavoritos");
    if (listaFavoritos) {
        new MutationObserver(agregarBotonesCarrito).observe(listaFavoritos, {
            childList: true,
            subtree: true
        });
    }
})();
