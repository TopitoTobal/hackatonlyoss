// Generado desde front/index.html. Edita ese archivo y vuelve a generar.
export const MAPA_HTML = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
<meta name="theme-color" content="#e2e8f0">
<title>Mapa accesible · Campus Casa Central UTFSM</title>
<script src="https://cdn.tailwindcss.com/3.4.17"></script>
<style>
  /* ---- Base estructural: el visor ocupa exactamente la pantalla ---- */
  html, body { margin: 0; padding: 0; width: 100%; height: 100vh; height: 100dvh; overflow: hidden; background: #e2e8f0; }
  body { position: fixed; inset: 0; height: 100vh; height: 100dvh; font-family: system-ui, sans-serif; overscroll-behavior: none; -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; }
  #viewport { position: fixed; inset: 0; width: 100%; height: 100%; overflow: hidden; touch-action: none; }
  #world { position: absolute; left: 0; top: 0; width: 1312px; height: 985px; transform-origin: 0 0; }
  #world svg { position: absolute; left: 0; top: 0; max-width: none; pointer-events: none; }
  #buildings button { position: absolute; max-width: none; touch-action: manipulation; }
  #dot, #dotHalo { position: absolute; border-radius: 9999px; box-sizing: border-box; pointer-events: none; }
  #dot { background: #0284c7; border: 5px solid #fff; }
  #dotHalo { background: rgba(14,165,233,.3); }
  #presenceBadge {
    position: fixed; left: max(10px, env(safe-area-inset-left)); top: max(10px, env(safe-area-inset-top));
    z-index: 9; pointer-events: none; display: none; max-width: calc(100% - 20px);
    box-shadow: 0 4px 14px rgba(0,0,0,.35);
  }
  #presenceBadge.sin-conexion { background: #7f1d1d; }
  #scaleBar {
    position: fixed; left: max(10px, env(safe-area-inset-left)); top: 58px;
    z-index: 9; pointer-events: none; display: none;
    border: 3px solid #000; border-top: 0; background: rgba(255,255,255,.92);
    padding: 1px 4px; font-size: 12px; font-weight: 800; color: #000;
    box-shadow: 0 2px 8px rgba(0,0,0,.25);
  }
  #peerLayer text { paint-order: stroke fill; stroke: #fff; stroke-width: 4px; stroke-linejoin: round; }

  /* Elementos flotantes: nunca deben salirse del área visible */
  #hint {
    position: fixed; left: 50%; transform: translateX(-50%); top: max(16px, env(safe-area-inset-top));
    width: calc(100% - 32px); width: calc(100% - max(32px, env(safe-area-inset-left) + env(safe-area-inset-right)));
    max-width: 24rem; box-sizing: border-box; box-shadow: 0 6px 20px rgba(0,0,0,.3);
  }
  #sheet {
    position: fixed; left: 10px; right: 10px; bottom: max(10px, env(safe-area-inset-bottom));
    box-shadow: 0 10px 30px rgba(0,0,0,.35);
    display: none; flex-direction: column; max-width: 28rem; margin: 0 auto; box-sizing: border-box; z-index: 10;
    max-height: calc(100vh - 24px); max-height: calc(100dvh - 24px);
    overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch;
  }
  #sheet.flex { display: flex; }
  #interior {
    position: fixed; inset: 0; display: none; flex-direction: column; box-sizing: border-box; z-index: 20;
    padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom);
    background: rgba(255,255,255,.94);
  }
  #interior.flex { display: flex; }
  #hint.hidden { display: none; }
  #inStage { flex: 1 1 auto; min-height: 0; min-width: 0; }
  #inInfo {
    flex: 0 0 auto; max-height: 45vh; max-height: 45dvh;
    overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch;
  }
  #sheetName { font-size: clamp(20px, 6.4vw, 26px); }

  /* Foco muy visible, incluidos los botones del plano (el borde se dibuja hacia adentro) */
  button:focus-visible {
    outline: 4px solid #f97316; outline-offset: 3px; box-shadow: 0 0 0 7px #fff;
  }
  #buildings button:focus-visible { outline-offset: -5px; box-shadow: none; }

  /* Texto solo para lectores de pantalla */
  .sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
  }

  /* Pantallas bajas: compactar sin ocultar información */
  @media (max-height: 700px) {
    #sheet { padding: 10px; gap: 6px; }
    #sheet button, #interior button { min-height: 48px; }
    #sheetDir { font-size: 17px; }
    #sheetWhere { font-size: 15px; }
    #inInfo { max-height: 40vh; max-height: 40dvh; }
  }
  /* Celular en horizontal: el panel y el interior pasan a un lado */
  @media (max-height: 500px) and (orientation: landscape) {
    #sheet {
      left: auto; right: max(10px, env(safe-area-inset-right)); top: max(10px, env(safe-area-inset-top)); bottom: 10px;
      width: min(380px, 50vw); max-width: none; margin: 0;
      max-height: calc(100dvh - 20px); padding: 8px; gap: 4px;
    }
    #sheet button, #interior button { min-height: 44px; }
    #sheetName { font-size: 20px; }
    #sheetDir { font-size: 16px; }
    #sheetWhere { font-size: 14px; }
    #sheet > div:first-child button { min-width: 56px; }
    #hint { max-width: 22rem; }
    #interior { flex-flow: row wrap; align-content: flex-start; }
    #interior > header { flex: 0 0 100%; padding: 6px 12px; gap: 8px; }
    #interior > header h2 { font-size: 1.25rem; }
    #interior > header button { min-height: 44px; padding-left: 14px; padding-right: 14px; }
    #inStage { flex: 1 1 56%; }
    #inInfo { flex: 0 1 38%; margin: 8px; max-height: calc(100dvh - 76px); padding: 10px; }
    #inRoom { font-size: 18px; }
    #inNote { display: block; font-size: 14px; }
  }
  @media (max-width: 340px) {
    #sheet button { font-size: 15px; }
    #hint { font-size: 14px; }
  }
  @media (forced-colors: active) {
    button:focus-visible { outline-color: Highlight; box-shadow: none; }
    #sheet, #inInfo, #interior > header button { border-color: CanvasText; }
  }
</style>
</head>
<body class="h-full overflow-hidden bg-slate-200 font-sans text-black antialiased">

<h1 class="sr-only">Mapa accesible del campus Casa Central UTFSM</h1>
<div id="announcer" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></div>

