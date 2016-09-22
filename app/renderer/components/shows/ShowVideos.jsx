import React, {PropTypes} from 'react'
import { FormattedMessage } from 'react-intl'
import ShowCastItem from './ShowCastItem'

export default class ShowVideos extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
		let videos = []
		this.props.videos.forEach((video, i) => {
			videos.push(
				<div className="video" key={i}>
					<iframe width="560" height="300" src={`https://www.youtube.com/embed/${video.key}`} frameBorder="0"></iframe>
				</div>
			)
		})

    return (
			<div className="show-details-videos m-t-2">
				<h4><FormattedMessage id="show.videos" /></h4>
				<div className="show-details-videos-content">
					{videos}
				</div>
			</div>
    );
  }
}

ShowVideos.propTypes = {
  videos: PropTypes.array.isRequired
}
