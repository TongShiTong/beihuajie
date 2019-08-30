<template>
 <div class="recommend">
   <div class="head" v-if="isSystemPage">
     <i class="iconfont icon-zuo" @click="goBack"></i>
     <h1>会员推广</h1>
     <i></i>
   </div>

   <div class="recommend01">
      <div class="newsLoop">
        <div class="newsBox">
          <img src="/static/images/recommend/icon_lb.png">
          <div>
            <news-loop :newItems="news">

            </news-loop>
          </div>
        </div>
        <!--<div class="curReward">-->
          <!--贝化街实时累计推荐奖励<i id="time">1215415</i>元-->
        <!--</div>-->

        <div class="curReward">
          贝化街实时累计推荐奖励<i id="time">{{countMoney.content}}</i>元
        </div>

      </div>
   </div>
   <div class="recommend02"></div>


   <div class="recommend05"></div>

   <div class="fixBottom">
     <div @click="showPosterImg()">海报分享</div>
     <div @click="getQrcode()">立即推荐</div>
   </div>

   <!--推广海报 + 推广链接-->
   <!--背景图和二维盒子-->
   <div class="hb_cons_list hb_cons_listBOX" style="transform: translateX(100%)">
     <div v-for="(item,index) in posters" class="creat-img" ref="box">
       <img :src="item" alt="分享背景图">
       <div :id="getDifId(index)" class="code"></div>
     </div>
   </div>

       <!--海报式推广的页面 start-->
   <div v-show="hbIsShow">
     <div class="link_zzc">
       <div class="hb_cons" v-if="hbConsShow">
         <div class="hb_cons_title">
           分享海报
           <span class="hb_cons_colse" @click="showPosters()">×</span>
         </div>

         <div class="hb_cons_list">
           <div v-for="(item,index) in imgUrl" @click="getCurPoster(index)">
             <img :src="item">
           </div>
         </div>


       </div>

       <poster-item :src="curPoster"
                    v-if="productItemShow"
                    @hideState="hidePosterItem()"
                    @openSaveImg="saveImgFun()">

       </poster-item>
     </div>
   </div>
   <!--海报式推广的页面 end  -->

   <!--链接式推广的页面 start-->
   <div v-show="linkIsShow">

     <div class="hb_zzc">
       <div class="link_cons">
         <i class="iconfont  icon-guanbi1 closeLink"
            @click="closeLinks(true)"></i>
         <img src="/static/images/product/tg_logo.png">
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
           <div class="link_div" id="link_div">

             {{linkInfo.url}}
           </div>
         </div>

       </div>
     </div>
   </div>
   <!--链接式推广的页面 end  -->

 </div>
</template>

