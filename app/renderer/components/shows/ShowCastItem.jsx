import React, {PropTypes} from 'react'

export default class ShowCastItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
		let { profile_path, name, character } = this.props.castEntry

		let profilePath = 'http://image.tmdb.org/t/p/w154/' + profile_path

    return (
			<div className="d-inline-block m-r-1">
				<img src={profilePath} className="cast-image"/>
			</div>
    );
  }
}

ShowCastItem.propTypes = {
  castEntry: PropTypes.object.isRequired
}
