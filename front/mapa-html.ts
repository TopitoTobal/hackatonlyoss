// Generado desde front/index.html. Edita ese archivo y vuelve a generar.
export const MAPA_HTML = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
<meta name="theme-color" content="#eff0f1">
<title>Mapa accesible · Campus Casa Central UTFSM</title>
<script src="https://cdn.tailwindcss.com/3.4.17"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Material+Icons&display=swap" rel="stylesheet">
<style>
  .material-icons {
    font-family: 'Material Icons';
    font-weight: normal; font-style: normal; font-size: 24px; line-height: 1;
    letter-spacing: normal; text-transform: none; display: inline-block;
    white-space: nowrap; word-wrap: normal; direction: ltr;
    -webkit-font-feature-settings: 'liga'; -webkit-font-smoothing: antialiased;
    vertical-align: middle;
    pointer-events: none; /* el toque siempre lo recibe el botón, no el glifo */
  }
  #sheet button { cursor: pointer; }
  /* ---- Base estructural: el visor ocupa exactamente la pantalla ---- */
  html, body { margin: 0; padding: 0; width: 100%; height: 100vh; height: 100dvh; overflow: hidden; background: #eff0f1; }
  body { position: fixed; inset: 0; height: 100vh; height: 100dvh; font-family: system-ui, sans-serif; overscroll-behavior: none; -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; }
  #viewport { position: fixed; inset: 0; width: 100%; height: 100%; overflow: hidden; touch-action: none; background: #eff0f1; }
  #world { position: absolute; left: 0; top: 0; width: 1312px; height: 985px; transform-origin: 0 0; }
  #world svg { position: absolute; left: 0; top: 0; max-width: none; pointer-events: none; }
  #buildings button {
    position: absolute; max-width: none; touch-action: manipulation;
    background: #e8f1fb !important; color: #334155 !important;
    border-color: #cbd2d9 !important;
    box-shadow: 0 2px 6px rgba(15,23,42,.10);
    transition: background .15s ease, box-shadow .15s ease;
  }
  #buildings button[aria-pressed="true"] {
    background: #ffffff !important; color: #1d4ed8 !important;
    border-color: #1d4ed8 !important;
    box-shadow: 0 4px 14px rgba(29,78,216,.22);
  }
  #buildings button:focus-visible { box-shadow: none; }
  /* Las canchas se tocan igual que los edificios, pero su botón es transparente
     para no tapar el dibujo de la cancha. */
  #buildings button.canchaBoton {
    background: transparent !important; border: 0 !important;
    box-shadow: none !important; color: transparent !important;
  }
  #buildings button.canchaBoton[aria-pressed="true"] {
    outline: 3px solid #1d4ed8; outline-offset: -3px; border-radius: 8px;
  }
  #dot, #dotHalo { position: absolute; border-radius: 9999px; box-sizing: border-box; pointer-events: none; }
  #dot { background: #1d4ed8; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(15,23,42,.25); }
  #dotHalo { background: rgba(29,78,216,.18); }
  #presenceBadge {
    position: fixed; left: max(10px, env(safe-area-inset-left)); top: max(10px, env(safe-area-inset-top));
    z-index: 9; pointer-events: none; display: none; max-width: calc(100% - 20px);
    background: #ffffff; border: 1px solid #cbd2d9; border-radius: 8px;
    color: #6b21a8; box-shadow: 0 4px 14px rgba(15,23,42,.14);
  }
  #presenceBadge.sin-conexion { background: #fef2f2; border-color: #fecaca; color: #991b1b; }
  #scaleBar {
    position: fixed; left: max(10px, env(safe-area-inset-left)); top: 58px;
    z-index: 9; pointer-events: none; display: none;
    border: 1px solid #cbd2d9; border-top: 0; border-radius: 0 0 6px 6px;
    background: rgba(255,255,255,.96);
    padding: 2px 6px; font-size: 12px; font-weight: 600; color: #334155;
    box-shadow: 0 2px 8px rgba(15,23,42,.10);
  }
  #peerLayer text { paint-order: stroke fill; stroke: #fff; stroke-width: 4px; stroke-linejoin: round; }

  /* ---- Reporte de incidencias: solo lo ve quien está en modo vidente ---- */
  #btnIncidencia {
    /* Abajo a la izquierda, por debajo del panel del edificio (#sheet):
       ambos se apilan sin taparse y el botón queda siempre al alcance del pulgar. */
    position: fixed; left: max(10px, env(safe-area-inset-left)); bottom: max(10px, env(safe-area-inset-bottom));
    z-index: 12; display: flex; align-items: center; gap: 4px;
    min-height: 48px; padding: 0 12px; box-sizing: border-box;
    border: 1px solid #cbd2d9; border-radius: 8px;
    background: #ffffff; color: #b45309;
    box-shadow: 0 4px 14px rgba(15,23,42,.14);
    font-size: 14px; font-weight: 800;
  }
  #btnIncidencia[aria-pressed="true"] { background: #fffbeb; border-color: #f59e0b; color: #92400e; }
  /* Vidente es el modo por defecto: el botón se ve desde el primer pintado,
     incluso si el mensaje de la portada tarda o no llega. */
  body[data-modo="no-vidente"] #btnIncidencia { display: none !important; }
  #btnIncidencia .incidenciaNum.hidden { display: none; }
  #btnIncidencia .incidenciaNum {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 22px; height: 22px; padding: 0 5px; border-radius: 999px;
    background: #b91c1c; color: #fff; font-size: 12px; font-weight: 800;
  }
  #incidenciaHint {
    position: fixed; left: 50%; transform: translateX(-50%);
    top: max(66px, calc(env(safe-area-inset-top) + 56px));
    z-index: 11; display: none; align-items: center; gap: 8px;
    max-width: calc(100% - 24px); padding: 9px 14px; box-sizing: border-box;
    background: #ffffff; border: 1px solid #cbd2d9; border-left: 4px solid #f59e0b;
    border-radius: 8px; box-shadow: 0 4px 14px rgba(15,23,42,.14);
    color: #92400e; font-size: 14px; font-weight: 800; text-align: center;
  }
  body.reporte-incidencias #incidenciaHint { display: flex; }
  #world #incidenciaLayer { pointer-events: none; }
  #incidenciaLayer path.tramoClic {
    visibility: hidden; pointer-events: none; cursor: pointer;
  }
  body.reporte-incidencias #incidenciaLayer path.tramoClic {
    visibility: visible; pointer-events: stroke;
  }
  #incidenciaLayer path.tramoClic:hover { stroke: #f59e0b !important; }
  #incidenciaDialog {
    position: fixed; left: 50%; transform: translateX(-50%);
    bottom: calc(max(16px, env(safe-area-inset-bottom)) + 56px);
    z-index: 15; display: none; flex-direction: column; gap: 10px;
    width: calc(100% - 24px); max-width: 25rem; padding: 14px; box-sizing: border-box;
    background: #ffffff; border: 1px solid #cbd2d9; border-left: 4px solid #2a91d1;
    border-radius: 8px; box-shadow: 0 4px 14px rgba(15,23,42,.18);
  }
  #incidenciaDialog.flex { display: flex; }
  #incidenciaDialog h2 { margin: 0; color: #1c1c1c; font-size: 19px; font-weight: 800; }
  #incSubtitulo { margin: 0; color: #475569; font-size: 14px; line-height: 1.35; }
  #incTipos { display: flex; flex-wrap: wrap; gap: 6px; }
  #incidenciaDialog button {
    min-height: 48px; padding: 0 12px; border: 1px solid #cbd2d9; border-radius: 6px;
    background: #e8f1fb; color: #1d4ed8; font-size: 14px; font-weight: 800;
    box-shadow: none;
  }
  #incTipos button[aria-pressed="true"] {
    background: #1d4ed8; border-color: #1d4ed8; color: #ffffff;
  }
  #incAcciones { display: flex; flex-wrap: wrap; gap: 6px; }
  #incConfirmar { background: #b91c1c !important; border-color: #b91c1c !important; color: #ffffff !important; }
  #incCancelar { background: #f1f5f9 !important; color: #475569 !important; }
  #incLevantar[aria-pressed="true"] { background: #065f46; border-color: #065f46; color: #ffffff; }

  /* Elementos flotantes: nunca deben salirse del área visible */
  #hint {
    position: fixed; left: 50%; transform: translateX(-50%); top: max(16px, env(safe-area-inset-top));
    width: calc(100% - 32px); width: calc(100% - max(32px, env(safe-area-inset-left) + env(safe-area-inset-right)));
    max-width: 24rem; box-sizing: border-box;
    background: #ffffff; border: 1px solid #cbd2d9; border-radius: 8px;
    color: #1c1c1c; box-shadow: 0 4px 14px rgba(15,23,42,.14);
  }
  #ayudaBanner {
    background: #ffffff; border: 1px solid #fecaca; border-left: 4px solid #dc2626;
    border-radius: 8px; color: #b91c1c; box-shadow: 0 4px 14px rgba(15,23,42,.14);
  }
  #ayudaBanner button {
    border: 1px solid #cbd2d9; border-radius: 6px; background: #e8f1fb;
    color: #1d4ed8; box-shadow: none;
  }
  #sheet {
    position: fixed; left: 10px; right: 10px;
    bottom: calc(max(10px, env(safe-area-inset-bottom)) + 48px);
    background: #ffffff;
    border: 1px solid #cbd2d9;
    border-left: 4px solid #2a91d1;
    border-radius: 8px;
    box-shadow: 0 4px 14px rgba(15,23,42,.14);
    display: none; flex-direction: column; max-width: 28rem; margin: 0 auto; box-sizing: border-box; z-index: 10;
    max-height: calc(100vh - 72px); max-height: calc(100dvh - 72px);
    overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch;
  }
  /* Botones del panel con la misma estética Breeze que las cards de React Native */
  #sheet button {
    border: 1px solid #cbd2d9; border-radius: 6px; box-shadow: none;
    background: #e8f1fb; color: #1d4ed8;
  }
  #sheet #btnRoute { background: #065f46; border-color: #065f46; color: #ffffff; }
  #sheet #btnSpeak { background: #1d4ed8; border-color: #1d4ed8; color: #ffffff; }
  #sheet #btnVoice[aria-pressed="false"] { background: #f1f5f9; color: #64748b; }
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
    background: #ffffff;
    border: 1px solid #cbd2d9;
    border-left: 4px solid #2a91d1;
    border-radius: 8px;
    box-shadow: 0 4px 14px rgba(15,23,42,.14);
    overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch;
  }
  #inInfo button {
    border: 1px solid #1d4ed8; border-radius: 6px; box-shadow: none;
    background: #1d4ed8; color: #ffffff;
  }
  /* Flechas del modo no vidente: cards claras estilo Breeze. Solo el botón
     captura el toque; el resto de la pantalla confirma la ruta. */
  #ciego {
    pointer-events: none;
    bottom: calc(max(16px, env(safe-area-inset-bottom)) + 48px);
  }
  #ciego button {
    pointer-events: auto; touch-action: manipulation;
    min-height: 96px; min-width: 96px;
    border: 1px solid #cbd2d9; border-radius: 8px;
    background: #ffffff; color: #1d4ed8;
    box-shadow: 0 4px 14px rgba(15,23,42,.14);
  }
  #ciego .flechaIcono {
    display: flex; align-items: center; justify-content: center;
    width: 56px; height: 56px; border-radius: 8px; background: #e8f1fb;
  }
  #sheetName { font-size: clamp(20px, 6.4vw, 26px); color: #1c1c1c; }
  #sheetDir { color: #1d4ed8; }
  #sheetWhere { color: #475569; }
  #sheetRoute { color: #065f46; }
  #prevId, #nextId { color: #334155; }
  #interior > header h2 { color: #1c1c1c; }
  #inRoom { color: #1d4ed8; }
  #inNote { color: #475569; }

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
      left: auto; right: max(10px, env(safe-area-inset-right)); top: max(10px, env(safe-area-inset-top));
      bottom: calc(10px + 48px);
      width: min(380px, 50vw); max-width: none; margin: 0;
      max-height: calc(100dvh - 68px); padding: 8px; gap: 4px;
    }
    #sheet button, #interior button { min-height: 44px; }
    #sheetName { font-size: 20px; }
    #sheetDir { font-size: 16px; }
    #sheetWhere { font-size: 14px; }
    #sheet > div:first-child button:not(#btnClose) { min-width: 56px; }
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
    Con el teclado, usa las flechas izquierda y derecha para recorrer los edificios.
    El botón Generar ruta inicia la navegación por los senderos hasta la entrada del edificio.
    El punto azul es tu ubicación; el tramo ya recorrido aparece gris y el que falta, azul.
    El panel indica la distancia restante y el próximo giro. Pulsa el botón otra vez para detener la ruta.
    Cierra el panel con la X de la esquina superior derecha, tocando fuera de él o con Escape.
    Acerca y aleja el mapa con la rueda del ratón o pellizcando la pantalla.
    En modo no vidente aparecen dos flechas abajo: cambian el edificio con la voz y
    al tocar cualquier otro punto se genera la ruta y se guía el camino por voz.
    En modo vidente, el botón "Reportar un tramo" permite marcar un sendero como
    bloqueado, dañado, en obras u otro problema; el aviso se comparte y las rutas
    dejan de usar ese tramo.
  </p>
  <div id="world" class="absolute left-0 top-0 origin-top-left" style="width:1312px;height:985px">

    <!-- Plano base nuevo: cobertura continua de borde a borde.
         No hay zonas lisas sobrantes: manzanas, avenidas y campus llegan
         hasta los cuatro bordes del lienzo de 1312 x 985. -->
    <svg width="1312" height="985" viewBox="0 0 1312 985" aria-hidden="true" class="pointer-events-none absolute left-0 top-0">
      <defs>
        <!-- Barrio: patrón de manzanas que cubre todo el lienzo -->
        <pattern id="manzanas" width="146" height="108" patternUnits="userSpaceOnUse">
          <rect width="146" height="108" fill="#eff0f1"/>
          <rect x="5" y="5" width="136" height="98" rx="6" fill="#ffffff"/>
          <rect x="11" y="11" width="58" height="38" rx="4" fill="#e8f1fb"/>
          <rect x="77" y="11" width="58" height="38" rx="4" fill="#f1f5f9"/>
          <rect x="11" y="59" width="58" height="38" rx="4" fill="#f1f5f9"/>
          <rect x="77" y="59" width="58" height="38" rx="4" fill="#e8f1fb"/>
        </pattern>
        <!-- Áreas verdes del campus -->
        <pattern id="parque" width="72" height="72" patternUnits="userSpaceOnUse">
          <rect width="72" height="72" fill="#dcebd7"/>
          <circle cx="18" cy="18" r="6" fill="#c8e0c0"/>
          <circle cx="52" cy="50" r="8" fill="#c8e0c0"/>
        </pattern>
      </defs>

      <!-- 1. Fondo continuo: ningún borde queda sin dibujar -->
      <rect width="1312" height="985" fill="url(#manzanas)"/>

      <!-- 2. Campus: desde la calle separadora hasta los bordes norte y este -->
      <rect x="300" y="312" width="1012" height="673" fill="#f1f5f9"/>
      <rect x="300" y="312" width="1012" height="88" fill="#e8f1fb"/>
      <rect x="300" y="620" width="1012" height="365" fill="url(#parque)"/>

      <!-- 3. Avenida Placeres: atraviesa TODO el ancho del plano -->
      <rect x="0" y="278" width="1312" height="34" fill="#cbd2d9"/>
      <line x1="0" y1="295" x2="1312" y2="295" stroke="#2a91d1" stroke-width="2" stroke-dasharray="26 20"/>

      <!-- 4. Calle separadora oeste: de arriba abajo, sin dejar hueco -->
      <rect x="284" y="0" width="16" height="278" fill="#cbd2d9"/>
      <rect x="284" y="312" width="16" height="673" fill="#cbd2d9"/>

      <!-- 5. Cancha principal 8007 y tenis (zona inferior derecha) -->
      <rect x="440" y="460" width="150" height="240" rx="8" fill="#cfe6c8"/>
      <rect x="448" y="470" width="134" height="220" rx="6" fill="none" stroke="#ffffff" stroke-width="2" opacity=".8"/>
      <line x1="515" y1="470" x2="515" y2="690" stroke="#ffffff" stroke-width="2" opacity=".8"/>
      <rect x="1150" y="690" width="70" height="120" rx="6" fill="#ecd9c8"/>
      <line x1="1150" y1="750" x2="1220" y2="750" stroke="#ffffff" stroke-width="2" opacity=".8"/>

      <!-- Ladera / talud al norte de la cancha: curvas de nivel cerca de H -->
      <g fill="none" stroke="#cbd2d9" stroke-width="2" opacity=".8">
        <path d="M470 790 Q590 730 710 790"/>
        <path d="M460 830 Q590 770 720 830"/>
        <path d="M450 870 Q590 810 730 870"/>
      </g>

      <!-- 6. Senderos y calles internas: contorno oscuro y centro blanco
             usan EXACTAMENTE los mismos trazos (mismo d en los dos grupos). -->
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <g stroke="#94a3b8" stroke-width="24">
          <path d="M740 312 L740 317"/>
          <path d="M740 427 L740 445"/>
          <path d="M700 575 L710 605"/>
          <path d="M740 690 L755 690"/>
          <path d="M520 380 L430 380 L355 405 L270 355"/>
          <path d="M300 415 L415 440 L450 450"/>
          <path d="M450 450 L415 580 L450 710 L535 740"/>
          <path d="M740 445 L636 470 L636 600 L600 700 L590 780"/>
          <path d="M535 740 L590 780 L590 820 L590 985"/>
          <path d="M636 600 L700 575"/>
          <path d="M710 605 L745 605 L745 690 L740 690"/>
          <path d="M755 690 L755 600 L925 600 L925 785"/>
          <path d="M740 445 L980 510"/>
          <path d="M980 510 L1030 510 L1060 455 L1090 455"/>
          <path d="M980 372 L1040 372 L1102 340"/>
          <path d="M1102 340 L1100 455"/>
          <path d="M1100 455 L1100 540"/>
          <path d="M1100 580 L1140 620 L1140 757 L1140 860"/>
          <path d="M1020 745 L1020 757"/>
          <path d="M1020 757 L1140 757"/>
          <path d="M925 785 L941 785"/>
          <path d="M955 785 L955 860 L1050 860"/>
          <path d="M1050 802 L1050 860"/>
          <path d="M1050 860 L1140 860"/>
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
          <path d="M740 445 L636 470 L636 600 L600 700 L590 780"/>
          <path d="M535 740 L590 780 L590 820 L590 985"/>
          <path d="M636 600 L700 575"/>
          <path d="M710 605 L745 605 L745 690 L740 690"/>
          <path d="M755 690 L755 600 L925 600 L925 785"/>
          <path d="M740 445 L980 510"/>
          <path d="M980 510 L1030 510 L1060 455 L1090 455"/>
          <path d="M980 372 L1040 372 L1102 340"/>
          <path d="M1102 340 L1100 455"/>
          <path d="M1100 455 L1100 540"/>
          <path d="M1100 580 L1140 620 L1140 757 L1140 860"/>
          <path d="M1020 745 L1020 757"/>
          <path d="M1020 757 L1140 757"/>
          <path d="M925 785 L941 785"/>
          <path d="M955 785 L955 860 L1050 860"/>
          <path d="M1050 802 L1050 860"/>
          <path d="M1050 860 L1140 860"/>
          <path d="M1140 860 L1175 860 L1175 810"/>
        </g>
      </g>

      <!-- 7. Etiquetas -->
      <g font-family="system-ui, sans-serif" font-weight="700" text-anchor="middle">
        <text x="515" y="580" font-size="20" fill="#334155">8007</text>
        <text x="1185" y="755" font-size="16" fill="#334155">TENIS</text>
        <text x="660" y="301" font-size="20" fill="#334155">AVENIDA PLACERES</text>
        <text x="142" y="160" font-size="17" fill="#64748b">BARRIO SUR</text>
        <text x="590" y="830" font-size="16" fill="#94a3b8">LADERA</text>
        <text x="1170" y="950" font-size="17" fill="#4d7c0f">SUBIDA SAN LUIS</text>
      </g>
    </svg>

    <!-- Incidencias de senderos. Va antes de los botones para no taparlos.
         Los tramos clickeables solo aparecen en modo reporte (videntes);
         los tramos bloqueados se ven siempre, incluido el modo no vidente. -->
    <svg id="incidenciaLayer" width="1312" height="985" viewBox="0 0 1312 985" class="absolute left-0 top-0 pointer-events-none">
      <g id="tramosClickeables"></g>
      <g id="tramosBloqueados"></g>
      <g id="tramoPreview"></g>
    </svg>

    <!-- Botones de edificios (los crea el script) -->
    <div id="buildings"></div>

    <!-- Personas no videntes conectadas: solo se dibujan en modo vidente -->
    <svg width="1312" height="985" viewBox="0 0 1312 985" aria-hidden="true" class="pointer-events-none absolute left-0 top-0">
      <g id="rutaLayer"></g>
      <g id="peerLayer"></g>
      <g id="ayudaLayer"></g>
    </svg>

    <!-- Ruta generada por los senderos. Va después de los edificios para que el
         trazo pase por encima de ellos, pero no captura toques (pointer-events:none). -->
    <svg width="1312" height="985" viewBox="0 0 1312 985" aria-hidden="true" class="pointer-events-none absolute left-0 top-0">
      <polyline id="routeDone" points="" fill="none" stroke="#94a3b8" stroke-width="7"
                stroke-dasharray="14 10" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0"/>
      <polyline id="routeLine" points="" fill="none" stroke="#1d4ed8" stroke-width="7"
                stroke-dasharray="16 12" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0"/>
      <circle id="routeEnd" cx="690" cy="500" r="8" fill="#1d4ed8" stroke="#ffffff" stroke-width="3" opacity="0"/>
    </svg>

    <!-- Punto azul: ubicación de la persona -->
    <div id="dotHalo" aria-hidden="true" class="pointer-events-none absolute h-10 w-10 rounded-full bg-[#1d4ed8]/20"></div>
    <div id="dot" role="img" aria-label="Tu ubicación"
         class="pointer-events-none absolute box-border h-7 w-7 rounded-full border-[3px] border-white bg-[#1d4ed8] shadow-[0_2px_8px_rgba(15,23,42,.25)]"></div>
  </div>
</main>

