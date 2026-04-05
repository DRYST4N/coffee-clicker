const VERSION = "0.0.1";


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
const accountButton = document.getElementById("accountButton");
const loginModalElement = document.getElementById("loginModal");
const loginEmailInput = document.getElementById("loginEmail");
const loginMensaje = document.getElementById("loginMensaje");
const btnEnviarMagicLink = document.getElementById("btnEnviarMagicLink");

const SAVE_KEY = "coffeeClickerSave";
const feedbackForm = document.getElementById("feedbackForm");

const supabaseClient = HAS_SUPABASE_CONFIG
    ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

let currentSession = null;




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

let totalClicks = 0;
let totalRevivires = 0;
const logros = [
    { id: "primer_click",    nombre: "☕ Primera taza",     descripcion: "Todo gran imperio empieza con un grano.",          desbloqueado: false },
    { id: "cien_clicks",     nombre: "🤙 Manos de barista", descripcion: "Tus dedos ya huelen a café.",                      desbloqueado: false },
    { id: "mil_clicks",      nombre: "👆 Adicto al click",  descripcion: "El médico ha dicho que esto no es normal.",        desbloqueado: false },
    { id: "primer_euro",     nombre: "💰 Primer euro",      descripcion: "El primer euro siempre sabe diferente.",           desbloqueado: false },
    { id: "cincuenta_granos",nombre: "🌱 Semilla plantada", descripcion: "Tu puesto callejero empieza a tener forma.",       desbloqueado: false },
    { id: "etapa_cafeteria", nombre: "🏪 Local propio",     descripcion: "Ya no eres un puesto. Eres un negocio.",           desbloqueado: false },
    { id: "etapa_tostadora", nombre: "🔥 Tostador serio",   descripcion: "El aroma ya se huele desde la calle.",             desbloqueado: false },
    { id: "etapa_fabrica",   nombre: "🏭 A escala",         descripcion: "Esto ya no es artesanal.",                         desbloqueado: false },
    { id: "etapa_imperio",   nombre: "🌍 Conquistador",     descripcion: "El mundo necesita tu café.",                       desbloqueado: false },
    { id: "primer_empleado", nombre: "👷 Primer empleado",  descripcion: "Ya no estás solo. Casi.",                          desbloqueado: false },
    { id: "todas_autos",     nombre: "🤖 Sin manos",        descripcion: "Tu negocio funciona solo mientras duermes.",       desbloqueado: false },
    { id: "diez_por_segundo",nombre: "⚡ Máquina",          descripcion: "La cafetera no descansa.",                         desbloqueado: false },
    { id: "primer_revivir",  nombre: "🔄 Renacido",         descripcion: "Empezar de cero con más sabiduría.",               desbloqueado: false },
    { id: "tres_revivires",  nombre: "💎 Veterano",         descripcion: "Cada reinicio te hace más fuerte.",                desbloqueado: false },
];

