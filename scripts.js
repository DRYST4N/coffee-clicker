let panel = document.getElementById("panel");
let contador = document.getElementById("contador");
let botonClick = document.getElementById("level");
let botonAuto1 = document.getElementById("auto1");
let botonRevivir = document.getElementById("reboton");

let dinero = 0;
let revivirPrecio = 1000;
let intervaloDinero = setInterval(ganarDinero, 1000);

let coffee = {
    granos: 0,
    level: 1,
    valor: 0.01
}

let mejoraClicks={
    level: 0,
    precio: 25,
    granos: 25
}
let auto1 = {
    level:0,
    precio: 100,
    granos: 100,
    potencia: 0.00
}

panel.addEventListener("click",sumarPuntos);
botonClick.addEventListener("click", comprarMejora);
botonAuto1.addEventListener("click", comprarAuto1);
botonRevivir.addEventListener("click", revivir);

setInterval(sumarPuntosAuto, 1000);

function comprarMejora(){
    if(dinero >= mejoraClicks.precio && coffee.granos >= mejoraClicks.granos){
        dinero -= mejoraClicks.precio;
        coffee.granos -= mejoraClicks.granos;
        mejoraClicks.level++;
        mejoraClicks.precio = Math.floor(mejoraClicks.precio * 1.5);
        actualizarPantalla();
    }
}
function comprarAuto1(){
    if(dinero >= auto1.precio){
        dinero -= auto1.precio;
        coffee.granos -= auto1.granos;
        auto1.level++;
        auto1.potencia += 0.01;
        auto1.precio = Math.floor(auto1.precio * 1.5);
    }
}
function sumarPuntos(){
    coffee.granos = coffee.granos + (0.1 * mejoraClicks.level) + 1; 
    actualizarPantalla();
}

function sumarPuntosAuto(){
    coffee.granos = coffee.granos + auto1.potencia;
    actualizarPantalla();
}

function ganarDinero(){
    dinero += coffee.valor * coffee.granos;
}


function revivir(){
    if(coffee.granos >= revivirPrecio){
        mejora = coffee.valor * 2;
        coffee = {
            granos: 0,
            level: 1,
            valor: mejora
        };

        mejoraClicks={
            level: 0,
            precio: 25,
            granos: 25
        };
        auto1 = {
            level:0,
            precio: 100,
            granos: 100,
            potencia: 0.00
        };
        dinero = 0;
        revivirPrecio *= 10;
        clearInterval(intervaloDinero);
        intervaloDinero = setInterval(ganarDinero, 1000);
        actualizarPantalla();
    }
}

function actualizarPantalla(){
    contador.textContent = "Dinero: " + dinero.toFixed(2) +"€ | Valor: "+coffee.valor + "| Granos: " + coffee.granos.toFixed(2);
    botonClick.textContent = "Nivel: "+ mejoraClicks.level + " | Precio: " + mejoraClicks.precio +"€";
    botonAuto1.textContent = "Nivel: "+ auto1.level + "| Precio: " + auto1.precio+"€";
    botonRevivir.textContent = "Precio: "+ revivirPrecio + " granos"

    if(dinero >= mejoraClicks.precio && coffee.granos >= mejoraClicks.granos){
        botonClick.disabled = false;
    }else {
        botonClick.disabled = true;
    }
    if(dinero >= auto1.precio && coffee.granos >= auto1.granos){
        botonAuto1.disabled = false;
    }else{
        botonAuto1.disabled = true;
    }
    if(coffee.granos >= revivirPrecio){
        botonRevivir.disabled = false;
    }else{
        botonRevivir.disabled = true;
    }
    
}