<!-- Pista inicial ( decorativa: las instrucciones reales van en #mapa-instrucciones ) -->
<div id="hint" aria-hidden="true"
     class="pointer-events-none absolute left-1/2 top-4 w-[calc(100%-32px)] max-w-sm -translate-x-1/2 rounded-full bg-black px-4 py-3 text-center text-[15px] font-bold text-white sm:text-[17px]">
  Toca un edificio · Usa <span class="material-icons" aria-hidden="true">chevron_left</span> <span class="material-icons" aria-hidden="true">chevron_right</span>
</div>

<div id="presenceBadge" role="status" aria-live="polite" aria-atomic="true"
     class="rounded-full border-[3px] border-black bg-purple-800 px-3 py-2 text-[14px] font-extrabold text-white">
  0 no videntes conectadas
</div>
<div id="scaleBar"><span id="scaleText">20 m</span></div>
<!-- Jingle de pedido de ayuda: se reproduce una sola vez en el mapa del vidente.
     El audio va incrustado para que funcione también dentro del WebView nativo. -->
<audio id="jingleAyuda" preload="auto" aria-hidden="true" playsinline>
  <source src="data:audio/mpeg;base64,SUQzAwAAAAAAMFRZRVIAAAAFAAAAMjAyNlRFTkMAAAAXAAAATEFNRSBpbiBGTCBTdHVkaW8gMjAyNf/6pEzX8wAAArs2MQU8YABXZsYgp4wADGirYBmFgAGNFWwDMLAACQIAfYOcWNTBeA5BwI9sL4PQZDaW8haFqBgYGLgAACIn/7oTu+iI+iJu5//////p1z0RD4hbvucQt3dNw76CE8uoMLD8u8Qf/7yjhODiwfKBjy8MLD9dASBAD7BzixqYLwHIOBHthfB6DIbS3kLQtQMDAxcAAARE//dCd30RH0RN3P/////9OueiIfELd9ziFu7puHfQQnl1BhYfl3iD//eUcJwcWD5QMeXhhYfro/ZZdXQvFQXuZfBX0JlP+kQ9ijiCXx5ATYX/l8m47YD9+Tx8VhI2/8+TDmaHnuNv/80ZBocuEp3T//sYfQD50SnW+D4eB8EYSez4EcCDgSPA1PfzJA+XPl3oiWd//+gmc//8Gv2WXV0LxUF7mXwV9CZT/pEPYo4gl8eQE2F/5fJuO2A/fk8fFYSNv/Pkw5mh57jb//NGQaHLhKd0//7GH0A+dEp1vg+HgfBGEns+BHAg4EjwNT38yQPlz5d6Ilnf//oJnP//BpUASAMDw20yPBXzDIBPJQIDApAiAQFTGy4JfFI1AKgNMA0DYwQwWDC5EuMDSBIxPgsjBTBOAxgLQMWBgOPAwyDAsqE5GP/6pGzrmyIF9eJnyhd6oAIAAA0g4AABGuGjHa92b8AAADSAAAAEjKkRLIciGQAFAMBsfvgZCKIGJgOFsRfEsQYjjZZqNUhpERCEGx0DPAKDExPmpdUXnSd6zVQQgYJhIOWHEtFEz26NgvIupKa2tGtFg/MNNLpqi896KMxGZHp//zIQUJ5/b9bEt9f9ZiLB9v9iXV7/rkMK3z3+RQ2BAVGAAIZj4xhgcgQg4DxKNNhi5aACgFpGBgIQYAAYCYA5gWAOGDGCaYegfRq7yzHPYKcYjoTJjCRZjEvhgKQxgWCKaThxhj0OstWsEASYZg8duM8aNgYLCKgTcR9HpbSruQpLVp2la0aUi2q6dv3uzc9+7+dSNuAhUZHAKVg4zaEz2Luyf5qi/UIhsEgArk0QMk5tmGtI6EPwRNSW9Im3ppudRKQJQIMtT1c91ODllV/LW+9Qjd/Qet9li0Be00tk019T0xNflrX6YawyqacO5/VQEBioYERVe/0ACQRnvkQOZwOGpkMQGGgSYbBRgoCmBQoYcF5hkPGAxoYGA5hMKOypkYCC5pPonIBGPAZsoVCi2EFXajOWes4YYewA4NgWIRexnT0k7h/IBx79U1Qyd//98cvwtfjfpBGvOq9OKiAQ1P/6pGzQ7TUA9jhnzuuajPQAAA0gAAABF6WfJ6z6i5gAADSAAAAEFmcu0WBUa63e9UrQIssccAZbKLFNB/Jb/yv//KSklsyId4JuWakqC1vj7QVNyyq7hoUw9IgeAJFUeqR6zIAelv1lqp9p0QU2zmp+iKGCzZt4//6yX+/+Rxa+/+dpMcZAAAAFLIBEepEyRCsSLSZM8moDkjhQJRxAwFwFzAABCMB8PEw/peTHfEzMDoFAwJAGjBTA3AAAI8AxF4RPvZPRpsKUxVA5BhMIyBCqg8cosWoO7q86WR5EdQHxrjuRfOtVrLhDw+ADWhgOKRDlBHcug2HE+xoEULBSGMC/IQiAtLSpn6Wh1LCAqBK2XDNVYwM9YySI0CKUUqZe1T9RdASCNPWe/qI3/V8pijP5h/lkl/ofqm5LetDb5UP1KhJAAAMAJfIXqdX6BWccAylIQJBITmLAIZXDpqYlHiXScRUIp+9iimN4GQYRgbhgzkvmAQHCYAQGA6Aaqg9LgLlRNBoAhgGAMmCOEgZzichi1guGBgAaHAFPlHocZpGZJOluYrF4aFABTE0FeStjUttbpYT8k5upNxAZA4MMQDQDVAQtkI9GaIqHsleNZaZcJcgIFRQFu5bWSptLuX9UzP/6pGxmJE+A93Foxcueo3AAAA0gAAABFxmfM67uj9AAADSAAAAECiEFo5onqJt6a70wxCJmy9a8t9MgwFEZmpeZktvWlMwuaTs0ptMj2mcDJQuERqyXam048RMQNtWRfMucQBMGKK68wGyyi3nFmAFQROGAttk8YARCL7jR+3Bn9mjBIHzEEVDAABTBIKTAMDDAoHVbgoA5giJRm51BtOMAGBlaRhRSMgIKJnRdaci+rU426lhzaANLjQ5Bbht4Jbcuccq1zGCjKVWXY6/45RfW5nhG2kGAkJniGDD4GApf5iLSgYQK6uLrcyLswTjSQEdgtaK6ZZVMs09wyCDw5UT1kGTqdzFEpAUKDJIr1n638nQFiRt50tb7Y0W9ev5oHAt5j/lk/9X+P7/f/M2Tic2QAAAAALIiDNNygsw3MZMM1sOGDMGCbw0f4+MMzKJ7jJ3h6QxdIOgMGizNtIeMHg6MiDmNFjgMSg5MKwSM4/eNGBYMGwdQcMIgoAAMGAQEGBgHGDATGEwEGAoSmE4IhAAAAAC0C0TFQ6wMB7KKrgCcwIAABggnAcwnCcJxBxnwDFCY6BBQcBcLib/TIqCh8EQMh5XW71niGEVC/4gGkGjgoCTmpogXDw5Yybs6BwUgDP/6pGzwj1kA9xhfzPv9ofAAAA0gAAABFrV/ae/yR7AAADSAAAAECoMswJwqIIIIIIJqGWJBRcNLOn+kIXWmnrbUyaacr/UpZm/lgxVqQQ/zqv/86f0+G8zciDAnRyXa2U6IiUEPmXgvjM0wecx6glnNDEQyzQXj1UyQgh7MhQIczeENNuwQ4fVD2O+MintG1S2Xub+c1auzKiQhOYCKEWlMOTpNBPBJjU8XSHAAgGwl01RRRRSUIxNBnhQZqiikkkkkkkkKGFzF4gxeNknSSRRNAB8FxE8L0uaLZGhl0PEky6hQwoyzE1SGbX+ZOSp4sJ/S9ZDiIPpVt1khU6v4+TZL1FbkoWf/Z2/q6aj6A1hBACEEHt6zDSsuDJMKDEILzA8DjA4ExCFoQBRgkC5aIwLA4CAOYNi0d/cYYrg4CAhMPk/MsAhXkp4wJBJt4rFFfmEQZA61RYBGUEIBO21AHbw4Y28NMNWSM92YzW9c1jt9jBlJ4vOC5TQ5yN09JT1fqU1KZd+sVtZdey3a/KmxIQxm2cPXVFUmbGGWN+9JgsKJr1jCCc6iHITpZqcTBTP+XXFwdf/WLEvf9yYNra/rUJIbL+lpOGt2/Y4YjOv/ZllRU/yay0OwGxE5dtU4dIDTTP/6pGy0D2mA9i1fTPu6bVAAAA0gAAABECFfYezia/AAADSAAAAEURImsVREJohAUxLkoAjcnOY5D0LDldh2HLfn9ZkAhqtjCtf2w3HczlDR4siVO5c///bKaAqDLOVdLe7VqJsEGxJDXqbThqYH+RB0DpI6tRsDRwOEjMXlI2qdITf/qVH4hf/nP/nDX/2Isef/RLJKf+fJ/K0wAAAADAD8MAPTAEwAAIAAXbHAJEdAEhQAVAoAYYBGAGGAqABJggYBYaswFOAoYmMCYAEjAEwIYDAry+2rigASlgg2OADABAZRwW6MVWvMBBAMEAADi7KESQGGCYlEwFhYBgYGCAcwCCQ1hhIyuBwIBdgkDxijvSGTl7l3mCABAKaSYGHXllJN3Ln2rzNzB4FA4WRbjUyYzXrTGCD+ghpXPGuqkdGaCT4Skuan1mWVSVWFtF1/WkmKwJmr/og3XKTL76i+G6C95SZNvY6QEITpRIhd9E4mOQQgUujy7fQKYkwoQem+6jxnFWzLbRfLbDFQpmnmWBYIq9dq5QE6CBWLNPkhBwYMoImGDxdUMHPjA7SIR0YGURliWibq+v1VHUBMO1uVz0Ow/IYs5TEXhEPLs1t6/88pmikpY2KtcGUOH95l/N0BUf/6pGy7TaMA945lxkP9pMAAAA0gAAABE1V7W+zRvjAAADSAAAAEZ/4as5Y/38qbg6EfNbrUqW/OkMBNYCIQZpmCVVTmJoBpt/pCyDW//jwR/7JA1u39aASAbl1/PkMMQUal/ysvDUh/UyKyUQpoV3QGdASdtiLg50Hza5XHTpjBxhxaAAEiy6hm5p7N6z7BOMZQBccDBl0CIOig9oJxvFI9vOh1vn0LYbT/HEcRFTuXP/+/fpXeI54PvT+et7+tNuwZZxF0TKTzBCgZl4GpEDYyBCcuJt6o0AHngWoG6x8JbKQJgugPAf6p4XwcGv/x3Jf+R5Jf+gM8e/7OJq/9R00c9/VUoxULQCYAAaAp5dT5TMYAgCUYBeAJmASAAw0APCoBcYAWAqmAxAyRk8aOQYK0BmGAggH5gXAWGAOA+YBgBxgEABIxqVqAAEAMwIALjCZLxNVkNgwWwKTARAfMCYFEwOABFjtwcsvoFgGFLwoA8Ydo4xg4AKF63Eh+WU9Je1E0yBUFswNwSlb4gU0zSXZrGVAwNMG5w7TZnOr5mK0AHUiqPnj6DHZiRxAQbPhVaO8vimINzcjkgbqq/WtkyUDzq/1phl01f/MA8pGHXQ+0ioDxI7S1SS6RUhkoW4MUl//6pGzt07mA9MRe0/tZo3wAAA0gAAABHbWXHY/6jYAAADSAAAAE9aIxBfmv84ySI4lN1XUpMbhspNWLuyECYBi7kjPJTvEzA8QdOi88yjyVDzA3eeW7NXxPwjgQmtgxWuR1NlYzZiIVA02TGGtasDlzEBJiIWdIZnA152rTMWb5UAUen3Z+kPF3QirvwZLHTJUCNL5gi6mJ8jxmy2XBnQYjRZuTY/BqwZAzdA6GQR2lgZQiCamWp0CwGCz7U1UCmOeW4f8TSpSZwuMvkGmBFD36pJv+tPKX/zp6pv81f/5I+tP2R/+o08YCHIDAKiSZqZjcWZ8gYomIlBIZgP4N0YI2AYGBgAfZgDQCoYDmASmBpAgZjnIKQZyiYZNlQZS3gZwgYYQAeYFAwYRl8ZV2iY5dUY+j4AQLW69SaxgsV4OU0HBqYBieaDh0HAONAaoM/ZeUYBdma/jGgIigO2gw9VpKQonQafBUhMjOBaKcPl0xIwGtUK0C8JALaRwJyD6OynRWYDHgDGJ+/mYNzRiogkMPdQZJE8FxWrWsirRP9f1DcHr9R0czKL9Y1U/RJGShVt9QhY2f9EkjIoE2l0RkJmynUfRH2anFaslCms2/MozUTEFNRaqqDiABBMCaJJRkMf/6pGwid9MA9WZe1PP7ifwAAA0gAAABHSWPL6/2acAAADSAAAAEERA4DEEHAIAAMKhJAsYDAoQj5CeDBzCxCM1IX33EAMQPMNnIORkDyC/sYDEwVIiCk9HGumCYg6xJIgRYMviBptNpf5+uXKxBKPyUrYlXZc7lBZk5U9zVzBPbG8mMUOX73/+9MxInJ3X1BBISa3lQvM3NsFIt9QqGyvyYFxQWYeoYQtZ9TRmHmp/aIyyP5gOswGV1nBnnHSdLJE3Sb5kL6Jo7YAQEKCkSATMMKjDgCzD8GjCABwMIxhwDZhiBBjcC5jGZJ1vYZiKDhaUwqEQQgCspuIyChYAo3H3PKDQ4CAwqisqqpgiLLwICANRUIODByJxIiMHAZuJGagLqomARLd7l3VyirWhglIrCi9+qf/svAZsfxSb1rl+TuCYGphy7D0htYZamRwGMeBYcr33MQDTGibF1/EQElME7omq1AH25tUu5gEJCiJfmQbWfd+6hCIqK6kpHCZuf94spjnqjUIWat3MxOTnWvUoWg2W3ymKkCPZ1VUxBTUUzLjk5LjVVVVVVVVVVnqCYANCbbjZfcDBCYHDYZEkmYfBsY8i2YLAkYkiyZWGAAOsMWilMFw2MdQ3EITCMF2sFm//6pGyho+IA9Vlf0OuZbGwAAA0gAAABGmF7N67uT/AAADSAAAAEMDgULD4mDIUrafWPUL6F+wUFwJJwwrHtCcCHphSyGJak2XU0pZ0jKPl7UuWNzGtaGCJPonLtFMfn19zusoHjHb2NDWg0kjsruWdb1qlZEGM5F9tAvg2SMNG/RDDF2/vBsRO+uOoTBJ7ZsKyGjHSoiprFECNHaZNqVKYeJND2h8Lme/FYJKePdzEPcPGTNrjlFQ63uN0mpbfL+QmiAYAFKcTSYOApAAABgsgymEUE8YHYIpg2A9GBiCKYPwZhh4g9mgEh+YHwEyN5gsAAhAAJgAgCqqA0DsSAhMLQPUDFRlADLUoFjUdn13A4BYOIfIgDjmAczkGMaDzCTwZ3AQKstOBCSY1da9fmN3J5zSukkFHZj+/tP4coPtQi+ONS7Ua2Yo2hl+8k7LJ/XyQZFzNRp34RvWWAnRgt/REuGm72sygCrcwr8V8PCl90A7LJ+pY5pXW3x9junvxSVvxdKW13sSgm9ImT76lh+ZVLL+fGdEMWYcorkExBTUUzLjk5LjVVVZkAEABQDESk0BTMwCAEjAZArAABBgFgPmAYBEYG4PJifBPnRKh8YfYBpMCYYFIASoGlq3GAUB6YB//6pGxdT/cA9nRgTWu6jUQAAA0gAAABG1GBMa9uVRAAADSAAAAEgqmIccQY24NBgRAJlolStKcMWFAMgjmicPSCEBEQgVANDoIQswU5QNWDNgkxIjfy3hNW/vjgMTUt6/9z/vWh5vk97e//caMCGh5mivMct4zy0QhchNH6jEANY2pfiGCHt+Egr9UWZRV9jIOe6HrUIRJf4ukp+qIDOeuLhQW3sdC5ObM3jtLTr+5gIlRr+U7/lR6G76ME8EQwdAHTChBHMIAJ4VCRMGcCgwcgRhUEMwuxhjkqFWMUwFwwNwWzAnAgMEoAYwLQLSEBowLgJjBRA7MHc4Aw/gYE2B0EhASBQkMCgUUAwGGpjAhnhBYJB0LgBE0aAZgABAgCiQmL1Ci4eB/4YpZFEoFcQkDxQsHyd+OSmnrRecMfAirHJmT0lerEhgcJJSW5Yp8rfqoFyaTbqRNE3AKo3mHeiXga02b4CLSPJqdVYNKakmZNTD+EiTXTUtSAyyMt66pNERf8Qada3GYjL+7BwMe/GhK/uRCVUb/mtf5w8s2zAVUUOy22SQzvb3uO0Oi0zpabuQxfN5vMlIAPjHfxrJJdKB90u36QdMERAPzAPgA0EgBCMakVVou2bqxWqGviHDUdLP/6pGzDa/mA9lhoSmvbbGAAAA0gAAABHFWhKk9xsYAAADSAAAAEkTpuO+116mDCAMKoI5CMNitN2luWpTfjLO3VlV/HWWUqa/YiS1LW+Y3FpUWNy3FWD0+6Bvu81iqCsGCb7tFJI6+o8OPFT5C/OBsWo501Fsh/4sp/IcZk2jDFvE3iMzwAAAACEegyFd2bMMgNbjBeQCMwLIAZMBTAJDAJAHswHsA5MDFAUzCUAA0wVIVIMDlBODEcEcQyqkJIMEKAmTAaQDww6BExBDAwiGIzE7E4SJEwvBowsAMBG0fcDoLpWYsAUEEkYVmMamhYYVgSXZYk7LxEAambU1mQQLmZgpmCIEo+O3DhfVf/I+IgYNEgKQJX728soAdMCEmFlhkFXrdojcj12XqE38aRYcfHODKI+7W5qV//ZQTT3DhGf8u9xwkojFqwy7PWP18lp1IZDAbUJiVVYli2+Dxc4Ap9jOYktjGCP/UEhYFAEiud/5d/1IORZov/6LGo3a5CSAiNHJblrU27j89y0o1OfyNb597/7DEP3tfh25/3J8hCUn/++ztDv/a7+u6mrNVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGzYT/+A9RtN2nv5U/wAAA0gAAABJRmhHY/3TYAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVCFAAAQARSZPYTChBKVOBgYEHmXmAsA0TAhFtjAdAeMJQNswEAfDBTX4N2LQCiMYASZccRRMHD9VdwFDxAJjKPUMYB4vOsI9ACI0CQ5nhXYwKJwBG8xeOmnUdraVTvY0qwRjcNwNj3/rYlUCLgu4l2fGqRFSzAE4gNyJ0kDo7cvvi0AxZFV1186H4htbG9CgfJhzMByR3ppsXThs5ZuC1D9RWeTfLAZdOL89qLBT6mstBEZ0KAbUswT5YPbduWP/SHLR+c82eVUwBVBj5bJGye4I1CQigy+ODGKsFRWUmiFKADIPmSPBJNtGfpuCwzk/VQTvaHRLhZiPArK7//dEI51fGlLGJbGMUTX5dIfIGbhd+pRkZBnIBAi73LKFZwI5DLhgQiSLrT41AyqvX5MDF+quoRgbdJSpywKzfNOmHvJq8/5L/6pgJp9R/nD3/u3/lp4p3YBZyh+3b2xxYOaG0aOjqRlSAA0KhJqYl9yOM9xezqxdBEzppeFcKHb8/KAw0ex4iN+f/9YxKIerulNNV1LqOsfgFov/6pGxslssA9iplTHvcmvAAAA0gAAABEXl/WezOGLAAADSAAAAEYf8mAWCefe2kDQIKkKRVSutF8O4FxvrfUIgM0j5ypZ4N6GAYHJdpomeGCX7X6xRGf0OdOdXqcXghv1lvqPf+d/+UmAABABhAgA9h9qKJRgAQAeYCOAgGDbANxgiAC6YHSA4GCogxRgegkmYfrgtnKszuYeY9BguB2mBGEMYAwHoyBcBQGgQAyYAIHRgTBGmD2PcaJnbhl8jTGEAEyYAYFgcBAYFoBRgdAWhwKicTaKiMBgBc0ay3zJbSAQlQeZyu6CUdFeQ+zAwCNT3dkAwzcSN0kbqLumXKWSDS8aRN6Dzs1twfg/duii6EAteUBUA1sL/GCvPWphgtDy2s3uVuQbR4ZxgEiIWHEP0let8enLs03cAD1g8bp7LvbgnJ0M6hjMPTmf9t+7uP7eIwOB6az/3/jeWGctJhBRf8cvckGEuaEVBsEBmpzL7DR36wschsrBGffxw3B353UGW/wwuxPcdn/vvsBRW7treqW4kpa/fS2OpjVrRMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGwRBf+A9DpfWXs4mnwAAA0gAAABJnWfES/7i0AAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqmhUUAVRY1ySNqc64jW6QVAloVcMfFA0TBkEXnLM0wGJtckMXgTtgOUoQJ3Q0YAudNxXcHEAzVHOLqRqofKegBMJa+2odYFnG7db1JhuAUaXj/Ui+HkE1/fkPGC7e1lCbD9G1VPDVv6XWQ79XOGPV9xfET+tutv/V/80erdmIGcYeu29kPq5xMjysM6gSMKxDSWKg8ig4mDoPGAAVmKgCiMBjHQMB4o6WjDAZKACL8LRUGGABuQaIg/esxNUMFGzDwEiNCI+l+OpXXNnKjhShJObk8v2g0/1LDKcxzYi21jLHWMiyqxocJTVCRbuubv7eTGpSijMKCcsVdRVuTUbg+/EBxGJkOfv932ho95TZUIUVZRLeannjncYvLTMxYSJHoeq2wbbpSwgCBPgZlYQRlTVhqtUQAAIyxnsgUeZCZvnHn50thrgWJn9dZCax9kJbrPcfXvVoQ9IqUxBTUVVkZABQIhTbaJ0rVhmKMBiWGBgqCBgOABgMEpgeAAKDZMELACYGj4Zi9Ac2lcFQNUWEQAtYetizNU1pABgR2uhHf/6pGwul88A89Rf1ntYmswAAA0gAAABG81/U+7uk/AAADSAAAAEoeMtbf+AmEy3W6iHU5U8mnmeBl+lcv8+oMFok9mk/zNBIjhv/1e/k28pnhcCX9fvDPnbAhPB1KBYGxy/I2J6cAjQERi3633EJR7bVXzoZBJ2nRrUbokNAASO195zWRwb8bfNusvdT9FY6g+z/NeUT37d2/6h0nuyWEIQAAQYKUSBjjApmCYAGYJoCQkB6guYCAFBhChBGAyB2YCgExgpgfmGAFQaS9+B2TGRl6Q5iUGhhGC5ggBBgOAKXcOocACDZhYPByLzhk6SBg+JJgkDRgQAAQC4cEK0IHjjGR0MDQNfg40DEMDgUCKdSxXSQTMHsStIQsCiuSV0neJlZFIhoISwLehGxVdaDE9L5OAJJAcUIMyRZNSlqJ5Z4B5oEQY3ZJTnXUs4HCBQUXaB6upEmgvQKmWS6YFZaJ00Nh1ACjhtGr8vpVEqI0NVM9RVqcjRRWqUfmsuom4FhSNSMpOp4zpVv1tSWPk1fVtWXRlC220vK1jmsBCQAy9AzRUDwMBECwARa0kBWMG8IgwYgJzAjBAMHEEYwfCAzRbOGNxgXwwUw0jDSASJgUjAAALMBUAVDqWuEQIkwhkJmv/6pGxFzf0A9cZgTGu6m/QAAA0gAAABH4WVE692i8gAADSAAAAEYceCcOAGYXgAUAAxhVUdA4SAKrxO4wYAszebMxPBgFCyg82rjRGwzyQNlHgKMWR6UuVgt8n8L2dvNS8wjBirKM7t7KzyboFrmGYEPC3lN+G71qblgyCSrqPmubs5/WsIIot/ed/W+fea9rD975+XcaUvLLb97WP3vy7UgnDf495l3n6jNbmGsu5/jebG717LWH1p7mebw2fz1z94/hYhnPX7u8m+bwyWNUvZc/OI3vz65XYG8AAAIF9Q4wmAEAQBYOlN4w/goDAdDzPQ9Z82aiRnvCoJJiVhLmJqEaZuoTRkHlnBAlsuMN4BgwiwYzGPMDM65CZMCAdA26fQEDgD4dgAz+FgJCNjwGHgIBkgKAYDCIGSD+AkCAeWpwQAIgqQBQOC7guAAyWkQM1l4DDxJKwNQ2HumRiJ9AwgCQcJwMIAIAoCDVCJfBZZANAUPlGdTzREZAkxzyuPw5wYCAwwCAMjCYTiGMwEgDfyqOMWWWCoRA6CYVAICgX6D3hAUQlDRf6n+6Yg8rF0tjfKpkVer9RoaLv5Fh1izThubHBwLJ+3/q+v3zRYzeaJD6JE4pI63////+3////+Lv/6pGyfVv+AB8plwRV7oAIAAA0goAABIU4LJ1nqgAAAADSDAAAAc4mtAv0IDbMfNMjYMUwvg4zD2D3MNwKkwagMwwABAdD64wAAWYBwKpgjAkmBQBKYNwH5mPx7mdcNyYhAhoGq0MBnk6AYKGgGBAKHwhgQMjECHOMhPAGERUBjctAfHDQG8CqBhIAiGCfhzTQe0mRIKISkRF6BgQJgYySwGAQIFpxPG7FJak0klF4mgagcDFAZAOCIj0qqSKLs7LRJ1UKAwipeMt90edHMBQBEWNue9HWKenX+tFkWYN0cNnziKPqSccf71JL0SZEaI+Zos3ywPKPRNt+tRDR69Zskj9QvkGLQl3wARDT90jPm+Glx/kZsxhtiZmwhniYFBJbEOYxME6hx91VAqXMjbs0yJS2i7AaAXRUg8+Hed1XiDMzDBZTXpM8JZG57PXZP1lkoEME4vnD++gZhfkBTmBwwgDAUSkOaQYLJC2Wh8l9ReIoLnAoMAtxIgYE0bzzT2pZkCBABc8VTJCcHPzU6owlsKAAYDNFd9/LwFQ6Plhv6xWm2cznrGcDfW81/ywS32265cJf+XTAAAQAAHsTcZoEZhEABgBTCZa1tNpVUwQBQ4RBhMKyqTR06uJDeUNkPcP/6pGwTyNqA9t1oyQ96oAQAAA0g4AABFeWBP61yjVAAADSAAAAEQAjF2ByMFoLAAkLiIMcKgNIJY40lEZlKVIqAAFAIzARCwMZJdQwkwdDAEAXQRNbhbKVXTtyFKwTkLjxVAFMGUWZlcxlrzYkpgW0HKAhOBgmQGXqAGCw+InSLF0PmG9IYTxgcIsK+EBwBgaXECeLct59qpkDRYCxZFS6ye31rOBEMWFq5/P7rJ0DCDiSZWSh7fecEhVNnpNSbdESICQc2bjqavW8SoVGrWV8/rRTBoAGldpgRGpPTQTDEJJlMiRTpAoAHgcw4CFPpgr9S13QEAciijKFQBgoAiYAYGhgIA9mCeMkZKXwBomj7GBgDSECcZGEiYFheChOFgVadFbcSZ0tUHAEYTBGc6tyZ4AeJBkni28Tm4vW1RsTv2LqqBjsbruV8N/H7/3Nbwp30QlBh8grET8QU2MRK0ZNLyeHyEKgs2lTP2284EcAKCKKndhMGWYHEzrFoEUgpQrKep6/UbBYuVfOHv6xZT21tX7EPC7j7cp7d4uiR+abdSYiRU9RX39QiCTEsDdZAAAAFCAD5wLD7NLUfQmGAGAGtQwCgBQAAYYCoEpgQAcGCaD+YYAxxoq9tG/EQAYeYWv/6pGxUYPIG90Foxjueo2AAAA0gAAABGPmjH692b4AAADSAAAAEmNY9mTSWGCYxAIR0aHXkDeXocTHMAAAMKxLOkrjM/QtAQcF01iOQvOap9ydTCxL7ii5mGczJ6S3huDefQXv58oEITmGIbmD4HIKuVDMaWJCrDx/9DCn9C1QK/PrM0p/fVOBD4ETE1aiLqtqUWQhmUVLepttS1AiSW/LB7f1CGtTzrzr9QpogojfJh6u8VhH5f0+cccoVB150nq0NVhky0cMwdADACrYuvLqSocgsFSzxikBAIUmLQAZSB5p8cHenucMdU5+bCNmMmCOYJYXZgakoCgbxgKAUmAmAIsCo43dvU5SEAglAtCwaxhVt1GBsEcFQIxEAIkOy9TGD5BNzwXADl8QmxQAAxbhMUDIvS996ZB9BZwp38UrMAwAIwxQOgGl40CJUg6I9LryiS5BA5MFwxJmZDUJVy7qmAIVgKNDdDWT266VxBombL56oq6zAmQMaOJB+WCWqfSpBe919B7H9nJwHLS07ZEmnXz6w4RJ6WUM01GSAcWHZdHMRsMo105mBQCRMzGlVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGzanvcE9qxox2vdm/AAAA0gAAABHNWjFy56jcAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVWNtIAIBJ+2Qg6k4RzCKFUQqYYRJnjAcEajFnxIxPOWukQEmAaKYWCb1TjLrzeZz1FfwsV7kAmEROvW1j2fsXdbyqZcwpzEYIt63/HsvUtIO4AegD0UMVCbRyh0ibyAkkQYghFy4Q8ZwGqwLiN5iaUl1O7LQBMAPInZpa26zgZ4ZLV2q+kGEX9Tf1kA+rV6x+I1XmP+r//nf6pqrmAAGIIu22MxIO0wPtsX8D2S4kE5IJRGN2DIRTYohUc4c9QENlsaOzFjSlQwqksIMNJGpzG2BgowrFMMFJIUwYDUiDt3Io/7umHJKFQpzHQvjWOYzAsBEHWAsw5dS5het4DhA7xSxZND5dS1iPUSkOCxeSRVZJZwTeF1I1iGnE0Kzk2EhA6RzjokJDF2onCVGOE+G7s0mxAqZQOnSGIqdFS0DBZePFkrspa0E/jmCERuzobclCcdnMf5Dy23nCXrUYAt4dP/nUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/JfAApIJfSEwzGx7fM5IELjH8wygwwIIvMh//6pGxc4tMA9MZfUWs8m2QAAA0gAAABGQlHUe/2K1AAADSAAAAEIwxMIMwNAowAANYZG4wMJExhooxQSZiTPiwHgsN0JjibrahADFsQCCxiNMYHkBDtOCzBkSUABGDJHSyotgMKQ08tOyWssByxuJYK6qca3YnwtNHOHcyTVazgvQMEGIqkUSR+pEU8YOrKI83VIb/zFjpb/+br/84j3/kw/760h7/61HX/+fSRAAAAsAZVYwRgugMlAQg0Bkp4EgaGA4AWYDICRgDAAmAgA2YEIJhg2CnnQP06YrQWpgPg7GIKY0YmYQxgAgNgoAMwFgB0PkWygAEIA+MJgM01fgHjBSAAAACwoCoWVGACYMUosWWjFqC3w6JDN/mMXBhSt9Ju9VrSpooQNVmmAwIAsWi1B1vPWOX40MFCApP3KrOXPz/uVOOAIxgL3cl8pbXDDv8uQ+QjFGnXK3NvCHCmYJG4AJlr9dMusESGtX/hlLP21BiCzTzX50yAEoTg8mgqdLFmg5AaQDaWr9JY2EoR/6p1Y8DJ/60hmPpyKExBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGxFO+qA9Qle0fv9oPgAAA0gAAABHd2XHy9xtUAAADSAAAAEVVVVVXlnZQRyGK6WswJRBkU0oYMI2xwyXCCgFQItkXJM20NgieayYRIkRdVdDord+FcYYPlsYVu1G0l80zKKykCzbXL///+498SIcnWUN0lPnz+buSt2DLYo+j1d0SuC8iXue/NwgyLGqm06arMymkFhtNfvMkxFRip/+QZL/rMi3/8p//WPH/OFolP9XM1giAIABNggYAFVpf4tLBRKCsIAGQqA4AACzAeARMDEA4wpAXz5pTbMgQB8iDDMCoGsFA4rCAwApOIRgKKLigBBgCgdmBQd8fkiphoTGBgIY1BAso1YDAoAegdAJCIVtBgLOJKcMhZEBHPkE/Yzpad7aYABs1wEkgZFRVLtTHlL7ETCp/AQueWmx1V5+O5IMAEyIJGmy4896qJEQHLwUjk4gOs1Y6yycIaagDGk3XtSOS8EQIqR3/WsOhNX/zgz4b07pfmJbECDDOKWveV1B5AuicRV9x+OjHDw/3OTJY5ym9Wph+LTpUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGyOrtsA9FZe1ntYm3wAAA0gAAABHMGXH49yk0AAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVeWh0BYE4ptqVIFgGXxa6VURgYhHZEjVCC9YPJg/iq75S9dcOP9/7ReBZ9NyNyJEuYIAIsAmQLi/10w6gCgk0TLiDs9zAlQFkYLBDF+fubGYQAgMQrJgvq23MC6IChReaKJVHzpgeDCrf12FZLav/Of/Wr/1Ec3/SSG2/+o+Zt/1zzy0SwNBk3NdW5IH0kUguEBgwY0CCgaLMsIMKDN5oNiieTMSCI5s4QELBta5lShUsPe6POP2sdbrQVZfUyatIGXY9//7vKUplBD+RY396x7/KlswhISMkWRUyu5iLPAC3DTZO61WUQoECgOjGqBGp9RgShuCwY+33Z0w8ps//gvo3+gjhp/1UA8av/YehiEpf+OiO/9OTqkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGyAGq6A9Ate13smpQwAAA0gAAABErl7We1RXLAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsojA0QU7r7FTf7PZNCB4o3ck+DF2HvOKWgE7Kb3TNhK7MqcklZAOAHQ8S4AgAtv33cty2Qlo2zyyUQ4hzW93C99vPu96jaKsKsfz/p4Yonbo19hzs8KSN2nYim887hKiL7lc/hzDDn6pRIlntfP/zicXuSQc0iV/41JZdPdcOKehnpQPTz/6YsfX8t/81//jnxMZ9RSZuCMEQAYccZKNT8f+DbcQX8zOQ2JMuiJNTTgjOsxZwT6MIVC/jD/RTAw6dDBLSLYgENGDRUxaMgIEgQIigMAEtNRhYwqDLWWnpfq68Ti3qs1Dz7Pszpg0ZL6KgtuKAIkL0QxBJZkTwBbIKXUah3EKTIuUTJJ9aSQ1g/U8tTpIooh0DIBqRJLSSMkxsJKSqK86O41t8XqT/09/oP6mqb/KT+0cdz+xD+IakxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGxzLcIA9K5S2fvYVHwAAA0gAAABFREvWe/yJ/AAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqn9FLUfcsjbhzSxnQhhkpYECMCDAyaYAJQOcln4wimKBk3aRo8MpcFGp2es0xAV8qZeQme0lawZ3VKgaxOkmQCbGyl2w1ocBRHC2o6DbRHx8m0SAbX8yEOf+SZ6ZfUS32yd/zp/+svaPzJvVnG/zv+d1G3rOX/OeRaXYERBVPLrY5TgkGckgQQhWAI3oTDAn4yJmKNw4Sseexfh1aZAKLbjVLWWyxWTJLg+0vU0f+MN3IEy4+C6jFZ6mpBnoPBjhulsZAGul3MWUESMF/USpAl/rFdN9vLBLf5Ev9i3/lr/M/3nDf/LH+WXv+VaH6Tf1FukxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqp2AAABQAgCACgjwgHUHAzmA8BADQCQQBMFwGTAMBcEBDx3qHtGpwnmIoJGAYv/6pGwczZsA88BZ2OtYkfwAAA0gAAABDxF7Z+1iR/AAADSAAAAE+lMngYCgKYRDoYphCaL+AcOC0YPgGnQ68CumLDaYVASYSGiayFIYKAKYUgoYGAGEAMWgMChEDAKQ4GNZgBAOP/UzjktSLwID4LuDxsRJmuSoFER1dKcRKACTgKJDd1tmw5oKMC0b+s4F+DZdvG4SN/xPt/x8Euv7FgddJfUsc0t/0hv2/H+r8lS3dHsod7p/krX+dJKf/J+v8sn1qQIAEAAUaVIgoBYFAMgYCIwMAGzARAEMDICUx1zqTyJt3MZUNIwbATSANDAoGTAEEgQEJgKYBgCPxybzZ+wPpjGDxgsAoGAYuqVAOLtiwPmHxdHeRJgofAwhxYFF1s6MKwAMIANEALmBq5hYB19R2tBE72eEQJkygSaR2KftY3AMQ/LiSlMZKIqBhS4KZSJOfPPOhIIAYHJhL7BtY3n/EUL/7Q2Kj61CVGy/sZh9nb1qEsSX9imKlPeuKZO7cokLPr8siuTBl+RElzpv1Rukwsue8kEWfqkqW0xBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGx8bfOE9kRoSevdonAAAA0gAAABGzGhIa92i8AAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqQAAC/YfU0LjgoAAwDwBzAuAiMHkIEzIjpDK6+oML4QEwRwWBEA6YAIChKAWYBQBhgogXmEYF4YP8P5gSCFmAWCAFAiX2XyqQHGszCIDG+mOy1Ew2ICzK5oZeEKBdFYAg429HjH4AWrD0tZ9Q5zyAgovsVo7MosfYesxiQIvd+x/a0dGRuiLW7rf/elxMN5PZ9RTAdZEzBP1iJCT294XJpfUIkSC2+UQ6RE/9h7JZf0BdkSp31RGdDfoDfUf9zATix1+tQvEkH6nKIqCir7R3JGTdUlS3FQoLJCx+XaOS4uwZ1nbgBCbIKZmBj9mh5sM9YiAhCYy4QXRI2qF8bPIaaDf1Fye1GPBaE/LMiCD43g0ynrfP13DqBXLaeswA5FNFfKYIPhcswTQ6AlYiR1/qGcf+cLf+Gv8oW/lAe2/A1/4nIX/CD/KDKfw3T85k/QWw6kxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGzABcsA9qdoR6vclGAAAA0gAAABD217Y+xM+PgAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqt/2AmUla3/7W40ddMfNJVMlzAqn0Q5hR2KMrKO3TXC0vslACgwAYxcaA1Az0uS0QYAkrtzjwSLjvtgLOJWOrHyQGmVLLFPWljxrHbRATL8OZ5YUMmhSAlm9SxnkgpgRpITwRgsTpmQ2hnQYniXjBnrB5Wr1IGx7/KZu6vkFNRcQ9ZZ1INn/9D/nvLw/kcgtnX7A/lqgCakivXSSSHR9aTZt/C5eZi0ScmI6A/RgC4AoWXLSsAgJSMRCwASRAWb80Sxoy19GaXdru6a9Isa5UpR1COYRlvHWhAMpuCbkWn5lWdFzLLQAEzs67zWrqvZawpSu5nj8Sh3hiQIyH18qJo9b/OHf0Jpoz+Qm0w/aqbeNTv+xf+ZqH79Hbo3///cs9UxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGw8dLKA9JVH3nv6avwAAA0gAAABEZl/ae/lTfAAADSAAAAEVVVVVVVVVVVVVQIM2UkAxLwFDBcATMB8AIWABHAQTBHCBKgLhg0icmW+H+YmYihodSaHQ6JsYfgKZgvgQGFAGmBISGEoTGOICDTMCwfmCgHGHY5nJ3/my4wmEwOAILxUEDEoLS7aGc1MvUh6aXsGIAoAILp8U/MWnwfOwCVQcMMiNbpN3O2vmY4llMJzg4omh2M+qEIh3PMgSWBfhDiIl4aTrMD2GfgwxHH6qm4a4vfOLJFnGAS610Siecs4FgvlV5t0g98zb31FEpbLepNFhTw0p+o4WuZDEoGys9qGoXn0pzUbhsxU7SGpcZlaouWcDdSie/bXQ7IgIOmzKGMEo3GEFjwtLISimcVXCRQGdEaywLCpUnazWm3WGDRYCBZUVQCenZPdIDoQBFxcpMpXHMQzMAJxv9UtGQaKBkAXX6RpuVQqEmkbaDYiYmj/bjqGw/qu6hGRoprrVVh6zfR6yAftpLGxVW9mRNQ8osXywv2/9X/ymkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkgQAAAAEIBKJgGgFhgJIP/6pGxQ/dgA9xplSAvdm3AAAA0gAAABEO19ae1iaXAAADSAAAAEoIYwKADFBzAKBEMF0EIwJQDxGAkYIgVpg6CFGW7hYbggxBhQgxmBoBIYCYB4CAAEYAIEC2qqwSBcw8A451Rw2yAwxLAMwSAAvYPAmOActirYjavDWMIzDsYlsMSjMssLDx/765DKAF1WT17O9ul/6dIwBD68l/DC387nYlYoDgQPrtQPyl5cQLTLCewdVeucPXMQyGDkm2rZkCiAlo7VF5i1TRJtlgaDn+jI7lgMgqVvM9x+FyquZvTSNB2hA8OkRSnWJQba0pHkJfz1Uh5V6tq0ROhWbabNxzVJuTYCgoilukSZs4+rGJKWAIYKhgPSqMvHFImqkY3yotPapy+UbxR6RdoFHxE3sDMa4AlllyJQWLz//zCFTcfnqXLe5qm3jTBnc9z//6bdaZHQjdHh7H/tY0eepskmR5tudzP9GxaZYTyGZSeuo9UdCJSPUnTnWTphgkYZmdluY0MLfm+d6xSz/V0h7696kReiSN8t863/nf/l5op2cCdzh+7bSx5bivVjOCFTDWGBRJsqGnlMisILhf6lAICpXaZlSuNZf41mCJIH4ixawabgoTj/7qGeger0N4duZQLLVP/6pGwpi+SA91BlSPvdm/AAAA0gAAABE0F/Ra3mc1AAADSAAAAEkOkD5InUvNazAPbALsRNB1qWhUdBq4CcyNJJufPYReKj+e1ikQ7bPad5wGsLiB6eoOnh+v6HjYb665ZJ7r2qYmQoG1zptyy3/s//j+uRGkMAF05DADAAAwFkCHMHeA1TBKAHQwK8AiMAxBjjBCxRcxoLVLP9FzExTiGjBRDrMCYHAwOQSzA0A4MBoCIwCQHTAiAuMFUIkw3CADaT80NJgcgwwQnzBKBOMCICQwOQHzAyA+MCgBhM5kZgAABGBCDqZjS6ph5AmgYAVQZtYTAo0BGq5zS8oVBeMKUgUAgERmJQS/VVj8qjKcxggrnBjIGBVs9FM3Zpvb09ITAIQKNmXNYNS6vyWXNms1SqcUzdzustXITqrKgYGh4LS395cob+9ykwCEWo1JVjI/muPx8cMGk6k736X3Hy/F4jCoJl1B3+fD3d2nhGgheqcjt7VLUgKjGAMPIWcv/9pqr8aw2WAvK9Tusu7e3VPcIARD13+Pt9WT/KX9MJB5Z0p/luoiFFKmHQCANTF+xe1UxBTUUzLjk5m3dhB3Fl7rtJDyZlM8AY1OQDEhDboQgswoKRUGL5eSnLQpRc9JBWt//6pGw5BP+A9ItfWHszjjwAAA0gAAABJ6mhDg/7i8AAADSAAAAENlvuz/rbhKusa1LEvheoBuQuaICcpjyYZZAxok29uPwBQmj+/JUMLIt7NcLalT9tQnobL/RQBI6q2rfAdLfbqMv26G/6OMhZ+rcr/9P/kzWAAACBJEwZSgYxhqA2mByBoYDACICAGMCQGUwHQBjCdAwMH4FUwiA7TCNLKMkv2g9sy7DFQD9MHMHYwuDswNBpRVH8oBQFBGYUAkY/iCfDaGZ8mWYsBkYQguYDgSYBAIYEgCXNk0IW8YMBmY4SGcyRGVBZa5iLtSxX6xX+XcYARnsUZWNNCkM9O36Plp9RGRA62VFFe7ikzKqkfVkIXMwUMRDGhl1pZIqJlKsMqcowZrLosckdJQ3qaE3tQyWWIgyL0X85QUeFK9BgJMqKhsX5+1VksVlzhAkkY/Z7jzT/Zf2ImCAMg7h3vaPu9s+RKtfhMxW7TbiTJhkaWfCrOUov4s11drPDR87//dvdy3Bsm3vWvufz6AQAcC5b/fy3PuNZh182VX7CiDMkbRNEBDMAgCMFgEMCAAQ5iwSGLIpGHogmC4emLwYGGwtGk/IG0JAGB4JmAACCoCgICC46G7NSqBGskAYMvxQzCP/6pGyyfPEA871f2XuSVVwAAA0gAAABJJ2XEU93bQgAADSAAAAEODCCrY4jMi7st1nLHuAg4M0BkeDSe7zS2kfRnVFBaWxjMHONZ7/cYcsROXmCQaZPJjqtYp6eiqwLqUuuMEcIQKsa/Y9SWspXCZqBhAIbcJt46zlV7m4DJASp7XO4/rXPru3ILmWX9/K1uyQAOE28P/5T/M5pNa1r9fjh3/7Lv//5vm/vtGc6/vX/rf91u/////z/+r//////vGSX9WdVAAAA1mzSAAASIANuAPC4XGrwEhUKDaIpzS0BxYKTI/zlQmNcbGYBCGPqMHCAMAYPyceRYJzkQEzIUSRAEDGqYDLoGESqBm0qgYbUIG6AAQ8coEWNLJ0FIiBkIEABAsDH5FA1iHA/UEJ/C9QpUDCxNCgsC9gYyAw4fQFCOMwNUQYBi42AHNoPqWwMKhcDOKKAEDQGAwKFhABApGXMCyBAKhwAYgEDJLDkCNBCAC8apB7ReqJE+zF1SI5TUikfNCiaufXdZquw6FVmzu5N6zr1GCaUlmsWk2VPk/dI3NHUaFxBB00Tc8YkSdB0kpmktEzMDRlzW9qjqZnXXayrGK01Gz////8t2dL////zbaBARxE5xtS3bfX/3SyNs//6pGxFW/+ABxpfx9V3gAQAAA0goAABIboBEVnagAgAADSDAAAAk8LNAiwxcIl8mQgLLDjBoNNBwEBgwGAE6yARmLSqLFctyCoIKCIwcMziXg8xIBpmnSZEIjReBQFJ8RB0/BJgSXqaHCIygAYgzti8ef5TqtNAAGMkSAhkCAeMtqYalCTw2fTfmLqIc4wNxc8jMXCW/WHa3BZAEkS9Ip2lznCYW//CgIoQt1k7OMi88uJi5hVupdLevCAgh25ytNCopF89Uly93r36+amZNl///3ef9ins38P1SX8Puyf9f+//+T2cr28jX1A8gIADG2QZNleY+B+TBKYAgMYMgYhEYEAyYMAmjSBADSJBgLjIDGBIJGHozGKnOGBgqGEoRAYQBYLBQVuAEEg9YTcO41RWRUUMFkQGa1mBiIMgNAUcJDjxNJOuWVmpDSWAUJJWMUWnG93MgwcBgYCADBYN+ICTp4Z44tSqKQs4GoEAkOROpFi8bJG7V+PoTkCIWjmns4X/ZpiGikn9q+pyLA2dGl5wt/1FlH/+WCIt6f+df//Ov9/87SpW3QAJBF+WRGl47AABRGDA6AKylO1ABCAKAgw/CswGAQwLGliCAcwSCAzdgQ2kDIwbAcEgCAAqQ5Fy1//6pGxIIuQABpVH1G5zYAQAAA0gwAAAFzmfLV3agBAAADSDgAAEZA0ot2Za9zHWrkeUrPvlR3pRWw3d42DXfthpaT8//knf1fzwuuABQJ2EJvCyx1kPv4JIt5fZO8skbmwZD8gSBBmkwk8j+k/tzn6+yKkx9jPWM/uv13K7nqpjTAIATAqKthWeeVKCZgRUDDw08lCTqfRmYXNG6zTLKKzr1pIh1gGFmyN5Bf8lf319c1Jf//MKD+AAAAxYACJsY4AYCKQKCqPygqNwIBpgEFGERQYMA5hkJGLBaZ1NhyK/m1P5WeDA5piUgCGAaECYO45xgBBWGBQA2lIXteJX849KVABAZMCoJYyn1FjECBiMB8BMBAAILrvTQd+WUM4SACzMolzNTGUAqKAAZFet8j0j+gtf9SJigFphXgSgfE0AEhDGQskUsAUBFLEOEYkyZD+MsHEg1XAHKzJZPkkxXyy+ooghcgNmSeQPusTRBM2SNjIzHwBVgJ0LJw7WnUeayZFgkbMVVSwW6n3qDaTyk86+9qAx4IjRXbUOpq9eIqSHyc1KzEzDHBJmtRG9Y0uzoBkYkCgRGlHKgAgCF3Wy0N5XXm+2IWuEDBUAQQT9JAKWWOAUIRRMJPRMVxtAAGIKBP/6pGwQ0vqA9lpny+u6nPQAAA0gAAABH+mjEU56jcAAADSAAAAEBG6o8Eiz3yi/O5VYKIAFMHTdLkxKrrlN/f5BX7/IDn3+f/53/1z89SsQCGasMbhUgu6y6wWInYi6tjy0kVcJIkLVAr8+spm001dR0IfgM5JqpaQzalIGB1ZeKoASwckrHTbep/J0BCjZnzh/d7MkIPels850VCmiCiPkf/lk99/8lP/+dpBVZAAAAGFAEzLXjoPggQgHggCoYAFIACDAfABMEAB4wVQMTCiBuMX8U84TMDz8NHBMbgOIwmA3DCRJPMBINkwEAJjAPADUUU7RQYCkKEABGAoAWYKYLxoOG5GM+BwAgeRYBpejoRxZ0zuDhEB4zBT/IYnoHYNAGLVMsWxz31qLPCbZAYBChFyDQgHBwmWYvZ2QMB08Yu3KTfGYEVwpWRIaL147h8//zf/vChKg/MOgV3K9/CDUUp/kBxmijMMKNhQ8pF0FDFmm1Rb2SIkBveSLtkoW6k6lqKIYgRUa5YzJqTOTgPaWn5BHZ8xeJaHgZegQyxktR0wPhfoQImikyYtzuW1M7JBtg9lkilVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGwLzPIA9Xxny2u5nbQAAA0gAAABIVWjD69yd0AAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVbLrAAiEZ5pFd7Q48mlKQKCCypiAKmAQIYKCL/LlAoUM6a43aHkaXqCwNYWmtFZdY3/bEbawffQ8ZF7GdPUn9fyJd/6xtp2v//gm9+fO4bhgLymrycbBa1lzWZOW5hd6I2bdWOsgISRaK3ulvfe/8P/fK5A2H7yy/r6rVr39u6uXpcDiCYqdubqVW/WwIwVmfLD/ecFpQn9Jq26xKhXVL5e/zpa+v/TLX9V5u5BgbmbL9rKaDSlgmpHp15t4qqmZ8uT3mJ2kwhniiF8aAcaAGNrB9pi5Y0CZGEPlCQKqYIeDggIAPYO76O0s+H5REAEMHAJlV50+Kg792afvrJx/PrP0i3Xf+L1JZY/C6l5T16e/hY/Dn77rCHEmm+hyMXq9rKkvzCVBaRNSWBpKm2QkmOc/ZbqEBAYVj3Jc0QWnQZaZcQCifUhZD9QX40ZtXmCDZt+svm7+oj16Df6Zqm/V/QJ7KnKwgAAfumE5rfrRGd6HOZzSZptKLtmjgS6YDYrRkOk2GHWEwDAiDHxIiMVsLAx37BDBUFSML0Ac29FI9KCUw9BEVD0wgP/6pGxDcdOA9UdgTWuZjPQAAA0gAAABFwl/Y+/pr/AAADSAAAAEVjCkIACDxhyEwhAkxCp02BPAxTA0mB8s4GCSDQIMPkgAyDIqIJwQA4FAww6TwAg4iU+rEYMa85VlfBgGHLFAQB5jQCC7YrJH9ndTXbNK9AJCCOCgSCmqTujWaiEQGuIyLChRJTXRUZGwNDCpKZa1ICjVKcWJK1SqU3PFklmpMkl8WcISl2kk6T8axB1F5ydb1LEoDJGXnSLVmheCzaX6SajpqW+jrayRfIaa1Vs+oyLSlTVaYYAlAM8EpAxkQSDB2ApMC0A4wDgATALAIBQGoKAiAwDJgGAOgEEQwEhUTMJ8rMFoI8AgkmGQcWZFwOpgDgDKamAqB0LAJpWIdxUCYwMDITJwDeMAgA9gxgTANBAPKthv5gAgxQIkHEbTBgM+2dB3Chc8siitbeEHjo8l+FDI2wpVxG5Rh3nfx7ApgZW77UZ7H+WeXbr0EIWZWeO/WgFiv/r9ZxoqlEQz7h3KChFUzJwOLN/H08NIrL/1rBwjuNvV3HcCDMrn/nDgAfDwL9TTpZNEwxgCcb/0FjqNB/pdTmSycz+p88kRk8yoTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqv/6pGzq9/+E98xnxyPdm3IAAA0gAAABHTGfGM9ttUAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqQAABhbgXGBMASBgElSzwgAZQHIAS0RgCgHGAcByYH4hhtJYGGG2EMYBQGJjwmJgoGJZBMAeAMuy7SuTA8BDGZbz/QVh4YBEAgADYHBC1swkENLlgYqBLTR0CzJhKTEUBV0Q/SW73bUpT1eUKhAY3gyvadepFO5QH8BZmF7Dv65uOYA1hHg3Y1+dMAaig3hOYPOH6R1xU3/qZZZG9/1qFCHW/2I8Q5JqvnDoXrJ1LfRUiTo5IIhh5/5ZKw+j3+6bE6p/9M6WnhodQVzGO+6JtnZQAvZ1axCcYQ5hmFsTGLL/GhucMcC5JqEyUmdBRNq3cKcLFE0tjVztA3aepYjFniBmzXquX/+v+NXBUc+QH7sS+nqW72rMQi5rMB5Mux7zL//KlZkcY8WxSR9UeAImBfB8zIxKcesxYLBv67nReV/5f/+Vl5f+pxgS1v7l4ZgvKHkiX00xBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVUtl1izBIwDGFwBgsAWAQBjAZAQMDwCcwuwtD/8hcMkEE4wcAATDsYAgEkv/6pGyWB8yA9ixlRqvdo2QAAA0gAAABEc1LU+zNvjAAADSAAAAEva3KWII9gwCjBUQTGT7D75JTD4MDBAFDDsLgcVa3FY3FIQCLAWFzTBIATUMeQhQR4EmgwNO2r07XcFngME8yKD5H2NVcsbVJ+XW7FQYEUySNVIraisfgmDASqI8vUrazhdDA4UWm7koqrMkGC6t3/0FiaL/7iABi6u3NBIQ2gxt+omghHGBP0G1Lch4pICTciTK+sxGIKyj/nywsiiqvZazQbpqughAEAIoCBW634vBhUBYKoBpKAcgJBQCosDEYUwAB9Mi6ByDBEGGYDABQ8AemAnoo+qkrKSgDBQDcwEzyDyMVFQ0hAYzBIsplmxOBE5xCDU6SEOmstiZTCaYj/yivSZ416BtwAHjWgXQsgd/JRT3KbcUl7RDEoiFkUeSRreuXxHAG+EjQK6Bu1djIg4EWoInKSyONKsukYdBsELdVa1VKWYBdZH/VE/Gzq/m54LyNX/nEwuHGycWpXWaEEDyhYcn/lAeSGltX8+6BM/2zUbo61UxBTUUzLjk5LjVVIYAAACAQdLvCVI1WnABfTIOMFEUSASwCA4MHcIE6jGmzF3A5MEoAAIA7EgKAcA2EAFlvFdvkpsYAAP/6pGwA+fKA9oRlxQPdo3AAAA0gAAABGeGTFy9ykwAAADSAAAAEHmCyPoZyoQIkCMMAAmAiBiBgNnBiV9rIwACpcFwGDBmFiMCsAxUrtSmtVNisal4UiCFkBtU4rYxd606aybAXYh8xBUkan0i6LOAGtj0z/rTCZMgu7aqkjYLf/9dywIsr/UmK1Nf+w1BRUP9RfDApJmtb+xTIaChA87fWWESGFb/c7JL/qclT6tNACgGLBkaBodxykYCgX/mJkkDxlAhwiZISaPGVoIlJlba0EYH0EzmLVCTBgvQJ6YCqCGGJAiYxgAYDoYAcAwmAy4ACOY6VghnB25XGQR+YkDxhsHmFgQYXHR70+GGQ2ZDK5gwfAIwg4NFvUUlcioOCwDAAVDIGY+ACP7EGvtci7iNQMCg1MZprKgUXoejMSgpVNV7qT853Evq9pKgt4+HVLUtMmBMwNBqkikiiZFZeHgmBKSEzJonx6IqWuPlMdhYk2tSycNjt9RKMod3zA95Ubzhc/pCCH3/MDSRBLVdRc6j5lmB7+oof1Gi4tUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGxBp/oG9gtlRss+onAAAA0gAAABHaWNJc/xrcgAADSAAAAEVVVVVVVVmGc2CFUcpHEmzIykG0yTwKhOzzowUlREBhkAqWFsDBorNRtUziUjEyDLcyHIxEJTF6SMQKIyrFzSgRQ2GZKxAAIsdy0Q8x4NKGiRYh4N7ilToCKZ+2EmHYkqTCPhzW8sHlisr/oiwt+sXq5if9ZLfXnf9Z7+pHX9P6j84e/y//qPJHCS7f8hABmEjqGFSAKRA6jwG4OAoMB0AkwNANjCDCtM0Y0Q0CfrDBMELMF0NgxmTajDzAqMB4BkGARGCeEiYTgSxhsQMmQKHmYBwGhCCVVFYjBCbL5GSwcQ6o6BWTCgaAoJTIZ+tUwkCTB4GBImMYcwxCDEeX+pXwWbfjQogQ6EWF8hAldDvJ2eCF+905nVpEtsC+Aj4KnNGVuYhrgtDLy/WZAGCGks4PWuPgLis9UyXC9VH6xEx5V9nDTz5oc6orUr25bWLozpe7iyGO/uMSiTS9jMQc59C51BYvUzr9aI+htqTq3ccCJgk+uZukxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGwZOtoA9DdS1nv8iHwAAA0gAAABHPmhFi9ycVAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqiHUEQyQ/LdY3A34SlVenQu9CQw8GCRcxg0KI+h7Js9PXLV+lYd61jlHb1p0h5e0jS40OtyGQmskyBq40UtTVBrQqjJLX1hghv0gxoFGPfYvg5j7fgOLUfxMHf4Q/4hf+pn+U/0L/5/+rf5b//8vEuoEqAieXaSSommCBghQZuCYIkZViYAoaGqpqf8oUJ3tITj/2IsXBAJkRHlfYtahmVNlRgTNFYZ+WC6zCCC66GAjIjM9ZD9naTkRuKX+UE7naGD5HglsunqbvPdI6b+Bpb2/2U3WZAyCBxdDMss2rPJQSB5gAhKZ71HQlman+LokbeywsSp/WJCMND6ZQDCp5X2G+Sxn62cPOk34fBP7VRfkJPemWBa1G5/rUKcgYP7D7GSRLlUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVIAACAAAdWYT3EAAS8//6pGy8RLSA83Fe1/syPbwAAA0gAAABFql/Te1uHDAAADSAAAAEQQBcBUwCAVDAXHIOooto0mDsw9BAwCAcSAJIAwDAEweFYxHCczR5g2kFgwRAVTR351wiIEDBgBTCInTXIeAEFpg6BQOAFLpKwwABIiAJFww9LoMASG6TOSVaQeyFVBq9FsogYYoapX5wGowRom3y4GZPfWkICFb+Nw3t+LN/2Jf+ZDTdf1j5f+WSSv+Qev8lWt9ZErfm55X5ZNJ78mqH51w6gIAUAgL2LlM5MAMAYwHgHzAPASMDoEcxeTMTurmlMXELAwXgQzBkGjAwDwKBQWB0RlcYKi8cGy2e9CmYqgYAgtLfJykgBBwRkQdGFBqHLBUmFgAGCoChgCM7UOMHQeAQehYDzElMzAgAYelNaSU++iIBChFZ3l611EzF8ADNKRRUpakioAMCB1QiZaPs6R0M6AwIMmjH6AYCHh2+L4VP/DL1/x8D19ah9iAyZsu1FIQoPRx164/my0vxkKH43Xtboi2MnX1jVTU30RiJJ/jpZL8sn0xBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGw5beOE9W5oSEvdonQAAA0gAAABGomhG692i8AAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVYhiABAAFpyJFI3TyeTVWeuNhocIzX0tzF5ErMNMD8twnQBAAgICYkQvwEgBqjfyUUkYIdvzUvSuLzEstKPJX5SGnfdTNy1MIUZgOtOfu3bzutyKKO5RfvPPCPiM0brP5ezzwmRVaTNPXrP5RQ5elY8KX96vA1f6DP+C2Y3xA/+Mf49/lRZ/i/t5V/P+/kEzrgACAAAdNqaN480GsRk6p3N05ubLcVLmCjhYxhvYdkYDGAqGAJgDhgNIAkYNgEMhYBmMEzDST26A7N8M9HAwKEA2ZIDmtSo1lJimACZjQ6cN8L1MEBS2pgIYbqSLPYizlrsYVuNHLQuBGKhksiMZjNTJlSmKJoFBlBV0u7Z4ZF0cIADJGCZABrHiaqLpiBSkq0nCXAQBkR9Hgiq9Y7CXJQ/69IexR0uoeyRsTX8nPVMRbDxnC/ez0hxk08l31mpp/PZUUfW/ue0v6zL/Usk34RlcmkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGxCT9OA9HNQ0/vYO/wAAA0gAAABGml9L8/tq8AAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqVsALJqskjbRxhA44KEsKlKIZfFyW4gYp3wpqG1w5bjEFuyxhqXO2BYJcCFajA4SgAcS5//mNSGEuZE6fNNZ1BtusZwBiqVE/WoWUkQ8EWN23IaW9YfwFSZH2IjrfEUGETX31kDKv8u46H7KaniUXzZ6ushyP/QNfbSpDcN/ueyX2fDKQqkIIQKq5JW2e9MoKYE0ODWMFVOKwQaeRcN8PgY3RYnfPbRp4wufFRm2u6ko5HDYiGUPKhIHxi8/z84wfph36Eiiopb2qotGscXSA7cK53//Lbu3E3QE5Le//ZJa3q6SMJi24XUo/83P4SwQMUW8/UdDDjllBFEwczNBmjc0AswmBQKBiQdZFJhUDazVnmme6Ag0wf09SQ231NdFZsH+Dtu1dIkeSp79uWG66vFzHqkxBTUUzLjk5LjWqNAAAQHQGgLw4CEDANBgAJcowFAPzB7BHMDsCwwHgbzCRCJMKUW4y0vOjbNH6MKIIkwNwODBAFwSBif/6pGwAurwA9BdR1Os0jgwAAA0gAAABFe1/Se1mT/AAADSAAAAEXGC4DCQohAHGCACmIYjHU1gG6obCQ2jwHy6lGAFQmzUTcAGgSanKaYnBm1OQ9tZLAw7aiSMpkENy1Y1Z7e+W6jUbFAEMQgJdS3hxywW8xBrACbyNHpjZlny26QR0KM2qs/YzEchQaB+7FlE1MiyBRpF000TRFbF9lgCLdXlzpBoZ9F7TLYpkS2VoVuOoKDfucR4rJrevPVTctdnOa0gz1Prmh9eM1OmAIAAIMAmpBksJl7NHLMAAAowXwGAMDOAgtTA4A9MB4RYxfcqD8RnDEcaTAwKAKB5bhIsZBFA1RQEgaYNDEbA8MaDCkYfhOYIAcAAKDgrAgDK4i8odsRAMZWqUY2g8qvAt+DuOU31mUkoAGBoyvtM63ybLUXQtUBpwY7ka0ptdhHQUvjkl5Gy5/CI426s/qEYAsKPPRWdpMTQAg4W4zMUifRLKjSoBIxDvLfOhlhFXo86LY2rWs6wz4ULPqcpFfjdf9uP7dKptERwbfKXkFhAAAAEGCTkg2txuqZCH4iBSMCcHgwBQOQaA4YEoCZhfA7Gi+1cdSwYxiBgSmC8AMBgUwUBIAQASAAtGYLABgEBowJgjzP/6pGyMCvoA9wVmRkvdm3AAAA0gAAABGcWVHa92i8AAADSAAAAEddM0xQAdzIIyLaqbF1TBIOQWikrdAVCpkz1g6AEQRV9FYHupGMUtTRCBTKKEZ3KM9Z6kOE3EBGFTJocZfGM6/N0XM6QVBocenZln75sqFuoI8Gh15/OBMQXMJl5M4anSTMSuRQDu4LsIAQw+LkkMSK86BDqd7SdRUslA3Kl6c2qRIwUqyEyefcxKoQjBSSeqkN9dxdkn1Z60hpb52tqonIlla5D24zSlIAEIRGoyqG3CQxMAcGAwdgkDBEBVMEUEQwiQljD0FtNQfx08FB+TEvCIMHIDkwMwFAgCFPJ2lsFrzBgCDGMVz47ITncSzFgEDBcCQKAoEAQQgqgnkMwzMqA8ZMUAYehaEAc02RWKw6Ab91JeIAEM2h3Qghdiva3I8rMaEAFmMgHL9o+bszU3rOCBkVTCMCIFVov1cLhoW0oT0HYutGo/oCtg4B3WnQegdCApmt6cyY1nAlBXyafMw252fntEjhP7puZOtVEkQisWUtqmLI7tYpow7eWqcZwrcwnakzIEBS+rVIqfW8UDHT1xEAEAkFZB4+im1TeNGswQGAMCAgVmgB2Y6ARgkJA0zGBYGqYuHIpknP/6pGwqef+A92llRmvcnNAAAA0gAAABHRGXFM92b8gAADSAAAAEFuYRwPxgEgdgkBBJ0uQhMWmh4MAMmAiCEYL6ShhRgeGAKBCgxOKuQAp8y/kNFkDC5FdMDMB5VNuT841UCEPIloQmA06DB+J0+ilNKibBIDAYYCZlQZpPOzhEWgFEAgwwXXOKKzLBMNBdpvtUfqOhasOB+c2SC3wW86YzRzqkqAW3PfO+JKv77FMWJ9A/PZaCIDC9hq9UlULKKJC9ee46m6db6IewW/ko/HOXbFAHRHe+g0xhQyjBoLAOYFACOgIFRBMHglJAIIAPARUhAJGPyBmN4LkQQLiKwQSTUEMUGDiYYco2ImhEjTAPPhyBGwqARgRD2q8MMHNwyOATZ1DNBb0vl8sqyjZQ0fm5//9/+ykVHAr80Kd7vm736tiISDosWlut/oixEi6TIFeDKEua9TsgZgQUTqThfYyROJIokMAxQjjQpG5nNSbJ1IngaYNs9sosIusfg55sdfY9sPkbzUVH0nY2KoJGBeS067EaO2ilP//b/z7KVndhBoKJ99pGzjA9Elez8qbGBG5iAyaCTGKB5kBuzIYIB4mluQODUroTLUfASG1IDMiVgoE4MNEHDjRAQta3Uja5Cv/6pGzduvGA9p9lRuOeqnAAAA0gAAABGXF/M47qT/AAADSAAAAE/T/iT7cyfnNNKdedjowAcdLcpvX8xwqTcACME13HrpLe72eOVSJrFAbL7T9y/hbpqPGlQ5KE2rOVneGtZWpCR2eq6tYgp6pkU1UrBtmj+t6lj5UylV+a+/VJonNfo9T/+tv/JEAQQhC0AADNsDnMBMFAHAuBQAQqACmAQA2YOYLRhMg0gEHswuADDE2KkNCv7g54yPDCLEJEQOhgCAVmA8BUAQAwgFxoEQaCACFwdOIyC6w5bBkxmB8DCeKgeCQCHQzLQwQu8wABYQAmbLG+ZfAyYuBOGDul6pkow/AIACMykwPAEw9KppxdCJ1offaVxKILyMABPMxAzEgUiUthx1JHTSJ2JYIgaAQKwwrW6LOrLzak9ulbsohLuU1e92/WpbiqTnV5XN9rUeNLOS+KT2cYwt37cplmMqTEnqWfl9DezpKStdWFpae9Xq2I5j87NSe1QU0rt49+XV6RSM1qrYs2IzWu0DYHupZylsanJ3nbEtv39UdPhLpfS4U6Sz3Xr9u5duZ5yzN2anatJamqTEFNRTMuOTkuNcRE8TEslm/bNrbW6lWTZhMwEMO/sTk2kE1xmYMiIKPhw//6pGwTzf6A9TpfUPt5bHwAAA0gAAABJUGe+VXugAgAADSCgAAEnJiA6SL5g5IYECGEABm6eaiQmDKZuzQlwFw41wWCoCJE9AAhx7JEjmFwkxUTUxlJnwYKjBMFQ+ZGAuiydLumrxcQhKrbdOXIMdGzEQGJOurodhQURoo0nef+vWWtcFBDgrvazLhwYKL1psC03/v//1M1Y3tf+fzuvqlZLrcpyGQH//X//f/POxz+b/965v////f9///n/////u/ndG/OTXUBJYgKgk7GkDZtE249MiEQgBAz6YeQGQjQkJDAWYqOFwjGQMxQJR9BwYav2m5D5hASXGQlPAMDXDBC1EnDLKPF7kBRwTwYxpcOxnHLL7MZhmQvCWpNtCRWad3HmN7//VNTZFQiFkJxkIGQvg16Hn7e2Nw3zKvASXwqcBYVDVlT/ZbpNcldWm7QqUgRWHYl1UdXVaJ83lc32tKgaBWrS3s/139c5jjemgAEd61+O6t/+Z/++TLLssef9f/w7hv+tGRFnef+pR/////67///8/////6/KkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqEt1ILQZf1sRlkUFADByJDBkChiGA5H2GC8RiEVCMUmGBOsCIgIAR+f/6pGzfBu2ABhFH0G5vYAQAAA0gwAAAGmV/Nb29ADAAADSDgAAEjTqmdxOXcLwGCQWwEeKPm2aFya/WmW6MLMNlYnSZ6lkNyDPWMPd/7hgy+X//3L36z/dyVtdEvQ12QhYdVoxEBed/oq78vg16GFjFI1QGGKkDQu8+9/CMcuY0VcLEQpbZ8zLyrVpoFMCgcZNBJA3OKUcT0zjgKKyE8skvUm3UKK3Wdec9Yvg6d25v/nD/3/yVf+qW3VAJCKfaxnPRoZeC5i0IAYAl8mSsDGAECAiZeBpEWzMg7EgOEEAzOCzbBBB8/BwsLyDIpQ6qoOS8WculMMuEpSmUZpHBwVGcty5aLqS2SZKwzusnpMSbKXW/9smPZJbx3OSsKHRqSYaUWmEgRclp0JEAYyeo1SNUzS4olqKxBqInD1hdbFrDoWLLv5UFPO05gRgNm0VkUsl2lCe0ErjecOw6+xhRMPCz82pDqaouakWeNibrGWArZ8bvKsy+eeHcLUgwu6Zsqp1O2zDlgjorsiyZAXp/H4bfzRdLrYdI39Pn00xBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVUBgAAAKmiB4CdCF+qW1jGWdFpQsAqCQBjAAAXMAsC4wHgczBtF8MuzsI1Xx//6pGxHPfEA9dBfS+uapHQAAA0gAAABHF1/Ka5uVdAAADSAAAAEaMFgFcwZBAyCL0wJEEwlAJBVoUJaHEneVyPAEECqdIjiLPyVg6kA0+G8G9qTXWz37syn8SHfBV3/1Hr/3MM6k24BeMxkBkOCh+4Yp6zTopyep8KtSIghFAW7ltZNmzl9Jz2kxsCBECmonUzyKBF6akDiCZGARJCfKK0J6mnSWgTIGJJEg5pmJLrUvdRiIU2acUmZtSWoREQURUuofTW1tKQxfmb2qrWOQMJusqVu1VMXKVzptLdaQWhFPdYqOdo2/tTagBa9Vi9TAAeMPkFWwKgcwYRDMPqNiCoDAcAgEwYIEtgwNxCL0uH1JW0hkZqrosDllvByHbW5T3JGySi1qDTEzK+t/+UizuUWuWrpIfPmhOaQBw1CU7LrEAen00eBrcYfloCVY+igevBuHyjL7e8/3WHIQdqlPM8plyrH0VBXtz0pMCRIgMWuW/q/hu9h+NeHgQpl+Wu8rwfnqn1QTOC06b1NOvvNAqT3kP/5b+r/JR/7EExBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGywM/MA9wVow9Pdo/AAAA0gAAABGAl/La5qNdAAADSAAAAEqqqqsm1IDQivutXL2c991VIYA5gMDDQyCBaHF5zU4ggWmiTGLhkaBa0yqElGkELSo7UvWaWJM9Y0CMzWqutyOEQi9q+xO/vccMw7pN//wHFubs1K8QVvMUsPbcBoteTwwZLV2SK7DleIySJuwMmw6lL68tvcr3vvf39zBYfKDUusPwc2x9uzhM8iYWQs3qVqyM/YtVuxBQKIFGdCxLvTanMwuaN1oZ1He6R0MMHQqqQUSH/Lf1/5KO/LssQpgAiACekSJkfhvGV0N4YdYzZh2hMGwUkkYRxkJnflBmCIRwYPwMxgChMGBsAcYDoIbTkiCEAEAhLg4CGghxpVeVySBHDppZUx7HTi9cN+vlL7l7P//+5ys2ysSu1Sbp95/h+ecoeIbofCkymSVIiy7j+PesAtVBdYBehK16t58osLtaWU9+v36hVsPEtRilileB6nOW8rHLiPDHrF6699fmwI+iq+9S3QpoDb/TUyHMgzjwOCXp/kKjVoQAAAAADANcr8Iy+K/zgYbKOXNmQLscm5wluAXSjlvd0MEMpsyxytjBfC5McIlsyRUJjMAFPMCYEkyKD2THBATMEoAv/6pGzpkNuA9blfS+uapPQAAA0gAAABF0U/P+9hs/AAADSAAAAETA4oIDaZSHJKLDHouEIzMyTU/edTGw5Gg8OhsoCIqEzcC7MQgciAKEgKggBA0yyFAEnU5lBoHXK9rhTrwmPhqpaIgyVitlLq0EO0EuzlN6ahoRhMCAGBY1fx5+WerV0CAKU2RBRW9ZiVAQcvPUqJMDlJxfGSsGwSTrRUXkyWPBMjYXBgWVU6PrHAOQ2oqf0WHOaqSN/qSHgQzVudHstaRiFXX+ukkaP0WqXdSJWUaq2bmanXIh9Z4QQDDGwQ8wakHAMCXAbTAVABYFAK5gAwAjOLqLqhYAZHAFYwCsF/MZ0QmTAyQN0wAsDgMbswPjRgARSlUFDBQgTDwHQqAgXAkwADgxb1s99Pgw3CswJBMwsCUeI0LhcZcrwYvgolqpegaQhSYjPqYMg2vh47lBDVV/RkAjE8NAUAQMEcxkDhYsq/X2r2FWIOWTB4lILETtFNOtRiGeAYZCOgzHSHNQvWxbCA6GxqQMzyy8MR1GRsHzo9W0zNBfFVvfrh84uJlWqfTHWGlGdZc9BZMAhEFQ2dDKI8rQHNEvAYJG6Hda0UCEF0gzVbz5imPRGmv0c+N19j7FVMQU1FMy45Of/6pGyJjv+E9+RoxvPca/AAAA0gAAABHzWdDq/2jcgAADSAAAAELjVVVVVVVVVVVVVVN4hwAGACW3YQjIsOGiqkht+FIkQLCQGlvjAEEGekoPAiYiEALBh5QYiruWXJjGVC+BBzMoOktt5GrTZKFcybbrGmVGggDQaW2uf//QpqzKlAZ1eS2ghq5kEECy7f1E2A2ottJG/Y8CAoOeaMU2WsqqROxClXWtqKIujyv/KiP/kqbf+xAzzfbQMRYG/1IpN/1TT6xCABIBXSBrVYn9h4RpBiIKOAwJjKmAeCMYHAo5sD85mGQFCYB4FBgfg1GBkAoXLRPLmKXOUkKYB4DBgyEumfsFAGAukAABgJAbAoFlfwcBCutGQkAYpy/hhyhkA4NhM97KOktoJLDbiVBC+A1rMWcTKDOxs6BmSgGFIBROaOi1GtE+JtA2AYeTY0RZnZzAqiSBScaHB8ozE1UbFlANndBffUfFYr/qxOxef72TF6J8Qdf6CIYhHt2TT3QNyLihAGgpo6volIiY+zVmV63SQKd/XrYokupUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVAgCAAZAQ1UskViOhYjmGwkYYDpgkEGFxAYwKZo+zHjN98Y3YWRgsAemAqCCYK//6pGwHK9cA9Jpey3u6m2gAAA0gAAABGqmXEMz6icAAADSAAAAEABr2UBMAMAZZizxoAQOAzMLQEY2UAETBkAQMAYB4KgzEIBajgBAEgJg6/xIAUcA1MBgkkAgSqpNhj1Dh21EYzDpgCgAgYc4eAHeQrmalnZ9Mh4GDogKBhOpPGrukimZEVCEYBWCNYzOJvUgxcIUBZgCl4qqH951FbMXQtQzOmgrUo8HkPt/qTDkS62+rOF0KBDClRuylFwGg42Qs1s+Sgm4BhWVl9lNTFWL03dfpLPnTpBlJLrUnqWYkKurpsswYJAARLNUVO2rEzHhmAZJeZNsZhCcB2YsQcK+eQxaYuAChEYJAvA7qJGJ7l7KeGFbzAYmjPAHUNGsI9LPlklqQSna5QfEBuJgFkQ7TZF9FRNiMAlBAWaC9LBmmapGtjwr4GClgo0SetmWuRgcWBxSgt5o9ZuYLSKIsoEqQFjR1RMn0pxZJD8gDQOpSSlq1zoXgN9V/6hInZda96xqCi/9R4WMhEarc0WNcL7J/50rIH2/W+Wv0qgAQAIAAjgQc2HOmgkgBXGQDBQA8t0YB4ABgYACmFOBkfRheBkFgHBwYo0B+RACJrlm4EL6LLHACCUDkwBD1jWUbMECADP/6pGwBcPQA91Vlw0ueovIAAA0gAAABFvF9Je12i2AAADSAAAAEDBo3FZTXDKpKjoMByFhYDG+ZMZ4ASI7yRecv3r1+y1cOAItkCgAvfLKlepc1T0uRhIYBBBl2Pcf/KlxttZAyIc2jvZf+scqGGCUZLUr51LXeGJmeMifAXq6T006ErBEBUz/qfUsPbV9/EUIet0vucKIFHImbIPvUiQUUiBPCqkz+5GlwXiX61ziiD363stRGFtbvwAAABg4EYYTglblON1v82n2wTsTohOSl8M1tUQTE5JWMGICMxYh/DH+FoBQqpuxm7GKkBoYN4OZk0dmRSCARwNM4z0kgErDA4TMNh0wqGTCemP5oUwqHjLpnMpisaFQJBYCCZeNj6dgGCBgsWmKYuYPDZftU8ifRQBdDrrBgIBp1jgcMCBV4KSkjimCdEslEY5KBkMSIhghQToTiC000DEWoA3MjNNN1pk2OeQdEEIHYppJGi3QrSFaoGBFDRDQQZh+KzPbWZl91kARddaafWRw26Db6kDAQgNm+t3Nh8CCKtaaaestGTVp+vY5/UgmxYfTVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGyovP+A9rdlw+PclOAAAA0gAAABHmmTGW9yDcAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWfAAEAAgd5AzZ18x7HzjWgcEK1xlPiKGHwWOYWAWJhYCFmJ8H2b/IBRgBANGCSEOZuRr5hMAmgkAIwEAOzBQA9MD4KkwZDGjAkA8MBEA4w6FhoFKqGIUcdDIwWBpgM2nLwsYjBSKT3OCjyFAPDD/mdjcAjdVruTFYRKnZHBWXwm07hIZQfWpqWChAC5TZ5lp7nuoEtlw/ll/5XJ8MBU971eoEAhlPCHSMQ0bx9QG9f0CsTfyoyeXfqKpf0G0oKL/QLTfyhc8ZBs/UpTNVoxdX+gm2+hOh6fKM96IovfLtY4zuRM4HNU2S9RmgtRSCAkAaFDIEigbkvWAecQkRYvr8ddnCJYY5gox04Of1TZyZc7BVVFy4B6g0E+1QS4ZhjMi286BlJrqWNU2NQy+FSf+oUKF7DV/qFeNFnT3sQn0cgH+Rzf5a/zn+cPf5Vb+WHzbR/qUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGzx4cuA9sFoR1vcVGAAAA0gAAABDzVJV6xKNjAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVolwQzFT7mskbP0ZJFDZaosEGIriImGlml4C8l6IBwLTVXiegRhVbk7susvXljFCesmHjNBgaJoB1elkBzy+rthkoXErPL3MAOgzyrTFAxBqkWF/yYDmofrGfatvOEt98Zf/Mi1/OEXdlfNjy/zj/5//Obt/V5G70NoJ4ttpJIHhwKgUCQMygoNXTTKCY3GHMaHDCeow47MBDBCSIVN1dguuYIDDHEvnMR+grvqy8MHCvIxFlRwxCkhFLJVhNE7NKQgIwDBxsdfrH9DiEjIUuVLQf/5g6NR7/H7nI+KKUI6S3rf5ZsKDAdqyrouBOC+gttUPgeWbs0DIpeph3i1+tRPCdO636wwp3+PwppI/iIUc/FwsWf+smW/L7K/WR4ikxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGyK+rIA87RQ1Ps4mfwAAA0gAAABFP17Oa3pr/gAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqvsDyKOTkbSUCywu+YQIoGCAAJBmSWCQM71s1hHTFX0WEh5hJdpplDlKcmnr2Uz9p2h7OeBUpepTUvsK2IBS6BzCJKfapqg/oVw2vsC+C0rVRNwxSFNnj6D00BnwLOK7/UIRGj/j8j9Tw/ev6xfkiv9EdjK/Lh9X6yXv+SV/zh6/5rf8xfxMhYhQOEBT8lscbvV0eASKYiRr4hYAx53FP8Qijg41TEIXbpk0RGGMCN9ixJ/ZVH5BApVHMsCnEQS82YIziN2Yhs5I0473fufl0GWbV0gFTn/zICjgWEx9tFQtIWmGqvrE9mv8lCv/jo/yV/xcFCi/QJRIn5Ubf41/0HL/l/KP4kkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGypgKWA9DZZ0OtZmmwAAA0gAAABD+FXTezNWTAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqaIUDZBY+5ZIm6WPK2s6Z+ABSlYILM+CQAti0IWNSzTUf8QAFrxVxSGbgRu86ViHUZQlSBQUshSs5UCARXUkEcUo3/69UWgKtQ16jEDUI135wJmML/KAg1Bf3IQto/lge7/iRrf8apJ/5b/zP/LKFvyeq/Wev+h/nP+ei6AAAAAAA4U0TIOSHA1AxSkNMWVwTWAx2IzbYGsMq9EGTAkAFowFkBJMAVA+zC1wZ0xEyzWamO1RowYczC48MJCcwiOFHzPJxDu6t0eEwOJpotkmkQeAhQECMChoz8OXHdhla5E0xQLA4ULEMDjkaBD/xCPx6hI4dQz4NJFBEVLyJsRUc0P8AT5HDIgCiJyIqTxLksAaQZkiROjiBvgopOk+KEC1tivsxAzYZ79CYDjK7Oh1j8blw1T9Et0FmZsTk6RSuhnSfJ03t6zpLG+vyd00G5019NTTX+s3b+o87svJ5CkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqspUABIAQeWuyI4XvhzlsOXOP34zCqQEECIFmDAAF//6pGwvMtEA89Je03tZmnwAAA0gAAABHEl9Je/yScAAADSAAAAEBpEBCEgDgFMJuMzsEVTQzHqNpADvgiCZGJAgOEgWMMAWIEKAXkO9F60AMYAOIgrQOnKhbQKvQA3CNX9FxrOOsCwjdtZKjzw/wfc6bSer8f0Trf6ZLt+UWUOr1HD9PFmrzXbyQOP/Wam3vpWMRvN1oq6+///86HAAAAAgC4iDJbFsBwgZg4ADmBeAIHAmmCCCCYNAGpgrAbGG6GAY+RKpgdCbmNhzOaLo7JgqA+GAmBqYAQDRgDgRjwLJg5BnmBmAuAgFDAHATMCYHIxwT/jEyBgMNhcwEAiEHGew8sAmpIq7gCEDmzLyZcCJjEiILQzUsp9N9SwCQhAwCeXCpct93a4tGgGAGYuBD82v/NfLq6ysp7ExzfWXTMHb3Yk28SqOZXAtvmVjdF+8xwEIlWd8y5V66XboNBcC4VsKF6oawLiSgCZGk4VmQLb2KQXPlZtlmW5MjQ63rROOQwKNbnTEqcXZvqTqPcbiu9b2TDkDZHXI5Ssg1WAACDABiQNrAjJgEFASXqdw6dmLKYUGjKHE//aMLUE0zXlCTgpCPMMIBQDBDhAGgGALGgDQAB4GA/FyQKAcYCwNJivnav/6pGzPfewA9J1fTvvcmGgAAA0gAAABH9mVE69yc8AAADSAAAAEYdgKpgUgMAYAEhATGgTAaAAmNSzEBjgBBgei5BAXZYAjQhfqUz6eEscwDUwN3cGbMF81chxfBIABpApEE0EUzE/TQDF4KMiZNLZ480IjxtmT11tqDJhcFAxWiioozcG8I2ymdQMFJrJ9lgQHrUtTy7qLIfkdtZzVSlFAZFB0ju6kj4cIFgvUuSClx/K9/bl49ejvuMItdSybbkFUyFCGHmspfGAMDCYO4SJgkgrCwQJicBrmG2LUaf3nR4Ej+GJYESYOIGxgZAIgYCZqxgaKSVwcB5g8BBjGKZ8hg5z2JJiwBhguBINA0SDQVBNE9xJW3AqhCZG0GYVA0RAAv6Kxaw78bqTYgAYzeHNCCH6SvRdgbHkZEIGGMYIr2s9u5Vf1uUEISg4Hp18rWX6LpasEshva300W2FzCaW91TgaMYMeprXPTgQwVouopKzALqWX5spUpDJ1zvuVgiAUqqpUsFW8Xow5s6qjXi1lWtRlLFSZkBQZu1BpAT/E7ThpMQU1FMy45OS41Z3VgN3GD5rtK53nb0PqcFA63i4pIjQFiAhU+NAWAr4a+0Jgq8t3CoS4Q3RsWIpynj//+lv/6pGwJsf+A9wdlRVN+onAAAA0gAAABHAGXDA92b8gAADSAAAAEgBepXRW1RZx65uD6Pt7UzgdcAbifQ2o1qDWh7hwq+merCSh4/21iRiipKVnFIusMjkspKcqd8SP9fkK/25mO7r2zYRIafzifv/6//mAcMABDECc1hbNpTdSgGgamBsKMYU4XhgrgumD0CoYPYWJhmCnGnT7wd9Q/BiShBmDYBsYZg2YOAoYEgWIQlQIAoEQEGxjMGp9LI50MEo84RiMCBgEEgFC0EigtqL0kaCgDm5LYmEqFGFwLlslirjlBgQBagMad4uafQxDQDA0tv39P3lFXeMAFzzB4eBXunNRWefOvZh4EFoewIhKWy6UYdXW5l6hHGken7l65cqzcVqy6Pih6DiOUR+alsvZFdi0w+5kReLBbI3TsvvPPtKFi0EBGSQEqp4vGIfzUolVJtopmQtCX/qXK3GX1rlMvkOALOtQXCKSX5x9vhGPCUXIqXKvLIklHS169Iojqx+/7IO9+GHz1+6T+2O1shIDe3Lf4/J7GsPa9HUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVSAABVwWBf/6pGzk7fcA9AdfVPs4kuwAAA0gAAABJQGVDa93bUAAADSAAAAEswKAKDAQAZEgN1sgUIIwNAzjBMBfMFEDgwVQpDE+FRNuOWc/8gmzFbAUMFQD8OCaHgFVfjIBZc4LgJhQBwwTQ4zKAd9MasOkwJARDATAVMBEAkHAMGAuASNADQ477WC+xktB7GqQJELwDLoxYLtNtDrRRCNHR4qNURrXbXX43NOmIDo0BJZRM0nL2NbPWYiBBKda9L9fzOLzv5kg+TI+98zxq2c+X2ghm6SjJE41ZgEkFKazKYqItMwM/Tr0UpB0qx+C25kitRqiXJyUBRTTTPLSnXIsDIn2rmY9IrjOCaquiyipZQiiV5s51q1AICRNT3WL2vEozjkYiHUBaBh/b/Ws7tEMiFxIFmG5FygVUabImBXRwo0XD25RugdCG41+m6SJThT827ShrclAseA5iFiUfRWQU0sOsBNhvqf+K8CJR/1mtSYQkAOCQ4kmssxZUTaFyr9dVIP8NL9uQctKVXXRrFmH/t45z/84b+3XWLFryP/2Kj8wbM7B8wiAi2IqBASQzXi9MIGIlFocrDEnBnNjDq8zQrc1AJ4yFD8xCBwwjA0wOAowAAoBAWYCAIYMg2YwDAeP8kYqF//6pGw1oOAA9/RmwsPbncIAAA0gAAABD3U3V+3iZfAAADSAAAAERh2FpgkCBgEAAKAMOAiejDhiIADAUTTbZhxGB4YFqfTywqMNs6MafoAAWZIEqNA428ht3u4YZyQVAcCgpAMor4Xs+/TVRkGiIGpY91Xv5w7lWppkiAqz2zjveO94J7SrO13n3csrG2A0vc/y7U7cx4mHSZ43r/1vw7JU1ceayr6pv7ys23c+bxywrVbLPXGpc8P1VkN3nGfQrv43c9/vlV6bO91Kb97s5TzW5Dlzm8JVzC5pycbtWrxKDUgTwoBSSECO2VQdMGArBwrAAFTC4ETA1DDbIeD+UdTAoZSIox4DUblQMMfRRNFIZE8ychEzeCMSBqDZ54VpPNRYLLL/GS5YIOhATLNf69emn2onpR6MOwgZdIb+7fOVOZL5CAhossMs9d1uwqkPAFRZdx329zWVRzt58w1+9f3c5h37mWP4fyPVua/fPx5vOBK+v/fMeVP1R2s8+565+//H9d3zWt43oLnMb+tf2z/4zVrLvd75esfqZx3vDX85vHb8481z8KuH/8uu8hVMQU1FMy45OUxGAg2mja9c3U3IbBGRZksbGmCqqfvNp3r2EwdMIaZeIBnB45XHf3SAq//6pGzNz/+N9/VnwAOe6gAAAA0gAAABGbmVAjXegBgAADSCgAAE0ZNigyCzuuVPDsGjMRPdgvAPIjecg03cmStj26YQEc2qckqKYxIg/IIWkT2TGaNGzQoHyIRJXf5apGuKM3riY4SLMk8NgIASuenLPXwtvTz+29NwTUL13WVltOcuf/5/9bf6ySEWozt/6OIOxld1T2u//eaxyzrcnMML3cOas4ZVO6s8x5+NzP97v1L3/Yw/v/Y5qi329a7jVxwuVe2/3hW1vLHPWP1LH9z7SYb///an//CLxOAJKgIUwftbbbI2ikSicbpA4qPIKR4VNMDWnHApQQGhDuY2gGMAoENzNO063gQdHzgcLBAemloRvg+KjMhDh0iEjChFwTC5rV0lD700ACg4DOMGNTTENL9K9mBh4Q27Cg4RMahgcRQG+ykTA4wFLjl2IfMjFx6lee81ov+JM9WDq0baaNM3/yVigcLGVmjwfZuMxTU1LA91a1bX7WTx7Lv/qAJ3+7rc/n//65/////P/92///5//9/fZ6/ztbrVKkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhJrSE0G5trGLHNaogCxi0WGIQclEYSEJhgIjf/6pGzQX/IABvtcxe5zQAAAAA0gwAAAF9kLN7m9gBAAADSDAAAAAEwECULDBIsWCL/GExIYglhg0IFkjWRCIVVwUMw5qcO2edpVgnKNt8ui/NnKWyqLWvvxPOzEW4H1XJXds8+7e/n7uWnSFQD8KZ030CymdhynypJbyxQLDCHI2BVLX+gaLdrY2/s83KlVgbsHor1vWvwjXe8y5rmhCWwWW//e29b1/1qPEZNmaXmtVea5j//+n7x73f67zfOc1lEmv8/+cqd/////dF///9/////697bkkpASDUtshOVl4xICzAoETFa8/rxPHEE3TCQQMZnNFAAgUw4PjS/IOSCgBBsv+CAsspK9tI7YvcvT7aOOc5KRH4Rbwhingavdvsww58rO6qkfO/9iK7qf9JF3AMCnNJHUOdmelOm5XLU/IeUEsfUhcA5vTXpuD6sfsWo1NUNmmrCM4PgI3lrmEC9sS2xMbzmwsHW/O9pXSSrNWSdEnQBOKyNBAlTyCKaDVHRARFNjJAsZibUTqQ5YKk6DosT3/Pf/5Z/2pkxBTUUzLjk5LggKz6AjCDgE4r9RlmSVJdYwyDDCQJKCWZUE5pUwHZrCcBfJp9LDRmLuAiYF4VZgzkaAQNYwJAIQMAM11f/6pGz5j+qA9ldgS29zIAQAAA0g4AABGJ1/I65qU9AAADSAAAAEgldyZgJVAICoFJgNBkGQa0YYYwQxgJgPgAARE9ibmkQAcsgueGQCZXRydYQxwgmR4AiR0luw9FnUe5hK4gtMwAgERoc4aaZLLrMvguzf5Wt4Zy0VMF94GzidqluZZY1e71Ydcpdo+d3fp613O/Zx5NCgjfXq+sKS7haov3jhGjRJhNNnnlBvLNLWv41OUiybPc8KlNzDDO7Vxpkn0vOY41KsM18OZ6sWd0CbHeVqtqN/MYXMcqPRAC1P8a1jFzu1Z3taUZ1hEBIpl5Cm4wASCHXGjJ6Ktjfwo3lLXDgJDAHkgPKJkgFEooiP1wANoWApHArA+BEYWr0VH9qNPqyIYAMxFMkHAq/1Lrlu/3fwZr/6NpX+f/vh39XrGc5EwtMcHBmCrmd2HndfmrK60op5qLxhwycqft0Ot71rX5Z5YjopHDR1d7sxK3SXu2r1D0QiL8v2LdSlKTdmXB4Ky0nlNJV27jif16teweZvOf5wtfV/sW/4cn1oo5F8Jp014Lzd8weAzFAaMoj804jDt+nN/L1U+ZyKzGuD2MKANwwryNTAYDNMCABotepQqmlQzFUpeIIApMFsBw0Xhv/6pGyW3/sA+DZov4uey3AAAA0gAAABFUF/Ha7mN1AAADSAAAAEEMbkAgeCBHgH0KGkJ3rWj8lnBwAurlGmCmOgB4TAEwNKaXkBRfHOirxh/09AgBcwzgMUmKOz9h6rlbOp3KX9GWw9KXyurLLdJf+rSW/tXR28ex/tnP4RhnlRYXNSkVFb2m1v8qLD6O5+dbZoiSbWX6gm3T5aqY/V4iTjvesK/d3LNS3qqlMqrcsdq9huznbwzsXslGk8f3l+Uf1TU2fPwpxwBT/dW63HN7Vnt15nUpJBa+bVw2pDGrFall7wLRLsgUAIwCgDTAfAiMEwFswzxPjTmysOO8YIw0AEwoKhjEp4BHkwdAoMBFr0Jfmcla0ACBJhEMByTwRm8HhguApcRYdrcOvPhXnUlqa5Ss6NJxlVFO37P7kX3d7+tdJQjMZQpDgOcWHrGUbvdq3rWdqIBGIz2eKp8zSWc1IHQh+H1pqWxvW60EWNQyCO9T1W3d0TcvAGHP00JTpumjRqEbqpU0DZZmzKTWQ4HLPoKRcqucWoyWg4pw2VaLmVFbKophkyC6k0i/TUt1YhQlzpOTJbQAwAJAGZmTCYApXhxYOgGP0iOaXIu5mCG5GJ4aiZzoGpmrGQGCkcoZhQu//6pGzld/+N98pov4Oey3AAAA0gAAABGxWjBC92b9AAADSAAAAEmpW0yYu4W5glBiGFoBYY0q1hgFg/GASBuHC0Qh0LjgyIOzRI9M9LoxY1TSKJMmgMwOExIFytG8w5YTGQDSCLaCoFBgdMklMxqAy4DGXeb1w4k/SwJjwHNOYIquveGIjII3cxv0k3KizgCEz+UM9Yr/j3Oo3dAOveoIUPDamTHwLQMhPXB5cwLh0ujDlJk1LdCaDEIRiX3ZNdD1GggTug1a+Tx7pIHTD9SCzfyse1bk8lzb9SzaYN12eqpAkj1Wp/TVkk0EoAI3jL2zfIV5M/QAIyXSBDALDBMJ4AMwhQUjA6BnLAMxgRAWGE6D0YAY1pv2Q4mJ+EOYWQCZu6txz8JBWQpgaBYXGIwnBgwdBoGhOYeBEEQUJ7EChvBoEkoXpaGA4AGNhVCRdg4CRGBeSsRlsIAkVyXLTn9dKRy2SqqGEoIs4S7Hj6UZhN+tfpdY4SuOAEHlBR4IMd0HY1QEVAfAekRnQ+qqWYlgEJA3jU6QtJfZIvONZvqRYhxxRC/XVpCthrs9KjQxrjioJF36JkGuLDupnLI8osXBrha0bt73RLZDjzLWlVRpKL50tJ7HW6BbdkSiyVTEFNRf/6pGzZvvOE94pnxWPca/IAAA0gAAABHimfDI92bcAAADSAAAAEMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVN4eFAlIo9bomzhKXEEgiQwcSMxM7dRPoVKWWFKjDqk2ODVDleYFJ//BD8fFbzq8qAYVBqOX5gG0dTP///wp0vIaLGxDKP1F9rrWDe49GvW9dIhgDJSpQIiq68tCOgdR1ljMT/cdP/Wzkv/8x/+sqf/Iuef7ayiOBvkvqe2oAwABl/iQL2DjS3yxXWQFkRBMEjiCC0/iHsyE40Ggi2QwGD1Omw/i/kGaSPr4GS3MIwkZXD7FVCKdG2K1olLRSIGHlhypeRV8sxzQWgEs7KWpexDwHHw4x0u/WMcANbHcXSaQSTRdaR0CIkHNTeQ48tI+o0KJdC6RuyDLn10XLImr/9Q1H2t9EeF/61jkm6v9AoCfW/1njv/576kxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGwF366A89hS0ns4mvwAAA0gAAABE6F7H6z2i0AAADSAAAAEVVVVVVV3/ATgBb7RpVYdnt+IADQiRxR+BoCNxGQWMhIGLPPqnINAfDjqM7U1yqvsIqJ2AkVydh5bUxauwblFh7gUIpNf53+35t8IbGGRqFLsSuph2pa+nwzMUSEltNZ7jhz8ceoEQIilNRFOga0EifBPIODmR5SFS0UBQK1/radG+rb+LP/3uSg2UXf9ahQiSP1XPkcJzS/1HkX/rqn/qZq0i/UmguBgDgASyRgCABmAcA2YEIJhg0CqnMb4GYpwU5gegZAQCAwIwAnB67MHNCSBAQERhLCcmrUCECgnAYAkFAVDAKAFcKB765BEBkzhAIDSvOMgBRYd9K9Sn1alNOykAhY12EUWpDfr4Y9+UXXAJSghuRJFU7TmkNQA2RUdiZk7OnXOhFCU90KtAoQ1VZHSWmhkqMWymUpdlRBAum1S116IlRRU5pvedPB9hsFuYKm7S4QUUOA0aL6GyFzpGGozhbXskhRUbokxpc4my1D8SwESGExBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpJRkJgAJqRpXr/PqkBYBCAhKEoxREhTNmPZYIIJ//6pGxZo9qA9NZeyeu6m/gAAA0gAAABGqWVBg9ylMgAADSAAAAEMlLjPbPzMugTOkf8EDQDT1kkMNKi6C6RSLo5IAKUTibIq9kyGAmLAzIQi6BumgmzXIIDc4FiTf7F4Fi5WZJlpIosgRUECEFBbIlNknUzlI+GFULsvWkZGw/ipI6r+w2jJrK1aY+h7V/0RTU2/1EaJwb/UfLDesqbtYB0YfnkX6cOzRniWnVwscsrhirGnmyAf3fJzC7GbrqfPawoGThMK0E9JMwkFww0DMDH4Y0iGYbC4FhDMKQGMCgLMSOiOWkdMLhCLAOGB4NGNIMgAEkAIsAbMQsEbJ0izRATwxAi8KXSkHLtxB9maKBryMAgvMoggRZi12lft2IJkUYuQGCRJTGe2N1LFPhyrZo0dTBgHIzMY75nhdtXKEYAEmB+xhH/wu5czztrOw7rnd71vuD4tnuc3/4frn8YjZx3+W8Py3hmgTtXsNYfh/cdF7Hmq4bs1cv1blbPAwFZzPn6/9bye+nk391v/7vlz4V/e/v9V977qK8jVUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGweXeuA9KFYyWs8osQAAA0gAAABH6GXBg57qggAADSAAAAEVVVVVVVVVVVVVVWbu3QGcj8330gMbp4A1MEKTbRk6M0VMc1yCqTMTSgMv8hs0yEazAiGABo/RgLADqUtrnwGgBccwYRMZ9wG/AgJ5l71NDtPVAtMnWii9CpmuuZSjIVIfy3zVuAkEbhU8YQ1wu2IzeLJ01NdvX1KZAmOgnZqp1siwsgDBOJnndJzENgbXE0B+aYqHuPR11rIKzEYNkn0XcaRub9S8y+h9aWh/YvN/W6jhTjZCFQECbbaJhvp/mGkPAYZYBJEFqLAxmBAA4AgAzASAmMFcAEyPBnTRQGC5wNcp4wiAG4g1KAn6miHmcGbB8sJBg9i1LUEYUBxqWcFwoZNB7BjBwHQDKClzjBIUMEAF9QKKV+2sdfepBAtBQoYh/guMfZ2HyBjExdSpl4O4J9JoEBgOOR6SjERkDkZEjV7UkQxGRFIWoaS65DRNL82XEkq9c8N/7MmKM6JRfsRItJ8604SPbrIC386fye+bf6Tf1GvoUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGw1c9eA9TxSVnvba3wAAA0gAAABGEl9Ja9yidAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVXtAixVk5GkiacRD6Vip0TASLSoApVhoDdE0mUlnYrlXgVDMco/WLAnRbAwZtrKyw+U+rA47+LLEG1TGwEsG+3aoJCGkUiefWcBqavKU4DXBRE29Qz4dMn+45p+ZP8lv8k/84f/rJz/LP7TiP+Xv9Z+S0S6AIBmlRkpEoJwsHSgBpgGAwuYCIAVDZgYzDA2PHIQMFq6jB40GgU1CXp6M3MniDukDq8geBFh5QtURITXFHdMyeMIBQWLSAiQqeIGjWKgt87hZ1ogOkVTG7ew5qaaOZWxNzWq1XsPSwCgiaJL536l+7pYEMWTuH1BiVV8qG31VwlO3iESUpnamRAbJoYrUpqQWghIOtrKEMJ2pNFJ+C2uar6EuCKMDQuq1qM6T25i9vqLcFUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGzdGLWA849RUGtYkmwAAA0gAAABFm17La5pr/gAADSAAAAELwADAFkkiWyGRSFvk+RIBIDAsmGuM6arKrpqMpGIg2KhEHAlIZCaFSIWBgb19Z6AZmHQAXpYk5M1D7XzCAoOuB0iEAkQysCNDcsHDMOEKqIATLI7l3VBRKSBoNB2hFkU3WiUAMYTNDO1bkyA82ChU+ec9mIkADAUnFt3REByq7fH4kf8WO+/H0aK/SG2/0o6mrWrmRCu9fYgVVTXlAtt/J6v8oOtvrK1vzBfIBUgMACgJNNCE07uLHMBQAwwLwJTAQAMMD0EsxZhjjBCciMNhlMCwYGgpMCQQJQNRMMFwTMNBCEfpmII0joFKqt2ksJEgLAQfGAJbGIJHl5hECpc54VomBAWgYDkjjEQjg4DodpsZqypwtSDxh7OMm5DwNmaJMwSbURoRTjrUiqpSIzwFiZtdWgXwbVGmXV6klh3DqnWn4dJ/Yhw2KqKdQ/i8TQajZET2TqTNZKUxhJoP2cWasz71DcLdn10SQZL8yZf51V6vL5XkExBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGzgsN0A9V9jRVPconAAAA0gAAABGSWNE692icAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVd1BJIVLyWyNv8H/ZwoGWcUzADn7NTy1kTQDJYgEuEFzqmKhfJFZymfytFC75MVmziryKsIZsjZ2O2ud1+gDM2voAWrJ/TC1Idtmr1D7E7Jt9AYT+Lif/AvdPzxR/Qa3/IX/lX/yL/KfP9fo34AAAABdkbJqrqnmmCbqZM4fJh0irmL6MKY3o+5gdgfmCaCSYDAMJlojFGWQR32kd0+GcCxjA4YgEEQgXlM6+gGDI4AwEMSIDKB4mBIohAFzMxUeg23nEHYRMS4cgwwbWvTy+nt5GhAxtgi04tNM3L543BnkXFbi40zMzNCYC/gUspl8csPjFLonCKgoB6tNNAmCCDLkgh0EECUHowQb44NA08lS0pqDJuon/0ECh+qYmiF/lGozT8sfvm3+t/81Id/UkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGzfA7oA815Q0vsRViwAAA0gAAABGF17I69uScAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqIYgASATKcaTRPWAj4+28GDj7buNaVLYxVRHjDzDYQDLWSeCAQWeGASAYDgqV2wLuCGpIzU2+ZAkBFxWIstQ9DgOYFzFrWEA/nQApHFv11V7tShrPma2/W0MiKmaEqZrbrgokd/BO0Z1a0e4t5ENS7/qLzfzdSRs3mLXdIOr1l7tnB9WeR/WeNf3MsmkLUC9f/0m/ICxZ6W2yIuk3wQKsYEAhWgxihaFh4s3dEKZEja48zcEilLysiT8pwMKq8vQr96DYFgNPlIByIDEQBdDKElcdZXrIwAvTT7qImkM6BKDV+MclWoIRDfkS0ZEk7Xw4Q2Ck/vsTwxE++XKYf1OnWYoKbD/azVpzxxHf+gb3q52wuyS5Pf6vlakxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqGAAAwWgMKcDIwFAAUvnhQmBgE4YFoYDQBZgQAIDgiP/6pGwZs68A9I9OUPvPbUwAAA0gAAABEM05SazSVDAAADSAAAAEGAIIiCbqxRfRkYCAJSQCkbxEAhgYQ5iABKHxICJCNRgZ4ABFYhAdP4kA4iFaELVtVZocAEyZSEwOEAwoAdT8C3IyQABDWNlrRMeSn53uOU8dIYZhbQDkMiiaDO5oks4EngSIYDynTUkfaEyBwCbdT0zofmNF00LKc+yhHB9M8ylumbIwarZbJprKbIJMHgPKM671zpJPWrRVRFNJzvRPKadIX6DcsHtl19YjBLtKGuRIvxxkgJCChzW0rXTNfqIvUKymgyYAgYkdlZgqHJoty52OMZhgBAQBYOAhDdLgwCAtk7FW2CAFMyR9DkJBbEBIIH4A4UCYIy0R1AdSkAs9Aw4YipPFkyFZLqSRMgaAESL+bMmah+wClcemrrLVaQYNBaAQ4nXNUpPFtBIISwOOM61LLEzQMwaBRxutepjjxQRUQU6LpqRSSAgISqeouIuxkHrqTqsiqcKJBHeg90ywVQ/oZhlKRQYlmrUW/26bdW/J9vpea0xBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVnZnEGcoWu2sjs8tXaxIEQtRuMkbtMCCFCr3VutnkC8H6dPU2IHv2cHP/6pGzDxeyA9oplQ8vdmvIAAA0gAAABGFWVG6z2iQAAADSAAAAEWzR7S4TH+GCwDVDKpIpIpH2RH0BlaXm9q0A/4NxGaC1oLXZMTYCuSaTVdaT4H4CopBWqzOWC+21TNWKuqq6kqwt+3frKv36iz/VMRIchU/1/Kh1IBMUQvXWmE0rzO6NAFmCcEiYZ4KZg9gcGDIByYUwaZgrimGOpy8aO47RgxA/mA2BkYJBmFwGSHMFQcMEAHMFQYMAgPMKRqN4vCNSRWMuhbAwlBQEQSDxhQIbTaSVw4mGawBecRZlomkvs12XF3FuT0BFQNMBpGx1rus+Q32Kv0BAM7gGRhe6xlGcXChuYXmBK46AnQqFheBX2xg1ckau0w6YE1pF60Yu0bRMc4zKhAXCQNGYco5inlEC0cNy4xAOULlMzEo3KHKg5rMqoDKj6XTs7BVNlB0J+88BiQXGJVlX+nfS9btqdJj4X5bLoVK6KVTVGKBRFA0VqLymOvhU1nNNke77299wvb3blsjw7vHlzDDlUkAK2v/+0ne79+dyZKkxBTUUzLjk5LjWqqqqqqqqqu+wO581+1sfP/CNhYw2Qg4dUJCTMCsAlBT4Jfrkctncmcj6iJz2Aq8vguRc6el7f5yg93v/6pGx4W/GA89dOU3sTbUwAAA0gAAABJEmXC693bQgAADSAAAAENMyhy334bt1jUA7XJxflRZYI8IIAAXIw6pBqFAzCdgsrKY7kDjTR0XEuBil91KWtAOsOxbLZS3ZlCExUQQpMmkZMmDbM8tl5euyxDjZTKSUj3E6q37uGAat6E/KP/6f/H7TSEAwYRu3ao5lbUydFABK6HFWJAgYCk4ZCpoYmFGYShMYviAYWAMpoRiJG+IEaYbYBQcE6TAxCwEBdMKgRigCAMAPSqMAABcwIDtTEKATM3i5B0wmBDEgBMUjhz936Jr5uiPmlh2nC90MwZNlzHelstTSOTpSjpLe7edP+5aMgw0eBIXUy5FMq9JT1R0pEUnWi16O0mo5HJrGIq1hiVn8c7nIMuVbmkAZMKY3GKC5T178xSygkErQKzzVaGWRT3xpWBmPAsnHSSyGKW6sDhQTS2QgaZy2rEqHKGqXVMp2wyny7co6OVU9p5h0QLBy7/qSqw06vjDbCr+/7zf3uZ8dq9rn7xr3tZ2EwYPvf//Q47/kOokxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpJogKBhuSNImDxXBYFU6G/TwMJRf/6pGzGbvcA9K1f0mszVlwAAA0gAAABImWVDa77iQAAADSAAAAEQwkB0xWAEwdAowXEILEKZbeCdrFKYRhICAHMBQgEQHpkEwE3xIO2rBAcHjJqoOboOGSiZgYeCAoCiM73VVJYz1yGqky0GDAFkzXX+VRb1rylQobn1IIOKWXPzfpZU/mLc1DAqaiI+SFgKJy6KzcDSly3AAIsbyMMtgiDKChhh3oXE4DGAkMbX25ft0sPUU7UlIgGSa4lzjeY1nuzgd61nffUhXkGvjd9a+MZzhdwMVpTNc5xlG6tvG5Zr5jEyIdamvI/jU3du+8/efr/51v4x80vWpvRnK4UJToEo4+1jaYCTr22sbj7mEAigESTBgMAIHNBZ8z0OS5DO0VFjsMawyteEfTcMXnQHB4cVQEM0Vcijz/7EQY2GrBArvQzlZiT93IBJAAPG16M0/fs3cOVl4gbWE9v97zl3HCJsmq4XfvZTzjxAgpqc56GMiCqfQ23dR9VTppjNUQrpWk7MOoz6aN62mPIh1dX/ZWVc2qm2u6GPZCFSiFGA2Kbq0ACCurtUWHGxmGGoAmGooiEQcjKd8WwFZ8HQ9AhcPkyVxLQCegpwRsJwLBFxaDZTIE8DXADFRSxMk2QEvEsaP/6pGyVw+cA92BfxOu7fHQAAA0gAAABE5F9Fa5lU0gAADSAAAAEOslA6MBbRFycKZMFhzpwnnFoD4yePm5bY1M3Lh8WktJE6Xki6ylubkqO1BFad0UFGazay0GeySkWM2ZNdbosfrYzXWpBGauyk1JprpukpkUlW3QPqRnzBM5dBTJmBg+pabKWqcRdbPYxCN7QAAAAKbkCQAAAAADBGD8MUQJQ3WyuDQ+KvNyQWcxdAcTB1BpMOwG4w0hADDmFJMEcBYwGwbjDNDLMLcEkxHCpTQvCNMBAeMzriJgNnoMA4ZgZpoQGQxsBldCgKIEBQQAYrAIGCg4BhkHgYDBQG+0iCwHG+BcOgDGQDEQcAYBgGdiKBgYJgYUA4CgrHYkMiBkQOAAA0AYVicwMeF8DU6nA3kBAMgigLdBvYGAVODYUwPnHNE1niJCDAFBoWSCD5MhcwKEU8mkUyuT7smoXKJyIwmj5eE8KEMM1YstjCmnx2omJYIxCcJZdAjGeo0MELLdObE2OMxQaRRaU8OKpay+gizOt61uhda2LJXnpRNk0FIJyGGymWorKact/////LyNajv////JY0W6iakxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGy46P+ABYRfQ+1qYAgAAA0goAABJUoLD1nqgAAAADSDAAAAqqqqqiRnd1A4VybaNsYmEFDGxwtMpdDbk4ryZ0I2NZqEAkJ6/aUSkITEYHzlQNkEpJJKKQrYWcBtkGkupJFm60WMRzQDkEWNuvV1GIbkAEIpUkTJSRxt2yaDBwgiTpkk6l+kisioQDKz/911F41X/+kVUvt/Wh//qN9fp/kFHJQC2GpbZGfbdRiEDgo8DQWajA23sRyBQSJCuYPiyyxQEAknmK3emWo1mAwHGHBBl46kKJMjvvpD64IU1pD0qihVBRFxpvxybuQI/ynpfqKppUF6q6RwLW83M+evmvFGkRurMxhDMxQQPTUAwfnabGPxbr7wU9keh+NOCWGIzEHadPsPp4hQPjK4lOXr8YhkRP4Y/0M051LVcyLu288hrRSYbiIytdMSd9lv3HspY/RyWpT0LXTCxqEV43/8pYpWiueU3E5hGW5FKPKYoKbcb1Tya1IXDGja1ufnJqALe6mMrqcxg1qdPvLWM5u7y/u5rUTaC2jwzbdt2FIbLbG2JzCRLjRWLWaeIR1pgseGYP2tQFLmcaRzwIygdHbC8Er5jhVpaaGX2NixSVnv3KSWXsLLWb3coJN5Mlvcf//6pGwbV9sA88xP0f9iYAwAAA0g4AABHuV/Fa53bBAAADSAAAAEd2z+u81WuEoo4whCmBrNz5m3zueFmT1R0ANS5FuJ2qeW9zp6W1jfnxwiVlbF7Ckm6+seV62Xbq5Wbzm/uyLpMp0S8AZdNSCzVFTUUmOjBdta0r5wXRLEGvNu1WZltmenV7sNZ4BGIAAAhyNIDxdIF+pyRzMMq3GMKmyjmRQGeimAaBkYGwPZhPjKGfd90bmY+hhHAomBoVGRSDmBYvmFYDLArWhxl8cfpegkBZhkCh3Kqho8AwcI6ECx2dp2OzSQZJlNoelkRQ+Mi0Ba1Rc3e06kic98oHiDblzDB8VzJonSQAHtmoaeVVSNvtD9fCVSKKFzyJNmnthZDJph/pW7V+HWnyqExcKAaTFExSWxqUw/AUEPfJpRLaW4+w4Dk1LKsstxGXXnTuXMbcciIICp/pq/H9SV8vhi9QWM5S/g0As5Z/cllO+3qkB0MP0LuEwaS2V1L190d5Y7qfh1o73Z8zq0lizZoq/PpaqbdP9371a/vveYfqnWXO1pGkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGwdXP+A9UpfzOs6bdwAAA0gAAABIs2i/a17qkAAADSAAAAEqqqqqqqqqqqqqqqqqqqqIAGFPLbkh+9LIfdVr4oAIBQFzAMA2MCsH0wdhjjLL8INRofwwpwoTBZBVMJYLwwEQNAMCWho28Ve6s8Sb4gAowJGc1Y78x9EMwCARE9nDsO1FL8kp3FordAqiYcHVANzDLUMc7XnMK8YeMQAKJHuhFDsWs5yqxbpaK5napB0DxINo3nGZbXldntevduXs0ZCsD5Tr+8ln3sP/+2GtQi3ezy8xWPij/FpwBfBvLWPVwrG1mLvEIm8O+Yfi01LSXe45RG7vUuMrzusaX2eQjDjzV3azO8j5+8w4R6mvunpHWt3g5pveEJcpYVvkqBrEW1srjouHgOtcYqgTkDnlAQeflJh533RcfBJ1rFDhZEyIaUgHDieR6B+lK76gkF+RY3WtFdAh4CxwABcMyXjEvImKzxSZZsX0Aw5KLdSFS6uyg3AeJHa61PfWL9FBlv/2HA6+v7ayYfpIJJIH1JILNhR39P/X//1H0xBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqioAAAJADKLG1MAYawz6DsDLQHqMUoMowPgNTCFDHMPkREwowoTDeP/6pGzdldWA90dov6vdfPAAAA0gAAABD6V/L6Hqh1AAADSAAAAEMgw3BEjEkCoMJkXcxjxATB9DfMS9tUyWglRUCQwBQFzBBAaMB0BEwmKTE4pMcksDGIyYYDJQeJgMIwKEBMLAM4ucwc5GdKCFwDB4THguBAQEARUjLGuO5ObZGYRLT6IJEfIzL6eURixSUlJg/kDjRVT4lF78MredS44DTILh9WdODHWGGFJYlcX7zutFQAB2Zeci4uZu2Y7T8vt91+/94NLPm9pyoZKb+CT/fc2hXN5WOq3wftbezrjMWMj9v+z7ES64YyeuqiMl1Du2uADQl6oawS/hwAnQGBcYWZzxzpm0GPmWIU2ZDg6ZjMCkmeiqYvCxoCLmwgUBnaYhAyrjCBFT7gCQwbDrmxJ7hVDGORKXpXMt9pxDwMzSicdIugU8MRFFFZjSiErD6IK0uv+sOGTaYzJdNV0UTJw9oIVk4mMaG0mjKXUUQtdDKl5ZnUHFFtFFSidb9csOd+ijvkMHNNbP+WTB0kjb64zjI+YlqpyNGGz/6kxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqp/f4OxOX2xtm+QJDG8yAQHJQ7MLbpH3kVOZkRigTmQoAotOf/6pGyzLvCA94xnwsvcXHIAAA0gAAABFVFJL49yZ7AAADSAAAAEEFsur/bIjITbv7u9oBUEKwmsYia5rNtc7//80itfbkLrnuVd4b723YmwwiuHZ6mrsQ8BnG7Sq1SuRQTVq6ykryJfSfyyyvv5fMn/3WWr/6zdv0bMUSKL+36QkAQABcZAMQ8G4wGgDU1mqpJhcFcwGQSTBPADMBgAwwIQOTAaESMcgdI4aLgTKjKfMZEI8wwRmjDTBYEgHSqAwKEl4S05gmFpheDpiqmZ9OVxhqE4hAEwgC0MAxtQCEpMDBbMlBcAgOYJA0ZrGuY7hyAgjXvAEsnL8cfUwAAdNMwHC8xRDBtJy3jU+xjUqLCEAoLpV278ikN6ltyOHF4BQATH4AlIO5RTtNPQ1K6RmCXhgIJQYPbB3bZHK4NdrC3nBsIFgNp61JXqUNul3BcFpSuZDEp7hjVt75qUL0iso33O7qvzGURxbtbPWuc7u7r0JsP199z7c7rOXuwNATh//f5vvcIPjt/8uYfvW+fjObxzx/HvP3Z3JrR8WsEAIGJJA2UySiCAR4DJDiYAwBJgVgInNnIqa2ITWZgUgPl3DA5CfM2AiAw7hdAESMHANmCCDEwMwmUHzTLK1FOBoHQDiv/6pGwrfO6A8+RS0Ws4i3wAAA0gAAABI2GXA1XugAgAADSCgAAEgOBYHzBiBk08AY0IQN4xggaIOIOHotYBwoAzQYwOJyEMEgAjgwCzYBIfSA0+DwMUgoAYUF9QGCCKA0D0xAADDwGAwEMAGgcGxgYFAYGKSGAwZwDgANJh1BdfESKohcHAstEHEIhSACgAAaF5ZFmBkYduobSo3yIDIEPGUK5oKiAMAwupFGEGHgsnv/a7qsAwExyx1BqgPGRAc8UnU+pte+rx9DsC4AgJbLZZFxjyRdLWn/t1f50zPoF0mzAkhzFmJkTn//////////5BDyczK4AQSvLGz8LU11qNPLgcTKGlkUNYAVNJmBJDAkXCwCYcanBS57Y4YaIA2MgODivkRMS6M6ISEGLqhSIhKBpjQCg4cTl02IGRU1RrWxRGVAxwAc42NUWW+1SRkTwKFAxQIcKBEKiURIwupIKXi0P4GFBAEgA34a4OPEGLtJ3lhFJFFEmQgFhacJ2Prc1MloosoyIqTIQASToJb60dzEG64zJOtqTRSfXWTCXq7egMRHuz/rKJa9Jv6ykVV/oqTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGwY5P+ACKmCylZ6oAQAAA0gwAAAF2WBQv26ABAAADSDgAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhVneCAlRV32toBNMWB0qOSA1gydK6mWpIlpgcIIgJSqsFJB5KzcZDNsmltMslLDn4U8MG+4nBP86xhennTzKa2kBybqN87r9ALVgPULDhcpFidPiun514ZgqkwGjgpSa0WtOGnrCBwXNDplprr2SE6DCRb/8WB/U/vyj/X+WCZwF5L+Se/zAMQafurRrUUAIYmOQ0YMAphUHAQDJCEQjAQVFRmn8WAmYRCaiYiDRi3uGZhQXfLxmCAMyoMJ48GGTgQGEUGkoM2yMbBGdrdTPUQKgqLZ6vOzjrKOmmaWc4V/3efv/+5K2aArkNa1Wv/IaYvpCvhyXt2AROUs8KqlYKvnJpN2e/sC//8rihsbVyy/Z1GHH79jLtbOSDKZyKG9Zz06rWYFMA9RCPyUP1Tr8g22vX8yEnfnjv+stfV/ke79dUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUViEAAAgCC0jQMIwdMEwFMMkMNJiuMydpPi3/Nuv/6pGzoOcMA9B5P1vsvlYwAAA0gAAABF5V9P65qc9AAADSAAAAE4A96PIz+4TvVCGgAu8w8AEmw4IGoS4BzgHA9pYgDiqCwcSlpYAza4V6alZkYqLwsApbl5NhqtBsmtaQCTpLQ7Jmb+GsAGwB6OGlD+QIiInYqMUExPYNrLH0DRYFwIqLhq5rKZOemKRCqzz6ZkvVuwuMbKbft1qDEL+cfr8tf1flkiXZ7v1/0AACgAAADEgA4xazVyLM5EcwEDDD4OHAaVg4weFDGaNOf8cxkCTLsiNjggxGfjOFxMynl81zhxzBpBkMAsNkwMQvjAGBKAwHo0AkpqFQKkc3eUpCAvEzwwFAykQVhYfgeA7ShYmyMwEAH1ryiastrRU1MSAFmBoHU+vGW88jD0VTrMDoswAUKB0EoGQABIyH2J0vhEKmZDrLwhCCi0cI4g/UHWCoYFBEon5ZMd6YWWBRsztUVWLr61HQgBl9ba+1qBdAqGQ6yw/s1ATm9LuYoeodIbAj0jdrWvKAquuXt9Szw6Rh+snl311B+RookVUxBTUUzLjk5LjVVVVVVFtAAAAAGDIBmMcDwmMSAcSBxMAC15ggAGIRyZOJRpnvCoXBgKMgHcx0dDQ+DMxro81rR9TC8Cv/6pGzy2OuA9SFQT3u8mfQAAA0gAAABHaWjH656jYAAADSAAAAEYwbglzDBDfMBIDsMBAJgB28EYAQ0AcrUWAGjAeAXCgBRgIgwmNQb+YToHpgFACJDsMaQKgOO9XoPbP2WzOjACDtjn77olE4sZ/QJsEBMD4iQOGGAxAEFiwpUcQcoMI0HNKYtApEiwy4agCy00QLzlBGtDrSBIUCLMau1Q71kWNTqSCJsG+BlSZMnrP1LUb0yeBCTRVoEc9XWoxFmaOcqV6x0Bck95de9+SgxNrmu3WsZwYTdZIbesTeapFe20QAMBF+WMmCwWYJChiwDiRnDCQLDcaEAiES/zIAvMOAAoCKulwjQiNsGQnnwcLCyBgEUoeg0CI+uFFZ7kwt+hSWMKKJIqU3M6dEPPDXyy93T4mDpn//9y/mzj+Z6hsKIGXMDJyGoeLcqdCozy0bRqR9hadpywZA4HM0mEuo7+X/b//+4MXCXVLl/3Y9uK597rckJYIhQ2vz+fWlYnQMEieZ5wlNX1Dk76q/rGsI/fyx/nD3/+WH/lWhyAAACAABqIky/dOEOZGifDTSO8c5buIsNRaMVTRxx3w4cOTfIGDkISgYBJszAFjYs3NzhkyIEjHfUNag4suWWEgCj+f/6pGzoDviA95hox+ueo2AAAA0gAAABFyF9Oa5md1AAADSAAAAEiAIGLQqZGEhp2JhxvGgIxVPpoBHAa0yFEMlxsClQMOTBgMeSsamxqbGx4AgGVSHBlgumR1alqWpakg7IucUgTZgZsmaMfIqASDDeyWFDETfSMThRFlmy1qoB/hvk+LMIaM6LGSJ+bMbGpOF8hRskUIGZLUpb7VuOM0dBdXmamebfqLiL/K3OE4j/vv/9Rk79W5AIAAAIQDS9JK81XIY7MhnHyhAIEmAYAMBgC4CCOADwiAIxGA2GDIAVBgEADqYAGCuGEOF1xgKIDgBgKk3t8QyGLQxPDUwrEYxaDgwrBZ1lHxGCxg1NZt8VBgEA46AJh4CxEMBgKCJmUaYABFzSwCKWwJAAykJAIJper9UtBKrspXkYVhsjWFgcMUgVZJT2a2cAZ/hdlQgBZPUT8SBcWcNU2TIwGoEDRqBhnhnhJk1spRkUQgGkT3ZhajicyiYaPpOOlEfhvq9Fq6xSI7V71eRokiNZV/SD0icXVnUEU1i8DBJ732WVh+S/qnVGLnvX2WWtjNkqTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGzReP+A9qtfT3v8oXQAAA0gAAABHqGfJY/2jcAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo3aTQDUyctujUO4nvHqqikKex4CAvQGAhsqETTDuz5CErJfLnoUOt/0wwcjZe1SYzSR0iwoOxA0aEzLfP/9amUfYqjsCr5djqMeswC2whxss9+5OArEkHODu13QJ8EmgsNBRmyik1Vx37/tLBL//LCX/qLX/yn/6SRJ/9cyb6f93Aoy1ddU4A/gdaPFF6GVousIHQX0JCmGg0o0lJFivmK6Kouf/ynL6ExuGsv5H72WVmZHSaX////7lBWRnB6UXwzzwjWH63RFn0gidKZruynMRagOYSeRc/5ZWVg6EKjPIFlFTnqJZh0jT36pKDF/+Z//OGqv+5In2/0SyMkn/qMdv+kRUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGyZhKSA8/RY2HsZnSwAAA0gAAABEKV7X6zMXTAAADSAAAAEVXvIRQZiOTXex4wKJgyADk7ti40Gd81ccQ4vqQ1LxyqDzAFgk1kgcnRdMAFi8UQkpnxT/wScEoaSpFr6BdnSVHIIMAVgPEedtazo5JcBokDwQgqXRresMOTiJ29AvoSgImAlxnWhlk+YLLgFBBVRoolVqL/Wwsvff5whfX+RT/5YN//j6/9jEdl++6BIj5T/qpqM2ABgBgIcwDgHCgC9IFtxgFULgJDoCJgFAbmHmFEYCQAxh9jGH4UGWCkLwwNQwJwEmXFuxCBsLAlQItMRABGCGDWYCR5h1mLjgcGgKBjOLKZjqJ0bT0CwMMQhEQB41znDLAQUHfyN2M8PmwwCPcYADBroIoWQPSVM41fqt5KI+BgqPDWmxv/nvGEavsoMhANtLfM+fQ0eWEsGBMPBbHUzn9d1F0oGoNgDOjou65ocC678w/FWXn0PniaC46bfsovhY2NE2UbJdRuO8SwBUmjv9iMJ0mSXV+qimRZP6tSI/ltJCkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGzMwtyA9JZfWXu5mXwAAA0gAAABHBWXHk9yM4AAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq2mlEoCf+kbCXJzQJB9QkKEMwQDKLApVMDJTBi8+GCHhCLgACS7awKuMnf7+sxFVg/ueux+ex7jWiTQIBCsb85f///7a29I7AbLL7Xdc7zO5LdUApA7L9WbW9dsQi1EVpH+S62LtnSuio2CKAhy02fdReI42AXAu75ytF1nQuuvp/jMo9f3I8kv/cgJ9r/zIT+/+cPlA//VVLSwnFAAAAABT7NQoC7MFoGIx1jIzRrN5MxcqY05FfjDsCUMG8T8wQwDTAtBHKAUzAIAlMaQcMwLwD1M0c0bC2iE4BAKJlqXwsuYnmLCtJFscQbeZ/JZyJum/TrjWFfTtvPWFSmfz5fD4/Kj5Txilf+5SUeehGBV7tx53LtvOakFPJFFRTErrcw/WFunyuEpmKZ/hbypLqp4TJjH+mRh0zp+Kz9Pxen/oFT/5UQ3/QuMm/+Tp9NUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVe//6pGwzIMmA9NBfUeN5o/wAAA0gAAABFm19Pe9hVUAAADSAAAAEuDIEUQikdiLMSUKIDDURY06ERQvMXTRvjUP0VQy1sOaMGcDMTD/Az0oGB25eGEwIoyYLDT3WQCBDAoYHgOYlqxwIUgIU1qaVPS62N1xMmhMNZy+TRHwKoBshol1kknLIxwlIEXCLCRihDpijICFnK2xax6YVgbLaqkjgb6g9aKSzMMUFY8MsIbWgsXRZPMkuOlRNDKlZW71k6ML/L+d+dfzrVv/m7f16z2T3uD3WwaAAMGiQxWQBDCvCGMBECcBAECQA5dlXZgHABmFuNCa/KhJhfgvGDcEiYVhLZhTAGmAyAAAAKFycFRIcDnp8APg4fIiuOKjEKGMvA25gYvHMiaLChA9tJWzIBAILg4YAJhFahgZfqlyqd/3QJjZxuIsBbHebjwyG8qsgwzVVyPCPgZB885gW0joiQEnJ5fukGriQWUR51RuDb+ljnf5QLd9DLI5zqOe45B9XRKssm3+PLIL+Sr0Cd+SF668sur9ZLX/MalP510xBTUUzLjk5LjVVVVVVCmIAAAAKDI3HTF0IG4mDwZGEoTgICDBEEy5Bg6D5lMZxnd0hhAEoyOhhyPxEETuwwnGYEAwYOv/6pGx+/t2A9XxSV3v8mfwAAA0gAAABGNGhLS9yTcAAADSAAAAE95hEFKczgxpKAZFiQ1AcDZR4W6xkEq7oyz8LGxQ3DRqjSUU7f5Wz/0nCtRypVw/8oNMCorzF3D6lFVFSaJOXP3J/1ExoVb18zA+rWYnvJwi79FojNf4uJX09hQZvoCfGiupGVlBm/Id1t5WfWo/VWcGPNHsuoehbR+TBOUj2rycqABAAgBSSJMJsAsMDNAwNZgdARGAqAeYFQGBgYgZmDMFMZRI25xRWemShXGBbMGApKkw2goFzAYFDCssTGgCDbj5zysWQcPgsB6PhgiPhgACoGIUDAAYdjOdcikJDmDhsKAaL8jIGAAYAaQCwhmKSgkLjQpy/BjfmCwQRAFbpcJ4aRP1IjOAbKCRAnxUrEOQH2CVUMTmBqgR47kS8FtQAihOtXUYDiAwAgUYulM11TcKDzf0ng2Cpgv0A0YeFPlSiNYPTUfZfMQxeVUmspcoiYMj+J8mKz2qRo313quZicky+3dQtRotn6I/FMzLXtH3Z+uSpbUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGyUR/iA9bdfTXu6bGAAAA0gAAABHp2hI692icAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVViXUDVBVe7bJHC3UBiAIwzUeAKKjYYLMJOUQeHbsLIUd2aTdVTEAicVlxodaXArHEuRTkyKHRS2ZDATc0VxAiUwHTJ9XesIJBVLPV0wCjO1fTC3IaW2tshgXJNH+gNxb+VFP+CD/jIUf1BU7fcWS/9Bz/L0/l/8aU/Pb+hesR93UMOs4CoMwBJAWDBiIYAPNyJwg0tbcWIsmfKfawqcqkRjc1VlNT6WBSeiDhq5IFkymoMLEIkSBD0PY/+r+tklQ9TzvLv/2kPIOQX7O/3tICAB+NdbURagtmbN6liVrV+SpWt+I+t+ZkJf3MRYGT9ahdKX+WDX/Kv+o//UX6/yi6/1lZKkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGwxM6QJ8+Je2HszVbwAAA0gAAABEMV7Xa1mLfAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqYwBgAAwTklkUIjpIAISgIptEgBpVAELAGJgahwmhmSyZtDRg4FmFREYcEJgERKPigmDgMaJQQuBCgFPLFqlAt9A4lKBigdtwQ6saU7Q7CoiVVIKBqRoaSbM8tssJLgUA85s4MSltnfWUgaHBSxihtQHWBYMbt60gyISX8Vky/xHtX41yRv7koK1QV9iDlq/yUK9vx3UfyMLa39ljiqb5cPrf5ZMlnNHk5qBABAAAHlBOSpqJTuNa38+Z2VTNDvJEDICidIyNAYeTpMaXCxg3XYwJs1bU8sMeVqAO5bk4hZjRWB6ylBZRDSQW26EROjWcNCmI7DLYjwG7RxupCm5mIyEFx3oIMs3MyHgNoThDBzDxfczNwxcNhMzURQqZKilEX6i4XCab+dZNSDeQZBkG8lW603z/9Ax/5v/mv+c+t89/nPJBikxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqq5AAAAAAAQrT5ztdMw58UyMUuJHzKcCbcwJ4BPBICUYDSAbDABIf/6pGxmE8WA9UpfTXvcomAAAA0gAAABE4lnT8/qRfAAADSAAAAEgUoBIYL4FKmA/AYZgxQhuNDXxgCQAuYBYAVmFgkJIIOEhniagwMgYCmAAKAAUcBOJq4Nr6XMKgMyeNmPvknIyJzl2mbi4miYRHCB0Rs3KOfhmuSAAw8Cq8O3qbtWnpFd0DvCwrl28aZEzHR1ok0CoZLYcv4hhtHa386OE30uscqiSEuQVrJHXWCmF51oalcYMqNkuqkkRx4dF8eypWC55Umh0S3T7bOjV/LpCNfpo8xyYsAhblsBqCahjqAQCE0OApWgVBcLhqNBUYlD6aipAY4hAbCQEfbhgAiZDAmMBA+EgPAwCmBwNDxFLtUSC4SmOTfmJINpENFICJFRfWFM7orVg/ZsybAcdkQSXyzbdnWxpR0Ea1TA2Pef9zNrFwlDmBFSup2TYtheX+ZqGDzGVW6CT98vH8J4KAuP750ZETVn9AiSR0MHo3oTaTTIgZ6NEnaym9RZD0DJXmOsyHb1vcuqWTAMDbnFlrz//nUfq8hr/RfmVTAAAAEwDCzAsMCgAUwFwBgUAS0IwBAFTBvArMD0CIwBgeDHkFDMAEUAx5OQDSvHUMGQH0wFQOjA0jDEoBgCA5hGVhiCAv/6pGx38/AE9rtlTHP8a3AAAA0gAAABGGGVMU7qM0AAADSAAAAEIrGAAFmFYxG+3MGq4oGDgAqiWFMJgDLupomAwDs3dxE81eF0wgCtWCG7lfKioqaVKzjo/Qbc39/6vwTacUaIxzbe80x0prOFMGnAFKlYhWNnWZH8M+CgDL76g/APsi9p1EqnnDGA31nVm6jdjGoG7H3zBs4LNZfpVLOET631KPimB2W9Ra5GELdtZ6hIaf6dTaw4hLqkZ45K1oAQkWNABqcTQEqzACgDAwJMBIMBHAEzAIAEkwNMBFMBEBmDC90bQx1IJKMCnAnzAPAEAxhIUykAwwbAMwdCAGAIX0MDQTMShyO2/0N+BiMRQVMDAIBgJAYKxEBCGgXDBlDKwQBhs2qBh+GCY01dpvZHA9iSjgHGOxMron6l3Xyrc1JSwDA4EMEZ4P05ibZ0IeAMbLI2kWnTArYZ0FML171mAZ0NBNV52kmYBbonEEKFcpYCiz3abpaYb87bzXnRpPreiyRWDDDIq0ZYR4vBtLVXOnqcdBW6FbVJB05IvoyueViztLpMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGxbDv+E9vdlSMvdm3AAAA0gAAABHJmVHq/2bcgAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqnAIAIgYKkUAsAbCFKyQAZ8SwBgCQShUCMdAgMBUCIwfgCjMBJqN1IDIMFXFgcTBsnxoJVrkIHogDgAjIGAQZzKvoTG4VTBkSBGB5EBSvTBcAm2BoDw7AAqAJlUh5i4E6mu71FscACGM8GlmN4VNDvZ8/VLzd51yIjnPvZSzNWdEEIIFNY5JEkbyIEkuDUMFLjvZzhb0BOQMAG+ui7KMQKhydUkgbzCUcCww/3mqOiHMZ/P8fInTYxqN6Y7ghHBe9JFR2Uh7Xj8f+tuRzfXrUKRP/KPkNUh6ZlAVgnWnu8jkOl6ppWRkRwYAgqDFspSI8i9ZdiQFRruMhUfTX5fJkqIjdEc2BtETbns4BVALiHo1dahrnc8DJFr5so6SgQRAxYIacMyd30BXwW8XUOplY+gYp9VT6w1MESfrQUgfdZuD0TMzKKREFGSBzE1b6StQ5/7dRV6/uPoVP8/zn///yxUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGx2W9KA9rJlSevdo3AAAA0gAAABES19YexOFXAAADSAAAAEVVVVVb6kAoKKnZZGs15wwGFk05DCoRGhaVgREYGhAqhEwByTFYlWRBYEDg8H4YSoEIDRsm1UDAJ+RQN3sxkAcAEBhCnJr/oRl0/GC9LjQzEqVP5/scYkcYsi5//9n+ZuwNcyDPl+f5TfuUDNYLKir5duduO2mDNbqfWH9Gm3nNzgWqLiDJp1zuFrL/Orzoz1Xp84T/W1q5eC8386bclG+tuWW6t9Q55765upYBSCd662SQ1XwETQ0K0NWVXUzPjdjF9E/MVgZMxNigTDUEGHgDzASAYh8wGgLwUGE020FwLFOZQDCxdNHDOKGbZk0U25JOFLYUAhU1RsbnbjCzIYD6LQcmT5fp+bTot5fiRIXNlQUnejHO5xbGtAIyqNKhiF99Iav/Z/cqGFYOMce3so5onj2F+wRxS5op+NATJHW6vD2yEUktCjLCRYACse7ywhwuBQf0ELRYk3rbQLp4dIFlLUtByyaLTjqKv1tyZP9dT1oCUT6kxBsaQEgp3ewcTLOawCKYfg8YDASsMYABSwEwXAAwQAkwYDEChYOpcazhQBglV0FwkMJgUW21ICAACgXhhOcxGG9QUybf/6pGwojtsA9ShgUOuZjNQAAA0gAAABGW1/U+9qb/AAADSAAAAEDWpzJjwhQVrfnMqd7DKozoljDMWhUs9hI4LuW2rGShsEpmK/z7PL84XuOWaZPLHaocO77hfERUHUYs/Nx1ebjUtsx0ULh02a/4Lg653W6AVECw6retahzK9nqXgoK/8Nxmgp7kYpjpqRoASRFXpvlIPePtvYtVD7IIipZiemxWIqRENaG/FV1oGxRGidJhFTf+cf/rHUf+sOAABAC4ehh3AQlkAEA4XERDMA4CcwKQGDAvAhEYBoQBwYPwghjgtNGUGCWYToSpgEgDFgEEBA2P+GnBYoAkDBaSEicBkXpAbfKQGbQaBIJini3h+ZEQtCLwfAI7AzgBAUIoGBBMCwHROGhDCHFofw24DHY+E7ByAXNk+mt3LJeBqEwGBwJomF6xh6qkxyQtJNk3G/WqyxeiooUyyeV5DjCpaRfstjgm4rLZ1KQQNDImgbBxPHqLSdNVIFEaDIO1IsL1lX2yis8N0qNvWasSKM9brZsyf9tIjz3zLzKrcCkzbdLJLttrI3JJJAmlHQIJVSEAPAcTNYi8KkXBCHF6CYJFnuBzJx5AGDkiWPIZHYOSYOPGjBRh56ZVcGFiC3QWKoF//6pGzOWv6A9thgTWO6hPwAAA0gAAABG5GVF5XqgAAAADSCgAAEKjCyUxYQYmDQYeS7KIcCZjAegmkE8WBVDCXY1gYAg4aUh7TAIFGBiLyywdB0vWoYqVwalS4bVqrAVyrYplwdaJAdrsE4yD7tjlTLf8nOZfa/v/+//8f////1+H//6x/X7/X/+//9frv///+//v/rV7y/gOR4hYVAAAAAJBJRkbSBIANDM7szCSXzGzdsMvEYY2nCJQ4ZAx+RFTFkATMJ0CcwOQvAgFswIwMDEDIJMg0RUwNSLTOJKWMFYR01Xg/ANkHQHIkDJqoAwwGAMctMDDgJAw2DQMeBIAAAANAoMHAa9cwFhEIqBoKSgoAABg4HAAYWGwXgFoQDQDF2OgMTgYGAgBwEJE0EoggOABQQDLRTIqBhEKAsbB3ucYMYGiAzZBQTEIBQDRHNJkxBoEQWG5s6hm3FfEE0iJnQuFAUIpZIuK1KwBodIcAoEx0KL5sFjhfNSbNxZBOMQAmThgXh8kgnHtNljXLT0JFDRq3UgXj4nFRxayBOasNciaT1FFHTL6aacvl96daZaLa6KBbatCofq9RbU04bp6CH////KTpOom////+SNHKFTEFNRTMuOTkuNVVVVVVVVf/6pGyRlv+ABeJMz+5vYAQAAA0gwAAAJk4LL1nqgAAAADSDAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVSVWhRAVYxzStkwaTSBBcoBMMsJSSVKKKnEnfUQFvpKk9g48StckXEKSLAXuIMTof0SwcRwOSE/oAO4OoiSU3HMNWU5ubUR1AGJJknTX/ooimBYcAdYR8dLpqVDZ0FOPSyAihQ94nkUWv+ovBkw4TySloFXTorWUQvyN9Tf+zChFP7/1k9//kcTKO73/qSZqJMDVVXPa0zjTRopjxYYqDoqNuooYoJlmjHyAxZdEQmFx1O4RFYXbwwFrPkWifQaBZdSJ/kwplGn5Z0yk0dJGhmLXu3Uxmg5ao3Avf82bb1vW/+7/7//3UXkNmA91JJrMuokyopftSyUpgRNsBVZZFnneovsd1R///cJZhaSnwz/b95flvKrZpgoEq69nzepvNgCzR9Z//I316vmQi37Jf6yP9X+kWExBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqovdMAMgheRojwxmBgAGEwIA0GTP00TKclTKcHjU58gUBgMAv/6pGx2uL0A9GZQVv9mYAwAAA0g4AABFQV/U+3lt3AAADSAAAAEAUGBgkDBgQDAWAIwVDkzgtc2tE8weBACBDDq0EJnBRcOWJ2lBSxTxZripz+YRaO8kvsWGq8/+xP/+oZwjY7f/6HDC7/6zlAjFlUua+AYgKXOWFfoEmW9yT/n25AgLB6WwIEoDFwuqIoSzldRGN0zACrAFJhug+TW2cWUAKjBkHR1an6zUAYAVvlurbUON791fj7FxPqWd/zpb+v/KZ77f5yg1iWYQAwET9tiMEIJIwXQEzDMC3MIAEkwoAlDFBGgMwU0YzvTJjBHBiNFMSk0YjzagVCA+JAkw6FDSz8OUgQiBAwAhEF1ZS6zVY0+kh1VkU2tgwOdl2SvDNwzAgSW9erxdLSxkPA56Ak0UtE8kXXUmcIeI9AVJAuODpBYBglsMSjCQIIalgERoiY7gbygucJAwIwulwqSkVu54CI4HaC22w8qW6qnLoWNiGl49qPZbW6zh8FHY3kms5C1bPMRCTbOOtbdQzoWkGvNiY/zp/6X+Srf00xBTUUzLjk5LjVVVVVVVVVVVVZoRwASEMz2yMzSGjFYOQ4phQHYMGBMxqWjAAsOoIo08bjFr9chRsqhwEfAweKlg0ahof/6pGzqxe6A9iZnzWu6o/QAAA0gAAABGmV9Pe9yidAAADSAAAAES/aiMgo45Z1NzkSZiYdKqXNNj9lTady3k3ff/iDvb3//1J34ev/u9bGHj6oO5MoCLov9ISUa5ber4jLaByxQgX5ilSat1p/8rPf/Kyucpdv83+ov3Wv+v9CMEwPrD9q3sy1AA1LepRbV2mAkunqav1jEAcJp5//Ipb9HV7DSW/1y3GgBAMryRsxTBZwYeX9InBEIPGAAamAoMmPZPmFZOGTpSigAGB4HmHwrG4vyHow9GJ4SmDYfmFA1CEGjA8EQUADhrYv2YqlA5pMBAfsKKpRB55YzgADbQpLBsvJBCId4+4PUmz3t8+CN/CNZ1JtpABATbic6A0MNVVMLbimLh5EAycvO8rADIgdEwLi4ovGgA7uShxnPemDv1DWtYX4yF00ayZ7nfuwFqhs7ys2Y0YEFEQVLdcnUZZKiRq5MC5QNLKGg7UygKlOL1qOg2PG80zM8mx/UYhowCgcvI8Y162dF1BhyS0sksx1HURwBcZutD/Jh0ExrwQAAAAAAhpAMwXMlzMMShs2sFN9NIjS9TYR1xM1oVXtMELA5TAzQLcwFsAhHQDIwEUCpMEVBSzREcTFAljFghTavnf/6pGwSUfaA9ZtgT/uZbdQAAA0gAAABHpGfLa7uk9AAADSAAAAEO4A9MOQJMHALJBaLhAkFzB0ITCcPzGUhTIUXTC0DzBIAm0X43AyjRABCIXXSLbOXXTGLgNQht22Vw3P5viPEQztTMuWteXn00yfN01GBABCUBVYFjiOxky+kTpQNJGBZwMYFM2EQHG+pCmUCCGlqw74OqZjLjNi5BQA0EEjc3L6aBgFqjw5Y55P7pp71ICWpppp76kG5a/mBcQ9Y9PTLhor/Ot9v6ZQP/brT5s0jZwAIAMVJJlMwOeZSKRtHA5slBp+5+IakieqGUVi1QWBcwmC8w2E8wFBwxjEwZCEzhxYxcEIMJ8yigEySEMDAIXUAQXLqR6U+WpMBivMqwyBQXNJo24B3QMRrAkpIsLlEJRZwD5AYUGaIsbJGJdcfQUFqDiQsgN0S6XkkGRRZQzYN4iuXk0UVUpqH5AECSRJ0jhpP1KMg/IhPjOiwss4ZCg00n0TEvOXzUfyST/8myk//USzI3/kceX61cpDz/7HP/2Mn9eGk1UxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRLSgWE044yWYuDJBGRA4P/6pGzl5f8E941ny/v9mvIAAA0gAAABGNF/N+/2hcAAADSAAAAE4CBQKX6GgVGOWoXNKJBksVMEyowAx4+QChCc6xdbuFQ8xiJLTxhzWXGkgPDvovJyXBNXlCGXY9x/9TaQErYAJwwi3e1u3r96lJC+VhFUyupS7mBFwJ+Jc8TQn5N2rcrAhEDuG6ygkoUKa13D0NX5GsLst//Jxf/lgq/9SIz5q3rPaZSGTdv6k3Pf1U5fUKkAAAAI8Aw+QTjAwAPMEECgwEgDXWMAIDMIAyFgKTAFAsMSoFowKASTA7FGNdLogwwwmCYDUwOxhDEHAeUFAoLhgQACl6VBi/pgFgPGDETiZ7wVAOBZdgwNgPjAuABTKM1MFDkOZCL7LtnzU4Zvp4PfJp7ne0jhv6OoBjpm6UzMYW3Il+GUQbuY0ShjbauYfvHLHdpeJlwVAuUzA3859iV0hasrOqOu+GFaCU0S2Ps4BF7Iv2MkEQz0kjn/ixGT9b9hThk1rdfziw1SN9GtfWaE4LWBMjdv1pD2Nc1/qdFZSW3+xiS8BExBTUUzLjk5LjWqqqqqqqqqKugAAEIAFP/FTCkLTCMHTN8kDSRIDlAxjdFnDC8OwQOBAAZg+DY6AhgUIZ2v3ZicDZa4Qv/6pGy5s+SA9OVfU+t5m3wAAA0gAAABHOmVIY9uVUAAADSAAAAEECYUbMDwVFhVYFQNdBQFjwukVsjQCLwL6QT1aNFYvQOo4FeTALut6/+V5zNp5GWc+9bzwobue7k0FFzEV7Y2N5WoxSS54SwSBE9sFL/6+pYuYPKI2I9Btcj1jWZ9Z4mTUJVEyRTTetI+HDSX/0xWqP/TKQ2/+pQlSn/ssjROCKX6iyPQ6SvX9TmCh2p/SASnACYSAV5gfAamBgBOHASlugSB+6wIAHCgBhgGg6GAYASYNozR3PRFGNKCoYJQC4KBCHgQGPBQDceANdhh4iAIlAoxYnY/cLMw6BgwGBgwnDAHC21xjVOnsMgkBghMBgTMzUdMYAHTWcWXS21ju7Di8CUXwqJjC5JXt3pVYuvxm2AwHEQiDuxVx7cwrTt+AEbzGsHGLyynvZ9uSahmIBHRXEgFwxpqLlZJZuOg0AdFBE6hU7IplwJnJBHofUIydtvoD7DtJV/nDUMtjZPUFebmItAEmnn/j+ZEAJJv1Okoe1f8+WC2qkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqMC0BZKOK344SgsDoAIqANEzBABFMCcBwwhBAj5hNNMgYBkMDKMCQBVlaSClqw//6pGyFlvcA9g1fTPu6hVAAAA0gAAABHN2XIG92ccAAADSAAAAEsITLEABhgPgCmBQeob2jZg4SGBgADj0TKdbjnuwgjGQ6EAIAgE39DzPYBSAb+QT+Fev1XLTgMAQdjEYYPsYb5UuS3uZgkThwejN/HK7ua3ueZSZCATm2m89UT4QfD30EE2qzQ4mHpf6qxdlRXT9Sw1NBHT+sSsgSTK/KBmA4Y9poLX1nxzhGQDEysz/SKI7BdK/qc6siibe+tAfisswEABgBwxZEAhAFBIBC8RCCaYAQBhgDgGoDDAVAKAwIhhpgmn0QwOZAoF5g0AAGA6AKJAGKngIrAFRRmKcw4RZinoh9KdJg+ByGJhSGYGIZiOVdvFelUARkKBx/iUHFkvFM0F2pUj61lGxQTDDQP1yRuksX7F/T36cMRCeLARCe49+/SSe1AJKAxgWGr7VVLUzlp0SuBTILvNECmihatNILhVP123ErHj0PUoPQW92+cFNDmIsv84ZAUMRI4pFus8Q0UOAxYvq/RQGITRLK/ugkTK/p88NzCkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqrO74QGhD0331mM2pCrzPHlhY8qoZuOH3ZqzO4miv/6pGzW//QA9lplx4PcnNAAAA0gAAABGumTH292b8gAADSAAAAEDFfFY03J1vwOpkMRTBtQeMwVQCtAQA+rYsbD0S0IDDxcwiVPFhTBSiWz04vpEqvBbX7S1W+eyFrAPHAJcuBMe87hK4+9SYEZZkVgt/CVx9hCKEZtXr/HsZqcIowZxamPpmAm4BbJLSZ3ZMTweEeANalIuOAsTQrjmojjLW66IxzRv1Fxpv6kPrNa0/82b+pmOlD1N1Mdat/6z8oAAYAMuGS7zL4BoswXgOOMLJAzwUB0gYCmMBQACTAVwCswTQEBMpZDojA+wDQwDIFpMM8ELzBDAFMwB0AYMBAtMLhTMVURM8vGNeR8MEgbC4CJSlgOhoOzQUYDBoEwKZZmyRgjAFkEBwwyMkAlHVCeZSFKBgnbSH7E1z7rSSIpZY0sDANncOnTgH8JWnlmAJgHaXgQGDtIui6azIUKDoFW3ohxZqoaw2vG4V76ydxaP8XqPtnCG1mvqIcyuo1lkkqvUsWS2/y1jhV1DvtU53KD2+WSpf8s1JN5xkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGwEOeuA9ble3Hv7a3wAAA0gAAABG12hKI/2bYAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqnvQ0zH3NY24AvNnS5a8tFJxuYoKCheg0WLBUEK5bfR3yEjefhuVthrS1mItidQqYK8z2qkISFgCuHP5GBRJ0tdIxA6I1reTR84E2LnXrIwR6gv8EHxj+MDf8L/xr/4b/if+N/4t/q1H9U/zf8c8y4GZEp93ayynfCApqZ8UYYGYMUYo+XeMAhWDNWbBSJZgjBtrTVWyRIBHkYMiabFkqVU7M8QAAcGKA49nETYUYJwyvEQC6/OXP13XSAoft52W5fyzHjRlptT2W6G3SAl4e4o8u1ZzKlWUEXyLDzpgASRQmT+Tg1/bDRX+iOq2z1xpBaEUV9TheSOttTuRRs/xgad/IpYql6AwLHvx3nl/lRBSPUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGziuqsA82le2WsSLbwAAA0gAAABFHl/Xe1lr/AAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVZqHBGQUPy7SNQvGmao0WzYggugoc4uwIkIBUEReZp0pwkTACEst1VyoK+55hQkO0la70tgMcSuRIBsBhN3wzwGRd/Oggha1Krog3nBym3PUBrhgpNvwjb/Gf8Df8UF/8j/lP+3+d/r/y/r8jOwBgAMDG2kxoClBQwKQKTBKBIMBcBkwLgODAhAnMFwIgyOxozbIoNMGIIgCgDGDiAIYIwB5gmgWmAEAYYEoR5guANGK8fiZSoL5gWACIRtWTqTdKwDhYAwwKQjzI7BwDAUwisGjMoARwYMghiZvSMORtAxAa/Odkjn2KcYcA7Vou5S/tmnSkMorX0pJDRWKaPPCI2EOBYlT8ws8pkyQMoQLR+dPgyhFy5R6AbsHUpvRWCGFmfrSCRDuW21ikFyz571Ii4yWW6+mPgQ1FL3h8M56olazjdmJUQEYnD3WkJsJdE3tWxNBp5iPX5bhKkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGxxOs8A811V2fsSPbwAAA0gAAABHZGNJa9uVQgAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqgAIAgBqztrkRPAgARgFgLmBECEYM4YZkTAbnvXAQapiaNDADgNLiCoEkIHAAmRQdTfLrD0EeDFAFzBEAi1rt6Dg8MQgTMJE9NHD8MDgTMAQAVtfZ00mw4ARwDzA5PxGALwTdBWU+YmYNNwEuJoasXGdAfYGdWE+6aPKYFDoKAy4n6YoQGx00+swAqCJxP8Vkd1/eHs2+oU4qLb2LI6lv9YtJur8fi7b8WdT/G6fU3ucGZpv6h1HjD7FMekTT8gqJ3k3qEAzMDPXf6yUx/AgySHgy5uc6rM8xoJYx+EBmau6yLLEGWNLgaHOYw++GvqWae5Y3SJY8e+MOxDKlbhPmAJQ9jn+tXYwVEQzKKLPP8LcwBm2ZfcsZ93PuaVlpPldNLKm4kNDo+aseeBslf8R0/woro3kQ5/jn+Qf6P/kP+r/5f29dUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVc2kAXQ1WW7WyU0pazQMY5dhThcAX//6pGxPEsSA9gxkSMPdonAAAA0gAAABED1Vb+7hT/AAADSAAAAEjVP1o4wyEB6MIQCvRYAFVSlbF32CoKaTQHEnA4HuS6jjLGUYjUDL5MqLlns5xT+TtsZU1eMwyRAaKyLTe0uqbLZdcWANBiXWSSpEkCRGI7QPMuspE4CiCyokiDAFxTWTRhkn6yaRyVf+YlxaLJeO1Fim3pmvj01J/rSS/1Gyf9LOlP7+z6v9H/WxcYcAAAQk1GBo4sw9QzjAzBDMBYAQOASMA0E0wSgBQqAuYWQLhiYEBCEPExfpJTPNEpMEgEgwDQGRwGlwB0UGEqGbeEINAAjAJhQXHcfwb6EAKEaLgJHxp8MIPNAS+nZhBs2YnTEAhMXEFH2at6kcDYzJCFDEg7jFfW+SkPkBSpBAnECOCHmCZbQBvYiTqOhDYBpZZHcQ0SU8s1RwgCFVB0RW62rKIWoIh9aiBO4m03WuxRLUjmWBzGeuM0fUW1tMALJHJKu8vaRJi3OtlHqJDTxVCYRGy9NRF0LSULej25TQfVvsOM99JDkzk0xBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGxJB+eA9QJf2/v7anwAAA0gAAABHTmVKU9ybYAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUcAAAAiA7BiNhACAAMEAUDgBsNDgFooCmYBAHRgwgRGG8LSGBdmX8SebqYGIKFUBwO5g0JYGCsMCgw8KcwMANUoqBgEGcyj6UxoFUQgclqFwJMDQSW804hAGkgMRAAZYoUYWggAQcX9VsXYYufg4xjqEzQ5Z3Xfq3IVfhBQMMHW8LizJDYPyBc5RNmRzXi9CizrdbaJuHmdqq0yZY4FqDai5mdRmOFvD1s016Qjd/tuWSCdBrpIFUNaMgvWkmSHH4/d9bcjX71eK1P/LK+RaxcSzKAq5O9Pb7WT7DOhBkxbSHE1nLfAQJrFTCkhtUtyUBW/LUxBY738vlYFOR8im6T48hZP4d1NhbY9V0efnqZ3oA6h5/LyyoUQmwAmJSRUVKz2w6wdYuqvUvmINf/izBUmT12Pl5Z4BTFAmFR0mGJNnMBTb5k+dC6fvugNravUah1BcbZ1FnV///8qUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGwvFNAA9n1lyePdm3AAAA0gAAABEWV9Y+xNuLAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVeJVAJVFznJK21YWavc0ADFzwTg68TJlmGUMtgGfByOL7ggUMLjMrL7P+2S69Ah0a4bdpjGAoBBOEEcy/dwgUPM9bz8z2Waw0aWiQ4DyErI+jdiBgq4rsu611mANTgWcXSW6jN8wBg/r6xIQ56D1TB1qKYEFkTTTQL8wTO4bS/zvODk/tzhf6tqpRDKN5xuWG+tuWPV9RAz0UzOINBO/fvrYgbMJUgwlExEqNLAMOZLUHfFtYMziGrkXsGXgGSCIBzEhxAYMQRpnZM2vHipvwREITsRlCoq/BO9QSZ2uaqsJFVLndpMS4rTbUqTdNhQd2tv+YxatVbsKOThRGGx7F87/Z7VeSEkcxwKAFu36vc2Jz+WQwUJ417P7ucdovvWkBhQqorf6+PflZjwINN9dltaIamsB8WAD0Wu0hj5TAYUbq8v1uZhvRutjjqWoyPhqAPqe0nJQid5KFq3W3Mj3XXrjMn3SCAEEECX2wow+yhqDTdQuC4YFwMRgMAamBeB4YLoMhhVBamdi+OcdwfZhsgdGCgAeYHYCAkEal2IQEwoAcBQBzACAOMP/6pGw/etQA9L9f1XtZmuwAAA0gAAABGWV/V+1qc/AAADSAAAAEKwaTHwOnMVUFkyoLDDYVMCgcGAYwCEW/EAAkUpL7HFp4QFUHAJlsPSustZ7rMpLAEMEHuAK+v/c7njTl5DLgDaBL6Scz+x+6w4CxouQFFcse7m+8yIAcUFrG//O0PNboCAIBAWjMW3HcX2oqSRxQxCAiIEQBAGb08guZIfTA8LP6kZF7JGoOoWjtbzCikPkchaTHD82mRJBAoEVUHmVIYq6iOIT62tI890J3ZEN0h2mp/jlKWIQAAADmcJNkpM7zMzeqdBQbMEjQFYgSfBlUBCjOMA+CLTA0WBMxwgFxMDUBIDAPgFEwB0CdMAuAJyAAKsqnQFEAB2YBuBfGD1DnBhDoDcYAkASpFKdqXAwANFgAQeAGkcIDTgMI1BKTAbwC4uG81LHLsmhxMiIGAQ2BslgFAcJB0i3HpZkXQkKAMiikT8eWRFJjF5NkQAaTos41pudJ25YBIHBQXpq53XBvYWxP7VLC1KbponK5gkmBgkEE428qKyUC5tJvMewkrNUfWhSKwRAg+z+qdJJdZeEWvXOnqUTybq3sfqLwDwGPKtcWpVShHMZIkAAAAAhOoYq5SxjEiAGE2CAIgP/6pGwk0/+A981lSOvcnPAAAA0gAAABHkmXGo5+qcgAADSAAAAEzAwBIMAzMHIHkwAAPAUAeYDwDRhkgXmhpHmZEY3ICIwFgnzFQvMFgMOBigCP6agBA5j4GH9aYbSNhhkChgQSoTnQwb4u7BqigFEpxIxmHgaLARs87u5Bru0z/BYHmfiKNAmT0nefz90jEjE4Mfu9Q9U5smgP4JAAHiOohTUnnmqSRwEJgROTacdeoxHWHhS0kzrZeD8BvmZrOqUkZmpGgCBIil5e6Yzyf0tZw71Pao2DUg7R9rTqC1LKI8/W3MD/Rqes8Mib/M21ECbIABMQFpogzkAsaA1NZlrtCAHTBAFTBkEjBQEzCgNTFcwDQR2j9UWjIIHTCsBisEiILmOO5RpulgBhkTTOSOzLYDTEQhAti6OJhIBC27Sp0xAGHQvQhGjNSQiFWhTt9PZf1mUodgE5Mmlr2Y/+et1kOpMQQLlYvY/Y/UySiCecYeay8mOSJtUCYFyltLFb6xGI0Va1I2oC5lMk6rrQSKQWeKzeY7mIslvt0it73OouM8KM/rPT0olX6/KT9VXWOUbfMfJlqggAgPwUDGKBdIQFBYAhcjSwIAmYDIChgcgKlQCEiB1MGoTwxr3GDZNGwP/6pGwXmuaA9vJlR+Pcm3IAAA0gAAABGIGXG07uE0AAADSAAAAEwYALTACA0GAHAMAku8iA0fS0wCFBVQPY6D8So3EfARuX3X+XLZS29KmQXBO4w1RGQRqw7pwNKUqXMhbGhUhN2HkaQsHDAO69PW5nLLitBmxHSTxYBpTn//3BKYeAqK/cf+33uW8FtNCt6wknN9/+ym33mOrv/v9ujZ1vn6r/3dKlTZz5nl9TmH1nWv/398yv7/PLmv1vv2N/QN9v//943KudDO//5/+P6/LD//f6/HWT02f1//c//ylSrKAQGAQGS083XHIE4VCAc1qEgINIx8JY2thgwVBGlHQ8MbAgMYQ5MEgrBIRGPANMjMPxJBQlgEWzX8C8iUEcNSGGyVkv0zIZ6vUDMkUM0WLUpHHn3lUZBVozwJe7/nGrhcQYsFTotmKGU1JIx4YIQKSbTBoMZXeEFWROitKkg/Bo0veN+1dz311bTALjBDIura8V/8v3+ok4iD7O4HdhyC9wKRtYo487Kr/////+xhh+GH5s172IxqQYY//8/+8/8/5///9/Dry44/ueBoDTSP0chU7/////1wHQABCrsZOZdc3QjTMhJMZCEDCFwCySORUA5gkEInGBQIKgIwMDTP/6pGypU/IAByhlQ017YAAAAA0goAABGv0pObndABAAADSDAAAAUG829Wzu40MOiADEAQBEYZyGMSIkqMaLcbIrEcg26B2CgGjBCli2Q0ixeNWyyUUSiQUBpARZPmT1tMi8TQpMBSKBmgIbaRFRkLw+RIxNUBgFMPhC2oFhQ4i6zVZrss1BqFAlBFAjhLptHaeonqikXgDRoeqVVGzzy1PbIqAwKFtSSeSv/G99ddukLUMqe6jf/Ue//zj//52kBxgADCgA1FzGgUXcYQQCZgagEGCkA6YGIBxgYAJmBCAsYCwA4GBRAQBRgMA4mCcLqYKgOJh3i5Gsh0odEY4Bh3AOhYYDHZfzAMjzCMFAMDrLSQRTAkAJl/0eASBphUNx1L+hoIIxg+BICABe7AyEGYnKKGiHQAppyWsONTyBSah1blFllJ/oe/ZpsSULzHEMzFMHAMCKTTkw8pu7t54ad2gcCbJ1kBMyI6M0zxamczQ8xCFSAFJIxZsXBzg6dM1HssoJqFngYpuBY2VCJoVtn+mTQAAs33krqrZ6QdO99nYz2sOoFCZ9lrPE69tbRTBg75Yaj1G4XgTi1NOE/qUzUg9AtnSIKkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqLf/6pGw3hPCE9f5nzNdygAQAAA0g4AABIK2jE692j8AAADSAAAAEUAAAMIADDLAgMC4AUwDwBEHUilhY9L3JEQAZIAMQgXmB8JMYB4NpgYC5GKLxQZLg6xgthBmIIYmQwmGBYDFYQpQrGHAbEg0mnCT1LAEDAwmH/HmBAekIBMbiEoaDPdu0S8cc6ZpJmMOjNYk7uvm7X3e4V6R9wYAhh6DxgOAMAS25VRlp70AUclZlXeIIAgohGYHqE6d6lhKYFllwzQSLpDlzQ65iiUgESD7GpfVW9aXl0ExIed1baxyNtVS/UNcQCT8pavjcKqvMd+pxnhvesrPbVQFbFQwNVv8wBCGn5pEW+MUEDUqU31MPKRztxwjZDyRU7K6MC+B4sJgNhcbR8NRYglURzWmVAGyA0FmTloyvbykpKWGjUcWdZ7+TxRTP+RLv8yNtW1q//3f/Pv/vS2hLgHiqmd2NTqyNaptyhGmWy4dIUg05UutXrCAYI9mi82HmZ3WyJgA8wnxOrfb0gv2j53/UQ36r/kaJ8bud/zn//TPf10xBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVElVABAQXbSJgIEIkBphGGP/6pGz0Bt2A9spoxlPdm/AAAA0gAAABE5WBPa3mb9AAADSAAAAEEIDrkelA4wiAQWCozcIcyaD0yHIJEgCgIYJCOZ08WbeC+DgeW6YLhcMAAgNZdGcXVyiTrxdQQyXF4WFhocsp33KoV1bnKJrNn9R0yyKz//9De+Sd/luICEaAD5mZhhBQcGQdh4w4BNjRIDkgwABSNHBE9BgeozmE1nXpP3X//5XGBoPeeT2J90HVU5iGExopK77XzULOGzc6/3rHF9NmV6yMD6oeXP8sP9v8fZ77f5o8uxoBQEL+tjMMwUW+xBqbXHXUeKoSuCDiiMTwrMKBaYeiADQpMUJlMpw7MAAAMBAiMFwXUpHgAl8gtXvzhdAqmYJESmHKK+DWEcG0p7kmWNa/dYxKfL//+Xvq9/dSJqAibIJZFrGGQLPlQfv5NPytKN+FVxFwOcNciHIec+QOvj70ZawsS8wQUGRS06EzI5MzZbLUUwFh4jcw5w0mS6nUSQGhEjRe6x/Lc5r2DwtXndTdYkQXVmXk9/j8W/n9uthTSv/PIQAIkgDQzo2IZOJNTboIKvJqJIbIbGQsJnZQX5NEVgsnmekBsgAcCbnBAun04UmHQFEoQFgczAYE000ggEBgNAkQgIUAoP/6pGyTEuUA9gVnyuu6ncQAAA0gAAABGIV/M67qlxAAADSAAAAEYCi03HLANGRyuGFoEKIOG5yl7CHJhb+UO5ZjKGqmAAnSaN0FFTmFSToLqDHAAAAZnhf4L6ijDMCyBZZDhiiFBKxlg9QQjCcAvulNysYInDUvmitwb0CplqRZMtIqZa1rOB0A9IJ0J51H3ZjNQIklZdp0/pq8n//9MbT+v/OH/t+uYlv1pf5HtPtmEAAAKAAFUSBiqCvYZ/gYwnVN3xBh+r9qbRoJIGshpqxgGQJ6YIYAJGBKgQhgGICwYGOAgGB4A35ta/RwIUJi+WBkX1hvqIwEAACAWX9FQLMmhjMWTWMsRVNPJvNKyHDhVMBgJRRBwBKUCSJiQ0LXQJJ/FoTD8GxYJENnhhLtRuKzMOAgI21QZAQXwLKi2TxiamSZqcLxGgKdDHAy+LaQI+eOE8cGaCBYCYANNHUKGDxV0lmJDgx8QOjXUIkDhGBbIQhotB1GkixkUkRSSj44DZbIqTbom4gstkka/IwljJNjn3WLQNk2dWWShWfGoLAc/0nSb+vqOH/ZugnzV0xBTUUzLjk5LjVVVZQ3BgAGACSWpozl7mzDSWGMPkBkFB0hgJRgDAJmAOAwMgKqCCoGBv/6pGyMyv+A9m1oyRt9m2QAAA0gAAABH82fKe/2a8AAADSAAAAEA4DAYPI7pkcIamCCBCYCgBRhPisDIGRgDgAhcBtDRAEx8BADmA4B4YVZwZiUgQF03XCwAKaiwZsI6PuTd5Y3Mz1kWDyzPn6qyllRl2idRUamLVPHUzz5Isf3qaBh5XbbSm1zu9b/3QA1l8ux5M7P8f/GLO6UI72FDuoosHFRSSB0qt3ys8sVn/8do4W/1kQl1aP1ohNyxOrMSCznBZAr6X+tAnt/9E4/yNRAAQMbkOIwDQD0aHvfIvIheJAACwI5hUBMggDkGCUGTvqYYHQTAUBXMRynNKgNIgSMCgVMLweDgGawhzCwRGBd0mfpoGA4KhABomkw4lujBUdBINlNUtUHgKDBiotBhCBi5X+pbWP9jpgUBNKWpBSQKhk55SyQZNTkoAuoBQ9RP3U1KK8BqQI9HjMra2SWXAQBgcaZRRTUPo2oHYoLX9Zi0b3/qFYL1f9RHCB0mpfWiGXR7Sr7UDYh4KEj7fuolh8p/7pSSV/3JQ3EikxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqql1KBYCTkjIJEczEgKGgaYVEJjP/6pGzxmvCA9odfSvvabVAAAA0gAAABGVGTGq92jYAAADSAAAAEQCBRsYcAyyodDA8ksMD8x/K1haYRBFUOYgCSI0f1jNDiUImWc5RIb7K5NBSs1K7pzwJM5gai7zv/1n1ccQGgMv5T0mF+R03428jEmRI012AreVLyjq0NokJgyc8NJJdY/v870UGIQseq9lNutNZTKzQADLTBvZRaYAWm/8Sf/2J43f9aAhEm/saj6Jg3kDPrKBwAAAAAIAM/PY0CXzmjPMhCA0GlDOZrHhMYSCo6ShLUmPD2YAlRyGeUGKGFEYHgHpgIAglgAdlRgDgjRZWEvEygwMwOzCKFbNV4FIMCYAAABgQApGAgAGzosrRKHjIB6ZAFAbMJwbswSwE1BH3llfC1i+sRZCBQHjC1AXSCkJutIqGyicizwSogWAEiTV6aBfdYewBuCI0FnkUHWVy6kTwQyhBBbmh9z7TiCIdNr1LqoFgVSuh6ogoYn/bmQl44jrIq+stB74xC+s4rqchwzgFkpU/pkoVxeG3+fRUWW+vniUKiqkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGySAuaA9R9Sz+uabHwAAA0gAAABHG2XF456i8AAADSAAAAEqqqqqqqqqqqqqqqqqqqIaHUHgyi3uicO0IHTPDGMiUYRCgkgYFMFNE4ecNdGQ9HiBI6HHHDhXg/C6KFD3NjCtnhllViNPWEQ0W////x+DnYFWz7Scekp88LdWpM4xsMVGtT/595FgJ/JI87aj6ky8CdAWQbpmCVepSCn/5QUf/L//KjT/zQmnp/c8SgK7/6FyJvUWMQBAAvADAAnJhVLJRwFUAgHDgCI6AAYCIDwCBlMK8ao+TmIDIBAuAQZJgSgEIQJ9kIBa/WYJHhYEDA0GjEjojphDTCgKDAwDDDcFhIm1uQ/DKBAgCQcApC00ZCgrIomAJzZFev3t32HsSAgYmTwTJcxbHWNrm3uoX0CgmLRZ1La33cY3PzMuHARMLBKcmYq7/GYkd2bfwEgoRERL6dulz7qZiRhsS4PEkeZnMV7nxFAoFHt6liPTVtvmxdC4ho7frLgDgDuKs83WaEUGPAmIrt/MxtEDJZX63TYhE2/z6ZLVUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGxc/9YA9C5Y1fszVxwAAA0gAAABHA2VFy92ccAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWzJAAAAAAu7JA0OznTJLAPOM6zo6VI3DhMgCNyRxozCjPDLEJeMEwIIw1Qlx4HO6Y+IOhgnAAI/qVlxy1YOAmbQgY+iurtKsl2HDMpdlqDBAmGP4/kOSykkC0xRiwfWeedeXww7lFTt0EguH2K7/00YsVOWE0mr0lV/5fbt189bboBiMswLiCCaSZNkHMQ6MGDzijAihogy0xgTMmze60FMgOgeEP1vl7/5w1/9i8z/2lkiDfb9NZkIoOxDnfdY6Zl8R3Gg5lcxpppoIZO2QXGOXjUxjRozUa7ZBvWiGCSsYQZRhkNGGQiprjowuDjDICMEjowLJyhBK60Rnh6WUimwYpFwkVJ0Y0SKA4hkkknVSOF8KIXRuCjuiTJeH2APxqUkDJYaOKMXQ75bfRRSUOoNOe91ssZkkliQi2spJIfRij1FuiMwl+omiRb9ZzMfmbec7/5Rb+rY1+aZKWdxMkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhMAQARgXXHGZ/ksY6g8YlByYFg0FgzMBhQLVmBwRP/6pGxX09IA9bNSzXvag/AAAA0gAAABFQlXY+/yRXAAADSAAAAEZaiueIZ2YhAgBQXM5UMMMQEVtUcEITjQGnCWoT/lAK0KKjAcBQQ0cEb4OBgmTSaFiFNZdpCACEyMHCZCPNaLE9ztz9dnSZIvUysVf/7YCEWiyz/a8dVwsJkQ/YxwzovuJ3l/q9j5kB+UmNJr4zEP55oSOr8njorvoC1ZznyVP+opSKQrfibOipvGZTnCm/UT6L2Vj+y/udIy3ZTyAiAAAAgAaZRMKcDgBAIhcBYGgLggAwwCwJzAQAgMDkHcxPgoTolQ6MP8AkwRgpzByErCAiVCmjGAMB2YBoKpiHHFGNqDQYEQCZZpMUBBwiEQSBAJFIM84mgGQEgBk7VUBGAgEpIlBHc2ijDBd/K+E1b++OAhNW2InIKmv50iS6PlHvLCzGgIHESFO8xuTv2mkjyBIaPscMQA1jakTV9hDA/2qpvAB5TV1LBRi1S7ZOEzdD1qEIpfm0XS5X6okrmSr1xcLFyW9MYJ0m1ZIn1v7oC1Ue/N1P+VHkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqp6AAAAQAslEgIC8aAZAwFZgP/6pGyA9uwA9dNfS2u7a/AAAA0gAAABGxWhIa9tsYAAADSAAAAEUAkAQDTAKAoBoCZgHAoGCeLcctwxRn8D5giFRi6Kw0FyJAOAMwaDYw7DExz4g0KFoCgOyCCxQF1ZULAMCJg8J5sIHAYGIGD4vSr5OEoAUwlAZBolLZfUdubmp+4NCgLeTyyqY7l0DUACqfNE5wxIcCBwGCjFBM4tIzDuBYaXPqTD4STV+ZCp2/FB2/G6mrpWKYpZ1/YiZaX6pRHi/46q/ywWl29Y2GR+ojHv7lg1ST/Na/XOHjh0ABAADAqKFJkEtL/BQAcKgIAAC8AgQGAcDKYSYzJtQpFmwSYYeCQsizBQDC4AIAGMFIwaEjg4pPoAESHyNLLnEkSsYsFgohjaxpLeAkFl7FVxUDGDxwYuEqlJkM2iwNi1nK5J0UwaLAW+nkJefIcBpy5WLp5J8jAHugLGCbNHUfsMsBZ+SRr84EQRxf5TEyfbrCwikitWsP6MNX6I2G/WPlNX6AxP8atvzhLL+5wgd3+TR44/ykSazb8vVfnD1UxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGyDEOWA9jBoSOvdonAAAA0gAAABF+2hJe9yicAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVYqXBIQVT27WSVmttXBdNDQFXQ0Oa3YCxi8LKgipaJaPI0tAhHAvxmm1u3FkZgncWR9caKvuSHZVRi4qjNjvNX8JYHH9RiAJEUvsLEDIbt1qF+ITJpfjLnv5ZJf/IH/olv+o7/lx/5wtf5Y/57+svW/M6v5bQaBAGAABCWGGASAeYCgDxgGgJmBEBUYHII5hHBoGayVacbnlJg2BvGAMB2YDIEgGAxMB0AUwFAHjBNDPMJwFAx2GjzOJCzMEIBIIBNoE+MgGJCIPDKYcpGeEnUYfgSYKAQHAG/CCAwQDwMAMUA4y3VowuAJk8OW6BPOllJATgYRMxV1R5InRfAYeaXiypmdyZAXVgiMnzVejIKCzQlrdjMAgCNM8/WoO+O5f1Qtcqq7jODCv8zDaj7/QEJiok3VF0dUurXEZzu/I8by3V2YTBj/s5ASu6Nq1D7Hcoq1+M85Z9UbhLExBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGwEss8A86Ve1/sZjYwAAA0gAAABHImhFy92kQAAADSAAAAEqqqqqqqqqqqqqqqqqqqqvdUCYxRLL9ZJTJ+xTkxlg0kOfMWkjNL16kzCcyQNBAD9DAEQAsRABFKikxNQwwLACAMAgADxIAzlkB4PpCtvgvEypQjdyOqopWWX7lEGv84it7yFQc5zPDeVm80pidBZv4bmJqCQuSULBl24es26fSHH7PaR42X0t+OQbc344JAUf+VZv4+yk38o/QaNUh+hhX/Qn6oYyWGFH+IH8km3AAAAAADMJkgOLQ4xzlbl9sw1AIyMMpBaDCALSAJkvjBwBTDs7DkJBzIQazOXkTiwczBsFkjW9YsCQHMNzsMVwUVXYITAOJLIPHUHhLYCwMDoFRPpExlCeIaM4Bk9QFlwGMTAiHjQJ8qDnl9UIQAEqBVSfmRDQMEJIIEw4DhhGmBiqTJXaomw05FjhEnV6QwU2/nSNKtl9yMSSJA+tdRDkpzDY2eTucXnBl0U0e2ZE8PPWlmaz4vhJ0uWS6bc50v//0SU4yW2VUxBTUUzLjk5LhMwAUGK3JZGY7DibIGNoQHjGARMgg8DG0OKAXAoYhgaDTAnJNijWAiY4Cd5nRk0xEYcqSqoGD/IoFp1Zv/6pGxuWdWA9PBH2fv4O/wAAA0gAAABGOV9Le/2g8AAADSAAAAEHCxiQLdOd5q6QnTgFjWmlgo6/0yxpl2NKMgDmn3mvd59EyFBHxzAV6Sx+zj8O5lmANVgS8XSQMzDNuR4UaTK+rnRCEUdD1OWZwL1FRSE6ZNO4XFeo/nedFnGX35SL+69mW5Dg09+s6rkoe27csr6vxlzUQAAAAEM8hhNgKGBoASYGoERgAAOsIAIMJgrA+mAQBQYJgCRhwB9GFuHyaVljp2sixmIoCoYMoCpgMBKISAAAkYBEaEGCukwPA4xIG87b+834Fsw7ABGgQgsEEUAQIamCALiz1joJGdUIGFosiAIwwAWvN7GmrPLPPsh6YrE8u2NVe29Q1MsFdEZCYwnC9rVL8/ImjT+vkhUEkwIAKIK05wmxdIs64aODOE0butzlJbiUAc4tIosooOZKJkBd47ThkssLJlIfDwC/HndS5AFqTKADDTymfJzRTEyTztSaZiwtYO8faYLLJIJVC+GwtVdZ6nJkk+dnHrh0pLtqWOs14s7Ot9YBYMbJLY09avXKZS6QggmRXgEsvEyyl2jGPBclAtoQAkRLaJawiN4SsEGs3OgwxQQqCXsC4Pbn/VMk8sTL0dazR4uXf/6pGyY/vsA9XRfzuuamvQAAA0gAAABIEWXF492b8gAADSAAAAEHjVUSAHsxd1v6M+gLPAnYk2d3SfSBoMFaEOIilrONhCcK1fznOA0QKWWpZkxkgdRTC0kUczLKyisuSPrAC6f1vJ9WkCwz691G9csmHXvRPCniHdWWuo9/5x//I4AIACwBK1aNL9MABABjAQgEcwbcBxMERAWDA/AMcwDAEDMEfEkjEHsEY5s2cjD8HlMF0NYYH1MEwBowDQETAFASEAC5gNgfGBYEWYP49Ro4dgGYmNEYQwT5gAgTGAsAaYBoAhggAWiwJBgVgRpItoYDICRo7FbGUGqYbBBelr1JJzAgQYhI2eAEbns7sAheqSNzmM650uf1YIEFs08bEAMBcat9O/l2URctAHXlAVBta1YqvxB3MR0ckyJv4audknP3KAuGh4EX7P7196t8cEYYhyksZSrtbB0OVDF4mlnf7Scg67+UAmCgJO4f9/45z+XisEWNaob2M5283pUEqm1fnaay9De5X8JcVgjKxq52hg7LtwdADeZdwl96anOZPsYDE7TbWOVy4gQw5+i1Wq2FLhLTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/6pGwjnP+A9QhfUutZm2wAAA0gAAABJl2fCK/7i0gAADSAAAAEVVVVVVU4QIABqiDqjO1yL3MBgHAwbQUDA1AdAQJBgDA3mD0JoZnPBhvxDkGFuDqYHQFANB5MBcAItWjk5xWBAYDZiQDh2awRvgDACH8DAoXsQ7jgENgLixaH01ANmZhCHC7ZVS8wYHN3Lawhl0FqeEXvZXvov5KxQAjEYB20n+XbeF7PCbGAaCBZf6F8z5otEs6IQ/B7Uj2xxWiGXw4E2XQrbRCyckVGSjGdYi61gapn9S5PKeSgblT+Y3YfBG2dZ5SMwJEIDhaQjuxKF+8pjeV6z3Jstdq2rYSQkuuT57jK9yujgDoghbcRIkMBmDRjAJTakLBYUQEgkY2XmSnmOUnDH51DsxaVvWwBD242McQXTLAA4b9whz+3P/MDEJlhG6+sKPcASqxsCK5/5/MQ/IA75PNTzfOhKQodMhWXVPMsJlDw/V1h3xmTJ1OssozhfBs6KOTZ2XqNCoLEkPmPMxOz/S8t9bX2I0YH1H+dPf+d/+TTKiAAAcYqYaJH+YJDgY2g8YYCyYDCkYyA8CipIiuMoUQAITCYZ8vOme8CRZgKoJIYCGACmLqBGFINg4BHZRFBwJGEgRmFIv/6pGy/iNqA9uxlRkvdm/IAAA0gAAABEjV/Q6zua7AAADSAAAAEGfFb8fck4Y1AsYNgKWvIAEEAThAMgkFUsRwAyqNxzLRxgiCBguCifMihMucFoMafYGCeZnDchG4TO7F+5LMq8USPMZw+TjnJjmG6353gqGQsQ0tbb6v1qOK8riAJR4HcLf1/uXv+6hi2fDPm+47/dQVACLb/Ol+tlbsykwCBd5cv/mo9jrUAiwC3tf/Plvf5JYl38cb3/q5xnokEN7uqvPgbf7VRYrzL/5dov5uHZFrm5Tur3vZUQAW3vf/HT0T2/2pje0kgFAAxEoYDqGAJJEraBIDpg+A+mA0BsYAYA5gRANGFyFWaOl1p6U2plIQxiCGoAERCeBAATETnEACGAINmFQ8HGvGGT5RGFwSmAACIOFABpmtwe2JtGGAvM9l3FiXMGgrTqYLCpCvZ9+TaPAVEtgDpw1XwTM1GJSBIWClEW02Mk0VMyZoFugFGxFTJyXzYnUnBANC5Jo6B1NJkqheDCZS1I3UpEcsqKSpLoskTQN5iXZ203zg23WrdJ8xJGlo0UUkjARr1stKejOlW26J6pRKFvqqemajgLbdRshqIE1WXWobLvXapJA9mGIcvUY6KBAUwlyoAV//6pGwj3/+E+FBmQ6u/6hAAAA0gAAABG62VDk92i8gAADSAAAAE0ZhJEHZvgwNfjNBmCwNVyVCRw5gNDpqHLDkjYyrJ4AWgDYRyQ1eQtRIlhjpCgZYFYqjw1SC0EBwABBcvjrPszssvDngMWKJUKYuBjW1MRiPJ55ifVSZh1P/6P/yj+z7vHHfX/8sogAABRYyUACQkAQatAKOhCBolJAFN7uOPzCMHhJMgl+HghMOIMO/4lMvkgOeymMLADMuweDg1PR3tMWisZGY96teMYWTpQQ7T2O7HRQCZaauWJ1v6Z8En5XxqiSK0pmp8xUkjzOitxTh2MxMbMrGSsBBNKY8SpQM8YsYIfmBjrjykHIZ0KaYOlGeCwCKBUChmQ2nskDA35hFRhT/MlDgADEjTIDAANIdP7nW5fsXoM7O7quitdh79y9r8BX7OE13+STfLFD3K1H34fivPwPKLz6T2vlu7uqOtavVsJrG7lYw3SckEbvxvLmHKe/3G/hj+t83UrTGsopVxyyy/fNU9Jh3WE5G7dH2vZ7y53v/////////////////93DHHm//////////////////79j+2JxUExxE2ut7f7fb7WSSNAHRRjwGAv0WCTQAWNA2aNMX0ciEEhv/6pGzS1OiAA+E8UO1mYAwAAA0goAABJiYLC1ndgAAAADSDAAAAUrl0G+poXETJx5QESvDYai65rZgGgBc/CTFHzAmjkXZy4YtdTzIUanvcKUonFkH8rlx0z2iGLLGyVB58FHVytACmZH7H4FMG8HpEL9pBhRoqDhppNN0kGkye1l91MkrN95tHUvpKYagaGhQBQKa45YbYnfUKqb3tYWd3jqa5vvP//5/9///n/v6L//8//7uf//4f/3aPP+3tAGAAACEkAzkRlTFmDDMEAB4wWwZDBTA0JgKjACALMAgANWxjpgNALiEAsw6g7zB/CeMRUqw2uQbjoAKdMbAck0fNozDXoRFMYmgwAQCLhmAgMgoii10CA0AhCB5hIB5tN1BlGWxjKFBgiABCAKnJdFr8miWT3LDS56DAsJgSdZgUCICBW1WjUezxu93epdEIVCgfGGYJA4EnhjMOr7u2YasTK1IBRNFAbRudaU0U7jcyoNWvyrWhECRED0atfhhT83vX/raHOM2d/zWH75/43okYDAAwa1/P3RY5fzn/SuBWx5z8P5rL/yrSpC/L/5et85vX/jtsNNl/P+538Nfu77oPNl3/xnOa//12swqxhJk18AAAKGQD4KkMWBkweFgECf/6pGzWHu6ABeBH025vQAQAAA0gwAAAIfmjD13ugAAAADSDgAAEdqKu8sUwSADEoSMID8wqVDF78MIn4y1jTKP9BNLge0wQQYgECCYRYURgFAaBgJqbKDoqBKHAXPM05eqA4wKAEzKFFLMPYAUaA2TYfunJQEoXWmL7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qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/6pGz+DSKP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==" type="audio/mpeg" />
</audio>
<div id="ayudaBanner" role="status" aria-live="assertive" aria-atomic="true"
     class="hidden items-center gap-2 rounded-full border-[3px] border-black bg-red-700 px-3 py-2 text-[14px] font-extrabold text-white">
  <span id="ayudaTexto"></span>
  <button id="btnIrAyuda" type="button"
          aria-label="Generar una ruta para ir a ayudar a la persona que pidió ayuda"
          class="hidden min-h-11 rounded-lg border-2 border-black bg-white px-2 text-[13px] font-extrabold text-red-700">
    Ir a ayudar
  </button>
</div>

<!-- Reporte de tramos con problemas: solo se muestra en modo vidente -->
<button id="btnIncidencia" type="button" aria-pressed="false"
        aria-label="Reportar un tramo bloqueado o dañado">
  <span class="material-icons" aria-hidden="true" style="font-size:22px">report_problem</span>
  <span>Reportar tramo</span>
  <span id="incidenciaNum" class="incidenciaNum hidden" aria-hidden="true">0</span>
</button>
<div id="incidenciaHint" role="status" aria-live="polite">
  <span class="material-icons" aria-hidden="true">report_problem</span>
  <span>Modo reporte: toca el tramo del sendero con problemas</span>
</div>

<section id="incidenciaDialog" role="dialog" aria-modal="false"
         aria-labelledby="incTitulo" aria-describedby="incSubtitulo">
  <h2 id="incTitulo">Reportar problema en el sendero</h2>
  <p id="incSubtitulo"></p>
  <div id="incTipos" role="group" aria-label="Tipo de problema">
    <button type="button" data-tipo="Bloqueado" aria-pressed="true">Bloqueado</button>
    <button type="button" data-tipo="Dañado" aria-pressed="false">Dañado</button>
    <button type="button" data-tipo="En obras" aria-pressed="false">En obras</button>
    <button type="button" data-tipo="Otro" aria-pressed="false">Otro</button>
  </div>
  <div id="incAcciones">
    <button id="incConfirmar" type="button">Marcar tramo</button>
    <button id="incLevantar" type="button" class="hidden">Levantar bloqueo</button>
    <button id="incCancelar" type="button" class="btnCancelar">Cancelar</button>
  </div>
</section>

<!-- Panel que aparece al elegir un edificio -->
<section id="sheet" role="region" aria-label="Información del edificio seleccionado"
         class="absolute inset-x-2.5 bottom-2.5 mx-auto hidden max-w-md flex-col gap-2 rounded-2xl border-4 border-black bg-yellow-200 p-3.5">
  <div class="flex items-center justify-between gap-2">
    <button id="btnPrev" aria-keyshortcuts="ArrowLeft" class="flex min-h-14 min-w-14 flex-col items-center justify-center gap-0.5 rounded-[10px] border-[3px] border-black bg-black px-2 text-white">
      <span class="material-icons" aria-hidden="true" style="font-size:26px">chevron_left</span>
      <span id="prevId" class="text-sm font-extrabold leading-none"></span>
    </button>
    <h2 id="sheetName" tabindex="-1" class="m-0 flex-1 text-center text-[26px] font-extrabold"></h2>
    <button id="btnNext" aria-keyshortcuts="ArrowRight" class="flex min-h-14 min-w-14 flex-col items-center justify-center gap-0.5 rounded-[10px] border-[3px] border-black bg-black px-2 text-white">
      <span class="material-icons" aria-hidden="true" style="font-size:26px">chevron_right</span>
      <span id="nextId" class="text-sm font-extrabold leading-none"></span>
    </button>
    <button id="btnClose" aria-label="Cerrar información del edificio"
            class="flex h-11 w-11 min-h-11 shrink-0 items-center justify-center rounded-[10px] border-[3px] border-black bg-white text-black">
      <span class="material-icons" aria-hidden="true" style="font-size:26px">close</span>
    </button>
  </div>
  <p id="sheetDir" class="m-0 text-[19px] font-extrabold leading-tight text-sky-900"></p>
  <p id="sheetWhere" class="m-0 text-base font-medium leading-snug"></p>
  <p id="sheetRoute" class="m-0 text-[15px] font-bold leading-snug text-blue-900"></p>
  <div class="mt-1 grid grid-cols-3 gap-2">
    <button id="btnRoute" aria-label="Generar ruta hacia el edificio seleccionado" class="inline-flex min-h-14 items-center justify-center rounded-[10px] border-[3px] border-black bg-blue-900 text-white"><span class="material-icons" aria-hidden="true" style="font-size:30px">route</span></button>
    <button id="btnSpeak" aria-label="Escuchar información de este edificio" class="inline-flex min-h-14 items-center justify-center rounded-[10px] border-[3px] border-black bg-black text-white"><span class="material-icons" aria-hidden="true" style="font-size:30px">volume_up</span></button>
    <button id="btnVoice" aria-pressed="true" aria-label="Voz automática: activada" class="inline-flex min-h-14 items-center justify-center rounded-[10px] border-[3px] border-black bg-white text-black"><span class="material-icons" aria-hidden="true" style="font-size:30px">volume_up</span></button>
  </div>
</section>

<!-- Vista interior: el resto del mapa queda desenfocado detrás -->
<section id="interior" role="dialog" aria-modal="true" aria-labelledby="inTitle" aria-describedby="inNote"
         class="absolute inset-0 z-20 hidden flex-col bg-white/95">
  <header class="flex items-center gap-3 p-3">
    <button id="inExit" class="inline-flex min-h-14 items-center justify-center gap-2 rounded-[10px] border-[3px] border-black bg-white px-5 text-lg font-extrabold text-black"><span class="material-icons" aria-hidden="true">arrow_back</span>Salir</button>
    <h2 id="inTitle" class="m-0 text-2xl font-extrabold"></h2>
  </header>
  <div id="inStage" class="relative min-h-0 flex-1"></div>
  <div id="inInfo" class="m-3 flex flex-col gap-2 rounded-2xl border-4 border-black bg-yellow-200 p-3.5"
       style="margin-bottom: max(4.5rem, env(safe-area-inset-bottom));">
    <p id="inRoom" class="m-0 text-[22px] font-extrabold"></p>
    <p id="inNote" class="m-0 text-base font-medium leading-snug"></p>
    <div class="flex gap-2">
      <button id="inSpeak" type="button" class="inline-flex flex-1 min-h-14 items-center justify-center gap-2 rounded-[10px] border-[3px] border-black bg-black text-lg font-extrabold text-white"><span class="material-icons" aria-hidden="true">volume_up</span>Escuchar</button>
      <button id="inMapa" type="button" aria-label="Volver a la vista de mapa para elegir otra ruta" class="inline-flex flex-1 min-h-14 items-center justify-center gap-2 rounded-[10px] border-[3px] border-black bg-white text-lg font-extrabold text-black"><span class="material-icons" aria-hidden="true">map</span>Ver mapa</button>
    </div>
  </div>
</section>

<!-- Solo en modo no vidente: flechas grandes abajo para elegir edificio.
     El resto de la pantalla confirma la elección y genera la ruta. -->
<section id="ciego" role="group" aria-label="Elegir edificio con las flechas"
         class="absolute inset-x-0 z-30 hidden items-center justify-center gap-3">
  <button id="ciegoPrev" type="button" aria-label="Edificio anterior"
          class="flex items-center justify-center">
    <span class="flechaIcono"><span class="material-icons" aria-hidden="true" style="font-size:40px">chevron_left</span></span>
  </button>
  <button id="ciegoNext" type="button" aria-label="Edificio siguiente"
          class="flex items-center justify-center">
    <span class="flechaIcono"><span class="material-icons" aria-hidden="true" style="font-size:40px">chevron_right</span></span>
  </button>
</section>

<script>
/* ---------- Datos ----------
   Coordenadas en píxeles del plano oficial (1312 x 985).
   [id, centroX, centroY, ancho, alto, descripción] */
const BUILDINGS = [
  ['C', 750, 372, 460, 110, 'Sur, junto a Avenida Placeres.'],
  ['R', 235, 345, 70, 45, 'Suroeste, junto a Avenida Placeres.'],
  ['R2', 330, 375, 48, 40, 'Suroeste, junto a R.'],
  ['M', 360, 470, 48, 120, 'Oeste, junto a Pasaje Valdés.'],
  ['M2', 415, 440, 48, 40, 'Oeste, junto a M.'],
  ['B', 835, 510, 290, 130, 'Centro-sur. Bloque en U.'],
  ['K', 1090, 420, 60, 70, 'Sureste, en Subida San Luis.'],
  ['J', 1120, 340, 48, 40, 'Sur de K.'],
  ['O', 1110, 560, 48, 40, 'Norte de K.'],
  ['L', 600, 600, 48, 80, 'Oeste, junto a la cancha.'],
  ['U', 710, 690, 60, 170, 'Centro-oeste. Bloque alargado.'],
  ['A', 840, 720, 170, 210, 'Centro-norte. Bloque grande, junto a B.'],
  ['H', 590, 780, 60, 40, 'Noroeste, en la ladera.'],
  ['D', 1020, 690, 120, 110, 'Centro-este, junto a A.'],
  ['E', 1050, 780, 150, 45, 'Centro-este, al norte de D.'],
  ['F2', 950, 820, 48, 70, 'Norte, entre A y F.'],
  ['F', 1060, 880, 220, 40, 'Norte, junto a F2.'],
  ['T', 1210, 850, 70, 80, 'Noreste, en Subida San Luis.'],
  ['8007', 515, 580, 150, 240, 'Cancha principal, junto al pasillo central.'],
  ['TENIS', 1185, 750, 70, 120, 'Cancha de tenis, junto a Subida San Luis.']
];
/* Las canchas son destinos clickeables, pero no tienen interior. */
const CANCHAS = new Set(['8007', 'TENIS']);
function etiquetaDestino(id) {
  if (id === '8007') return 'Cancha 8007';
  if (id === 'TENIS') return 'Cancha de tenis';
  return 'Edificio ' + id;
}
function nombreDestino(id) {
  if (id === '8007') return 'la cancha 8007';
  if (id === 'TENIS') return 'la cancha de tenis';
  return 'el edificio ' + id;
}

/* Los mismos senderos dibujados en el plano, como polilíneas en píxeles.
   Incluye los accesos que antes eran "enlaces" invisibles: ahora están
   dibujados, así la ruta nunca inventa un atajo que no aparece en el mapa. */
const PATHS = [
  [[740,312],[740,317]],
  [[740,427],[740,445]],
  [[700,575],[710,605]],
  [[740,690],[755,690]],
  [[520,380],[430,380],[355,405],[270,355]],
  [[300,415],[415,440],[450,450]],
  [[450,450],[415,580],[450,710],[535,740]],
  [[740,445],[636,470],[636,600],[600,700],[590,780]],
  [[535,740],[590,780],[590,820],[590,985]],
  [[636,600],[700,575]],                    /* L → sur de U */
  [[710,605],[745,605],[745,690],[740,690]],/* sur de U → oeste de A */
  [[755,690],[755,600],[925,600],[925,785]],/* oeste de A → patio de E */
  [[740,445],[980,510]],                    /* norte de C → acceso este de B */
  [[980,510],[1030,510],[1060,455],[1090,455]],
  [[980,372],[1040,372],[1102,340]],
  [[1102,340],[1100,455]],                  /* J → K */
  [[1100,455],[1100,540]],
  [[1100,580],[1140,620],[1140,757],[1140,860]],
  [[1020,745],[1020,757]],
  [[1020,757],[1140,757]],                  /* D → Subida San Luis */
  [[925,785],[941,785]],
  [[955,785],[955,860],[1050,860]],
  [[1050,802],[1050,860]],
  [[1050,860],[1140,860]],
  [[1140,860],[1175,860],[1175,810]]
];

/* Punto de entrada de cada edificio sobre el borde más cercano a un sendero. */
const ENTRADAS = {
  C: [740,427],  R: [270,355],  R2: [355,395], M: [384,440],
  M2: [415,460], B: [980,510],  K: [1090,455], J: [1102,340],
  O: [1100,560], L: [624,580],  U: [710,605],  A: [755,690],
  H: [590,780],  D: [1020,745], E: [975,785],  F2: [941,785],
  F: [1050,860], T: [1175,860],
  8007: [440,580], TENIS: [1185,810]
};

const DIRS = ['norte','noreste','este','sureste','sur','suroeste','oeste','noroeste'];
const METROS_POR_PIXEL = 0.75; /* el mismo valor que usa App.tsx para el GPS */
const CENTRO = { x: 690, y: 500 };

/* ---------- Incidencias en los senderos ----------
   Un vidente marca un tramo como bloqueado, dañado, en obras u otro problema.
   El aviso viaja por MQTT y TODOS los mapas excluyen ese tramo al calcular
   rutas: el mismo grafo sirve al vidente y a la persona guiada por voz. */
const INCIDENCIA_TOPIC = 'hackatonlyoss/campus/incidencias/v1';
const INCIDENCIA_TTL = 30 * 60 * 1000; /* 30 min sin confirmación → se levanta */
const INCIDENCIAS = {
  activas: new Map(),   // 'índice:tramo' -> { tipo, por, ts }
  locales: new Set(),   // claves reportadas por esta sesión (se republican al reconectar)
  modo: false,          // modo reporte, solo vidente
  seleccion: null,      // { i, s, clave } del tramo tocado
  tipo: 'Bloqueado',
  cargadas: false,      // los reportes guardados ya se restauraron
};
function claveTramo(i, s) { return i + ':' + s; }
function estaBloqueado(clave) { return INCIDENCIAS.activas.has(clave); }
/* Segmento dibujado más cercano a un punto. Sirve para etiquetar los conectores
   de las entradas: así un bloqueo no se puede esquivar por un atajo invisible. */
function segmentoMasCercano(x, y) {
  let clave = null, menor = Infinity;
  PATHS.forEach((path, pi) => {
    for (let s = 0; s < path.length - 1; s++) {
      const [ax, ay] = path[s], [bx, by] = path[s + 1];
      const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
      const t = l2 ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l2)) : 0;
      const d = Math.hypot(x - (ax + t * dx), y - (ay + t * dy));
      if (d < menor) { menor = d; clave = claveTramo(pi, s); }
    }
  });
  return { clave, dist: menor };
}
function describirTramo(i, s) {
  const [a, b] = [PATHS[i][s], PATHS[i][s + 1]];
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  let cerca = null, menor = Infinity;
  BUILDINGS.forEach(([id, cx, cy, w, h]) => {
    const d = Math.hypot(mx - cx, my - cy);
    if (d < menor) { menor = d; cerca = id; }
  });
  const nombre = cerca
    ? (CANCHAS.has(cerca) ? etiquetaDestino(cerca) : 'edificio ' + cerca)
    : 'el campus';
  return 'Sendero ' + (i + 1) + ', tramo ' + (s + 1) + ' · cerca de ' + nombre;
}

