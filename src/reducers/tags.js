import { RECEIVE_TAGS } from '../actions/tags'

export default function tags(state = [], action) {
  switch (action.type) {
    case RECEIVE_TAGS:
      return action.tags
    default:
      return state
  }
}
