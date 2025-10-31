<template>
    <section class="indexes">
        <section class="hero">
            <div class="beginning">
                <div class="title">
                    <h1>Smekensa</h1>
                    <img :src="`${configs.public['IMAGE_CDN']}/head.png`" alt="Logo">
                </div>
                <p>Selamat datang di website Project Based Learning Smekensa yang ke-60 tahun.</p>
            </div>

            <div id="pl-1" class="marquee pl">
                <div class="mar">
                    <div class="group-1">
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                    </div>
                    <div class="group-1">
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                    </div>
                </div>
            </div>
            <div class="card">
                <img :src="`${configs.public['IMAGE_CDN']}/hero1.jpg`" alt="Hero Image">
                <div class="desc">
                    <div class="cont">
                        <h1>Berkarya, Berprestasi, Menginspirasi</h1>
                        <p>Enam dekade perjalanan penuh dedikasi dan inovasi telah menempa kita menjadi keluarga besar
                            yang tangguh. Mari rayakan Project Based Learning ini dengan semangat kebersamaan untuk
                            terus
                            melangkah menuju masa depan yang lebih gemilang.</p>
                    </div>
                </div>
            </div>
            <div id="pl-2" class="marquee pl">
                <div class="mar">
                    <div class="group-2">
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                    </div>
                    <div class="group-2">
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                    </div>
                </div>
            </div>
            <div class="card">
                <img :src="`${configs.public['IMAGE_CDN']}/hero2.jpg`" alt="Hero Image">
                <div class="desc">
                    <div class="cont">
                        <h1>Merayakan Kebanggaan, Menyongsong Harapan</h1>
                        <p>Umur yang ke-60 bagi SMKN 1 Blitar bukan sekadar peringatan, tetapi wujud rasa syukur atas
                            seluruh pencapaian. Bersama kita wujudkan visi dan kreativitas yang membawa nama baik
                            sekolah ke tingkat yang lebih tinggi.</p>
                    </div>
                </div>
            </div>
            <div id="pl-1" class="marquee pl">
                <div class="mar">
                    <div class="group-1">
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                    </div>
                    <div class="group-1">
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                    </div>
                </div>
            </div>
            <div class="card">
                <img :src="`${configs.public['IMAGE_CDN']}/hero5.jpg`" alt="Hero Image">
                <div class="desc">
                    <div class="cont">
                        <h1>Semangat Baru di Usia 60 Tahun</h1>
                        <p>Perjalanan panjang SMKN 1 Blitar adalah bukti kerja keras, dedikasi, dan semangat belajar
                            tanpa henti. Di momen istimewa ini, mari kita terus bersatu menciptakan prestasi yang
                            membanggakan dan menjadi inspirasi bagi generasi selanjutnya.</p>
                    </div>
                </div>
            </div>
            <div id="pl-2" class="marquee pl">
                <div class="mar">
                    <div class="group-2">
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                    </div>
                    <div class="group-2">
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                        <h1>{{ marqueeText().a }}</h1>
                    </div>
                </div>
            </div>
        </section>

        <section class="info">
            <div class="subinfo">
                <span>Untuk Umum!</span>
                <p>Perayaan Project Based Learning SMKN 1 Blitar tahun ini dibuka secara resmi untuk umum, sehingga
                    tidak hanya
                    siswa dan civitas sekolah saja yang dapat mengikuti rangkaian acara, tetapi juga masyarakat luas.
                    Dengan dibukanya kegiatan ini untuk umum, diharapkan semakin banyak pihak yang dapat merasakan
                    semarak perayaan, menikmati berbagai stand, pertunjukan, serta program yang telah dipersiapkan oleh
                    panitia.</p>
            </div>

            <div class="card">
                <div class="marquee ticket">
                    <div class="mar-t">
                        <div class="group-1">
                            <h1>{{ marqueeText().b }} <i class="ri-bard-fill"></i></h1>
                            <h1>{{ marqueeText().b }} <i class="ri-bard-fill"></i></h1>
                            <h1>{{ marqueeText().b }} <i class="ri-bard-fill"></i></h1>
                            <h1>{{ marqueeText().b }} <i class="ri-bard-fill"></i></h1>
                            <h1>{{ marqueeText().b }} <i class="ri-bard-fill"></i></h1>
                            <h1>{{ marqueeText().b }} <i class="ri-bard-fill"></i></h1>
                        </div>
                        <div class="group-1">
                            <h1>{{ marqueeText().b }} <i class="ri-bard-fill"></i></h1>
                            <h1>{{ marqueeText().b }} <i class="ri-bard-fill"></i></h1>
                            <h1>{{ marqueeText().b }} <i class="ri-bard-fill"></i></h1>
                            <h1>{{ marqueeText().b }} <i class="ri-bard-fill"></i></h1>
                            <h1>{{ marqueeText().b }} <i class="ri-bard-fill"></i></h1>
                            <h1>{{ marqueeText().b }} <i class="ri-bard-fill"></i></h1>
                        </div>
                    </div>
                </div>

                <div class="content">
                    <div v-if="!showSlider" class="image">
                        <img class="t-1" :src="`${configs.public['IMAGE_CDN']}/hero7.jpg`" alt="Image"></img>
                        <img class="t-0" style="z-index: 2;" :src="`${configs.public['IMAGE_CDN']}/hero4.jpg`"
                            alt="Image"></img>
                        <img class="t-2" :src="`${configs.public['IMAGE_CDN']}/hero8.jpg`" alt="Image"></img>
                    </div>
                    <div v-else class="mobile">
                        <div class="slider">
                            <img v-for="(img, index) in images" :key="index" :src="img" :alt="'Image ' + (index + 1)"
                                :class="{
                                    active: currentImg === index,
                                    previous: previousImg === index
                                }" />
                        </div>
                        <div class="navigation-button">
                            <span v-for="(img, index) in images" :key="index" class="line"
                                :class="{ active: currentImg === index }" @click="changeSlide(index)"></span>
                        </div>
                        <button class="nav-button prev" @click="prevSlide">&#10094;</button>
                        <button class="nav-button next" @click="nextSlide">&#10095;</button>
                    </div>

                    <div class="desc">
                        <span>PBL Smekensa</span>
                        <p>
                            Pelaksanaan <strong>Project Based Learning SMKN 1 Blitar</strong> akan mencapai tahap
                            puncaknya pada
                            <strong>{{ marqueeText().b }}</strong>.
                            Seluruh warga SMKN 1 Blitar diharapkan terlibat secara aktif sebagai bagian dari proses
                            pembelajaran berbasis proyek,
                            dengan menunjukkan hasil karya, inovasi, dan kolaborasi terbaik.
                            Momen ini menjadi wadah untuk membuktikan kompetensi, kreativitas, serta kerja sama tim yang
                            telah dibangun selama
                            proses PBL berlangsung.
                            Mari tunjukkan profesionalisme, semangat belajar, dan kekompakan kita sebagai keluarga besar
                            SMKN 1 Blitar dalam
                            menyukseskan puncak kegiatan ini.
                        </p>

                    </div>
                </div>

                <div class="marquee ticket-2">
                    <div class="mar-t">
                        <div class="group-2">
                            <h1>Project Based Learning <i class="ri-sparkling-2-fill"></i></h1>
                            <h1>Project Based Learning <i class="ri-sparkling-2-fill"></i></h1>
                            <h1>Project Based Learning <i class="ri-sparkling-2-fill"></i></h1>
                            <h1>Project Based Learning <i class="ri-sparkling-2-fill"></i></h1>
                            <h1>Project Based Learning <i class="ri-sparkling-2-fill"></i></h1>
                            <h1>Project Based Learning <i class="ri-sparkling-2-fill"></i></h1>
                        </div>
                        <div class="group-2">
                            <h1>Project Based Learning <i class="ri-sparkling-2-fill"></i></h1>
                            <h1>Project Based Learning <i class="ri-sparkling-2-fill"></i></h1>
                            <h1>Project Based Learning <i class="ri-sparkling-2-fill"></i></h1>
                            <h1>Project Based Learning <i class="ri-sparkling-2-fill"></i></h1>
                            <h1>Project Based Learning <i class="ri-sparkling-2-fill"></i></h1>
                            <h1>Project Based Learning <i class="ri-sparkling-2-fill"></i></h1>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Footer />
    </section class="indexes">
