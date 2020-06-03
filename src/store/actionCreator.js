/**
 * bindActionCreators 모듈화
 */
import { bindActionCreators } from "redux";
import * as signin from "./modules/sign/signin";
import * as signup from "./modules/sign/signup";
import * as reservation from "./modules/reservation/reservation";
import * as office from "./modules/office/office";
import store from "./index";

const { dispatch } = store;

export const SigninActions = bindActionCreators(signin, dispatch);
export const SignupActions = bindActionCreators(signup, dispatch);
export const ReservationActions = bindActionCreators(reservation, dispatch);
export const OfficeActions = bindActionCreators(office, dispatch);
