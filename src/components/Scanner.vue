<template>
  <div>
    <div id="scanner" style="width: 300px;"></div>
    <p v-if="lastResult">Last scanned: {{ lastResult }}</p>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import { addToQueue } from '../composables/useOfflineQueue'

const lastResult = ref('')
const scanner = ref(null)

onMounted(() => {
  const html5QrCode = new Html5Qrcode('scanner')
  Html5Qrcode.getCameras().then(devices => {
    if (devices && devices.length) {
      html5QrCode.start(
        devices[0].id,
        { fps: 10, qrbox: 250 },
        async decodedText => {
          lastResult.value = decodedText
          await addToQueue({ code: decodedText, timestamp: Date.now() })
        }
      )
    }
  })
})
</script>