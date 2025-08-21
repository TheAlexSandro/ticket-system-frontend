import axios, { AxiosError, AxiosResponse } from "axios";
import { useRuntimeConfig } from "nuxt/app";

const apis = axios.create({
  baseURL: "",
});

const useApi = () => {
  const configs = useRuntimeConfig();

  apis.defaults.baseURL = String(configs.public["BACKEND_URL"]);
  apis.interceptors.request.use(
    (config) => {
      const token = configs["API_TOKEN"];
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return { api: apis };
};

type Callback<T> = (error: string | null, result: T) => void;

export const getAdminDashboardInfo = (
  callback: Callback<null | AxiosResponse>
) => {
  const { api } = useApi();
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
  const { api } = useApi();
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
  const { api } = useApi();
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
  const { api } = useApi();
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
  const { api } = useApi();
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
  const { api } = useApi();
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
  const { api } = useApi();
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
  const { api } = useApi();
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
  const { api } = useApi();
  api
    .post(`/admin/getInfo`)
    .then((result: AxiosResponse) => {
      return callback(null, result.data);
    })
    .catch((err: AxiosError) => {
      return callback(err.message, null);
    });
};
