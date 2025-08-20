<template>
    <LoadingScreen v-if="isLoading" />

    <section v-else>
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
                            <div v-if="others" class="inline-button">
                                <div class="button">
                                    <div class="btn" @click="mirror('camera', 'X')"><i class="ri-layout-grid-fill"></i>
                                        MirrorX</div>
                                </div>
                                <div class="button">
                                    <div class="btn" @click="mirror('camera', 'Y')"><i class="ri-layout-grid-fill"></i>
                                        MirrorY</div>
                                </div>
                            </div>
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
    </section>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted } from "vue";
import { BrowserMultiFormatReader } from "@zxing/browser";
import "~/css/dashboard.css";
import "~/css/custom.css";
import Camera from "./Camera.vue";
import { useSocket } from '../composables/useSocket';
import { getInfo, verify } from "../server/Api";
import Swal from "sweetalert2";

type OverflowState = "hidden" | "visible";
type MirrorScale = "Y" | "X";
type StopCamera = "stops" | "change";

//@ts-ignore
const toast = useToast() as any;
//
const cameraAccess = ref(false);
const isDisabled = ref(false);
const cameraErrType = ref<"denied" | "no_camera" | "error" | "camera_gone">();
const facingMode = ref("environment");
const currentStream = ref<MediaStream | null>(null);
const isCameraStopped = ref(false);
const inChangeDirection = ref(false);
const isLoading = ref(false);
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
const popupShown = ref(false);

const othersIcon = computed(() =>
    others.value ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"
);
let codeReader: BrowserMultiFormatReader | null = null;

onMounted(() => {
    verify((error, result) => {
        if (error || !result!['ok']) return;
        permitted.value = true;
    })

    getInfo((error, result) => {
        if (error || !result!['ok']) return;
        camStatus.value = result!["result"]["camera_status"] == "on" ? true : false;
        camPermission.value = result!["result"]["camera_permissions"] as "all" | "admin";
    })

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
        const mirroScale = (type == "X") ? `scale(${mirrorCase}, ${mirrorY.value})` : `scale(${mirrorX.value}, ${mirrorCase})`;
        video.style.transform = mirroScale;
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
    setTimeout(async () => {
        if (!isCameraSupported()) {
            isDisabled.value = true;
            isLoading.value = false;
            cameraErrType.value = "no_camera";
            return;
        }

        //@ts-ignore
        if (!permitted.value && camPermission.value == "admin") return toast.warning({ message: 'Masuk sebagai administrator untuk memindai tiket.', position: 'topRight', pauseOnHover: false, displayMode: 2, timeout: 5000 });

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

            cameraAccess.value = true;
            currentStream.value = stream;
            isLoading.value = false;
            showWarning.value = false;
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
                Swal.fire({
                    title: 'Success!',
                    icon: 'success',
                    text: String(result),
                    showCancelButton: false,
                    showConfirmButton: true,
                    confirmButtonText: "OK"
                }).then((result) => {
                    if (result.isConfirmed) {
                        popupShown.value = false;
                    }
                })
            }
        };
    })
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
            facingMode.value = facingMode.value == "environment" ? "user" : "environment"
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
