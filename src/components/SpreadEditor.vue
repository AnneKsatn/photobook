<!-- components/SpreadEditor.vue -->
<template>
  <div class="spread-editor">
    <TextFormatToolbar
      v-if="showFormatToolbar && selectedTextElement"
      :visible="showFormatToolbar"
      :element="selectedTextElement"
      @update="updateElement(selectedTextElement.id, $event)"
      @close="closeFormatToolbar"
    />

    <div
      class="spread-container"
      ref="spreadContainer"
      @dragover="handleDragOver"
      @drop="handleDrop"
    >
      <div class="spread-page">
        <ElementDraggable
          v-for="element in currentSpread.elements"
          :key="element.id"
          :element="element"
          :is-selected="selectedElementId === element.id"
          @select="selectElement(element)"
          @update="updateElement(element.id, $event)"
          @remove="removeElement(element.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useBookStore } from "../stores/useBookStore";
import ElementDraggable from "./ElementDraggable.vue";
import TextFormatToolbar from "./TextFormatToolbar.vue";

const bookStore = useBookStore();
const spreadContainer = ref(null);
const selectedElementId = ref(null);
const selectedTextElement = ref(null);
const showFormatToolbar = ref(false);

const currentSpread = computed(() => bookStore.currentSpread);

function selectElement(element) {
  selectedElementId.value = element.id;

  // Если выбран текстовый элемент - показываем панель форматирования
  if (element.type === "text") {
    selectedTextElement.value = element;
    showFormatToolbar.value = true;
    console.log("text");
  } else {
    closeFormatToolbar();
  }
}

function updateElement(id, updates) {
  bookStore.updateElement(id, updates);
}

function removeElement(id) {
  bookStore.removeElement(id);
  if (selectedElementId.value === id) {
    selectedElementId.value = null;
    closeFormatToolbar();
  }
}

function closeFormatToolbar() {
  showFormatToolbar.value = false;
  selectedTextElement.value = null;
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
}

function handleDrop(e) {
  e.preventDefault();

  const photoUrl = e.dataTransfer.getData("photo/url");
  if (photoUrl) {
    // Создаем новый элемент фото в позиции курсора
    const rect = spreadContainer.value.getBoundingClientRect();
    const x = e.clientX - rect.left - 75; // центрируем фото
    const y = e.clientY - rect.top - 50;

    bookStore.addElement({
      type: "photo",
      photoUrl: photoUrl,
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: 150,
      height: 100,
    });

    // Увеличиваем счетчик использования фото
    bookStore.incrementPhotoUsage(photoUrl);
  }
}

// Клик вне элемента снимает выделение
onMounted(() => {
  spreadContainer.value?.addEventListener("click", (e) => {
    if (e.target === spreadContainer.value) {
      selectedElementId.value = null;
      closeFormatToolbar();
    }
  });
});
</script>

<style scoped>
.spread-editor {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  padding: 20px;
  position: relative;
}

.spread-container {
  position: relative;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.spread-page {
  width: 800px;
  height: 500px;
  position: relative;
  background: white;
  border: 1px solid #ddd;
}
</style>