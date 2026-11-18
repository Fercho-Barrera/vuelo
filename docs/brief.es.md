# VUELO — Brief para Claude Code

> **Pégale este documento completo a Claude Code y pídele que construya la app.**
> Este brief es la especificación. Si algo no está aquí, pregunta antes de inventarlo.
> No cambies el nombre, el diseño ni el modelo freemium sin preguntar.

---

## 0. Instrucciones para Claude Code (léelas primero)

1. **Proyecto en Basecamp:** crea un proyecto nuevo en Basecamp llamado **“Vuelo — App de golf”**. Organízalo con las listas de la sección 9 (Fase 0 a Fase 10). Cada tarea de la sección 9 va como un todo en su lista, con su descripción copiada.
2. **Git personal:** crea el repositorio en la cuenta personal de GitHub de Fer (**Fercho-Barrera**), nombre del repo: **`vuelo`**. Repo privado al inicio. Rama principal `main`, ramas por feature (`feature/...`). Commits en inglés, descriptivos, un feature por commit/PR cuando aplique.
3. **No hagas nada de esto a mano fuera del proyecto:** todo el código va en el repo `vuelo`. No crees cuentas, no publiques nada, no hagas reservas reales ni pagos reales.
4. **Trabaja por fases, en orden.** Termina una fase, verifica que compile y que las pantallas se vean bien, y solo entonces sigue a la siguiente. No construyas todo de golpe.
5. **Si una decisión técnica no está en este brief, elige la opción más simple que funcione y anótala** en `DECISIONS.md` en la raíz del repo, con fecha y motivo.
6. **Idioma:** app en español (México) por defecto. Código, comentarios y commits en inglés. Documentación del repo en inglés, excepto este brief.

---

## 1. Qué es Vuelo

**Nombre:** Vuelo
**En una frase:** tu coach de golf en el bolsillo.
**Plataformas: SOLO CELULAR — iOS y Android (iPhone y Android). No hay versión web, no hay tablet, no hay desktop en el MVP ni en V2.** Todo se diseña, se graba y se usa desde el teléfono, en el campo y en el range. Si algo no funciona bien en un celular con una mano, no se lanza.

El usuario graba su swing con el celular y la app le dice qué está fallando y qué practicar, registra cómo juega ronda a ronda, y encuentra y reserva dónde jugar.

**Público inicial:** golfistas amateurs en México (CDMX y Querétaro primero), nivel principiante a intermedio, que juegan 1–4 veces al mes y quieren bajar su hándicap sin pagar un coach cada semana.

**Las 3 patas:**
1. **Coach por cámara** — análisis de swing + trazado de bola.
2. **Stats** — scorecard, strokes gained simplificado, distancias reales por palo.
3. **Clubes** — directorio con horarios, precios, amenidades y reserva de tee times.

---

## 2. Stack

- **App:** React + TypeScript con Capacitor (mismo patrón que Local Sip: React/TypeScript, Supabase, Capacitor para iOS/Android). Si Capacitor complica la cámara a 240fps, evalúa React Native y anótalo en `DECISIONS.md` — no cambies de stack sin justificarlo ahí.
- **Backend:** Supabase — Auth, Postgres, Storage (videos), Realtime donde haga falta, Edge Functions para el análisis pesado.
- **Análisis de swing:** MediaPipe Pose / pose estimation. Empezar con reglas sobre ángulos clave, no con un modelo propio desde cero.
- **Trazado de bola:** detección de objeto en video + estimación de trayectoria. Calibración con una distancia de referencia que el usuario confirma.
- **Mapas:** MapKit / Google Maps según plataforma, con datos de clubes curados a mano.
- **Pagos:** App Store + Google Play (suscripciones) y Stripe para web/reservas cuando aplique. Nada de pagos reales en desarrollo.
- **Push notifications:** ver sección 8 — es parte del producto, no un extra al final.
- **Video:** grabar a 120fps mínimo cuando el dispositivo lo permita; recorte automático del swing; cámara lenta; almacenamiento en Supabase Storage con URLs firmadas.
- **Hardware: CERO obligatorio.** El celular es el hardware. Si el usuario ya tiene hardware (sensores Arccos, Garmin, Rapsodo / launch monitor, Apple Watch), puede conectarlo / importar sus datos a Vuelo como un extra opcional en fase tardía — nunca como requisito, nunca obligatorio. Vuelo no construye ni vende hardware propio.
- **Sin trípode también funciona:** la pantalla de grabación debe funcionar con el celular apoyado / recargado en el suelo (contra la bolsa, un zapato, etc.). Guía de encuadre en vivo con vista previa, aviso si el ángulo está mal, y tolerancia en el análisis de pose para ángulos bajos. Probar el análisis con el celular en el suelo, sin trípode, antes de lanzar.

