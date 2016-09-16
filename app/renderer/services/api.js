import rp from 'request-promise'
import Parse from 'parse/node'
import fs from 'fs'
let config = require('../../config.json')

let instance = null
const API_KEY = config.api_key
const LANG = 'fr'

export default class ApiService {
  constructor() {
    if(instance){
			return
		}

		instance = this

		Parse.initialize(config.app_id)
		Parse.serverURL = config.server_url
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

	searchMovies(query) {
		console.log('Search query = ', query)

		var options = {
	    uri: `http://api.themoviedb.org/3/search/movie/?query=${query}&language=${LANG}&api_key=${API_KEY}`,
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

	getMovieCredits(id) {
		var options = {
			uri: `http://api.themoviedb.org/3/movie/${id}/credits?language=${LANG}&api_key=${API_KEY}`,
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

	getTorrentById(torrentId) {
		let Torrent = Parse.Object.extend('Torrent')
		let query = new Parse.Query(Torrent)

		return query.get(torrentId).then((result) => {
			return result
		})
	}

	fetchTorrentsForMovie(movieId) {
		let Torrent = Parse.Object.extend('Torrent')
		let query = new Parse.Query(Torrent)
		query.equalTo('movieId', movieId)
		query.include('subtitles')

		return query.find().then((results) => {
			return results
		})
	}

	addTorrent(movieId, t, subs) {
		console.info('creating a new torrent...')

		let Torrent = Parse.Object.extend('Torrent')
		let torrent = new Torrent()

		torrent.set('movieId', movieId)
		torrent.set('magnetURL', t.magnetUrl)
		torrent.set('name', t.torrentName)
		torrent.set('lang', t.language)
		torrent.set('quality', t.quality)

		if(subs.length > 0) {
			subs.forEach((subtitle) => {
				this.addSubtitle(torrent, subtitle)
			})
		}
	}

	addSubtitle(torrent, sub) {
		console.info('creating a new subtitle...')
		let Subtitle = Parse.Object.extend('Subtitle')
		let subtitle = new Subtitle()

		subtitle.set('torrent', torrent)
		subtitle.set('lang', sub.lang)

		let file = fs.readFile(sub.file.path, (err, data) => {
			if (err) throw err

			let buffer = new Buffer(data)
			let parseFile = new Parse.File(sub.file.name, {base64: buffer.toString('base64')})
			parseFile.save()

			subtitle.set('file', parseFile)

			subtitle.save().then(() => {
				torrent.add('subtitles', subtitle)
				torrent.save()
			})
		});
	}

	sendRequest(movieId, movieName, lang) {
		let Request = Parse.Object.extend('Request')
		let request = new Request()

		request.set('movieId', movieId)
		request.set('movieName', movieName)
		request.set('lang', lang)

		request.save()
	}
}

// .then(function() {
// 	// subtitle.set('file', parseSubFile)
// 	// subtitle.set('lang', subtitleLang)
// 	// subtitle.set('torrent', torrent)
// 	// subtitle.save({
// 	// 	success: () => {
// 	// 		console.info('creating a new subtitle finished.')
// 	// 		torrent.add('subtitles', subtitle)
// 	// 		torrent.save()
// 	// 	}
// 	// })
// }, function(error) {
// 	console.log(error)
// })
