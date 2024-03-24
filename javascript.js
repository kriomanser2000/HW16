const apiKey = '5f355225';
const apiUrl = 'http://www.omdbapi.com/';
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const typeSelect = document.getElementById('type-select');
const moviesList = document.getElementById('movies-list');
const pagination = document.getElementById('pagination');
let currentPage = 1;
searchForm.addEventListener('submit', function(event) 
{
    event.preventDefault();
    currentPage = 1;
    searchMovies();
});
function searchMovies() 
{
    const searchTerm = searchInput.value.trim();
    const type = typeSelect.value;
    const url = `${apiUrl}?apikey=${apiKey}&s=${searchTerm}&type=${type}&page=${currentPage}`;
    fetch(url)
        .then(response => response.json())
        .then(data => 
        {
            if (data.Response === 'True') 
            {
                displayMovies(data.Search);
                displayPagination(data.totalResults);
            } 
            else 
            {
                moviesList.innerHTML = '<p>Movie not found!</p>';
                pagination.innerHTML = '';
            }
        })
        .catch(error => console.log('Error:', error));
}
function displayMovies(movies) 
{
    let html = '';
    movies.forEach(movie => 
    {
        html += `
            <div class="movie-item">
                <p class="movie-title" data-imdbid="${movie.imdbID}">${movie.Title}</p>
                <p>Type: ${movie.Type}</p>
                <p>Year: ${movie.Year}</p>
            </div>
        `;
    });
    moviesList.innerHTML = html;
    const movieTitles = document.querySelectorAll('.movie-title');
    movieTitles.forEach(title => 
    {
        title.addEventListener('click', function() 
        {
            const imdbID = this.getAttribute('data-imdbid');
            fetchMovieDetails(imdbID);
        });
    });
}
function displayPagination(totalResults) 
{
    const totalPages = Math.ceil(totalResults / 10);
    let html = '';
    for (let i = 1; i <= totalPages; i++) 
    {
        html += `<span class="pagination-button" data-page="${i}">${i}</span>`;
    }
    pagination.innerHTML = html;
    const pageButtons = document.querySelectorAll('.pagination-button');
    pageButtons.forEach(button => 
    {
        button.addEventListener('click', function() 
        {
            currentPage = parseInt(this.getAttribute('data-page'));
            searchMovies();
        });
    });
}
function fetchMovieDetails(imdbID) 
{
    const url = `${apiUrl}?apikey=${apiKey}&i=${imdbID}`;
    fetch(url)
        .then(response => response.json())
        .then(data => 
        {
            const details = `
                <h2>${data.Title}</h2>
                <p>Type: ${data.Type}</p>
                <p>Year: ${data.Year}</p>
                <p>Genre: ${data.Genre}</p>
                <p>Director: ${data.Director}</p>
                <p>Actors: ${data.Actors}</p>
                <p>Plot: ${data.Plot}</p>
            `;
            moviesList.innerHTML += details;
        })
        .catch(error => console.log('Error:', error));
}
function adjustHeight() 
{
    const containerHeight = document.querySelector('.container').clientHeight;
    const moviesListHeight = document.getElementById('movies-list').clientHeight;
    const newHeight = containerHeight + moviesListHeight + 210;
    if (newHeight > initialHeight) 
    {
        spBG.style.height = newHeight + 'px';
    } 
    else 
    {
        spBG.style.height = initialHeight + 'px';
    }
}
