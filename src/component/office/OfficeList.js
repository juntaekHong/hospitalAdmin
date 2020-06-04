import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Card, Popconfirm, notification } from "antd";
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

  const openNotification = (title, message) => {
    const args = {
      message: title,
      description: message
        ? message
        : "입력하지 않았거나 수정 완료를 하지 않은 항목이 있습니다.",
      duration: 0,
    };
    notification.open(args);
  };

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
                <div>
                  <Popconfirm
                    title={`정말 ${
                      edit && officeIndex === item.officeIndex ? "완료" : "수정"
                    }하시겠습니까?`}
                    onConfirm={async () => {
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
                            await openNotification(
                              "수정 완료!",
                              "정상적으로 진료실 정보를 수정하였습니다."
                            );
                          } else {
                            await openNotification(
                              "수정 실패!",
                              "다시 시도해 주세요."
                            );
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
                    <a>
                      {edit && officeIndex === item.officeIndex
                        ? "완료"
                        : "수정"}
                    </a>
                  </Popconfirm>
                  <span> </span>
                  <Popconfirm
                    title="정말 삭제하시겠습니까?"
                    onConfirm={async () => {
                      const success = await OfficeActions.officeDelete(
                        item.officeIndex
                      );

                      if (success) {
                        await OfficeActions.getOffice();
                        await openNotification(
                          "삭제 완료!",
                          "정상적으로 진료실 정보를 삭제하였습니다!"
                        );
                      } else {
                        await openNotification(
                          "삭제 실패!",
                          "다시 시도해 주세요."
                        );
                      }
                    }}
                  >
                    <a>삭제</a>
                  </Popconfirm>
                </div>
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
  officeList: state.office.officeList,
}))(OfficeList);
