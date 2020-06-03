import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import api from "../../../utils/api";
import { storeData, getData } from "../../../utils/util";
import { Img } from "react-image";

const SIGNIN_HOSPITAL_DATA = "signin/SIGNIN_HOSPITAL_DATA";
const SIGNIN_ACCESS_TOKEN = "signin/SIGNIN_ACCESS_TOKEN";
const SINGININ_INIT = "signin/SINGININ_INIT";
const HOSPITAL_DATA_INIT = "signin/HOSPITAL_DATA_INIT";
const HOSPITAL_IMG = "signin/HOSPITAL_IMG";

const hospitalDataAction = createAction(SIGNIN_HOSPITAL_DATA);
const accessTokenAction = createAction(SIGNIN_ACCESS_TOKEN);

const loginDataInitAction = createAction(SINGININ_INIT);
const hospitalDataInitAction = createAction(HOSPITAL_DATA_INIT);
const hospitalImgAction = createAction(HOSPITAL_IMG);

const initState = {
  // 초기 사용자 정보
  hospital: null,

  // iamport access token
  access_token: null,

  img: null,
};

export const handleSinginInit = (value) => async (dispatch) => {
  await dispatch(loginDataInitAction(value));
};

export const handleHospitalData = (payload) => async (dispatch) => {
  await dispatch(hospitalDataInitAction(payload));
};

export const signIn = (hospitalData) => async (dispatch) => {
  try {
    const jsonData = await api.post(`/hospital/signIn`, {
      body: hospitalData,
    });

    if (jsonData.success) {
      const result = jsonData.result;

      await storeData("token", result.token);
      await storeData("hospital", JSON.stringify(result));

      await dispatch(hospitalDataAction(result));
      await dispatch(accessTokenAction(result.token));
    }
  } catch (err) {
    console.log("error");
    return false;
  }
};

// 내 병원 조회
export const getHospital = (hpid) => async (dispatch) => {
  try {
    const jsonData = await api.get(`/hospital/${hpid}`);

    if (jsonData.success) {
      const result = jsonData.result;

      await dispatch(hospitalImgAction(result.img));
    }
  } catch (err) {
    console.log("error");
    return false;
  }
};

export default handleActions(
  {
    [SIGNIN_HOSPITAL_DATA]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.hospital = payload;
      }),
    [SIGNIN_ACCESS_TOKEN]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.access_token = payload;
      }),
    [HOSPITAL_DATA_INIT]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.hospital = payload;
      }),
    [SINGININ_INIT]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.access_token = payload;
      }),
    [HOSPITAL_IMG]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.img = payload;
      }),
  },
  initState
);
