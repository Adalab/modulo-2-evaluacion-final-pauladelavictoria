"use strict";

// constantes
const searchInput = document.querySelector(".js-input");
const searchBtn = document.querySelector(".js-searchBtn");
const serieList = document.querySelector(".js-serieList");
const mainContainer = document.querySelector(".js-main");

// variables globales
let noList;

// Evento y función para buscar las series
searchBtn.addEventListener("click", searchSerie);

function searchSerie() {
  if(noList !== undefined){
    noList.innerHTML = "";
    noList.classList.remove("notFound");
  } 
  fetch(`https://api.jikan.moe/v3/search/anime?q=${searchInput.value}`)
    .then((response) => response.json())
    .then((data) => {
      // arrSeries se cambia por data.result para darle ese valor al parámetro que tiene la función
      // Condicional por si no existe en la API la serie que se busca
      if (data.results.length > 0) {
        paintSeries(data.results);
      } else {
        noList = document.createElement("p");
        noList.classList.add("notFound");
        const noListText = document.createTextNode(
          "No tenemos la serie que buscas, prueba otra 🙈"
        );
        noList.appendChild(noListText);
        mainContainer.appendChild(noList);
      }
    });
}

// función para pintar cada serie
function paintSeries(arrSeries) {
    serieList.innerHTML = "";
  
  for (const eachSerie of arrSeries) {
    // crear el li, div, e id
    const listEl = document.createElement("li");
    const container = document.createElement("div");
    listEl.setAttribute("id", eachSerie.mal_id);
    // Crear la imagen si no fuese background
    // const listImg = document.createElement('img');
    // listImg.setAttribute('src', eachSerie.image_url);
    // listEl.appendChild(listImg);
    // listImg.classList.add('listImg');

    // Imagen de fondo y texto
    if (eachSerie.image_url) {
      listEl.style.backgroundImage = `url(${eachSerie.image_url})`;
      const listText = document.createTextNode(eachSerie.title);
      container.appendChild(listText);
      container.classList.add("divText");
    } else {
      listEl.style.backgroundImage = `url(https://via.placeholder.com/400x400/f96457/ffffff/?text=${eachSerie.title})`;
    }

    // El ul tiene un li, con un contenedor y el texto dentro del contenedor div
    serieList.appendChild(listEl);
    listEl.appendChild(container);

    // clase para cambiar el li en css
    listEl.classList.add("listEl");

    // Evento para añadir a favorito, dentro de la función que es donde se crea el listEl
    listEl.addEventListener("click", addFav);
  }
}

// LOCALSTORAGE

// Array vacío donde se van a guardar los id de los fav
let idFav = [];

// función para guardar como fav
function addFav(event) {
  idFav.push(event.currentTarget.id);
  localStorage.setItem("idFav", JSON.stringify(idFav));
}
