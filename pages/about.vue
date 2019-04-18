<template>
  <div class="about-view">
    <Nav/>
    <div id="about-description">
      <img src="../assets/logo.svg" alt>
      <p>Shardus is building distributed ledger software to remedy the problems of traditional blockchains -- scalability, decentralization and efficiency.</p>
      <p>
        <strong>Version: {{version}}</strong>
      </p>
    </div>
  </div>
</template>

<script>
import Nav from "~/components/Nav.vue";
import config from "../config.js";
export default {
  middleware: "auth",
  components: { Nav },
  data: function() {
    return {
      version: config.version
    };
  }
};
</script>

<style>
.about-view {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
#about-description {
  position: relative;
  top: 64px;
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: flex-start;
  width: 90%;
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  font-size: 13px;
  font-weight: lighter;
}
#about-description img {
  width: 150px;
  text-align: center;
  display: block;
  margin: 0 auto;
}
#about-description p {
  text-align: center;
}
</style>
