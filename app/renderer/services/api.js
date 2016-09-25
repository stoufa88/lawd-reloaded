import Parse from 'parse/node'
import fs from 'fs'
let config = require('../../config.json')

let instance = null
const API_KEY = config.api_key
let LANG = (navigator.language).indexOf('fr') > -1 ? 'fr' : 'en'

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

		let url = `http://api.themoviedb.org/3/movie/${sort}?page=${page}&language=${LANG}&api_key=${API_KEY}`

		return fetch(url)
	    .then(function (res) {
				return res.json()
	    })
	    .catch(function (err) {
	      console.error(err)
	    });
	}

	getTvs(sort="popular", page=1) {
		console.log('Sort = ', sort)
		console.log('page = ', page)

		let url = `http://api.themoviedb.org/3/tv/${sort}?page=${page}&language=${LANG}&api_key=${API_KEY}`

		return fetch(url)
	    .then(function (res) {
				return res.json()
	    })
	    .catch(function (err) {
	      console.error(err)
	    });
	}

	searchMovies(query) {
		console.log('Search query = ', query)

		let url = `http://api.themoviedb.org/3/search/movie/?query=${query}&language=${LANG}&api_key=${API_KEY}`

		return fetch(url)
	    .then(function (res) {
				return res.json()
	    })
	    .catch(function (err) {
	      console.error(err)
	    });
	}

	searchTvs(query) {
		console.log('Search query = ', query)

		let url = `http://api.themoviedb.org/3/search/tv/?query=${query}&language=${LANG}&api_key=${API_KEY}`

		return fetch(url)
			.then(function (res) {
				return res.json()
			})
			.catch(function (err) {
				console.error(err)
			});
	}

	getMovieById(id) {
		let url = `http://api.themoviedb.org/3/movie/${id}?language=${LANG}&append_to_response=credits,videos&api_key=${API_KEY}`

		return fetch(url)
			.then(function (res) {
				return res.json()
			})
			.catch(function (err) {
				console.error(err)
			});
	}

	getTvById(id) {
		let url = `http://api.themoviedb.org/3/tv/${id}?language=${LANG}&append_to_response=credits,videos&api_key=${API_KEY}`

		return fetch(url)
			.then(function (res) {
				return res.json()
			})
			.catch(function (err) {
				console.error(err)
			});
	}

	getTvSeason(tvId, seasonNumber) {
		let url = `http://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?language=${LANG}&api_key=${API_KEY}`

		return fetch(url)
			.then(function (res) {
				return res.json()
			})
			.catch(function (err) {
				console.error(err)
			});
	}

	getGenres() {
		let url = `http://api.themoviedb.org/3/genre/movie/list?language=${LANG}&api_key=${API_KEY}`

		return fetch(url)
			.then(function (res) {
				return res.json()
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
		query.include('subtitles')

		return query.get(torrentId).then((result) => {
			return result
		})
	}

	fetchTorrentsForShow(showId) {
		let Torrent = Parse.Object.extend('Torrent')
		let query = new Parse.Query(Torrent)
		query.equalTo('showId', showId)
		query.include('subtitles')

		return query.find().then((results) => {
			return results
		})
	}

	addTorrent(showId, t, subs) {
		console.info('creating a new torrent...')

		let Torrent = Parse.Object.extend('Torrent')
		let torrent = new Torrent()

		torrent.set('showId', showId)
		torrent.set('magnetURL', t.magnetUrl)
		torrent.set('name', t.torrentName)
		torrent.set('lang', t.language)
		torrent.set('quality', t.quality)
		torrent.set('upVotes', 0)
		torrent.set('downVotes', 0)
		torrent.set('verified', false)

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

	sendRequest(showId, showName, lang) {
		let Request = Parse.Object.extend('Request')
		let request = new Request()

		request.set('showId', showId)
		request.set('showName', showName)
		request.set('lang', lang)

		request.save()
	}

	sendVoteUp(torrentId, reverse) {
		let Torrent = Parse.Object.extend('Torrent')
		let query = new Parse.Query(Torrent)
		query.get(torrentId).then((torrent) => {
			if(reverse) {
				torrent.increment('upVotes', -1)
				torrent.save()
				return
			}

			torrent.increment('upVotes')
			torrent.save()
		})
	}

	sendVoteDown(torrentId, reverse) {
		let Torrent = Parse.Object.extend('Torrent')
		let query = new Parse.Query(Torrent)
		query.get(torrentId).then((torrent) => {
			if(reverse) {
				torrent.increment('downVotes', -1)
				torrent.save()
				return
			}

			torrent.increment('downVotes')
			torrent.save()
		})
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
