import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { RichUtils, getDefaultKeyBinding } from 'draft-js';
import Editor from 'draft-js-plugins-editor'
import { Tooltip, Grid } from '@material-ui/core';
import CodeUtils from 'draft-js-code'

const useStyles = makeStyles(theme => ({
  editor: {
    border: '1px solid',
    padding: 10,
    borderRadius: 4,
    backgroundColor: theme.palette.background.paper,
    overflowX: 'auto'
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
}));

export default function DraftEditor(props) {
  const classes = useStyles();
  const { contents } = props

  const onChange = editorState => {
    props.handleDraftChange(editorState)
  }

  // This method looks only deal with those commands
  // which can modify the editor content.
  // Keys like left, right, up, and down won't go to this method.
  const handleKeyCommand = (command, editorState) => {
    let newState;

    // If in code block, use draft js code to create the new state
    if (CodeUtils.hasSelectionInBlock(editorState)) {
      newState = CodeUtils.handleKeyCommand(editorState, command);
    }

    if (!newState) {
      newState = RichUtils.handleKeyCommand(editorState, command);
    }

    if (newState) {
      onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  // This method will take all the commands from the keyboard,
  // whatever it modifies the content or not,
  // such as left, right, up, and down.
  const keyBindingFn = (evt) => {
    if (!CodeUtils.hasSelectionInBlock(contents)) return getDefaultKeyBinding(evt);

    // If in code block and command is tab
    if (evt.keyCode === 9) {
      const newEditorState = CodeUtils.onTab(
        evt,
        contents,
        2, /* maxDepth */
      );
      if (newEditorState !== contents) {
        onChange(newEditorState);
      }
      return
    }
    return getDefaultKeyBinding(evt);
  }

  // Use this method to handle return key specifically.
  // Command can either go to handleKeyCommand method or not.
  const handleReturn = (evt) => {
    // If not in code block, fall through to default handler behavior.
    // Command will go to handleKeyCommand.
    if (!CodeUtils.hasSelectionInBlock(contents)) return 'not-handled';

    // If code block, use library handler behavior.
    // Command won't go to handleKeyCommand.
    onChange(CodeUtils.handleReturn(evt, contents));
    return 'handled';
  }

  // Add a style specifically for code block in editor
  const myBlockStyleFn = contentBlock => {
    const type = contentBlock.getType();
    if (type === 'code-block') {
      return 'superFancyBlockquote';
    }
  }

  const onUnderlineClick = e => {
    e.preventDefault()
    onChange(RichUtils.toggleInlineStyle(contents, 'UNDERLINE'));
  }

  const onToggleCode = e => {
    e.preventDefault()
    onChange(RichUtils.toggleCode(contents));
  }

  return (
    
    <Grid container direction="column" className={classes.editor}>
      <Grid item>
        <button 
          onClick={onUnderlineClick}
          className={classes.btn}
        >
          Underline
        </button>

        <Tooltip title="CTRL+J">
          <button 
            onClick={onToggleCode}
            className={classes.btn}
          >
            Code Block
          </button>
        </Tooltip>
      </Grid>

      <Grid item>
        <Editor
          editorState={contents}
          onChange={onChange}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={keyBindingFn}
          handleReturn={handleReturn}
          blockStyleFn={myBlockStyleFn}
        />
      </Grid>
    </Grid>
  );
}