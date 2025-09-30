<template>
    <template v-if="isLoading">
        <LoadingScreen />
    </template>
    <section v-if="panels" class="alumni">
        <div class="head">
            <span>Daftar Alumni</span>
            <p>Berikut adalah daftar alumni yang telah melakukan pengisian data.</p>
        </div>
        <div class="form">
            <span>Cari Alumnus</span>
            <div class="input-group">
                <div class="input-wrapper">
                    <i class="ri-user-search-line"></i>
                    <input v-model="query" type="text" placeholder="Cari alumnus..." @keyup.enter="search()">
                </div>
                <div class="buttons">
                    <button @click="search()"><i class="ri-search-line"></i></button>
                    <button v-if="displayClear" @click="clear()"><i class="ri-close-circle-line"></i></button>
                </div>
            </div>
            <div class="hint">
                <span><i class="ri-information-line"></i> Pencarian bekerja untuk nama, umur, nomor hp dan lulusan
                    tahun.</span>
            </div>
        </div>
        <div v-if="isFound" class="table-container">
            <table class="alumni-table">
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Umur</th>
                        <th>Phone</th>
                        <th>Alamat</th>
                        <th class="long">Lulus Tahun</th>
                        <th>Bukti</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in paginatedData" :key="item.nama">
                        <td>{{ item.nama }}</td>
                        <td>{{ item.umur }}</td>
                        <td>{{ item.phone }}</td>
                        <td>{{ item.alamat }}</td>
                        <td>{{ item.lulus_tahun }}</td>
                        <td>
                            <template v-if="!imgError[item.nama.toLowerCase().replace(/\s+/g, '')]">
                                <a :href="item.bukti" target="_blank">
                                    <img :src="item.bukti" alt="bukti" class="bukti-img"
                                        @error="imgError[item.nama.toLowerCase().replace(/\s+/g, '')] = true" />
                                </a>
                            </template>
                            <template v-else>
                                <span class="img-404"><i class="ri-alert-line"></i> 404 - Not Found</span>
                            </template>
                        </td>
                        <td class="act">
                            <div class="action">
                                <button @click="alumniAksi(item.nama, 'verifikasi')"
                                    style="background: var(--green-strong); color: white;"
                                    v-show="item.verified == 'no'"><i class="ri-check-line"></i> Verifikasi</button>
                                <button @click="alumniAksi(item.nama, 'cabut')" style="background: #FFDB58;"
                                    v-show="item.verified == 'yes'"><i class="ri-close-circle-line"></i> Cabut
                                    Verifikasi</button>
                                <button @click="alumniAksi(item.nama, 'hapus')"
                                    style="background: #FF0000; color: white;"><i class="ri-delete-bin-line"></i>
                                    Hapus</button>
                            </div>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="isFound" class="pagination">
            <button @click="prevPage" :class="{ 'hidden': currentPage === 1 }"><i
                    class="ri-arrow-left-line"></i></button>
            <span>Halaman {{ currentPage }}/{{ totalPages }}</span>
            <button @click="nextPage" :class="{ 'hidden': currentPage === totalPages }"><i
                    class="ri-arrow-right-line"></i></button>
        </div>

        <div v-if="!isFound" class="error">
            <i class="ri-spam-2-line"></i>
            <p>{{ message }}</p>
        </div>
    </section>

    <section v-if="isFailed">
        <Errors />
    </section>
</template>

<script setup lang="ts">
import "./css/Alumni.css"
import { useApi } from "../../../composables/useApi";
import { computed, onMounted, ref } from 'vue';
import Errors from "../errors/Errors.vue";
import LoadingScreen from "../global/LoadingScreen.vue";
import Swal from 'sweetalert2';

type AlumniData = {
    nama: string;
    umur: string;
    phone: string;
    alamat: string;
    lulus_tahun: string;
    bukti: string;
    verified: string;
};

type AlumniAksi = "verifikasi" | "cabut" | "hapus";

//@ts-ignore
const toast = useToast() as any;
const api = useApi();
const isLoading = ref(true);
const panels = ref(false);
const isFailed = ref(false);
const alumniData = ref<AlumniData[]>([]);
const currentPage = ref(1);
const lastPage = ref(1);
const perPage = 10;
const query = ref<string | null>(null);
const isFound = ref<boolean>(true);
const message = ref("");
const foundData = ref<AlumniData[]>([]);
const displayClear = ref(false);
const imgError = ref<{ [key: string]: boolean }>({});

const stopRequest = () => {
    isLoading.value = false;
    panels.value = false;
    isFailed.value = true;
}

