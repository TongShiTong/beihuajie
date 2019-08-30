/*�ϴ�ͼƬ����ʾ*/

function showPreview(source) {
    var file = source.files[0];
    if(window.FileReader) {
        var fr = new FileReader();
        var portrait = document.getElementById('portrait');
        fr.onloadend = function(e) {
            portrait.src = e.target.result;
        };
        fr.readAsDataURL(file);
        portrait.style.display = 'block';
    }
}


/*获取验证码*/
var countdown=60;
function settime(obj) { //�获取验证码
    if (countdown == 0) {
        obj.attr('disabled',false);
        //obj.removeattr("disabled");
        obj.attr("value","获取验证码");
        countdown = 60;
        return;
    } else {
        obj.attr('disabled',true);
        obj.attr("value","重新发送(" + countdown + ")");
        countdown--;
    }
    setTimeout(function() {
            settime(obj) }
        ,1000)
}


/*关于rem单位的设置*/
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'onorientationchange' in window ? 'onorientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if(clientWidth>=750){
                docEl.style.fontSize = '100px';
            }else{
                docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
            }
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);


//需要mui.js版本
document.addEventListener('plusready', function() {
  var webview = plus.webview.currentWebview();
  plus.key.addEventListener('backbutton', function() {
    webview.canBack(function(e) {
      if(e.canBack) {
        webview.back();
      } else {
        //webview.close(); //hide,quit
        //plus.runtime.quit();
        mui.plusReady(function() {
          //首页返回键处理
          //处理逻辑：1秒内，连续两次按返回键，则退出应用；
          var first = null;
          plus.key.addEventListener('backbutton', function() {
            //首次按键，提示‘再按一次退出应用’
            if(!first) {
              first = new Date().getTime();
              mui.toast('再按一次退出应用');
              setTimeout(function() {
                first = null;
              }, 1000);
            } else {
              if(new Date().getTime() - first < 1500) {
                plus.runtime.quit();
              }
            }
          }, false);
        });
      }
    })
  });
});


