<template>
    <template v-if="isLoading">
        <LoadingScreen />
    </template>

    <template v-else>
        <section v-if="!isDisabled" class="dashboard">
            <template v-if="!cameraAccess">
                <div class="banner">
                    <img src="/banner.png" alt="Banner"></img>
                </div>
                <h1>Welcome to Ticket Scanner!</h1>
                <p>Ticket Scanner adalah sistem yang digunakan untuk memverifikasi keaslian tiket dengan memindai Kode
                    QR pada tiket menggunakan perangkat smartphone, PC ataupun tablet.</p>

                <p>Sebelum memindai Kode QR pada tiket, kami memerlukan akses ke kamera pada perangkat Anda. Tekan
                    tombol di bawah untuk memberikan izin.</p>
                <div class="button" style="margin-bottom: 50px">
                    <button class="btn-custom" @click="startCamera('camera')">
                        <i class="ri-check-line"></i> Mulai Memindai
                    </button>
                </div>
            </template>

            <template v-else>
                <h1>Ticket Scanner</h1>
                <p>Arahkan kamera ke Kode QR yang tersedia pada tiket pengunjung, pastikan Kode QR terlihat jelas di
                    kamera agar dapat dipindai.</p>
                <div class="content">
                    <div class="video-wrapper">
                        <video id="camera" autoplay playsinline></video>

                        <div class="overlay" v-if="showWarning">
                            <div class="icon"><i class="ri-alert-line"></i></div>
                            <h1>Camera Disabled!</h1>
                            <p>{{ !isFromWebsocket ? 'Tekan pada "aktifkan" untuk menggunakan kamera lagi.' : 'Camera is disabled by the administrator.' }}</p>
                        </div>
                    </div>
                </div>

                <div class="button-navigation" v-if="!isFromWebsocket">
                    <div class="button">
                        <div class="btn" @click="getCameraState().action()"><i :class="getCameraState().icon"></i>
                            {{ getCameraState().title }}
                        </div>
                    </div>
                    <div v-if="!isCameraStopped" class="button">
                        <div class="btn" @click="stopCamera('stops')"><i class="ri-stop-circle-line"></i>
                            Hentikan</div>
                    </div>

                    <div class="others">
                        <div class="container">
                            <div class="expand" @click="toggleOther()">Pengaturan Lain <i :class="othersIcon"></i></div>
                            <template v-if="others">
                                <div class="inline-button">
                                    <div class="button">
                                        <div class="btn" @click="mirror('camera', 'X')"><i
                                                class="ri-layout-grid-fill"></i>
                                            MirrorX</div>
                                    </div>
                                    <div class="button">
                                        <div class="btn" @click="mirror('camera', 'Y')"><i
                                                class="ri-layout-grid-fill"></i>
                                            MirrorY</div>
                                    </div>
                                </div>
                                <div class="button" v-if="flashAvailable">
                                    <div class="btn" @click="changeFlash()"><i :class="getFlashStateIcon"></i>
                                        {{ getFlashStateText }}
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <div v-else class="panel">
                    <i class="ri-alert-line"></i>
                    <p>Panel Disabled</p>
                </div>
            </template>
        </section>

        <section v-if="cameraErrType">
            <Camera :type="cameraErrType" />
        </section>
        <section v-if="ok == 'error'">
            <Errors />
        </section>
    </template>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted } from "vue";
import { BrowserMultiFormatReader } from "@zxing/browser";
import "./css/Dashboard.css";
import "./css/Custom.css";
import Camera from "./Camera.vue";
import LoadingScreen from "../LoadingScreen.vue";
import Errors from "../errors/Errors.vue";
import { useSocket } from '../../../composables/useSocket';
import Swal from "sweetalert2";
import { useApi } from "../../../composables/useApi";

type OverflowState = "hidden" | "visible";
type MirrorScale = "Y" | "X";
type StopCamera = "stops" | "change";

