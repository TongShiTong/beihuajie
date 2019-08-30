
// date.js
export function formatDate (date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};

function padLeftZero (str) {
    return ('00' + str).substr(str.length);
};

//截取字符串
export function subStrFun(value) {
	if(value&& value.length > 13) {
		value= value.substring(0,13)+ '...';
	}
	return value;
}

//获取设备类型
export function getDeviceType() {
    let app=navigator.appVersion;

  //    根据括号进行分割
    let left=app.indexOf('(');
    let right=app.indexOf(')');
    let str=app.substring(left+1,right);
    let Str=str.split(";");
    if(Str[0].indexOf("iPhone") != -1){
       return 2; //ios
    }else if(Str[1].indexOf("Android") != -1){
      return 1;  //Android
    }else{
      return 3;  //其他
    }

}
//获取ip
export function getCurIp() {
  return returnCitySN["cip"];
}

//返回上一页
export function goBack() {
  this.$router.go(-1);
}


