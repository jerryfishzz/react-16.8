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

function MarkdownEditor() {
  const config = {
    view: { menu: false, md: false, html: true },
    canView: { menu: true, md: true, html: true, fullScreen: false, hideMenu: false },
  }

  return (
    <MdEditor
      value="## 手把手教你写一个markdown编辑器"
      style={{ height: "500px", border: 0 }}
      renderHTML={(text) => mdParser.render(text)}
      onChange={handleEditorChange}
      readOnly={true}
      config={config}
    />
  )
}

export default MarkdownEditor
