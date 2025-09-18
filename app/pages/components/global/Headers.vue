<template>
    <div class="header">
        <div class="logo" @click="home()">
            <div class="bounce-wrap">
                <img src="/images/head.png" alt="Logo">
            </div>
            <p>PBL Smekensa</p>
        </div>
        <div class="menu">
            <li><p><a href="/buy">Beli Tiket</a></p></li>
            <div class="user" @click="redirect()"><i class="ri-user-line"></i></div>
        </div>
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