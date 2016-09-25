import React, {PropTypes} from 'react'
import { FormattedMessage } from 'react-intl'
import ShowCastBox from './ShowCastBox'

class ShowDetails extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
			<div className="row">
				<div className="col-sm-2">
					<img className="show-item-image" src={this.props.posterPath} />
					<p className="show-note m-t-2 tag tag-info"><i className="fa fa-star p-r-1"></i>{this.props.voteAverage}</p>
				</div>
				<div className="col-sm-8 offset-sm-1">
					<h1>
						{this.props.title} ({this.props.year})
					</h1>
					<p>{this.props.genres.map((g) => g['name']).join(', ')}</p>
					
					{(() => {
						if (this.props.overview) {
							return (
								<p>
									<strong><FormattedMessage id="show.synopsys" /></strong><br/>
									{this.props.overview}
								</p>
							)
						}
					})()}

					<div className="text-xs-center m-t-1">
						{(() => {
							if (this.props.credits.cast && this.props.credits.cast.length > 0) {
								return (
									<ShowCastBox cast={this.props.credits.cast} />
								)
							}
						})()}
					</div>
				</div>
			</div>
    );
  }
}

ShowDetails.propTypes = {
  title: PropTypes.string.isRequired,
	posterPath: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  overview: PropTypes.string,
  genres: PropTypes.array.isRequired,
  credits: PropTypes.object.isRequired
}

export default ShowDetails

// <p className="show-popularity text-xs-center m-t-2">{Math.floor(this.props.popularity)} %</p>