---

## 3. Diseño — Apple design + Liquid Glass (obligatorio desde el día 1)

No es un tema que se pega al final. Es el sello de la app.

- **Lenguaje visual:** iOS 26 / Liquid Glass: tarjetas de vidrio translúcido con blur, bordes suaves, reflejos sutiles, profundidad real (capas, no sombras planas), tab bar flotante de cristal, tipografía SF Pro, jerarquía grande y limpia, mucho aire, animaciones con spring.
- **Android:** mismo lenguaje (vidrio + blur) adaptado a Material, no una imitación literal de iOS.
- **Colores:** fondo claro con profundidad + verde de campo como acento principal (definir paleta exacta en Fase 1 y guardarla en el design system, no hardcodear colores en pantallas).
- **Componentes base (construir primero, reutilizar siempre):** GlassCard, GlassButton, GlassTabBar, GlassSheet (bottom sheet), PillSelector, StatRing, VideoPlayer con controles de cámara lenta.
- **Pantalla de cámara:** visor con guía de encuadre en vidrio, selector de modo en una pill flotante, botón de grabar grande y claro, resultado en tarjeta de cristal con la falla #1 arriba y el video en cámara lenta abajo.
- **Regla:** ninguna pantalla nueva sin pasar por los componentes base. Si un componente no existe, créalo primero en el design system.

---

## 4. Funcionalidades

### 4.1 Modo 1 — Mi swing (técnica)
- Grabar de frente y/o por detrás (down-the-line). La app guía la colocación del celular.
- Detección automática del swing, recorte y cámara lenta.
- Pose estimation: plano del swing, rotación de cadera/hombros, sway, cabeza, tempo, ángulo de muñeca, posición en el impacto.
- Resultado: **1–3 fallas principales en lenguaje simple + 1 drill por falla**. Ejemplo: “Tu cadera se desliza hacia el objetivo en el backswing — practica este drill 5 min antes de jugar.”
- Comparación lado a lado con tu swing anterior y con un swing modelo.
- Historial de swings con tendencia: ¿la falla se está corrigiendo o no?

### 4.2 Modo 2 — Mi bola (trayectoria + velocidad aproximada)
- Grabar el golpe apuntando a donde va la bola, no al jugador.
- La app detecta la bola, **traza la línea de su trayectoria** sobre el video y estima: distancia aproximada, tiempo de vuelo y **velocidad aproximada de salida** (distancia / tiempo).
- Mostrar siempre **“aprox.” + margen de error**. No prometer exactitud de launch monitor. La distancia depende de calibración, luz y fondo.
- La distancia alimenta las stats: distancia real por palo.

### 4.3 Modo dual — 2 cámaras a la vez (Pro)
- Dos celulares con la misma cuenta: uno graba el swing, otro graba la bola.
- Emparejar como **un solo intento**: cuerpo y trayectoria lado a lado, en el mismo timeline.
- V1 de esta función: grabar en los dos y emparejar después por timestamp. Sincronización en vivo después.
- Requisitos: misma cuenta, buena luz, soporte/trípode para el segundo celular.

