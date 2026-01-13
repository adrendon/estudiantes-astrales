import { Datepicker } from 'vanillajs-datepicker';
import es from 'vanillajs-datepicker/locales/es';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'vanillajs-datepicker/css/datepicker.min.css';
import './style.css';

Object.assign(Datepicker.locales, es);

if (window.tailwind) {
    tailwind.config = {
        darkMode: "class",
        theme: {
            extend: {
                colors: {
                    gold: {
                        50: "#fdf6e3",
                        100: "#f9ecd1",
                        200: "#f1d6a2",
                        300: "#e7bc70",
                        400: "#dc9e46",
                        500: "#c5a059",
                        600: "#96702d",
                    },
                    spiritual: "#1e293b",
                },
            },
        },
    };
}

const infoMenor1968 = [
    {
        astro: "Júpiter",
        color: "Azul",
        arcangel: "Michael",
        reySuplente: "Gregorio Vila",
        regidor: "Rasputín",
        virtud: "Creatividad",
        irradia: "Órganos sexuales"
    },
    {
        astro: "Marte",
        color: "Rojo",
        arcangel: "Uriel",
        reySuplente: "Candelario",
        regidor: "Dragón",
        virtud: "Justicia y Fuerza",
        irradia: "Corazón y Sangre"
    },
    {
        astro: "Sol",
        color: "Amarillo",
        arcangel: "Raphael",
        reySuplente: "Saturnino",
        regidor: "El Gato de la Suerte",
        virtud: "Disciplina y Responsabilidad",
        irradia: "Círculo estomacal"
    },
    {
        astro: "Venus",
        color: "Verde",
        arcangel: "Gabriel",
        reySuplente: "San Benito",
        regidor: "San Nicolás",
        virtud: "Amor",
        irradia: "Articulaciones"
    },
    {
        astro: "Mercurio",
        color: "Violeta",
        arcangel: "Urifiel",
        reySuplente: "Luis Marín",
        regidor: "El Mohán",
        virtud: "Verdad y Comunicación",
        irradia: "Vías respiratorias"
    },
    {
        astro: "Luna",
        color: "Blanco",
        arcangel: "Sachariel",
        reySuplente: "Mago Top",
        regidor: "Eloy Perdomo",
        virtud: "Serenidad",
        irradia: "Cabeza"
    },
    {
        astro: "Saturno",
        color: "Negro",
        arcangel: "Samael",
        reySuplente: "Serapio",
        regidor: "Nerón",
        virtud: "Lógica y Matemáticas",
        irradia: "Sistema óseo"
    }
];

const infoMayor1968 = JSON.parse(JSON.stringify(infoMenor1968));
infoMayor1968[0].arcangel = "Emmanuel";
infoMayor1968[1].arcangel = "Aniel";
infoMayor1968[2].arcangel = "Anael";
infoMayor1968[3].arcangel = "Otiel";
infoMayor1968[4].arcangel = "Ariel";
infoMayor1968[5].arcangel = "Azael";
infoMayor1968[6].arcangel = "Shamuel";

const ordenCorrectoMayor1968 = ["Júpiter", "Marte", "Sol", "Venus", "Mercurio", "Luna", "Saturno"];
const ordenCorrectoMenor1967 = ["Sol", "Venus", "Mercurio", "Luna", "Saturno", "Júpiter", "Marte"];

const astroRigeDiaMayor1968 = {
    0: "Júpiter",   // Domingo
    1: "Venus",     // Lunes
    2: "Saturno",   // Martes
    3: "Sol",       // Miércoles
    4: "Luna",      // Jueves
    5: "Marte",     // Viernes
    6: "Mercurio"   // Sábado
};

const astroRigeDiaMenor1967 = {
    0: "Sol",       // Domingo
    1: "Luna",      // Lunes
    2: "Marte",     // Martes
    3: "Mercurio",  // Miércoles
    4: "Júpiter",   // Jueves
    5: "Venus",     // Viernes
    6: "Saturno"    // Sábado
};

const colorMapping = {
    "Azul": "#0000FF",
    "Rojo": "#FF0000",
    "Amarillo": "#FFD700",
    "Verde": "#008000",
    "Violeta": "#8A2BE2",
    "Blanco": "#FFFFFF",
    "Negro": "#000000"
};

const textColorMapping = {
    "Azul": "white",
    "Rojo": "white",
    "Amarillo": "black",
    "Verde": "white",
    "Violeta": "white",
    "Blanco": "black",
    "Negro": "white"
};

const simbolosAstros = {
    "Júpiter": "♃",
    "Marte": "♂",
    "Sol": "☉",
    "Venus": "♀",
    "Mercurio": "☿",
    "Luna": "☾",
    "Saturno": "♄"
};

const isMobileDevice = () => window.innerWidth <= 768;

const waitForFonts = async () => {
  try {
    if (document.fonts?.ready) await document.fonts.ready;
  } catch {
  }
};

const ensureSymbolFontLoaded = async () => {
  try {
    if (document.fonts?.load) {
      await document.fonts.load('48px "Noto Sans Symbols 2"');
      await document.fonts.load('48px "Segoe UI Symbol"');
    }
  } catch {

  }
  await waitForFonts();
};

