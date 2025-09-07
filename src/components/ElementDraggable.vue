<!-- components/ElementDraggable.vue -->
<template>
  <div
    class="draggable-element"
    :class="{ selected: isSelected, 'photo-placeholder': isPhotoPlaceholder }"
    :style="elementStyle"
    @mousedown="startDrag"
    @dblclick="handleDoubleClick"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <!-- Фото элемент -->
    <div v-if="element.type === 'photo'" class="photo-element">
      <img v-if="element.photoUrl" :src="element.photoUrl" alt="Photo" />
      <div v-else class="photo-placeholder-content">
        <span>Перетащите фото сюда</span>
      </div>
      <div class="element-controls">
        <button @click="rotateElement(-15)">↺</button>
        <button @click="rotateElement(15)">↻</button>
        <button @click="removeElement">×</button>
      </div>
    </div>

    <!-- Текстовый элемент -->
    <div
      v-else-if="element.type === 'text'"
      class="text-element"
      :style="textStyle"
      @click="handleTextClick"
    >
    
      <textarea
        v-if="isEditing"
        v-model="element.content"
        @blur="isEditing = false"
        @keydown.enter="isEditing = false"
        :style="textStyle"
      />
      <div v-else @dblclick="isEditing = true">
        {{ element.content }}
      </div>
      <div class="element-controls">
        <button @click="rotateElement(-15)">↺</button>
        <button @click="rotateElement(15)">↻</button>
        <button @click="removeElement">×</button>
      </div>
    </div>

    <!-- Стикер элемент -->
    <div v-else-if="element.type === 'sticker'" class="sticker-element">
      <img :src="element.stickerUrl" alt="Sticker" />
      <div class="element-controls">
        <button @click="rotateElement(-15)">↺</button>
        <button @click="rotateElement(15)">↻</button>
        <button @click="removeElement">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useBookStore } from "../stores/useBookStore";

const props = defineProps({
  element: Object,
  isSelected: Boolean,
});

const emit = defineEmits(["select", "update", "remove"]);
const isEditing = ref(false);
const bookStore = useBookStore();

const elementStyle = computed(() => ({
  left: `${props.element.x}px`,
  top: `${props.element.y}px`,
  width: `${props.element.width}px`,
  height: `${props.element.height}px`,
  transform: `rotate(${props.element.rotation}deg)`,
  position: "absolute",
  zIndex: props.isSelected ? 1000 : 1,
}));

const isPhotoPlaceholder = computed(
  () => props.element.type === "photo" && !props.element.photoUrl
);

const textStyle = computed(() => ({
  fontSize: `${props.element.fontSize}px`,
  fontFamily: props.element.fontFamily,
  color: props.element.color,
  width: "100%",
  height: "100%",
  border: "none",
  outline: "none",
  background: "transparent",
}));

let startX = 0;
let startY = 0;
let initialElementX = 0;
let initialElementY = 0;

function startDrag(e) {
  e.preventDefault();
  emit("select");

  startX = e.clientX;
  startY = e.clientY;
  initialElementX = props.element.x;
  initialElementY = props.element.y;

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);
}

function drag(e) {
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  emit("update", {
    x: initialElementX + dx,
    y: initialElementY + dy,
  });
}

function stopDrag() {
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
}

function rotateElement(degrees) {
  emit("update", {
    rotation: (props.element.rotation + degrees) % 360,
  });
}

function removeElement() {
  emit("remove");
}

function handleDoubleClick() {
  if (props.element.type === "text") {
    isEditing.value = true;
  }
}

function handleDragOver(e) {
  if (props.element.type === "photo") {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }
}

function handleDrop(e) {
  if (props.element.type === "photo") {
    e.preventDefault();

    const photoUrl = e.dataTransfer.getData("photo/url");
    if (photoUrl) {
      // Обновляем элемент с новой фотографией
      emit("update", {
        photoUrl: photoUrl,
        width: parseInt(e.dataTransfer.getData("photo/width")) || 150,
        height: parseInt(e.dataTransfer.getData("photo/height")) || 100,
      });

      // Увеличиваем счетчик использования фото
      bookStore.incrementPhotoUsage(photoUrl);
    }
  }
}
</script>

<style scoped>
.draggable-element {
  border: 2px solid transparent;
  cursor: move;
  user-select: none;
  transition: border-color 0.2s;
}

.draggable-element.selected {
  border-color: #2196f3;
  z-index: 1000;
}

.photo-element,
.text-element,
.sticker-element {
  width: 100%;
  height: 100%;
  position: relative;
}

.photo-element img,
.sticker-element img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.text-element {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  overflow: hidden;
  border-radius: 4px;
}

.element-controls {
  position: absolute;
  top: -30px;
  right: 0;
  display: none;
  gap: 5px;
}

.draggable-element:hover .element-controls,
.draggable-element.selected .element-controls {
  display: flex;
}

.element-controls button {
  width: 25px;
  height: 25px;
  border: none;
  background: #2196f3;
  color: white;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.photo-placeholder {
  border: 2px dashed #3498db;
  background: rgba(52, 152, 219, 0.1);
}

.photo-placeholder-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3498db;
  font-size: 14px;
  text-align: center;
  padding: 10px;
}

.draggable-element.photo-placeholder:hover {
  background: rgba(52, 152, 219, 0.2);
}
</style>