<template>
   <div class="guideClass">
      <div class="head">
          <i class="iconfont icon-zuo" @click="goBack"></i>
          <h1>加盟合伙人</h1>
          <i></i>
      </div>
     <div v-html="guideCon.wy_html" class="guideCon">

     </div>
      <div class="tg_ways">
        <div class="tg_hb" @click="showPosterImg('/payHtml?id='+guideCon.id)">查看</div>
          <div class="tg_hb2" @click="showPosterImg()">海报式推广</div>
        <div class="tg_lj" @click="getQrcode()">链接式推广</div>
    </div>
     <!--海报式推广的页面 start-->
      <div v-show="hbIsShow">
        <div class="link_zzc">
          <div class="hb_cons" v-show="hbConsShow">
            <div class="hb_cons_title">
              分享海报
              <span class="hb_cons_colse" @click="showPoster()">×</span>
            </div>

            <div class="hb_cons_list">
              <div v-for="(item,index) in imgUrl" @click="getCurPoster(index)">
                <img :src="item">
              </div>
            </div>
          </div>

          <productItem :src="curPoster"
                       v-if="productItemShow"
                       @hideState="hidePosterItem()"
                       @openSaveImg="saveImgFun()">

          </productItem>
        </div>
      </div>
      <!--海报式推广的页面 end  -->
    
      <!--链接式推广的页面 start-->
      <div v-show="linkIsShow">
        <div class="hb_zzc">
          <div class="link_cons">
            <i class="iconfont  icon-guanbi1 closeLink"
               @click="showLinsk()"></i>
            <img :src='urlImg+guideCon.pic'>
            <div class="ewm_box">
              <div id="qrcode" class="qrcode">

              </div>
            </div>
            <div class="linkIntroBox">
              <!--<p class="linkIntro">扫描二维码</p>-->
              <div class="linkGn">
                <span class="copyLink"
                      @click="copyLinkAction()"
                      :data-clipboard-text="linkInfo.url">复制链接</span>

                <span class="wxShare" @click="showWxPop">点击分享</span>
              </div>
              <div class="link_div">
                {{linkInfo.url}}
              </div>
            </div>

          </div>
        </div>
      </div>
   </div>
</template>