/* Ubicación de la persona (simulada). El GPS real llama a setUserPosition(x, y, geo)
   con coordenadas relativas al centro del plano. */
let dot = { x: CENTRO.x, y: CENTRO.y };

/* ---------- Estado ---------- */
const $ = (id) => document.getElementById(id);
const vp = $('viewport'), world = $('world');
let ox = 0, oy = 0, z = 1, selected = null, baseZ = 1;
/* En modo no vidente la selección se hace con flechas y se confirma tocando
   cualquier otro punto: mientras tanto no queremos que entre el plano interior. */
let elegirCiego = false;
function esCiego() { return PRESENCIA.rol === 'no-vidente'; }
let autoVoice = true;   /* voz automática activada por defecto */
try { if (localStorage.getItem('autoVoice') === 'off') autoVoice = false; } catch (e) {}
const buttons = {};
const ON  = ['bg-white','text-[#1d4ed8]','border-[#1d4ed8]','border-[5px]'];
const OFF = ['bg-[#e8f1fb]','text-[#334155]','border-[#cbd2d9]','border-[3px]'];

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
/* Los botones solo tienen icono: al tocarlos siempre se dice qué hacen. */
function hablarAccion(text) {
  say(text);
  announce(text);
}
/* Avisa a la app nativa (o al iframe padre en web) si entramos/salimos. */
function notificarInterior(activo) {
  const dato = JSON.stringify({ type: 'interior', activo });
  try {
    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
      window.ReactNativeWebView.postMessage(dato);
    } else if (window.parent !== window) {
      window.parent.postMessage(dato, '*');
    }
  } catch (e) {}
}