<script>
  import NewsLoop from '@/components/common/newsLoop';
  import {selectTableInfo,selectTableInfoP} from '@/config/utils';
  import { qrcanvas } from 'qrcanvas';
  import html2canvas from 'html2canvas';
  import PosterItem from '@/components/common/posterItem';
  import tgPop from '@/components/common/tgPop';
  import {Toast,Indicator} from 'mint-ui';
  import Clipboard from 'clipboard';/*剪切板*/
  import axios from 'axios';
  var news = ['尾号2607的用户，获得了10840.99元现金~','尾号5807的用户，获得了666元现金~'];
  var posters = [
    '/static/poster/invite_img/invite01.png',
    '/static/poster/invite_img/invite02.png',
    '/static/poster/invite_img/invite03.png',
    '/static/poster/invite_img/invite04.png',
  ];
  export default{
      name: 'recommend',
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
      components: {
        PosterItem: PosterItem,
        NewsLoop:NewsLoop,
        tgPop:tgPop
      },
      data: function () {
        return {
          news:[],
          hbIsShow:false,
          hbConsShow:true,
          linkIsShow:false,
          productItemShow:false,
          curPoster:null,
          posterConsShow:true,
          isShowCurPoster:false,
          posters:posters,
          pageNum:0,
          linkInfo:{},
          timer:null,
          countCustomer:{},//统计当前用户的直接和间接客户
          customerReward:{},//佣金奖励
          clickTime:0,
          imgUrl:[],
          shares:null,//定义标示分享
          indexImg:'',//海报图点击标示单张图片
          ImgUrlState:true,//海报图点击标示单张图片点击一次防止重复点击
          countMoney:0,//平台发放总金额
          num:240,
          finaNum:0,
          isSystemPage:true
        }
      },
      methods: {
        //返回上一页
        goBack() {
          this.$router.go(-1);
        },
        showPosters: function () {
          this.hbIsShow = !this.hbIsShow;
        },
        closePosters: function (isShow) {
          this.hbIsShow = !isShow;
        },
        closeLinks: function (isShow) {
          this.linkIsShow = !isShow;
        },

         //分享
      showWxPop() {
        // Toast({message:'复制下面的链接分享给你的好友就可以了哦~',duration:2500});

        // 通过系统组件分享
          let _that=this;
          if(this.shares!=null){//app
              plus.share.sendWithSystem({content:'一起来贝化街',href:this.linkInfo.url}, function(){
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
              axios({
                  method:'post',
                  url:process.env.API_HOST+'api.php/systems/create-poster',
                  data:param,
                  headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
                  timeout:20000,
                  transformRequest: function(obj) {
                      var str = [];
                      for(var p in obj){
                          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                      }
                      return str.join("&");
                  }
              }).then((res)=>{
                if(res.data.status==200){
                  let _urlPath=process.env.API_HOST+res.data.result;
                  console.log(_urlPath);
                  let paramPath={
                    url:res.data.result,
                  }
                  let dtask = plus.downloader.createDownload(_urlPath, {}, function ( d, status ) {
                    if (status == 200 ) {
                        plus.gallery.save( d.filename, function(){
                            _that.ImgUrlState=true;
                            plus.nativeUI.toast('保存成功');
                            _that.delImgUrl(paramPath);
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
                  _that.ImgUrlState=true;
                  alert('数据出错,联系管理员');
                }
              }).catch(function(error){
                _that.ImgUrlState=true;
                alert('网络请求超时,请重新点击保存,或者到网速开的地方保存');
                Indicator.close();
              });
          }
        },
        //删除区域
        async delImgUrl(param) {
          await selectTableInfoP('systems/del-poster',param);
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
        getDifId: function (index) {
          return 'code_'+ index;
        },

        showPosterImg: function () {
          this.clickTime ++;
          this.hbIsShow = !this.hbIsShow;
          if(this.clickTime < 2){
            for(var i =0;i< this.posters.length;i++){
              this.showPosterFun(i);
            }
          }

        },

        //生成二维码海报
        showPosterFun: function (id) {
          let _id = this.getDifId(id);
          //生成二维码
          if(id==0){
            var canvas2 = qrcanvas({
              data: decodeURIComponent( this.linkInfo.url ),
              size:40,
            });
          }else{
            var canvas2 = qrcanvas({
              data: decodeURIComponent( this.linkInfo.url ),
              size:40,
            });
          }

          document.getElementById(_id).innerHTML = '';
          document.getElementById(_id).appendChild(canvas2);
          if(id==0){
            document.getElementById(_id).setAttribute('style','position: absolute;bottom: 0.92rem;left: 1.54rem;');
          }else{
            document.getElementById(_id).setAttribute('style','position: absolute;bottom: 0.16rem;left: 0.2rem;');
          }

          let that = this;
          html2canvas(that.$refs.box[id],{backgroundColor: null}).then(function(canvas) {
            that.imgUrl.push((canvas.toDataURL()))

          });

        },

      //base64转blob
        base64ToBlob(code) {
          let parts = code.split(';base64,');
          let contentType = parts[0].split(':')[1];
          let raw = window.atob(parts[1]);
          let rawLength = raw.length;

          let uInt8Array = new Uint8Array(rawLength);

          for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
          }
          return new Blob([uInt8Array], {type: contentType});
        },



      //实时收入展示
        async getRealTimeDataOne() {
          let _this = this;
          let param = {pageSize:20};
          let _realTimeDataOne = await selectTableInfo('products/real-time',param);
          if(_realTimeDataOne.data.length < 1){ //如果当前页返回的数据长度为0,则表示没有更多数据,重置page值为0
            _this.pageNum = 0;
          }
          let newsArr = [];
          for(var i=0;i<_realTimeDataOne.data.length;i++){
            let pho = _realTimeDataOne.data[i].tel.substring(_realTimeDataOne.data[i].tel.length - 4);
            let income = Math.floor(Math.random()*97000) + 3000;
            let str = '尾号为'+ pho + '的用户,总获得金额:<span style="color:#f4fc1f">'+income+'</span>元';
            newsArr.push(str);
          }
          _this.news = newsArr;
          // console.log( _this.news);
        },
        //统计当前用户的直接和间接客户
        async getUserCustomer() {
          let _userInfo = await selectTableInfo('members/count-customer?mid='+ localStorage.getItem('member_id'));
          this.countCustomer = _userInfo.data;
        },
        //统计当前用户的直接和间接客户佣金奖励
        async getCustomerReward() {
          let _customerReward = await selectTableInfo('members/count-money?mid='+ localStorage.getItem('member_id'));
          this.customerReward = _customerReward.data;
        },
        //生成链接推广部分的二维码
        getQrcode:function () {
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
            this.closeLinks(true);
          });
          clipboard.on('error',e => {
            Toast({message:"复制失败哦,重新试试?",duration: 1500});
          });
        },
         //转换短连接
        async sinaUrl(){
          var  _router =location.protocol+"//" + window.location.host +'/invite?uid=' + localStorage.getItem('member_id');
          let param={
              url:_router,
          };
          let _url=await selectTableInfoP('systems/sind-url',param);
          this.linkInfo.url =_url.data.result;
        },
         //统计平台发放金额
        async getUserCount() {
          let _userInfo = await selectTableInfo('systems/54');
          this.countMoney = _userInfo.data;
        },
       //数字自增到某一值动画参数（目标元素,自定义配置）
//        NumAutoPlusAnimation:function(targetEle, options){
//            /*可以自己改造下传入的参数，按照自己的需求和喜好封装该函数*/
//            //不传配置就把它绑定在相应html元素的data-xxxx属性上吧
//            options = options || {};
//
//            var $this = document.getElementById(targetEle),
//              time = options.time || $this.data('time'), //总时间--毫秒为单位
//              finalNum = (options.num*1000) || $this.data('value'), //要显示的真实数值
//              regulator = options.regulator || 100, //调速器，改变regulator的数值可以调节数字改变的速度
//              step = finalNum / (time / regulator),/*每30ms增加的数值--*/
//              count = options.num, //计数器
//              initial = 0;
//            var timer = setInterval(function() {
//
//              count = count + step;
//
//              if(count >= finalNum) {
//                clearInterval(timer);
//                count = finalNum;
//              }
//              //t未发生改变的话就直接返回
//              //避免调用text函数，提高DOM性能
//              var t = Math.floor(count);
//              if(t == initial) return;
//
//              initial = t;
//
//              $this.innerHTML = initial;
//            }, 30);
//        },
      },
      mounted: function() {
          this.getRealTimeDataOne();
          this.getUserCustomer();
          this.getCustomerReward();
          this.sinaUrl();
          this.getUserCount();

          //判断推广外页和系统内页
          if(this.$route.query.uid==undefined||this.$route.query.uid == ''){
            this.isSystemPage=true;
          }else{
            this.isSystemPage=false;
          };


          if(localStorage.getItem('cc')<=2001402){
            this.num =2001402;
          }else{
            this.num= parseInt(localStorage.getItem('cc'));
          }

          var _this = this;
          setInterval(function () {
            let _step = Math.floor(Math.random() * 200);
            _this.num = _this.num + _step;
            if(_this.num > 50000000){
              _this.num = 50000000;
            }

          },1000);

      },

      beforeRouteLeave (to ,from ,next) {
        localStorage.setItem('cc',this.num);

         next();
      }


    }
</script>

<style scoped>
.head{background: rgb(252, 228, 203);}
.recommend{overflow: hidden;position: relative;}
.recommend img{width: 100%;}
.recommend01{background: url("/static/images/recommend/recommend01.png") no-repeat;background-size: 100%;height: 6.5rem;padding: 4.5rem 0.8rem 0 0.8rem;}
.recommend02{background: url("/static/images/recommend/recommend02.png") no-repeat;background-size: 100%;height: 14rem;}
.recommend05{background: url("/static/images/recommend/recommend03.png") no-repeat;background-size: 100%;height: 5.8rem;margin-bottom: 1.2rem;}
.newsLoop{height: 1.6rem;border-radius: 0.1rem;padding: 0.1rem;}
.newsBox{display: flex;align-items: center;margin-bottom: 0.1rem;overflow: hidden;}
.newsLoop img{width: 0.3rem;}
.curReward{border: 1px dashed #ec4036;font-size: 0.3rem;color: #ec4036;line-height: 0.46rem;padding: 0 0.1rem;text-align: center;border-radius: 0.1rem;}
.curReward i{color: #f4fc1f;}
.yjInfo{padding:0.6rem;background: #fce4cb;}
.yjInfo01{display: flex;align-items: center;box-shadow: inset 0.00133rem 0 0.53rem rgba(249,200,151,1);}
.yjInfo01>div{width: 50%;text-align: center;padding: 0.4rem 0;}
.yjInfo01 h1{font-size: 0.2rem;color:rgba(0,0,0,.7);}
.yjInfo01 p{font-size: 0.28rem;color: #000;margin: 0.2rem 0;}
.yjInfo01 h2{font-size: 0.2rem;color: #9e5843;}
.yjInfo01 span{width: 1px;height: 0.4rem;background: #999;}
.regs{height: 0.8rem;border: solid #ec4036;border-radius: .54rem;cursor: pointer;border-width: 0 .04rem .09rem;font-size: .34rem; line-height: 0.8rem;color: #ffdeba;text-align: center;background-color: #fa6a62;margin-bottom: 0.6rem;position: relative;}
.regStyle01{position: absolute;top:0.1rem;left: 0.3rem;width: 0.1rem;height: 0.06rem;border-radius: 1rem;background: rgba(255,218,160,.8);}
.regStyle02{position: absolute;top:0.1rem;left: 0.5rem;width: 0.6rem;height: 0.06rem;border-radius:1rem;background: rgba(255,218,160,.8);}
.fixBottom{position: fixed;width: 100%;height: 1rem;left: 0;bottom: 0;display: flex;}
.fixBottom div{width: 50%;text-align: center;line-height: 1rem;color: #fff;font-size: 0.32rem;}
.fixBottom div:nth-child(1){background: #f5b73c;}
.fixBottom div:nth-child(2){background: #f1604e;}
.hb_zzc,.link_zzc{position: fixed;width: 100%;height: 100%;left: 0;top:0;background: rgba(0,0,0,0.5);display: flex;align-items: center;justify-content: center;z-index: 1000;}
.qrcode{text-align: center;}
.hb_cons{width: 80%;background: #e6e6e6;border-radius: 0.1rem;padding: 0.2rem 0.26rem;}
.hb_cons_title{font-size: 0.26rem;color: #333;font-weight: bold;text-align: center;position: relative;padding: 0.1rem 0 0.28rem 0;}
.hb_cons_colse{position: absolute;display: inline-block;background: #fff;color: #333;font-size: 0.4rem;border-radius: 0.2rem;width: 0.6rem;height: 0.36rem;text-align: center;font-weight: 500;line-height: 0.36rem;right:0;top:0;}
.hb_cons_list{display: flex;justify-content: space-between;flex-wrap: wrap;margin-top:0.2rem;}
.hb_cons_list>div{width: 48%;overflow: hidden;margin-bottom: 0.16rem;}
.hb_cons_list img{width: 100%;border-radius: 0.2rem;}
.creat-img{position: relative;}
.code{position: absolute;bottom: 0.1rem;left: 0.1rem;}

.link_cons{width: 80%;border-radius: 0.2rem;background: #fff;position: relative;}
.closeLink{position: absolute;right:0.2rem;top:0.2rem;width: 0.6rem;height: 0.36rem;border-radius: 1rem;background: #eee;text-align: center;line-height: 0.36rem;font-size: 0.3rem;color: #000;font-weight: bold;}
.link_cons>img{width: 100%;}
.ewm_box{width: 2.8rem;margin:0.4rem auto 0 auto;overflow: hidden;}
.ewm_box img{width: 100%;}
.linkIntro{font-size: 0.22rem;color: #f4b73c;text-align: center;margin: 0.2rem 0 0.4rem 0;}
.linkGn{display: flex;justify-content: space-around;}
.linkGn span{display: inline-block;width: 2.2rem;height: 0.8rem;border-radius: 0.5rem;font-size: 0.26rem;color: #fff;text-align: center;line-height: 0.8rem;}
.link_div{padding: 0.2rem;border-radius: 0.2rem;background: #f8f8f8;font-size: 0.26rem;color: #666;min-height: 1.2rem;margin-top: 0.4rem;}
.copyLink{background: linear-gradient(90deg,#f2593a,#f3682c,#f46f25);}
.wxShare{background: linear-gradient(90deg,#f2544e,#f8405f,#fd326b);}
.linkIntroBox{padding: 0.2rem;}
.hb_cons_listBOX{position: fixed;top:0;}
</style>
