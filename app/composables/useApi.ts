import { useNuxtApp } from "nuxt/app";
import { AxiosError, AxiosInstance, AxiosResponse } from "axios";

type Callback<T> = (error: string | null, result: T) => void;
type Ticket = {
  id: string;
  tipe: "internal" | "eksternal";
  nama: string;
  kelas?: string | null;
  absen?: string | null;
  nomor_hp?: string | null;
};

export function useApi() {
  const { $api } = useNuxtApp();
  const apis = $api as AxiosInstance;
  
  return {
    refreshToken(callback: Callback<null | AxiosResponse>) {
      apis
        .post(`/auth/generateAuthentication`)
        .then((result: AxiosResponse) => {
          return callback(null, result.data["result"]["P_token"]);
        })
        .catch((err: AxiosError) => {
          return callback(err.message, null);
        });
    },
    getAdminDashboardInfo(
      P_token: string,
      callback: Callback<null | AxiosResponse>
    ) {
      apis
        .post(`/admin/getInfo`, {
          P_token,
        })
        .then((result: AxiosResponse) => {
          return callback(null, result.data);
        })
        .catch((err: AxiosError) => {
          return callback(err.message, null);
        });
    },
    getUsername(
      P_token: string,
      username: string,
      callback: Callback<null | AxiosResponse>
    ) {
      apis
        .post(`/auth/getUsername`, {
          P_token,
          username,
        })
        .then((result: AxiosResponse) => {
          return callback(null, result.data);
        })
        .catch((err: AxiosError) => {
          return callback(err.message, null);
        });
    },
    signIn(
      P_token: string,
      username: string,
      password: string,
      callback: Callback<null | AxiosResponse>
    ) {
      apis
        .post(`/auth/signin`, {
          P_token,
          username,
          password,
        })
        .then((result: AxiosResponse) => {
          return callback(null, result.data);
        })
        .catch((err: AxiosError) => {
          return callback(err.message, null);
        });
    },
    signOut(P_token: string, callback?: Callback<null | AxiosResponse>) {
      apis
        .post(`/auth/signOut`, {
          P_token,
        })
        .then((result: AxiosResponse) => {
          return callback?.(null, result.data);
        })
        .catch((err: AxiosError) => {
          return callback?.(err.message, null);
        });
    },
    verify(P_token: string, callback: Callback<null | AxiosResponse>) {
      apis
        .post(`/auth/verify`, {
          P_token,
        })
        .then((result: AxiosResponse) => {
          return callback(null, result.data);
        })
        .catch((err: AxiosError) => {
          return callback(err.message, null);
        });
    },
    clearCookie(P_token: string, callback?: Callback<null | AxiosResponse>) {
      apis
        .post(`/auth/clearCookie`, {
          P_token,
        })
        .then((result: AxiosResponse) => {
          return callback?.(null, result.data);
        })
        .catch((err: AxiosError) => {
          return callback?.(err.message, null);
        });
    },
    cameraStatus(
      P_token: string,
      status: string,
      callback: Callback<null | AxiosResponse>
    ) {
      apis
        .post(`/admin/cameraStatus`, {
          P_token,
          status,
        })
        .then((result: AxiosResponse) => {
          return callback(null, result.data);
        })
        .catch((err: AxiosError) => {
          return callback(err.message, null);
        });
    },
    cameraPermissions(
      P_token: string,
      role: string,
      callback: Callback<null | AxiosResponse>
    ) {
      apis
        .post(`/admin/cameraPermissions`, {
          P_token,
          role,
        })
        .then((result: AxiosResponse) => {
          return callback(null, result.data);
        })
        .catch((err: AxiosError) => {
          return callback(err.message, null);
        });
    },
    getInfo(P_token: string, callback: Callback<null | AxiosResponse>) {
      apis
        .post(`/admin/getInfo`, {
          P_token,
        })
        .then((result: AxiosResponse) => {
          return callback(null, result.data);
        })
        .catch((err: AxiosError) => {
          return callback(err.message, null);
        });
    },
    scan(P_token: string, identifier: string, callback: Callback<null | AxiosResponse | string | boolean>) {
      apis
        .post(`/users/scan`, {
          P_token,
          method: "id",
          identifier,
        })
        .then((result: AxiosResponse) => {
          if (!result["data"]["ok"]) return callback(null, false);
          result["data"]["result"].map((item: Ticket) => {
            var kelas = item.kelas ? `Kelas: ${item.kelas}<br>` : "";
            var absen = item.absen ? `Absen: ${item.absen}<br>` : "";
            var nomor_hp = item.nomor_hp ? `Nomor HP: ${item.nomor_hp}<br>` : "";
            return callback(null, `ID: ${item.id}<br>Tipe: ${item.tipe}<br>Nama: ${item.nama}<br>${kelas}${absen}${nomor_hp}`)
          })
        })
        .catch((err: AxiosError) => {
          return callback(err.message, null);
        });
    },
  };
}
