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
      await dispatch(officeListAction(jsonData.result));
    }
  } catch (err) {
    console.log("error");
    return false;
  }
};

// 진료실 정보 등록
export const officeRegister = (officeData) => async (dispatch) => {
  try {
    officeData = JSON.stringify(officeData);

    const token = await getData("token");
    const jsonData = await api.post(`/office`, {
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

// 진료실 정보 수정
export const officeDataUpdate = (officeIndex, officeData) => async (
  dispatch
) => {
  try {
    officeData = JSON.stringify(officeData);
    const token = await getData("token");
    const jsonData = await api.patch(`/office/officeIndex/${officeIndex}`, {
      token,
      body: officeData,
    });

    console.log(jsonData);

    if (jsonData.success) {
      return true;
    }
  } catch (err) {
    console.log("error");
    return false;
  }
};

// 진료 항목 삭제
export const treatmentDelete = (treatmentIndex) => async (dispatch) => {
  try {
    const token = await getData("token");

    // 수정 예정
    const jsonData = await api.delete(
      `/office/treatmentIndex/${treatmentIndex}`,
      {
        token,
      }
    );

    if (jsonData.success) {
      return true;
    }
  } catch (err) {
    console.log("error");
    return false;
  }
};

// 진료실 정보 삭제
export const officeDelete = (officeIndex) => async (dispatch) => {
  try {
    const token = await getData("token");
    const jsonData = await api.delete(`/office/officeIndex/${officeIndex}`, {
      token,
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
