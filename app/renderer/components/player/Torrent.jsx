
import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import filesize from 'filesize'
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
		console.log("Torrent.jsx:componentWillReceiveProps", nextProps.torrentId)
		this.listenForTorrent(nextProps.torrentId)
	}

	componentWillUnmount() {
		window.clearInterval(this.state.intervalId)
		engine.destroyTorrent(this.props.torrentId)
	}

	listenForTorrent(torrentId) {
		let torrent = engine.getTorrent(torrentId)

		this.setState({torrentName: torrent.dn})

		let intervalId =  setInterval( () => {
				this.setState({downloaded: filesize(torrent.downloaded)})
				this.setState({uploaded: filesize(torrent.uploaded)})
				this.setState({downloadSpeed: filesize(torrent.downloadSpeed)})
				this.setState({uploadSpeed: filesize(torrent.uploadSpeed)})
				this.setState({progress: filesize(torrent.progress)})
			}, 2000)

		this.setState({intervalId: intervalId})
	}

	resumeDownload() {
		engine.resumeTorrent(this.props.torrentId)
		this.listenForTorrent(this.props.torrentId)
	}

	pauseDownload() {
		engine.pauseTorrent(this.props.torrentId)
		window.clearInterval(this.state.intervalId)
	}

	destroyTorrent() {
		engine.destroyTorrent(this.props.torrentId)
	}

  render() {
    return (
			<div className="torrent-bar m-t-2 m-b-2 m-x-auto">
				<h5 className="text-xs-center">{ this.state.torrentName }</h5>

				<div className="row">
					<div className="col-xs-4">
						<i className="fa fa-arrow-down" aria-hidden="true"></i>
						<span className="m-l-1">Download: { this.state.downloaded } @ { this.state.downloadSpeed }</span>
					</div>

					<div className="col-xs-4">
						<i className="fa fa-arrow-up" aria-hidden="true"></i>
						<span className="m-l-1">Upload: { this.state.uploaded } @ { this.state.uploadSpeed }</span>
					</div>

					<div className="col-xs-4">
						<i className="fa fa-play" aria-hidden="true" onClick={this.resumeDownload} ></i>
						<i className="fa fa-pause m-l-1" aria-hidden="true" onClick={this.pauseDownload} ></i>
					</div>
				</div>

			</div>
    );
  }
}

Torrent.propTypes = {
	torrentId: PropTypes.string.isRequired // This comes from webtorrent
};

// <i className="fa fa-stop m-l-1" aria-hidden="true" onClick={this.destroyTorrent} ></i>

export default Torrent
