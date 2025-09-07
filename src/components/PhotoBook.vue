<!-- components/PhotoBook.vue -->
<template>
  <div class="photo-book">
    <div class="toolbar">
      <button @click="addSpread" class="toolbar-button">
        ➕ Новый разворот
      </button>
      <div class="spread-navigation">
        <button @click="prevSpread" :disabled="currentSpreadIndex === 0">
          ◀
        </button>
        <span>Разворот {{ currentSpreadIndex + 1 }} из {{ spreads.length }}</span>
        <button @click="nextSpread" :disabled="currentSpreadIndex === spreads.length - 1">
          ▶
        </button>
      </div>
    </div>

    <div class="editor-container">
      <Sidebar />
      <SpreadEditor />
    </div>
  </div>
</template>

<script setup>
import { useBookStore } from '../stores/useBookStore'
import Sidebar from './Sidebar.vue'
import SpreadEditor from './SpreadEditor.vue'

const bookStore = useBookStore()
const { spreads, currentSpreadIndex } = bookStore

function addSpread() {
  bookStore.addSpread()
}

function prevSpread() {
  if (currentSpreadIndex.value > 0) {
    currentSpreadIndex.value--
  }
}

function nextSpread() {
  if (currentSpreadIndex.value < spreads.value.length - 1) {
    currentSpreadIndex.value++
  }
}
</script>

<style scoped>
.photo-book {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.toolbar {
  padding: 15px;
  background: #2c3e50;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar-button {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.spread-navigation {
  display: flex;
  align-items: center;
  gap: 15px;
}

.spread-navigation button {
  padding: 5px 10px;
  background: #34495e;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.spread-navigation button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.editor-container {
  flex: 1;
  display: flex;
}
</style>