const hexToRgb = (hex) => {
  if (!hex) return [0, 0, 0];
  let cleanedHex = String(hex).replace('#', '').trim();
  if (cleanedHex.length === 3) {
    cleanedHex = cleanedHex.split('').map((ch) => ch + ch).join('');
  }
  const bigint = parseInt(cleanedHex, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
};

const colorNameToHex = (nameOrHex) => {
  if (!nameOrHex) return '#000000';
  const lower = String(nameOrHex).toLowerCase();
  if (lower === 'white') return '#ffffff';
  if (lower === 'black') return '#000000';
  return String(nameOrHex);
};

const getNombreArchivo = (nombre) =>
  String(nombre || 'NOMBRE')
    .split(' ')[0]
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();

const formatDateDDMMYYYY = (date) => {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = String(date.getFullYear());
  return `${d}/${m}/${y}`;
};

const getTextIsWhiteForColorName = (colorName) =>
  String(textColorMapping[colorName] || 'black').toLowerCase() === 'white';

const cargarImagenesSimbolos = async (fillStyle = '#111111') => {
  await ensureSymbolFontLoaded();

  const nudgePx = {
    'Luna': 0,
    'Sol': 0,
    'Mercurio': 0,
    'Venus': 0,
    'Marte': 0,
    'Júpiter': 0,
    'Jupiter': 0,
    'Saturno': 0
  };

  const fontStack = '"Noto Sans Symbols 2", "Segoe UI Symbol", "Noto Sans Symbols", sans-serif';
  const result = {};

  for (const [astro, glyph] of Object.entries(simbolosAstros)) {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = fillStyle;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `48px ${fontStack}`;

    const y = (size / 2) + (nudgePx[astro] ?? -2);
    ctx.fillText(glyph, size / 2, y);

    result[astro] = canvas.toDataURL('image/png');
  }

  return result;
};

const getExportData = () => {
  const data = window.__astrosExportData;
  if (!data || !data.entries || !Array.isArray(data.entries)) return null;
  return data;
};

function calcularIndiceActual(diaSemana, hora) {
    const horasTranscurridas = (diaSemana * 24 + hora - 1 + 168) % 168;
    return horasTranscurridas % 7;
}

function formatoAMPM(hora, minutos) {
    const ampm = hora >= 12 ? "PM" : "AM";
    const hora12 = hora % 12 || 12;
    return `${hora12}:${minutos.toString().padStart(2, '0')} ${ampm}`;
}

/**
 * Devuelve el nombre del día de la semana a partir de su índice.
 * @param {number} indice 
 * @returns {string} Nombre del día.
 */
function obtenerNombreDia(indice) {
    return ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][indice];
}

const getCurrentDateTimeString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};


