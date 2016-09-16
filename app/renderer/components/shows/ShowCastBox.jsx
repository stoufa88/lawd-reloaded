import React, {PropTypes} from 'react'
import ShowCastItem from './ShowCastItem'

export default class ShowCastBox extends React.Component {
  constructor(props) {
    super(props)

		this.state = {
			limit: 5
		}
  }

  render() {
		let cast = []
		this.props.cast.slice(0, this.state.limit).map((castEntry, i) => {
			cast.push(
				<ShowCastItem castEntry={castEntry} key={i}/>
			)
		})

    return (
			<div>
				{cast}
			</div>
    );
  }
}

ShowCastBox.propTypes = {
  cast: PropTypes.array.isRequired
}