<main id="viewport" aria-label="Mapa del campus. Arrastra para mover y toca un edificio."
      aria-describedby="mapa-instrucciones"
      class="relative h-full w-full cursor-grab touch-none overflow-hidden bg-slate-200">
  <p id="mapa-instrucciones" class="sr-only">
    Mapa interactivo del campus. Toca un edificio para escuchar hacia dónde dirigirte.
    Con el teclado, usa las flechas izquierda y derecha para recorrer los edificios,
    Enter para entrar al edificio seleccionado y Escape para salir.
    Los botones de acercar y alejar están al final del panel de información.
  </p>
  <div id="world" class="absolute left-0 top-0 origin-top-left" style="width:1312px;height:985px">

    <!-- Plano base nuevo: cobertura continua de borde a borde.
         No hay zonas lisas sobrantes: manzanas, avenidas y campus llegan
         hasta los cuatro bordes del lienzo de 1312 x 985. -->
    <svg width="1312" height="985" viewBox="0 0 1312 985" aria-hidden="true" class="pointer-events-none absolute left-0 top-0">
      <defs>
        <!-- Barrio: patrón de manzanas que cubre todo el lienzo -->
        <pattern id="manzanas" width="146" height="108" patternUnits="userSpaceOnUse">
          <rect width="146" height="108" fill="#e2e8f0"/>
          <rect x="5" y="5" width="136" height="98" rx="4" fill="#cbd5e1"/>
          <rect x="11" y="11" width="58" height="38" rx="2" fill="#b6c2cf"/>
          <rect x="77" y="11" width="58" height="38" rx="2" fill="#c3cdd7"/>
          <rect x="11" y="59" width="58" height="38" rx="2" fill="#c3cdd7"/>
          <rect x="77" y="59" width="58" height="38" rx="2" fill="#b6c2cf"/>
        </pattern>
        <!-- Áreas verdes del campus -->
        <pattern id="parque" width="72" height="72" patternUnits="userSpaceOnUse">
          <rect width="72" height="72" fill="#c3d8b8"/>
          <circle cx="18" cy="18" r="6" fill="#adca9f"/>
          <circle cx="52" cy="50" r="8" fill="#adca9f"/>
        </pattern>
      </defs>

      <!-- 1. Fondo continuo: ningún borde queda sin dibujar -->
      <rect width="1312" height="985" fill="url(#manzanas)"/>

      <!-- 2. Campus: desde la calle separadora hasta los bordes sur y este -->
      <rect x="300" y="312" width="1012" height="673" fill="#d6d3d1"/>
      <rect x="300" y="312" width="1012" height="88" fill="#dedad4"/>
      <rect x="300" y="620" width="1012" height="365" fill="url(#parque)"/>

      <!-- 3. Avenida Placeres: atraviesa TODO el ancho del plano -->
      <rect x="0" y="278" width="1312" height="34" fill="#475569"/>
      <line x1="0" y1="295" x2="1312" y2="295" stroke="#fbbf24" stroke-width="2" stroke-dasharray="26 20"/>

      <!-- 4. Calle separadora oeste: de arriba abajo, sin dejar hueco -->
      <rect x="284" y="0" width="16" height="278" fill="#475569"/>
      <rect x="284" y="312" width="16" height="673" fill="#475569"/>

      <!-- 5. Cancha principal 8007 y tenis (zona inferior derecha) -->
      <rect x="450" y="450" width="170" height="260" rx="4" fill="#166534"/>
      <rect x="460" y="460" width="150" height="240" rx="2" fill="none" stroke="#ffffff" stroke-width="2" opacity=".55"/>
      <line x1="535" y1="460" x2="535" y2="700" stroke="#ffffff" stroke-width="2" opacity=".55"/>
      <rect x="1130" y="690" width="70" height="120" rx="3" fill="#9a3412"/>
      <line x1="1130" y1="750" x2="1200" y2="750" stroke="#ffffff" stroke-width="2" opacity=".55"/>

      <!-- Ladera / talud al sur de la cancha: curvas de nivel cerca de H -->
      <g fill="none" stroke="#a8a29e" stroke-width="2" opacity=".7">
        <path d="M470 790 Q590 730 710 790"/>
        <path d="M460 830 Q590 770 720 830"/>
        <path d="M450 870 Q590 810 730 870"/>
      </g>

      <!-- 6. Senderos y calles internas: contorno oscuro y centro blanco
             usan EXACTAMENTE los mismos trazos (mismo d en los dos grupos). -->
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <g stroke="#475569" stroke-width="24">
          <path d="M740 312 L740 317"/>
          <path d="M740 427 L740 445"/>
          <path d="M700 575 L710 605"/>
          <path d="M740 690 L755 690"/>
          <path d="M520 380 L430 380 L355 405 L270 355"/>
          <path d="M300 415 L415 440 L450 450"/>
          <path d="M450 450 L415 580 L450 710 L535 740"/>
          <path d="M620 450 L650 580 L668 640 L600 740"/>
          <path d="M535 740 L590 780 L590 820 L590 985"/>
          <path d="M980 510 L1030 510 L1060 455 L1090 455"/>
          <path d="M980 372 L1040 372 L1102 340"/>
          <path d="M1100 455 L1100 540"/>
          <path d="M1100 580 L1140 620 L1140 860"/>
          <path d="M1020 745 L1020 757"/>
          <path d="M925 785 L941 785"/>
          <path d="M955 785 L955 860 L1050 860"/>
          <path d="M1050 802 L1050 860"/>
          <path d="M1140 860 L1175 860 L1175 810"/>
        </g>
        <g stroke="#ffffff" stroke-width="16">
          <path d="M740 312 L740 317"/>
          <path d="M740 427 L740 445"/>
          <path d="M700 575 L710 605"/>
          <path d="M740 690 L755 690"/>
          <path d="M520 380 L430 380 L355 405 L270 355"/>
          <path d="M300 415 L415 440 L450 450"/>
          <path d="M450 450 L415 580 L450 710 L535 740"/>
          <path d="M620 450 L650 580 L668 640 L600 740"/>
          <path d="M535 740 L590 780 L590 820 L590 985"/>
          <path d="M980 510 L1030 510 L1060 455 L1090 455"/>
          <path d="M980 372 L1040 372 L1102 340"/>
          <path d="M1100 455 L1100 540"/>
          <path d="M1100 580 L1140 620 L1140 860"/>
          <path d="M1020 745 L1020 757"/>
          <path d="M925 785 L941 785"/>
          <path d="M955 785 L955 860 L1050 860"/>
          <path d="M1050 802 L1050 860"/>
          <path d="M1140 860 L1175 860 L1175 810"/>
        </g>
      </g>

      <!-- 7. Etiquetas -->
      <g font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">
        <text x="535" y="585" font-size="20" fill="#ffffff">8007</text>
        <text x="1165" y="755" font-size="16" fill="#ffffff">TENIS</text>
        <text x="660" y="301" font-size="20" fill="#ffffff">AVENIDA PLACERES</text>
        <text x="142" y="160" font-size="17" fill="#475569">BARRIO NORTE</text>
        <text x="590" y="830" font-size="16" fill="#78716c">LADERA</text>
        <text x="1170" y="950" font-size="17" fill="#365314">SUBIDA SAN LUIS</text>
      </g>
    </svg>

    <!-- Línea de dirección hacia el edificio elegido -->
    <svg width="1312" height="985" viewBox="0 0 1312 985" aria-hidden="true" class="pointer-events-none absolute left-0 top-0">
      <line id="guide" x1="690" y1="500" x2="690" y2="500" stroke="#0369a1" stroke-width="7"
            stroke-dasharray="16 12" stroke-linecap="round" stroke-opacity="0"/>
    </svg>

    <!-- Botones de edificios (los crea el script) -->
    <div id="buildings"></div>

    <!-- Detalles de forma (patios y salientes). Van encima de los botones pero
         no capturan eventos: el control accesible sigue siendo cada botón. -->
    <svg width="1312" height="985" viewBox="0 0 1312 985" aria-hidden="true" class="pointer-events-none absolute left-0 top-0">
      <g fill="none" stroke="#0f172a" stroke-width="3" stroke-dasharray="7 5" opacity=".75">
        <rect x="810" y="485" width="90" height="50" rx="4"/>
        <path d="M775 625 L825 625 L825 615"/>
        <path d="M875 825 L925 825 L925 800"/>
        <path d="M975 780 L1025 770 L1125 770 L1125 802 L975 802 Z"/>
        <path d="M950 900 L950 860 L1170 860"/>
        <path d="M336 530 L384 410"/>
      </g>
    </svg>

    <!-- Personas no videntes conectadas: solo se dibujan en modo vidente -->
    <svg width="1312" height="985" viewBox="0 0 1312 985" aria-hidden="true" class="pointer-events-none absolute left-0 top-0">
      <g id="peerLayer"></g>
      <g id="ayudaLayer"></g>
    </svg>

    <!-- Punto azul: ubicación de la persona -->
    <div id="dotHalo" aria-hidden="true" class="pointer-events-none absolute h-10 w-10 rounded-full bg-sky-500/30"></div>
    <div id="dot" role="img" aria-label="Tu ubicación"
         class="pointer-events-none absolute box-border h-7 w-7 rounded-full border-[5px] border-white bg-sky-600 shadow-[0_0_0_3px_#0c4a6e]"></div>
  </div>
</main>

