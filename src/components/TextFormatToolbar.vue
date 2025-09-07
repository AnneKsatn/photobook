<!-- components/TextFormatToolbar.vue -->
<template>
  <div v-if="visible" class="text-format-toolbar">
    <div class="toolbar-content">
      <!-- Размер шрифта -->
      <select v-model="format.fontSize" @change="updateFormatting">
        <option value="12">12</option>
        <option value="14">14</option>
        <option value="16">16</option>
        <option value="18">18</option>
        <option value="20">20</option>
        <option value="24">24</option>
        <option value="28">28</option>
        <option value="32">32</option>
        <option value="36">36</option>
        <option value="48">48</option>
      </select>
      
      <!-- Шрифт -->
      <select v-model="format.fontFamily" @change="updateFormatting">
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Georgia">Georgia</option>
        <option value="Verdana">Verdana</option>
        <option value="Courier New">Courier New</option>
        <option value="Impact">Impact</option>
      </select>
      
      <!-- Жирный -->
      <button 
        :class="{ active: format.fontWeight === 'bold' }" 
        @click="toggleFormat('fontWeight', 'bold', 'normal')"
        title="Жирный"
      >
        <strong>B</strong>
      </button>
      
      <!-- Курсив -->
      <button 
        :class="{ active: format.fontStyle === 'italic' }" 
        @click="toggleFormat('fontStyle', 'italic', 'normal')"
        title="Курсив"
      >
        <em>I</em>
      </button>
      
      <!-- Подчеркнутый -->
      <button 
        :class="{ active: format.textDecoration === 'underline' }" 
        @click="toggleFormat('textDecoration', 'underline', 'none')"
        title="Подчеркнутый"
      >
        <u>U</u>
      </button>
      
      <!-- Выравнивание -->
      <button 
        :class="{ active: format.textAlign === 'left' }" 
        @click="setTextAlign('left')"
        title="По левому краю"
      >
        ≡
      </button>
      
      <button 
        :class="{ active: format.textAlign === 'center' }" 
        @click="setTextAlign('center')"
        title="По центру"
      >
        ≡
      </button>
      
      <button 
        :class="{ active: format.textAlign === 'right' }" 
        @click="setTextAlign('right')"
        title="По правому краю"
      >
        ≡
      </button>
      
      <!-- Межстрочный интервал -->
      <select v-model="format.lineHeight" @change="updateFormatting">
        <option value="1">1.0</option>
        <option value="1.2">1.2</option>
        <option value="1.5">1.5</option>
        <option value="1.8">1.8</option>
        <option value="2">2.0</option>
      </select>
      
      <!-- Цвет текста -->
      <input 
        type="color" 
        v-model="format.color" 
        @change="updateFormatting"
        title="Цвет текста"
      />
      
      <!-- Закрыть панель -->
      <button @click="closeToolbar" class="close-button" title="Закрыть">
        ×
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  visible: Boolean,
  element: Object
})

const emit = defineEmits(['update', 'close'])

const format = ref({
  fontSize: 16,
  fontFamily: 'Arial',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  textAlign: 'center',
  lineHeight: 1,
  color: '#000000'
})

// Копируем форматирование из элемента при открытии
watch(() => props.element, (newElement) => {
  if (newElement) {
    format.value = {
      fontSize: newElement.fontSize || 16,
      fontFamily: newElement.fontFamily || 'Arial',
      fontWeight: newElement.fontWeight || 'normal',
      fontStyle: newElement.fontStyle || 'normal',
      textDecoration: newElement.textDecoration || 'none',
      textAlign: newElement.textAlign || 'center',
      lineHeight: newElement.lineHeight || 1,
      color: newElement.color || '#000000'
    }
  }
}, { immediate: true })

function updateFormatting() {
  emit('update', { ...format.value })
}

function toggleFormat(property, valueOn, valueOff) {
  format.value[property] = format.value[property] === valueOn ? valueOff : valueOn
  updateFormatting()
}

function setTextAlign(align) {
  format.value.textAlign = align
  updateFormatting()
}

function closeToolbar() {
  emit('close')
}
</script>

<style scoped>
.text-format-toolbar {
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 2000;
}

.toolbar-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.toolbar-content select,
.toolbar-content input[type="color"],
.toolbar-content button {
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 12px;
}

.toolbar-content button.active {
  background: #2196F3;
  color: white;
  border-color: #2196F3;
}

.toolbar-content button:hover {
  background: #f5f5f5;
}

.toolbar-content button.active:hover {
  background: #1976D2;
}

.toolbar-content input[type="color"] {
  width: 40px;
  height: 30px;
  padding: 2px;
}

.close-button {
  background: #e74c3c !important;
  color: white !important;
  border-color: #e74c3c !important;
  margin-left: 10px;
}

.close-button:hover {
  background: #c0392b !important;
}
</style>