const upgrades = [
    // Puesto callejero
    { id: "u01", nombre: "Manos entrenadas",      descripcion: "Llevas tanto tiempo moliendo que ya no sientes los dedos.",  tipo: "click",     bonus: 0.5,  desbloqueo: 0,     comprado: false, precio: { dinero: 25,    granos: 25 } },
    { id: "u02", nombre: "Café de termos",         descripcion: "El termo misterioso que nadie sabe cuándo se llenó.",        tipo: "click",     bonus: 1,    desbloqueo: 0,     comprado: false, precio: { dinero: 60,    granos: 50 } },
    { id: "u03", nombre: "Vaso de cartón premium", descripcion: "Con tapa y todo. Eres un profesional.",                      tipo: "produccion",bonus: 1.5,  desbloqueo: 0,     comprado: false, precio: { dinero: 100,   granos: 80 } },
    // Cafetería local
    { id: "u04", nombre: "Máquina espresso",       descripcion: "Botón gordo. Ruido ensordecedor. Café perfecto.",            tipo: "click",     bonus: 2,    desbloqueo: 50,    comprado: false, precio: { dinero: 200,   granos: 150 } },
    { id: "u05", nombre: "Barista contratado",     descripcion: "Sabe hacer corazones en el café. Tú no.",                    tipo: "produccion",bonus: 2,    desbloqueo: 50,    comprado: false, precio: { dinero: 350,   granos: 200 } },
    { id: "u06", nombre: "WiFi de pago",           descripcion: "La gente se queda más. El café se vende solo.",              tipo: "ingresos",  bonus: 1.5,  desbloqueo: 50,    comprado: false, precio: { dinero: 500,   granos: 300 } },
    // Tostadora artesanal
    { id: "u07", nombre: "Granos de origen",       descripcion: "Etiopía, Colombia, Kenia. Suena caro, lo es.",               tipo: "click",     bonus: 3,    desbloqueo: 250,   comprado: false, precio: { dinero: 800,   granos: 500 } },
    { id: "u08", nombre: "Tostado lento",          descripcion: "72 horas de tostado. Vale la pena, dicen.",                  tipo: "produccion",bonus: 2.5,  desbloqueo: 250,   comprado: false, precio: { dinero: 1200,  granos: 700 } },
    { id: "u09", nombre: "Bolsas con válvula",     descripcion: "La válvula que nadie entiende pero todos quieren.",          tipo: "ingresos",  bonus: 1.75, desbloqueo: 250,   comprado: false, precio: { dinero: 1800,  granos: 900 } },
    // Fábrica regional
    { id: "u10", nombre: "Línea de envasado",      descripcion: "La cinta transportadora hace el trabajo sucio.",             tipo: "click",     bonus: 5,    desbloqueo: 1000,  comprado: false, precio: { dinero: 3000,  granos: 1500 } },
    { id: "u11", nombre: "Control de calidad",     descripcion: "El tipo que prueba café todo el día. El mejor trabajo.",     tipo: "produccion",bonus: 3,    desbloqueo: 1000,  comprado: false, precio: { dinero: 5000,  granos: 2000 } },
    { id: "u12", nombre: "Distribución regional",  descripcion: "Tu café llega a provincias. Eres famoso en Albacete.",       tipo: "ingresos",  bonus: 2,    desbloqueo: 1000,  comprado: false, precio: { dinero: 7000,  granos: 3000 } },
    // Franquicia nacional
    { id: "u13", nombre: "App de fidelización",    descripcion: "Puntos, sellos, recompensas. La gente vuelve.",              tipo: "click",     bonus: 8,    desbloqueo: 5000,  comprado: false, precio: { dinero: 12000, granos: 5000 } },
    { id: "u14", nombre: "Campaña de TV",          descripcion: "Saliste en la tele. Tu madre está orgullosa.",               tipo: "produccion",bonus: 4,    desbloqueo: 5000,  comprado: false, precio: { dinero: 18000, granos: 7000 } },
    { id: "u15", nombre: "Licencia de franquicia", descripcion: "Otros pagan por usar tu nombre. Esto es el poder.",          tipo: "ingresos",  bonus: 2.5,  desbloqueo: 5000,  comprado: false, precio: { dinero: 25000, granos: 9000 } },
    // Imperio cafetero
    { id: "u16", nombre: "IA de tostado",          descripcion: "El algoritmo sabe qué café quieres antes que tú.",           tipo: "click",     bonus: 15,   desbloqueo: 20000, comprado: false, precio: { dinero: 40000, granos: 15000 } },
    { id: "u17", nombre: "Flota de drones",        descripcion: "Entrega en 10 minutos. El piloto cobra poco.",               tipo: "produccion",bonus: 5,    desbloqueo: 20000, comprado: false, precio: { dinero: 60000, granos: 20000 } },
    { id: "u18", nombre: "Bolsa en el IBEX",       descripcion: "Coffee Clicker S.A. cotiza en bolsa. Papi está en el IBEX.", tipo: "ingresos",  bonus: 3,    desbloqueo: 20000, comprado: false, precio: { dinero: 80000, granos: 25000 } },
    { id: "u19", nombre: "Satélite propio",        descripcion: "Para qué, exactamente. Pero lo tienes.",                     tipo: "produccion",bonus: 6,    desbloqueo: 20000, comprado: false, precio: { dinero: 100000,granos: 30000 } },
    { id: "u20", nombre: "Café en el espacio",     descripcion: "La NASA es cliente. El astronauta pide con leche de avena.", tipo: "click",     bonus: 25,   desbloqueo: 20000, comprado: false, precio: { dinero: 120000,granos: 40000 } },
];


