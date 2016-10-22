// Vendors
import 'bootstrap/dist/js/bootstrap.js'

// Need both React and ReactDOM for the JSX transpiler.
import React from 'react'
import { render } from 'react-dom'
import classNames from 'classnames'
import { IntlProvider, addLocaleData } from 'react-intl'
import { hashHistory, Router, Route, Link, IndexRedirect } from 'react-router'
import './app.global.scss';
import pjson from '../package.json'

import Login from './components/users/Login'
import Logout from './components/users/Logout'
import MainNav from './components/shared/MainNav'
import TopNav from './components/shared/TopNav'
import BackLink from './components/shared/BackLink'
import Notification from './components/shared/Notification'
import MovieList from './components/shows/movies/MovieList'
import TorrentList from './components/torrents/TorrentList'
import MovieDetails from './components/shows/movies/MovieDetails'
import TvList from './components/shows/tvs/TvList'
import TvDetails from './components/shows/tvs/TvDetails'
import Player from './components/player/Player'
import ApiService from './services/api'

const version = pjson.version

let apiService

const App = React.createClass({
  getInitialState() {
    return {
			latestVersion: null,
		}
  },

	componentDidMount() {
		window.onbeforeunload = () => {
			//sessionStorage.setItem('showUpdateNotification', false)
			sessionStorage.setItem('sendAnalytics', false)
    }

		apiService = new ApiService()
		apiService.getLatestVersion().then((latestVersion) => {
			console.log(version)
			console.log(latestVersion.get('versionCode'))

			if(version != latestVersion.get('versionCode')
			 	&& sessionStorage.getItem('showUpdateNotification') != 'false') {
				this.setState({latestVersion})
			}
		})

		if(sessionStorage.getItem('sendAnalytics') != 'false' && !process.env.HOT) {
			this.sendAnalytics()
		}

		// Hide the toast after 5 seconds
		setTimeout(() => {
			this.setState({latestVersion: null})
		}, 5000)
	},

	sendAnalytics() {
		let data = {
			version,
			platform: navigator.platform,
			timezoneOffset: new Date().getTimezoneOffset(),
			lang: navigator.language
		}

		apiService.sendAnalytics(data)
	},

  render() {
		const { main, mainNav, topNav, backLink, logo } = this.props
		const { latestVersion } = this.state

    return (
			<div>
				{(() => {
					if (logo) {
						return(
							<a className="navbar-brand" href="#">Lawd</a>
						)
					}
				})()}

				{(() => {
					if (latestVersion) {
						return (
							<Notification type="UPDATE" />
						)
					}
				})()}

				{(() => {
					if (topNav) {
						return (
							<div className="top-nav">
								{topNav}
							</div>
						)
					}
				})()}

				{(() => {
					if (mainNav) {
						return (
							<div className="main-nav">
								{mainNav}
							</div>
						)
					}
				})()}

				{(() => {
					if (backLink) {
						return (
							<div className="back-link">
								{backLink}
							</div>
						)
					}
				})()}

				<div id="main-content">
          {main}
        </div>
			</div>
    )
  }
})

function requireAuth(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

// import translations and inject to app context
let frData = require("./intl/fr.json")
let enData = require("./intl/en.json")

let locale = (navigator.language).indexOf('fr') > -1 ? 'fr' : 'en'
let messages = Object.assign(frData, enData)[locale]

render((
  <IntlProvider locale={locale} messages={messages}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>

				<IndexRedirect to="/movies/popular" />

				<Route path="movies" components={{main: MovieList, mainNav: MainNav, topNav: TopNav, logo: true}}>
					<Route path="/movies/:sort" components={{main: MovieList, mainNav: MainNav, topNav: TopNav, logo: true}} />
				</Route>

				<Route path="tvs" components={{main: TvList, mainNav: MainNav, topNav: TopNav, logo: true}}>
					<Route path="/tvs/:sort" components={{main: TvList,  mainNav: MainNav, topNav: TopNav, logo: true}} />
				</Route>

				<Route path="/torrents" components={{main: TorrentList, mainNav: MainNav, logo: true}} />

				<Route path="/movie/:id" components={{main: MovieDetails, backLink: BackLink}} />
				<Route path="/tv/:id" components={{main: TvDetails, backLink: BackLink}} />

				<Route path="/search/movie" components={{main: MovieList, mainNav: MainNav, topNav: TopNav}} />
				<Route path="/search/tv" components={{main: TvList, mainNav: MainNav, topNav: TopNav}} />

				<Route path="/player/:torrentId" components={{main: Player, backLink: BackLink}} />
      </Route>
    </Router>
  </IntlProvider>
), document.getElementById('root'))
