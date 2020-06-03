import React, { useEffect, useState } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import "../../styles/reservation/Reservation.css";
import {
  EditableTable,
  EditableTable2,
  EditableTable3,
} from "./ReservationTable";
import { Redirect, Switch, Route, Link } from "react-router-dom";
import { SigninActions, ReservationActions } from "../../store/actionCreator";
import { removeData, getData } from "../../utils/util";
import { connect } from "react-redux";
import OfficeList from "../office/OfficeList";
import OfficeRegister from "../office/OfficeRegister";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const Reservation = (props) => {
  useEffect(() => {
    ReservationActions.getWaitingReservations();
    ReservationActions.getAcceptedReservations();
    ReservationActions.getReservationLogs();

    getData("hospital").then(async (value) => {
      await SigninActions.handleHospitalData(value);

      await SigninActions.getHospital(JSON.parse(value).hpid);
    });
  }, []);

  return (
    <div>
      <Layout>
        <Header className="header">
          <div className="logo">
            {props.img ? (
              <img
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "80px",
                  width: "80px",
                }}
                src={props.img}
              />
            ) : (
              <img
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "80px",
                  width: "80px",
                }}
                src={require("../../image/hospital.png")}
              />
            )}
          </div>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
            <Menu.Item key="2">관리 정보</Menu.Item>
            <Menu.Item
              key="3"
              onClick={async () => {
                await removeData("token");
                await removeData("hospital");
                await SigninActions.handleSinginInit(null);
              }}
            >
              {props.access_token ? "LogOut" : <Redirect to="/" />}
            </Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              style={{ height: "100%", borderRight: 0 }}
            >
              <SubMenu key="sub1" icon={<UserOutlined />} title="예약내역">
                <Menu.Item key="1">
                  <Link to="/reservationList">{"예약 대기"}</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/reservationList/nav2">{"수락 내역"}</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to="/reservationList/nav3">{"지난 내역"}</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" icon={<LaptopOutlined />} title="진료실">
                <Menu.Item key="5">
                  <Link to="/reservationList/nav4">{"진료실 조회"}</Link>
                </Menu.Item>
                <Menu.Item key="6">
                  <Link to="/reservationList/nav5">{"진료실 등록"}</Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <Switch>
                <Route exact path="/reservationList/">
                  <EditableTable reservationList={props.reservationList} />
                </Route>
                <Route path="/reservationList/nav2">
                  <EditableTable2 reservationList={props.acceptedList} />
                </Route>
                <Route path="/reservationList/nav3">
                  <EditableTable3 reservationList={props.historyList} />
                </Route>
                <Route path="/reservationList/nav4">
                  <OfficeList />
                </Route>
                <Route path="/reservationList/nav5">
                  <OfficeRegister />
                </Route>
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
};

export default connect((state) => ({
  hospital: state.signin.hospital,
  access_token: state.signin.access_token,
  img: state.signin.img,

  reservationList: state.reservation.reservationList,
  acceptedList: state.reservation.acceptedList,
  historyList: state.reservation.historyList,
}))(Reservation);
