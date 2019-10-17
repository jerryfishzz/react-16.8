import { combineReducers } from "redux";
import test from "./test/test";
import tags from "./tags";
import questionList from "./questionList";
import appStatus from "./appStatus";
import snackBar from "./snackBar";

export default combineReducers({
  test,
  tags,
  questionList,
  appStatus,
  snackBar
})