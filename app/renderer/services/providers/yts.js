const BASE_URL = 'https://yts.ag/api/v2/list_movies.json';

let instance

export default class YTSProvider {
  constructor() {
    if(instance){
			return
		}

		instance = this
  }

	getMovieTorrents(imdbCode) {
		let url = `${BASE_URL}?query_term=${imdbCode}`

		return fetch(url)
	    .then((res) => {
				return res.json()
	    })
	    .catch(function (err) {
	      console.error(err)
	    });
	}

	getMagnet(hash) {
		let magnetUri = 'magnet:?xt=urn:btih:' + hash
		trackers.forEach((t) => {
			magnetUri += '&tr=' + t
		})

		return magnetUri
	}
}

let trackers = [
	'udp://tracker.publicbt.com:80/announce',
	'udp://glotorrents.pw:6969/announce',
  'udp://tracker.coppersurfer.tk:6969/announce',
 	'udp://tracker.openbittorrent.com:80/announce',
	'udp://tracker.opentrackr.org:1337/announce',
  'http://tracker.calculate.ru:6969/announce',
  'http://tracker1.wasabii.com.tw:6969/announce',
  'http://thetracker.org/announce',
  'http://tracker.files.fm:6969/announce',
  'http://tracker1.itzmx.com:8080/announce',
  'udp://tracker.opentrackr.org:1337/announce',
  'http://tracker.baravik.org:6970/announce'
]
