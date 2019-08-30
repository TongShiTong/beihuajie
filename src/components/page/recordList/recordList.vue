<template>
    <div class="salary">

        <div class="head">
            <i class="iconfont icon-zuo" @click="goBack"></i>
            <h1>{{whichList == 1 ? '提现记录' : '收入记录'}}</h1>
            <i></i>
        </div>

        <div>

            <div class="incomeRecord">
                <div class="incomeTitle" v-if="whichList == 1">
                    <p>金额</p>
                    <p>审核时间</p>
                    <p>状态</p>
                </div>

                <div class="incomeTitle" v-if="whichList == 2">
                    <p>金额</p>
                    <p>申请时间</p>
                    <p>返佣渠道</p>
                    <p>返佣名称</p>
                </div>

                <div class="recordLists">

                    <mt-loadmore :bottom-method="loadBottom"
                                 :bottom-all-loaded="allLoaded"
                                 :auto-fill = "false"
                                 ref="loadmore">

                        <div v-for="item in withdrawList" class="recordItem"
                             v-if="whichList == 1">
                            <p>{{item.money}}</p>
                            <p>{{Number(item.create_time+'000') | formatDate}}</p>
                            <p>{{
                                item.status == 1 ? '待审核' :
                                item.status == 3 ? '审核未通过' :
                                item.status == 4 ? '提现成功' : '审核通过'
                                }}</p>
                        </div>

                        <div v-for="item in incomeList" class="recordItem"
                             v-if="whichList == 2">
                            <p>{{item.commission_money}}</p>
                            <p>{{Number(item.created_time+'000') | formatDate}}</p>
                            <p>{{item.msg}}</p>
                            <p>{{item.p_name}}</p>
                        </div>


                    </mt-loadmore>


                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import {selectTableInfo} from '@/config/utils';
    import {formatDate,subStrFun} from '@/../static/js/function.js';
    import {Toast,loadmore} from 'mint-ui';

    export default{
        name: 'recordList',
        components:{
          'mt-loadMore':loadmore
        },
        data: function () {
            return {
                curRecode:0,
                incomeList:[],//推广收入
                withdrawList:[],//提现记录
                whichList:1,//1=>提现记录 2=>收入记录
                allLoaded:false,//是否禁止上拉下拉
                page:2,
            }
        },
        filters: {
            formatDate(time) {
                var date = new Date(time);
                return formatDate(date, 'yyyy-MM hh:mm');
            },//时间
            subStrFun(value) {
                return subStrFun(value);
            }//截取字符串

          },
        methods: {

            //推广收入
            async getIncomeList() {
                let _incomeList = await selectTableInfo('members/record?pageSize=10&type=2&page=1&mid='+ localStorage.getItem('member_id'));

                this.incomeList = _incomeList.data;

            },
            //更多推广收入
            async getMoreIncomeList() {
                let _incomeList = await selectTableInfo('members/record?pageSize=10&type=2&mid='+ localStorage.getItem('member_id') + '&page=' + this.page++);

                if(_incomeList.data.length < 10 && _incomeList.data.length > 0){
                    Toast({message:'没有更多了~',duration:1500});
                    this.incomeList =this.incomeList.concat( _incomeList.data);
                }else if(_incomeList.data.length <= 0){
                    Toast({message:'没有更多了~',duration:1500});
                    this.page -- ;
                }else{
                    this.incomeList =this.incomeList.concat( _incomeList.data);
                }
            },

            //提现收入
            async getWithdrawList() {
                let _withdrawList = await selectTableInfo('members/record?pageSize=10&page=1&type=1&mid='+ localStorage.getItem('member_id'));
                this.withdrawList = _withdrawList.data;

            },
            //更多提现收入
            async getMoreWithdrawList() {
                let _withdrawList = await selectTableInfo('members/record?pageSize=10&type=1&mid='+ localStorage.getItem('member_id') + '&page=' + this.page++);

                if(_withdrawList.data.length < 10 && _withdrawList.data.length > 0){
                    Toast({message:'没有更多了~',duration:1500});
                    this.withdrawList = this.withdrawList.concat( _withdrawList.data);
                }else if(_withdrawList.data.length <= 0){
                    Toast({message:'没有更多了~',duration:1500});
                    this.page--;
                }else{
                    this.withdrawList = this.withdrawList.concat( _withdrawList.data);
                }
            },

            //返回上一页
            goBack() {
                this.$router.go(-1);
            },

            // 上拉加载
            loadBottom:function() {
                switch (parseInt(this.whichList)){
                    case 1:
                        this.getMoreWithdrawList();
                        this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位,如果没有这个方法,触发上拉事件后,那个底部的加载文本会一直显示,不消失
                        break;
                    case 2:
                        this.getMoreIncomeList();
                        this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位,如果没有这个方法,触发上拉事件后,那个底部的加载文本会一直显示,不消失
                        break;
                }


            },

        },
        mounted: function() {
            this.getIncomeList();
            this.getWithdrawList();
            this.whichList = this.$route.query.list;
        }
    }
</script>

<style scoped>
    .salary{height: 100%;background: #fff;padding:0 0  0.34rem 0;}
    .salaryInfo div{display: flex;justify-content: space-between;align-items: center;padding: 0.34rem 0.26rem 0.34rem 0;}
    .salaryInfo h1{font-size: 0.28rem;color: #333;}
    .salaryInfo p{font-size: 0.26rem;color: #999;}
    .recordKins div{font-size: 0.28rem;color: #333;}
    .incomeTitle{display: flex;background: #fffcf7;padding: 0.26rem 0.26rem;}
    .incomeTitle p{width: 33.33%;text-align: center;color: #f4c25e;font-size: 0.24rem;}
    .redLine span{display: inline-block;width: 0.6rem;height: 3px;background: #ff2b71;position: absolute;left: 1.6rem;transition: all 500ms;}
    .redLine span.on{left: calc(100% - 2.2rem);}
    .recordItem{display: flex;padding: 0.2rem 0.26rem;}
    .recordItem p{width: 33.33%;font-size: 0.26rem;color: #666;text-align: center;}
    .noRecord img{width: 3rem;margin-bottom: 0.2rem;margin-top: 1rem;}
    .noRecord p{font-size: 0.28rem;color: #999;}
</style>
