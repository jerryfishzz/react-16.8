import { addTagToDB } from "../utils/api";

export const RECEIVE_TAGS = 'RECEIVE_TAGS'
export const ADD_TAG = 'ADD_TAG'

export function receiveTags(tags) {
  return {
    type: RECEIVE_TAGS,
    tags
  }
}

// export function handleReceiveTags() {
//   return async dispatch => {
//     try {
//       const tags = await getTags()

//       dispatch(receiveTags(tags))
//     } catch(err) {
//       throw Error('Get Tags error')
//     }
//   }
// }

function addTag(newTag) {
  return {
    type: ADD_TAG,
    newTag
  }
}

export function handleAddTagToDB(newTag) {
  return async dispatch => {
    try {
      await addTagToDB(newTag)

      dispatch(addTag(newTag))
    } catch(err) {
      throw Error('Add tag error')
    }
  }
}
