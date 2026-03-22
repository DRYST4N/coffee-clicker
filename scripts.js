const panel = document.getElementById("panel");
const dineroTexto = document.getElementById("dineroTexto");
const valorTexto = document.getElementById("valorTexto");
const granosTexto = document.getElementById("granosTexto");

const upgradeContainer = document.getElementById("upgradeContainer");
const automationContainer = document.getElementById("automationContainer");
const botonRevivir = document.getElementById("reboton");
const saveToast = document.getElementById("saveToast");

const SAVE_KEY = "coffeeClickerSave";

let dinero = 0;
let revivirPrecio = 1000;


let coffee = {
    granos: 0,
    valor: 0.01
};

const clickUpgrade = {
    id: "clickUpgrade",
    nombre: "Dedos más rápidos",
    descripcion: "Aumenta los granos por click.",
    level: 0,
    precioDinero: 25,
    precioGranos: 25,
    potenciaBase: 1,
    bonusPorNivel: 0.1
};

const automations = [
    {
        id: "auto1",
        nombre: "Barista Novato",
        descripcion: "Produce 0.01 granos por segundo.",
        level: 0,
        precioDinero: 100,
        precioGranos: 100,
        potencia: 0.01
    },
    {
        id: "auto2",
        nombre: "Cafetera Moka",
        descripcion: "Produce 0.05 granos por segundo.",
        level: 0,
        precioDinero: 300,
        precioGranos: 250,
        potencia: 0.05
    },
    {
        id: "auto3",
        nombre: "Tostadora Retro",
        descripcion: "Produce 0.20 granos por segundo.",
        level: 0,
        precioDinero: 900,
        precioGranos: 600,
        potencia: 0.20
    },
    {
        id: "auto4",
        nombre: "Fábrica Pixel",
        descripcion: "Produce 1.00 granos por segundo.",
        level: 0,
        precioDinero: 2500,
        precioGranos: 1200,
        potencia: 1.00
    }
];

panel.addEventListener("click", manejarClickPanel);
botonRevivir.addEventListener("click", revivir);

setInterval(generarGranosAutomaticos, 1000);
setInterval(ganarDinero, 1000);
setInterval(() =>{
    guardarPartida(true);
}, 15000);

renderTienda();
cargarPartida();
actualizarPantalla();

function manejarClickPanel(event) {
    sumarPuntos();
    animarPanel();
    mostrarTextoFlotante(event, `+${obtenerGranosPorClick().toFixed(1)}`);
}

function obtenerGranosPorClick() {
    return clickUpgrade.potenciaBase + (clickUpgrade.bonusPorNivel * clickUpgrade.level);
}

function sumarPuntos() {
    coffee.granos += obtenerGranosPorClick();
    actualizarPantalla();
}

function generarGranosAutomaticos() {
    let total = 0;

    for (const auto of automations) {
        total += auto.level * auto.potencia;
    }

    coffee.granos += total;
    actualizarPantalla();
}

function ganarDinero() {
    dinero += coffee.valor * coffee.granos;
    actualizarPantalla();
}

function comprarMejoraClick() {
    if (dinero >= clickUpgrade.precioDinero && coffee.granos >= clickUpgrade.precioGranos) {
        dinero -= clickUpgrade.precioDinero;
        coffee.granos -= clickUpgrade.precioGranos;

        clickUpgrade.level++;
        clickUpgrade.precioDinero = Math.floor(clickUpgrade.precioDinero * 1.5);
        clickUpgrade.precioGranos = Math.floor(clickUpgrade.precioGranos * 1.4);

        renderTienda();
        actualizarPantalla();
    }
}

function comprarAutomatizacion(id) {
    const auto = automations.find(item => item.id === id);

    if (!auto) return;

    if (dinero >= auto.precioDinero && coffee.granos >= auto.precioGranos) {
        dinero -= auto.precioDinero;
        coffee.granos -= auto.precioGranos;

        auto.level++;
        auto.precioDinero = Math.floor(auto.precioDinero * 1.6);
        auto.precioGranos = Math.floor(auto.precioGranos * 1.45);

        renderTienda();
        actualizarPantalla();
    }
}

function revivir() {
    if (coffee.granos >= revivirPrecio) {
        const nuevoValor = coffee.valor * 2;

        dinero = 0;
        coffee = {
            granos: 0,
            valor: nuevoValor
        };

        clickUpgrade.level = 0;
        clickUpgrade.precioDinero = 25;
        clickUpgrade.precioGranos = 25;

        automations[0].level = 0;
        automations[0].precioDinero = 100;
        automations[0].precioGranos = 100;

        automations[1].level = 0;
        automations[1].precioDinero = 300;
        automations[1].precioGranos = 250;

        automations[2].level = 0;
        automations[2].precioDinero = 900;
        automations[2].precioGranos = 600;

        automations[3].level = 0;
        automations[3].precioDinero = 2500;
        automations[3].precioGranos = 1200;

        revivirPrecio *= 10;

        renderTienda();
        actualizarPantalla();
    }
}

