import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { FormattedMessage } from 'react-intl'
import ApiService from '../../services/api'
import ShowCastBox from './ShowCastBox'
import Magnet from '../magnets/Magnet'
import NewMagnetForm from '../magnets/NewMagnetForm'

let apiService

export default class ShowDetails extends React.Component {
  constructor(props) {
    super(props)

		this.state = {
			movie: null,
			trailer_url: null,
			credits: [],
			torrents: [],
			showMagnetForm: false
		}

		apiService = new ApiService()
		this.toggleMagnetForm = this.toggleMagnetForm.bind(this)
  }

	componentDidMount() {
		let { id } = this.props.params
		this.fetchMovie(id)
		this.fetchCredits(id)
		this.fetchTorrents(id)
	}

	fetchMovie(id) {
		apiService.getMovieById(id).then((movie) => {
			console.info('Got the movie from tmdb api', movie)
			this.setState({ movie })
		})
	}

	fetchCredits(id) {
		apiService.getMovieCredits(id).then((credits) => {
			console.info('Got the movie cast', credits.cast)
			this.setState({ credits })
		})
	}

	fetchTorrents(id) {
		console.log(id)
		apiService.fetchTorrentsForMovie(parseInt(id)).then((res) => {
			this.setState({ torrents: res })
		})
	}

	toggleMagnetForm() {
		let { showMagnetForm } = this.state
		this.setState({showMagnetForm: !showMagnetForm})
	}

  render() {
		let { movie } = this.state

		if(!movie) {
			return (<div></div>)
		}

		let posterPath = 'http://image.tmdb.org/t/p/w154/' + movie.poster_path
		let backdropPath = 'http://image.tmdb.org/t/p/w1920/' + movie.backdrop_path

		var movieStyle = {
		  backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.86), rgba(0, 0, 0, 0.85)), url(' + backdropPath + ')',
			backgroundAttachment: 'fixed'
		};

		let magnets = []
		this.state.torrents.forEach((torrent, index) => {
			magnets.push(
				<Magnet key={torrent.id}
								magnetURL={torrent.get('magnetURL')}
								lang={torrent.get('lang')}
								name={torrent.get('name')}
								quality={torrent.get('quality')}
								index={index}
								torrentId={torrent.id} />
			)
		})

    return (
			<ReactCSSTransitionGroup
        transitionName="example"
        transitionAppear={true}
        transitionAppearTimeout={500}
				transitionEnterTimeout={500}
        transitionLeaveTimeout={300}>
				<div className="container-fluid movie movie-details p-t-3 p-b-3" style={movieStyle}>
					<div className="row">
						<div className="col-sm-2">
							<img className="movie-item-image" src={posterPath} />
						</div>
						<div className="col-sm-6">
							<h1>
								{movie.title} ({movie.release_date.slice(0, 4)})
							</h1>
							<p>{movie.genres.map((g) => g['name']).join(', ')}</p>
							<p>
								<strong><FormattedMessage id="movie.synopsys" /></strong><br/>
								{movie.overview}
							</p>
							<p>
								<i className="fa fa-play m-r-1"></i>
								<FormattedMessage id="movie.watch_trailer" />
							</p>

							<div className="d-inline-block">
								<p className="movie-popularity text-xs-center">{Math.floor(movie.popularity)} %</p>
							</div>
							<div className="d-inline-block">
								<p className="movie-note m-l-3 tag tag-info"><i className="fa fa-star"></i>{movie.vote_average}</p>
							</div>

							<div className="text-xs-center m-t-1">
								{(() => {
									if (this.state.credits.cast && this.state.credits.cast.length > 0) {
										return (
											<ShowCastBox cast={this.state.credits.cast} />
										)
									}
								})()}
							</div>
						</div>
						<div className="col-sm-4">
							<h3 className="text-sm-center">Liens</h3>
							<ul className="movie-details-magnet">
								{magnets}
							</ul>

							{(() => {
				        if (this.state.showMagnetForm) {
				          return (
										<div>
											<i className="fa fa-minus" aria-hidden="true" onClick={this.toggleMagnetForm}></i>
											<NewMagnetForm movieId={movie.id} />
										</div>
									)
				        }else {
									return <i className="fa fa-plus" aria-hidden="true" onClick={this.toggleMagnetForm}></i>
								}
				      })()}
						</div>
					</div>
				</div>
			</ReactCSSTransitionGroup>
    );
  }
}

// <i className="fa fa-plus" aria-hidden="true" onClick={this.showForm}></i>
