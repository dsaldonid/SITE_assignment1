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
const modalText = document.querySelector("p");
const clearIcon = document.querySelector(".clear-icon");
const searchBar = document.querySelector(".search");
const modal = document.getElementById("myModal");
// Get the button that opens the modal
const btn = document.getElementById("myBtn");
// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];


movieForm.addEventListener("submit", filter)
movieForm.addEventListener("input",dynamicfilter)
loadButton.addEventListener("click",loadMore)

searchBar.addEventListener("keyup", () => {
    if(searchBar.value && clearIcon.style.visibility != "visible"){
      clearIcon.style.visibility = "visible";
    } else if(!searchBar.value) {
      clearIcon.style.visibility = "hidden";
    }
  });

  clearIcon.addEventListener("click", () => {
    searchBar.value = "";
    clearIcon.style.visibility = "hidden";
    wipeResults();
    page =1;
    getResults();
  })

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
    responseData.results.map(displayResults);

}

function storeInfo(movieData){
    //save our movie's title,average moving votes, and picture's URL
    let movie_pic         = secureURL + photoSize+ movieData.poster_path;
    let movie_name        = movieData.title;
    let movie_rating      = movieData.vote_average;
    let movie_description = movieData.overview;
    let movie_id          = movieData.id;

    //add our movie info to object with movie name as key
    movieInfo[movie_name] = 
    {
    "picture_URL":movie_pic,
    "average_votes":movie_rating,
    "description":movie_description,
    "id":movie_id
    };
    moreDetail(movie_name);
    storeYoutubekey(movie_name);
    
}


function displayResults(movieData){
    // console.log(movieData);
    let movie_pic = secureURL + photoSize+ movieData.poster_path;
    movieArea.innerHTML+= `
        <div class = "movie modal-open">
        <img src = "${movie_pic}" class = "modal-open" alt = "${movieData.title}">
        <div class = "info">
        <h4>${movieData.title}</h4>
        <div class = "ratings">
        <h3>⭐</h3>
        <h4>${movieData.vote_average}</h4>
        </div>
        </div>
        </div>
    `;
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

//grab additonal movie info
async function moreDetail(movie){
    movieId  = movieInfo[movie].id
    //make api call to filter movies
    const detailURL    = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
    const response     = await fetch(detailURL);
    const responseData = await response.json();

    //save additional info into movieInfo 
    movieInfo[movie]["runtime"]      = responseData.runtime;
    movieInfo[movie]["release_date"] = responseData.release_date;
    movieInfo[movie]["genres"]       = responseData.genres;
}

//open and close out model
document.addEventListener('click', function (event) {
    if (event.target.matches('.modal')) {
		// Run your code to close a modal
        modal.style.display = "none";
	}
    const movieName  = event.target.alt;
    const youtubeKey = movieInfo[movieName].youtubeKey;
    const movieRun   = `${movieInfo[event.target.alt].runtime}`;
    const movieRelease   = `${movieInfo[event.target.alt].release_date}`;
    const movieRating    = movieInfo[event.target.alt].average_votes;
    let   genreStr   = ``;
    movieInfo[event.target.alt].genres.forEach(element => {
        genreStr += `${element.name} `
    });
    
	if (event.target.matches('.modal-open')) {
		// Run your code to open a modal
        modal.style.display = "block";
        modalText.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeKey}" class ="embed" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        modalText.innerHTML += `<h4 class= "movieName">${movieName}</h4>`;
        modalText.innerHTML += `<h4 class= "movieName">${movieRun} min | ${movieRelease} | ${genreStr} |⭐${movieRating} </h4>`;
        modalText.innerHTML += movieInfo[event.target.alt].description
	}


}, false);


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}


async function storeYoutubekey(movieName){
    const movieId = movieInfo[movieName].id
    const movieVids = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`;
    const response     = await fetch(movieVids);
    const responseData = await response.json();
    movieInfo[movieName]['youtubeKey'] = responseData.results[0].key;
}
