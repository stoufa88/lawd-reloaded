import React, { PropTypes } from 'react'
import Votes from './Votes'

class Torrent extends React.Component {

  constructor(props) {
    super(props)
  }


	// componentWillUnmount() {
	// 	window.clearInterval(this.state.intervalId)
	// 	engine.destroyTorrent(this.props.webTorrentId)
	// 	engine.destroyServer()
	// }

  render() {
    return (
			<div className="torrent-bar m-t-2 m-b-2">
				<h5 className="text-xs-center">{ this.props.torrent.name }</h5>

				<div className="row">
					<div className="col-xs-4 text-sm-center">
						<i className="fa fa-arrow-down" aria-hidden="true"></i>
						<span className="p-l-1">Download: { this.props.torrent.downloaded } @ { this.props.torrent.downloadSpeed }</span>
					</div>

					<div className="col-xs-4 text-sm-center">
						<i className="fa fa-arrow-up" aria-hidden="true"></i>
						<span className="p-l-1">Upload: { this.props.torrent.uploaded } @ { this.props.torrent.uploadSpeed }</span>
					</div>

					<div className="col-xs-2 text-sm-center">
						<Votes torrent={this.props.torrent} />
					</div>
				</div>

				<div className="row m-t-2">
					<progress className="progress" value={this.props.torrent.progress} max="100" aria-describedby="example-caption-1"></progress>
				</div>

			</div>
    );
  }
}

Torrent.propTypes = {
	torrent: PropTypes.object.isRequired
};

// <i className="fa fa-stop m-l-1" aria-hidden="true" onClick={this.destroyTorrent} ></i>

export default Torrent