panel.addEventListener("click", manejarClickPanel);
botonRevivir.addEventListener("click", revivir);
accountButton.addEventListener("click", manejarClickCuenta);

setInterval(generarGranosAutomaticos, 1000);
setInterval(ganarDinero, 1000);
setInterval(() => guardarPartida(false), 15000);

async function iniciarJuego() {
    await cargarPartida();
    renderTienda();
    actualizarPantalla();
}

async function inicializarAplicacion() {
    await sincronizarSesionActual();
    await iniciarJuego();
}

inicializarAplicacion();

// Listener del botón de magic link
btnEnviarMagicLink.addEventListener("click", async () => {
    const email = loginEmailInput.value.trim();
    const mensaje = loginMensaje;

    if (!supabaseClient) {
        mensaje.style.display = "block";
        mensaje.textContent = "El login no esta disponible en este entorno.";
        return;
    }

    if (!email) {
        mensaje.style.display = "block";
        mensaje.textContent = "Introduce un email válido.";
        return;
    }

    const btn = btnEnviarMagicLink;
    btn.disabled = true;
    btn.textContent = "Enviando...";

    const ok = await enviarMagicLink(email);

    mensaje.style.display = "block";
    if (ok) {
        mensaje.textContent = "✅ Enlace enviado. Revisa tu correo.";
        btn.textContent = "Enviado";
    } else {
        mensaje.textContent = "❌ Error al enviar. Inténtalo de nuevo.";
        btn.disabled = false;
        btn.textContent = "Enviar enlace";
    }
});

// Detector de sesión — se dispara cuando el jugador hace click en el magic link
if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        currentSession = session;
        actualizarBotonCuenta();

        if (event === "SIGNED_IN") {
            console.log("Sesión iniciada:", session.user.id);
            resetearLoginModal();
            cerrarLoginModal();
            await iniciarJuego();
        }

        if (event === "SIGNED_OUT") {
            resetearLoginModal();
            await iniciarJuego();
        }
    });
}

async function sincronizarSesionActual() {
    if (!supabaseClient) {
        currentSession = null;
        actualizarBotonCuenta();
        return;
    }

    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error("Error obteniendo la sesión actual:", error.message);
        currentSession = null;
    } else {
        currentSession = data.session;
    }

    actualizarBotonCuenta();
}

function actualizarBotonCuenta() {
    accountButton.textContent = currentSession ? "🚪 Salir" : "🔑 Cuenta";
}

function tieneSesionActiva() {
    return Boolean(currentSession?.user?.id);
}

function obtenerGuardadoLocal() {
    const rawSave = localStorage.getItem(SAVE_KEY);

    if (!rawSave) {
        return null;
    }

    try {
        return JSON.parse(rawSave);
    } catch (error) {
        console.warn("No se pudo leer el guardado local:", error);
        return null;
    }
}

function abrirLoginModal() {
    bootstrap.Modal.getOrCreateInstance(loginModalElement).show();
}

function cerrarLoginModal() {
    bootstrap.Modal.getOrCreateInstance(loginModalElement).hide();
}

function resetearLoginModal() {
    loginEmailInput.value = "";
    loginMensaje.style.display = "none";
    loginMensaje.textContent = "";
    btnEnviarMagicLink.disabled = false;
    btnEnviarMagicLink.textContent = "Enviar enlace";
}

