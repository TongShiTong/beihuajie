<template>
  <div class="myShop">
    <div class="topFix">
      <div class="head" v-if="isSystemhead">
        <i class="iconfont icon-zuo" @click="goBack"></i>
        <h1>{{isSet == 1 ? '设置店铺' : isSet==0?'我的店铺':'商家店铺'}}</h1>
        <i></i>
      </div>


      <div class="myShopTop">

        <div class="myShopTop_gn" v-if="myShopTopIsShow">
          <img src="/static/images/myShop/iconCamera.png">
          <input type="file" id="upImg" @change="imageSubmit()"/>
          <span @click="showGoodMyShop()">保存</span>
        </div>




        <div class="showDiv" v-if="!myShopTopIsShow">
          <h1 class="shopName" v-model="shopInfo.shop_name">店铺名称：{{shopInfo.shop_name ? shopInfo.shop_name : shopInfo.uid+"号贝化街店铺"}}</h1>
          <p class="shopSlogan"
             v-model="shopInfo.shop_slogan">店铺宣传语:{{shopInfo.shop_slogan  ? shopInfo.shop_slogan : '请编辑店铺宣传语'}}</p>
        </div>



        <div class="editDiv" v-if="myShopTopIsShow">
          <div class="shopName">
            <label>店铺名称：</label>
            <input type="text" v-model="shopInfo.shop_name" placeholder="请编辑店铺名"/>
          </div>
          <div class="shopSlogan">
            <label>店铺宣传语：</label>
            <input type="text" v-model="shopInfo.shop_slogan" placeholder="请编辑店铺宣传语"/>
          </div>
        </div>

        <div class="shopImg">
          <img :src="imageSave ? imageSave : shopInfo.head_img ? urlImg+shopInfo.head_img : defaultTx">
        </div>
      </div>

      <div class="topTabs">
        <div class="swiper-container kinds_container01">
          <ul class="swiper-wrapper">
            <li v-for="(item,index) in firstCate"
                @click="changeTab(item.id,index)"
                class="swiper-slide">
              <img src="/static/images/product/icon_hot.png" class="hot" v-if="isHotCate">
              <span>{{item.name}}</span>
              <div class="bLine" v-if="index == curCate"></div>
            </li>

          </ul>
        </div>
      </div>
    </div>



    <div class="product">

      <!-- 推广借款 -->
      <div v-if="this.$route.query.id == firstCate[0].id || this.$route.query.id == undefined">
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
          <p class="xeLists_ad">经统计,以下产品同时申请5家,审批通过率高达90%</p>

          <!--热门推荐产品-->

          <div class="mintBox">
            <!-- <mt-loadmore :top-method="loadTop1"
                         :bottom-method="loadBottom1"
                         :auto-fill="false"
                         ref="loadmore1"> -->

              <ul class="xeProd_ul" v-if="isClassifyPro">
                <li class="xeProd_item"
                    v-for="(item,index) in hotProducts"
                    @click="goGoodDetails(item.id,uid,sm,index)">
                  <div class="xeProd_up">
                    <div class="xeProd_img">
                      <img :src="urlImg+item.thumb">
                    </div>
                    <div class="xeProd_infos">
                      <h1 class="xeProd_name">{{item.name}}</h1>
                      <p class="xeProd_mans"><i>{{item.apply_num}}</i>人申请</p>
                    </div>
                  </div>

                  <div class="xeProd_down">
                    <h2 class="xeProd_range" v-if="item.max_money!=0">{{item.min_money +'~'+ item.max_money}}</h2>
                    <p class="xeProd_txt1" v-if="item.max_money!=0">额度范围(元)</p>
                    <p class="xeProd_txt2" v-if="description_show">{{item.clearing_form}}</p>
                    <div class="xeProd_intro"  v-if="description_show">{{item.fy_ms}}</div>
                  </div>

                  <img v-if="item.isHot" src="/static/images/product/icon_dj.png" class="dj">
                </li>
              </ul>

            <!-- </mt-loadmore> -->
          </div>

        </div>
      </div>

      <!--信用卡贷款-->
      <div v-else-if="this.$route.query.id == firstCate[1].id">

        <div class="xykProdus">

          <div class="mintBox">
            <!-- <mt-loadmore :top-method="loadTop3"
                         :bottom-method="loadBottom3"
                         :auto-fill="false"
                         ref="loadmore3"> -->

              <ul>
                <li v-for="item in xykProducts"
                    @click="goGoodDetails(item.id,uid,sm)"
                    class="xykProdu">
                  <div class="xykProdu_top">
                    <div class="xykProdu_img"><img :src="urlImg+item.thumb"></div>
                    <h1 class="xykProdu_name">{{item.name}}</h1>
                    <p class="xykProdu_mans">申请人数：{{item.apply_num}}</p>
                  </div>

                  <div class="xykProdu_mid">
                    <img :src="urlImg+item.background">
                  </div>

                  <div class="xykProdu_bottom">
                    <div class="xykProdu_bottom_left">
                      <div>
                        <h2 class="xykProdu_tg">{{item.name}}推广</h2>
                        <span class="xykProdu_js">{{item.clearing_form}}</span>
                      </div>
                      <p class="xykProdu_tgPercent">预通过率：{{item.loan_success}}%</p>
                    </div>

                    <span class="xykProdu_profit" v-if="description_show">{{item.fy_ms}}</span>
                  </div>
                </li>
              </ul>
            <!-- </mt-loadmore> -->
          </div>

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
              <div class="link_div">

                {{linkInfo.url}}
              </div>
            </div>

          </div>
        </div>
      </div>
      <!--链接式推广的页面 end  -->

