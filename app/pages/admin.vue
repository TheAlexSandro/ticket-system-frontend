<template>
  <template v-if="isLoading">
    <LoadingScreen />
  </template>

  <section class="admin" v-if="adminPanel">
    <div class="content">
      <template v-if="optionsView">
        <span class="head">Selamat Datang, admin!</span>
        <p class="description">Berikut adalah isi dari dashboard administrator yang saat ini tersedia.</p>

        <div class="options">
          <span class="title">Kunjungan</span>
          <div class="card">
            <div class="container">
              <div class="item" @click="maintenance()"><i class="ri-user-2-line"></i> Pengunjung PBL</div>
              <div class="item" @click="showMenu('website')"><i class="ri-user-5-line"></i> Pengunjung Website</div>
            </div>
          </div>

          <span class="title">Pemindaian</span>
          <div class="card">
            <div class="container">
              <div class="item" @click="showMenu('kamera')"><i class="ri-camera-line"></i> Kamera</div>
            </div>
          </div>

          <span class="title">Sudo</span>
          <div class="card">
            <div class="container">
              <div class="item" @click="signout()"><i class="ri-logout-circle-line"></i> Keluar</div>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <section class="submenu">
          <div class="back" @click="back()">
            <i class="ri-arrow-left-s-line"></i>
          </div>

          <!-- SUBMENU PENGUNJUNG WEBSITE -->
          <div class="pengunjung-website" v-if="websiteView">
            <div class="title"><i class="ri-user-5-line"></i> <span>Pengunjung Website</span></div>
            <p>Berikut adalah data pengunjung website pada pblsmekensa.site</p>
            <hr>

            <div class="iframe-wrapper">
              <div class="load" v-if="iframeLoad">
                <i class="ri-loader-4-line spin"></i> Memuat data...
              </div>

              <div class="error" v-if="iframeError">
                <i class="ri-alert-line"></i> Gagal memuat data
              </div>

              <iframe v-show="!iframeLoad && !iframeError" :src="iframes()" frameborder="0"
                @load="onIframeLoad" @error="onIframeError"></iframe>
            </div>

          </div>
          <!-- END OF SUBMENU PENGUNJUNG WEBSITE -->

          <!-- SUBMENU KAMERA -->
          <div class="kamera" v-if="kameraView">
            <div class="title"><i class="ri-camera-line"></i> <span>Kamera</span></div>
            <p>Anda dapat mengatur perizinan dan sesi kamera di sini.</p>
            <hr>

            <div class="menu-section">
              <div class="subtitle"><i class="ri-star-line"></i> <span>Perizinan</span></div>
              <p class="desc">Siapa saja yang Anda izinkan untuk melakukan pemindaian terhadap tiket pengunjung?</p>
              <div class="card">
                <div class="container">
                  <div class="item" @click="changeCamPermissions('all')"><i class="ri-user-line"></i> Semua Pengguna
                    <span><i :class="camPermissions == 'all' ? 'ri-check-line' : ''"></i></span>
                  </div>
                </div>
              </div>
              <div class="hint">
                Semua pengguna yang mengetahui tautan web ini akan dapat menggunakan fitur pemindaian.
              </div>
              <div class="card">
                <div class="container">
                  <div class="item" @click="changeCamPermissions('admin')"><i class="ri-user-star-line"></i> Hanya
                    Administrator <span><i :class="camPermissions == 'admin' ? 'ri-check-line' : ''"></i></span></div>
                </div>
              </div>
              <div class="hint">Hanya administratorlah yang diizinkan untuk menggunakan fitur pemindaian, sign in
                diperlukan.</div>
            </div>

            <div class="menu-section">
              <div class="subtitle"><i class="ri-smartphone-line"></i> <span>Sesi Kamera</span></div>
              <p class="desc">Kelola sesi aktif pemindaian, Anda yang memutuskan.</p>

              <div class="card">
                <div class="container">
                  <div class="item" @click="camStatus()"><i :class="cameraStatusesIcon"></i> {{ cameraStatusesM }}</div>
                </div>
              </div>
              <div v-if="camHint" class="hint" style="color: red;"><i class="ri-spam-2-line"></i> Tindakan ini akan
                menghentikan semua
                pemindaian, memblokir panel dan melarang pengguna dari mengakses kamera, ini tidak berlaku untuk
                administrator.</div>
            </div>
          </div>
          <!-- END OF SUBMENU KAMERA -->
        </section>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import "../css/admin.css";
import { onMounted, ref } from "vue";
import { signOut, verify, cameraStatus, cameraPermissions, clearCookie, refreshToken } from "../server/Api";
import { computed } from "vue";
import Swal from "sweetalert2";
import { useHead, useRuntimeConfig } from "nuxt/app";
import LoadingScreen from "../components/LoadingScreen.vue";

useHead({
  title: "Admin - PBL",
  link: [
    { rel: "icon", type: "image/png", href: "/image.png" }
  ]
})

const optionsView = ref(true);
const kameraView = ref(false);
const websiteView = ref(false);
const adminPanel = ref(false);
const adminObject = ref({});
const routeNow = ref("");
const camHint = ref(true);
const clicked = ref(false);
const isLoading = ref(true);
const iframeLoad = ref(true);
const iframeError = ref(false);
const showIframe = ref(false);

