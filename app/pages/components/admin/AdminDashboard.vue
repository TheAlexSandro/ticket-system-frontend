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
          <div class="bg">
            <span class="title">Pintasan Cepat</span>
            <div class="card">
              <div class="container">
                <div class="item" @click="redirect('scanner')"><i class="ri-dv-fill"></i> Mulai Memindai</div>
                <div class="item" @click="redirect('alumni')"><i class="ri-file-list-line"></i> Periksa Alumni</div>
              </div>
            </div>
          </div>

          <hr>

          <span class="title">Kunjungan</span>
          <div class="card bg-w">
            <div class="container">
              <div class="item" @click="showMenu('pengunjung')"><i class="ri-user-2-line"></i> Pengunjung PBL</div>
              <!-- DISABLED FOR SOME REASON -->
              <!-- <div class="item" @click="showMenu('website')"><i class="ri-user-5-line"></i> Pengunjung Website</div> -->
            </div>
          </div>

          <span class="title">Sistem</span>
          <div class="card bg-w">
            <div class="container">
              <div class="item" @click="showMenu('kamera')"><i class="ri-camera-line"></i> Kamera</div>
              <div class="item" @click="showMenu('pemindaian')"><i class="ri-coupon-2-line"></i> Metode Pemindaian</div>
              <div class="item" @click="showMenu('restart')"><i class="ri-restart-line"></i> Restart</div>
            </div>
          </div>

          <span class="title">Sudo</span>
          <div class="card bg-w">
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

          <!-- SUBMENU PENGUNJUNG PBL -->
          <div class="pengunjung-pbl" v-if="pengunjungView">
            <div class="title"><i class="ri-user-2-line"></i> <span>Pengunjung PBL</span></div>
            <p>Berikut adalah total jumlah pengunjung dan jumlah tiket yang tersedia saat ini.</p>
            <hr>

            <div class="load-wrapper">
              <div class="load" v-if="pblLoad">
                <i class="ri-loader-4-line spin"></i> Memuat data...
              </div>

              <div class="dash" v-if="pblDone">
                <div class="item">
                  <span class="sub"><i style="color: #5CE65C;" class="ri-coupon-line"></i> Total Tiket</span>
                  <span>{{ ticketTotal }}</span>
                </div>
                <div class="item">
                  <span class="sub"><i style="color: #FF8DA1;" class="ri-coupon-fill"></i> Tiket Dipindai</span>
                  <span>{{ pengunjungTotal }}</span>
                </div>
              </div>
            </div>

            <div class="menu-section">
              <div class="subtitle"><i class="ri-coupon-3-line"></i> <span>Lihat Daftar</span></div>
              <p class="desc">Lihat daftar tiket yang sudah di pindai.</p>
              <div class="card">
                <div class="container">
                  <div class="item" @click="showMenu('daftar-tiket')"><i class="ri-user-follow-line"></i> Daftar Tiket
                    Dipindai</div>
                </div>
              </div>
            </div>
          </div>
          <!-- END OF SUBMENU PENGUNJUNG PBL -->

          <!-- SUBMENU RESTART -->
          <div class="restart" v-if="restartView">
            <div class="title"><i class="ri-restart-line"></i> <span>Restart</span></div>
            <p>Dari sini, Anda dapat me-restart paksa layanan ini.</p>
            <hr>

            <div class="menu-section">
              <div class="card">
                <div class="container">
                  <div class="item" @click="restart()" style="color: red;"><i class="ri-alert-fill"></i> Restart Paksa
                  </div>
                </div>
              </div>
              <div class="hint" style="color: red;"><i class="ri-spam-2-line"></i>
                Dengan Anda me-restart paksa layanan ini, semua proses yang sedang berjalan akan dihentikan, dan semua
                sesi admin akan dihapus.
              </div>
            </div>
          </div>
          <!-- END OF SUBMENU RESTART -->

          <!-- SUBMENU METODE PEMINDAIAN -->
          <div class="metode-pemindaian" v-if="pemindaianView">
            <div class="title"><i class="ri-coupon-2-line"></i> <span>Metode Pemindaian</span></div>
            <p>Dari sini, Anda dapat memilih metode pemindaian bawaan untuk tiket.</p>
            <hr>

            <div class="menu-section">
              <div class="card">
                <div class="container">
                  <div class="item" @click="changePemindaianMethod('name')"><i class="ri-font-family"></i> Dengan Nama
                    <span><i :class="pemindaianMethod == 'name' ? 'ri-check-line' : ''"></i></span>
                  </div>
                </div>
              </div>
              <div class="hint">
                Pemindaian pada tiket akan dilakukan dengan menggunakan nama pada tiket.
              </div>
              <div class="card">
                <div class="container">
                  <div class="item" @click="changePemindaianMethod('id')"><i class="ri-id-card-line"></i> Dengan ID
                    <span><i :class="pemindaianMethod == 'id' ? 'ri-check-line' : ''"></i></span>
                  </div>
                </div>
              </div>
              <div class="hint">
                Pemindaian pada tiket akan dilakukan dengan menggunakan ID pada tiket.
              </div>
            </div>
          </div>
          <!-- END OF SUBMENU METODE PEMINDAIAN -->

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

  <section v-if="isFailed">
    <Errors />
  </section>
