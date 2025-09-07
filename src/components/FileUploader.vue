<!-- components/FileUploader.vue -->
<template>
  <div class="file-uploader">
    <input
      type="file"
      multiple
      accept="image/*"
      @change="handleFileUpload"
      ref="fileInput"
      style="display: none"
    />
    <button @click="triggerFileInput" class="upload-button">
      📷 Загрузить фото
    </button>
    <div v-if="uploadedPhotos && uploadedPhotos.length" class="photo-library">
      <h3>Библиотека фото</h3>
      <div class="photo-grid">
        <div
          v-for="photo in uploadedPhotos"
          :key="photo.id"
          class="photo-item"
          @click="addPhotoToSpread(photo)"
        >
          <img :src="photo.url" alt="Uploaded photo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBookStore } from '../stores/useBookStore'
import { ref } from 'vue' // Добавлен импорт ref

const bookStore = useBookStore()
const fileInput = ref(null)

function triggerFileInput() {
  fileInput.value.click()
}

function handleFileUpload(event) {
  const files = event.target.files
  if (files.length) {
    bookStore.uploadPhotos(files)
  }
}

function addPhotoToSpread(photo) {
  bookStore.addElement({
    type: 'photo',
    photoUrl: photo.url,
    width: 150,
    height: 100
  })
}
</script>

<style scoped>
.upload-button {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}

.photo-library {
  margin-top: 20px;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.photo-item {
  width: 80px;
  height: 80px;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.photo-item:hover {
  transform: scale(1.05);
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>