//@ts-ignore
const toast = useToast() as any;
const isLoading = ref(true);
const api = useApi();
const cameraAccess = ref(false);
const isDisabled = ref(false);
const cameraErrType = ref<"denied" | "no_camera" | "error" | "camera_gone" | "no_flash">();
const facingMode = ref("environment");
const currentStream = ref<MediaStream | null>(null);
const isCameraStopped = ref(false);
const inChangeDirection = ref(false);
const hasSetOverflow = ref(false);
const others = ref(false);
const mirrorX = ref(1);
const mirrorY = ref(1);
const showWarning = ref(false);
const isFromWebsocket = ref(false);
const socket = useSocket();
const camStatus = ref(true);
const permitted = ref(false);
const camPermission = ref<"all" | "admin">();
const scanMethod = ref<"id" | "name">();
const popupShown = ref(false);
const ok = ref<"wait" | "done" | "error">();
const flash = ref(false);
const streams = ref<MediaStreamTrack | null>(null);
const userStarts = ref(false);
const flashAvailable = ref(false);

const othersIcon = computed(() =>
    others.value ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"
);
let codeReader: BrowserMultiFormatReader | null = null;

const stopRequest = () => {
    isLoading.value = false;
    isDisabled.value = true;
    ok.value = "error";
}

onMounted(() => {
    api.refreshToken((error, token_result) => {
        ok.value = "wait";
        if (error) { stopRequest(); return };

        api.verify(String(token_result), (error, result) => {
            if (error) { stopRequest(); return };
            if (error || !result!['ok']) return;
            permitted.value = true;
        })

        api.getInfo(String(token_result), (error, result) => {
            if (error || !result!['ok']) { stopRequest(); return };
            ok.value = "done";
            camStatus.value = result!["result"]["camera_status"] == "on";
            camPermission.value = result!["result"]["camera_permissions"] as "all" | "admin";
            scanMethod.value = result!["result"]["scanning_method"] as "id" | "name";

            isLoading.value = false;
            if (userStarts.value) {
                userStarts.value = false;
                toast.destroy();
                toast.success({ message: "You can try now...", position: 'topRight', pauseOnHover: false, displayMode: 2, timeout: 5000 });
            }
        })
    });

    socket.on("camera_status", (data) => {
        if (data['status'] == null) return;
        if (!permitted.value) {
            if (data['status'] == false) {
                stopCamera("stops");
                isCameraStopped.value = true;
                showWarning.value = true;
                isFromWebsocket.value = true;
            }
            window.location.reload();
        }
    })

    socket.on("logout", (data) => {
        if (data['status'] == null) return;
        if (!permitted.value) {
            if (data['status']) {
                stopCamera("stops");
                isDisabled.value = true;
                window.location.reload();
            }
        }
    })
})

