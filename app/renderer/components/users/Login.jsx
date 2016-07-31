
import React from 'react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

 class Login extends React.Component {
  constructor(props, context) {
    super(props)
  }

  handleSubmit(event) {
    event.preventDefault()

  }

  render() {
    const {formatMessage} = this.props.intl;

    return (
			<div className="row">
        <div className="col-md-12">
          <h4>Login with tmdb</h4>
          <form className="form-inline" role="form">
						<input type="text" placeholder="..." className="form-control" />
						<input type="text" placeholder="..." className="form-control" />

            <button type="submit" className="btn btn-default">Sign in</button>
          </form>
        </div>
      </div>
    )
  }
}

Login.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

Login.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(Login)
