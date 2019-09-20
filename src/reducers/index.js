import { combineReducers } from "redux";
import test from "./test/test";
import tags from "./tags";
import postType from "./postType";
import questionList from "./questionList";


export default combineReducers({
  test,
  tags,
  postType,
  questionList
})