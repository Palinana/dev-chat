import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux'

import Routes from './routes';
import store from './store'
import 'semantic-ui-css/semantic.min.css'

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Routes />
        </Router>
    </Provider>,
document.getElementById('root'));  
