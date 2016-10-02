import React, { PropTypes } from 'react'
import TorrentRow from './TorrentRow'
import DatabaseService from '../../services/db'

class TorrentList extends React.Component {
  constructor(props) {
    super(props)

		this.state = {
			torrents: []
		}

		this.databaseService = new DatabaseService()
  }

	componentWillMount() {
		this.databaseService.getTorrents().then((torrents) => {
			this.setState({torrents})
		})
	}

  render() {
		let torrents = []
		this.state.torrents.map((torrent, i) => {
			torrents.push(<TorrentRow key={i} torrentName={torrent.name}/>)
		})

    return (
      <div className="m-t-1 container torrent-list">
				<table className="table table-inverse">
					<tbody>
						{torrents}
					</tbody>
				</table>
      </div>
    );
  }
}

export default TorrentList
