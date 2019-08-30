<template>
   <div class="mails">
      <div class="mailsTop">
        <router-link to="/" tag="span" class="mailsTop_span1">
           <i class="iconfont icon-zuo"></i>
        </router-link>
        <h1>站内信</h1>
        <span class="mailsTop_span2"></span>
      </div>

      <div class="mailsBox">
        <mt-loadmore :top-method="loadTop"
                     :bottom-method="loadBottom"
                     :bottom-all-loaded="allLoaded"
                     :auto-fill="false"
                     ref="loadmore">
          <mt-navbar v-model="selected">
            <mt-tab-item id="1">系统消息</mt-tab-item>
            <mt-tab-item id="2">平台公告</mt-tab-item>
          </mt-navbar>
          <mt-tab-container v-model="selected">
            <mt-tab-container-item id="1">
              <!-- <mt-cell v-for="(n,index) in 10" title="tab-container 1" :key="index">
                <div v-show="!(index !== i)">nihao</div>
                <div @click="zhedie(index)">查看</div>
              </mt-cell> -->
              <el-collapse v-model="activeName" accordion class="mailItem" v-for="(item,index) in mails" :key="index">
                <p class="mailItem_time">{{Number(item.create_time + '000') | formatDate}}</p>
                <el-collapse-item :title="item.title" :name="index" class="mailItemCons">
                  <div class="cons" v-html="item.content">

                  </div>
                </el-collapse-item>
              </el-collapse>
            </mt-tab-container-item>
            <mt-tab-container-item id="2">
              <!-- <mt-cell v-for="(item,index) in mails" :title="item.title" :key="index"></mt-cell> -->
              <el-collapse v-model="activeName" accordion class="mailItem" v-for="(item,index) in infoMails" :key="index">
                <p class="mailItem_time">{{Number(item.create_time + '000') | formatDate}}</p>
                <el-collapse-item :title="item.title" :name="index" class="mailItemCons">
                  <div class="cons" v-html="item.content">

                  </div>
                </el-collapse-item>
              </el-collapse>
            </mt-tab-container-item>
          </mt-tab-container>

          <!-- <div v-for="item in mails" class="mailItem">
            <p class="mailItem_time">{{Number(item.create_time + '000') | formatDate}}</p>
            <div class="mailItemCons">
              <div class="mailItemCons_top">
                <h1>{{item.title}}</h1>
              </div>
              <router-link :to="{path: '/mailDetails',query: {pid:item.id}}" tag="div" class="mailItemConsBottom">
                <p>点击查看</p>
                <span>></span>
              </router-link>
            </div>
          </div> -->

        </mt-loadmore>

      </div>
   </div>
</template>

