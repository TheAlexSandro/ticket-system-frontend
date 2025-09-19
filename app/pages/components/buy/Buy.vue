<template>
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
                    <input :disabled="loading" v-model="form.nama" placeholder="Nama Lengkap*" type="text" required @input="onInputNama" />
                    <input :disabled="loading" v-model="form.umur" placeholder="Umur*" type="text" inputmode="numeric"
                        required @input="onUmurInput" />
                    <div class="phone">
                        <span class="prefix">+62</span>
                        <input :disabled="loading" v-model="form.phone" placeholder="Nomor HP*" type="tel"
                            inputmode="numeric" pattern="^8[0-9]{7,11}$" required @input="onPhoneInput" />
                    </div>
                    <input :disabled="loading" v-model="form.alamat" placeholder="Alamat*" type="text" required />
                    <input :disabled="loading" v-model="form.lulus_tahun" placeholder="Lulusan Tahun*" type="text"
                        inputmode="numeric" required @input="onLulusTahun" />
                    <div class="upload">
                        <label for="upload-bukti">Upload Bukti*</label>
                        <p>Upload bukti ijazah atau kartu pelajar Anda, ini digunakan untuk memverifikasi bahwa Anda
                            lulusan SMKN 1 Blitar.</p>
                        <div class="information">
                            <p><i class="ri-information-line"></i> Gambar harus jernih dan tulisan terlihat. Max: 500 MB
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
                    <p>Pengguna sudah berada dalam basis data.</p>

                    <button @click="returns()">KEMBALI</button>
                </div>
            </div>
        </section>

        <Footer />
    </main>

    <section class="err" v-if="!panels">
        <Errors />
    </section>
</template>

<script setup lang="ts">
import "./css/Buy.css";
import Footer from "../footer/Footer.vue";
import { reactive, ref } from "vue";
import Swal from "sweetalert2";
import { useApi } from "../../../composables/useApi";
import Errors from "../errors/Errors.vue";

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
const displayForm = ref(true);
const displayError = ref(false);
const loading = ref(false);
const errorMessage = ref<null | string>(null);

const stopRequest = () => {
    panels.value = false;
}

const returns = () => {
    displayForm.value = true;
    displayError.value = false;
}

const onInputNama = () => {
    form.nama = form.nama.toUpperCase();
}

const onLulusTahun = (e: Event) => {
    const target = e.target as HTMLInputElement | null;
    if (!target) return;
    form.lulus_tahun = target.value.replace(/[^0-9]/g, "");
};

const onPhoneInput = (e: Event) => {
    const target = e.target as HTMLInputElement | null;
    if (!target) return;
    form.phone = target.value.replace(/[^0-9]/g, "");
};

const onUmurInput = (e: Event) => {
    const target = e.target as HTMLInputElement | null;
    if (!target) return;
    form.umur = target.value.replace(/[^0-9]/g, "");
};

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length == 0) return;

    file.value = target.files[0];
    form.file = target.files[0];
    fileName.value = form.file.name;
};

const handleSubmit = () => {
    if (Number(form.umur) < 18) return Swal.fire({
        title: "Warning!",
        icon: "warning",
        text: "Umur tidak valid!"
    })
    if (Number(form.lulus_tahun) > 2025) return Swal.fire({
        title: "Warning!",
        icon: "warning",
        text: "Ini hanya untuk alumni!"
    })
    if (Number(form.lulus_tahun) < 1965) return Swal.fire({
        title: "Warning!",
        icon: "warning",
        text: "Tahun kelulusan tidak valid!"
    })
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

        api.refreshToken((error, token_result) => {
            if (error) { stopRequest(); return };

            api.register(String(token_result), form.nama, form.umur, form.phone, form.lulus_tahun, form.alamat, fileBase64, (err, result) => {
                if (err) { stopRequest(); return };
                if (!result!["ok"]) {
                    displayForm.value = false;
                    displayError.value = true;
                    loading.value = false;
                    if (result!["error_code"] == "USER_FOUND") {
                        errorMessage.value = "Pengguna sudah berada dalam database.";
                        return;
                    }
                    if (result!["error_code"] == "FILE_TOO_LARGE") {
                        errorMessage.value = "Maximal ukuran file adalah 500 MB.";
                        return;
                    }
                }
                window.location.href = result!["result"]["url"];
                return;
            })
        })
    }
};
</script>