
import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import filesize from 'filesize'
import Votes from './Votes'
import Engine from '../../services/engine'

let engine

class Torrent extends React.Component {

  constructor(props) {
    super(props)

		this.state = {
			torrentName: '',
			downloaded: 0,
			uploaded: 0,
			downloadSpeed: 0,
			uploadSpeed: 0,
			progress: 0,
			intervalId: ""
		}

		this.resumeDownload = this.resumeDownload.bind(this)
		this.pauseDownload = this.pauseDownload.bind(this)

		engine = new Engine()
  }

	componentWillReceiveProps(nextProps) {
		if(nextProps.webTorrentId) {
			this.listenForTorrent(nextProps.webTorrentId)
		}
	}

	componentWillUnmount() {
		window.clearInterval(this.state.intervalId)
		engine.destroyTorrent(this.props.webTorrentId)
		engine.destroyServer()
	}

	listenForTorrent(torrentId) {
		let torrent = engine.getTorrent(torrentId)

		this.setState({torrentName: torrent.dn})

		let intervalId =  setInterval( () => {
				this.setState({downloaded: filesize(torrent.downloaded)})
				this.setState({uploaded: filesize(torrent.uploaded)})
				this.setState({downloadSpeed: filesize(torrent.downloadSpeed)})
				this.setState({uploadSpeed: filesize(torrent.uploadSpeed)})
				this.setState({progress: Math.floor(torrent.progress * 100) })
			}, 1000)

		this.setState({intervalId: intervalId})
	}

	resumeDownload() {
		engine.resumeTorrent(this.props.webTorrentId)
		// this.listenForTorrent(this.props.torrentId)
	}

	pauseDownload() {
		engine.pauseTorrent(this.props.webTorrentId)
		// window.clearInterval(this.state.intervalId)
	}

	destroyTorrent() {
		engine.destroyTorrent(this.props.webTorrentId)
	}

  render() {
    return (
			<div className="torrent-bar m-t-2 m-b-2">
				<h5 className="text-xs-center">{ this.state.torrentName }</h5>

				<div className="row">
					<div className="col-xs-4 text-sm-center">
						<i className="fa fa-arrow-down" aria-hidden="true"></i>
						<span className="p-l-1">Download: { this.state.downloaded } @ { this.state.downloadSpeed }</span>
					</div>

					<div className="col-xs-4 text-sm-center">
						<i className="fa fa-arrow-up" aria-hidden="true"></i>
						<span className="p-l-1">Upload: { this.state.uploaded } @ { this.state.uploadSpeed }</span>
					</div>

					<div className="col-xs-2 text-sm-center">
						<Votes torrent={this.props.torrent} />
					</div>
				</div>

				<div className="row m-t-2">
					<progress className="progress" value={this.state.progress} max="100" aria-describedby="example-caption-1"></progress>
				</div>

			</div>
    );
  }
}

Torrent.propTypes = {
	webTorrentId: PropTypes.string, // This comes from webtorrent
	torrent: PropTypes.object
};

// <i className="fa fa-stop m-l-1" aria-hidden="true" onClick={this.destroyTorrent} ></i>

export default Torrent

// <div className="col-xs-2 offset-xs-2">
// 	<i className="fa fa-play" aria-hidden="true" onClick={this.resumeDownload} ></i>
// 	<i className="fa fa-pause m-l-1" aria-hidden="true" onClick={this.pauseDownload} ></i>
// </div>