const isCameraSupported = () => {
    return (
        !!(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function')
        || !!((navigator as any).getUserMedia)
        || !!((navigator as any).webkitGetUserMedia)
        || !!((navigator as any).mozGetUserMedia)
    )
}

const detectDeviceType = (): "mobile" | "desktop" => {
    const ua = navigator.userAgent;

    const isIPad = /\b(iPad)\b/i.test(ua) ||
        (/\bMacintosh\b/i.test(ua) && navigator.maxTouchPoints > 1);

    if (/android|iphone|ipod|windows phone|mobile/i.test(ua) || isIPad) {
        return "mobile";
    }
    return "desktop";
}

const toggleOther = () => {
    if (isCameraStopped.value) {
        //@ts-ignore
        toast.warning({ message: 'Tidak dapat menggunakan fitur ini ketika kamera tidak aktif', position: 'topRight', pauseOnHover: false, displayMode: 2, timeout: 5000 });
        return;
    };
    others.value = !others.value;
}

const mirror = (video_id: string, type: MirrorScale) => {
    const video = document.getElementById(video_id) as HTMLVideoElement;
    if (video) {
        const mirrorCase = (type == "X") ? mirrorX.value == 1 ? -1 : 1 : mirrorY.value == 1 ? -1 : 1;
        const mirrorScale = (type == "X") ? `scale(${mirrorCase}, ${mirrorY.value})` : `scale(${mirrorX.value}, ${mirrorCase})`;
        video.style.transform = mirrorScale;
        if (type == "X") { mirrorX.value = mirrorCase } else { mirrorY.value = mirrorCase };
    }
}

const overflow = (state: OverflowState) => {
    if (hasSetOverflow.value) return;
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";

    document.body.style.overflowY = state;
    document.documentElement.style.overflowY = state;
}

const stopCamera = (type: StopCamera) => {
    if (currentStream.value) {
        currentStream.value.getTracks().forEach(track => track.stop());
        if (type == "stops") { showWarning.value = true };
        isCameraStopped.value = true;
        others.value = false;
    }
}

const startCamera = async (video_id: string) => {
    //@ts-ignore
    if (ok.value == "wait") {
        userStarts.value = true;
        return toast.info({ message: "Please wait...", position: 'topRight', pauseOnHover: false, displayMode: 2, timeout: 5000 });
    }
    if (ok.value == "error") return toast.error({ message: "Failed to fetch backend.", position: 'topRight', pauseOnHover: false, displayMode: 2, timeout: 5000 });
    if (!permitted.value && camPermission.value == "admin") return toast.warning({ message: 'Masuk sebagai administrator untuk memindai tiket.', position: 'topRight', pauseOnHover: false, displayMode: 2, timeout: 5000 });
    setTimeout(async () => {
        if (!isCameraSupported()) {
            isDisabled.value = true;
            isLoading.value = false;
            cameraErrType.value = "no_camera";
            return;
        }

        overflow("visible");
        try {
            stopCamera("stops");
            isLoading.value = true;
            const videoType = detectDeviceType() == "mobile" ? { video: { facingMode: { exact: facingMode.value } } } : { video: true };
            const stream = await navigator.mediaDevices.getUserMedia(videoType);
            if (!stream) {
                isDisabled.value = true;
                isLoading.value = false;
                cameraErrType.value = "camera_gone";
                return;
            }

            if (facingMode.value == "environment") { flashAvailable.value = true } else { flashAvailable.value = false };
            cameraAccess.value = true;
            currentStream.value = stream;
            showWarning.value = false;
            streams.value = stream.getVideoTracks()[0];
            isLoading.value = false;
            await nextTick();
            const video = document.getElementById(video_id) as HTMLVideoElement;
            if (video) {
                if (facingMode.value == "user") { video.style.transform = "scaleX(-1)" } else { video.style.transform = "scaleX(1)" };
                if (inChangeDirection.value) { inChangeDirection.value = false };
                isCameraStopped.value = false;
                video.srcObject = stream;
                try {
                    await video.play();
                    if (!camStatus.value && !permitted.value) {
                        stopCamera('stops');
                        isCameraStopped.value = true;
                        showWarning.value = true;
                        isFromWebsocket.value = true;
                        return;
                    }
                    startQRScanning(video);
                } catch {
                    toast.error({ message: 'Failed to start camera!' });
                }
            }
        } catch (err: any) {
            toast.error({ message: err.message, position: 'topRight', pauseOnHover: false, displayMode: 2, timeout: 5000 });
            overflow("visible");
            isLoading.value = false;
            isDisabled.value = true;
            if (err?.name === "NotAllowedError") {
                cameraErrType.value = "denied";
            } else {
                cameraErrType.value = "error";
            }
        }
    }, 500)
}

const startQRScanning = (video: HTMLVideoElement) => {
    codeReader = new BrowserMultiFormatReader();
    codeReader.decodeFromVideoElement(video, (result, error) => {
        if (result) {
            if (!popupShown.value) {
                popupShown.value = true;
                toast.info({ message: "Sedang meminta data ke server...", position: 'topRight', pauseOnHover: false, displayMode: 2, close: false, timeout: 10000 });
                if (!String(result.getText()).startsWith("PBL-")) {
                    toast.destroy();
                    Swal.fire({
                        title: 'Warning!',
                        icon: 'warning',
                        text: "Bukan tiket yang valid!",
                        showCancelButton: false,
                        showConfirmButton: true,
                        confirmButtonText: "OK"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            popupShown.value = false;
                        }
                    })
                    return;
                }
                api.scan(result.getText(), String(scanMethod.value), (error, result) => {
                    if (error) {
                        toast.destroy();
                        Swal.fire({
                            title: 'Error!',
                            icon: 'error',
                            text: "Error, please try again.",
                            showCancelButton: false,
                            showConfirmButton: true,
                            confirmButtonText: "OK"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                popupShown.value = false;
                            }
                        })
                        return;
                    }
                    toast.destroy();
                    if (!result) {
                        Swal.fire({
                            title: 'Failed!',
                            icon: 'error',
                            text: "Pengguna tidak ditemukan!",
                            showCancelButton: false,
                            showConfirmButton: true,
                            confirmButtonText: "OK"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                popupShown.value = false;
                            }
                        })
                        return;
                    }

                    Swal.fire({
                        title: 'Success!',
                        icon: result["icon"],
                        html: result["text"],
                        showCancelButton: false,
                        showConfirmButton: true,
                        confirmButtonText: "OK"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            popupShown.value = false;
                        }
                    })
                })
            }
        };
    })
}

