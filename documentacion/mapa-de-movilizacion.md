# Mapa de movilización — propuesta

**Estado:** propuesta inicial  
**Fecha:** 2026-11-21  
**Ámbito:** documentación del proyecto

## 1. Idea general

Se propone desarrollar un **mapa de movilización** que permita planificar, visualizar y coordinar acciones de movilización de manera clara, por capas y accesible para personas con problemas de visión.

La herramienta combina información geográfica con datos operativos (zonas, rutas, puntos de encuentro, recursos y equipos), organizados en capas que se pueden activar o desactivar según el objetivo de cada usuario.

## 2. Objetivos

- Representar territorialmente la movilización de forma comprensible y navegable.
- Permitir leer el mapa **por capas**, separando la información crítica del contexto.
- Garantizar el acceso a personas con discapacidad visual mediante interfaces alternativas al uso exclusivo del ratón y del color.
- Facilitar la toma de decisiones con información actualizada y jerarquizada.

## 3. Enfoque por capas

El mapa se organiza como un conjunto de capas superpuestas. Cada capa responde a una pregunta concreta y puede activarse de forma independiente.

| Capa | Contenido | Pregunta que responde |
| --- | --- | --- |
| **Base** | Calles, barrios, límites, referencias geográficas | ¿Dónde estamos? |
| **Zonas** | Áreas de influencia, sectores asignados, radios de acción | ¿Qué territorios cubrimos? |
| **Rutas** | Recorridos, ejes de desplazamiento, alternativas | ¿Cómo nos movemos? |
| **Puntos** | Puntos de encuentro, centros de coordinación, lugares de apoyo | ¿Dónde nos concentramos? |
| **Recursos** | Equipos, vehículos, materiales, voluntarios disponibles | ¿Con qué contamos? |
| **Tiempos** | Franjas horarias, hitos, ventanas de oportunidad | ¿Cuándo sucede? |
| **Alertas** | Incidencias, cortes, cambios de última hora | ¿Qué está pasando ahora? |
| **Accesibilidad** | Accesos adaptados, obstáculos, señalización sonora/táctil | ¿Cómo se recorre de forma accesible? |

Cada capa debe poder:

- Activarse/desactivarse sin perder el contexto de las demás.
- Definir un **nivel de prioridad** para lectores de pantalla.
- Exponer su información en formato textual equivalente.
- Ser exportable por separado (por ejemplo, a `GeoJSON`, CSV o un resumen en audio).

## 4. Herramientas de accesibilidad visual

El diseño no puede depender solo del color ni de la vista. Se contemplan las siguientes herramientas y criterios:

### 4.1 Navegación

- Navegación completa por **teclado** (Tab, flechas, Enter, Escape).
- Atajos de teclado para cambiar de capa, acercar/alejar y leer el punto actual.
- Orden de lectura lógico y anuncios claros al cambiar de capa.
- Compatibilidad con **lectores de pantalla** (NVDA, JAWS, VoiceOver, TalkBack).

### 4.2 Representación alternativa

- **Modo audio**: descripción hablada de la zona, la ruta o el punto seleccionado.
- **Sonificación**: tonos o patrones de audio para representar distancia, dirección o densidad.
- **Vista de lista**: el mismo contenido del mapa presentado como lista jerárquica y filtrable.
- **Resumen textual** de cada capa, generado automáticamente.
- Soporte para exportación a **Braille** o archivos `.brf` cuando sea posible.

### 4.3 Contraste y legibilidad

- Modo de **alto contraste** y tema oscuro/claro.
- No usar el color como único medio para distinguir capas: combinar con **formas, patrones, líneas y etiquetas**.
- Tamaños de texto y controles ajustables (zoom de interfaz, no solo del mapa).
- Etiquetas con texto descriptivo, nunca solo iconos sin `alt` o `aria-label`.

### 4.4 Interacción inclusiva

- Zonas táctiles grandes y separación suficiente entre controles.
- Indicadores de foco visibles y anunciados por el lector de pantalla.
- Mensajes de error y confirmación comprensibles en texto y audio.
- Posibilidad de usar comandos de voz para acciones frecuentes (cambiar capa, leer ubicación).

## 5. Arquitectura propuesta (borrador)

```text
[ Fuentes de datos ]
   ├── Calles / territorios  → capa Base
   ├── Sectores              → capa Zonas
   ├── Recorridos            → capa Rutas
   ├── Puntos de interés     → capa Puntos
   ├── Inventario            → capa Recursos
   ├── Cronograma            → capa Tiempos
   └── Reportes en vivo      → capa Alertas
            │
            ▼
[ Capa de datos geoespaciales ]
   GeoJSON / API / archivos locales
            │
            ▼
[ Motor de mapas accesible ]
   ├── Vista visual (mapa + capas)
   ├── Vista lista (equivalente textual)
   ├── Vista audio (descripciones + sonificación)
   └── Adaptador de lector de pantalla (ARIA)
            │
            ▼
[ Usuarios ]
   Gestores, equipos de campo, personas con discapacidad visual
```

## 6. Flujo de uso sugerido

1. El usuario ingresa y escucha/lee el resumen general del mapa.
2. Elige una capa desde el panel (visual, teclado o voz).
3. El sistema anuncia qué capa se activó y cuántos elementos contiene.
4. El usuario recorre los elementos con flechas o comandos de voz.
5. Al seleccionar un elemento, se muestra/lee su ficha: nombre, ubicación, estado y acciones disponibles.
6. El usuario puede alternar entre vista mapa, lista y audio sin perder su posición.

## 7. Criterios de aceptación

- [ ] Todas las capas pueden activarse y desactivarse de forma independiente.
- [ ] Cada elemento del mapa tiene una descripción textual equivalente.
- [ ] El recorrido completo es posible usando solo el teclado.
- [ ] La información clave no depende exclusivamente del color.
- [ ] Existe un resumen hablado o textual de cada capa.
- [ ] El mapa es usable con al menos un lector de pantalla principal.
- [ ] Los cambios de capa se anuncian al usuario.
- [ ] Se puede exportar el estado actual a un formato no visual.

## 8. Próximos pasos

1. Definir el caso de uso concreto y el territorio de ejemplo.
2. Elegir la tecnología base del mapa (librería visual + capa de accesibilidad).
3. Modelar las capas y sus atributos mínimos.
4. Construir un prototipo de baja fidelidad de la vista por capas.
5. Validar el prototipo con personas usuarias reales, incluyendo personas con discapacidad visual.
6. Documentar los patrones de accesibilidad resultantes para reutilizarlos en el proyecto.

## 9. Notas abiertas

- ¿La movilización es urbana, regional o remota? Esto define la capa Base.
- ¿Los datos serán estáticos o en tiempo real? Esto define la capa Alertas.
- ¿Se necesita soporte offline para trabajo de campo?
- ¿Qué idiomas debe soportar la interfaz y las descripciones de audio?

---

**Ideas relacionadas:** [Sistema Descentralizado de Localización Relativa en Campus Universitario](ideas/localizacion-relativa-campus.md) — propuesta para complementar el GPS con posiciones relativas entre nodos, altura/pisos y detección robusta de entrada.

Este documento es una propuesta inicial y debe evolucionar con el feedback del equipo y de las personas usuarias.
