<template>
  <div class="backup-view">
    <Nav/>
    <div v-if="!getConnection" class="no-internet-description">
      <p>No Internet Connection</p>
    </div>
    <Backup v-if="getConnection"/>
  </div>
</template>

<script>
import Nav from "~/components/Nav.vue";
import Backup from "~/components/Backup.vue";
import { mapGetters } from "vuex";
export default {
  middleware: "auth",
  components: { Nav, Backup },
  computed: {
    ...mapGetters({
      getConnection: "getConnection"
    })
  }
};
</script>


<style>
.backup-view {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
</style>
