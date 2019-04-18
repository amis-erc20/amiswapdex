<template>
  <div class="private-view">
    <Nav/>
    <Private/>
  </div>
</template>

<script>
import Nav from "~/components/Nav.vue";
import Private from "~/components/Private.vue";
export default {
  middleware: "auth",
  components: { Nav, Private }
};
</script>


<style>
.private-view {
  width: 100%;
  height: 100vh;
  overflow: scroll;
}
#tos-description {
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
#tos-description img {
  width: 150px;
  text-align: center;
  display: block;
  margin: 0 auto;
}
#tos-description p {
  text-align: center;
}
</style>
