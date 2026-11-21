# Sistema Descentralizado de Localización Relativa en Campus Universitario

> **Estado:** propuesta / RFC. No está implementada.
> **Fecha:** 2026-11-21.
> **Relación con el repo:** extiende el módulo de GPS de `backend/src` y el mapa de `front/` sin cambiar sus contratos públicos.

---

## 1. Resumen del problema y enfoque descentralizado

### 1.1 Problema

El posicionamiento satelital es una mala referencia principal dentro de un campus:

- **Degrada cerca de edificios y muros.** El rebote y la pérdida de línea de vista con los satélites generan saltos de varios metros justo donde más importa: entradas, patios interiores y corredores.
- **No entrega distancias fiables entre personas.** Dos dispositivos con una precisión individual de ±10–30 m pueden estar en el mismo pasillo o en edificios distintos y el GPS no permite distinguirlo.
- **La coordenada vertical es ambigua.** Latitud y longitud no dicen si una persona está en el primer piso o en el cuarto, lo que produce falsos avisos de proximidad entre niveles distintos.
- **La detección de entrada es frágil.** Una sola muestra con ruido puede disparar una alerta de "entró a la zona" o "salió del camino" que después se contradice.

Hoy el repo mitiga parte de esto con `MovementSample.accuracyM` / `isAccurate`, ventanas de cooldown en `SafetyMonitor` y geofences, pero la **referencia sigue siendo absoluta y satelital**.

### 1.2 Enfoque propuesto

Pasar de preguntar *"¿dónde estoy según el satélite?"* a preguntar *"¿a qué distancia y dirección estoy de los nodos y referencias que tengo cerca?"*.

La referencia principal pasa a ser un **grafo local de posiciones relativas**:

- Cada dispositivo es un **nodo** que estima distancias y rumbos hacia otros nodos cercanos y hacia **anclas** del campus.
- No existe un servidor central obligatorio: el cálculo ocurre en cada dispositivo con los datos mínimos que recibe.
- El GPS no desaparece; pasa a ser **una ancla opcional y filtrada** para exterior, no la fuente de verdad en interiores.

Objetivos:

1. Estimar proximidad y distancia relativa entre dispositivos del mismo campus.
2. Corregir la estimación con nodos observadores cuando hay ruido o baja señal.
3. Diferenciar pisos/niveles para evitar falsos positivos de proximidad vertical.
4. Confirmar entradas y salidas con ventanas temporales, histéresis y multi-muestra.
5. Mantener la privacidad por diseño: identificadores efímeros y datos mínimos.

No objetivos:

- Reemplazar al GPS fuera del campus.
- Precisión centimétrica.
- Construir un sistema de vigilancia ni un registro central de personas.

---

## 2. Arquitectura conceptual

### 2.1 Capas

| Capa | Responsabilidad | Entradas típicas |
| --- | --- | --- |
| 1. Captura | Obtener observaciones crudas y marcar su calidad | BLE RSSI, Wi-Fi RTT, UWB (si existe), barómetro, IMU, GPS filtrado |
| 2. Estimación local | Convertir observaciones en distancias/rumbos con confianza | Muestras de la capa 1 |
| 3. Grafo de confianza | Representar nodos, anclas y pesos según calidad | Estimaciones locales |
| 4. Relajación / fusión | Resolver el grafo y mantener coherencia espacial | Grafo + anclas + modelo de movimiento |
| 5. Salida | Alimentar mapa, estadísticas y alertas existentes | Posición relativa + nivel + confianza |

```text
  sensores locales ──► estimación ──► grafo ──► fusión ──► adaptador
        │                  │           │         │            │
     BLE/Wi-Fi/UWB      distancia   nodos y   posición   MovementSample
     barómetro/IMU      + confianza  anclas    relativa   + SafetyAlert
     GPS (ancla)
```

Punto de integración con el código actual: la capa 5 puede ser un **adaptador** que emita la misma forma que `MovementSample` (`latitude`, `longitude`, `accuracyM`, `isAccurate`, `timestamp`) o un tipo nuevo `RelativeFix` que se convierta antes de llegar a `front/App.tsx`. Así el mapa y las alertas no tienen que conocer la tecnología de proximidad usada.

### 2.2 Flujo conceptual de funcionamiento

#### a) Descubrimiento y medición entre pares (P2P)

1. Cada dispositivo anuncia un **identificador rotativo** por BLE (o tecnología equivalente) durante ventanas cortas.
2. Los dispositivos cercanos miden la señal recibida (RSSI) y/o tiempo de vuelo (UWB / Wi-Fi RTT cuando está disponible).
3. Se calcula una **distancia estimada con intervalo de confianza**, no un número único: por ejemplo `4–7 m, confianza media`.
4. El resultado se guarda como arista del grafo con un peso inverso a la incertidumbre.