### 4.4 Stats y registro de juego
- Scorecard digital por hoyo: score, putts, fairway (izq/centro/der), GIR, penalidades, palo usado. **Máximo 10 segundos por hoyo** o no sirve.
- Strokes gained simplificado: por dónde pierdes golpes — drive, approach, juego corto, putt — y qué practicar según eso.
- Distancias reales por palo (de tus rondas y del Modo 2, no del fabricante).
- Hándicap, tendencias por mes, mejores/peores hoyos, rachas.
- El plan de práctica semanal se genera desde stats + fallas de swing.

### 4.5 Clubes
- Directorio de campos en México: ubicación/mapa, precio por horario, dificultad, fotos, reseñas, amenidades (driving range, putting green, restaurante, carrito, caddie, renta de palos, clases, tienda).
- Filtros: cerca de mí, precio, dificultad, “acepta no socios / invitados”, “ideal para principiantes”.
- Tee times y reserva + pago en la app (Fase 2 con clubes piloto; en V1 la reserva puede ser por WhatsApp/teléfono del club, pero la ficha del club ya debe existir).
- Ofertas de última hora.

### 4.6 Social y retos (básico en V1, completo en Pro)
- Jugar contra amigos, leaderboard del grupo, compartir tarjeta y progreso de swing.
- Torneos y eventos del club: inscripción y resultados.

### 4.7 Coaches (fase tardía)
- Marketplace: coaches certificados ofrecen revisión de video por pago único, con voz.

---

## 5. Modelo freemium — qué es gratis y qué es Pro

**Gratis:**
- Scorecard y stats básicas, directorio de clubes, clima básico.
- 3 análisis de swing al mes (Modo 1), 2 trazados de bola al mes (Modo 2).
- Historial de las últimas 3 rondas.

**Pro Mensual — $179 MXN/mes:**
- Análisis de swing ilimitado, comparación con pros, historial completo.
- Trazado de bola y velocidad aproximada ilimitados.
- Modo dual de 2 cámaras.
- Strokes gained, plan de práctica semanal, caddie GPS, diario de práctica en el range.
- Retos y torneos entre amigos ilimitados.

**Pro Anual — $1,499 MXN/año** (~$125 MXN/mes, 2 meses gratis; ahorra $649 MXN vs. mensual):
- Todo lo de Pro Mensual, por 12 meses.
- Es el plan a empujar en la pantalla de pago: “Anual — ahorra $649 MXN al año”.
- Oferta de lanzamiento a considerar: $1,199 MXN el primer año.

**Otros ingresos (no en MVP):** comisión por reserva (la paga el club), comisión por revisión de coach, panel B2B para clubes.
**Regla:** no cobrar al usuario por reservar al inicio.

---

## 6. Modelo de datos (mínimo)

- `profiles` — id (auth), nombre, hándicap, ciudad, nivel, avatar, plan (free/pro_monthly/pro_annual), fecha de renovación.
- `swings` — id, user_id, modo (swing/ball/dual), video_url, ángulo (face-on/down-the-line), fallas detectadas (JSON), drill asignado, fecha, club_usado.
- `ball_traces` — id, swing_id, distancia_aprox_m, tiempo_vuelo_s, velocidad_aprox_kmh, margen_error, punto_caída (izq/centro/der).
- `rounds` — id, user_id, course_id, fecha, score_total, putts, fairways, gir.
- `holes` — id, round_id, número, par, score, putts, fairway, gir, palo, penalidad.
- `clubs` (palos del jugador) — id, user_id, nombre, distancia_promedio_m, última actualización.
- `courses` — id, nombre, ciudad, estado, lat/lng, precio_desde, dificultad, acepta_no_socios, amenidades (JSON), fotos, rating.
- `tee_times` — id, course_id, fecha, hora, precio, disponibles, estado.
- `bookings` — id, user_id, tee_time_id, jugadores, total, estado, fecha.
- `practice_plans` — id, user_id, semana, drills (JSON), generado_desde (stats + fallas).
- `notifications` — id, user_id, tipo, título, cuerpo, deep_link, programada_para, enviada_en, leída_en, estado.
- `notification_prefs` — id, user_id, categoría, activada, canal (push/email), horario_quiet_start, horario_quiet_end.
- `friendships` / `challenges` — para retos entre amigos (Fase 2+).