<!-- Pista inicial ( decorativa: las instrucciones reales van en #mapa-instrucciones ) -->
<div id="hint" aria-hidden="true"
     class="pointer-events-none absolute left-1/2 top-4 w-[calc(100%-32px)] max-w-sm -translate-x-1/2 rounded-full bg-black px-4 py-3 text-center text-[15px] font-bold text-white sm:text-[17px]">
  Toca un edificio · Usa ← →
</div>

<div id="presenceBadge" role="status" aria-live="polite" aria-atomic="true"
     class="rounded-full border-[3px] border-black bg-purple-800 px-3 py-2 text-[14px] font-extrabold text-white">
  0 no videntes conectadas
</div>
<div id="scaleBar"><span id="scaleText">20 m</span></div>
<div id="ayudaBanner" role="status" aria-live="assertive" aria-atomic="true"
     class="hidden rounded-full border-[3px] border-black bg-red-700 px-3 py-2 text-[14px] font-extrabold text-white">
</div>

<!-- Panel que aparece al elegir un edificio -->
<section id="sheet" role="region" aria-label="Información del edificio seleccionado"
         class="absolute inset-x-2.5 bottom-2.5 mx-auto hidden max-w-md flex-col gap-2 rounded-2xl border-4 border-black bg-yellow-200 p-3.5">
  <div class="flex items-center justify-between gap-2">
    <button id="btnPrev" aria-keyshortcuts="ArrowLeft" class="flex min-h-14 min-w-16 flex-col items-center justify-center gap-0.5 rounded-[10px] border-[3px] border-black bg-black px-2 text-white">
      <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>
      <span id="prevId" class="text-sm font-extrabold leading-none"></span>
    </button>
    <h2 id="sheetName" tabindex="-1" class="m-0 flex-1 text-center text-[26px] font-extrabold"></h2>
    <button id="btnNext" aria-keyshortcuts="ArrowRight" class="flex min-h-14 min-w-16 flex-col items-center justify-center gap-0.5 rounded-[10px] border-[3px] border-black bg-black px-2 text-white">
      <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>
      <span id="nextId" class="text-sm font-extrabold leading-none"></span>
    </button>
  </div>
  <p id="sheetDir" class="m-0 text-[19px] font-extrabold leading-tight text-sky-900"></p>
  <p id="sheetWhere" class="m-0 text-base font-medium leading-snug"></p>
  <div class="mt-1 grid grid-cols-4 gap-2">
    <button id="btnEnter" class="col-span-4 min-h-14 rounded-[10px] border-[3px] border-black bg-blue-900 text-lg font-extrabold text-white">Entrar al edificio</button>
    <button id="btnSpeak" aria-label="Escuchar información de este edificio" class="col-span-2 min-h-14 rounded-[10px] border-[3px] border-black bg-black text-lg font-extrabold text-white">Escuchar</button>
    <button id="btnClose" aria-label="Cerrar información del edificio" class="col-span-2 min-h-14 rounded-[10px] border-[3px] border-black bg-white text-lg font-extrabold text-black">Cerrar</button>
    <button id="btnCenter" aria-label="Centrar en mi ubicación y anunciar mi posición" class="col-span-2 min-h-14 rounded-[10px] border-[3px] border-black bg-sky-900 text-[17px] font-extrabold text-white">Mi ubicación</button>
    <button id="btnIn" aria-label="Acercar" class="min-h-14 rounded-[10px] border-[3px] border-black bg-black text-3xl font-extrabold text-white">+</button>
    <button id="btnOut" aria-label="Alejar" class="min-h-14 rounded-[10px] border-[3px] border-black bg-black text-3xl font-extrabold text-white">−</button>
    <button id="btnVoice" aria-pressed="true" class="col-span-4 min-h-12 rounded-[10px] border-[3px] border-black bg-white text-base font-extrabold text-black"></button>
  </div>
</section>

<!-- Vista interior: el resto del mapa queda desenfocado detrás -->
<section id="interior" role="dialog" aria-modal="true" aria-labelledby="inTitle" aria-describedby="inNote"
         class="absolute inset-0 z-20 hidden flex-col bg-white/95">
  <header class="flex items-center gap-3 p-3">
    <button id="inExit" class="min-h-14 rounded-[10px] border-[3px] border-black bg-white px-5 text-lg font-extrabold text-black">Salir</button>
    <h2 id="inTitle" class="m-0 text-2xl font-extrabold"></h2>
  </header>
  <div id="inStage" class="relative min-h-0 flex-1"></div>
  <div id="inInfo" class="m-3 flex flex-col gap-2 rounded-2xl border-4 border-black bg-yellow-200 p-3.5">
    <p id="inRoom" class="m-0 text-[22px] font-extrabold"></p>
    <p id="inNote" class="m-0 text-base font-medium leading-snug"></p>
    <button id="inSpeak" class="min-h-14 rounded-[10px] border-[3px] border-black bg-black text-lg font-extrabold text-white">Escuchar</button>
  </div>
</section>

<script>
/* ---------- Datos ----------
   Coordenadas en píxeles del plano oficial (1312 x 985).
   [id, centroX, centroY, ancho, alto, descripción] */
const BUILDINGS = [
  ['C', 750, 372, 460, 110, 'Norte. Bloque horizontal largo al sur de Avenida Placeres y al norte de B; su extremo este se alinea con B y llega al acceso de Subida San Luis.'],
  ['R', 235, 345, 70, 45, 'Noroeste, junto a Avenida Placeres y Pasaje Valdés.'],
  ['R2', 330, 375, 48, 40, 'Noroeste, recinto pequeño al este-sur de R, junto a Pasaje Valdés.'],
  ['M', 360, 470, 48, 120, 'Oeste. Bloque alargado con ligera inclinación, pegado a Pasaje Valdés y al oeste de la cancha 8007.'],
  ['M2', 415, 440, 48, 40, 'Oeste, adyacente al este-sur de M, en el borde superior izquierdo de la cancha 8007.'],
  ['B', 835, 510, 290, 130, 'Centro-norte. Bloque en U con patio interior, al sur de C y al norte de A; brazo este hacia Subida San Luis.'],
  ['K', 1090, 420, 60, 70, 'Borde noreste, junto a la Subida San Luis.'],
  ['J', 1120, 340, 48, 40, 'Acceso pequeño al norte de K, junto a la Subida San Luis.'],
  ['O', 1110, 560, 48, 40, 'Recinto pequeño al sur de K, en la Subida San Luis.'],
  ['L', 644, 600, 48, 80, 'Oeste, en el desnivel entre la cancha 8007 y el sector de B y U.'],
  ['U', 710, 690, 60, 170, 'Centro-oeste. Bloque vertical alargado, al oeste de A y separado por un pasillo estrecho.'],
  ['A', 840, 720, 170, 210, 'Centro-sur. Bloque grande al sur de B y al este de U, con salientes norte y sur sobre el patio central.'],
  ['H', 590, 780, 60, 40, 'Suroeste, en la ladera con curvas de nivel, al sur de la cancha 8007.'],
  ['D', 1020, 690, 120, 110, 'Centro-este, al este de A y al norte de E y los jardines geométricos.'],
  ['E', 1050, 780, 150, 45, 'Centro-este. Bloque horizontal escalonado al sur de D, bordeando el patio interior.'],
  ['F2', 950, 820, 48, 70, 'Sur. Conexión estrecha entre el sector de A y los jardines con F.'],
  ['F', 1060, 880, 220, 40, 'Sur. Tramo horizontal con retorno norte en su extremo oeste, cerca de F2.'],
  ['T', 1210, 850, 70, 80, 'Extremo sureste, siguiendo la curva de Subida San Luis y el borde sur del campus.']
];
const DIRS = ['norte','noreste','este','sureste','sur','suroeste','oeste','noroeste'];
const METROS_POR_PIXEL = 0.75; /* el mismo valor que usa App.tsx para el GPS */
const CENTRO = { x: 690, y: 500 };

/* Ubicación de la persona (simulada). El GPS real llama a setUserPosition(x, y, geo)
   con coordenadas relativas al centro del plano. */
let dot = { x: CENTRO.x, y: CENTRO.y };

/* ---------- Estado ---------- */
const $ = (id) => document.getElementById(id);
const vp = $('viewport'), world = $('world');
let ox = 0, oy = 0, z = 1, selected = null, baseZ = 1;
let autoVoice = true;   /* voz automática activada por defecto */
try { if (localStorage.getItem('autoVoice') === 'off') autoVoice = false; } catch (e) {}
const buttons = {};
const ON  = ['bg-yellow-400','text-black','border-black','border-[5px]'];
const OFF = ['bg-blue-900','text-white','border-slate-900','border-[3px]'];

/* Un único punto de anuncio para lectores de pantalla. */
let avisoTimer = null;
function announce(text) {
  const a = $('announcer');
  a.textContent = '';
  clearTimeout(avisoTimer);
  avisoTimer = setTimeout(() => { a.textContent = text; }, 60);
}
function say(text) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-CL'; speechSynthesis.cancel(); speechSynthesis.speak(u);
  } catch (e) {}
}
/* Si la voz automática está apagada, el lector de pantalla necesita el aviso. */
function speakOrAnnounce(text) {
  if (autoVoice) say(text); else announce(text);
}

/* ---------- Construcción ---------- */
BUILDINGS.forEach(([id, cx, cy, w, h]) => {
  const W = Math.max(48, w), H = Math.max(48, h);
  const b = document.createElement('button');
  b.className = 'absolute box-border rounded-lg p-0 text-2xl font-extrabold ' + OFF.join(' ');
  b.style.cssText = 'left:' + Math.round(cx - W/2) + 'px;top:' + Math.round(cy - H/2) + 'px;width:' + W + 'px;height:' + H + 'px';
  b.textContent = id;
  b.setAttribute('aria-label', 'Edificio ' + id);
  b.setAttribute('aria-pressed', 'false');
  b.addEventListener('click', (e) => { if (!justDragged) select(id, { focus: e.detail === 0 }); });
  $('buildings').appendChild(b);
  buttons[id] = b;
});

/* El zoom base depende del tamaño de la pantalla; los elementos táctiles
   mantienen un tamaño constante en pantalla sin importar el zoom. */
const ZMAX = 12;
/* Zoom mínimo "cover", como en Google Maps: el plano siempre cubre el viewport.
   Así nunca aparece fondo vacío alrededor del mapa al alejar al máximo. */
function minZoom() {
  return Math.max(vp.clientWidth / 1312, vp.clientHeight / 985);
}
const clampZ = (v) => Math.min(ZMAX, Math.max(minZoom(), v));
function computeBase() {
  return clampZ(minZoom() * 1.05);
}
function placeDot() {
  const d = 28 / z, hh = 40 / z;
  Object.assign($('dot').style, { left: (dot.x - d/2) + 'px', top: (dot.y - d/2) + 'px', width: d + 'px', height: d + 'px',
    borderWidth: (5 / z) + 'px', boxShadow: '0 0 0 ' + (3 / z) + 'px #0c4a6e' });
  Object.assign($('dotHalo').style, { left: (dot.x - hh/2) + 'px', top: (dot.y - hh/2) + 'px', width: hh + 'px', height: hh + 'px' });
}
function actualizarEscala() {
  const bar = $('scaleBar');
  if (!bar) return;
  let metros = 1;
  for (const m of [1, 2, 5, 10, 20, 50]) {
    if ((m / METROS_POR_PIXEL) * z <= 120) metros = m;
    else break;
  }
  bar.style.display = 'block';
  bar.style.width = ((metros / METROS_POR_PIXEL) * z).toFixed(1) + 'px';
  $('scaleText').textContent = metros + ' m';
}
function restyle() {
  const px = (n) => (n / z).toFixed(2) + 'px';
  BUILDINGS.forEach(([id, cx, cy, w, h]) => {
    const W = Math.max(w, 48 / z), H = Math.max(h, 48 / z), st = buttons[id].style;
    st.left = (cx - W/2) + 'px'; st.top = (cy - H/2) + 'px';
    st.width = W + 'px'; st.height = H + 'px';
    st.fontSize = px(22); st.borderRadius = px(8);
    st.borderWidth = px(id === selected ? 5 : 3);
  });
  placeDot();
  pintarPares();
  actualizarEscala();
  const g = $('guide');
  g.setAttribute('stroke-width', 7 / z);
  g.setAttribute('stroke-dasharray', (16 / z) + ' ' + (12 / z));
}

