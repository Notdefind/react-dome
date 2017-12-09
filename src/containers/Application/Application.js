import React, { Component } from 'react';
import { browserHistory, Router } from 'react-router';
import { Provider } from 'react-redux';

class Application extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  componentWillReceiveProps(nextProps) {

  }

  render () {
    const { store, routes } = this.props

    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <Router history={browserHistory} children={routes}/>
        </div>
      </Provider>
    )
  }
}

export default Application