/* ---------- Construcción ---------- */
BUILDINGS.forEach(([id, cx, cy, w, h]) => {
  const W = Math.max(48, w), H = Math.max(48, h);
  const b = document.createElement('button');
  b.className = 'absolute box-border rounded-lg p-0 text-2xl font-extrabold ' + OFF.join(' ');
  if (CANCHAS.has(id)) b.classList.add('canchaBoton');
  b.style.cssText = 'left:' + Math.round(cx - W/2) + 'px;top:' + Math.round(cy - H/2) + 'px;width:' + W + 'px;height:' + H + 'px';
  b.textContent = id;
  b.setAttribute('aria-label', etiquetaDestino(id));
  b.setAttribute('aria-pressed', 'false');
  b.addEventListener('click', (e) => {
    if (justDragged) return;
    select(id, { focus: e.detail === 0, ciego: esCiego() });
    if (esCiego()) mostrarFlechasCiego(false);
  });
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
    borderWidth: (3 / z) + 'px', boxShadow: '0 2px 8px rgba(15,23,42,.25)' });
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
  const g = $('routeLine'), d = $('routeDone');
  g.setAttribute('stroke-width', 7 / z);
  g.setAttribute('stroke-dasharray', (16 / z) + ' ' + (12 / z));
  d.setAttribute('stroke-width', 7 / z);
  d.setAttribute('stroke-dasharray', (14 / z) + ' ' + (10 / z));
  $('routeEnd').setAttribute('r', 8 / z);
  actualizarEscalaIncidencias();
}

