<template>
  <div>
    <div class="head">
      <i class="iconfont icon-zuo" @click="goBack"></i>
      <h1>APP下载</h1>
      <i></i>
    </div>

    <div class="app_main">
      <div class="app_kinds">
        <img src="/static/images/me/icon_az.png">
        Android版客户端下载
      </div>

      <a :href="androidLink" class="app_con"  >
        <div class="app_con_left">
          <img src="/static/images/me/img_android.png">
        </div>

        <div class="app_con_right" @click='saveImgFun(androidCode)'>
          <h1>扫描二维码下载或点击图片保存</h1>
          <img :src="urlImg + androidCode">
          <!-- <p>或者</p> -->
          <!-- <a @click="android_app()">点击下载</a> -->
        </div>
      </a>
      


      <div class="app_kinds">
        <img src="/static/images/me/icon_ios.png">
        IOS版客户端下载
      </div>

      <a  :href="iosLink" class="app_con" >
        
        <div class="app_con_right" @click='saveImgFun(iosCode)'>
          <h1>扫描二维码下载或点击图片保存</h1>
          <img :src="urlImg + iosCode" >
          <!-- <p>或者</p> -->
          <!-- <a @click="iosLink_app()">点击下载</a> -->
        </div>

        <div class="app_con_left">
          <img src="/static/images/me/img_ios.png">
        </div>
      </a>
    </div>
  </div>
</template>

<script>
    import {selectTableInfo} from '@/config/utils';
    import {Toast,Indicator} from 'mint-ui';
    export default{
      name: 'appDownload',
       // 加载选项
    load: {
      // 相当于window.onload
      dom() {
        // alert("test组件 Dom加载完成");
      },
      // plusready，设备加载完成
      plus() {
        let _thant=this;
        if(window.plus){
             plus.share.getServices(function(s){
            _thant.shares = s;
            }, function(e){
                alert("获取分享服务列表失败："+e.message);
            });
          }
      }
    },
    // 监听选项
    listener: {
      // “customEvent”为事件名称
      plusready(e) {
        // e.detail：事件传递的数据
        // alert("test:" + JSON.stringify(e.detail));
      }
    },
      data: function () {
        return{
          urlImg:process.env.API_HOST,//图片域名
          androidLink:'',
          androidCode:'',
          iosLink:'',
          iosCode:'',
          ImgUrlState:true,//海报图点击标示单张图片点击一次防止重复点击
          shares:null,//定义标示分享
        }
      },

      methods: {
        //返回上一页
        goBack() {
          this.$router.go(-1);
        },

        //获取android 下载 链接 + 二维码
        async getAndroidLink() {
          let _link01 = await selectTableInfo('systems/28');
          this.androidLink = _link01.data.content;
          // console.log(this.androidLink)
        },
        async getAndroidCode() {
          let _code01 = await selectTableInfo('systems/27');
          this.androidCode = _code01.data.content;
        },

        //获取ios 下载 链接 + 二维码
        async getIosLink() {
          let _link02 = await selectTableInfo('systems/30');
          this.iosLink = _link02.data.content;
          // console.log(this.iosLink)
        },
        async getIosCode() {
          let _code02 = await selectTableInfo('systems/29');
          this.iosCode = _code02.data.content;
        },
        // android_app:function(){
        //     location.href = process.env.API_HOST+'pay/app-down?type=1';
        // },
        // iosLink_app:function(){
        //     location.href = process.env.API_HOST+'pay/app-down?type=2';
        // },
      //点击单张海报保存相册
      saveImgFun(url){
        if(this.shares!=null){//app
          let param=this.urlImg + url;
          if(this.ImgUrlState){
            this.ImgUrlState=false;
            this.getImgUrl(param);
          }
        }
      },
         //点击单张海报保存相册->数据执行区域
      async getImgUrl(param) {
        let _that=this;
        if(this.shares!=null){//app
            Indicator.open({
               text: '保存中...',
            });    
          let dtask = plus.downloader.createDownload(param, {}, function ( d, status ) {
            if (status == 200 ) {
                plus.gallery.save( d.filename, function(){
                    _that.ImgUrlState=true;
                    plus.nativeUI.toast('保存成功');
                    Indicator.close();
                }, function(){
                    _that.ImgUrlState=true;
                    plus.nativeUI.toast('保存失败');
                    Indicator.close();
                });
            } else {
                plus.nativeUI.toast( "Download failed: " + status );
            }
          });
          dtask.start();  
         }
      },
       
      },

      mounted:function() {
          this.getAndroidLink();
          this.getAndroidCode();
          this.getIosLink();
          this.getIosCode();
      }
    }
</script>

<style scoped>
  .app_main{
    padding: 0.2rem 0.26rem;
    background: #fff;
  }
  .app_kinds{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.4rem;
    font-size: 0.3rem;
    color: #333;
    font-weight: 600;
  }
  .app_kinds img {
    width: 0.6rem;
    margin-right: 0.2rem;
  }
  .app_con{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  .app_con_left{
    width: 48%;
    overflow: hidden;
  }
  .app_con_left img{
    width: 100%;
  }
  .app_con_right{
    width: 48%;
    text-align: center;
  }
  .app_con_right h1{
    font-size: 0.28rem;
    color: #333;
    margin-bottom: 0.2rem;
  }
  .app_con_right img{
    width: 2.6rem;
    height: 2.6rem;
    margin-bottom: 0.2rem;
  }
  .app_con_right p{
    font-size: 0.26rem;
    color: #333;
    margin-bottom: 0.1rem;
  }
  .app_con_right a{
    font-size: 0.28rem;
    color: #33aaff;
    text-decoration: underline;
  }
</style>
