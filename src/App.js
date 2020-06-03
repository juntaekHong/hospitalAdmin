import React, { useState, useEffect } from "react";
import "./App.css";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";

import NormalLoginForm from "./component/login/NormalLoginForm";
import { getData } from "./utils/util";
import Reservation from "./component/reservation/Reservation";
import SignUp from "./component/signup/SignUp";
import { NoMatch } from "./component/NoMatch";
import { SigninActions } from "./store/actionCreator";

const App = (props) => {
  useEffect(() => {
    const token = getData("token");

    Promise.all([token]).then(() => {
      token.then(async (value) => {
        if (value !== null) {
          await SigninActions.handleSinginInit(token);
        }
      });
    });
  }, []);
  return (
    <div className="App">
      {/* {firstPage ? (
        <NormalLoginForm
          setFirstPage={setFirstPage}
          setToken={setToken}
          setComp={setComp}
        />
      ) : (
        <main children={comp} token={token} />
      )} */}
      <Switch>
        <Route exact path="/">
          {props.access_token !== null ? (
            <Redirect to="/reservationList" />
          ) : (
            <NormalLoginForm />
          )}
        </Route>
        {/* 로그인 후, 병원 관리 데이터 페이지로 이동 */}
        <Route path="/reservationList">
          <Reservation />
        </Route>
        {/* 회원가입 */}
        <Route path="/register">
          <SignUp />
        </Route>
        {/* 잘못된 URL 입력 */}
        <Route component={NoMatch} />
      </Switch>
    </div>
  );
};

export default connect((state) => ({
  hospital: state.signin.hospital,
  access_token: state.signin.access_token,
}))(App);
