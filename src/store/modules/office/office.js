import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import api from "../../../utils/api";
import { getData } from "../../../utils/util";

// const HISTORY_LIST = "signin/HISTORY_LIST";

// const reservationListAction = createAction(RESERVATION_LIST);

const initState = {};

// 진료실 조회
export const getOffice = (hpid) => async (dispatch) => {
  try {
    const token = await getData("token");
    const jsonData = await api.get(`/office/hpid/${hpid}`, {
      token,
    });

    console.log(jsonData);

    if (jsonData.success) {
      //   console.log(jsonData);
    }
  } catch (err) {
    console.log("error");
    return false;
  }
};

export default handleActions(
  {
    // [RESERVATION_LIST]: (state, { payload }) =>
    //   produce(state, (draft) => {
    //     draft.reservationList = payload;
    //   }),
  },
  initState
);
