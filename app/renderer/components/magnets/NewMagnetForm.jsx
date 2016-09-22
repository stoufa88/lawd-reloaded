
import React, {PropTypes} from 'react'
import update from 'react-addons-update'
import NewSubtitleForm from './NewSubtitleForm.jsx'
import ApiService from '../../services/api'

let apiService

class NewMagnetForm extends React.Component {

  constructor(props) {
    super(props)

		this.state = {
			magnetUrl: '',
			language: 'English',
			quality: 'Standard',
			subtitles: [
				{
					file: null,
					lang: 'French'
				}
			]
			// subtitleFile: '',
			// subtitleLang: ''
		}

		apiService = new ApiService()

		this.handleMagnetUrlChange = this.handleMagnetUrlChange.bind(this)
		this.handleLanguageChange = this.handleLanguageChange.bind(this)
		this.handleQualityChange = this.handleQualityChange.bind(this)
		this.handleAddSubtitleClick = this.handleAddSubtitleClick.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
  }

	handleMagnetUrlChange(e) {
		this.setState({magnetUrl: e.target.value})
	}

	handleLanguageChange(e) {
		this.setState({language: e.target.value})
	}

	handleQualityChange(e) {
		this.setState({quality: e.target.value})
	}

	handleSubFileChange(index, e) {
		let subtitles = update(this.state.subtitles, {[index]: {file: {$set: e.target.files[0]}}})
		this.setState({subtitles})
	}

	handleSubLanguageChange(index, e) {
		let subtitles = update(this.state.subtitles, {[index]: {lang: {$set: e.target.value}}})
		this.setState({subtitles})
	}

	handleAddSubtitleClick(e) {
		e.preventDefault()
		let newSub = {
			file: null,
			lang: 'French'
		}

		let subtitles = update(this.state.subtitles, {$push: [newSub]})
		this.setState({subtitles})
	}

	handleSubmit(e) {
		e.preventDefault()
		let { magnetUrl, language, quality, subtitles } = this.state
		let { showId } = this.props
		let torrentName = this.extractTorrentName(magnetUrl)

		console.log(subtitles)

		let torrent =  { magnetUrl, torrentName, language, quality }
		apiService.addTorrent(showId, torrent, subtitles)
	}

	extractTorrentName(magnetUrl) {
		let indexDn = magnetUrl.indexOf('&dn')
		let indexTr = magnetUrl.indexOf('&tr')
		return magnetUrl.slice(indexDn + 4, indexTr)
	}

  render() {
		let subtitles = []
		this.state.subtitles.map((s, i) => {
			subtitles.push(
				<NewSubtitleForm
						key={i}
						handleSubFileChange={this.handleSubFileChange.bind(this, i)}
						handleSubLanguageChange={this.handleSubLanguageChange.bind(this, i)}/>
			)
		})

    return (
      <form onSubmit={this.handleSubmit} >
				<div className="form-group">
					<label htmlFor="magnetUrl">Magnet link</label>
					<input 	id="magnetUrl"
									className="form-control form-control-sm"
									type="text"
									placeholder="paste magnet url here"
									value={this.state.magnetUrl}
									onChange={this.handleMagnetUrlChange}
									required />
				</div>

				<div className="row">
				  <div className="col-xs-6">
						<div className="form-group">
							<label htmlFor="selectLanguage">Torrent language</label>
							<select className="form-control form-control-sm" id="selectLanguage" onChange={this.handleLanguageChange}>
								<option>English</option>
								<option>French</option>
								<option>Arabic</option>
							</select>
						</div>
				  </div>
				  <div className="col-xs-6">
						<div className="form-group">
							<label htmlFor="selectQuality">Torrent video quality</label>
							<select className="form-control form-control-sm" id="selectQuality" onChange={this.handleQualityChange}>
								<option>Standard</option>
								<option>720p</option>
								<option>1080p</option>
							</select>
						</div>
				  </div>
				</div>

				{subtitles}

				<button onClick={this.handleAddSubtitleClick}>add subtitle</button>

				<div className="m-t-1">
					<input type="submit" className="btn btn-success w-100" value="Send" />
				</div>
			</form>
    );
  }
}

NewMagnetForm.propTypes = {
	showId: PropTypes.number.isRequired
};

export default NewMagnetForm