</template>

<script setup lang="ts">
import "./css/AdminDashboard.css";
import { onMounted, ref } from "vue";
import { computed } from "vue";
import Swal from "sweetalert2";
import LoadingScreen from "../global/LoadingScreen.vue";
import { useApi } from "../../../composables/useApi";
import Errors from "../errors/Errors.vue";

type Callback<T> = (result: T) => void;

//@ts-ignore
const toast = useToast();
const api = useApi();
const optionsView = ref(true);
const kameraView = ref(false);
const websiteView = ref(false);
const pengunjungView = ref(false);
const pemindaianView = ref(false);
const restartView = ref(false);

const adminPanel = ref(false);
const ticketTotal = ref(0);
const pengunjungTotal = ref(0);
const routeNow = ref("");
const camHint = ref(true);
const clicked = ref(false);
const isLoading = ref(true);
const iframeLoad = ref(true);
const isFailed = ref(false);
const pblLoad = ref(true);
const pblError = ref(false);
const pblDone = ref(false);

const camPermissions = ref<"all" | "admin">();
const pemindaianMethod = ref<"id" | "name">();
const cameraStatuses = ref<boolean>();

const stopRequest = () => {
  toast.destroy();
  isLoading.value = false;
  adminPanel.value = false;
  isFailed.value = true;
}

onMounted(() => {
  api.accessToken((error, token_result) => {
    if (error) { stopRequest(); return; }

    api.request("/auth/verify", String(token_result), null, (error, result) => {
      if (!result!["ok"] && result!["error_code"] == "UNAUTHORIZED_ACCESS") return window.location.href = "/signin";
      if (error || !result!["ok"]) { stopRequest(); return; }
      cameraStatuses.value = result!["result"]["camera_status"] == "on" ? true : false;
      camPermissions.value = result!["result"]["camera_permissions"];
      pemindaianMethod.value = result!["result"]["scanning_method"];
      camHint.value = result!["result"]["camera_status"] == "on" ? true : false;

      adminPanel.value = true;
      isLoading.value = false;
    })
  })
})

const cameraStatusesIcon = computed(() =>
  cameraStatuses.value ? "ri-alert-line" : "ri-check-line"
);

const cameraStatusesM = computed(() =>
  cameraStatuses.value ? "Blokir Semua Kamera Aktif" : "Izinkan Kamera"
);

const verify = (callback: Callback<null | boolean>) => {
  adminPanel.value = false;
  isLoading.value = true;
  api.accessToken((error, token_result) => {
    if (error) { stopRequest(); return };

    api.request("/auth/verify", String(token_result), null, (error, result) => {
      if (error) { stopRequest(); return };
      if (error || !result!['ok']) { window.location.href = "/signin" };
      adminPanel.value = true;
      isLoading.value = false;
      return callback(true);
    })
  });
}

const maintenance = () => {
  //@ts-ignore
  isLoggedIn();
  return toast.error({ message: "This feature is currently under construction.", position: "topRight", pauseOnHover: false, displayMode: 2, timeout: 5000 });
}

const redirect = (type: string) => {
  verify((isLoggedIn) => {
    if (!isLoggedIn) return;
    if (type == "scanner") return window.location.href = "/scanner";
    if (type == "alumni") return window.location.href = "/alumni";
  })
}

const waits = () => {
  clicked.value = true;
  //@ts-ignore
  toast.info({ message: "Please wait...", position: "topRight", pauseOnHover: false, displayMode: 2, timeout: 7000 });
  if (clicked.value) return;
}

const stayBack = () => {
  clicked.value = false;
  //@ts-ignore
  toast.destroy();
}

