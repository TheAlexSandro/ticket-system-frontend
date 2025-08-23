<template>
    <div class="header">
        <div class="logo" @click="home()">
            <div class="bounce-wrap">
                <img src="/image.png" alt="Logo">
            </div>
            <p>Project Based Learning</p>
        </div>
        <div class="user" @click="redirect()"><i class="ri-user-line"></i></div>
    </div>
</template>

<script setup lang="ts">
import './css/Header.css'

const redirect = () => {
    window.location.href = "/admin";
}

const home = () => {
    window.location.href = "/";
}
</script>