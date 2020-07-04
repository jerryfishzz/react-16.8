import { EditorState } from "draft-js";

export const usingEditors = ['draft', 'md']

const draftData = () => ({
  id: '',
  question: EditorState.createEmpty(),
  title: '',
  tags: [],
  answers: [{
    content: EditorState.createEmpty(),
    correctness: false,
    note: EditorState.createEmpty()
  }],
  otherNotes: EditorState.createEmpty()
})

const mdData = () => ({
  id: '',
  question: '',
  title: '',
  tags: [],
  answers: [{
    content: '',
    correctness: false,
    note: ''
  }],
  otherNotes: ''
})

export const dataGenerator = () => {
  if (usingEditors.length === 1) {
    return usingEditors[0] === 'draft'
      ? draftData()
      : mdData()
  }
  return {
    draft: draftData(),
    md: mdData()
  }
}