const camPermissions = ref<"all" | "admin">();
const cameraStatuses = ref<boolean>();

const iframes = (): string => {
  const configs = useRuntimeConfig();
  return String(configs.public["DATA_CHART_URL"]);
}

onMounted(() => {
  // adminPanel.value = true;
  // isLoading.value = false;
  refreshToken((error, token_result) => {
    if (error) return toast.error({ message: "Failed to fetch backend.", position: "topRight", pauseOnHover: false, displayMode: 2, timeout: 5000 });

    verify(token_result!["result"]["P_token"], (error, result) => {
      //@ts-ignore
      if (error) return toast.error({ message: "Failed to fetch pblsmekensa.site", position: "topRight", pauseOnHover: false, displayMode: 2, timeout: 5000 });
      if (!result!["ok"]) return window.location.href = "/signin";
      adminObject.value = result as object;
      cameraStatuses.value = result!["result"]["camera_status"] == "on" ? true : false;
      camPermissions.value = result!["result"]["camera_permissions"];
      camHint.value = result!["result"]["camera_status"] == "on" ? true : false;
      adminPanel.value = true;
      isLoading.value = false;
    })
  })
})

const onIframeLoad = () => {
  iframeLoad.value = false
  iframeError.value = false
}

const onIframeError = () => {
  iframeLoad.value = false
  iframeError.value = true
}

const cameraStatusesIcon = computed(() =>
  cameraStatuses.value ? "ri-alert-line" : "ri-check-line"
);

const cameraStatusesM = computed(() =>
  cameraStatuses.value ? "Blokir Semua Kamera Aktif" : "Izinkan Kamera"
);

//@ts-ignore
const toast = useToast();

const isLoggedIn = () => {
  //@ts-ignore
  if (!adminPanel.value) return toast.error({ message: "Signin is required!", position: "topRight", pauseOnHover: false, displayMode: 2, timeout: 5000 });
}

const maintenance = () => {
  //@ts-ignore
  isLoggedIn();
  return toast.error({ message: "This feature is currently under construction.", position: "topRight", pauseOnHover: false, displayMode: 2, timeout: 5000 });
}

const waits = () => {
  clicked.value = true;
  //@ts-ignore
  toast.info({ message: "Please wait...", position: "topRight", pauseOnHover: false, displayMode: 2, timeout: 4000 });
  if (clicked.value) return;
}

const stayBack = () => {
  clicked.value = false;
  //@ts-ignore
  toast.destroy();
}

const changeCamPermissions = (role: string) => {
  isLoggedIn();
  waits();
  if (camPermissions.value == role) return;
  refreshToken((error, token_result) => {
    if (error) return toast.error({ message: "Failed to fetch backend.", position: "topRight", pauseOnHover: false, displayMode: 2, timeout: 5000 });

    cameraPermissions(token_result!["result"]["P_token"], role, (error, result) => {
      if (error || !result!["ok"]) return toast.error({ message: result!["message"], position: "topRight", pauseOnHover: false, displayMode: 2, timeout: 5000 });
      camPermissions.value = role as "all" | "admin";
      stayBack();
    })
  });
}

const camStatus = () => {
  isLoggedIn();
  waits();
  refreshToken((error, token_result) => {
    if (error) return toast.error({ message: "Failed to fetch backend.", position: "topRight", pauseOnHover: false, displayMode: 2, timeout: 5000 });

    cameraStatus(token_result!["result"]["P_token"], cameraStatuses.value ? "off" : "on", (error, result) => {
      //@ts-ignore
      if (error || !result!["ok"]) return toast.error({ message: result["message"], position: "topRight", pauseOnHover: false, displayMode: 2, timeout: 5000 });
      cameraStatuses.value = cameraStatuses.value ? false : true;
      camHint.value = cameraStatuses.value ? true : false;
      stayBack();
    })
  });
}

const showMenu = (type: string) => {
  isLoggedIn();
  const refs = type == "kamera" ? kameraView : type == "website" ? websiteView : null;
  optionsView.value = false;
  routeNow.value = type;
  refs!.value = true;
}

const back = () => {
  isLoggedIn();
  const refs = routeNow.value == "kamera" ? kameraView : routeNow.value == "website" ? websiteView : null;
  optionsView.value = true;
  refs!.value = false;
  iframeLoad.value = true;
}

const signout = () => {
  isLoggedIn();
  Swal.fire({
    icon: "warning",
    title: "Are you sure?",
    text: "Anda akan log out dari halaman admin.",
    showCancelButton: true,
    showConfirmButton: true
  }).then((result) => {
    if (result.isConfirmed) {
      isLoading.value = true;
      adminPanel.value = false;
      refreshToken((error, token_result) => {
        if (error) return toast.error({ message: "Failed to fetch backend.", position: "topRight", pauseOnHover: false, displayMode: 2, timeout: 5000 });
        clearCookie(token_result!["result"]["P_token"]);
        signOut(token_result!["result"]["P_token"]);
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      });
    }
  })
}
</script>