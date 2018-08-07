// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {BrowserRouter as Router, Route} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';


const RouterMapping = () => (
    <Router>
        <div>
            <App />
        </div>
    </Router>
);
ReactDOM.render (
    <RouterMapping/>,
    document.getElementById ('root')
);