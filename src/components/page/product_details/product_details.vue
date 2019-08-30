<template>
  <div class="prduct_details">

    <div class="head" v-if="isSystemPageSm">
      <i class="iconfont icon-zuo" @click="goBack"></i>
      <h1>{{productDetails.name}}</h1>
      <i></i>
    </div>

    <remote-js src="http://pv.sohu.com/cityjson?ie=utf-8"> </remote-js>

    <div class="part1">
      <div class="part1Up">
        <div class="part1Up_left">
          <div class="goodImg">
            <img :src="urlImg+productDetails.thumb">
          </div>
          <p class="goodName">{{productDetails.name}}</p>
        </div>
        <span class="goodMans">申请人数：{{productDetails.apply_num}}</span>
      </div>

      <p class="goodRangeP" v-if="productDetails.max_money!=0">额度范围(元)</p>
      <h2 class="goodRange" v-if="productDetails.max_money!=0">{{productDetails.min_money +' ~ '+ productDetails.max_money}}</h2>

      <div class="goodAdvs">
        <p v-for="item in productDetails.label">
          {{item}}
        </p>
      </div>
    </div>

    <div class="part2">
      <div class="part2_left">
        <h1><i>{{parseInt(productDetails.loan_success * productDetails.apply_num * 0.01)}}</i>人</h1>
        <p>已成功申请&nbsp;&nbsp;  通过率：{{productDetails.loan_success}}%</p>
      </div>

    </div>

    <div class="applyConditions" id="cons">
      <div class="condition">
        <div class="title">
          <img src="/static/images/productDetails/num1.png">
          申请条件
        </div>
        <div class="cons" v-html="productDetails.apply_condition">

        </div>
      </div>

      <div class="condition">
        <div class="title">
          <img src="/static/images/productDetails/num2.png">
          申请详情介绍
        </div>
        <div class="cons" v-html="productDetails.apply_process">

        </div>
      </div>
    </div>

    <!--系统内页:显示三个按钮-->
    <div class="footCz" v-if="isSystemPage">
      <div class="jk" @click="goLoan()">
        <img src="/static/images/productDetails/icon_card.png">
        <p>{{productDetails.background != null  ? '我要办卡' : (dis ==1?'我要查询':'我要借款')}}</p>
      </div>

      <div class="wenan" @click="copyLinkWenan()"
                     data-clipboard-target="#cons">推广文案</div>
      <div class="link_tg" @click="getQrcode()">链接式推广</div>

      <div class="poster_tg" @click="showPosterImg()">海报式推广</div>
    </div>

    <!--推广出去的页面:只显示一个我要借款按钮-->
    <div class="footCz footCzOne" v-if="!isSystemPage">
      <div class="jkOne" @click="goLoan()">
        <img src="/static/images/productDetails/icon_card.png">
        <p>{{productDetails.background != null  ? '我要办卡' : (dis ==1?'我要查询':'我要借款')}}</p>
      </div>
    </div>

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
            <span class="hb_cons_colse" @click="showPoster()">×</span>
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
             @click="showLinsk()"></i>
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

    <!--点击我要借款 start-->
    <div v-if="infoZzcShow">
      <div class="infoZzc">
        <div class="infoCons">
          <span class="closeInfo" @click="goLoan()">×</span>
          <form class="infoForm">
            <h1>基本信息</h1>

            <div>
              <label>姓名</label><br>
              <input type="text" placeholder="请输入您的姓名" v-model="mansInfo.name"/>
            </div>

            <div>
              <label>手机号</label><br>
              <input type="tel" placeholder="请输入您的手机号" v-model="mansInfo.tel"/>
            </div>

            <div>
              <label>身份证号</label><br>
              <input type="text" placeholder="请输入您的身份证号" v-model="mansInfo.idcart"/>
            </div>
            
            <label style="color: #666;" for="checkbox"><input type="checkbox" id="checkbox" v-model="checked">我同意领取免费赠送的百万意外出行保障，并已阅读及同意 
              <a style="color: #597ff1;" href="https://www.yyang.net.cn/api/document/gi_activity_rule">活动规则</a> 
              和
              <a style="color: #597ff1;" href="https://www.yyang.net.cn/api/document/gi_safe_term">《信息安全条款》</a> 
              </label>
            <input type="button"
                   value="下一步"
                   @click="handleApply()"/>

            <p>
              信息务必填写准确，填写完请在30分钟内完成<br>
              申请，否则会影响申请的成功率！
            </p>
          </form>
        </div>
      </div>
    </div>
    <!--点击我要借款 end  -->

    <div style="height:1.2rem"></div>

  </div>
