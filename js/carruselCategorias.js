const slider = document.getElementById("categoriasSlider");
const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");

let posicion = 0;
const movimiento = 140;

btnSiguiente.addEventListener("click", () => {

    const limite = slider.scrollWidth - slider.parentElement.clientWidth;

    posicion += movimiento;

    if (posicion > limite) {
        posicion = limite;
    }

    slider.style.transform = `translateX(-${posicion}px)`;
});


btnAnterior.addEventListener("click", () => {

    posicion -= movimiento;

    if (posicion < 0) {
        posicion = 0;
    }

    slider.style.transform = `translateX(-${posicion}px)`;
});