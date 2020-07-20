import Axios from "axios";

const baseURL = "https://spsteam10-748f8.et.r.appspot.com/";

export const Url = {
  getTask: () => baseURL + "task/findByStatus",
  postTask: () => baseURL + "task",
  getRequest: () => baseURL + "request/findByStatus",
  postRequest: () => baseURL + "request",
  testOffer: () => baseURL + "offer",
  getOffer: () => baseURL + "offer/findByStatus",
};

export const getUserRequest = async (uuid: number, status: string) => {
  return Axios.get(Url.getRequest(), {
    headers: { "Access-Control-Allow-Origin": "*" },
    params: {
      id: uuid,
      status,
    },
  });
};

export const getUserTask = async (uuid: number, status: string) => {
  return Axios.get(Url.testOffer(), {
    headers: { "Access-Control-Allow-Origin": "*" },
    params: {
      id: uuid,
      status,
    },
  });
};

export const getOpenOffers = async () => {
  return Axios.get(Url.getOffer(), {
    headers: { "Access-Control-Allow-Origin": "*" },
    params: {
      status: "open",
    },
  });
};

export const getOpenRequest = async () => {
  return Axios.get(Url.getRequest(), {
    headers: { "Access-Control-Allow-Origin": "*" },
    params: {
      status: "open",
    },
  });
};

export const postRequest = async (params) => {
  return Axios.post(Url.postRequest(), {
    headers: { "Access-Control-Allow-Origin": "*" },
    params,
  });
};

export const postTask = async (params) => {
  return Axios.post(Url.postTask(), {
    headers: { "Access-Control-Allow-Origin": "*" },
    params,
  });
};
