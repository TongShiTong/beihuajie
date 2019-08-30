<template>
 <div class="product_list">
   <div class="topTabs">
     <ul>

         <li v-for="(item,index) in firstCate"
             @click="changeTab(item.id,index)">
           <img src="/static/images/product/icon_hot.png" class="hot" v-if="isHotCate">
           <span>{{item.name}}</span>
           <div class="bLine" v-if="index == curCate"></div>
         </li>

     </ul>
   </div>

  <!--推大额贷款-->
   <div v-if="this.$route.query.id == firstCate[1].id">

     <div class="today_tj">

       <div class="mintBox">
         <mt-loadmore :top-method="loadTop2"
                      :bottom-method="loadBottom2"
                      :auto-fill="false"
                      ref="loadmore2">

           <div class="products">
             <ul>
               <li v-for="item in bigAmountProducts"
                   @click="goGoodDetails(item.id,uid)"
                   class="prodct_item">
                 <div class="prodct_item_up">
                   <div class="prodct_img">
                     <img :src="item.thumb">
                   </div>
                   <div class="">
                     <h1 class="prodct_name">{{item.name}}</h1>
                     <p class="prodct_sq"><i>{{item.apply_num}}</i>申请</p>
                   </div>
                 </div>

                 <div class="prodct_item_down">
                   <div class="prodct_item_down1">
                     <div class="prodct_range">
                       <h2>{{item.min_money + '~' + item.max_money}}</h2>
                       <p>额度范围(万元)</p>
                     </div>

                     <div class="prodct_adv">
                       <span>{{item.clearing_form}}</span>
                     </div>
                   </div>

                 </div>
               </li>
             </ul>
           </div>

         </mt-loadmore>
       </div>

     </div>
   </div>

   <!--信用卡贷款-->
   <div v-else-if="this.$route.query.id == firstCate[2].id">

     <div class="xykProdus">

       <div class="mintBox">
         <mt-loadmore :top-method="loadTop3"
                      :bottom-method="loadBottom3"
                      :auto-fill="false"
                      ref="loadmore3">
           <ul>
             <li v-for="item in xykProducts"
                 @click="goGoodDetails(item.id,uid)"
                 class="xykProdu">
               <div class="xykProdu_top">
                 <div class="xykProdu_img">
                   <img :src="item.thumb">
                 </div>
                 <h1 class="xykProdu_name">{{item.name}}</h1>
                 <p class="xykProdu_mans">申请人数：{{item.apply_num}}</p>
               </div>

               <div class="xykProdu_mid">
                 <img :src="item.shop_banner">
               </div>

             </li>
           </ul>

         </mt-loadmore>
       </div>

     </div>
   </div>

   <!--信用卡代还-->
   <div v-else-if="this.$route.query.id == firstCate[3].id">

     <div class="xykProdus">

       <div class="mintBox">
         <mt-loadmore :top-method="loadTop4"
                      :bottom-method="loadBottom4"
                      :auto-fill="false"
                      ref="loadmore4">

           <ul>
             <li v-for="item in xykDHProducts"
                 @click="goGoodDetails(item.id,uid)"
                 class="xykProdu">
               <div class="xykProdu_top">
                 <div class="xykProdu_img"><img :src="item.thumb"></div>
                 <h1 class="xykProdu_name">{{item.name}}</h1>
                 <p class="xykProdu_mans">申请人数：{{item.apply_num}}</p>
               </div>

               <div class="xykProdu_mid">
                 <img :src="item.shop_banner">
               </div>

               <div class="xykProdu_bottom">
                 <div class="xykProdu_bottom_left">
                   <div>
                     <h2 class="xykProdu_tg">{{item.name}}推广</h2>
                     <span class="xykProdu_js">{{item.clearing_form}}</span>
                   </div>
                   <p class="xykProdu_tgPercent">预通过率：{{item.loan_success}}%</p>
                 </div>

                 <span class="xykProdu_profit">{{item.fy_ms}}</span>
               </div>
             </li>
           </ul>
         </mt-loadmore>
       </div>

     </div>
   </div>

   <div v-else>
     <div class="xe_kinds">
       <div class="swiper-container kinds_container">
         <div class="swiper-wrapper">
           <div class="swiper-slide kind"
                v-for="(kind,index) in xe_kinds"
                :class="{on: choosed == index}"
                @click="chooseCurKind(index)">
                {{kind.txt}}
           </div>

         </div>
       </div>
     </div>

     <div class="xeLists">
       <p class="xeLists_ad">经统计,一下产品同时申请5家,审批通过率高达90%</p>


       <!--热门推荐产品-->

       <div class="mintBox">
         <mt-loadmore :top-method="loadTop1"
                      :bottom-method="loadBottom1"
                      :auto-fill="false"
                      ref="loadmore1">
           <ul class="xeProd_ul" v-if="isClassifyPro">
             <li class="xeProd_item"
                 v-for="item in hotProducts"
                 @click="goGoodDetails(item.id,uid)">
               <div class="xeProd_up">
                 <div class="xeProd_img">
                   <img :src="item.thumb">
                 </div>
                 <div class="xeProd_infos">
                   <h1 class="xeProd_name">{{item.name}}</h1>
                   <p class="xeProd_mans"><i>{{item.apply_num}}</i>人申请</p>
                 </div>
               </div>

               <div class="xeProd_down">
                 <h2 class="xeProd_range">
                   {{item.min_money +'~'+ item.max_money}}
                 </h2>
                 <p class="xeProd_txt1">额度范围(万元)</p>

               </div>

               <img v-if="item.isHot" src="/static/images/product/icon_dj.png" class="dj">
             </li>
           </ul>

           <div v-if="!isClassifyPro">
             <div class="classifyProducts"
                  v-for="item in classifyProducts">
               <h1 class="classifyName">{{item.category.name}}</h1>
               <p class="classifyProAccount">共{{item.result.length}}款</p>

               <ul class="xeProd_ul">
                 <li v-for="classifyItem in item.result" class="xeProd_item" @click="goGoodDetails(classifyItem.result.pid,uid)">
                   <div class="xeProd_up">
                     <div class="xeProd_img">
                       <img :src="classifyItem.thumb">
                     </div>
                     <div class="xeProd_infos">
                       <h1 class="xeProd_name">{{classifyItem.name}}</h1>
                       <p class="xeProd_mans"><i>{{classifyItem.apply_num}}</i>人申请</p>
                     </div>
                   </div>

                   <div class="xeProd_down">
                     <h2 class="xeProd_range">{{classifyItem.min_money +'~'+ classifyItem.max_money}}</h2>
                     <p class="xeProd_txt1">额度范围(万元)</p>
                   </div>

                   <img v-if="item.isHot" src="/static/images/product/icon_dj.png" class="dj">
                 </li>
               </ul>
             </div>
           </div>

         </mt-loadmore>
       </div>


   </div>


 </div>

   <div class="tg_ways" v-if="isSystemPage">
     <div class="tg_hb" @click="showPosterImg()">海报式推广</div>
     <div class="tg_lj" @click="getQrcode()">链接式推广</div>
   </div>


   <!--背景图和二维盒子-->
   <div class="hb_cons_list hb_cons_listBOX" style="transform: translateX(100%)">
     <div v-for="(item,index) in posters" class="creat-img" ref="box">
       <img :src="item" alt="分享背景图">
       <div :id="getDifId(index)" class="code"></div>
     </div>
   </div>

   <!--海报式推广的页面 start-->
   <div v-if="hbIsShow">
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

       <productItem :src="curPoster"
                    v-if="productItemShow"
                    @hideState="hidePosterItem()">

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
         <img src="/static/images/product/tg_logo.png">
         <div class="ewm_box" id="qrcode">

         </div>
         <div class="linkIntroBox">
           <p class="linkIntro">扫描二维码后关注店铺</p>
           <div class="linkGn">
             <span class="copyLink"
                   @click="copyLinkAction()"
                   :data-clipboard-text="linkInfo.url">复制链接</span>
             <span class="wxShare">微信分享</span>
           </div>
           <div class="link_div">

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
  import {selectTableInfo} from '@/config/utils';
  import productItem from '../common/posterItem';
  import {loadmore,Toast} from 'mint-ui';
  import Clipboard from 'clipboard';/*剪切板*/
  import { qrcanvas } from 'qrcanvas';
  import html2canvas from 'html2canvas';
  export default {
    name:'ProductList',
    components:{
      'productItem':productItem
    },
    props: ['xe_kinds',
            'firstCate',
            'hotProducts',
            'classifyProducts',
            'bigAmountProducts',
            'xykProducts',
            'xykDHProducts',
            'posters',
            'linkInfo'],
    data: function () {
      return {
        choosed:0,
        hbIsShow:false,
        linkIsShow:false,
        curPoster:null,
        hbConsShow:true,
        productItemShow:false,
        isHotCate:false,//是否是热门分类
        isClassifyPro:true,//当前展示的是否为按分类排序的产品
        pageNumBig:1,//推荐大额的页数
        pageNumXyk:1,//信用卡产品的页数
        pageNumXykDH:1,//信用卡代还产品的页数
        pageNumSmallH:1,//推荐小额(1)的页数
        pageNumSmallN:1,//推荐小额(2)的页数
        pageNumSmallC:1,//推荐小额(3)的页数
        pageNumSmallA:1,//推荐小额(4)的页数
        allLoaded1H:false,//是否禁止推荐小额(1)的加载更多
        allLoaded1N:false,//是否禁止推荐小额(2)的加载更多
        allLoaded1C:false,//是否禁止推荐小额(3)的加载更多
        allLoaded1A:false,//是否禁止推荐小额(4)的加载更多
        allLoaded2:false,//是否禁止推荐大额的加载更多
        allLoaded3:false,//是否禁止信用卡产品的加载更多
        allLoaded4:false,//是否禁止信用卡代还产品的加载更多
        uid:0,//用户id
        curCate:0,//当前一级分类
        imgUrl:[],
        clickTime:0,//限制生成海报的张数
        isSystemPage:true,//判断系统和推广底部链接显示

      }
    },
    methods: {
      swiperInit: function () {
        this.swiper = new Swiper('.kinds_container', {
          slidesPerView: 'auto',
          spaceBetween: 16
        })
      },
      chooseCurKind: function (index) {
        this.choosed = index;
        switch (index) {
          case 0://点击的是热门默认推荐
            this.isClassifyPro = true;
            this.getHotProducts(1);
            break;
          case 1://点击的是最新上架排序
            this.isClassifyPro = true;
            this.getNewsProduct(1);
            break;
          case 2://点击的是按分类展示
            this.isClassifyPro = false;
            this.getClassifyProducts(1);
            break;
          case 3://点击的是按申请人数展示
            this.isClassifyPro = true;
            this.getDownAccountProducts(1);
            break;
        }
      },
      changeTab: function (id,index) {
        this.curCate = index;
        this.$router.push({name:'myShop',query:{id:id}});
      },
      showPoster: function () {
        this.hbIsShow = !this.hbIsShow;
      },
      showLinsk: function () {
        this.linkIsShow = !this.linkIsShow;
      },
      goGoodDetails: function (_id,_uid) {
        this.$router.push({
          path:'/product_details',
          query:{pid:_id,uid:_uid}
        });
      },

      getCurPoster: function (index) {
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
         //二维码链接生成begin
        var  _router = window.location.host;
        this.linkInfo.url = _router+'/myShop?uid='+localStorage.getItem('member_id');
        //end

        let _id = this.getDifId(id);
        //生成二维码
        var canvas2 = qrcanvas({
          data: decodeURIComponent(this.linkInfo.url),
          size:70,
        });
        document.getElementById(_id).innerHTML = '';
        document.getElementById(_id).appendChild(canvas2);
         if(id==0){
          document.getElementById(_id).style = 'position: absolute;bottom: 24px;left: 114.5px';
        }
        if(id==1){
          document.getElementById(_id).style = 'position: absolute;bottom: 10px;left: 46px;';
        }
        if(id==2||id==3){
          document.getElementById(_id).style = 'position: absolute;bottom: 12px;left: 16px;';
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


      //生成链接推广部分的二维码
      getQrcode:function () {
        this.linkIsShow = !this.linkIsShow;
        var  _router = window.location.href;
        //生成二维码
        var canvas1 = qrcanvas({
          data: decodeURIComponent(_router),
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
      //获取热门产品
      async getHotProducts(pageNum) {
        let param = {type: 1,pageSize: 10, Hotspot: 1,page:pageNum};
        let _hotProducts = await selectTableInfo('products/type',param);
        if(_hotProducts.data.length < 10){
          this.allLoaded1H = true;
        };
        this.hotProducts = _hotProducts.data;
      },
      //lodemore热门产品
      async getMoreHotProducts() {
        let param = {type: 1,pageSize: 10, Hotspot: 1,page:this.pageNumSmallH++};
        let _hotProducts = await selectTableInfo('products/type',param);
        if(_hotProducts.data.length < 10){
          this.pageNumSmallH = this.pageNumSmallH - 1;
          this.allLoaded1H = true;
        };
        this.hotProducts = this.hotProducts.concat(_hotProducts.data);
      },
      //获取最新上架
      async getNewsProduct(pageNum) {
        let param = {type: 1,pageSize:10,page:pageNum};
        let _hotProducts = await selectTableInfo('products/type',param);
        if(_hotProducts.data.length < 10){
          this.allLoaded1N = true;
        };
        this.hotProducts = _hotProducts.data;
      },
      //获loadMore 最新上架
      async getMoreNewsProduct() {
        let param = {type: 1,pageSize:10,page:this.pageNumSmallN++};
        let _hotProducts = await selectTableInfo('products/type',param);
        if(_hotProducts.data.length < 10){
          this.pageNumSmallN = this.pageNumSmallN - 1;
          this.allLoaded1N = true;
        };
        this.hotProducts = this.hotProducts.concat(_hotProducts.data);
      },

      //获取按分类展示的产品
      async getClassifyProducts(pageNum) {
        let param = {type: 1,pageSize: 6,page:pageNum};
        let _classifyProducts = await selectTableInfo('products/psonduct',param);
        if(_classifyProducts.data.length < 6){
          this.pageNumSmallC = this.pageNumSmallC;
          this.allLoaded1C = true;
        };
        this.classifyProducts = _classifyProducts.data;
      },
      //lodeMore 分类展示的产品
      async getMoreClassifyProducts() {
        let param = {type: 1,pageSize: 6,page:this.pageNumSmallC++};
        let _classifyProducts = await selectTableInfo('products/psonduct',param);
        if(_classifyProducts.data.length < 6){
          this.pageNumSmallC = this.pageNumSmallC -1;
          this.allLoaded1C = true;
        };
        this.classifyProducts = this.classifyProducts.concat(_classifyProducts.data);
      },
      //获取按下载数量展示的产品
      async getDownAccountProducts(pageNum) {
        let param = {type: 1,pageSize: 6,page:pageNum};
        let _downAccountProducts = await selectTableInfo('top-king',param);
        if(_downAccountProducts.data.length < 6){
          this.allLoaded1A = true;
        };
        this.hotProducts = _downAccountProducts.data;
      },
      //loadMore下载数量展示的产品
      async getMoreDownAccountProducts() {
        let param = {type: 1,pageSize: 6,page:this.pageNumSmallA++};
        let _downAccountProducts = await selectTableInfo('top-king',param);
        if(_downAccountProducts.data.length < 6){
          this.allLoaded1A = true;
          this.pageNumSmallA = this.pageNumSmallA -1;
        };
        this.hotProducts = this.hotProducts.concat(_downAccountProducts.data);
      },


      //推大额贷款的产品列表
      async getBigAmountProduct(pageNnm) {
        let param = {type: 37,pageSize:10,page:pageNnm};
        let _bigAmountProducts = await selectTableInfo('products/type',param);
        if(_bigAmountProducts.data.length < 10){
          this.allLoaded2 = true;

        };
        this.bigAmountProducts = _bigAmountProducts.data;
      },
      //loadmore 推大额贷款的产品列表
      async getMoreBigAmountProduct() {
        let param = {type: 37,pageSize:10,page:this.pageNumBig++};
        let _bigAmountProducts = await selectTableInfo('products/type',param);
        if(_bigAmountProducts.data.length < 10){
          this.allLoaded2 = true;

        };
        this.bigAmountProducts = this.bigAmountProducts.concat(_bigAmountProducts.data);
      },

      //推广信用卡的产品列表
      async getXykProduct(pageNum) {
        let param = {type: 49,pageSize:10,page:pageNum};
        let _xykProducts = await selectTableInfo('products/type',param);
        if(_xykProducts.data.length < 10){
          this.allLoaded3 = true;
        };
        this.xykProducts = _xykProducts.data;
      },
      //loadmore 推广信用卡的产品列表
      async getMoreXykProduct() {
        let param = {type: 49,pageSize:10,page:this.pageNumXyk++};
        let _xykProducts = await selectTableInfo('products/type',param);
        if(_xykProducts.data.length < 10){
          this.allLoaded3 = true;
        };
        this.xykProducts = this.xykProducts.concat(_xykProducts.data);
      },

      //推广信用代还的产品列表
      async getXykProductDH() {
        let param = {type: 58,pageSize:10,page:this.pageNumXykDH++};
        let _xykProducts = await selectTableInfo('products/type',param);
        if(_xykProducts.data.length < 10){
          this.allLoaded4 = true;
        };
        this.xykDHProducts = _xykProducts.data;
      },
      //loadmore 推广信用代还的产品列表
      async getMoreXykProductDH() {
        let param = {type: 58,pageSize:10,page:this.pageNumXykDH++};
        let _xykProducts = await selectTableInfo('products/type',param);
        if(_xykProducts.data.length < 10){
          this.allLoaded4 = true;
        };
        this.xykDHProducts = this.xykDHProducts.concat(_xykProducts.data);
      },

      //推大额的加载更多
      loadTop2: function () {
        if(this.allLoaded2){
          Toast({
            message:"已经是最新数据了",
            duration: 1500
          });
        }else{
          this.getBigAmountProduct(this.pageNumBig++);
        }
        this.$refs.loadmore2.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
      },
      loadBottom2: function () {
        if(this.allLoaded2){
          Toast({
            message:"没有更多数据了",
            duration: 1500
          });
        }else{
          this.getMoreBigAmountProduct();
        }
        this.$refs.loadmore2.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
      },

      //推荐信用卡部分加载更多部分
      loadTop3: function () {
        if(this.allLoaded3){
          Toast({
            message:"已经是最新数据了",
            duration: 1500
          });
        }else{
          this.getXykProduct(this.pageNumXyk++);
        }
        this.$refs.loadmore3.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
      },
      loadBottom3: function () {
        if(this.allLoaded3){
          Toast({
            message:"没有更多数据了",
            duration: 1500
          });
        }else{
          this.getMoreXykProduct();
        }
        this.$refs.loadmore3.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
      },

      //推荐信用卡代还部分加载更多部分
      loadTop4: function () {
        if(this.allLoaded4){
          Toast({
            message:"已经是最新数据了",
            duration: 1500
          });
        }else{
          this.getXykProductDH(this.pageNumXykDH++);
        }
        this.$refs.loadmore4.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
      },
      loadBottom4: function () {
        if(this.allLoaded4){
          Toast({
            message:"没有更多数据了",
            duration: 1500
          });
        }else{
          this.getMoreXykProductDH();
        }
        this.$refs.loadmore4.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
      },

      //推荐信小额部分加载更多部分
      loadTop1: function () {
        switch (this.choosed) {
          case 0:
            if(this.allLoaded1H){
              Toast({
                message:"已经是最新数据了",
                duration: 1500
              });
            }else{
              this.getHotProducts(this.pageNumSmallH++);
            }
            this.$refs.loadmore1.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
            break;
          case 1:
            if(this.allLoaded1N){
              Toast({
                message:"已经是最新数据了",
                duration: 1500
              });
            }else{
              this.getNewsProduct(this.pageNumSmallN++);
            }
            this.$refs.loadmore1.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
            break;
          case 2:
            if(this.allLoaded1C){
              Toast({
                message:"已经是最新数据了",
                duration: 1500
              });
            }else{
              this.getClassifyProducts(this.pageNumSmallC++);
            }
            this.$refs.loadmore1.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
            break;
          case 3:
            if(this.allLoaded1A){
              Toast({
                message:"已经是最新数据了",
                duration: 1500
              });
            }else{
              this.getDownAccountProducts(this.pageNumSmallA++);
            }
            this.$refs.loadmore1.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
            break;
        }
      },
      loadBottom1: function () {
        switch (this.choosed) {
          case 0:
            if(this.allLoaded1H){
              Toast({
                message:"没有更多数据了",
                duration: 1500
              });
            }else{
              this.getMoreHotProducts();
            }
            this.$refs.loadmore1.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
            break;
          case 1:
            if(this.allLoaded1N){
              Toast({
                message:"没有更多数据了",
                duration: 1500
              });
            }else{
              this.getMoreNewsProduct();
            }
            this.$refs.loadmore1.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
            break;
          case 2:
            if(this.allLoaded1C){
              Toast({
                message:"没有更多数据了",
                duration: 1500
              });
            }else{
              this.getMoreClassifyProducts();
            }
            this.$refs.loadmore1.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
            break;
          case 3:
            if(this.allLoaded1A){
              Toast({
                message:"没有更多数据了",
                duration: 1500
              });
            }else{
              this.getMoreDownAccountProducts();
            }
            this.$refs.loadmore1.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
            break;
        }

      },

    },
    mounted: function () {
      this.swiperInit();
      this.getHotProducts();
      this.getBigAmountProduct();
      this.getXykProduct();
      //判断推广外页和系统内页
      if(this.$route.query.uid==undefined||this.$route.query.uid == ''){
        this.isSystemPage=true;
        this.uid ='';
      }else{
        this.isSystemPage=false;
        this.uid = this.$route.query.uid;
      }
    }
  }
</script>

<style scoped>
  .product_list{margin-top: 0.1rem;}
  .topTabs ul{display: flex;padding: 0.28rem 0 0.1rem 0;background: #fff;justify-content: space-around;}
  .topTabs li{display: flex;align-items: center;justify-content: center;position: relative;}
  .topTabs li img{width: 0.34rem;}
  .topTabs li span{font-size: 0.28rem;color: #333;margin-left: 0.1rem;margin-bottom: 0.12rem;}
  .topTabs li img.hot{position: relative;top:-0.3rem;right: 0;width: 0.46rem;}
  .bLine{position: absolute;width: 0.68rem;bottom:-0.1rem;height: 2px;background:#fcc270;border-radius: 0.1rem;}
  .xe_kinds{display: flex;padding: 0.2rem;background: #fff;margin-top: 0.1rem;width: 100%;overflow: hidden;}
  .kinds_box{width: auto;overflow-x: auto;}
  .xe_kinds .kind{display: inline-block;padding: 0.1rem 0.22rem;border-radius: 0.6rem;background: #efefef;font-size: 0.24rem;color: #333;width: auto;}
  .xe_kinds .kind.on{background: #fcc270;color: #fff;}
  .xeLists{background: #fff;overflow: scroll;height: 13rem;}
  .xeLists_ad{font-size: 0.22rem;color: #f1604e;text-align: center;padding-top: 0.2rem;}
  .xeProd_ul{display: flex;flex-wrap: wrap;padding: 0.26rem;justify-content: space-between;}
  .xeProd_ul li{width: 48%;padding: 0.2rem;background: #fff;margin-bottom: 0.2rem;border-radius: 2px;box-shadow: 0 0 10px #eee;position: relative;}
  .xeProd_up{display: flex;align-items: center;padding-bottom: 0.1rem;margin-bottom: 0.12rem;border-bottom: 1px dashed #ececec;}
  .xeProd_img{width: 0.8rem;height: 0.8rem;border-radius: 4px;overflow: hidden;margin-right: 0.12rem;}
  .xeProd_img img{width: 100%;}
  .xeProd_name{font-size: 0.26rem;color: #333;margin-bottom: 0.12rem;}
  .xeProd_mans{font-size: 0.24rem;color: #999;}
  .xeProd_mans i{color: #f9ca52;}
  .xeProd_range{font-size: 0.4rem;color: #f1604e;text-align: center;}
  .xeProd_txt1{font-size: 0.24rem;color: #999;text-align: center;margin: 0.1rem 0;}
  .xeProd_txt2{font-size: 0.22rem;color: #f9ca52;text-align: center;margin: 0.1rem 0 0.2rem 0;}
  .xeProd_intro{font-size: 0.26rem;color: #fff;background: linear-gradient(90deg,#9bb4ef,#28c2fb);padding: 0.16rem 0.2rem;text-align: center;border-radius: 0.2rem;}
  .dj{position: absolute;top:0;right: 0;width: 0.3rem;}
  .tg_ways{display: flex;justify-content: space-around;position: fixed;width: 100%;bottom:0.6rem;left: 0;}
  .tg_ways div{width: 40%;height: 0.6rem;border-radius: 0.6rem;color: #fff;font-size: 0.26rem;box-shadow: 1px 2px 10px #eb5856;text-align: center;line-height: 0.6rem;}
  .tg_hb{background: linear-gradient(90deg,#ff6841,#ff8026);}
  .tg_lj{background: linear-gradient(90deg,#f05a49,#ff2b71);}
  .today_tj{padding: 0.2rem 0.2rem 0 0.2rem;overflow: scroll;}
  .prodct_item{margin-bottom: 0.2rem;background:#fff 0 0/100% 100% no-repeat;box-shadow: 0 0 1.2rem 0.04rem #ececec;border-radius: 0.05rem;padding: 0.2rem;}
  .prodct_item_up{display: flex;align-items: center;padding-bottom: 0.18rem;margin-bottom: 0.2rem;border-bottom: 1px solid #eee;}
  .prodct_img{width: 0.8rem;height: 0.8rem;border-radius: 4px;overflow: hidden;margin-right: 0.1rem;}
  .prodct_img img{width: 100%;}
  .prodct_name{font-size: 0.28rem;color: #000;margin-bottom: 0.2rem;}
  .prodct_sq{font-size: 0.26rem;color: #000;}
  .prodct_sq i{color: #f4b73c;}
  .prodct_item_down1{display: flex;justify-content: space-between;align-items: center;}
  .prodct_range h2{font-size: 0.4rem;color: #f1604e;font-weight: 700;margin-bottom: 0.2rem;}
  .prodct_range p{font-size: 0.26rem;color: #999;}
  .prodct_adv{text-align: right;}
  .prodct_adv>span{font-size: 0.26rem;color: #fff;background:linear-gradient(90deg,#f05a49,#ff2b71);border-radius: 1rem;display: inline-block;padding: 0.06rem 0.16rem;margin-bottom: 0.1rem;}
  .prodct_adv>div{display: flex;align-items: center;justify-content: flex-end;}
  .prodct_adv img{width: 0.4rem;margin-right: 0.1rem;}
  .prodct_adv>span{font-size: 0.26rem;color: #fff;background:linear-gradient(90deg,#f05a49,#ff2b71);border-radius: 1rem;display: inline-block;padding: 0.06rem 0.16rem;margin-bottom: 0.1rem;}
  .prodct_item_down2 li{width: 33.33%;font-size: 0.2rem;color: #848484;}
  .xykProdus{padding: 0.2rem;overflow: scroll;}
  .xykProdu{background: #fff;margin-bottom: 0.2rem;padding: 0.2rem;}
  .xykProdu_top{display: flex;align-items: center;}
  .xykProdu_img{width: 0.68rem;height: 0.68rem;overflow: hidden;border-radius: 4px;margin-right: 0.2rem;}
  .xykProdu_img img{width: 100%;}
  .xykProdu_name{font-size: 0.28rem;color: #333;margin-right: 0.2rem;}
  .xykProdu_mans{font-size: 0.24rem;color: #999;}
  .xykProdu_mid{max-height: 2rem;margin: 0.2rem 0;overflow: hidden;}
  .xykProdu_mid img{width: 100%;}
  .xykProdu_bottom{display: flex;align-items: center;justify-content: space-between;}
  .xykProdu_bottom_left div{display: flex;align-items: center;margin-bottom: 0.14rem;}
  .xykProdu_tg{font-size: 0.24rem;color: #333;margin-right: 0.1rem;}
  .xykProdu_js{display: inline-block;padding: 0.04rem;font-size: 0.22rem;color: #fff;background: #f4b73c;}
  .xykProdu_tgPercent{font-size: 0.2rem;color: #f4b73c;}
  .xykProdu_profit{display:inline-block;font-size: 0.24rem;color: #fff;padding: 0.16rem 0.24rem;border-radius: 0.4rem;background:linear-gradient(90deg,#8FABFE,#90C3FE); }

  .hb_zzc,.link_zzc{position: fixed;width: 100%;height: 100%;left: 0;top:0;background: rgba(0,0,0,0.5);display: flex;align-items: center;justify-content: center;z-index: 1000;}
  .hb_cons{width: 80%;background: #e6e6e6;border-radius: 0.1rem;padding: 0.2rem 0.26rem;}
  .hb_cons_title{font-size: 0.26rem;color: #333;font-weight: bold;text-align: center;position: relative;padding: 0.1rem 0 0.28rem 0;}
  .hb_cons_colse{position: absolute;display: inline-block;background: #fff;color: #333;font-size: 0.4rem;border-radius: 0.2rem;width: 0.6rem;height: 0.36rem;text-align: center;font-weight: 500;line-height: 0.36rem;right:0;top:0;}
  .hb_cons_list{display: flex;justify-content: space-between;flex-wrap: wrap;}
  .hb_cons_list div{width: 48%;overflow: hidden;margin-bottom: 0.16rem;}
  .hb_cons_list img{width: 100%;border-radius: 0.2rem;}

  .link_cons{width: 80%;border-radius: 0.2rem;background: #fff;position: relative;}
  .closeLink{position: absolute;right:0.2rem;top:0.2rem;width: 0.6rem;height: 0.36rem;border-radius: 1rem;background: #eee;text-align: center;line-height: 0.36rem;font-size: 0.3rem;color: #000;font-weight: bold;}
  .link_cons>img{width: 100%;}
  .ewm_box{width: 2.8rem;height: 2.8rem;margin:0.4rem auto 0 auto;overflow: hidden;text-align: center;}
  .ewm_box img{width: 100%;}
  .linkIntro{font-size: 0.22rem;color: #f4b73c;text-align: center;margin: 0.2rem 0 0.4rem 0;}
  .linkGn{display: flex;justify-content: space-around;}
  .linkGn span{display: inline-block;width: 2.2rem;height: 0.8rem;border-radius: 0.5rem;font-size: 0.26rem;color: #fff;text-align: center;line-height: 0.8rem;}
  .link_div{padding: 0.2rem;border-radius: 0.2rem;background: #f8f8f8;font-size: 0.26rem;color: #666;min-height: 1.2rem;margin-top: 0.4rem;}
  .copyLink{background: linear-gradient(90deg,#f2593a,#f3682c,#f46f25);}
  .wxShare{background: linear-gradient(90deg,#f2544e,#f8405f,#fd326b);}
  .linkIntroBox{padding: 0.2rem;}
  .classifyProducts{border-bottom: 0.2rem solid #eee;margin-top: 0.2rem;}
  .classifyName{text-align: center;font-size: 0.32rem;color: #000;margin: 0.1rem;}
  .classifyProAccount{text-align: center;font-size: 0.26rem;color: #999;}
  .creat-img{position: relative;width: 300px!important;}
  .code{position: absolute;bottom: 0.1rem;left: 0.1rem;}
  .hb_cons_listBOX{position: fixed;top:0;}
  .mintBox{height: 13rem;}
</style>
