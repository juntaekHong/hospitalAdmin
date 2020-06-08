import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Descriptions, Badge } from "antd";

const PrescriptionDetail = (prescriptionDetail) => {
  const [data, setData] = useState();

  useEffect(() => {
    setData(prescriptionDetail.prescriptionDetail[0]);
  }, [prescriptionDetail]);

  console.log(data);

  return data ? (
    <Descriptions
      title="진단서 상세정보"
      bordered
      column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
    >
      <Descriptions.Item label="이름">{data.userName}</Descriptions.Item>
      <Descriptions.Item label="나이">{data.userAge}</Descriptions.Item>
      <Descriptions.Item label="연락처">{data.tel}</Descriptions.Item>
      <Descriptions.Item label="예약날짜">
        {data.reservationDate}
      </Descriptions.Item>
      <Descriptions.Item label="예약 시간">
        {data.reservationTime}
      </Descriptions.Item>
      <Descriptions.Item label="병원명">{data.hospitalName}</Descriptions.Item>
      <Descriptions.Item label="담당의 - 진료과목">
        {data.officeName}
      </Descriptions.Item>
      <Descriptions.Item label="진료항목">
        {data.treatmentName}
      </Descriptions.Item>
      <Descriptions.Item label="환자 특이사항">
        {data.comment}
      </Descriptions.Item>
      <Descriptions.Item label="진단 내용">{data.diagnosis}</Descriptions.Item>
    </Descriptions>
  ) : null;
};

export default connect((state) => ({
  prescriptionDetail: state.reservation.prescriptionDetail,
}))(PrescriptionDetail);
