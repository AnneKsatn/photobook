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
      class="text-container"
      :style="containerStyle"
    >
      <textarea
        v-if="isEditing"
        ref="textInput"
        v-model="element.content"
        @blur="finishEditing"
        @keydown.esc="cancelEditing"
        @input="adjustTextareaSize"
        :style="textareaStyle"
        class="text-edit-input"
      />
      <div
        v-else
        @click="startEditing"
        class="text-content"
        :style="textContentStyle"
        v-html="formattedContent"
      />

      <!-- Угловые маркеры для растягивания -->
      <div v-if="isEditing" class="resize-handles">
        <div
          class="resize-handle top-left"
          @mousedown="startResize($event, 'nw')"
        ></div>
        <div
          class="resize-handle top-right"
          @mousedown="startResize($event, 'ne')"
        ></div>
        <div
          class="resize-handle bottom-left"
          @mousedown="startResize($event, 'sw')"
        ></div>
        <div
          class="resize-handle bottom-right"
          @mousedown="startResize($event, 'se')"
        ></div>
      </div>

      <div class="element-controls">
        <button @click="rotateElement(-15)">↺</button>
        <button @click="rotateElement(15)">↻</button>
        <button @click="removeElement">×</button>
      </div>
    </div>

    <!-- <div
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
    </div> -->

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
import { computed, ref, nextTick } from "vue";
import { useBookStore } from "../stores/useBookStore";

const props = defineProps({
  element: Object,
  isSelected: Boolean,
});

const emit = defineEmits(["select", "update", "remove"]);
const isEditing = ref(false);
const bookStore = useBookStore();
const textInput = ref(null);

const formatTextWithLineBreaks = (text) => {
  if (!text) return 'Нажмите для редактирования'
  return text.replace(/\n/g, '<br>')
}

const formattedContent = computed(() => {
  return formatTextWithLineBreaks(props.element.content)
})

const elementStyle = computed(() => ({
  left: `${props.element.x}px`,
  top: `${props.element.y}px`,
  width:
    props.element.type === "text" && !isEditing.value
      ? "auto"
      : `${props.element.width}px`,
  height:
    props.element.type === "text" && !isEditing.value
      ? "auto"
      : `${props.element.height}px`,
  transform: `rotate(${props.element.rotation}deg)`,
  position: "absolute",
  zIndex: props.isSelected ? 1000 : 1,
  minWidth: props.element.type === "text" ? "50px" : "none",
  minHeight: props.element.type === "text" ? "30px" : "none",
}));

const containerStyle = computed(() => ({
  width: "100%",
  height: "100%",
  position: "relative",
}));

const isPhotoPlaceholder = computed(
  () => props.element.type === "photo" && !props.element.photoUrl
);

const textContentStyle = computed(() => ({
  fontSize: `${props.element.fontSize || 16}px`,
  fontFamily: props.element.fontFamily || "Arial",
  color: props.element.color || "#000000",
  textAlign: props.element.textAlign || "left",
  fontWeight: props.element.fontWeight || "normal",
  fontStyle: props.element.fontStyle || "normal",
  textDecoration: props.element.textDecoration || "none",
  lineHeight: props.element.lineHeight || 1.2,
  padding: "2px",
  margin: "0",
  border: "1px solid transparent",
  cursor: "text",
  wordBreak: "break-word",
  whiteSpace: "pre-wrap",
  display: "inline-block",
  minWidth: "20px",
  minHeight: "20px",
}));

const textStyle = computed(() => ({
  fontSize: `${props.element.fontSize}px`,
  fontFamily: props.element.fontFamily,
  color: props.element.color,
  textAlign: props.element.textAlign || "center",
  fontWeight: props.element.fontWeight || "normal",
  fontStyle: props.element.fontStyle || "normal",
  textDecoration: props.element.textDecoration || "none",
  lineHeight: props.element.lineHeight || 1,
  width: "100%",
  height: "100%",
  border: "none",
  outline: "none",
  background: "transparent",
}));

const textareaStyle = computed(() => ({
  ...textContentStyle.value,
  background: "rgba(255, 255, 255, 0.95)",
  border: "1px dashed #FFC107",
  borderRadius: "3px",
  resize: "none",
  overflow: "hidden",
  position: "absolute",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  boxSizing: "border-box",
  margin: "0",
  padding: "2px",
}));

let startX = 0;
let startY = 0;
let initialElementX = 0;
let initialElementY = 0;
let initialWidth = 0;
let initialHeight = 0;
let resizeDirection = "";

