const FAVORITOS_KEY = "vortexFavoritos";

function obtenerFavoritos() {
	try {
		return JSON.parse(localStorage.getItem(FAVORITOS_KEY)) || [];
	} catch {
		return [];
	}
}

function guardarFavoritos(favoritos) {
	localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
}

function crearFavoritoDesdeTarjeta(tarjeta) {
	const imagen = tarjeta.querySelector(".img-game");
	const nombre = tarjeta.querySelector(".card-title")?.textContent.trim();
	const precio = tarjeta.querySelector(".text-info")?.textContent.trim();
	const precioAnterior = tarjeta.querySelector(".text-decoration-line-through")?.textContent.trim();
	const enlaceCompra = tarjeta.querySelector('.card-body a[href*="compras"]');

	if (!imagen || !nombre || !precio) return null;

	return {
		id: nombre.toLocaleLowerCase(),
		nombre,
		imagen: imagen.getAttribute("src"),
		alt: imagen.alt,
		precio,
		precioAnterior: precioAnterior || "",
		descuento: tarjeta.querySelector(".badge")?.textContent.trim() || "",
		enlaceCompra: enlaceCompra?.getAttribute("href") || "#"
	};
}

function actualizarCorazones() {
	const idsFavoritos = new Set(obtenerFavoritos().map((favorito) => favorito.id));

	document.querySelectorAll(".game-card").forEach((tarjeta) => {
		const favorito = crearFavoritoDesdeTarjeta(tarjeta);
		if (!favorito) return;

		tarjeta.querySelectorAll(".favorito-btn").forEach((boton) => {
			const activo = idsFavoritos.has(favorito.id);
			const icono = boton.querySelector("i");
			boton.setAttribute("aria-label", activo ? "Quitar de favoritos" : "Agregar a favoritos");
			if (icono) {
				icono.classList.toggle("bi-heart-fill", activo);
				icono.classList.toggle("bi-heart", !activo);
			}
		});
	});
}

function renderizarFavoritos() {
	const lista = document.getElementById("listaFavoritos");
	if (!lista) return;

	const favoritos = obtenerFavoritos();
	lista.replaceChildren();

	if (favoritos.length === 0) {
		const mensaje = document.createElement("p");
		mensaje.className = "text-center text-white fs-5 py-5";
		mensaje.textContent = "Todavía no tienes juegos favoritos.";
		lista.append(mensaje);
		return;
	}

	favoritos.forEach((favorito) => {
		const columna = document.createElement("div");
		columna.className = "col";

		const tarjeta = document.createElement("div");
		tarjeta.className = "card h-100 game-card text-white position-relative";

		if (favorito.descuento) {
			const descuento = document.createElement("span");
			descuento.className = "badge bg-danger position-absolute m-2";
			descuento.textContent = favorito.descuento;
			tarjeta.append(descuento);
		}

		const botonFavorito = document.createElement("button");
		botonFavorito.type = "button";
		botonFavorito.className = "favorito-btn border-0 bg-transparent";
		botonFavorito.setAttribute("aria-label", "Quitar de favoritos");
		botonFavorito.innerHTML = '<i class="bi bi-heart-fill"></i>';
		tarjeta.append(botonFavorito);

		const imagen = document.createElement("img");
		imagen.src = favorito.imagen;
		imagen.alt = favorito.alt || favorito.nombre;
		imagen.className = "card-img-top img-game";
		tarjeta.append(imagen);

		const cuerpo = document.createElement("div");
		cuerpo.className = "card-body text-center d-flex flex-column";

		const titulo = document.createElement("h5");
		titulo.className = "card-title";
		titulo.textContent = favorito.nombre;
		cuerpo.append(titulo);

		if (favorito.precioAnterior) {
			const precioAnterior = document.createElement("p");
			precioAnterior.className = "text-decoration-line-through text-secondary m-0";
			precioAnterior.textContent = favorito.precioAnterior;
			cuerpo.append(precioAnterior);
		}

		const precio = document.createElement("p");
		precio.className = "text-info fw-bold fs-4";
		precio.textContent = favorito.precio;
		cuerpo.append(precio);

		const comprar = document.createElement("a");
		comprar.href = favorito.enlaceCompra;
		comprar.className = "btn btn-primary mt-auto fw-bold";
		comprar.textContent = "Comprar Ahora";
		cuerpo.append(comprar);

		tarjeta.append(cuerpo);
		columna.append(tarjeta);
		lista.append(columna);
	});
}

document.addEventListener("click", (evento) => {
	const boton = evento.target.closest(".favorito-btn");
	if (!boton) return;

	evento.preventDefault();
	const tarjeta = boton.closest(".game-card");

	if (tarjeta) {
		const favorito = crearFavoritoDesdeTarjeta(tarjeta);
		if (!favorito) return;

		const favoritos = obtenerFavoritos();
		const yaExiste = favoritos.some((guardado) => guardado.id === favorito.id);
		guardarFavoritos(yaExiste
			? favoritos.filter((guardado) => guardado.id !== favorito.id)
			: [...favoritos, favorito]);
	} else {
		const nombre = boton.closest(".card")?.querySelector(".card-title")?.textContent.trim();
		if (!nombre) return;
		guardarFavoritos(obtenerFavoritos().filter((favorito) => favorito.id !== nombre.toLocaleLowerCase()));
	}

	renderizarFavoritos();
	actualizarCorazones();
});

renderizarFavoritos();
actualizarCorazones();
