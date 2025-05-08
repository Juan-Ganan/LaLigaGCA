// -------------------------------
// Carrusel de equipos
// -------------------------------
let index = 0;
const carousel = document.getElementById('carousel');
const totalSlides = carousel.children.length;

function showSlide(i) {
  index = (i + totalSlides) % totalSlides;
  carousel.style.transform = `translateX(-${index * 100}%)`;
}

function next() {
  showSlide(index + 1);
}

function prev() {
  showSlide(index - 1);
}

// Avance automático del carrusel cada 7 segundos
setInterval(next, 7000);

// -------------------------------
// Cargar y mostrar tabla de posiciones desde CSV
// -------------------------------
async function cargarCSV(url) {
  const response = await fetch(url);
  const data = await response.text();
  const filas = data.trim().split("\n");

  return filas.map(linea => {
    const [nombre, puntos, asistencias, PartidosJugados] = linea.split(",");
    return {
      nombre: nombre.trim(),
      puntos: parseInt(puntos.trim(), 10),
      asistencias: parseInt(asistencias?.trim() || "0", 10),
      PartidosJugados: parseInt(PartidosJugados?.trim()) // Manejo defensivo
    };
  });
}

function mostrarTabla(equipos) {
    const tbody = document.getElementById("tabla-posiciones");
  
    // Calcular puntaje total con asistencias valiendo 0.5 puntos
    equipos.forEach(equipo => {
      equipo.puntajeTotal = equipo.puntos + equipo.asistencias * 0.5;
    });
  
    // Ordenar por puntaje total descendente
    equipos.sort((a, b) => b.puntajeTotal - a.puntajeTotal);
  
    tbody.innerHTML = "";
  
    // Agregar encabezado si quieres incluir el puntaje total visible
    const thead = document.querySelector("#tabla-posiciones").previousElementSibling;
    if (thead && thead.tagName === "THEAD") {
      thead.innerHTML = `
        <tr>
          <th class="border px-4 py-2 text-center">#</th>
          <th class="border px-4 py-2 text-center">Equipo</th>
          <th class="border px-4 py-2 text-center">Puntos</th>
          <th class="border px-4 py-2 text-center">Asistencias</th>
          <th class="border px-4 py-2 text-center">PJ</th>
          <th class="border px-4 py-2 text-center">Puntaje Total</th>
        </tr>
      `;
    }
  
    equipos.forEach((equipo, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td class="border px-4 py-2 text-center align-middle">${index + 1}</td>
        <td class="border px-4 py-2 text-center align-middle">${equipo.nombre}</td>
        <td class="border px-4 py-2 text-center align-middle">${equipo.puntos}</td>
        <td class="border px-4 py-2 text-center align-middle">${equipo.asistencias}</td>
        <td class="border px-4 py-2 text-center align-middle">${equipo.PartidosJugados}</td>
        <td class="border px-4 py-2 text-center align-middle">${equipo.puntajeTotal.toFixed(1)}</td>
      `;
      tbody.appendChild(fila);
    });
  }
  
  
// -------------------------------
// Inicialización al cargar la página
// -------------------------------
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const equipos = await cargarCSV("posiciones.csv");
    mostrarTabla(equipos);
  } catch (error) {
    document.getElementById("tabla-posiciones").innerHTML = `
      <tr><td colspan="4" class="text-center text-red-500 py-4">Error al cargar el archivo CSV.</td></tr>
    `;
    console.error("Error al cargar CSV:", error);
  }
});
