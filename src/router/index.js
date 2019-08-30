import Vue from 'vue';
import Router from 'vue-router';
import me from '@/components/page/me/me';
import index from '@/components/page/index/index';
import product from '@/components/page/product/product';
import product_details from '@/components/page/product_details/product_details';
import guideClass from '@/components/page/guideClass/guideClass';
import scanCode from '@/components/page/scanCode/scanCode';
import mails from '@/components/page/mails/mails';
import mailDetails from '@/components/page/mailDetails/mailDetails';
import myShop from '@/components/page/myShop/myShop';
import myTeam from '@/components/page/myTeam/myTeam';
import myCustom from '@/components/page/myCustom/myCustom';
import moreQuestion from '@/components/page/moreQuestion/moreQuestion';
import questionDetails from '@/components/page/questionDetails/questionDetails';
import salary from '@/components/page/salary/salary';
import recommend from '@/components/page/recommend/recommend';
import setting from '@/components/page/setting/setting';
import demo from '@/components/page/demo/demo';
import login from '@/components/page/login/login';
import invite from '@/components/page/invite/invite';
import articleDetails from '@/components/page/articleDetails/articleDetails';
import idCard from '@/components/page/idCard/idCard'
import vip from '@/components/page/vip/vip';
import payOrder from '@/components/page/payOrder/payOrder';
import withdraw from '@/components/page/withdraw/withdraw';
import bindAccount from '@/components/page/bindAccount/bindAccount';
import bindPho from '@/components/page/bindPho/bindPho';
import recordList from '@/components/page/recordList/recordList';
import thirdPage from '@/components/page/thirdPage/thirdPage';
import appDownload from '@/components/page/appDownload/appDownload';
import updataMm from '@/components/page/updataMm/updataMm';
import moreQuest from '@/components/page/moreQuest/moreQuest';
import wyHtml from '@/components/page/wyHtml/wyHtml';
import payHtml from '@/components/page/payHtml/payHtml';

Vue.use(Router);

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      meta:{
        keepAlive:true,
      }
    },{
      path: '/me',
      name: 'me',
      component: me,
      meta:{
        requireAuth: true
      }
    },{
      path: '/product',
      name: 'product',
      component: product,
      meta:{
        requireAuth: true
      }
    },{
      path: '/product_details',
      name: 'product_details',
      component: product_details,
      meta:{
        requireAuth: true
      }
    },{
      path: '/guideClass',
      name: 'guideClass',
      component: guideClass,
    },{
      path: '/scanCode',
      name: 'scanCode',
      component: scanCode,
    },{
      path: '/mails',
      name: 'mails',
      component: mails,
    },{
      path: '/mailDetails',
      name: 'mailDetails',
      component: mailDetails,
    },{
      path: '/myShop',
      name: 'myShop',
      component: myShop,
      meta:{
        requireAuth: true
      }
    },{
      path: '/myTeam',
      name: 'myTeam',
      component: myTeam,
      meta:{
        requireAuth: true
      }
    },{
      path: '/myCustom',
      name: 'myCustom',
      component: myCustom,
      meta:{
        requireAuth: true
      }
    },{
      path: '/moreQuestion',
      name: 'moreQuestion',
      component: moreQuestion,
    },{
      path: '/questionDetails',
      name: 'questionDetails',
      component: questionDetails,
    },{
      path: '/salary',
      name: 'salary',
      component: salary,
    },{
      path: '/recommend',
      name: 'recommend',
      component: recommend,
      meta:{
        requireAuth: true
      }
    },{
      path: '/setting',
      name: 'setting',
      component: setting,
    },{
      path: '/demo',
      name: 'demo',
      component: demo,
    },{
      path: '/login',
      name: 'login',
      component: login,
    },{
      path: '/invite',
      name: 'invite',
      component: invite,
    },{
      path: '/articleDetails',
      name: 'articleDetails',
      component: articleDetails,
    },{
      path: '/vip',
      name: 'vip',
      component: vip,
    },{
      path: '/idCard',
      name: 'idCard',
      component: idCard,
    },{
      path: '/payOrder',
      name: 'payOrder',
      component: payOrder,
    },{
      path: '/withdraw',
      name: 'withdraw',
      component: withdraw,
    },{
      path: '/bindAccount',
      name: 'bindAccount',
      component: bindAccount,
    },{
      path: '/bindPho',
      name: 'bindPho',
      component: bindPho,
    },{
      path: '/recordList',
      name: 'recordList',
      component: recordList,
    },{
      path: '/thirdPage',
      name: 'thirdPage',
      component: thirdPage,
    },{
      path: '/appDownload',
      name: 'appDownload',
      component: appDownload,
    },{
      path: '/updataMm',
      name: 'updataMm',
      component: updataMm,
    },{
      path: '/moreQuest',
      name: 'moreQuest',
      component: moreQuest,
    },{
      path: '/wyHtml',
      name: 'wyHtml',
      component: wyHtml,
    },{
      path: '/payHtml',
      name: 'payHtml',
      component: payHtml,
    }
  ],
  //跳回页面时定位到页面顶部
  scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
});
