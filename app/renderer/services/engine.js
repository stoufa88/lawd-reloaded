const WebTorrent = require('webtorrent')
const remote = require('electron').remote

let _initCalled = false
let client
let server

export default class Engine {
  constructor () {
    if(_initCalled)
      return

    _initCalled = true

		console.log('creating a new webtorrent engine..')
    client = new WebTorrent()
  }

  // Add torrent to engine, return movie file in callback
  addMagnet (magnetUri, cb) {
		let opts = {
			path: app.getPath('downloads')
		}

    client.add(magnetUri, function (torrent) {
			console.log('new torrent added to engine', torrent.infoHash)

      cb(torrent)
    })
  }

	getMedia (torrentId) {
		let torrent = this.getTorrent(torrentId.toLowerCase())

		let movieFile
		let mediaIndex = 0
		torrent.files.forEach(function (f, index) {
			f.select()

			if (/\.(mp4|mkv)$/i.test(f.name)) {
				if(!movieFile || f.length > movieFile.length){
					movieFile = f
					mediaIndex = index
				}
			}
		})

		let mediaEncoding = movieFile.name.indexOf('mkv') > -1 ? 'mkv' : 'mp4'

		return {
			mediaIndex: mediaIndex,
			mediaType: 'Video',
			mediaEncoding: mediaEncoding
		}
	}

	serve(torrentId) {
		let torrent = this.getTorrent(torrentId)

		server = torrent.createServer()
		server.listen('25111')
	}

	getTorrent(torrentId) {
		return client.get(torrentId)
	}

  getTorrents () {
    return client.torrents
  }

	toggleTorrent (torrentId, pause) {
		let torrent = this.getTorrent(torrentId)

		if(pause) {
			torrent.pause()
		} else {
			torrent.resume()
		}
	}

	destroyTorrent (torrentId) {
		let torrent = this.getTorrent(torrentId)

		torrent.destroy()
	}

	destroyServer () {
		server.close()
	}

}
