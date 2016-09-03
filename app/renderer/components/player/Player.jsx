
import React, { PropTypes } from 'react'
import videojs from 'video.js'

class Player extends React.Component {
  constructor(props) {
    super(props)
  }

	componentDidMount() {
		let player = videojs('video-player', { 'controls': true, 'autoplay': false, 'preload': 'auto' })
		console.log(this.props.params.torrentId)
	}

  render() {
    return (
      <div>
			<div id="player">
				<video id="video-player" className="video-js vjs-default-skin vjs-big-play-centered">
				</video>
			</div>
      </div>
    );
  }
}

Player.propTypes = {
	params: PropTypes.shape({
		torrentId: PropTypes.string.isRequired
	})
};

export default Player