const restart = () => {
  verify((isLoggedIn) => {
    if (!isLoggedIn) return;
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      text: "Apa Anda yakin ingin melakukan ini? tindakan tidak dapat dibatalkan, ini mempengaruhi semua perangkat!!!",
      showCancelButton: true,
      showConfirmButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        waits();
        api.accessToken((error, token_result) => {
          if (error) { stopRequest(); return; }
          api.request("/admin/forceRefresh", String(token_result), null, (error, result) => {
            if (error || !result!["ok"]) { stopRequest(); return; }
            window.location.reload();
            return;
          })
        })
      }
    })
  })
}

const changeCamPermissions = (role: string) => {
  verify((isLoggedIn) => {
    if (!isLoggedIn) return;
    waits();
    if (camPermissions.value == role) return;
    api.accessToken((error, token_result) => {
      if (error) { stopRequest(); return; }

      api.request("/admin/cameraPermissions", String(token_result), { role }, (error, result) => {
        if (error || !result!["ok"]) { stopRequest(); return; }
        camPermissions.value = role as "all" | "admin";
        stayBack();
      })
    });
  })
}

const changePemindaianMethod = (method: string) => {
  verify((isLoggedIn) => {
    if (!isLoggedIn) return;
    waits();
    if (pemindaianMethod.value == method) return;
    api.accessToken((error, token_result) => {
      if (error) { stopRequest(); return; }

      api.request("/admin/scanningMethod", String(token_result), { method }, (error, result) => {
        if (error || !result!["ok"]) { stopRequest(); return; }
        pemindaianMethod.value = method as "id" | "name";
        stayBack();
      })
    });
  })
}

const camStatus = () => {
  verify((isLoggedIn) => {
    if (!isLoggedIn) return;
    waits();
    api.accessToken((error, token_result) => {
      if (error) { stopRequest(); return; }

      api.request("/admin/cameraStatus", String(token_result), { status: cameraStatuses.value ? "off" : "on" }, (error, result) => {
        if (error || !result!["ok"]) return toast.error({ message: result!["message"], position: "topRight", pauseOnHover: false, displayMode: 2, timeout: 5000 });
        cameraStatuses.value = cameraStatuses.value ? false : true;
        camHint.value = cameraStatuses.value ? true : false;
        stayBack();
      })
    });
  })
}

const showMenu = (type: string) => {
  verify((isLoggedIn) => {
    if (!isLoggedIn) return;
    if (type == 'daftar-tiket') {
      window.location.href = "/scanned-ticket";
      return;
    }
    const refs = type == "kamera" ? kameraView : type == "website" ? websiteView : type == "pemindaian" ? pemindaianView : type == "restart" ? restartView : type == "pengunjung" ? pengunjungView : null;
    optionsView.value = false;
    routeNow.value = type;
    refs!.value = true;

    if (type == "pengunjung") {
      api.accessToken((error, token_result) => {
        if (error) { stopRequest(); return };
        api.request("/admin/getTotal", String(token_result), null, (error, total) => {
          if (error || !total!["ok"]) { stopRequest(); return };
          ticketTotal.value = Number(total!["result"]["total"]["total_ticket"]);
          pengunjungTotal.value = Number(total!["result"]["total"]["total_pengunjung"]);
          pblDone.value = true;
          pblError.value = false;
          pblLoad.value = false;
        })
      })
    }
  })
}

const back = () => {
  verify((isLoggedIn) => {
    if (!isLoggedIn) return;
    const refs = routeNow.value == "kamera" ? kameraView : routeNow.value == "website" ? websiteView : routeNow.value == "pemindaian" ? pemindaianView : routeNow.value == "restart" ? restartView : routeNow.value == "pengunjung" ? pengunjungView : null;
    optionsView.value = true;
    refs!.value = false;
    iframeLoad.value = true;
    pblDone.value = false;
    pblLoad.value = true;
  })
}

const signout = () => {
  verify((isLoggedIn) => {
    if (!isLoggedIn) return;
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
        api.accessToken((error, token_result) => {
          if (error) { stopRequest(); return; }
          api.request("/auth/clearCookie", String(token_result), null);
          api.request("/auth/signOut", String(token_result), null, (err, results) => {
            if (err) { toast.info({ message: err, position: "topRight", pauseOnHover: false, displayMode: 2, timeout: 5000 }) };
            window.location.href = "/";
          });
        });
      }
    })
  })
}
</script>