/* ---------- Incidencias: dibujo, reporte y recálculo ---------- */
const NS_SVG = 'http://www.w3.org/2000/svg';
/* El zoom cambia mucho más seguido que los bloqueos: ajustamos solo el grosor
   de lo ya dibujado en vez de reconstruir toda la capa en cada pellizco. */
function actualizarEscalaIncidencias() {
  const bloqueos = $('tramosBloqueados'), previa = $('tramoPreview');
  if (!bloqueos || !previa) return;
  $('tramosClickeables').querySelectorAll('path.tramoClic').forEach((p) => {
    p.setAttribute('stroke-width', (26 / z).toFixed(2));
  });
  bloqueos.querySelectorAll('[data-incidencia="linea"]').forEach((p) => {
    p.setAttribute('stroke-width', (9 / z).toFixed(2));
    p.setAttribute('stroke-dasharray', (13 / z).toFixed(2) + ' ' + (8 / z).toFixed(2));
  });
  bloqueos.querySelectorAll('[data-incidencia="marca"]').forEach((c) => {
    c.setAttribute('r', (10 / z).toFixed(2));
    c.setAttribute('stroke-width', (2 / z).toFixed(2));
  });
  bloqueos.querySelectorAll('text[data-my]').forEach((t) => {
    t.setAttribute('y', Number(t.getAttribute('data-my')) + 4 / z);
    t.setAttribute('font-size', (15 / z).toFixed(2));
  });
  previa.querySelectorAll('[data-incidencia="previa"]').forEach((p) => {
    p.setAttribute('stroke-width', (12 / z).toFixed(2));
  });
}
function pintarIncidencias() {
  const capa = $('tramosClickeables'), bloqueos = $('tramosBloqueados'), previa = $('tramoPreview');
  if (!capa || !bloqueos || !previa) return;
  capa.textContent = ''; bloqueos.textContent = ''; previa.textContent = '';
  PATHS.forEach((path, pi) => {
    for (let s = 0; s < path.length - 1; s++) {
      const [ax, ay] = path[s], [bx, by] = path[s + 1];
      const clave = claveTramo(pi, s);
      const d = 'M' + ax + ' ' + ay + ' L' + bx + ' ' + by;
      const nombre = describirTramo(pi, s);
      const info = INCIDENCIAS.activas.get(clave);

      /* Zona táctil transparente: solo visible y sensible al toque en modo reporte. */
      const hit = document.createElementNS(NS_SVG, 'path');
      hit.setAttribute('d', d);
      hit.setAttribute('class', 'tramoClic');
      hit.setAttribute('fill', 'none');
      hit.setAttribute('stroke', '#93c5fd');
      hit.setAttribute('stroke-width', (26 / z).toFixed(2));
      hit.setAttribute('stroke-linecap', 'round');
      hit.setAttribute('role', 'button');
      hit.setAttribute('tabindex', '0');
      hit.setAttribute('aria-label', 'Reportar problema: ' + nombre);
      hit.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!justDragged) abrirDialogoIncidencia(pi, s);
      });
      hit.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); e.stopPropagation();
          abrirDialogoIncidencia(pi, s);
        }
      });
      capa.appendChild(hit);

      if (info) {
        const g = document.createElementNS(NS_SVG, 'g');
        const titulo = document.createElementNS(NS_SVG, 'title');
        titulo.textContent = nombre + '. ' + info.tipo +
          '. La ruta no utiliza este tramo.';
        const linea = document.createElementNS(NS_SVG, 'path');
        linea.setAttribute('d', d);
        linea.setAttribute('fill', 'none');
        linea.setAttribute('stroke', '#b91c1c');
        linea.setAttribute('stroke-width', (9 / z).toFixed(2));
        linea.setAttribute('stroke-dasharray', (13 / z).toFixed(2) + ' ' + (8 / z).toFixed(2));
        linea.setAttribute('stroke-linecap', 'round');
        linea.setAttribute('data-incidencia', 'linea');
        const mx = (ax + bx) / 2, my = (ay + by) / 2;
        const circulo = document.createElementNS(NS_SVG, 'circle');
        circulo.setAttribute('cx', mx); circulo.setAttribute('cy', my);
        circulo.setAttribute('r', (10 / z).toFixed(2));
        circulo.setAttribute('fill', '#b91c1c');
        circulo.setAttribute('stroke', '#ffffff');
        circulo.setAttribute('stroke-width', (2 / z).toFixed(2));
        circulo.setAttribute('data-incidencia', 'marca');
        const cruz = document.createElementNS(NS_SVG, 'text');
        cruz.setAttribute('x', mx); cruz.setAttribute('y', my + 4 / z);
        cruz.setAttribute('data-my', my);
        cruz.setAttribute('text-anchor', 'middle');
        cruz.setAttribute('font-size', (15 / z).toFixed(2));
        cruz.setAttribute('font-weight', '900');
        cruz.setAttribute('fill', '#ffffff');
        cruz.textContent = '×';
        g.appendChild(titulo); g.appendChild(linea);
        g.appendChild(circulo); g.appendChild(cruz);
        bloqueos.appendChild(g);
      }

      if (INCIDENCIAS.seleccion && INCIDENCIAS.seleccion.clave === clave) {
        const prev = document.createElementNS(NS_SVG, 'path');
        prev.setAttribute('d', d);
        prev.setAttribute('fill', 'none');
        prev.setAttribute('stroke', '#f59e0b');
        prev.setAttribute('stroke-width', (12 / z).toFixed(2));
        prev.setAttribute('stroke-opacity', '.85');
        prev.setAttribute('stroke-linecap', 'round');
        prev.setAttribute('data-incidencia', 'previa');
        previa.appendChild(prev);
      }
    }
  });
  actualizarBotonIncidencia();
}
function actualizarBotonIncidencia() {
  const b = $('btnIncidencia');
  if (!b) return;
  b.style.display = PRESENCIA.rol !== 'no-vidente' ? 'flex' : 'none';
  b.setAttribute('aria-pressed', INCIDENCIAS.modo ? 'true' : 'false');
  const n = INCIDENCIAS.activas.size;
  b.setAttribute('aria-label', (INCIDENCIAS.modo
    ? 'Salir del modo reporte de incidencias. '
    : 'Reportar un tramo bloqueado o dañado. ') + n + ' tramos con problemas.');
  const num = $('incidenciaNum');
  if (num) { num.textContent = n; num.classList.toggle('hidden', n === 0); }
}
function alternarModoIncidencias(forzar) {
  const nuevo = typeof forzar === 'boolean' ? forzar : !INCIDENCIAS.modo;
  if (nuevo === INCIDENCIAS.modo) return;
  INCIDENCIAS.modo = nuevo && PRESENCIA.rol !== 'no-vidente';
  document.body.classList.toggle('reporte-incidencias', INCIDENCIAS.modo);
  if (!INCIDENCIAS.modo) cerrarDialogoIncidencia();
  pintarIncidencias();
  announce(INCIDENCIAS.modo
    ? 'Modo reporte activado. Toca el tramo del sendero que tiene un problema.'
    : 'Modo reporte desactivado.');
}
function abrirDialogoIncidencia(i, s) {
  if (PRESENCIA.rol === 'no-vidente' || !INCIDENCIAS.modo) return;
  const clave = claveTramo(i, s), actual = INCIDENCIAS.activas.get(clave);
  INCIDENCIAS.seleccion = { i, s, clave };
  INCIDENCIAS.tipo = actual ? actual.tipo : 'Bloqueado';
  $('incSubtitulo').textContent = describirTramo(i, s) +
    (actual ? '. Estado actual: ' + actual.tipo + '.' : '.');
  actualizarDialogoIncidencia();
  $('incidenciaDialog').classList.add('flex');
  pintarIncidencias();
}
function actualizarDialogoIncidencia() {
  $('incTipos').querySelectorAll('button').forEach((b) => {
    b.setAttribute('aria-pressed', b.dataset.tipo === INCIDENCIAS.tipo ? 'true' : 'false');
  });
  const actual = INCIDENCIAS.seleccion && INCIDENCIAS.activas.get(INCIDENCIAS.seleccion.clave);
  $('incConfirmar').textContent = actual ? 'Actualizar reporte' : 'Marcar tramo';
  $('incLevantar').classList.toggle('hidden', !actual);
}
function cerrarDialogoIncidencia() {
  $('incidenciaDialog').classList.remove('flex');
  INCIDENCIAS.seleccion = null;
  pintarIncidencias();
}
function guardarIncidenciasLocales() {
  const datos = [];
  INCIDENCIAS.locales.forEach((c) => {
    const v = INCIDENCIAS.activas.get(c);
    if (v) datos.push({ clave: c, tipo: v.tipo, ts: v.ts });
  });
  try { localStorage.setItem('incidenciasLocales', JSON.stringify(datos)); } catch (e) {}
}
function cargarIncidenciasLocales() {
  try {
    const datos = JSON.parse(localStorage.getItem('incidenciasLocales') || '[]');
    if (!Array.isArray(datos)) return;
    datos.forEach((d) => {
      if (typeof d.clave !== 'string' || !/^\\d+:\\d+$/.test(d.clave)) return;
      const [pi, si] = d.clave.split(':').map(Number);
      if (!PATHS[pi] || si < 0 || si >= PATHS[pi].length - 1) return;
      const ts = Number(d.ts) || Date.now();
      if (Date.now() - ts > INCIDENCIA_TTL) return;
      INCIDENCIAS.activas.set(d.clave, {
        tipo: d.tipo || 'Bloqueado', por: PRESENCIA.id, ts,
      });
      INCIDENCIAS.locales.add(d.clave);
    });
  } catch (e) {}
}
function publicarIncidencia(clave, accion, tipo, ts) {
  const ws = PRESENCIA.socket;
  if (!ws || ws.readyState !== 1 || !PRESENCIA.conectado) return;
  const cuerpo = {
    id: PRESENCIA.id, rol: 'vidente', accion, tramo: clave,
    tipo: tipo || null, ts: ts || Date.now(),
  };
  ws.send(mqttPaquete(3, 0, [
    ...mqttTexto(INCIDENCIA_TOPIC), ...bytesTexto(JSON.stringify(cuerpo)),
  ]));
}
function publicarIncidenciasLocales() {
  INCIDENCIAS.locales.forEach((clave) => {
    const v = INCIDENCIAS.activas.get(clave);
    if (v) publicarIncidencia(clave, 'bloquear', v.tipo, v.ts);
  });
}
function recibirIncidencia(mensaje) {
  if (!mensaje || typeof mensaje.tramo !== 'string' || !/^\\d+:\\d+$/.test(mensaje.tramo)) return;
  const [pi, si] = mensaje.tramo.split(':').map(Number);
  if (!PATHS[pi] || si < 0 || si >= PATHS[pi].length - 1) return;
  const clave = claveTramo(pi, si), ts = Number(mensaje.ts) || Date.now();
  const nombre = describirTramo(pi, si);
  let cambio = false;
  if (mensaje.accion === 'desbloquear') {
    cambio = INCIDENCIAS.activas.delete(clave);
    INCIDENCIAS.locales.delete(clave);
  } else if (mensaje.accion === 'bloquear') {
    const actual = INCIDENCIAS.activas.get(clave);
    if (!actual || ts >= actual.ts) {
      INCIDENCIAS.activas.set(clave, {
        tipo: mensaje.tipo || 'Bloqueado', por: mensaje.id, ts,
      });
      cambio = true;
    }
    if (mensaje.id === PRESENCIA.id) INCIDENCIAS.locales.add(clave);
  } else return;
  if (!cambio) return;
  guardarIncidenciasLocales();
  const quien = mensaje.id === PRESENCIA.id ? 'Reportaste' : 'Un vidente reportó';
  trasCambioIncidencias(mensaje.accion === 'bloquear'
    ? quien + ' ' + String(mensaje.tipo || 'un problema').toLowerCase() + ' en ' + nombre + '.'
    : 'Se levantó el bloqueo en ' + nombre + '.', true);
}
function confirmarIncidencia() {
  const sel = INCIDENCIAS.seleccion;
  if (!sel) return;
  const tipo = INCIDENCIAS.tipo, ts = Date.now();
  INCIDENCIAS.activas.set(sel.clave, { tipo, por: PRESENCIA.id, ts });
  INCIDENCIAS.locales.add(sel.clave);
  guardarIncidenciasLocales();
  publicarIncidencia(sel.clave, 'bloquear', tipo, ts);
  cerrarDialogoIncidencia();
  trasCambioIncidencias('Tramo marcado como ' + tipo.toLowerCase() +
    '. Las rutas se recalculan sin usarlo.', true);
}
function levantarIncidencia() {
  const sel = INCIDENCIAS.seleccion;
  if (!sel) return;
  const ts = Date.now();
  INCIDENCIAS.activas.delete(sel.clave);
  INCIDENCIAS.locales.delete(sel.clave);
  guardarIncidenciasLocales();
  publicarIncidencia(sel.clave, 'desbloquear', '', ts);
  cerrarDialogoIncidencia();
  trasCambioIncidencias('Bloqueo levantado. La ruta vuelve a usar ese tramo.', true);
}
function trasCambioIncidencias(mensaje, avisar) {
  pintarIncidencias();
  if (navegacion) {
    const nav = navegacion, r = mejorRuta(nav.destino);
    if (r) {
      iniciarNavegacion(nav.id, r, true);
      if (avisar) speakOrAnnounce(mensaje + ' Ruta recalculada. Quedan ' +
        Math.round(navegacion.total * METROS_POR_PIXEL) + ' metros.');
    } else {
      detenerRuta(true);
      if (avisar) speakOrAnnounce(mensaje + ' No hay una ruta alternativa.');
    }
  } else if (avisar) {
    announce(mensaje);
  }
  if (RUTA_AYUDA.activa) recalcularRutaAyuda();
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

/* ---------- Grafo de senderos y entradas ----------
   Vértices: giros de los caminos y entradas de edificios. Las aristas de un
   sendero pesan su longitud; los enlaces entre senderos y desde la persona se
   penalizan para preferir siempre los caminos dibujados. */
const GRAFO = (() => {
  const nodos = [], aristas = [];
  function nodo(x, y) {
    let n = nodos.find(p => Math.abs(p.x - x) < 0.5 && Math.abs(p.y - y) < 0.5);
    if (!n) { n = { x, y, i: nodos.length, entrada: null }; nodos.push(n); }
    return n;
  }
  function unir(a, b, factor, tramo) {
    if (a.i === b.i) return;
    aristas.push({ a: a.i, b: b.i, tramo: tramo || null,
      d: Math.hypot(a.x - b.x, a.y - b.y) * (factor || 1) });
  }
  PATHS.forEach((path, pi) => {
    const ns = path.map(([x, y]) => nodo(x, y));
    for (let i = 0; i < ns.length - 1; i++)
      unir(ns[i], ns[i + 1], 1, claveTramo(pi, i));
  });
  /* Solo se unen los puntos que están dibujados como sendero. Antes había
     enlaces cortos entre cualquier par de nodos y la ruta "recortaba" por
     encima de los edificios; ahora cada tramo del trazo existe en el plano. */
  const entradaNodo = {};
  Object.keys(ENTRADAS).forEach(id => {
    const [x, y] = ENTRADAS[id];
    const n = nodo(x, y);
    n.entrada = id;
    entradaNodo[id] = n.i;
    nodos.forEach(p => {
      const d = Math.hypot(p.x - x, p.y - y);
      if (p.i !== n.i && d <= 60) {
        /* El conector hereda el tramo dibujado más cercano: si ese tramo se
           reporta bloqueado, el conector tampoco se puede usar de atajo. */
        const seg = segmentoMasCercano((p.x + x) / 2, (p.y + y) / 2);
        unir(n, p, d <= 12 ? 1 : 1.5, seg.clave);
      }
    });
  });
  return { nodos, aristas, entradaNodo };
})();

function mejorRuta(destino) {
  const nodos = GRAFO.nodos, n = nodos.length;
  const dist = new Array(n).fill(Infinity), prev = new Array(n).fill(-1);
  const visto = new Array(n).fill(false);
  /* La persona entra a la red por el sendero más cercano, nunca por una
     entrada: así el primer tramo también va por un camino del plano. */
  let inicio = -1, mejorD = Infinity;
  nodos.forEach((p, i) => {
    if (p.entrada) return;
    const d = Math.hypot(p.x - dot.x, p.y - dot.y);
    if (d < mejorD) { mejorD = d; inicio = i; }
  });
  if (inicio >= 0) dist[inicio] = mejorD * 1.5;
  for (;;) {
    let u = -1, menor = Infinity;
    for (let i = 0; i < n; i++)
      if (!visto[i] && dist[i] < menor) { menor = dist[i]; u = i; }
    if (u < 0 || u === destino) break;
    visto[u] = true;
    GRAFO.aristas.forEach(e => {
      const v = e.a === u ? e.b : e.b === u ? e.a : -1;
      if (v < 0 || visto[v]) return;
      if (e.tramo && estaBloqueado(e.tramo)) return;
      const nd = dist[u] + e.d;
      if (nd < dist[v]) { dist[v] = nd; prev[v] = u; }
    });
  }
  if (!isFinite(dist[destino])) return null;
  const indices = [];
  for (let v = destino; v >= 0; v = prev[v]) indices.push(v);
  indices.reverse();
  const puntos = indices.map(i => GRAFO.nodos[i]);
  const desdePersona = [{ x: dot.x, y: dot.y }].concat(puntos);
  return {
    destino: destino,
    puntos: puntos,
    longitud: longitud(desdePersona),
    metros: Math.round(longitud(desdePersona) * METROS_POR_PIXEL)
  };
}

/* ---------- Navegación activa ----------
   Al pulsar "Generar ruta" parts desde el punto azul. Cada muestra del GPS
   proyecta ese punto sobre el recorrido: lo ya andado se pinta gris, lo que
   queda se pinta azul y el panel.anuncia el próximo giro. */
const UMBRAL_RUTA = 45;   /* px (~34 m): si el punto azul se aleja, se recalcula */
const LLEGADA = 20;       /* px (~15 m): distancia para dar la ruta por terminada */
const RECALCULO_MS = 4000;
let navegacion = null;

function puntosTexto(pts) {
  return pts.map(p => Math.round(p.x) + ',' + Math.round(p.y)).join(' ');
}
function longitud(pts) {
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++)
    total += Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
  return total;
}
function proyectarSobre(p, pts) {
  let mejor = { i: 0, t: 0, x: pts[0].x, y: pts[0].y, d: Infinity };
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const dx = b.x - a.x, dy = b.y - a.y, l2 = dx * dx + dy * dy;
    const t = l2 ? Math.max(0, Math.min(1,
      ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2)) : 0;
    const x = a.x + t * dx, y = a.y + t * dy;
    const d = Math.hypot(p.x - x, p.y - y);
    if (d < mejor.d) mejor = { i, t, x, y, d };
  }
  return mejor;
}
function avanceHasta(pts, i, t) {
  let s = 0;
  for (let k = 0; k < i; k++)
    s += Math.hypot(pts[k + 1].x - pts[k].x, pts[k + 1].y - pts[k].y);
  if (pts[i + 1])
    s += t * Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
  return s;
}
function instruccion(nav, pr) {
  const pts = nav.puntos, k = Math.min(pts.length - 2, pr.i + 1);
  const destinoPunto = pts[k], fin = pts[pts.length - 1];
  const metros = Math.max(0,
    Math.round(Math.hypot(pr.x - destinoPunto.x, pr.y - destinoPunto.y) * METROS_POR_PIXEL));
  if (k === pts.length - 1 || destinoPunto.entrada === nav.id) {
    return {
      clave: 'entrada',
      texto: 'Continúa ' + metros + ' m hasta ' + nombreDestino(nav.id) + '.'
    };
  }
  const a = pts[k - 1] || { x: pr.x, y: pr.y };
  const va = { x: destinoPunto.x - a.x, y: destinoPunto.y - a.y };
  const vb = { x: pts[k + 1].x - destinoPunto.x, y: pts[k + 1].y - destinoPunto.y };
  const cross = va.x * vb.y - va.y * vb.x;
  const escalar = va.x * vb.x + va.y * vb.y;
  const angulo = Math.abs(Math.atan2(cross, escalar)) * 180 / Math.PI;
  const giro = angulo < 28 ? 'Continúa recto'
    : cross > 0 ? 'Gira a la derecha' : 'Gira a la izquierda';
  return {
    clave: giro + ':' + k,
    texto: 'En ' + metros + ' m, ' + giro.toLowerCase() + '. Hacia ' + nombreDestino(nav.id) + '.'
  };
}
function pintarRuta(recorrido, restante) {
  $('routeDone').setAttribute('points', puntosTexto(recorrido));
  $('routeDone').setAttribute('stroke-opacity', recorrido.length > 1 ? '0.55' : '0');
  $('routeLine').setAttribute('points', puntosTexto(restante));
  $('routeLine').setAttribute('stroke-opacity', restante.length > 1 ? '0.95' : '0');
  const fin = restante[restante.length - 1] || recorrido[recorrido.length - 1] || dot;
  $('routeEnd').setAttribute('cx', Math.round(fin.x));
  $('routeEnd').setAttribute('cy', Math.round(fin.y));
  $('routeEnd').setAttribute('opacity', restante.length > 1 ? '1' : '0');
}
function ocultarRuta() {
  $('routeDone').setAttribute('points', '');
  $('routeDone').setAttribute('stroke-opacity', '0');
  $('routeLine').setAttribute('points', '');
  $('routeLine').setAttribute('stroke-opacity', '0');
  $('routeEnd').setAttribute('opacity', '0');
}
function actualizarBotonRuta() {
  const b = $('btnRoute');
  if (navegacion) {
    b.innerHTML = '<span class="material-icons" aria-hidden="true" style="font-size:30px">stop</span>';
    b.setAttribute('aria-label', 'Detener la navegación hacia ' + nombreDestino(navegacion.id));
  } else {
    b.innerHTML = '<span class="material-icons" aria-hidden="true" style="font-size:30px">route</span>';
    b.setAttribute('aria-label', 'Generar ruta hacia el destino seleccionado');
  }
}
function detenerRuta(silent) {
  if (!navegacion) return;
  navegacion = null;
  ocultarRuta();
  $('sheetRoute').textContent = '';
  actualizarBotonRuta();
  if (!silent) hablarAccion('Navegación detenida.');
}
function llegar(nav) {
  navegacion = null;
  ocultarRuta();
  actualizarBotonRuta();
  $('sheetRoute').textContent = 'Llegaste a ' + nombreDestino(nav.id) + '.';
  hablarAccion('Llegaste a ' + nombreDestino(nav.id) + '.');
  if (esCiego()) setTimeout(() => mostrarFlechasCiego(false), 1800);
}
function iniciarNavegacion(id, r, silent) {
  navegacion = {
    id: id,
    destino: r.destino,
    puntos: [{ x: dot.x, y: dot.y, entrada: null }].concat(
      r.puntos.map(p => ({ x: p.x, y: p.y, entrada: p.entrada }))),
    total: r.longitud,
    ultimoAviso: '',
    ultimoRecalculo: Date.now()
  };
  actualizarBotonRuta();
  pintarRuta([], navegacion.puntos);
  const ins = instruccion(navegacion, { i: 0, t: 0, x: dot.x, y: dot.y, d: 0 });
  $('sheetRoute').textContent = 'Ruta a ' + nombreDestino(id) + ' · ' +
    Math.round(navegacion.total * METROS_POR_PIXEL) + ' m. ' + ins.texto;
  centerOn(dot.x, dot.y);
  if (!silent)
    hablarAccion('Ruta generada hacia ' + nombreDestino(id) + '. ' +
      Math.round(navegacion.total * METROS_POR_PIXEL) + ' metros. Sigue el camino azul ' +
      'desde el punto azul. ' + ins.texto);
}
function generarRuta(id) {
  const destino = GRAFO.entradaNodo[id];
  if (destino === undefined) return;
  const r = mejorRuta(destino);
  if (!r) {
    hablarAccion('No se pudo generar la ruta hacia ' + nombreDestino(id) + '.');
    return;
  }
  iniciarNavegacion(id, r);
}
function actualizarNavegacion(opts) {
  const nav = navegacion;
  if (!nav) return;
  opts = opts || {};
  const fin = nav.puntos[nav.puntos.length - 1];
  if (Math.hypot(dot.x - fin.x, dot.y - fin.y) <= LLEGADA) { llegar(nav); return; }

  const pr = proyectarSobre(dot, nav.puntos);
  if (pr.d > UMBRAL_RUTA) {
    if (!opts.silent && Date.now() - nav.ultimoRecalculo > RECALCULO_MS) {
      nav.ultimoRecalculo = Date.now();
      const r = mejorRuta(nav.destino);
      if (r) {
        iniciarNavegacion(nav.id, r, true);
        speakOrAnnounce('Ruta recalculada desde tu ubicación. Quedan ' +
          Math.round(navegacion.total * METROS_POR_PIXEL) + ' metros.');
      }
    }
    return;
  }

  const recorrido = nav.puntos.slice(0, pr.i + 1).map(p => ({ x: p.x, y: p.y }));
  recorrido.push({ x: pr.x, y: pr.y });
  const restante = [{ x: pr.x, y: pr.y }].concat(nav.puntos.slice(pr.i + 1));
  pintarRuta(recorrido, restante);

  const quedan = Math.max(0,
    Math.round((nav.total - avanceHasta(nav.puntos, pr.i, pr.t)) * METROS_POR_PIXEL));
  const ins = instruccion(nav, pr);
  $('sheetRoute').textContent = etiquetaDestino(nav.id) + ' · quedan ' + quedan + ' m. ' + ins.texto;
  if (!opts.silent && ins.clave !== nav.ultimoAviso) {
    nav.ultimoAviso = ins.clave;
    speakOrAnnounce(ins.texto);
  }
}

