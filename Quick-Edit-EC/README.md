# Quick Edit EC by JamsTonios

Panel nativo de automatizaciones de edición y movimiento para EffectCraft 0.11.1.

## Versión 0.18.0

- 14 motores de receta y 39 presets incluidos.
- Las recetas aplicadas desde el panel guardan identidad, versión, parámetros, capas asociadas y el estado anterior completo de sus capas.
- **REABRIR** recupera en el panel una construcción seleccionada; **ACTUALIZAR** restaura primero sus fuentes y vuelve a construirla sin acumular fondos, mattes, nulos ni keyframes duplicados.
- La restauración conserva animaciones anteriores: tiempos, valores, interpolación, curvas temporales, tangentes espaciales, expresiones, padres, comentarios y Motion Blur.
- Controles visibles de **Deshacer** y **Rehacer**, conectados al historial real de EffectCraft.
- Editor de **Keyframes universales** para aplicar Ease In, Ease Out, suavizado, Lineal o Hold; copiar y pegar curvas; y desplazar keyframes seleccionados en frames.
- Panel de **Secuencia y Stagger** para ordenar capas o keyframes por línea de tiempo, izquierda, derecha, arriba, abajo, distancia al centro o aleatoriedad estable.
- Biblioteca independiente con búsqueda, guardado de recetas completas, carga, eliminación e importación/exportación JSON.
- Nuevo motor **Título inteligente** con texto y caja vectorial nativos, márgenes, redondeado, colores, posición, entrada y salida editables.
- El constructor de transiciones añade barrido, explosión radial, convergencia radial, cruce alternado y cobertura con salida opcional.
- Interfaz horizontal de dos columnas: vista previa amplia a la izquierda y herramientas/ajustes a la derecha.
- Los bloques **Forma y movimiento** y **Tiempo** viven debajo de la vista previa; colores, opciones y presets permanecen a la derecha.
- La columna derecha tiene desplazamiento vertical propio mediante carril arrastrable y botones, sin mover la vista previa ni sus ajustes.
- **Backdrop Blur**, **Picture in Picture** y **Split Screen** ahora generan keyframes nativos de entrada; incluyen duración, salida opcional y Motion Blur.
- Las capas, máscaras, redondeado, fondos, desenfoque y oscurecimiento de esos tres diseños se animan de forma sincronizada y regresan al estado original cuando se activa la salida.
- Rounded incluye debajo de la vista previa una mini línea de tiempo basada en la duración disponible de la capa. Sus rombos seleccionables y arrastrables sustituyen al antiguo listado de etapas.
- Rounded separa **Ancho del marco**, **Alto del marco** y **Escala del medio**: puedes cambiar la proporción de la máscara o ampliar el video dentro de ella sin alterar sus dimensiones.
- Cada keyframe Round también conserva ancho, alto y escala del medio de forma independiente, además de posición, radio y curva.
- La mini línea de tiempo y el cabezal de la vista previa están sincronizados. Cada keyframe conserva tiempo a precisión de fotograma, posición X/Y, tamaño, radio y curva Bezier o lineal durante la edición.
- La vista Rounded renderiza un fotograma aislado de la capa seleccionada dentro de su composición, respetando su intervalo `inPoint–outPoint`. El monitor, el cabezal, los rombos y el campo de tiempo usan los segundos reales de esa capa.
- La captura real aísla la capa seleccionada y sus track mattes; guarda y restaura los estados Solo/Visibilidad de todas las capas inmediatamente después de generar cada fotograma.
- Las columnas de vista previa y ajustes tienen desplazamiento vertical independiente, con riel, control arrastrable y botones de avance.
- El recuadro visual de la vista previa ocupa cuatro quintas partes de su tamaño anterior, sin reducir los controles de tiempo.
- El botón **Restablecer** recupera los valores originales del efecto seleccionado, limpia sus keyframes Round temporales y devuelve el tiempo y su zoom al inicio.
- Rounded conserva su estado inicial aunque prepares posiciones posteriores; cada nuevo keyframe hereda el estado animado del instante donde se inserta, igual que una pista de keyframes normal.
- El rombo azul inicial de Rounded es ahora un keyframe seleccionable, arrastrable y editable con los mismos campos de posición, marco, escala, radio y curva; su tiempo controla la duración de entrada.
- Todos los keyframes Rounded guardan una copia independiente de sus parámetros. Los controles principales siguen al rombo seleccionado y nunca vuelven a escribir silenciosamente los demás estados.
- Keyframes Round ocupa solamente dos filas cuando está vacío: línea temporal y controles compactos. Los parámetros aparecen únicamente al seleccionar o crear un rombo.

