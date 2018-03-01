import React, {PureComponent} from 'react';
import './index.less';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as getPhoto from './../../actions/photo';
import TurnTop from './../../components/TurnTop/Index'
import Pswp  from './../../components/PSWP/Index'
import background from './../../images/photo.jpg'
import debounce from 'lodash/debounce'
import configJson from 'configJson' ;
import Header from './../../components/Header/Index'
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
        that.props.resetPhoto()
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
                        console.log(allData);
                    }).catch((err) => {
                        console.log(err);
                    })
                }
            }
        }else{
            this.loadMore()
        }
         window.addEventListener('scroll', debounce(that.loadMoreData, 300))
     }

    loadAllByPage=(index)=>{
        return new Promise((resolve, reject) => {
            this.setState({
                page:index+1
            })
            this.props.getPhoto({cb:()=>resolve(index),params:{page:index+1}})
        });
    }
    loadMoreData = ()=> {
        const {photo: {lastPage}} = this.props;
        const items = document.querySelectorAll('.item')
        if (items.length > 0 && this.state.page < lastPage) {
            let fetchFlah = true;
            const lastItem = items[items.length - 1]
            // const scrollTop =document.documentElement.scrollTop || document.body.scrollTop;
            const winHeight = document.documentElement.clientHeight || document.body.clientHeight;
            const lastItemTop = lastItem.getBoundingClientRect().top
            // console.log(scrollTop)
            console.log(winHeight)
            console.log('lastItemTop', lastItemTop)
            if (lastItemTop < winHeight && fetchFlah) {
                fetchFlah = false;
                this.setState({
                    page: this.state.page + 1
                }, function () {
                    this.props.getPhoto({cb:()=>{},params:{page:this.state.page}})
                    this.props.history.push({pathname:'/photo',search:`?page=${this.state.page}`})
                })

            }
        } else {
            return
        }
    }
    loadMore=()=>{
        this.setState({
            page:this.state.page+1
        },function () {
            console.log(this.state.page)
            this.props.getPhoto({cb:()=>{},params:{page:this.state.page}})
            this.props.history.push({pathname:'/photo',search:`?page=${this.state.page}`})
        })
    }
    render() {
        const {photo:{data}}=this.props;
        const renderImage = data.map((item, index)=> {
            return (
                <div key={index} className="item">
                    <img
                        onClick={()=>{
                            this.setState({
                                imageIndex:index
                            })
                        }}
                        src={`${configJson.prefix}${item.smallImage}`} alt=""/>
                </div>
            )
        })
        return (
            <div className="record">
                <Header title="PHOTO" desc="You'll never regret it." background={background}/>
                <div className="photo-section">
                    {renderImage}
                </div>
                <Pswp   data={data} imageIndex={this.state.imageIndex}
                        setIndexNull={()=>{this.setState({
                            imageIndex:null
                        })}}/>
                <TurnTop />

            </div>
        );
    }
}

function mapDispatchToProps(dispath) {
    return bindActionCreators({...getPhoto}, dispath);
}
function mapStateToProps(state) {
    return {
        photo: state.photo,
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ImageAndText);