/* ---------- Selección ---------- */
function info(id) {
  const [, cx, cy, , , where] = BUILDINGS.find(b => b[0] === id);
  const dx = cx - dot.x, dy = cy - dot.y, dist = Math.hypot(dx, dy);
  const ang = (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;
  const metros = Math.round(dist * METROS_POR_PIXEL);
  const dir = dist < 70
    ? 'Ya estás junto a este lugar.'
    : 'Desde tu ubicación, a ' + metros + ' metros hacia el ' + DIRS[Math.round(ang/45) % 8] + '.';
  return { cx, cy, where, dir, metros, label: etiquetaDestino(id) };
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
  $('sheetRoute').textContent = '';
  detenerRuta(true);
  if (esCiego()) {
    /* En modo no vidente no mostramos el panel: manda la voz y las flechas. */
    $('sheet').classList.add('hidden'); $('sheet').classList.remove('flex');
  } else {
    $('sheet').classList.remove('hidden'); $('sheet').classList.add('flex');
  }
  $('hint').classList.add('hidden');
  restyle();
  centerOn((dot.x + i.cx)/2, (dot.y + i.cy)/2);

  const texto = i.label + '. ' + i.dir + ' ' + i.where;
  if (opts.focus && !esCiego()) $('sheetName').focus({ preventScroll: true });
  if (opts.silent) return;
  if (opts.ciego || esCiego())
    hablarAccion(i.label + (CANCHAS.has(id) ? ' seleccionada. ' : ' seleccionado. ') + i.dir + ' ' + i.where);
  else if (opts.focus) announce(i.dir + ' ' + i.where);
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
/* ---------- Modo no vidente: elegir con flechas, confirmar en cualquier punto ---------- */
function edificioMasCercano() {
  return ORDER.reduce((mejor, id) => info(id).metros < info(mejor).metros ? id : mejor, ORDER[0]);
}
function actualizarFlechasCiego() {
  if (!selected) return;
  $('ciegoPrev').setAttribute('aria-label',
    'Edificio anterior: ' + neighbor(-1) + '. Seleccionado: ' + selected);
  $('ciegoNext').setAttribute('aria-label',
    'Edificio siguiente: ' + neighbor(1) + '. Seleccionado: ' + selected);
}
function mostrarFlechasCiego(hablar) {
  if (!esCiego()) return;
  if (inside) {
    AUTO_INTERIOR.activo = false;
    AUTO_INTERIOR.bloqueo = Date.now() + 15000;
    exitBuilding();
  }
  if (!selected) selected = edificioMasCercano();
  elegirCiego = true;
  $('sheet').classList.add('hidden'); $('sheet').classList.remove('flex');
  $('hint').classList.add('hidden');
  $('ciego').classList.remove('hidden'); $('ciego').classList.add('flex');
  actualizarFlechasCiego();
  if (hablar) {
    const i = info(selected);
    hablarAccion('Modo no vidente. Edificio seleccionado: ' + selected + '. ' +
      i.dir + ' ' + i.where + ' Usa las flechas para cambiar de edificio y toca ' +
      'en cualquier otro lugar para generar la ruta.');
  }
}
function ocultarFlechasCiego() {
  elegirCiego = false;
  $('ciego').classList.add('hidden'); $('ciego').classList.remove('flex');
}
function confirmarRutaCiego() {
  if (!elegirCiego || !selected || inside) return;
  ocultarFlechasCiego();
  generarRuta(selected);
}
function step(d) {
  if (!selected) return;
  select(neighbor(d), { focus: true, ciego: esCiego() });
  if (esCiego()) mostrarFlechasCiego(false);
}
function closeSheet() {
  if (selected) {
    buttons[selected].classList.remove(...ON); buttons[selected].classList.add(...OFF);
    buttons[selected].setAttribute('aria-pressed', 'false');
  }
  selected = null;
  detenerRuta(true);
  $('sheet').classList.add('hidden'); $('sheet').classList.remove('flex');
  $('hint').classList.remove('hidden');
  restyle();
  announce('Panel cerrado. Toca un edificio para ver su información.');
}
function speak() {
  if (!selected) return;
  const i = info(selected);
  const texto = 'Escuchar información de este edificio. ' + i.label + '. ' + i.dir + ' ' + i.where;
  hablarAccion(texto);
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
  b.innerHTML = '<span class="material-icons" aria-hidden="true" style="font-size:30px">' +
    (autoVoice ? 'volume_up' : 'volume_off') + '</span>';
  b.setAttribute('aria-pressed', autoVoice ? 'true' : 'false');
  b.setAttribute('aria-label', 'Voz automática: ' + (autoVoice ? 'activada' : 'desactivada') +
    '. Si usas lector de pantalla, desactívala para evitar que dos voces hablen a la vez.');
}
$('btnVoice').onclick = () => {
  autoVoice = !autoVoice;
  try { localStorage.setItem('autoVoice', autoVoice ? 'on' : 'off'); } catch (e) {}
  voiceLabel();
  hablarAccion('Voz automática ' + (autoVoice ? 'activada' : 'desactivada') + '.');
};
voiceLabel();
actualizarBotonRuta();


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
/* Ruta del vidente hacia quien pidió ayuda. Danko puede registrar su
   generador con window.registrarGeneradorRutas(fn); si no, usamos la red
   de senderos dibujada en el plano. */
const RUTA_AYUDA = { activa: false, id: null, puntos: [] };
const GENERADOR_RUTAS = { fn: null };

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
  /* Un frame WebSocket puede traer varios paquetes MQTT pegados. Procesar
     solo el primero hacía que se perdieran pedidos de ayuda cuando llegaban
     junto a un reporte de presencia. */
  let i = 0;
  while (i < datos.length) {
    const tipo = datos[i++] >> 4;
    let multiplicador = 1, longitud = 0, octeto;
    do { octeto = datos[i++]; longitud += (octeto & 127) * multiplicador; multiplicador *= 128; } while (octeto & 128);
    const fin = i + longitud;
    if (fin > datos.length) break;
    if (tipo === 2) {
      PRESENCIA.conectado = (datos[i + 1] & 1) === 0;
      if (PRESENCIA.conectado && PRESENCIA.socket) {
        PRESENCIA.socket.send(mqttPaquete(8, 2, [
          0, 1,
          ...mqttTexto(PRESENCIA_TOPIC), 0,
          ...mqttTexto(AYUDA_TOPIC), 0,
          ...mqttTexto(INCIDENCIA_TOPIC), 0,
        ]));
        publicarPresencia(true);
        publicarAyuda(true);
        publicarIncidenciasLocales();
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
      else if (tema === INCIDENCIA_TOPIC) recibirIncidencia(mensaje);
    }
    i = fin;
  }
}
function publicarPresencia(fuerza = false) {
  const ws = PRESENCIA.socket;
  if (!ws || ws.readyState !== 1 || !PRESENCIA.conectado || !PRESENCIA.rol) return;
  const ahora = Date.now();
  if (!fuerza && ahora - PRESENCIA.ultimoEnvio < 400) return;
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
  const dy = ((lat - o.latitude) * metrosPorGradoLat) / METROS_POR_PIXEL;
  return { x: CENTRO.x + dx, y: CENTRO.y + dy };
}
const AUTO_INTERIOR = { dentro: 0, fuera: 0, activo: false, bloqueo: 0 };
function edificioEn(x, y) {
  const MARGEN = 8; /* ~6 m: tolerancia a ruido GPS en espacios pequeños */
  for (const [id, cx, cy, w, h] of BUILDINGS) {
    if (CANCHAS.has(id)) continue; /* las canchas no tienen plano interior */
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
    /* Guardamos también el geo crudo: la distancia real no debe depender
       del ancla local de cada celular (dos anclas con error se restan). */
    p.lat = f.lat;
    p.lng = f.lng;
    p.accFus = f.acc;
    p.n = f.n;
    p.edificio = edificioEn(punto.x, punto.y);
  });
}
function verificarInteriorAuto() {
  if (PRESENCIA.rol !== 'no-vidente' || elegirCiego || Date.now() < AUTO_INTERIOR.bloqueo) return;
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
function construirRedCaminos() {
  const nodos = [];
  const indice = new Map();
  function nodo(x, y) {
    const clave = Math.round(x) + ':' + Math.round(y);
    if (!indice.has(clave)) {
      indice.set(clave, nodos.length);
      nodos.push({ x, y, vecinos: [] });
    }
    return indice.get(clave);
  }
  document.querySelectorAll('g[stroke="#94a3b8"][stroke-width="24"] path').forEach((p, pi) => {
    const d = p.getAttribute('d') || '';
    const pts = [...d.matchAll(/[ML]\\s*(-?[\\d.]+)[ ,]+(-?[\\d.]+)/g)]
      .map((m) => ({ x: Number(m[1]), y: Number(m[2]) }));
    for (let i = 0; i < pts.length; i++) {
      const a = nodo(pts[i].x, pts[i].y);
      if (i > 0) {
        const b = nodo(pts[i - 1].x, pts[i - 1].y);
        const w = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
        const tramo = claveTramo(pi, i - 1);
        nodos[a].vecinos.push({ i: b, w, tramo });
        nodos[b].vecinos.push({ i: a, w, tramo });
      }
    }
  });
  return nodos;
}
const RED_CAMINOS = construirRedCaminos();
function indiceCercano(p) {
  let mejor = -1, menor = Infinity;
  RED_CAMINOS.forEach((n, i) => {
    const d = Math.hypot(n.x - p.x, n.y - p.y);
    if (d < menor) { menor = d; mejor = i; }
  });
  return mejor;
}
function rutaPorSenderos(desde, hasta) {
  if (RED_CAMINOS.length < 2) return [desde, hasta];
  const inicio = indiceCercano(desde), fin = indiceCercano(hasta);
  if (inicio < 0 || fin < 0) return [desde, hasta];
  const dist = RED_CAMINOS.map(() => Infinity);
  const prev = RED_CAMINOS.map(() => null);
  const visitado = new Set();
  dist[inicio] = 0;
  while (visitado.size < RED_CAMINOS.length) {
    let actual = -1, menor = Infinity;
    for (let i = 0; i < dist.length; i++) {
      if (!visitado.has(i) && dist[i] < menor) { menor = dist[i]; actual = i; }
    }
    if (actual < 0 || !Number.isFinite(menor)) break;
    if (actual === fin) break;
    visitado.add(actual);
    for (const v of RED_CAMINOS[actual].vecinos) {
      if (v.tramo && estaBloqueado(v.tramo)) continue;
      const alternativa = dist[actual] + v.w;
      if (alternativa < dist[v.i]) { dist[v.i] = alternativa; prev[v.i] = actual; }
    }
  }
  if (!Number.isFinite(dist[fin])) return [desde, hasta];
  const puntos = [];
  for (let at = fin; at !== null && at !== undefined; at = prev[at]) {
    puntos.unshift({ x: RED_CAMINOS[at].x, y: RED_CAMINOS[at].y });
  }
  return [desde, ...puntos, hasta];
}
function rutaHaciaPunto(desde, hasta) {
  const candidatos = [
    GENERADOR_RUTAS.fn,
    window.generarRuta,
    window.generarRutaHacia,
    window.rutas && window.rutas.generar,
  ];
  for (const fn of candidatos) {
    if (typeof fn !== 'function') continue;
    let resultado = null;
    try {
      resultado = fn({ desde: { ...desde }, hasta: { ...hasta } });
    } catch (e) {
      try { resultado = fn({ ...desde }, { ...hasta }); } catch (e2) { resultado = null; }
    }
    const puntos = Array.isArray(resultado)
      ? resultado
      : (resultado && (resultado.puntos || resultado.points));
    if (Array.isArray(puntos) && puntos.length >= 2 &&
        puntos.every((q) => Number.isFinite(q.x) && Number.isFinite(q.y))) {
      return puntos.map((q) => ({ x: q.x, y: q.y }));
    }
  }
  /* El grafo de Danko (mejorRuta/GRAFO) es la fuente preferida: la ruta de
     ayuda usa exactamente los mismos senderos que la ruta a edificios. */
  if (typeof mejorRuta === 'function' && typeof GRAFO !== 'undefined' && GRAFO.nodos.length) {
    let destino = -1, menor = Infinity;
    GRAFO.nodos.forEach((n, i) => {
      const d = Math.hypot(n.x - hasta.x, n.y - hasta.y);
      if (d < menor) { menor = d; destino = i; }
    });
    if (destino >= 0) {
      const r = mejorRuta(destino);
      if (r && Array.isArray(r.puntos) && r.puntos.length) {
        return [{ x: desde.x, y: desde.y }]
          .concat(r.puntos.map((q) => ({ x: q.x, y: q.y })))
          .concat([{ x: hasta.x, y: hasta.y }]);
      }
    }
  }
  return rutaPorSenderos(desde, hasta);
}
window.registrarGeneradorRutas = (fn) => {
  if (typeof fn === 'function') GENERADOR_RUTAS.fn = fn;
};
function pintarRutaAyuda() {
  const capa = $('rutaLayer');
  if (!capa) return;
  capa.textContent = '';
  if (!RUTA_AYUDA.activa || RUTA_AYUDA.puntos.length < 2) return;
  const NS = 'http://www.w3.org/2000/svg';
  const linea = document.createElementNS(NS, 'polyline');
  linea.setAttribute('points', RUTA_AYUDA.puntos.map((q) => q.x + ',' + q.y).join(' '));
  linea.setAttribute('fill', 'none');
  linea.setAttribute('stroke', '#b91c1c');
  linea.setAttribute('stroke-width', Math.max(4, 12 / z));
  linea.setAttribute('stroke-linecap', 'round');
  linea.setAttribute('stroke-linejoin', 'round');
  linea.setAttribute('stroke-dasharray', (18 / z) + ' ' + (10 / z));
  const titulo = document.createElementNS(NS, 'title');
  titulo.textContent = 'Ruta para ir a ayudar a ' + RUTA_AYUDA.id;
  linea.appendChild(titulo);
  capa.appendChild(linea);
}
function limpiarRutaAyuda() {
  RUTA_AYUDA.activa = false;
  RUTA_AYUDA.id = null;
  RUTA_AYUDA.puntos = [];
  pintarRutaAyuda();
}
function objetivoAyudaMasCercano() {
  let mejor = null, menor = Infinity;
  AYUDA.pidiendo.forEach((a) => {
    const d = Math.hypot(a.x - dot.x, a.y - dot.y);
    if (d < menor) { menor = d; mejor = a; }
  });
  return mejor;
}
function generarRutaAyuda() {
  if (PRESENCIA.rol !== 'vidente') return;
  const objetivo = objetivoAyudaMasCercano();
  if (!objetivo) return;
  RUTA_AYUDA.activa = true;
  RUTA_AYUDA.id = objetivo.id;
  RUTA_AYUDA.puntos = rutaHaciaPunto({ x: dot.x, y: dot.y }, { x: objetivo.x, y: objetivo.y });
  pintarRutaAyuda();
  actualizarAyudaBanner();
  announce('Ruta generada hacia ' + objetivo.id + '. ' +
    direccionHacia(objetivo.x, objetivo.y) + '. Sigue la línea roja.');
}
function recalcularRutaAyuda() {
  if (!RUTA_AYUDA.activa) return;
  const objetivo = AYUDA.pidiendo.get(RUTA_AYUDA.id);
  if (!objetivo) { limpiarRutaAyuda(); return; }
  RUTA_AYUDA.puntos = rutaHaciaPunto({ x: dot.x, y: dot.y }, { x: objetivo.x, y: objetivo.y });
  pintarRutaAyuda();
}

function direccionHacia(x, y) {
  const dx = x - dot.x, dy = y - dot.y, dist = Math.hypot(dx, dy);
  if (dist < 40) return 'junto a ti';
  const ang = (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;
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
/* Aviso sonoro para la persona vidente: un solo disparo por pedido nuevo,
   sin repetición. Si el navegador bloquea el autoplay, el aviso visual y el
   anuncio para lectores de pantalla siguen funcionando igual. */
function reproducirJingleAyuda() {
  const audio = $('jingleAyuda');
  if (!audio) return;
  audio.loop = false;
  try { audio.currentTime = 0; } catch (e) {}
  const promesa = audio.play();
  if (promesa && typeof promesa.catch === 'function') promesa.catch(() => {});
}
function recibirAyuda(mensaje) {
  if (!mensaje || !mensaje.id || mensaje.id === PRESENCIA.id) return;
  const id = String(mensaje.id).slice(0, 12);
  if (!mensaje.activo) {
    if (AYUDA.pidiendo.delete(id)) {
      if (RUTA_AYUDA.id === id) limpiarRutaAyuda();
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
    if (eraNueva) {
      reproducirJingleAyuda();
      announce('Petición de ayuda de ' + id + '. ' + direccionHacia(AYUDA.pidiendo.get(id).x, AYUDA.pidiendo.get(id).y) + '.');
    }
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
  const texto = $('ayudaTexto');
  const boton = $('btnIrAyuda');
  if (!banner || !texto || !boton) return;
  boton.classList.add('hidden');
  if (PRESENCIA.rol === 'no-vidente' && AYUDA.activo) {
    banner.classList.remove('hidden');
    banner.classList.remove('bg-red-700');
    banner.classList.add('bg-purple-800');
    texto.textContent = 'Tu petición de ayuda está activa. Los videntes pueden verte.';
    return;
  }
  if (PRESENCIA.rol !== 'vidente' || AYUDA.pidiendo.size === 0) {
    banner.classList.add('hidden');
    return;
  }
  banner.classList.remove('hidden');
  banner.classList.remove('bg-purple-800');
  banner.classList.add('bg-red-700');
  banner.classList.add('items-center');
  const lista = [...AYUDA.pidiendo.values()]
    .map((a) => a.id + ' ' + direccionHacia(a.x, a.y))
    .join(' · ');
  texto.textContent = RUTA_AYUDA.activa
    ? 'Ruta hacia ' + RUTA_AYUDA.id + ': ' + lista
    : 'Pedido de ayuda: ' + lista;
  boton.classList.remove('hidden');
  boton.textContent = RUTA_AYUDA.activa ? 'Ver ruta' : 'Ir a ayudar';
}
$('btnIrAyuda')?.addEventListener('click', generarRutaAyuda);

/* ---------- Botones de reporte de incidencias (solo videntes) ---------- */
$('btnIncidencia').onclick = () => alternarModoIncidencias();
$('incCancelar').onclick = cerrarDialogoIncidencia;
$('incConfirmar').onclick = confirmarIncidencia;
$('incLevantar').onclick = levantarIncidencia;
$('incTipos').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-tipo]');
  if (!b) return;
  INCIDENCIAS.tipo = b.dataset.tipo;
  actualizarDialogoIncidencia();
});
document.addEventListener('click', (e) => {
  if (!$('incidenciaDialog').classList.contains('flex')) return;
  const t = e.target;
  if (t && typeof t.closest === 'function' && t.closest('#incidenciaDialog')) return;
  cerrarDialogoIncidencia();
});
window.setAyuda = (activo) => {
  const nuevo = !!activo;
  if (nuevo === AYUDA.activo) return;
  AYUDA.activo = nuevo;
  if (!nuevo) limpiarRutaAyuda();
  publicarAyuda(true);
  actualizarAyudaBanner();
  if (nuevo) announce('Petición de ayuda enviada a las personas videntes.');
  else announce('Petición de ayuda cancelada.');
};

function recibirPresencia(mensaje) {
  if (!mensaje || mensaje.id === PRESENCIA.id) return;
  const observador = mensaje.id;
  const conGeo = Number.isFinite(mensaje.lat) && Number.isFinite(mensaje.lng);
  PRESENCIA.roles.set(observador, mensaje.rol);
  const mapa = PRESENCIA.observaciones.get(observador) || new Map();
  if (conGeo) {
    mapa.set(observador, {
      lat: mensaje.lat,
      lng: mensaje.lng,
      acc: Number.isFinite(mensaje.acc) ? mensaje.acc : 15,
      propio: true,
      ts: mensaje.ts || Date.now(),
    });
  }
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
      x: Number.isFinite(mensaje.x) ? mensaje.x : dot.x,
      y: Number.isFinite(mensaje.y) ? mensaje.y : dot.y,
      lat: conGeo ? mensaje.lat : null,
      lng: conGeo ? mensaje.lng : null,
      acc: Number.isFinite(mensaje.acc) ? mensaje.acc : 15,
      accFus: Number.isFinite(mensaje.acc) ? mensaje.acc : 15,
      n: 1,
      edificio: null,
      /* Hora de recepción, no del otro celular: un reloj desfasado no debe
         hacer que el par aparezca como “sin señal” apenas entra. */
      ts: Date.now(),
      estale: false,
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
    /* Si el celular del par se queda sin señal, lo dejamos en el mapa como
       “última señal” en vez de borrarlo: vale más una posición vieja y
       claramente marcada que hacer desaparecer a la persona. */
    const ageS = Math.max(0, Math.round((Date.now() - (p.ts || Date.now())) / 1000));
    const estale = ageS > 12;
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
      halo.setAttribute('stroke', estale ? '#64748b' : '#7c3aed');
      halo.setAttribute('stroke-width', 2 / z);
      halo.setAttribute('stroke-dasharray', (5 / z) + ' ' + (4 / z));
      halo.setAttribute('opacity', estale ? '.25' : '.6');
      capa.appendChild(halo);
    }
    const circulo = document.createElementNS(NS, 'circle');
    circulo.setAttribute('cx', p.x);
    circulo.setAttribute('cy', p.y);
    circulo.setAttribute('r', 12 / z);
    circulo.setAttribute('fill', estale ? '#94a3b8' : '#7c3aed');
    circulo.setAttribute('stroke', '#ffffff');
    circulo.setAttribute('stroke-width', 4 / z);
    circulo.setAttribute('opacity', estale ? '.7' : '1');
    const texto = document.createElementNS(NS, 'text');
    texto.setAttribute('x', p.x);
    texto.setAttribute('y', p.y - 20 / z);
    texto.setAttribute('text-anchor', 'middle');
    texto.setAttribute('font-size', 14 / z);
    texto.setAttribute('font-weight', '800');
    texto.setAttribute('fill', estale ? '#475569' : '#4c1d95');
    const yoFus = PRESENCIA.filtro.get(PRESENCIA.id);
    /* Haversine sobre lat/lng: así el error del ancla de cada dispositivo
       no se suma a la distancia que se le muestra al vidente. */
    const dist = yoFus && Number.isFinite(p.lat) && Number.isFinite(p.lng)
      ? Math.round(distM(yoFus, p))
      : Math.round(Math.hypot(p.x - dot.x, p.y - dot.y) * METROS_POR_PIXEL);
    texto.textContent = p.etiqueta + (estale
      ? ' · última señal hace ' + ageS + ' s'
      : (z >= 2 ? ' · ' + dist + ' m' : '') +
        (p.n > 1 ? ' · ' + p.n + ' señales' : ''));
    capa.appendChild(circulo);
    capa.appendChild(texto);
  });
}
function actualizarPresencia() {
  const badge = $('presenceBadge');
  if (!badge) return;
  const visibles = paresVisibles();
  const n = visibles.filter((p) => !p.estale).length;
  const e = visibles.length - n;
  badge.style.display = PRESENCIA.rol === 'vidente' ? 'block' : 'none';
  badge.classList.toggle('sin-conexion', !PRESENCIA.conectado);
  let texto = n + ' no vidente' + (n === 1 ? '' : 's') + ' conectada' + (n === 1 ? '' : 's');
  if (e) texto += ' · ' + e + ' con última señal';
  badge.textContent = PRESENCIA.conectado
    ? texto
    : 'Presencia sin conexión' + (visibles.length ? ' · ' + visibles.length + ' en el mapa' : '');
  if (PRESENCIA.rol === 'vidente' && n !== PRESENCIA.ultimoAnuncio) {
    PRESENCIA.ultimoAnuncio = n;
    announce(n + ' persona' + (n === 1 ? '' : 's') + ' no vidente' + (n === 1 ? '' : 's') +
      ' conectada' + (n === 1 ? '' : 's') + ' en el mapa.' +
      (e ? ' ' + e + ' con última señal.' : ''));
  }
}
function configurarPresencia(rol) {
  PRESENCIA.rol = rol;
  PRESENCIA.x = dot.x;
  PRESENCIA.y = dot.y;
  if (!INCIDENCIAS.cargadas) {
    cargarIncidenciasLocales();
    INCIDENCIAS.cargadas = true;
  }
  if (!PRESENCIA.socket && !PRESENCIA.reintento) mqttConectar();
  publicarPresencia(true);
  pintarPares();
  actualizarPresencia();
  pintarIncidencias();
}
/* Expirar pares que dejan de emitir y mantener vivo el canal MQTT. */
setInterval(() => {
  publicarAyuda();
  const antesAyuda = AYUDA.pidiendo.size;
  for (const [id, a] of AYUDA.pidiendo) {
    if (Date.now() - a.ts > 12000) {
      AYUDA.pidiendo.delete(id);
      if (RUTA_AYUDA.id === id) limpiarRutaAyuda();
    }
  }
  if (AYUDA.pidiendo.size !== antesAyuda) { pintarAyudas(); actualizarAyudaBanner(); }
  let expiraron = false;
  for (const [clave, inc] of INCIDENCIAS.activas) {
    if (Date.now() - inc.ts > INCIDENCIA_TTL) {
      INCIDENCIAS.activas.delete(clave);
      INCIDENCIAS.locales.delete(clave);
      expiraron = true;
    }
  }
  if (expiraron) {
    guardarIncidenciasLocales();
    trasCambioIncidencias('Un reporte de incidencia expiró.', false);
  }
  const antes = PRESENCIA.pares.size;
  const antesEstale = [...PRESENCIA.pares.values()].filter((p) => p.estale).length;
  for (const [id, p] of PRESENCIA.pares) {
    const age = Date.now() - (p.ts || Date.now());
    /* 12 s sin señal deja de contar como “conectado”, pero el marcador sigue
       visible hasta 2 min como última posición conocida. */
    if (age > 120000) PRESENCIA.pares.delete(id);
    else p.estale = age > 12000;
  }
  const despuesEstale = [...PRESENCIA.pares.values()].filter((p) => p.estale).length;
  if (PRESENCIA.pares.size !== antes || despuesEstale !== antesEstale) {
    actualizarPresencia();
  }
  pintarPares();
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
  if (PRESENCIA.socket && PRESENCIA.socket.readyState === 1) {
    publicarPresencia(true);
    publicarAyuda(true);
  }
}, 2000);
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
  limpiarRutaAyuda();
  document.body.dataset.modo = modo;
  if (modo === 'no-vidente') {
    autoVoice = true;
    try { localStorage.setItem('autoVoice', 'on'); } catch (e) {}
    voiceLabel();
  } else {
    autoVoice = false;
    try { localStorage.setItem('autoVoice', 'off'); } catch (e) {}
    voiceLabel();
    ocultarFlechasCiego();
    announce('Modo vidente. Toca un edificio para ver la ruta.');
  }
  configurarPresencia(modo);
  if (modo === 'no-vidente' && INCIDENCIAS.modo) alternarModoIncidencias(false);
  if (modo === 'no-vidente') {
    if (inside) exitBuilding();
    /* Arrancamos con el edificio más cercano al punto azul. Las flechas cambian
       la selección y cualquier otro toque confirma y genera la ruta. */
    selected = edificioMasCercano();
    select(selected, { silent: true, ciego: true });
    mostrarFlechasCiego(true);
  }
}
window.setModo = aplicarModo;

