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

  useEffect(() => {
    let treatmentData = [];
    if (edit) {
      props.officeList.map((item, index) => {
        if (item.officeIndex === officeIndex) {
          props.officeList[index].treatment.map((treatData) => {
            treatmentData.push({
              treatmentIndex: treatData.treatmentIndex,
              treatmentName: treatData.treatmentName,
            });
          });
        }
      });

      setTreatmentList(treatmentData);
    }
  }, [edit]);

  const officeListView = () => {
    return props.officeList.length !== 0
      ? props.officeList.map((item, index) => {
          return (
            <Card
              title={
                edit && officeIndex === item.officeIndex ? (
                  <input
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
                        let alterTreatmentData = [];
                        let officeData;

                        await item.treatment.map((beforeData) => {
                          treatmentList.findIndex((i) => {
                            i.treatmentIndex === beforeData.treatmentIndex &&
                            i.treatmentName !== beforeData.treatmentName
                              ? alterTreatmentData.push([
                                  beforeData.treatmentName,
                                  i.treatmentName,
                                ])
                              : console.log();
                          });
                        });

                        if (alterTreatmentData.length !== 0) {
                          officeData = {
                            alterOfficeName: officeName,
                            alterTreatmentName: alterTreatmentData,
                          };
                        } else {
                          officeData = {
                            alterOfficeName: officeName,
                          };
                        }

                        const success = await OfficeActions.officeDataUpdate(
                          officeIndex,
                          officeData
                        );

                        if (success) {
                          await OfficeActions.getOffice();
                        }
                      }

                      await setOfficeIndex();
                      await setOfficeName("");
                      await setTreatmentList([]);
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
              {edit && officeIndex === item.officeIndex
                ? treatmentList.map((treatment) => {
                    return (
                      <p>
                        <input
                          value={treatment.treatmentName}
                          onChange={(e) => {
                            let changeDataList = [];
                            treatmentList.map((changeData) => {
                              if (
                                changeData.treatmentIndex ===
                                treatment.treatmentIndex
                              ) {
                                changeDataList.push({
                                  treatmentIndex: treatment.treatmentIndex,
                                  treatmentName: e.target.value,
                                });
                              } else {
                                changeDataList.push(changeData);
                              }
                            });
                            setTreatmentList(changeDataList);
                          }}
                        />
                      </p>
                    );
                  })
                : item.treatment.map((treatment, index) => {
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
