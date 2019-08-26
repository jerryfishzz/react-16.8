import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Editor, EditorState, RichUtils } from 'draft-js';

const useStyles = makeStyles({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: 8,
    flex: 1,
    backgroundColor: 'white',
    padding: 6
  },
  draftContent: {
    flex: 1
  },
  editor: {
    border: '1px solid',
    padding: 10,
  },
  btn: {
    background: '#999',
    color: '#fff',
    border: 'none',
    padding: '.5em',
    cursor: 'pointer',
    marginBottom: '1em',
    marginRight: '1em',
    borderRadius: '.2em',
    '&:hover': {
      background: '#888',
    }
  },
  
});

function myBlockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  if (type === 'code-block') {
    return 'superFancyBlockquote';
  }
}

export default function ForTest() {
  const classes = useStyles();
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const onChange = editorState => {
    setEditorState(editorState)
  }

  const handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  const onUnderlineClick = () => {
    onChange(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
  }

  const onToggleCode = () => {
    onChange(RichUtils.toggleCode(editorState));
  }

  return (
    <Paper className={classes.root}>
      <div className={classes.draftContent}>
        <div className={classes.editor}>
          <button 
            onClick={onUnderlineClick}
            className={classes.btn}
          >
            Underline
          </button>
          <button 
            onClick={onToggleCode}
            className={classes.btn}
          >
            Code Block
          </button>
          <Editor
            editorState={editorState}
            onChange={onChange}
            handleKeyCommand={handleKeyCommand}
            blockStyleFn={myBlockStyleFn}
          />
        </div>
      </div>
      <style type="text/css">
        {`
        .superFancyBlockquote {
          color: red;
          font-family: 'Hoefler Text', Georgia, serif;
          font-style: italic;
          text-align: center;
        }

        pre {
          border: 1px solid #ccc;
          background: #f0f0f0;
          border-radius: .2em;
          padding: .5em;
          margin: 0;
        }


        pre > pre {
          background: none;
          border: none;
          padding: 0;
        }
        `}
      </style>
    </Paper>
  );
}