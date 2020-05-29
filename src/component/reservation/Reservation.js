import React, { useEffect, useState } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import "../../styles/reservation/Reservation.css";
import { EditableTable, EditableTable2 } from "./ReservationTable";
import { Redirect, Switch, Route, Link } from "react-router-dom";
import { SigninActions, ReservationActions } from "../../store/actionCreator";
import { removeData } from "../../utils/util";
import { connect } from "react-redux";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const Reservation = (props) => {
  useEffect(() => {
    ReservationActions.getWaitingReservations();
    ReservationActions.getAcceptedReservations();
    ReservationActions.getReservationLogs();
  }, []);

  return (
    <div>
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
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
                {/* <Menu.Item key="3">option3</Menu.Item>
                <Menu.Item key="4">option4</Menu.Item> */}
              </SubMenu>
              {/* <SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
                <Menu.Item key="5">option5</Menu.Item>
                <Menu.Item key="6">option6</Menu.Item>
                <Menu.Item key="7">option7</Menu.Item>
                <Menu.Item key="8">option8</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub3"
                icon={<NotificationOutlined />}
                title="subnav 3"
              >
                <Menu.Item key="9">option9</Menu.Item>
                <Menu.Item key="10">option10</Menu.Item>
                <Menu.Item key="11">option11</Menu.Item>
                <Menu.Item key="12">option12</Menu.Item>
              </SubMenu> */}
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
                  <EditableTable reservationList={props.acceptedList} />
                </Route>
                <Route path="/reservationList/nav3">
                  <EditableTable2 reservationList={props.historyList} />
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

  reservationList: state.reservation.reservationList,
  acceptedList: state.reservation.acceptedList,
  historyList: state.reservation.historyList,
}))(Reservation);
