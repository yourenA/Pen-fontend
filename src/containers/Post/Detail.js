import React, {PureComponent} from 'react';
import './detail.less';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as getPost from './../../actions/post';
import Tag from './../../components/Tag/Index'
import TurnTop from './../../components/TurnTop/Index'
import Footer from './../../components/Footer/Index' ;
import emoji from 'emoji-dictionary'
import moment from 'moment'
import Skeleton from './../../components/Skeleton/Index'
import assign from 'lodash/assign'
import CodeBlock from './Markdown/code-block'
var Markdown = require('react-markdown');
class Detail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        document.documentElement.scrollTop=0
        const pathname = this.props.history.location.pathname.split('/')
        const id = pathname[pathname.length - 1]
        this.props.getOnePost(id)
    }

    componentWillUnmount() {
        this.props.resetDetail()
    }
    render() {

        const {post:{detail}}=this.props;
        // const emojiSupport = text =>{
        //     console.log(detail.markdown.replace(/:\w+:/gi, name => emoji.getUnicode(name)))
        //     return detail.markdown.replace(/:\w+:/gi, name => emoji.getUnicode(name))
        // }
        const emojiSupport=detail.markdown&&detail.markdown.replace(/:\w+:/gi, name => emoji.getUnicode(name))
        const renderTags = (items)=> {
            return items.map((item, index)=> {
                return (
                    <Tag
                        key={item.id} color={`rgba(${item.r},${item.g},${item.b},${item.a})`} title={item.name}>
                    </Tag>
                )
            })
        }
        return (
            <div className="detail-container">

                <div className="detail-content">
                    <div className="detail-img-content">
                        <img className="detail-img" src={detail.pageImageUrl&&detail.pageImageUrl?detail.pageImageUrl:"https://photo.tuchong.com/1608305/f/602998431.jpg" } alt=""/>
                    </div>
                    {
                        detail.title?<div>
                            <div className="detail-back-home" onClick={()=>{
                                if(this.props.history.action==='PUSH'){
                                    this.props.history.goBack()
                                }else{
                                    this.props.history.push(`/post`)
                                }
                            }}><span>返回首页</span></div>
                            <h1 className="detail-title">[{detail.code_category && detail.code_category.name}] {detail.title}</h1>
                            <div className="detail-tags">{detail.tags && renderTags(detail.tags)}</div>
                            <div className="detail-time">最后编辑于 : {moment(detail.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</div>

                            <Markdown
                                className="markdown-modal"
                                source={emojiSupport || ''}
                                skipHtml= {this.state.htmlMode === 'skip'}
                                escapeHtml= {this.state.htmlMode === 'escape'}
                                renderers={assign({}, Markdown.renderers, {
                                    code: CodeBlock,
                                })}
                            />
                        </div>:
                            <div style={{marginTop:'20px'}}>
                                <Skeleton />
                            </div>

                    }
                </div>
                <Footer maxWidth={780}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(Detail);

