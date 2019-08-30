<template>
  <div id="app">
    <router-view/>
  </div>
	
</template>

<script>
  // import eruda from 'eruda';
export default {
  name: 'App',
	methods:{
// 		getHomeInfo(){
// 			this.$ajax.get('/api/kuanye/index/search')
// 				.then(this.getHomeInfoSucc)
// 		},
// 		getHomeInfoSucc(res){
// 			console.log(res);
// 		}
	},
	mounted() {
		// this.getHomeInfo()
	},
  // created: function () {
  //   var el = document.createElement('div')
  //   document.body.appendChild(el)
  //   eruda.init({
  //     container: el,
  //     // tool: ['console', 'elements']
  //   })
  // }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 300ms;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.layui-m-layerbtn span:nth-child(2){background: #fcc270;color:#fff;}
</style>