**Privacidad:** los videos son del usuario. No usarlos para entrenar modelos sin permiso explícito. Borrar video = borrar análisis asociado.

---

## 7. Estructura del proyecto (sugerida)

```
vuelo/
  README.md
  DECISIONS.md
  app/                 # pantallas (tabs: Hoy, Grabar, Stats, Clubes, Perfil)
  components/          # design system Liquid Glass
  lib/                 # supabase client, cámara, pose, trazado de bola
  hooks/
  store/               # estado global
  supabase/            # migraciones, Edge Functions, policies
  assets/
  e2e/                 # tests de humo por fase
```

---

## 8. Notificaciones push — idea trabajada

### 8.0 Para quién son: gente que odia que la molesten

El golfista típico de Vuelo valora su tiempo, su privacidad y su tranquilidad — y en su mayoría tiene alto poder adquisitivo. **No les gusta que los molesten, y una app que insiste es una app que se borra.** Por eso el principio de Vuelo es: **menos notificaciones, pero que cada una valga la pena. El silencio es parte del producto premium.**

- **Por defecto, casi todo apagado.** Al onboarding, solo se activan 2 cosas: recordatorio de tee time (si reservó) y aviso de revisión de coach (si la pidió). Todo lo demás es opt-in explícito, categoría por categoría. Nada se activa solo por actualizar la app.
- **Opt-in por categoría, no todo o nada.** El usuario elige qué quiere recibir. Puede apagar cada categoría después en Ajustes, en un solo toque.
- **Horario silencioso por defecto: 22:00–08:00** (ajustable). Nada de notificaciones en ese horario, salvo recordatorio de tee time del día siguiente si el usuario lo activó.
- **Tope de frecuencia, más estricto que lo normal:** máximo **1 push al día, máximo 3 a la semana**, sin contar recordatorios de reservas que el usuario hizo. Si ya se llegó al tope, la notificación espera al día siguiente o no se envía.
- **Toda notificación lleva deep link** a la pantalla correcta (el swing, la ronda, el club, el reto). Una notificación sin deep link no se envía.
- **Nunca vender en una notificación.** Ofertas de clubes solo si el usuario activó esa categoría, y máximo 1 por semana. Nada de “¡oferta por tiempo limitado!”, nada de urgencia falsa.
- **Tono premium y discreto:** corto, concreto, sin emojis, sin gritar, sin “¡¡¡”. Como un caddie que te habla bajo en el campo, no como un anuncio. Ejemplo bueno: “Mañana 08:20 en Club de Golf México.” Ejemplo malo: “¡No te pierdas esta increíble oferta! ⛳🔥”
- **Sin badges rojos insistentes, sin sonidos agresivos.** Sonido suave, sin vibración larga. El usuario puede poner Vuelo en “solo lo esencial” con un interruptor.
- **Modo “No molestar en el campo”:** cuando el usuario está en una ronda, Vuelo silencia todo excepto el recordatorio de su propio tee time. Nada de retos ni ofertas mientras juega.
- **Respetar el plan:** no anunciar funciones Pro en push a usuarios Pro. No anunciar lo gratis a quien ya lo usa.
- **Privacidad:** nunca mencionar en una notificación (que se ve en pantalla bloqueada) un club privado, un precio, o con quién juega. Solo lo necesario.
- **Idioma:** español.

### 8.1 Categorías y triggers

