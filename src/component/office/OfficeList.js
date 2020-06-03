import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Card } from "antd";
import { OfficeActions } from "../../store/actionCreator";

const OfficeList = (props) => {
  useEffect(() => {
    OfficeActions.getOffice();
  }, []);

  return (
    <div>
      {props.officeList.length !== 0
        ? props.officeList.map((item) => {
            return (
              <Card
                title="진료 정보"
                extra={<a href="#">수정</a>}
                style={{ width: 300 }}
              >
                <p>{item.officeName}</p>
                {item.treatment.map((treatment) => {
                  return <p>{treatment.treatmentName}</p>;
                })}
              </Card>
            );
          })
        : null}
    </div>
  );
};
export default connect((state) => ({
  hospital: state.signin.hospital,
  officeList: state.office.officeList,
}))(OfficeList);
