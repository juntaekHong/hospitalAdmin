/**
 * store에 들어갈 reducer 모음
 */
import { combineReducers } from "redux";

import signin from "./sign/signin";
import signup from "./sign/signup";
import reservation from "./reservation/reservation";
import office from "./office/office";

export default combineReducers({
  signin,
  signup,
  reservation,
  office,
});
