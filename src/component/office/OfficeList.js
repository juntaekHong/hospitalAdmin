import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Card, Popconfirm, notification, Button } from "antd";
import { OfficeActions } from "../../store/actionCreator";
import {
  PlusOutlined,
  CheckCircleTwoTone,
  EditTwoTone,
  MinusCircleTwoTone,
} from "@ant-design/icons";

const OfficeList = (props) => {
  // 편집모드
  const [edit, setEdit] = useState(false);
  // 진료실 인덱스
  const [officeIndex, setOfficeIndex] = useState();
  // 진료실 이름(담당의 이름 포함)
  const [officeName, setOfficeName] = useState("");
  // 진료항목 리스트
  const [treatmentList, setTreatmentList] = useState([]);
  // 삭제할 진료항목 인덱스
  const [deleteTreatmentIndex, setDeleteTreatmentIndex] = useState([]);
  // 진료항목 추가 리스트
  const [addTreatmentList, setAddTreatmentList] = useState([]);

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

  const onChanged = (data, searchIndex, value) => {
    let datas = [];

    data.map((item, index) => {
      if (index === searchIndex) {
        datas.push({ treatment: value });
      } else {
        datas.push(item);
      }
    });

    setAddTreatmentList(datas);
  };

  const onClicked = (data, index) => {
    let currentList = [];
    data.map((item, cancelIndex) => {
      if (index === cancelIndex) {
      } else {
        currentList.push(item);
      }
    });

    setAddTreatmentList(currentList);
  };

  const addTreatmentView = () => {
    let list = [];
    let data = addTreatmentList;

    addTreatmentList.map((item, index) => {
      list.push(
        <p>
          <input
            value={addTreatmentList[index].treatment}
            onChange={async (e) => {
              onChanged(data, index, e.target.value);
            }}
          />
          <Button
            type="link"
            icon={<MinusCircleTwoTone twoToneColor={"#dc3545"} />}
            onClick={() => {
              onClicked(data, index);
            }}
          />
        </p>
      );
    });

    return list;
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
                          let newTreat = [];

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

                          await addTreatmentList.map((item) => {
                            if (item.treatment !== "") {
                              newTreat.push(item.treatment);
                            }
                          });

                          if (
                            alterTreatmentData.length !== 0 &&
                            newTreat.length !== 0
                          ) {
                            officeData = {
                              alterOfficeName: officeName,
                              alterTreatmentName: alterTreatmentData,
                              newTreatmentNameArr: newTreat,
                            };
                          } else if (alterTreatmentData.length !== 0) {
                            officeData = {
                              alterOfficeName: officeName,
                              alterTreatmentName: alterTreatmentData,
                            };
                          } else if (newTreat.length !== 0) {
                            officeData = {
                              alterOfficeName: officeName,
                              newTreatmentNameArr: newTreat,
                            };
                          }

                          await deleteTreatmentIndex.map(
                            async (treatmentIndex) => {
                              await OfficeActions.treatmentDelete(
                                treatmentIndex
                              );
                            }
                          );

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
                        await setDeleteTreatmentIndex([]);
                      }

                      await setOfficeIndex(item.officeIndex);
                      await setOfficeName(item.officeName);
                      await setTreatmentList(item.treatment);
                      await setAddTreatmentList([]);
                      await setEdit(!edit);
                    }}
                  >
                    <a>
                      {edit && officeIndex === item.officeIndex ? (
                        <Button
                          type="link"
                          icon={<CheckCircleTwoTone twoToneColor={"#52c41a"} />}
                        />
                      ) : (
                        <Button type="link" icon={<EditTwoTone />} />
                      )}
                    </a>
                  </Popconfirm>
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
                    <Button
                      type="link"
                      icon={<MinusCircleTwoTone twoToneColor={"#dc3545"} />}
                    />
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
                        <Button
                          type="link"
                          icon={<MinusCircleTwoTone twoToneColor={"#dc3545"} />}
                          onClick={async () => {
                            await setDeleteTreatmentIndex([
                              ...deleteTreatmentIndex,
                              treatment.treatmentIndex,
                            ]);

                            const deleteIndex = await treatmentList.findIndex(
                              (i) =>
                                i.treatmentIndex === treatment.treatmentIndex
                            );

                            let changeList = [];

                            await treatmentList.map((item, index) => {
                              if (index !== deleteIndex) {
                                changeList.push(item);
                              } else {
                              }
                            });

                            await setTreatmentList(changeList);
                          }}
                        />
                      </p>
                    );
                  })
                : item.treatment.map((treatment, index) => {
                    return <p>{treatment.treatmentName}</p>;
                  })}
              {edit &&
              addTreatmentList.length !== 0 &&
              item.officeIndex === officeIndex
                ? addTreatmentView()
                : null}
              <Button
                type={"link"}
                icon={<PlusOutlined />}
                onClick={async () => {
                  if (item.officeIndex !== officeIndex) {
                    setAddTreatmentList([{ treatment: "" }]);
                  } else {
                    setAddTreatmentList([
                      ...addTreatmentList,
                      { treatment: "" },
                    ]);
                  }
                  setOfficeIndex(item.officeIndex);
                  setOfficeName(item.officeName);

                  setEdit(true);
                }}
              />
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
