const panel = document.getElementById("panel");
const dineroTexto = document.getElementById("dineroTexto");
const valorTexto = document.getElementById("valorTexto");
const granosTexto = document.getElementById("granosTexto");

const negocioTexto = document.getElementById("negocioTexto");
const metaTexto = document.getElementById("metaTexto");
const faltanTexto = document.getElementById("faltanTexto");

const upgradeContainer = document.getElementById("upgradeContainer");
const automationContainer = document.getElementById("automationContainer");
const botonRevivir = document.getElementById("reboton");

const SAVE_KEY = "coffeeClickerSave";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let dinero = 0;
let revivirPrecio = 1000;

let coffee = {
    granos: 0,
    valor: 0.01
};

const etapasNegocio = [
    { nombre: "Puesto callejero", requisito: 0 },
    { nombre: "Cafetería local", requisito: 50 },
    { nombre: "Tostadora artesanal", requisito: 250 },
    { nombre: "Fábrica regional", requisito: 1000 },
    { nombre: "Franquicia nacional", requisito: 5000 },
    { nombre: "Imperio cafetero", requisito: 20000 }
];

const clickUpgrade = {
    id: "clickUpgrade",
    nombre: "Manos entrenadas",
    descripcion: "Aumenta los granos obtenidos por click.",
    level: 0,
    precioDineroBase: 25,
    precioGranosBase: 25,
    precioDinero: 25,
    precioGranos: 25,
    potenciaBase: 1,
    bonusPorNivel: 0.1
};

const automations = [
    {
        id: "auto1",
        nombre: "Empleado",
        descripcion: "Prepara café automáticamente en tu puesto.",
        level: 0,
        precioDineroBase: 100,
        precioGranosBase: 100,
        precioDinero: 100,
        precioGranos: 100,
        potencia: 0.01,
        desbloqueo: 0
    },
    {
        id: "auto2",
        nombre: "Cafetera industrial",
        descripcion: "Acelera la producción en la cafetería.",
        level: 0,
        precioDineroBase: 300,
        precioGranosBase: 250,
        precioDinero: 300,
        precioGranos: 250,
        potencia: 0.05,
        desbloqueo: 50
    },
    {
        id: "auto3",
        nombre: "Tostadora profesional",
        descripcion: "Transforma el grano en producción seria.",
        level: 0,
        precioDineroBase: 900,
        precioGranosBase: 600,
        precioDinero: 900,
        precioGranos: 600,
        potencia: 0.20,
        desbloqueo: 250
    },
    {
        id: "auto4",
        nombre: "Fábrica de café",
        descripcion: "Producción automatizada a gran escala.",
        level: 0,
        precioDineroBase: 2500,
        precioGranosBase: 1200,
        precioDinero: 2500,
        precioGranos: 1200,
        potencia: 1.00,
        desbloqueo: 1000
    },
    {
        id: "auto5",
        nombre: "Franquicia",
        descripcion: "Expande tu negocio a nuevas ciudades.",
        level: 0,
        precioDineroBase: 7000,
        precioGranosBase: 2500,
        precioDinero: 7000,
        precioGranos: 2500,
        potencia: 4.00,
        desbloqueo: 5000
    },
    {
        id: "auto6",
        nombre: "Corporación cafetera",
        descripcion: "Convierte tu marca en un gigante del café.",
        level: 0,
        precioDineroBase: 18000,
        precioGranosBase: 8000,
        precioDinero: 18000,
        precioGranos: 8000,
        potencia: 12.00,
        desbloqueo: 20000
    }
];

panel.addEventListener("click", manejarClickPanel);
botonRevivir.addEventListener("click", revivir);

setInterval(generarGranosAutomaticos, 1000);
setInterval(ganarDinero, 1000);
setInterval(() => guardarPartida(false), 15000);

async function iniciarJuego() {
    await cargarPartida();
    renderTienda();
    actualizarPantalla();
}

iniciarJuego();

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
    renderTienda();
    actualizarPantalla();
}

function generarGranosAutomaticos() {
    let total = 0;

    for (const auto of automations) {
        total += auto.level * auto.potencia;
    }

    coffee.granos += total;
    renderTienda();
    actualizarPantalla();
}

