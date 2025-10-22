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
  is_scanned?: boolean | null;
};

type ApiResponse = {
  status_code: number;
  ok: boolean;
  message: string | Error | null;
  error_code: string | null;
  result?: any;
};

export function useApi() {
  const { $api } = useNuxtApp();
  const apis = $api as AxiosInstance;

  return {
    request(
      path: string,
      P_token: string,
      options: {} | null = null,
      callback?: Callback<null | ApiResponse>
    ): void {
      apis
        .post(path, { P_token, ...options })
        .then((result: AxiosResponse) => {
          return callback?.(null, result.data);
        })
        .catch((err: AxiosError) => {
          return callback?.(err.message, null);
        });
    },
    accessToken(callback: Callback<null | string>) {
      apis
        .post(`/auth/generateAuthentication`)
        .then((result: AxiosResponse) => {
          return callback(null, result.data["result"]["P_token"]);
        })
        .catch((err: AxiosError) => {
          return callback(err.message, null);
        });
    },
    scan(
      identifier: string,
      method: string,
      callback: Callback<null | ApiResponse | string | boolean | object>
    ) {
      apis
        .post(`/users/scan`, {
          method,
          identifier,
        })
        .then((result: AxiosResponse) => {
          const item = result["data"]["result"];
          var nis = item.nis ? `NIS: ${item.nis}<br>` : "";
          var kelas = item.kelas ? `Kelas: ${item.kelas}<br>` : "";
          var jantina = item.jantina ? `Jenis Kelamin: ${item.jantina == "L" ? "Laki-laki" : "Perempuan"}<br>`:"";
          var nomor_hp = item.nomor_hp ? `Nomor HP: ${item.nomor_hp}<br>` : "";
          var message = item.is_scanned
            ? `<strong>Tiket sudah dipindai!</strong><br><br>`
            : ``;
          var icon = item.is_scanned ? "warning" : "success";

          return callback(null, {
            text: `${message}ID: ${item.id}<br>Tipe: ${item.tipe}<br>Nama: ${item.nama}<br>${nis}${jantina}${kelas}${nomor_hp}`,
            icon,
          });
        })
        .catch((err: AxiosError) => {
          return callback(err.message, null);
        });
    },
  };
}