La medición se repite a frecuencia adaptativa: más alta cuando hay movimiento o cercanía; más baja cuando el nodo está quieto.

#### b) Nodos observadores / "videntes"

Un **nodo vidente** es un dispositivo con mejor visibilidad o mejor calidad de señal que sus vecinos (por ejemplo, alguien en un pasillo despejado frente a alguien entre muros).

- El vidente comparte su estimación corregida con los nodos cercanos.
- Los vecinos la usan como **observación adicional**, no como verdad absoluta.
- Si dos videntes discrepan, el grafo conserva ambas aristas y la fusión decide según confianza y coherencia con el resto del grafo.

Esto permite que un nodo con GPS degradado se apoye en otro que ve mejor, sin depender de un servidor.

#### c) Altura / pisos

La componente vertical se trata como una dimensión separada:

- **Barómetro:** estima cambio de presión → cambio de altura relativa. Requiere calibración al inicio y deriva con el tiempo.
- **Referencias de nivel:** balizas o zonas conocidas ("planta baja", "primer piso") corrigen la deriva.
- **IMU:** detecta escaleras o ascensores por patrón de aceleración y falta de desplazamiento horizontal.

Regla práctica: dos nodos solo se consideran "cerca" si su diferencia de nivel estimada está por debajo de un umbral (por ejemplo, medio piso). Esto evita el falso positivo clásico: dos personas separadas por una losa, con la misma lat/long.

#### d) Detección robusta de entrada y salida

Para no disparar alertas por fluctuaciones puntuales:

- **Ventana deslizante:** se exigen `N` muestras favorables de las últimas `M` antes de confirmar el cambio de estado.
- **Histéresis:** umbral de entrada distinto del umbral de salida. Ejemplo: entrar si distancia < 4 m durante 3 muestras; salir solo si distancia > 6 m durante 5 muestras.
- **Tiempo de permanencia (*dwell time*):** el cambio de estado debe sostenerse al menos 1–2 s.
- **Confirmación multi-muestra:** la alerta solo se publica si coinciden al menos dos fuentes (por ejemplo, proximidad + ancla Wi-Fi conocida).

Este bloque encaja naturalmente antes de `SafetyMonitor.evaluate(sample)`, reutilizando el cooldown ya existente en `backend/src/safety.ts`.

### 2.3 Datos mínimos compartidos

| Campo | Descripción | Privacidad |
| --- | --- | --- |
| `nodeId` | Identificador rotativo, se renueva cada pocos minutos | No persistente |
| `distanceEstimateM` | Rango o distancia estimada + confianza | Solo proximidad, no ruta |
| `relativeBearingDeg` | Rumbo relativo aproximado | Opcional |
| `levelEstimate` | Nivel/piso estimado y su confianza | Sin número de aula |
| `timestamp` | Marca de tiempo local | Sin sincronización global necesaria |
| `anchorId` | Referencia local conocida (Wi-Fi/baliza) | Identifica el lugar, no a la persona |

No se comparte nombre, matrícula, historial de posiciones ni intención de movimiento.

---

## 3. Trade-offs técnicos

| Eje | Decisión propuesta | Riesgo | Mitigación |
| --- | --- | --- | --- |
| **Precisión vs. batería** | Escaneo adaptativo según movimiento y cercanía | Más escaneos = más precisión pero más consumo | Usar IMU como disparador: despertar BLE solo cuando hay movimiento o vecinos nuevos; ciclos de sueño entre ventanas |
| **RSSI vs. UWB / Wi-Fi RTT** | Empezar con RSSI por disponibilidad; diseñar interfaz para cambiar de sensor | RSSI es ruidoso y sufre multicamino | Trabajar con rangos y tendencias, no con distancias exactas; ponderar por confianza; comparar contra anclas |
| **Ruido y multicamino** | Filtrado temporal + grafo de confianza | Rebotes en muros hacen parecer que un nodo está más lejos o más cerca | Ventanas deslizantes, mediana robusta, descartar outliers y dar menos peso a observaciones inestables |
| **Deriva** | Anclas opcionales (GPS filtrado, Wi-Fi conocido, balizas) | Sin anclas, el grafo se deforma con el tiempo | Corrección periódica contra anclas; incluir la antigüedad de la última corrección en la confianza |
| **Latencia vs. estabilidad** | Ventanas de 3–5 muestras antes de anunciar | Alertas más tardías | Diferenciar: guía visual puede actualizarse rápido; vibración/voz esperan confirmación |
| **Privacidad vs. utilidad** | IDs efímeros y datos mínimos | Rotar IDs rompe continuidad entre sesiones | Rotar en periodo corto pero mantener continuidad solo dentro de la sesión local; cero persistencia en servidor |
| **Vertical** | Barómetro + referencias de nivel | El barómetro deriva y no todos los dispositivos lo exponen | Calibración al entrar, corrección con anclas de planta, degradación elegante a "nivel desconocido" |
| **Escalabilidad** | Grafo local de vecinos, no malla completa | Muchos nodos en un pasillo saturan el canal | Limitar vecinos por distancia/confianza y agrupar observaciones redundantes |

