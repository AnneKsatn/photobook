<!-- components/LayoutSelector.vue -->
<template>
  <div class="layout-selector">
    <h3>Макеты</h3>
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
              height: `${element.height / 5}px`
            }"
          ></div>
        </div>
        <span>{{ layout.name }}</span>
      </div>
    </div>
    
    <button @click="addTextElement" class="add-text-button">
      ✏️ Добавить текст
    </button>
  </div>
</template>

<script setup>
import { useBookStore } from '../stores/useBookStore'

const bookStore = useBookStore()
const { layouts } = bookStore

function applyLayout(layout) {
  bookStore.applyLayout(layout)
}

function addTextElement() {
  bookStore.addElement({
    type: 'text',
    content: 'Новый текст',
    width: 200,
    height: 50
  })
}
</script>

<style scoped>
.layout-selector {
  padding: 20px;
}

.layouts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin: 15px 0;
}

.layout-item {
  cursor: pointer;
  text-align: center;
}

.layout-preview {
  width: 120px;
  height: 80px;
  background: #f0f0f0;
  border: 2px solid #ddd;
  position: relative;
  margin-bottom: 5px;
}

.preview-element {
  position: absolute;
  background: rgba(33, 150, 243, 0.3);
  border: 1px solid #2196F3;
}

.preview-element.photo {
  background: rgba(76, 175, 80, 0.3);
  border-color: #4CAF50;
}

.preview-element.text {
  background: rgba(255, 193, 7, 0.3);
  border-color: #FFC107;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
}

.add-text-button {
  padding: 10px 15px;
  background: #FFC107;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}
</style>