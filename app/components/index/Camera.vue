<template>
    <section class="information">
        <div class="container">
            <img :src="icon" alt="An Icon">

            <div class="description">
                <h1>{{ title }}</h1>
                <p v-html="description"></p>
                <br>
                <p>If you believe this is a bug, please contact the administrator.</p>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import "~/css/camera.css";
import { computed } from "vue";

const props = defineProps({
    type: String
})

const icon = computed(() =>
    props.type == "error" ? "/icons/error.svg" : "/icons/warning.svg"
)
const title = computed(() => 
    props.type == "error" ? "Something Wrong!" : props.type == "denied" ? "Camera Access Denied!" : props.type == "no_camera" ? "Unsupported Device!" : props.type == "camera_gone" ? "Cannot Detect Camera!" : null
)
const description = computed(() => 
    props.type == "error" ? "An unexpected error occurred while trying to access your camera. This could be due to a temporary glitch, a conflicting application using your camera, or an internal browser issue. Sometimes, background processes may block camera access without showing a clear warning.<br><br>To fix this, try refreshing the page, closing other applications that might be using the camera, or restarting your browser. If the issue persists, update your browser and operating system, or contact technical support for further assistance." : props.type == "denied" ? "You have denied camera access, which prevents this feature from working. Without permission, the application cannot start the scanner.<br><br>To enable camera access, click the lock icon next to your browser's address bar, find the camera permissions, and set it to Allow After making the change, refresh the page to try again." : props.type == "no_camera" ? "No camera was detected on your device, or your camera is not supported by this feature. This can happen if you are using a desktop without a webcam or if your device’s camera drivers are not installed correctly.<br><br>If you are on a desktop, connect a webcam and ensure it is properly plugged in. For laptops, check that your built-in camera is enabled in the system settings. If the issue continues, try using a different device with a working camera." : props.type == "camera_gone" ? "The camera could not be detected at this time. This may happen if the camera is disconnected, disabled, currently in use by another application, or you have only a single camera.<br><br>Please check your camera connection, make sure it’s not being used by other programs, and try reconnecting it. If you are using an external camera, unplug and plug it back in or switch to a different USB port." : null
)
</script>