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

// Auto carrusel
setInterval(next, 7000);

async function cargarCSV(url) {
    const response = await fetch(url);
    const data = await response.text();
    const filas = data.trim().split("\n");
  
    return filas.map(linea => {
      const [nombre, puntos] = linea.split(",");
      return { nombre: nombre.trim(), puntos: parseInt(puntos.trim(), 10) };
    });
  }
  
  function mostrarTabla(equipos) {
    const tbody = document.getElementById("tabla-posiciones");
    equipos.sort((a, b) => b.puntos - a.puntos); // Orden descendente por puntos
    tbody.innerHTML = "";
  
    equipos.forEach((equipo, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td class="border px-4 py-2 text-center align-middle">${index + 1}</td>
        <td class="border px-4 py-2 text-center align-middle">${equipo.nombre}</td>
        <td class="border px-4 py-2 text-center align-middle">${equipo.puntos}</td>
        `;

      tbody.appendChild(fila);
    });
  }
  
  window.addEventListener("DOMContentLoaded", async () => {
    try {
      const equipos = await cargarCSV("posiciones.csv");
      mostrarTabla(equipos);
    } catch (error) {
      document.getElementById("tabla-posiciones").innerHTML = `
        <tr><td colspan="3" class="text-center text-red-500 py-4">Error al cargar el archivo CSV.</td></tr>
      `;
      console.error(error);
    }
  });
  