onMounted(() => {
    api.accessToken((error, token_result) => {
        if (error) { stopRequest(); return; }

        api.request("/auth/verify", String(token_result), null, (error, result) => {
            if (!result!["ok"] && result!["error_code"] == "UNAUTHORIZED_ACCESS") return window.location.href = "/signin";
            if (error || !result!["ok"]) { stopRequest(); return; }

            api.request("/users/getAlumni", String(token_result), null, (error, result) => {
                if (error || !result!["ok"]) { stopRequest(); return; }
                panels.value = true;
                if (result!["result"].length > 0) { alumniData.value = result!["result"] } else { isFound.value = false; message.value = "Tidak ada alumnus yang terdaftar." };
                isLoading.value = false;
            })
        })
    })
})

const clear = () => {
    query.value = null;
    displayClear.value = false;
    currentPage.value = lastPage.value;
    foundData.value = [];
    if (alumniData.value.length > 0) { isFound.value = true; } else { isFound.value = false; message.value = "Tidak ada alumnus yang terdaftar." };
}

const search = () => {
    if (!query.value) return toast.warning({ message: 'Kueri tidak boleh kosong.', position: 'topRight', pauseOnHover: false, displayMode: 2, timeout: 5000 });
    displayClear.value = true;
    lastPage.value = currentPage.value;
    currentPage.value = 1;
    const queryLower = String(query.value || "")
        .toLowerCase()
        .replace(/\s+/g, "");

    const find = alumniData.value.filter((r: AlumniData) => {
        let target = "";
        if (/^[0-9]+$/.test(queryLower) && queryLower.length === 2) {
            target = r.umur;
        } else if (queryLower.startsWith("62") || queryLower.startsWith("08")) {
            target = r.phone;
        } else if (/^[0-9]+$/.test(queryLower) && queryLower.length === 4) {
            target = r.lulus_tahun;
        } else {
            target = r.nama;
        }

        return String(target).toLowerCase().replace(/\s+/g, "").includes(queryLower);
    });

    if (find.length == 0) {
        message.value = "Alumnus tidak ditemukan."
        isFound.value = false;
        return;
    }
    foundData.value = find;
    isFound.value = true;
}

const alumniAksi = (nama: string, aksi: AlumniAksi) => {
    if (/(cabut|hapus)/i.exec(aksi)) {
        Swal.fire({
            title: "Warning!",
            icon: "warning",
            text: "Apa Anda yakin ingin melakukan tindakan ini?",
            showCancelButton: true,
            showConfirmButton: true
        }).then((r) => {
            if (r.isConfirmed) {
                toast.info({ message: "Please wait...", position: "topRight", pauseOnHover: false, displayMode: 2, timeout: 7000 });
                api.accessToken((error, token_result) => {
                    if (error) { stopRequest(); return; }

                    api.request(`/users/${aksi == "cabut" ? "verifyAlumni" : "deleteAlumni"}`, String(token_result), { nama }, (error, result) => {
                        if (error) { stopRequest(); return; }
                        if (!result!["ok"] && result!["error_code"] == "USER_NOT_FOUND") { toast.destroy(); toast.error({ message: "Pengguna tidak ditemukan.", position: "topRight", pauseOnHover: false, displayMode: 2, timeout: 5000 }); return };
                        api.request("/users/getAlumni", String(token_result), null, (error, result) => {
                            if (error || !result!["ok"]) { stopRequest(); return; }
                            if (result!["result"].length > 0) { alumniData.value = result!["result"] as AlumniData[] } else { isFound.value = false; message.value = "Tidak ada alumnus yang terdaftar." };
                            toast.destroy();
                            toast.success({ message: "Berhasil!", position: "topRight", pauseOnHover: false, displayMode: 2, timeout: 5000 });
                        })
                    })
                })
            }
        })
    } else {
        toast.info({ message: "Please wait...", position: "topRight", pauseOnHover: false, displayMode: 2, timeout: 7000 });
        api.accessToken((error, token_result) => {
            if (error) { stopRequest(); return; }

            api.request(`/users/verifyAlumni`, String(token_result), { nama }, (error, result) => {
                if (error) { stopRequest(); return; }
                if (!result!["ok"] && result!["error_code"] == "USER_NOT_FOUND") { toast.destroy(); toast.error({ message: "Pengguna tidak ditemukan.", position: "topRight", pauseOnHover: false, displayMode: 2, timeout: 5000 }); return };
                api.request("/users/getAlumni", String(token_result), null, (error, result) => {
                    if (error || !result!["ok"]) { stopRequest(); return; }
                    if (result!["result"].length > 0) { alumniData.value = result!["result"] } else { isFound.value = false; message.value = "Tidak ada alumnus yang terdaftar." };
                    toast.destroy();
                    toast.success({ message: "Berhasil!", position: "topRight", pauseOnHover: false, displayMode: 2, timeout: 5000 });
                })
            })
        })
    }
}

const totalPages = computed(() =>
    foundData.value.length > 0 ? Math.ceil(foundData.value.length / perPage) : Math.ceil(alumniData.value.length / perPage)
);

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    return foundData.value.length > 0 ? foundData.value.slice(start, start + perPage) : alumniData.value.slice(start, start + perPage);
});

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
};

</script>