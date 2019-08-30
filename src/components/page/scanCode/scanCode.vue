<template>
  <div class="scanCode">
    <div class="scanCodes">
      <h1>扫码关注{{systemTitle.content}}</h1>
      <div class="codeCon">
         <img :src=" wxCode.content">
         <p>微信号：{{wxNum.content}}</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {selectTableInfo} from '@/config/utils';
  var codeInfo = {
    'src': '/static/images/scanCode/code.jpg',
    'wx':'wscjq'
  };
    export default{
      name: 'scanCode',
      data: function () {
        return{
          wxCode:'',//微信二维码
          wxNum:'',//微信号
          systemTitle:''//系统标题
        }
      },
      methods: {
        //获取微信号
        async getWxNum() {
           let _wxNum = await selectTableInfo('systems/37');
           this.wxNum = _wxNum.data;
        },
        //获取微信二维码
        async getWxCode() {
           let _wxCode = await selectTableInfo('systems/22');
           this.wxCode = _wxCode.data;
        },
        //获取系统标题
        async getSystemTitle() {
            let _systemTitle = await selectTableInfo('systems/1');
            this.systemTitle = _systemTitle.data;
        }
      },
      mounted: function() {
        this.getWxNum();
        this.getWxCode();
        this.getSystemTitle();
      }
    }
</script>

<style scoped>
.scanCode{background: linear-gradient(-36deg,#ffad33,#ffcc4c);display: flex;align-items: center;justify-content: center;height: 100%;}
.scanCodes{width: 80%;margin: 0 auto;}
.scanCode h1{font-size: 0.34rem;color: #fff;text-align: center;margin-bottom: 0.28rem;font-weight: bold;}
.codeCon{min-height: 8rem;background: url("/static/images/scanCode/bg_code.png") no-repeat;background-size: 100% auto;padding-top: 2rem;}
.codeCon img{width: 4rem;margin: 0 auto;display: block;}
.codeCon p{font-size: 0.26rem;color: #333;text-align: center;margin-top: 0.28rem;}
</style>
