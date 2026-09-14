const usuario = JSON.parse(
    localStorage.getItem("usuarioLogueado")
);

if(!usuario || usuario.rol !== "admin"){

    window.location.href = "index.html";

}

const juegos = [];

function agregarJuego(){

    const nombre = prompt("Nombre del juego:");

    const precio = prompt("Precio:");

    const nuevoJuego = {

        nombre,
        precio

    };

    juegos.push(nuevoJuego);

    mostrarJuegos();

}

function mostrarJuegos(){

    const contenedor =
        document.getElementById("listaJuegos");

    contenedor.innerHTML = "";

    juegos.forEach((juego, index) => {

        contenedor.innerHTML += `

        <div class="card bg-black text-white mb-3">

            <div class="card-body">

                <h4>${juego.nombre}</h4>

                <p>$${juego.precio}</p>

                <button
                    class="btn btn-danger"
                    onclick="eliminarJuego(${index})"
                >
                    Eliminar
                </button>

            </div>

        </div>

        `;

    });

}

function eliminarJuego(index){

    juegos.splice(index, 1);

    mostrarJuegos();

}

function cerrarSesion(){

    localStorage.removeItem("usuarioLogueado");

    window.location.href = "index.html";

}