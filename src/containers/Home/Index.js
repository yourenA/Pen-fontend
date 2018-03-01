import React, {PureComponent} from 'react';
import './index.less'
import icon1 from './../../images/icon1.png'
import icon2 from './../../images/icon2.png'
import icon3 from './../../images/icon3.png'
import icon4 from './../../images/icon4.png'
class Home extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            rotateAngel: -5
        }
    }
    componentWillUnmount(){
        const that = this
        window.removeEventListener('DOMMouseScroll', that.wheelscroll)//Firefox
        window.removeEventListener('mousewheel', that.wheelscroll)//Firefox

    }
    componentDidMount() {
        const that = this
        window.addEventListener('DOMMouseScroll', that.wheelscroll)//Firefox
        window.addEventListener('mousewheel', that.wheelscroll)//Firefox

        that.setState({
            titleLoaded: true
        }, function () {
            setTimeout(function () {
                that.setState({
                    item1Loaded: true
                })
            }, 250)
            setTimeout(function () {
                that.setState({
                    item2Loaded: true
                })
            }, 500)
            setTimeout(function () {
                that.setState({
                    item3Loaded: true
                })
            }, 750)
            setTimeout(function () {
                that.setState({
                    item4Loaded: true
                })
            }, 1000)
        })
    }

    wheelscroll = (e)=> {
        if (e.wheelDelta) {//IE/Opera/Chrome
            if (e.wheelDelta > 0) {
                this.changeRotateAngel('up')
            } else {
                this.changeRotateAngel('down')
            }
        } else if (e.detail) {//Firefox
            if (e.detail > 0) {
                this.changeRotateAngel('down')
            } else {
                this.changeRotateAngel('up')
            }
        }
    }
    changeRotateAngel = (direction)=> {
        if (direction === 'down') {
            if (this.state.rotateAngel < 5) {
                this.setState({
                    rotateAngel: this.state.rotateAngel + 0.5
                })
            } else {
                return false
            }
        } else if (direction === 'up') {
            if (this.state.rotateAngel > -5) {
                this.setState({
                    rotateAngel: this.state.rotateAngel - 0.5
                })
            } else {
                return false
            }
        }
    }

    render() {
        return (
            <div className="main">
                <div className="main-top">
                    <div className="main-top-wrap">
                        <p className="main-title">Write some thing for the Sky</p>
                        <p className="main-title">Do some thing for the Life</p>
                    </div>
                    <div className="main-top-rotate"
                         style={{transform: `translate(-50%) rotate(${this.state.rotateAngel}deg)`}}></div>
                </div>
                <div className="main-item-box">
                    <div className="main-item-content">
                        <div className={`main-item-title ` }>
                            <p>Some Projects</p>
                        </div>
                        <div className="clearfix"></div>
                        <div className="main-item-wrap">
                            <div
                                className={`main-item  animated  ${this.state.item1Loaded ? 'bounceInDown show' : ''}`}>
                                <div className="main-item-inner " onClick={()=> {
                                    this.props.history.push('/record')

                                }}>
                                    <div className="item-bg">
                                        <div className="line line1"></div>
                                        <div className="line line2"></div>
                                        <div className="line line3"></div>
                                        <div className="line line4"></div>
                                    </div>
                                    <div className="item-image">
                                        <img src={icon1} alt=""/>
                                    </div>
                                    <div className="item-desc">
                                        <h3>记录</h3>
                                        <p>Record</p>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`main-item  animated  ${this.state.item2Loaded ? 'bounceInDown  show' : ''}`}>
                                <div className="main-item-inner" onClick={()=> {
                                    this.props.history.push('/photo')

                                }}>
                                    <div className="item-bg">
                                        <div className="line line1"></div>
                                        <div className="line line2"></div>
                                        <div className="line line3"></div>
                                        <div className="line line4"></div>
                                    </div>
                                    <div className="item-image">
                                        <img src={icon2} alt=""/>
                                    </div>
                                    <div className="item-desc">
                                        <h3>世界</h3>
                                        <p>Photo</p>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`main-item  animated  ${this.state.item3Loaded ? 'bounceInDown  show' : ''}`}>
                                <div className="main-item-inner">
                                    <div className="item-bg">
                                        <div className="line line1"></div>
                                        <div className="line line2"></div>
                                        <div className="line line3"></div>
                                        <div className="line line4"></div>
                                    </div>
                                    <div className="item-image">
                                        <img src={icon4} alt=""/>
                                    </div>
                                    <div className="item-desc">
                                        <h3>设计价值观</h3>
                                        <p>design values</p>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`main-item  animated  ${this.state.item4Loaded ? 'bounceInDown show' : ''}`}>
                                <div className="main-item-inner">
                                    <div className="item-bg">
                                        <div className="line line1"></div>
                                        <div className="line line2"></div>
                                        <div className="line line3"></div>
                                        <div className="line line4"></div>
                                    </div>
                                    <div className="item-image">
                                        <img src={icon3} alt=""/>
                                    </div>
                                    <div className="item-desc">
                                        <h3>设计价值观</h3>
                                        <p>design values</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default Home