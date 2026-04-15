<template>
  <div class="login-container">
    <h1>Retro-Retro</h1>
    <p>Collaborez efficacement avec vos équipes.</p>
    <button @click="auth.loginWithGoogle" class="google-btn">
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" />
      Se connecter avec Google
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
const auth = useAuthStore();
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.google-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  margin-top: 20px;
}

.google-btn img {
  width: 20px;
}
</style>
