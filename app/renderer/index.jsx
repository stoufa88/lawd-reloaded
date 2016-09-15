// Vendors
import 'bootstrap/dist/js/bootstrap.js'

// Need both React and ReactDOM for the JSX transpiler.
import React from 'react'
import { render } from 'react-dom'
import { IntlProvider, addLocaleData } from 'react-intl'
import { hashHistory, Router, Route, Link, IndexRoute } from 'react-router'
import './app.global.scss';

import Login from './components/users/Login'
import Logout from './components/users/Logout'
import Nav from './components/shared/Nav'
import ShowBox from './components/shows/ShowBox'
import ShowDetails from './components/shows/ShowDetails'
import Player from './components/player/Player'

const App = React.createClass({
  getInitialState() {
    return null
  },

  render() {
    return (
			<div>
				<Nav sort={this.props.params.sort}/>
        <div id="main-content">
          {this.props.children || <p>You are {!this.state.loggedIn && 'not'} logged in.</p>}
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
				<IndexRoute component={ShowBox} />
				<Route path="/movies/:sort" component={ShowBox} />
				<Route path="/tvs/:sort" component={ShowBox} />
				<Route path="/movie/:id" component={ShowDetails} />
				<Route path="/player/:torrentId" component={Player} />
				<Route path="login" component={Login} />
      </Route>
    </Router>
  </IntlProvider>
), document.getElementById('root'))
