<template>
	<view class="order">
		<view class="orderList">
			<view :style="{ height:statusBarHeight + 10 + 'px',backgroundColor:'#fff' }"></view>
			<view class="topBar">
				<image class="topBar_icon" src="../../static/arrow_right.png" @click="toHome"></image>
				<view style="font-size: 36rpx;">
					{{title}}
				</view>
				<image class="topBar_icon" style="opacity: 0;" src="../../static/arrow_right.png"></image>
			</view>
			<view class="order_item" v-for="(item,index) in orderList" :key="index">
				<view class="item_content">
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
				<view class="confirm" @click="confirmOrder(item)">
					{{merchantType == 0?'确认订单':'核销订单'}}
				</view>
			</view>
		</view>
		<view style="height: 80rpx;"></view>
		<view class="model" v-if="showModel">
			<view class="model_box">
				<image class="model_img" src="../../static/success.png"></image>
			</view>
		</view>
		
		<view class="orderModel" v-if="showPopup" @click="closeShow">
			<view class="verification" @click.stop="">
				<view class="item_title">核销功能</view>
				<view class="verification_content">
					<input v-model="verifiy" class="verification_input" type="number" placeholder="请输入核销码" >
					<view class="verification_btn" @click.stop="verificateOrder">
						确认核销
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'确认订单',
				id:'',
				showPopup:false,
				statusBarHeight:0,
				showModel:false,
				merchantType:0,
				chooseOrder:{
					orderNo:'',
					id:''
				},
				orderList:[
					// {
					// 	orderNo:'201645858',
					// 	goodsPicture:'/static/logo.png',
					// 	createTime:"2022.11.09 20:22",
					// 	realTotalMoney:'1460元',//实际支付
					// 	showTime:'11.09-11.10',
					// 	guestNames:'姚**',
					// 	contactPhone:'15622222222',
					// 	goodsName:'【豪华双床房】可带小朋友入住'
					// },
				],
				total:10,
				overContent:true,
				verifiy:'',
				queryForm:{
					pageNo:1,
					pageSize:10,
					orderState:20
				}
			};
		},
		created() {
			let statusBarHeight = getApp().globalData.statusBarHeight; //高度
			this.statusBarHeight = statusBarHeight;
		},
		onLoad(options) {
			this.merchantType = options.merchantType
			this.id = options.id
			if(this.merchantType == 0){
				this.title = '确认订单'
				this.queryForm.orderState = 20
			}else{
				this.title = '核销订单'
				this.queryForm.orderState = 30
			}
			uni.setNavigationBarTitle({
				title:this.title
			})
			this.orderList = []
			this.getOrderList()
		},
		onReachBottom() {
			// 触底的时候请求数据，即为上拉加载更多
			var allTotal = this.queryForm.pageNo * 10
			if (allTotal < this.total && this.overContent) {
				this.overContent = false;
				this.queryForm.pageNo++;
				this.getOrderList();
			}
		},
		methods:{
			async getOrderList(){
				let res = await this.$get('/merchant/order/page',{
					current:this.queryForm.pageNo,
					size:10,
					merchantId:this.id,
					orderState:this.queryForm.orderState
				})
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
					this.queryForm.pageNo--;
					this.overContent = true;
				}
			},
			confirmOrder(item){
				let that = this
				uni.showModal({
					title:'温馨提示',
					content: that.merchantType == 0 ? '是否确认订单？':'是否核销订单？',
					success: async (res)=> {
						if(res.confirm){
							let result = '';
							if(that.merchantType == 0){
								result = await that.$post('/merchant/order/confirm',{
									id:item.id,
									merchantId:this.id
								})
							}else{
								this.chooseOrder = item
								this.showPopup = true
								return
							}
							// console.log('确认结果',result)
							if(result.code == 200){
								that.showModel = true
								that.overContent = true
								that.queryForm.pageNo = 1
								that.orderList = []
								that.getOrderList();
								setTimeout(()=>{
									that.showModel = false
								},1800)
							}
						}
					}
				})
			},
			async verificateOrder(){
				let that = this
				let result = await that.$post('/merchant/order/writeOff',{
					id:this.chooseOrder.id,
					merchantId:this.id,
					writeOffCode:this.verifiy
				})
				if(result.code == 200){
					that.showModel = true
					that.overContent = true
					that.queryForm.pageNo = 1
					that.orderList = []
					that.getOrderList();
					setTimeout(()=>{
						that.showModel = false
					},1800)
					this.closeShow()
				}
			},
			closeShow(){
				this.showPopup = false
				this.chooseOrder = ''
				this.verifiy = ''
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
			toHome(){
				uni.switchTab({
					url:'/pages/index/index'
				})
			}
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
	.orderList{
		padding: 0 20rpx;
		.topBar{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 0;
			.topBar_icon{
				width: 60rpx;
				height: 60rpx;
				transform: rotate(180deg);
			}
		}
		.order_item{
			margin-top: 20rpx;
			background-color: #FFF;
			border-radius: 20rpx;
			.item_content{
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
							height: 100%;
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
			
			.confirm{
				background-color: #3173FF;
				color: #ffffff;
				font-size: 34rpx;
				text-align: center;
				border-radius: 0 0 20rpx 20rpx;
				padding: 12rpx 0;
				&:active{
					background-color: #275ecc;
					color: #999999;
				}
			}
		}
	}
	.verification{
		background-color: #FFF;
		border-radius: 20rpx;
		padding: 20rpx 40rpx;
		.item_title{
			text-align: center;
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
		}
		.verification_content{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.verification_input{
				text-align: center;
				font-size: 40rpx;
				padding: 20rpx 40rpx;
				border-radius: 16rpx;
				border: 1px solid #A7A8AC;
				margin-bottom: 40rpx;
			}
			.verification_btn{
				padding: 20rpx 60rpx;
				border-radius: 80rpx;
				font-size: 36rpx;
				color: #ffffff;
				background: linear-gradient(180deg, #266DFF 0%, rgba(38,109,255,0.69) 100%);
			}
		}
	}
	
	.orderModel{
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #979797;
		z-index: 10;
	}
}
</style>
