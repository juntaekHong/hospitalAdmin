import React from "react";
// import axios from "axios";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "../../styles/login/NormalLoginForm.css";
import { SigninActions } from "../../store/actionCreator";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Img } from "react-image";

// 병원 리스트 호출
const NormalLoginForm = (props) => {
  const onFinish = async (values) => {
    const loginData = JSON.stringify({
      email: values.admin_email,
      hospitalUserPw: values.password,
    });

    await SigninActions.signIn(loginData);
  };

  return (
    <div
      style={{
        paddingLeft: "35%",
        paddingRight: "35%",
        paddingTop: "5%",
        paddingBottom: "10%",
      }}
    >
      <img
        style={{ width: "200px" }}
        src={require("../../image/hospital.png")}
      />
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="admin_email"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          Or <Link to="/register">register now!</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect((state) => ({
  hospital: state.signin.hospital,
  access_token: state.signin.access_token,
}))(NormalLoginForm);
