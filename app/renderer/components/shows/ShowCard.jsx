import React from 'react'
import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'
import ApiService from '../../services/api'
import RequestButton from './RequestButton'
import Magnet from '../magnets/Magnet'

let apiService

export default class ShowCard extends React.Component {
  constructor(props) {
    super(props)

		this.state = {
			torrents: [],
			torrentLanguages: [],
			subtitleLanguages: []
		}

		apiService = new ApiService()
  }

	componentDidMount() {
		this.fetchTorrents(this.props.id)
	}

	fetchTorrents(showId) {
		apiService.fetchTorrentsForShow(showId).then((torrents) => {
			this.countLanguages(torrents)
			this.setState({ torrents })
		})
	}

	countLanguages(torrents) {
		let torrentLanguages = []
		let subtitleLanguages = []
		torrents.forEach((torrent) => {
			torrentLanguages.push(torrent.get('lang'))
			torrent.get('subtitles').forEach((subtitle) => {
				subtitleLanguages.push(subtitle.get('lang'))
			})
		})

		this.setState({torrentLanguages})
		this.setState({subtitleLanguages})
	}

	handleRequestClick(lang) {
		let { id, title} = this.props
		apiService.sendRequest(id, title, lang)
	}

  render() {
		let posterPath = 'http://image.tmdb.org/t/p/w154/' + this.props.poster_path

		let languages
		if(this.state.torrentLanguages.length > 0) {
			languages = (
				<div>
					<i className="fa fa-language p-r-1" aria-hidden="true"></i>
					<span>{this.state.torrentLanguages.join(', ')}</span>
				</div>
			)
		}

		let subtitles
		if(this.state.subtitleLanguages.length > 0) {
			subtitles = (
				<div>
					<i className="fa fa-comment p-r-1" aria-hidden="true"></i>
					<span>{this.state.subtitleLanguages.join(', ')}</span>
				</div>
			)
		}

		let movieLanguages
		if(languages) {
			movieLanguages = (
				<div>
					{languages}
					{subtitles}
				</div>
			)
		}

    return (
			<div className="card movie-item m-b-1">
				<img className="movie-item-image" src={posterPath} />
				<div className="movie-item-details">
					<Link to={`${this.props.routeBase}/${this.props.id}`} className="text-uppercase">
						<h6>{this.props.title}</h6>
					</Link>

					<p className="genres text-muted">{this.props.genres.join(', ')}</p>

					<p className="overview">{this.props.overview}</p>

					<div className="movie-item-footer">
						<div className="pull-xs-left">
							{movieLanguages}
						</div>

						<RequestButton id={this.props.id} title={this.props.title}/>
					</div>
				</div>
			</div>
    );
  }
}