</template>

<script type="text/ecmascript-6">
  import PosterItem from '@/components/common/posterItem';
  import {selectTableInfo,selectTableInfoP} from '@/config/utils';
  import {getMoreFields,getDeviceType,getCurIp} from '@/../static/js/function.js';
  import axios from 'axios';
  import {Toast,Indicator} from 'mint-ui';
  import Clipboard from 'clipboard';/*剪切板*/
  import { qrcanvas } from 'qrcanvas';
  import html2canvas from 'html2canvas';
  var posters = [
    '/static/poster/product_img/product01.png',
    '/static/poster/product_img/product02.png',
    '/static/poster/product_img/product03.png',
    '/static/poster/product_img/product04.png',
  ];

  export default {
    name: 'product_details',
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
      PosterItem: PosterItem,
      'remote-js': {
        render(createElement) {
          return createElement('script', { attrs: { type: 'text/javascript', src: this.src }});
        },
        props: {
          src: { type: String, required: true },
        },
      },
    },
    data: function () {
      return{
        isSystemPage:true,//是不是系统内页
        posters:posters,
        hbIsShow:false,
        linkIsShow:false,
        infoZzcShow:false,
        hbConsShow:true,
        productItemShow:false,
        linkInfo:{},
        curPoster:null,
        productId:0,//产品id
        productDetails:{},//产品详情信息
        mansInfo:{},//申请人信息
        uid:0,//用户ID
        phone_system:'',//设备类型
        ip:'',//用户当前ip
        imgUrl:[],
        clickTime:0,//限制生成海报的张数
        grade_id:'',//会员等级 1普通会员 17合伙人  18信贷经理  19 团队经理  20城市经理
        isBank:'',//0=>不是信用卡 1=>是
        urlImg:process.env.API_HOST,//图片域名
        shares:null,//定义标示分享
        indexImg:'',//海报图点击标示单张图片
        ImgUrlState:true,//海报图点击标示单张图片点击一次防止重复点击
        isSystemPageSm:true,
        dis:'',
        checked:true,
      }
    },

    methods: {
      //获取用户会员等级
      async getUserInfo() {
        let _userInfo = await selectTableInfo('members/'+ localStorage.getItem('member_id'));
        this.grade_id = _userInfo.data.grade_id;
      },
      //获取产品详情
      async getProductDetails() {
        let _productDetails = await selectTableInfo('products/' + this.productId);
        this.productDetails = _productDetails.data;
      },
      showPoster: function () {
        this.hbIsShow = !this.hbIsShow;
//        hbConsShow
      },
      showLinsk: function () {
        this.linkIsShow = !this.linkIsShow;
      },
      goLoan: function () {
        this.infoZzcShow = !this.infoZzcShow;
      },
      getCurPoster: function (index) {
        this.indexImg=index;
        this.curPoster = this.imgUrl[index];
        this. hbConsShow = !this.hbConsShow;
        this.productItemShow = !this.productItemShow;
      },
      hidePosterItem: function () {
        this.hbConsShow = !this.hbConsShow;
        this.productItemShow = !this.productItemShow;
      },
      //返回上一页
      goBack() {
        this.$router.go(-1);
      },
      getDifId: function (index) {
        return 'code_'+ index;
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

      showPosterImg: function () {
        if(this.grade_id == 1){
          let _this = this;
          _this.$layer.dialog({

            content: '您还没有完成身份认证不能成为信贷经理去推广，请先完成身份证认证',
            contentClass: 'className',
            btn: ['再看看','去身份认证'],
            time: 20000
          })
            // 如果有btn
            .then(function (res){
              // res为0时是用户点击了左边  为1时用户点击了右边
              let position = res === 0 ? 'left' : 'right';
              if(res == 0){

              }else{
                // _this.$router.push('/vip');
                _this.$router.push('/idCard');
              }

            });
          return;
        }
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
        }else
        if(id==3){
          var canvas2 = qrcanvas({
            data: decodeURIComponent( this.linkInfo.url ),
            size:70,
          });
        }else{
          var canvas2 = qrcanvas({
            data: decodeURIComponent( this.linkInfo.url ),
            size:88,
          });
        }


        document.getElementById(_id).innerHTML = '';
        document.getElementById(_id).appendChild(canvas2);
        if(id==0){
          document.getElementById(_id).setAttribute('style','position: absolute;bottom: 2.14rem;left: 1.4rem;');
        }
        if(id==2||id==1){
          document.getElementById(_id).setAttribute('style','position: absolute;bottom: 1.2rem;left: 0.94rem;');
        }
        if(id==3){
          document.getElementById(_id).setAttribute('style','position: absolute;bottom: 0.78rem;left: 1.1rem;');
        }


        let that = this;
        html2canvas(that.$refs.box[id],{backgroundColor: null}).then(function(canvas) {
//          that.imgUrl.push(URL.createObjectURL(that.base64ToBlob(canvas.toDataURL('image/png'))))

          that.imgUrl.push((canvas.toDataURL('image/png')))

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


      //生成链接推广部分的二维码
      getQrcode:function () {
        if(this.grade_id == 1){
          let _this = this;
          _this.$layer.dialog({

            content: '您还没有完成身份认证不能成为信贷经理去推广，请先完成身份证认证',
            contentClass: 'className',
            btn: ['再看看','去身份认证'],
            time: 20000
          })
            // 如果有btn
            .then(function (res){
              // res为0时是用户点击了左边  为1时用户点击了右边
              let position = res === 0 ? 'left' : 'right';
              if(res == 0){

              }else{
                // _this.$router.push('/vip');
                _this.$router.push('/idCard');
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
      copyLinkWenan: function () {
        let clipboard = new Clipboard(".wenan");
        clipboard.on('success',e => {
          Toast({message:"复制成功",duration: 1500});
          // this.showLinsk();
        });
        clipboard.on('error',e => {
          Toast({message:"复制失败哦,重新试试?",duration: 1500});
        });
      },
      //获取设备类型
      getDeviceInfo: function () {
        this.phone_system = getDeviceType();
      },
      //获取ip
      getCurIpInfo: function () {
        this.ip = getCurIp();
      },

      //获取申请人的信息
      async getMansInfo(param) {
        let result  = await selectTableInfoP('dai-records/sub-product',param);
        if(result.data.url){
          // this.$router.push({
          //   path:'/thirdPage',
          //   query:{url:result.data.url,id:this.productId}
          // });
          location.href = result.data.url;
        }else{
          Toast({message:"未设置三方链接,联系客服",duration: 1500});
        }

      },
      //提交用户信息
      handleApply: function () {
        this.getDeviceInfo();//设备类型
        this.getCurIpInfo();//用户ip
        let nameReg = /^[\u4E00-\u9FA5A-Za-z]{2,10}$/;//姓名的正则
        let idCardReg = /^[1-9]\d{16}[0-9Xx]$/;//身份证号的正则
        let telReg = /^1(3|4|5|7|8|9)\d{9}$/; //手机的正则
        let param = {};
        if(!nameReg.test(this.mansInfo.name) || !this.mansInfo.name){
          Toast({message:"请输入正确的姓名",duration: 1500});
        }else if(!telReg.test(this.mansInfo.tel)){
          Toast({message:"请输入正确的手机号",duration: 1500});
        }else if(!idCardReg.test(this.mansInfo.idcart)){
          Toast({message:"请输入正确的身份证号",duration: 1500});
        }else{
          param = {
            tel:this.mansInfo.tel,
            name:this.mansInfo.name,
            idcart:this.mansInfo.idcart,
            tid:this.uid,
            pid:this.productId,
            phone_system:this.phone_system,
            ip:this.ip,
            checked:this.checked
          };
          this.getMansInfo(param);
        }

      },
      //转换短连接
      async sinaUrl(){
        var  _router =location.protocol+"//" + window.location.host +'/product_details?pid='+this.productId+'&uid='+this.uid+'&dis='+this.dis;
        let param={
            url:_router,
        };
        let _url=await selectTableInfoP('systems/sind-url',param);
        this.linkInfo.url =_url.data.result;
      },

    },

    mounted: function () {
      this.getUserInfo();
      this.isBank = parseInt(this.$route.query.isBank);
      this.productId = this.$route.query.pid;
      if(this.$route.query.dis!="" && this.$route.query.dis!==undefined){
          this.dis = 1;
      }
      //判断推广外页和系统内页
      if(this.$route.query.uid==''){
        this.isSystemPage = true;
        this.uid = localStorage.getItem('member_id');
        this.sinaUrl();
      }else{
        this.isSystemPage = false;
        this.uid = this.$route.query.uid;
      }
      if(this.$route.query.sm !=''){
          this.isSystemPageSm = false;
      }
      this.getProductDetails();

    }
  }
</script>

<style scoped>
  .prduct_details{overflow: hidden;}
  .part1{width: 100%;height: 3rem;background: url("/static/images/productDetails/bg_product.png") no-repeat;background-size: 100% auto;padding: 0.2rem 0.36rem;}
  .part1Up{display: flex;align-items: center;justify-content:space-between;}
  .part1Up_left{display: flex;align-items: center;}
  .goodImg{width: 0.68rem;height: 0.68rem;border-radius: 0.1rem;overflow: hidden;margin-right: 0.2rem;}
  .goodImg img{width: 100%;}
  .goodName{font-size: 0.26rem;color: #333;}
  .goodMans{font-size: 0.24rem;color: #fff;border: 1px solid #fff;transform: skew(-16deg);padding: 0.04rem;}
  .goodName{font-size: 0.26rem;color: #fff;}
  .goodRangeP{color:#fce3df;font-size: 0.24rem;text-align: center;margin: 0.2rem 0;}
  .goodRange{font-size: 0.52rem;color: #fff;text-align: center;margin-bottom: 0.4rem;}
  .goodAdvs{display: flex;justify-content: space-around;overflow: hidden;}
  .goodAdvs p{font-size: 0.26rem;color: #fff;height: 0.26rem;overflow: hidden;line-height: 0.26rem;}
  .part2{display: flex;justify-content: space-between;align-items: center;background: #fff;padding:0.4rem  0.2rem;}
  .part2_left h1{font-size: 0.26rem;color: #f1604e;margin-bottom: 0.16rem;}
  .part2_left h1 i{font-size: 0.56rem;}
  .part2_left p{font-size: 0.24rem;color: #333;}
  .part2_right{display: flex;align-items: flex-start;}
  .part2_right span{background: #ff8d90 url("/static/images/productDetails/icon_xu.png") no-repeat 0.1rem center;font-size: 0.24rem;color: #fff;display: inline-block;padding: 0.1rem 0.1rem 0.1rem 0.56rem;background-size: 0.32rem auto;border-radius: 0.06rem;}
  .part2_right img{width: 1rem;}
  .condition{background: #fff;padding: 0.26rem;margin-top: 0.12rem;}
  .title{display: flex;align-items: flex-end;font-size: 0.26rem;color: #333;font-weight: bold;}
  .title img{width: 0.4rem;margin-right: 0.2rem;}
  .cons{font-size: 0.26rem;color: #333;line-height: 0.46rem;padding-left: 0.6rem;padding-top: 0.2rem;}
  .footCz{position: fixed;width: 100%;height: 0.88rem;left: 0;bottom:0;background: #fff;display: flex;}
  .footCzOne{height: 1rem;}
  .jk{width: 40%;text-align: center;display:flex;flex-direction: column;align-items: center;justify-content: center;}
  .jkOne{width: 100%;text-align: center;display:flex;flex-direction: column;align-items: center;justify-content: center;}
  .jkOne p{font-size: 0.23rem;}
  .jkOne img{height: 0.34rem;margin-bottom: 0.1rem;}
  .jk p{font-size: 0.23rem;}
  .jk img{height: 0.34rem;margin-bottom: 0.1rem;}
  .wenan{width: 30%;text-align: center;background: #F4BAAB;color: #fff;font-size: 0.28rem;line-height: 0.88rem;}
  .link_tg{width: 30%;text-align: center;background: #f4b73c;color: #fff;font-size: 0.28rem;line-height: 0.88rem;}
  .poster_tg{width: 30%;text-align: center;background: #f1604e;color: #fff;font-size: 0.28rem;line-height: 0.88rem;}
  .hb_zzc,.link_zzc{position: fixed;width: 100%;height: 100%;left: 0;top:0;background: rgba(0,0,0,0.5);display: flex;align-items: center;justify-content: center;z-index: 1000;}
  .qrcode{text-align: center;}
  .hb_cons{width: 80%;background: #e6e6e6;border-radius: 0.1rem;padding: 0.2rem 0.26rem;}
  .hb_cons_title{font-size: 0.26rem;color: #333;font-weight: bold;text-align: center;position: relative;padding: 0.1rem 0 0.28rem 0;}
  .hb_cons_colse{position: absolute;display: inline-block;background: #fff;color: #333;font-size: 0.4rem;border-radius: 0.2rem;width: 0.6rem;height: 0.36rem;text-align: center;font-weight: 500;line-height: 0.36rem;right:0;top:0;}
  .hb_cons_list{display: flex;justify-content: space-between;flex-wrap: wrap;margin-top:0.2rem;}
  .hb_cons_list>div{width: 48%;overflow: hidden;margin-bottom: 0.16rem;}
  .hb_cons_list img{width: 100%;border-radius: 0.2rem;}


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

  .infoZzc{position: fixed;width: 100%;height: 100%;left: 0;top:0;background: rgba(0,0,0,0.5);display: flex;align-items: center;justify-content: center;}
  .infoCons{width: 80%;padding:0.6rem 0.4rem;background: #fff;border-radius: 0.2rem;position: relative;}
  .closeInfo{position: absolute;right:0.2rem;top:0;font-size: 0.8rem;color: #ccc;}
  .infoForm>h1{font-size: 0.28rem;color: #333;text-align: center;border-bottom: 1px dashed #eee;padding-bottom: 0.4rem;}
  .infoForm label{font-size: 0.26rem;color:#fd326b; }
  .infoForm div input{border: none;border-bottom: 1px solid #eee;font-size: 0.28rem;color: #333;padding-bottom: 0.2rem;width: 100%;}
  .infoForm>input{display: block;width: 3.6rem;height: 0.8rem;background: linear-gradient(90deg,#f2544e,#fd326b);border-radius: 0.5rem;color: #fff;margin:0.4rem auto 0.2rem auto;}
  /* .disab{background: #999 !important;} */
  .infoForm>p{font-size: 0.24rem;color: #f4b73c;text-align: center;line-height: 0.32rem;}
  .creat-img{position: relative;}
  .code{position: absolute;bottom: 0.1rem;left: 0.1rem;}
  .hb_cons_listBOX{position: fixed;top:0;}
</style>
