import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.less';
import axios from 'axios';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
const store = configureStore();
axios.defaults.withCredentials = true;
const render = Component =>
    ReactDOM.render(
        <Provider store={store}>
            <Component />
        </Provider>
        ,
        document.getElementById('root')
    );
render(App)
if(module.hot) {
    module.hot.accept('./App', () => {
        const NextRootContainer = require('./App').default
        render(NextRootContainer)
    })
}
// registerServiceWorker();
