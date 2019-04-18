<template>
  <div class="body-section">
    <b-container class="bv-example-row">
      <b-row>
        <b-col>
          <tokenlist/>
        </b-col>
        <b-col cols="8">
          <transactionlist/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Tokenlist from "~/components/Tokenlist.vue";
import Transactionlist from "~/components/Transactionlist.vue";
export default {
  components: { Tokenlist, Transactionlist }
};
</script>


<style>
.body-section {
  max-width: 1200px;
  width: 1200px;
  margin-top: 30px;
}
</style>
