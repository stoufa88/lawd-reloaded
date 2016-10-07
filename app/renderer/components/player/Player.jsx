
import React, { PropTypes } from 'react'
import videojs from 'video.js'
import ApiService from '../../services/api'
import Engine from '../../services/engine'
import Torrent from '../torrents/Torrent'

let apiService, engine, player

class Player extends React.Component {
  constructor(props) {
    super(props)

		this.state = {
			torrent: null,
			torrentId: null // This is webtorrent id
		}

		apiService = new ApiService()
		engine = new Engine()
  }

	componentDidMount() {
		player = videojs('video-player', { 'controls': true, 'autoplay': false, 'preload': 'auto' })
		console.log("Getting torrent id from props...", this.props.params.torrentId)

		this.serveTorrent(this.props.params.torrentId);
	}

	componentWillUpdate(nextProps, nextState) {
		// We now have torrentId in state, let's play a bit
		if(nextState.torrentId) {
			this.playTorrent(nextState.torrentId)
		}
	}

	serveTorrent(torrentId) {
		apiService.getTorrentById(torrentId).then((torrent) => {
			this.setState({torrent})
			if(torrent.get('subtitles')) {
				torrent.get('subtitles').forEach((subtitle) => {
					this.addRemoteTextTrack(subtitle)
				})
			}

			engine.addMagnet(torrent.get('magnetURL'), ((torrent) => {
				engine.serve(torrent.infoHash)
				this.setState({ torrentId: torrent.infoHash })
			}))
		})
	}

	playTorrent(torrentId) {
		let media = engine.getMedia(torrentId)
		let torrent = engine.getTorrent(torrentId)

		// renderTo only works with mp4
		if(media.mediaEncoding == 'mp4') {
			torrent.files[media.mediaIndex].renderTo('video',function(err, elem){
        console.log(err)
      })
		}else {
			$('#video-player_html5_api').attr(
				'src',
				'http://localhost:25111/' + media.mediaIndex
			)
		}
	}

	addRemoteTextTrack(subtitle) {
		console.info('adding sub', subtitle)
		player.addRemoteTextTrack({
			kind: 'subtitles',
			language: subtitle.get('lang'),
			src: subtitle.get('vttFile').url()
		})
	}

  render() {
    return (
      <div className="m-t-1 container-fluid">
				<div id="player">
					<video id="video-player" className="video-js vjs-default-skin vjs-big-play-centered m-x-auto">
					</video>
				</div>

				<Torrent
					webTorrentId={this.state.torrentId}
					torrent={this.state.torrent} />
      </div>
    );
  }
}

Player.propTypes = {
	params: PropTypes.shape({
		torrentId: PropTypes.string.isRequired // This comes from our api
	})
};

export default Player