const changeFlash = async () => {
    //@ts-ignore
    if (streams && streams.value?.getCapabilities().torch) {
        try {
            const status = flash.value ? false : true;
            flash.value = status;
            //@ts-ignore
            await streams.value.applyConstraints({ advanced: [{ torch: status }] });
        } catch (err) {
            stopCamera('stops');
            overflow("visible");
            isDisabled.value = true;
            cameraErrType.value = "error";
        }

    } else {
        stopCamera('stops');
        overflow("visible");
        isDisabled.value = true;
        cameraErrType.value = "no_flash";
    }
}

const switchCamera = async () => {
    if (!navigator?.mediaDevices?.enumerateDevices()) {
        isDisabled.value = true;
        cameraErrType.value = "no_camera";
        return;
    }

    stopCamera("change");
    try {
        inChangeDirection.value = true;
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(device => device.kind === "videoinput");

        if (videoInputs.length > 1) {
            facingMode.value = facingMode.value == "environment" ? "user" : "environment";
            flash.value = false;
            startCamera('camera');
        } else {
            isDisabled.value = true;
            cameraErrType.value = "camera_gone";
            return;
        }
    } catch (err: any) {
        isDisabled.value = true;
        if (err?.name === "NotAllowedError") {
            cameraErrType.value = "denied";
        } else {
            cameraErrType.value = "error";
        }
    }
}

const getFlashStateText = computed(() =>
    !flash.value ? "Aktifkan Flash" : "Matikan Flash"
)

const getFlashStateIcon = computed(() =>
    !flash.value ? "ri-lightbulb-flash-line" : "ri-lightbulb-flash-fill"
)

const getCameraState = () => {
    return {
        icon: isCameraStopped.value && inChangeDirection.value ? "ri-camera-switch-line" : isCameraStopped.value && !inChangeDirection.value ? "ri-check-line" : "ri-camera-switch-line",
        title: isCameraStopped.value && inChangeDirection.value ? "Mengubah Arah..." : isCameraStopped.value && !inChangeDirection.value ? 'Aktifkan' : 'Ubah Arah',
        action: () => {
            if (isCameraStopped.value) startCamera('camera')
            else switchCamera()
        }
    }
}

</script>
