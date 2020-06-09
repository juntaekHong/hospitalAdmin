import React, { useState, useEffect } from "react";
import { Table, Input, InputNumber, Popconfirm, Form } from "antd";
import "../../styles/reservation/ReservationTable.css";
import { ReservationActions } from "../../store/actionCreator";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

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

const PrescriptionCard = ({ userHistoryList }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  useEffect(() => {
    setData(userHistoryList);
  }, [userHistoryList]);

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
    },
    // 병원 이름
    {
      title: "병원 이름",
      dataIndex: "hospitalName",
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
      title: "진료 날짜",
      dataIndex: "reservationDate",
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
            {/* 진단서 상세페이지로 이동 */}
            <Link
              to={"/reservationList/nav7"}
              onClick={async () => {
                let data = [];

                await userHistoryList.map((item) => {
                  if (item.reservationIndex === record.reservationIndex) {
                    data.push(item);
                  }
                });

                await ReservationActions.getCommentOnReservationDetail(data);
              }}
            >
              상세 보기
            </Link>
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

export default connect((state) => ({
  userHistoryList: state.reservation.userHistoryList,
}))(PrescriptionCard);
