document.addEventListener('DOMContentLoaded', () => {

    const input = document.getElementById('buscadorInput');
    const sugerenciasBox = document.getElementById('sugerenciasBox');
    const contenedorBuscador = document.querySelector('.buscador-contenedor');
    const botonBuscar = document.getElementById('botonBuscar');

    const paginasJuegos = {
        "EA Sports FC 25": "fc25.html",
        "Dragon Ball: Sparking! Zero": "dragon-ball.html",
        "God of War Ragnarok": "god-of-war.html",
        "Elden Ring": "elden-ring.html",
        "Minecraft": "minecraft.html",
        "GTA V": "gta-v.html",
        "Spider-Man 2": "spiderman-2.html",
        "Resident Evil Village": "resident-evil-village.html",
        "The Last Of Us": "the-last-of-us.html",
        "Resident Evil 4": "resident-evil-4.html",
        "Call of Duty: Black Ops 6": "black-ops-6.html",
        "Halo Infinite": "halo-infinite.html",
        "Red Dead Redemption 2": "red-dead-redemption-2.html",
        "Gears of War 4": "gears-of-war-4.html",
        "Doom": "doom.html",
        "Cyberpunk 2077": "cyberpunk-2077.html",
        "Mortal Kombat 1": "mortal-kombat-1.html",
        "Forza Horizon 5": "forza-horizon-5.html",
        "Street Fighter  6": "street-fighter-6.html",
        "Fortnite": "fortnite.html"
    };

    if (!input || !sugerenciasBox || !contenedorBuscador) {
        console.error('No se encontró algún elemento del buscador.');
        return;
    }

    const tarjetas = document.querySelectorAll('.col');

    const juegos = Array.from(tarjetas).filter(tarjeta => {
        return tarjeta.querySelector('.card-title');
    });

    function mostrarSugerencias(texto = '') {

        const busqueda = texto.toLowerCase().trim();

        sugerenciasBox.innerHTML = '';

        const coincidencias = juegos.filter(tarjeta => {

            const titulo = tarjeta.querySelector('.card-title');

            return titulo.textContent
                .toLowerCase()
                .includes(busqueda);
        });

        if (busqueda === '') {

            sugerenciasBox.innerHTML = `
                <div class="sugerencias-header">
                    <i class="fa-solid fa-fire"></i>
                    BÚSQUEDAS TENDENCIA
                </div>
            `;

            juegos.slice(0, 5).forEach(tarjeta => {

                const titulo = tarjeta.querySelector('.card-title');

                crearSugerencia(titulo.textContent.trim());
            });

        } else {

            if (coincidencias.length > 0) {

                sugerenciasBox.innerHTML = `
                    <div class="sugerencias-header">
                        COINCIDENCIAS EN TIENDA
                    </div>
                `;

                coincidencias.forEach(tarjeta => {

                    const titulo = tarjeta.querySelector('.card-title');

                    crearSugerencia(titulo.textContent.trim());
                });

            } else {

                sugerenciasBox.innerHTML = `
                    <div class="sugerencia-item text-secondary">
                        No se encontró "${texto}"
                    </div>
                `;
            }
        }

        sugerenciasBox.style.display = 'block';
    }

    function crearSugerencia(nombre) {

        const sugerencia = document.createElement('div');

        sugerencia.className = 'sugerencia-item';

        sugerencia.innerHTML = `
            <i class="fa-solid fa-magnifying-glass text-secondary"></i>
            <span>${nombre}</span>
        `;

        sugerencia.addEventListener('click', () => {

            const pagina = paginasJuegos[nombre];

            if (pagina) {

                window.location.href = pagina;

            } else {

                console.error(`No se encontró una página para: ${nombre}`);

            }

        });

        sugerenciasBox.appendChild(sugerencia);
    }

    function filtrarJuegos(texto) {

        const busqueda = texto.toLowerCase().trim();

        juegos.forEach(tarjeta => {

            const titulo = tarjeta.querySelector('.card-title');

            const nombreJuego = titulo.textContent
                .toLowerCase()
                .trim();

            if (busqueda === '' || nombreJuego.includes(busqueda)) {

                tarjeta.classList.remove('d-none');

            } else {

                tarjeta.classList.add('d-none');

            }
        });
    }

    input.addEventListener('focus', () => {

        mostrarSugerencias(input.value);

    });

    input.addEventListener('input', () => {

        mostrarSugerencias(input.value);

        filtrarJuegos(input.value);

    });

    if (botonBuscar) {

        botonBuscar.addEventListener('click', () => {

            const busqueda = input.value.toLowerCase().trim();

            const juegoEncontrado = juegos.find(tarjeta => {

                const titulo = tarjeta.querySelector('.card-title');

                return titulo.textContent
                    .toLowerCase()
                    .trim()
                    .includes(busqueda);
            });

            if (juegoEncontrado) {

                const titulo = juegoEncontrado.querySelector('.card-title');
                const nombre = titulo.textContent.trim();
                const pagina = paginasJuegos[nombre];

                if (pagina) {

                    window.location.href = pagina;

                }
            }

            sugerenciasBox.style.display = 'none';

        });
    }

    document.addEventListener('click', (e) => {

        if (!contenedorBuscador.contains(e.target)) {

            sugerenciasBox.style.display = 'none';

        }
    });

});