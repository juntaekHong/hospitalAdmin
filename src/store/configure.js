/**
 * redux store 설정
 */
import { createStore, applyMiddleware } from "redux";
import modules from "./modules";
import ReduxThunk from "redux-thunk";
const configure = createStore(modules, applyMiddleware(ReduxThunk));
export default configure;