function generarTabla() {
    const nombre = document.getElementById("nombre").value;
    const fechaDateInput = document.getElementById("fecha-nacimiento").value; 
    const horaInput = document.getElementById("hora-nacimiento").value;
    
    if (!nombre || !fechaDateInput || !horaInput) {
        mostrarAlerta("Por favor, completa todos los campos para generar tu Contenido.");
        return;
    }

    let fecha;
    if (fechaDateInput.includes('/')) {
        const parts = fechaDateInput.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        fecha = new Date(year, month - 1, day);
    } else {
        fecha = new Date(fechaDateInput);
    }
    
    const [h, m] = horaInput.split(':');
    fecha.setHours(parseInt(h), parseInt(m));

    const anio = fecha.getFullYear();
    const diaSeleccionado = fecha.getDay();
    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();
    const horaCompleta = formatoAMPM(hora, minutos);
    const primerDiaMes = new Date(anio, fecha.getMonth(), 1).getDay();
    const primerDiaAnio = new Date(anio, 0, 1).getDay();
    
    const informacionActual = anio < 1968 ? infoMenor1968 : infoMayor1968;
    const ordenCorrectoActual = anio < 1968 ? ordenCorrectoMenor1967 : ordenCorrectoMayor1968;
    const astroRigeDiaActual = anio < 1968 ? astroRigeDiaMenor1967 : astroRigeDiaMayor1968;

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio","Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const fechaNacimiento = `${fecha.getDate().toString().padStart(2, '0')} de ${meses[fecha.getMonth()]} de ${anio}`;

    const dias = [
        { tipo: "Año", diaSemana: primerDiaAnio },
        { tipo: "Mes", diaSemana: primerDiaMes },
        { tipo: "Día", diaSemana: diaSeleccionado },
        { tipo: "Hora", diaSemana: diaSeleccionado }
    ];

    const exportEntries = [];

    let tablaHTML = `
      <header class="text-center mb-16 relative">
        <div class="inline-block mb-2">
          <svg class="w-10 h-10 mb-2 opacity-80" style="color: #c5a059;" viewBox="0 0 64 64" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M32 6 38.2 24.8H58L42.4 36.1 48.4 55 32 43.9 15.6 55l6-18.9L6 24.8h19.8z" />
            <path d="M11 6.5 12.6 11h5l-4 3 1.6 5.3L11 16.5 6.8 19.3 8.4 14l-4-3h5z" />
            <path d="M50.5 42.5 51.8 46h3.8l-3.1 2.3 1.2 3.8-3.2-2-3.2 2 1.2-3.8-3.1-2.3h3.8z" />
          </svg>
        </div>
        <h1 class="font-serif-premium text-5xl md:text-6xl font-bold mb-6 tracking-tight text-slate-900 dark:text-white">
          ${nombre}
        </h1>
        <div class="h-px w-32 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-8" style="background-image: linear-gradient(to right, transparent, #c5a059, transparent);"></div>
        <div class="flex flex-col md:flex-row justify-center items-center gap-8">
          <div class="group header-chip chip-field flex items-center gap-3 px-6 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-gold-200/50 dark:border-gold-500/20 backdrop-blur-sm transition-all hover:border-gold-400">
            <svg class="w-5 h-5 text-gold-600 dark:text-gold-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="2" ry="2" />
              <path d="M16 3v4" />
              <path d="M8 3v4" />
              <path d="M3 11h18" />
            </svg>
            <div class="chip-text text-left">
              <p class="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">Fecha de nacimiento:</p>
              <p class="text-lg font-medium">${fechaNacimiento}</p>
            </div>
          </div>
          <div class="group header-chip chip-field flex items-center gap-3 px-6 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-gold-200/50 dark:border-gold-500/20 backdrop-blur-sm transition-all hover:border-gold-400">
            <svg class="w-5 h-5 text-gold-600 dark:text-gold-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <div class="chip-text text-left">
              <p class="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">Hora de nacimiento:</p>
              <p class="text-lg font-medium">${horaCompleta}</p>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Desktop Table -->
      <div class="hidden md:block table-glow bg-white dark:bg-slate-900/60 rounded-3xl overflow-hidden border border-gold-200/30 dark:border-gold-500/10 backdrop-blur-md">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gold-50 border-b border-gold-200/50 dark:bg-slate-950 dark:border-slate-800">
                <th class="px-4 py-4 text-slate-900 dark:text-gold-200 uppercase text-xs font-extrabold tracking-[0.18em]">Día</th>
                <th class="px-4 py-4 text-slate-900 dark:text-gold-200 uppercase text-xs font-extrabold tracking-[0.18em]">Astro</th>
                <th class="px-4 py-4 text-slate-900 dark:text-gold-200 uppercase text-xs font-extrabold tracking-[0.18em]">Color</th>
                <th class="px-4 py-4 text-slate-900 dark:text-gold-200 uppercase text-xs font-extrabold tracking-[0.18em]">Arcángel</th>
                <th class="px-4 py-4 text-slate-900 dark:text-gold-200 uppercase text-xs font-extrabold tracking-[0.18em]">Rey Suplente</th>
                <th class="px-4 py-4 text-slate-900 dark:text-gold-200 uppercase text-xs font-extrabold tracking-[0.18em]">Regidor</th>
                <th class="px-4 py-4 text-slate-900 dark:text-gold-200 uppercase text-xs font-extrabold tracking-[0.18em]">Virtud</th>
                <th class="px-4 py-4 text-slate-900 dark:text-gold-200 uppercase text-xs font-extrabold tracking-[0.18em]">Irradia</th>
                <th class="px-6 py-4 text-slate-900 dark:text-gold-200 uppercase text-xs font-extrabold tracking-[0.18em] text-center">Símbolo</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/50">
    `;
    
    let mobileCardsHTML = `<div class="md:hidden space-y-6 responsive-table">`;

    dias.forEach(({ tipo, diaSemana }) => {
        let astro;
        if (tipo === "Hora") {
            const indice = calcularIndiceActual(diaSemana, hora);
            astro = ordenCorrectoActual[indice];
        } else {
            astro = astroRigeDiaActual[diaSemana];
        }
        
        const infoActual = informacionActual.find(info => info.astro === astro);
        if (!infoActual) {
            console.error(`No se encontró información para el astro: ${astro}`);
            return;
        }

        const diaCell = (tipo === "Hora") ? horaCompleta : obtenerNombreDia(diaSemana);
        const arcangelContent = (tipo === "Hora")
            ? `${infoActual.arcangel} <span class="text-xs opacity-70 block">(Ángel Guía)</span>`
            : infoActual.arcangel;

        exportEntries.push({
          tipo,
          diaCell,
          astro: infoActual.astro,
          color: infoActual.color,
          arcangel: (tipo === "Hora") ? `${infoActual.arcangel} (Ángel Guía)` : infoActual.arcangel,
          reySuplente: infoActual.reySuplente,
          regidor: infoActual.regidor,
          virtud: infoActual.virtud,
          irradia: infoActual.irradia
        });
        
        const colorHex = colorMapping[infoActual.color] || "#ffffff";
        const textColorName = textColorMapping[infoActual.color] || "black";
        const isDarkText = textColorName === "black";
        const mainTextClass = isDarkText ? "text-slate-900" : "text-white";
        const subTextClass = isDarkText ? "text-slate-600" : "text-white/80";
        const iconBgClass = isDarkText ? "bg-gold-50 dark:bg-gold-900/30 text-gold-600" : "bg-white/20 text-white border-white/30";
        const badgeBorderClass = isDarkText ? "border-slate-200" : "border-white/50";
        
        tablaHTML += `
              <tr class="transition-colors hover:brightness-105" style="background-color: ${colorHex}">
                <td class="px-4 py-4 whitespace-nowrap">
                  <span class="font-serif-premium italic text-base ${mainTextClass}">${tipo}:</span>
                  <span class="ml-2 font-medium text-sm ${subTextClass}">${diaCell}</span>
                </td>
                <td class="px-4 py-4 font-medium text-sm ${mainTextClass}">${infoActual.astro}</td>
                <td class="px-4 py-4">
                  <span class="inline-flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full border shadow-sm ${badgeBorderClass}" style="background-color: ${colorHex}; border-color: ${isDarkText ? '#e2e8f0' : 'rgba(255,255,255,0.5)'}"></span>
                    <span class="text-sm ${mainTextClass}">${infoActual.color}</span>
                  </span>
                </td>
                <td class="px-4 py-4 font-semibold text-sm ${mainTextClass}">${arcangelContent}</td>
                <td class="px-4 py-4 font-serif-premium italic text-sm ${subTextClass}">${infoActual.reySuplente}</td>
                <td class="px-4 py-4 text-sm ${mainTextClass}">${infoActual.regidor}</td>
                <td class="px-4 py-4 text-sm ${mainTextClass}">${infoActual.virtud}</td>
                <td class="px-4 py-4 text-sm ${mainTextClass}">${infoActual.irradia}</td>
                 <td class="px-6 py-4 text-center">
                   <div class="astro-badge w-8 h-8 rounded-full flex items-center justify-center mx-auto border shadow-inner ${iconBgClass} ${badgeBorderClass}">
                      <span class="astro-symbol" data-astro="${infoActual.astro}" style="font-size: 18px;">${simbolosAstros[infoActual.astro]}</span>
                   </div>
                 </td>
              </tr>
            `;

            mobileCardsHTML += `
              <div class="entry rounded-2xl p-6 shadow-sm border backdrop-blur-sm relative overflow-hidden mb-4" style="background-color: ${colorHex}; border-color: ${isDarkText ? 'rgba(197, 160, 89, 0.3)' : 'rgba(255,255,255,0.2)'}">
                <div class="flex items-center gap-3 mb-4 pb-4 border-b" style="border-color: ${isDarkText ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'}">
                  <div class="flex-1 min-w-0">
                    <span class="font-serif-premium italic text-xl ${mainTextClass}">${tipo}</span>
                    <p class="text-sm font-medium mt-1 ${subTextClass}">${diaCell}</p>
                  </div>
                  <div class="astro-badge mobile-badge rounded-full border shadow-inner ${iconBgClass}">
                    <span class="astro-symbol" data-astro="${infoActual.astro}" style="font-size: 28px;">${simbolosAstros[infoActual.astro]}</span>
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                  <div class="col-span-1">
                    <p class="text-[10px] uppercase tracking-widest font-bold mb-1 ${subTextClass}">Astro</p>
                    <p class="font-medium ${mainTextClass}">${infoActual.astro}</p>
                  </div>
                  <div class="col-span-1">
                    <p class="text-[10px] uppercase tracking-widest font-bold mb-1 ${subTextClass}">Color</p>
                    <div class="flex items-center gap-2">
                       <span class="w-3 h-3 rounded-full border shadow-sm" style="background-color: ${colorHex}; border-color: ${isDarkText ? '#e2e8f0' : 'white'}"></span>
                       <p class="font-medium ${mainTextClass}">${infoActual.color}</p>
                    </div>
                  </div>
                  <div class="col-span-2">
                    <p class="text-[10px] uppercase tracking-widest font-bold mb-1 ${subTextClass}">Arcángel</p>
                    <p class="font-medium ${mainTextClass}">${arcangelContent}</p>
                  </div>
                  <div class="col-span-1">
                     <p class="text-[10px] uppercase tracking-widest font-bold mb-1 ${subTextClass}">Rey Suplente</p>
                     <p class="font-serif-premium italic ${mainTextClass}">${infoActual.reySuplente}</p>
                  </div>
                  <div class="col-span-1">
                     <p class="text-[10px] uppercase tracking-widest font-bold mb-1 ${subTextClass}">Regidor</p>
                     <p class="${mainTextClass}">${infoActual.regidor}</p>
                  </div>
                  <div class="col-span-1">
                     <p class="text-[10px] uppercase tracking-widest font-bold mb-1 ${subTextClass}">Virtud</p>
                     <p class="${mainTextClass}">${infoActual.virtud}</p>
                  </div>
                  <div class="col-span-1">
                     <p class="text-[10px] uppercase tracking-widest font-bold mb-1 ${subTextClass}">Irradia</p>
                     <p class="${mainTextClass}">${infoActual.irradia}</p>
                  </div>
                </div>
              </div>
            `;
        });

        tablaHTML += `
            </tbody>
          </table>
        </div>
      </div>
        `;
        
        mobileCardsHTML += `</div>`; 

        window.__astrosExportData = {
          nombre: String(nombre || '').trim(),
          fechaNacimiento,
          horaCompleta,
          entries: exportEntries
        };

        document.getElementById("resultado").innerHTML = tablaHTML + mobileCardsHTML;

        const botonesDiv = document.getElementById("botones");
        botonesDiv.innerHTML = `
          <button onclick="guardarInformacionJPG()" class="btn-action">Guardar Foto</button>
          <button onclick="guardarInformacion()" class="btn-action">Guardar PDF</button>
          <button onclick="volverADigitar()" class="btn-action btn-secondary">Volver a digitar</button>
        `;
        botonesDiv.className = "flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 mb-16 px-4"; 

        document.getElementById("inputDiv").style.display = "none";
        document.getElementById("resultado").style.display = "block";
        document.getElementById("botones").style.display = "flex";
}

