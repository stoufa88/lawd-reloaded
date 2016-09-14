import React from 'react'
import { Link } from 'react-router'
import ApiService from '../../services/api'
import Magnet from '../magnets//Magnet'

let apiService

export default class ShowCard extends React.Component {
  constructor(props) {
    super(props)

		this.state = {
			torrents: []
		}

		apiService = new ApiService()

		this.showInput = this.showInput.bind(this)
		this.submitMagnet = this.submitMagnet.bind(this)
  }

	componentDidMount() {
		this.fetchTorrents(this.props.id)
	}

	showInput() {
		$(this._input).toggleClass('invisible')
	}

	submitMagnet(e) {
		if(e.keyCode == 13) {
			apiService.addTorrent($(this._input).val(), this.props.id)
			$(this._input).toggleClass('invisible')
		}
	}

	fetchTorrents(movieId) {
		apiService.fetchTorrentsForMovie(movieId).then((res) => {
			this.setState({ torrents: res })
		})
	}

  render() {
		let posterPath = 'http://image.tmdb.org/t/p/w154/' + this.props.poster_path

		// let magnets = []
		//
		// this.state.torrents.forEach((torrent, index) => {
		// 	magnets.push(
		// 		<Magnet key={torrent.id}
		// 						magnetURL={torrent.get('magnetURL')}
		// 						index={index}
		// 						torrentId={torrent.id} />
		// 	)
		// })

    return (
			<div className="card movie-item m-b-1">
				<img className="movie-item-image" src={posterPath} />
				<div className="movie-item-details">
					<h6>{this.props.title}</h6>
					<p className="genres text-muted">{this.props.genres.join(', ')}</p>

					<p className="overview">{this.props.overview}</p>

					<div className="movie-item-link">
						<Link to={`movie/${this.props.id}`} className="text-uppercase">Details</Link>
					</div>
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