| # | Categoría | Trigger | Ejemplo de copy | Cuándo |
|---|---|---|---|---|
| 1 | Recordatorio de práctica | El plan semanal tiene un drill pendiente y pasaron 3 días sin practicar | “Tu drill de cadera lleva 3 días esperando. 5 minutos hoy y listo.” | Mar/jue/sáb, 18:00, solo si hay drill pendiente |
| 2 | Progreso de swing | Una falla que se estaba corrigiendo mejora o empeora en 2 swings seguidos | “Tu plano mejoró en tus últimos 2 swings. Sigue así.” | Después de analizar un swing |
| 3 | Recordatorio de ronda / tee time | 24 h antes y 2 h antes de una reserva | “Mañana 08:20 en Club de Golf México. ¿Llevas tus palos?” | Automático por reserva |
| 4 | Resumen de ronda | Al terminar de registrar una ronda | “Terminaste con 92 (+20). Perdiste más en approach — tu plan de esta semana ya se ajustó.” | Al cerrar la ronda |
| 5 | Retos con amigos | Un amigo te reta o te supera en el leaderboard | “Moy te retó a bajar de 90 este mes. ¿Aceptas?” | Cuando ocurre |
| 6 | Coach / revisión de video | Un coach terminó tu revisión | “Tu coach ya revisó tu swing. Tienes 2 notas de voz.” | Cuando ocurre |
| 7 | Ofertas de clubes (opt-in) | Un club cerca tiene tee time de última hora con descuento | “Hoy 16:40 en Bosque Real, $850 en vez de $1,200.” | Máx. 1/semana, solo opt-in |
| 8 | Racha / hábito | 7 días seguidos practicando o jugando, o a punto de perder la racha | “Llevas 6 días seguidos. Uno más y llegas a 7.” | Al detectar racha |
| 9 | Clima / campo | Lluvia probable en tu tee time | “Hay 70% de lluvia a las 09:00 en tu campo. ¿Reprogramamos?” | 12 h antes, si aplica |
| 10 | Recordatorio de suscripción | Pro vence en 3 días | “Tu Pro vence en 3 días. Renueva y no pierdas tu historial.” | Solo 1 vez, 3 días antes |

### 8.2 Qué NO hacer con push

- No mandar “¡Te extrañamos!” genérico. Si no hay un dato real (drill pendiente, ronda, reto), no hay notificación.
- No mandar más de 1 notificación por evento. Si ya se envió el recordatorio de 24 h, el de 2 h es el único segundo.
- No usar push para pedir reseñas en App Store antes de la 3ª semana de uso, y nunca después de una mala ronda.
- No despertar al usuario. El horario silencioso es sagrado.

### 8.3 Técnico (push)

- Proveedor: APNs (iOS) + FCM (Android), vía Capacitor PushNotifications o el servicio que elijas; guardar tokens por dispositivo en Supabase.
- Un usuario puede tener 2 dispositivos (modo dual): las notificaciones van al dispositivo principal, salvo que el secundario esté en una sesión de grabación.
- Toda notificación se registra en la tabla `notifications` antes de enviarse (para no duplicar y para poder mostrar un centro de notificaciones en la app).
- Centro de notificaciones en la app: lista con todo lo enviado, con su deep link, y con el ajuste de categorías en la misma pantalla.
- Programación: Edge Function / cron en Supabase que revisa triggers cada hora (recordatorios, rachas, clima). Eventos en tiempo real (reto, revisión de coach) se envían al ocurrir.
- En desarrollo: modo “push de prueba” que muestra la notificación en consola y en el centro de notificaciones, sin enviarla de verdad.

---

## 9. Tasks paso a paso — listas para Basecamp

Crea en Basecamp el proyecto **“Vuelo — App de golf”** con estas listas, en este orden. Cada ítem es una tarea.