function ganarDinero() {
    dinero += coffee.valor * coffee.granos;
    renderTienda();
    actualizarPantalla();
}

function obtenerEtapaActual() {
    let etapaActual = etapasNegocio[0];

    for (const etapa of etapasNegocio) {
        if (coffee.granos >= etapa.requisito) {
            etapaActual = etapa;
        }
    }

    return etapaActual;
}

function obtenerSiguienteEtapa() {
    for (const etapa of etapasNegocio) {
        if (coffee.granos < etapa.requisito) {
            return etapa;
        }
    }

    return null;
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
        guardarPartida(true);
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
        guardarPartida(true);
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

        automations.forEach(auto => {
            auto.level = 0;
            auto.precioDinero = auto.precioDineroBase;
            auto.precioGranos = auto.precioGranosBase;
        });

        revivirPrecio *= 10;

        renderTienda();
        actualizarPantalla();
        guardarPartida(true);
    }
}

function puedeComprarClickUpgrade() {
    return dinero >= clickUpgrade.precioDinero &&
           coffee.granos >= clickUpgrade.precioGranos;
}

function puedeComprarAuto(auto) {
    return dinero >= auto.precioDinero &&
           coffee.granos >= auto.precioGranos;
}

function automatizacionDesbloqueada(index) {
    if (index === 0) return true;
    return automations[index - 1].level > 0;
}

function renderTienda() {
    const upgradeDisponible = puedeComprarClickUpgrade();

    upgradeContainer.innerHTML = `
        <div class="shop-card">
            <div class="card-title-pixel">${clickUpgrade.nombre}</div>
            <div class="card-subtext">${clickUpgrade.descripcion}</div>
            <button 
                id="btnClickUpgrade" 
                class="pixel-btn mt-3"
                ${upgradeDisponible ? "" : "disabled"}
            >
                Nivel ${clickUpgrade.level} | ${clickUpgrade.precioDinero}€ | ${clickUpgrade.precioGranos} granos
            </button>
        </div>
    `;

    automationContainer.innerHTML = automations.map((auto, index) => {
        const desbloqueada = automatizacionDesbloqueada(index);

        if (!desbloqueada) {
            return `
                <div class="shop-card secret-card">
                    <div class="card-title-pixel">???</div>
                    <div class="card-subtext">
                        Sigue expandiendo tu negocio para desbloquear esta mejora.
                    </div>
                    <button class="pixel-btn mt-3" disabled>
                        BLOQUEADA
                    </button>
                </div>
            `;
        }

        const disponible = puedeComprarAuto(auto);

        return `
            <div class="shop-card">
                <div class="card-title-pixel">${auto.nombre}</div>
                <div class="card-subtext">
                    ${auto.descripcion}<br>
                    Se desbloquea en: ${auto.desbloqueo} granos<br>
                    Producción total: ${(auto.level * auto.potencia).toFixed(2)}/s
                </div>
                <button
                    class="pixel-btn mt-3 auto-buy-btn"
                    data-id="${auto.id}"
                    ${disponible ? "" : "disabled"}
                >
                    Nivel ${auto.level} | ${auto.precioDinero}€ | ${auto.precioGranos} granos
                </button>
            </div>
        `;
    }).join("");

    const btnClickUpgrade = document.getElementById("btnClickUpgrade");
    if (btnClickUpgrade) {
        btnClickUpgrade.addEventListener("click", comprarMejoraClick);
    }

    document.querySelectorAll(".auto-buy-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            comprarAutomatizacion(btn.dataset.id);
        });
    });
}

function actualizarPantalla() {
    const etapaActual = obtenerEtapaActual();
    const siguienteEtapa = obtenerSiguienteEtapa();

    dineroTexto.textContent = dinero.toFixed(2);
    valorTexto.textContent = coffee.valor.toFixed(2);
    granosTexto.textContent = coffee.granos.toFixed(2);

    negocioTexto.textContent = etapaActual.nombre;

    if (siguienteEtapa) {
        metaTexto.textContent = siguienteEtapa.nombre;
        faltanTexto.textContent = Math.max(0, siguienteEtapa.requisito - coffee.granos).toFixed(2);
    } else {
        metaTexto.textContent = "Máximo alcanzado";
        faltanTexto.textContent = "0";
    }

    botonRevivir.textContent = `Precio: ${revivirPrecio} granos`;
    botonRevivir.disabled = coffee.granos < revivirPrecio;
}