/* ---------- Mapa: posición y zoom ---------- */
/* El borde del plano nunca entra en pantalla: no se puede panear más allá
   del mapa, igual que en Google Maps. Con el zoom "cover" siempre hay
   recorrido disponible o, como mucho, el mapa encaja exactamente. */
function clamp(x, y, s) {
  const vw = vp.clientWidth, vh = vp.clientHeight;
  const w = 1312 * s, h = 985 * s;
  return [
    Math.min(0, Math.max(vw - w, x)),
    Math.min(0, Math.max(vh - h, y))
  ];
}
function apply() { world.style.transform = 'translate(' + ox + 'px,' + oy + 'px) scale(' + z + ')'; }
const isLandscapeShort = () => matchMedia('(max-height:500px) and (orientation:landscape)').matches;
function panelOpen() { return selected && !$('sheet').classList.contains('hidden'); }
/* Centro visible del mapa: descuenta el panel (abajo en vertical, a un lado en horizontal) */
function focusY() {
  if (!panelOpen() || isLandscapeShort()) return vp.clientHeight / 2;
  return Math.max(80, (vp.clientHeight - $('sheet').offsetHeight - 10) / 2);
}
function focusX() {
  if (!panelOpen() || !isLandscapeShort()) return vp.clientWidth / 2;
  return Math.max(80, (vp.clientWidth - $('sheet').offsetWidth - 10) / 2);
}
function centerOn(px, py) {
  [ox, oy] = clamp(focusX() - px*z, focusY() - py*z, z);
  apply();
}
function zoomBy(k) {
  const anterior = z;
  const nz = clampZ(z * k), r = nz / z;
  const cx = focusX(), cy = focusY();
  [ox, oy] = clamp(cx - (cx - ox)*r, cy - (cy - oy)*r, nz);
  z = nz; restyle(); apply();
  if (nz === anterior) {
    speakOrAnnounce(k < 1
      ? 'Zoom mínimo. El mapa ya ocupa toda la pantalla.'
      : 'Zoom máximo.');
  } else {
    speakOrAnnounce('Zoom ' + Math.round((z / baseZ) * 100) + ' por ciento.');
  }
}

/* ---------- Selección ---------- */
function info(id) {
  const [, cx, cy, , , where] = BUILDINGS.find(b => b[0] === id);
  const dx = cx - dot.x, dy = cy - dot.y, dist = Math.hypot(dx, dy);
  const ang = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
  const metros = Math.round(dist * METROS_POR_PIXEL);
  const dir = dist < 70
    ? 'Ya estás junto a este edificio.'
    : 'Desde tu ubicación, a ' + metros + ' metros hacia el ' + DIRS[Math.round(ang/45) % 8] + '.';
  return { cx, cy, where, dir, metros, label: 'Edificio ' + id };
}
function select(id, opts) {
  opts = opts || {};
  if (selected) {
    buttons[selected].classList.remove(...ON); buttons[selected].classList.add(...OFF);
    buttons[selected].setAttribute('aria-pressed', 'false');
  }
  selected = id;
  const i = info(id);
  buttons[id].classList.remove(...OFF); buttons[id].classList.add(...ON);
  buttons[id].setAttribute('aria-pressed', 'true');
  $('sheetName').textContent = i.label;
  updateArrows();
  $('sheetDir').textContent = i.dir;
  $('sheetWhere').textContent = i.where;
  $('sheet').classList.remove('hidden'); $('sheet').classList.add('flex');
  $('hint').classList.add('hidden');
  const g = $('guide');
  g.setAttribute('x1', dot.x); g.setAttribute('y1', dot.y);
  g.setAttribute('x2', i.cx);  g.setAttribute('y2', i.cy);
  g.setAttribute('stroke-opacity', '0.9');
  centerOn((dot.x + i.cx)/2, (dot.y + i.cy)/2);
  restyle();

  const texto = i.label + '. ' + i.dir + ' ' + i.where;
  if (opts.focus) $('sheetName').focus({ preventScroll: true });
  if (opts.silent) return;
  if (opts.focus) announce(i.dir + ' ' + i.where);
  else speakOrAnnounce(texto);
}
/* Flechas: recorren los edificios de oeste a este (izquierda / derecha) */
const ORDER = BUILDINGS.slice().sort((a, b) => a[1] - b[1]).map(b => b[0]);
function neighbor(d) {
  const n = ORDER.length, i = ORDER.indexOf(selected);
  return ORDER[(i + d + n) % n];
}
function updateArrows() {
  const p = neighbor(-1), n = neighbor(1);
  $('prevId').textContent = p; $('nextId').textContent = n;
  $('btnPrev').setAttribute('aria-label', 'Edificio anterior, a la izquierda: ' + p);
  $('btnNext').setAttribute('aria-label', 'Edificio siguiente, a la derecha: ' + n);
}
function step(d) { if (selected && !inside) select(neighbor(d), { focus: true }); }
function closeSheet() {
  if (selected) {
    buttons[selected].classList.remove(...ON); buttons[selected].classList.add(...OFF);
    buttons[selected].setAttribute('aria-pressed', 'false');
  }
  selected = null;
  $('sheet').classList.add('hidden'); $('sheet').classList.remove('flex');
  $('hint').classList.remove('hidden');
  $('guide').setAttribute('stroke-opacity', '0');
  restyle();
  announce('Panel cerrado. Toca un edificio para ver su información.');
}
function speak() {
  if (!selected) return;
  const i = info(selected);
  const texto = i.label + '. ' + i.dir + ' ' + i.where;
  say(texto); announce(texto);
}
function speakPosition() {
  const i = selected ? info(selected) : null;
  const texto = i
    ? 'Tu ubicación. ' + i.dir + ' ' + i.where
    : 'Tu ubicación en el mapa, en el centro del campus.';
  say(texto); announce(texto);
}
function voiceLabel() {
  const b = $('btnVoice');
  b.textContent = 'Voz automática: ' + (autoVoice ? 'activada' : 'desactivada');
  b.setAttribute('aria-pressed', autoVoice ? 'true' : 'false');
  b.setAttribute('aria-label', 'Voz automática: ' + (autoVoice ? 'activada' : 'desactivada') +
    '. Si usas lector de pantalla, desactívala para evitar que dos voces hablen a la vez.');
}
$('btnVoice').onclick = () => {
  autoVoice = !autoVoice;
  try { localStorage.setItem('autoVoice', autoVoice ? 'on' : 'off'); } catch (e) {}
  voiceLabel();
  if (autoVoice && selected) say('Voz activada. Edificio ' + selected);
  else speechSynthesis.cancel();
};
voiceLabel();


/* ---------- Presencia: personas no videntes conectadas ----------
   Canal público MQTT sobre WSS, sin credenciales. Cada sesión usa un ID
   efímero y no se guarda nombre, ruta ni historial. Si el broker falla,
   el mapa y el GPS siguen funcionando igual; solo se pierde la capa social. */
const PRESENCIA_TOPIC = 'hackatonlyoss/campus/presencia/v1';
const AYUDA_TOPIC = 'hackatonlyoss/campus/ayuda/v1';
const PRESENCIA_BROKER = 'wss://broker.emqx.io:8084/mqtt';
const PRESENCIA = {
  id: 'NV-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
  rol: null,
  geo: null,      // fix satelital actual (para estimar y publicar)
  origen: null,   // primer fix preciso: ancla del marco GPS del plano
  x: dot.x,
  y: dot.y,
  pares: new Map(),
  observaciones: new Map(),
  roles: new Map(),
  filtro: new Map(),
  conectado: false,
  ultimoEnvio: 0,
  ultimoAnuncio: -1,
  socket: null,
  reintento: null,
};
/* Pedidos de ayuda: solo se muestran a personas videntes y caducan solos. */
const AYUDA = {
  activo: false,
  ultimoEnvio: 0,
  pidiendo: new Map(),
};

function bytesTexto(texto) { return new TextEncoder().encode(texto); }
function mqttTexto(texto) {
  const b = bytesTexto(texto);
  return [b.length >> 8, b.length & 255, ...b];
}
function mqttLongitud(n) {
  const out = [];
  do { let d = n % 128; n = Math.floor(n / 128); if (n) d |= 128; out.push(d); } while (n);
  return out;
}
function mqttPaquete(tipo, banderas, cuerpo) {
  return new Uint8Array([(tipo << 4) | banderas, ...mqttLongitud(cuerpo.length), ...cuerpo]);
}
function mqttPing() { return new Uint8Array([0xc0, 0x00]); }