### Lista: Fase 0 — Setup
- [ ] Crear repo privado `vuelo` en GitHub personal (Fercho-Barrera), con `main` protegida
- [ ] Crear proyecto Supabase `vuelo` (Auth, Postgres, Storage) y documentar variables en `.env.example` (sin secretos en el repo)
- [ ] Crear proyecto Basecamp “Vuelo — App de golf” con las listas de este brief
- [ ] Configurar Capacitor + React + TypeScript, que compile en iOS y Android
- [ ] Escribir `README.md` y `DECISIONS.md` en la raíz del repo
- [ ] Definir 20–30 clubes iniciales (CDMX + Querétaro) en una hoja, con horarios, precios y amenidades reales

### Lista: Fase 1 — Diseño y fundación
- [ ] Definir paleta, tipografía SF Pro y tokens de Liquid Glass (blur, bordes, reflejos, elevación)
- [ ] Construir componentes base: GlassCard, GlassButton, GlassTabBar, GlassSheet, PillSelector, StatRing
- [ ] Construir navegación por tabs: Hoy, Grabar, Stats, Clubes, Perfil
- [ ] Pantalla Hoy (vacía pero con diseño final): saludo, próximo tee time, drill del día
- [ ] Pantalla Perfil + Ajustes (con ajustes de notificaciones por categoría, sección 8)
- [ ] Revisión visual en iPhone y Android: ¿se siente Apple / Liquid Glass o se siente template?

### Lista: Fase 2 — Auth y perfil
- [ ] Auth con Supabase (email + Apple + Google)
- [ ] Onboarding: nombre, ciudad, nivel, hándicap, palos que usa, qué notificaciones quiere (sección 8)
- [ ] Perfil editable + avatar
- [ ] Modo dual: misma cuenta en 2 dispositivos, sesión y tokens por dispositivo

### Lista: Fase 3 — Modo 1: Mi swing (MVP)
- [ ] Pantalla Grabar con selector de modo y guía de encuadre en vidrio
- [ ] Grabar a 120fps, detección automática del swing, recorte y cámara lenta
- [ ] Integrar MediaPipe Pose y calcular ángulos clave (plano, cadera, hombros, sway, cabeza, tempo)
- [ ] Mostrar 1–3 fallas en lenguaje simple + 1 drill por falla
- [ ] Guardar swing + video en Supabase Storage (URL firmada)
- [ ] Historial de swings con tendencia por falla
- [ ] Comparación lado a lado con swing anterior y con swing modelo
- [ ] Probar con 20 videos reales y validar con un coach si las fallas son correctas

### Lista: Fase 4 — Stats (MVP)
- [ ] Scorecard por hoyo (máx. 10 seg por hoyo), con putts, fairway, GIR, penalidades
- [ ] Stats básicas + gráficas de tendencia por mes
- [ ] Distancias reales por palo (de rondas)
- [ ] Hándicap y rachas
- [ ] Cerrar una ronda genera el resumen y alimenta el plan de práctica

### Lista: Fase 5 — Clubes (MVP)
- [ ] Cargar los 20–30 clubes iniciales en Supabase con fotos, precios, amenidades
- [ ] Pantalla Clubes: mapa + lista, filtros (cerca, precio, dificultad, acepta no socios)
- [ ] Ficha de club: horarios, precios, amenidades, reseñas
- [ ] Reserva en V1: por WhatsApp/teléfono del club desde la ficha (sin pago integrado todavía)
- [ ] Guardar clubes favoritos

### Lista: Fase 6 — Modo 2: Mi bola
- [ ] Grabar el golpe apuntando a la bola, detección de bola frame a frame
- [ ] Trazar la línea de trayectoria sobre el video
- [ ] Estimar distancia aprox., tiempo de vuelo y velocidad aprox. (con margen de error visible)
- [ ] Calibración con distancia de referencia confirmada por el usuario
- [ ] La distancia alimenta la distancia real por palo en Stats
- [ ] Probar en campo real: ¿la estimación se acerca a la distancia real? Anotar el error en `DECISIONS.md`

