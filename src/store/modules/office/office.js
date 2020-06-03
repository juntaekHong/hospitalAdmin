import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import api from "../../../utils/api";
import { getData } from "../../../utils/util";

const OFFICE_LIST = "office/OFFICE_LIST";

const officeListAction = createAction(OFFICE_LIST);

const initState = {
  officeList: [],
};

// 진료실 조회
export const getOffice = () => async (dispatch) => {
  try {
    const token = await getData("token");
    const jsonData = await api.get(`/office`, {
      token,
    });

    if (jsonData.success) {
      console.log(jsonData.result);
      await dispatch(officeListAction(jsonData.result));
    }
  } catch (err) {
    console.log("error");
    return false;
  }
};

// 진료실 정보 수정
export const officeDataUpdate = (officeIndex, officeData) => async (
  dispatch
) => {
  officeData = JSON.stringify(officeData);

  try {
    const token = await getData("token");
    const jsonData = await api.patch(`/office/officeIndex/${officeIndex}`, {
      token,
      body: officeData,
    });

    if (jsonData.success) {
      return true;
    }
  } catch (err) {
    console.log("error");
    return false;
  }
};

export default handleActions(
  {
    [OFFICE_LIST]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.officeList = payload;
      }),
  },
  initState
);
