const WebTorrent = require('webtorrent')
const {ipcRenderer} = require('electron')
import srt2vtt from 'srt2vtt'
import DatabaseService from './db'

let _initCalled = false
let downloadPath
let client
let server
let databaseService

export default class Engine {
  constructor () {
    if(_initCalled)
      return

    _initCalled = true

		downloadPath = ipcRenderer.sendSync('download-path-request', '')
    client = new WebTorrent({maxConns: 150})
		databaseService = new DatabaseService()
  }

  // Add torrent to engine, return torrent in callback
  addMagnet (magnetURI, cb) {
		let self = this
		let opts = {
			path: downloadPath
		}

    client.add(magnetURI, opts, function (torrent) {
			console.info('new torrent added to engine', torrent)

			// self.selectAllFiles(torrent.files)

      cb(torrent)
    })
  }

	selectAllFiles(files) {
		files.forEach((file) => {
			this.selectTorrentFile(file)
		})
	}

	selectTorrentFile(f) {
		f.select()
	}

	getMedia (torrentId) {
		let torrent = this.getTorrent(torrentId.toLowerCase())

		let movieFile
		let mediaIndex = 0
		let subtitleIndexes = []
		torrent.files.forEach(function (f, index) {
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

		console.info('Destroying torrent with id', torrentId)

		torrent.destroy()
	}

	destroyServer () {
		server.close()
	}

}
