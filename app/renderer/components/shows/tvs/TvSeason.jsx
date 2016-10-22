import React, {PropTypes} from 'react'
import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'
import ApiService from '../../../services/api'
import TvEpisode from './TvEpisode'

let apiService

class TvSeason extends React.Component {
	constructor() {
		super()

		this.state = {
			season: null
		}

		apiService = new ApiService()
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(nextState.season) {
			return true
		}else {
			return false
		}
	}

	componentDidMount() {
		apiService.getTvSeason(this.props.tvId, this.props.number).then((season) => {
			this.setState({ season })
		})
	}

  render() {
		let {season} = this.state

		if(!season) {
			return <div></div>
		}

		let posterPath = 'http://image.tmdb.org/t/p/w154/' + season.poster_path

		let episodes = []

		if(this.props.active) {
			season.episodes.forEach((episode, index) => {
				episodes.push(
					<TvEpisode
						key={episode.id}
						id={episode.id}
						plot={episode.plot}
						stillPath={episode.still_path}
						name={episode.name}
						airDate={episode.air_date}
						number={index+1} />
				)
			})
		}

		let tabClasses = classNames({
			"tab-pane p-t-1": true,
			"active": this.props.active
		})

    return(
			<div className={tabClasses} id={`season-${season.id}`} role="tabpanel">
				<div className="row">
					<div className="col-sm-2">
						<img src={posterPath} />
					</div>
					<div className="col-sm-6 offset-sm-1">
						<div className="row">
							<p className="lead">Date de diffusion: {season.air_date}</p>
						</div>
						<div className="row season-overview">
							<p>{season.overview}</p>
						</div>
					</div>
				</div>

				<h4 className="m-t-2"><FormattedMessage id="show.episodes" /></h4>
				<div className="card-deck episode-list">
					{episodes}
				</div>
			</div>
		)
  }
}

TvSeason.propTypes = {
  tvId: PropTypes.number.isRequired,
	number: PropTypes.number.isRequired,
	active: PropTypes.bool
}

export default TvSeason