async function manejarClickCuenta() {
    if (!currentSession) {
        resetearLoginModal();
        abrirLoginModal();
        return;
    }

    if (!supabaseClient) {
        return;
    }

    accountButton.disabled = true;

    const { error } = await supabaseClient.auth.signOut();

    accountButton.disabled = false;

    if (error) {
        console.error("Error cerrando sesión:", error.message);
        alert("No se pudo cerrar la sesión. Inténtalo de nuevo.");
        return;
    }

    currentSession = null;
    actualizarBotonCuenta();
}

function manejarClickPanel(event) {
    sumarPuntos();
    animarPanel();
    mostrarTextoFlotante(event, `+${obtenerGranosPorClick().toFixed(1)}`);
}

function obtenerGranosPorClick() {
    const baseClick = upgrades
        .filter(u => u.comprado && u.tipo === "click")
        .reduce((total, u) => total + u.bonus, 1);
    return baseClick + (clickUpgrade.bonusPorNivel * clickUpgrade.level);
}

function obtenerMultiplicadorProduccion(){
    return upgrades
        .filter(u => u.comprado && u.tipo === "produccion")
        .reduce((total, u) => total * u.bonus, 1);
}

function obtenerMultiplicadorIngresos(){
    return upgrades
        .filter(u => u.comprado && u.tipo === "ingresos")
        .reduce((total, u) => total * u.bonus, 1);
}

function sumarPuntos() {
    coffee.granos += obtenerGranosPorClick();
    totalClicks++;
    actualizarBotonesTienda();
    actualizarPantalla();
}

function generarGranosAutomaticos() {
    let total = 0;

    for (const auto of automations) {
        total += auto.level * auto.potencia;
    }

    coffee.granos += total * obtenerMultiplicadorProduccion();
    actualizarBotonesTienda();
    actualizarPantalla();
}

