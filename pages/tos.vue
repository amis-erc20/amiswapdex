<template>
  <div class="tos-view">
    <Nav/>
    <div id="tos-description">
      <p>The UniswapDEX.com service, henceforth referred to as Service provides an interface to the Uniswap smart contracts developed on the Ethereum network developed by Uniswap.io.</p>
      <p>The Service does not store your private keys. The safe storage of your private keys are your responsibility. If you lose your private keys or forget your password, we cannot help you in any way.</p>
      <p>
        <strong>
          THE Service IS PROVIDED TO YOU
          <em>‘AS IS’</em> AND WITHOUT WARRANTIES OR REPRESENTATIONS OF ANY KIND EITHER EXPRESSED OR IMPLIED.
        </strong>
      </p>
      <p>You agree to indemnify, defend and hold the Service harmless from any loss, claim or demand including attorneys’ fees and costs and any fines, fees or penalties imposed by any regulatory authority or any third party arising out of or related to your use of the Service and/or your violation of any law, rule, or regulation, or the rights of any third party.</p>
    </div>
  </div>
</template>

<script>
import Nav from "~/components/Nav.vue";
export default {
  middleware: "auth",
  components: { Nav }
};
</script>


<style>
.tos-view {
  width: 100%;
  height: 100vh;
  overflow: scroll;
}
#tos-description {
  position: relative;
  color: #333;
  /* top: 64px; */
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: flex-start;
  width: 90%;
  max-width: 650px;
  margin: 20px auto;
  padding: 20px;
  font-size: 13px;
  font-weight: lighter;
}
#tos-description img {
  width: 150px;
  text-align: center;
  display: block;
  margin: 0 auto;
  color: #333;
}
#tos-description p {
  text-align: left;
  line-height: 1.5;
  font-weight: normal;
}
</style>
