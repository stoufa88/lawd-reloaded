
import React, {PropTypes} from 'react'
import ApiService from '../../services/api'

let apiService

class NewSubtitleForm extends React.Component {

  constructor(props) {
    super(props)

		this.state = {
			subtitleFile: null,
			subtitleLang: null
		}
  }


  render() {
    return (
      <div className="new-subtitle">
				<div className="form-group">
			    <input type="file" className="form-control-file" id="subInput" onChange={this.props.handleSubFileChange}/>
		  	</div>

				<div className="form-group">
					<label htmlFor="selectQuality">Subtitle language</label>
					<select className="form-control form-control-sm" id="selectQuality" onChange={this.props.handleSubLanguageChange}>
						<option>French</option>
						<option>English</option>
						<option>Arabic</option>
					</select>
				</div>
			</div>
    );
  }
}

// NewSubtitleForm.propTypes = {
// 	movieId: PropTypes.number.isRequired
// };

export default NewSubtitleForm