/* ---------- GPS: puente con la app Expo ----------
   App.tsx ancla el primer fix al centro del plano (690, 500) y envía
   { type:'position', x, y } como desplazamientos relativos desde ahí.
   Movemos el punto azul y, si hay una ruta activa, actualizamos el tramo
   restante y el próximo giro sin volver a seleccionar el edificio. */
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
  pintarPares();
  verificarInteriorAuto();
  publicarPresencia();
  publicarAyuda();
  pintarAyudas();
  recalcularRutaAyuda();
  actualizarAyudaBanner();
  placeDot();
  actualizarInteriorDot();
  /* Centramos la vista en el punto sin anunciar ni volver a seleccionar nada. */
  centerOn(x, y);
  if (!selected) return;
  const i = info(selected);
  $('sheetDir').textContent = i.dir;
  $('sheetWhere').textContent = i.where;
  /* Con la navegación activa, el punto azul avanza por el camino dibujado. */
  if (navegacion) actualizarNavegacion();
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
    if (data && data.type === 'salirInterior') salirInterior();
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
/* Cerrar al tocar el mapa fuera del panel. Solo cerramos si el toque cayó en el
   visor; así cualquier punto de los botones (incluidos sus iconos) ejecuta su
   acción y nunca se interpreta como "fuera del panel". Tocar un edificio cambia
   la selección en lugar de cerrar. */
