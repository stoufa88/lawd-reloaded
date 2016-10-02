import React, { PropTypes } from 'react'

class TorrentRow extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
			<tr>
				<td>{this.props.torrentName}</td>
				<td>Otto</td>
				<td>@mdo</td>
			</tr>
    );
  }
}

export default TorrentRow
