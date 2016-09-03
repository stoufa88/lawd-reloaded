
import React, {PropTypes} from 'react'
import { Link } from 'react-router'

class Torrent extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ul>
				<li><Link to={`/player/${this.props.torrentId}/`}> Magnet {this.props.index + 1}</Link></li>
      </ul>
    );
  }
}

Torrent.propTypes = {
	index: PropTypes.number.isRequired,
	torrentId: PropTypes.string.torrentId,
	magnetURL: PropTypes.string.isRequired
};

export default Torrent