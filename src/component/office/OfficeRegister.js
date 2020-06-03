import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Card, Popconfirm } from "antd";
import { OfficeActions } from "../../store/actionCreator";

const OfficeRegister = (props) => {
  return (
    <Card title="진료실 등록">
      <div style={{ display: "inline" }}>
        <Card
          style={{ width: "50%" }}
          type="inner"
          title="담당의"
          extra={<a href="#">More</a>}
        ></Card>
        <Card
          style={{ width: "50%" }}
          type="inner"
          title="진료실"
          extra={<a href="#">More</a>}
        ></Card>
        <Card
          style={{ width: "50%" }}
          type="inner"
          title="진료 항목"
          extra={<a href="#">More</a>}
        ></Card>
      </div>
    </Card>
  );
};

export default connect((state) => ({
  officeList: state.office.officeList,
}))(OfficeRegister);