function renderTienda() {
    upgradeContainer.innerHTML = `
        <div class="shop-card">
            <div class="card-title-pixel">${clickUpgrade.nombre}</div>
            <div class="card-subtext">${clickUpgrade.descripcion}</div>
            <button id="btnClickUpgrade" class="pixel-btn mt-3">
                Nivel ${clickUpgrade.level} | ${clickUpgrade.precioDinero}€ | ${clickUpgrade.precioGranos} granos
            </button>
        </div>
    `;

    automationContainer.innerHTML = automations.map(auto => `
        <div class="shop-card">
            <div class="card-title-pixel">${auto.nombre}</div>
            <div class="card-subtext">
                ${auto.descripcion}<br>
                Producción total: ${(auto.level * auto.potencia).toFixed(2)}/s
            </div>
            <button class="pixel-btn mt-3 auto-buy-btn" data-id="${auto.id}">
                Nivel ${auto.level} | ${auto.precioDinero}€ | ${auto.precioGranos} granos
            </button>
        </div>
    `).join("");

    document.getElementById("btnClickUpgrade")
        .addEventListener("click", comprarMejoraClick);

    document.querySelectorAll(".auto-buy-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            comprarAutomatizacion(btn.dataset.id);
        });
    });
}

function actualizarPantalla() {
    dineroTexto.textContent = dinero.toFixed(2);
    valorTexto.textContent = coffee.valor.toFixed(2);
    granosTexto.textContent = coffee.granos.toFixed(2);

    const btnClick = document.getElementById("btnClickUpgrade");
    if (btnClick) {
        btnClick.disabled = !(dinero >= clickUpgrade.precioDinero && coffee.granos >= clickUpgrade.precioGranos);
    }

    automations.forEach(auto => {
        const btn = document.querySelector(`[data-id="${auto.id}"]`);
        if (btn) {
            btn.disabled = !(dinero >= auto.precioDinero && coffee.granos >= auto.precioGranos);
        }
    });

    botonRevivir.textContent = `Precio: ${revivirPrecio} granos`;
    botonRevivir.disabled = coffee.granos < revivirPrecio;
}

function animarPanel() {
    panel.classList.remove("panel-pressed");
    void panel.offsetWidth;
    panel.classList.add("panel-pressed");

    setTimeout(() => {
        panel.classList.remove("panel-pressed");
    }, 80);
}

function mostrarTextoFlotante(event, texto) {
    const plus = document.createElement("span");
    plus.className = "floating-plus";
    plus.textContent = texto;

    const rect = panel.getBoundingClientRect();
    plus.style.left = `${event.clientX - rect.left}px`;
    plus.style.top = `${event.clientY - rect.top}px`;

    panel.appendChild(plus);

    setTimeout(() => {
        plus.remove();
    }, 600);
}


function guardarPartida(mostrarAviso = false) {
    const saveData = {
        dinero,
        revivirPrecio,
        coffee,
        clickUpgrade,
        automations
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));

    if (mostrarAviso) {
        mostrarGuardado();
    }
}

function cargarPartida() {
    const saveData = localStorage.getItem(SAVE_KEY);

    if (!saveData) return;

    const parsed = JSON.parse(saveData);

    dinero = parsed.dinero ?? 0;
    revivirPrecio = parsed.revivirPrecio ?? 1000;

    if (parsed.coffee) {
        coffee = parsed.coffee;
    }

    if (parsed.clickUpgrade) {
        clickUpgrade.level = parsed.clickUpgrade.level ?? 0;
        clickUpgrade.precioDinero = parsed.clickUpgrade.precioDinero ?? 25;
        clickUpgrade.precioGranos = parsed.clickUpgrade.precioGranos ?? 25;
    }

    if (parsed.automations && Array.isArray(parsed.automations)) {
        parsed.automations.forEach((savedAuto, index) => {
            if (automations[index]) {
                automations[index].level = savedAuto.level ?? automations[index].level;
                automations[index].precioDinero = savedAuto.precioDinero ?? automations[index].precioDinero;
                automations[index].precioGranos = savedAuto.precioGranos ?? automations[index].precioGranos;
            }
        });
    }

    renderTienda();
    actualizarPantalla();
}

function mostrarGuardado() {
    saveToast.classList.add("show");

    clearTimeout(mostrarGuardado._timeout);

    mostrarGuardado._timeout = setTimeout(() => {
        saveToast.classList.remove("show");
    }, 1200);
}