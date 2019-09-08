import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { RichUtils } from 'draft-js';
import clearFormatting from 'draft-js-clear-formatting'
import Editor from 'draft-js-plugins-editor'

const useStyles = makeStyles({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  draftContent: {
    flex: 1,
    marginTop: 12,
    marginBottom: 8
  },
  editor: {
    border: '1px solid',
    padding: 10,
    borderRadius: 4,
    backgroundColor: 'white'
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

export default function DraftEditor(props) {
  const classes = useStyles();

  const onChange = editorState => {
    props.handleDraftChange(editorState)
  }

  const handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(props.contents, command);

    if (newState) {
      onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  const onUnderlineClick = e => {
    e.preventDefault()
    onChange(RichUtils.toggleInlineStyle(props.contents, 'UNDERLINE'));
  }

  const onToggleCode = e => {
    e.preventDefault()
    onChange(RichUtils.toggleCode(props.contents));
  }

  return (
    <Fragment>
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
            editorState={props.contents}
            onChange={onChange}
            handleKeyCommand={handleKeyCommand}
          />
        </div>
      </div>
      <style type="text/css">
        {`
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
    </Fragment>
  );
}