'use strict';

// constantes
const searchInput = document.querySelector('.js-input');
const searchBtn = document.querySelector('.js-searchBtn');
const serieList = document.querySelector('.js-serieList');

// Evento y función para buscar las series
searchBtn.addEventListener('click', searchSerie);

function searchSerie() {
  fetch(`https://api.jikan.moe/v3/search/anime?q=${searchInput.value}`)
    .then((response) => response.json())
    .then((data) => {

      // arrSeries se cambia por data.result para darle ese valor al parámetro que tiene la función
      paintSeries(data.results);
    });
}

// función para pintar cada serie
function paintSeries(arrSeries) {
  for (const eachSerie of arrSeries) {
    // crear el li, div y texto
    const listEl = document.createElement('li');
    const container = document.createElement('div');
    const listText = document.createTextNode(eachSerie.title); 
    // Crear la imagen si no fuese background
    // const listImg = document.createElement('img');
    // listImg.setAttribute('src', eachSerie.image_url);
    // listEl.appendChild(listImg);
    // listImg.classList.add('listImg');

    // Imagen de fondo
    listEl.style.backgroundImage = `url(${eachSerie.image_url})`;

    // El ul tiene un li, con un contenedor y el texto dentro del contenedor div
    serieList.appendChild(listEl);
    listEl.appendChild(container);
    container.appendChild(listText);
    
    // clase para cambiar el li y container en css
    listEl.classList.add('listEl');
    container.classList.add('divText');
  }
}
