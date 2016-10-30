import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { FormattedMessage } from 'react-intl'
import update from 'react-addons-update'
import ApiService from '../../../services/api'
import YTSProvider from '../../../services/providers/yts'
import Magnet from '../../magnets/Magnet'
import NewMagnetForm from '../../magnets/NewMagnetForm'
import ShowDetails from '../ShowDetails'
import ShowVideos from '../ShowVideos'

export default class MovieDetails extends React.Component {
  constructor(props) {
    super(props)

		this.state = {
			movie: null,
			torrents: []
		}

		this.handleAddTorrent = this.handleAddTorrent.bind(this)
		this.apiService = new ApiService()
		this.ytsProvider = new YTSProvider()
  }

	componentWillMount() {
		let { id } = this.props.params
		this.fetchMovie(id)
		this.fetchTorrents(id)
	}

	fetchMovie(id) {
		this.apiService.getMovieById(id).then((movie) => {
			console.info('Got the movie from tmdb api', movie)
			this.setState({ movie })

			this.fetchExternalTorrents(movie.imdb_id, movie.original_title)
		})
	}

	fetchTorrents(id) {
		this.apiService.fetchTorrentsForShow(parseInt(id)).then((res) => {
			if(res && res.length > 0) {
				this.setState({ torrents: res })
			}
		})
	}

	fetchExternalTorrents(imdbCode, movieName) {
		this.ytsProvider.getMovieTorrents(imdbCode).then((res) => {
			if(res.data.movies && res.data.movies.length === 1) {
				let tors = res.data.movies[0].torrents

				tors = tors.map((t, index) => {
					return {
						quality: t.quality,
						magnetURL: this.ytsProvider.getMagnet(t.hash),
						name: `${movieName}-${t.quality} [YTS.AG]`
					}
				})

				let torrents = update(this.state.torrents, {$unshift: [...tors]})
				this.setState({ torrents })
			}
		})
	}

	handleAddTorrent(showId, torrent, subtitles) {
		this.apiService.addTorrent(showId, torrent, subtitles, (torrent) => {
			let torrents = update(this.state.torrents, {$unshift: [torrent]})
			this.setState({ torrents })
		})
	}

  render() {
		let { movie, torrents } = this.state

		if(!movie) {
			return (<div></div>)
		}

		let magnets = []
		if(torrents.length > 0) {
			torrents.forEach((torrent, index) => {
				if(torrent.id) {
					torrent = torrent.toJSON()
				}

				magnets.push(
					<Magnet key={index}
									torrent={torrent} />
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
							<NewMagnetForm showId={movie.id} addTorrent={this.handleAddTorrent}/>
						</div>
					</div>
				</div>
			</ReactCSSTransitionGroup>
    );
  }
}
