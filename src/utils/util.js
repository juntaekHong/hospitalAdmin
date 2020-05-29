/*
 * util 모음
 * widthPercentageToDp: 디바이스 크기에 따라 크기 변환
 * storeData, getData, removeData: Local Data 읽기, 쓰기
 */

export const storeData = async (key, value) => {
  try {
    await localStorage.setItem(key, value);
  } catch (e) {}
};

export const getData = async (key) => {
  try {
    const value = await localStorage.getItem(key);
    if (value !== null) return value;
    else return null;
  } catch (e) {
    return null;
  }
};

export const removeData = async (key, callback) => {
  try {
    await localStorage.removeItem(key, callback);
  } catch (e) {}
};