</template>

<script setup lang="ts">
import "./css/Index.css"
import "./css/Marquee.css"
import { useRuntimeConfig } from "nuxt/app";
import Footer from "../footer/Footer.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";

const configs = useRuntimeConfig();

onMounted(() => {
    if (!deviceType.value) { updateDeviceType() };
    window.addEventListener("resize", updateDeviceType);
    if (deviceType.value == "mobile") {
        showSlider.value = true;
        resetTimer();
    }
});

onBeforeUnmount(() => {
    if (!deviceType.value) { updateDeviceType() };
    window.addEventListener("resize", updateDeviceType);
    if (deviceType.value == "mobile") {
        showSlider.value = true;
        resetTimer();
    }
    clearInterval(timer);
});

const imageCDN = () => {
    return String(configs.public["IMAGE_CDN"]);
}

const images = [
    `${imageCDN()}/hero1.jpg`,
    `${imageCDN()}/hero2.jpg`,
    `${imageCDN()}/hero3.jpg`,
    `${imageCDN()}/hero4.jpg`,
    `${imageCDN()}/hero5.jpg`,
    `${imageCDN()}/hero6.jpg`,
    `${imageCDN()}/hero7.jpg`,
    `${imageCDN()}/hero8.jpg`,
    `${imageCDN()}/hero9.jpg`,
    `${imageCDN()}/hero10.jpg`
];

const showSlider = ref<boolean>(false);
const deviceType = ref<"mobile" | "desktop">();
const currentImg = ref(0);
const previousImg = ref<number | null>(null);
const interval = 4000;
let timer: NodeJS.Timeout;

const detectDeviceType = (): "mobile" | "desktop" => {
    const ua = navigator.userAgent;

    const isIPad = /\b(iPad)\b/i.test(ua) ||
        (/\bMacintosh\b/i.test(ua) && navigator.maxTouchPoints > 1);

    if (/android|iphone|ipod|windows phone|mobile/i.test(ua) || isIPad) {
        return "mobile";
    }
    return "desktop";
}

const updateDeviceType = () => {
    deviceType.value = detectDeviceType();
}

const changeSlide = (n: number) => {
    previousImg.value = Number(currentImg.value);
    currentImg.value = (n + images.length) % images.length;
}

const nextSlide = () => {
    changeSlide(currentImg.value + 1);
    resetTimer();
}

const prevSlide = () => {
    changeSlide(currentImg.value - 1);
    resetTimer();
}

const resetTimer = () => {
    clearInterval(Number(timer));
    timer = setInterval(() => {
        changeSlide(currentImg.value + 1);
    }, interval);
}

const marqueeText = () => {
    const env = useRuntimeConfig();
    return { a: String(env.public["MARQUEE_CONTENT"]), b: String(env.public["PUNCAK"]) };
}
</script>