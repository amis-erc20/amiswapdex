<template>
  <div>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700">
    <script src="https://apis.google.com/js/api.js"></script>
    <!-- <script src="../assets/js/_nuxt/addtohomescreen.js"></script> -->
    <!-- <link rel="stylesheet" type="text/css" href="../assets/css/addtohomescreen.css"> -->
    <nuxt/>
  </div>
</template>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

html,
body {
  font-family: "Open Sans", sans-serif !important;
  /* background-image: linear-gradient(to top, #dfe9f3 0%, white 100%); */
  /* background-blend-mode: multiply; */
  background-repeat: no-repeat;
  background: #eceeef;
  line-height: 1 !important;
}
.list-group-item {
  /* background-color: #f1f2f3 !important; */
}
body {
  font-family: "Open Sans", sans-serif;
}

#app {
  font-family: "Open Sans", sans-serif;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
.btn {
  border-radius: 0px !important;
}
#no_internet_modal {
  color: #333;
  position: fixed;
  top: 150px;
}
#no_internet_modal .modal-content {
  width: 90%;
  max-width: 450px;
  margin: 0 auto;
}
#no_internet_modal .modal-body p {
  font-size: 14px;
}
#no_internet_modal .modal-header {
  background: #2851e4;
  color: #fff;
  text-align: center;
  height: 40px;
}
#no_internet_modal .modal-title {
  flex-grow: 2;
  flex-grow: 2;
  font-size: 18px;
  top: -10px;
  position: relative;
}
#no_internet_modal .modal-header button {
  height: 40px;
  position: relative;
  top: -10px;
}
#no_internet_modal .modal-body {
  padding: 10px;
  text-align: center;
}
.no-internet-description {
  top: 100px;
  position: fixed;
  text-align: center;
  width: 100%;
}
.no-internet-description p {
  text-align: center;
}
</style>
