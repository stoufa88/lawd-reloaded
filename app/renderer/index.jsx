// Vendors
import 'bootstrap/dist/js/bootstrap.js'

// Need both React and ReactDOM for the JSX transpiler.
import React from 'react'
import { render } from 'react-dom'
import classNames from 'classnames'
import { IntlProvider, addLocaleData } from 'react-intl'
import { hashHistory, Router, Route, Link, IndexRoute } from 'react-router'
import './app.global.scss';

import Login from './components/users/Login'
import Logout from './components/users/Logout'
import MainNav from './components/shared/MainNav'
import TopNav from './components/shared/TopNav'
import BackLink from './components/shared/BackLink'
import ShowBox from './components/shows/ShowBox'
import ShowDetails from './components/shows/ShowDetails'
import Player from './components/player/Player'

const App = React.createClass({
  getInitialState() {
    return null
  },

  render() {
		const { main, mainNav, topNav, backLink } = this.props

    return (
			<div>
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
				<IndexRoute components={{main: ShowBox, mainNav: MainNav, topNav: TopNav}} />
				<Route path="/movies/:sort" components={{main: ShowBox, mainNav: MainNav, topNav: TopNav}} />
				<Route path="/search/movie" components={{main: ShowBox, mainNav: MainNav, topNav: TopNav}} />
				<Route path="/tvs/:sort" components={{main: ShowBox,  mainNav: MainNav, topNav: TopNav}} />
				<Route path="/movie/:id" components={{main: ShowDetails, backLink: BackLink}} />
				<Route path="/player/:torrentId" components={{main: Player}} />
				<Route path="login" component={Login} />
      </Route>
    </Router>
  </IntlProvider>
), document.getElementById('root'))
