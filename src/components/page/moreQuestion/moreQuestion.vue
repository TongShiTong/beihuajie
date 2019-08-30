<template>
  <div class="moreQuestion">
    <div class="mailsTop">
      <router-link to="/" tag="span" class="mailsTop_span1">
        <i class="iconfont icon-zuo"></i>
      </router-link>
      <h1>更多问题</h1>
      <span class="mailsTop_span2"></span>
    </div>
  <!--<mt-loadmore :bottom-method="loadBottom"-->
                <!--:bottom-all-loaded="allLoaded"-->
                <!--:auto-fill = "false"-->
                <!--ref="loadmore">-->

     <router-link :to="{path:'/questionDetails',query:{id:item.id}}"
                  tag="div"
                  v-for="item in questionList"
                  :key="item.id"
                  class="questionItem">
       <div class="titleDiv">
         <span></span>
         <p>{{item.title | subStrFun}}</p>
       </div>
       <div class="comeDiv">
         <img src="/static/images/moreQuestion/a.png" alt="">
       </div>

     </router-link>

   <!--</mt-loadmore>-->

    <!--固定底部的客服0-->
    <div class="fixBottom" @click="showWxFun()">
      <div>
        <img src="/static/images/index/icon_pho01.png">
        加盟合伙人/享受永久业绩分红和一对一辅导
      </div>

      <p>服务时间:工作日9:00-21:00 (周一至周六)</p>
    </div>
    <!--固定底部的客服1-->

    <!--点击头部的查看微信公众号-->
    <wxPopDown :showWx="showWx"
           @handleCloseFunc="closeWxPop"></wxPopDown>
    <!-- <foot></foot> -->
  </div>
</template>

<script type="text/ecmascript-6">
  import foot from '@/components/common/foot';
  import {selectTableInfo} from '@/config/utils';
  import {loadmore,Toast} from 'mint-ui';
  import {subStrFun} from '@/../static/js/function.js';
  import wxPopDown from '@/components/common/wxPopDown';

  var xe_kinds = [{
    'txt':'热门默认推荐',
    'isOn':'1',
    'src':'/static/images/me/icon_set.png'
  },{
    'txt':'最新上架排序',
    'isOn':'0',
    'src':'/static/images/me/icon_set.png'
  },{
    'txt':'下款率排序',
    'isOn':'0',
    'src':'/static/images/me/icon_set.png'
  },{
    'txt':'大额借款',
    'isOn':'0',
    'src':'/static/images/me/icon_set.png'
  }];
  export default{
    name: 'moreQuestion',
    components: {
      'mt-loadMore': loadmore,
      'foot': foot,
      'wxPopDown':wxPopDown
    },
    data: function () {
      return {
        questionList: [],//页面显示的所有问题
        updatingList: [],//每次执行获取列表的方法新生成的列表数组
        allLoaded: false,//是否禁止上拉下拉
        isHaveMore: true,//是否还有更多数据
        pageNum: 2,//调用接口的次数
        phone: '',//客服电话
        xe_kinds:xe_kinds,//文章分类
        choosed:0,
        showWx:false
      }
    },
    filters: {
      subStrFun(value) {
        return subStrFun(value);
      }//截取字符串

    },
    methods: {
      //问题列表
      async questions() {
        let param = {type: 16, pageSize: 10000, page: 1};
        let articles = await selectTableInfo('articles/type', param);
        this.questionList = articles.data;
        if (this.questionList.length < 10) { //如果当前页的问题数量小于每页显示的数量,则表示没有更多了

        }
      },
      //加载更多
      async getMoreQues() {
        let _moreQues = await selectTableInfo('articles/type?pageSize=10&page=' + this.pageNum++);
        if (_moreQues.data.length < 10 && _moreQues.data.length > 0) { //如果当前页的问题数量小于每页显示的数量,则表示没有更多了
          Toast({message: '没有更多了哦!~', duration: 1500});
          this.questionList = this.questionList.concat(_moreQues.data);
        } else if (_moreQues.data.length <= 0) {
          Toast({message: '没有更多了哦!~', duration: 1500});
          this.pageNum--;
        } else {
          this.questionList = this.questionList.concat(_moreQues.data);
        }

      },

      loadBottom: function () {
        // 上拉加载
        this.getMoreQues();
        this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位,如果没有这个方法,触发上拉事件后,那个底部的加载文本会一直显示,不消失
      },

      //是否显示微信弹窗
      showWxFun() {
        this.showWx = !this.showWx;
      },

      closeWxPop:function(data){
        this.showWx = !data;
      },

      //获取客服是电话
      async getTel() {
        let _tel = await selectTableInfo('systems/17');
        this.phone = _tel.data.content;
      },
    },

    mounted: function () {
      this.questions();
      this.getTel();

    },
  }
</script>

<style scoped>
  .mailsTop {
    display: flex;
    justify-content: space-between;
    background: #fff;
    height: 0.8rem;
    line-height: 0.8rem;
    border-bottom: 1px solid #eee;
  }

  .mailsTop span {
    width: 20%;
    font-size: 0.26rem;
  }

  .mailsTop h1 {
    width: 60%;
    text-align: center;
    font-size: 0.3rem;
    color: #000;
  }

  .mailsTop_span1 {
    line-height: 0.8rem;
  }

  .mailsTop_span1 i {
    font-size: 0.36rem;
    color: #000;
  }

  .mailsTop_span2 {
    text-align: right;
    color: #fe6e5b;
  }

.moreQuestion{min-height: 100%;background: #fff;padding: 0.2rem 0.26rem 1.4rem 0.26rem;overflow:scroll;}
.questionItem{display: flex;align-items: center;padding: 0.34rem 0;border-bottom: 1px solid #eee;background-size: 0.2rem auto;justify-content: space-between;}
.questionItem span{width: 3px;height: 0.2rem;background: #fcc270;border-radius: 1rem;margin-right: 0.2rem;}
.questionItem p{font-size: 0.26rem;color: #333;line-height: 0.34rem;display: -webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1;overflow: hidden;}
.comeDiv{font-size: 0.26rem;color: #999;}
.titleDiv{display: flex;align-items: center;}
 .fixBottom {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    background: linear-gradient(58deg, #f2593a, #f35e88);
    height: 1.5rem;
  }
.fixBottom div{display: flex;justify-content: center;font-size: 0.3rem;color: #fff;align-items: center;margin: 0.2rem 0 0.16rem 0;}
.fixBottom img{width: 0.34rem;margin-right: 0.1rem;}
.fixBottom p{font-size: .2rem;color: #fff;text-align: center;}
.mint-loadmore-top{font-size: 13px!important;}
.comeDiv > img {
    height: 0.2rem;
  }
</style>
