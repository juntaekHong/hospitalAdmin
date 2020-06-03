import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Card, Popconfirm } from "antd";
import { OfficeActions } from "../../store/actionCreator";
import { Redirect } from "react-router-dom";

const OfficeRegister = (props) => {
  // 담당의
  const [inputText, setInputText] = useState(false);
  const [doctorName, setDoctorName] = useState("");

  //   진료실
  const [inputText2, setInputText2] = useState(false);
  const [office, setOffice] = useState("");

  const [inputText3, setInputText3] = useState(true);
  const [treatmentList, setTreatmentList] = useState([]);

  // 등록 후, 조회 페이지 이동.
  const [driection, setDirection] = useState(false);

  const treatmentObjectList = () => {
    let list = [];
    let datas = [];

    treatmentList.map((item, index) => {
      list.push(
        <input
          style={{ marginBottom: "30px", marginRight: "30px" }}
          value={treatmentList[index].treatment}
          onChange={(e) => {
            treatmentList.map((data, i) => {
              if (index === i) {
                datas.push({ treatment: e.target.value });
              } else {
                datas.push({ treatment: data.treatment });
              }
            });

            setTreatmentList(datas);
          }}
        />
      );
    });

    return list;
  };

  const constView = () => {
    let view = [];

    treatmentList.map((item, index) => {
      view.push(
        <div style={{ marginBottom: "30px", marginRight: "30px" }}>
          {item.treatment}
        </div>
      );
    });

    return view;
  };

  return (
    <Card title="진료실 등록">
      <div style={{ display: "inline" }}>
        <Card
          style={{
            width: "40%",
            display: "inline-block",
            marginRight: 30,
            marginBottom: 30,
            verticalAlign: "top",
          }}
          type="inner"
          title="담당의"
          extra={
            <button
              onClick={async () => {
                await setInputText(!inputText);
              }}
            >
              {!inputText ? "추가" : "확인"}
            </button>
          }
        >
          {inputText ? (
            <input
              value={doctorName}
              onChange={(e) => {
                setDoctorName(e.target.value);
              }}
            />
          ) : doctorName.length !== 0 ? (
            <div>{doctorName}</div>
          ) : (
            "담당의 이름을 입력해주세요."
          )}
        </Card>
        <Card
          style={{
            width: "40%",
            display: "inline-block",
            marginRight: 30,
            marginBottom: 30,
            verticalAlign: "top",
          }}
          type="inner"
          title="진료실"
          extra={
            <button
              onClick={async () => {
                await setInputText2(!inputText2);
              }}
            >
              {!inputText2 ? "추가" : "확인"}
            </button>
          }
        >
          {inputText2 ? (
            <input
              value={office}
              onChange={(e) => {
                setOffice(e.target.value);
              }}
            />
          ) : office.length !== 0 ? (
            <div>{office}</div>
          ) : (
            "진료실을 입력해주세요."
          )}
        </Card>
        <Card
          style={{
            display: "block",
            marginLeft: "7%",
            marginRight: "10%",
            marginBottom: 30,
            verticalAlign: "top",
          }}
          type="inner"
          title="진료 항목"
          extra={
            inputText3 ? (
              <button
                onClick={async () => {
                  await setInputText3(!inputText3);
                }}
              >
                수정
              </button>
            ) : (
              <div>
                <button
                  onClick={async () => {
                    await setTreatmentList([
                      ...treatmentList,
                      { treatment: "" },
                    ]);
                  }}
                >
                  추가
                </button>
                <span> </span>
                {treatmentList.length !== 0 ? (
                  <button
                    onClick={async () => {
                      await setInputText3(true);
                    }}
                  >
                    완료
                  </button>
                ) : null}
              </div>
            )
          }
        >
          {inputText3 ? constView() : treatmentObjectList()}
        </Card>
        <Popconfirm
          title="정말 등록하시겠습니까?"
          onConfirm={async () => {
            if (
              !inputText &&
              !inputText2 &&
              inputText3 &&
              doctorName.length !== 0 &&
              office.length !== 0 &&
              treatmentList.length !== 0
            ) {
              let treatmentData = [];

              treatmentList.map((item) => {
                if (item.treatment.length !== 0) {
                  treatmentData.push(item.treatment);
                }
              });

              const officeData = {
                officeName: doctorName + " - " + office,
                treatmentName: treatmentData,
              };

              const success = await OfficeActions.officeRegister(officeData);

              if (success) {
                await OfficeActions.getOffice();
                setDirection(true);
              }
            }
          }}
        >
          {!driection ? <a>등록</a> : <Redirect to={"nav4"} />}
        </Popconfirm>
      </div>
    </Card>
  );
};

export default connect((state) => ({
  officeList: state.office.officeList,
}))(OfficeRegister);
