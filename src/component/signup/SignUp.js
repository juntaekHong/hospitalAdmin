import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Tooltip,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  notification,
  Modal,
} from "antd";
import {
  QuestionCircleOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { SignupActions } from "../../store/actionCreator";
import { AudioOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

const { Search } = Input;

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: "#1890ff",
    }}
  />
);

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;
const residences = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men",
          },
        ],
      },
    ],
  },
];
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const openNotification = (message) => {
  const args = {
    message: "가입 실패!",
    description: message
      ? message
      : "병원 주소 검색후, 해당하는 병원을 선택하여야 합니다!",
    duration: 0,
  };
  notification.open(args);
};

const SignUp = (props) => {
  const [form] = Form.useForm();
  const [hpList, setHpList] = useState(props.hpIdList);

  useEffect(() => {
    let view = [];

    if (props.hpIdList.length !== 0) {
      const promise1 = props.hpIdList.map((item) => {
        view.push(
          <div>
            <button
              onClick={async () => {
                await setHospitalId(item.hpid);
                await setHospitalName(item.hospitalName);

                await setModal(false);
              }}
            >
              {item.hospitalName}
            </button>
          </div>
        );
      });

      Promise.all([promise1]).then(async () => {
        await setSearchResultView(view);
      });
    } else {
      setSearchResultView(<div>검색 결과가 없습니다!</div>);
    }
  }, [props.hpIdList]);

  const [searchResultView, setSearchResultView] = useState(
    <div>검색 결과가 없습니다!</div>
  );

  const [modal, setModal] = useState(false);

  const [hospitalName, setHospitalName] = useState("");
  const [hospitalId, setHospitalId] = useState("");

  const [signup, setSingup] = useState(false);

  const handleOk = async (e) => {
    await setModal(false);
  };

  const handleCancel = async (e) => {
    await setModal(false);
  };

  const onFinish = async (values) => {
    if (hospitalName !== "" && hospitalId !== "") {
      const hospitalData = {
        hpid: hospitalId,
        email: values.email,
        hospitalUserPw: values.password,
        tel: values.phone,
      };

      const success = await SignupActions.signUp(hospitalData);

      if (success !== true) {
        await openNotification(success);
      } else {
        await setSingup(success);
      }
    } else {
      await openNotification();
    }
  };

  //   const prefixSelector = (
  //     <Form.Item name="prefix" noStyle>
  //       <Select
  //         style={{
  //           width: 70,
  //         }}
  //       >
  //         <Option value="82">+82</Option>
  //         <Option value="86">+86</Option>
  //       </Select>
  //     </Form.Item>
  //   );
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);

  const onWebsiteChange = (value) => {
    if (!value) {
      setAutoCompleteResult([]);
    } else {
      setAutoCompleteResult(
        [".com", ".org", ".net"].map((domain) => `${value}${domain}`)
      );
    }
  };

  const websiteOptions = autoCompleteResult.map((website) => ({
    label: website,
    value: website,
  }));
  return (
    <Form
      style={{
        width: "100%",
        paddingRight: "25%",
      }}
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        residence: ["zhejiang", "hangzhou", "xihu"],
        prefix: "86",
      }}
      scrollToFirstError
    >
      <h1 style={{ paddingLeft: "25%" }}>가입 등록</h1>
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: "email",
            message: "The input is not valid E-mail!",
          },
          {
            required: true,
            message: "Please input your E-mail!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }

              return Promise.reject(
                "The two passwords that you entered do not match!"
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="hospitalAddress"
        label={<span>Hospital Address&nbsp;</span>}
        rules={[
          {
            required: false,
            message: "Please input your Hospital Address!",
            whitespace: true,
          },
        ]}
      >
        <Search
          placeholder="input search text"
          enterButton="Search"
          size="large"
          onSearch={async (value) => {
            await SignupActions.searchHospital(value);

            await setModal(true);

            // await setHospitalName(value);
            // await setHospitalId(value);
          }}
        />
      </Form.Item>

      <Modal
        title="병원 주소 검색 결과"
        visible={modal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {searchResultView}
      </Modal>

      <Form.Item
        label="Hospital Name"
        rules={[
          {
            required: true,
            message: "Please input your hospital address!",
          },
        ]}
      >
        <Input name="hospitalName" value={hospitalName} disabled />
      </Form.Item>

      <Form.Item
        label="Hospital Id"
        rules={[
          {
            required: true,
            message: "Please input your hospital address!",
          },
        ]}
      >
        <Input name="HospitalId" value={hospitalId} disabled />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[
          {
            required: true,
            message: "Please input your phone number!",
          },
        ]}
      >
        <Input
          //   addonBefore={prefixSelector}
          style={{
            width: "100%",
          }}
        />
      </Form.Item>

      <Form.Item
        name="website"
        label="Website"
        rules={[
          {
            required: false,
            message: "Please input website!",
          },
        ]}
      >
        <AutoComplete
          options={websiteOptions}
          onChange={onWebsiteChange}
          placeholder="website"
        >
          <Input />
        </AutoComplete>
      </Form.Item>

      <Form.Item
        label="Captcha"
        extra="We must make sure that your are a human."
      >
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="captcha"
              noStyle
              rules={[
                {
                  required: false,
                  message: "Please input the captcha you got!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Button>Get captcha</Button>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject("Should accept agreement"),
          },
        ]}
        {...tailFormItemLayout}
      >
        <Checkbox>
          I have read the <a href="">agreement</a>
        </Checkbox>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          {!signup ? "Register" : <Redirect to="/" />}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default connect((state) => ({
  hpIdList: state.signup.hpIdList,
}))(SignUp);