function renderTiendaSiDesbloqueaAlgo() {
    const visiblesAntes = document.querySelectorAll(".auto-buy-btn, .secret-card").length;
    renderTienda();
    const visiblesDespues = document.querySelectorAll(".auto-buy-btn, .secret-card").length;

    if (visiblesAntes !== visiblesDespues) {
        actualizarPantalla();
    }
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

//------------------------------------------------------
// Logica para guardar y cargar la partida 
//-----------------------------------------------------

function obtenerPlayerId(){
    let playerId = localStorage.getItem("coffeeClickerPlayerId");
    if(!playerId){
        playerId = crypto.randomUUID();
        localStorage.setItem("coffeeClickerPlayerId", playerId);
    }
    return playerId
}

function obtenerEstadoCompleto(){
    return {
        dinero,
        revivirPrecio,
        coffee,
        clickUpgrade,
        automations
    };
    
}

async function guardarPartida() {
    const estado  =obtenerEstadoCompleto();
    const playerId = obtenerPlayerId();

    //LO guardamos como backup
    localStorage.setItem(SAVE_KEY, JSON.stringify(estado));

    //Guardamos en SUpabase
    const { error } = await supabaseClient
        .from("partidas")
        .upsert(
            { player_id: playerId, estado: estado, updated_at: new Date().toISOString() },
            { onConflict: "player_id" }
        );

    if(error){
        console.error("Error guardando en Supabase:", error.message);
    }

};

async function cargarPartida() {
    const playerId = obtenerPlayerId();

    // Intentar cargar desde Supabase
    const { data, error } = await supabaseClient
        .from("partidas")
        .select("estado")
        .eq("player_id", playerId)
        .single();

    if (data && data.estado) {
        cargarEstado(data.estado);
        return;
    }

    // Si falla o no existe, usar localStorage como fallback
    console.warn("No hay datos en Supabase, cargando desde localStorage:", error?.message);
    const saveLocal = localStorage.getItem(SAVE_KEY);
    if (saveLocal) {
        cargarEstado(JSON.parse(saveLocal));
    }
};

function cargarEstado(data){
    dinero = data.dinero ?? 0;
    revivirPrecio = data.revivirPrecio ?? 1000;

    if(data.coffee){
        coffee = data.coffee;
    }
    if(data.clickUpgrade){
        clickUpgrade.level = data.clickUpgrade.level ?? 0;
        clickUpgrade.precioDinero = data.clickUpgrade.precioDinero ?? precioDineroBase;
        clickUpgrade.precioGranos = data.clickUpgrade.precioGranos ?? precioGranosBase;
    }

    if (data.automations && Array.isArray(data.automations)) {
        data.automations.forEach((savedAuto, index) => {
            if (automations[index]) {
                automations[index].level = savedAuto.level ?? automations[index].level;
                automations[index].precioDinero = savedAuto.precioDinero ?? automations[index].precioDinero;
                automations[index].precioGranos = savedAuto.precioGranos ?? automations[index].precioGranos;
            }
        });
    }

}

//Formulario

const feedbackForm = document.getElementById("feedbackForm");
const feedbackNegocio = document.getElementById("feedbackNegocio");
const feedbackDinero = document.getElementById("feedbackDinero");
const feedbackGranos = document.getElementById("feedbackGranos");
const feedbackValor = document.getElementById("feedbackValor");
const feedbackURL = document.getElementById("feedbackURL");
const feedbackFecha = document.getElementById("feedbackFecha");

if (feedbackForm) {
    feedbackForm.addEventListener("submit", () => {
        feedbackNegocio.value = negocioTexto.textContent.trim();
        feedbackDinero.value = dinero.toFixed(2);
        feedbackGranos.value = coffee.granos.toFixed(2);
        feedbackValor.value = coffee.valor.toFixed(2);
        feedbackURL.value = window.location.href;
        feedbackFecha.value = new Date().toISOString();
    });
}