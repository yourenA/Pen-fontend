import Editor from './editor'
import {Button, Icon, Modal, Tabs, Input, Upload, message, Select} from 'antd'
import CodeBlock from './code-block'
import './markdown.less'
import {connect} from 'dva';
import config from '@/config/config'
import {routerRedux} from 'dva/router';
const TabPane = Tabs.TabPane;
const InputGroup = Input.Group;
const confirm = Modal.confirm;
const Option = Select.Option;
var React = require('react');
import assign from 'lodash/assign';
var Markdown = require('react-markdown');

var h = React.createElement;
@connect(state => ({
  code: state.code,
  category: state.category,
  tags: state.tags,
}))
export default class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.id = this.props.match.params.id !== 'new' ? this.props.match.params.id : null;
    this.isNew = this.props.match.params.id !== 'new' ? false : true;
    this.state = {
      fileList: [],
      activeKey: 'local',
      remotelyUrl: '',
      linkUrl: '',
      open: false,
      picModal: false,
      linkModal: false,
      tagModal: false,
      type: '',
      title: '',
      tags: [],
      markdownSrc: '',
      htmlMode: 'raw'
    };
    this.timer=null;
    this.onMarkdownChange = this.onMarkdownChange.bind(this);
  }

  componentDidMount() {

    const that=this

    this.getCategory({return: 'all'})
    this.getTags()
    if (this.isNew) {
      const newMarkdownHistory=localStorage.getItem('newMarkdownHistory');
      if(newMarkdownHistory&&this.isNew){
        this.setState({
          markdownSrc:newMarkdownHistory
        })
      }
      setTimeout(that.saveMarkdownHistory,2000)
    }else{
      this.getCode(this.id)

    }

  }
  saveMarkdownHistory=()=>{
      localStorage.setItem('newMarkdownHistory',this.state.markdownSrc)
    if(this.timer){
      clearTimeout(this.timer)
    }
    this.timer=setTimeout(this.saveMarkdownHistory,2000)
  }
  saveEditMarkdownHistory=()=>{
    localStorage.setItem('editMarkdownHistory',this.state.markdownSrc)
    if(this.timer){
      clearTimeout(this.timer)
    }
    this.timer=setTimeout(this.saveEditMarkdownHistory,2000)
  }
  componentWillUnmount(){
    if(this.timer){
      clearTimeout(this.timer)
    }
  }
  getCategory = (value)=> {
    const {dispatch} = this.props;
    dispatch({
      type: 'category/fetch',
      payload: value ? {...value} : {},
      callback: ()=> {
      }
    });
  }
  getTags = ()=> {
    const {dispatch} = this.props;
    dispatch({
      type: 'tags/fetch',
      payload: {},
      callback: ()=> {
      }
    });
  }
  getCode = (id)=> {
    const that = this;
    that.props.dispatch({
      type: 'code/fetchOne',
      payload: {
        id
      },
      callback: function () {
        const {code:{oneData}}=that.props;
        let tags=[];
        for(let i=0;i<oneData.tags.length;i++){
          tags.push(oneData.tags[i].id)
        }
        that.setState({
          tags: tags,
          markdownSrc: oneData.markdown,
          title: oneData.title,
          type: oneData.codeCategoryId
        })

        const editMarkdownHistory=localStorage.getItem('editMarkdownHistory');
        if(editMarkdownHistory&& editMarkdownHistory!=oneData.markdown){
          confirm({
            title: '是否加载草稿箱',
            onOk() {
              console.log('OK');
              that.setState({
                markdownSrc: editMarkdownHistory,
              })

            },
            onCancel() {
              console.log('Cancel');
              localStorage.setItem('editMarkdownHistory','')
            },
          });
        }else{
        }
        that.saveEditMarkdownHistory()

      }
    })
  }
  saveCode = ()=> {
    const that = this;
    that.props.dispatch({
      type: this.isNew ? 'code/add' : 'code/edit',
      payload: {
        title: this.state.title,
        tags: this.state.tags,
        type: this.state.type,
        markdown: this.state.markdownSrc,
        id: this.id
      },
      callback: function () {
        message.success(that.isNew ? '添加文章成功' : '编辑文章成功');
        if(that.isNew){
          localStorage.setItem('newMarkdownHistory','')
        }else{
          localStorage.setItem('editMarkdownHistory','')
        }
        setTimeout(function () {
          // that.isNew? that.props.dispatch(routerRedux.replace(`/code/text`)):null
        }, 1000)
      }
    })
  }

  onMarkdownChange(md) {
    this.setState({
      markdownSrc: md
    });
  }

  handleAddPic = ()=> {
    if (this.state.activeKey === 'local') {
      if (this.state.fileList.length === 0) {
        message.error('没有图片');
      } else {
        console.log(this.state.fileList)
        const formData = new FormData();
        formData.append('image', this.state.fileList[0]);
        const that = this;
        const {dispatch} = that.props;
        dispatch({
          type: 'code/uploadMarkdownImage',
          payload: {data: formData},
          callback: ()=> {
            const {code: {markdownUrl}} = that.props;
            console.log(markdownUrl)
            that.editorInsert(`![image](${config.prefix}${markdownUrl})`)
            message.success('upload successfully.');
            that.setState({
              picModal: false
            })
          }
        });
      }
    } else if (this.state.activeKey === 'remotely') {
      console.log(this.state.remotelyUrl)
      this.editorInsert(`![image](${this.state.remotelyUrl})`)
      this.setState({
        picModal: false
      })
    }
  }
  handleAddLink = ()=> {
    this.editorInsert(`[${this.state.linkUrl}](${this.state.linkUrl})`)
    this.setState({
      linkModal: false
    })
  }
  findChildFunc = (cb)=> {
    this.editorInsert = cb
  }
  changeType = (type)=> {
    console.log(type)
    this.setState({
      type
    })
  }
  changeTitle = (e)=> {
    this.setState({
      title: e.target.value
    })
  }
  changeTags = (tags)=> {
    console.log(tags)
    this.setState({
      tags
    })
  }

  render() {
    const props = {
      accept: 'image/*',
      multiple: true,
      onRemove: (file) => {
        this.setState(({fileList}) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState({
          fileList: [file],
        });
        return false;
      },
      fileList: this.state.fileList,
    };
    const {category, tags}=this.props
    const renderSelect = category.data.map((item, index)=> {
      return (
        h(
          Option, {key: index, value: item.id},
          item.name
        )
      )
    })
    const renderTagSelect = tags.data.map((item, index)=> {
      return (
        h(
          Option, {key: index, value: item.id},
          item.name
        )
      )
    })
    return (
      h('div', {className: 'markdown'},
        h('div', {className: 'header-pane'},
          h('h1', {}, this.isNew ? '新建文章' : '编辑文章'),
          h('div', {className: 'input-group'},
            h(InputGroup, {compact: true,},
              h(Select, {className: 'type', style: {width: '20%'}, onChange: this.changeType, value: this.state.type},
                renderSelect
              ),
              h(Input, {placeholder: '标题', style: {width: '50%'}, onChange: this.changeTitle, value: this.state.title}),
              h(Button, {
                  type: 'dashed',
                  onClick: ()=> {
                    console.log('open')
                    this.setState({
                      tagModal: true
                    })
                  }
                },
                '编辑文章标签'
              ),
            ),
          ),
          h('div', {className: 'btn-group'},
            h(Button, {
              className: 'btn',
              onClick: ()=> {
                if(this.isNew){
                  localStorage.setItem('newMarkdownHistory','')
                }else{
                  localStorage.setItem('editMarkdownHistory','')
                }
                this.props.dispatch(routerRedux.push(`/device/device-list`));
              }
            }, '取消'),
            h(Button, {
              className: 'btn',
              type: 'primary',
              onClick: this.saveCode
            }, '保存'),
          )
        ),
        h('div', {className: 'editor-pane'},
          h(Editor, {
            value: this.state.markdownSrc,
            onChange: this.onMarkdownChange,
            findChildFunc: this.findChildFunc
          }),
          h('div', {className: 'import'},

            h('div', {
                className: `plus ${this.state.open ? 'picture' : ''}`,
                onClick: ()=>this.setState({picModal: true})
              },
              h(Icon, {type: 'picture', style: {fontSize: '30px'}})),
            h('div', {
                className: `plus ${this.state.open ? 'link' : ''}`,
                onClick: ()=>this.setState({linkModal: true})
              },
              h(Icon, {type: 'link', style: {fontSize: '30px'}})),
            h('div', {className: `plus`, onClick: ()=>this.setState({open: !this.state.open})},
              h(Icon, {type: this.state.open ? 'minus' : 'plus', style: {fontSize: '30px'}})),
          )
        ),

        h('div', {className: 'result-pane'},
          h(Markdown, {
            className: 'result',
            source: this.state.markdownSrc,
            skipHtml: this.state.htmlMode === 'skip',
            escapeHtml: this.state.htmlMode === 'escape',
            renderers: assign({}, Markdown.renderers, {
              code: CodeBlock
            })
          })
        ),
        h(Modal, {
            title: '插入图片', visible: this.state.picModal, onOk: this.handleAddPic,
            onCancel: () => this.setState({picModal: false})
          },
          h(Tabs, {
              activeKey: this.state.activeKey,
              onChange: (e)=>this.setState({
                activeKey: e
              })

            },
            h(TabPane, {tab: "本地上传", key: "local"},
              h(Upload, {...props},
                h(Button, {},
                  h(Icon, {type: 'upload'})
                  , '选择本地图片'))),
            h(TabPane, {tab: "远程获取", key: "remotely"},
              h(Input, {
                placeholder: '请输入图片地址',
                value: this.state.remotelyUrl,
                onChange: (e)=>this.setState({remotelyUrl: e.target.value})
              }))
          ),
        ),
        h(Modal, {
            title: '插入链接', visible: this.state.linkModal, onOk: this.handleAddLink,
            onCancel: () => this.setState({linkModal: false})
          },
          h(Input, {
            placeholder: '请输入链接地址',
            value: this.state.linkUrl,
            onChange: (e)=>this.setState({linkUrl: e.target.value})
          })
        ),
        h(Modal, {
            title: '编辑文章标签', visible: this.state.tagModal, onOk: () => this.setState({tagModal: false}),
            onCancel: () => this.setState({tagModal: false})
          },
          h(Select, {mode: 'multiple', style: {width: '100%'}, onChange: this.changeTags, value: this.state.tags},
            renderTagSelect
          ),
        ),
      )
    );
  }
}
