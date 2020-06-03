import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Card } from "antd";
import { OfficeActions } from "../../store/actionCreator";

const OfficeList = (props) => {
  const [edit, setEdit] = useState(false);
  const [officeIndex, setOfficeIndex] = useState();
  const [officeName, setOfficeName] = useState("");
  const [treatmentList, setTreatmentList] = useState([]);

  useEffect(() => {
    OfficeActions.getOffice();
  }, []);

  const officeListView = () => {
    return props.officeList.length !== 0
      ? props.officeList.map((item, index) => {
          return (
            <Card
              title={
                edit && officeIndex === item.officeIndex ? (
                  <input
                    name={"officeName"}
                    value={officeName}
                    onChange={async (e) => {
                      await setOfficeName(e.target.value);
                    }}
                  />
                ) : (
                  item.officeName
                )
              }
              extra={
                <button
                  onClick={async () => {
                    if (edit) {
                      if (item.officeIndex === officeIndex) {
                        const officeData = {
                          alterOfficeName: officeName,
                        };

                        const success = await OfficeActions.officeDataUpdate(
                          officeIndex,
                          officeData
                        );

                        if (success) {
                          await OfficeActions.getOffice();
                        }
                      }

                      setOfficeIndex();
                      setOfficeName("");
                      setTreatmentList([]);
                    }

                    await setOfficeIndex(item.officeIndex);
                    await setOfficeName(item.officeName);
                    await setTreatmentList(item.treatment);
                    await setEdit(!edit);
                  }}
                >
                  {edit && officeIndex === item.officeIndex ? "완료" : "수정"}
                </button>
              }
              style={{
                width: 300,
                display: "inline-block",
                marginRight: 30,
                marginBottom: 30,
                verticalAlign: "top",
              }}
            >
              {item.treatment.map((treatment, index) => {
                return edit && officeIndex === item.officeIndex ? (
                  <p>
                    <input
                      name={"treament"}
                      value={treatment.treatmentName}
                      onChange={async (e) => {}}
                    />
                  </p>
                ) : (
                  <p>{treatment.treatmentName}</p>
                );
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
