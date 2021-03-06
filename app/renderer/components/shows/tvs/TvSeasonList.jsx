import React, {PropTypes} from 'react'
import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'
import TvSeason from './TvSeason'

class TvSeasonList extends React.Component {
	constructor() {
		super()

		this.state = {
			currentSeason: 0
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(nextProps.seasons.length > 0) {
			return true
		}else {
			return false
		}
	}

	handleTabClick(index) {
		console.info(index)
		this.setState({currentSeason: index})
	}

  render() {
		let seasonsHeader = []
		let seasonsContent = []

		this.props.seasons.forEach((season, i) => {
			let tabClasses = classNames({
				"nav-link": true,
				"active": i == this.state.currentSeason
			})

			seasonsHeader.push(
				<li className="nav-item" key={season.id}>
					<a className={tabClasses} href={`#season-${season.id}`} data-toggle="tab" onClick={this.handleTabClick.bind(this, i)}>
						<FormattedMessage id="show.season" /> {season.season_number}
					</a>
				</li>
			)

			seasonsContent.push(
				<TvSeason
					key={season.id}
					tvId={this.props.tvId}
					number={season.season_number}
					active={i == this.state.currentSeason}/>
				)
		})

    return(
			<div className="show-details-seasons-content m-t-3" role="tablist">
				<h4><FormattedMessage id="show.seasons" /></h4>

				<ul className="nav nav-tabs">
					{seasonsHeader}
				</ul>

				<div className="tab-content">
					{seasonsContent}
				</div>
			</div>
		)
  }
}

TvSeasonList.propTypes = {
	tvId: PropTypes.number.isRequired,
  seasons: PropTypes.array.isRequired
}

export default TvSeasonList
