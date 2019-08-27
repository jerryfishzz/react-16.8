<button onClick={this.onToggleCode}>Code Block</button>
          <TextField
            multiline
            rows="4"
            margin="normal"
            fullWidth
            variant="outlined"
            className={classes.white}
            InputProps={{
              endAdornment: (
                <div 
                  className={classes.draftContent} 
                  onClick={this.getFocus} 
                  onBlur={this.loseFocus}
                >
                  <div className={this.state.isFocus ? classes.editor : classes.editor1}>
                    
                    <Editor
                      editorState={this.state.test.data.otherNotes}
                      onChange={this.handleDraftChange}
                      placeholder='Hello'
                      ref={this.setDomEditorRef}
                    />
                  </div>
                </div>
              ),
            }}
            </TextField>

{
  "blocks":[
    {"key":"1no0a","text":"sssssss","type":"code-block","depth":0,"inlineStyleRanges":[{"offset":0,"length":7,"style":"CODE"}],"entityRanges":[],"data":{}},
    {"key":"bhsrl","text":"fgh","type":"code-block","depth":0,"inlineStyleRanges":[{"offset":0,"length":3,"style":"CODE"}
  ],
  "entityRanges":[],
  "data":{}}],
  "entityMap":{}
}

{"blocks":[{"key":"a8dqk","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}