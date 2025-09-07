<!-- components/Sidebar.vue -->
<template>
  <div class="sidebar">
    <div class="sidebar-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="setActiveTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="tab-content">
      <!-- Вкладка Макеты -->
      <div v-if="activeTab === 'layouts'" class="tab-panel">
        <h3>Макеты разворотов</h3>
        <div class="layouts-grid">
          <div
            v-for="layout in layouts"
            :key="layout.id"
            class="layout-item"
            @click="applyLayout(layout)"
          >
            <div class="layout-preview">
              <div
                v-for="(element, index) in layout.elements"
                :key="index"
                class="preview-element"
                :class="element.type"
                :style="{
                  left: `${element.x / 5}px`,
                  top: `${element.y / 5}px`,
                  width: `${element.width / 5}px`,
                  height: `${element.height / 5}px`,
                }"
              ></div>
            </div>
            <span>{{ layout.name }}</span>
          </div>
        </div>
      </div>

      <!-- Вкладка Фотографии -->
      <div v-if="activeTab === 'photos'" class="tab-panel">
        <h3>Фотографии</h3>
        <div class="upload-section">
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

          <label class="hide-used-toggle">
            <input
              type="checkbox"
              v-model="hideUsedPhotos"
              @change="toggleHideUsedPhotos"
            />
            Скрыть использованные
          </label>
        </div>

        <div
          v-if="filteredPhotos && filteredPhotos.length"
          class="photo-library"
        >
          <div class="photo-grid">
            <div
              v-for="photo in filteredPhotos"
              :key="photo.id"
              class="photo-item"
              draggable="true"
              @dragstart="startDragPhoto($event, photo)"
              @click="addPhotoToSpread(photo)"
              :title="photo.name"
            >
              <img :src="photo.url" alt="Uploaded photo" />
              <span
                v-if="getPhotoUsageCount(photo.url) > 0"
                class="usage-badge"
              >
                {{ getPhotoUsageCount(photo.url) }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>Нет доступных фотографий</p>
        </div>
      </div>

      <!-- Вкладка Текст -->
      <div v-if="activeTab === 'text'" class="tab-panel">
        <h3>Текстовые элементы</h3>
        <button @click="addCustomText" class="add-text-button">
          ✏️ Добавить свой текст
        </button>

        <div class="text-templates">
          <h4>Шаблоны текста:</h4>
          <div
            v-for="template in textTemplates"
            :key="template.id"
            class="text-template"
            @click="addTextFromTemplate(template)"
            :style="{
              color: template.color,
              fontFamily: template.fontFamily,
              fontSize: template.fontSize + 'px',
            }"
          >
            {{ template.content }}
          </div>
        </div>
      </div>

      <!-- Вкладка Стикеры -->
      <div v-if="activeTab === 'stickers'" class="tab-panel">
        <h3>Стикеры</h3>
        <div class="stickers-grid">
          <div
            v-for="sticker in stickers"
            :key="sticker.id"
            class="sticker-item"
            @click="addSticker(sticker)"
            :title="sticker.name"
          >
            <img :src="sticker.url" :alt="sticker.name" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useBookStore } from "../stores/useBookStore";
import { storeToRefs } from "pinia";

const bookStore = useBookStore();
const fileInput = ref(null);

const tabs = [
  { id: "layouts", label: "📐 Макеты" },
  { id: "photos", label: "📷 Фотографии" },
  { id: "text", label: "✏️ Текст" },
  { id: "stickers", label: "⭐ Стикеры" },
];

// Используем storeToRefs для сохранения реактивности
const {
  activeTab,
  layouts,
  uploadedPhotos,
  textTemplates,
  stickers,
  hideUsedPhotos,
  photoUsageCount,
} = storeToRefs(bookStore);

const {
  setActiveTab,
  applyLayout,
  addElement,
  uploadPhotos,
  incrementPhotoUsage,
  getPhotoUsageCount,
  toggleHideUsedPhotos,
} = bookStore;

