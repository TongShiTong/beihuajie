<template>
  <div class="moreQuestion">
    <div class="mailsTop">
      <router-link to="/" tag="span" class="mailsTop_span1">
        <i class="iconfont icon-zuo"></i>
      </router-link>
      <h1>发现</h1>
      <span class="mailsTop_span2"></span>
    </div>

    <div class="searchBox">
      <input type="text" placeholder="请输入关键字" class="inputItem" v-model="userInfo.text"/>
      <div class="searchBtn" @click="SCateAct()">搜索</div>
    </div>


    <div class="swiper-container kinds_container">
      <div class="swiper-wrapper">
        <div class="swiper-slide kind"
             v-for="(kind,index) in xe_kinds"
             :class="{on: choosed == index}"
             @click="chooseCurKind(index,kind.id)">
          <img :src="kind.logo?urlImg+kind.logo:'/static/images/me/icon_set.png'">
          {{kind.name}}
        </div>
      </div>
    </div>

    <div class="mintBox">
      <mt-loadmore :bottom-method="loadBottom"
                   :bottom-all-loaded="allLoaded"
                   :auto-fill="false"
                   ref="loadmore">

        <div  v-for="item in questionList"
              :key="item.id"
              class="questionItem" @click="getGrade(item.grade_id,item.id)">
          <div class="questionItemLeft">
            <img :src="item.thumb?urlImg+item.thumb:'/static/images/vip/vip01.png'">
          </div>
          <div class="titleDiv">
            <p class="newsTitle">{{item.title | subStrFun}}</p>

            <div class="timeAndNum">
              <p>{{Number(item.create_time+'000') | formatDate}}</p>
              <p>{{item.num}}人已阅读</p>
            </div>

            <p class="newsCanSee">{{item.grade_id==1?'所有会员':(item.grade_id==2?'代理':'所有人')}}可见</p>
          </div>


        </div>

      </mt-loadmore>
    </div>


    <!--固定底部的客服0-->
    <div class="fixBottom"  @click="showWxFun('/wyHtml?id='+banner.id)">
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
  import {subStrFun,formatDate} from '@/../static/js/function.js';
   import wxPopDown from '@/components/common/wxPopDown';

  export default{
    name: 'moreQuestion',
    components: {
      'mt-loadMore': loadmore,
      'foot': foot,
      'wxPopDown':wxPopDown,
    },
    data: function () {
      return {
        questionList: [],//页面显示的所有问题
       userInfo:
       {
         text:'',//搜索内容
        },
        allLoaded: false,//是否禁止上拉下拉
        isHaveMore: true,//是否还有更多数据
        pageNum: 1,//调用接口的次数
        phone: '',//客服电话
        xe_kinds:'',//文章分类
        choosed:0,
        cate_id:18,//默认子分类id
        cate:17,//默认父分类id
        urlImg:process.env.API_HOST,//图片域名
        showWx:false,
        banner:'',//广告为信息
      }
    },
    filters: {
      formatDate(time) {
            var date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
        },//时间
      subStrFun(value) {
        return subStrFun(value);
      }//截取字符串

    },
    methods: {
      //是否显示微信弹窗
      showWxFun(path) {
         this.$router.push(path);
        // this.showWx = !this.showWx;
      },
      //获取本页面广告位信息
        async getBanners() {
          let _banners = await selectTableInfo('banners/type',{type:2});
          this.banner = _banners.data[0];
        },

      closeWxPop:function(data){
        this.showWx = !data;
      },
     async SCateAct(){
        this.pageNum=1;
        let param = {type:this.cate_id,text:this.userInfo.text, pageSize: 10, page: this.pageNum};
        let articles = await selectTableInfo('articles/type', param);
        this.questionList = articles.data;
      },
       //口子分类
      async getKzCate() {
        let param = {type: this.cate};
        let articles_cate = await selectTableInfo('articles/cate', param);
        this.xe_kinds=articles_cate.data;
      },
      chooseCurKind(index,id){
        this.choosed  = index;
        this.cate_id=id,
        this.pageNum=1;
        this.questions();
      },

      pSwiperInit: function () {

        var  swiper = new Swiper('.kinds_container', {
          spaceBetween: 20,
          initialSlide :0,
          slidesPerView : 4,
          observer:true,//修改swiper自己或子元素时，自动初始化swiper
          observeParents:true//修改swiper的父元素时，自动初始化swiper
        })

      },

      //文章列表
      async questions() {
        let param = {type:this.cate_id, text:this.userInfo.text,pageSize: 10, page: this.pageNum};
        let articles = await selectTableInfo('articles/type', param);
        this.questionList = articles.data;
        if (this.questionList.length < 10) { //如果当前页的问题数量小于每页显示的数量,则表示没有更多了

        }
      },
      //加载更多
      async getMoreQues() {
        let param = {type:this.cate_id, text:this.userInfo.text,pageSize: 10, page: ++this.pageNum};
        let _moreQues = await selectTableInfo('articles/type',param);
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
      //获取客服是电话
      async getTel() {
        let _tel = await selectTableInfo('systems/17');
        this.phone = _tel.data.content;
      },
      //点击判断权限跳转
     async getGrade(obj,id){
        if(obj!=0){//非游客权限
          if(localStorage.getItem('member_id')){//登陆状态
             let _user = await selectTableInfo('members/'+localStorage.getItem('member_id'));
             let grade_id=_user.data.grade_id;
            if(obj>grade_id){//需要升级
              let _that=this;
              this.$layer.dialog({
                  content:'您还没有完成身份认证不能成为信贷经理去推广，请先完成身份证认证',
                  contentClass: 'className',
                  btn:['再看看','去身份认证'],
                  time: 20000
                })
                // 如果有btn
                .then(function (res){
                  // res为0时是用户点击了左边  为1时用户点击了右边
                  let position = res === 0 ? 'left' : 'right';
                  if(res == 0){
                    // _that.$router.push('/vip');
                  }else{
                    _this.$router.push('/idCard');
                  }

                });
            }else{//可以正常阅读
              let param={
                id:id,
              };
             let _article = await selectTableInfo('articles/read-vol',param);
             if(_article.status==200){
                this.$router.push({
                    path:'/questionDetails',
                    query:{id:id}
                });
             }else{
               Toast({message: _article.msg, duration: 1500});
             }

            }
          }else{//非登陆状态
            let _that=this;
             this.$layer.dialog({
                content:'需要登陆才可观看亲-_-',
                contentClass: 'className',
                btn:['去登陆','再看看'],
                time: 20000
              })
              // 如果有btn
              .then(function (res){
                // res为0时是用户点击了左边  为1时用户点击了右边
                let position = res === 0 ? 'left' : 'right';
                if(res == 0){
                  _that.$router.push('/login');
                }else{

                }

              });
          }
        }else{//游客权限
         let param={
                id:id,
              };
             let _article = await selectTableInfo('articles/read-vol',param);
             if(_article.status==200){
                this.$router.push({
                    path:'/questionDetails',
                    query:{id:id}
                });
             }else{
               Toast({message: _article.msg, duration: 1500});
             }
        }
      },
    },

    mounted: function () {
      this.getKzCate();
      this.questions();
      this.getTel();
      this.getBanners();

    },

    updated:function() {
      this.pSwiperInit();
    }
  }
</script>

<style scoped>
  .searchBox{padding: 0.2rem 0;display: flex;align-items: center;justify-content: space-between;}
  .searchBtn{width: 1.4rem;background: #fcc270;font-size: 0.28rem;color: #fff;text-align: center;height: 0.6rem;
  line-height: 0.6rem;border-radius: 0.1rem;}
  .inputItem{display: block;width: calc(100% - 1.6rem);background: #eee url("/static/images/moreQuestion/icon_ss.png") no-repeat left 0.16rem center;
  padding-left: 0.66rem;border: none;height: 0.6rem;background-size: 0.34rem auto;border-radius: 0.1rem;}
  .kinds_container .swiper-slide{display: flex;align-items: center;justify-content: center;position: relative;width: auto;
    font-size: 0.28rem;color: #333;margin-bottom: 0.12rem;font-weight: 700;line-height: 0.8rem;}
  .kinds_container .swiper-slide img{height: 0.4rem;margin-right: 0.1rem;}
  .kinds_container .kind.on{border-bottom: 2px solid #fcc270;}
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

  .moreQuestion {
    min-height: 100%;
    background: #fff;
    padding: 0 0.26rem 1.4rem 0.26rem;
    overflow: scroll;
  }

  .questionItem {
    display: flex;
    align-items: center;
    padding: 0.34rem 0;
    border-bottom: 1px solid #eee;
    background-size: 0.2rem auto;
    justify-content: space-between;
  }

  .questionItemLeft{
    width: 2.2rem;
    height: 1.6rem;
    overflow: hidden;
  }
  .questionItemLeft img{
    width: 100%;
  }

  .titleDiv {
    width: calc(100% - 2.4rem);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 1.6rem;
  }

  .newsTitle {
    font-size: 0.28rem;
    color: #000;
    line-height: 0.34rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .timeAndNum{
    display: flex;
    justify-content: space-between;
  }

  .timeAndNum p{
    font-size: 0.26rem;
    color: #999;
  }

  .newsCanSee{
    font-size: 0.24rem;
    color: #666;
  }

  .fixBottom {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    background: linear-gradient(58deg, #f2593a, #f35e88);
    height: 1.5rem;
  }

  .fixBottom div {
    display: flex;
    justify-content: center;
    font-size: 0.3rem;
    color: #fff;
    align-items: center;
    margin: 0.3rem 0 0.16rem 0;
  }

  .fixBottom img {
    width: 0.34rem;
    margin-right: 0.1rem;
  }

  .fixBottom p {
    font-size: .2rem;
    color: #fff;
    text-align: center;
  }

  .mint-loadmore-top {
    font-size: 13px !important;
  }

  .comeDiv > img {
    height: 0.2rem;
  }

  .mintBox{
    height: 8.8rem;
    overflow-y: scroll;
  }
  /* //iphone Xs Max */
@media only screen and (device-width: 375px) and (device-height: 812px){
  .mintBox{
    height: 11rem!important;
  }
}
 /* //iphone Xs Max */
@media only screen and (device-width: 414px) and (device-height: 896px){
  .mintBox{
    height: 11rem!important;
  }
}
</style>
