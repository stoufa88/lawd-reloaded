const { ipcRenderer } = require('electron')

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
			return torrents;
		});
	}

	addTorrent(torrent, magnetUri) {
		let doc = {
			infoHash: torrent.infoHash,
			name: torrent.name,
			magnetUri: magnetUri
		}

		let p = Promise.resolve(ipcRenderer.sendSync(constants.ACTION_ADD_TORRENT, doc));

		return p.then(() => {
			// SUCCESS
		});
	}

}
