<template>
  <div class="receive-toekn-view">
    <Nav />
    <Receive />
  </div>
</template>

<script>
import Receive from "~/components/Receive.vue";
import Nav from "~/components/Nav.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { Receive, Nav }
};
</script>


<style>
.receive-toekn-view {
    width: 100%;
    height: 100vh;
    overflow: hidden;
}
</style>