function volverADigitar() {
    document.getElementById("inputDiv").style.display = "block";
    document.getElementById("resultado").style.display = "none";
    document.getElementById("botones").style.display = "none";
    document.getElementById("resultado").innerHTML = "";
}

async function guardarInformacion() {
  try {
    const exportData = getExportData();
    if (!exportData) {
      mostrarAlerta('Primero genera tu Contenido.');
      return;
    }

    const simbolosDark = await cargarImagenesSimbolos('#111827');
    const simbolosLight = await cargarImagenesSimbolos('#ffffff');
    const nombreArchivo = getNombreArchivo(exportData.nombre);
    const isMobile = isMobileDevice();

    if (!isMobile) {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const marginMin = 10;
      let cursorY = 12;

      doc.setTextColor(17, 24, 39);
      doc.setFontSize(18);
      doc.text(exportData.nombre || 'Contenido', pageW / 2, cursorY, { align: 'center' });
      cursorY += 6;

      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(`Fecha de nacimiento: ${exportData.fechaNacimiento}`, pageW / 2, cursorY, { align: 'center' });
      cursorY += 6;
      doc.text(`Hora de nacimiento: ${exportData.horaCompleta}`, pageW / 2, cursorY, { align: 'center' });
      cursorY += 4;

      const fixedTableW = 30 + 22 + 18 + 28 + 34 + 28 + 28 + 30 + 18;
      const marginX = Math.max(marginMin, (pageW - fixedTableW) / 2);

      const head = [[
        'Día',
        'Astro',
        'Color',
        'Arcángel',
        'Rey Suplente',
        'Regidor',
        'Virtud',
        'Irradia',
        'Símbolo'
      ]];

      const body = exportData.entries.map((e) => [
        `${e.tipo}: ${e.diaCell}`,
        e.astro,
        e.color,
        e.arcangel,
        e.reySuplente,
        e.regidor,
        e.virtud,
        e.irradia,
        ''
      ]);

      autoTable(doc, {
        startY: cursorY,
        margin: { left: marginX, right: marginX },
        head,
        body,
        styles: {
          fontSize: 9,
          cellPadding: 2,
          overflow: 'linebreak',
          valign: 'middle',
          lineWidth: 0.15
        },
        headStyles: {
          fillColor: [253, 246, 227],
          textColor: [150, 112, 45],
          fontStyle: 'bold',
          halign: 'center',
          lineColor: [0, 0, 0]
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 22 },
          2: { cellWidth: 18 },
          3: { cellWidth: 28 },
          4: { cellWidth: 34 },
          5: { cellWidth: 28 },
          6: { cellWidth: 28 },
          7: { cellWidth: 30 },
          8: { cellWidth: 18, halign: 'center' }
        },
        didParseCell: (data) => {
          if (data.section !== 'body') return;
          const entry = exportData.entries[data.row.index];
          if (!entry) return;
          const rowHex = colorMapping[entry.color];
          const textColorName = textColorMapping[entry.color] || 'black';
          const bg = hexToRgb(rowHex || '#ffffff');
          const isWhiteText = String(textColorName).toLowerCase() === 'white';

          data.cell.styles.fillColor = bg;
          data.cell.styles.textColor = (String(textColorName).toLowerCase() === 'white') ? [255, 255, 255] : [17, 24, 39];

          data.cell.styles.lineColor = isWhiteText ? [255, 255, 255] : [0, 0, 0];
          data.cell.styles.minCellHeight = 8;
        },
        didDrawCell: (data) => {
          if (data.section !== 'body') return;
          if (data.column.index !== 8) return;
          const entry = exportData.entries[data.row.index];
          if (!entry) return;
          const rowTextColor = String(textColorMapping[entry.color] || 'black').toLowerCase();
          const img = (rowTextColor === 'white') ? simbolosLight[entry.astro] : simbolosDark[entry.astro];
          if (!img) return;

          const pad = 1.5;
          const size = Math.min(data.cell.width, data.cell.height) - (pad * 2);
          const x = data.cell.x + (data.cell.width - size) / 2;
          const y = data.cell.y + (data.cell.height - size) / 2;
          doc.addImage(img, 'PNG', x, y, size, size);
        }
      });

      doc.save(`${nombreArchivo}.pdf`);
      return;
    }

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 12;
    let y = 14;

    doc.setFontSize(18);
    doc.setTextColor(17, 24, 39);
    doc.text(exportData.nombre || 'Contenido', pageW / 2, y, { align: 'center' });
    y += 5;

    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    doc.text(`Fecha de nacimiento: ${exportData.fechaNacimiento}`, pageW / 2, y, { align: 'center' });
    y += 4.2;
    doc.text(`Hora de nacimiento: ${exportData.horaCompleta}`, pageW / 2, y, { align: 'center' });
    y += 6;

    const cardGap = 3.5;
    const cardW = pageW - (margin * 2);
    const padX = 6;
    const padTop = 4;
    const padBottom = 4;
    const titleLineH = 6.2;
    const bodyLineH = 5.2;
    const split = (t, maxW) => doc.splitTextToSize(String(t ?? ''), maxW);

    exportData.entries.forEach((entry) => {
      const bgHex = colorMapping[entry.color] || '#ffffff';
      const [r, g, b] = hexToRgb(bgHex);
      const textIsWhite = (String(textColorMapping[entry.color] || 'black').toLowerCase() === 'white');

      const textRGB = textIsWhite ? [255, 255, 255] : [17, 24, 39];
      const lineRGB = textIsWhite ? [255, 255, 255] : [0, 0, 0];
      const lineWidth = 0.2;

      const maxWFull = cardW - (padX * 2);

      const title = `${entry.tipo}: ${entry.diaCell}`;
      const titleLines = split(title, maxWFull);
      const colorLines = split(`Color: ${entry.color}`, maxWFull);
      const astroLines = split(`Astro: ${entry.astro}`, maxWFull);
      const arcLines = split(`Arcángel: ${entry.arcangel}`, maxWFull);
      const reyLines = split(`Rey Suplente: ${entry.reySuplente}`, maxWFull);
      const regLines = split(`Regidor: ${entry.regidor}`, maxWFull);
      const virtLines = split(`Virtud: ${entry.virtud}`, maxWFull);
      const irrLines = split(`Irradia: ${entry.irradia}`, maxWFull);

      const bodyLineCount = colorLines.length + astroLines.length + arcLines.length + reyLines.length + regLines.length + virtLines.length + irrLines.length;

      const contentH =
        padTop +
        (titleLines.length * titleLineH) +
        6 +
        (bodyLineCount * bodyLineH) +
        padBottom;

      const cardH = Math.max(48, contentH);

      if (y + cardH > pageH - margin) {
        doc.addPage();
        y = 14;
      }

      doc.setFillColor(r, g, b);
      doc.roundedRect(margin, y, cardW, cardH, 3, 3, 'F');

      doc.setLineWidth(0.25);
      doc.setDrawColor(lineRGB[0], lineRGB[1], lineRGB[2]);
      doc.roundedRect(margin, y, cardW, cardH, 3, 3, 'S');

      doc.setTextColor(textRGB[0], textRGB[1], textRGB[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12.5);
      let ty = y + padTop + 1.2;

      titleLines.forEach((ln, idx) => {
        doc.text(ln, margin + padX, ty + (idx * titleLineH));
      });
      ty += (titleLines.length * titleLineH) + 1.6;

      const img = textIsWhite ? simbolosLight[entry.astro] : simbolosDark[entry.astro];
      if (img) {
        const iconSize = 14;
        const iconX = margin + cardW - padX - iconSize;
        const titleBlockH = titleLines.length * titleLineH;
        const iconY = y + padTop + Math.max(0, (titleBlockH - iconSize) / 2);
        doc.addImage(img, 'PNG', iconX, iconY, iconSize, iconSize);
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      const leftX = margin + padX;
      const drawLines = (lines) => {
        if (!lines || !lines.length) return;
        doc.text(lines, leftX, ty);
        ty += lines.length * bodyLineH;
      };

      drawLines(colorLines);
      drawLines(astroLines);
      drawLines(arcLines);
      drawLines(reyLines);
      drawLines(regLines);
      drawLines(virtLines);
      drawLines(irrLines);

      y += cardH + cardGap;
    });

    doc.save(`${nombreArchivo}.pdf`);
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    mostrarAlerta('Hubo un error al generar el PDF. Por favor intenta de nuevo.');
  }
};

const loadImage = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = src;
});

