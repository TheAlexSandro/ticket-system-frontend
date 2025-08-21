import axios, { AxiosError, AxiosResponse } from "axios";

const api = axios.create();

api.interceptors.request.use((config) => {
  config.baseURL = "/api/proxy"
  return config
})

type Callback<T> = (error: string | null, result: T) => void;

export const getAdminDashboardInfo = (
  callback: Callback<null | AxiosResponse>
) => {
  api
    .post(`/admin/getInfo`)
    .then((result: AxiosResponse) => {
      return callback(null, result.data);
    })
    .catch((err: AxiosError) => {
      return callback(err.message, null);
    });
};

export const getUsername = (
  username: string,
  callback: Callback<null | AxiosResponse>
) => {
  api
    .post(`/auth/getUsername?username=${username}`)
    .then((result: AxiosResponse) => {
      return callback(null, result.data);
    })
    .catch((err: AxiosError) => {
      return callback(err.message, null);
    });
};

export const signIn = (
  username: string,
  password: string,
  callback: Callback<null | AxiosResponse>
) => {
  api
    .post(
      `/auth/signin?username=${username}&password=${password}`,
      {},
      { withCredentials: true }
    )
    .then((result: AxiosResponse) => {
      return callback(null, result.data);
    })
    .catch((err: AxiosError) => {
      return callback(err.message, null);
    });
};

export const signOut = (callback?: Callback<null | AxiosResponse>) => {
  api
    .post(`/auth/signOut`, {}, { withCredentials: true })
    .then((result: AxiosResponse) => {
      return callback?.(null, result.data);
    })
    .catch((err: AxiosError) => {
      return callback?.(err.message, null);
    });
};

export const verify = (callback: Callback<null | AxiosResponse>) => {
  api
    .post(`/auth/verify`, {}, { withCredentials: true })
    .then((result: AxiosResponse) => {
      return callback(null, result.data);
    })
    .catch((err: AxiosError) => {
      return callback(err.message, null);
    });
};

export const clearCookie = (callback?: Callback<null | AxiosResponse>) => {
  api
    .post(`/auth/clearCookie`, {}, { withCredentials: true })
    .then((result: AxiosResponse) => {
      return callback?.(null, result.data);
    })
    .catch((err: AxiosError) => {
      return callback?.(err.message, null);
    });
};

export const cameraStatus = (
  status: string,
  callback: Callback<null | AxiosResponse>
) => {
  api
    .post(`/admin/cameraStatus?status=${status}`)
    .then((result: AxiosResponse) => {
      return callback(null, result.data);
    })
    .catch((err: AxiosError) => {
      return callback(err.message, null);
    });
};

export const cameraPermissions = (
  role: string,
  callback: Callback<null | AxiosResponse>
) => {
  api
    .post(`/admin/cameraPermissions?role=${role}`)
    .then((result: AxiosResponse) => {
      return callback(null, result.data);
    })
    .catch((err: AxiosError) => {
      return callback(err.message, null);
    });
};

export const getInfo = (callback: Callback<null | AxiosResponse>) => {
  api
    .post(`/admin/getInfo`)
    .then((result: AxiosResponse) => {
      return callback(null, result.data);
    })
    .catch((err: AxiosError) => {
      return callback(err.message, null);
    });
};
