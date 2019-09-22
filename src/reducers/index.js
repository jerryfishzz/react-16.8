import { combineReducers } from "redux";
import test from "./test/test";
import tags from "./tags";
import questionList from "./questionList";


export default combineReducers({
  test,
  tags,
  questionList
})