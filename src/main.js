// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been setting in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import plus from 'vue-h5-plus';
import VueTouch from 'vue-touch';

import axios from 'axios';

import http from './services/http.js';
import Auth from './services/auth.js';
import layer from 'vue-layer-mobile';
import 'vue-layer-mobile/need/layer.css';
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
import '../static/css/basic.css';
import '../static/css/swiper.min.css';
import './iconfont/iconfont.css';
import '../static/js/common.js';
import '../static/js/mui.js';
import '../static/js/swiper.min.js';
import 'babel-polyfill';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(plus);
Vue.use(Mint);
Vue.config.productionTip = false;
Vue.use(layer);
Vue.use(ElementUI)


router.beforeEach((to, from, next) => {
    if(to.query.uid==undefined || to.query.uid==''){//获取当前的路由参数
        if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
            if (Auth.authenticated()) {// 通过vuex state获取当前的token是否存在
                next();
            }
            else {
              let ua = window.navigator.userAgent.toLowerCase();
              if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                let token = to.query.token;
                let mem_id = to.query.mem_id;
                if(token && mem_id){
                  localStorage.setItem('member_id',mem_id);
                  localStorage.setItem('tk',token);
                  next({
                    path: '/me',
                    query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
                  });
                  return;
                }else{
                  location.href = process.env.API_HOST + 'login';
                  return;
                }
              }
                next({
                    path: '/login',
                    query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
                })
            }
        }
        else {
            next();
        }
    }else {
        next();
    }

})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