### Lista: Fase 7 — Modo dual: 2 cámaras
- [ ] Emparejar 2 dispositivos con la misma cuenta como un solo intento
- [ ] V1: grabar en los dos y emparejar después por timestamp
- [ ] Ver swing y bola lado a lado en el mismo timeline
- [ ] V2: sincronización en vivo (solo si V1 funciona bien)

### Lista: Fase 8 — Push notifications
- [ ] Registrar tokens APNs/FCM por dispositivo en Supabase
- [ ] Tabla `notifications` + `notification_prefs` (categorías, horario silencioso 22:00–08:00)
- [ ] Centro de notificaciones en la app con deep links
- [ ] Implementar categorías 1–4 de la sección 8.1 (práctica, progreso, tee time, resumen de ronda)
- [ ] Implementar categorías 5–6 (retos, revisión de coach)
- [ ] Implementar categorías 7–10 (ofertas opt-in, racha, clima, renovación Pro)
- [ ] Tope: máx. 2 push/día, 5/semana (sin contar recordatorios de reserva)
- [ ] Modo “push de prueba” en desarrollo (sin enviar de verdad)
- [ ] Probar que ninguna notificación se envíe en horario silencioso

### Lista: Fase 9 — Pro, pagos y retos
- [ ] Paywall con Pro Mensual $179 MXN y Pro Anual $1,499 MXN (anual destacado, “ahorra $649”)
- [ ] Límites de Free: 3 análisis de swing/mes, 2 trazados de bola/mes, últimas 3 rondas
- [ ] Strokes gained simplificado + plan de práctica semanal generado
- [ ] Caddie GPS: distancia al green, obstáculos, palo recomendado según tus distancias
- [ ] Diario de práctica en el range
- [ ] Retos con amigos + leaderboard + torneos entre amigos
- [ ] Reserva y pago de tee times en la app (3–5 clubes piloto)

### Lista: Fase 10 — Pulido y lanzamiento
- [ ] Tests de humo por fase (que nada de lo anterior se rompa)
- [ ] Revisión de privacidad: videos solo con permiso, borrar video = borrar análisis
- [ ] Revisar que ningún texto prometa exactitud de launch monitor (siempre “aprox.”)
- [ ] Beta cerrada con 10 golfistas amateurs, recoger feedback y corregir lo que más duela
- [ ] Preparar App Store / Google Play: nombre Vuelo, descripción, capturas con Liquid Glass
- [ ] Lanzamiento en CDMX + Querétaro, con los 20–30 clubes iniciales

---

## 10. Validación (antes de construir demasiado)

1. Hablar con 10 golfistas amateurs: ¿qué app usan hoy? ¿pagarían por esto? ¿qué les duele más: técnica, stats o reservar?
2. Probar el análisis de swing con 20 videos reales y que un coach diga si las fallas son correctas.
3. Listar 20 clubes de CDMX/Querétaro: ¿aceptan no socios? ¿cómo reservan hoy? ¿les interesaría publicar horarios?

---

## 11. Lo que NO hay que hacer

- No prometer velocidad/distancia exacta de bola. Siempre “aprox.” + margen de error.
- No exigir hardware: nada de sensores ni launch monitor obligatorios. Si el usuario ya tiene, que lo pueda agregar como opcional.
- No depender del trípode: la grabación debe funcionar con el celular apoyado en el suelo.
- No cobrar por reservar al inicio.
- No usar videos del usuario para entrenar sin permiso explícito.
- No construir el marketplace de coaches ni el panel B2B en el MVP.
- No inventar clubes, precios ni horarios. Datos reales o nada.
- No mandar push genéricos ni fuera del horario silencioso (sección 8).

---

*Brief adaptado de `golf-app.md` (idea #1 en `app-ideas/`), 16 nov 2026. Nombre: Vuelo.*
