<template>
    <template v-if="isLoading">
        <LoadingScreen />
    </template>
    <section v-if="panels" class="tickets">
        <div class="head">
            <span>Daftar Tiket Dipindai</span>
            <p>Berikut adalah daftar tiket yang sudah dipindai.</p>
        </div>
        <div class="form">
            <span>Cari Tiket</span>
            <div class="input-group">
                <div class="input-wrapper">
                    <i class="ri-user-search-line"></i>
                    <input v-model="query" type="text" placeholder="Cari tiket..." @keyup.enter="search()">
                </div>
                <div class="buttons">
                    <button @click="search()"><i class="ri-search-line"></i></button>
                    <button v-if="displayClear" @click="clear()"><i class="ri-close-circle-line"></i></button>
                </div>
            </div>
            <div class="hint">
                <span><i class="ri-information-line"></i> Pencarian bekerja untuk ID, tipe, nama, kelas, absen, nomor
                    hp.</span>
            </div>
        </div>
        <div v-if="isFound" class="table-container">
            <table class="tickets-table">
                <thead>
                    <tr>
                        <th class="col">ID</th>
                        <th class="col">Tipe</th>
                        <th class="col">Nama</th>
                        <th class="col">Kelas</th>
                        <th class="col">Absen</th>
                        <th class="col">Nomor HP</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in paginatedData" :key="item.id">
                        <td class="col">{{ item.id }}</td>
                        <td class="col">{{ item.tipe }}</td>
                        <td class="col">{{ item.nama }}</td>
                        <td class="col">{{ item.kelas ?? "-" }}</td>
                        <td class="col">{{ item.absen ?? "-" }}</td>
                        <td class="col">{{ item.nomor_hp ?? "-" }}</td>
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
import "./css/ScannedTicket.css"
import { useApi } from "../../../composables/useApi";
import { computed, onMounted, ref } from 'vue';
import Errors from "../errors/Errors.vue";
import LoadingScreen from "../global/LoadingScreen.vue";

type Ticket = {
    id: string;
    tipe: "internal" | "eksternal";
    nama: string;
    kelas: string;
    absen: string;
    nomor_hp: string;
};

//@ts-ignore
const toast = useToast() as any;
const api = useApi();
const isLoading = ref(true);
const panels = ref(false);
const isFailed = ref(false);
const ticketData = ref<Ticket[]>([]);
const currentPage = ref(1);
const lastPage = ref(1);
const perPage = 10;
const query = ref<string | null>(null);
const isFound = ref<boolean>(true);
const message = ref("");
const foundData = ref<Ticket[]>([]);
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

            api.getTotal(String(token_result), (error, result) => {
                if (error || !result!["ok"]) { stopRequest(); return; }
                panels.value = true;
                if (result!["result"]["data_list"]["pengunjung_data"].length > 0) { ticketData.value = result!["result"]["data_list"]["pengunjung_data"] } else { isFound.value = false; message.value = "Tidak ada tiket yang dipindai di sini." };
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
    if (ticketData.value.length > 0) { isFound.value = true; } else { isFound.value = false; message.value = "Tidak ada tiket yang dipindai di sini." };
}

const search = () => {
    if (!query.value) return toast.warning({ message: 'Kueri tidak boleh kosong.', position: 'topRight', pauseOnHover: false, displayMode: 2, timeout: 5000 });
    displayClear.value = true;
    lastPage.value = currentPage.value;
    currentPage.value = 1;
    const queryLower = String(query.value || "")
        .toLowerCase()
        .replace(/\s+/g, "")
        .trim();

    const find = ticketData.value.filter((r: Ticket) => {
        let target = "";
        if (/(internal|eksternal)/i.test(queryLower)) {
            target = r.tipe;
        } else if (queryLower.startsWith("pbl-")) {
            target = r.id;
        } else if (queryLower.startsWith("x")) {
            target = r.kelas;
        } else if (/^[0-9]+$/i.test(queryLower) && queryLower.length == 2) {
            target = r.absen;
        } else if (queryLower.startsWith("08") || queryLower.startsWith("62")) {
            target = r.nomor_hp;
        } else {
            target = r.nama;
        }

        return String(target).toLowerCase().replace(/\s+/g, "").includes(queryLower);
    });

    if (find.length == 0) {
        message.value = "Data tiket tidak ditemukan."
        isFound.value = false;
        return;
    }
    foundData.value = find;
    isFound.value = true;
}

const totalPages = computed(() =>
    foundData.value.length > 0 ? Math.ceil(foundData.value.length / perPage) : Math.ceil(ticketData.value.length / perPage)
);

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    return foundData.value.length > 0 ? foundData.value.slice(start, start + perPage) : ticketData.value.slice(start, start + perPage);
});

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
};

</script>