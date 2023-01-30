<template>
	<view class="my">
		<view :style="{ height:statusBarHeight + 10 + 'px',backgroundColor:'#fff' }"></view>
		<view class="title">
			<view class="merchantName">
				{{mineInfo.merchantName}}
			</view>
		</view>
		<view class="my_content">
			<view class="user_info">
				<image class="info_bg" src="../../static/bg.png"></image>
				<image class="user_Img" :src="mineInfo.thumbnail"></image>
				<view class="info">
					<view class="info_top">
						<view class="userName">
							{{mineInfo.principal}}
						</view>
						<view class="roleName">
							{{mineInfo.role}}
						</view>
					</view>
					<view class="phone" style="font-size: 48rpx;">{{mineInfo.contactNumber}}</view>
				</view>
			</view>
			
			<view class="order">
				<view class="order_item">
					<view class="order_number">{{mineInfo.customerNumber}}</view>
					<view class="order_text">我的客户</view>
				</view>
				<view class="order_item">
					<view class="order_number">{{mineInfo.totalMoney}}</view>
					<view class="order_text">总佣金</view>
				</view>
				<view class="order_item">
					<view class="order_number">{{mineInfo.withdraw}}</view>
					<view class="order_text">可提现</view>
				</view>
				<view class="order_item">
					<view class="order_number">{{mineInfo.getMoney}}</view>
					<view class="order_text">已提现</view>
				</view>
			</view>
			
			<view class="tool">
				<view class="item_title">常用工具</view>
				<view class="toolList">
					<view class="tool_item" v-for="(item,index) in toolList" :key="index" @click="toTool(item)">
						<image class="tool_icon" :src="item.image"></image>
						<view>
							{{item.name}}
						</view>
					</view>
				</view>
			</view>
			
			<view class="grayline"></view>
			
			<view class="loginOut">
				<view class="loginOut_btn" @click="loginOut">
					退出登录
				</view>
			</view>
		</view>
		<tarbar :current='3'></tarbar>
	</view>
</template>

<script>
	import tarbar from '@/component/tarbar/tarbar.vue'
	export default {
		data() {
			return {
				mineInfo:{
					merchantName:'商家',
					contactNumber:'商家手机号',
					role:'角色',
					principal:'用户名',
					customerNumber:0,
					totalMoney:0,
					withdraw:0,
					getMoney:0,
					thumbnail:''
				},
				toolList:[
					{
						name:'申请提现',
						path:'/pages/my/withdraw',
						image:'../../static/apply.png',
					},
					{
						name:'收支记录',
						path:'/pages/my/income',
						image:'../../static/order.png',
					}
				],
				linkStatus:0,// 0 websocket未接通 1已接通
				statusBarHeight:0,
			}
		},
		created() {
			let statusBarHeight = getApp().globalData.statusBarHeight; //高度
			this.statusBarHeight = statusBarHeight;
			uni.hideTabBar()
		},
		onShow() {
			this.getUser()
		},
		components:{
			tarbar
		},
		methods: {
			async getUser(){
				let res = await this.$get('/merchant/getMerchant')
				//console.log('结果',res)
				if(res.code == 200){
					res.data.customerNumber = res.data.customerNumber == null? 0 : res.data.customerNumber
					res.data.totalMoney = res.data.totalMoney == null? 0 : res.data.totalMoney
					res.data.sevenOrder = res.data.sevenOrder == null? 0 : res.data.sevenOrder
					res.data.withdraw = res.data.withdraw == null? 0 : res.data.withdraw
					res.data.getMoney = res.data.getMoney == null? 0 : res.data.getMoney
					this.mineInfo = res.data
					this.mineInfo.role = uni.getStorageSync('roleName')
				}
			},
			loginOut(){
				uni.showModal({
					title:'温馨提示',
					content:'确定退出登录',
					success(res) {
						if(res.confirm){
							uni.redirectTo({
								url:'/pages/login/index'
							})
						}
					}
				})
			},
			toTool(item){
				uni.showToast({
					title:'功能维护中',
					icon:'none'
				})
				// if(item.path){
				// 	uni.navigateTo({
				// 		url:item.path
				// 	})
				// }else{
				// 	uni.showToast({
				// 		title:'功能维护中',
				// 		icon:'none'
				// 	})
				// }
			}
		}
	}
</script>

<style lang="less" scoped>
.my{
	.title{
		font-size: 48rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 22rpx 40rpx;
		box-sizing: border-box;
		.merchantName{
			width: 70%;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}
	
	.my_content{
		padding: 0 24rpx;
		box-sizing: border-box;
		.user_info{
			position: relative;
			color: #FFFFFF;
			padding: 40rpx;
			box-sizing: border-box;
			display: flex;
			.hidewhile{
				color: rgba(255, 255, 255, 0.6);
			}
			.info_bg{
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				z-index: -1;
			}
			.user_Img{
				width: 180rpx;
				height: 180rpx;
				flex-shrink: 0;
				border-radius: 50%;
				margin-right: 20rpx;
			}
			.info{
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				overflow: hidden;
				.info_top{
					display: flex;
					align-items: center;
					overflow: hidden;
					.userName{
						font-size: 56rpx;
						max-width: 63%;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						margin-right: 10rpx;
						flex-shrink: 0;
					}
					.roleName{
						font-size: 36rpx;
						max-width: 36%;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}
		}
		
		.order{
			color: #636465;
			box-shadow: 3px 2px 7px 2px rgba(100, 100, 100, 0.2);
			display: flex;
			padding: 22rpx 0;
			margin-top: 40rpx;
			.order_item{
				flex: 1;
				position: relative;
				text-align: center;
				&:not(:last-child){
					&::after{
						content: '';
						width: 1px;
						height: 70%;
						background-color: #EDEEF2;
						position: absolute;
						bottom: 50%;
						right: 0;
						transform: translate(-50%,50%);
					}
				}
				.order_number{
					font-size: 36rpx;
				}
				.order_text{
					font-size: 24rpx;
				}
			}
		}
		
		.tool{
			margin-top: 40rpx;
			.toolList{
				display: flex;
				.tool_item{
					font-size: 24rpx;
					color: #636465;
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
					.tool_icon{
						width: 50rpx;
						height: 50rpx;
						margin-bottom: 24rpx;
					}
				}
			}
		}
		.item_title{
			color: #141414;
			font-size: 36rpx;
			margin-bottom: 32rpx;
		}
		.grayline{
			height: 26rpx;
			background-color: #F7F8FB;
			margin: 32rpx -24rpx;
		}
		.loginOut{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.loginOut_btn{
				margin-top: 40rpx;
				padding: 20rpx 60rpx;
				border-radius: 80rpx;
				font-size: 36rpx;
				color: #ffffff;
				background: linear-gradient(180deg, #266DFF 0%, rgba(38,109,255,0.69) 100%);
			}
		}
	}
}
</style>
