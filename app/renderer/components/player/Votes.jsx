import React, {PropTypes} from 'react'
import ApiService from '../../services/api'

let apiService

class Votes extends React.Component {

  constructor(props) {
    super(props)

		apiService = new ApiService()

		this.handleUpVoteClick = this.handleUpVoteClick.bind(this)
		this.handleDownVoteClick = this.handleDownVoteClick.bind(this)

		this.state = {
			upVotes: 0,
			downVotes: 0,
			upVoted: false,
			downVoted: false
		}
  }

	componentWillReceiveProps(nextProps, nextState) {
		if(nextProps.torrent) {
			this.setState({upVotes: nextProps.torrent.get('upVotes')})
			this.setState({downVotes: nextProps.torrent.get('downVotes')})
		}
	}

	handleUpVoteClick() {
		let {upVoted, downVoted, upVotes, downVotes} = this.state
		if(!upVoted) {
			this.upVote(false)
			this.setState({upVoted: true})
			this.setState({upVotes: upVotes + 1})

			if(downVoted) {
				this.downVote(true)
				this.setState({downVoted: false})
				this.setState({downVotes: downVotes - 1})
			}
		}
	}

	handleDownVoteClick() {
		let {upVoted, downVoted, upVotes, downVotes} = this.state
		if(!downVoted) {
			this.downVote(false)
			this.setState({downVoted: true})
			this.setState({downVotes: downVotes + 1})

			if(upVoted) {
				this.upVote(true)
				this.setState({upVoted: false})
				this.setState({upVotes: upVotes - 1})
			}
		}
	}

	downVote(reverse) {
		apiService.sendVoteDown(this.props.torrent.id, reverse)
	}

	upVote(reverse) {
		apiService.sendVoteUp(this.props.torrent.id, reverse)
	}

  render() {
    return (
			<div>
				<i className="fa fa-thumbs-o-up" aria-hidden="true" onClick={this.handleUpVoteClick}>
					<div>{this.state.upVotes}</div>
				</i>
				<i className="fa fa-thumbs-o-down m-l-1" aria-hidden="true" onClick={this.handleDownVoteClick}>
					<div>{this.state.downVotes}</div>
				</i>
			</div>
    );
  }
}

Votes.propTypes = {
	torrent: PropTypes.object
};

export default Votes
