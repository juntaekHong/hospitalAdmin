import React, { useState, useEffect, cloneElement } from "react";
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Button,
  Modal,
} from "antd";
import "../../styles/reservation/ReservationTable.css";
import { ReservationActions } from "../../store/actionCreator";
import {
  CheckCircleTwoTone,
  MinusCircleTwoTone,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import reservation from "../../store/modules/reservation/reservation";

const { TextArea } = Input;

const originData = [];

for (let i = 0; i < 100; i++) {
  originData.push({
    index: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    doctor: `London Park no. ${i}`,
    class: `London Park no. ${i}`,
    date: `London Park no. ${i}`,
    etc: `London Park no. ${i}`,
  });
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export const EditableTable = ({ reservationList }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  useEffect(() => {
    setData(reservationList);
  }, [reservationList]);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const accept = async (reservationIndex) => {
    await ReservationActions.acceptReservation(reservationIndex);

    await ReservationActions.getWaitingReservations();
    await ReservationActions.getAcceptedReservations();
    await ReservationActions.getReservationLogs();
  };

  const refuse = async (reservationIndex) => {
    await ReservationActions.refuseReservation(reservationIndex);

    await ReservationActions.getWaitingReservations();
    await ReservationActions.getAcceptedReservations();
    await ReservationActions.getReservationLogs();
  };

  const columns = [
    {
      title: "번호",
      dataIndex: "reservationIndex",
      width: "10%",
      editable: false,
    },
    {
      title: "이름",
      dataIndex: "userName",
      width: "15%",
      editable: false,
    },
    {
      title: "나이",
      dataIndex: "userAge",
      width: "10%",
      editable: false,
    },
    {
      title: "담당의",
      dataIndex: "officeName",
      width: "25%",
      editable: false,
    },
    {
      title: "진료 과목",
      dataIndex: "treatmentName",
      width: "20%",
      editable: false,
    },
    {
      title: "예약 날짜",
      dataIndex: "reservationDate",
      width: "40%",
      editable: false,
    },
    {
      title: "예약 시간",
      dataIndex: "reservationTime",
      width: "40%",
      editable: false,
    },
    {
      title: "비고",
      dataIndex: "comment",
      width: "40%",
      editable: false,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            {/* <a
              href="javascript:;"
              onClick={() => accept(record.reservationIndex)}
              style={{
                marginRight: 8,
              }}
            >
              수락
            </a> */}
            <Popconfirm
              title="정말 예약 수락하시겠습니까?"
              onConfirm={async () => {
                await accept(record.reservationIndex);
              }}
            >
              <Button
                type="link"
                icon={<CheckCircleTwoTone twoToneColor={"#52c41a"} />}
              />
            </Popconfirm>

            <Popconfirm
              title="정말 예약 거절하시겠습니까?"
              onConfirm={async () => {
                await refuse(record.reservationIndex);
              }}
            >
              <Button
                type="link"
                icon={<MinusCircleTwoTone twoToneColor={"#dc3545"} />}
              />
            </Popconfirm>
          </span>
        ) : (
          <a disabled={editingKey !== ""} onClick={edit(record)}>
            상태 변경
          </a>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export const EditableTable2 = ({ reservationList }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  useEffect(() => {
    setData(reservationList);
  }, [reservationList]);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const accept = async (reservationIndex) => {
    await ReservationActions.acceptReservation(reservationIndex);

    await ReservationActions.getWaitingReservations();
    await ReservationActions.getAcceptedReservations();
    await ReservationActions.getReservationLogs();
  };

  const refuse = async (reservationIndex) => {
    await ReservationActions.refuseReservation(reservationIndex);

    await ReservationActions.getWaitingReservations();
    await ReservationActions.getAcceptedReservations();
    await ReservationActions.getReservationLogs();
  };

  const columns = [
    {
      title: "번호",
      dataIndex: "reservationIndex",
      width: "10%",
      editable: false,
    },
    {
      title: "이름",
      dataIndex: "userName",
      width: "15%",
      editable: false,
    },
    {
      title: "나이",
      dataIndex: "userAge",
      width: "10%",
      editable: false,
    },
    {
      title: "담당의",
      dataIndex: "officeName",
      width: "25%",
      editable: false,
    },
    {
      title: "진료 과목",
      dataIndex: "treatmentName",
      width: "20%",
      editable: false,
    },
    {
      title: "예약 날짜",
      dataIndex: "reservationDate",
      width: "40%",
      editable: false,
    },
    {
      title: "예약 시간",
      dataIndex: "reservationTime",
      width: "40%",
      editable: false,
    },
    {
      title: "비고",
      dataIndex: "comment",
      width: "40%",
      editable: false,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            {/* <a
              href="javascript:;"
              onClick={() => accept(record.reservationIndex)}
              style={{
                marginRight: 8,
              }}
            >
              수락
            </a> */}
            {/* <Popconfirm
              title="정말 진료 완료를 하시겠습니까?"
              onConfirm={async () => {
                console.log(record.reservationIndex);
              }}
            >
              <a>진료 완료</a>
            </Popconfirm> */}

            <Popconfirm
              title="정말 예약 취소하시겠습니까?"
              onConfirm={async () => {
                await refuse(record.reservationIndex);
              }}
            >
              <Button
                type="link"
                icon={<MinusCircleTwoTone twoToneColor={"#dc3545"} />}
              />
            </Popconfirm>
          </span>
        ) : (
          <a disabled={editingKey !== ""} onClick={edit(record)}>
            상태 변경
          </a>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export const EditableTable3 = ({ reservationList }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  // 진단서 작성&추가 모달
  const [modal, setModal] = useState(false);
  // 진단서 작성하는 예약 인덱스
  const [reservationIndex, setReservationIndex] = useState();
  // 진단서 작성 내용
  const [prescription, setPrescription] = useState();
  // 진단서 내용 작성
  const [prescriptionValue, setPrescriptionValue] = useState("");

  useEffect(() => {
    setData(reservationList);
  }, [reservationList]);

  useEffect(() => {
    if (!modal) {
      setPrescription("");
      setPrescriptionValue("");
      setReservationIndex();
    }
  }, [modal]);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const historyDelete = async (reservationIndex) => {
    await ReservationActions.deleteReservation(reservationIndex);

    await ReservationActions.getWaitingReservations();
    await ReservationActions.getAcceptedReservations();
    await ReservationActions.getReservationLogs();
  };

  const columns = [
    {
      title: "번호",
      dataIndex: "order",
      width: "10%",
      editable: false,
    },
    {
      title: "이름",
      dataIndex: "userName",
      width: "15%",
      editable: false,
      render: (text) => <Link to={"/reservationList/nav6"}>{text}</Link>,
    },
    {
      title: "나이",
      dataIndex: "userAge",
      width: "10%",
      editable: false,
    },
    {
      title: "담당의",
      dataIndex: "officeName",
      width: "25%",
      editable: false,
    },
    {
      title: "진료 과목",
      dataIndex: "treatmentName",
      width: "20%",
      editable: false,
    },
    {
      title: "예약 날짜",
      dataIndex: "reservationDate",
      width: "40%",
      editable: false,
    },
    {
      title: "예약 시간",
      dataIndex: "reservationTime",
      width: "40%",
      editable: false,
    },
    {
      title: "비고",
      dataIndex: "comment",
      width: "40%",
      editable: false,
    },
    {
      title: "상태",
      dataIndex: "status",
      width: "100%",
      editable: false,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            {record.status === "진료 완료" ? (
              <Button
                type={"link"}
                icon={<PlusCircleTwoTone twoToneColor={"#52c41a"} />}
                onClick={async () => {
                  const comment = await ReservationActions.getPrescription(
                    record.reservationIndex
                  );
                  await setPrescription(comment);
                  await setReservationIndex(record.reservationIndex);

                  console.log(record.status);
                  await setModal(!modal);
                }}
              />
            ) : null}
            <Popconfirm
              title="정말 삭제하시겠습니까?"
              onConfirm={async () => {
                await historyDelete(record.reservationIndex);
              }}
            >
              <Button
                type="link"
                icon={<MinusCircleTwoTone twoToneColor={"#dc3545"} />}
              />
            </Popconfirm>
          </span>
        ) : (
          <a disabled={editingKey !== ""} onClick={edit(record)}>
            상태 변경
          </a>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "userName" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Modal
        title="진단서"
        visible={modal}
        onOk={async () => {
          let data = { diagnosis: prescriptionValue };

          await ReservationActions.commentOnReservation(reservationIndex, data);

          await setModal(false);
        }}
        onCancel={() => {
          setModal(false);
        }}
      >
        {prescription !== null ? (
          <p>{prescription}</p>
        ) : (
          <TextArea
            rows={4}
            value={prescriptionValue}
            onChange={(e) => {
              setPrescriptionValue(e.target.value);
            }}
          />
        )}
      </Modal>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
        onRow={(record) => {
          return {
            onClick: (event) => {
              ReservationActions.getCommentOnReservation(record.userIndex);
            },
          };
        }}
      />
    </Form>
  );
};
