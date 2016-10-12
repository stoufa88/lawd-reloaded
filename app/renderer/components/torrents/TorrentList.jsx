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

		self.engine.addMagnet(torrent.magnetUri, (webtorrent) => {
			torrent.webtorrent = webtorrent
			let torrents = update(self.state.torrents, {$push: [torrent]})
			self.setState({torrents})
		})
	}

	watchTorrents() {
		let torrents = []
		this.state.torrents.forEach((torrent, index) => {
			if(!torrent.webtorrent) {
				return
			}

			torrent.donwloaded = filesize(torrent.webtorrent.downloaded)
			torrent.uploaded = filesize(torrent.webtorrent.uploaded)
			torrent.downloadSpeed = filesize(torrent.webtorrent.downloadSpeed)
			torrent.uploadSpeed = filesize(torrent.webtorrent.uploadSpeed)
			torrent.progress = Math.floor(torrent.webtorrent.progress * 100)

			torrents.push(torrent)
		})

		this.setState({torrents})
	}

	startTorrenting(torrent, index) {
		// resume torrent is async since we don't know if it is destroyed or paused
		this.engine.resumeTorrent(torrent.infoHash, torrent.magnetUri, (webtorrent) => {
			if(webtorrent) {
				torrent.webtorrent = webtorrent
				let torrents = update(this.state.torrents, { [index]: {torrent: {$set: torrent}} })
			}
		})
	}

	pauseTorrenting(torrent, index) {
		let webtorrent = this.engine.pauseTorrent(torrent.infoHash)
		torrent.webtorrent = webtorrent
		let torrents = update(this.state.torrents, { [index]: {torrent: {$set: torrent}} })
	}

	destroyTorrent(torrent, index) {
		this.engine.destroyTorrent(torrent.infoHash)
		torrent.webtorrent.destroyed = true
		let torrents = update(this.state.torrents, { [index]: {torrent: {$set: torrent}} })
		// this.databaseService.updateTorrent()
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
					handleStartTorrenting={this.startTorrenting.bind(this, torrent, i)}
					handlePauseTorrenting={this.pauseTorrenting.bind(this, torrent, i)}
					handleDestroyTorrent={this.destroyTorrent.bind(this, torrent, i)}
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
