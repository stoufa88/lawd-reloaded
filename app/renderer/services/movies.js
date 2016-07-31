import rp from 'request-promise'
let config = require('../../config.json')

let instance = null
const API_KEY = config.api_key
const LANG = 'fr'

console.log(config)

export default class MovieService {
  constructor(token) {
    if(!instance){
      instance = this;
    }

    this.token = token;
  }

	getPopularMovies() {
		var options = {
	    uri: `http://api.themoviedb.org/3/movie/popular?language=${LANG}&api_key=${API_KEY}`,
	    json: true
		}

		return rp(options)
	    .then(function (res) {
				return res
	    })
	    .catch(function (err) {
	      console.error(err)
	    });
	}

	getMovieById(id) {
		var options = {
			uri: `http://api.themoviedb.org/3/movie/${id}?language=${LANG}&api_key=${API_KEY}`,
			json: true
		}

		return rp(options)
			.then(function (res) {
				return res
			})
			.catch(function (err) {
				console.error(err)
			});
	}

	getGenres() {
		var options = {
			uri: `http://api.themoviedb.org/3/genre/movie/list?language=${LANG}&api_key=${API_KEY}`,
			json: true
		}

		return rp(options)
			.then(function (res) {
				return res
			})
			.catch(function (err) {
				console.error(err)
			});
	}

	getGenresByIds(input, ids) {
		let genres = []
		input.forEach((g) => {
			ids.forEach((id) => {
				if(g.id === id) {
					genres.push(g.name)
				}
			})
		})

		return genres
	}
}
