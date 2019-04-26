import React, {PureComponent} from 'react';
import './detail.less';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as getPost from './../../actions/post';
import Tag from './../../components/Tag/Index'
import configJson from 'configJson' ;
import TurnTop from './../../components/TurnTop/Index'
import Footer from './../../components/Footer/Index' ;
import emoji from 'emoji-dictionary'
import moment from 'moment'
import Skeleton from './../../components/Skeleton/Index'
import assign from 'lodash/assign'
import comment from '../../images/comment.png'
import huifu from '../../images/huifu.png'
import clear from '../../images/clear.png'
import empty from '../../images/empty.png'
import axios from 'axios';
import CodeBlock from './Markdown/code-block'
var Markdown = require('react-markdown');
class Detail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            commentDisplay: false,
            comment: '',
            username: '',
            replyname:'',
            code: '',
            captcha: '',
            reply_content:'',
            textIndent:0
        }
    }

    componentDidMount() {
        document.documentElement.scrollTop = 0
        const pathname = this.props.history.location.pathname.split('/')
        const id = pathname[pathname.length - 1]
        this.props.getOnePost(id)
        this.props.getComents(id)
    }

    componentWillUnmount() {
        this.props.resetDetail()
    }

    goHome = ()=> {
        if (this.props.history.action === 'PUSH') {
            this.props.history.goBack()
        } else {
            this.props.history.push(`/post`)
        }
    }
    showCommentInput = ()=> {
        const that = this;
        if (this.state.commentDisplay) {
            return false
        }
        this.setState({
            commentDisplay: true
        }, function () {
            that.getCaptcha()
        })
    }
    getCaptcha = ()=> {
        const that = this;
        axios({
            url: `${configJson.prefix}/api/captcha`,
            method: 'get',
        }).then(function (response) {
            console.log('response', response)
            that.setState({
                captcha: response.data
            })
        })

    }
    cleanComment = ()=> {
        this.setState({
            comment: '',
            username: '',
            code: '',
        })
    }
    sendComment = ()=> {
        const that = this;
        const pathname = this.props.history.location.pathname.split('/')
        const id = pathname[pathname.length - 1]
        this.props.sendComment({
            comment: this.state.comment,
            from_name: this.state.username,
            to_name:this.state.replyname,
            captcha: this.state.code,
            post_id: id
        }, function () {
            that.props.getComents(id)
        })
    }
    handleReply = (name)=> {
        this.showCommentInput()
        this.setState({
            replyname:name,
            reply_content: `回复 ${name}`
        },function () {
            this.setState({
                textIndent:document.querySelector('.reply-content').offsetWidth
            })
            document.querySelector('.comment-textarea textarea').focus()
        })
    }
    cancelReply=()=>{
        this.setState({
            reply_content:'',
            textIndent:0,
            replyname:'',

        })
    }
    render() {

        const {post:{detail, status, msg, comments}}=this.props;
        document.title=detail.title?detail.title:' '
        // const emojiSupport = text =>{
        //     console.log(detail.markdown.replace(/:\w+:/gi, name => emoji.getUnicode(name)))
        //     return detail.markdown.replace(/:\w+:/gi, name => emoji.getUnicode(name))
        // }
        const color = ['#804B71', '#F32F72', '#28dec0', '#5062bf', '#f56a00']
        const emojiSupport = detail.markdown && detail.markdown.replace(/:\w+:/gi, name => emoji.getUnicode(name))
        const renderTags = (items)=> {
            return items.map((item, index)=> {
                return (
                    <Tag
                        key={item.id} color={`rgba(${item.r},${item.g},${item.b},${item.a})`} title={item.name}>
                    </Tag>
                )
            })
        }
        const commentsList = comments.map((item, index)=> {
            return <div key={index} className="comment-item">
                <div className="comment-item-avatar"
                     style={{background: color[index % color.length]}}>{item.from_name.substring(0, 1)}</div>
                <div className="comment-item-content">
                    <p className="nick_name">{item.from_name}</p>
                    <p className="content">{item.to_name&&<fragment>回复 <span className="to_name">{item.to_name}</span> : </fragment>}{item.content}</p>
                    <p className="time">发表于 : {moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                        <span className="huifu" onClick={()=> {
                            this.handleReply(item.from_name)
                        }}>
                        <img src={huifu} alt=""/>回复
                    </span></p>
                </div>
            </div>
        })
        return (
            <div className="detail-container">

                <div className="detail-content">
                    <div className="detail-img-content">
                        <img className="detail-img"
                             src={detail.pageImageUrl && detail.pageImageUrl ? detail.pageImageUrl : "https://photo.tuchong.com/1608305/f/602998431.jpg" }
                             alt=""/>
                    </div>
                    {
                        detail.title ? <div>
                            <div className="detail-back-home" onClick={this.goHome}><span>返回首页</span></div>
                            <h1 className="detail-title">
                                [{detail.code_category && detail.code_category.name}] {detail.title.replace(/:\w+:/gi, name => emoji.getUnicode(name))}</h1>
                            <div className="detail-tags">{detail.tags && renderTags(detail.tags)}</div>
                            <div className="detail-time">最后编辑于
                                : {moment(detail.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</div>

                            <Markdown
                                className="markdown-modal"
                                source={emojiSupport || ''}
                                skipHtml={this.state.htmlMode === 'skip'}
                                escapeHtml={this.state.htmlMode === 'escape'}
                                linkTarget={'_blank'}
                                renderers={assign({}, Markdown.renderers, {
                                    code: CodeBlock,
                                })}
                            />
                            <div className="comment-box">
                                <div className="write-comment">
                                    <p className="comment-header"><img src={comment} alt=""/>评论 <span
                                        onClick={this.showCommentInput}>写评论</span></p>
                                    <div className="comment-input"
                                         style={{display: this.state.commentDisplay ? 'block' : 'none'}}>
                                        <div>
                                            <p>昵 称 :</p><input value={this.state.username} onChange={(e)=> {
                                            this.setState({
                                                username: e.target.value
                                            })
                                        }}/>
                                        </div>
                                        <div>
                                            <p>内 容 :</p>
                                            <div className="comment-textarea">
                                                <textarea
                                                    style={{textIndent:this.state.textIndent+'px'}} value={this.state.comment} onChange={(e)=> {
                                                    this.setState({
                                                        comment: e.target.value
                                                    })
                                                }}/>
                                                {this.state.reply_content&&
                                                <span className="reply-content">{this.state.reply_content}<img onClick={this.cancelReply} src={clear}
                                                                                                               alt="" /> : </span>
                                                }

                                            </div>
                                        </div>
                                        <div>
                                            <p>验证码 :</p><input className="code" value={this.state.code}
                                                               onChange={(e)=> {
                                                                   this.setState({
                                                                       code: e.target.value
                                                                   })
                                                               }}/>
                                            <span
                                                onClick={this.getCaptcha}
                                                dangerouslySetInnerHTML={{
                                                    __html: this.state.captcha
                                                }}></span>
                                        </div>
                                        <div>
                                            <span className="comment-btn" onClick={this.cleanComment}>清空</span>
                                            <span className="comment-btn" onClick={this.sendComment}>提交</span>
                                            {msg && <span className=""
                                                          style={{color: status === -1 ? 'red' : '#000'}}>{msg}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="comments-container">
                                    {comments.length > 0 ? commentsList : <h5 className="comment-empty"><img src={empty}
                                                                                                             alt=""/>暂无评论</h5>}
                                </div>
                            </div>

                        </div> :
                            <div style={{marginTop: '20px'}}>
                                <Skeleton />
                            </div>

                    }
                </div>
                <Footer maxWidth={780}/>
                <TurnTop goHome={this.goHome}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(Detail);

