const { ipcRenderer } = require('electron')
import _ from 'underscore'

let constants = require ('../../constants.js')

let _initCalled = false

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

	addTorrent(torrent) {
		console.log(torrent)
		let doc = {
			infoHash: torrent.infoHash,
			name: torrent.dn,
			magnetUri: torrent.magnetURI,
			paused: torrent.paused,
			done: torrent.done,
			destroyed: torrent.destroyed
		}

		let p = Promise.resolve(ipcRenderer.sendSync(constants.ACTION_ADD_TORRENT, doc));

		return p.then(() => {
			// SUCCESS
		});
	}

	updateTorrent(torrent) {
		let p = Promise.resolve(ipcRenderer.sendSync(constants.ACTION_UPDATE_TORRENT, torrent));

		return p.then(() => {
			// SUCCESS
		});
	}

	removeTorrent(_id) {
		let p = Promise.resolve(ipcRenderer.sendSync(constants.ACTION_REMOVE_TORRENT, _id));

		return p.then(() => {
			// SUCCESS
		});
	}

}
