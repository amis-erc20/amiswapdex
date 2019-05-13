<template>
  <div class="tos-view">
    <Nav/>
    <div id="tos-description">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus dignissim erat nec malesuada. Nam eget elit lacinia, auctor mauris in, dapibus nisl. Phasellus mollis faucibus blandit. Proin consequat, libero eu venenatis tempus, lacus metus rhoncus urna, in congue risus arcu ut leo. Nam fermentum odio urna, ac dictum nisi vehicula at. Cras mauris orci, blandit mattis cursus posuere, ultrices sit amet lacus. Morbi suscipit, dolor scelerisque venenatis egestas, velit ex suscipit lacus, a laoreet dui neque quis ipsum. Maecenas interdum varius arcu non laoreet. Nam diam quam, suscipit a commodo ut, accumsan ac leo. Nulla pellentesque posuere auctor. In auctor vulputate est vitae ornare. In fringilla tristique dapibus. Sed ut iaculis felis, non finibus dolor.</p>
      <p>Aliquam erat volutpat. In sagittis ex mauris, eu auctor orci interdum a. Nulla bibendum diam eget ultricies hendrerit. Nam pharetra purus varius nibh venenatis commodo. Duis ut dolor lobortis, auctor lorem et, fermentum lorem. Aliquam erat volutpat. Vestibulum ultrices, urna et interdum aliquam, tellus tellus finibus ipsum, a convallis ante velit sed ex. Curabitur id pellentesque nisi, sit amet luctus sem. Vivamus laoreet tellus lectus, ut sagittis nisi vehicula quis. Etiam tortor neque, elementum in lobortis vitae, egestas sed tortor. Vivamus rhoncus posuere suscipit. Sed eros lorem, mattis nec libero pulvinar, euismod viverra libero. Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi tempus arcu id sapien pharetra, at volutpat eros laoreet.</p>
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
  top: 64px;
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
}
#tos-description p {
  text-align: center;
}
</style>