function mqttConectar() {
  let ws;
  try { ws = new WebSocket(PRESENCIA_BROKER, 'mqtt'); }
  catch (e) { programarReintento(); return; }
  PRESENCIA.socket = ws;
  ws.binaryType = 'arraybuffer';
  ws.onopen = () => {
    PRESENCIA.conectado = false;
    ws.send(mqttPaquete(1, 0, [...mqttTexto('MQTT'), 4, 2, 0, 60, ...mqttTexto(PRESENCIA.id)]));
  };
  ws.onmessage = (evt) => {
    try { mqttLeer(new Uint8Array(evt.data)); } catch (e) {}
  };
  ws.onerror = () => { try { ws.close(); } catch (e) {} };
  ws.onclose = () => {
    if (PRESENCIA.socket === ws) { PRESENCIA.socket = null; PRESENCIA.conectado = false; }
    actualizarPresencia();
    programarReintento();
  };
}
function programarReintento() {
  if (PRESENCIA.reintento) return;
  PRESENCIA.reintento = setTimeout(() => {
    PRESENCIA.reintento = null;
    mqttConectar();
  }, 5000);
}
function mqttLeer(datos) {
  let i = 0;
  const tipo = datos[i++] >> 4;
  let multiplicador = 1, longitud = 0, octeto;
  do { octeto = datos[i++]; longitud += (octeto & 127) * multiplicador; multiplicador *= 128; } while (octeto & 128);
  const fin = i + longitud;
  if (tipo === 2) {
    PRESENCIA.conectado = (datos[i + 1] & 1) === 0;
    if (PRESENCIA.conectado && PRESENCIA.socket) {
      PRESENCIA.socket.send(mqttPaquete(8, 2, [
        0, 1,
        ...mqttTexto(PRESENCIA_TOPIC), 0,
        ...mqttTexto(AYUDA_TOPIC), 0,
      ]));
      publicarPresencia(true);
      publicarAyuda(true);
    }
    actualizarPresencia();
  } else if (tipo === 3) {
    const tam = (datos[i] << 8) | datos[i + 1];
    i += 2;
    const tema = new TextDecoder().decode(datos.slice(i, i + tam));
    i += tam;
    const mensaje = JSON.parse(new TextDecoder().decode(datos.slice(i, fin)));
    if (tema === PRESENCIA_TOPIC) recibirPresencia(mensaje);
    else if (tema === AYUDA_TOPIC) recibirAyuda(mensaje);
  }
}
function publicarPresencia(fuerza = false) {
  const ws = PRESENCIA.socket;
  if (!ws || ws.readyState !== 1 || !PRESENCIA.conectado || !PRESENCIA.rol) return;
  const ahora = Date.now();
  if (!fuerza && ahora - PRESENCIA.ultimoEnvio < 900) return;
  PRESENCIA.ultimoEnvio = ahora;
  /* Publicamos el GPS satelital CRUDO, nunca la posición ya fusionada.
     Si publicáramos el estimado, otros nodos lo re-fusionarían y el
     movimiento de uno arrastraría la posición del otro (bucle de realimentación). */
  const g = PRESENCIA.geo;
  const lat = g && Number.isFinite(g.latitude) ? g.latitude : null;
  const lng = g && Number.isFinite(g.longitude) ? g.longitude : null;
  const acc = g && Number.isFinite(g.accuracyM) ? g.accuracyM : null;
  const cuerpo = {
    id: PRESENCIA.id,
    rol: PRESENCIA.rol,
    x: Math.round(PRESENCIA.x),
    y: Math.round(PRESENCIA.y),
    lat: Number.isFinite(lat) ? Number(lat.toFixed(6)) : null,
    lng: Number.isFinite(lng) ? Number(lng.toFixed(6)) : null,
    acc: Number.isFinite(acc) ? Math.round(acc) : null,
    ts: ahora,
    obs: [...PRESENCIA.pares.values()]
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
      .map((p) => ({
        id: p.id,
        lat: p.lat,
        lng: p.lng,
        acc: p.acc,
        rol: p.rol,
        ts: p.ts,
      })),
  };
  ws.send(mqttPaquete(3, 0, [...mqttTexto(PRESENCIA_TOPIC), ...bytesTexto(JSON.stringify(cuerpo))]));
}
function geoAPlano(lat, lng) {
  /* Usamos SIEMPRE el primer fix como origen. Si se usara el fix actual,
     cada vez que la persona camina se recalibraría el marco y los pares
     caerían desplazados justo en la dirección contraria al movimiento. */
  const o = PRESENCIA.origen || PRESENCIA.geo;
  if (!o || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const metrosPorGradoLat = 111320;
  const metrosPorGradoLng = 111320 * Math.cos((o.latitude * Math.PI) / 180);
  const dx = ((lng - o.longitude) * metrosPorGradoLng) / METROS_POR_PIXEL;
  const dy = (-(lat - o.latitude) * metrosPorGradoLat) / METROS_POR_PIXEL;
  return { x: CENTRO.x + dx, y: CENTRO.y + dy };
}
const AUTO_INTERIOR = { dentro: 0, fuera: 0, activo: false, bloqueo: 0 };
function edificioEn(x, y) {
  const MARGEN = 8; /* ~6 m: tolerancia a ruido GPS en espacios pequeños */
  for (const [id, cx, cy, w, h] of BUILDINGS) {
    if (Math.abs(x - cx) <= w / 2 + MARGEN && Math.abs(y - cy) <= h / 2 + MARGEN) {
      return id;
    }
  }
  return null;
}
function distM(a, b) {
  const dLat = (b.lat - a.lat) * 111320;
  const dLng = (b.lng - a.lng) * 111320 * Math.cos((a.lat * Math.PI) / 180);
  return Math.hypot(dLat, dLng);
}
function accValida(acc) {
  return Math.min(40, Math.max(3, Number.isFinite(acc) ? acc : 15));
}
/* Peso de una señal. El reporte que un nodo hace de SÍ MISMO manda;
   lo que otro dice sobre él es solo una corrección secundaria y caduca antes. */
function pesoDe(o, ahora) {
  const acc = accValida(o.acc);
  const conf = o.propio
    ? 1
    : 0.35 * ((o.rol === 'vidente' || PRESENCIA.roles.get(o.observador) === 'vidente') ? 1.6 : 1);
  const decaimiento = o.propio ? 12000 : 5000;
  return conf * Math.exp(-Math.max(0, ahora - o.ts) / decaimiento) / (acc * acc + 25);
}
function promediar(lista, ahora) {
  let suma = 0, lat = 0, lng = 0;
  for (const o of lista) {
    const peso = pesoDe(o, ahora);
    suma += peso; lat += o.lat * peso; lng += o.lng * peso;
  }
  if (!suma) return null;
  return {
    lat: lat / suma,
    lng: lng / suma,
    acc: Math.max(1, Math.min(30, Math.sqrt(1 / suma))),
    ts: ahora,
  };
}
/* Estimador del grafo, árbol de confianza:
   1) referencia = reportes propios del nodo (su GPS satelital);
   2) una observación de tercero que contradiga esa referencia se descarta;
   3) las restantes solo afinan la posición, nunca la arrastran. */
function estimar(id) {
  const ahora = Date.now();
  const lista = [];
  if (id === PRESENCIA.id && PRESENCIA.geo) {
    lista.push({
      lat: PRESENCIA.geo.latitude,
      lng: PRESENCIA.geo.longitude,
      acc: PRESENCIA.geo.accuracyM,
      ts: ahora,
      observador: '@yo',
      rol: PRESENCIA.rol,
      propio: true,
    });
  }
  for (const [observador, mapa] of PRESENCIA.observaciones) {
    const o = mapa.get(id);
    if (o) {
      lista.push({
        ...o,
        observador,
        rol: o.rol || PRESENCIA.roles.get(observador),
        propio: o.propio === true,
      });
    }
  }
  if (!lista.length) return null;
  const propias = lista.filter((o) => o.propio);
  const referencia = promediar(propias.length ? propias : lista, ahora);
  if (!referencia) return null;
  const aceptadas = propias.length ? propias.slice() : [];
  for (const o of lista) {
    if (o.propio) continue;
    const limite = Math.max(25, 3 * accValida(o.acc) + 3 * accValida(referencia.acc));
    if (distM(referencia, o) <= limite) aceptadas.push(o);
  }
  const resultado = promediar(aceptadas, ahora);
  if (!resultado) return null;
  resultado.n = aceptadas.length;
  resultado.propias = propias.length;
  resultado.confirmado = propias.some((o) => ahora - o.ts < 3000);
  return resultado;
}
/* Filtro temporal tipo Kalman 1D sobre lat/lng: quita jitter del GPS satelital
   y descarta saltos aislados. La incertidumbre crece con el tiempo sin datos. */
function suavizar(id, crudo) {
  const anterior = PRESENCIA.filtro.get(id);
  if (!anterior) {
    const salida = { ...crudo };
    PRESENCIA.filtro.set(id, salida);
    return salida;
  }
  const dt = Math.max(0, crudo.ts - anterior.ts);
  const accPred = Math.min(40, accValida(anterior.acc) + Math.sqrt(dt / 1000) * 0.8);
  const salto = distM(anterior, crudo);
  /* Un salto grande se acepta solo si el propio nodo lo confirma con una
     muestra fresca y es compatible con una velocidad de 8 m/s. Así el
     movimiento real no se pierde, pero un tercero desactualizado no arrastra. */
  const movimientoReal = crudo.confirmado && salto <= Math.max(30, 8 * (dt / 1000) + 3 * accPred);
  if (salto > Math.max(25, 3 * accPred) && !movimientoReal) {
    const salida = { ...anterior, ts: crudo.ts, n: crudo.n, acc: accPred, rechazado: true };
    PRESENCIA.filtro.set(id, salida);
    return salida;
  }
  const accMed = accValida(crudo.acc);
  let K = (accPred * accPred) / (accPred * accPred + accMed * accMed + 25);
  if (crudo.confirmado) K = Math.max(K, 0.85);
  const salida = {
    lat: anterior.lat + K * (crudo.lat - anterior.lat),
    lng: anterior.lng + K * (crudo.lng - anterior.lng),
    acc: Math.max(1, Math.sqrt((1 - K) * accPred * accPred)),
    n: crudo.n,
    ts: crudo.ts,
    rechazado: false,
  };
  PRESENCIA.filtro.set(id, salida);
  return salida;
}
function recalcularPares() {
  const yoCrudo = estimar(PRESENCIA.id);
  if (yoCrudo) suavizar(PRESENCIA.id, yoCrudo);
  PRESENCIA.pares.forEach((p, id) => {
    const crudo = estimar(id);
    if (!crudo) return;
    const f = suavizar(id, crudo);
    const punto = geoAPlano(f.lat, f.lng);
    if (!punto) return;
    p.x = punto.x;
    p.y = punto.y;
    p.accFus = f.acc;
    p.n = f.n;
    p.edificio = edificioEn(punto.x, punto.y);
  });
}
function verificarInteriorAuto() {
  if (PRESENCIA.rol !== 'no-vidente' || Date.now() < AUTO_INTERIOR.bloqueo) return;
  const yo = PRESENCIA.filtro.get(PRESENCIA.id);
  const punto = yo ? geoAPlano(yo.lat, yo.lng) : null;
  const id = punto ? edificioEn(punto.x, punto.y) : null;
  if (id) {
    AUTO_INTERIOR.dentro++;
    AUTO_INTERIOR.fuera = 0;
    if (AUTO_INTERIOR.dentro >= 3 && (!inside || selected !== id)) {
      AUTO_INTERIOR.activo = true;
      if (inside) { inside = false; vp.inert = false; }
      select(id, { silent: true });
      enterBuilding();
    }
  } else {
    AUTO_INTERIOR.fuera++;
    AUTO_INTERIOR.dentro = 0;
    if (AUTO_INTERIOR.fuera >= 3 && inside && AUTO_INTERIOR.activo) {
      AUTO_INTERIOR.activo = false;
      exitBuilding();
    }
  }
}
function direccionHacia(x, y) {
  const dx = x - dot.x, dy = y - dot.y, dist = Math.hypot(dx, dy);
  if (dist < 40) return 'junto a ti';
  const ang = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
  return 'a ' + Math.round(dist * METROS_POR_PIXEL) + ' metros al ' +
    DIRS[Math.round(ang / 45) % 8];
}
function publicarAyuda(fuerza = false) {
  const ws = PRESENCIA.socket;
  if (!ws || ws.readyState !== 1 || !PRESENCIA.conectado) return;
  if (PRESENCIA.rol !== 'no-vidente') return;
  const ahora = Date.now();
  if (!fuerza && ahora - AYUDA.ultimoEnvio < 3000) return;
  AYUDA.ultimoEnvio = ahora;
  const g = PRESENCIA.geo;
  const cuerpo = {
    id: PRESENCIA.id,
    rol: 'no-vidente',
    activo: AYUDA.activo,
    lat: g && Number.isFinite(g.latitude) ? Number(g.latitude.toFixed(6)) : null,
    lng: g && Number.isFinite(g.longitude) ? Number(g.longitude.toFixed(6)) : null,
    acc: g && Number.isFinite(g.accuracyM) ? Math.round(g.accuracyM) : null,
    x: Math.round(PRESENCIA.x),
    y: Math.round(PRESENCIA.y),
    ts: ahora,
  };
  ws.send(mqttPaquete(3, 0, [...mqttTexto(AYUDA_TOPIC), ...bytesTexto(JSON.stringify(cuerpo))]));
}
function recibirAyuda(mensaje) {
  if (!mensaje || !mensaje.id || mensaje.id === PRESENCIA.id) return;
  if (!Number.isFinite(mensaje.lat) || !Number.isFinite(mensaje.lng)) return;
  const id = String(mensaje.id).slice(0, 12);
  if (!mensaje.activo) {
    if (AYUDA.pidiendo.delete(id)) {
      announce('La petición de ayuda de ' + id + ' fue cancelada.');
    }
  } else if (PRESENCIA.rol === 'vidente') {
    const punto = geoAPlano(mensaje.lat, mensaje.lng);
    const eraNueva = !AYUDA.pidiendo.has(id);
    AYUDA.pidiendo.set(id, {
      id,
      x: punto ? punto.x : (Number.isFinite(mensaje.x) ? mensaje.x : dot.x),
      y: punto ? punto.y : (Number.isFinite(mensaje.y) ? mensaje.y : dot.y),
      acc: Number.isFinite(mensaje.acc) ? mensaje.acc : 15,
      ts: Date.now(),
    });
    if (eraNueva) announce('Petición de ayuda de ' + id + '. ' + direccionHacia(AYUDA.pidiendo.get(id).x, AYUDA.pidiendo.get(id).y) + '.');
  }
  pintarAyudas();
  actualizarAyudaBanner();
}
function pintarAyudas() {
  const capa = $('ayudaLayer');
  if (!capa) return;
  capa.textContent = '';
  if (PRESENCIA.rol !== 'vidente') return;
  const NS = 'http://www.w3.org/2000/svg';
  AYUDA.pidiendo.forEach((a) => {
    const g = document.createElementNS(NS, 'g');
    const titulo = document.createElementNS(NS, 'title');
    titulo.textContent = 'Petición de ayuda de ' + a.id + '. ' + direccionHacia(a.x, a.y);
    g.appendChild(titulo);
    const r = document.createElementNS(NS, 'circle');
    r.setAttribute('cx', a.x); r.setAttribute('cy', a.y);
    r.setAttribute('r', Math.max(7, 18 / z));
    r.setAttribute('fill', '#b91c1c'); r.setAttribute('stroke', '#fff');
    r.setAttribute('stroke-width', Math.max(2, 4 / z));
    g.appendChild(r);
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', a.x); t.setAttribute('y', a.y + 7 / z);
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('font-size', Math.max(16, 26 / z));
    t.setAttribute('font-weight', '900'); t.setAttribute('fill', '#fff');
    t.textContent = '!';
    g.appendChild(t);
    capa.appendChild(g);
  });
}
function actualizarAyudaBanner() {
  const banner = $('ayudaBanner');
  if (!banner) return;
  if (PRESENCIA.rol === 'no-vidente' && AYUDA.activo) {
    banner.classList.remove('hidden');
    banner.classList.remove('bg-red-700');
    banner.classList.add('bg-purple-800');
    banner.textContent = 'Tu petición de ayuda está activa. Los videntes pueden verte.';
    return;
  }
  if (PRESENCIA.rol !== 'vidente' || AYUDA.pidiendo.size === 0) {
    banner.classList.add('hidden');
    return;
  }
  banner.classList.remove('hidden');
  banner.classList.remove('bg-purple-800');
  banner.classList.add('bg-red-700');
  const texto = [...AYUDA.pidiendo.values()]
    .map((a) => a.id + ' ' + direccionHacia(a.x, a.y))
    .join(' · ');
  banner.textContent = 'Pedido de ayuda: ' + texto;
}
window.setAyuda = (activo) => {
  const nuevo = !!activo;
  if (nuevo === AYUDA.activo) return;
  AYUDA.activo = nuevo;
  publicarAyuda(true);
  actualizarAyudaBanner();
  if (nuevo) announce('Petición de ayuda enviada a las personas videntes.');
  else announce('Petición de ayuda cancelada.');
};

function recibirPresencia(mensaje) {
  if (!mensaje || mensaje.id === PRESENCIA.id) return;
  if (!Number.isFinite(mensaje.lat) || !Number.isFinite(mensaje.lng)) return;
  const observador = mensaje.id;
  PRESENCIA.roles.set(observador, mensaje.rol);
  const mapa = PRESENCIA.observaciones.get(observador) || new Map();
  mapa.set(observador, {
    lat: mensaje.lat,
    lng: mensaje.lng,
    acc: Number.isFinite(mensaje.acc) ? mensaje.acc : 15,
    propio: true,
    ts: mensaje.ts || Date.now(),
  });
  for (const o of (Array.isArray(mensaje.obs) ? mensaje.obs : [])) {
    if (!o || o.id === observador || o.id === PRESENCIA.id) continue;
    if (!Number.isFinite(o.lat) || !Number.isFinite(o.lng)) continue;
    mapa.set(o.id, {
      lat: o.lat,
      lng: o.lng,
      acc: Number.isFinite(o.acc) ? o.acc : 15,
      rol: o.rol,
      propio: false,
      ts: o.ts || Date.now(),
    });
  }
  PRESENCIA.observaciones.set(observador, mapa);

  if (mensaje.rol === 'no-vidente') {
    PRESENCIA.pares.set(observador, {
      id: observador,
      lat: mensaje.lat,
      lng: mensaje.lng,
      acc: Number.isFinite(mensaje.acc) ? mensaje.acc : 15,
      rol: mensaje.rol,
      x: 0,
      y: 0,
      accFus: Number.isFinite(mensaje.acc) ? mensaje.acc : 15,
      n: 1,
      edificio: null,
      ts: mensaje.ts || Date.now(),
      etiqueta: String(observador).slice(0, 6),
    });
  }
  recalcularPares();
  verificarInteriorAuto();
  publicarPresencia();
  pintarPares();
  actualizarPresencia();
}
function paresVisibles() {
  if (PRESENCIA.rol !== 'vidente') return [];
  return [...PRESENCIA.pares.values()].sort((a, b) => a.etiqueta.localeCompare(b.etiqueta));
}
function pintarPares() {
  const capa = $('peerLayer');
  if (!capa) return;
  capa.textContent = '';
  const NS = 'http://www.w3.org/2000/svg';
  paresVisibles().forEach((p) => {
    if (p.edificio) {
      const b = BUILDINGS.find((x) => x[0] === p.edificio);
      if (b) {
        const marco = document.createElementNS(NS, 'rect');
        marco.setAttribute('x', b[1] - b[3] / 2 - 10 / z);
        marco.setAttribute('y', b[2] - b[4] / 2 - 10 / z);
        marco.setAttribute('width', b[3] + 20 / z);
        marco.setAttribute('height', b[4] + 20 / z);
        marco.setAttribute('fill', 'none');
        marco.setAttribute('stroke', '#7c3aed');
        marco.setAttribute('stroke-width', 3 / z);
        marco.setAttribute('stroke-dasharray', (9 / z) + ' ' + (6 / z));
        capa.appendChild(marco);
      }
    }
    if (Number.isFinite(p.accFus) && p.accFus > 0) {
      const halo = document.createElementNS(NS, 'circle');
      halo.setAttribute('cx', p.x);
      halo.setAttribute('cy', p.y);
      halo.setAttribute('r', Math.max(2, p.accFus / METROS_POR_PIXEL));
      halo.setAttribute('fill', 'none');
      halo.setAttribute('stroke', '#7c3aed');
      halo.setAttribute('stroke-width', 2 / z);
      halo.setAttribute('stroke-dasharray', (5 / z) + ' ' + (4 / z));
      halo.setAttribute('opacity', '.6');
      capa.appendChild(halo);
    }
    const circulo = document.createElementNS(NS, 'circle');
    circulo.setAttribute('cx', p.x);
    circulo.setAttribute('cy', p.y);
    circulo.setAttribute('r', 12 / z);
    circulo.setAttribute('fill', '#7c3aed');
    circulo.setAttribute('stroke', '#ffffff');
    circulo.setAttribute('stroke-width', 4 / z);
    const texto = document.createElementNS(NS, 'text');
    texto.setAttribute('x', p.x);
    texto.setAttribute('y', p.y - 20 / z);
    texto.setAttribute('text-anchor', 'middle');
    texto.setAttribute('font-size', 14 / z);
    texto.setAttribute('font-weight', '800');
    texto.setAttribute('fill', '#4c1d95');
    const dist = Math.round(Math.hypot(p.x - dot.x, p.y - dot.y) * METROS_POR_PIXEL);
    texto.textContent = p.etiqueta + (z >= 2 ? ' · ' + dist + ' m' : '') +
      (p.n > 1 ? ' · ' + p.n + ' señales' : '');
    capa.appendChild(circulo);
    capa.appendChild(texto);
  });
}
function actualizarPresencia() {
  const badge = $('presenceBadge');
  if (!badge) return;
  const n = paresVisibles().length;
  badge.style.display = PRESENCIA.rol === 'vidente' ? 'block' : 'none';
  badge.classList.toggle('sin-conexion', !PRESENCIA.conectado);
  badge.textContent = PRESENCIA.conectado
    ? n + ' no vidente' + (n === 1 ? '' : 's') + ' conectada' + (n === 1 ? '' : 's')
    : 'Presencia sin conexión';
  if (PRESENCIA.rol === 'vidente' && n !== PRESENCIA.ultimoAnuncio) {
    PRESENCIA.ultimoAnuncio = n;
    announce(n + ' persona' + (n === 1 ? '' : 's') + ' no vidente' + (n === 1 ? '' : 's') +
      ' conectada' + (n === 1 ? '' : 's') + ' en el mapa.');
  }
}
function configurarPresencia(rol) {
  PRESENCIA.rol = rol;
  PRESENCIA.x = dot.x;
  PRESENCIA.y = dot.y;
  if (!PRESENCIA.socket && !PRESENCIA.reintento) mqttConectar();
  publicarPresencia(true);
  pintarPares();
  actualizarPresencia();
}
/* Expirar pares que dejan de emitir y mantener vivo el canal MQTT. */
setInterval(() => {
  publicarAyuda();
  const antesAyuda = AYUDA.pidiendo.size;
  for (const [id, a] of AYUDA.pidiendo) {
    if (Date.now() - a.ts > 12000) AYUDA.pidiendo.delete(id);
  }
  if (AYUDA.pidiendo.size !== antesAyuda) { pintarAyudas(); actualizarAyudaBanner(); }
  const antes = PRESENCIA.pares.size;
  for (const [id, p] of PRESENCIA.pares) {
    if (Date.now() - p.ts > 12000) PRESENCIA.pares.delete(id);
  }
  if (PRESENCIA.pares.size !== antes) { pintarPares(); actualizarPresencia(); }
  for (const [observador, mapa] of PRESENCIA.observaciones) {
    for (const [id, o] of mapa) {
      if (Date.now() - o.ts > 20000) mapa.delete(id);
    }
    if (!mapa.size) {
      PRESENCIA.observaciones.delete(observador);
      PRESENCIA.roles.delete(observador);
    }
  }
  for (const id of PRESENCIA.filtro.keys()) {
    if (id !== PRESENCIA.id && !PRESENCIA.pares.has(id)) PRESENCIA.filtro.delete(id);
  }
}, 3000);
setInterval(() => {
  if (PRESENCIA.socket && PRESENCIA.socket.readyState === 1) publicarPresencia(true);
}, 10000);
setInterval(() => {
  if (PRESENCIA.socket && PRESENCIA.socket.readyState === 1) PRESENCIA.socket.send(mqttPing());
}, 45000);

/* ---------- Modo elegido en la portada ----------
   App.tsx envía { type:'modo', modo } al cargar el mapa. En "no vidente"
   forcamos la voz; en "vidente" dejamos solo el aviso silencioso para
   lectores de pantalla. El botón de la interfaz puede cambiarlo después. */
function aplicarModo(modo) {
  /* El mapa recibe el modo en cada muestra GPS; solo reaccionamos al cambio. */
  if (PRESENCIA.rol === modo) return;
  if (AYUDA.activo && modo !== 'no-vidente') {
    AYUDA.activo = false;
    publicarAyuda(true);
  }
  document.body.dataset.modo = modo;
  if (modo === 'no-vidente') {
    autoVoice = true;
    try { localStorage.setItem('autoVoice', 'on'); } catch (e) {}
    voiceLabel();
    speakOrAnnounce('Modo no vidente. Voz automática activada. Toca un edificio o usa las flechas para recorrerlos.');
  } else {
    autoVoice = false;
    try { localStorage.setItem('autoVoice', 'off'); } catch (e) {}
    voiceLabel();
    announce('Modo vidente. Toca un edificio para ver la ruta.');
  }
  configurarPresencia(modo);
}
window.setModo = aplicarModo;

/* ---------- GPS: puente con la app Expo ----------
   App.tsx ancla el primer fix al centro del plano (690, 500) y envía
   { type:'position', x, y } como desplazamientos relativos desde ahí.
   Solo movemos el punto y la guía: no llamamos a select() para que la voz
   automática no se repita en cada muestra del GPS. */
window.setUserPosition = (x, y, geo) => {
  /* El GPS puede venir fuera del plano (coordenadas lejanas o poca precisión).
     Lo fijamos dentro de los límites para que el punto nunca desaparezca. */
  const MARGEN = 16;
  x = Math.min(1312 - MARGEN, Math.max(MARGEN, x));
  y = Math.min(985 - MARGEN, Math.max(MARGEN, y));
  dot = { x, y };
  if (geo && Number.isFinite(geo.latitude) && Number.isFinite(geo.longitude)) {
    PRESENCIA.geo = geo;
    if (!PRESENCIA.origen) PRESENCIA.origen = geo;
  }
  PRESENCIA.x = dot.x;
  PRESENCIA.y = dot.y;
  recalcularPares();
  verificarInteriorAuto();
  publicarPresencia();
  publicarAyuda();
  pintarAyudas();
  actualizarAyudaBanner();
  placeDot();
  /* Centramos la vista en el punto sin anunciar ni volver a seleccionar nada. */
  centerOn(x, y);
  if (!selected) return;
  const i = info(selected);
  $('sheetDir').textContent = i.dir;
  $('sheetWhere').textContent = i.where;
  const g = $('guide');
  g.setAttribute('x1', x); g.setAttribute('y1', y);
  g.setAttribute('x2', i.cx); g.setAttribute('y2', i.cy);
};
window.addEventListener('message', (event) => {
  try {
    const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
    if (data && data.type === 'modo' && (data.modo === 'vidente' || data.modo === 'no-vidente')) {
      aplicarModo(data.modo);
    }
    if (data && data.type === 'position' && Number.isFinite(data.x) && Number.isFinite(data.y)) {
      window.setUserPosition(data.x, data.y, {
        latitude: data.latitude,
        longitude: data.longitude,
        accuracyM: data.accuracyM,
      });
    }
    if (data && data.type === 'ayuda' && typeof data.activo === 'boolean') {
      window.setAyuda(data.activo);
    }
  } catch (e) {}
});

/* ---------- Arrastre, rueda y pellizco ---------- */
let drag = null, justDragged = false;
vp.addEventListener('pointerdown', (e) => { drag = { sx: e.clientX, sy: e.clientY, ox, oy, active: false }; });
vp.addEventListener('pointermove', (e) => {
  if (!drag) return;
  const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
  if (!drag.active && Math.abs(dx) + Math.abs(dy) > 8) {
    drag.active = true; try { vp.setPointerCapture(e.pointerId); } catch (x) {}
  }
  if (drag.active) { [ox, oy] = clamp(drag.ox + dx, drag.oy + dy, z); apply(); }
});
function endDrag() {
  if (drag && drag.active) { justDragged = true; setTimeout(() => { justDragged = false; }, 60); }
  drag = null;
}
vp.addEventListener('pointerup', endDrag);
vp.addEventListener('pointercancel', endDrag);
vp.addEventListener('wheel', (e) => { e.preventDefault(); zoomBy(e.deltaY < 0 ? 1.1 : 0.9); }, { passive: false });

const ptrs = new Map(); let pinch = null;
vp.addEventListener('pointerdown', (e) => {
  ptrs.set(e.pointerId, [e.clientX, e.clientY]);
  if (ptrs.size === 2) {
    drag = null; justDragged = true;
    const [a, b] = [...ptrs.values()];
    pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z };
  }
});
vp.addEventListener('pointermove', (e) => {
  if (!ptrs.has(e.pointerId)) return;
  ptrs.set(e.pointerId, [e.clientX, e.clientY]);
  if (!pinch || ptrs.size !== 2) return;
  const [a, b] = [...ptrs.values()], r0 = vp.getBoundingClientRect();
  const mx = (a[0] + b[0]) / 2 - r0.left, my = (a[1] + b[1]) / 2 - r0.top;
  const nz = clampZ(pinch.z * Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch.d), r = nz / z;
  [ox, oy] = clamp(mx - (mx - ox) * r, my - (my - oy) * r, nz);
  z = nz; restyle(); apply();
});
const endPtr = (e) => {
  ptrs.delete(e.pointerId);
  if (ptrs.size < 2 && pinch) { pinch = null; setTimeout(() => { justDragged = false; }, 120); }
};
vp.addEventListener('pointerup', endPtr);
vp.addEventListener('pointercancel', endPtr);

