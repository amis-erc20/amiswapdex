<template>
  <div id="loading-background">
    <b-spinner style="width: 6rem; height: 6rem;" label="Loading" variant="primary"></b-spinner>
    <p class="loading-message">{{ message }}</p>
  </div>
</template>
<script>
export default {
  props: {
    message: {
      default: "Loading...",
      type: String
    }
  }
};
</script>

<style>
#loading-background {
  background: #f8f8f8;
  opacity: 1;
  z-index: 999999;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  padding-top: 300px;
}
.loading-message {
  color: #3c8bdd;
}
</style>

