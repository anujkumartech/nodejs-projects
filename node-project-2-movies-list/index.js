const axios = require('axios');
const _ = require('lodash');

const MOVIES_URL = 'https://raw.githubusercontent.com/FEND16/movie-json-data/master/json/top-rated-movies-01.json';

async function fetchMovies() {
  try {
    console.log('Fetching movie data...');
    const response = await axios.get(MOVIES_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    return [];
  }
}

function displayMovieDetails(movies) {
  if (_.isEmpty(movies)) {
    console.log('No movies to display.');
    return;
  }

  console.log(`\nFound ${movies.length} movies:\n`);
  
  const sortedMovies = _.orderBy(movies, ['imdbRating'], ['desc']);
  
  _.take(sortedMovies, 7).forEach((movie, index) => {
    console.log(`\n${index + 1}. ${movie.title} (${movie.year}) - ⭐ ${movie.imdbRating}/10`);
    console.log(`   Genres: ${movie.genres.join(', ')}`);
    console.log(`   Starring: ${movie.actors.join(', ')}`);
    console.log(`   Duration: ${movie.duration.replace('PT', '').replace('M', ' minutes')}`);
    
    const shortStoryline = _.truncate(movie.storyline, {
      length: 100,
      separator: ' '
    });
    console.log(`   Synopsis: ${shortStoryline}`);
  });
}

async function runEnhancedMovieApp() {
  console.log('🎬 ENHANCED MOVIE LIST TOOL 🎬');
  console.log('Demonstrates using axios and lodash packages\n');
  
  const movies = await fetchMovies();
  
  displayMovieDetails(movies);
}

runEnhancedMovieApp();