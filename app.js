// Global constants
const movieArea = document.querySelector(".movieArea");
const apiKey  = "e378e77d411b157b07cbb13f2410ae82";
const limit   = 9;
const rating  = "g";
let   movieId;
const movieForm = document.querySelector("form");
const loadButton = document.querySelector(".hidden");
const photoSize  = "w200"
let   secureURL;
let   movieUrls = [];
let   movieInfo = {};
let   page =1;


movieForm.addEventListener("submit", getResults)

async function getResults(evt){
    evt.preventDefault()

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
    console.log(movieInfo);
    
    // // get data on dom 

    responseData1.results.map(displayResults)
    if (loadButton.classList.contains("hidden")) {
        loadButton.classList.remove("hidden")
      } 

    //increment page once to be ready for load more 
    page++;
}

function filter(){
    //wipe page
    setTimeout(wipeResults,5000)

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
    // console.log(gifData.url)
    movieArea.innerHTML+= `
    <img src = "${movie_pic}">
    <h4>${movieData.title}</h4>
    `
}

function wipeResults(){
    //wipe out movieArea
    movieArea.innerHTML = ''
}