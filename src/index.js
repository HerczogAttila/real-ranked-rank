import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rankReducer from './store/rank.reducer';
import createSagaMiddleware from 'redux-saga';
import { watch } from './store/index';

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  rank: rankReducer
});

const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk, sagaMiddleware)));

sagaMiddleware.run(watch);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
