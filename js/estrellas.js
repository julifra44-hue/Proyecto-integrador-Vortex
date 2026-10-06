document.addEventListener("DOMContentLoaded", function() {
    const estrellas = document.querySelectorAll(".estella");
    const textoCalificacion = document.getElementById("texto-calificacion");
    const btnEnviar = document.getElementById("btn-enviar-valoracion");
    
    const descripciones = {
        1: "Malo 😡",
        2: "Regular 😐",
        3: "Bueno 🙂",
        4: "Muy bueno 😊",
        5: "¡Excelente! 🤩"
    };

    const textosCortos = {
        1: "Malo",
        2: "Regular",
        3: "Bueno",
        4: "Muy bueno",
        5: "Excelente"
    };

    let valorSeleccionado = 0;

    estrellas.forEach((estrella) => {
        estrella.addEventListener("mouseenter", function() {
            const valor = this.getAttribute("data-valor");
            actualizarEstrellasVisuales(valor);
            textoCalificacion.textContent = descripciones[valor];
        });

        estrella.parentElement.addEventListener("mouseleave", function() {
            actualizarEstrellasVisuales(valorSeleccionado);
            if (valorSeleccionado === 0) {
                textoCalificacion.textContent = "Haz clic en una estrella";
            } else {
                textoCalificacion.textContent = descripciones[valorSeleccionado];
            }
        });

        estrella.addEventListener("click", function() {
            valorSeleccionado = Number(this.getAttribute("data-valor"));
            actualizarEstrellasVisuales(valorSeleccionado);
            textoCalificacion.textContent = descripciones[valorSeleccionado];
            btnEnviar.removeAttribute("disabled");
        });
    });

    function actualizarEstrellasVisuales(hastaValor) {
        estrellas.forEach((est) => {
            const val = Number(est.getAttribute("data-valor"));
            if (val <= hastaValor) {
                est.classList.remove("bi-star");
                est.classList.add("bi-star-fill");
            } else {
                est.classList.remove("bi-star-fill");
                est.classList.add("bi-star");
            }
        });
    }

    // Acción al dar clic en enviar
    btnEnviar.addEventListener("click", function() {
        if (valorSeleccionado > 0) {
            // 1. Actualizar la tarjeta principal de la derecha de forma segura
            const badgePrincipal = document.querySelector(".eneba-badge-rating");
            if (badgePrincipal) {
                const textoSpan = badgePrincipal.querySelector("span");
                const contenedorEstrellas = badgePrincipal.querySelector("div");

                // Actualizar el texto (Ej. "Excelente", "Bueno", etc.)
                textoSpan.textContent = textosCortos[valorSeleccionado];

                // Limpiar las estrellas anteriores
                contenedorEstrellas.innerHTML = "";

                // Crear dinámicamente los 5 iconos de estrellas con JavaScript puro
                for (let i = 1; i <= 5; i++) {
                    const icono = document.createElement("i");
                    icono.className = i <= valorSeleccionado ? "bi bi-star-fill" : "bi bi-star";
                    contenedorEstrellas.appendChild(icono);
                    contenedorEstrellas.appendChild(document.createTextNode(" "));
                }
            }

            // 2. Cerrar el modal de Bootstrap
            const modalEl = document.getElementById('modalValoracion');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
        }
    });
});