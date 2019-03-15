var React = require('react');
var PropTypes = require('prop-types');
import {Controlled  as CodeMirror} from 'react-codemirror2'

require('codemirror/mode/markdown/markdown');

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.doc=null;
        this.state={
            code: this.props.value,
            readOnly: false,
            mode: 'markdown',
        }
    }
    componentDidMount=()=>{
        this.props.findChildFunc(this.insertValue)
    }
    componentWillReceiveProps=(nextProps)=>{
        if(this.props.value !== nextProps.value){
            this.setState({
                code:nextProps.value
            })
        }
    }
    updateCode =(newCode)=> {
        this.props.onChange(newCode);
    }
    insertValue=(value)=>{
        this.instance.doc.cm.replaceSelection(value);
        this.instance.doc.cm.focus()
    }
    render() {
        var options = {
            lineNumbers: true,
            theme: 'monokai',
            mode:this.state.mode,
            readOnly:this.state.readOnly
        };
        return (
               <CodeMirror
                   className="myCodemirror"  ref={(c) => this.cm = c}  value={this.state.code}
                             onBeforeChange={(editor, data, code) => {
                                 this.setState({code});
                             }}
                            editorDidMount={editor => { this.instance = editor }}
                             onChange={(editor, data, value)=>this.updateCode(value)} options={options}  />
        );
    }
}

Editor.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string
};

export default  Editor;
