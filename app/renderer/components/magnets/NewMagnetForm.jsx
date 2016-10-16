
import React, {PropTypes} from 'react'
import update from 'react-addons-update'
import NewSubtitleForm from './NewSubtitleForm.jsx'
import ApiService from '../../services/api'

let apiService

class NewMagnetForm extends React.Component {

  constructor(props) {
    super(props)

		this.state = {
			magnet: { url: '', valid: false },
			language: 'English',
			quality: 'Standard',
			subtitles: []
		}

		apiService = new ApiService()

		this.handleMagnetUrlChange = this.handleMagnetUrlChange.bind(this)
		this.handleLanguageChange = this.handleLanguageChange.bind(this)
		this.handleQualityChange = this.handleQualityChange.bind(this)
		this.handleAddSubtitleClick = this.handleAddSubtitleClick.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
  }

	handleMagnetUrlChange(e) {
		let magnetUrl = e.target.value

		let magnet = {
			url: magnetUrl,
			valid: magnetUrl.match(/magnet:\?xt=urn:btih:[a-z0-9]{20,50}/i) != null
		}

		if(!magnet.valid) {
			$('#magnet-url').addClass('has-danger')
			$('#magnet-url .form-control-feedback').removeClass('invisible')
		}else {
			$('#magnet-url').removeClass('has-danger')
			$('#magnet-url .form-control-feedback').addClass('invisible')
		}

		this.setState({ magnet })
	}

	handleLanguageChange(e) {
		this.setState({language: e.target.value})
	}

	handleQualityChange(e) {
		this.setState({quality: e.target.value})
	}

	handleSubFileChange(index, e) {
		let file = e.target.files[0]
		let valid = file.type === 'application/x-subrip'

		let subtitles = update(this.state.subtitles, {[index]: {file: {$set: file}}})
		subtitles = update(subtitles, {[index]: {valid: {$set: valid}}})

		if(!valid) {
			$('#subtitles .form-control-feedback').removeClass('invisible')
		}else {
			$('#subtitles .form-control-feedback').addClass('invisible')
		}

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
			lang: 'French',
			valid: false
		}

		let subtitles = update(this.state.subtitles, {$push: [newSub]})
		this.setState({subtitles})
	}

	handleSubmit(e) {
		e.preventDefault()

		let { magnet, language, quality, subtitles, canSubmit } = this.state

		if(!this.canSubmit()) {
			console.log('please ensure you have no errors')
			return
		}

		let { showId } = this.props
		let magnetUrl = magnet.url
		let torrentName = this.extractTorrentName(magnetUrl)

		let torrent =  { magnetUrl, torrentName, language, quality }
		this.props.addTorrent(showId, torrent, subtitles)
	}

	extractTorrentName(magnetUrl) {
		let indexDn = magnetUrl.indexOf('&dn')
		let indexTr = magnetUrl.indexOf('&tr')
		return magnetUrl.slice(indexDn + 4, indexTr)
	}

	canSubmit() {
		let validSubs = true

		this.state.subtitles.forEach((s) => {
			if(!s.valid) {
				validSubs = false
			}
		})

		return this.state.magnet.valid && validSubs
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
				<div id="magnet-url" className="form-group">
					<label htmlFor="magnetUrl">Magnet link</label>
					<input 	className="form-control form-control-md"
									type="text"
									placeholder="paste magnet url here"
									value={this.state.magnetUrl}
									onChange={this.handleMagnetUrlChange}
									required />
					<div className="form-control-feedback invisible">Invalid magnet</div>
				</div>

				<div className="row">
				  <div className="col-xs-6">
						<div className="form-group">
							<label htmlFor="selectLanguage">Torrent language</label>
							<select className="form-control form-control-md" id="selectLanguage" onChange={this.handleLanguageChange}>
								<option>English</option>
								<option>French</option>
								<option>Arabic</option>
							</select>
						</div>
				  </div>
				  <div className="col-xs-6">
						<div className="form-group">
							<label htmlFor="selectQuality">Torrent video quality</label>
							<select className="form-control form-control-md" id="selectQuality" onChange={this.handleQualityChange}>
								<option>Standard</option>
								<option>720p</option>
								<option>1080p</option>
							</select>
						</div>
				  </div>
				</div>

				<div id="subtitles" className="has-danger">
					{subtitles}
					<div className="form-control-feedback invisible has-danger">Upload .srt only files</div>
				</div>

				<button className="btn" onClick={this.handleAddSubtitleClick}>add subtitle</button>

				<div className="m-t-1">
					<input type="submit" className="btn btn-success w-100" value="Send" />
				</div>
			</form>
    );
  }
}

NewMagnetForm.propTypes = {
	showId: PropTypes.number.isRequired,
	addTorrent: PropTypes.func.isRequired
};

export default NewMagnetForm
