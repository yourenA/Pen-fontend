/**
 * Created by Administrator on 2017/9/13.
 */
import React from 'react'
import './index.less'
import Top from './../../images/top.png'
class TurnTop extends React.Component {
    constructor(props) {
        super(props);
        this.scrollTopTimer = null;
        //构造函数用法
        //常用来绑定自定义函数，切记不要在这里或者组件的任何位置setState，state全部在reducer初始化，相信对开发的后期很有帮助
        this.state = {
            show: false
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.showScrollTop)
        window.addEventListener('mousewheel', this.stopScroll)
        window.addEventListener('DOMMouseScroll', this.stopScroll)
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.showScrollTop)
    }
    stopScroll=()=>{
        if (this.scrollTopTimer) {
            clearInterval(this.scrollTopTimer);
        }
    }
    showScrollTop = ()=> {
        const backTop = document.documentElement.scrollTop || document.body.scrollTop;
        this.setState({
            show: (backTop > 400) ? true : false
        })
    }
    turnTop = ()=> {
        console.log('turn top')
        const body = document.querySelector('body');
        const that = this;
        if (this.scrollTopTimer) {
            clearInterval(this.scrollTopTimer);
        }
        this.scrollTopTimer = setInterval(function () {
            const backTop = document.documentElement.scrollTop || document.body.scrollTop;
            // console.log('backTop',backTop)
            var speedTop = backTop / 6;
            document.documentElement.scrollTop = (backTop - speedTop);
            body.scrollTop = (backTop - speedTop);
            if (backTop === 0) {
                clearInterval(that.scrollTopTimer);
            }
        }, 20);
    }

    render() {
        return (
            <div className="turn-top" onClick={this.turnTop} style={{display:this.state.show?"block":"none"}}>
                <img src={Top} alt=""/><span>TOP</span>
            </div>
        )
    }
}
export default TurnTop;