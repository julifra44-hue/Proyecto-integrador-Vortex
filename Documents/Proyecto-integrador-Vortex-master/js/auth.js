const usuarios = [

    {
        usuario: "admin",
        password: "1234",
        rol: "admin"
    },

    {
        usuario: "cliente",
        password: "1111",
        rol: "cliente"
    }

];

function login(){

    const usuario = document
        .getElementById("usuario")
        .value;

    const password = document
        .getElementById("password")
        .value;

    const usuarioEncontrado = usuarios.find(
        u =>
            u.usuario === usuario &&
            u.password === password
    );

    if(usuarioEncontrado){

        localStorage.setItem(
            "usuarioLogueado",
            JSON.stringify(usuarioEncontrado)
        );

        if(usuarioEncontrado.rol === "admin"){

            window.location.href = "admin.html";

        }else{

            window.location.href = "index3.html";

        }

    }else{

        alert("Usuario o contraseña incorrectos");

    }

}