<template>
    <footer>
        <div class="info">
            <div class="logo-container">
                <span>Dipersembahkan Oleh</span>
                <div class="logos">
                    <img :src="`${configs.public['IMAGE_CDN']}/oskensa-logo.png`" alt="Logo Osis SMKN 1 Blitar">
                    <img :src="`${configs.public['IMAGE_CDN']}/smkn-logo.png`" alt="Logo SMKN 1 Blitar">
                    <img :src="`${configs.public['IMAGE_CDN']}/head.png`" alt="Logo PBL Smekensa">
                </div>
            </div>
            <div class="desc">
                <p>Acara ini secara khusus dipersembahkan oleh SMKN 1 Blitar, dengan dukungan penuh dari OSIS SMKN 1
                    Blitar, serta menjadi bagian dari karya nyata Project Based Learning (PBL) Smekensa. Kolaborasi
                    ini
                    menghadirkan sebuah perayaan yang bukan hanya sekadar ajang hiburan, tetapi juga menjadi wujud
                    kreativitas, kebersamaan, dan semangat seluruh keluarga besar Smekensa dalam menyemarakkan Project Based Learning tahun ini.</p>
            </div>
        </div>
        <div class="cp">
            <p>Coyright &copy; {{ cpYear() }} oleh Panitia Project Based Learning</p>
        </div>
    </footer>
</template>

<script setup lang="ts">
import "./css/Footer.css";
import { useRuntimeConfig } from "nuxt/app";

const configs = useRuntimeConfig();

const cpYear = () => {
    const year = new Date().getFullYear();
    return year == 2025 ? year : `2025-${year}`;
}
</script>