<script type="text/ecmascript-6">
  import productItem from '@/components/common/posterItem';
  import {selectTableInfo,selectTableInfoP} from '@/config/utils';
    import {loadmore,Toast,Indicator} from 'mint-ui';
  import Clipboard from 'clipboard';/*剪切板*/
  import { qrcanvas } from 'qrcanvas';
    export default{
      name: 'guideClass',
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
      components:{
      'productItem':productItem,
    },
      data: function () {
        return{
          guideCon:'',
          grade_id:'',//会员等级
          bannerId:'',
          shares:null,//定义标示分享
          linkInfo:{},//链接推广的链接
          linkIsShow:false,
          urlImg:process.env.API_HOST,//图片域名
          hbIsShow:false,
          imgUrl:[],
          hbConsShow:true,
          productItemShow:false,
          clickTime:0,
          indexImg:'',//海报图点击标示单张图片
          curPoster:null,
           ImgUrlState:true,//海报图点击标示单张图片点击一次防止重复点击
        }
      },
      methods: {
       //获取广告位详情
        async getClassDetails() {
          let acticleTxt = await selectTableInfo('banners/'+this.bannerId);
          this.guideCon = acticleTxt.data;
          this.sinaUrl();
        },
       //获取用户信息
        async getUserInfo() {
          let _userInfo = await selectTableInfo('members/'+ localStorage.getItem('member_id'));
          this.grade_id = _userInfo.data.grade_id;
        },
        //返回上一页
        goBack() {
          this.$router.go(-1);
        },
        //跳转
        showPosterImg: function (path) {
          if(path){
            this.$router.push(path);
          }else{
            this.clickTime ++;
            this.hbIsShow = !this.hbIsShow;
            if(this.clickTime < 2){
              this.showPosterFun();
            }
          }
            
        },
     //获取二维码海报
        async showPosterFun(){
          let _url=await selectTableInfo('systems/poster',{type:1,url: this.linkInfo.url});
          this.imgUrl.push(this.urlImg+_url.data.result);
        },
        //分享
        showWxPop() {
          // Toast({message:'复制下面的链接分享给你的好友就可以了哦~',duration:2500});

          // 通过系统组件分享
            let _that=this;
            if(this.shares!=null){//app
              plus.share.sendWithSystem({content:'贝化街加盟合伙人',href:this.linkInfo.url}, function(){
                console.log('分享成功');
              }, function(e){
                console.log('分享失败：'+JSON.stringify(e));
              });  
            }else{//h5
                this.$layer.dialog({
                  content:'此功能需要下载app呦!',
                  contentClass: 'className',
                  btn:['去下载','再看看'],
                  time: 20000
                })
                // 如果有btn
                .then(function (res){
                  // res为0时是用户点击了左边  为1时用户点击了右边
                  let position = res === 0 ? 'left' : 'right';
                  if(res == 0){
                    _that.$router.push('/appDownload');
                  }else{

                  }

                });
            }
        },
        //海报开启
      showPoster: function () {
        this.hbIsShow = !this.hbIsShow;
      },
      //点击单张海报保存相册
      saveImgFun(){
        if(this.shares!=null){//app
          let param={
            url:this.imgUrl[this.indexImg],
          }
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
            let _urlPath=param.url;
            let dtask = plus.downloader.createDownload(_urlPath, {}, function ( d, status ) {
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
         }else{
            alert(321);
         }
      },
      getCurPoster: function (index) {
        this.indexImg=index;
        this.curPoster = this.imgUrl[index];
        this. hbConsShow = !this.hbConsShow;
        this.productItemShow = !this.productItemShow;
      },
      hidePosterItem: function (state) {
        this.hbConsShow = !this.hbConsShow;
        this.productItemShow = !this.productItemShow;

      },

      //生成链接推广部分的二维码
      getQrcode:function () {
        if(this.grade_id<this.guideCon.grade_id){
          let _this = this;
          _this.$layer.dialog({
            title:['加盟合伙人', 'fontSize:0.6rem;color:#fff; background:#f7be6d;'],
            content: '您的权限还不足以查看该内容，请去升级~',
            contentClass: 'className',
            btn: ['再看看','去升级'],
            time: 20000
          })
            // 如果有btn
            .then(function (res){
              // res为0时是用户点击了左边  为1时用户点击了右边
              let position = res === 0 ? 'left' : 'right';
              if(res == 0){

              }else{
                _this.$router.push('/vip');
              }

            });
          return;
        }
        this.linkIsShow = !this.linkIsShow;
        //生成二维码
        var canvas1 = qrcanvas({
          data: decodeURIComponent(this.linkInfo.url),
          size:120,
        });
        document.getElementById("qrcode").innerHTML = '';
        document.getElementById('qrcode').appendChild(canvas1);
      },
          //复制链接的方法
      copyLinkAction: function () {
        let clipboard = new Clipboard(".copyLink");
        clipboard.on('success',e => {
          Toast({message:"复制成功",duration: 1500});
          this.showLinsk();
        });
        clipboard.on('error',e => {
          Toast({message:"复制失败哦,重新试试?",duration: 1500});
        });
      },

        //转换短连接
        async sinaUrl(){
            // var  _router =location.protocol+"//" +  window.location.host+'/payHtml?id='+this.guideCon.id;
            var  _router=this.guideCon.link;
            let param={
                url:_router,
            };
            let _url=await selectTableInfoP('systems/sind-url',param);
            this.linkInfo.url =_url.data.result;
        },
        showLinsk: function () {
          this.linkIsShow = !this.linkIsShow;
        },
      },
      mounted: function(){
        this.bannerId = this.$route.query.id;//获取传过来的参数
        this.getClassDetails();
        this.getUserInfo();
      }
    }
</script>

<style scoped>
.head{background: #fff;}
.head h1{font-weight: 500;font-size: 0.36rem;}
.guideClass{padding-bottom: 2rem;overflow: hidden;}
.guideCon{font-size: 0.26rem;line-height: 0.34rem;color: #333;overflow: hidden;}
.guideCon >>>img{max-width: 100%!important;height: auto;}
.tg_ways{display: flex;justify-content: space-around;position: fixed;width: 100%;bottom:1.2rem;left: 0;}
.tg_ways div{width: 40%;height: 0.6rem;border-radius: 0.6rem;color: #fff;font-size: 0.26rem;box-shadow: 1px 2px 10px #eb5856;text-align: center;line-height: 0.6rem;}
.tg_hb{background: linear-gradient(90deg,#ff6841,#ff8026);}
.tg_hb2{background: linear-gradient(90deg,#ef481e,#f77011);}
.tg_lj{background: linear-gradient(90deg,#f05a49,#ff2b71);}
.hb_zzc,.link_zzc{position: fixed;width: 100%;height: 100%;left: 0;top:0;background: rgba(0,0,0,0.5);display: flex;align-items: center;justify-content: center;z-index: 1000;}
.hb_cons{width: 80%;background: #e6e6e6;border-radius: 0.1rem;padding: 0.2rem 0.26rem;}
.hb_cons_title{font-size: 0.26rem;color: #333;font-weight: bold;text-align: center;position: relative;padding: 0.1rem 0 0.28rem 0;}
.hb_cons_colse{position: absolute;display: inline-block;background: #fff;color: #333;font-size: 0.4rem;border-radius: 0.2rem;width: 0.6rem;height: 0.36rem;text-align: center;font-weight: 500;line-height: 0.36rem;right:0;top:0;}
.hb_cons_list{display: flex;justify-content: space-between;flex-wrap: wrap;}
.hb_cons_list div{width: 48%;overflow: hidden;margin-bottom: 0.16rem;margin-left: 1.35rem;}
.hb_cons_list img{width: 100%;border-radius: 0.2rem;}
.closeLink{position: absolute;right:0.2rem;top:0.2rem;width: 0.6rem;height: 0.36rem;border-radius: 1rem;background: #eee;text-align: center;line-height: 0.36rem;font-size: 0.3rem;color: #000;font-weight: bold;}
.link_cons{width: 80%;border-radius: 0.2rem;background: #fff;position: relative;}
.link_cons>img{width: 100%;}
.ewm_box{width: 2.8rem;margin:0.4rem auto 0 auto;overflow: hidden;text-align: center;}
.ewm_box img{width: 100%;}
.linkIntroBox{padding: 0.2rem;}
.linkGn{display: flex;justify-content: space-around;}
.linkGn span{display: inline-block;width: 2.2rem;height: 0.8rem;border-radius: 0.5rem;font-size: 0.26rem;color: #fff;text-align: center;line-height: 0.8rem;}
.copyLink{background: linear-gradient(90deg,#FBC16F,#EDB767,#E8931A);}
.wxShare{background: linear-gradient(90deg,#E8931A,#EDB767,#FBC16F);}
.link_div{padding: 0.2rem;border-radius: 0.2rem;background: #f8f8f8;font-size: 0.26rem;color: #666;min-height: 1.2rem;margin-top: 0.4rem;}
</style>
