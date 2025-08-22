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
      const token = configs.public["API_TOKEN"];
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return { api: apis };
}

type Callback<T> = (error: string | null, result: T) => void;

export const refreshToken = (callback: Callback<null | AxiosResponse>) => {
  const { api } = useApi();
  api
    .post(`/auth/generateAuthentication`, {}, { withCredentials: true })
    .then((result: AxiosResponse) => {
      return callback(null, result.data);
    })
    .catch((err: AxiosError) => {
      return callback(err.message, null);
    });
};

export const getAdminDashboardInfo = (
  P_token: string,
  callback: Callback<null | AxiosResponse>
) => {
  const { api } = useApi();
  api
    .post(`/admin/getInfo?P_token=${P_token}`, {}, { withCredentials: true })
    .then((result: AxiosResponse) => {
      return callback(null, result.data);
    })
    .catch((err: AxiosError) => {
      return callback(err.message, null);
    });
};

export const getUsername = (
  P_token: string,
  username: string,
  callback: Callback<null | AxiosResponse>
) => {
  const { api } = useApi();
  api
    .post(`/auth/getUsername?username=${username}&P_token=${P_token}`, {}, { withCredentials: true })
    .then((result: AxiosResponse) => {
      return callback(null, result.data);
    })
    .catch((err: AxiosError) => {
      return callback(err.message, null);
    });
};

export const signIn = (
  P_token: string,
  username: string,
  password: string,
  callback: Callback<null | AxiosResponse>
) => {
  const { api } = useApi();
  api
    .post(
      `/auth/signin?username=${username}&password=${password}&P_token=${P_token}`,
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

export const signOut = (P_token: string, callback?: Callback<null | AxiosResponse>) => {
  const { api } = useApi();
  api
    .post(`/auth/signOut?P_token=${P_token}`, {}, { withCredentials: true })
    .then((result: AxiosResponse) => {
      return callback?.(null, result.data);
    })
    .catch((err: AxiosError) => {
      return callback?.(err.message, null);
    });
};

export const verify = (P_token: string, callback: Callback<null | AxiosResponse>) => {
  const { api } = useApi();
  api
    .post(`/auth/verify?P_token=${P_token}`, {}, { withCredentials: true })
    .then((result: AxiosResponse) => {
      return callback(null, result.data);
    })
    .catch((err: AxiosError) => {
      return callback(err.message, null);
    });
};

export const clearCookie = (P_token: string, callback?: Callback<null | AxiosResponse>) => {
  const { api } = useApi();
  api
    .post(`/auth/clearCookie?P_token=${P_token}`, {}, { withCredentials: true })
    .then((result: AxiosResponse) => {
      return callback?.(null, result.data);
    })
    .catch((err: AxiosError) => {
      return callback?.(err.message, null);
    });
};

export const cameraStatus = (
  P_token: string,
  status: string,
  callback: Callback<null | AxiosResponse>
) => {
  const { api } = useApi();
  api
    .post(`/admin/cameraStatus?status=${status}&P_token=${P_token}`, {}, { withCredentials: true })
    .then((result: AxiosResponse) => {
      return callback(null, result.data);
    })
    .catch((err: AxiosError) => {
      return callback(err.message, null);
    });
};

export const cameraPermissions = (
  P_token: string,
  role: string,
  callback: Callback<null | AxiosResponse>
) => {
  const { api } = useApi();
  api
    .post(`/admin/cameraPermissions?role=${role}&P_token=${P_token}`, {}, { withCredentials: true })
    .then((result: AxiosResponse) => {
      return callback(null, result.data);
    })
    .catch((err: AxiosError) => {
      return callback(err.message, null);
    });
};

export const getInfo = (P_token: string, callback: Callback<null | AxiosResponse>) => {
  const { api } = useApi();
  api
    .post(`/admin/getInfo?P_token=${P_token}`, {}, { withCredentials: true })
    .then((result: AxiosResponse) => {
      return callback(null, result.data);
    })
    .catch((err: AxiosError) => {
      return callback(err.message, null);
    });
};
