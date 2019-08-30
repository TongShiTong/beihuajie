/**
 * Created by Administrator on 2018/12/17 0017.
 */
import axios from 'axios';
import setting from '@/config/setting.js';
import Auth from './auth.js';
import router from '../router';

//axios 配置

axios.defaults.timeout = 5000;
//axios.defaults.baseUrl = '';

//http request 拦截器
axios.interceptors.request.use(
  config => {
    if(Auth.authenticated()) {
      var token = Auth.getToken();
		  config.headers.common["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if(error.response) {
      switch (error.response.status){
        case 401:
             // 微信端
              let ua = window.navigator.userAgent.toLowerCase();
              if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                let token = router.currentRoute.query.token;
                let mem_id = router.currentRoute.query.mem_id;
                if(token && mem_id){
                  localStorage.setItem('member_id',mem_id);
                  localStorage.setItem('tk',token);
                  location.reload();
                  return;
                }else{
                  // alert(GetUrlRelativePath(window.location.href));
                  location.href = process.env.API_HOST + 'login?view='+GetUrlRelativePath(window.location.href);
                  // location.href = process.env.API_HOST + 'wx/login?view='+GetUrlRelativePath(window.location.href);
                  // return;
                }
              }
              //401 清楚token信息并跳转到登录页面
              Auth.logout();
              router.replace({
                path:'login',
                query: {redirect:router.currentRoute.fullPath}
              });
      }
    }
    // console.log(error);//console: error:request failed with status  code 402
    return Promise.reject(error);
  });
export  default axios;
//首先获取 Url，然后把 Url 通过  假如当前 Url 是 http// www. liangshunet. com/pub/item.aspx?t=osw7，则截取到的相对路径为：/pub/item.aspx。
function GetUrlRelativePath()
　　{
　　　　var url = document.location.toString();
　　　　var arrUrl = url.split("//");

　　　　var start = arrUrl[1].indexOf("/");
　　　　var relUrl = arrUrl[1].substring(start+1);//stop省略，截取从start开始到结尾的所有字符

　　　　if(relUrl.indexOf("?") != -1){
　　　　　　relUrl = relUrl.split("?")[0];
　　　　}
　　　　return relUrl;
　　}
