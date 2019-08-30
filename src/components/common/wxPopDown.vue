<template>
  <div class="wxPop">
    <div class="zzc" v-if="showWx">
      <div class="wxCons">
        <i class="iconfont icon-guanbi1 closeZzc"
           @click="closeWxZzx()"></i>
        <div class="wxConsTop">

          <div class="wxConsTopLeft">
            <div class="wxConsBottom">
              <img :src="urlImg+wxCode.content">
            </div>

            <div class="wxLeftTxt">
              服务时间:周一至周日<br>
              早上9:30~20:00
            </div>
          </div>


          <div class="wxConsTopRight">
            <div class="wxRightH1">
              <span></span>
              请添加业务专员为您一对一服务
              <span></span>
            </div>
            <p class="wxRightP01">为您随时解答产品问题</p>

            <div class="wxRightBox">
              <p>微信号:{{wxNum.content}}</p>
              <span
                class="copyLink"
                @click="copyLinkAction()"
                :data-clipboard-text="wxNum.content"
                >复制</span>
            </div>

            <a class="wxRightBox" :href="'tel:' + hotLine.content ">
              <p>服务热线:{{hotLine.content}}</p>
              <span><i class="iconfont icon-shouji"></i></span>
            </a>
          </div>


        </div>

        <img :src="banner.pic?urlImg+banner.pic:'/static/images/me/wxPopImgg.png'" class="wxPopImg"  @click="goPath('/wyHtml?id='+banner.id)">

      </div>
    </div>
  </div>

</template>

<script>
    import Clipboard from 'clipboard';/*剪切板*/
    import {Toast} from 'mint-ui';
    import {selectTableInfo} from '@/config/utils';
    export default{
      name:'wxPop',
      props:['showWx'],
      data: function () {
        return {
          wxNum:'', //微信号
          wxCode:'',//微信二维码
          logoImg:'',//网站logo
          hotLine:'',//客服热线
          systemTitle:'',//取系统标题
          urlImg:process.env.API_HOST,//图片域名
          banner:'',//广告为信息
        }
      },
      methods: {
        //复制链接的方法
        copyLinkAction: function () {
          let clipboard = new Clipboard(".copyLink");
          clipboard.on('success',e => {
            Toast({message:"复制成功",duration: 1500});
           });
          clipboard.on('error',e => {
            Toast({message:"复制失败哦,重新试试?",duration: 1500});
          });
        },

        //获取微信号
        async getWxNum() {
          let _wxNum = await selectTableInfo('systems/37');
          this.wxNum = _wxNum.data;
        },

       //获取客服热线
        async getHotLine() {
          let _hotLine = await selectTableInfo('systems/17');
          this.hotLine = _hotLine.data;
        },

        async getWxCode() {
          let _wxCode = await selectTableInfo('systems/22');
          this.wxCode = _wxCode.data;
        },
        //获取网站logo
        async getWebLogo() {
          let _logo = await selectTableInfo('systems/21');
          this.logoImg = _logo.data.content;
        },
        //获取系统标题
        async getSystemTitle() {
          let _systemTitle = await selectTableInfo('systems/1');
          this.systemTitle = _systemTitle.data;
        },
        //关闭微信公众号的弹窗
        closeWxZzx() {
          this.$emit('handleCloseFunc',this.showWx);
        },
        //获取本页面广告位信息
        async getBanners() {
          let _banners = await selectTableInfo('banners/type',{type:2});
          this.banner = _banners.data[0];
        },
        //跳转
        goPath: function (path) {
          this.$router.push(path);
        },
      },
      mounted: function () {
          this.getWxNum();
          this.getWxCode();
          this.getWebLogo();
          this.getSystemTitle();
          this.getHotLine();
          this.getBanners();
      }
    }
</script>

<style scoped>
  .zzc{position: fixed;width: 100%;height: 100%;background: rgba(0,0,0,0.5);display: flex;align-items: flex-end;justify-content: center;top:0;left: 0;z-index: 1001;}
  .wxCons{width: 100%;background: #fff;padding:0.2rem;position: relative;}
  .closeZzc{position: absolute;right: 0.3rem;top:0.3rem;font-size: 0.4rem;color: #999;border-radius: 50%;background: rgba(255,255,255,0.5);}
  .wxConsTop{display: flex;align-items: center;justify-content: space-between;background: linear-gradient(58deg, #f2593a, #f35e88);padding:0.4rem 0.2rem 0.2rem 0.2rem;border-radius: 0.2rem 0.2rem 0 0;border-bottom: 1px solid rgba(255,255,255,0.5);}
  .wxConsTopLeft{margin-right: 0.2rem;}
  .wxConsTopImg{width: 1rem;height: 1rem;overflow: hidden;margin-right: 0.2rem;}
  .wxConsTopImg img{width: 100%;}
  .wxConsTopTxt{width: calc(100% - 1.6rem);}
  .wxConsTopTxt h1{font-size: 0.32rem;color: #000;margin-bottom: 0.2rem;font-weight: bold;}
  .wxConsTopTxt p{font-size: 0.26rem;color: #666;}
  .wxConsMid{font-size: 0.26rem;color: #999;margin: 0.2rem 0;line-height: 0.32rem;}
  .wxConsBottom{text-align: center;}
  .wxConsBottom img{width: 2.2rem;}
  .wxRightH1{font-size: 0.28rem;color: #fff;text-align: center;display: flex;align-items: center;justify-content: center;}
  /*.wxRightH1 span{display: inline-block;width: 1rem;height: 1px;background: #fff;margin: 0 0.1rem;}*/
  .wxRightP01{font-size: 0.24rem;color: #eee;text-align: center;margin: 0.2rem 0 0.26rem 0;}
  .wxLeftTxt{font-size: 0.22rem;color: #ead4bc;text-align: center;line-height: 0.36rem;margin-top: 0.2rem;font-weight: 500;}
  .wxRightBox{display: flex;align-items: center;justify-content: space-between;border: 1px solid #ead4bc;border-radius: 1rem;padding: 0.1rem 0.2rem;margin-bottom: 0.2rem;}
  .wxRightBox p{font-size: 0.28rem;color: #ead4bc;}
  .wxRightBox span{font-size: 0.28rem;color: #fff;display: inline-block;margin-left: 0.2rem;}
  .wxPopImg{width: 100%;}
</style>
