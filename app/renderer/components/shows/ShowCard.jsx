import React from 'react'
import MovieService from '../../services/movies'

let movieService

export default class ShowCard extends React.Component {
  constructor(props) {
    super(props)

		movieService = new MovieService()

		this.state = {
			movie: null
		}
  }

  render() {
		let posterPath = 'http://image.tmdb.org/t/p/w154/' + this.props.poster_path

    return (
			<div className="card movie-item">
				<img className="movie-item-image" src={posterPath} />
				<div className="movie-item-details">
					<h6>{this.props.title}</h6>
					<p className="genres text-muted">{this.props.genres.join(', ')}</p>

					<p className="overview">{this.props.overview}</p>
				</div>
			</div>
    );
  }
}
