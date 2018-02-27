import React, {PureComponent} from 'react';
import './index.less';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as getRecord from './../../actions/record';
import TurnTop from './../../components/TurnTop/Index'
import Pswp  from './../../components/PSWP/Index'
import moment from 'moment'
import debounce from 'lodash/debounce'
import configJson from 'configJson' ;
class ImageAndText extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            imgW: 0,
            page:0,
            imageIndex:null
        };
    }

     componentDidMount () {
        const that = this;
        that.props.resetRecord()
        if(this.props.location.search){
            const search=this.props.location.search.substring(1);
            const searchArr = search.split("&");
            for(let i=0;i<searchArr.length;i++){
                var tmp_arr = searchArr[i].split("=");
                if(tmp_arr[0]==='page'){
                    let pageArr=[]
                    for(let j=0;j<parseInt(tmp_arr[1]);j++){
                        pageArr.push(j)
                    }

                    let promises = pageArr.map((item, index) => {
                        return this.loadAllByPage(index);
                    });
                    Promise.all(promises).then((allData) => {
                        this.loadImg()
                        console.log(allData);
                    }).catch((err) => {
                        console.log(err);
                    })
                }
            }
        }else{
            this.loadMore()
        }
        window.addEventListener('scroll', debounce(that.loadImg, 150))
        this.setState({
            imgW: document.querySelector('.item-box').offsetWidth - 100 - 50 - 320
        })
    }

    loadImg = (e, loadForce = false)=> {
        const clientHeight = document.documentElement.clientHeight,
            ele = document.querySelectorAll('.item-ul img');
        for (let i = 0; i < ele.length; i++) {
            if ((ele[i].getBoundingClientRect().top < clientHeight && ( !ele[i].isLoad))) {
                console.log('load')
                ele[i].isLoad = true;
                if (ele[i].dataset) {
                    let oImg = new Image();
                    oImg.onload = function () {
                        ele[i].src = oImg.src
                    }
                    oImg.src = ele[i].dataset.src;
                } else {
                }

            }
        }
    }
    loadAllByPage=(index)=>{
        return new Promise((resolve, reject) => {
            this.setState({
                page:index+1
            })
            this.props.getRecord({cb:()=>resolve(index),params:{page:index+1}})
        });
    }
    loadMore=()=>{

        this.setState({
            page:this.state.page+1
        },function () {
            console.log(this.state.page)
            this.props.getRecord({cb:this.loadImg,params:{page:this.state.page}})
            this.props.history.push({pathname:'/record',search:`?page=${this.state.page}`})
        })
    }
    render() {
        console.log(this.state.page)
        const {record}=this.props;
        const renderRecord = record.data.map((item, index)=> {
            const scale = this.state.imgW / item.imageW;
            return (
                <li className="item" key={index}>
                    <div className="item-line">
                                <span className="circle-bg">
                                    <span className="circle"></span>
                                </span>
                        <span className="line"></span>
                    </div>
                    <div className="item-text">
                        <h4>{moment(item.createdAt).format('YYYY/MM/DD HH:ss:mm')}</h4>
                        <p>
                            {item.content}
                        </p>
                    </div>
                    <div className="item-image">
                        <img
                            onClick={()=>{
                                this.setState({
                                    imageIndex:index
                                })
                            }}
                            style={{height: (item.imageH * scale) + 'px'}}
                            data-src={`${configJson.prefix}${item.image}`}
                            src={"http://placeholder.qiniudn.com/1x1/eaeaea/fff"} alt=""/>
                    </div>
                </li>
            )
        })
        return (
            <div className="record">
                <div className="header">
                    <div className="header-content">
                        <h1>-RECORDS-</h1>
                        <h3>You'll never regret it.</h3>
                    </div>
                </div>
                <div className="item-box">
                    {
                        record.loading ?
                            <ul className="pre-ul">
                                <li className="pre-item">
                                    <div className="pre-left">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                    <div className="pre-right">
                                        <div></div>
                                    </div>
                                </li>
                                <li className="pre-item">
                                    <div className="pre-left">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                    <div className="pre-right">
                                        <div></div>
                                    </div>
                                </li>
                                <li className="pre-item">
                                    <div className="pre-left">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                    <div className="pre-right">
                                        <div></div>
                                    </div>
                                </li>
                            </ul>
                            :
                            <ul className="item-ul">{renderRecord}</ul>
                    }
                    {
                        record.lastPage<=this.state.page?null
                            : <div className="loading-more" onClick={this.loadMore}>
                            <p>加载更多...</p>
                        </div>
                    }

                </div>
                <Pswp   data={record.data} imageIndex={this.state.imageIndex}
                        setIndexNull={()=>{this.setState({
                            imageIndex:null
                        })}}/>
                <TurnTop />

            </div>
        );
    }
}

function mapDispatchToProps(dispath) {
    return bindActionCreators({...getRecord}, dispath);
}
function mapStateToProps(state) {
    return {
        record: state.record,
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ImageAndText);

