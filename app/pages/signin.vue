<template>
    <section class="signin">
        <div class="container">
            <div class="left">
                <img src="/image.png" alt="Logo">
                <span class="head">Sign In</span>
                <p>Masuk untuk mengakses halaman admin.</p>
            </div>

            <div class="form">
                <template v-if="!next">
                    <div class="input-group">
                        <input type="text" id="username" :disabled="isDisabled" required v-model="usernameValue"
                            :ref="usernameValue" @keyup.enter="signin()">
                        <label id="username-label" for="username">Username Anda</label>
                    </div>
                    <span class="error" v-if="usernameError"><i class="ri-error-warning-line"></i> {{
                        usernameErrorMessage }}</span>
                    <span class="help" @click="inpo()">Tidak tahu?</span>

                    <button @click="signin()">{{ buttonText }}</button>
                </template>
                <template v-else>
                    <div class="welcoming">
                        <span>Selamat Datang, {{ usernameValue }}!</span>
                        <p>Masukkan kata sandi Anda untuk melanjutkan.</p>
                    </div>
                    <div class="input-group">
                        <input :type="showPassword ? 'text' : 'password'" :disabled="isDisabled" id="password" required
                            v-model="passwordValue" @keyup.enter="verify()">
                        <label id="password-label" for="password">Masukkan kata sandi</label>
                    </div>
                    <span class="error" v-if="passwordError"><i class="ri-error-warning-line"></i> {{
                        passwordErrorMessage }}</span>
                    <div class="show-password">
                        <input type="checkbox" v-model="showPassword">
                        <span>Tampilkan sandi</span>
                    </div>

                    <div class="inline-button">
                        <button @click="back()">Kembali</button>
                        <button @click="verify()">{{ buttonText }}</button>
                    </div>
                </template>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import '../css/signin.css'
import { computed, ref } from 'vue';
import { getUsername, signIn } from '../server/Api';
import { useHead } from 'nuxt/app';

useHead({
    title: "Sign In - PBL",
    link: [
        { rel: 'icon', type: 'image/png', href: '/image.png' }
    ]
})

//@ts-ignore
const toast = useToast() as any;

type InputError = "username" | "password";

const next = ref(false);
const clicked = ref(false);
const usernameError = ref<"empty" | "not_found" | false>();
const passwordError = ref<"empty" | "invalid" | false>();

const usernameValue = ref("");
const usernameInput = ref<HTMLInputElement | null>();
const passwordValue = ref("");
const lastUsername = ref("");
const isDisabled = ref(false);

const showPassword = ref(false);

const buttonText = computed(() =>
    clicked.value ? "Loading..." : "Lanjut"
);

const usernameErrorMessage = computed(() =>
    usernameError.value == "empty" ? "Username tidak boleh kosong." : usernameError.value == "not_found" ? "Tidak dapat menemukan username ini." : null
);

const passwordErrorMessage = computed(() =>
    passwordError.value == "empty" ? "Password tidak boleh kosong." : passwordError.value == "invalid" ? "Password salah, silahkan coba lagi." : null
);

const inpo = () => {
    //@ts-ignore
    return toast.info({ message: 'Hubungi administrator.', position: 'topRight', pauseOnHover: false, displayMode: 2, timeout: 5000 });
}

const inputError = (type: InputError, value: string) => {
    document.getElementById(type)!.style.borderColor = 'red';
    document.getElementById(`${type}-label`)!.style.color = 'red';

    if (type == "username") {
        usernameError.value = value as "empty" | "not_found";
    } else {
        passwordError.value = value as "empty" | "invalid";
    }
    clicked.value = false;
    isDisabled.value = false;
}

const putBack = (type: InputError, withClicked: boolean) => {
    document.getElementById(type)!.style.borderColor = '#2b818b';
    document.getElementById(`${type}-label`)!.style.color = '#2b818b';

    if (type == "username") {
        usernameError.value = false;
    } else {
        passwordError.value = false;
    }
    if (withClicked) { clicked.value = false; isDisabled.value = false; }
}

const back = () => {
    if (usernameInput.value) {
        usernameInput.value.value = usernameValue.value;
    }
    next.value = false;
    putBack("password", true);
    passwordError.value = false;
}

const signin = () => {
    if (clicked.value) return;
    clicked.value = true;
    isDisabled.value = true;
    putBack("username", false);
    if (!usernameValue.value || usernameValue.value == "") return inputError("username", "empty");
    if (usernameValue.value.toLocaleLowerCase() == lastUsername.value.toLocaleLowerCase()) {
        next.value = true;
        putBack("username", true);
    } else {
        getUsername(String(usernameValue.value), (error, result) => {
            //@ts-ignore
            if (!result!['ok'] && result!['error_code'] == 'UNKNOWN_ERROR') return toast.error({ message: 'Something went wrong.', position: 'topRight', pauseOnHover: false, displayMode: 2, timeout: 5000 });
            if (!result!['ok'] && result!['error_code'] == 'USER_NOT_FOUND') return inputError("username", "not_found");

            putBack("username", true);
            lastUsername.value = usernameValue.value;
            next.value = true;
        })
    }
}

const verify = () => {
    if (clicked.value) return;
    clicked.value = true;
    isDisabled.value = true;
    putBack("password", false);
    if (!passwordValue.value || passwordValue.value == "") return inputError("password", "empty");
    signIn(String(usernameValue.value), String(passwordValue.value), (error, result) => {
        //@ts-ignore
        if (!result!['ok'] && ['USER_NOT_FOUND', 'UNKNOWN_ERROR'].includes(result!['error_code'])) return toast.error({ message: 'Something went wrong.', position: 'topRight', pauseOnHover: false, displayMode: 2, timeout: 5000 });
        if (!result!['ok'] && result!['error_code'] == 'UNAUTHORIZED_ACCESS') return inputError("password", "invalid");

        window.location.href = "/admin";
    })
}

</script>