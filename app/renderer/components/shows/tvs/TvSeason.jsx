import React, {PropTypes} from 'react'
import { FormattedMessage } from 'react-intl'
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

    return(
			<div className="tab-pane p-t-1" id={`season-${season.id}`} role="tabpanel">
				<div className="row">
					<div className="col-sm-2">
						<img src={posterPath} />
					</div>
					<div className="col-sm-9 offset-sm-1">
						<div className="row">
							<p className="lead">Date de diffusion: {season.air_date}</p>
						</div>
						<div className="row">
							<p>{season.overview}</p>
						</div>
					</div>
				</div>

				<h4 className="m-t-2"><FormattedMessage id="show.episodes" /></h4>
				{episodes}
			</div>
		)
  }
}

TvSeason.propTypes = {
  tvId: PropTypes.number.isRequired,
	number: PropTypes.number.isRequired
}

export default TvSeason
