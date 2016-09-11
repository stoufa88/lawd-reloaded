
import React, {PropTypes} from 'react'
import { Link } from 'react-router'

class Magnet extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ul className="movie-details-magnet">
				<li>
					<Link to={`/player/${this.props.torrentId}/`}>
						<div className="d-inline-block">
							{this.props.lang} - {this.props.quality}
						</div>
						<p>{this.props.name}</p>
					</Link>
				</li>
      </ul>
    );
  }
}

Magnet.propTypes = {
	index: PropTypes.number.isRequired,
	torrentId: PropTypes.string.isRequired,
	magnetURL: PropTypes.string.isRequired,
	lang: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	quality: PropTypes.string.isRequired
};

export default Magnet
