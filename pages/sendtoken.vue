<template>
  <div class="send-toekn-view">
    <Nav/>
    <Send/>
  </div>
</template>

<script>
import Send from "~/components/Send.vue";
import Nav from "~/components/Nav.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { Send, Nav }
};
</script>


<style>
.send-toekn-view {
  width: 100%;
  min-height: 100vh;
  /* overflow: hidden; */
  overflow-y: scroll;
}
</style>
