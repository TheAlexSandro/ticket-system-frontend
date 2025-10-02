type VerifyOptions = {
  api: any;
  onError?: () => void;
  onAuthorized?: () => void;
  onUnauthorized?: () => void;
};

type VerifyResult = {
  camera_status: "on" | "off";
  camera_permissions: "all" | "admin";
  scanning_method: "id" | "name";
};

export const verifyAuthorization = (opts: VerifyOptions) => {
  const { api, onError, onAuthorized, onUnauthorized } = opts;

  const verify = (
    done?: (ok: boolean, token: string, response?: VerifyResult) => void
  ) => {
    api.accessToken((error: any, token_result: string | null) => {
      if (error) {
        onError?.();
        done?.(false, String(token_result));
        return;
      }

      const payload = JSON.stringify({ token: token_result });

      if (document.hidden && navigator.sendBeacon) {
        navigator.sendBeacon("/auth/verify", payload);
        onUnauthorized?.();
        done?.(false, String(token_result));
        return;
      }

      api.request(
        "/auth/verify",
        String(token_result),
        null,
        (err: any, result: any) => {
          if (err) {
            onError?.();
            done?.(false, String(token_result));
            return;
          }
          if (!result?.["ok"]) {
            onUnauthorized?.();
            done?.(false, String(token_result));
            return;
          }
          onAuthorized?.();
          done?.(true, String(token_result), result["result"]);
        }
      );
    });
  };

  const handleVisibility = () => {
    if (document.visibilityState == "visible") {
      verify();
    }
  };

  const mount = () => {
    document.addEventListener("visibilitychange", handleVisibility);
  };

  const unmount = () => {
    document.removeEventListener("visibilitychange", handleVisibility);
  };

  return { mount, unmount, verify };
};
