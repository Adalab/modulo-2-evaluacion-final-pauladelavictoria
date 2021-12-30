"use strict";

// constantes
const searchInput = document.querySelector(".js-input");
const searchBtn = document.querySelector(".js-searchBtn");
const serieList = document.querySelector(".js-serieList");

// función para buscar las series
searchBtn.addEventListener("click", searchSerie);

function searchSerie() {
  fetch(`https://api.jikan.moe/v3/search/anime?q=${searchInput.value}`)
    .then((response) => response.json())
    .then((data) => {
      paintSeries(data.results);
    });
}

// función para pintar cada serie
function paintSeries(arrSeries) {
  for (const eachSerie of arrSeries) {
    const listEl = document.createElement("li");
    const listText = document.createTextNode(eachSerie.title);
    listEl.appendChild(listText);
    const listImg = document.createElement("img");
    listImg.setAttribute("src", eachSerie.image_url);
    listEl.appendChild(listImg);
    serieList.appendChild(listEl);
  }
}