<div style="height:1rem"></div>
</div>
</template>

<script>
  import ProductList from '@/components/common/product.vue';
  import {selectTableInfo ,selectTableInfoP} from '@/config/utils';
  import {loadmore,Toast,Indicator} from 'mint-ui';
  import axios from 'axios';
  import productItem from '@/components/common/posterItem';
  import Clipboard from 'clipboard';/*剪切板*/
  import { qrcanvas } from 'qrcanvas';
  import html2canvas from 'html2canvas';
  import auth from '@/services/auth.js';
  var xe_kinds = [{
    'txt':'热门默认推荐',
    'isOn':'1'
  },
  // {
  //   'txt':'最新上架排序',
  //   'isOn':'0'
  // },{
  //   'txt':'下款率排序',
  //   'isOn':'0'
  // },
  {
    'txt':'大额借款',
    'isOn':'0'
  },{
    'txt':'小额借款',
    'isOn':'0'
  },{
    'txt':'申请专区',
    'isOn':'0'
  }
  ];
     var xyk_kinds = [{
    'txt':'秒批专区',
    'isOn':'1'
  },
  {
    'txt':'高端白金',
    'isOn':'0'
  }
  ];

 var posters = [
                  '/static/poster/shop_img/shop01.png',
                  '/static/poster/shop_img/shop02.png',
                  '/static/poster/shop_img/shop03.png',
                  '/static/poster/shop_img/shop04.png',
                ];
  var linkInfo = {
    'codeSrc':'/static/images/product/ewm_code.png',
    'link':'https://kyb.9699963.cn/s/d/F7DHAu'
  };
    export default{
      name: 'myShop',
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
        'ProductList':ProductList,
        'productItem':productItem,
      },
      data: function () {
        return{
          defaultTx:'/static/images/index/logo.png',//默认头像
          choosed:0,//等同于小额贷款下面的分类的下标
          shopInfo: '',
          posters: posters,//展示的海报
          linkInfo:{},//推广的链接+二维码
          hbIsShow:false,
          linkIsShow:false,
          curPoster:null,
          hbConsShow:true,
          productItemShow:false,
          isHotCate:false,//是否是热门分类
          curCate:0,//当前一级分类
          xe_kinds:xe_kinds,//推小额下面的分类
          firstCate:'',//一级分类
          hotProducts:[],//热门产品
          xykProducts:[],//信用卡产品列表
          isClassifyPro:true,//当前展示的是否为按分类排序的产品
          pageNumXyk:1,//信用卡产品的页数
          pageNumSmallH:1,//推广借贷(1)的页数
          pageNumSmallN:1,//推广借贷(2)的页数
          pageNumSmallA:1,//推广借贷(3)的页数
          pageNumSmallB:1,//推广借贷(4)的页数
          pageNumSmallS:1,//推广借贷(5)的页数
          pageNumSmallSQ:1,//推广借贷(6)的页数
          allLoaded1H:false,//是否禁止推荐小额(1)的加载更多
          allLoaded1N:false,//是否禁止推荐小额(2)的加载更多
          allLoaded1A:false,//是否禁止推荐小额(3)的加载更多
          allLoaded1B:false,//是否禁止推荐小额(4)的加载更多
          allLoaded1S:false,//是否禁止推荐小额(5)的加载更多
          allLoaded1SQ:false,//是否禁止推荐小额(6)的加载更多
          allLoaded3:false,//是否禁止信用卡产品的加载更多
          uid:0,
          imgUrl:[],
          clickTime:0,
          imageSave:'',//头像地址
          myShopTopIsShow: true,//点击预览改变这个值
          editStatus:0,//点击预览之后的返回值  200成功  400有问题
          isSystemPage:true,//判断系统和推广底部链接显示
          isSystemhead:true,//判断头部信息显示
          isSet:'',//0表示是在首页点进来的  1表示是从个人中心点进来的
          c_type:'',//产品分类的id
          urlImg:process.env.API_HOST,//图片域名
          shares:null,//定义标示分享
          indexImg:'',//海报图点击标示单张图片
          ImgUrlState:true,//海报图点击标示单张图片点击一次防止重复点击
          sm:"",
          description_show:true,//产品部分显示
        }
      },
      methods: {
        pSwiperInit: function () {

          var  swiper = new Swiper('.kinds_container', {
            spaceBetween: 10,
            initialSlide :0,
            slidesPerView : 'auto',
            observer:true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents:true//修改swiper的父元素时，自动初始化swiper
          })

        },


        pSwiperInit02: function () {

          var  swiper = new Swiper('.kinds_container01', {
            spaceBetween: 10,
            initialSlide :0,
            slidesPerView : '4',
            observer:true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents:true//修改swiper的父元素时，自动初始化swiper
          })

        },



        chooseCurKind: function (index) {
          this.choosed = index;
          switch (index) {
            case 0://点击的是热门默认推荐
              this.isClassifyPro = true;
              this.getHotProducts(this.pageNumSmallH);
              break;
            // case 1://点击的是最新上架排序
            //   this.isClassifyPro = true;
            //   this.getNewsProduct(this.pageNumSmallN);
            //   break;
            // case 2://点击的是按申请人数展示
            //   this.isClassifyPro = true;
            //   this.getDownAccountProducts(this.pageNumSmallA);
            //   break;
            case 1://大额放款
              this.isClassifyPro = true;
              this.getBigMoneyProducts(this.pageNumSmallB);
              break;
            case 2://小额放款
              this.isClassifyPro = true;
              this.getSmallMoneyProducts(this.pageNumSmallS);
              break;
            case 3://点击的是申请专区
              this.isClassifyPro = true;
              // this.isApply = true;
              this.getApplyProduct(this.pageNumSmallSQ);
              break;
          }
        },
        //返回上一页
        goBack() {
          this.$router.go(-1);
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


        changeTab: function (id,index) {
          this.curCate = index;
          this.c_type = id;
         this.$router.push({name:'myShop',query:{uid:this.uid,id:id,index:index}});
        },
        showPoster: function () {
          this.hbIsShow = !this.hbIsShow;
        },
        showLinsk: function () {
          this.linkIsShow = !this.linkIsShow;
        },
        goGoodDetails: function (_pid,_uid,_sm,_dis) {
          if(_dis==0 || _dis==1){
              this.$router.push({
                path:'/product_details',
                query:{pid:_pid ,uid:_uid,sm:_sm,dis:'smg'}
            });
          }else{
            this.$router.push({
                path:'/product_details',
                query:{pid:_pid ,uid:_uid,sm:_sm}
            });
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
        getDifId: function (index) {
          return 'code_'+ index;
        },

        showPosterImg: function () {
          if(this.shopInfo.grade_id == 1){
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
          var canvas2 = qrcanvas({
            data: decodeURIComponent(this.linkInfo.url),
            size:70,
          });
          document.getElementById(_id).innerHTML = '';
          document.getElementById(_id).appendChild(canvas2);
          if(id==0){
            document.getElementById(_id).setAttribute('style','position: absolute;bottom: 24px;left: 115px;');
          }
          if(id==1){
            document.getElementById(_id).setAttribute('style','position: absolute;bottom: 9px;left: 46px;');
          }
          if(id==2||id==3){
            document.getElementById(_id).setAttribute('style','position: absolute;bottom:12px;left: 18px;');
          }

          let that = this;
          // console.log(that.$refs.box[id]);
          html2canvas(that.$refs.box[id],{backgroundColor: null}).then(function(canvas) {
            that.imgUrl.push((canvas.toDataURL()))

          });
        },

        //base64转blob
        base64ToBlob:function(code) {
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
          if(this.shopInfo.grade_id == 1){
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

            //获取一级分类
          async getFirstCates() {
            let _firstCates = await selectTableInfo('products/cate');
            this.firstCate = _firstCates.data;
          },
          //获取热门产品
          async getHotProducts(pageNum) {
            let param = {type: 1,pageSize: 1000, Hotspot: 1,page:pageNum};
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
            let param = {type: 1,pageSize:1000,page:pageNum};
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
          //推广信用卡的产品列表
          async getXykProduct() {
            let param = {type: 49,pageSize:1000,page:this.pageNumXyk++};
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


          //获取按下载数量展示的产品
          async getDownAccountProducts(pageNum) {
            let param = {type: 1,pageSize: 600,page:pageNum};
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
          //获取按大额贷款展示的产品
            async getBigMoneyProducts(pageNum) {
              let param = {type: 1,size:1,pageSize: 600,page:pageNum};
              let _downAccountProducts = await selectTableInfo('products/type',param);
              if(_downAccountProducts.data.length < 6){
                this.allLoaded1B = true;
              };
              this.hotProducts = _downAccountProducts.data;
            },
            ////loadMore大额贷款展示的产品
            async getMoreBigMoneyProducts(){
              let param = {type: 1,size:1,pageSize: 6,page:this.pageNumSmallB++};
              let _downAccountProducts = await selectTableInfo('products/type',param);
              if(_downAccountProducts.data.length < 6){
                this.allLoaded1B = true;
                this.pageNumSmallB = this.pageNumSmallB -1;
              };
              this.hotProducts = this.hotProducts.concat(_downAccountProducts.data);
            },
            //获取按小额贷款展示的产品
            async getSmallMoneyProducts(pageNum) {
              let param = {type: 1,size:2,pageSize: 600,page:pageNum};
              let _downAccountProducts = await selectTableInfo('products/type',param);
              if(_downAccountProducts.data.length < 6){
                this.allLoaded1S = true;
              };
              this.hotProducts = _downAccountProducts.data;
            },
            ////loadMore小额贷款展示的产品
            async getMoreSmallMoneyProducts(){
              let param = {type: 1,size:2,pageSize: 6,page:this.pageNumSmallS++};
              let _downAccountProducts = await selectTableInfo('products/type',param);
              if(_downAccountProducts.data.length < 6){
                this.allLoaded1S = true;
                this.pageNumSmallS = this.pageNumSmallS -1;
              };
              this.hotProducts = this.hotProducts.concat(_downAccountProducts.data);
            },
            //获取申请专区的产品
            async getApplyProduct(pageNum) {
              let param = {type: 1,size:3,pageSize: 600,page:pageNum};
              let _hotProducts = await selectTableInfo('products/type',param);
              if(_hotProducts.data.length < 10){
                this.allLoaded1SQ = true;
              };
              this.hotProducts = _hotProducts.data;
            },
            //获loadMore 申请专区的产品
            async getMoreApplyProduct() {
              let param = {type: 1,size:3,pageSize:10,page:this.pageNumSmallN++};
              let _hotProducts = await selectTableInfo('products/type',param);
              if(_hotProducts.data.length < 10){
                this.pageNumSmallSQ = this.pageNumSmallSQ - 1;
                this.allLoaded1SQ = true;
              };
              this.hotProducts = this.hotProducts.concat(_hotProducts.data);
            },
          //推荐信用卡部分加载更多部分
          loadTop3: function () {
            if(this.allLoaded3){
              Toast({
                message:"已经是最新数据了",
                duration: 1500
              });
            }else{
              this.getXykProduct();
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
         //获取用户信息
        async getUserInfo() {
          let _userInfo = await selectTableInfo('members/'+ localStorage.getItem('member_id'));
          this.shopInfo = _userInfo.data;
        },
        //获取用户信息
        async getUserInfoTwo() {
          let param={
            uid:this.uid,
          }
          let _userInfo = await selectTableInfo('auths/usm', param);
          this.shopInfo = _userInfo.data;
        },
        //上传头像
        imageSubmit(){
          let _tk = auth.getToken();
          let x = document.getElementById('upImg').files[0];
          let params = new FormData() ; //创建一个form对象
          params.append('file',x,x.name);  //append 向form表单添加数据
          params.append('actk',_tk);
          //添加请求头  通过form添加的图片和文件的格式必须是multipart/form-data
          let config = {
            headers:{'Content-Type':'multipart/form-data'}
          };
           axios.post(process.env.API_HOST+"api.php/members/upload",params,config)
            .then(function(res){
              this.imageSave = this.urlImg+res.data.path;
              sessionStorage.setItem('headImg',res.data.path); //将图片保存，并能够在其他地方加载显示
              // 刷新页面，头像改变
            }.bind(this))
            .catch(function (error) {
              console.log(error);
            });
        },

        //提交编辑的店铺信息
        async commitUserInfo() {
            let param = {
              mid: localStorage.getItem('member_id'),
              shop_name:this.shopInfo.shop_name,
              shop_slogan:this.shopInfo.shop_slogan
            };
           let _info = await selectTableInfoP('members/upshop',param);

           this.editStatus = _info.data.status;
           console.log(this.editStatus);

        },
        //点击顶部预览按钮
        showGoodMyShop() {

           this.commitUserInfo();
           this.myShopTopIsShow = !this.myShopTopIsShow;
        },
         //转换短连接
        async sinaUrl(){
          var  _router =location.protocol+"//" + window.location.host +'/myShop?uid='+localStorage.getItem('member_id');
          let param={
              url:_router,
          };
          let _url=await selectTableInfoP('systems/sind-url',param);
          this.linkInfo.url =_url.data.result;
        },
      },

      mounted: function () {
        // this.uid = localStorage.getItem('member_id');
        this.getFirstCates();
        this.getHotProducts();
        this.getXykProduct();
        //当顶部大类切换,刷新页面时保证那个底部的蓝色线条在对应的位置
        if(this.$route.query.index){
          this.curCate = this.$route.query.index;
        }else{
          this.curCate = 0;
        }
        //判断推广外页和系统内页
        if(this.$route.query.uid==undefined||this.$route.query.uid == ''){
           this.isSystemhead=true;
          this.isSystemPage=true;
          this.uid = '';
          this.getUserInfo();
          this.sinaUrl();
        }else if(this.$route.query.uid==localStorage.getItem('shop_id')){
          this.isSystemhead=true;
          this.isSystemPage=false;
          this.uid = this.$route.query.uid;
           this.getUserInfoTwo();
        }else{
           this.description_show=false;//产品部分显示
           this.isSystemhead=false;
          this.isSystemPage=false;
          this.uid = this.$route.query.uid;
          this.getUserInfoTwo();
        };

        if(this.$route.query.id == 1 || this.$route.query.id == undefined){
          this.pSwiperInit();
        }
        //  this.linkInfo.url = window.location.href+"?uid=" + localStorage.getItem('member_id');
         this.isSet = this.$route.query.isSet;
         if(this.isSet == 1){
           this.myShopTopIsShow = true
         }else{
           this.myShopTopIsShow = false
         }
      },

      updated:function() {
        this.pSwiperInit();
        this.pSwiperInit02();
      }
    }
</script>

<style scoped>
  input::-webkit-input-placeholder{color: #666;font-size: 16px;}
  /* .topFix{position: fixed;width: 100%;top:0;left: 0;z-index: 2;} */
  .myShopTop{width: 100%;height: 3.8rem;background:url("/static/images/myShop/shopBg.png") no-repeat;padding: 0.4rem 0.26rem 0 0.26rem;position: relative;background-size: 100% auto;z-index: 2;}
  .myShopTop_gn{display: flex;justify-content: space-between;align-items: center;padding: 0.2rem;position: relative;}
  .myShopTop_gn span{font-size: 0.3rem;color: #333;}
  .myShopTop_gn img{height: 0.4rem;}
  #upImg{position: absolute;left: 0;top:0.2rem;width: 0.4rem;opacity: 0;}
  .shopName{text-align: center;font-size: 0.28rem;color: #000;margin-bottom: 0.2rem;}
  .shopSlogan{font-size: 0.24rem;color: #000;text-align: center;}
  .shopImg{width: 1.6rem;height:1.6rem;border-radius: 50%;overflow: hidden;position: absolute;left: 50%;margin-left: -0.8rem;
    bottom: -0.1rem;box-shadow: 0 0 10px #fff;display: flex;align-items: center;border: 1px solid #eee;}
  .shopImg img{width: 100%;}
  .editDiv input{background: transparent;border: none;display: inline-block;width: auto;}
  .editDiv input::-webkit-input-placeholder {

    font-size: 0.28rem !important;

    color: #666 !important; /* WebKit browsers */

  }

  .editDiv input:-moz-placeholder {

    font-size: 0.28rem !important;

    color: #666 !important; /* Mozilla Firefox 4 to 18 */

  }

  .editDiv input::-moz-placeholder {

    font-size: 0.28rem !important;

    color: #666 !important; /* Mozilla Firefox 19+ */

  }

  .editDiv input:-ms-input-placeholder {

    font-size: 0.28rem !important;

    color: #666 !important; /* Internet Explorer 10+ */

  }
  .editDiv div{margin-bottom: 0.1rem!important;display: flex;align-items: center;justify-content: center;}
  .shopSlogan input{color: #333;}
  .shopName input{color: #333;}
  .showDiv{margin-top: 0.4rem;}
  .product{overflow: hidden;}
  .topTabs{background: #fff;position: relative;z-index: 1;}
  .topTabs ul{display: flex;padding: 0.28rem 0 0.1rem 0;background: #fff;justify-content: center;}
  .topTabs li{display: flex;align-items: center;justify-content: center;position: relative;width: auto; }
  .topTabs li:nth-child(4){border-right: none;}
  .topTabs li img{width: 0.34rem;}
  .topTabs li span{font-size: 0.28rem;color: #333;margin-left: 0.1rem;margin-bottom: 0.12rem;font-weight: 700;}
  .topTabs li img.hot{position: relative;top:-0.3rem;right: 0;width: 0.46rem;}
  .bLine{position: absolute;width: 0.68rem;bottom:-0.1rem;height: 2px;background:#fcc270;border-radius: 0.1rem;}
  .xe_kinds{display: flex;padding: 0.2rem;background: #fff;margin-top: 0.1rem;width: 100%;overflow: hidden;text-align: center;}
  .kinds_box{width: auto;overflow-x: auto;}
  .xe_kinds .kind{display: inline-block;padding: 0.1rem 0.22rem;border-radius: 0.6rem;background: #efefef;font-size: 0.24rem;color: #333;width: auto;}
  .xe_kinds .kind.on{background: #ffd293;color: #fff;}
  .xeLists{background: #fff;overflow: scroll;height: 100%;}
  .xeLists_ad{font-size: 0.22rem;color: #f1604e;text-align: center;padding-top: 0.2rem;}
  .xeProd_ul{display: flex;flex-wrap: wrap;padding: 0.26rem;justify-content: space-between;}
  .xeProd_ul li{width: 48%;padding: 0.2rem;background: #fff;margin-bottom: 0.2rem;border-radius: 2px;box-shadow: 0 0 2px #ccc;position: relative;}
  .xeProd_ul li:nth-child(1){background: #f0927d;}
  .xeProd_ul li:nth-child(2){background: #5092f7;}
  .xeProd_ul li:nth-child(1) .xeProd_name{color: #fff;}
  .xeProd_ul li:nth-child(1) .xeProd_mans{color: #fff;}
  .xeProd_ul li:nth-child(1) .xeProd_mans i{color: #fff;}
  .xeProd_ul li:nth-child(1) .xeProd_range{color: #fff;}
  .xeProd_ul li:nth-child(1) .xeProd_txt1{color: #fff;}
  .xeProd_ul li:nth-child(1) .xeProd_txt2{color: #fff;}
  .xeProd_ul li:nth-child(1) .xeProd_intro{color: #f0927d;background: #fff;}

  .xeProd_ul li:nth-child(2) .xeProd_name{color: #fff;}
  .xeProd_ul li:nth-child(2) .xeProd_mans{color: #fff;}
  .xeProd_ul li:nth-child(2) .xeProd_mans i{color: #fff;}
  .xeProd_ul li:nth-child(2) .xeProd_range{color: #fff;}
  .xeProd_ul li:nth-child(2) .xeProd_txt1{color: #fff;}
  .xeProd_ul li:nth-child(2) .xeProd_txt2{color: #fff;}
  .xeProd_ul li:nth-child(2) .xeProd_intro{color: #5092f7;background: #fff;}
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
  .tg_ways{display: flex;justify-content: space-around;position: fixed;width: 100%;bottom:0.2rem;left: 0;}
  .tg_ways div{width: 40%;height: 0.6rem;border-radius: 0.6rem;color: #fff;font-size: 0.26rem;box-shadow: 1px 2px 10px #eb5856;text-align: center;line-height: 0.6rem;}
  .closeLink{position: absolute;right:0.2rem;top:0.2rem;width: 0.6rem;height: 0.36rem;border-radius: 1rem;background: #eee;text-align: center;line-height: 0.36rem;font-size: 0.3rem;color: #000;font-weight: bold;}

  .tg_hb{background: linear-gradient(90deg,#ff6841,#ff8026);}
  .tg_lj{background: linear-gradient(90deg,#f05a49,#ff2b71);}
  .today_tj{padding: 0.2rem 0.2rem 0 0.2rem;overflow: scroll;height: 100%;}
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
  .prodct_adv div span{font-size: 0.26rem;color: #999;}
  .prodct_item_down2{background: #f4f4f4;padding: 0.2rem 0.1rem;margin-top: 0.2rem;font-size: 0.26rem;color: #848484;line-height: 0.38rem;}
  .xykProdus{padding: 0.2rem;overflow: scroll;height: 100%;}
  .xykProdu{background: #fff;margin-bottom: 0.2rem;padding: 0.2rem;}
  .xykProdu_top{display: flex;align-items: center;}
  .xykProdu_img{width: 0.68rem;height: 0.68rem;overflow: hidden;border-radius: 4px;margin-right: 0.2rem;}
  .xykProdu_img img{width: 100%;}
  .xykProdu_name{font-size: 0.28rem;color: #333;margin-right: 0.2rem;}
  .xykProdu_mans{font-size: 0.24rem;color: #999;}
  .xykProdu_mid{margin: .2rem .14rem 0;padding-bottom: .293333333333333rem;}
  .xykProdu_mid img{vertical-align: top;width: 6.546667rem;height: 1.906666666666667rem;}
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
  .link_cons>img{width: 100%;}
  .ewm_box{width: 2.8rem;margin:0.4rem auto 0 auto;overflow: hidden;text-align: center;}
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
  .hb_cons_listBOX{position: fixed;top:0;}
  .creat-img{position: relative;width: 300px!important;}
  .code{position: absolute;bottom: 0.1rem;left: 0.1rem;}
  /* .mintBox{height: 10rem;} */
</style>
