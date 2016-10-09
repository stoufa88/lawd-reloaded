import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { FormattedMessage } from 'react-intl'
import ApiService from '../../../services/api'
import Magnet from '../../magnets/Magnet'
import NewMagnetForm from '../../magnets/NewMagnetForm'
import ShowDetails from '../ShowDetails'
import ShowVideos from '../ShowVideos'

let apiService

export default class MovieDetails extends React.Component {
  constructor(props) {
    super(props)

		this.state = {
			movie: null,
			torrents: [],
			showMagnetForm: false
		}

		apiService = new ApiService()
		this.toggleMagnetForm = this.toggleMagnetForm.bind(this)
  }

	componentWillMount() {
		let { id } = this.props.params
		this.fetchMovie(id)
		this.fetchTorrents(id)
	}

	fetchMovie(id) {
		apiService.getMovieById(id).then((movie) => {
			console.info('Got the movie from tmdb api', movie)
			this.setState({ movie })
		})
	}

	fetchTorrents(id) {
		apiService.fetchTorrentsForShow(parseInt(id)).then((res) => {
			this.setState({ torrents: res })
		})
	}

	toggleMagnetForm() {
		let { showMagnetForm } = this.state
		this.setState({showMagnetForm: !showMagnetForm})
	}

  render() {
		let { movie, torrents } = this.state

		if(!movie) {
			return (<div></div>)
		}

		let magnets = []
		if(torrents.length > 0) {
			torrents.forEach((torrent, index) => {
				magnets.push(
					<Magnet key={torrent.id}
									torrent={torrent}/>
				)
			})
		}else {
			magnets = <p className="torrents-list-empty"><FormattedMessage id="show.torrents_empty" /></p>
		}

		let posterPath = 'http://image.tmdb.org/t/p/w154/' + movie.poster_path
		let backdropPath = 'http://image.tmdb.org/t/p/w1920/' + movie.backdrop_path
		var movieStyle = {
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
				<div className="container-fluid show-details-overview p-t-3 p-l-3 p-b-3" style={movieStyle}>
					<ShowDetails
						title={movie.title}
						posterPath={posterPath}
						year={movie.release_date.slice(0,4)}
						genres={movie.genres}
						overview={movie.overview}
						voteAverage={movie.vote_average}
						popularity={movie.popularity}
						credits={movie.credits} />

					{(() => {
						if (movie.videos.results.length > 0) {
							return (
								<ShowVideos videos={movie.videos.results} />
							)
						}
					})()}
				</div>

				<div className="container-fluid show-details-torrents">
					<div className="row">
						<div className="col-sm-6 show-details-torrents-links">
							<h4>Available links</h4>
							<ul className="list-group">
								{magnets}
							</ul>
						</div>

						<div className="col-sm-6 show-details-torrents-new">
							<h4>Add new</h4>
							<NewMagnetForm showId={movie.id} />
						</div>
					</div>
				</div>
			</ReactCSSTransitionGroup>
    );
  }
}

// <div className="col-sm-4 magnets">
// 	<h3 className="text-sm-center">Liens</h3>
// 	<ul className="movie-details-magnet">
// 		{magnets}
// 	</ul>
//
// 	{(() => {
// 		if (this.state.showMagnetForm) {
// 			return (
// 				<div>
// 					<i className="fa fa-minus" aria-hidden="true" onClick={this.toggleMagnetForm}></i>
// 					<NewMagnetForm movieId={movie.id} />
// 				</div>
// 			)
// 		}else {
// 			return <i className="fa fa-plus" aria-hidden="true" onClick={this.toggleMagnetForm}></i>
// 		}
// 	})()}
// </div>
