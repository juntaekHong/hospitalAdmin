import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Card } from "antd";
import { OfficeActions } from "../../store/actionCreator";

// "result": [
//     {
//       "officeIndex": 15,
//       "hpid": "A1100008",
//       "officeName": "김똘띵 선생님 - 소아과",
//       "createdAt": "2020-04-06T13:46:09.000Z",
//       "updatedAt": "2020-04-06T14:03:51.000Z",
//       "treatment": [
//         {
//           "treatmentIndex": 7,
//           "officeIndex": 15,
//           "treatmentName": "구토"
//         },
//         {
//           "treatmentIndex": 6,
//           "officeIndex": 15,
//           "treatmentName": "열"
//         }
//       ]
//     },

const OfficeList = (props) => {
  useEffect(() => {
    OfficeActions.getOffice(props.hospital.hpid);
  }, []);

  return (
    <div>
      <Card
        title="진료 정보"
        extra={<a href="#">수정</a>}
        style={{ width: 300 }}
      >
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
    </div>
  );
};
export default connect((state) => ({
  hospital: state.signin.hospital,
}))(OfficeList);
