const usuario = JSON.parse(
    localStorage.getItem("usuarioLogueado")
);

if(!usuario){

    window.location.href = "index.html";

}

console.log("Usuario activo:", usuario);

if(usuario.rol !== "admin"){

    document
        .getElementById("btnAdmin")
        .style.display = "none";

}