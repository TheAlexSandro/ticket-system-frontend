<template>
    <template v-if="isLoading">
        <LoadingScreen />
    </template>
    <section v-if="panels" class="alumni">
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
        </div>
        <div v-if="isFound" class="table-container">
            <table class="alumni-table">
                <thead>
                    <tr>
                        <th class="col">Nama</th>
                        <th class="col">Umur</th>
                        <th class="col">Phone</th>
                        <th class="col">Alamat</th>
                        <th class="col">Lulus Tahun</th>
                        <th class="col">Bukti</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in paginatedData" :key="index">
                        <td class="col">{{ item.nama }}</td>
                        <td class="col">{{ item.umur }}</td>
                        <td class="col">{{ item.phone }}</td>
                        <td class="col">{{ item.alamat }}</td>
                        <td class="col">{{ item.lulus_tahun }}</td>
                        <td class="col">
                            <a :href="item.bukti" target="_blank">
                                <img :src="item.bukti" alt="bukti" class="bukti-img" />
                            </a>
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

type AlumniData = {
    nama: string;
    umur: string;
    phone: string;
    alamat: string;
    lulus_tahun: string;
    bukti: string;
};

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

const stopRequest = () => {
    isLoading.value = false;
    panels.value = false;
    isFailed.value = true;
}

onMounted(() => {
    api.refreshToken((error, token_result) => {
        if (error) { stopRequest(); return; }

        api.verify(String(token_result), (error, result) => {
            if (!result!["ok"] && result!["error_code"] == "UNAUTHORIZED_ACCESS") return window.location.href = "/signin";
            if (error || !result!["ok"]) { stopRequest(); return; }
        })

        api.getAlumni(String(token_result), (error, result) => {
            if (error || !result!["ok"]) { stopRequest(); return; }
            panels.value = true;
            if (result!["result"].length > 0) { alumniData.value = result!["result"] } else { isFound.value = false; message.value = "Tidak ada alumnus yang terdaftar." };
            isLoading.value = false;
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
    const find = alumniData.value.filter((r: AlumniData) => r.nama.toLowerCase().replace(/\s+/g, "").includes(String(query.value).toLowerCase().replace(/\s+/g, "")));
    if (find.length == 0) {
        message.value = "Alumnus tidak ditemukan."
        isFound.value = false;
        return;
    }
    foundData.value = find;
    isFound.value = true;
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