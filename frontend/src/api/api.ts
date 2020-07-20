import Axios from "axios";

const baseURL = "https://spsteam10-748f8.et.r.appspot.com/";

export const Url = {
  getTask: () => baseURL + "task/findByStatus",
  postTask: () => baseURL + "task",
  getRequest: () => baseURL + "request/findByStatus",
  postRequest: () => baseURL + "request",
  //testOffer: () => baseURL + "offer",
  offer: () => baseURL + "offer",
};

export const getUserRequest = async (uuid: number, status: string) => {
  return Axios.get(Url.getRequest(), {
    headers: { "Access-Control-Allow-Origin": "*" },
    withCredentials: true,
    params: {
      id: uuid,
      status,
    },
  });
};

export const getUserTask = async (uuid: number, status: string) => {
  return Axios.get(Url.offer(), {
    headers: { "Access-Control-Allow-Origin": "*" },
    withCredentials: true,
    params: {
      uuid: uuid,
      status,
      offerId: 1,
    },
  });
};

export const getOpenOffers = async () => {
  return Axios.get(Url.offer(), {
    headers: { "Access-Control-Allow-Origin": "*" },
    withCredentials: true,
    params: {
      status: "open",
    },
  });
};

export const getOpenRequest = async () => {
  return Axios.get(Url.getRequest(), {
    withCredentials: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    params: {
      status: "open",
    },
  });
};

export const postRequest = async (params) => {
  return Axios.post(Url.postRequest(), {
    withCredentials: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    params,
  });
};

export const postOffer = async (params) => {
  return Axios.post(Url.offer(), {
    withCredentials: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    params: {
      uuid: "1231",
      shopLocation: "dasdsa",
      expectedDeliveryTime: 123123,
    },
  });
};

export const postTask = async (params) => {
  return Axios.post(Url.postTask(), {
    withCredentials: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    params,
  });
};
