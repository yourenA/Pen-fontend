/**
 * Created by Administrator on 2017/9/13.
 */
import React from 'react'
import './index.less'
class TurnTop extends React.Component {
    constructor(props) {
        super(props);
        this.scrollTopTimer=null;
        //构造函数用法
        //常用来绑定自定义函数，切记不要在这里或者组件的任何位置setState，state全部在reducer初始化，相信对开发的后期很有帮助
        this.state = {
        }
    }

    componentDidMount() {
    }
    turnTop=()=>{
        console.log('turn top')
        const body = document.querySelector('body');
        const that=this;
        if(this.scrollTopTimer){
            clearInterval(this.scrollTopTimer);
        }
        this.scrollTopTimer = setInterval(function () {
            const backTop =document.documentElement.scrollTop || document.body.scrollTop;
            // console.log('backTop',backTop)
            var speedTop = backTop / 8;
            document.documentElement.scrollTop=(backTop - speedTop);
            body.scrollTop=(backTop - speedTop);
            if (backTop === 0) {
                console.log('到达顶部')
                clearInterval( that.scrollTopTimer);
            }
        }, 20);
    }
    render() {
        return (
            <div className="turn-top"  onClick={this.turnTop}>
            </div>
        )
    }
}
export default TurnTop;