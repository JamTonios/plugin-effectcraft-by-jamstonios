/* Quick Edit EC by JamsTonios 0.18.0 - native recipes for EffectCraft 0.11.1. */
var QuickEditECPreviewState = { phase: 0, canvas: null, slider: null, percent: null, positionPad: null };
var QuickEditECEyedropState = { key: "", taskId: 0, attempts: 0, resultPath: "" };
var QuickEditEC = (function (host) {
    "use strict";
    var VERSION = "0.18.0", SETTINGS_SECTION = "Quick Edit EC by JamsTonios", RECENT_COLORS_KEY = "recentColorsV1", LIBRARY_KEY = "recipeLibraryV1", META_PREFIX = "QEECMETA:";
    var RECIPES = {
        roundedMedia: { title: "Rounded Media", category: "Layouts", selection: "1 capa", fields: [
            { key: "background", label: "Fondo", type: "color", value: "#FFFFFF" },
            { key: "frameWidth", label: "Ancho marco %", type: "number", min: 10, max: 100, value: 82 },
            { key: "frameHeight", label: "Alto marco %", type: "number", min: 10, max: 100, value: 82 },
            { key: "mediaScale", label: "Escala medio %", type: "number", min: 10, max: 400, value: 100 },
            { key: "radius", label: "Radio px", type: "number", min: 0, max: 1000, value: 36 },
            { key: "durationFrames", label: "Duracion frames", type: "number", min: 1, max: 120, value: 12 },
            { key: "animateOut", label: "Animar salida", type: "bool", value: false }
        ]},
        blurredBackdrop: { title: "Blurred Backdrop", category: "Layouts", selection: "1 capa", fields: [
            { key: "size", label: "Frente %", type: "number", min: 10, max: 100, value: 76 },
            { key: "radius", label: "Radio px", type: "number", min: 0, max: 1000, value: 34 },
            { key: "blur", label: "Blur", type: "number", min: 0, max: 3000, value: 45 },
            { key: "dim", label: "Oscurecer %", type: "number", min: 0, max: 90, value: 14 },
            { key: "durationFrames", label: "Duracion frames", type: "number", min: 1, max: 120, value: 12 },
            { key: "animateOut", label: "Animar salida", type: "bool", value: false },
            { key: "motionBlur", label: "Motion Blur", type: "bool", value: true }
        ]},
        pictureInPicture: { title: "Picture in Picture", category: "Layouts", selection: "2 capas: superior = ventana", fields: [
            { key: "corner", label: "Esquina", type: "choice", value: "topRight", options: [
                { label: "Superior derecha", value: "topRight" }, { label: "Superior izquierda", value: "topLeft" },
                { label: "Inferior derecha", value: "bottomRight" }, { label: "Inferior izquierda", value: "bottomLeft" }
            ]},
            { key: "size", label: "Ventana %", type: "number", min: 12, max: 70, value: 32 },
            { key: "margin", label: "Margen px", type: "number", min: 0, max: 1000, value: 42 },
            { key: "radius", label: "Radio px", type: "number", min: 0, max: 1000, value: 26 },
            { key: "durationFrames", label: "Duracion frames", type: "number", min: 1, max: 120, value: 12 },
            { key: "animateOut", label: "Animar salida", type: "bool", value: false },
            { key: "motionBlur", label: "Motion Blur", type: "bool", value: true }
        ]},
        splitScreen: { title: "Split Screen 2", category: "Layouts", selection: "2 capas: superior = izquierda", fields: [
            { key: "background", label: "Fondo", type: "color", value: "#101010" },
            { key: "margin", label: "Margen px", type: "number", min: 0, max: 1000, value: 32 },
            { key: "gap", label: "Separacion", type: "number", min: 0, max: 1000, value: 20 },
            { key: "radius", label: "Radio px", type: "number", min: 0, max: 1000, value: 24 },
            { key: "durationFrames", label: "Duracion frames", type: "number", min: 1, max: 120, value: 12 },
            { key: "animateOut", label: "Animar salida", type: "bool", value: false },
            { key: "motionBlur", label: "Motion Blur", type: "bool", value: true }
        ]},
        cascadeCover: { title: "Constructor de transiciones", category: "Transiciones", selection: "No requiere seleccion · crea formas nativas", fields: [
            { key: "motion", label: "Movimiento", type: "choice", value: "sweep", options: [
                { label: "Barrido", value: "sweep" }, { label: "Explosion radial", value: "radialOut" },
                { label: "Convergencia radial", value: "radialIn" }, { label: "Cruce alternado", value: "split" }
            ]},
            { key: "shape", label: "Figura", type: "choice", value: "circle", options: [
                { label: "●  Circulo", value: "circle" }, { label: "▣  Redondeado", value: "rounded" }, { label: "■  Cuadrado", value: "square" }
            ]},
            { key: "shapeSize", label: "Tamano figura %", type: "number", min: 5, max: 80, value: 22 },
            { key: "roundness", label: "Redondeado %", type: "number", min: 0, max: 50, value: 28, visibleWhen: { key: "shape", value: "rounded" } },
            { key: "copies", label: "Cantidad", type: "number", min: 2, max: 8, value: 3 },
            { key: "direction", label: "Direccion", type: "choice", value: "bottomLeft", options: [
                { label: "Abajo izq. > arriba der.", value: "bottomLeft" }, { label: "Abajo der. > arriba izq.", value: "bottomRight" },
                { label: "Izquierda > derecha", value: "left" }, { label: "Derecha > izquierda", value: "right" },
                { label: "Arriba > abajo", value: "top" }, { label: "Abajo > arriba", value: "bottom" }
            ]},
            { key: "travelFrames", label: "Recorrido frames", type: "number", min: 4, max: 120, value: 18 },
            { key: "staggerFrames", label: "Separacion frames", type: "number", min: 0, max: 60, value: 3 },
            { key: "finalDelayFrames", label: "Retraso final", type: "number", min: 0, max: 240, value: 15 },
            { key: "coverFrames", label: "Cobertura frames", type: "number", min: 2, max: 120, value: 8 },
            { key: "holdFrames", label: "Mantener frames", type: "number", min: 0, max: 600, value: 12, visibleWhen: { key: "animateOut", value: true } },
            { key: "uncoverFrames", label: "Salida frames", type: "number", min: 2, max: 120, value: 8, visibleWhen: { key: "animateOut", value: true } },
            { key: "overscan", label: "Cobertura %", type: "number", min: 100, max: 250, value: 112 },
            { key: "color1", label: "Color 1", type: "color", value: "#080047" },
            { key: "color2", label: "Color 2", type: "color", value: "#00E8FF", visibleWhen: { key: "copies", minValue: 2 } },
            { key: "color3", label: "Color 3", type: "color", value: "#080047", visibleWhen: { key: "copies", minValue: 3 } },
            { key: "color4", label: "Color 4", type: "color", value: "#FF4FD8", visibleWhen: { key: "copies", minValue: 4 } },
            { key: "color5", label: "Color 5", type: "color", value: "#FFD60A", visibleWhen: { key: "copies", minValue: 5 } },
            { key: "color6", label: "Color 6", type: "color", value: "#30D158", visibleWhen: { key: "copies", minValue: 6 } },
            { key: "color7", label: "Color 7", type: "color", value: "#FF7A00", visibleWhen: { key: "copies", minValue: 7 } },
            { key: "color8", label: "Color 8", type: "color", value: "#111111", visibleWhen: { key: "copies", minValue: 8 } },
            { key: "animateOut", label: "Animar salida", type: "bool", value: false },
            { key: "motionBlur", label: "Motion Blur", type: "bool", value: true }
        ]},
        smartTitle: { title: "Titulo inteligente", category: "Texto", selection: "0 capas = crea texto · 1 texto = reutiliza", fields: [
            { key: "text", label: "Texto", type: "text", value: "Tu titulo" },
            { key: "style", label: "Estilo", type: "choice", value: "lowerThird", options: [
                { label: "Lower third", value: "lowerThird" }, { label: "Titulo central", value: "center" }, { label: "Callout", value: "callout" }
            ]},
            { key: "fontSize", label: "Tamano texto", type: "number", min: 8, max: 500, value: 72 },
            { key: "paddingX", label: "Margen horizontal", type: "number", min: 0, max: 500, value: 42 },
            { key: "paddingY", label: "Margen vertical", type: "number", min: 0, max: 500, value: 24 },
            { key: "radius", label: "Radio px", type: "number", min: 0, max: 500, value: 24 },
            { key: "offset", label: "Desplazamiento px", type: "number", min: 0, max: 500, value: 36 },
            { key: "durationFrames", label: "Entrada frames", type: "number", min: 1, max: 240, value: 12 },
            { key: "textColor", label: "Texto", type: "color", value: "#FFFFFF" },
            { key: "boxColor", label: "Caja", type: "color", value: "#111111" },
            { key: "animateOut", label: "Animar salida", type: "bool", value: true },
            { key: "motionBlur", label: "Motion Blur", type: "bool", value: true }
        ]},
        impactScale: { title: "Impact Scale", category: "Impactos", selection: "1 o mas capas · usa un nulo", fields: [
            { key: "peak", label: "Pico %", type: "number", min: 0, max: 500, value: 110 },
            { key: "recoil", label: "Rebote %", type: "number", min: 0, max: 500, value: 90 },
            { key: "attackFrames", label: "Ataque frames", type: "number", min: 1, max: 120, value: 4 },
            { key: "recoilFrames", label: "Rebote frames", type: "number", min: 1, max: 120, value: 3 },
            { key: "settleFrames", label: "Final frames", type: "number", min: 1, max: 120, value: 2 },
            { key: "motionBlur", label: "Motion Blur", type: "bool", value: true }
        ]},
        popIn: { title: "Pop In", category: "Entradas", selection: "1 o mas capas · usa un nulo", fields: [
            { key: "peak", label: "Pico %", type: "number", min: 0, max: 500, value: 115 },
            { key: "recoil", label: "Rebote %", type: "number", min: 0, max: 500, value: 94 },
            { key: "attackFrames", label: "Entrada frames", type: "number", min: 1, max: 120, value: 5 },
            { key: "recoilFrames", label: "Rebote frames", type: "number", min: 1, max: 120, value: 3 },
            { key: "settleFrames", label: "Final frames", type: "number", min: 1, max: 120, value: 3 },
            { key: "motionBlur", label: "Motion Blur", type: "bool", value: true }
        ]},
        popOut: { title: "Pop Out", category: "Salidas", selection: "1 o mas capas · usa un nulo", fields: [
            { key: "anticipation", label: "Anticipacion %", type: "number", min: 0, max: 500, value: 108 },
            { key: "anticipationFrames", label: "Anticip. frames", type: "number", min: 1, max: 120, value: 3 },
            { key: "exitFrames", label: "Salida frames", type: "number", min: 1, max: 120, value: 5 },
            { key: "motionBlur", label: "Motion Blur", type: "bool", value: true }
        ]},
        hitShake: { title: "Hit Shake", category: "Impactos", selection: "1 o mas capas · usa un nulo", fields: [
            { key: "peak", label: "Pico %", type: "number", min: 0, max: 500, value: 106 },
            { key: "positionAmount", label: "Movimiento px", type: "number", min: 0, max: 1000, value: 22 },
            { key: "rotationAmount", label: "Rotacion °", type: "number", min: 0, max: 90, value: 2.5 },
            { key: "durationFrames", label: "Duracion frames", type: "number", min: 6, max: 240, value: 10 },
            { key: "motionBlur", label: "Motion Blur", type: "bool", value: true }
        ]},
        slideOvershoot: { title: "Slide Overshoot", category: "Entradas", selection: "1 o mas capas · usa un nulo", fields: [
            { key: "direction", label: "Desde", type: "choice", value: "left", options: [
                { label: "Izquierda", value: "left" }, { label: "Derecha", value: "right" },
                { label: "Arriba", value: "top" }, { label: "Abajo", value: "bottom" }
            ]},
            { key: "distance", label: "Distancia %", type: "number", min: 1, max: 300, value: 100 },
            { key: "overshoot", label: "Overshoot %", type: "number", min: 0, max: 100, value: 6 },
            { key: "enterFrames", label: "Entrada frames", type: "number", min: 1, max: 240, value: 10 },
            { key: "settleFrames", label: "Final frames", type: "number", min: 1, max: 120, value: 4 },
            { key: "motionBlur", label: "Motion Blur", type: "bool", value: true }
        ]},
        fadeScale: { title: "Fade + Scale", category: "Entradas", selection: "1 o mas capas · escala por nulo", fields: [
            { key: "startScale", label: "Escala inicial %", type: "number", min: 0, max: 500, value: 85 },
            { key: "durationFrames", label: "Duracion frames", type: "number", min: 1, max: 240, value: 12 },
            { key: "motionBlur", label: "Motion Blur", type: "bool", value: true }
        ]},
        pulseLoop: { title: "Pulse Loop", category: "Loops", selection: "1 o mas capas · usa un nulo", fields: [
            { key: "peak", label: "Pico %", type: "number", min: 0, max: 500, value: 105 },
            { key: "halfFrames", label: "Medio ciclo", type: "number", min: 1, max: 240, value: 12 },
            { key: "motionBlur", label: "Motion Blur", type: "bool", value: false }
        ]},
        handheld: { title: "Handheld", category: "Camara", selection: "1 o mas capas · usa un nulo", fields: [
            { key: "frequency", label: "Frecuencia", type: "number", min: 0.01, max: 30, value: 2 },
            { key: "positionAmount", label: "Movimiento px", type: "number", min: 0, max: 1000, value: 12 },
            { key: "rotationAmount", label: "Rotacion °", type: "number", min: 0, max: 90, value: 0.8 },
            { key: "motionBlur", label: "Motion Blur", type: "bool", value: true }
        ]}
    };
    var BUILT_INS = [
        { id: "rounded-white", name: "Rounded · Blanco", recipe: "roundedMedia", background: "#FFFFFF", frameWidth: 82, frameHeight: 82, mediaScale: 100, radius: 36, durationFrames: 12, animateOut: false },
        { id: "rounded-dark", name: "Rounded · Oscuro", recipe: "roundedMedia", background: "#151515", frameWidth: 82, frameHeight: 82, mediaScale: 100, radius: 36, durationFrames: 12, animateOut: false },
        { id: "rounded-soft", name: "Rounded · Gris suave", recipe: "roundedMedia", background: "#F2F2F2", frameWidth: 86, frameHeight: 86, mediaScale: 100, radius: 28, durationFrames: 16, animateOut: false },
        { id: "rounded-minimal", name: "Rounded · Minimal", recipe: "roundedMedia", background: "#FFFFFF", frameWidth: 92, frameHeight: 92, mediaScale: 100, radius: 18, durationFrames: 10, animateOut: false },
        { id: "rounded-card", name: "Rounded · Card", recipe: "roundedMedia", background: "#FAF7F2", frameWidth: 72, frameHeight: 72, mediaScale: 100, radius: 48, durationFrames: 14, animateOut: false },
        { id: "blur-clean", name: "Backdrop Blur · Clean", recipe: "blurredBackdrop", size: 76, radius: 34, blur: 45, dim: 14 },
        { id: "blur-soft", name: "Backdrop Blur · Soft", recipe: "blurredBackdrop", size: 82, radius: 26, blur: 68, dim: 8 },
        { id: "blur-cinema", name: "Backdrop Blur · Cinema", recipe: "blurredBackdrop", size: 70, radius: 44, blur: 85, dim: 25 },
        { id: "pip-tr", name: "PiP · Superior derecha", recipe: "pictureInPicture", corner: "topRight", size: 32, margin: 42, radius: 26 },
        { id: "pip-tl", name: "PiP · Superior izquierda", recipe: "pictureInPicture", corner: "topLeft", size: 32, margin: 42, radius: 26 },
        { id: "pip-br", name: "PiP · Inferior derecha", recipe: "pictureInPicture", corner: "bottomRight", size: 32, margin: 42, radius: 26 },
        { id: "pip-bl", name: "PiP · Inferior izquierda", recipe: "pictureInPicture", corner: "bottomLeft", size: 32, margin: 42, radius: 26 },
        { id: "split-clean", name: "Split 2 · Clean", recipe: "splitScreen", background: "#101010", margin: 32, gap: 20, radius: 24 },
        { id: "split-tight", name: "Split 2 · Tight", recipe: "splitScreen", background: "#000000", margin: 12, gap: 10, radius: 12 },
        { id: "transition-circles", name: "Barrido · Circulos", recipe: "cascadeCover", motion: "sweep", shape: "circle", shapeSize: 22, roundness: 0, copies: 3, direction: "bottomLeft", travelFrames: 18, staggerFrames: 3, finalDelayFrames: 15, coverFrames: 8, holdFrames: 12, uncoverFrames: 8, animateOut: false, overscan: 112, color1: "#080047", color2: "#00E8FF", color3: "#080047", color4: "#FF4FD8", color5: "#FFD60A", color6: "#30D158", color7: "#FF7A00", color8: "#111111", motionBlur: true },
        { id: "transition-rounded", name: "Barrido · Redondeado", recipe: "cascadeCover", motion: "sweep", shape: "rounded", shapeSize: 26, roundness: 28, copies: 3, direction: "bottomLeft", travelFrames: 16, staggerFrames: 3, finalDelayFrames: 13, coverFrames: 7, holdFrames: 12, uncoverFrames: 8, animateOut: false, overscan: 115, color1: "#6C3BFF", color2: "#FF4FD8", color3: "#18122B", color4: "#00E8FF", color5: "#FFD60A", color6: "#30D158", color7: "#FF7A00", color8: "#111111", motionBlur: true },
        { id: "transition-fast", name: "Barrido · Cuadrados rapidos", recipe: "cascadeCover", motion: "sweep", shape: "square", shapeSize: 20, roundness: 0, copies: 4, direction: "left", travelFrames: 12, staggerFrames: 2, finalDelayFrames: 8, coverFrames: 5, holdFrames: 8, uncoverFrames: 5, animateOut: false, overscan: 118, color1: "#FF3B30", color2: "#FFD60A", color3: "#FF7A00", color4: "#111111", color5: "#6C3BFF", color6: "#30D158", color7: "#00E8FF", color8: "#FFFFFF", motionBlur: true },
        { id: "transition-radial", name: "Transicion · Explosion radial", recipe: "cascadeCover", motion: "radialOut", shape: "circle", shapeSize: 18, roundness: 0, copies: 6, direction: "left", travelFrames: 18, staggerFrames: 2, finalDelayFrames: 12, coverFrames: 8, holdFrames: 10, uncoverFrames: 8, animateOut: false, overscan: 115, color1: "#7C3AED", color2: "#22D3EE", color3: "#F43F5E", color4: "#FACC15", color5: "#34D399", color6: "#111111", color7: "#FFFFFF", color8: "#000000", motionBlur: true },
        { id: "title-lower-third", name: "Texto · Lower third", recipe: "smartTitle", text: "Tu titulo", style: "lowerThird", fontSize: 64, paddingX: 42, paddingY: 22, radius: 22, offset: 36, durationFrames: 12, textColor: "#FFFFFF", boxColor: "#111111", animateOut: true, motionBlur: true, positionX: 16, positionY: 82 },
        { id: "title-center", name: "Texto · Titulo central", recipe: "smartTitle", text: "Tu titulo", style: "center", fontSize: 92, paddingX: 58, paddingY: 30, radius: 28, offset: 30, durationFrames: 14, textColor: "#FFFFFF", boxColor: "#080808", animateOut: true, motionBlur: true, positionX: 50, positionY: 50 },
        { id: "title-callout", name: "Texto · Callout", recipe: "smartTitle", text: "Dato importante", style: "callout", fontSize: 54, paddingX: 34, paddingY: 18, radius: 30, offset: 24, durationFrames: 10, textColor: "#111111", boxColor: "#FFD60A", animateOut: true, motionBlur: true, positionX: 76, positionY: 24 },
        { id: "impact-classic", name: "Impacto · Clasico", recipe: "impactScale", peak: 110, recoil: 90, attackFrames: 4, recoilFrames: 3, settleFrames: 2, motionBlur: true },
        { id: "impact-soft", name: "Impacto · Suave", recipe: "impactScale", peak: 108, recoil: 96, attackFrames: 4, recoilFrames: 3, settleFrames: 3, motionBlur: true },
        { id: "impact-hard", name: "Impacto · Fuerte", recipe: "impactScale", peak: 116, recoil: 88, attackFrames: 3, recoilFrames: 3, settleFrames: 2, motionBlur: true },
        { id: "pop-in", name: "Entrada · Pop In", recipe: "popIn", peak: 115, recoil: 94, attackFrames: 5, recoilFrames: 3, settleFrames: 3, motionBlur: true },
        { id: "pop-out", name: "Salida · Pop Out", recipe: "popOut", anticipation: 108, anticipationFrames: 3, exitFrames: 5, motionBlur: true },
        { id: "hit-soft", name: "Impacto · Hit Shake suave", recipe: "hitShake", peak: 104, positionAmount: 12, rotationAmount: 1.2, durationFrames: 10, motionBlur: true },
        { id: "hit-hard", name: "Impacto · Hit Shake fuerte", recipe: "hitShake", peak: 108, positionAmount: 28, rotationAmount: 3.2, durationFrames: 12, motionBlur: true },
        { id: "slide-left", name: "Entrada · Slide izquierda", recipe: "slideOvershoot", direction: "left", distance: 100, overshoot: 6, enterFrames: 10, settleFrames: 4, motionBlur: true },
        { id: "slide-right", name: "Entrada · Slide derecha", recipe: "slideOvershoot", direction: "right", distance: 100, overshoot: 6, enterFrames: 10, settleFrames: 4, motionBlur: true },
        { id: "slide-top", name: "Entrada · Slide arriba", recipe: "slideOvershoot", direction: "top", distance: 100, overshoot: 6, enterFrames: 10, settleFrames: 4, motionBlur: true },
        { id: "slide-bottom", name: "Entrada · Slide abajo", recipe: "slideOvershoot", direction: "bottom", distance: 100, overshoot: 6, enterFrames: 10, settleFrames: 4, motionBlur: true },
        { id: "fade-scale-soft", name: "Entrada · Fade Scale suave", recipe: "fadeScale", startScale: 88, durationFrames: 14, motionBlur: true },
        { id: "fade-scale-fast", name: "Entrada · Fade Scale rapido", recipe: "fadeScale", startScale: 75, durationFrames: 8, motionBlur: true },
        { id: "pulse-soft", name: "Loop · Pulse suave", recipe: "pulseLoop", peak: 104, halfFrames: 14, motionBlur: false },
        { id: "pulse-strong", name: "Loop · Pulse fuerte", recipe: "pulseLoop", peak: 110, halfFrames: 10, motionBlur: true },
        { id: "handheld-soft", name: "Camara · Handheld suave", recipe: "handheld", frequency: 1.2, positionAmount: 6, rotationAmount: 0.35, motionBlur: true },
        { id: "handheld-normal", name: "Camara · Handheld", recipe: "handheld", frequency: 2, positionAmount: 12, rotationAmount: 0.8, motionBlur: true },
        { id: "handheld-strong", name: "Camara · Handheld fuerte", recipe: "handheld", frequency: 3.5, positionAmount: 26, rotationAmount: 2.2, motionBlur: true }
    ];
    var api = {}, ui, categoryFilter, catalog, form, leftForm, recipeLabel, selectionLabel, applyButton, resetButton, reopenButton, libraryButton, previewStage, previewCanvas, previewSlider, previewPercent, previewAspectLabel, previewZoomOut, previewZoomIn, previewZoomFit;
    var positionStage, positionPad, positionValue, positionPanel, positionState = { x: 50, y: 50 }, positionDragging = false;
    var fieldControls = {}, fieldRows = {}, currentRecipe = "", activeColorKey = "", colorPaletteLabel = null, paletteSwatches = [], recentColors = null;
    var leftViewport, leftContentHost, leftColumn, leftScrollTrack, leftScrollUp, leftScrollDown;
    var leftScrollState = { offset: 0, max: 0, dragging: false, grab: 0 }, LEFT_CONTENT_HEIGHT = 2400;
    var rightViewport, rightContentHost, rightColumn, rightScrollTrack, rightScrollUp, rightScrollDown;
    var rightScrollState = { offset: 0, max: 0, dragging: false, grab: 0 }, RIGHT_CONTENT_HEIGHT = 2400;
    var roundedStages = [], roundedStagePanel, roundedStageTimeline, roundedStageStatus, roundedStageEditors = {}, roundedStageAdd, roundedStageDuplicate, roundedStageDelete, roundedStageUsePosition;
    var roundedInitialState = { durationFrames:12, positionX:50, positionY:50, frameWidth:82, frameHeight:82, mediaScale:100, radius:36, easing:"bezier" };
    var roundedStageSelected = -1, roundedStageDragging = false, roundedStageDragId = "", roundedStageEditorRows = [];
    var activeInstanceMeta = null, recipeLibrary = null, copiedCurve = null, libraryWindow = null;
    var keyframePanel, keyframeStatus, keyframeCurve, keyframeStrength, keyframeOffset, keyframeGraph;
    var sequenceOrder, sequenceMode, sequenceStep, sequenceReverse, sequenceStatus;
    var realPreviewImage = null, realPreviewFile = null, realPreviewKey = "", realPreviewError = "", realPreviewRendering = false, realPreviewSlot = 0, realPreviewIsolationCount = 0;
    var previewTimeState = { zoom:1, start:0, timingKey:"" }, previewTimeDragging = false, previewTimeNavigating = false, previewTimeNavGrab = 0;

    function fail(message) { throw new Error(message); }
    function trim(value) { return String(value === undefined || value === null ? "" : value).replace(/^\s+|\s+$/g, ""); }
    function number(value, label, min, max) {
        var n = Number(value);
        if (!isFinite(n) || trim(value) === "") fail(label + ": introduce un numero valido.");
        if (n < min || n > max) fail(label + ": usa un valor entre " + min + " y " + max + ".");
        return n;
    }
    function hex(value) {
        var s = trim(value).toUpperCase();
        if (/^[0-9A-F]{6}$/.test(s)) s = "#" + s;
        if (!/^#[0-9A-F]{6}$/.test(s)) fail("Color: usa el formato #RRGGBB.");
        return s;
    }
    function rgb(value) { var s = hex(value); return [parseInt(s.substr(1, 2), 16) / 255, parseInt(s.substr(3, 2), 16) / 255, parseInt(s.substr(5, 2), 16) / 255]; }
    function rgba(value) { var c = rgb(value); return [c[0], c[1], c[2], 1]; }
    function activeComp() { var c = app.project.activeItem; if (!(c instanceof CompItem)) fail("Abre una composicion."); return c; }
    function historyTransaction(label, fn) {
        var before = app.run("edit.history.list", {}), id = before.states[before.current].id, value, error;
        app.beginUndoGroup("Quick Edit EC - " + label);
        try { value = fn(); } catch (e) { error = e; } finally { app.endUndoGroup(); }
        if (error) {
            try { app.run("edit.history.goto", { id: id }); } catch (rollback) { throw new Error(error.message + " / No se pudo restaurar: " + rollback.message); }
            throw error;
        }
        return value;
    }
    function run(label, fn) { try { historyTransaction(label, fn); } catch (e) { alert("Quick Edit EC by JamsTonios\n\nNo aplicado: " + e.message); } }
    function uniqueLayerName(c, base) {
        var used = {}, i, name = base, n = 2; for (i = 1; i <= c.numLayers; i++) used[c.layer(i).name] = true;
        while (used[name]) name = base + " " + n++; return name;
    }
    function cloneValue(value) {
        if (value instanceof Array) { var out=[],i; for(i=0;i<value.length;i++) out.push(cloneValue(value[i])); return out; }
        return value;
    }
    function layerById(c,id) { var i; for(i=1;i<=c.numLayers;i++) if(c.layer(i).id===id)return c.layer(i); return null; }
    function arrayHasId(list,layer) { var i; for(i=0;i<list.length;i++)if(list[i].id===layer.id)return true;return false; }
    function clearPropertyAnimation(prop) {
        if(!prop)return;try{prop.expression="";}catch(ignoreExpressionClear){}
        try{while(prop.numKeys)prop.removeKey(prop.numKeys);}catch(ignoreKeysClear){}
    }
    function captureEaseList(list){var out=[],i;for(i=0;i<list.length;i++)out.push({speed:Number(list[i].speed)||0,influence:Number(list[i].influence)||0});return out;}
    function restoreEaseList(list){var out=[],i;for(i=0;i<list.length;i++)out.push(new KeyframeEase(list[i].speed,list[i].influence));return out;}
    function capturePropertyState(prop){
        var state={value:cloneValue(prop.value),expression:"",keys:[]},i,key;
        try{state.expression=String(prop.expression||"");}catch(ignoreCaptureExpression){}
        for(i=1;i<=prop.numKeys;i++){key={time:prop.keyTime(i),value:cloneValue(prop.keyValue(i)),inType:prop.keyInInterpolationType(i),outType:prop.keyOutInterpolationType(i),incoming:captureEaseList(prop.keyInTemporalEase(i)),outgoing:captureEaseList(prop.keyOutTemporalEase(i))};try{key.inSpatial=cloneValue(prop.keyInSpatialTangent(i));key.outSpatial=cloneValue(prop.keyOutSpatialTangent(i));key.spatialContinuous=prop.keySpatialContinuous(i);key.spatialAuto=prop.keySpatialAutoBezier(i);key.roving=prop.keyRoving(i);}catch(ignoreSpatialCapture){}state.keys.push(key);}return state;
    }
    function restorePropertyState(prop,state){
        if(!prop||!state)return;clearPropertyAnimation(prop);var i,key,index;
        if(!state.keys||!state.keys.length)prop.setValue(state.value);else for(i=0;i<state.keys.length;i++){key=state.keys[i];prop.setValueAtTime(key.time,key.value);index=prop.nearestKeyIndex(key.time);try{prop.setInterpolationTypeAtKey(index,key.inType,key.outType);prop.setTemporalEaseAtKey(index,restoreEaseList(key.incoming),restoreEaseList(key.outgoing));}catch(ignoreTemporalRestore){}try{if(key.inSpatial!==undefined)prop.setSpatialTangentsAtKey(index,key.inSpatial,key.outSpatial);if(key.spatialContinuous!==undefined)prop.setSpatialContinuousAtKey(index,key.spatialContinuous);if(key.spatialAuto!==undefined)prop.setSpatialAutoBezierAtKey(index,key.spatialAuto);if(key.roving!==undefined)prop.setRovingAtKey(index,key.roving);}catch(ignoreSpatialRestore){}}
        try{if(state.expression)prop.expression=state.expression;}catch(ignoreRestoreExpression){}
    }
    function captureLayerState(layer) {
        var state={id:layer.id,index:layer.index,name:layer.name,parentId:layer.parent?layer.parent.id:0,comment:String(layer.comment||""),motionBlur:!!layer.motionBlur};
        try{state.anchor=cloneValue(layer.transform.anchorPoint.value);state.position=cloneValue(layer.transform.position.value);state.scale=cloneValue(layer.transform.scale.value);state.rotation=cloneValue(layer.transform.rotation.value);state.opacity=cloneValue(layer.transform.opacity.value);state.properties={anchor:capturePropertyState(layer.transform.anchorPoint),position:capturePropertyState(layer.transform.position),scale:capturePropertyState(layer.transform.scale),rotation:capturePropertyState(layer.transform.rotation),opacity:capturePropertyState(layer.transform.opacity)};}catch(ignoreTransformCapture){}
        try{var sourceText=layer.property("ADBE Text Properties").property("ADBE Text Document"),doc=sourceText.value;state.text={value:String(doc.text),fontSize:Number(doc.fontSize),fillColor:cloneValue(doc.fillColor)};}catch(ignoreTextCapture){}
        return state;
    }
    function captureApplicationContext(c) {
        var selected=c.selectedLayers,targets=[],allIds=[],i,l,changed=true,matte;
        for(i=0;i<selected.length;i++)targets.push(selected[i]);
        while(changed){changed=false;for(i=1;i<=c.numLayers;i++){l=c.layer(i);if(l.hasTrackMatte){matte=l.trackMatteLayer;if((arrayHasId(targets,l)||arrayHasId(targets,matte))){if(!arrayHasId(targets,l)){targets.push(l);changed=true;}if(!arrayHasId(targets,matte)){targets.push(matte);changed=true;}}}}}
        for(i=1;i<=c.numLayers;i++)allIds.push(c.layer(i).id);
        var states=[];for(i=0;i<targets.length;i++)states.push(captureLayerState(targets[i]));
        return {allIds:allIds,states:states,time:c.time};
    }
    function stripMetadataComment(value) {
        var lines=String(value||"").split(/\r?\n/),out=[],i;for(i=0;i<lines.length;i++)if(lines[i].indexOf(META_PREFIX)!==0)out.push(lines[i]);return out.join("\n");
    }
    function writeLayerMetadata(layer,meta) {
        var previous=stripMetadataComment(layer.comment),encoded=encodeURIComponent(JSON.stringify(meta));
        layer.comment=META_PREFIX+encoded+(previous?"\n"+previous:"");
    }
    function readLayerMetadata(layer) {
        if(!layer)return null;var lines=String(layer.comment||"").split(/\r?\n/),i;
        for(i=0;i<lines.length;i++)if(lines[i].indexOf(META_PREFIX)===0){try{return JSON.parse(decodeURIComponent(lines[i].substr(META_PREFIX.length)));}catch(ignoreMetaParse){return null;}}
        return null;
    }
    function collectResultLayers(result) {
        var layers=[],seen={},key,i,value;
        function add(value){if(!value)return;if(value instanceof Array){for(i=0;i<value.length;i++)add(value[i]);return;}try{if(typeof value.id==="number"&&typeof value.index==="number"&&value.containingComp){if(!seen[value.id]){seen[value.id]=true;layers.push(value);}return;}}catch(ignoreLayerProbe){}if(typeof value==="object"){for(key in value)if(value.hasOwnProperty(key)&&key!=="effect")add(value[key]);}}
        add(result);return layers;
    }
    function idInList(list,id){var i;for(i=0;i<list.length;i++)if(list[i]===id)return true;return false;}
    function finalizeRecipeApplication(preset,result,context) {
        var layers=collectResultLayers(result),targetIds=[],generatedIds=[],i,layer,instance="qe-"+(new Date().getTime())+"-"+Math.round(Math.random()*100000);
        for(i=0;i<layers.length;i++){layer=layers[i];if(idInList(context.allIds,layer.id))targetIds.push(layer.id);else generatedIds.push(layer.id);}
        for(i=0;i<context.states.length;i++)if(!idInList(targetIds,context.states[i].id)&&layerById(activeComp(),context.states[i].id))targetIds.push(context.states[i].id);
        var meta={schema:1,version:VERSION,instance:instance,recipe:preset.recipe,preset:preset,targetIds:targetIds,generatedIds:generatedIds,before:context.states};
        for(i=0;i<layers.length;i++)writeLayerMetadata(layers[i],meta);
        activeInstanceMeta=meta;if(applyButton)applyButton.text="ACTUALIZAR";if(selectionLabel)selectionLabel.text="Editable · "+RECIPES[preset.recipe].title;
        result.qeMeta=meta;return result;
    }
    function isMotionControllerRecipe(recipe){return recipe==="impactScale"||recipe==="popIn"||recipe==="popOut"||recipe==="hitShake"||recipe==="slideOvershoot"||recipe==="fadeScale"||recipe==="pulseLoop"||recipe==="handheld";}
    function restoreLayerState(c,state,recipe) {
        var layer=layerById(c,state.id),parent,motion=isMotionControllerRecipe(recipe);if(!layer)return null;
        if(!motion&&recipe!=="smartTitle")try{if(layer.hasTrackMatte&&layer.removeTrackMatte)layer.removeTrackMatte();}catch(ignoreRemoveMatte){}
        parent=state.parentId?layerById(c,state.parentId):null;try{layer.parent=parent;}catch(ignoreParentRestore){}
        try{if(state.properties){restorePropertyState(layer.transform.anchorPoint,state.properties.anchor);restorePropertyState(layer.transform.position,state.properties.position);restorePropertyState(layer.transform.scale,state.properties.scale);restorePropertyState(layer.transform.rotation,state.properties.rotation);restorePropertyState(layer.transform.opacity,state.properties.opacity);}else if(!motion){clearPropertyAnimation(layer.transform.anchorPoint);clearPropertyAnimation(layer.transform.position);clearPropertyAnimation(layer.transform.scale);clearPropertyAnimation(layer.transform.rotation);clearPropertyAnimation(layer.transform.opacity);if(state.anchor!==undefined)layer.transform.anchorPoint.setValue(state.anchor);if(state.position!==undefined)layer.transform.position.setValue(state.position);if(state.scale!==undefined)layer.transform.scale.setValue(state.scale);if(state.rotation!==undefined)layer.transform.rotation.setValue(state.rotation);if(state.opacity!==undefined)layer.transform.opacity.setValue(state.opacity);}else if(recipe==="fadeScale"){clearPropertyAnimation(layer.transform.opacity);if(state.opacity!==undefined)layer.transform.opacity.setValue(state.opacity);}}catch(ignoreTransformRestore){}
        if(state.text){try{var source=layer.property("ADBE Text Properties").property("ADBE Text Document"),doc=source.value;doc.text=state.text.value;doc.fontSize=state.text.fontSize;if(state.text.fillColor)doc.fillColor=state.text.fillColor;source.setValue(doc);}catch(ignoreTextRestore){}}
        try{layer.motionBlur=state.motionBlur;layer.comment=state.comment;}catch(ignoreLayerRestore){}return layer;
    }
    function cleanupRecipeInstance(meta) {
        var c=activeComp(),restored=[],i,layer,generated=[];
        if(!meta||!meta.instance)fail("No hay una construccion Quick Edit EC cargada.");
        for(i=0;i<meta.before.length;i++){layer=restoreLayerState(c,meta.before[i],meta.recipe);if(layer)restored.push(layer);}
        for(i=0;i<meta.generatedIds.length;i++){layer=layerById(c,meta.generatedIds[i]);if(layer)generated.push(layer);}
        generated.sort(function(a,b){return a.index-b.index;});for(i=0;i<generated.length;i++){try{generated[i].remove();}catch(ignoreGeneratedRemove){}}
        for(i=1;i<=c.numLayers;i++)c.layer(i).selected=false;for(i=0;i<restored.length;i++)restored[i].selected=true;
        activeInstanceMeta=null;if(applyButton)applyButton.text="APLICAR";return restored;
    }
    function reopenSelectedRecipe() {
        var c=activeComp(),selected=c.selectedLayers,meta=null,i;
        for(i=0;i<selected.length&&!meta;i++)meta=readLayerMetadata(selected[i]);
        if(!meta)fail("La seleccion no pertenece a una construccion editable de Quick Edit EC.");
        if(!RECIPES[meta.recipe])fail("La receta guardada ya no esta disponible en esta version.");
        fillForm(meta.preset);activeInstanceMeta=meta;applyButton.text="ACTUALIZAR";selectionLabel.text="Editable · "+RECIPES[meta.recipe].title;return meta;
    }
    function assertStatic(prop, label) { if (prop.numKeys || prop.expressionEnabled) fail(label + " debe estar sin animacion ni expresion."); }
    function validateLayer(c, layer, label) {
        if (layer.locked) fail(label + " esta bloqueada.");
        if (layer.threeDLayer) fail(label + " debe ser 2D.");
        if (layer.parent) fail("Desparenta " + label + " antes de aplicar la receta.");
        if (layer.hasTrackMatte) fail(label + " ya utiliza un track matte.");
        assertStatic(layer.transform.anchorPoint, label + " / Anchor Point"); assertStatic(layer.transform.position, label + " / Position");
        assertStatic(layer.transform.scale, label + " / Scale"); assertStatic(layer.transform.rotation, label + " / Rotation");
        if (Math.abs(layer.transform.rotation.value) > 0.0001) fail(label + ": Rotation debe ser 0.");
        var box = layer.sourceRectAtTime(c.time, true); if (!box || box.width <= 0 || box.height <= 0) fail("No se pudieron medir los limites de " + label + ".");
        return box;
    }
    function selectedMedia(c, count, hint) {
        var selected = c.selectedLayers;
        if (selected.length !== count) fail("Selecciona exactamente " + count + " " + (count === 1 ? "capa" : "capas") + ". " + hint);
        var boxes = [], i; for (i = 0; i < selected.length; i++) boxes.push(validateLayer(c, selected[i], "Capa " + (i + 1)));
        return { layers: selected, boxes: boxes };
    }
    function setFrame(layer, box, frameW, frameH, x, y, mode) {
        var scale = (mode === "cover" ? Math.max(frameW / box.width, frameH / box.height) : Math.min(frameW / box.width, frameH / box.height)) * 100;
        layer.transform.anchorPoint.setValue([box.left + box.width / 2, box.top + box.height / 2]); layer.transform.position.setValue([x, y]); layer.transform.scale.setValue([scale, scale]);
        return { width: box.width * scale / 100, height: box.height * scale / 100, scale: scale };
    }
    function visualState(layer, box) {
        var anchor = layer.transform.anchorPoint.value, position = layer.transform.position.value, scale = layer.transform.scale.value;
        if (Math.abs(scale[0]) < 0.0001 || Math.abs(scale[1]) < 0.0001) fail("La escala de " + layer.name + " no puede ser 0.");
        var sourceCenter = [box.left + box.width / 2, box.top + box.height / 2];
        return {
            sourceCenter: sourceCenter,
            position: [position[0] + (sourceCenter[0] - anchor[0]) * scale[0] / 100, position[1] + (sourceCenter[1] - anchor[1]) * scale[1] / 100],
            scale: [scale[0], scale[1]], width: box.width * Math.abs(scale[0]) / 100, height: box.height * Math.abs(scale[1]) / 100
        };
    }
    function targetFrameState(box, state, frameW, frameH, x, y, mode) {
        var amount = (mode === "cover" ? Math.max(frameW / box.width, frameH / box.height) : Math.min(frameW / box.width, frameH / box.height)) * 100;
        return { position: [x,y], scale: [state.scale[0] < 0 ? -amount : amount, state.scale[1] < 0 ? -amount : amount], width: box.width * amount / 100, height: box.height * amount / 100 };
    }
    function layoutAnimationTiming(c, layers, options, label) {
        var duration = frameCount(options.durationFrames === undefined ? 12 : options.durationFrames, "Duracion", 1, 120), animateOut = bool(options.animateOut);
        var t = c.time, d = c.frameDuration, introEnd = t + duration*d, exitEnd = c.duration, i;
        for (i=0;i<layers.length;i++) {
            if (t < layers[i].inPoint - 0.000001 || introEnd > layers[i].outPoint + 0.000001) fail("Las capas deben estar activas durante toda la entrada " + label + ".");
            exitEnd = Math.min(exitEnd, layers[i].outPoint);
        }
        var exitStart = exitEnd - duration*d;
        if (animateOut && exitStart < introEnd - 0.000001) fail("Las capas son demasiado cortas para la entrada y salida " + label + ".");
        return { durationFrames:duration, animateOut:animateOut, start:t, introEnd:introEnd, exitStart:exitStart, exitEnd:exitEnd, times:animateOut?[t,introEnd,exitStart,exitEnd]:[t,introEnd] };
    }
    function animatedPair(timing, start, target) { return timing.animateOut ? [start,target,target,start] : [start,target]; }
    function animateLayerToFrame(layer, box, target, timing) {
        var start = visualState(layer,box); layer.transform.anchorPoint.setValue(start.sourceCenter);
        setKeys(layer.transform.position,timing.times,animatedPair(timing,start.position,target.position),72);
        setKeys(layer.transform.scale,timing.times,animatedPair(timing,start.scale,target.scale),72);
        return start;
    }
    function animateLayoutMatte(matte, start, target, radius, timing) {
        var rect = matte.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group").property(1);
        var finalRadius = Math.min(radius,target.width/2,target.height/2);
        setKeys(matte.transform.position,timing.times,animatedPair(timing,start.position,target.position),72);
        setKeys(rect.property("ADBE Vector Rect Size"),timing.times,animatedPair(timing,[start.width,start.height],[target.width,target.height]),72);
        setKeys(rect.property("ADBE Vector Rect Roundness"),timing.times,animatedPair(timing,0,finalRadius),72);
        return { rect:rect, radius:finalRadius };
    }
    function enableLayoutMotionBlur(c, layers, enabled) { if (!enabled) return; c.motionBlur=true; var i; for(i=0;i<layers.length;i++) layers[i].motionBlur=true; }
    function addRoundedMatte(c, media, width, height, roundness, x, y, baseName) {
        var matte = c.layers.addShape(); matte.name = uniqueLayerName(c, baseName || "QE Rounded Matte"); matte.inPoint = media.inPoint; matte.outPoint = media.outPoint;
        var root = matte.property("ADBE Root Vectors Group"), group = root.addProperty("ADBE Vector Group"); group.name = "Rounded Frame";
        var contents = group.property("ADBE Vectors Group"), rect = contents.addProperty("ADBE Vector Shape - Rect");
        rect.property("ADBE Vector Rect Size").setValue([width, height]); rect.property("ADBE Vector Rect Position").setValue([0, 0]);
        rect.property("ADBE Vector Rect Roundness").setValue(Math.min(roundness, width / 2, height / 2));
        contents.addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue([1, 1, 1, 1]);
        matte.transform.anchorPoint.setValue([0, 0]); matte.transform.position.setValue([x, y]); matte.moveBefore(media); media.setTrackMatte(matte, TrackMatteType.ALPHA);
        return matte;
    }
    function addCompSolid(c, color, name) {
        var layer = c.layers.addSolid(rgb(color), uniqueLayerName(c, name), c.width, c.height, c.pixelAspect, c.duration); layer.inPoint = 0; layer.outPoint = c.duration; return layer;
    }
    function selectOnly(c, layer) { var i; for (i = 1; i <= c.numLayers; i++) c.layer(i).selected = false; layer.selected = true; }
    function addGaussianBlur(layer, amount) {
        var fx = layer.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2"); fx.property("Blurriness").setValue(amount); fx.property("Repeat Edge Pixels").setValue(true); return fx;
    }
    function addColorFill(layer, color) {
        var fx = layer.property("ADBE Effect Parade").addProperty("ADBE Fill"); fx.property("ADBE Fill-0002").setValue(rgba(color)); return fx;
    }
    function layerIn(list, layer) { var i; for (i = 0; i < list.length; i++) if (list[i].id === layer.id) return true; return false; }
    function sameParent(a, b) { return (!a && !b) || (a && b && a.id === b.id); }
    function frameCount(value, label, min, max) { return Math.round(number(value, label, min, max)); }
    function ensureTimeline(c, frames) {
        if (c.time + frames * c.frameDuration > c.duration + 0.000001) fail("No hay suficientes frames despues del cabezal para aplicar esta animacion.");
    }
    function easeProperty(prop, influence) {
        var i, ie, oe;
        for (i = 1; i <= prop.numKeys; i++) {
            prop.setTemporalAutoBezierAtKey(i, false); prop.setTemporalContinuousAtKey(i, false);
            ie = prop.keyInTemporalEase(i).map(function () { return new KeyframeEase(0, influence); });
            oe = prop.keyOutTemporalEase(i).map(function () { return new KeyframeEase(0, influence); });
            prop.setTemporalEaseAtKey(i, ie, oe);
            prop.setInterpolationTypeAtKey(i, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
        }
    }
    function setKeys(prop, times, values, influence) {
        var i; for (i = 0; i < times.length; i++) prop.setValueAtTime(times[i], values[i]);
        easeProperty(prop, influence || 66); return prop;
    }
    function applySegmentInterpolation(prop, easings) {
        if (!prop || prop.numKeys < 2 || !easings || !easings.length) return;
        var i, incoming, outgoing;
        for (i=1;i<=prop.numKeys;i++) {
            incoming=easings[Math.max(0,i-2)] === "linear" ? KeyframeInterpolationType.LINEAR : KeyframeInterpolationType.BEZIER;
            outgoing=easings[Math.min(easings.length-1,i-1)] === "linear" ? KeyframeInterpolationType.LINEAR : KeyframeInterpolationType.BEZIER;
            prop.setInterpolationTypeAtKey(i,incoming,outgoing);
        }
    }
    function motionSelection(c, needOpacity) {
        var selected = c.selectedLayers, layers = [], i, changed = true, l, matte, parent, p, pivot = [0, 0], minIn = c.duration, maxOut = 0;
        if (!selected.length) fail("Selecciona una o mas capas para animar.");
        for (i = 0; i < selected.length; i++) layers.push(selected[i]);
        while (changed) {
            changed = false;
            for (i = 1; i <= c.numLayers; i++) {
                l = c.layer(i);
                if (l.hasTrackMatte) {
                    matte = l.trackMatteLayer;
                    if (layerIn(layers, l) && !layerIn(layers, matte)) { layers.push(matte); changed = true; }
                    if (layerIn(layers, matte) && !layerIn(layers, l)) { layers.push(l); changed = true; }
                }
            }
        }
        parent = layers[0].parent;
        for (i = 0; i < layers.length; i++) {
            l = layers[i];
            if (l.locked) fail("La capa " + l.name + " esta bloqueada.");
            if (l.threeDLayer) fail("Los controladores de movimiento admiten capas 2D.");
            if (!l.transform || !l.transform.position || !l.transform.scale) fail("La capa " + l.name + " no admite este controlador.");
            if (!sameParent(parent, l.parent)) fail("Las capas seleccionadas deben compartir el mismo padre o no tener padre.");
            minIn = Math.min(minIn, l.inPoint); maxOut = Math.max(maxOut, l.outPoint);
        }
        for (i = 0; i < selected.length; i++) {
            p = selected[i].transform.position.value; pivot[0] += p[0]; pivot[1] += p[1];
            if (needOpacity) assertStatic(selected[i].transform.opacity, selected[i].name + " / Opacity");
        }
        pivot[0] /= selected.length; pivot[1] /= selected.length;
        return { selected: selected, layers: layers, parent: parent, pivot: pivot, inPoint: minIn, outPoint: maxOut };
    }
    function motionController(c, label, needOpacity) {
        var info = motionSelection(c, needOpacity), ctrl = c.layers.addNull(c.duration), i;
        ctrl.name = uniqueLayerName(c, "QE CTRL · " + label); ctrl.inPoint = info.inPoint; ctrl.outPoint = info.outPoint;
        if (info.parent) ctrl.parent = info.parent;
        ctrl.transform.position.setValue([info.pivot[0], info.pivot[1]]);
        for (i = 0; i < info.layers.length; i++) info.layers[i].parent = ctrl;
        selectOnly(c, ctrl); info.controller = ctrl; return info;
    }
    function enableMotionBlur(c, info, enabled) {
        if (!enabled) return;
        c.motionBlur = true; info.controller.motionBlur = true;
        var i; for (i = 0; i < info.layers.length; i++) info.layers[i].motionBlur = true;
    }
    function bool(value) { return value === true || value === 1 || value === "true" || value === "1"; }

    function optionPosition(c, options, fallback) {
        if (options.positionX === undefined || options.positionY === undefined) return [fallback[0], fallback[1]];
        return [
            c.width * number(options.positionX, "Posicion X", 0, 100) / 100,
            c.height * number(options.positionY, "Posicion Y", 0, 100) / 100
        ];
    }
    function framedPosition(c, options, width, height, margin, fallback) {
        if (options.positionX === undefined || options.positionY === undefined) return [fallback[0], fallback[1]];
        var px = number(options.positionX, "Posicion X", 0, 100) / 100, py = number(options.positionY, "Posicion Y", 0, 100) / 100;
        var insetX = Math.max(0, Number(margin) || 0) + width / 2, insetY = Math.max(0, Number(margin) || 0) + height / 2;
        var usableX = Math.max(0, c.width - insetX * 2), usableY = Math.max(0, c.height - insetY * 2);
        return [insetX + usableX * px, insetY + usableY * py];
    }
    function positionMotionController(c, info, options) {
        var target = optionPosition(c, options, info.pivot);
        info.sourcePivot = [info.pivot[0], info.pivot[1]];
        info.pivot = target;
        info.controller.transform.position.setValue(target);
        return target;
    }

    function transitionPath(c, direction, margin) {
        var cx = c.width / 2, cy = c.height / 2;
        if (direction === "bottomLeft") return { start: [-margin, c.height + margin], end: [c.width + margin, -margin] };
        if (direction === "bottomRight") return { start: [c.width + margin, c.height + margin], end: [-margin, -margin] };
        if (direction === "left") return { start: [-margin, cy], end: [c.width + margin, cy] };
        if (direction === "right") return { start: [c.width + margin, cy], end: [-margin, cy] };
        if (direction === "top") return { start: [cx, -margin], end: [cx, c.height + margin] };
        if (direction === "bottom") return { start: [cx, c.height + margin], end: [cx, -margin] };
        fail("Direccion de transicion no valida.");
    }
    function transitionCopyPath(c,motion,direction,margin,index,count) {
        if(!motion||motion==="sweep")return transitionPath(c,direction,margin);
        var center=[c.width/2,c.height/2],angle=Math.PI*2*(index/Math.max(1,count)),radius=Math.sqrt(c.width*c.width+c.height*c.height)/2+margin,outer=[center[0]+Math.cos(angle)*radius,center[1]+Math.sin(angle)*radius];
        if(motion==="radialOut")return {start:center,end:outer};
        if(motion==="radialIn")return {start:outer,end:center};
        if(motion==="split"){var horizontal=index%2===0;return horizontal?{start:[-margin,center[1]],end:[c.width+margin,center[1]]}:{start:[c.width+margin,center[1]],end:[-margin,center[1]]};}
        fail("Movimiento de transicion no valido.");
    }

    function addTransitionShape(c, shape, size, roundness, color, name) {
        var layer = c.layers.addShape(), root = layer.property("ADBE Root Vectors Group");
        layer.name = uniqueLayerName(c, name); layer.inPoint = c.time; layer.outPoint = c.duration;
        var group = root.addProperty("ADBE Vector Group"), contents = group.property("ADBE Vectors Group"), path;
        group.name = "Forma";
        if (shape === "circle") {
            path = contents.addProperty("ADBE Vector Shape - Ellipse");
            path.property("ADBE Vector Ellipse Size").setValue([size, size]);
        } else if (shape === "rounded" || shape === "square") {
            path = contents.addProperty("ADBE Vector Shape - Rect");
            path.property("ADBE Vector Rect Size").setValue([size, size]);
            path.property("ADBE Vector Rect Roundness").setValue(shape === "rounded" ? size * roundness / 100 : 0);
        } else fail("Figura de transicion no valida.");
        contents.addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue(rgba(color));
        layer.transform.anchorPoint.setValue([0, 0]); layer.transform.scale.setValue([100, 100]);
        return layer;
    }
    function transitionColor(options, index, copies) {
        var direct = options["color" + (index + 1)];
        if (direct !== undefined && direct !== null && trim(direct) !== "") return hex(direct);
        if (index === copies - 1 && options.finalColor) return hex(options.finalColor);
        if (index % 2 === 0 && options.colorA) return hex(options.colorA);
        if (options.colorB) return hex(options.colorB);
        return index === copies - 1 ? "#111111" : "#FFFFFF";
    }

    api.applyCascadeCover = function (options) {
        var c = activeComp(), shape = options.shape, motion=options.motion||"sweep";
        if (shape !== "circle" && shape !== "rounded" && shape !== "square") fail("Selecciona una figura valida.");
        var shapeSize = number(options.shapeSize, "Tamano figura", 5, 80), roundness = number(options.roundness, "Redondeado", 0, 50);
        var copies = frameCount(options.copies, "Elementos", 2, 8), travel = frameCount(options.travelFrames, "Recorrido", 4, 120);
        var stagger = frameCount(options.staggerFrames, "Separacion", 0, 60), delay = frameCount(options.finalDelayFrames, "Retraso final", 0, 240);
        var coverFrames = frameCount(options.coverFrames, "Cobertura", 2, 120), overscan = number(options.overscan, "Cobertura", 100, 250),animateOut=bool(options.animateOut),holdFrames=frameCount(options.holdFrames===undefined?12:options.holdFrames,"Mantener",0,600),uncoverFrames=frameCount(options.uncoverFrames===undefined?coverFrames:options.uncoverFrames,"Salida",2,120);
        var t = c.time, d = c.frameDuration, finalStartFrame = (copies - 2) * stagger + delay;
        var finalMoveFrames = Math.max(4, Math.round(travel * 2 / 3)), scaleDelayFrames = Math.max(1, Math.round(finalMoveFrames / 3));
        var coverEndFrame=finalStartFrame+Math.max(finalMoveFrames,scaleDelayFrames+coverFrames),exitStartFrame=coverEndFrame+holdFrames,totalFrames=animateOut?exitStartFrame+uncoverFrames:coverEndFrame; ensureTimeline(c, totalFrames);

        var baseSize = Math.min(c.width, c.height) * shapeSize / 100, compDiagonal = Math.sqrt(c.width*c.width + c.height*c.height);
        var coverPercent = compDiagonal / baseSize * overscan, coverScale = [coverPercent, coverPercent];
        var margin = baseSize * 0.72 + Math.max(c.width, c.height) * 0.08;
        var path = transitionCopyPath(c,motion,options.direction,margin,copies-1,copies), center = [c.width / 2, c.height / 2], layers = [], i, layer, startFrame,copyPath;
        var source = addTransitionShape(c, shape, baseSize, roundness, transitionColor(options, copies - 1, copies), "QE Barrido · Fondo");
        source.moveToBeginning();
        for (i = 0; i < copies - 1; i++) {
            layer = addTransitionShape(c, shape, baseSize, roundness, transitionColor(options, i, copies), "QE Barrido · Forma " + (i + 1));
            layer.moveAfter(source);
            startFrame = i * stagger; layer.inPoint = t; layer.outPoint = t + (startFrame + travel + 1) * d;copyPath=transitionCopyPath(c,motion,options.direction,margin,i,Math.max(1,copies-1));
            setKeys(layer.transform.position, [t + startFrame*d, t + (startFrame + travel)*d], [copyPath.start, copyPath.end], 72);
            layers.push(layer);
        }
        var finalStart = t + finalStartFrame*d;
        if(animateOut){setKeys(source.transform.position,[finalStart,finalStart+finalMoveFrames*d,t+exitStartFrame*d,t+totalFrames*d],[path.start,center,center,path.end],72);setKeys(source.transform.scale,[finalStart+scaleDelayFrames*d,finalStart+(scaleDelayFrames+coverFrames)*d,t+exitStartFrame*d,t+totalFrames*d],[[100,100],coverScale,coverScale,[100,100]],75);}
        else{setKeys(source.transform.position, [finalStart, finalStart + finalMoveFrames*d], [path.start, center], 72);setKeys(source.transform.scale, [finalStart + scaleDelayFrames*d, finalStart + (scaleDelayFrames + coverFrames)*d], [[100,100], coverScale], 75);}
        if (bool(options.motionBlur)) { c.motionBlur = true; source.motionBlur = true; for (i = 0; i < layers.length; i++) layers[i].motionBlur = true; }
        layers.push(source); selectOnly(c, source);
        return { layers: layers, finalLayer: source, path: path, coverScale: coverScale, totalFrames: totalFrames, finalStartFrame: finalStartFrame, shape: shape, motion:motion, animateOut:animateOut, shapeSize: baseSize };
    };

    api.applyImpactScale = function (options) {
        var c = activeComp(), a = frameCount(options.attackFrames, "Ataque", 1, 120), r = frameCount(options.recoilFrames, "Rebote", 1, 120), s = frameCount(options.settleFrames, "Final", 1, 120);
        var peak = number(options.peak, "Pico", 0, 500), recoil = number(options.recoil, "Rebote", 0, 500); ensureTimeline(c, a + r + s);
        var info = motionController(c, "Impacto", false), t = c.time, d = c.frameDuration, scale = info.controller.transform.scale; positionMotionController(c, info, options);
        setKeys(scale, [t, t + a*d, t + (a+r)*d, t + (a+r+s)*d], [[100,100], [peak,peak], [recoil,recoil], [100,100]], 72);
        enableMotionBlur(c, info, bool(options.motionBlur)); return info;
    };
    api.applyPopIn = function (options) {
        var c = activeComp(), a = frameCount(options.attackFrames, "Entrada", 1, 120), r = frameCount(options.recoilFrames, "Rebote", 1, 120), s = frameCount(options.settleFrames, "Final", 1, 120);
        var peak = number(options.peak, "Pico", 0, 500), recoil = number(options.recoil, "Rebote", 0, 500); ensureTimeline(c, a + r + s);
        var info = motionController(c, "Pop In", false), t = c.time, d = c.frameDuration; positionMotionController(c, info, options);
        setKeys(info.controller.transform.scale, [t, t+a*d, t+(a+r)*d, t+(a+r+s)*d], [[0,0], [peak,peak], [recoil,recoil], [100,100]], 72);
        enableMotionBlur(c, info, bool(options.motionBlur)); return info;
    };
    api.applyPopOut = function (options) {
        var c = activeComp(), a = frameCount(options.anticipationFrames, "Anticipacion", 1, 120), e = frameCount(options.exitFrames, "Salida", 1, 120);
        var anticipation = number(options.anticipation, "Anticipacion", 0, 500); ensureTimeline(c, a + e);
        var info = motionController(c, "Pop Out", false), t = c.time, d = c.frameDuration; positionMotionController(c, info, options);
        setKeys(info.controller.transform.scale, [t, t+a*d, t+(a+e)*d], [[100,100], [anticipation,anticipation], [0,0]], 72);
        enableMotionBlur(c, info, bool(options.motionBlur)); return info;
    };
    api.applyHitShake = function (options) {
        var c = activeComp(), duration = frameCount(options.durationFrames, "Duracion", 6, 240), peak = number(options.peak, "Pico", 0, 500);
        var amount = number(options.positionAmount, "Movimiento", 0, 1000), rotation = number(options.rotationAmount, "Rotacion", 0, 90); ensureTimeline(c, duration);
        var info = motionController(c, "Hit Shake", false), ctrl = info.controller, t = c.time, d = c.frameDuration, p = positionMotionController(c, info, options);
        var f = [0, 1, Math.max(2, Math.round(duration*.3)), Math.max(3, Math.round(duration*.55)), Math.max(4, Math.round(duration*.78)), duration];
        var times = f.map(function (v) { return t + v*d; });
        setKeys(ctrl.transform.scale, times, [[100,100],[peak,peak],[98,98],[101,101],[100,100],[100,100]], 55);
        setKeys(ctrl.transform.position, times, [p,[p[0]-amount,p[1]+amount*.55],[p[0]+amount*.7,p[1]-amount*.45],[p[0]-amount*.38,p[1]+amount*.25],[p[0]+amount*.15,p[1]-amount*.1],p], 45);
        setKeys(ctrl.transform.rotation, times, [0,-rotation,rotation*.7,-rotation*.4,rotation*.15,0], 45);
        enableMotionBlur(c, info, bool(options.motionBlur)); return info;
    };
    api.applySlideOvershoot = function (options) {
        var c = activeComp(), enter = frameCount(options.enterFrames, "Entrada", 1, 240), settle = frameCount(options.settleFrames, "Final", 1, 120);
        var distance = number(options.distance, "Distancia", 1, 300), over = number(options.overshoot, "Overshoot", 0, 100); ensureTimeline(c, enter + settle);
        var info = motionController(c, "Slide", false), ctrl = info.controller, p = positionMotionController(c, info, options), vx = 0, vy = 0;
        if (options.direction === "left") vx = -c.width * distance / 100; else if (options.direction === "right") vx = c.width * distance / 100;
        else if (options.direction === "top") vy = -c.height * distance / 100; else if (options.direction === "bottom") vy = c.height * distance / 100; else fail("Direccion no valida.");
        var t = c.time, d = c.frameDuration;
        setKeys(ctrl.transform.position, [t,t+enter*d,t+(enter+settle)*d], [[p[0]+vx,p[1]+vy],[p[0]-vx*over/100,p[1]-vy*over/100],p], 75);
        enableMotionBlur(c, info, bool(options.motionBlur)); return info;
    };
    api.applyFadeScale = function (options) {
        var c = activeComp(), duration = frameCount(options.durationFrames, "Duracion", 1, 240), start = number(options.startScale, "Escala inicial", 0, 500); ensureTimeline(c, duration);
        var info = motionController(c, "Fade Scale", true), t = c.time, end = t + duration*c.frameDuration, i, opacity, original; positionMotionController(c, info, options);
        setKeys(info.controller.transform.scale, [t,end], [[start,start],[100,100]], 72);
        for (i = 0; i < info.selected.length; i++) { opacity = info.selected[i].transform.opacity; original = opacity.value; setKeys(opacity, [t,end], [0,original], 66); }
        enableMotionBlur(c, info, bool(options.motionBlur)); return info;
    };
    api.applyPulseLoop = function (options) {
        var c = activeComp(), half = frameCount(options.halfFrames, "Medio ciclo", 1, 240), peak = number(options.peak, "Pico", 0, 500); ensureTimeline(c, half * 2);
        var info = motionController(c, "Pulse Loop", false), t = c.time, d = c.frameDuration, scale = info.controller.transform.scale; positionMotionController(c, info, options);
        setKeys(scale, [t,t+half*d,t+half*2*d], [[100,100],[peak,peak],[100,100]], 66); scale.expression = "loopOut(\"cycle\")";
        enableMotionBlur(c, info, bool(options.motionBlur)); return info;
    };
    api.applyHandheld = function (options) {
        var c = activeComp(), frequency = number(options.frequency, "Frecuencia", 0.01, 30), amount = number(options.positionAmount, "Movimiento", 0, 1000), rotation = number(options.rotationAmount, "Rotacion", 0, 90);
        var info = motionController(c, "Handheld", false), ctrl = info.controller; positionMotionController(c, info, options);
        ctrl.transform.position.expression = "wiggle(" + frequency + ", " + amount + ")";
        ctrl.transform.rotation.expression = "wiggle(" + (frequency * 0.8) + ", " + rotation + ")";
        enableMotionBlur(c, info, bool(options.motionBlur)); return info;
    };

    api.applyRoundedMedia = function (options) {
        var c = activeComp(), p = selectedMedia(c, 1, "Usa video, imagen o precomposicion."), media = p.layers[0], box = p.boxes[0];
        var legacySize=options.frameWidth===undefined&&options.frameHeight===undefined&&options.size!==undefined,legacyPct=options.size===undefined?82:options.size;
        var frameWidth=number(options.frameWidth===undefined?legacyPct:options.frameWidth,"Ancho marco",10,100),frameHeight=number(options.frameHeight===undefined?legacyPct:options.frameHeight,"Alto marco",10,100),contentPct=number(options.mediaScale===undefined?100:options.mediaScale,"Escala medio",10,400),rad = number(options.radius, "Radio", 0, 1000);
        var duration = frameCount(options.durationFrames, "Duracion", 1, 120), initialEasing=options.initialEasing==="linear"?"linear":"bezier", animateOut = bool(options.animateOut), t = media.inPoint, d = c.frameDuration, introEnd = t + duration*d;
        if (introEnd > media.outPoint + 0.000001) fail("La capa debe durar lo suficiente para la entrada Rounded.");
        var exitEnd = media.outPoint, exitStart = exitEnd - duration*d;
        var stages=normalizeRoundedStages(options.stages),i,stage,stageTime;

        var sourceCenter = [box.left + box.width/2, box.top + box.height/2], originalAnchor = media.transform.anchorPoint.value;
        var originalPosition = media.transform.position.value, originalScale = media.transform.scale.value;
        if (Math.abs(originalScale[0]) < 0.0001 || Math.abs(originalScale[1]) < 0.0001) fail("La escala de la capa no puede ser 0.");
        var startCenter = [
            originalPosition[0] + (sourceCenter[0] - originalAnchor[0]) * originalScale[0] / 100,
            originalPosition[1] + (sourceCenter[1] - originalAnchor[1]) * originalScale[1] / 100
        ];
        var targetFrameSize=[c.width*frameWidth/100,c.height*frameHeight/100],baseScaleValue=(legacySize?Math.min(targetFrameSize[0]/box.width,targetFrameSize[1]/box.height):Math.max(targetFrameSize[0]/box.width,targetFrameSize[1]/box.height))*100;
        var finalScaleValue = baseScaleValue*contentPct/100;
        var finalScale = [originalScale[0] < 0 ? -finalScaleValue : finalScaleValue, originalScale[1] < 0 ? -finalScaleValue : finalScaleValue];
        var finalCenter = [c.width/2, c.height/2], startSize = [box.width*Math.abs(originalScale[0])/100, box.height*Math.abs(originalScale[1])/100];
        var finalSize = legacySize?[box.width*baseScaleValue/100,box.height*baseScaleValue/100]:targetFrameSize, finalRadius = Math.min(rad, finalSize[0]/2, finalSize[1]/2);
        finalCenter = framedPosition(c, options, finalSize[0], finalSize[1], 0, finalCenter);
        var times = [t, introEnd], positionValues = [startCenter, finalCenter], scaleValues = [originalScale, finalScale];
        var sizeValues = [startSize, finalSize], radiusValues = [0, finalRadius], opacityValues = [0, 100], easings=[initialEasing];
        var lastCenter=finalCenter,lastScale=finalScale,lastSize=finalSize,lastRadius=finalRadius,lastTime=introEnd;
        for(i=0;i<stages.length;i++) {
            stage=stages[i];stageTime=t+stage.timeSeconds;
            if(stageTime<=introEnd+0.000001) fail("La etapa "+(i+1)+" debe ocurrir despues de la entrada Rounded ("+(Math.round(duration*d*1000)/1000)+" s).");
            if(stageTime>media.outPoint+0.000001) fail("La etapa "+(i+1)+" queda fuera de la duracion de la capa.");
            var stageTargetSize=[c.width*stage.frameWidth/100,c.height*stage.frameHeight/100],stageBaseScale=(stage.legacySize?Math.min(stageTargetSize[0]/box.width,stageTargetSize[1]/box.height):Math.max(stageTargetSize[0]/box.width,stageTargetSize[1]/box.height))*100;
            var stageScaleValue=stageBaseScale*stage.mediaScale/100;
            var stageScale=[originalScale[0]<0?-stageScaleValue:stageScaleValue,originalScale[1]<0?-stageScaleValue:stageScaleValue];
            var stageSize=stage.legacySize?[box.width*stageBaseScale/100,box.height*stageBaseScale/100]:stageTargetSize;
            var stageCenter=framedPosition(c,{positionX:stage.positionX,positionY:stage.positionY},stageSize[0],stageSize[1],0,[c.width/2,c.height/2]);
            var stageRadius=Math.min(stage.radius,stageSize[0]/2,stageSize[1]/2);
            times.push(stageTime);positionValues.push(stageCenter);scaleValues.push(stageScale);sizeValues.push(stageSize);radiusValues.push(stageRadius);opacityValues.push(100);easings.push(stage.easing);
            lastCenter=stageCenter;lastScale=stageScale;lastSize=stageSize;lastRadius=stageRadius;lastTime=stageTime;
        }
        if (animateOut) {
            if(exitStart<lastTime-0.000001) fail("La ultima etapa Rounded invade la salida. Adelantala o reduce la duracion de salida.");
            if(exitStart>lastTime+0.000001) { times.push(exitStart);positionValues.push(lastCenter);scaleValues.push(lastScale);sizeValues.push(lastSize);radiusValues.push(lastRadius);opacityValues.push(100);easings.push("linear"); }
            times.push(exitEnd); positionValues.push(startCenter); scaleValues.push(originalScale); sizeValues.push(startSize); radiusValues.push(0); opacityValues.push(0);easings.push("bezier");
        }

        media.transform.anchorPoint.setValue(sourceCenter);
        var mediaPosition=setKeys(media.transform.position,times,positionValues,72),mediaScaleProp=setKeys(media.transform.scale,times,scaleValues,72);
        var background = addCompSolid(c, options.background, "QE Background"); background.inPoint = media.inPoint; background.outPoint = media.outPoint; background.moveAfter(media);
        var backgroundOpacity=setKeys(background.transform.opacity,times,opacityValues,66);
        var matte = addRoundedMatte(c, media, finalSize[0], finalSize[1], finalRadius, finalCenter[0], finalCenter[1], "QE Rounded Matte");
        var rect = matte.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group").property(1);
        var mattePosition=setKeys(matte.transform.position,times,positionValues,72),matteSize=setKeys(rect.property("ADBE Vector Rect Size"),times,sizeValues,72),matteRadius=setKeys(rect.property("ADBE Vector Rect Roundness"),times,radiusValues,72);
        applySegmentInterpolation(mediaPosition,easings);applySegmentInterpolation(mediaScaleProp,easings);applySegmentInterpolation(backgroundOpacity,easings);applySegmentInterpolation(mattePosition,easings);applySegmentInterpolation(matteSize,easings);applySegmentInterpolation(matteRadius,easings);
        selectOnly(c, media);
        return { media:media,matte:matte,background:background,width:finalSize[0],height:finalSize[1],scale:finalScaleValue,mediaScale:contentPct,frameWidth:frameWidth,frameHeight:frameHeight,durationFrames:duration,initialEasing:initialEasing,animateOut:animateOut,introEnd:introEnd,exitStart:animateOut?exitStart:null,stages:stages,totalKeys:times.length };
    };
    api.applyBlurredBackdrop = function (options) {
        var c = activeComp(), p = selectedMedia(c, 1, "Usa video, imagen o precomposicion."), media = p.layers[0], box = p.boxes[0];
        var pct = number(options.size, "Frente", 10, 100), rad = number(options.radius, "Radio", 0, 1000), blur = number(options.blur, "Blur", 0, 3000), dim = number(options.dim, "Oscurecer", 0, 90);
        var timing=layoutAnimationTiming(c,[media],options,"Backdrop Blur"), sourceState=visualState(media,box);
        var backdrop = media.duplicate(); backdrop.name = uniqueLayerName(c, "QE Blurred Backdrop"); backdrop.moveAfter(media);
        var backState=visualState(backdrop,box),backFrame=targetFrameState(box,backState,c.width*1.08,c.height*1.08,c.width/2,c.height/2,"cover");
        backdrop.transform.anchorPoint.setValue(backState.sourceCenter); backdrop.transform.position.setValue(backFrame.position); backdrop.transform.scale.setValue(backFrame.scale);
        var effect = addGaussianBlur(backdrop, 0), base = addCompSolid(c, "#000000", "QE Backdrop Base"); base.moveAfter(backdrop);
        var frontFrame=targetFrameState(box,sourceState,c.width*pct/100,c.height*pct/100,c.width/2,c.height/2,"fit");
        frontFrame.position=framedPosition(c,options,frontFrame.width,frontFrame.height,0,[c.width/2,c.height/2]);
        var start=animateLayerToFrame(media,box,frontFrame,timing);
        setKeys(backdrop.transform.opacity,timing.times,animatedPair(timing,0,100-dim),66);
        setKeys(effect.property("Blurriness"),timing.times,animatedPair(timing,0,blur),66);
        setKeys(base.transform.opacity,timing.times,animatedPair(timing,0,100),66);
        var matte=addRoundedMatte(c,media,frontFrame.width,frontFrame.height,rad,frontFrame.position[0],frontFrame.position[1],"QE Front Matte");
        animateLayoutMatte(matte,start,frontFrame,rad,timing); enableLayoutMotionBlur(c,[media,matte],bool(options.motionBlur)); selectOnly(c,media);
        return { media:media,matte:matte,backdrop:backdrop,base:base,effect:effect,front:frontFrame,back:backFrame,durationFrames:timing.durationFrames,animateOut:timing.animateOut,exitStart:timing.animateOut?timing.exitStart:null };
    };
    api.applyPictureInPicture = function (options) {
        var c = activeComp(), p = selectedMedia(c, 2, "La capa superior sera la ventana PiP."), front = p.layers[0], back = p.layers[1];
        var pct = number(options.size, "Ventana", 12, 70), margin = number(options.margin, "Margen", 0, 1000), rad = number(options.radius, "Radio", 0, 1000);
        var timing=layoutAnimationTiming(c,[front,back],options,"PiP"),frontState=visualState(front,p.boxes[0]),backState=visualState(back,p.boxes[1]);
        var frame=targetFrameState(p.boxes[0],frontState,c.width*pct/100,c.height*pct/100,c.width/2,c.height/2,"fit"), halfW = frame.width / 2, halfH = frame.height / 2;
        if (margin + halfW > c.width / 2 || margin + halfH > c.height / 2) fail("El tamano y el margen no caben en la composicion.");
        var right = options.corner === "topRight" || options.corner === "bottomRight", bottom = options.corner === "bottomRight" || options.corner === "bottomLeft";
        if (!right && !bottom && options.corner !== "topLeft") fail("Esquina PiP no valida.");
        var x = right ? c.width - margin - halfW : margin + halfW, y = bottom ? c.height - margin - halfH : margin + halfH;
        var pipPosition = framedPosition(c, options, frame.width, frame.height, margin, [x,y]); x = pipPosition[0]; y = pipPosition[1];
        frame.position=[x,y]; var backFrame=targetFrameState(p.boxes[1],backState,c.width,c.height,c.width/2,c.height/2,"cover");
        var frontStart=animateLayerToFrame(front,p.boxes[0],frame,timing); animateLayerToFrame(back,p.boxes[1],backFrame,timing); back.moveAfter(front);
        var matte = addRoundedMatte(c, front, frame.width, frame.height, rad, x, y, "QE PiP Matte"); animateLayoutMatte(matte,frontStart,frame,rad,timing);
        enableLayoutMotionBlur(c,[front,back,matte],bool(options.motionBlur)); selectOnly(c, front);
        return { foreground:front,background:back,matte:matte,width:frame.width,height:frame.height,x:x,y:y,durationFrames:timing.durationFrames,animateOut:timing.animateOut,exitStart:timing.animateOut?timing.exitStart:null };
    };
    api.applySplitScreen = function (options) {
        var c = activeComp(), p = selectedMedia(c, 2, "La capa superior ira a la izquierda."), left = p.layers[0], right = p.layers[1];
        var margin = number(options.margin, "Margen", 0, 1000), gap = number(options.gap, "Separacion", 0, 1000), rad = number(options.radius, "Radio", 0, 1000);
        var panelW = (c.width - margin * 2 - gap) / 2, panelH = c.height - margin * 2; if (panelW <= 1 || panelH <= 1) fail("El margen y la separacion no dejan espacio util.");
        var timing=layoutAnimationTiming(c,[left,right],options,"Split Screen"),leftState=visualState(left,p.boxes[0]),rightState=visualState(right,p.boxes[1]);
        var lx = margin + panelW / 2, rx = c.width - margin - panelW / 2, cy = c.height / 2;
        var leftFrame=targetFrameState(p.boxes[0],leftState,panelW,panelH,lx,cy,"cover"),rightFrame=targetFrameState(p.boxes[1],rightState,panelW,panelH,rx,cy,"cover");
        var leftStart=animateLayerToFrame(left,p.boxes[0],leftFrame,timing),rightStart=animateLayerToFrame(right,p.boxes[1],rightFrame,timing);
        var leftMatte=addRoundedMatte(c,left,panelW,panelH,rad,lx,cy,"QE Left Matte"),rightMatte=addRoundedMatte(c,right,panelW,panelH,rad,rx,cy,"QE Right Matte");
        var leftMaskFrame={position:[lx,cy],width:panelW,height:panelH},rightMaskFrame={position:[rx,cy],width:panelW,height:panelH};
        animateLayoutMatte(leftMatte,leftStart,leftMaskFrame,rad,timing); animateLayoutMatte(rightMatte,rightStart,rightMaskFrame,rad,timing);
        var background=addCompSolid(c,options.background,"QE Split Background"); setKeys(background.transform.opacity,timing.times,animatedPair(timing,0,100),66);
        if(left.index>right.index)background.moveAfter(left);else background.moveAfter(right); enableLayoutMotionBlur(c,[left,right,leftMatte,rightMatte],bool(options.motionBlur)); selectOnly(c,left);
        return { left:left,right:right,leftMatte:leftMatte,rightMatte:rightMatte,background:background,panelWidth:panelW,panelHeight:panelH,durationFrames:timing.durationFrames,animateOut:timing.animateOut,exitStart:timing.animateOut?timing.exitStart:null };
    };
    function addTitleBox(c,width,height,radius,color,name) {
        var layer=c.layers.addShape(),group=layer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"),contents=group.property("ADBE Vectors Group"),rect=contents.addProperty("ADBE Vector Shape - Rect");
        layer.name=uniqueLayerName(c,name||"QE Titulo · Caja");group.name="Caja adaptable";rect.property("ADBE Vector Rect Size").setValue([width,height]);rect.property("ADBE Vector Rect Position").setValue([0,0]);rect.property("ADBE Vector Rect Roundness").setValue(Math.min(radius,width/2,height/2));
        contents.addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue(rgba(color));layer.transform.anchorPoint.setValue([0,0]);return layer;
    }
    api.applySmartTitle = function(options) {
        var c=activeComp(),selected=c.selectedLayers,textLayer,created=false;
        if(selected.length>1)fail("Selecciona una sola capa de texto o ninguna para crearla.");
        if(selected.length===1){textLayer=selected[0];try{if(!textLayer.property("ADBE Text Properties"))fail("La capa seleccionada no es texto.");}catch(ignoreTextCheck){fail("La capa seleccionada no es texto.");}}
        else{textLayer=c.layers.addText(String(options.text||"Tu titulo"));textLayer.name=uniqueLayerName(c,"QE Titulo · Texto");textLayer.inPoint=c.time;textLayer.outPoint=c.duration;created=true;}
        assertStatic(textLayer.transform.position,"Texto / Position");assertStatic(textLayer.transform.opacity,"Texto / Opacity");
        var source=textLayer.property("ADBE Text Properties").property("ADBE Text Document"),doc=source.value,fontSize=number(options.fontSize,"Tamano texto",8,500);
        doc.text=String(options.text||doc.text||"Tu titulo");doc.fontSize=fontSize;doc.fillColor=rgb(options.textColor);try{doc.justification=ParagraphJustification.CENTER_JUSTIFY;}catch(ignoreJustification){}source.setValue(doc);
        var box=textLayer.sourceRectAtTime(c.time,true),padX=number(options.paddingX,"Margen horizontal",0,500),padY=number(options.paddingY,"Margen vertical",0,500),radius=number(options.radius,"Radio",0,500),offset=number(options.offset,"Desplazamiento",0,500);
        var width=Math.max(4,box.width+padX*2),height=Math.max(4,box.height+padY*2),target=optionPosition(c,options,[c.width/2,c.height/2]),sourceCenter=[box.left+box.width/2,box.top+box.height/2];
        textLayer.transform.anchorPoint.setValue(sourceCenter);var background=addTitleBox(c,width,height,radius,options.boxColor,"QE Titulo · Caja");background.inPoint=textLayer.inPoint;background.outPoint=textLayer.outPoint;background.transform.position.setValue(target);background.moveAfter(textLayer);
        var duration=frameCount(options.durationFrames,"Entrada",1,240),d=c.frameDuration,t=Math.max(c.time,textLayer.inPoint),intro=t+duration*d;if(intro>textLayer.outPoint)fail("La capa de texto no dura lo suficiente para la entrada.");
        var from=[target[0],target[1]+offset],times=[t,intro],positions=[from,target],alphas=[0,100],animateOut=bool(options.animateOut),exitEnd=textLayer.outPoint,exitStart=exitEnd-duration*d;
        if(animateOut){if(exitStart<intro)fail("La capa de texto no dura lo suficiente para entrada y salida.");times.push(exitStart);times.push(exitEnd);positions.push(target);positions.push([target[0],target[1]-offset]);alphas.push(100);alphas.push(0);}
        setKeys(textLayer.transform.position,times,positions,72);setKeys(background.transform.position,times,positions,72);setKeys(textLayer.transform.opacity,times,alphas,66);setKeys(background.transform.opacity,times,alphas,66);
        if(bool(options.motionBlur)){c.motionBlur=true;textLayer.motionBlur=true;background.motionBlur=true;}selectOnly(c,textLayer);
        return {text:textLayer,background:background,createdText:created,width:width,height:height,durationFrames:duration,animateOut:animateOut};
    };
    api.applyRecipe = function (preset) {
        if (!preset || !RECIPES[preset.recipe]) fail("La receta seleccionada no esta disponible.");
        var c=activeComp(),context=captureApplicationContext(c),result=null;
        if (preset.recipe === "roundedMedia") result=api.applyRoundedMedia(preset);
        else if (preset.recipe === "blurredBackdrop") result=api.applyBlurredBackdrop(preset);
        else if (preset.recipe === "pictureInPicture") result=api.applyPictureInPicture(preset);
        else if (preset.recipe === "splitScreen") result=api.applySplitScreen(preset);
        else if (preset.recipe === "cascadeCover") result=api.applyCascadeCover(preset);
        else if (preset.recipe === "impactScale") result=api.applyImpactScale(preset);
        else if (preset.recipe === "popIn") result=api.applyPopIn(preset);
        else if (preset.recipe === "popOut") result=api.applyPopOut(preset);
        else if (preset.recipe === "hitShake") result=api.applyHitShake(preset);
        else if (preset.recipe === "slideOvershoot") result=api.applySlideOvershoot(preset);
        else if (preset.recipe === "fadeScale") result=api.applyFadeScale(preset);
        else if (preset.recipe === "pulseLoop") result=api.applyPulseLoop(preset);
        else if (preset.recipe === "handheld") result=api.applyHandheld(preset);
        else if (preset.recipe === "smartTitle") result=api.applySmartTitle(preset);
        else fail("La receta seleccionada no esta disponible.");
        return finalizeRecipeApplication(preset,result,context);
    };

    function selectedAnimatedProperties() {
        var c=activeComp(),items=c.selectedProperties||[],out=[],i,p,keys;
        for(i=0;i<items.length;i++){p=items[i];try{keys=p.selectedKeys;if(p.numKeys>0&&keys&&keys.length)out.push({property:p,keys:keys});}catch(ignoreSelectedProperty){}}
        return out;
    }
    function easeArrayForKey(prop,key,influence) {
        var count=1,i,out=[];try{count=Math.max(1,prop.keyInTemporalEase(key).length);}catch(ignoreEaseDimension){}
        for(i=0;i<count;i++)out.push(new KeyframeEase(0,influence));return out;
    }
    function applyCurveToProperty(prop,keys,mode,strength) {
        var i,key,influence=Math.max(1,Math.min(100,Number(strength)||66)),incoming,outgoing;
        for(i=0;i<keys.length;i++){key=keys[i];
            if(mode==="linear"){prop.setInterpolationTypeAtKey(key,KeyframeInterpolationType.LINEAR,KeyframeInterpolationType.LINEAR);continue;}
            if(mode==="hold"){prop.setInterpolationTypeAtKey(key,KeyframeInterpolationType.HOLD,KeyframeInterpolationType.HOLD);continue;}
            incoming=easeArrayForKey(prop,key,mode==="easeOut"?20:influence);outgoing=easeArrayForKey(prop,key,mode==="easeIn"?20:influence);
            prop.setTemporalAutoBezierAtKey(key,false);prop.setTemporalContinuousAtKey(key,false);prop.setTemporalEaseAtKey(key,incoming,outgoing);prop.setInterpolationTypeAtKey(key,KeyframeInterpolationType.BEZIER,KeyframeInterpolationType.BEZIER);
        }
    }
    api.applyKeyframeCurve=function(options){var entries=selectedAnimatedProperties(),i;if(!entries.length)fail("Selecciona uno o mas keyframes en la linea de tiempo.");for(i=0;i<entries.length;i++)applyCurveToProperty(entries[i].property,entries[i].keys,options.mode||"both",options.strength===undefined?66:options.strength);return {properties:entries.length};};
    api.copySelectedCurve=function(){var entries=selectedAnimatedProperties(),p,key;if(!entries.length)fail("Selecciona un keyframe para copiar su curva.");p=entries[0].property;key=entries[0].keys[0];copiedCurve={inType:p.keyInInterpolationType(key),outType:p.keyOutInterpolationType(key),incoming:p.keyInTemporalEase(key),outgoing:p.keyOutTemporalEase(key)};return copiedCurve;};
    api.pasteSelectedCurve=function(){var entries=selectedAnimatedProperties(),i,j,p,key;if(!copiedCurve)fail("Primero copia una curva.");if(!entries.length)fail("Selecciona keyframes de destino.");for(i=0;i<entries.length;i++){p=entries[i].property;for(j=0;j<entries[i].keys.length;j++){key=entries[i].keys[j];p.setInterpolationTypeAtKey(key,copiedCurve.inType,copiedCurve.outType);try{p.setTemporalEaseAtKey(key,copiedCurve.incoming,copiedCurve.outgoing);}catch(ignoreCurveDimension){}}}return {properties:entries.length};};
    function offsetPropertyKeys(prop,keys,seconds) {
        var data=[],i,key,newIndex;
        for(i=0;i<keys.length;i++){key=keys[i];data.push({time:prop.keyTime(key)+seconds,value:cloneValue(prop.keyValue(key)),inType:prop.keyInInterpolationType(key),outType:prop.keyOutInterpolationType(key),incoming:prop.keyInTemporalEase(key),outgoing:prop.keyOutTemporalEase(key)});}
        keys=keys.slice(0).sort(function(a,b){return b-a;});for(i=0;i<keys.length;i++)prop.removeKey(keys[i]);
        data.sort(function(a,b){return a.time-b.time;});for(i=0;i<data.length;i++){prop.setValueAtTime(Math.max(0,data[i].time),data[i].value);newIndex=prop.nearestKeyIndex(Math.max(0,data[i].time));try{prop.setInterpolationTypeAtKey(newIndex,data[i].inType,data[i].outType);prop.setTemporalEaseAtKey(newIndex,data[i].incoming,data[i].outgoing);}catch(ignoreMovedEase){}}
    }
    api.offsetSelectedKeyframes=function(frames){var c=activeComp(),entries=selectedAnimatedProperties(),i;if(!entries.length)fail("Selecciona keyframes para desplazarlos.");frames=number(frames,"Desplazamiento",-100000,100000);for(i=0;i<entries.length;i++)offsetPropertyKeys(entries[i].property,entries[i].keys,frames*c.frameDuration);return {properties:entries.length,frames:frames};};
    function orderedLayers(c,layers,order,reverse) {
        var out=layers.slice(0),cx=c.width/2,cy=c.height/2;
        out.sort(function(a,b){var pa=a.transform.position.value,pb=b.transform.position.value;if(order==="left")return pa[0]-pb[0];if(order==="right")return pb[0]-pa[0];if(order==="top")return pa[1]-pb[1];if(order==="bottom")return pb[1]-pa[1];if(order==="center")return Math.sqrt(Math.pow(pa[0]-cx,2)+Math.pow(pa[1]-cy,2))-Math.sqrt(Math.pow(pb[0]-cx,2)+Math.pow(pb[1]-cy,2));if(order==="random")return ((a.id*9301+49297)%233280)-((b.id*9301+49297)%233280);return a.index-b.index;});
        if(reverse)out.reverse();return out;
    }
    function ownerLayerOfProperty(prop){try{return prop.propertyGroup(prop.propertyDepth);}catch(ignoreOwner){return null;}}
    api.applyStagger=function(options){var c=activeComp(),step=frameCount(options.stepFrames,"Separacion",-600,600),mode=options.mode||"layers",order=options.order||"timeline",reverse=bool(options.reverse),layers=orderedLayers(c,c.selectedLayers,order,reverse),i,j,entries,owner,groups={},groupOrder=[];
        if(!layers.length)fail("Selecciona dos o mas capas para secuenciar.");
        if(mode==="layers"){for(i=0;i<layers.length;i++)layers[i].startTime+=i*step*c.frameDuration;return {layers:layers.length,frames:step};}
        entries=selectedAnimatedProperties();if(!entries.length)fail("Selecciona keyframes en las capas que quieres escalonar.");
        for(i=0;i<entries.length;i++){owner=ownerLayerOfProperty(entries[i].property);if(!owner)continue;if(!groups[owner.id]){groups[owner.id]=[];groupOrder.push(owner.id);}groups[owner.id].push(entries[i]);}
        layers=orderedLayers(c,layers,order,reverse);for(i=0;i<layers.length;i++)if(groups[layers[i].id])for(j=0;j<groups[layers[i].id].length;j++)offsetPropertyKeys(groups[layers[i].id][j].property,groups[layers[i].id][j].keys,i*step*c.frameDuration);
        return {layers:layers.length,frames:step};
    };
    api.undo=function(){activeInstanceMeta=null;if(applyButton)applyButton.text="APLICAR";return app.run("edit.undo",{});};
    api.redo=function(){activeInstanceMeta=null;if(applyButton)applyButton.text="APLICAR";return app.run("edit.redo",{});};

    function parseField(field, value) {
        if (field.type === "number") return number(value, field.label, field.min, field.max);
        if (field.type === "color") return hex(value);
        if (field.type === "bool") return bool(value);
        if (field.type === "choice") { var i; for (i = 0; i < field.options.length; i++) if (field.options[i].value === value) return value; fail(field.label + ": opcion no valida."); }
        return trim(value);
    }
    function defaultPositionForPreset(source) {
        if (source && source.recipe === "pictureInPicture") {
            var corner = source.corner || "topRight";
            return {
                x: corner === "topRight" || corner === "bottomRight" ? 100 : 0,
                y: corner === "bottomRight" || corner === "bottomLeft" ? 100 : 0
            };
        }
        return { x: 50, y: 50 };
    }
    function normalizeRoundedStages(source) {
        if (source === undefined || source === null) return [];
        if (!(source instanceof Array)) fail("Las etapas Rounded no son validas.");
        var out=[],i,item,time,easing,legacySize,legacy;
        for(i=0;i<source.length;i++) {
            item=source[i]||{}; time=number(item.timeSeconds,"Tiempo de etapa",0.01,86400); easing=item.easing === "linear" ? "linear" : "bezier";legacy=item.frameWidth===undefined&&item.frameHeight===undefined&&item.size!==undefined;legacySize=item.size===undefined?82:item.size;
            out.push({ id:String(item.id||("stage-"+(i+1))), timeSeconds:time, positionX:number(item.positionX,"Posicion X",0,100), positionY:number(item.positionY,"Posicion Y",0,100), frameWidth:number(item.frameWidth===undefined?legacySize:item.frameWidth,"Ancho marco",10,100), frameHeight:number(item.frameHeight===undefined?legacySize:item.frameHeight,"Alto marco",10,100), mediaScale:number(item.mediaScale===undefined?100:item.mediaScale,"Escala medio",10,400), radius:number(item.radius,"Radio",0,1000), easing:easing,legacySize:legacy });
        }
        out.sort(function(a,b){return a.timeSeconds-b.timeSeconds;});
        for(i=1;i<out.length;i++) if(Math.abs(out[i].timeSeconds-out[i-1].timeSeconds)<0.000001) fail("Cada etapa Rounded debe tener un tiempo distinto.");
        return out;
    }
    function allPresets() { return BUILT_INS.slice(0); }
    function loadRecipeLibrary(){if(recipeLibrary!==null)return recipeLibrary;recipeLibrary=[];try{if(app.settings.haveSetting(SETTINGS_SECTION,LIBRARY_KEY)){var parsed=JSON.parse(app.settings.getSetting(SETTINGS_SECTION,LIBRARY_KEY)),i,item;for(i=0;i<parsed.length;i++){item=parsed[i];if(item&&item.name&&item.preset&&RECIPES[item.preset.recipe])recipeLibrary.push(item);}}}catch(ignoreLibraryLoad){recipeLibrary=[];}return recipeLibrary;}
    function saveRecipeLibrary(){try{app.settings.saveSetting(SETTINGS_SECTION,LIBRARY_KEY,JSON.stringify(loadRecipeLibrary()));}catch(e){fail("No se pudo guardar la biblioteca: "+e.message);}}
    function openRecipeLibrary(){
        if(libraryWindow){try{libraryWindow.show();libraryWindow.active=true;return libraryWindow;}catch(ignoreExistingLibrary){libraryWindow=null;}}
        var dialog=new Window("palette","Biblioteca · Quick Edit EC",undefined,{resizeable:true});libraryWindow=dialog;dialog.orientation="column";dialog.alignChildren=["fill","top"];dialog.spacing=8;dialog.margins=10;dialog.minimumSize=[430,340];
        var search=dialog.add("edittext",undefined,"",{name:"library_search"});search.helpTip="Buscar por nombre o receta";
        var list=dialog.add("listbox",undefined,[],{name:"library_list"});list.preferredSize=[410,210];
        var nameRow=dialog.add("group");nameRow.orientation="row";nameRow.add("statictext",undefined,"Nombre");var name=nameRow.add("edittext",undefined,"Mi receta",{name:"library_name"});name.preferredSize=[340,24];
        var row1=dialog.add("group"),row2=dialog.add("group");row1.orientation=row2.orientation="row";row1.spacing=row2.spacing=6;
        var save=row1.add("button",undefined,"Guardar actual",{name:"library_save"}),load=row1.add("button",undefined,"Cargar",{name:"library_load"}),remove=row1.add("button",undefined,"Eliminar",{name:"library_delete"});
        var exportButton=row2.add("button",undefined,"Exportar JSON",{name:"library_export"}),importButton=row2.add("button",undefined,"Importar JSON",{name:"library_import"}),close=row2.add("button",undefined,"Cerrar");
        function refresh(){var q=String(search.text||"").toLowerCase(),items=loadRecipeLibrary(),i,item;list.removeAll();for(i=0;i<items.length;i++){item=items[i];if(q&&String(item.name+" "+item.preset.recipe).toLowerCase().indexOf(q)<0)continue;var entry=list.add("item",item.name+"  ·  "+RECIPES[item.preset.recipe].title);entry.libraryItem=item;}if(list.items.length)list.selection=0;}
        search.onChanging=refresh;
        save.onClick=function(){var title=trim(name.text);if(!title){alert("Escribe un nombre para la receta.");return;}try{var preset=readForm(),items=loadRecipeLibrary(),i;for(i=items.length-1;i>=0;i--)if(items[i].name===title)items.splice(i,1);preset.id="library-"+(new Date().getTime());preset.name=title;items.unshift({name:title,created:new Date().getTime(),preset:preset});saveRecipeLibrary();refresh();}catch(e){alert("Biblioteca\n\n"+e.message);}};
        load.onClick=function(){if(!list.selection)return;fillForm(list.selection.libraryItem.preset);activeInstanceMeta=null;applyButton.text="APLICAR";syncPreviewAspect();refreshRealPreview(true);};
        remove.onClick=function(){if(!list.selection)return;var target=list.selection.libraryItem,items=loadRecipeLibrary(),i;for(i=items.length-1;i>=0;i--)if(items[i]===target)items.splice(i,1);saveRecipeLibrary();refresh();};
        exportButton.onClick=function(){try{var file=File.saveDialog("Exportar biblioteca Quick Edit EC","JSON:*.json");if(!file)return;if(!/\.json$/i.test(file.name))file=new File(file.fsName+".json");if(!file.open("w"))fail("No se pudo abrir el archivo.");file.encoding="UTF-8";file.write(JSON.stringify({schema:1,version:VERSION,recipes:loadRecipeLibrary()},null,2));file.close();}catch(e){alert("Exportar biblioteca\n\n"+e.message);}};
        importButton.onClick=function(){try{var file=File.openDialog("Importar biblioteca Quick Edit EC","JSON:*.json");if(!file)return;if(!file.open("r"))fail("No se pudo abrir el archivo.");file.encoding="UTF-8";var data=JSON.parse(file.read());file.close();var incoming=data.recipes||data,items=loadRecipeLibrary(),i,item;if(!(incoming instanceof Array))fail("El archivo no contiene una biblioteca valida.");for(i=0;i<incoming.length;i++){item=incoming[i];if(item&&item.name&&item.preset&&RECIPES[item.preset.recipe])items.push(item);}saveRecipeLibrary();refresh();}catch(e){alert("Importar biblioteca\n\n"+e.message);}};
        close.onClick=function(){dialog.close();};dialog.onClose=function(){libraryWindow=null;};refresh();dialog.center();dialog.show();return dialog;
    }
    function fieldValue(control, spec) { if (spec.type === "choice") return control.selection ? control.selection.value : ""; if (spec.type === "bool") return control.value; return control.text; }
    function readForm() {
        var selected=catalog&&catalog.selection?catalog.selection.preset:null,out = { id: selected?selected.id:("current-"+currentRecipe), user: false, recipe: currentRecipe, name: selected?selected.name:RECIPES[currentRecipe].title }, fields = RECIPES[currentRecipe].fields, i;
        for (i = 0; i < fields.length; i++) out[fields[i].key] = parseField(fields[i], fieldValue(fieldControls[fields[i].key], fields[i]));
        out.positionX = currentRecipe === "roundedMedia" ? roundedInitialState.positionX : positionState.x;
        out.positionY = currentRecipe === "roundedMedia" ? roundedInitialState.positionY : positionState.y;
        if(currentRecipe === "roundedMedia") { out.durationFrames=roundedInitialState.durationFrames;out.frameWidth=roundedInitialState.frameWidth;out.frameHeight=roundedInitialState.frameHeight;out.mediaScale=roundedInitialState.mediaScale;out.radius=roundedInitialState.radius;out.initialEasing=roundedInitialState.easing;out.stages=normalizeRoundedStages(roundedStages); }
        return out;
    }
    function displayNumber(value, spec) {
        var decimal = spec.min % 1 !== 0 || spec.max % 1 !== 0 || spec.value % 1 !== 0;
        return String(decimal ? Math.round(value * 10) / 10 : Math.round(value));
    }
    function sectionFor(spec) {
        if (spec.type === "color") return "COLORES";
        if (spec.type === "bool") return "OPCIONES";
        if (/Frames$/.test(spec.key) || spec.key === "halfFrames") return "TIEMPO";
        return "FORMA Y MOVIMIENTO";
    }
    function updateConditionalRows() {
        if (!currentRecipe) return;
        var fields = RECIPES[currentRecipe].fields, i, condition, controllerSpec, actual;
        for (i = 0; i < fields.length; i++) {
            condition = fields[i].visibleWhen;
            if (!condition) continue;
            controllerSpec = null;
            var j; for (j = 0; j < fields.length; j++) if (fields[j].key === condition.key) { controllerSpec = fields[j]; break; }
            actual = controllerSpec && fieldControls[condition.key] ? fieldValue(fieldControls[condition.key], controllerSpec) : "";
            if (fieldRows[fields[i].key]) fieldRows[fields[i].key].visible = condition.minValue !== undefined ? Number(actual) >= condition.minValue : actual === condition.value;
        }
        ui.layout.layout(true);
        refreshLeftScroll(false);
        refreshRightScroll(false);
    }
    function leftScrollMetrics() {
        var height = leftScrollTrack ? Math.max(1, Number(leftScrollTrack.size.height) || 1) : 1;
        var thumb = leftScrollState.max > 0 ? Math.max(34, height * height / (height + leftScrollState.max)) : height;
        thumb = Math.min(height, thumb);
        var travel = Math.max(0, height - thumb);
        var top = leftScrollState.max > 0 && travel > 0 ? travel * leftScrollState.offset / leftScrollState.max : 0;
        return { height: height, thumb: thumb, travel: travel, top: top };
    }
    function drawLeftScroll() {
        var g = this.graphics, w = this.size.width, m = leftScrollMetrics();
        fillPreviewRect(g, 0, 0, w, m.height, [0.075,0.08,0.09,1]);
        fillPreviewRoundRect(g, 3, m.top, Math.max(4,w-6), m.thumb, Math.max(2,(w-6)/2), leftScrollState.max > 0 ? [0.34,0.37,0.42,1] : [0.17,0.18,0.20,1]);
    }
    function setLeftScroll(value, relayout) {
        var width = leftContentHost ? Math.max(390, Number(leftContentHost.size.width) || 390) : 390;
        leftScrollState.offset = Math.max(0, Math.min(leftScrollState.max, Number(value) || 0));
        if (leftColumn) leftColumn.bounds = [0, -leftScrollState.offset, width, LEFT_CONTENT_HEIGHT - leftScrollState.offset];
        if (relayout && ui) ui.layout.layout(true);
        return leftScrollState.offset;
    }
    function measureLeftContent() {
        if (!leftColumn) return 0;
        var bottom = 0, i, child, bounds;
        for (i = 0; i < leftColumn.children.length; i++) {
            child = leftColumn.children[i];
            if (child.visible === false) continue;
            bounds = child.bounds;
            bottom = Math.max(bottom, Number(bounds[3]) || 0);
        }
        return bottom + 8;
    }
    function refreshLeftScroll(reset) {
        if (!ui || !leftColumn || !leftContentHost || !leftScrollTrack) return;
        try {
            ui.layout.layout(true);
            var viewportHeight = Math.max(1, Number(leftContentHost.size.height) || 520);
            leftScrollTrack.preferredSize = [16, Math.max(90, viewportHeight - 46)];
            leftScrollState.max = Math.max(0, measureLeftContent() - viewportHeight);
            setLeftScroll(reset ? 0 : leftScrollState.offset, false);
            leftScrollUp.enabled = leftScrollDown.enabled = leftScrollState.max > 0;
            ui.layout.layout(true);
        } catch (ignoreLeftScrollLayout) {}
    }
    function scrollLeftFromTrack(y, preserveGrab) {
        var m = leftScrollMetrics();
        if (leftScrollState.max <= 0 || m.travel <= 0) return;
        var top = preserveGrab ? y - leftScrollState.grab : y - m.thumb / 2;
        setLeftScroll(Math.max(0, Math.min(m.travel, top)) / m.travel * leftScrollState.max, true);
    }
    function rightScrollMetrics() {
        var height = rightScrollTrack ? Math.max(1, Number(rightScrollTrack.size.height) || 1) : 1;
        var thumb = rightScrollState.max > 0 ? Math.max(34, height * height / (height + rightScrollState.max)) : height;
        thumb = Math.min(height, thumb);
        var travel = Math.max(0, height - thumb);
        var top = rightScrollState.max > 0 && travel > 0 ? travel * rightScrollState.offset / rightScrollState.max : 0;
        return { height: height, thumb: thumb, travel: travel, top: top };
    }
    function drawRightScroll() {
        var g = this.graphics, w = this.size.width, m = rightScrollMetrics();
        fillPreviewRect(g, 0, 0, w, m.height, [0.075,0.08,0.09,1]);
        fillPreviewRoundRect(g, 3, m.top, Math.max(4,w-6), m.thumb, Math.max(2,(w-6)/2), rightScrollState.max > 0 ? [0.34,0.37,0.42,1] : [0.17,0.18,0.20,1]);
    }
    function setRightScroll(value, relayout) {
        var width = rightContentHost ? Math.max(320, Number(rightContentHost.size.width) || 338) : 338;
        rightScrollState.offset = Math.max(0, Math.min(rightScrollState.max, Number(value) || 0));
        if (rightColumn) rightColumn.bounds = [0, -rightScrollState.offset, width, RIGHT_CONTENT_HEIGHT - rightScrollState.offset];
        if (relayout && ui) ui.layout.layout(true);
        return rightScrollState.offset;
    }
    function measureRightContent() {
        if (!rightColumn) return 0;
        var bottom = 0, i, child, bounds;
        for (i = 0; i < rightColumn.children.length; i++) {
            child = rightColumn.children[i];
            if (child.visible === false) continue;
            bounds = child.bounds;
            bottom = Math.max(bottom, Number(bounds[3]) || 0);
        }
        return bottom + 8;
    }
    function refreshRightScroll(reset) {
        if (!ui || !rightColumn || !rightContentHost || !rightScrollTrack) return;
        try {
            ui.layout.layout(true);
            var viewportHeight = Math.max(1, Number(rightContentHost.size.height) || 520);
            rightScrollTrack.preferredSize = [16, Math.max(90, viewportHeight - 46)];
            rightScrollState.max = Math.max(0, measureRightContent() - viewportHeight);
            setRightScroll(reset ? 0 : rightScrollState.offset, false);
            rightScrollUp.enabled = rightScrollDown.enabled = rightScrollState.max > 0;
            ui.layout.layout(true);
        } catch (ignoreScrollLayout) {}
    }
    function scrollRightFromTrack(y, preserveGrab) {
        var m = rightScrollMetrics();
        if (rightScrollState.max <= 0 || m.travel <= 0) return;
        var top = preserveGrab ? y - rightScrollState.grab : y - m.thumb / 2;
        setRightScroll(Math.max(0, Math.min(m.travel, top)) / m.travel * rightScrollState.max, true);
    }
    function twoHex(value) { var s = Math.max(0, Math.min(255, Math.round(value))).toString(16).toUpperCase(); return s.length < 2 ? "0" + s : s; }
    function rgbToHsvValue(color) {
        var r=color[0],g=color[1],b=color[2],max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min,h=0,s=max===0?0:d/max;
        if(d!==0){ if(max===r) h=((g-b)/d)%6; else if(max===g) h=(b-r)/d+2; else h=(r-g)/d+4; h/=6; if(h<0) h+=1; }
        return [h,s,max];
    }
    function hsvToRgbValue(hsv) {
        var h=((hsv[0]%1)+1)%1,s=Math.max(0,Math.min(1,hsv[1])),v=Math.max(0,Math.min(1,hsv[2]));
        var i=Math.floor(h*6),f=h*6-i,p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s);
        if(i%6===0) return [v,t,p]; if(i===1) return [q,v,p]; if(i===2) return [p,v,t]; if(i===3) return [p,q,v]; if(i===4) return [t,p,v]; return [v,p,q];
    }
    function chooseColor(initial) {
        var normalized=hex(initial),base=rgb(normalized),hsv=rgbToHsvValue(base),values=[Math.round(base[0]*255),Math.round(base[1]*255),Math.round(base[2]*255)],squareDrag=false,hueDrag=false;
        var dialog=new Window("dialog","Selector de color"); dialog.orientation="column"; dialog.alignChildren=["fill","top"]; dialog.spacing=8; dialog.margins=12;
        var pickerRow=dialog.add("group"); pickerRow.orientation="row"; pickerRow.alignChildren=["left","top"]; pickerRow.spacing=8;
        var square=pickerRow.add("group",undefined,undefined,{name:"color_square"}); square.preferredSize=[258,258]; square.minimumSize=[258,258]; square.maximumSize=[258,258];
        var hue=pickerRow.add("group",undefined,undefined,{name:"color_hue"}); hue.preferredSize=[24,258]; hue.minimumSize=[24,258]; hue.maximumSize=[24,258];
        var hexEdit,rgbEdits=[],hsvLabel,currentSwatch;
        function syncFields(){
            var c=hsvToRgbValue(hsv); values=[Math.round(c[0]*255),Math.round(c[1]*255),Math.round(c[2]*255)];
            if(hexEdit) hexEdit.text="#"+twoHex(values[0])+twoHex(values[1])+twoHex(values[2]);
            var i; for(i=0;i<rgbEdits.length;i++) rgbEdits[i].text=String(values[i]);
            if(hsvLabel) hsvLabel.text="H "+Math.round(hsv[0]*360)+"°   S "+Math.round(hsv[1]*100)+"%   B "+Math.round(hsv[2]*100)+"%";
        }
        square.onDraw=function(){
            var g=this.graphics,w=this.size.width,h=this.size.height,steps=32,ix,iy,c,x,y,cw=w/steps,ch=h/steps;
            fillPreviewRect(g,0,0,w,h,[0,0,0,1]);
            for(iy=0;iy<steps;iy++) for(ix=0;ix<steps;ix++){ c=hsvToRgbValue([hsv[0],(ix+.5)/steps,1-(iy+.5)/steps]); fillPreviewRect(g,ix*cw,iy*ch,cw+1,ch+1,[c[0],c[1],c[2],1]); }
            x=hsv[1]*w; y=(1-hsv[2])*h; g.newPath(); g.ellipsePath(x-6,y-6,12,12); g.strokePath(g.newPen(g.PenType.SOLID_COLOR,hsv[2]>.55?[0.08,0.08,0.08,1]:[1,1,1,1],2));
        };
        hue.onDraw=function(){
            var g=this.graphics,w=this.size.width,h=this.size.height,steps=72,i,c,sh=h/steps,y;
            for(i=0;i<steps;i++){ c=hsvToRgbValue([1-(i+.5)/steps,1,1]); fillPreviewRect(g,0,i*sh,w,sh+1,[c[0],c[1],c[2],1]); }
            y=(1-hsv[0])*h; g.newPath(); g.rectPath(0,Math.max(0,Math.min(h-3,y-1)),w,3); g.strokePath(g.newPen(g.PenType.SOLID_COLOR,[1,1,1,1],2));
        };
        function squareAt(e){ var w=Math.max(1,square.size.width),h=Math.max(1,square.size.height); hsv[1]=Math.max(0,Math.min(1,e.clientX/w)); hsv[2]=1-Math.max(0,Math.min(1,e.clientY/h)); syncFields(); }
        function hueAt(e){ hsv[0]=1-Math.max(0,Math.min(1,e.clientY/Math.max(1,hue.size.height))); syncFields(); }
        square.addEventListener("mousedown",function(e){if(e.button===0){squareDrag=true;squareAt(e);}}); square.addEventListener("mousemove",function(e){if(squareDrag)squareAt(e);}); square.addEventListener("mouseup",function(e){if(e.button===0){squareAt(e);squareDrag=false;}}); square.addEventListener("mouseout",function(){squareDrag=false;});
        hue.addEventListener("mousedown",function(e){if(e.button===0){hueDrag=true;hueAt(e);}}); hue.addEventListener("mousemove",function(e){if(hueDrag)hueAt(e);}); hue.addEventListener("mouseup",function(e){if(e.button===0){hueAt(e);hueDrag=false;}}); hue.addEventListener("mouseout",function(){hueDrag=false;});
        var valuesRow=dialog.add("group"); valuesRow.orientation="row"; valuesRow.alignChildren=["left","center"]; valuesRow.spacing=6;
        currentSwatch=valuesRow.add("group",undefined,undefined,{name:"color_current"}); currentSwatch.preferredSize=[34,24]; currentSwatch.onDraw=function(){var g=this.graphics,c=hsvToRgbValue(hsv);fillPreviewRect(g,1,1,this.size.width-2,this.size.height-2,[c[0],c[1],c[2],1]);};
        valuesRow.add("statictext",undefined,"HEX"); hexEdit=valuesRow.add("edittext",undefined,normalized,{name:"color_hex"}); hexEdit.preferredSize=[80,24];
        var labels=["R","G","B"],i;
        for(i=0;i<3;i++){ valuesRow.add("statictext",undefined,labels[i]); rgbEdits[i]=valuesRow.add("edittext",undefined,String(values[i]),{name:"color_"+labels[i].toLowerCase()}); rgbEdits[i].preferredSize=[38,24]; rgbEdits[i].justify="right"; (function(index,edit){edit.onChange=function(){var n=Number(edit.text);if(!isFinite(n))n=values[index];values[index]=Math.max(0,Math.min(255,Math.round(n)));var old=hsv;hsv=rgbToHsvValue([values[0]/255,values[1]/255,values[2]/255]);if(hsv[1]===0)hsv[0]=old[0];syncFields();};})(i,rgbEdits[i]); }
        hexEdit.onChange=function(){try{var c=rgb(hexEdit.text),old=hsv;hsv=rgbToHsvValue(c);if(hsv[1]===0)hsv[0]=old[0];syncFields();}catch(ignoreHex){syncFields();}};
        hsvLabel=dialog.add("statictext",undefined,"",{name:"color_hsv"}); hsvLabel.justify="center";
        var actions=dialog.add("group"); actions.alignment=["right","top"]; var cancel=actions.add("button",undefined,"Cancelar"),ok=actions.add("button",undefined,"Aceptar");
        cancel.onClick=function(){dialog.close(0);}; ok.onClick=function(){try{hex(hexEdit.text);dialog.close(1);}catch(e){alert(e.message);}}; syncFields();
        return dialog.show()===1?hexEdit.text:null;
    }
    function colorFieldLabel(key) {
        if (!currentRecipe) return key;
        var fields=RECIPES[currentRecipe].fields,i; for(i=0;i<fields.length;i++) if(fields[i].key===key) return fields[i].label;
        return key;
    }
    function setActiveColor(key) {
        if (!fieldControls[key]) return;
        activeColorKey=key;
        if(colorPaletteLabel) colorPaletteLabel.text="BLANCO · NEGRO · RECIENTES  ·  "+colorFieldLabel(key);
    }
    function loadRecentColors(){
        if(recentColors!==null)return recentColors; recentColors=[];
        try{if(app.settings.haveSetting(SETTINGS_SECTION,RECENT_COLORS_KEY)){var data=JSON.parse(app.settings.getSetting(SETTINGS_SECTION,RECENT_COLORS_KEY)),i,v;for(i=0;i<data.length&&recentColors.length<8;i++){v=hex(data[i]);if(v!=="#FFFFFF"&&v!=="#000000"&&recentColors.indexOf(v)<0)recentColors.push(v);}}}catch(ignoreRecent){recentColors=[];}
        return recentColors;
    }
    function paletteColors(){return ["#FFFFFF","#000000"].concat(loadRecentColors());}
    function refreshQuickPalette(){var colors=paletteColors(),i,swatch;for(i=0;i<paletteSwatches.length;i++){swatch=paletteSwatches[i];swatch._hex=i<colors.length?colors[i]:"";swatch.visible=!!swatch._hex;swatch.helpTip=swatch._hex;}}
    function rememberColor(value){
        var chosen=hex(value),colors=loadRecentColors(),i;if(chosen==="#FFFFFF"||chosen==="#000000")return;
        for(i=colors.length-1;i>=0;i--)if(colors[i]===chosen)colors.splice(i,1); colors.unshift(chosen);if(colors.length>8)colors.length=8;
        try{app.settings.saveSetting(SETTINGS_SECTION,RECENT_COLORS_KEY,JSON.stringify(colors));}catch(ignoreSaveRecent){} refreshQuickPalette();
    }
    function setColorField(key,value,remember) {
        var control=fieldControls[key]; if(!control) return;
        control.text=hex(value); setActiveColor(key); if(remember!==false)rememberColor(control.text);
    }
    function drawColorFieldSwatch(edit,key) {
        return function(){
            var g=this.graphics,w=this.size.width,h=this.size.height,color;
            try { var c=rgb(edit.text); color=[c[0],c[1],c[2],1]; } catch(ignoreColor) { color=[0.2,0.2,0.2,1]; }
            fillPreviewRect(g,1,1,w-2,h-2,color); g.newPath(); g.rectPath(1,1,w-2,h-2);
            g.strokePath(g.newPen(g.PenType.SOLID_COLOR,key===activeColorKey?[0.18,0.68,0.96,1]:[0.58,0.58,0.60,1],key===activeColorKey?2:1));
        };
    }
    function addQuickPalette(parent) {
        var i;
        colorPaletteLabel=parent.add("statictext",undefined,"BLANCO · NEGRO · RECIENTES",{name:"color_palette_label"});
        var row=parent.add("group",undefined,undefined,{name:"color_palette"}); row.orientation="row"; row.spacing=3; row.alignChildren=["left","center"];
        paletteSwatches=[];
        for(i=0;i<10;i++) (function(index){
            var swatch=row.add("group",undefined,undefined,{name:"palette_"+index}); swatch.preferredSize=[22,22]; swatch.minimumSize=[22,22]; swatch.maximumSize=[22,22];
            swatch.onDraw=function(){ if(!this._hex)return;var g=this.graphics,c=rgb(this._hex);fillPreviewRect(g,1,1,this.size.width-2,this.size.height-2,[c[0],c[1],c[2],1]);g.newPath();g.rectPath(1,1,this.size.width-2,this.size.height-2);g.strokePath(g.newPen(g.PenType.SOLID_COLOR,[0.62,0.62,0.64,1],1)); };
            swatch.addEventListener("click",function(e){if(e.button===0&&activeColorKey&&swatch._hex)setColorField(activeColorKey,swatch._hex);}); paletteSwatches.push(swatch);
        })(i);
        refreshQuickPalette();
        if(!activeColorKey) { var fields=RECIPES[currentRecipe].fields; for(i=0;i<fields.length;i++) if(fields[i].type==="color"){ setActiveColor(fields[i].key); break; } }
        else setActiveColor(activeColorKey);
    }
    function drawEyedropperIcon(){
        var g=this.graphics,pen=g.newPen(g.PenType.SOLID_COLOR,[0.82,0.84,0.88,1],2),accent=g.newPen(g.PenType.SOLID_COLOR,[0.18,0.68,0.96,1],2);
        fillPreviewRect(g,0,0,this.size.width,this.size.height,[0.16,0.17,0.19,1]);
        g.newPath();g.moveTo(6,16);g.lineTo(15,7);g.strokePath(pen);g.newPath();g.moveTo(12,5);g.lineTo(17,10);g.strokePath(pen);g.newPath();g.moveTo(5,17);g.lineTo(8,17);g.strokePath(accent);
    }
    function stopEyedropperPoll(){if(QuickEditECEyedropState.taskId){try{app.cancelTask(QuickEditECEyedropState.taskId);}catch(ignoreCancelEye){}}QuickEditECEyedropState.taskId=0;QuickEditECEyedropState.attempts=0;QuickEditECEyedropState.armed=false;}
    api.pollEyedropper=function(){
        var state=QuickEditECEyedropState,file,text="";state.attempts++;
        try{file=new File(state.resultPath);if(file.exists&&file.open("r")){text=trim(file.read());file.close();}}catch(ignoreEyeRead){}
        if(text==="WAIT"){state.armed=true;return;}
        if(state.armed&&/^#[0-9A-Fa-f]{6}$/.test(text)){var key=state.key;stopEyedropperPoll();setColorField(key,text,true);return;}
        if(state.armed&&text==="CANCEL"){stopEyedropperPoll();return;}
        if(state.attempts>600)stopEyedropperPoll();
    };
    api.startEyedropper=function(key){
        setActiveColor(key);stopEyedropperPoll();
        var scriptFile=new File($.fileName),folder=scriptFile.parent,helper=new File(folder.fsName+"/QuickEditEC-Eyedropper.exe");
        if(!helper.exists){alert("Quick Edit EC\n\nNo se encontro QuickEditEC-Eyedropper.exe junto al panel.");return false;}
        QuickEditECEyedropState.key=key;QuickEditECEyedropState.resultPath=folder.fsName+"/QuickEditEC-Eyedropper.color";QuickEditECEyedropState.attempts=0;QuickEditECEyedropState.armed=false;
        try{if(!helper.execute())fail("EffectCraft no pudo abrir el cuentagotas.");QuickEditECEyedropState.taskId=app.scheduleTask("QuickEditEC.pollEyedropper()",200,true);return true;}catch(e){stopEyedropperPoll();alert("Quick Edit EC\n\nCuentagotas no disponible: "+e.message);return false;}
    };
    function positionEnabledFor(recipe) { return recipe !== "splitScreen" && recipe !== "cascadeCover"; }
    function formatPercent(value) { var rounded = Math.round(value * 10) / 10; return String(rounded % 1 === 0 ? Math.round(rounded) : rounded); }
    function setPositionPercent(x, y) {
        positionState.x = Math.max(0, Math.min(100, Number(x) || 0));
        positionState.y = Math.max(0, Math.min(100, Number(y) || 0));
        if(currentRecipe === "roundedMedia") {
            if(roundedStageSelected>=0&&roundedStageSelected<roundedStages.length){roundedStages[roundedStageSelected].positionX=positionState.x;roundedStages[roundedStageSelected].positionY=positionState.y;}
            else if(roundedStageSelected===-2||roundedStages.length===0){roundedInitialState.positionX=positionState.x;roundedInitialState.positionY=positionState.y;}
        }
        if (positionValue) positionValue.text = "X " + formatPercent(positionState.x) + "%   ·   Y " + formatPercent(positionState.y) + "%";
        if(positionPad){try{positionPad.notify("onDraw");}catch(ignorePositionDraw){}}
        if(currentRecipe==="roundedMedia"&&roundedStageSelected!==-1)updatePreviewPhase(QuickEditECPreviewState.phase,false);
        return { x: positionState.x, y: positionState.y };
    }
    function drawPositionPad() {
        var g=this.graphics,w=this.size.width,h=this.size.height,pen=g.newPen(g.PenType.SOLID_COLOR,[0.28,0.30,0.34,1],1),i;
        fillPreviewRect(g,0,0,w,h,[0.10,0.105,0.12,1]);
        for(i=1;i<3;i++) { g.newPath(); g.moveTo(w*i/3,0); g.lineTo(w*i/3,h); g.strokePath(pen); g.newPath(); g.moveTo(0,h*i/3); g.lineTo(w,h*i/3); g.strokePath(pen); }
        var radius=6,px=Math.max(radius,Math.min(w-radius,w*positionState.x/100)),py=Math.max(radius,Math.min(h-radius,h*positionState.y/100));
        g.newPath(); g.ellipsePath(px-radius,py-radius,radius*2,radius*2); g.fillPath(g.newBrush(g.BrushType.SOLID_COLOR,[0.18,0.68,0.96,1]));
        g.newPath(); g.ellipsePath(px-radius,py-radius,radius*2,radius*2); g.strokePath(g.newPen(g.PenType.SOLID_COLOR,[0.92,0.96,1,1],1));
    }
    function setPositionFromMouse(event) {
        if (!positionPad) return;
        var w=Math.max(1,positionPad.size.width),h=Math.max(1,positionPad.size.height);
        setPositionPercent(event.clientX/w*100,event.clientY/h*100);
    }
    function addPositionButton(parent, label, name, x, y, tip) {
        var button=parent.add("button",undefined,label,{name:name}); button.preferredSize=[32,25]; button.helpTip=tip;
        button.onClick=function(){ setPositionPercent(x,y); }; return button;
    }
    function buildPositionPanel(parent) {
        positionPanel=parent.add("panel",undefined,"POSICION"); positionPanel.orientation="column"; positionPanel.alignChildren=["fill","top"]; positionPanel.spacing=5; positionPanel.margins=[8,14,8,8];
        var content=positionPanel.add("group"); content.orientation="row"; content.alignChildren=["center","center"]; content.spacing=10;
        positionStage=content.add("group",undefined,undefined,{name:"position_stage"}); positionStage.orientation="stack"; positionStage.alignChildren=["center","center"]; positionStage.preferredSize=[190,125]; positionStage.minimumSize=[190,125]; positionStage.maximumSize=[190,125];
        positionPad=positionStage.add("group",undefined,undefined,{name:"position_pad"}); positionPad.onDraw=drawPositionPad;
        positionPad.addEventListener("mousedown",function(e){ if(e.button===0){ positionDragging=true; setPositionFromMouse(e); } });
        positionPad.addEventListener("mousemove",function(e){ if(positionDragging) setPositionFromMouse(e); });
        positionPad.addEventListener("mouseup",function(e){ if(e.button===0){ setPositionFromMouse(e); positionDragging=false; } });
        positionPad.addEventListener("mouseout",function(){ positionDragging=false; });
        positionPad.addEventListener("click",function(e){ if(e.button===0 && e.detail>=2) setPositionPercent(50,50); });
        var grid=content.add("group"); grid.orientation="column"; grid.alignChildren=["left","top"]; grid.spacing=3;
        var top=grid.add("group"),middle=grid.add("group"),bottom=grid.add("group"); top.spacing=middle.spacing=bottom.spacing=3;
        addPositionButton(top,"SI","position_tl",0,0,"Superior izquierda"); addPositionButton(top,"S","position_t",50,0,"Superior centro"); addPositionButton(top,"SD","position_tr",100,0,"Superior derecha");
        addPositionButton(middle,"I","position_l",0,50,"Centro izquierda"); addPositionButton(middle,"C","position_c",50,50,"Centro"); addPositionButton(middle,"D","position_r",100,50,"Centro derecha");
        addPositionButton(bottom,"II","position_bl",0,100,"Inferior izquierda"); addPositionButton(bottom,"B","position_b",50,100,"Inferior centro"); addPositionButton(bottom,"ID","position_br",100,100,"Inferior derecha");
        positionValue=positionPanel.add("statictext",undefined,"",{name:"position_value"}); positionValue.justify="center"; positionValue.preferredSize=[320,20];
        QuickEditECPreviewState.positionPad=positionPad; setPositionPercent(positionState.x,positionState.y); syncPositionPadAspect();
    }
    function roundedBaseNumber(key,fallback) {
        var control=fieldControls[key],value=control?Number(control.text):fallback;
        return isFinite(value)?value:fallback;
    }
    function roundedInitialSnapshot() {
        return {timeSeconds:roundedEntrySeconds(),positionX:roundedInitialState.positionX,positionY:roundedInitialState.positionY,frameWidth:roundedInitialState.frameWidth,frameHeight:roundedInitialState.frameHeight,mediaScale:roundedInitialState.mediaScale,radius:roundedInitialState.radius,easing:roundedInitialState.easing,legacySize:false};
    }
    function roundedSelectionSnapshot() {
        return roundedStageSelected===-2?roundedInitialSnapshot():(roundedStageSelected>=0&&roundedStageSelected<roundedStages.length?roundedStages[roundedStageSelected]:null);
    }
    function syncRoundedPrimaryControls(state) {
        if(!state)return;var keys=["frameWidth","frameHeight","mediaScale","radius"],i,key,control;
        for(i=0;i<keys.length;i++){key=keys[i];control=fieldControls[key];if(control){control.text=String(Math.round(Number(state[key])*10)/10);if(control._slider)control._slider.value=Number(state[key]);}}
        if(roundedStageSelected===-2&&fieldControls.durationFrames){fieldControls.durationFrames.text=String(roundedInitialState.durationFrames);if(fieldControls.durationFrames._slider)fieldControls.durationFrames._slider.value=roundedInitialState.durationFrames;}
        positionState.x=state.positionX;positionState.y=state.positionY;if(positionValue)positionValue.text="X "+formatPercent(positionState.x)+"%   ·   Y "+formatPercent(positionState.y)+"%";if(positionPad){try{positionPad.notify("onDraw");}catch(ignoreRoundedPositionDraw){}}
    }
    function updateRoundedSelectedPrimaryField(key,value) {
        if(currentRecipe!=="roundedMedia")return;var n=Number(value),target=roundedSelectionSnapshot();if(!isFinite(n))return;
        if(key==="durationFrames"){roundedInitialState.durationFrames=Math.max(1,Math.min(120,Math.round(n)));if(roundedStageSelected===-2)showRoundedStage(-2);}
        else if(key==="frameWidth"||key==="frameHeight"||key==="mediaScale"||key==="radius"){
            if(!target)target=roundedInitialState;if(roundedStageSelected>=0)roundedStages[roundedStageSelected][key]=n;else roundedInitialState[key]=n;
            if(roundedStageSelected!==-1)showRoundedStage(roundedStageSelected);
        }
        updateRoundedStageStatus();updatePreviewPhase(QuickEditECPreviewState.phase,false);
    }
    function roundedAnimationStates() {
        var entry=roundedEntrySeconds(),states=[
            {time:0,frameWidth:100,frameHeight:100,mediaScale:100,radius:0,x:50,y:50,easing:"bezier"},
            {time:entry,frameWidth:roundedInitialState.frameWidth,frameHeight:roundedInitialState.frameHeight,mediaScale:roundedInitialState.mediaScale,radius:roundedInitialState.radius,x:roundedInitialState.positionX,y:roundedInitialState.positionY,easing:roundedInitialState.easing}
        ],i,stage;
        for(i=0;i<roundedStages.length;i++){stage=roundedStages[i];states.push({time:stage.timeSeconds,frameWidth:stage.frameWidth,frameHeight:stage.frameHeight,mediaScale:stage.mediaScale,radius:stage.radius,x:stage.positionX,y:stage.positionY,easing:stage.easing});}
        states.sort(function(a,b){return a.time-b.time;});return states;
    }
    function mixRoundedState(a,b,mix) {
        var q=b.easing==="linear"?clamp01(mix):smooth(mix);
        return {time:lerp(a.time,b.time,q),frameWidth:lerp(a.frameWidth,b.frameWidth,q),frameHeight:lerp(a.frameHeight,b.frameHeight,q),mediaScale:lerp(a.mediaScale,b.mediaScale,q),radius:lerp(a.radius,b.radius,q),x:lerp(a.x,b.x,q),y:lerp(a.y,b.y,q),easing:b.easing};
    }
    function roundedStateAtTime(time,states) {
        var sequence=states||roundedAnimationStates(),last=sequence[sequence.length-1],from=sequence[0],to=sequence.length>1?sequence[1]:sequence[0],i;
        if(time<=from.time)return from;if(time>=last.time)return last;
        for(i=1;i<sequence.length;i++){to=sequence[i];if(time<=to.time)break;from=to;}
        return mixRoundedState(from,to,(time-from.time)/Math.max(0.0001,to.time-from.time));
    }
    function roundedSelectedStageIndex() {
        return roundedStageSelected>=0&&roundedStageSelected<roundedStages.length?roundedStageSelected:-1;
    }
    function roundedTimelineInfo() {
        var active=app.project.activeItem,duration=6,frame=1/30,layer=null,inPoint=0,outPoint=6;
        if(active instanceof CompItem){frame=active.frameDuration>0?active.frameDuration:frame;duration=Math.max(frame,active.duration);outPoint=duration;
            if(active.selectedLayers&&active.selectedLayers.length){layer=active.selectedLayers[0];inPoint=layer.inPoint;outPoint=layer.outPoint;duration=Math.max(frame,outPoint-inPoint);}
        }
        if(!layer)duration=Math.max(duration,roundedInitialState.durationFrames*frame);
        return {duration:duration,frame:frame,layer:layer,inPoint:inPoint,outPoint:outPoint,comp:active instanceof CompItem?active:null};
    }
    function roundedTimelineMetrics(control) {
        var w=Math.max(40,control?control.size.width:330),h=Math.max(28,control?control.size.height:38),info=roundedTimelineInfo();
        return {left:10,right:w-10,y:Math.round(h/2),width:Math.max(1,w-20),duration:info.duration,frame:info.frame};
    }
    function roundedTimelineTimeAt(x,control) {
        var m=roundedTimelineMetrics(control),raw=(Math.max(m.left,Math.min(m.right,x))-m.left)/m.width*m.duration;
        return Math.max(0,Math.min(m.duration,Math.round(raw/m.frame)*m.frame));
    }
    function roundedTimelineXAt(time,control) {
        var m=roundedTimelineMetrics(control);return m.left+Math.max(0,Math.min(1,time/m.duration))*m.width;
    }
    function roundedEntrySeconds() {
        var info=roundedTimelineInfo();return Math.max(1,roundedInitialState.durationFrames)*info.frame;
    }
    function setRoundedEntrySeconds(value) {
        var info=roundedTimelineInfo(),control=fieldControls.durationFrames,maxFrames=Math.max(1,Math.min(120,Math.floor(info.duration/info.frame))),frames;
        if(roundedStages.length)maxFrames=Math.min(maxFrames,Math.max(1,Math.floor((roundedStages[0].timeSeconds-info.frame)/info.frame)));
        frames=Math.max(1,Math.min(maxFrames,Math.round((Number(value)||info.frame)/info.frame)));
        roundedInitialState.durationFrames=frames;if(control){control.text=String(frames);if(control._slider)control._slider.value=frames;}
        return frames*info.frame;
    }
    function drawRoundedDiamond(g,x,y,r,color,outline) {
        g.newPath();g.moveTo(x,y-r);g.lineTo(x+r,y);g.lineTo(x,y+r);g.lineTo(x-r,y);g.lineTo(x,y-r);g.fillPath(g.newBrush(g.BrushType.SOLID_COLOR,color));
        if(outline){g.newPath();g.moveTo(x,y-r);g.lineTo(x+r,y);g.lineTo(x,y+r);g.lineTo(x-r,y);g.lineTo(x,y-r);g.strokePath(g.newPen(g.PenType.SOLID_COLOR,outline,1));}
    }
    function drawRoundedStageTimeline() {
        var g=this.graphics,m=roundedTimelineMetrics(this),i,x,playX=m.left+m.width*clamp01(QuickEditECPreviewState.phase);
        fillPreviewRect(g,0,0,this.size.width,this.size.height,[0.105,0.11,0.125,1]);
        fillPreviewRoundRect(g,m.left,m.y-2,m.width,4,2,[0.22,0.23,0.26,1]);
        fillPreviewRoundRect(g,m.left,m.y-2,Math.max(2,playX-m.left),4,2,[0.22,0.52,0.76,1]);
        drawRoundedDiamond(g,roundedTimelineXAt(0,this),m.y,4,[0.48,0.50,0.54,1],[0.82,0.84,0.88,1]);
        drawRoundedDiamond(g,roundedTimelineXAt(roundedEntrySeconds(),this),m.y,roundedStageSelected===-2?7:6,roundedStageSelected===-2?[1,0.58,0.18,1]:[0.18,0.55,0.82,1],[0.76,0.90,1,1]);
        for(i=0;i<roundedStages.length;i++){x=roundedTimelineXAt(roundedStages[i].timeSeconds,this);drawRoundedDiamond(g,x,m.y,roundedStageSelected===i?7:6,roundedStageSelected===i?[1,0.58,0.18,1]:[0.18,0.68,0.96,1],[0.92,0.96,1,1]);}
        fillPreviewEllipse(g,playX-5,m.y-5,10,10,[0.82,0.86,0.91,1]);fillPreviewEllipse(g,playX-3,m.y-3,6,6,[0.18,0.55,0.82,1]);
    }
    function roundedTimelineHit(x,y) {
        if(!roundedStageTimeline)return -1;var m=roundedTimelineMetrics(roundedStageTimeline),i,dx,dy,best=-1,distance=999;
        dx=Math.abs(roundedTimelineXAt(roundedEntrySeconds(),roundedStageTimeline)-x);dy=Math.abs(m.y-y);if(dx<=9&&dy<=11){best=-2;distance=dx;}
        for(i=0;i<roundedStages.length;i++){dx=Math.abs(roundedTimelineXAt(roundedStages[i].timeSeconds,roundedStageTimeline)-x);dy=Math.abs(m.y-y);if(dx<=9&&dy<=11&&dx<distance){best=i;distance=dx;}}
        return best;
    }
    function updateRoundedStageStatus() {
        if(!roundedStageStatus)return;var info=roundedTimelineInfo(),index=roundedSelectedStageIndex(),count=roundedStages.length+1,selected=roundedStageSelected===-2?" · Inicial "+formatSeconds(info.inPoint+roundedEntrySeconds()):(index>=0?" · Key "+formatSeconds(info.inPoint+roundedStages[index].timeSeconds):"");
        roundedStageStatus.text=count+" key"+(count===1?"":"s")+" · "+formatSeconds(info.duration)+selected;
        roundedStageStatus.helpTip="Capa "+formatSeconds(info.inPoint)+"–"+formatSeconds(info.outPoint)+selected;
    }
    function selectRoundedStage(index,syncPreview) {
        roundedStageSelected=index===-2?-2:(index>=0&&index<roundedStages.length?index:-1);syncRoundedPrimaryControls(roundedSelectionSnapshot());showRoundedStage(roundedStageSelected);updateRoundedStageStatus();
        if(syncPreview&&roundedStageSelected!==-1){var info=roundedTimelineInfo(),time=roundedStageSelected===-2?roundedEntrySeconds():roundedStages[roundedStageSelected].timeSeconds;updatePreviewPhase(time/info.duration,true);refreshRealPreview(false);}
    }
    function moveRoundedStageFromMouse(x) {
        var index=roundedStageById(roundedStageDragId),info=roundedTimelineInfo(),minimum=Math.min(info.duration,roundedEntrySeconds()+info.frame),time;
        if(roundedStageDragId==="__initial__"){time=setRoundedEntrySeconds(roundedTimelineTimeAt(x,roundedStageTimeline));roundedStageSelected=-2;showRoundedStage(-2);updateRoundedStageStatus();updatePreviewPhase(time/info.duration,true);return;}
        if(index<0)return;time=Math.max(minimum,roundedTimelineTimeAt(x,roundedStageTimeline));roundedStages[index].timeSeconds=time;roundedStages.sort(function(a,b){return a.timeSeconds-b.timeSeconds;});roundedStageSelected=roundedStageById(roundedStageDragId);showRoundedStage(roundedStageSelected);updateRoundedStageStatus();updatePreviewPhase(time/info.duration,true);
    }
    function setRoundedStageEditorsEnabled(enabled) {
        var key,i,changed=false;for(key in roundedStageEditors)roundedStageEditors[key].enabled=enabled;
        for(i=0;i<roundedStageEditorRows.length;i++){if(roundedStageEditorRows[i].visible!==enabled)changed=true;roundedStageEditorRows[i].visible=enabled;}
        if(roundedStageDuplicate)roundedStageDuplicate.enabled=enabled;if(roundedStageDelete)roundedStageDelete.enabled=enabled&&roundedStageSelected!==-2;if(roundedStageUsePosition)roundedStageUsePosition.enabled=enabled;
        if(changed&&ui){try{ui.layout.layout(true);ui.layout.resize();}catch(ignoreRoundedLayout){}}
    }
    function showRoundedStage(index) {
        var stage=index===-2?roundedInitialSnapshot():(index>=0&&index<roundedStages.length?roundedStages[index]:null),key,info=roundedTimelineInfo();
        setRoundedStageEditorsEnabled(!!stage);if(!stage){for(key in roundedStageEditors)if(key!=="easing")roundedStageEditors[key].text="";return;}
        roundedStageEditors.timeSeconds.text=String(Math.round((info.inPoint+stage.timeSeconds)*1000)/1000);roundedStageEditors.positionX.text=displayNumber(stage.positionX,{min:0,max:100,value:0});roundedStageEditors.positionY.text=displayNumber(stage.positionY,{min:0,max:100,value:0});
        roundedStageEditors.frameWidth.text=displayNumber(stage.frameWidth,{min:10,max:100,value:10});roundedStageEditors.frameHeight.text=displayNumber(stage.frameHeight,{min:10,max:100,value:10});roundedStageEditors.mediaScale.text=displayNumber(stage.mediaScale,{min:10,max:400,value:100});roundedStageEditors.radius.text=displayNumber(stage.radius,{min:0,max:1000,value:0});roundedStageEditors.easing.selection=stage.easing==="linear"?1:0;
    }
    function refreshRoundedStageTimeline(selectIndex) {
        if(selectIndex===-2)selectRoundedStage(-2,false);else if(roundedStages.length&&selectIndex!==undefined&&selectIndex>=0){selectIndex=Math.max(0,Math.min(roundedStages.length-1,selectIndex));selectRoundedStage(selectIndex,false);}else selectRoundedStage(-1,false);
    }
    function loadRoundedStages(source) { roundedStages=normalizeRoundedStages(source||[]);refreshRoundedStageTimeline(); }
    function roundedStageById(id) { var i;for(i=0;i<roundedStages.length;i++)if(roundedStages[i].id===id)return i;return -1; }
    function commitRoundedStageField(key,min,max) {
        var index=roundedSelectedStageIndex(),initial=roundedStageSelected===-2;if(index<0&&!initial)return;var edit=roundedStageEditors[key],value=Number(edit.text),stage=initial?null:roundedStages[index],id=initial?"__initial__":stage.id;
        if(initial){
            if(!isFinite(value)){showRoundedStage(-2);return;}
            if(key==="timeSeconds"){var initialInfo=roundedTimelineInfo();value=setRoundedEntrySeconds(value-initialInfo.inPoint);updatePreviewPhase(value/initialInfo.duration,true);refreshRealPreview(false);}
            else if(key==="positionX"){roundedInitialState.positionX=Math.max(min,Math.min(max,value));setPositionPercent(roundedInitialState.positionX,roundedInitialState.positionY);}
            else if(key==="positionY"){roundedInitialState.positionY=Math.max(min,Math.min(max,value));setPositionPercent(roundedInitialState.positionX,roundedInitialState.positionY);}
            else {value=Math.max(min,Math.min(max,value));roundedInitialState[key]=value;var baseControl=fieldControls[key];if(baseControl){baseControl.text=displayNumber(value,{min:min,max:max,value:value});if(baseControl._slider)baseControl._slider.value=value;}}
            showRoundedStage(-2);updateRoundedStageStatus();updatePreviewPhase(QuickEditECPreviewState.phase,false);return;
        }
        if(!isFinite(value)){showRoundedStage(index);return;}if(key==="timeSeconds"){var info=roundedTimelineInfo();value-=info.inPoint;max=info.duration;min=Math.min(max,roundedEntrySeconds()+info.frame);}value=Math.max(min,Math.min(max,value));stage[key]=value;if(key==="frameWidth"||key==="frameHeight"||key==="mediaScale")stage.legacySize=false;roundedStages.sort(function(a,b){return a.timeSeconds-b.timeSeconds;});refreshRoundedStageTimeline(roundedStageById(id));if(key==="timeSeconds"){updatePreviewPhase(value/roundedTimelineInfo().duration,true);refreshRealPreview(false);}else updatePreviewPhase(QuickEditECPreviewState.phase,false);
    }
    function makeRoundedStageCell(parent,label,name,width) {
        var cell=parent.add("group");cell.orientation="column";cell.alignChildren=["fill","top"];cell.spacing=2;cell.preferredSize=[width,45];cell.add("statictext",undefined,label);
        var edit=cell.add("edittext",undefined,"",{name:name});edit.preferredSize=[width,24];return edit;
    }
    function buildRoundedStagePanel(parent) {
        roundedStagePanel=parent.add("panel",undefined,"KEYFRAMES ROUND",{name:"rounded_stage_panel"});roundedStagePanel.orientation="column";roundedStagePanel.alignChildren=["fill","top"];roundedStagePanel.spacing=4;roundedStagePanel.margins=[7,12,7,6];
        roundedStageTimeline=roundedStagePanel.add("group",undefined,undefined,{name:"rounded_stage_timeline"});roundedStageTimeline.preferredSize=[320,26];roundedStageTimeline.minimumSize=[260,26];roundedStageTimeline.helpTip="Selecciona cualquier rombo, incluido el key inicial. Arrastra para cambiar su tiempo.";roundedStageTimeline.onDraw=drawRoundedStageTimeline;
        roundedStageTimeline.addEventListener("mousedown",function(e){if(e.button!==0)return;var index=roundedTimelineHit(e.clientX,e.clientY);if(index!==-1){selectRoundedStage(index,true);roundedStageDragging=true;roundedStageDragId=index===-2?"__initial__":roundedStages[index].id;}else updatePreviewPhase(roundedTimelineTimeAt(e.clientX,roundedStageTimeline)/roundedTimelineInfo().duration,true);});
        roundedStageTimeline.addEventListener("mousemove",function(e){if(roundedStageDragging)moveRoundedStageFromMouse(e.clientX);});
        roundedStageTimeline.addEventListener("mouseup",function(e){if(e.button===0){if(roundedStageDragging)moveRoundedStageFromMouse(e.clientX);roundedStageDragging=false;roundedStageDragId="";refreshRealPreview(false);}});
        roundedStageTimeline.addEventListener("mouseout",function(){roundedStageDragging=false;roundedStageDragId="";});
        var buttons=roundedStagePanel.add("group");buttons.orientation="row";buttons.spacing=5;buttons.alignChildren=["left","center"];
        roundedStageAdd=buttons.add("button",undefined,"+ Key",{name:"rounded_stage_add"});roundedStageAdd.preferredSize=[48,23];
        roundedStageDuplicate=buttons.add("button",undefined,"Dup.",{name:"rounded_stage_duplicate"});roundedStageDuplicate.preferredSize=[45,23];
        roundedStageDelete=buttons.add("button",undefined,"−",{name:"rounded_stage_delete"});roundedStageDelete.preferredSize=[32,23];roundedStageDelete.helpTip="Eliminar keyframe (el inicial es obligatorio)";
        roundedStageUsePosition=buttons.add("button",undefined,"Pos.",{name:"rounded_stage_use_position"});roundedStageUsePosition.preferredSize=[42,23];roundedStageUsePosition.helpTip="Usar la posicion actual";
        roundedStageStatus=buttons.add("statictext",undefined,"",{name:"rounded_stage_status"});roundedStageStatus.preferredSize=[145,18];roundedStageStatus.justify="right";
        var row1=roundedStagePanel.add("group",undefined,undefined,{name:"rounded_stage_editor_row_1"});row1.orientation="row";row1.spacing=7;row1.alignChildren=["left","top"];
        roundedStageEditors.timeSeconds=makeRoundedStageCell(row1,"Tiempo s","rounded_stage_time",76);roundedStageEditors.positionX=makeRoundedStageCell(row1,"X %","rounded_stage_x",64);roundedStageEditors.positionY=makeRoundedStageCell(row1,"Y %","rounded_stage_y",64);
        var easeCell=row1.add("group");easeCell.orientation="column";easeCell.alignChildren=["fill","top"];easeCell.spacing=2;easeCell.preferredSize=[78,45];easeCell.add("statictext",undefined,"Curva");roundedStageEditors.easing=easeCell.add("dropdownlist",undefined,[],{name:"rounded_stage_easing"});roundedStageEditors.easing.preferredSize=[78,24];var bezier=roundedStageEditors.easing.add("item","Bezier");bezier.value="bezier";var linear=roundedStageEditors.easing.add("item","Lineal");linear.value="linear";roundedStageEditors.easing.selection=0;
        var row2=roundedStagePanel.add("group",undefined,undefined,{name:"rounded_stage_editor_row_2"});row2.orientation="row";row2.spacing=7;row2.alignChildren=["left","top"];
        roundedStageEditorRows=[row1,row2];
        roundedStageEditors.frameWidth=makeRoundedStageCell(row2,"Ancho %","rounded_stage_width",70);roundedStageEditors.frameHeight=makeRoundedStageCell(row2,"Alto %","rounded_stage_height",70);roundedStageEditors.mediaScale=makeRoundedStageCell(row2,"Medio %","rounded_stage_media_scale",70);roundedStageEditors.radius=makeRoundedStageCell(row2,"Radio px","rounded_stage_radius",70);
        roundedStageEditors.timeSeconds.onChange=function(){commitRoundedStageField("timeSeconds",0.01,86400);};roundedStageEditors.positionX.onChange=function(){commitRoundedStageField("positionX",0,100);};roundedStageEditors.positionY.onChange=function(){commitRoundedStageField("positionY",0,100);};roundedStageEditors.frameWidth.onChange=function(){commitRoundedStageField("frameWidth",10,100);};roundedStageEditors.frameHeight.onChange=function(){commitRoundedStageField("frameHeight",10,100);};roundedStageEditors.mediaScale.onChange=function(){commitRoundedStageField("mediaScale",10,400);};roundedStageEditors.radius.onChange=function(){commitRoundedStageField("radius",0,1000);};
        roundedStageEditors.easing.onChange=function(){var index=roundedSelectedStageIndex();if(roundedStageEditors.easing.selection){if(roundedStageSelected===-2)roundedInitialState.easing=roundedStageEditors.easing.selection.value;else if(index>=0)roundedStages[index].easing=roundedStageEditors.easing.selection.value;updatePreviewPhase(QuickEditECPreviewState.phase,false);}};
        roundedStageAdd.onClick=function(){
            var info=roundedTimelineInfo(),entrySeconds=roundedEntrySeconds(),last=roundedStages.length?roundedStages[roundedStages.length-1].timeSeconds:entrySeconds,cursor=QuickEditECPreviewState.phase*info.duration,time=Math.max(entrySeconds+info.frame,cursor>entrySeconds?cursor:last+Math.max(1,info.frame));
            time=Math.min(info.duration,Math.round(time/info.frame)*info.frame);var inherited=roundedStateAtTime(time),created={id:"stage-"+new Date().getTime()+"-"+roundedStages.length,timeSeconds:time,positionX:inherited.x,positionY:inherited.y,frameWidth:inherited.frameWidth,frameHeight:inherited.frameHeight,mediaScale:inherited.mediaScale,radius:inherited.radius,easing:"bezier",legacySize:false};
            roundedStages.push(created);roundedStages.sort(function(a,b){return a.timeSeconds-b.timeSeconds;});selectRoundedStage(roundedStageById(created.id),true);refreshRealPreview(false);
        };
        roundedStageDuplicate.onClick=function(){var index=roundedSelectedStageIndex(),initial=roundedStageSelected===-2;if(index<0&&!initial)return;var info=roundedTimelineInfo(),source=initial?roundedStateAtTime(roundedEntrySeconds()):roundedStages[index],sourceTime=initial?roundedEntrySeconds():source.timeSeconds,copy={id:"stage-"+new Date().getTime()+"-copy",timeSeconds:Math.min(info.duration,sourceTime+Math.max(1,info.frame)),positionX:source.x===undefined?source.positionX:source.x,positionY:source.y===undefined?source.positionY:source.y,frameWidth:source.frameWidth,frameHeight:source.frameHeight,mediaScale:source.mediaScale,radius:source.radius,easing:source.easing,legacySize:!!source.legacySize};roundedStages.push(copy);roundedStages.sort(function(a,b){return a.timeSeconds-b.timeSeconds;});selectRoundedStage(roundedStageById(copy.id),true);refreshRealPreview(false);};
        roundedStageDelete.onClick=function(){if(roundedStageSelected===-2)return;var index=roundedSelectedStageIndex();if(index<0)return;roundedStages.splice(index,1);refreshRoundedStageTimeline(Math.min(index,roundedStages.length-1));updatePreviewPhase(QuickEditECPreviewState.phase,false);};
        roundedStageUsePosition.onClick=function(){var index=roundedSelectedStageIndex();if(roundedStageSelected===-2){roundedInitialState.positionX=positionState.x;roundedInitialState.positionY=positionState.y;showRoundedStage(-2);updateRoundedStageStatus();}else if(index>=0){roundedStages[index].positionX=positionState.x;roundedStages[index].positionY=positionState.y;refreshRoundedStageTimeline(index);}else return;updatePreviewPhase(QuickEditECPreviewState.phase,false);};
        loadRoundedStages([]);
    }
    function previewField(key, fallback) {
        var control = fieldControls[key], fields, i, spec;
        if (!control || !currentRecipe) return fallback;
        fields = RECIPES[currentRecipe].fields;
        for (i = 0; i < fields.length; i++) if (fields[i].key === key) { spec = fields[i]; break; }
        if (!spec) return fallback;
        try { return fieldValue(control, spec); } catch (e) { return fallback; }
    }
    function previewNumber(key, fallback) { var n = Number(previewField(key, fallback)); return isFinite(n) ? n : fallback; }
    function previewColor(key, fallback) { try { var c = rgb(previewField(key, fallback)); return [c[0],c[1],c[2],1]; } catch (e) { var f = rgb(fallback); return [f[0],f[1],f[2],1]; } }
    function formatSeconds(value) { var n=Math.max(0,Number(value)||0),rounded=Math.round(n*100)/100;return (rounded%1===0?String(Math.round(rounded)):rounded.toFixed(2).replace(/0$/,""))+" s"; }
    function updatePreviewMetadata() {
        if(!previewAspectLabel)return;var active=app.project.activeItem,sourceW=1920,sourceH=1080,pixelAspect=1,ratioLabel="16:9",prefix="Referencia",info=roundedTimelineInfo();
        if(active instanceof CompItem&&active.width>0&&active.height>0){sourceW=active.width;sourceH=active.height;pixelAspect=Number(active.pixelAspect)||1;var divisor=greatestCommonDivisor(sourceW,sourceH);ratioLabel=Math.abs(pixelAspect-1)<0.0001?(sourceW/divisor)+":"+(sourceH/divisor):((sourceW*pixelAspect)/sourceH).toFixed(2)+":1";prefix="Proyecto";}
        previewAspectLabel.text=realPreviewError?(realPreviewError.indexOf("Allow Scripts")>=0?"VISTA REAL · activa acceso a archivos en Preferencias":"VISTA REAL NO DISPONIBLE · consulta la ayuda"):(info.layer?"CAPA REAL · "+info.layer.name+" · "+sourceW+" x "+sourceH+" · "+formatSeconds(info.inPoint)+"–"+formatSeconds(info.outPoint):(prefix+" "+sourceW+" x "+sourceH+" · "+ratioLabel+" · Sin capa seleccionada"));
        previewAspectLabel.helpTip=realPreviewError?"Vista real no disponible: "+realPreviewError:(info.layer?"Fotograma aislado de "+info.layer.name+(realPreviewIsolationCount>1?" con sus mattes asociados.":"."):"Selecciona una capa para activar la vista real.");
    }
    function realPreviewTime() {
        var info=roundedTimelineInfo(),time=info.inPoint+clamp01(QuickEditECPreviewState.phase)*info.duration;
        if(info.layer&&time>=info.outPoint)time=Math.max(info.inPoint,info.outPoint-info.frame*0.5);return {info:info,time:time};
    }
    function realPreviewFolder() {
        try{if(typeof QuickEditECPreviewDirectory!=="undefined"&&trim(QuickEditECPreviewDirectory))return new Folder(String(QuickEditECPreviewDirectory));}catch(ignorePreviewOverride){}
        try{var scriptFile=new File($.fileName);if(scriptFile.parent&&trim(scriptFile.parent.fsName))return scriptFile.parent;}catch(ignoreScriptFolder){}
        try{if(Folder.current)return Folder.current;}catch(ignoreProjectFolder){}return null;
    }
    function previewIsolationLayers(layer) {
        var out=[],seen={},current=layer,id,matte;
        while(current){id=String(current.id===undefined?current.index:current.id);if(seen[id])break;seen[id]=true;out.push(current);matte=null;try{if(current.hasTrackMatte)matte=current.trackMatteLayer;}catch(ignoreMatteLookup){}current=matte;}
        return out;
    }
    function saveIsolatedPreviewFrame(info,time,file) {
        var isolated=previewIsolationLayers(info.layer),states=[],i,layer,error=null;
        try{
            for(i=1;i<=info.comp.numLayers;i++){layer=info.comp.layer(i);states.push({layer:layer,solo:!!layer.solo,enabled:!!layer.enabled});layer.solo=false;}
            // Solo the visible consumer. Track mattes must keep their original
            // enabled state so the renderer uses them as dependencies instead
            // of painting their pixels into the isolated preview.
            isolated[0].enabled=true;isolated[0].solo=true;
            info.comp.saveFrameToPng(time,file);realPreviewIsolationCount=isolated.length;
        }catch(e){error=e;}finally{
            for(i=0;i<states.length;i++){try{states[i].layer.enabled=states[i].enabled;states[i].layer.solo=states[i].solo;}catch(ignorePreviewRestore){}}
        }
        if(error)throw error;return isolated.length;
    }
    function refreshRealPreview(force) {
        if(realPreviewRendering)return false;var state=realPreviewTime(),info=state.info,key,file,folder;
        if(!info.comp||!info.layer){realPreviewImage=null;realPreviewKey="";realPreviewError="Selecciona una capa.";updatePreviewMetadata();return false;}
        key=info.comp.name+"|"+(info.layer.id===undefined?info.layer.index:info.layer.id)+"|"+info.inPoint+"|"+info.outPoint+"|"+Math.round(state.time/info.frame);
        if(!force&&key===realPreviewKey&&realPreviewImage){updatePreviewMetadata();return true;}
        realPreviewRendering=true;realPreviewError="";
        try{
            folder=realPreviewFolder();if(!folder)throw new Error("No hay una carpeta disponible para la cache de fotogramas.");realPreviewSlot=(realPreviewSlot+1)%2;file=new File(folder.fsName+"/QuickEditEC-real-preview-"+realPreviewSlot+".png");
            try{if(file.exists)file.remove();}catch(ignoreOldPreview){}
            saveIsolatedPreviewFrame(info,state.time,file);realPreviewImage=ScriptUI.newImage(file);realPreviewFile=file;realPreviewKey=key;
        }catch(e){realPreviewImage=null;realPreviewKey="";realPreviewError=e.message||String(e);}
        realPreviewRendering=false;updatePreviewMetadata();return !!realPreviewImage;
    }
    api.refreshRealPreview = function () { return refreshRealPreview(true); };
    function previewBrush(g, color) { return g.newBrush(g.BrushType.SOLID_COLOR, color); }
    function fillPreviewRect(g, x, y, w, h, color) { g.newPath(); g.rectPath(x,y,w,h); g.fillPath(previewBrush(g,color)); }
    function fillPreviewEllipse(g, x, y, w, h, color) { g.newPath(); g.ellipsePath(x,y,w,h); g.fillPath(previewBrush(g,color)); }
    function fillPreviewRoundRect(g, x, y, w, h, radius, color) {
        var r = Math.max(0, Math.min(radius, w/2, h/2));
        if (r < 1) { fillPreviewRect(g,x,y,w,h,color); return; }
        fillPreviewRect(g,x+r,y,w-2*r,h,color); fillPreviewRect(g,x,y+r,w,h-2*r,color);
        fillPreviewEllipse(g,x,y,r*2,r*2,color); fillPreviewEllipse(g,x+w-2*r,y,r*2,r*2,color);
        fillPreviewEllipse(g,x,y+h-2*r,r*2,r*2,color); fillPreviewEllipse(g,x+w-2*r,y+h-2*r,r*2,r*2,color);
    }
    function maskPreviewCorner(g,cornerX,cornerY,centerX,centerY,r,startAngle,color) {
        var steps=9,i,angle,brush=previewBrush(g,color);g.newPath();g.moveTo(cornerX,cornerY);
        angle=startAngle*Math.PI/180;g.lineTo(centerX+Math.cos(angle)*r,centerY+Math.sin(angle)*r);
        for(i=1;i<=steps;i++){angle=(startAngle-i*90/steps)*Math.PI/180;g.lineTo(centerX+Math.cos(angle)*r,centerY+Math.sin(angle)*r);}
        g.lineTo(cornerX,cornerY);g.closePath();g.fillPath(brush);
    }
    function drawRealRoundedFrame(g,x,y,w,h,radius,fallback,background,contentScale,canvasW,canvasH) {
        var r=Math.max(0,Math.min(radius,w/2,h/2)),zoom=Math.max(0.1,(Number(contentScale)||100)/100),drawW=w*zoom,drawH=h*zoom,drawX=x+(w-drawW)/2,drawY=y+(h-drawH)/2;
        if(!realPreviewImage){fillPreviewRoundRect(g,x,y,w,h,r,fallback);return false;}
        g.drawImage(realPreviewImage,drawX,drawY,drawW,drawH);if(canvasW!==undefined&&canvasH!==undefined){if(y>0)fillPreviewRect(g,0,0,canvasW,y,background);if(y+h<canvasH)fillPreviewRect(g,0,y+h,canvasW,canvasH-y-h,background);if(x>0)fillPreviewRect(g,0,y,x,h,background);if(x+w<canvasW)fillPreviewRect(g,x+w,y,canvasW-x-w,h,background);}if(r>0){maskPreviewCorner(g,x,y,x+r,y+r,r,-90,background);maskPreviewCorner(g,x+w,y,x+w-r,y+r,r,0,background);maskPreviewCorner(g,x+w,y+h,x+w-r,y+h-r,r,90,background);maskPreviewCorner(g,x,y+h,x+r,y+h-r,r,180,background);}return true;
    }
    function drawPreviewShape(g, shape, x, y, size, color, roundness) {
        if (shape === "circle") fillPreviewEllipse(g,x-size/2,y-size/2,size,size,color);
        else fillPreviewRoundRect(g,x-size/2,y-size/2,size,size,shape === "rounded" ? size*roundness/100 : 0,color);
    }
    function previewPath(width, height, direction, margin) {
        var cx=width/2, cy=height/2;
        if (direction === "bottomLeft") return {start:[-margin,height+margin],end:[width+margin,-margin]};
        if (direction === "bottomRight") return {start:[width+margin,height+margin],end:[-margin,-margin]};
        if (direction === "left") return {start:[-margin,cy],end:[width+margin,cy]};
        if (direction === "right") return {start:[width+margin,cy],end:[-margin,cy]};
        if (direction === "top") return {start:[cx,-margin],end:[cx,height+margin]};
        return {start:[cx,height+margin],end:[cx,-margin]};
    }
    function clamp01(v) { return Math.max(0,Math.min(1,v)); }
    function smooth(v) { v=clamp01(v); return v*v*(3-2*v); }
    function lerp(a,b,p) { return a+(b-a)*p; }
    function previewLayoutProgress() {
        var p=clamp01(QuickEditECPreviewState.phase),out=!!previewField("animateOut",false);
        return smooth(out?(p<=0.5?p*2:(1-p)*2):p);
    }
    function previewPoint(w,h) { return [w*positionState.x/100,h*positionState.y/100]; }
    function previewFrameOriginAt(w,h,frameW,frameH,margin,xPercent,yPercent) {
        var inset=Math.max(0,margin||0),usableW=Math.max(0,w-frameW-inset*2),usableH=Math.max(0,h-frameH-inset*2);
        return [inset+usableW*xPercent/100,inset+usableH*yPercent/100];
    }
    function previewFrameOrigin(w,h,frameW,frameH,margin) { return previewFrameOriginAt(w,h,frameW,frameH,margin,positionState.x,positionState.y); }
    function previewTransitionPath(w,h,motion,direction,margin,index,count){if(!motion||motion==="sweep")return previewPath(w,h,direction,margin);var center=[w/2,h/2],angle=Math.PI*2*(index/Math.max(1,count)),radius=Math.sqrt(w*w+h*h)/2+margin,outer=[center[0]+Math.cos(angle)*radius,center[1]+Math.sin(angle)*radius];if(motion==="radialOut")return{start:center,end:outer};if(motion==="radialIn")return{start:outer,end:center};return index%2===0?{start:[-margin,h/2],end:[w+margin,h/2]}:{start:[w+margin,h/2],end:[-margin,h/2]};}
    function drawCascadePreview(g,w,h) {
        var copies=Math.max(2,Math.min(8,Math.round(previewNumber("copies",3)))), shape=previewField("shape","circle");
        var direction=previewField("direction","bottomLeft"),motion=previewField("motion","sweep"),roundness=previewNumber("roundness",28),base=Math.min(w,h)*previewNumber("shapeSize",22)/100,path=previewTransitionPath(w,h,motion,direction,base,copies-1,copies);
        var i,start,end,local,x,y,color,finalStart,move,cover,size,copyPath,out=!!previewField("animateOut",false),phase=QuickEditECPreviewState.phase;
        if(out&&phase>0.72)phase=1-(phase-0.72)/0.28;
        for(i=0;i<copies-1;i++) {
            start=0.04+i*0.075; end=start+0.34; local=(phase-start)/(end-start);
            if(local<0 || local>1) continue;copyPath=previewTransitionPath(w,h,motion,direction,base,i,Math.max(1,copies-1)); local=smooth(local); x=copyPath.start[0]+(copyPath.end[0]-copyPath.start[0])*local; y=copyPath.start[1]+(copyPath.end[1]-copyPath.start[1])*local;
            color=previewColor("color"+(i+1),"#FFFFFF"); drawPreviewShape(g,shape,x,y,base,color,roundness);
        }
        finalStart=0.12+(copies-2)*0.075; move=clamp01((phase-finalStart)/0.34);
        if(phase>=finalStart) {
            x=path.start[0]+(w/2-path.start[0])*smooth(move); y=path.start[1]+(h/2-path.start[1])*smooth(move);
            cover=clamp01((phase-(finalStart+0.18))/0.28); size=base+(Math.sqrt(w*w+h*h)*1.18-base)*smooth(cover);
            drawPreviewShape(g,shape,x,y,size,previewColor("color"+copies,"#111111"),roundness);
        }
    }
    function drawSmartTitlePreview(g,w,h){var progress=previewLayoutProgress(),text=String(previewField("text","Tu titulo")),fontSize=previewNumber("fontSize",72),boxW=Math.min(w*.88,Math.max(w*.24,text.length*fontSize*w/1920*.56+previewNumber("paddingX",42)*w/960)),boxH=Math.max(28,fontSize*h/1080+previewNumber("paddingY",24)*h/540),origin=previewFrameOrigin(w,h,boxW,boxH,0),offset=previewNumber("offset",36)*h/1080*(1-progress),bg=previewColor("boxColor","#111111"),fg=previewColor("textColor","#FFFFFF");bg[3]=progress;fg[3]=progress;fillPreviewRoundRect(g,origin[0],origin[1]+offset,boxW,boxH,previewNumber("radius",24)*w/1920,bg);try{var pen=g.newPen(g.PenType.SOLID_COLOR,fg,1),label=text.length>28?text.substr(0,25)+"...":text;g.drawString(label,pen,origin[0]+Math.max(8,boxW*.08),origin[1]+offset+boxH*.36);}catch(ignoreTitleText){}}
    function drawRoundedPreview(g,w,h) {
        var entry=roundedEntrySeconds(),states=roundedAnimationStates(),p=clamp01(QuickEditECPreviewState.phase),out=!!previewField("animateOut",false),last=states[states.length-1],state,alpha=1,total=roundedTimelineInfo().duration,previewTime=p*total;
        if(out&&previewTime>Math.max(last.time,total-entry)){var exitStart=Math.max(last.time,total-entry),exitMix=(previewTime-exitStart)/Math.max(0.0001,total-exitStart);state=mixRoundedState(last,states[0],exitMix);alpha=1-smooth(exitMix);}else{state=roundedStateAtTime(previewTime,states);alpha=clamp01(previewTime/entry);}
        var rw=w*state.frameWidth/100,rh=h*state.frameHeight/100,radius=state.radius*Math.min(w/640,h/360),bg=previewColor("background","#FFFFFF");bg[3]=alpha;
        fillPreviewRect(g,0,0,w,h,bg);
        var origin=previewFrameOriginAt(w,h,rw,rh,0,state.x,state.y);drawRealRoundedFrame(g,origin[0],origin[1],rw,rh,radius,[0.12,0.55,0.92,1],bg,state.mediaScale,w,h);
    }
    function drawLayoutPreview(g,w,h,recipe) {
        var progress=previewLayoutProgress(),margin,gap,panelW,panelH,size,smallW,smallH,x,y,origin,startW,startH,startX,startY,radius,bg;
        if(recipe === "blurredBackdrop") {
            fillPreviewRect(g,0,0,w,h,[lerp(0.12,0.055,progress),lerp(0.55,0.16,progress),lerp(0.92,0.27,progress),1]);
            size=previewNumber("size",76)/100; smallW=lerp(w,w*size,progress); smallH=lerp(h,h*size,progress);
            origin=previewFrameOrigin(w,h,smallW,smallH,0); radius=previewNumber("radius",34)*w/640*progress;
            fillPreviewRoundRect(g,origin[0],origin[1],smallW,smallH,radius,[0.12,0.55,0.92,1]);
            return;
        }
        if(recipe === "pictureInPicture") {
            fillPreviewRect(g,0,0,w,h,[0.12,0.55,0.92,1]); size=previewNumber("size",32)/100;
            startW=w*0.78;startH=h*0.72;smallW=lerp(startW,w*size,progress);smallH=lerp(startH,h*size*0.72,progress);
            margin=Math.max(0,previewNumber("margin",42)*w/640); origin=previewFrameOrigin(w,h,w*size,h*size*0.72,margin);
            startX=(w-startW)/2;startY=(h-startH)/2;x=lerp(startX,origin[0],progress);y=lerp(startY,origin[1],progress);
            fillPreviewRoundRect(g,x,y,smallW,smallH,previewNumber("radius",26)*w/640*progress,[0.66,0.34,0.96,1]); return;
        }
        if(recipe === "splitScreen") {
            bg=previewColor("background","#101010");bg[3]=progress;fillPreviewRect(g,0,0,w,h,bg);margin=Math.max(3,previewNumber("margin",32)*w/640);gap=Math.max(2,previewNumber("gap",20)*w/640);
            panelW=(w-margin*2-gap)/2;panelH=h-margin*2;startW=w*0.68;startH=h*0.72;radius=previewNumber("radius",24)*w/640*progress;
            fillPreviewRoundRect(g,lerp((w-startW)/2,margin,progress),lerp((h-startH)/2,margin,progress),lerp(startW,panelW,progress),lerp(startH,panelH,progress),radius,[0.12,0.55,0.92,1]);
            fillPreviewRoundRect(g,lerp((w-startW)/2,margin+panelW+gap,progress),lerp((h-startH)/2,margin,progress),lerp(startW,panelW,progress),lerp(startH,panelH,progress),radius,[0.96,0.32,0.38,1]); return;
        }
    }
    function drawMotionPreview(g,w,h,recipe) {
        var p=QuickEditECPreviewState.phase,scale=1,target=previewPoint(w,h),x=target[0],y=target[1],alpha=1,base=Math.min(w,h)*0.45,direction,amount,decay;
        if(recipe === "impactScale") {
            if(p<0.35) scale=1+(previewNumber("peak",110)/100-1)*smooth(p/0.35);
            else if(p<0.62) scale=previewNumber("peak",110)/100+(previewNumber("recoil",90)-previewNumber("peak",110))/100*smooth((p-0.35)/0.27);
            else scale=previewNumber("recoil",90)/100+(1-previewNumber("recoil",90)/100)*smooth((p-0.62)/0.38);
        } else if(recipe === "popIn") {
            scale=smooth(Math.min(1,p/0.52))*previewNumber("peak",115)/100; if(p>0.52) scale=previewNumber("peak",115)/100+(1-previewNumber("peak",115)/100)*smooth((p-0.52)/0.48);
        } else if(recipe === "popOut") {
            if(p<0.36) scale=1+(previewNumber("anticipation",108)/100-1)*smooth(p/0.36); else scale=previewNumber("anticipation",108)/100*(1-smooth((p-0.36)/0.64));
        } else if(recipe === "hitShake") {
            decay=1-p; scale=1+(previewNumber("peak",106)/100-1)*Math.sin(Math.PI*p)*decay; x+=Math.sin(p*Math.PI*10)*w*0.06*decay; y+=Math.cos(p*Math.PI*8)*h*0.05*decay;
        } else if(recipe === "slideOvershoot") {
            direction=previewField("direction","left"); amount=1-smooth(Math.min(1,p/0.72));
            if(direction==="left") x-=w*amount; else if(direction==="right") x+=w*amount; else if(direction==="top") y-=h*amount; else y+=h*amount;
        } else if(recipe === "fadeScale") {
            scale=previewNumber("startScale",85)/100+(1-previewNumber("startScale",85)/100)*smooth(p); alpha=smooth(p);
        } else if(recipe === "pulseLoop") scale=1+(previewNumber("peak",105)/100-1)*(0.5-0.5*Math.cos(p*Math.PI*2));
        else if(recipe === "handheld") { x+=Math.sin(p*Math.PI*11)*w*0.035; y+=Math.cos(p*Math.PI*7)*h*0.03; }
        fillPreviewRoundRect(g,x-base*scale/2,y-base*0.58*scale/2,base*scale,base*0.58*scale,12,[0.36,0.42,0.92,alpha]);
    }
    function drawPreview() {
        var g=this.graphics,w=this.size.width,h=this.size.height;
        fillPreviewRect(g,0,0,w,h,[0.08,0.085,0.095,1]);
        if(currentRecipe === "cascadeCover") drawCascadePreview(g,w,h);
        else if(currentRecipe === "roundedMedia") drawRoundedPreview(g,w,h);
        else if(currentRecipe === "smartTitle") drawSmartTitlePreview(g,w,h);
        else if(currentRecipe === "blurredBackdrop" || currentRecipe === "pictureInPicture" || currentRecipe === "splitScreen") drawLayoutPreview(g,w,h,currentRecipe);
        else drawMotionPreview(g,w,h,currentRecipe);
    }
    function greatestCommonDivisor(a,b) {
        a=Math.max(1,Math.round(Math.abs(a))); b=Math.max(1,Math.round(Math.abs(b)));
        while(b){ var rest=a%b; a=b; b=rest; }
        return a;
    }
    function syncPositionPadAspect(displayRatio) {
        if (!positionPad) return null;
        if (!displayRatio) {
            var active=app.project.activeItem,sw=1920,sh=1080,pa=1;
            if(active instanceof CompItem && active.width>0 && active.height>0){ sw=active.width; sh=active.height; pa=Number(active.pixelAspect)||1; }
            displayRatio=(sw*pa)/sh;
        }
        var maxW=180,maxH=115,padW,padH;
        if(displayRatio>=maxW/maxH){ padW=maxW; padH=Math.max(1,Math.round(maxW/displayRatio)); }
        else { padH=maxH; padW=Math.max(1,Math.round(maxH*displayRatio)); }
        positionPad.preferredSize=[padW,padH]; positionPad.minimumSize=[padW,padH]; positionPad.maximumSize=[padW,padH];
        return { width:padW,height:padH,ratio:displayRatio };
    }
    function syncPreviewAspect() {
        var item=app.project.activeItem,sourceW=1920,sourceH=1080,pixelAspect=1,hasComp=false;
        if(item instanceof CompItem && item.width>0 && item.height>0) { sourceW=item.width; sourceH=item.height; pixelAspect=Number(item.pixelAspect)||1; hasComp=true; }
        var displayRatio=(sourceW*pixelAspect)/sourceH,maxW=296,maxH=224,previewW,previewH;
        if(displayRatio>=maxW/maxH) { previewW=maxW; previewH=Math.max(1,Math.round(maxW/displayRatio)); }
        else { previewH=maxH; previewW=Math.max(1,Math.round(maxH*displayRatio)); }
        if(previewCanvas) {
            previewCanvas.preferredSize=[previewW,previewH]; previewCanvas.minimumSize=[previewW,previewH]; previewCanvas.maximumSize=[previewW,previewH];
        }
        syncPreviewTimeSource();updatePreviewMetadata();
        syncPositionPadAspect(displayRatio);
        if(ui) { try { ui.layout.layout(true); ui.layout.resize(); } catch(ignoreLayout) {} }
        return { sourceWidth:sourceW, sourceHeight:sourceH, pixelAspect:pixelAspect, ratio:displayRatio, previewWidth:previewW, previewHeight:previewH, hasComposition:hasComp };
    }
    function previewRulerMetrics(control) { var w=Math.max(100,control?control.size.width:370),h=Math.max(34,control?control.size.height:42);return {left:8,right:w-8,width:Math.max(1,w-16),top:3,bottom:h-3,rulerY:18,laneTop:23,laneBottom:h-3}; }
    function previewPhaseFromX(x,control) { var m=previewRulerMetrics(control),local=(Math.max(m.left,Math.min(m.right,x))-m.left)/m.width;return clamp01(previewTimeState.start+local*previewTimeSpan()); }
    function previewRulerLabel(seconds) { var rounded=Math.round(seconds*100)/100;if(rounded>=60){var minutes=Math.floor(rounded/60),rest=Math.round((rounded-minutes*60)*100)/100;return minutes+":"+(rest<10?"0":"")+String(rest).replace(/\.0+$/,"");}return String(rounded).replace(/\.0+$/,"")+"s"; }
    function drawPreviewTimeRuler() {
        var g=this.graphics,m=previewRulerMetrics(this),info=roundedTimelineInfo(),span=previewTimeSpan(),end=previewTimeState.start+span,startSeconds=info.inPoint+previewTimeState.start*info.duration,endSeconds=info.inPoint+end*info.duration,visibleSeconds=Math.max(info.frame,endSeconds-startSeconds),stepSeconds=1,minorStep,spacing,first,t,p,x,major,playLocal,navigatorX,navigatorW,labelX,labelPen=g.newPen(g.PenType.SOLID_COLOR,[0.70,0.72,0.76,1],1);
        fillPreviewRect(g,0,0,this.size.width,this.size.height,[0.085,0.09,0.105,1]);fillPreviewRect(g,1,m.laneTop,this.size.width-2,m.laneBottom-m.laneTop,[0.125,0.135,0.15,1]);
        if(info.duration<=2)stepSeconds=0.25;else if(info.duration>120)stepSeconds=10;else if(info.duration>30)stepSeconds=5;
        spacing=stepSeconds/visibleSeconds*m.width;while(spacing<48){stepSeconds*=2;spacing*=2;}while(spacing>120&&stepSeconds/2>=info.frame){stepSeconds/=2;spacing/=2;}
        minorStep=stepSeconds/4;first=Math.ceil(startSeconds/minorStep)*minorStep;
        fillPreviewRect(g,m.left,m.rulerY,m.width,1,[0.31,0.33,0.37,1]);
        for(t=first;t<=endSeconds+0.0001;t+=minorStep){p=(t-info.inPoint)/info.duration;x=m.left+(p-previewTimeState.start)/span*m.width;major=Math.abs(t/stepSeconds-Math.round(t/stepSeconds))<0.001;fillPreviewRect(g,Math.round(x),major?6:12,1,major?13:7,major?[0.64,0.67,0.72,1]:[0.38,0.41,0.46,1]);if(major){labelX=Math.max(1,Math.min(this.size.width-25,Math.round(x)+3));try{g.drawString(previewRulerLabel(t),labelPen,labelX,1);}catch(ignoreRulerText){}}}
        fillPreviewRoundRect(g,m.left,m.laneTop+5,m.width,9,3,[0.18,0.19,0.22,1]);navigatorX=m.left+previewTimeState.start*m.width;navigatorW=Math.max(12,span*m.width);fillPreviewRoundRect(g,navigatorX,m.laneTop+5,navigatorW,9,3,previewTimeState.zoom>1.005?[0.16,0.42,0.64,1]:[0.29,0.32,0.36,1]);
        if(previewTimeState.zoom>1.005){fillPreviewRect(g,navigatorX+2,m.laneTop+7,2,5,[0.65,0.84,0.97,1]);fillPreviewRect(g,navigatorX+navigatorW-4,m.laneTop+7,2,5,[0.65,0.84,0.97,1]);}
        playLocal=(clamp01(QuickEditECPreviewState.phase)-previewTimeState.start)/span;x=m.left+Math.max(0,Math.min(1,playLocal))*m.width;
        fillPreviewRect(g,Math.round(x),m.top,2,m.bottom-m.top,[0.20,0.67,1,1]);g.newPath();g.moveTo(x-5,m.top);g.lineTo(x+6,m.top);g.lineTo(x+1,m.top+6);g.lineTo(x-5,m.top);g.fillPath(g.newBrush(g.BrushType.SOLID_COLOR,[0.20,0.67,1,1]));
    }
    function previewTimeSpan() { return 1/Math.max(1,previewTimeState.zoom); }
    function movePreviewTimeNavigator(x,control) { var m=previewRulerMetrics(control),pointer=(Math.max(m.left,Math.min(m.right,x))-m.left)/m.width;previewTimeState.start=clampPreviewTimeStart(pointer-previewTimeNavGrab);updatePreviewTimeControls(); }
    function previewMaximumZoom() { var info=roundedTimelineInfo(),frames=Math.max(2,Math.round(info.duration/info.frame));return Math.max(1,Math.min(1024,frames/2)); }
    function clampPreviewTimeStart(value) { var span=previewTimeSpan();return Math.max(0,Math.min(1-span,Number(value)||0)); }
    function ensurePreviewPhaseVisible(phase) { var span=previewTimeSpan();if(phase<previewTimeState.start)previewTimeState.start=phase;else if(phase>previewTimeState.start+span)previewTimeState.start=phase-span;previewTimeState.start=clampPreviewTimeStart(previewTimeState.start); }
    function previewPhaseFromSlider() { return Math.max(0,Math.min(1,previewTimeState.start+(previewSlider?previewSlider.value/100:0)*previewTimeSpan())); }
    function updatePreviewTimeControls() {
        var zoom=previewTimeState.zoom,span=previewTimeSpan(),info=roundedTimelineInfo(),startTime=info.inPoint+previewTimeState.start*info.duration,endTime=info.inPoint+(previewTimeState.start+span)*info.duration,label=zoom<1.005?"Todo":(Math.round(zoom*10)/10)+"x";
        if(previewZoomOut)previewZoomOut.enabled=zoom>1.005;if(previewZoomIn)previewZoomIn.enabled=zoom<previewMaximumZoom()-0.001;
        if(previewZoomFit){previewZoomFit.text=label;previewZoomFit.helpTip="Ajustar toda la duracion de la capa";}
        if(previewSlider){previewSlider.helpTip="Ventana visible: "+formatSeconds(startTime)+"–"+formatSeconds(endTime)+" · Zoom "+label+" · Arrastra la barra inferior para desplazar";try{previewSlider.notify("onDraw");}catch(ignoreRulerDraw){}}
    }
    function syncPreviewTimeSource() {
        var info=roundedTimelineInfo(),key=(info.comp?info.comp.name:"")+"|"+(info.layer?info.layer.index:0)+"|"+info.inPoint+"|"+info.outPoint+"|"+info.frame;
        if(previewTimeState.timingKey!==key){previewTimeState.zoom=1;previewTimeState.start=0;previewTimeState.timingKey=key;}
        ensurePreviewPhaseVisible(QuickEditECPreviewState.phase);updatePreviewTimeControls();
    }
    function setPreviewTimeZoom(multiplier) {
        var span=previewTimeSpan(),phase=clamp01(QuickEditECPreviewState.phase),anchor=Math.max(0,Math.min(1,(phase-previewTimeState.start)/span));return setPreviewTimeZoomAt(multiplier,anchor);
    }
    function setPreviewTimeZoomAt(multiplier,anchor) {
        var old=previewTimeState.zoom,max=previewMaximumZoom(),oldSpan=previewTimeSpan(),next=Math.max(1,Math.min(max,old*multiplier)),anchorLocal=Math.max(0,Math.min(1,Number(anchor)||0)),anchorPhase=previewTimeState.start+anchorLocal*oldSpan;
        if(Math.abs(next-old)<0.0001)return next;previewTimeState.zoom=next;previewTimeState.start=clampPreviewTimeStart(anchorPhase-anchorLocal*previewTimeSpan());updatePreviewPhase(QuickEditECPreviewState.phase,false);return next;
    }
    function panPreviewTime(direction) {
        if(previewTimeState.zoom<=1)return;previewTimeState.start=clampPreviewTimeStart(previewTimeState.start+previewTimeSpan()*0.25*direction);updatePreviewPhase(QuickEditECPreviewState.phase,false);
    }
    function fitPreviewTime() { previewTimeState.zoom=1;previewTimeState.start=0;updatePreviewPhase(QuickEditECPreviewState.phase,true);return 1; }
    function updatePreviewPhase(value, syncSlider) {
        var phase=Math.max(0,Math.min(1,Number(value)||0)); QuickEditECPreviewState.phase=phase;
        if(QuickEditECPreviewState.slider){if(syncSlider)ensurePreviewPhaseVisible(phase);QuickEditECPreviewState.slider.value=(phase-previewTimeState.start)/previewTimeSpan()*100;try{QuickEditECPreviewState.slider.notify("onDraw");}catch(ignorePhaseDraw){}}
        if(QuickEditECPreviewState.percent){var info=roundedTimelineInfo();QuickEditECPreviewState.percent.text=info.layer?formatSeconds(info.inPoint+phase*info.duration):Math.round(phase*100)+"%";}
        updatePreviewTimeControls();
        return phase;
    }
    api.setPreviewPhase = function (value) { var phase=updatePreviewPhase(value, true);refreshRealPreview(false);return phase; };
    api.syncPreviewAspect = syncPreviewAspect;
    function addFieldRow(spec, parent) {
        var row = parent.add("group"); row.orientation = "row"; row.alignChildren = ["left", "center"]; row.spacing = 6;
        var label = row.add("statictext", undefined, spec.label); label.preferredSize = [112, 22]; var control, i;
        if (spec.type === "choice") {
            control = row.add("dropdownlist", undefined, [], { name: spec.key }); control.preferredSize = [205, 24];
            for (i = 0; i < spec.options.length; i++) { var item = control.add("item", spec.options[i].label); item.value = spec.options[i].value; }
            control.selection = 0; control.onChange = function () {
                updateConditionalRows();
                if (spec.key === "corner" && control.selection) {
                    var cornerPosition=defaultPositionForPreset({recipe:"pictureInPicture",corner:control.selection.value}); setPositionPercent(cornerPosition.x,cornerPosition.y);
                }
            };
        } else if (spec.type === "bool") {
            control = row.add("checkbox", undefined, "Activado", { name: spec.key }); control.value = !!spec.value;control.onClick=updateConditionalRows;
        } else if (spec.type === "color") {
            control = row.add("edittext", undefined, String(spec.value), { name: spec.key }); control.preferredSize = [100, 24];
            var colorSwatch=row.add("group",undefined,undefined,{name:spec.key+"_swatch"}); colorSwatch.preferredSize=[22,22]; colorSwatch.minimumSize=[22,22]; colorSwatch.maximumSize=[22,22]; colorSwatch.onDraw=drawColorFieldSwatch(control,spec.key);
            var picker = row.add("button", undefined, "Selector", { name: spec.key + "_picker" }); picker.preferredSize = [65, 24];
            (function (edit,key,swatch,button) {
                edit.onActivate=function(){ setActiveColor(key); }; edit.onChange=function(){ setActiveColor(key); };
                swatch.addEventListener("click",function(e){ if(e.button===0) setActiveColor(key); });
                button.onClick = function () { var chosen; setActiveColor(key); try { chosen = chooseColor(edit.text); if (chosen) setColorField(key,chosen); } catch (e) { alert("Color no valido: " + e.message); } };
            })(control,spec.key,colorSwatch,picker);
        } else if (spec.type === "text") {
            control=row.add("edittext",undefined,String(spec.value),{name:spec.key});control.preferredSize=[205,24];
        } else {
            var slider = row.add("slider", undefined, Number(spec.value), spec.min, spec.max, { name: spec.key + "_slider" }); slider.preferredSize = [143, 20];
            control = row.add("edittext", undefined, String(spec.value), { name: spec.key }); control.preferredSize = [56, 24]; control.justify = "right";
            (function (slide, edit, field) {
                slide.onChanging = slide.onChange = function () { edit.text = displayNumber(slide.value, field); updateRoundedSelectedPrimaryField(field.key,edit.text);updateConditionalRows(); };
                edit.onChange = function () { var value = Number(edit.text); if (!isFinite(value)) { edit.text = displayNumber(slide.value, field); return; } value = Math.max(field.min, Math.min(field.max, value)); slide.value = value; edit.text = displayNumber(value, field); updateRoundedSelectedPrimaryField(field.key,value);updateConditionalRows(); };
            })(slider, control, spec);
            control._slider = slider;
        }
        fieldControls[spec.key] = control; fieldRows[spec.key] = row;
    }
    function addFieldCell(spec,parent) {
        var cell=parent.add("group",undefined,undefined,{name:spec.key+"_cell"}); cell.orientation="column"; cell.alignChildren=["fill","top"]; cell.spacing=2; cell.preferredSize=[155,47];
        var label=cell.add("statictext",undefined,spec.label); label.preferredSize=[150,18]; var controls=cell.add("group"),control,i; controls.orientation="row"; controls.spacing=5; controls.alignChildren=["left","center"];
        if(spec.type==="choice") {
            control=controls.add("dropdownlist",undefined,[],{name:spec.key}); control.preferredSize=[150,24];
            for(i=0;i<spec.options.length;i++){ var item=control.add("item",spec.options[i].label); item.value=spec.options[i].value; }
            control.selection=0; control.onChange=function(){ updateConditionalRows(); if(spec.key==="corner"&&control.selection){ var p=defaultPositionForPreset({recipe:"pictureInPicture",corner:control.selection.value}); setPositionPercent(p.x,p.y); } };
        } else if(spec.type==="bool") {
            control=controls.add("checkbox",undefined,"Activado",{name:spec.key}); control.value=!!spec.value; control.preferredSize=[150,24];control.onClick=updateConditionalRows;
        } else if(spec.type==="color") {
            control=controls.add("edittext",undefined,String(spec.value),{name:spec.key}); control.preferredSize=[64,24];
            var swatch=controls.add("group",undefined,undefined,{name:spec.key+"_swatch"}); swatch.preferredSize=[20,22]; swatch.minimumSize=[20,22]; swatch.maximumSize=[20,22]; swatch.onDraw=drawColorFieldSwatch(control,spec.key);
            var picker=controls.add("button",undefined,"...",{name:spec.key+"_picker"}); picker.preferredSize=[27,24]; picker.helpTip="Selector visual de color";
            var eye=controls.add("group",undefined,undefined,{name:spec.key+"_eyedropper"}); eye.preferredSize=[22,22];eye.minimumSize=[22,22];eye.maximumSize=[22,22];eye.helpTip="Cuentagotas: elige cualquier pixel de la pantalla";eye.onDraw=drawEyedropperIcon;
            (function(edit,key,colorChip,button,eyedrop){
                function openPicker(){var chosen;setActiveColor(key);try{chosen=chooseColor(edit.text);if(chosen)setColorField(key,chosen);}catch(e){alert("Color no valido: "+e.message);}}
                edit.onActivate=function(){setActiveColor(key);};edit.onChange=function(){setActiveColor(key);try{rememberColor(edit.text);}catch(ignoreManualColor){}};
                colorChip.addEventListener("click",function(e){if(e.button===0)openPicker();});button.onClick=openPicker;
                eyedrop.addEventListener("click",function(e){if(e.button===0)api.startEyedropper(key);});
            })(control,spec.key,swatch,picker,eye);
        } else if(spec.type==="text") {
            control=controls.add("edittext",undefined,String(spec.value),{name:spec.key});control.preferredSize=[150,24];
        } else {
            var slider=controls.add("slider",undefined,Number(spec.value),spec.min,spec.max,{name:spec.key+"_slider"}); slider.preferredSize=[94,20];
            control=controls.add("edittext",undefined,String(spec.value),{name:spec.key}); control.preferredSize=[50,24]; control.justify="right";
            (function(slide,edit,field){
                slide.onChanging=slide.onChange=function(){ edit.text=displayNumber(slide.value,field); updateRoundedSelectedPrimaryField(field.key,edit.text);updateConditionalRows(); };
                edit.onChange=function(){ var value=Number(edit.text); if(!isFinite(value)){ edit.text=displayNumber(slide.value,field); return; } value=Math.max(field.min,Math.min(field.max,value)); slide.value=value; edit.text=displayNumber(value,field); updateRoundedSelectedPrimaryField(field.key,value);updateConditionalRows(); };
            })(slider,control,spec); control._slider=slider;
        }
        fieldControls[spec.key]=control; fieldRows[spec.key]=cell;
    }
    function drawKeyframeCurveGraph(){var g=this.graphics,w=this.size.width,h=this.size.height,mode=keyframeCurve&&keyframeCurve.selection?keyframeCurve.selection.value:"both",strength=keyframeStrength?Math.max(1,Math.min(100,Number(keyframeStrength.text)||66)):66,i,p,x,y,previous=null,pen=g.newPen(g.PenType.SOLID_COLOR,[0.20,0.68,1,1],2);fillPreviewRect(g,0,0,w,h,[0.085,0.09,0.105,1]);g.newPath();for(i=0;i<=40;i++){p=i/40;if(mode==="linear")y=p;else if(mode==="hold")y=i===40?1:0;else{var power=1+strength/22;if(mode==="easeIn")y=Math.pow(p,power);else if(mode==="easeOut")y=1-Math.pow(1-p,power);else y=p<.5?Math.pow(p*2,power)/2:1-Math.pow((1-p)*2,power)/2;}x=4+p*(w-8);y=h-4-y*(h-8);if(!previous)g.moveTo(x,y);else g.lineTo(x,y);previous=[x,y];}g.strokePath(pen);}
    function buildUniversalKeyframePanel(parent){
        keyframePanel=parent.add("panel",undefined,"KEYFRAMES UNIVERSALES",{name:"universal_keyframes"});keyframePanel.orientation="column";keyframePanel.alignChildren=["fill","top"];keyframePanel.spacing=5;keyframePanel.margins=[8,14,8,8];
        var row=keyframePanel.add("group");row.orientation="row";row.spacing=6;keyframeCurve=row.add("dropdownlist",undefined,[],{name:"key_curve"});keyframeCurve.preferredSize=[145,24];var modes=[['Suave ambos','both'],['Ease In','easeIn'],['Ease Out','easeOut'],['Lineal','linear'],['Hold','hold']],i,item;for(i=0;i<modes.length;i++){item=keyframeCurve.add("item",modes[i][0]);item.value=modes[i][1];}keyframeCurve.selection=0;row.add("statictext",undefined,"Fuerza");keyframeStrength=row.add("edittext",undefined,"66",{name:"key_strength"});keyframeStrength.preferredSize=[42,24];
        keyframeGraph=keyframePanel.add("group",undefined,undefined,{name:"key_curve_graph"});keyframeGraph.preferredSize=[340,62];keyframeGraph.onDraw=drawKeyframeCurveGraph;keyframeCurve.onChange=keyframeStrength.onChange=function(){try{keyframeGraph.notify("onDraw");}catch(ignoreCurveDraw){}};
        var actions=keyframePanel.add("group");actions.orientation="row";actions.spacing=5;var apply=actions.add("button",undefined,"Aplicar curva",{name:"key_apply"}),copy=actions.add("button",undefined,"Copiar",{name:"key_copy"}),paste=actions.add("button",undefined,"Pegar",{name:"key_paste"});apply.preferredSize=[130,25];copy.preferredSize=paste.preferredSize=[78,25];
        var offsetRow=keyframePanel.add("group");offsetRow.orientation="row";offsetRow.spacing=5;offsetRow.add("statictext",undefined,"Desplazar frames");keyframeOffset=offsetRow.add("edittext",undefined,"0",{name:"key_offset"});keyframeOffset.preferredSize=[55,24];var offsetButton=offsetRow.add("button",undefined,"Mover",{name:"key_move"});offsetButton.preferredSize=[80,24];
        keyframeStatus=keyframePanel.add("statictext",undefined,"Selecciona keyframes en la linea de tiempo.",{name:"key_status"});
        apply.onClick=function(){run("Curva Quick Edit EC",function(){var result=api.applyKeyframeCurve({mode:keyframeCurve.selection.value,strength:Number(keyframeStrength.text)});keyframeStatus.text=result.properties+" propiedades actualizadas";});};
        copy.onClick=function(){try{api.copySelectedCurve();keyframeStatus.text="Curva copiada";}catch(e){alert("Keyframes\n\n"+e.message);}};paste.onClick=function(){run("Pegar curva Quick Edit EC",function(){var result=api.pasteSelectedCurve();keyframeStatus.text=result.properties+" propiedades actualizadas";});};
        offsetButton.onClick=function(){run("Mover keyframes Quick Edit EC",function(){var result=api.offsetSelectedKeyframes(Number(keyframeOffset.text));keyframeStatus.text="Movidos "+result.frames+" frames";});};
    }
    function buildSequencePanel(parent){
        var panel=parent.add("panel",undefined,"SECUENCIA Y STAGGER",{name:"sequence_panel"});panel.orientation="column";panel.alignChildren=["fill","top"];panel.spacing=5;panel.margins=[8,14,8,8];
        var row1=panel.add("group");row1.orientation="row";row1.spacing=6;sequenceMode=row1.add("dropdownlist",undefined,[],{name:"sequence_mode"});var item=sequenceMode.add("item","Capas completas");item.value="layers";item=sequenceMode.add("item","Keyframes seleccionados");item.value="keyframes";sequenceMode.selection=0;sequenceMode.preferredSize=[154,24];sequenceOrder=row1.add("dropdownlist",undefined,[],{name:"sequence_order"});var orders=[['Linea de tiempo','timeline'],['Izq. → der.','left'],['Der. → izq.','right'],['Arriba → abajo','top'],['Abajo → arriba','bottom'],['Desde el centro','center'],['Aleatorio estable','random']],i;for(i=0;i<orders.length;i++){item=sequenceOrder.add("item",orders[i][0]);item.value=orders[i][1];}sequenceOrder.selection=0;sequenceOrder.preferredSize=[154,24];
        var row2=panel.add("group");row2.orientation="row";row2.spacing=6;row2.add("statictext",undefined,"Paso frames");sequenceStep=row2.add("edittext",undefined,"3",{name:"sequence_step"});sequenceStep.preferredSize=[48,24];sequenceReverse=row2.add("checkbox",undefined,"Invertir",{name:"sequence_reverse"});var apply=row2.add("button",undefined,"APLICAR",{name:"sequence_apply"});apply.preferredSize=[104,26];
        sequenceStatus=panel.add("statictext",undefined,"Orden espacial, temporal o aleatorio.",{name:"sequence_status"});
        apply.onClick=function(){run("Secuencia Quick Edit EC",function(){var result=api.applyStagger({mode:sequenceMode.selection.value,order:sequenceOrder.selection.value,stepFrames:Number(sequenceStep.text),reverse:sequenceReverse.value});sequenceStatus.text=result.layers+" capas · "+result.frames+" frames";});};return panel;
    }
    function buildForm(recipe) {
        currentRecipe = recipe; updatePreviewPhase(0, true); fieldControls = {}; fieldRows = {}; form.removeAll(); leftForm.removeAll(); positionPanel=null; positionStage=null; positionPad=null; positionValue=null; roundedStages=[];roundedInitialState={durationFrames:12,positionX:50,positionY:50,frameWidth:82,frameHeight:82,mediaScale:100,radius:36,easing:"bezier"};roundedStagePanel=null;roundedStageTimeline=null;roundedStageStatus=null;roundedStageSelected=-1;roundedStageDragging=false;roundedStageDragId="";roundedStageEditorRows=[];roundedStageEditors={};roundedStageAdd=null;roundedStageDuplicate=null;roundedStageDelete=null;roundedStageUsePosition=null;activeColorKey=""; colorPaletteLabel=null; QuickEditECPreviewState.positionPad=null;
        var fields = RECIPES[recipe].fields, sections = ["FORMA Y MOVIMIENTO", "TIEMPO", "COLORES", "OPCIONES"], s, i, panel, used, gridRow, gridCount;
        if(positionEnabledFor(recipe)) buildPositionPanel(form);
        for (s = 0; s < sections.length; s++) {
            used = false;
            for (i = 0; i < fields.length; i++) if (sectionFor(fields[i]) === sections[s]) used = true;
            if (!used) continue;
            var sectionParent = sections[s] === "FORMA Y MOVIMIENTO" || sections[s] === "TIEMPO" ? leftForm : form;
            panel = sectionParent.add("panel", undefined, sections[s], { name: sections[s] === "FORMA Y MOVIMIENTO" ? "shape_motion_section" : sections[s] === "TIEMPO" ? "time_section" : sections[s] === "COLORES" ? "colors_section" : "options_section" }); panel.orientation = "column"; panel.alignChildren = ["fill", "top"]; panel.spacing = 5; panel.margins = [8, 14, 8, 8];
            gridCount=0;
            for(i=0;i<fields.length;i++) if(sectionFor(fields[i])===sections[s]) {
                if(gridCount%2===0){ gridRow=panel.add("group"); gridRow.orientation="row"; gridRow.alignChildren=["left","top"]; gridRow.spacing=8; }
                addFieldCell(fields[i],gridRow); gridCount++;
            }
            if (sections[s] === "COLORES") { addQuickPalette(panel); if(recipe === "cascadeCover") panel.add("statictext", undefined, "El ultimo color se convierte en el fondo."); }
        }
        if(recipe === "roundedMedia") buildRoundedStagePanel(leftForm);
        buildUniversalKeyframePanel(leftForm);
        recipeLabel.text = RECIPES[recipe].title; recipeLabel.helpTip=RECIPES[recipe].title; selectionLabel.text = RECIPES[recipe].selection; selectionLabel.helpTip=RECIPES[recipe].selection; updateConditionalRows();
    }
    function fillForm(preset) {
        if (currentRecipe !== preset.recipe) buildForm(preset.recipe);
        var fields = RECIPES[preset.recipe].fields, i, j, control, raw, defaultPosition=defaultPositionForPreset(preset);
        for (i = 0; i < fields.length; i++) {
            control = fieldControls[fields[i].key];
            raw=preset[fields[i].key]===undefined?fields[i].value:preset[fields[i].key];
            if (fields[i].type === "choice") { for (j = 0; j < control.items.length; j++) if (control.items[j].value === raw) { control.selection = j; break; } }
            else if (fields[i].type === "bool") control.value = !!raw;
            else { control.text = String(raw); if (control._slider) control._slider.value = Number(raw); }
        }
        setPositionPercent(preset.positionX === undefined ? defaultPosition.x : preset.positionX, preset.positionY === undefined ? defaultPosition.y : preset.positionY);
        if(preset.recipe === "roundedMedia") roundedInitialState={durationFrames:Math.max(1,Math.round(Number(fieldControls.durationFrames.text)||12)),positionX:positionState.x,positionY:positionState.y,frameWidth:Number(fieldControls.frameWidth.text)||82,frameHeight:Number(fieldControls.frameHeight.text)||82,mediaScale:Number(fieldControls.mediaScale.text)||100,radius:Number(fieldControls.radius.text)||0,easing:preset.initialEasing==="linear"?"linear":"bezier"};
        if(preset.recipe === "roundedMedia") loadRoundedStages(preset.stages||[]);
        updateConditionalRows();
    }
    function resetCurrentValues() {
        var preset=catalog&&catalog.selection?catalog.selection.preset:null;
        if(!preset)return false;
        fillForm(preset);
        previewTimeState.zoom=1;previewTimeState.start=0;
        updatePreviewPhase(0,true);
        syncPreviewAspect();refreshRealPreview(true);
        refreshLeftScroll(false);refreshRightScroll(false);
        return true;
    }
    function refreshCatalog(selectId) {
        var presets = allPresets(), index = 0, shown = 0, i, category = categoryFilter && categoryFilter.selection ? categoryFilter.selection.value : "Todos"; catalog.removeAll();
        for (i = 0; i < presets.length; i++) {
            if (category !== "Todos" && RECIPES[presets[i].recipe].category !== category) continue;
            var item = catalog.add("item", presets[i].name); item.preset = presets[i]; if (presets[i].id === selectId) index = shown; shown++;
        }
        if (shown) { catalog.selection = index; if (catalog.selection) fillForm(catalog.selection.preset); }
    }
    api.getPresets = allPresets; api.getRecipeDefinitions = function () { return RECIPES; }; api.version = VERSION;
    api.setPosition = function (x,y) { return setPositionPercent(number(x,"Posicion X",0,100),number(y,"Posicion Y",0,100)); };
    api.getPosition = function () { return {x:positionState.x,y:positionState.y}; };
    api.resetCurrentValues = resetCurrentValues;
    api.readLayerMetadata=readLayerMetadata;
    api.reopenSelectedRecipe=reopenSelectedRecipe;
    api.cleanupRecipeInstance=cleanupRecipeInstance;
    api.openRecipeLibrary=openRecipeLibrary;

    ui = new Window("palette", "Quick Edit EC by JamsTonios", undefined, { resizeable: true });
    ui.orientation = "row"; ui.alignChildren = ["fill", "fill"]; ui.spacing = 10; ui.margins = 10; ui.minimumSize = [800, 460];
    leftViewport = ui.add("group", undefined, undefined, { name: "preview_viewport" }); leftViewport.orientation = "row"; leftViewport.alignChildren = ["left", "fill"]; leftViewport.spacing = 4; leftViewport.preferredSize = [410, 520]; leftViewport.minimumSize = [400, 360];
    leftContentHost = leftViewport.add("group", undefined, undefined, { name: "preview_content_host" }); leftContentHost.orientation = "stack"; leftContentHost.alignChildren = ["fill", "top"]; leftContentHost.preferredSize = [390, 520]; leftContentHost.minimumSize = [380, 360];
    leftColumn = leftContentHost.add("group", [0,0,390,LEFT_CONTENT_HEIGHT], undefined, { name: "preview_column" }); leftColumn.orientation = "column"; leftColumn.alignChildren = ["fill", "top"]; leftColumn.spacing = 8;
    var leftRail = leftViewport.add("group", undefined, undefined, { name: "preview_scroll_rail" }); leftRail.orientation = "column"; leftRail.alignChildren = ["fill", "top"]; leftRail.spacing = 3; leftRail.preferredSize = [16,520];
    leftScrollUp = leftRail.add("button", undefined, "▲", { name: "preview_scroll_up" }); leftScrollUp.preferredSize = [16,20]; leftScrollUp.helpTip = "Subir vista previa";
    leftScrollTrack = leftRail.add("group", undefined, undefined, { name: "preview_scroll" }); leftScrollTrack.preferredSize = [16,474]; leftScrollTrack.minimumSize = [16,90]; leftScrollTrack.onDraw = drawLeftScroll; leftScrollTrack.helpTip = "Arrastra para recorrer la columna de vista previa";
    leftScrollDown = leftRail.add("button", undefined, "▼", { name: "preview_scroll_down" }); leftScrollDown.preferredSize = [16,20]; leftScrollDown.helpTip = "Bajar vista previa";
    leftScrollUp.onClick = function () { setLeftScroll(leftScrollState.offset - 90, true); };
    leftScrollDown.onClick = function () { setLeftScroll(leftScrollState.offset + 90, true); };
    leftScrollTrack.addEventListener("mousedown", function (e) { if (e.button !== 0) return; var m=leftScrollMetrics(); leftScrollState.dragging=true; leftScrollState.grab=e.clientY>=m.top&&e.clientY<=m.top+m.thumb?e.clientY-m.top:m.thumb/2; scrollLeftFromTrack(e.clientY,true); });
    leftScrollTrack.addEventListener("mousemove", function (e) { if (leftScrollState.dragging) scrollLeftFromTrack(e.clientY,true); });
    leftScrollTrack.addEventListener("mouseup", function (e) { if (e.button===0) { if (leftScrollState.dragging) scrollLeftFromTrack(e.clientY,true); leftScrollState.dragging=false; } });
    leftScrollTrack.addEventListener("mouseout", function () { leftScrollState.dragging=false; });
    rightViewport = ui.add("group", undefined, undefined, { name: "right_viewport" }); rightViewport.orientation = "row"; rightViewport.alignChildren = ["left", "fill"]; rightViewport.spacing = 4; rightViewport.preferredSize = [360, 520]; rightViewport.minimumSize = [350, 360];
    rightContentHost = rightViewport.add("group", undefined, undefined, { name: "right_content_host" }); rightContentHost.orientation = "stack"; rightContentHost.alignChildren = ["fill", "top"]; rightContentHost.preferredSize = [338, 520]; rightContentHost.minimumSize = [328, 360];
    rightColumn = rightContentHost.add("group", [0,0,338,RIGHT_CONTENT_HEIGHT], undefined, { name: "right_content" }); rightColumn.orientation = "column"; rightColumn.alignChildren = ["fill", "top"]; rightColumn.spacing = 8;
    var rightRail = rightViewport.add("group", undefined, undefined, { name: "right_scroll_rail" }); rightRail.orientation = "column"; rightRail.alignChildren = ["fill", "top"]; rightRail.spacing = 3; rightRail.preferredSize = [16,520];
    rightScrollUp = rightRail.add("button", undefined, "▲", { name: "right_scroll_up" }); rightScrollUp.preferredSize = [16,20]; rightScrollUp.helpTip = "Subir ajustes";
    rightScrollTrack = rightRail.add("group", undefined, undefined, { name: "right_scroll" }); rightScrollTrack.preferredSize = [16,474]; rightScrollTrack.minimumSize = [16,90]; rightScrollTrack.onDraw = drawRightScroll; rightScrollTrack.helpTip = "Arrastra para recorrer la columna de ajustes";
    rightScrollDown = rightRail.add("button", undefined, "▼", { name: "right_scroll_down" }); rightScrollDown.preferredSize = [16,20]; rightScrollDown.helpTip = "Bajar ajustes";
    rightScrollUp.onClick = function () { setRightScroll(rightScrollState.offset - 90, true); };
    rightScrollDown.onClick = function () { setRightScroll(rightScrollState.offset + 90, true); };
    rightScrollTrack.addEventListener("mousedown", function (e) { if (e.button !== 0) return; var m=rightScrollMetrics(); rightScrollState.dragging=true; rightScrollState.grab=e.clientY>=m.top&&e.clientY<=m.top+m.thumb?e.clientY-m.top:m.thumb/2; scrollRightFromTrack(e.clientY,true); });
    rightScrollTrack.addEventListener("mousemove", function (e) { if (rightScrollState.dragging) scrollRightFromTrack(e.clientY,true); });
    rightScrollTrack.addEventListener("mouseup", function (e) { if (e.button===0) { if (rightScrollState.dragging) scrollRightFromTrack(e.clientY,true); rightScrollState.dragging=false; } });
    rightScrollTrack.addEventListener("mouseout", function () { rightScrollState.dragging=false; });
    var preview = leftColumn.add("panel", undefined, "VISTA PREVIA"); preview.orientation = "column"; preview.alignChildren = ["center", "top"]; preview.spacing = 8; preview.margins = [10,18,10,10];
    previewStage = preview.add("group", undefined, undefined, { name: "preview_stage" }); previewStage.orientation = "stack"; previewStage.alignChildren = ["center", "center"]; previewStage.preferredSize = [296,224]; previewStage.minimumSize = [296,224]; previewStage.maximumSize = [296,224];
    previewCanvas = previewStage.add("group", undefined, undefined, { name: "preview_canvas" }); previewCanvas.onDraw = drawPreview;
    previewAspectLabel = preview.add("statictext", undefined, "", { name: "preview_aspect" }); previewAspectLabel.preferredSize = [370,20]; previewAspectLabel.justify = "center";
    var previewTimeline = preview.add("group"); previewTimeline.orientation = "column"; previewTimeline.alignChildren = ["center", "top"]; previewTimeline.spacing = 3;
    previewSlider = previewTimeline.add("group", undefined, undefined, { name: "preview_phase" }); previewSlider.preferredSize = [370,42];previewSlider.minimumSize=[370,42];previewSlider.maximumSize=[370,42];previewSlider.value=0;previewSlider.onDraw=drawPreviewTimeRuler;
    var previewTransport=previewTimeline.add("group");previewTransport.orientation="row";previewTransport.alignChildren=["left","center"];previewTransport.spacing=5;previewTransport.preferredSize=[370,24];
    var previewTransportLabel = previewTransport.add("statictext", undefined, "Tiempo"); previewTransportLabel.preferredSize = [44,20];previewTransportLabel.helpTip="Tiempo real de la capa";
    previewPercent = previewTransport.add("statictext", undefined, "0%", { name: "preview_percent" }); previewPercent.preferredSize = [70,20]; previewPercent.justify = "left";
    var previewTransportSpace=previewTransport.add("statictext",undefined,"");previewTransportSpace.preferredSize=[130,20];
    previewZoomOut=previewTransport.add("button",undefined,"−",{name:"preview_zoom_out"});previewZoomOut.preferredSize=[24,22];previewZoomOut.helpTip="Alejar tiempo";
    previewZoomIn=previewTransport.add("button",undefined,"+",{name:"preview_zoom_in"});previewZoomIn.preferredSize=[24,22];previewZoomIn.helpTip="Acercar tiempo";
    previewZoomFit=previewTransport.add("button",undefined,"Todo",{name:"preview_zoom_fit"});previewZoomFit.preferredSize=[42,22];
    previewSlider.addEventListener("mousedown",function(e){if(e.button!==0)return;var m=previewRulerMetrics(previewSlider),span=previewTimeSpan(),pointer=(Math.max(m.left,Math.min(m.right,e.clientX))-m.left)/m.width;if(previewTimeState.zoom>1.005&&(e.clientY>=m.laneTop||e.shiftKey)){previewTimeNavigating=true;if(pointer>=previewTimeState.start&&pointer<=previewTimeState.start+span)previewTimeNavGrab=pointer-previewTimeState.start;else{previewTimeNavGrab=span/2;movePreviewTimeNavigator(e.clientX,previewSlider);}}else{previewTimeDragging=true;updatePreviewPhase(previewPhaseFromX(e.clientX,previewSlider),false);}});
    previewSlider.addEventListener("mousemove",function(e){if(previewTimeNavigating)movePreviewTimeNavigator(e.clientX,previewSlider);else if(previewTimeDragging)updatePreviewPhase(previewPhaseFromX(e.clientX,previewSlider),false);});
    previewSlider.addEventListener("mouseup",function(e){if(e.button!==0)return;if(previewTimeNavigating){movePreviewTimeNavigator(e.clientX,previewSlider);previewTimeNavigating=false;}else if(previewTimeDragging){updatePreviewPhase(previewPhaseFromX(e.clientX,previewSlider),false);previewTimeDragging=false;refreshRealPreview(false);}});
    previewSlider.addEventListener("mouseout",function(){if(previewTimeDragging)refreshRealPreview(false);previewTimeDragging=false;previewTimeNavigating=false;});
    previewSlider.helpTip="Arrastra arriba para recorrer · Arrastra la barra azul inferior para desplazar el tramo visible";
    previewZoomOut.onClick=function(){setPreviewTimeZoom(0.5);};previewZoomIn.onClick=function(){setPreviewTimeZoom(2);};previewZoomFit.onClick=function(){fitPreviewTime();};
    QuickEditECPreviewState.canvas = previewCanvas; QuickEditECPreviewState.slider = previewSlider; QuickEditECPreviewState.percent = previewPercent;
    syncPreviewAspect();
    leftForm = leftColumn.add("group", undefined, undefined, { name: "preview_settings" }); leftForm.orientation = "column"; leftForm.alignChildren = ["fill", "top"]; leftForm.spacing = 6;
    var header = rightColumn.add("group"); header.orientation = "row"; header.alignChildren = ["fill", "center"];
    var brand = header.add("statictext", undefined, "QUICK EDIT EC  ·  JamsTonios"); brand.alignment = ["fill", "center"];
    libraryButton=header.add("button",undefined,"Biblioteca",{name:"library_open"});libraryButton.preferredSize=[78,24];header.add("statictext", undefined, "v" + VERSION);
    var chooser = rightColumn.add("panel", undefined, "1 · HERRAMIENTA"); chooser.orientation = "column"; chooser.alignChildren = ["fill", "top"]; chooser.spacing = 4; chooser.margins = [9, 16, 9, 9];
    var toolRow=chooser.add("group"); toolRow.orientation="row"; toolRow.alignChildren=["left","top"]; toolRow.spacing=8;
    var categoryColumn=toolRow.add("group"); categoryColumn.orientation="column"; categoryColumn.alignChildren=["fill","top"]; categoryColumn.spacing=2; categoryColumn.preferredSize=[150,45];
    var categoryLabel = categoryColumn.add("statictext", undefined, "Grupo");
    categoryFilter = categoryColumn.add("dropdownlist", undefined, [], { name: "category" }); categoryFilter.preferredSize = [150, 24];
    var categories = [{label:"Todos",value:"Todos"},{label:"Diseno",value:"Layouts"},{label:"Texto",value:"Texto"},{label:"Transiciones",value:"Transiciones"},{label:"Impactos",value:"Impactos"},{label:"Entradas",value:"Entradas"},{label:"Salidas",value:"Salidas"},{label:"Loops",value:"Loops"},{label:"Camara",value:"Camara"}], ci;
    for (ci = 0; ci < categories.length; ci++) { var categoryItem = categoryFilter.add("item", categories[ci].label); categoryItem.value = categories[ci].value; }
    categoryFilter.selection = 0;
    var effectColumn=toolRow.add("group"); effectColumn.orientation="column"; effectColumn.alignChildren=["fill","top"]; effectColumn.spacing=2; effectColumn.preferredSize=[167,45];
    var effectLabel = effectColumn.add("statictext", undefined, "Efecto");
    catalog = effectColumn.add("dropdownlist", undefined, [], { name: "catalog" }); catalog.preferredSize = [167, 24];
    var info = rightColumn.add("panel", undefined, "SELECCION ACTUAL"); info.orientation = "row"; info.alignChildren = ["left", "center"]; info.spacing=8; info.margins = [9, 14, 9, 7];
    recipeLabel = info.add("statictext", undefined, ""); recipeLabel.preferredSize=[105,22];
    selectionLabel = info.add("statictext", undefined, ""); selectionLabel.preferredSize=[130,22]; selectionLabel.graphics.foregroundColor = selectionLabel.graphics.newPen(selectionLabel.graphics.PenType.SOLID_COLOR, [0.65,0.65,0.65], 1);
    reopenButton=info.add("button",undefined,"REABRIR",{name:"reopen_recipe"});reopenButton.preferredSize=[78,24];reopenButton.helpTip="Cargar los parametros de una construccion Quick Edit EC seleccionada";
    buildSequencePanel(rightColumn);
    var settings = rightColumn.add("panel", undefined, "2 · AJUSTES"); settings.orientation = "column"; settings.alignChildren = ["fill", "top"]; settings.margins = [7, 14, 7, 7];
    form = settings.add("group"); form.orientation = "column"; form.alignChildren = ["fill", "top"]; form.spacing = 6;
    var historyRow=rightColumn.add("group",undefined,undefined,{name:"history_actions"});historyRow.orientation="row";historyRow.spacing=8;var undoButton=historyRow.add("button",undefined,"↶  DESHACER",{name:"undo"}),redoButton=historyRow.add("button",undefined,"↷  REHACER",{name:"redo"});undoButton.preferredSize=redoButton.preferredSize=[163,28];
    var actionRow=rightColumn.add("group",undefined,undefined,{name:"actions"});actionRow.orientation="row";actionRow.alignChildren=["left","center"];actionRow.spacing=8;actionRow.preferredSize=[335,34];
    resetButton = actionRow.add("button", undefined, "RESTABLECER", { name: "reset" }); resetButton.preferredSize = [110, 34];resetButton.helpTip="Recuperar los valores originales del efecto seleccionado";
    applyButton = actionRow.add("button", undefined, "APLICAR", { name: "apply" }); applyButton.preferredSize = [217, 34];
    categoryFilter.onChange = function () { activeInstanceMeta=null;applyButton.text="APLICAR";refreshCatalog(""); syncPreviewAspect();refreshRealPreview(true); };
    catalog.onChange = function () { activeInstanceMeta=null;applyButton.text="APLICAR";if (catalog.selection) fillForm(catalog.selection.preset); syncPreviewAspect();refreshRealPreview(true); };
    libraryButton.onClick=function(){openRecipeLibrary();};
    reopenButton.onClick=function(){try{reopenSelectedRecipe();syncPreviewAspect();refreshRealPreview(true);refreshLeftScroll(false);refreshRightScroll(false);}catch(e){alert("Quick Edit EC\n\n"+e.message);}};
    undoButton.onClick=function(){try{api.undo();refreshRealPreview(true);}catch(e){alert("No se pudo deshacer: "+e.message);}};redoButton.onClick=function(){try{api.redo();refreshRealPreview(true);}catch(e){alert("No se pudo rehacer: "+e.message);}};
    resetButton.onClick = function () { resetCurrentValues(); };
    applyButton.onClick = function () { syncPreviewAspect(); var editing=activeInstanceMeta;run(editing?"Actualizar receta":"Aplicar receta", function () { var preset=readForm();if(editing)cleanupRecipeInstance(editing);return api.applyRecipe(preset); });refreshRealPreview(true); };
    ui.onResizing = ui.onResize = function () { this.layout.resize(); refreshLeftScroll(false); refreshRightScroll(false); };
    ui.onActivate = function () { syncPreviewAspect();refreshRealPreview(false); };
    ui.onClose = function () { stopEyedropperPoll();realPreviewImage=null;try{if(realPreviewFile&&realPreviewFile.exists)realPreviewFile.remove();}catch(ignorePreviewCleanup){} QuickEditECPreviewState.canvas = null; QuickEditECPreviewState.slider = null; QuickEditECPreviewState.percent = null; QuickEditECPreviewState.positionPad = null; };
    buildForm(BUILT_INS[0].recipe); refreshCatalog(BUILT_INS[0].id); refreshLeftScroll(true); refreshRightScroll(true);refreshRealPreview(true); api.ui = ui;
    if (ui instanceof Window) { ui.center(); ui.show(); } else ui.layout.layout(true); return api;
})(this);
