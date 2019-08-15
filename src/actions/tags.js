import { getTags } from "../utils/api";

export const RECEIVE_TAGS = 'RECEIVE_TAGS'

function receiveTags(tags) {
  return {
    type: RECEIVE_TAGS,
    tags
  }
}

export function handleReceiveTags() {
  return async dispatch => {
    try {
      const tags = await getTags()

      dispatch(receiveTags(tags))
    } catch(err) {
      throw Error('Get Tags error')
    }
  }
}

