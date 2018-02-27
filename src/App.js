
import React from 'react'
import {Route, Router} from 'react-router-dom'
// import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import createHistory from 'history/createHashHistory'
import 'normalize.css'
// import axios from 'axios'
// import configJson from 'configJson' ;
/*
 全局导入less
 */
import './app.less'

import asyncComponent from './AsyncComponent'

import homeContainer from './containers/Home/Index'
// import TurnTop from './components/Turn-top'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as getBaseInfo from './actions/record';
require('es6-promise').polyfill();
const history = createHistory()
// var parser = require('ua-parser-js');
/*
 normalize.css
 */

const Record = asyncComponent(() =>
import(/* webpackChunkName: "Record" */ "./containers/Record/Index")
)

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        //构造函数用法
        //常用来绑定自定义函数，切记不要在这里或者组件的任何位置setState，state全部在reducer初始化，相信对开发的后期很有帮助
    }
    componentDidMount() {

    }
    render() {
        // console.log(parser(window.navigator));
        return (
            <Router history={history}>
                <Route render={({location}) => {
                    return (
                        <div key={location.pathname} className="react">
                            <Route location={location}  exact path="/" component={homeContainer}/>
                            <Route location={location}   path="/record" component={Record}/>
                        </div>
                    )
                }}/>
            </Router>
        );
    }
}

function mapStateToProps(state) {
    return {
        state: state,
    };
}
function mapDispatchToProps(dispath) {
    return bindActionCreators({...getBaseInfo}, dispath);
}
export default connect(mapStateToProps, mapDispatchToProps)(App);