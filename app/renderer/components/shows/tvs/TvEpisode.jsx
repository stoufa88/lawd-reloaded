import React, {PropTypes} from 'react'
import {Link} from 'react-router'
import NewMagnetForm from '../../magnets/NewMagnetForm'
import Magnet from '../../magnets/Magnet'
import ApiService from '../../../services/api'

let apiService

class TvEpisode extends React.Component {
	constructor() {
		super()

		this.state = {
			showMagnetForm: false,
			torrents: []
		}

		apiService = new ApiService()

		this.toggleMagnetForm = this.toggleMagnetForm.bind(this)
	}

	componentDidMount() {
		this.fetchTorrents(this.props.id)
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
		let stillPath
		if(this.props.stillPath){
			stillPath = 'http://image.tmdb.org/t/p/w154' + this.props.stillPath
		}

		let name = this.props.name !== "" ? this.props.name : `Episode ${this.props.number}`

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

    return(
			<div className="episode m-b-1 row">
				<div className="episode-header">
					{(() => {
						if (this.props.stillPath) {
							return (
								<img src={stillPath} />
							)
						}
					})()}

					<span>
						<h6>{name}</h6>
						<small>({this.props.airDate})</small>
					</span>
				</div>

				<div className="episode-form m-l-3">
					{(() => {
						if (this.state.showMagnetForm) {
							return (
								<div>
									<i className="fa fa-minus" aria-hidden="true" onClick={this.toggleMagnetForm}></i>
									<NewMagnetForm showId={this.props.id} />
								</div>
							)
						}else {
							return <i className="fa fa-plus" aria-hidden="true" onClick={this.toggleMagnetForm}></i>
						}
					})()}
				</div>

				<div className="m-l-3 episode-magnets">
					{magnets}
				</div>
			</div>
		)
  }
}

TvEpisode.propTypes = {
  id: PropTypes.number.isRequired,
	plot: PropTypes.string,
  stillPath: PropTypes.string,
	name: PropTypes.string.isRequired,
	airDate: PropTypes.string,
	number: PropTypes.number.isRequired
}

export default TvEpisode
