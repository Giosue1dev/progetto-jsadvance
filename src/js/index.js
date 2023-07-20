import "/src/CSS/style.css";

// ******DECLARATION********

const photo = document.querySelector(".image");
const summary = document.querySelector(".summary");
const category = document.querySelector(".category");
const input = document.querySelector("input");
const score = document.querySelector(".score");
const textScore = document.querySelector(".textScore");
const btn = document.querySelector("button");
let city;

// *****Function for clear the information of the city*****

let clearCard = function () {
  category.innerHTML = "";
  photo.style.backgroundImage = "";
  textScore.innerHTML = "";
  score.innerHTML = "";
};

// *****function to format word before search*****

let formatCityName = function (nome) {
  nome = nome.toLowerCase();
  nome = nome.trim();
  nome = nome.replaceAll(" ", "-");
  return nome;
};

//  ******* FETCH API ********

const getData = async function () {
  const getScore = await fetch(
    `https://api.teleport.org/api/urban_areas/slug:${city}/scores/`
  );

  const dataScore = await getScore.json();

  const getImage = await fetch(
    `https://api.teleport.org/api/urban_areas/slug:${city}/images/`
  );

  const dataImage = await getImage.json();

  // ***** DOM MANIPULATION ******

  if (getScore.status != 404) {
    summary.innerHTML = `<h2><p>${dataScore.summary}</p><h2>`;
    category.innerHTML = "";
    textScore.innerHTML = "CITY SCORE";
    score.innerHTML = dataScore.teleport_city_score.toFixed(2);
    dataScore.categories.forEach((x) => {
      category.insertAdjacentHTML(
        "afterbegin",
        `<h3>${x.name}<br> ${x.score_out_of_10.toFixed(1)}<br><h3>`
      );
    });
    photo.style.backgroundImage = `url(${dataImage.photos[0].image.web})`;
    input.value = "";
  } else {
    errorHandler(
      `<h1>City not found. Check if there's a typo. <br> Remember that you have to use cities names in english. <br> If none of these problems are yours, maybe that city is not in our database.<h1>`
    );
    clearCard();
  }
};

// *******error handling if the city is wrong or absent in the database******

const errorHandler = (warningMessage) => {
  summary.innerHTML = `<p>${warningMessage}</p>`;
  return warningMessage;
};

// ********* error handling if a city is not entered ***********

const errorEmpty = () => {
  if (!input.value) {
    errorHandler(`<h1>YOU MUST WRITE A CITY<h1>`);
    clearCard();
  }
};

// ********* function to initialize the search using "ENTER" *********

input.addEventListener("keydown", function (enterkey) {
  if (enterkey.key === "Enter") {
    city = formatCityName(input.value);
    getData();
    errorEmpty();
  }
});

// ******** function to initialize the search using the "CERCA" button ********

btn.addEventListener("click", function () {
  city = formatCityName(input.value);
  getData();
  errorEmpty();
});
