
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
			isPaused: false,
			intervalId: ""
		}

		engine = new Engine()
  }

	componentWillReceiveProps(nextProps) {
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

  render() {
    return (
			<div className="torrent">
				<div className="row">
					<div className="col-xs-8">
						<h5>{ this.state.torrentName }</h5>
					</div>

					<div className="col-xs-2">
						<i className="fa fa-pause" aria-hidden="true" ></i>

						<i className="fa fa-stop" aria-hidden="true" ></i>
					</div>
				</div>

				<div className="row">
					<div className="col-xs-4">
						<i className="fa fa-arrow-down" aria-hidden="true"></i>
						<span>Download: { this.state.downloaded } @ { this.state.downloadSpeed }</span>
					</div>

					<div className="col-xs-4">
						<i className="fa fa-arrow-up" aria-hidden="true"></i>
						<span>Upload: { this.state.uploaded } @ { this.state.uploadSpeed }</span>
					</div>

				</div>
			</div>
    );
  }
}

Torrent.propTypes = {
	torrentId: PropTypes.string.isRequired // This comes from webtorrent
};

export default Torrent
