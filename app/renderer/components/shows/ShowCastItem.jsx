import React, {PropTypes} from 'react'
import Avatar from './Avatar'

export default class ShowCastItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
		let { profile_path, name, character } = this.props.castEntry


		let avatar
		if(profile_path) {
			let profilePath = 'http://image.tmdb.org/t/p/w154/' + profile_path
			avatar = <img src={profilePath} className="cast-item__image"/>
		}else {
			avatar = <Avatar name={name} />
		}

    return (
			<div className="d-inline-block m-r-1 cast-item">
				{avatar}
				<p className="cast-item__name"><strong>{this.props.castEntry.name}</strong> <br/>
					as {this.props.castEntry.character}
				</p>
			</div>
    );
  }
}

ShowCastItem.propTypes = {
  castEntry: PropTypes.object.isRequired
}
