import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Card } from "antd";
import { OfficeActions } from "../../store/actionCreator";

const OfficeList = (props) => {
  useEffect(() => {
    OfficeActions.getOffice();
  }, []);

  const officeListView = () => {
    return props.officeList.length !== 0
      ? props.officeList.map((item, index) => {
          return (
            <Card
              title={item.officeName}
              extra={<a href="#">수정</a>}
              style={
                index === props.officeList.length - 1 && index % 2 === 1
                  ? {
                      width: 300,
                      display: "inline-block",
                      marginRight: 30,
                      marginBottom: 30,
                      verticalAlign: "top",
                      float: "left",
                    }
                  : {
                      width: 300,
                      display: "inline-block",
                      marginRight: 30,
                      marginBottom: 30,
                      verticalAlign: "top",
                    }
              }
            >
              {item.treatment.map((treatment) => {
                return <p>{treatment.treatmentName}</p>;
              })}
            </Card>
          );
        })
      : null;
  };

  return <div>{officeListView()}</div>;
};
export default connect((state) => ({
  hospital: state.signin.hospital,
  officeList: state.office.officeList,
}))(OfficeList);