function triggerFileInput() {
  fileInput.value.click();
}

// Фильтрация фотографий
const filteredPhotos = computed(() => {
  if (!hideUsedPhotos.value) return uploadedPhotos.value;

  return uploadedPhotos.value.filter(
    (photo) => getPhotoUsageCount(photo.url) === 0
  );
});

function startDragPhoto(event, photo) {
  event.dataTransfer.setData("photo/url", photo.url);
  event.dataTransfer.setData("photo/width", "150"); // стандартная ширина
  event.dataTransfer.setData("photo/height", "100"); // стандартная высота
}

function handleFileUpload(event) {
  const files = event.target.files;
  if (files.length) {
    uploadPhotos(files);
  }
}

function addPhotoToSpread(photo) {
  addElement({
    type: "photo",
    photoUrl: photo.url,
    width: 150,
    height: 100,
  });
}

function addCustomText() {
  addElement({
    type: "text",
    content: "Ваш текст",
    width: 200,
    height: 50,
    fontSize: 16,
    fontFamily: "Arial",
    color: "#000000",
  });
}

function addTextFromTemplate(template) {
  addElement({
    type: "text",
    content: template.content,
    width: 250,
    height: 60,
    fontSize: template.fontSize,
    fontFamily: template.fontFamily,
    color: template.color,
  });
}

function addSticker(sticker) {
  addElement({
    type: "sticker",
    stickerUrl: sticker.url,
    width: sticker.width,
    height: sticker.height,
  });
}
</script>

<style scoped>
.sidebar {
  width: 300px;
  background: #ecf0f1;
  border-right: 1px solid #bdc3c7;
  display: flex;
  flex-direction: column;
}

.sidebar-tabs {
  display: flex;
  border-bottom: 1px solid #bdc3c7;
  background: #34495e;
}

.tab-button {
  flex: 1;
  padding: 12px 8px;
  border: none;
  background: transparent;
  color: white;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.3s;
}

.tab-button.active {
  background: #2c3e50;
  border-bottom: 2px solid #3498db;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.tab-panel h3 {
  margin-bottom: 15px;
  color: #2c3e50;
  font-size: 16px;
}

.upload-button {
  width: 100%;
  padding: 10px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 15px;
}

.add-text-button {
  width: 100%;
  padding: 10px;
  background: #ffc107;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 15px;
}

/* Стили для макетов */
.layouts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.layout-item {
  cursor: pointer;
  text-align: center;
}

.layout-preview {
  width: 100%;
  height: 60px;
  background: #f0f0f0;
  border: 2px solid #ddd;
  position: relative;
  margin-bottom: 5px;
  border-radius: 4px;
}

.preview-element {
  position: absolute;
  background: rgba(33, 150, 243, 0.3);
  border: 1px solid #2196f3;
  border-radius: 2px;
}

.preview-element.photo {
  background: rgba(76, 175, 80, 0.3);
  border-color: #4caf50;
}

.preview-element.text {
  background: rgba(255, 193, 7, 0.3);
  border-color: #ffc107;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
}

/* Стили для фотографий */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.photo-item {
  width: 70px;
  height: 70px;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  border: 2px solid transparent;
}

.photo-item:hover {
  transform: scale(1.05);
  border-color: #3498db;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-state {
  text-align: center;
  color: #7f8c8d;
  margin-top: 20px;
}

/* Стили для текста */
.text-templates {
  margin-top: 15px;
}

.text-template {
  padding: 10px;
  margin: 5px 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.text-template:hover {
  background: #f8f9fa;
}

/* Стили для стикеров */
.stickers-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.sticker-item {
  width: 60px;
  height: 60px;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sticker-item:hover {
  transform: scale(1.1);
}

.sticker-item img {
  max-width: 100%;
  max-height: 100%;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.hide-used-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #7f8c8d;
  cursor: pointer;
}

.photo-item {
  position: relative;
  width: 70px;
  height: 70px;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  border: 2px solid transparent;
}

.usage-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}
</style>