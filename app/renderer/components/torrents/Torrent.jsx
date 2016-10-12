import React, { PropTypes } from 'react'
import Votes from './Votes'

class Torrent extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
			<div className="torrent-bar m-t-2 m-b-2">
				<h5 className="torrent-bar-title">{ this.props.torrent.name }</h5>

				<div className="row">
					<div className="pull-xs-left text-sm-center torrent-bar-stats">
						<span className="m-l-1">
							<i className="fa fa-arrow-down" aria-hidden="true"></i>
							<span>Download { this.props.torrent.downloaded } @ { this.props.torrent.downloadSpeed }</span>
						</span>

						<span className="m-l-1">
							<i className="fa fa-arrow-up" aria-hidden="true"></i>
							<span>Upload { this.props.torrent.uploaded } @ { this.props.torrent.uploadSpeed }</span>
						</span>
					</div>

					<div className="torrent-bar-buttons">
						<i className="fa fa-times" aria-hidden="true" onClick={this.props.handleTorrentRemove}></i>

						{/*(!this.props.torrent.webtorrent.paused && !this.props.torrent.webtorrent.destroyed) &&
							<i className="fa fa-pause m-l-1" aria-hidden="true" onClick={this.props.handlePauseTorrenting}></i>
						*/}

						{(this.props.torrent.webtorrent.paused || this.props.torrent.webtorrent.destroyed) &&
							<i className="fa fa-play m-l-1" aria-hidden="true" onClick={this.props.handleStartTorrenting}></i>
						}

						{!this.props.torrent.webtorrent.destroyed &&
							<i className="fa fa-stop m-l-1" aria-hidden="true" onClick={this.props.handleDestroyTorrent}></i>
						}
					</div>

				</div>

				<div className="row">
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

// <div className="col-xs-2 text-sm-center">
// 	<Votes torrent={this.props.torrent} />
// </div>
