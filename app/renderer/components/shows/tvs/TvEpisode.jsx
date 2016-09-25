import React, {PropTypes} from 'react'
import { FormattedMessage } from 'react-intl'
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
			stillPath = 'http://image.tmdb.org/t/p/w500' + this.props.stillPath
		}

		let name = this.props.name !== "" ? this.props.name : `Episode ${this.props.number}`

		let magnets = []
		if(this.state.torrents.length > 0) {
			this.state.torrents.forEach((torrent, index) => {
				magnets.push(
					<Magnet key={torrent.id}
									torrent={torrent}/>
				)
			})
		}else {
			magnets = <p className="torrents-list-empty"><FormattedMessage id="show.torrents_empty" /></p>
		}


    return(
			<div className="card episode">
				{(() => {
					if (this.props.stillPath) {
						return (
							<img src={stillPath} className="card-img-top"/>
						)
					}
				})()}
			  <div className="card-img-overlay">
			    <h4 className="card-title">{name}</h4>
			    <p className="card-text">{this.props.airDate}</p>
			  </div>

				<ul className="nav nav-tabs" role="tablist">
				  <li className="nav-item">
				    <a className="nav-link active" data-toggle="tab" href={`#links-${this.props.id}`} role="tab">Links</a>
				  </li>
				  <li className="nav-item">
				    <a className="nav-link" data-toggle="tab" href={`#add-${this.props.id}`} role="tab">Add</a>
				  </li>
				</ul>
				<div className="tab-content">
				  <div className="tab-pane active" id={`links-${this.props.id}`} role="tabpanel">
						<ul className="list-group list-group-flush">
							{magnets}
						</ul>
					</div>
				  <div className="tab-pane" id={`add-${this.props.id}`} role="tabpanel">
						<div className="p-t-1 p-b-1 p-l-1 p-r-1">
							<NewMagnetForm showId={this.props.id} />
						</div>
					</div>
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

// <div className="episode-form m-l-3">
// 	{(() => {
// 		if (this.state.showMagnetForm) {
// 			return (
// 				<div>
// 					<i className="fa fa-minus" aria-hidden="true" onClick={this.toggleMagnetForm}></i>
// 					<NewMagnetForm showId={this.props.id} />
// 				</div>
// 			)
// 		}else {
// 			return <i className="fa fa-plus" aria-hidden="true" onClick={this.toggleMagnetForm}></i>
// 		}
// 	})()}
// </div>
