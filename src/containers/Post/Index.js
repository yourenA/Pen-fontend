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
import emoji from 'emoji-dictionary'
import clear from './../../images/clear.png'
import home from './../../images/home.png'
import more from './../../images/more.png'

import configJson from 'configJson' ;
import find from 'lodash/find'
class ImageAndText extends PureComponent {
    constructor(props) {
        super(props);
        const {post:{ pagination,active_category}}=this.props;
        this.title='-Daijiaru';
        this.state = {
            imgW: 0,
            page: pagination.current_page||1,
            query: "",
            category: active_category||'all',
            imageIndex: null,
            fixed: false,
            showMore:'false'
        };
        this.getPost = debounce(this.getPost, 300);
    }

    componentDidMount() {
        const that = this;
        const {loaded,scrollTop} = this.props.post;
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
    setTitle=(name)=>{
        document.title=name+this.title
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
        console.log('get post',params)
        if(params.category==='more'){
            this.setState({
                showMore:!this.state.showMore
            })
            return false
        }
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
                const {post:{pagination,category}}=this.props;
                const nowCategory=find(category,function (o) {
                    return o.id== params.category
                })
                this.setTitle(nowCategory.name)
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
    render() {
        const {post:{data, category, pagination}}=this.props;
        const renderCategory = category.map((item, index)=> {
            return <div key={index} className={`category-item ${item.id == this.state.category ? 'active' : ''}`}
                        onClick={()=>{
                            this.getPost({
                                query: this.state.query,
                                page: 1,
                                category: item.id
                            })

                        }}>
                <img src={item.id==='all'?item.imageUrl:`${configJson.prefix}/${item.imageUrl}`} alt=""/>
                {item.name}
            </div>
        })
        const mobileCategory=[...category]
        mobileCategory.splice(3,0,{id:'more',name:'更多',imageUrl:more})
        const renderMobileCategory = mobileCategory.map((item, index)=> {
            return <div key={index} className={`category-item ${item.id == this.state.category ? 'active' : ''}`}
                        onClick={()=>{
                            this.getPost({
                                query: this.state.query,
                                page: 1,
                                category: item.id
                            })

                        }}>
                <img src={(item.id==='all'||item.id==='more')?item.imageUrl:`${configJson.prefix}/${item.imageUrl}`} alt=""/>
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
            let markdownCopy=item.markdown
            let img = markdownCopy.match(/!\[image\]\((\S*)\)/);


            let md= item.markdown.replace(/<[^>]+>/g,"");
            md = md.replace(/[\*]|[\#]|[>]|[=]|[\`\`\`]/g, '')
            md = md.replace(/!\[image\]\((\S*)\)/g, '')
            md = md.replace(/\((\S*)\)/g, '')
            const regKey = ["\\", "+"]
            let reg = null
            if (regKey.indexOf(this.state.query) >= 0) {
                reg = new RegExp("(\\" + this.state.query + ")", "gi");
            } else {
                reg = new RegExp("(" + this.state.query + ")", "gi");

            }
            md = this.state.query ? md.replace(reg, `<span style="color:red">${this.state.query}</span>`) : md;
            let searchIndex = md.indexOf(this.state.query)
            if (searchIndex > 100) {
                md = md.substr(searchIndex - 100)
            }
            return (
                <div key={index} className="post-item">
                    <div className="post-title" onClick={()=> {
                        this.props.history.push(`/post-detail/${item.id}`)
                    }}>[{item.code_category && item.code_category.name}] {item.title.replace(/:\w+:/gi, name => emoji.getUnicode(name))}
                    </div>
                    <div className="post-tags">{renderTags(item.tags)}</div>
                    <div className="post-content">
                        <div className="post-desc">
                            <Ellipsis className="code-desc-content" lines={3}>
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: md
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
                            <div className="pc-content">
                                {renderCategory}
                            </div>
                            <div className={`mobile-content ${this.state.showMore&&'showMore'}`}>
                                {renderMobileCategory}
                            </div>
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

