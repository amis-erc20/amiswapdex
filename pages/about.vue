<template>
  <div class="about-view">
    <Nav/>
    <div id="about-description">
      <img src="../assets/logo.svg" alt>
      <p>
        The UniswapDEX.com provides an interface to the Uniswap smart contracts developed on the Ethereum network developed by
        <a
          href="https://uniswap.io/"
        >Uniswap.io</a>.
      </p>
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
  display: flex;
  height: 100vh;
  overflow: hidden;
  flex-direction: column;
  justify-content: flex-start;
  width: 90%;
  max-width: 650px;
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
  color: #333;
}
#about-description p {
  text-align: center;
  line-height: 1.5;
  font-weight: normal;
  color: #333;
}
</style>
