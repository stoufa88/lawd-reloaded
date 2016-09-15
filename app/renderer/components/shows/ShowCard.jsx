import React from 'react'
import { Link } from 'react-router'
import ApiService from '../../services/api'
import Magnet from '../magnets//Magnet'

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

	fetchTorrents(movieId) {
		apiService.fetchTorrentsForMovie(movieId).then((torrents) => {
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

		let movieFooter
		if(languages) {
			movieFooter = (
				<div className="movie-item-footer">
					{languages}
					{subtitles}
				</div>
			)
		}

    return (
			<div className="card movie-item m-b-1">
				<img className="movie-item-image" src={posterPath} />
				<div className="movie-item-details">
					<Link to={`movie/${this.props.id}`} className="text-uppercase">
						<h6>{this.props.title}</h6>
					</Link>
					<p className="genres text-muted">{this.props.genres.join(', ')}</p>

					<p className="overview">{this.props.overview}</p>

					{movieFooter}
				</div>
			</div>
    );
  }
}

// <div>
// 	<i className="fa fa-plus" aria-hidden="true" onClick={this.showInput}></i>
// 	<input className="form-control" ref={(c) => this._input = c}
// 		onKeyUp={this.submitMagnet}
// 		type="url"
// 		className="invisible"
// 		placeholder="paste magnet url here"
// 		 />
// </div>

// <div className="panel panel-default">
// 	<div className="panel-heading" role="tab" id="headingOne">
// 		<h4 className="panel-title">
// 			<a data-toggle="collapse" data-parent="#accordion" href={`#col-${this.props.id}`} aria-expanded="true" aria-controls={this.props.id}>
// 				Magnets
// 			</a>
// 		</h4>
// 	</div>
// 	<div id={`col-${this.props.id}`} className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
// 		{magnets}
// 	</div>
// </div>
