<template>
    <div class="header">
        <div class="logo" @click="home()">
            <div class="bounce-wrap">
                <img src="/images/head.png" alt="Logo">
            </div>
            <p>PBL Smekensa</p>
        </div>
        <div class="menu">
            <div class="user" @click="redirect()"><i class="ri-user-line"></i></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import './css/Header.css'

const redirect = () => {
    window.location.href = "/dashboard";
}

const home = () => {
    window.location.href = "/";
}
</script>