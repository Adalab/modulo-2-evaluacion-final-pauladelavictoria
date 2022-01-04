"use strict";

// constantes
const searchInput = document.querySelector(".js-input");
const searchBtn = document.querySelector(".js-searchBtn");
const serieList = document.querySelector(".js-serieList");
const mainContainer = document.querySelector(".js-main");
const seriesFavlist = document.querySelector(".js-favAnime");

// variables globales
let noList;
let searchResults;

// Evento y función para buscar las series
searchBtn.addEventListener("click", searchSerie);

// Array vacío donde se van a guardar los datos de los fav
let arrAnimes = JSON.parse(localStorage.getItem("favAnimes"));

function searchSerie(ev) {
  ev.preventDefault();
  if (noList !== undefined) {
    noList.innerHTML = "";
    noList.classList.remove("notFound");
  }
  fetch(`https://api.jikan.moe/v3/search/anime?q=${searchInput.value}`)
    .then((response) => response.json())
    .then((data) => {
      // arrSeries se cambia por data.result para darle ese valor al parámetro que tiene la función
      // Condicional por si no existe en la API la serie que se busca
      if (data.results === null) data.results = [];

      if (data.results.length > 0) {
        searchResults = data.results;
        paintSeries(searchResults);
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
  if (arrSeries === null) arrSeries = [];
  for (const eachSerie of arrSeries) {
    // crear el li y div
    const listEl = document.createElement("li");
    const container = document.createElement("div");

    // Añadir atributos al dataset para guardarlos en el localstorage cuando son fav
    // listEl.dataset.mal_id = eachSerie.mal_id;
    // listEl.dataset.title = eachSerie.title;

    listEl.setAttribute("data-mal_id", eachSerie.mal_id);
    listEl.setAttribute("data-title", eachSerie.title);
    listEl.setAttribute("data-image_url", eachSerie.image_url);
    listEl.setAttribute("data-synopsis", eachSerie.synopsis);

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

    if (arrAnimes === null) arrAnimes = [];

    // clases para fav cuando ya esté guardado en el localstorage para que si refrescas la página no se borre la clase
    for (const eachAnime of arrAnimes) {
      if (parseInt(eachAnime.mal_id) === eachSerie.mal_id) {
        listEl.classList.add("favStyle");
      }
    }

    // Evento para añadir a favorito, dentro de la función que es donde se crea el listEl
    listEl.addEventListener("click", addFav);
  }
}
// LOCALSTORAGE
// El evento de addFav está arriba, en la función paintSeries

// si no hay favoritos en el localStorage le asignamos un array vacío para que nunca sea null y no den error las funciones
if (arrAnimes === null) arrAnimes = [];

// Llamada a la función que pinta el localStorage para que al cargar la página aparezcan los fav que ya están guardados
paintFavseries(arrAnimes);

// función para guardar como fav y añadir la clase de fav al hacer click, pero si refrescas la página se borraría la clase aunque se guarden el resto de datos del elemento en el array
function addFav(event) {
  const addfavindex = arrAnimes.findIndex((an) => event.currentTarget.dataset.mal_id === an.mal_id);
  if (addfavindex === -1) {
    arrAnimes.push(event.currentTarget.dataset);
    localStorage.setItem("favAnimes", JSON.stringify(arrAnimes));
    event.currentTarget.classList.add("favStyle");
    paintFavseries(arrAnimes);
  } else {
    arrAnimes.splice(addfavindex, 1);
    localStorage.setItem("favAnimes", JSON.stringify(arrAnimes));
    event.currentTarget.classList.remove("favStyle");
    paintFavseries(arrAnimes);
  }
}

//función para pintar los favoritos desde local storage
function paintFavseries(arrAnimes) {
  seriesFavlist.innerHTML = "";
  for (const eachAnime of arrAnimes) {
    // crear el li, div, imagen de fondo y texto con el título y sinopsis
    const listFavel = document.createElement("li");

    const deleteFav = document.createElement("button");
    const deleteFavtext = document.createTextNode("❌");

    const containerFav = document.createElement("div");
    const listImg = document.createElement("img");
    listImg.classList.add("listImg");
    const listFavtext = document.createTextNode(eachAnime.title);

    if (
      eachAnime.image_url ===
      `https://cdn.myanimelist.net/images/qm_50.gif?s=e1ff92a46db617cb83bfc1e205aff620`
    ) {
      listImg.setAttribute(
        "src",
        `https://via.placeholder.com/300x400/f96457/ffffff/?text=${eachAnime.title}`
      );
    } else {
      listImg.setAttribute("src", eachAnime.image_url);
    }

    // El ul tiene un li, con un contenedor y el texto dentro del contenedor div
    seriesFavlist.appendChild(containerFav);
    containerFav.appendChild(listFavel);
    listFavel.appendChild(listFavtext);
    listFavel.appendChild(listImg);
    listFavel.appendChild(deleteFav);
    deleteFav.appendChild(deleteFavtext);

    // clase para cambiar el li y container en css
    listFavel.classList.add("listFavel");
    containerFav.classList.add("divFav");
    deleteFav.classList.add("deleteFav");

    // Añadir el id al botón
    deleteFav.setAttribute("data-mal_id", eachAnime.mal_id);

    // Evento para borrar, dentro de esta función que es donde se crea el botón
    deleteFav.addEventListener("click", deleteFavourite);
  }
}

// RESET

// constantes
const resetFav = document.querySelector(".js-resetFav");
const resetBtn = document.querySelector(".js-resetBtn");

// Evento y función para borrar las series de la búsqueda
resetBtn.addEventListener("click", resetSearchseries);
function resetSearchseries() {
  location.reload();
}

// Evento y función para borrar las series favoritas
resetFav.addEventListener("click", resetFavseries);
function resetFavseries() {
  localStorage.setItem("favAnimes", "[]");
  arrAnimes = [];
  seriesFavlist.innerHTML = "";
  paintSeries(searchResults);
}

// Función para borrar un favorito desde la lista de fav
function deleteFavourite(event) {
  const index = arrAnimes.findIndex(
    (anime) => event.currentTarget.dataset.mal_id === anime.mal_id
  );
  arrAnimes.splice(index, 1);
  localStorage.setItem("favAnimes", JSON.stringify(arrAnimes));

  paintFavseries(arrAnimes);
  paintSeries(searchResults);
}
