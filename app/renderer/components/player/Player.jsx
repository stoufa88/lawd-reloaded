
import React, { PropTypes } from 'react'
import videojs from 'video.js'
import ApiService from '../../services/api'
import Engine from '../../services/engine'
import DatabaseService from '../../services/db'
import Torrent from '../torrents/Torrent'
import filesize from 'filesize'

let player

class Player extends React.Component {
  constructor(props) {
    super(props)

		this.state = {
			torrent: null,
			webTorrentId: null, // This is webtorrent id
			hasOpenedFeedback: false
		}

		this.apiService = new ApiService()
		this.engine = new Engine()
		this.databaseService = new DatabaseService()

		this.handleUpVoteClick = this.handleUpVoteClick.bind(this)
		this.handleDownVoteClick = this.handleDownVoteClick.bind(this)
  }

	componentDidMount() {
		let self = this
		player = videojs('video-player', { 'controls': true, 'autoplay': false, 'preload': 'auto' }, function() {
			self.modal = self.buildFeedbackDialog()

			this.on('timeupdate', () => {
				if(Math.floor(this.currentTime()) == 10 * 60 && !self.state.hasOpenedFeedback){
					self.setState({ hasOpenedFeedback: true })
					self.modal.open()
				}
			})
		})

		console.log("Getting torrent id from props...", this.props.params.torrentId)

		this.serveTorrent(this.props.params.torrentId);

		this.intervalId = setInterval( () => {
			this.watchTorrent()
		}, 1000)
	}

	componentWillUnmount() {
		window.clearInterval(this.intervalId)
	}

	componentWillUpdate(nextProps, nextState) {
		// We now have torrentId in state, let's play a bit
		if(nextState.webTorrentId && this.state.webTorrentId != nextState.webTorrentId) {
			this.playTorrent(nextState.webTorrentId)
		}
	}

	serveTorrent(torrentId) {
		this.apiService.getTorrentById(torrentId).then((torrent) => {
			if(torrent.get('subtitles')) {
				torrent.get('subtitles').forEach((subtitle) => {
					this.addRemoteTextTrack(subtitle)
				})
			}

			this.engine.addMagnet(torrent.get('magnetURL'), ((webtorrent) => {
				torrent.webtorrent = webtorrent
				torrent.name = webtorrent.dn

				this.engine.serve(webtorrent.infoHash)

				this.setState({ webTorrentId: webtorrent.infoHash })
				this.setState({torrent})

				// Add torrent to local database
				this.databaseService.addTorrent(webtorrent).then(() => {
					console.info('NEW TORRENT ADDED')
				})
			}))
		})
	}

	playTorrent(torrentId) {
		let media = this.engine.getMedia(torrentId)
		let torrent = this.engine.getTorrent(torrentId)

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

	watchTorrent() {
		let { torrent } = this.state

		if(!torrent || !torrent.webtorrent) {
			return
		}

		torrent.donwloaded = filesize(torrent.webtorrent.downloaded)
		torrent.uploaded = filesize(torrent.webtorrent.uploaded)
		torrent.downloadSpeed = filesize(torrent.webtorrent.downloadSpeed)
		torrent.uploadSpeed = filesize(torrent.webtorrent.uploadSpeed)
		torrent.progress = Math.floor(torrent.webtorrent.progress * 100)

		this.setState({torrent})
	}

	buildFeedbackDialog() {
		let el = videojs.createEl('ModalDialog', {
			 innerHTML: $('#feedback-dialog').html()
		})

		let modal = player.addChild('ModalDialog', {
			'el': el
		})

		modal.hide()

		$('#btn-upvote').one('click', () => {
			this.handleUpVoteClick()
		})

		$('#btn-downvote').one('click', () => {
			this.handleDownVoteClick()
		})

		return modal
	}

	handleDownVoteClick() {
		this.apiService.sendVoteDown(this.state.torrent.id)
		this.modal.close()
	}

	handleUpVoteClick() {
		this.apiService.sendVoteUp(this.state.torrent.id)
		this.modal.close()
	}

  render() {
		let {torrent} = this.state

    return (
      <div className="m-t-1 container-fluid">
				<div id="player">
					<video id="video-player" className="video-js vjs-default-skin vjs-big-play-centered m-x-auto">
					</video>
				</div>

				<div id="feedback-dialog">
					<div className="feedback-dialog-content">
						<h4>How is the quality of this torrent?</h4>
						<div className="feedback-footer">
							<button id="btn-downvote" type="button" className="btn btn-secondary" data-dismiss="modal">Bad</button>
							<button id="btn-upvote" type="button" className="btn btn-secondary">Good</button>
						</div>
					</div>
				</div>

				{torrent && <Torrent torrent={torrent} />}

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