<script type="text/ecmascript-6">
  import {selectTableInfo} from '@/config/utils';
  import {formatDate,subStrFun} from '@/../static/js/function.js';
  import {loadmore,Toast,TabContainer, TabContainerItem, Cell,Navbar, TabItem} from 'mint-ui';
    export default{
      name: 'mails',
      data: function () {
        return{
          mails:[],
          infoMails:[],
          pageNum:1,
          allLoaded: false,
          selected: '1',
          // i: -1,
          // iszhedie: true,
          activeName: '1',
          // mailInfo:''
        }
      },
      components: {
        'mt-loadMore':loadmore,
        'mt-tab-container':TabContainer,
        'mt-tab-container-item':TabContainerItem,
        'mt-cell':Cell,
        'mt-navbar':Navbar,
        'mt-tab-item':TabItem
      },
      filters: {
        formatDate(time) {
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd hh:mm');
        },//时间
        subStrFun(value) {
          return subStrFun(value);
        },//截取字符串

      },
      methods: {
        // zhedie: function (index) {
        //   this.i = index
        //   this.iszhedie = !this.iszhedie
        //   if(this.iszhedie) {
        //     this.i = -1
        //   }
        // },
        // 消息列表
        async getMails() {

              let param={type:1, page:this.pageNum, token:localStorage.getItem('tk')};
              let mailList= await selectTableInfo('articles/letter',param);
              this.mails = mailList.data.list;
        },
        async getinfoMails() {

              let param={type:2, page:this.pageNum, token:localStorage.getItem('tk')};
              let mailList= await selectTableInfo('articles/letter',param);
              this.infoMails = mailList.data.list;
              console.log(this.infoMails)
        },
        //更多消息
        async getMoreMails() {
          this.pageNum++; //这一步是需要的,如果不加这一步,第一次执行这个方法的时候,pageNUm还是1,并没有++ 等于2
          let _moreMailList= await selectTableInfo('articles/letter?type=1&page=' + this.pageNum++);
          this.mails = this.mails.concat(_moreMailList.data.list);

          if( _moreMailList.data.list.length < 10){
            Toast({message:'没有更多了哦~',duration:1500});
            this.pageNum = this.pageNum - 2;
          }else{
            this.mails = this.mails.concat(_moreMailList.data.list);
          }
        },
        async getMoreInfoMails() {
          this.pageNum++; //这一步是需要的,如果不加这一步,第一次执行这个方法的时候,pageNUm还是1,并没有++ 等于2
          let _moreMailList= await selectTableInfo('articles/letter?type=2&page=' + this.pageNum++);
          this.infoMails = this.infoMails.concat(_moreMailList.data.list);

          if( _moreMailList.data.list.length < 10){
            Toast({message:'没有更多了哦~',duration:1500});
            this.pageNum = this.pageNum - 2;
          }else{
            this.infoMails = this.infoMails.concat(_moreMailList.data.list);
          }
        },

        loadTop: function () {
          this.getMails();
          this.getinfoMails();
          this.$refs.loadmore.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
        },
        loadBottom: function () {
          this.getMoreMails();
          this.getMoreInfoMails();
          this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
        }
      },

      mounted: function(){
        this.getMails();
        this.getinfoMails();
      }
    }
</script>

<style scoped>
.mailsTop{display: flex;justify-content: space-between;background: #fff;padding:0 0.26rem;height: 0.8rem;line-height: 0.8rem;}
.mailsTop span{width: 20%;font-size: 0.26rem;}
.mailsTop h1{width: 60%;text-align: center;font-size: 0.36rem;color: #333;}
.mailsTop_span1{line-height: 0.8rem;}
.mailsTop_span1 i{font-size: 0.36rem;color: #000;}
.mailsTop_span2{text-align: right;color: #fe6e5b;}
.mailItem{margin-top: 0.4rem;}
.mailItem_time{padding: 0.1rem 0.2rem;margin: 0 auto;background: #cecece;color: #fff;font-size: 0.3rem;border-radius: 0.1rem;width: 4rem;text-align: center;}
.mailItemCons{width: 90%;padding: 0.2rem;background: #fff;border: 1px solid #ccc;border-radius: 0.1rem;margin: 0.2rem auto 0.2rem auto;}
.mailItemCons_top,.mailItemConsBottom{display: flex;align-items: center;justify-content: space-between;padding: 0.1rem 0;}
.mailItemCons_top{border-bottom: 1px solid #eee;padding-bottom: 0.28rem;}
.mailItemConsBottom{padding-top: 0.28rem;}
.mailItemCons_top h1{font-size: 0.28rem;color: #000;display: -webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1;overflow: hidden;max-width: 88%;}
.mailItemCons_top span{font-size: 0.28rem;color: #fe6e5b;}
.mailItemConsBottom p{font-size: 0.28rem;color: #666;}
.mailItemConsBottom span{font-size: 0.28rem;color: #999;}
.mailsBox{padding-top: 0.4rem;overflow: scroll;}
/deep/ .mint-cell-wrapper {flex-direction: column; align-items: flex-start}
</style>
