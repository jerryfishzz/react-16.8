import { combineReducers } from "redux";
import test from "./test/test";
import tags from "./tags";
import postType from "./postType";


export default combineReducers({
  test,
  tags,
  postType
})