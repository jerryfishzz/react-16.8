import { RECEIVE_TAGS, ADD_TAG } from '../actions/tags'

export default function tags(state = [], action) {
  switch (action.type) {
    case RECEIVE_TAGS:
      return action.tags
    case ADD_TAG:
      return [
        ...state,
        action.newTag
      ]
    default:
      return state
  }
}
