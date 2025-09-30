<template>
    <template v-if="isLoading">
        <LoadingScreen />
    </template>

    <template v-else>
        <main v-if="panels">
            <section class="buy">
                <div class="form">
                    <div class="desc">
                        <span>Pengisian Data</span>
                        <p>Saat ini, pembelian tiket melalui website hanya diperuntukkan bagi <strong>alumni</strong>.
                            Bagi Anda yang bukan berasal dari alumni SMKN 1 Blitar, pembelian tiket dapat dilakukan
                            secara langsung saat ada event lain yang diselenggarakan di sekolah kami.</p>
                        <p id="wajib">*) wajib</p>
                    </div>
                    <form v-if="displayForm" @submit.prevent="handleSubmit">
                        <input :disabled="loading" v-model="form.nama" placeholder="Nama Lengkap*" type="text" required
                            @input="(e: Event) => form.nama = toUpperCases(e)" />
                        <input :disabled="loading" v-model="form.umur" placeholder="Umur*" type="text"
                            inputmode="numeric" required @input="(e: Event) => form.umur = removeNonNumeric(e)" />
                        <div class="phone">
                            <span class="prefix">+62</span>
                            <input :disabled="loading" v-model="form.phone" placeholder="Nomor HP*" type="tel"
                                inputmode="numeric" pattern="^8[0-9]{7,11}$" required
                                @input="(e: Event) => form.phone = removeNonNumeric(e)" />
                        </div>
                        <input :disabled="loading" v-model="form.alamat" placeholder="Alamat*" type="text" required />
                        <input :disabled="loading" v-model="form.lulus_tahun" placeholder="Lulusan Tahun*" type="text"
                            inputmode="numeric" required
                            @input="(e: Event) => form.lulus_tahun = removeNonNumeric(e)" />
                        <div class="upload">
                            <label for="upload-bukti">Upload Bukti*</label>
                            <p>Upload bukti ijazah atau kartu pelajar Anda, ini digunakan untuk memverifikasi bahwa Anda
                                lulusan SMKN 1 Blitar.</p>
                            <div class="information">
                                <p><i class="ri-information-line"></i> Gambar harus jernih dan tulisan terlihat. Max:
                                    500 MB
                                </p>
                            </div>
                            <div class="file-info" :class="{ 'disabled': loading }">
                                <label id="u-file" for="upload-file">Pilih File</label>
                                <span>{{ fileName ?? "Tidak ada file." }}</span>
                            </div>
                            <input accept="image/*" id="upload-file" style="display: none;" type="file"
                                @change="handleFileUpload" :disabled="loading">
                        </div>
                        <button v-if="!loading" type="submit">LANJUTKAN</button>
                        <div class="load" v-else>
                            <i class="ri-loader-4-line spin"></i>
                        </div>
                    </form>
                    <div class="error" v-if="displayError">
                        <i class="ri-spam-2-line"></i>
                        <span>Error!</span>
                        <p>{{ errorMessage }}</p>

                        <button v-if="displayReturn" @click="returns()">KEMBALI</button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>

        <section class="err" v-if="!panels">
            <Errors />
        </section>
    </template>
</template>

<script setup lang="ts">
import "./css/Buy.css";
import Footer from "../footer/Footer.vue";
import { reactive, ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { useApi } from "../../../composables/useApi";
import Errors from "../errors/Errors.vue";
import LoadingScreen from "../global/LoadingScreen.vue";

const isLoading = ref(true);
const api = useApi();
const form = reactive({
    nama: "",
    phone: "",
    alamat: "",
    umur: "",
    lulus_tahun: "",
    file: null as File | null
});
const fileName = ref<string | null>(null);
const file = ref<File | null>(null);
const panels = ref(true);
const displayForm = ref(false);
const displayError = ref(false);
const loading = ref(false);
const errorMessage = ref<null | string>(null);
const displayReturn = ref(true);

const stopRequest = () => {
    panels.value = false;
}

onMounted(() => {
    api.accessToken((error, token_result) => {
        if (error) { stopRequest(); return };

        api.request("/users/getAlumniTotal", String(token_result), null, (err, result) => {
            if (err) { stopRequest(); return };
            if (Number(result!["result"]) >= 200) { displayError.value = true; errorMessage.value = "Pembelian tiket telah ditutup, kuota mencapai batas 200 kuota."; displayReturn.value = false; } else { displayForm.value = true };
            isLoading.value = false;
        })
    })
})

const returns = () => {
    displayForm.value = true;
    displayError.value = false;
}

const toUpperCases = (e: Event) => {
    const target = e.target as HTMLInputElement
    target.value = target.value.toUpperCase()
    return target.value
}

const removeNonNumeric = (e: Event) => {
    const target = e.target as HTMLInputElement
    target.value = target.value.replace(/[^0-9]/g, '')
    return target.value
}

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length == 0) return;

    file.value = target.files[0];
    form.file = target.files[0];
    fileName.value = form.file.name;
}

const handleSubmit = () => {
    if (!fileName.value) return Swal.fire({
        title: "Warning!",
        icon: "warning",
        text: "Bukti tidak boleh kosong, unggah bukti ijazah atau kartu pelajar SMKN 1 Blitar."
    })

    loading.value = true;
    const reader = new FileReader()
    reader.readAsDataURL(file.value as File);
    reader.onload = () => {
        const fileBase64 = reader.result as string;

        api.accessToken((error, token_result) => {
            if (error) { stopRequest(); return };

            api.request("/users/register", String(token_result), { nama: form.nama, umur: form.umur, phone: form.phone, lulus_tahun: form.lulus_tahun, alamat: form.alamat, bukti: fileBase64 }, (err, result) => {
                if (err) { stopRequest(); return };
                if (!result!["ok"]) {
                    loading.value = false;
                    displayForm.value = false;
                    displayError.value = true;
                    errorMessage.value = String(result!["message"]);
                    return;
                }
                window.location.href = result!["result"]["url"];
                return;
            })
        })
    }
}
</script>