function startDrag(e) {
  if (isEditing.value && e.target.classList.contains("resize-handle")) {
    return;
  }

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

function startEditing(e) {
  if (e.target.classList.contains("resize-handle")) {
    return;
  }
  emit("select", e);
  e.stopPropagation();
  isEditing.value = true;
  nextTick(() => {
    if (textInput.value) {
      textInput.value.focus();
      textInput.value.select();
      adjustTextareaSize();
    }
  });
}

function startResize(e, direction) {
  e.preventDefault();
  e.stopPropagation();

  resizeDirection = direction;
  startX = e.clientX;
  startY = e.clientY;
  initialWidth = props.element.width;
  initialHeight = props.element.height;
  initialElementX = props.element.x;
  initialElementY = props.element.y;

  document.addEventListener("mousemove", resize);
  document.addEventListener("mouseup", stopResize);
}

function resize(e) {
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  const updates = {};

  switch (resizeDirection) {
    case "nw":
      updates.width = Math.max(50, initialWidth - dx);
      updates.height = Math.max(30, initialHeight - dy);
      updates.x = initialElementX + dx;
      updates.y = initialElementY + dy;
      break;
    case "ne":
      updates.width = Math.max(50, initialWidth + dx);
      updates.height = Math.max(30, initialHeight - dy);
      updates.y = initialElementY + dy;
      break;
    case "sw":
      updates.width = Math.max(50, initialWidth - dx);
      updates.height = Math.max(30, initialHeight + dy);
      updates.x = initialElementX + dx;
      break;
    case "se":
      updates.width = Math.max(50, initialWidth + dx);
      updates.height = Math.max(30, initialHeight + dy);
      break;
  }

  emit("update", updates);
}

function finishEditing() {
  isEditing.value = false;
  emit("update", {
    content: props.element.content,
    width: textInput.value ? textInput.value.scrollWidth : props.element.width,
    height: textInput.value
      ? textInput.value.scrollHeight
      : props.element.height,
  });
}

function stopResize() {
  document.removeEventListener("mousemove", resize);
  document.removeEventListener("mouseup", stopResize);
  resizeDirection = "";
}

function cancelEditing() {
  isEditing.value = false;
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

function adjustTextareaSize() {
  if (textInput.value) {
    // Автоподбор высоты под содержимое
    textInput.value.style.height = "auto";
    textInput.value.style.height = textInput.value.scrollHeight + "px";

    // Обновляем размер элемента
    emit("update", {
      height: textInput.value.scrollHeight,
    });
  }
}

function handleDoubleClick() {
  if (props.element.type === "text") {
    isEditing.value = true;
    nextTick(() => {
      if (textInput.value) {
        textInput.value.focus();
        textInput.value.select();
        adjustTextareaSize();
      }
    });
  }
}

// function handleDoubleClick() {
//   if (props.element.type === "text") {
//     isEditing.value = true;
//   }
// }

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

.draggable-element.text-editing {
  border-color: #ffc107;
  z-index: 1001;
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

.text-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: text;
  word-break: break-word;
}

.text-edit-input {
  resize: none;
  padding: 5px;
  border: 1px dashed #ffc107;
  border-radius: 3px;
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

/* Скрываем контролы при редактировании текста */
.draggable-element.text-editing .element-controls {
  display: none;
}

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

.draggable-element.text-editing {
  border-color: #ffc107;
  z-index: 1001;
}

.draggable-element.text-element {
  padding: 0;
  margin: 0;
  border: none;
}

.photo-element,
.text-container,
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

.text-container {
  display: inline-block;
  min-width: 50px;
  min-height: 30px;
}

.text-content {
  display: inline-block;
  cursor: text;
  border: 1px solid transparent;
  transition: border-color 0.2s;
}

.draggable-element.selected .text-content {
  border-color: #2196f3;
}

.text-edit-input {
  resize: none;
  overflow: auto;
}

.resize-handles {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #2196f3;
  border: 2px solid white;
  border-radius: 50%;
  pointer-events: all;
  cursor: nwse-resize;
}

.resize-handle.top-left {
  top: -4px;
  left: -4px;
  cursor: nwse-resize;
}

.resize-handle.top-right {
  top: -4px;
  right: -4px;
  cursor: nesw-resize;
}

.resize-handle.bottom-left {
  bottom: -4px;
  left: -4px;
  cursor: nesw-resize;
}

.resize-handle.bottom-right {
  bottom: -4px;
  right: -4px;
  cursor: nwse-resize;
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

/* Скрываем контролы при редактировании текста */
.draggable-element.text-editing .element-controls {
  display: none;
}
</style>