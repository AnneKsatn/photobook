<!-- App.vue -->
<template>
  <div id="app">
    <PhotoBook />
  </div>
</template>

<script setup>
import PhotoBook from './components/PhotoBook.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background: #f8f9fa;
}

#app {
  height: 100vh;
  overflow: hidden;
}
</style>