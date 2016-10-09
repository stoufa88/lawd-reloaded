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
		this.intervalId = null
  }

	componentWillMount() {
		this.databaseService.getTorrents().then((torrents) => {
			// This is just for testing purposes
			this.addTorrentsToEngine(torrents)
			// this.setState({torrents})
		})
	}

	componentDidMount() {
		this.intervalId = setInterval( () => {
			this.watchTorrents()
		}, 1000)
	}

	componentWillUnmount() {
		window.clearInterval(this.intervalId)
	}

	addTorrentsToEngine(torrents) {
		torrents.forEach((torrent, index) => {
			this.addTorrentToEngine(torrent)
		})
	}

	addTorrentToEngine(torrent) {
		let self = this

		self.engine.addMagnet(torrent.magnetURI, (tor) => {
			let torrents = update(self.state.torrents, {$push: [tor]})
			self.setState({torrents})
		})
	}

	watchTorrents() {
		let torrents = []
		this.state.torrents.forEach((torrent, index) => {
			torrent.donwloaded = filesize(torrent.downloaded)
			torrent.uploaded = filesize(torrent.uploaded)
			torrent.downloadSpeed = filesize(torrent.downloadSpeed)
			torrent.uploadSpeed = filesize(torrent.uploadSpeed)
			torrent.progress = Math.floor(torrent.progress * 100)

			torrents.push(torrent)
		})

		this.setState({torrents})
	}

	startTorrenting(torrentId) {
		this.engine.resumeTorrent(torrentId)
	}

	pauseTorrenting(torrentId) {
		this.engine.pauseTorrent(torrentId)
	}

	destroyTorrent(torrent) {
		this.engine.destroyTorrent(torrent.infoHash)
		this.databaseService.updateTorrent()
	}

	removeTorrent(_id, index) {
		this.databaseService.removeTorrent(_id).then(() => {
			console.info('TORRENT_REMOVED', _id)
		})

		let torrents = this.state.torrents
		torrents.splice(index, 1)
		this.setState({torrents})
	}

  render() {
		let torrents = []
		this.state.torrents.map((torrent, i) => {
			torrents.push(
				<Torrent
					key={i}
					torrent={torrent}
					handleStartTorrenting={this.startTorrenting.bind(this, torrent.infoHash)}
					handlePauseTorrenting={this.pauseTorrenting.bind(this, torrent.infoHash)}
					handleDestroyTorrent={this.destroyTorrent.bind(this, torrent.infoHash)}
					handleTorrentRemove={this.removeTorrent.bind(this, torrent._id, i)} />
			)})

    return (
      <div className="m-t-1 container torrents">
				<div className="torrents-torrent-list">
					{torrents}
				</div>
      </div>
    );
  }
}

export default TorrentList