La vista real requiere activar en EffectCraft **Preferencias ▸ Scripting & Expressions ▸ Allow Scripts to Write Files and Access Network**, porque `saveFrameToPng` guarda dos PNG temporales junto al panel. Esta preferencia es global y también concede acceso de red a otros scripts; actívala solamente si confías en los scripts instalados.
- Vista previa integrada: responde en vivo a los parámetros de cada receta sin modificar la composición.
- El lienzo adopta automáticamente la relación de aspecto de la composición activa, también en proyectos verticales o cuadrados.
- Control de **Posición** interactivo con la misma relación de aspecto del proyecto: arrastra el punto o usa la cuadrícula 3 × 3 para alinear a izquierda, centro, derecha, arriba o abajo.
- La posición se conserva en porcentajes X/Y y se refleja inmediatamente en la vista previa.
- La barra **Tiempo** permite recorrer manualmente la duración real de la capa seleccionada y conserva la lectura en segundos.
- Navegación temporal independiente de Keyframes Round: botones `−`/`+` para alejar o acercar y **Todo** para recuperar la duración completa. Al ampliar, la barra azul inferior representa el tramo visible y puede arrastrarse horizontalmente.
- **Tiempo** ahora se dibuja como una pista de edición al estilo Premiere, con regla numerada, subdivisiones, navegador inferior y cabezal azul. Los antiguos botones `<`/`>` se eliminaron. EffectCraft 0.11.1 no expone la rueda del ratón a ScriptUI, por lo que el panel ofrece el navegador arrastrable como alternativa nativa. **Keyframes Round** usa una pista compacta tipo deslizador, manteniendo sus rombos editables sin controles de zoom.
- Parámetros numéricos con barra horizontal y valor editable sincronizado.
- Herramienta, selección actual, forma/movimiento, tiempo, colores y opciones usan filas compactas de dos columnas cuando el contenido lo permite.
- Los colores incluyen muestra activa, blanco, negro y hasta ocho colores usados recientemente; no se muestran colores predefinidos innecesarios.
- El selector visual combina un plano de saturación/brillo, una barra vertical de tono, valores RGB, HSB y HEX.
- El cuentagotas global de Windows puede copiar un píxel de cualquier área de la pantalla y devolverlo al campo activo.
- Formularios agrupados en forma/movimiento, tiempo, colores y opciones.
- Los parámetros condicionales solo aparecen cuando corresponden; por ejemplo, el porcentaje de redondeado solo se muestra para la figura redondeada.
- La sección de presets personales fue eliminada; el catálogo muestra únicamente los efectos incluidos.
- Capas, formas, track mattes, efectos, keyframes y expresiones nativas editables.
- Cada clic en **Aplicar** se agrupa en un solo paso de Deshacer.
- Si una receta falla desde el panel, se restaura automáticamente el estado anterior.

## Construcciones editables

Cada aplicación realizada con el botón **APLICAR** queda identificada en las capas que participan. Para modificarla:

1. Selecciona cualquiera de sus capas.
2. Pulsa **REABRIR**.
3. Cambia los parámetros.
4. Pulsa **ACTUALIZAR**.

Actualizar no superpone otra copia. Quick Edit EC restaura el estado original registrado y genera la nueva variante dentro de una sola operación de historial. Las funciones públicas `readLayerMetadata`, `reopenSelectedRecipe` y `cleanupRecipeInstance` permiten automatizar el mismo flujo.

## Keyframes universales

Selecciona keyframes reales en la línea de tiempo y utiliza el panel bajo la vista previa:

- Suave ambos, Ease In, Ease Out, Lineal y Hold.
- Influencia configurable.
- Copiar la curva del primer keyframe seleccionado y pegarla en otros.
- Desplazar todos los keyframes seleccionados una cantidad positiva o negativa de frames.

Estas operaciones no dependen de Rounded y funcionan con cualquier propiedad temporal compatible.

## Secuencia y Stagger

El modo **Capas completas** desplaza `startTime`; el modo **Keyframes seleccionados** conserva las capas y escalona únicamente los keyframes elegidos. El orden puede ser temporal, espacial, desde el centro o aleatorio estable, con inversión opcional.

## Biblioteca de recetas

El botón **Biblioteca** abre una ventana separada para evitar cargar la interfaz principal. Guarda el formulario completo, incluyendo colores, tiempos, posiciones, curvas y etapas Rounded. Las bibliotecas se pueden compartir mediante JSON.

