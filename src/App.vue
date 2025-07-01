<template>
  <div>
    <h1>Scanner App</h1>
    <button v-if="showInstall" @click="promptInstall">Install App</button>
    <div id="reader" style="width: 300px; margin: auto;"></div>
    <p v-if="!qrCode">📷 Point your camera at a QR code</p>
    <p v-if="qrCode">✅ Scanned Code: {{ qrCode }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Html5Qrcode } from "html5-qrcode"

const qrCode = ref('')
const showInstall = ref(false)
let deferredPrompt = null

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    showInstall.value = true
  })

  const html5QrCode = new Html5Qrcode("reader")
  html5QrCode.start(
    { facingMode: "environment" },
    {
      fps: 10,
      qrbox: { width: 300, height: 300 }
    },
    (decodedText) => {
      qrCode.value = decodedText
      html5QrCode.stop() // stop scanning after success
    },
    () => {
      // Suppressed scan errors
    }
  )
})

function promptInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then((choice) => {
      if (choice.outcome === 'accepted') {
        console.log('App installed')
      }
      deferredPrompt = null
      showInstall.value = false
    })
  }
}
</script>