(() => {
	const COP_PER_USD = 4000;
	const translations = {
		"Busca juegos, recargas y más": "Search games, top-ups and more",
		"SECCIONES PRINCIPALES": "MAIN SECTIONS",
		"Categorías": "Categories",
		"Juegos -90%": "Games -90%",
		"Ofertas PC.": "PC Deals",
		"Ofertas Consolas": "Console Deals",
		"Ofertas Juegos.": "Game Deals",
		"Los mejores PC llegado a nuestra tienda.": "The best PCs have arrived at our store.",
		"Los mejores consolas del 2026: PS5 y Xbox Series X disponibles ahora.": "The best consoles of 2026: PS5 and Xbox Series X available now.",
		"Catalogo de 20 Juegos en descuento: disponibles Ahora": "A catalog of 20 discounted games, available now",
		"Ver Catalogo": "View Catalog",
		"Saber mas.": "Learn more",
		"Ver Ofertas": "View deals",
		"Comprar Ahora": "Buy Now",
		"Comprar ahora": "Buy now",
		"Latinoamérica": "Latin America",
		"Se puede activar en Colombia. Revisa las restricciones por región.": "Can be activated in Colombia. Check regional restrictions.",
		"Se activa en Steam. Consulta la guía de activación.": "Activates on Steam. See the activation guide.",
		"Código Digital": "Digital Code",
		"Esta es una edición digital del producto (CD-KEY). Entrega inmediata.": "This is a digital edition of the product (CD key). Instant delivery.",
		"Excelente": "Excellent",
		"OFERTA DESTACADA": "FEATURED DEAL",
		"Precio del producto seleccionado": "Selected product price",
		"Pago seguro garantizado": "Secure payment guaranteed",
		"Valora este producto": "Rate this product",
		"Selecciona tu puntuación de 1 a 5 estrellas": "Select your rating from 1 to 5 stars",
		"Haz clic en una estrella": "Click a star",
		"Enviar valoración": "Submit rating",
		"Haz tu reseña": "Write a review",
		"Reseñas: 2": "Reviews: 2",
		"Tu nombre": "Your name",
		"Escribe tu nombre": "Enter your name",
		"Juegos": "Games",
		"Consolas": "Consoles",
		"PC Gamer": "Gaming PCs",
		"Monitores": "Monitors",
		"Torres": "Desktop PCs",
		"Aventura": "Adventure",
		"Deportes": "Sports",
		"Estrategia": "Strategy",
		"eCards de": "eCards for",
		"Ventiladores": "Fans",
		"Memorias": "Memory",
		"Tarjetas Steam": "Steam Gift Cards",
		"Fortnite": "Fortnite",
		"Amazon": "Amazon",
		"Favoritos": "Favorites",
		"Carrito": "Cart",
		"Inicio": "Home",
		"Descuento": "Discount",
		"Descripción": "Description",
		"Reseñas": "Reviews",
		"Detalles": "Details",
		"Disponibles Ahora": "Available Now",
		"Volver arriba": "Back to top",
		"Sobre Vortex": "About Vortex",
		"Sobre Nosotros": "About Us",
		"Contactanos": "Contact Us",
		"Vacantes": "Careers",
		"Confianza y transparencia": "Trust and transparency",
		"Comprar": "Shop",
		"Como Comprar": "How to Buy",
		"Colecciones": "Collections",
		"Descuentos": "Discounts",
		"Ayuda": "Help",
		"Preguntas Frecuentes (Juegos, Consolas y PC)": "Frequently Asked Questions (Games, Consoles and PC)",
		"Como activar tus Juegos": "How to activate your games",
		"Crear un ticket": "Create a ticket",
		"Politica de devoluciones": "Return policy",
		"Comunidad": "Community",
		"Noticias de gaming": "Gaming news",
		"Sorteos": "Giveaways",
		"Afiliados": "Affiliates",
		"Negocios": "Business",
		"Vende con Nosotros": "Sell with Us",
		"Anunciate": "Advertise",
		"Síguenos": "Follow Us",
		"Descargar la app de Vortex": "Download the Vortex app",
		"Ve qué dijeron de nosotros": "See what people say about us",
		"Obtén ofertas personalizadas de juegos, consolas y PC": "Get personalized deals on games, consoles and PCs",
		"Ingresa tu email": "Enter your email",
		"Suscribirse": "Subscribe",
		"Puedes darte de baja en cualquier momento. Visita el apartado": "You can unsubscribe at any time. Visit the",
		"Aviso de Privacidad": "Privacy Notice",
		"Términos y Condiciones": "Terms and Conditions",
		"Preferencias de las cookies": "Cookie preferences",
		"Todos los derechos reservados": "All rights reserved",
		"Español Latinoamericano | COP": "Spanish (Latin America) | COP",
		"English (US) | USD": "English (US) | USD"
	};
	const originalText = new WeakMap();
	const originalAttributes = new WeakMap();

	let savedPreferences = {};
	try {
		savedPreferences = JSON.parse(localStorage.getItem("preferenciasTienda")) || {};
	} catch {
		savedPreferences = {};
	}

	const queryParams = new URLSearchParams(window.location.search);
	let language = queryParams.get("idioma") === "en"
		? "en"
		: queryParams.get("idioma") === "es"
			? "es"
			: savedPreferences.language === "en" ? "en" : "es";
	let currency = queryParams.get("moneda") === "USD" || (!queryParams.has("moneda") && language === "en")
		? "USD"
		: "COP";

	function formatPrice(priceText) {
		const amountCop = Number(priceText.replace(/[^\d]/g, ""));
		if (!Number.isFinite(amountCop)) return priceText;

		if (currency === "USD") {
			return new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
				maximumFractionDigits: 2
			}).format(amountCop / COP_PER_USD);
		}

		return `$${new Intl.NumberFormat("es-CO", {
			maximumFractionDigits: 0
		}).format(amountCop)}`;
	}

	function translatePage() {
		const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
		let textNode;

		while ((textNode = walker.nextNode())) {
			if (textNode.parentElement.closest("script, style, noscript, [data-locale-dynamic]")) continue;
			if (!originalText.has(textNode)) originalText.set(textNode, textNode.nodeValue);

			const source = originalText.get(textNode);
			const trimmed = source.trim();
			if (!trimmed) continue;

			let translated = source;
			if (/^\$\s?[\d.,]+$/.test(trimmed)) {
				translated = source.replace(trimmed, formatPrice(trimmed));
			} else if (language === "en" && translations[trimmed]) {
				translated = source.replace(trimmed, translations[trimmed]);
			}
			textNode.nodeValue = translated;
		}

		document.documentElement.lang = language;
		document.querySelectorAll("[placeholder], [title]").forEach((element) => {
			["placeholder", "title"].forEach((attribute) => {
				if (!element.hasAttribute(attribute)) return;

				let originals = originalAttributes.get(element);
				if (!originals) {
					originals = {};
					originalAttributes.set(element, originals);
				}
				if (originals[attribute] === undefined) {
					originals[attribute] = element.getAttribute(attribute);
				}

				const source = originals[attribute];
				element.setAttribute(attribute, language === "en" ? (translations[source] || source) : source);
			});
		});

		document.querySelectorAll(".dropdown").forEach((dropdown) => {
			const label = dropdown.querySelector("button span[data-store-locale]");
			if (!label) return;
			label.textContent = language === "en"
				? "🇺🇸 English (US) | USD"
				: "🇨🇴 Español Latinoamericano | COP";
		});

		document.querySelectorAll(".lang-btn").forEach((button) => {
			const flag = button.querySelector("span");
			if (flag) flag.textContent = language === "en" ? "🇺🇸" : "🇨🇴";
			const text = Array.from(button.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
			if (text) text.nodeValue = language === "en"
				? " English (US) | USD"
				: " Español Latinoamericano | COP";
		});
		window.dispatchEvent(new CustomEvent("store-locale-change", {
			detail: { language, currency }
		}));
	}

	function setupLocaleMenus() {
		document.querySelectorAll(".dropdown").forEach((dropdown) => {
			const label = dropdown.querySelector("button span");
			const menu = dropdown.querySelector(".dropdown-menu");
			if (!label || !menu || !menu.textContent.includes("Español")) return;

			label.dataset.storeLocale = "";
			menu.querySelectorAll("a.dropdown-item").forEach((option) => {
				const text = option.textContent;
				if (text.includes("Español") || text.includes("English")) {
					option.dataset.language = text.includes("English") ? "en" : "es";
					option.addEventListener("click", (event) => {
						event.preventDefault();
						language = option.dataset.language;
						currency = language === "en" ? "USD" : "COP";
						localStorage.setItem("preferenciasTienda", JSON.stringify({ language, currency }));
						const currentUrl = new URL(window.location.href);
						currentUrl.searchParams.set("idioma", language);
						currentUrl.searchParams.set("moneda", currency);
						history.replaceState(null, "", currentUrl);
						translatePage();
					});
				} else if (/\b(EUR|MXN)\b/.test(text)) {
					option.closest("li")?.remove();
				}
			});
		});
	}

	setupLocaleMenus();
	translatePage();
})();