## Títulos inteligentes

Los tres presets iniciales son **Lower third**, **Título central** y **Callout**. El resultado utiliza una capa de texto y una caja de forma nativas, ambas con entrada y salida sincronizadas. Si se selecciona una capa de texto existente, se reutiliza; sin selección se crea una nueva.

## Transiciones de barrido y cobertura

No hace falta seleccionar una capa. Elige uno de los presets de **Transiciones** y Quick Edit EC
genera figuras vectoriales nativas escalonadas; la última se expande hasta convertirse en fondo.

- Círculo, cuadrado o rectángulo redondeado.
- Entre 2 y 8 formas, con tamaño inicial configurable.
- Seis direcciones, incluidas las dos diagonales.
- Duración, separación y retraso final configurables en frames.
- Movimiento por barrido, explosión radial, convergencia radial o cruce alternado.
- Salida opcional con duración de permanencia y descubrimiento independientes.
- Un color independiente por cada forma solicitada. La interfaz muestra exactamente tantos colores como indica **Cantidad** y el último se convierte en el fondo.
- Escala final calculada con la diagonal de la composición para cubrir también las esquinas.
- Motion Blur opcional y capas/keyframes completamente editables.

Presets incluidos: **Barrido · Círculos**, **Barrido · Redondeado**, **Barrido · Cuadrados rápidos** y **Transición · Explosión radial**.

## Instalación

En EffectCraft usa **Archivo → Scripts → Instalar panel de ScriptUI…**, selecciona
`Quick Edit EC by JamsTonios.jsx` y abre el panel desde **Ventana**. Para usar el cuentagotas,
mantén `QuickEditEC-Eyedropper.exe` en la misma carpeta que el archivo JSX; la primera ejecución
puede mostrar la confirmación de seguridad de EffectCraft para abrir el auxiliar.

## Controladores de movimiento

Los presets de movimiento crean un nulo llamado `QE CTRL · ...` y enlazan allí las capas
seleccionadas. El controlador siempre se anima desde 100%, por lo que conserva intacta la escala
original de cada hijo, incluso si es no uniforme, por ejemplo 65% × 80%.

La posición elegida en el selector se aplica al nulo, no destruye la posición de cada hijo y permite
reubicar el conjunto completo con coordenadas relativas al tamaño de la composición.

- Una selección múltiple comparte un solo controlador y pivota desde el promedio de sus posiciones.
- Si las capas comparten un padre, el controlador se inserta dentro de esa jerarquía.
- Si utilizan un track matte, el matte y su consumidor se envuelven juntos automáticamente.
- Las capas con padres diferentes se rechazan antes de modificar la composición.
- Los tiempos se introducen en frames y se convierten con el FPS real de la composición.
- Motion Blur es opcional y activa tanto la composición como las capas controladas.

### Impactos

- Impacto Clásico: `100 → 110 → 90 → 100` en `4 + 3 + 2` frames.
- Impacto Suave.
- Impacto Fuerte.
- Hit Shake suave y fuerte: escala, posición y rotación con amortiguación.

### Entradas y salidas

- Pop In y Pop Out.
- Slide Overshoot desde izquierda, derecha, arriba o abajo.
- Fade Scale suave y rápido. La escala vive en el nulo; solo la opacidad se anima en los hijos.

### Loops y cámara

- Pulse Loop suave y fuerte mediante keyframes y `loopOut("cycle")`.
- Handheld suave, normal y fuerte mediante `wiggle` en posición y rotación.

## Recetas de layout

- **Rounded Media:** anima desde el estado original hasta la escala, posición y radio elegidos. Incluye duración en frames, aparición progresiva del fondo y salida inversa opcional al final de la capa.
- **Blurred Backdrop:** duplicado a pantalla completa con Gaussian Blur nativo.
- **Picture in Picture:** fondo y ventana redondeada en cualquiera de las cuatro esquinas.
- **Split Screen 2:** dos paneles recortados, con margen, separación y fondo.

Las recetas de layout protegen capas bloqueadas, 3D, con padre, con track matte existente, rotación
o Transform animado/expresiones, porque esas condiciones podrían alterar una construcción previa.

## Pruebas

```powershell
node tests/run.mjs "C:\ruta\effectcraft-cli.exe"
```

La suite usa un perfil aislado de EffectCraft. Verifica recetas, geometría, jerarquías, escalas
relativas y no uniformes, mattes, Motion Blur, expresiones, categorías, formularios y presets. También
renderiza las cuatro etapas del impacto, la transición de cobertura y el Split Screen en
`test-results/`.
