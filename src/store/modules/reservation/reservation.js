import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import api from "../../../utils/api";
import { getData } from "../../../utils/util";

const RESERVATION_LIST = "reservation/RESERVATION_LIST";
const ACCEPTED_LIST = "reservation/ACCEPTED_LIST";
const HISTORY_LIST = "reservation/HISTORY_LIST";
const USER_HISTORY_LIST = "reservation/USER_HISTORY_LIST";
const PRESCRIPRION_DETAIL = "reservation/PRESCRIPRION_DETAIL";

const reservationListAction = createAction(RESERVATION_LIST);
const acceptedListAction = createAction(ACCEPTED_LIST);
const historyListAction = createAction(HISTORY_LIST);
const userHistoryListAction = createAction(USER_HISTORY_LIST);
const prescriptionDetailAction = createAction(PRESCRIPRION_DETAIL);

const initState = {
  reservationList: [],
  acceptedList: [],
  historyList: [],

  //환자 지난 내역 리스트
  userHistoryList: [],
  // 상세 진단서
  prescriptionDetail: [],
};

// 응답대기 예약내역
export const getWaitingReservations = () => async (dispatch) => {
  try {
    const token = await getData("token");
    const jsonData = await api.get(`/manage/reservation/waiting`, {
      token,
    });

    if (jsonData.success) {
      const result = jsonData.result;
      const dataFormat = [];

      await result.rows.map((item) => {
        dataFormat.push({
          reservationIndex: item.reservationIndex,
          createdAt: item.createdAt,
          userIndex: item.userIndex,
          userName: item.user.userName,
          userAge: item.user.age,
          officeName: item.hospitalOffice.officeName,
          reservationDate: item.reservationDate,
          reservationTime: item.reservationTime,
          treatmentName: item.treatmentName,
          comment: item.comment,
        });
      });

      await dispatch(reservationListAction(dataFormat));
    }
  } catch (err) {
    console.log("error");
    return false;
  }
};

// 예약 수락
export const acceptReservation = (reservationIndex) => async (dispatch) => {
  try {
    const token = await getData("token");
    const jsonData = await api.patch(
      `/manage/accept/reservationIndex/${reservationIndex}`,
      {
        token,
      }
    );

    if (jsonData.success) {
    }
  } catch (err) {
    console.log("error");
    return false;
  }
};

// 예약 거절
export const refuseReservation = (reservationIndex) => async (dispatch) => {
  try {
    const token = await getData("token");
    const jsonData = await api.patch(
      `/manage/refuse/reservationIndex/${reservationIndex}`,
      {
        token,
      }
    );

    if (jsonData.success) {
    }
  } catch (err) {
    console.log("error");
    return false;
  }
};

// 수락된 예약내역
export const getAcceptedReservations = () => async (dispatch) => {
  try {
    const token = await getData("token");
    const jsonData = await api.get(`/manage/reservation/accepted`, {
      token,
    });

    if (jsonData.success) {
      const result = jsonData.result;
      const dataFormat = [];

      await result.rows.map((item) => {
        dataFormat.push({
          reservationIndex: item.reservationIndex,
          createdAt: item.createdAt,
          userIndex: item.userIndex,
          userName: item.user.userName,
          userAge: item.user.age,
          officeName: item.hospitalOffice.officeName,
          reservationDate: item.reservationDate,
          reservationTime: item.reservationTime,
          treatmentName: item.treatmentName,
          comment: item.comment,
        });
      });

      await dispatch(acceptedListAction(dataFormat));
    }
  } catch (err) {
    console.log("error");
    return false;
  }
};

// 지난 예약내역(수락 제외)
export const getReservationLogs = () => async (dispatch) => {
  try {
    const token = await getData("token");
    const jsonData = await api.get(`/manage/reservation/history`, {
      token,
    });

    if (jsonData.success) {
      const result = jsonData.result;
      const dataFormat = [];

      await result.rows.map((item, index) => {
        let status;

        switch (true) {
          case item.status == "TIMEOUT":
            status = "진료 완료";
            break;
          case item.status == "REFUSED":
            status = "예약 거절";
            break;
          case item.status == "CANCELED":
            status = "예약 취소";
            break;
          default:
            break;
        }
        dataFormat.push({
          order: index + 1,
          reservationIndex: item.reservationIndex,
          createdAt: item.createdAt,
          userIndex: item.userIndex,
          userName: item.user.userName,
          userAge: item.user.age,
          officeName: item.hospitalOffice.officeName,
          reservationDate: item.reservationDate,
          reservationTime: item.reservationTime,
          treatmentName: item.treatmentName,
          comment: item.comment,
          status: status,
        });
      });

      await dispatch(historyListAction(dataFormat));
    }
  } catch (err) {
    console.log("error");
    return false;
  }
};

// 지난내역 삭제
export const deleteReservation = (reservationIndex) => async (dispatch) => {
  try {
    const token = await getData("token");
    const jsonData = await api.delete(
      `/manage/delete/reservationIndex/${reservationIndex}`,
      {
        token,
      }
    );

    if (jsonData.success) {
    }
  } catch (err) {
    console.log("error");
    return false;
  }
};

// 진단서 조회
export const getPrescription = (reservationIndex) => async (dispatch) => {
  try {
    const token = await getData("token");
    const jsonData = await api.get(
      `/manage/comment/reservationIndex/${reservationIndex}`,
      {
        token,
      }
    );

    if (jsonData.success) {
      return jsonData.result.diagnosis;
    }
  } catch (err) {
    console.log("error");
    return false;
  }
};

// 진단서 작성
export const commentOnReservation = (reservationIndex, data) => async (
  dispatch
) => {
  try {
    const token = await getData("token");
    const jsonData = await api.post(
      `/manage/comment/reservationIndex/${reservationIndex}`,
      {
        token,
        body: data,
      }
    );

    if (jsonData.success) {
    }
  } catch (err) {
    console.log("error");
    return false;
  }
};

// 환자 지난 내역 조회
export const getCommentOnReservation = (userIndex) => async (dispatch) => {
  try {
    const token = await getData("token");
    const jsonData = await api.get(
      `/manage/medicalHistory/userIndex/${userIndex}`,
      {
        token,
      }
    );

    if (jsonData.success) {
      const result = jsonData.result;
      const dataFormat = [];

      await result.rows.map((item, index) => {
        dataFormat.push({
          order: index + 1,
          reservationIndex: item.reservationIndex,
          userName: item.user.userName,
          userAge: item.user.age,
          tel: item.user.tel,
          hospitalName: item.hospital.dutyName,
          officeName: item.hospitalOffice.officeName,
          reservationDate: item.reservationDate,
          reservationTime: item.reservationTime,
          treatmentName: item.treatmentName,
          comment: item.comment,
          diagnosis: item.diagnosis,
        });
      });

      await dispatch(userHistoryListAction(dataFormat));
    }
  } catch (err) {
    console.log("error");
    return false;
  }
};

// 환자 진단서 상세 정보
export const getCommentOnReservationDetail = (data) => async (dispatch) => {
  console.log(data);
  await dispatch(prescriptionDetailAction(data));
};

export default handleActions(
  {
    [RESERVATION_LIST]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.reservationList = payload;
      }),
    [ACCEPTED_LIST]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.acceptedList = payload;
      }),
    [HISTORY_LIST]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.historyList = payload;
      }),
    [USER_HISTORY_LIST]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.userHistoryList = payload;
      }),
    [PRESCRIPRION_DETAIL]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.prescriptionDetail = payload;
      }),
  },
  initState
);
