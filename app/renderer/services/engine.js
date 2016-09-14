const WebTorrent = require('webtorrent')
const remote = require('electron').remote
import srt2vtt from 'srt2vtt'

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
    client.add(magnetUri, function (torrent) {
			console.info('new torrent added to engine', torrent.infoHash)

      cb(torrent)
    })
  }

	getMedia (torrentId) {
		let torrent = this.getTorrent(torrentId.toLowerCase())

		let movieFile
		let mediaIndex = 0
		let subtitleIndexes = []
		torrent.files.forEach(function (f, index) {
			f.select()

			if (/\.(mp4|mkv)$/i.test(f.name)) {
				if(!movieFile || f.length > movieFile.length){
					movieFile = f
					mediaIndex = index
				}
			}

			if (/\.(srt|sub)$/i.test(f.name)) {
				subtitleIndexes.push(index)
			}
		})

		torrent.downloading = true

		let mediaEncoding = movieFile.name.indexOf('mkv') > -1 ? 'mkv' : 'mp4'

		return {
			mediaIndex: mediaIndex,
			mediaType: 'Video',
			mediaEncoding: mediaEncoding,
			subtitleIndexes: subtitleIndexes
		}
	}

	serve(torrentId) {
		let torrent = this.getTorrent(torrentId)

		server = torrent.createServer()
		server.listen('25111')

		console.info('server listening at 25111')
	}

	getTorrent(torrentId) {
		return client.get(torrentId)
	}

  getTorrents () {
    return client.torrents
  }

	resumeTorrent (torrentId) {
		let torrent = this.getTorrent(torrentId)
		if(!torrent) {
			return
		}

		console.info('Resuming torrent with id', torrentId)

		torrent.resume()
	}

	pauseTorrent(torrentId) {
		let torrent = this.getTorrent(torrentId)
		if(!torrent) {
			return
		}

		console.info('Pausing torrent with id', torrentId)

		torrent.pause()
	}

	destroyTorrent (torrentId) {
		let torrent = this.getTorrent(torrentId)
		if(!torrent) {
			return;
		}

		torrent.destroy()
	}

	destroyServer () {
		server.close()
	}

}
