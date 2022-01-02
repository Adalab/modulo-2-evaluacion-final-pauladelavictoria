"use strict";

// constantes
const searchInput = document.querySelector(".js-input");
const searchBtn = document.querySelector(".js-searchBtn");
const serieList = document.querySelector(".js-serieList");
const mainContainer = document.querySelector(".js-main");
const seriesFavlist = document.querySelector(".js-favAnime");

// variables globales
let noList;

// Evento y función para buscar las series
searchBtn.addEventListener("click", searchSerie);

function searchSerie() {
  if (noList !== undefined) {
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

    // clases para fav cuando ya esté guardado en el localstorage para que si refrescas la página no se borre la clase
    // if (
    //   arrAnimes.includes((eachAnime) => {
    //     return eachAnime.mal_id === eachSerie.mal_id;
    //   })
    // )

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

// Array vacío donde se van a guardar los datos de los fav
let arrAnimes = JSON.parse(localStorage.getItem("favAnimes"));

// Llamada a la función que pinta el localStorage para que al cargar la página aparezcan los fav que ya están guardados
paintFavseries(arrAnimes);


// función para guardar como fav y añadir la clase de fav al hacer click, pero si refrescas la página se borraría la clase aunque se guarden el resto de datos del elemento en el array
function addFav(event) {
  arrAnimes.push(event.currentTarget.dataset);
  localStorage.setItem("favAnimes", JSON.stringify(arrAnimes));
  event.currentTarget.classList.toggle("favStyle");
  paintFavseries(arrAnimes);
}

//función para pintar los favoritos desde local storage
function paintFavseries(arrAnimes) {
  for (const eachAnime of arrAnimes) {
    // crear el li, div, imagen de fondo y texto con el título y sinopsis
    const listFavel = document.createElement("li");
    const containerFav = document.createElement("div");
    const listImg = document.createElement('img');
    listImg.setAttribute('src', eachAnime.image_url);
    listImg.classList.add('listImg');
    const listFavtext = document.createTextNode(eachAnime.title);
    const listFavsyn = document.createTextNode(eachAnime.synopsis);

    // El ul tiene un li, con un contenedor y el texto dentro del contenedor div
    seriesFavlist.appendChild(containerFav);
    containerFav.appendChild(listFavel);
    listFavel.appendChild(listFavtext);
    listFavel.appendChild(listFavsyn);
    listFavel.appendChild(listImg);

    // clase para cambiar el li y container en css
    listFavel.classList.add("listFavel");
    containerFav.classList.add("divFav");
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
}
