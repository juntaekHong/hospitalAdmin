import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import api from "../../../utils/api";
import { getData } from "../../../utils/util";

const RESERVATION_LIST = "signin/RESERVATION_LIST";
const ACCEPTED_LIST = "signin/ACCEPTED_LIST";
const HISTORY_LIST = "signin/HISTORY_LIST";

const reservationListAction = createAction(RESERVATION_LIST);
const acceptedListAction = createAction(ACCEPTED_LIST);
const historyListAction = createAction(HISTORY_LIST);

const initState = {
  reservationList: [],
  acceptedList: [],
  historyList: [],
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

      await result.rows.map((item) => {
        let status;

        switch (true) {
          case item.status == "TIMEOUT":
            status = "진료 완료";
            break;
          case item.status == "REFUSED":
            status = "예약 거절";
            break;
        }
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
      console.log(jsonData);
    }
  } catch (err) {
    console.log("error");
    return false;
  }
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
  },
  initState
);
