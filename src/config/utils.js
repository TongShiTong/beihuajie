import axios from 'axios'
import auth from '@/services/auth.js'
var token = auth.getToken();

//查询方法
export const selectTableInfo = function (address,param) {
	//address 请求地址    param 参数
	return axios.get(process.env.API_HOST+'api.php/'+address+'',{params:param},function(res){
	})

}

export const selectTableInfoP = function (address,param) {
  //address 请求地址    param 参数
	return axios({
    method:'post',
    url:process.env.API_HOST+'api.php/'+ address+'',
    data:param,
    headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
    timeout:15000,
    transformRequest: function(obj) {
        var str = [];
        for(var p in obj){
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
    }
}).then((res)=>{

   return res;
});
}
