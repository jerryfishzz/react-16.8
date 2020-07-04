import React from 'react'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({html, text}) {    
  console.log('handleEditorChange', html, text)
}

function MarkdownEditor(props) {
  const { mdConfig: { config, isReadOnly }} = props

  return (
    <MdEditor
      value="## 手把手教你写一个markdown编辑器"
      style={{ height: "200px", border: 0 }}
      renderHTML={(text) => mdParser.render(text)}
      onChange={handleEditorChange}
      readOnly={isReadOnly}
      config={config}
    />
  )
}

export default MarkdownEditor
