/*
 * 통신 모듈
 */
import axios from "axios";

function rest(method) {
  return async (url, { body = {}, header = {}, token = "" } = {}) => {
    try {
      let response;
      if (method === "GET") {
        response = await axios.get(
          `http://ec2-15-164-221-39.ap-northeast-2.compute.amazonaws.com${url}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "x-access-token": token,
              ...header,
            },
          }
        );
      } else {
        response = await axios({
          method: method,
          url: `http://ec2-15-164-221-39.ap-northeast-2.compute.amazonaws.com${url}`,
          data: body,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
            ...header,
          },
        });
      }
      const { data } = response;
      if (data.statusCode == 200) {
        return data;
      } else {
        return data;
      }
    } catch (err) {
      const { response } = err;
      // 403: token이 인증되지 않을경우 로그인 화면으로 네비게이팅
      if (response.status == 403) {
      } else {
      }
      return response;
    }
  };
}

const api = {
  get: rest("GET"),
  post: rest("POST"),
  put: rest("PUT"),
  delete: rest("DELETE"),
  patch: rest("PATCH"),
};

export default api;
