import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { FormattedMessage } from 'react-intl'
import ApiService from '../../../services/api'
import ShowCastBox from '../ShowCastBox'
import Magnet from '../../magnets/Magnet'
import NewMagnetForm from '../../magnets/NewMagnetForm'
import ShowDetails from '../ShowDetails'
import ShowVideos from '../ShowVideos'
import TvSeasonList from './TvSeasonList'

let apiService

export default class TvDetails extends React.Component {
  constructor(props) {
    super(props)

		this.state = {
			tv: null
		}

		apiService = new ApiService()
		this.toggleMagnetForm = this.toggleMagnetForm.bind(this)
  }

	componentDidMount() {
		let { id } = this.props.params
		this.fetchTv(id)
	}

	fetchTv(id) {
		apiService.getTvById(id).then((tv) => {
			console.info('Got the tv from tmdb api', tv)
			// remove season 0, we do not need it
			if(tv.seasons[0].season_number == 0) {
				tv.seasons.shift(0)
			}
			this.setState({ tv })
		})
	}

	toggleMagnetForm() {
		let { showMagnetForm } = this.state
		this.setState({showMagnetForm: !showMagnetForm})
	}

  render() {
		let { tv, torrents } = this.state

		if(!tv) {
			return (<div></div>)
		}

		let posterPath = 'http://image.tmdb.org/t/p/w154/' + tv.poster_path
		let backdropPath = 'http://image.tmdb.org/t/p/w1920/' + tv.backdrop_path
		var tvStyle = {
		  backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.86), rgba(0, 0, 0, 0.85)), url(' + backdropPath + ')',
			backgroundAttachment: 'fixed'
		}

    return (
			<ReactCSSTransitionGroup
        transitionName="example"
        transitionAppear={true}
        transitionAppearTimeout={500}
				transitionEnterTimeout={500}
        transitionLeaveTimeout={300}>
				<div className="container-fluid show p-t-3 p-b-3 p-l-3" style={tvStyle}>
					<ShowDetails
						title={tv.original_name}
						posterPath={posterPath}
						year={tv.first_air_date.slice(0,4)}
						genres={tv.genres}
						overview={tv.overview}
						voteAverage={tv.vote_average}
						popularity={tv.popularity}
						credits={tv.credits} />

					<TvSeasonList seasons={tv.seasons} tvId={tv.id}/>

					{(() => {
						if (tv.videos.results.length > 0) {
							return (
								<ShowVideos videos={tv.videos.results} />
							)
						}
					})()}
				</div>
			</ReactCSSTransitionGroup>
    );
  }
}

// <i className="fa fa-plus" aria-hidden="true" onClick={this.showForm}></i>
