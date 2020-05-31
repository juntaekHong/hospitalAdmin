import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import api from "../../../utils/api";

const SIGNUP_HPID_LIST = "signup/SIGNUP_HPID_LIST";

const hpIdListAction = createAction(SIGNUP_HPID_LIST);

const initState = {
  hpIdList: [],
};

// 회원가입
export const signUp = (hospitalData) => async (dispatch) => {
  try {
    const data = JSON.stringify(hospitalData);

    const jsonData = await api.post(`/hospital/signUp`, {
      body: data,
    });

    if (jsonData.success) {
      return true;
    }

    return jsonData.result.errors[0].message;
  } catch (e) {
    // 서버 연동 실패
    console.log("회원가입 실패...");
  }
};

// 병원 주소 검색
export const searchHospital = (content) => async (dispatch) => {
  try {
    const jsonData = await api.get(`/search/address?content=${content}`);

    if (jsonData.success) {
      const result = jsonData.result;
      let hpIdList = [];

      await result.map((item) => {
        hpIdList.push({
          hospitalAddress: item._source.dutyAddr._text,
          hpid: item._source.hpid._text,
          hospitalName: item._source.dutyName._text,
        });
      });

      await dispatch(hpIdListAction(hpIdList));
    }
  } catch (e) {
    // 서버 연동 실패
    console.log("회원가입 실패...");
  }
};

export default handleActions(
  {
    [SIGNUP_HPID_LIST]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.hpIdList = payload;
      }),
  },
  initState
);