document.addEventListener('click', (e) => {
  if (elegirCiego || !selected || $('sheet').classList.contains('hidden') || justDragged || inside) return;
  const t = e.target;
  if (!t || typeof t.closest !== 'function') return;
  if (!t.closest('#viewport') || t.closest('#buildings')) return;
  closeSheet();
});
/* Modo no vidente: las flechas cambian el edificio; tocar cualquier otro punto
   confirma ese edificio y arranca la navegación guiada por voz. */
$('ciegoPrev').onclick = () => step(-1);
$('ciegoNext').onclick = () => step(1);
document.addEventListener('click', (e) => {
  if (!esCiego() || !elegirCiego || justDragged || inside) return;
  const t = e.target;
  if (t && typeof t.closest === 'function' &&
      (t.closest('#ciego') || t.closest('#ayudaBanner'))) return;
  confirmarRutaCiego();
});
$('btnRoute').onclick = () => {
  if (navegacion) detenerRuta();
  else if (selected) generarRuta(selected);
};
$('btnPrev').onclick = () => step(-1);
$('btnNext').onclick = () => step(1);
window.addEventListener('resize', () => {
  const nb = computeBase(); z = clampZ(z * nb / baseZ); baseZ = nb; restyle();
  if (navegacion) { actualizarNavegacion({ silent: true }); return; }
  if (selected) { const i = info(selected); centerOn((dot.x + i.cx)/2, (dot.y + i.cy)/2); return; }
  [ox, oy] = clamp(ox, oy, z); apply();
});

/* ---------- Interior del edificio ----------
   Plano ESQUEMÁTICO generado: un pasillo central y salas a ambos lados.
   Cuando existan planos oficiales por edificio, reemplazar buildPlan(). */
let inside = false, room = null;
let interiorDot = null, interiorAnchor = null, interiorBase = null;
let interiorEscala = null, interiorBounds = null, interiorUltimoAnuncio = 0;
const ROOM_ON  = ['bg-white','text-[#1d4ed8]','border-[#1d4ed8]'];
const ROOM_OFF = ['bg-[#e8f1fb]','text-[#334155]','border-[#cbd2d9]'];

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
  card.className = 'absolute box-border rounded-lg border border-[#cbd2d9] bg-white';
  card.style.cssText = 'width:' + cw + 'px;height:' + ch + 'px;left:' + ((st.clientWidth - cw)/2) + 'px;top:' + ((st.clientHeight - ch)/2) + 'px;box-shadow:0 4px 14px rgba(15,23,42,.14)';
  const iw = Math.max(0, cw - 8), ih = Math.max(0, ch - 8), C = 40, g = 6, horiz = asp >= 1, rects = [];
  const corr = document.createElement('div');
  corr.className = 'absolute flex items-center justify-center bg-[#f1f5f9] text-[13px] font-bold tracking-wide text-[#64748b]';
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
  d.className = 'pointer-events-none absolute box-border h-7 w-7 rounded-full border-[3px] border-white bg-[#1d4ed8] shadow-[0_2px_8px_rgba(15,23,42,.25)]';
  d.style.cssText = 'left:' + (dx - 14) + 'px;top:' + (dy - 14) + 'px;transition:left .45s linear,top .45s linear';
  card.appendChild(d);
  interiorDot = d;
  interiorAnchor = { x: dot.x, y: dot.y };
  interiorBase = { left: dx - 14, top: dy - 14 };
  interiorEscala = { x: cw / Math.max(1, w), y: ch / Math.max(1, h) };
  interiorBounds = { w: cw, h: ch };
  interiorUltimoAnuncio = 0;
  st.appendChild(card);
  roomInfo();
}
function actualizarInteriorDot() {
  if (!inside || !interiorDot || !interiorAnchor || !interiorBase || !interiorEscala || !interiorBounds) return;
  const x = interiorBase.left + (dot.x - interiorAnchor.x) * interiorEscala.x;
  const y = interiorBase.top + (dot.y - interiorAnchor.y) * interiorEscala.y;
  interiorDot.style.left = Math.min(interiorBounds.w - 28, Math.max(0, x)) + 'px';
  interiorDot.style.top = Math.min(interiorBounds.h - 28, Math.max(0, y)) + 'px';
  const dist = Math.hypot(dot.x - interiorAnchor.x, dot.y - interiorAnchor.y) * METROS_POR_PIXEL;
  if (dist >= interiorUltimoAnuncio + 10) {
    interiorUltimoAnuncio = dist;
    announce('Dentro del edificio ' + selected + ': a ' + Math.round(dist) + ' metros del punto de entrada.');
  }
}
function enterBuilding() {
  if (!selected) return;
  const [id, cx, cy, w, h] = BUILDINGS.find(b => b[0] === selected);
  inside = true;
  notificarInterior(true);
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
  interiorDot = null; interiorAnchor = null; interiorBase = null;
  interiorEscala = null; interiorBounds = null; interiorUltimoAnuncio = 0;
  const el = $('interior'); el.classList.add('hidden'); el.classList.remove('flex');
  select(selected, { silent: true });
  $('btnRoute').focus();
  announce('Has salido del interior. Información del edificio ' + selected + '.');
  notificarInterior(false);
}
function salirInterior() {
  AUTO_INTERIOR.activo = false;
  AUTO_INTERIOR.dentro = 0;
  AUTO_INTERIOR.bloqueo = Date.now() + 15000;
  exitBuilding();
}
$('inExit').onclick = salirInterior;
$('inMapa').onclick = salirInterior;
$('inSpeak').onclick = () => {
  const texto = $('inRoom').textContent + '. ' + $('inNote').textContent;
  say(texto); announce(texto);
};

/* Teclado: flechas para recorrer, Escape para salir y foco atrapado en el diálogo. */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if ($('incidenciaDialog').classList.contains('flex')) cerrarDialogoIncidencia();
    else if (inside) exitBuilding();
    else if (selected && !esCiego()) closeSheet();
    return;
  }
  if ($('incidenciaDialog').classList.contains('flex')) return;
  if (!inside) {
    /* En modo no vidente, Enter o Espacio fuera de las flechas confirman. */
    if (esCiego() && elegirCiego && (e.key === 'Enter' || e.key === ' ')) {
      const t = e.target;
      if (!(t && typeof t.closest === 'function' && t.closest('#ciego'))) {
        e.preventDefault(); confirmarRutaCiego(); return;
      }
    }
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

/* Cuando el plano se abre suelto en el navegador no hay app Expo que envíe
   { type:'modo' }, así que el modo se toma de la URL (y por defecto es vidente).
   Dentro del iframe de la app se respeta el mensaje de la portada. */
try {
  if (window.parent === window) {
    const modoUrl = new URLSearchParams(location.search).get('modo');
    aplicarModo(modoUrl === 'no-vidente' ? 'no-vidente' : 'vidente');
  }
} catch (e) {}
</script>
</body>
</html>
`
