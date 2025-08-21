<template>
    <section class="information">
        <div class="container">
            <img :src="icon" alt="An Icon">

            <div class="description">
                <h1>{{ title }}</h1>
                <p v-html="description"></p>
                <br>
                <p>If you believe this is a bug, please contact the administrator through <a :href="`mailto:${getEmail()}`">{{ getEmail() }}</a></p>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import "~/css/camera.css";
import { computed } from "vue";
import { useRuntimeConfig } from "nuxt/app";

const props = defineProps({
    type: String
})

const getEmail = () => {
    const configs = useRuntimeConfig();
    return String(configs.public.email);
}

const icon = computed(() =>
    props.type == "error" ? "/icons/error.svg" : "/icons/warning.svg"
)
const title = computed(() => 
    props.type == "error" ? "Something Wrong!" : props.type == "denied" ? "Camera Access Denied!" : props.type == "no_camera" ? "Unsupported Device!" : props.type == "camera_gone" ? "Cannot Detect Camera!" : props.type == "no_flash" ? "No Flash Detected!" : null
)
const description = computed(() => 
  props.type == "error"
    ? "An unexpected error occurred while trying to access your camera. This could be due to a temporary glitch, a conflicting application using your camera, or an internal browser issue. Sometimes, background processes may block camera access without showing a clear warning.<br><br>To fix this, try refreshing the page, closing other applications that might be using the camera, or restarting your browser. If the issue persists, update your browser and operating system, or contact technical support for further assistance."
    : props.type == "denied"
    ? "You have denied camera access, which prevents this feature from working. Without permission, the application cannot start the scanner.<br><br>To enable camera access, click the lock icon next to your browser's address bar, find the camera permissions, and set it to Allow. After making the change, refresh the page to try again."
    : props.type == "no_camera"
    ? "No camera was detected on your device, or your camera is not supported by this feature. This can happen if you are using a desktop without a webcam or if your device’s camera drivers are not installed correctly.<br><br>If you are on a desktop, connect a webcam and ensure it is properly plugged in. For laptops, check that your built-in camera is enabled in the system settings. If the issue continues, try using a different device with a working camera."
    : props.type == "camera_gone"
    ? "The camera could not be detected at this time. This may happen if the camera is disconnected, disabled, currently in use by another application, or you have only a single camera.<br><br>Please check your camera connection, make sure it’s not being used by other programs, and try reconnecting it. If you are using an external camera, unplug and plug it back in or switch to a different USB port."
    : props.type == "no_flash"
    ? "Your device does not support camera flash (torch) or the browser was unable to enable it. This commonly happens when using a desktop webcam, a laptop without LED flash hardware, or a mobile browser that has not yet implemented torch support.<br><br>Flash functionality is only available on certain mobile devices with a rear-facing camera and hardware flash support. If you are on a smartphone, try switching to the rear camera and make sure your device’s flashlight works in the system camera app. If the problem persists, your browser or device may simply not provide web access to the flash feature."
    : null
)
</script>