const wrapTextLines = (ctx, text, maxWidth, maxLines = 2) => {
  const value = String(text ?? '').trim();
  if (!value) return [''];
  const words = value.split(/\s+/);
  const lines = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
      continue;
    }
    if (current) lines.push(current);
    current = word;
    if (lines.length >= maxLines - 1) break;
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (lines.length > maxLines) return lines.slice(0, maxLines);
  return lines;
};

async function guardarInformacionJPG() {
  try {
    const exportData = getExportData();
    if (!exportData) {
      mostrarAlerta('Primero genera tu Contenido.');
      return;
    }

    const simbolosDark = await cargarImagenesSimbolos('#111827');
    const simbolosLight = await cargarImagenesSimbolos('#ffffff');

    const simbolosImgDark = {};
    const simbolosImgLight = {};

    for (const [astro, url] of Object.entries(simbolosDark)) {
      try {
        simbolosImgDark[astro] = await loadImage(url);
      } catch {
      }
    }

    for (const [astro, url] of Object.entries(simbolosLight)) {
      try {
        simbolosImgLight[astro] = await loadImage(url);
      } catch {
      }
    }

    const nombreArchivo = getNombreArchivo(exportData.nombre);
    const mobile = isMobileDevice();

    const scale = 2;
    const padding = 40;
    const headerH = 140;
    const rows = exportData.entries.length;

    const desktopCols = [
      { key: 'dia', label: 'Día', w: 190 },
      { key: 'astro', label: 'Astro', w: 120 },
      { key: 'color', label: 'Color', w: 120 },
      { key: 'arcangel', label: 'Arcángel', w: 190 },
      { key: 'rey', label: 'Rey Suplente', w: 210 },
      { key: 'regidor', label: 'Regidor', w: 180 },
      { key: 'virtud', label: 'Virtud', w: 190 },
      { key: 'irradia', label: 'Irradia', w: 200 },
      { key: 'simbolo', label: 'Símbolo', w: 110 }
    ];

    const desktopTableW = desktopCols.reduce((sum, c) => sum + c.w, 0);
    const width = mobile ? 900 : Math.max(1600, desktopTableW + (padding * 2));

    const measureCanvas = document.createElement('canvas');
    const mctx = measureCanvas.getContext('2d');
    const lineHeight = 22;
    const padTop = 16;
    const padBottom = 16;
    const maxLinesPerCell = 2;
    const desktopRowHeights = [];

    if (mctx && !mobile) {
      mctx.font = '600 18px Montserrat, system-ui, sans-serif';
      const tableW = desktopTableW;
      const cols = desktopCols;
      const rowValuesFor = (entry) => ([
        `${entry.tipo}: ${entry.diaCell}`,
        entry.astro,
        entry.color,
        entry.arcangel,
        entry.reySuplente,
        entry.regidor,
        entry.virtud,
        entry.irradia
      ]);

      for (const entry of exportData.entries) {
        const vals = rowValuesFor(entry);
        let maxLines = 1;
        for (let i = 0; i < vals.length; i++) {
          const maxW = cols[i].w - 20;
          const lines = wrapTextLines(mctx, vals[i], maxW, maxLinesPerCell);
          maxLines = Math.max(maxLines, lines.length);
        }
        const rowH = padTop + (maxLines * lineHeight) + padBottom;
        desktopRowHeights.push(rowH);
      }
    }

    const desktopRowsHeight = (!mobile) ? desktopRowHeights.reduce((sum, h) => sum + h, 0) : 0;
    const mobileGap = 20;

    const mobileCardLayouts = [];
    if (mobile && mctx) {
      const cardW = width - (padding * 2);
      const topPad = 18;
      const bottomPad = 18;
      const titleFont = '700 30px Montserrat, system-ui, sans-serif';
      const bodyFont = '600 20px Montserrat, system-ui, sans-serif';
      const titleLineH = 36;
      const bodyLineH = 26;

      const maxWFull = cardW - 40;

      for (const entry of exportData.entries) {
        const textIsWhite = (String(textColorMapping[entry.color] || 'black').toLowerCase() === 'white');

        mctx.font = titleFont;
        const titleLines = wrapTextLines(mctx, `${entry.tipo}: ${entry.diaCell}`, maxWFull, 2);

        mctx.font = bodyFont;
        const colorLines = wrapTextLines(mctx, `Color: ${entry.color}`, maxWFull, 2);
        const astroLines = wrapTextLines(mctx, `Astro: ${entry.astro}`, maxWFull, 2);
        const arcLines = wrapTextLines(mctx, `Arcángel: ${entry.arcangel}`, maxWFull, 2);
        const reyLines = wrapTextLines(mctx, `Rey Suplente: ${entry.reySuplente}`, maxWFull, 2);
        const regLines = wrapTextLines(mctx, `Regidor: ${entry.regidor}`, maxWFull, 2);
        const virtLines = wrapTextLines(mctx, `Virtud: ${entry.virtud}`, maxWFull, 2);
        const irrLines = wrapTextLines(mctx, `Irradia: ${entry.irradia}`, maxWFull, 2);

        const bodyLinesCount = colorLines.length + astroLines.length + arcLines.length + reyLines.length + regLines.length + virtLines.length + irrLines.length;
        const cardH = topPad + (titleLines.length * titleLineH) + 12 + (bodyLinesCount * bodyLineH) + bottomPad;

        mobileCardLayouts.push({
          entry,
          textIsWhite,
          cardH,
          titleLines,
          colorLines,
          astroLines,
          arcLines,
          reyLines,
          regLines,
          virtLines,
          irrLines
        });
      }
    }

    const mobileRowsHeight = mobile
      ? mobileCardLayouts.reduce((sum, c) => sum + c.cardH, 0) + (Math.max(0, rows - 1) * mobileGap)
      : 0;
    const tableSectionH = mobile ? mobileRowsHeight : (60 + desktopRowsHeight);
    const height = headerH + padding + tableSectionH + padding;

    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      mostrarAlerta('No se pudo generar la imagen.');
      return;
    }

    ctx.scale(scale, scale);
    ctx.fillStyle = '#fafaf9';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#111827';
    ctx.font = '700 48px Montserrat, system-ui, sans-serif';
    {
      const title = exportData.nombre || 'Contenido';
      const tw = ctx.measureText(title).width;
      ctx.fillText(title, (width - tw) / 2, 70);
    }
    ctx.fillStyle = '#475569';
    ctx.font = '400 22px Montserrat, system-ui, sans-serif';
    {
      const l1 = `Fecha de nacimiento: ${exportData.fechaNacimiento}`;
      const l2 = `Hora de nacimiento: ${exportData.horaCompleta}`;
      ctx.fillText(l1, (width - ctx.measureText(l1).width) / 2, 105);
      ctx.fillText(l2, (width - ctx.measureText(l2).width) / 2, 132);
    }

    let y = headerH;

    if (!mobile) {
      const cols = desktopCols;
      const tableW = desktopTableW;
      const tableX = (width - tableW) / 2;
      const tableY = y;

      ctx.fillStyle = '#fdf6e3';
      ctx.fillRect(tableX, tableY, tableW, 60);
      ctx.strokeStyle = 'rgba(150,112,45,0.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(tableX, tableY, tableW, 60);

      ctx.fillStyle = '#96702d';
      ctx.font = '400 18px Montserrat, system-ui, sans-serif';
      let x = tableX;
      cols.forEach((c) => {
        ctx.fillText(c.label, x + 10, tableY + 38);
        x += c.w;
      });

      y = tableY + 60;

      exportData.entries.forEach((entry, rowIndex) => {
        const bgHex = colorMapping[entry.color] || '#ffffff';
        ctx.fillStyle = bgHex;
        const textIsWhite = getTextIsWhiteForColorName(entry.color);
        const rowBorder = textIsWhite ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.35)';
        const rowH = desktopRowHeights[rowIndex] ?? 70;
        ctx.fillRect(tableX, y, tableW, rowH);

        ctx.fillStyle = textIsWhite ? '#ffffff' : '#111827';
        ctx.font = '400 18px Montserrat, system-ui, sans-serif';

        const rowValues = [
          `${entry.tipo}: ${entry.diaCell}`,
          entry.astro,
          entry.color,
          entry.arcangel,
          entry.reySuplente,
          entry.regidor,
          entry.virtud,
          entry.irradia
        ];

        let colX = tableX;
        for (let i = 0; i < rowValues.length; i++) {
          const maxW = cols[i].w - 20;
          const lines = wrapTextLines(ctx, rowValues[i], maxW, maxLinesPerCell);
          const blockH = lines.length * lineHeight;
          const startY = y + ((rowH - blockH) / 2) + 6;
          lines.forEach((ln, idx) => ctx.fillText(ln, colX + 10, startY + (idx * lineHeight)));
          colX += cols[i].w;
        }

        const symCellX = tableX + cols.slice(0, 8).reduce((sum, c) => sum + c.w, 0);
        const sym = textIsWhite ? simbolosImgLight[entry.astro] : simbolosImgDark[entry.astro];
        if (sym) {
          const size = Math.min(40, Math.max(28, rowH - 22));
          ctx.drawImage(sym, symCellX + (cols[8].w - size) / 2, y + (rowH - size) / 2, size, size);
        }

        ctx.strokeStyle = rowBorder;
        ctx.strokeRect(tableX, y, tableW, rowH);
        y += rowH;
      });
    } else {
      const cardW = width - (padding * 2);
      const gap = 20;
      const startX = padding;

      const roundedRectPath = (c, x, y, w, h, r) => {
        const rr = Math.min(r, w / 2, h / 2);
        c.beginPath();
        c.moveTo(x + rr, y);
        c.arcTo(x + w, y, x + w, y + h, rr);
        c.arcTo(x + w, y + h, x, y + h, rr);
        c.arcTo(x, y + h, x, y, rr);
        c.arcTo(x, y, x + w, y, rr);
        c.closePath();
      };

      const cards = (mobileCardLayouts.length ? mobileCardLayouts : exportData.entries.map((entry) => ({ entry, textIsWhite: (String(textColorMapping[entry.color] || 'black').toLowerCase() === 'white'), cardH: 240 })));

      cards.forEach((card) => {
        const entry = card.entry;
        const bgHex = colorMapping[entry.color] || '#ffffff';
        const textIsWhite = card.textIsWhite;
        const cardH = card.cardH;
        ctx.fillStyle = bgHex;

        roundedRectPath(ctx, startX, y, cardW, cardH, 18);
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = textIsWhite ? 'rgba(255,255,255,0.35)' : 'rgba(17,24,39,0.18)';
        ctx.stroke();

        ctx.fillStyle = textIsWhite ? '#ffffff' : '#111827';
        ctx.font = '700 30px Montserrat, system-ui, sans-serif';
        const titleLines = card.titleLines || wrapTextLines(ctx, `${entry.tipo}: ${entry.diaCell}`, cardW - 40, 2);
        let ty = y + 18 + 36;
        titleLines.forEach((ln) => {
          ctx.fillText(ln, startX + 20, ty);
          ty += 36;
        });

        const sym = textIsWhite ? simbolosImgLight[entry.astro] : simbolosImgDark[entry.astro];
        if (sym) ctx.drawImage(sym, startX + cardW - 78, y + 16, 52, 52);

        ctx.font = '600 20px Montserrat, system-ui, sans-serif';
        const leftX = startX + 20;
        const maxWFull = cardW - 40;

        ty = y + 18 + (titleLines.length * 36) + 18;

        const drawBlock = (linesArr) => {
          (linesArr || []).forEach((ln) => {
            ctx.fillText(ln, leftX, ty);
            ty += 26;
          });
        };

        drawBlock(card.colorLines || wrapTextLines(ctx, `Color: ${entry.color}`, maxWFull, 2));
        drawBlock(card.astroLines || wrapTextLines(ctx, `Astro: ${entry.astro}`, maxWFull, 2));
        drawBlock(card.arcLines || wrapTextLines(ctx, `Arcángel: ${entry.arcangel}`, maxWFull, 2));
        drawBlock(card.reyLines || wrapTextLines(ctx, `Rey Suplente: ${entry.reySuplente}`, maxWFull, 2));
        drawBlock(card.regLines || wrapTextLines(ctx, `Regidor: ${entry.regidor}`, maxWFull, 2));
        drawBlock(card.virtLines || wrapTextLines(ctx, `Virtud: ${entry.virtud}`, maxWFull, 2));
        drawBlock(card.irrLines || wrapTextLines(ctx, `Irradia: ${entry.irradia}`, maxWFull, 2));

        y += cardH + gap;
      });
    }

    canvas.toBlob((blob) => {
      if (!blob) {
        mostrarAlerta('No se pudo generar la imagen JPG.');
        return;
      }
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${nombreArchivo}.jpg`;
      link.click();
      URL.revokeObjectURL(link.href);
    }, 'image/jpeg', 0.95);
  } catch (error) {
    console.error('Error al generar la imagen JPG:', error);
    mostrarAlerta('Hubo un error al generar la imagen. Por favor intenta de nuevo.');
  }
};

document.addEventListener("DOMContentLoaded", () => {
    const elem = document.getElementById('fecha-nacimiento');
  if (elem) {
      const datepicker = new Datepicker(elem, {
          autohide: true,
          language: 'es',
          format: 'dd/mm/yyyy',
          orientation: 'bottom auto'
      });
      const today = new Date();
      datepicker.setDate(today);
      elem.value = formatDateDDMMYYYY(today);
  } else {
      console.error("Input fecha-nacimiento not found");
  }

  const nombreInput = document.getElementById("nombre");
  nombreInput.addEventListener("input", () => {
    nombreInput.value = nombreInput.value.toUpperCase();
  });
  
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  document.getElementById("hora-nacimiento").value = `${hours}:${minutes}`;

    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        if (html.classList.contains('dark')) {
            localStorage.theme = 'dark';
        } else {
            localStorage.theme = 'light';
        }
        });
    }
});

function mostrarAlerta(mensaje) {
    const modal = document.getElementById('customAlert');
    const backdrop = document.getElementById('alertBackdrop');
    const panel = document.getElementById('alertPanel');
    const msgElement = document.getElementById('alertMessage');
    
    if (!modal) {
        alert(mensaje);
        return;
    }
    
    msgElement.innerText = mensaje;
    modal.classList.remove('hidden');
    
    setTimeout(() => {
        backdrop.classList.remove('opacity-0');
        panel.classList.remove('opacity-0', 'scale-95');
    }, 10);
}

function cerrarAlerta() {
    const modal = document.getElementById('customAlert');
    const backdrop = document.getElementById('alertBackdrop');
    const panel = document.getElementById('alertPanel');
    
    if (!modal) return;
    
    backdrop.classList.add('opacity-0');
    panel.classList.add('opacity-0', 'scale-95');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

window.generarTabla = generarTabla;
window.volverADigitar = volverADigitar;
window.guardarInformacion = guardarInformacion;
window.guardarInformacionJPG = guardarInformacionJPG;
window.cerrarAlerta = cerrarAlerta;
window.mostrarAlerta = mostrarAlerta;
