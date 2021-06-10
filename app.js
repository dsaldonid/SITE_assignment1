// Global constants
const movieArea = document.querySelector(".movieArea");
const apiKey  = "e378e77d411b157b07cbb13f2410ae82";
let   movieId;
const movieForm = document.querySelector("form");
const loadButton = document.querySelector("#loadMore");
const photoSize  = "w200"
let   secureURL;
let   movieUrls = [];
let   movieInfo = {};
let   page =1;
let  numOnRow =0;
let  movieStr = '';
// const bar = document.querySelector("#loadMore");


movieForm.addEventListener("submit", filter)
movieForm.addEventListener("input",dynamicfilter)
loadButton.addEventListener("click",loadMore)

function stay(event){
    event.preventDefault();
}
async function getResults(){
    // evt.preventDefault()
    //grab secure base URL
    let conFigURL = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;
    const response     = await fetch(conFigURL);
    const responseData = await response.json();
    secureURL     = responseData.images.secure_base_url
    
    //loop through every page and add info to data structures
    let apiURL       = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&page=${page}`;

    // // go to movie api 
    let response1     = await fetch(apiURL);
    let responseData1 = await response1.json();

    //store movie info in object
    responseData1.results.map(storeInfo);
    
    // // get data on dom 

    responseData1.results.map(displayResults)
    if (loadButton.classList.contains("hidden")) {
        loadButton.classList.remove("hidden")
      } 

    //increment page once to be ready for load more 
    page++;
}

async function dynamicfilter(event){
    //prevent reloading page when something entered
    event.preventDefault()

    //wipe page
    setTimeout(wipeResults,0)

    //grab search term
    const movie   = event.target.value;
    const year    = 2021

    if(movie ==""){
        page =1;
        getResults();
        return
    }
    //make api call to filter movies
    const searchURL    = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movie}&primary_release_year=${year}`;
    const response     = await fetch(searchURL);
    const responseData = await response.json();

    
    //display the filtered titles
    responseData.results.map(displayResults)

}

async function filter(event){
    //prevent reloading page when something entered
    event.preventDefault()

    //wipe page
    setTimeout(wipeResults,0)

    //grab search term
    const searchName      = event.target.movie;
    const movie           = searchName.value;
    const year            = 2021

    //make api call to filter movies
    const searchURL    = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movie}&primary_release_year=${year}`;
    const response     = await fetch(searchURL);
    const responseData = await response.json();

    
    //display the filtered titles
    responseData.results.map(displayResults)

}

function storeInfo(movieData){
    //save our movie's title,average moving votes, and picture's URL
    let movie_pic    = secureURL + photoSize+ movieData.poster_path
    let movie_name   = movieData.title
    let movie_rating = movieData.vote_average

    //add our movie info to object with movie name as key
    movieInfo[movie_name] = {"picture_URL":movie_pic,"average_votes":movie_rating}
    
}


function displayResults(movieData){
    let movie_pic = secureURL + photoSize+ movieData.poster_path
    // if (numOnRow ==0){
    //     movieArea.innerHTML+=`<div class= "movieRow">`;
    // }
    // console.log(gifData.url)
    movieArea.innerHTML+= `
        <div class = "movie">
        <img src = "${movie_pic}" alt = "${movieData.title}">
        <div class = "info">
        <h4>${movieData.title}</h4>
        <div class = "ratings">
        <h3>⭐</h3>
        <h4>${movieData.vote_average}</h4>
        </div>
        </div>
        </div>
    `
    // numOnRow++;
    // if (numOnRow ==4){
    //     movieArea.innerHTML+=`</div>`;
    //     numOnRow =0;
    // }
}

function wipeResults(){
    //wipe out movieArea
    movieArea.innerHTML = ''
}

window.onload = function(){
    getResults()
}

async function loadMore(){
    //loop through every page and add info to data structures
    let apiURL       = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&page=${page}`;

    // // go to movie api 
    let response     = await fetch(apiURL);
    let responseData = await response.json();

    //store movie info in object
    responseData.results.map(storeInfo);

    // // get data on dom 
    responseData.results.map(displayResults)

    //increment page
    page++;
}