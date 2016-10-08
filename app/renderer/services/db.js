const { ipcRenderer } = require('electron')
import _ from 'underscore'

let constants = require ('../../constants.js')

let _initCalled = false

const torrent_statuses = {
	isDownloading: 'downloading',
	isSeeding: 'seeding',
	isPaused: 'paused'
}

export default class DatabaseService {
  constructor () {
    if(_initCalled)
      return

    _initCalled = true
  }

	getTorrents() {
		let p = Promise.resolve(ipcRenderer.sendSync(constants.ACTION_GET_TORRENTS, null));

		return p.then((torrents) => {
			// remove duplicate to avoid torrent ids collision
			return _.uniq(torrents, 'infoHash')
		})
	}

	addTorrent(torrent, magnetUri) {
		let doc = {
			infoHash: torrent.infoHash,
			name: torrent.name,
			magnetUri: magnetUri,
			status: torrent_statuses.isDownloading
		}

		let p = Promise.resolve(ipcRenderer.sendSync(constants.ACTION_ADD_TORRENT, doc));

		return p.then(() => {
			// SUCCESS
		});
	}

	pauseTorrent(torrent) {
		torrent.pause()
	}

}
