import React, {PropTypes} from 'react'

class TvEpisode extends React.Component {
	constructor() {
		super()
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(nextProps.id != this.props.id) {
			return true
		}else {
			return false
		}
	}

  render() {
		let posterPath = 'http://image.tmdb.org/t/p/w154/' + this.props.stillPath

    return(
			<div className="episode">
				<h3>{this.props.name}</h3>
				<p>{this.props.plot}</p>
			</div>
		)
  }
}

TvEpisode.propTypes = {
  id: PropTypes.number.isRequired,
	plot: PropTypes.string,
  stillPath: PropTypes.string,
	name: PropTypes.string.isRequired
}

export default TvEpisode
