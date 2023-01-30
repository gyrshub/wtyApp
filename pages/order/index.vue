<template>
	<view class="order">
		<view :style="{ height:statusBarHeight + 10 + 'px',backgroundColor:'#fff' }"></view>
		<view class="orderStatus">
			<view @click="changeStatus(1)" :class="['orderStatus_btn',{active:status == 1}]">待核销订单</view>
			<view class="top_line"></view>
			<view @click="changeStatus(0)" :class="['orderStatus_btn',{active:status == 0}]">已核销订单</view>
		</view>
		<view class="orderList">
			<view class="order_item" v-for="(item,index) in orderList" :key="index">
				<view class="order_no">订单编号：{{item.orderNo}}</view>
				<view class="order_content">
					<image class="order_img" :src="item.goodsPicture"></image>
					<view class="order_info">
						<view class="info_left">
							<view class="order_goodsName">{{item.goodsName}}</view>
							<view class="order_time">下单时间：{{item.createTime}}</view>
							<view class="order_time" v-if="merchantType == 0">入离时间：{{item.showTime}}</view>
							<view class="order_mess" v-if="merchantType == 0">预留信息：{{item.guestName}} {{item.contactPhone}}</view>
							<view class="order_mess" v-if="merchantType != 0">预留信息：{{item.nickName}} {{item.phone}}</view>
						</view>
						<view class="info_right">
							<view style="color: #3B3D3D;">结算价</view>
							<view class="price">{{item.realTotalMoney}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="tarbarHeight"></view>
		<tarbar :current='2'></tarbar>
	</view>
</template>

<script>
	import tarbar from '@/component/tarbar/tarbar.vue'
	export default {
		data() {
			return {
				statusBarHeight: 0,
				status:1, // 1 有效订单 0 无效订单
				merchantType:0,
				orderList:[],
				queryForm:{
					current:1,
					size:10,
					orderState:30,
					merchantId:''
				},
				total:10,
				overContent:true,
			};
		},
		created() {
			let statusBarHeight = getApp().globalData.statusBarHeight; //高度
			this.statusBarHeight = statusBarHeight;
			uni.hideTabBar()
			this.getUser()
		},
		onReachBottom() {
			// 触底的时候请求数据，即为上拉加载更多
			var allTotal = this.queryForm.current * this.queryForm.size
			if (allTotal < this.total && this.overContent) {
				this.overContent = false;
				this.queryForm.current++;
				this.getOrderList();
			}
		},
		components:{
			tarbar
		},
		methods:{
			async getUser(){
				let res = await this.$get('/merchant/info')
				// console.log('结果',res)
				if(res.code == 200){
					this.queryForm.merchantId = res.data.id
					this.merchantType = res.data.merchantType
					this.getOrderList()
				}
			},
			// 获取订单
			async getOrderList(){
				let res = await this.$get('/merchant/order/page',this.queryForm)
				// console.log('订单结果',res)
				if(res.code == 200){
					this.total = res.data.total
					this.overContent = true;
					res.data.records.map(d=>{
						if(d.contactPhone){
							d.guestName = d.guestName.substring(0, 1) + '**'
							d.contactPhone = d.contactPhone.substring(0, 3) + "****" + d.contactPhone.substr(d.contactPhone.length-4);
						}
						d.nickName = d.nickName.substring(0, 1) + '**'
						d.phone = d.phone.substring(0, 3) + "****" + d.phone.substr(d.phone.length-4);
						d.realTotalMoney = d.realTotalMoney / 100 + '元'
						d.createTime = d.createTime.substring(0,d.createTime.length-3)
						if(this.merchantType == 0){
							d.showTime = this.calculateTime(d.startTime,d.endTime).timeStr
						}
					})
					this.orderList = this.orderList.concat(res.data.records)
				}else{
					this.queryForm.current--;
					this.overContent = true;
				}
			},
			async changeStatus(index){
				if(this.status == index)return
				this.status = index
				if(this.status == 1){
					this.queryForm.orderState = 30
				}else{
					this.queryForm.orderState = 40
				}
				this.queryForm.current = 1
				this.overContent = true
				this.orderList = []
				this.getOrderList()
			},
			// 计算时间
			      calculateTime(start, end) {
			        let startTime = new Date(start)
			        let endTime = new Date(end)
			        let sY = startTime.getFullYear()
			        let sM =
			          startTime.getMonth() + 1 >= 10
			            ? startTime.getMonth() + 1
			            : '0' + (startTime.getMonth() + 1)
			        let sD =
			          startTime.getDate() >= 10
			            ? startTime.getDate()
			            : '0' + startTime.getDate()
			        let costTime = Math.floor(
			          (endTime.getTime() - startTime.getTime()) / 24 / 3600000
			        )
			        let eY = endTime.getFullYear()
			        let eM =
			          endTime.getMonth() + 1 >= 10
			            ? endTime.getMonth() + 1
			            : '0' + (endTime.getMonth() + 1)
			        let eD =
			          endTime.getDate() >= 10 ? endTime.getDate() : '0' + endTime.getDate()
			        let check = String(sM) + '.' + String(sD)
			        let leave = String(eM) + '.' + String(eD)
			        let timeStr = check + '-' + leave
			        return { timeStr, costTime }
			      },
		}
	}
</script>
<style>
	page{
		background-color: #F7F8FB;
		height: 100vh;
	}
</style>
<style lang="less" scoped>
.order{
	.orderStatus{
		padding: 20rpx 60rpx;
		display: flex;
		justify-content: space-between;
		background-color: #FFF;
		.orderStatus_btn{
			border-radius: 24rpx;
			background-color: #FFF;
			border:1px solid #3173FF;
			color: #3173FF;
			font-size: 36rpx;
			padding: 8rpx 50rpx;
		}
		.top_line{
			width: 12rpx;
			border-radius: 20px;
			background: #3173FF;
		}
		.active{
			background: #3173FF;
			color: #FFF;
		}
	}
	
	.orderList{
		padding: 0 20rpx;
		.order_item{
			margin-top: 20rpx;
			background-color: #FFF;
			border-radius: 20rpx;
			padding: 20rpx 40rpx;
			box-sizing: border-box;
			.order_no{
				font-size: 24rpx;
				color: #969699;
				transform: scale(0.8);
				transform-origin: center left;
				border-bottom: 1px solid #D8D8D8;
			}
			.order_content{
				padding: 16rpx 0 0 16rpx;
				box-sizing: border-box;
				display: flex;
				font-size: 24rpx;
				.order_img{
					width: 154rpx;
					height: 154rpx;
					flex-shrink: 0;
					margin-right: 20rpx;
				}
				.order_info{
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: space-between;
					color: #3D3D3D;
					overflow: hidden;
					.info_left{
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						flex: 1;
						margin-right: 10rpx;
						overflow: hidden;
						.order_goodsName{
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
						}
						.order_time{
							color: #979797;
							transform: scale(0.8);
							transform-origin: left center;
						}
						.order_mess{
							margin-top: 4rpx;
						}
					}
					.info_right{
						width: 100rpx;
						flex-shrink: 0;
						display: flex;
						flex-direction: column;
						align-items: center;
						.price{
							font-size: 32rpx;
							color: #3173FF;
							white-space: nowrap;
						}
					}
				}
			}
		}
	}
}
</style>
