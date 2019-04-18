<template>
  <div class="swaptoken-view">
    <Nav/>
    <Swap />
  </div>
</template>

<script>
import Nav from "~/components/Nav.vue";
import Swap from "~/components/Swap.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { Nav, Swap },
  data() {
    return {
      config: {
        mainToken: {
          symbol: "ULT",
          exchangeAddress: "0x28d9353611C5A0d5a026A648c05E5d6523e41CBf"
        },
        tokenListUrl: "https://beta.shardus.com/assets/js/tokenDB.json",
        chartServerUrl: "https://bounty.shardus.com:8889",
        colorScheme: {
          mainColor: "red",
          secondaryColor: "black"
        },
        logoUrl: "https://beta.shardus.com/assets/img/logo.svg",
        widgetTitle: ""
      }
    };
  }
};
</script>


<style>
</style>