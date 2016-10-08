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
			this.addTorrentsToEngine(torrents)
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
			console.info(torrents)
			self.setState({torrents})
		})
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