/* ---------- Botones del panel ---------- */
$('btnSpeak').onclick = speak;
$('btnClose').onclick = closeSheet;
$('btnCenter').onclick = () => { centerOn(dot.x, dot.y); speakPosition(); };
$('btnIn').onclick = () => zoomBy(1.25);
$('btnOut').onclick = () => zoomBy(0.8);
window.addEventListener('resize', () => {
  const nb = computeBase(); z = clampZ(z * nb / baseZ); baseZ = nb; restyle();
  if (inside) { const b = BUILDINGS.find(x => x[0] === selected); buildPlan(b[3], b[4]); return; }
  if (selected) { const i = info(selected); centerOn((dot.x + i.cx)/2, (dot.y + i.cy)/2); return; }
  [ox, oy] = clamp(ox, oy, z); apply();
});

/* ---------- Interior del edificio ----------
   Plano ESQUEMÁTICO generado: un pasillo central y salas a ambos lados.
   Cuando existan planos oficiales por edificio, reemplazar buildPlan(). */
let inside = false, room = null;
const ROOM_ON  = ['bg-yellow-400','text-black','border-black'];
const ROOM_OFF = ['bg-blue-900','text-white','border-slate-900'];

function roomInfo() {
  $('inRoom').textContent = room ? 'Sala ' + room + ' · Edificio ' + selected : 'Edificio ' + selected;
  $('inNote').textContent = room
    ? 'Plano esquemático: todavía no hay datos oficiales de este espacio.'
    : 'Toca una sala para ver su información.';
}
function buildPlan(w, h) {
  const st = $('inStage'); st.innerHTML = ''; room = null;
  const AW = Math.max(0, st.clientWidth - 24), AH = Math.max(0, st.clientHeight - 8);
  const asp = Math.min(2.2, Math.max(0.5, w / h));
  let cw = AW, ch = cw / asp; if (ch > AH) { ch = AH; cw = ch * asp; }
  const card = document.createElement('div');
  card.className = 'absolute box-border rounded-xl border-4 border-black bg-slate-100';
  card.style.cssText = 'width:' + cw + 'px;height:' + ch + 'px;left:' + ((st.clientWidth - cw)/2) + 'px;top:' + ((st.clientHeight - ch)/2) + 'px';
  const iw = Math.max(0, cw - 8), ih = Math.max(0, ch - 8), C = 40, g = 6, horiz = asp >= 1, rects = [];
  const corr = document.createElement('div');
  corr.className = 'absolute flex items-center justify-center bg-slate-300 text-[13px] font-bold tracking-wide text-slate-700';
  corr.setAttribute('aria-hidden', 'true');
  corr.textContent = 'PASILLO';
  let dx, dy;
  if (horiz) {
    const n = Math.max(2, Math.round(iw / 92)), rw = Math.max(30, (iw - g*(n + 1)) / n), rh = Math.max(30, (ih - C - g*3) / 2);
    corr.style.cssText = 'left:0;top:' + (g + rh + g) + 'px;width:' + iw + 'px;height:' + C + 'px';
    for (let r = 0; r < 2; r++) for (let i = 0; i < n; i++)
      rects.push([g + i*(rw + g), r ? g + rh + g + C + g : g, rw, rh]);
    dx = 20; dy = g + rh + g + C/2;
  } else {
    const n = Math.max(2, Math.round(ih / 92)), rh = Math.max(30, (ih - g*(n + 1)) / n), rw = Math.max(30, (iw - C - g*3) / 2);
    corr.style.cssText = 'left:' + (g + rw + g) + 'px;top:0;width:' + C + 'px;height:' + ih + 'px;writing-mode:vertical-rl';
    for (let c = 0; c < 2; c++) for (let i = 0; i < n; i++)
      rects.push([c ? g + rw + g + C + g : g, g + i*(rh + g), rw, rh]);
    dx = g + rw + g + C/2; dy = ih - 20;
  }
  card.appendChild(corr);
  rects.forEach(([x, y, rw, rh], i) => {
    const b = document.createElement('button'), k = i + 1;
    b.className = 'absolute box-border rounded-lg border-[3px] p-0 text-base font-extrabold ' + ROOM_OFF.join(' ');
    b.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + rw + 'px;height:' + rh + 'px';
    b.textContent = 'Sala ' + k;
    b.setAttribute('aria-label', 'Sala ' + k + ', Edificio ' + selected);
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      card.querySelectorAll('button').forEach(o => { o.classList.remove(...ROOM_ON); o.classList.add(...ROOM_OFF); o.setAttribute('aria-pressed', 'false'); });
      b.classList.remove(...ROOM_OFF); b.classList.add(...ROOM_ON); b.setAttribute('aria-pressed', 'true');
      room = k; roomInfo();
      speakOrAnnounce('Sala ' + k + '. ' + $('inNote').textContent);
    });
    card.appendChild(b);
  });
  const d = document.createElement('div');
  d.setAttribute('role', 'img'); d.setAttribute('aria-label', 'Tu ubicación');
  d.className = 'pointer-events-none absolute box-border h-7 w-7 rounded-full border-[5px] border-white bg-sky-600 shadow-[0_0_0_3px_#0c4a6e]';
  d.style.cssText = 'left:' + (dx - 14) + 'px;top:' + (dy - 14) + 'px';
  card.appendChild(d);
  st.appendChild(card);
  roomInfo();
}
function enterBuilding() {
  if (!selected) return;
  const [id, cx, cy, w, h] = BUILDINGS.find(b => b[0] === selected);
  inside = true;
  [ox, oy] = clamp(vp.clientWidth/2 - cx*z, vp.clientHeight/2 - cy*z, z); apply();
  $('sheet').classList.add('hidden'); $('sheet').classList.remove('flex');
  vp.inert = true;
  const el = $('interior'); el.classList.remove('hidden'); el.classList.add('flex');
  $('inTitle').textContent = 'Edificio ' + id + ' · interior';
  buildPlan(w, h);
  $('inExit').focus();
  speakOrAnnounce('Dentro del Edificio ' + id + '. ' + $('inNote').textContent);
}
function exitBuilding() {
  if (!inside) return;
  inside = false; vp.inert = false;
  const el = $('interior'); el.classList.add('hidden'); el.classList.remove('flex');
  select(selected, { silent: true });
  $('btnEnter').focus();
  announce('Has salido del interior. Información del edificio ' + selected + '.');
}
$('btnEnter').onclick = enterBuilding;
$('btnPrev').onclick = () => step(-1);
$('btnNext').onclick = () => step(1);
$('inExit').onclick = () => {
  AUTO_INTERIOR.activo = false;
  AUTO_INTERIOR.dentro = 0;
  AUTO_INTERIOR.bloqueo = Date.now() + 15000;
  exitBuilding();
};
$('inSpeak').onclick = () => {
  const texto = $('inRoom').textContent + '. ' + $('inNote').textContent;
  say(texto); announce(texto);
};

/* Teclado: flechas para recorrer, Escape para salir y foco atrapado en el diálogo. */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { exitBuilding(); return; }
  if (!inside) {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); step(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    return;
  }
  if (e.key === 'Tab') {
    const f = [...$('interior').querySelectorAll('button:not([disabled])')];
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

/* ---------- Inicio ---------- */
baseZ = computeBase(); z = baseZ; restyle();
centerOn(dot.x, dot.y);
</script>
</body>
</html>
`
