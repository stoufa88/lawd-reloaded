import rp from 'request-promise'
import Parse from 'parse/node'
let config = require('../../config.json')

let instance = null
const API_KEY = config.api_key
const LANG = 'fr'

export default class ApiService {
  constructor(token) {
    if(!instance){
      instance = this
    }

		Parse.initialize(config.app_id)
		Parse.serverURL = config.server_url

    this.token = token;
  }

	getMovies(sort="popular", page=1) {
		console.log('Sort = ', sort)
		console.log('page = ', page)

		var options = {
	    uri: `http://api.themoviedb.org/3/movie/${sort}?page=${page}&language=${LANG}&api_key=${API_KEY}`,
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

	fetchTorrentsForMovie(movieId) {
		let Torrent = Parse.Object.extend('Torrent')
		let query = new Parse.Query(Torrent)
		query.equalTo('movieId', movieId)

		return query.find().then((results) => {
			return results
		})
	}

	addTorrent(magnetURL, movieId) {
		let Torrent = Parse.Object.extend('Torrent')
		let torrent = new Torrent()
		torrent.set('magnetURL', magnetURL)
		torrent.set('movieId', movieId)
		torrent.save();
	}
}
