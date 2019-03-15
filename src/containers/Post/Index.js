import React, {PureComponent} from 'react';
import './index.less';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as getPost from './../../actions/post';
import TurnTop from './../../components/TurnTop/Index'
import Pswp  from './../../components/PSWP/Index'
import background from './../../images/photo.jpg'
import debounce from 'lodash/debounce'
import Footer from './../../components/Footer/Index' ;
import Ellipsis from './../../components/Ellipsis/Index.js';
import Tag from './../../components/Tag/Index'
import moment from 'moment'
import Header from './../../components/Header/Index'
import throttle from 'lodash/throttle'
import clear from './../../images/clear.png'
import home from './../../images/home.png'
class ImageAndText extends PureComponent {
    constructor(props) {
        super(props);
        const {post:{ pagination,active_category}}=this.props;
        this.state = {
            imgW: 0,
            page: pagination.current_page||1,
            query: "",
            category: active_category||'all',
            imageIndex: null,
            fixed: false
        };
        this.getPost = debounce(this.getPost, 300);
    }

    componentDidMount() {
        console.log(this.props.location.state)
        const that = this;
        const {loaded,scrollTop} = this.props.post;
        console.log('scrollTop',scrollTop)
        document.documentElement.scrollTop=scrollTop
        if (!loaded || this.props.location.state) {
            that.props.resetPost();
            this.props.getCategory()
            if (this.props.location.search) {
                const search = this.props.location.search.substring(1);
                const searchArr = search.split("&");
                let params = {}
                for (let i = 0; i < searchArr.length; i++) {
                    var tmp_arr = searchArr[i].split("=");
                    if (tmp_arr[0] === 'page') {
                        params.page = tmp_arr[1]
                    }
                    if (tmp_arr[0] === 'category') {
                        params.category = tmp_arr[1]
                    }
                }
                console.log('params', params)
                this.getPost(params)
            } else {
                this.getPost({
                    category: 'all',
                    page: 1
                })
            }
        }

        window.addEventListener('scroll', that.changeSiderPosition)
    }
    componentWillUnmount() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        this.props.saveScroll(scrollTop)
        window.removeEventListener('scroll', this.changeSiderPosition)
    }

    changeSiderPosition = ()=> {
        let siderDiv = document.querySelector('.category')
        let boundingTop = siderDiv.getBoundingClientRect().top;
        if (boundingTop < 0) {
            this.setState({
                fixed: true
            })
        } else {
            this.setState({
                fixed: false
            })
        }
    }
    getPost = (params)=> {
        console.log('get post')
        const that = this;
        this.props.getPost({
            cb: ()=> {
                if (params.page) {
                    that.setState({
                        page: params.page,
                    })
                }
                if (params.category) {
                    that.setState({
                        category: params.category
                    })
                }
                const {post:{pagination}}=this.props;
                this.props.history.replace(`/post?category=${this.state.category}&page=${pagination.current_page}`)

            }, params
        })
    }
    changeQuery = (e)=> {
        e.persist();
        const that = this;
        this.setState({
            query: e.target.value.trim()
        }, function () {
            that.getPost({
                query: that.state.query,
                page: 1,
                category: that.state.category
            })
        })
    }
    loadAllByPage = (index)=> {
        return new Promise((resolve, reject) => {
            this.setState({
                page: index + 1
            })
            this.props.getPost({cb: ()=>resolve(index), params: {page: index + 1}})
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
                    this.props.getPhoto({
                        cb: ()=> {
                        }, params: {page: this.state.page}
                    })
                    this.props.history.push({pathname: '/post', search: `?page=${this.state.page}`})
                })

            }
        } else {
            return
        }
    }
    loadMore = ()=> {
        this.setState({
            page: this.state.page + 1
        }, function () {
            console.log(this.state.page)
            this.props.getPost({
                cb: ()=> {
                }, params: {page: this.state.page}
            })
            this.props.history.push({pathname: '/photo', search: `?page=${this.state.page}`})
        })
    }

    render() {
        const {post:{data, category, pagination}}=this.props;
        const renderCategory = category.map((item, index)=> {
            return <div key={index} className={`category-item ${item.id == this.state.category ? 'active' : ''}`}
                        onClick={()=>this.getPost({
                            query: this.state.query,
                            page: 1,
                            category: item.id
                        })}>
                {item.name}
            </div>
        })
        const renderTags = (items)=> {
            return items.map((item, index)=> {
                return (
                    <Tag
                        key={item.id} color={`rgba(${item.r},${item.g},${item.b},${item.a})`} title={item.name}>
                    </Tag>
                )
            })
        }
        const renderPost = data.map((item, index)=> {
            // let reg = new RegExp(""+this.state.query+"","g");
            item.markdown= item.markdown.replace(/<[^>]+>/g,"");
            item.markdown = item.markdown.replace(/[\*]|[\#]|[>]/g, '')
            const regKey = ["\\", "+"]
            let reg = null
            if (regKey.indexOf(this.state.query) >= 0) {
                reg = new RegExp("(\\" + this.state.query + ")", "gi");
            } else {
                reg = new RegExp("(" + this.state.query + ")", "gi");

            }
            let img = item.markdown.match(/!\[image\]\((\S*)\)/);
            let markdown = this.state.query ? item.markdown.replace(reg, `<span style="color:red">${this.state.query}</span>`) : item.markdown;
            let searchIndex = markdown.indexOf(this.state.query)
            if (searchIndex > 100) {
                markdown = markdown.substr(searchIndex - 100)
            }
            return (
                <div key={index} className="post-item">
                    <div className="post-title" onClick={()=> {
                        this.props.history.push(`/post-detail/${item.id}`)
                    }}>[{item.code_category && item.code_category.name}] {item.title}
                    </div>
                    <div className="post-tags">{renderTags(item.tags)}</div>
                    <div className="post-content">
                        <div className="post-desc">
                            <Ellipsis className="code-desc-content" lines={3}>
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: markdown
                                    }}></p>
                            </Ellipsis>
                        </div>
                        {
                            img && <div className="post-img">
                                <img src={img[1]} alt=""/>
                            </div>
                        }

                    </div>

                    <div className="post-info"><span
                        className="post-time">最后编辑于 : {moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                    </div>
                </div>
            )
        })
        return (
            <div className="record">
                <Header title="" desc="" background={background}/>
                <div className="content-box">
                    <div className="category">
                        <div className="seat" style={{visibility: this.state.fixed ? 'visible' : 'hidden'}}></div>
                        <div className="category-content"
                             style={{position: this.state.fixed ? 'fixed' : 'relative', top: 0}}>
                            {renderCategory}
                        </div>
                    </div>
                    <div className="post">
                        <div className="search-box">
                            <input placeholder="输入需要查找的内容" type="text" value={this.state.query}
                                   onChange={this.changeQuery} className="search-input"/>
                            <img src={clear} alt="" style={{display: this.state.query.length > 0 ? 'block' : 'none'}}
                                 onClick={()=> {
                                     this.setState({
                                         query: ''
                                     }, function () {
                                         this.getPost({
                                             query: this.state.query,
                                             page: 1,
                                             category: this.state.category
                                         })
                                     })

                                 }}/>
                        </div>
                        <div>
                            {renderPost}
                        </div>

                        <div className="pagination">
                            <div className="img left"
                                 style={{visibility: pagination.current_page === 1 ? 'hidden' : 'visible'}}
                                 onClick={()=> {

                                     this.getPost({
                                         query: this.state.query,
                                         page: this.state.page - 1,
                                         category: this.state.category
                                     })
                                 }}
                            ></div>
                            <div className="pagination-info">{pagination.current_page}/{pagination.total_page}</div>
                            <div className="img right"
                                 style={{visibility: (pagination.current_page === pagination.total_page || pagination.total_page === 0) ? 'hidden' : 'visible'}}
                                 onClick={()=> {
                                     console.log('this.state.page', this.state.page)
                                     this.getPost({
                                         query: this.state.query,
                                         page: Number(this.state.page) + 1,
                                         category: this.state.category
                                     })
                                 }}></div>
                        </div>
                    </div>
                    <div className="author">
                        <div className="author-content">
                            <h4><img src={home} alt=""/>简介 <span>Introduction</span></h4>
                            <p>这是我(Daijiaru)的个人博客。主要记录学习前端、NodeJs及其它方面的遇到的问题。</p>
                            <p>同时我也是一个摄影爱好者，这是我的摄影个人主页 : <a href="https://tuchong.com/1608305/" target="_blank">https://tuchong.com/1608305/</a></p>
                            <p>如果你喜欢本博客，欢迎推荐给好友！</p>
                        </div>

                    </div>

                </div>
                <Footer />

                <Pswp data={data} imageIndex={this.state.imageIndex}
                      setIndexNull={()=> {
                          this.setState({
                              imageIndex: null
                          })
                      }}/>
                <TurnTop />

            </div>
        );
    }
}

function mapDispatchToProps(dispath) {
    return bindActionCreators({...getPost}, dispath);
}
function mapStateToProps(state) {
    return {
        post: state.post,
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ImageAndText);