### 3.1 Restricciones concretas del stack actual

- Expo **no expone UWB** de forma estándar; requiere módulo nativo y desarrollo con `expo-dev-client`.
- `expo-sensors` no entrega presión barométrica de forma universal; haría falta un módulo nativo (Android `TYPE_PRESSURE`, iOS `CMAltimeter`).
- BLE en Expo también requiere módulo adicional (por ejemplo `react-native-ble-plx`) y permisos en Android/iOS.
- Por esto, el prototipo inicial debe poder funcionar en modo **simulado**, inyectando distancias de prueba, antes de depender de hardware.

---

## 4. Relación con el código actual

El diseño está pensado para **no romper** lo que ya funciona:

- `backend/src/movement.ts` ya produce `MovementSample` con `accuracyM` e `isAccurate`. La nueva fuente relativa puede convertirse a ese mismo contrato.
- `backend/src/safety.ts` ya concentra alertas, zonas, rutas y cooldown. La confirmación multi-muestra se inserta antes de `evaluate()`.
- `backend/src/geojson.ts` y `movementStatsToText()` siguen siendo la salida legible/accesible.
- `front/App.tsx` convierte lat/lng → píxeles y envía `postMessage({ type: 'position', x, y })`. Un adaptador local puede alimentar el mismo mensaje con una transformación del grafo al plano.
- El punto celeste, la voz y la vibración siguen siendo la interfaz; el cambio es **la fuente de la posición**, no la interfaz.

Propuesta de nombre para el nuevo módulo: `backend/src/relative.ts`, con una interfaz del tipo:

```ts
export interface RelativeFix {
  nodeId: string        // rotativo
  distanceM: number
  confidence: number    // 0..1
  level?: number
  timestamp: number
}

export type RelativeSource = {
  subscribe(listener: (fix: RelativeFix) => void): () => void
  start(): Promise<void>
  stop(): void
}
```

---

## 5. Siguientes pasos para validar un prototipo inicial

1. **Acotar el escenario.** Tres dispositivos, un aula y un pasillo, con dos niveles si es posible. Sin depender aún de Bluetooth real: inyectar `RelativeFix` simulados.
2. **Definir métricas antes de código.**
   - Error de distancia relativa frente a cinta métrica.
   - Tasa de falsos positivos/negativos de entrada a zona.
   - Latencia entre cruce de umbral y vibración/voz.
   - Consumo de batería por minuto de escaneo.
3. **Implementar el adaptador.** Crear `backend/src/relative.ts` con `RelativeSource` y un `RelativeFix → MovementSample` para reutilizar estadísticas y alertas.
4. **Insertar la capa de confirmación.** Ventana deslizante + histéresis antes de `SafetyMonitor.evaluate()`, parametrizable por tipo de alerta.
5. **Prueba comparativa A/B.** Recorridos guiados con GPS-only vs. híbrido, registrando las cuatro métricas del punto 2. Exportar resultados a CSV/GeoJSON con `backend/src/geojson.ts`.
6. **Validación de accesibilidad.** Confirmar que la vibración, los anuncios por voz y el lector de pantalla siguen funcionando, y que no se dispara una alerta cuando la otra persona está en otro piso.
7. **Revisión de privacidad.** Verificar rotación de IDs, ausencia de persistencia y que los logs no guarden identificadores reales.
8. **Decisión de hardware.** Solo después de validar en simulado, evaluar BLE real y módulos nativos para barómetro/UWB con `expo-dev-client`.

### Criterios de aceptación sugeridos para el prototipo

- El punto del mapa nunca desaparece ni salta a otro edificio por una muestra aislada.
- Cero falsos avisos de proximidad entre niveles distintos en el escenario de prueba.
- Las alertas táctiles/verbales se disparan solo después de la confirmación multi-muestra.
- El consumidor de la API (`front/App.tsx`) no necesita cambiar su contrato de `postMessage`.

---

## 6. Preguntas abiertas

- ¿Qué tecnología de proximidad estará disponible en los dispositivos de la hackathon?
- ¿Se cuenta con planos de niveles o solo con el plano 2D actual?
- ¿Las balizas/Wi-Fi del campus tienen identificadores estables y públicos?
- ¿Se acepta un development build de Expo para módulos nativos, o la demo debe correr solo en Expo Go / web?
- ¿Cuál es el umbral de nivel aceptable para considerar "misma planta"?

---

Esta propuesta debe evolucionar con feedback del equipo y, especialmente, de las personas usuarias. Su objetivo es servir de base para decidir si el prototipo híbrido se construye sobre el módulo de GPS actual o como una fuente independiente.