function ganarDinero() {
    dinero += coffee.valor * coffee.granos * obtenerMultiplicadorIngresos();
    actualizarBotonesTienda();
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
        clickUpgrade.precioDinero = clickUpgrade.precioDineroBase;
        clickUpgrade.precioGranos = clickUpgrade.precioGranosBase;

        automations.forEach(auto => {
            auto.level = 0;
            auto.precioDinero = auto.precioDineroBase;
            auto.precioGranos = auto.precioGranosBase;
        });

        upgrades.forEach(u => u.comprado = false);

        revivirPrecio *= 10;
        totalRevivires++;

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

function comprarUpgrade(id){
    const upgrade = upgrades.find(u => u.id === id);
    if(!upgrade || upgrade.comprado) return;

    if(dinero >= upgrade.precio.dinero && coffee.granos >= upgrade.precio.granos){
        dinero -= upgrade.precio.dinero;
        coffee.granos -= upgrade.precio.granos;
        upgrade.comprado = true;

        renderTienda();
        actualizarPantalla();
        guardarPartida();
    }

}

function automatizacionDesbloqueada(index) {
    if (index === 0) return true;
    return automations[index - 1].level > 0;
}

function renderTienda() {
    const upgradesVisibles = upgrades.filter(u => !u.comprado && coffee.granos >= u.desbloqueo);
    const upgradesDisponibles = upgrades.filter(u => !u.comprado && coffee.granos < u.desbloqueo).slice(0, 1);

    upgradeContainer.innerHTML = [...upgradesVisibles, ...upgradesDisponibles].map(upgrade => {
        const disponible = dinero >= upgrade.precio.dinero && coffee.granos >= upgrade.precio.granos;
        const bloqueado = coffee.granos < upgrade.desbloqueo;

        if (bloqueado) {
            return `
                <div class="shop-card secret-card">
                    <div class="card-title-pixel">???</div>
                    <div class="card-subtext">Sigue creciendo para desbloquear esta mejora.</div>
                    <button class="pixel-btn mt-3" disabled>BLOQUEADA</button>
                </div>
            `;
        }

        return `
            <div class="shop-card">
                <div class="card-title-pixel">${upgrade.nombre}</div>
                <div class="card-subtext">${upgrade.descripcion}</div>
                <button
                    class="pixel-btn mt-3 upgrade-buy-btn"
                    data-id="${upgrade.id}"
                    ${disponible ? "" : "disabled"}
                >
                    ${upgrade.precio.dinero}€ | ${upgrade.precio.granos} granos
                </button>
            </div>
        `;
    }).join("");

    document.querySelectorAll(".upgrade-buy-btn").forEach(btn => {
        btn.addEventListener("click", () => comprarUpgrade(btn.dataset.id));
    });

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

function actualizarBotonesTienda(){
    const btnClickUpgrade = document.getElementById("btnClickUpgrade");

    if (btnClickUpgrade){
        btnClickUpgrade.disabled = !puedeComprarClickUpgrade();
    }

    document.querySelectorAll(".auto-buy-btn").forEach(btn =>{
        const auto = automations.find(a=> a.id === btn.dataset.id);
        if(auto){
            btn.disabled = !puedeComprarAuto(auto);
        }
    });

    document.querySelectorAll(".upgrade-buy-btn").forEach(btn => {
        const upgrade = upgrades.find(u => u.id === btn.dataset.id);
        if(upgrade) btn.disabled = !(dinero >= upgrade.precio.dinero && coffee.granos >= upgrade.precio.granos);
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
    comprobarLogros();
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


async function enviarMagicLink(email) {
    if (!supabaseClient) {
        return false;
    }

    const { error } = await supabaseClient.auth.signInWithOtp({
        email: email,
        options: {
            emailRedirectTo: window.location.href
        }
    });
    if (error){
        console.error("Error enviando magic link: ", error.message);
        return false;
    }
    return true
}

function resetearEstadoJuego() {
    dinero = 0;
    revivirPrecio = 1000;

    coffee = {
        granos: 0,
        valor: 0.01
    };

    clickUpgrade.level = 0;
    clickUpgrade.precioDinero = clickUpgrade.precioDineroBase;
    clickUpgrade.precioGranos = clickUpgrade.precioGranosBase;

    automations.forEach(auto => {
        auto.level = 0;
        auto.precioDinero = auto.precioDineroBase;
        auto.precioGranos = auto.precioGranosBase;
    });
}

function obtenerEstadoCompleto(){
    return {
        dinero,
        revivirPrecio,
        coffee,
        clickUpgrade,
        automations,
        upgrades,
        totalClicks,
        totalRevivires,
        logros
    };
    
}

async function guardarPartidaRemota(estado) {
    if (!supabaseClient || !tieneSesionActiva()) {
        return false;
    }

    const { error } = await supabaseClient
        .from("partidas")
        .upsert(
            {
                player_id: currentSession.user.id,
                estado: estado,
                updated_at: new Date().toISOString()
            },
            { onConflict: "player_id" }
        );

    if (error) {
        console.error("Error guardando en Supabase:", error.message);
        return false;
    }

    console.log("Partida guardada en Supabase");
    return true;
}

async function guardarPartida() {
    const estado  =obtenerEstadoCompleto();

    //LO guardamos como backup
    localStorage.setItem(SAVE_KEY, JSON.stringify(estado));

    if (!tieneSesionActiva()) {
        return;
    }

    await guardarPartidaRemota(estado);
};

async function cargarPartida() {
    const saveLocal = obtenerGuardadoLocal();

    resetearEstadoJuego();

    if (!tieneSesionActiva()) {
        if (saveLocal) {
            cargarEstado(saveLocal);
        }
        return;
    }

    // Intentar cargar desde Supabase
    const { data, error } = await supabaseClient
        .from("partidas")
        .select("estado")
        .eq("player_id", currentSession.user.id)
        .maybeSingle();

    if (data && data.estado) {
        cargarEstado(data.estado);
        return;
    }

    if (error) {
        console.warn("Error cargando la partida desde Supabase, usando localStorage:", error.message);
    }

    // Si no existe o falla, usar localStorage como fallback
    if (saveLocal) {
        cargarEstado(saveLocal);
    }

    if (!data && !error && saveLocal) {
        await guardarPartidaRemota(saveLocal);
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
        clickUpgrade.precioDinero = data.clickUpgrade.precioDinero ?? clickUpgrade.precioDineroBase;
        clickUpgrade.precioGranos = data.clickUpgrade.precioGranos ?? clickUpgrade.precioGranosBase;
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
    if(data.totalClicks) totalClicks = data.totalClicks;
    if(data.totalRevivires) totalRevivires = data.totalRevivires;
    if(data.logros && Array.isArray(data.logros)){
        data.logros.forEach(savedLogro => {
            const logro = logros.find(l => l.id === savedLogro.id);
            if(logro) logro.desbloqueado = savedLogro.desbloqueado;
        });
    }
    if(data.upgrades && Array.isArray(data.upgrades)){
        data.upgrades.forEach(savedUpgrade => {
            const upgrade = upgrades.find(u => u.id === savedUpgrade.id);
            if(upgrade) upgrade.comprado = savedUpgrade.comprado;
        })
    }

}

//----------------------------------------
//    Logros
//----------------------------------------

function comprobarLogros(){
    const produccionTotal = automations.reduce((total, auto) => total + auto.level * auto.potencia, 0);
    const todasDesbloqueadas = automations.every(auto => auto.level > 0);
    const etapaActual = obtenerEtapaActual();

    const condiciones ={
        primer_click:     totalClicks >= 1,
        cien_clicks:      totalClicks >= 100,
        mil_clicks:       totalClicks >= 1000,
        primer_euro:      dinero >= 1,
        cincuenta_granos: coffee.granos >= 50,
        etapa_cafeteria:  etapaActual.nombre === "Cafetería local",
        etapa_tostadora:  etapaActual.nombre === "Tostadora artesanal",
        etapa_fabrica:    etapaActual.nombre === "Fábrica regional",
        etapa_imperio:    etapaActual.nombre === "Imperio cafetero",
        primer_empleado:  automations[0].level >= 1,
        todas_autos:      todasDesbloqueadas,
        diez_por_segundo: produccionTotal >= 10,
        primer_revivir:   totalRevivires >= 1,
        tres_revivires:   totalRevivires >= 3,
    };
    logros.forEach(logro => {
        if(!logro.desbloqueado && condiciones[logro.id]){
            logro.desbloqueado = true;
            mostrarPopupLogo(logro);
            guardarPartida();
        }
    });
}

function mostrarPopupLogo(logro){
    const toast = document.getElementById("logroToast");
    document.getElementById("logroNombre").textContent = " 🏆 " + logro.nombre;
    document.getElementById("logroDesc").textContent = logro.descripcion;

    toast.classList.add("show");
    setTimeout(()=>{
        toast.classList.remove("show");
    }, 3500);
}



//-----------------------------------------
//Formulario
//-----------------------------------------

console.log("1");

if (feedbackForm) {
    console.log("2");
    feedbackForm.addEventListener("submit", async (e) => {
        console.log("3");
        e.preventDefault();

        console.log("4");
        const payload = {
            usuario: document.getElementById("feedbackUsuario").value.trim() || null,
            mensaje: document.getElementById("feedbackMensaje").value.trim(),
            version: VERSION
        };
        
        console.log("5");
try {
    if (!supabaseClient) {
        alert("El feedback no esta disponible en este entorno.");
        return;
    }

    const { error } = await supabaseClient
        .from("feedback")
        .insert(payload, { returning: 'minimal' });
    
    console.log("6 - error:", error);

    const modal = bootstrap.Modal.getInstance(
        document.getElementById("feedbackModal")
    );

    if (error) {
        console.error("Error enviando feedback:", error.message);
        alert("Error al enviar el feedback. Inténtalo de nuevo.");
    } else {
        modal.hide();
        document.getElementById("feedbackUsuario").value = "";
        document.getElementById("feedbackMensaje").value = "";
    }
} catch (err) {
    console.error("Error inesperado en el insert:", err);
}
console.log("7");
    });
}
