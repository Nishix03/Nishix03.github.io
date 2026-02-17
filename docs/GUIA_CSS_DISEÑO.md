# 📘 Guía de Diseño y Arquitectura CSS - Portfolio V3

Esta guía ha sido creada para servir como referencia técnica y educativa sobre las decisiones de diseño, patrones y código utilizados en el **Portfolio V3**. Aquí encontrarás explicaciones detalladas de los conceptos clave.

---

## 1. Conceptos Clave de CSS (El "Cómo")

### 📦 El Modelo de Caja (Box Model)
Cada elemento en tu página web es, en esencia, una caja rectangular. Entender esto es vital para controlar el diseño.
*   **Contenido (Content)**: El texto o imagen real.
*   **Relleno (Padding)**: Espacio *interno* entre el contenido y el borde. (Como el aire dentro de una caja de burbujas).
*   **Borde (Border)**: La línea que rodea el relleno.
*   **Margen (Margin)**: Espacio *externo* entre esta caja y otras cajas.

> **Regla de Oro en este proyecto:** Usamos `box-sizing: border-box;` en el selector universal `*`.
> *   **Sin esto:** Si dices `width: 100px` y `padding: 20px`, el ancho real sería **140px** (100 + 20 izq + 20 der). ¡Un dolor de cabeza matemático!
> *   **Con border-box:** Si dices `width: 100px`, el ancho final ES **100px**. El padding se "come" espacio de adentro, no agrega espacio afuera.

### 🎨 Variables CSS (`:root`)
En lugar de repetir `#10b981` (Nuestro verde esmeralda) 50 veces en el código, lo guardamos en una **Variable**.
*   **Sintaxis**: `--nombre-variable: valor;`
*   **Uso**: `color: var(--nombre-variable);`
*   **Beneficio**: Si mañana quieres que tu marca sea azul, cambias UNA línea en `:root` y toda la web se actualiza. Mantenibilidad pura.

### 📏 Unidades de Medida
*   **`px` (Pixeles)**: Medida **Absoluta**. Un pixel es un punto en la pantalla. Úsalo para bordes finos (`1px`).
*   **`rem` (Root EM)**: Medida **Relativa**. `1rem` = Tamaño de letra base del navegador (usualmente 16px). Es mejor para accesibilidad (si el usuario agranda la letra en sus ajustes, tu web se adapta).
*   **`%` (Porcentaje)**: Relativo al contenedor padre. `width: 50%` ocupa la mitad de su contenedor.

### 📐 Sistemas de Diseño (Layouts)
¿Cómo organizamos las cajas?
1.  **Flexbox (`display: flex`)**:
    *   Ideal para **1 Dimensión** (Una fila O una columna).
    *   Ejemplos en el proyecto: El menú de navegación (fila de links), la sección Hero en móvil (columna de elementos).
    *   Propiedades clave: `justify-content` (alinear en el eje principal), `align-items` (alinear en el eje cruzado).
2.  **Grid (`display: grid`)**:
    *   Ideal para **2 Dimensiones** (Filas Y columnas a la vez).
    *   Ejemplos en el proyecto: La lista de habilidades (Skills) y Valores.
    *   Propiedades clave: `grid-template-columns: repeat(2, 1fr)` (Crea 2 columnas iguales).

---

## 2. Diseño Web Responsivo (Mobile First)

### 📱 Filosofía "Mobile First"
Empezamos escribiendo el CSS para la pantalla más pequeña (celular).
*   **¿Por qué?**
    1.  **Rendimiento**: Los móviles cargan solo el código base esencial.
    2.  **Foco**: Te obliga a priorizar el contenido más importante (en una pantalla chica no cabe todo).
    3.  **Escalabilidad**: Es más fácil "agrandar" un diseño que intentar "aplastar" un diseño de escritorio complejo para que entre en un móvil.

### 💻 Media Queries (`@media`)
Son "condicionales" en CSS.
```css
/* Esto aplica siempre (Base Móvil) */
.caja { width: 100%; }

/* Esto aplica SOLO si la pantalla mide al menos 768px */
@media (min-width: 768px) {
    .caja { width: 50%; } /* Cambiamos a mitad de ancho */
}
```
En este proyecto, usamos el breakpoint de **768px** (Tablets/Laptops pequeñas) para cambiar de diseño apilado (columna) a diseño horizontal (fila).

---

## 3. Patrones de Diseño UI

### 👁️ Jerarquía Visual
El usuario no lee, *escanea*. Debemos guiar su ojo.
*   **Tamaño**: `h1` (3rem) > `h2` (2rem) > `p` (1rem). Lo más grande se lee primero.
*   **Color**: El texto principal es oscuro (`--text-primary`), el secundario es gris (`--text-muted`).
*   **Peso**: La negrita (`font-weight: 700`) atrae la atención.

### 🌬️ Espacio en Blanco (White Space)
El espacio vacío no es espacio desperdiciado; es **aire**.
*   Usamos `padding` y `gap` generosos.
*   Si todo está pegado, el diseño se ve "barato" y abrumador.
*   Si hay aire, el diseño se ve **Premium** y profesional.

---

## 4. 🧬 PATRÓN DE ARQUITECTURA: ATOMIC DESIGN (Diseño Atómico)

Para tus futuros proyectos, te recomiendo esta metodología creada por Brad Frost. Nos ayuda a pensar en interfaces como sistemas escalables, no como "páginas sueltas".

### La Analogía Química
1.  **⚛️ Átomos**: Los bloques indivisibles.
    *   *En nuestro proyecto*: Un botón (`.hero__button`), un input, un icono, una etiqueta `<label>`, una variable de color.
    *   No sirven de mucho por sí solos.

2.  **🔗 Moléculas**: Grupos de átomos que funcionan juntos.
    *   *En nuestro proyecto*: Una tarjeta de habilidad (`.skill__item`) que tiene un icono + texto + barra de progreso. La barra de búsqueda (Input + Botón Buscar).

3.  **🦠 Organismos**: Grupos complejos de moléculas y átomos. Forman secciones distintas de la interfaz.
    *   *En nuestro proyecto*: El **Header** completo (Logo + Navegación + Botones), la sección **Hero**, el **Footer**.

4.  **📄 Plantillas (Templates)**: La estructura de la página sin contenido real (el esqueleto).
    *   Define dónde va el Header, dónde va el Hero, etc.

5.  **🖥️ Páginas**: La instancia final con contenido real.
    *   *En nuestro proyecto*: `HomePageV1.html` es la página donde llenamos la plantilla con tu foto, tu nombre y tus textos.

### ¿Por qué usarlo?
*   **Reutilización**: Si creas un buen átomo "Botón", lo usas en todas partes.
*   **Consistencia**: Toda tu web se ve igual porque está hecha de las mismas piezas lego.
*   **Mantenibilidad**: Si cambias el átomo "Botón", cambias TODOS los botones de la web a la vez.

En este proyecto, aunque es una sola página, hemos aplicado esto implícitamente al crear clases reutilizables como `.button--primary` (Átomo) y contenedores como `.skill__item` (Molécula).
