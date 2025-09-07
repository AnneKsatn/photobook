// stores/useBookStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBookStore = defineStore('photoBook', () => {
  const spreads = ref([{ id: 1, elements: [], layout: null }])
  const uploadedPhotos = ref([])
  const currentSpreadIndex = ref(0)
  const hideUsedPhotos = ref(false)
  const photoUsageCount = ref({})

  const activeTab = ref('layouts')
  const layouts = ref([
    {
      id: 1,
      name: 'Классический',
      elements: [
        { type: 'photo', x: 50, y: 50, width: 200, height: 150, rotation: 0 },
        { type: 'photo', x: 300, y: 50, width: 200, height: 150, rotation: 0 },
        { type: 'text', x: 150, y: 250, width: 250, height: 50, rotation: 0, content: 'Заголовок' }
      ]
    },
    {
      id: 2,
      name: 'Модерн',
      elements: [
        { type: 'photo', x: 100, y: 50, width: 300, height: 200, rotation: 0 },
        { type: 'text', x: 150, y: 300, width: 200, height: 40, rotation: 0, content: 'Подпись' }
      ]
    },
    {
      id: 3,
      name: 'Семейный',
      elements: [
        { type: 'photo', x: 50, y: 50, width: 180, height: 120, rotation: 0 },
        { type: 'photo', x: 250, y: 50, width: 180, height: 120, rotation: 0 },
        { type: 'photo', x: 450, y: 50, width: 180, height: 120, rotation: 0 },
        { type: 'text', x: 200, y: 200, width: 300, height: 60, rotation: 0, content: 'Семья' }
      ]
    }
  ])

  const stickers = ref([
    {
      id: 1,
      name: 'Сердце',
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDIxLjM1TDEwLjU1IDIwLjAzQzULjQgMTUuMzYgMiAxMi4yOCAyIDguNUMyIDUuNDIgNC40MiAzIDcuNSAzQzkuMjQgMyAxMC45MSAzLjgxIDEyIDUuMDlDMTMuMDkgMy44MSAxNC43NiAzIDE2LjUgM0MxOS41OCAzIDIyIDUuNDIgMjIgOC41QzIyIDEyLjI4IDE4LjYgMTUuMzYgMTMuNDUgMjAuMDNMMTIgMjEuMzVaIiBmaWxsPSIjRkY0ODY1Ii8+Cjwvc3ZnPg==',
      width: 50,
      height: 50
    },
    {
      id: 2,
      name: 'Звезда',
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTUuMDkgOC4yNkwyMiA5LjI3TDE3IDE0LjE0TDE4LjE4IDIxLjAyTDEyIDE3Ljc3TDUuODIgMjEuMDJMNyAxNC4xNEwyIDkuMjdMOC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkZDNTA3Ii8+Cjwvc3ZnPg==',
      width: 50,
      height: 50
    },
    {
      id: 3,
      name: 'Смайлик',
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRkUwODciLz4KPGNpcmNsZSBjeD0iOCIgY3k9IjkiIHI9IjEuNSIgZmlsbD0iIzMzMzMzMyIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjkiIHI9IjEuNSIgZmlsbD0iIzMzMzMzMyIvPgo8cGF0aCBkPSJNOCAxNEM4IDE0IDkgMTYgMTIgMTZDMTUgMTYgMTYgMTQgMTYgMTQiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+',
      width: 50,
      height: 50
    },
    {
      id: 4,
      name: 'Облако',
      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYgMTlDNy42NjY2NyAxOSA5IDE3LjY2NjcgOSAxNkM5IDE3LjY2NjcgMTAuMzMzMyAxOSAxMiAxOUMxMy42NjY3IDE5IDE1IDE3LjY2NjcgMTUgMTZDMjAgMTYgMjAgMTAgMTcgOUMxNyA2IDExIDYgMTIgOUMxMiA2IDYgNiA2IDlDNCA5IDMgMTEgMyAxMkMzIDEzLjA2NjcgMy42NjY2NyAxNSA2IDE1QzYgMTYuNjY2NyA0LjMzMzMzIDE5IDYgMTlaIiBmaWxsPSIjODBCREZGIi8+Cjwvc3ZnPg==',
      width: 60,
      height: 40
    }
  ])

  const textTemplates = ref([
    { id: 1, content: 'С днем рождения!', fontSize: 24, fontFamily: 'Arial', color: '#000000' },
    { id: 2, content: 'Люблю тебя!', fontSize: 20, fontFamily: 'Arial', color: '#FF0000' },
    { id: 3, content: 'Семейный альбом', fontSize: 22, fontFamily: 'Georgia', color: '#333333' },
    { id: 4, content: 'Лучшие моменты', fontSize: 18, fontFamily: 'Arial', color: '#0066CC' }
  ])


  const currentSpread = computed(() => spreads.value[currentSpreadIndex.value])

  function setActiveTab(tab) {
    activeTab.value = tab
    console.log(activeTab.value)
  }

  function addSpread() {
    spreads.value.push({
      id: Date.now(),
      elements: [],
      layout: null
    })
    currentSpreadIndex.value = spreads.value.length - 1
  }

  function applyLayout(layout) {
    const spread = currentSpread.value
    spread.layout = layout.id
    spread.elements = JSON.parse(JSON.stringify(layout.elements.map(el => ({
      ...el,
      id: Date.now() + Math.random()
    }))))
  }

  function addElement(element) {
    const newElement = {
      id: Date.now() + Math.random(),
      type: element.type,
      x: element.x || 100,
      y: element.y || 100,
      width: element.width || (element.type === 'text' ? 200 : 150),
      height: element.height || (element.type === 'text' ? 50 : 100),
      rotation: 0,
      content: element.content || '',
      photoUrl: element.photoUrl || '',
      stickerUrl: element.stickerUrl || '',
      fontSize: element.fontSize || 16,
      fontFamily: element.fontFamily || 'Arial',
      color: element.color || '#000000'
    }
    currentSpread.value.elements.push(newElement)
  }

  function updateElement(id, updates) {
    const element = currentSpread.value.elements.find(el => el.id === id)
    if (element) {
      Object.assign(element, updates)
    }
  }

  function removeElement(id) {
    const index = currentSpread.value.elements.findIndex(el => el.id === id)
    if (index !== -1) {
      currentSpread.value.elements.splice(index, 1)
    }
  }


  function uploadPhotos(files) {
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        uploadedPhotos.value.push({
          id: Date.now() + Math.random(),
          url: e.target.result,
          file: file,
          name: file.name
        })
      }
      reader.readAsDataURL(file)
    })
  }

  function incrementPhotoUsage(photoUrl) {
    if (!photoUsageCount.value[photoUrl]) {
      photoUsageCount.value[photoUrl] = 0
    }
    photoUsageCount.value[photoUrl]++
  }

  function getPhotoUsageCount(photoUrl) {
    return photoUsageCount.value[photoUrl] || 0
  }

  function toggleHideUsedPhotos() {
    hideUsedPhotos.value = !hideUsedPhotos.value
  }

  return {
    spreads,
    uploadedPhotos,
    currentSpreadIndex,
    currentSpread,
    layouts,
    stickers,
    textTemplates,
    activeTab,
    setActiveTab,
    addSpread,
    applyLayout,
    addElement,
    updateElement,
    removeElement,
    uploadPhotos,
    hideUsedPhotos,
    photoUsageCount,
    incrementPhotoUsage,
    getPhotoUsageCount,
    toggleHideUsedPhotos
  }
})