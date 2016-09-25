import React, {PropTypes} from 'react'

export default class Avatar extends React.Component {
  constructor(props) {
    super(props)
  }

	componentDidMount() {
		let nameSplit = this.props.name.split(" ")
    let initials = nameSplit[0].charAt(0).toUpperCase() + nameSplit[1].charAt(0).toUpperCase()

		var canvas = document.getElementById(`cast-icon-${this.props.name}`)
		var context = canvas.getContext("2d")

		var centerX = canvas.width / 2
    var centerY = canvas.height / 2
    var radius = 30

		context.beginPath()
		context.arc(centerX, centerY, radius, 0, Math.PI * 2, false)
		context.strokeStyle = "#fff"
		context.stroke()
		context.closePath()
		context.font = "28px Baufra";
		context.textAlign = "center";
		context.fillStyle = "#FFF";
		context.fillText(initials, 35, 45);
	}

  render() {
    return (
			<canvas id={`cast-icon-${this.props.name}`} width="70" height="70"></canvas>
    );
  }
}

Avatar.propTypes = {
  name: PropTypes.string.isRequired
}
