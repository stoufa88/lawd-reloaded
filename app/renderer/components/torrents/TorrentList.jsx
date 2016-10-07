import React, { PropTypes } from 'react'
import update from 'react-addons-update'
import filesize from 'filesize'
import Torrent from './Torrent'
import DatabaseService from '../../services/db'
import Engine from '../../services/engine'

class TorrentList extends React.Component {
  constructor(props) {
    super(props)

		this.state = {
			torrents: []
		}

		this.databaseService = new DatabaseService()
		this.engine = new Engine()
  }

	componentWillMount() {
		this.databaseService.getTorrents().then((torrents) => {
			this.setState({torrents})
		})
	}

	componentDidMount() {
		let intervalId =  setInterval( () => {
			this.watchTorrents()
		}, 3000)
	}

	addTorrentToEngine(infoHash) {
		// let torrents = update(this.state.torrents, {[index]: {torrent: {$set: torrent}}})
	}

	startTorrenting(torrentId) {
		console.info('Torrenting is starting for', torrentId)
		this.engine.resumeTorrent(torrentId)
	}

	stopTorrenting(torrentId) {
		console.info('Torrenting is stopping for', torrentId)
		this.engine.pauseTorrent(torrentId)
	}

	destroyTorrent(torrentId) {
		this.engine.destroyTorrent(torrentId)
	}

	watchTorrents() {
		let torrents = []
		this.state.torrents.forEach((torrent, index) => {
			console.log(torrent)

			torrent.donwloaded = filesize(torrent.downloaded)
			torrent.uploaded = filesize(torrent.uploaded)
			torrent.downloadSpeed = filesize(torrent.downloadSpeed)
			torrent.uploadSpeed = filesize(torrent.uploadSpeed)

			torrent.progress = Math.floor(torrent.progress * 100)


			torrents.push(torrent)
		})

		// this.setState({torrents})
	}

  render() {
		let torrents = []
		this.state.torrents.map((torrent, i) => {
			torrents.push(
				<Torrent
					key={i}
					torrent={torrent}
					startTorrenting={this.startTorrenting.bind(this, torrent.infoHash)}
					startTorrenting={this.stopTorrenting.bind(this, torrent.infoHash)}
					startTorrenting={this.destroyTorrent.bind(this, torrent.infoHash)} />
			)})

    return (
      <div className="m-t-1 container torrent-list">
				{torrents}
      </div>
    );
  }
}

export default TorrentList
