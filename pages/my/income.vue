<template>
	<view class="income">
		<view class="topTool">
			<image class="topImg" src="https://jiudian-1313125514.cos.ap-guangzhou.myqcloud.com/jiudianxiangmu%2Fwallet-bg.png"></image>
			<view class="tool" :style="	{ top:statusBarHeight + 10 + 'px' }">
				<image class="icon" src="/static/white_back.png" @click="toMine"></image>
			</view>
			<view class="topTitle" :style="	{ top:statusBarHeight + 10 + 'px' }">收支记录</view>
		</view>
		
		<view class="content">
			<scroll-view scroll-y="true" class="content_box" @scrolltolower="lower">
				<view class="user-wallet">
					<view class="userInfo">
						<view class="userInfo-left">
							<image class="userImage" :src="userInfo.avatar"></image>
							<view class="userName">
								{{userInfo.nickName}}
							</view>
						</view>
						<view class="userInfo-right">
							剩余余额：{{money}}元
						</view>
					</view>
					
					<view class="incomeList">
						<view class="income_item" v-for="(item,index) in orderList" :key="index">
							<view class="income_content">
								<view class="content_title">{{item.orderType == 0?'提现支出':'订单收入'}}</view>
								<view class="content_time">{{item.createTime}}</view>
							</view>
							<view class="content_money">{{item.money}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight:0,
				money:0,
				userInfo:{
					avatar:'../../static/logo.png',
					nickName:'黄韦勇'
				},
				orderList:[
					{
						money:'+2.39',
						orderType:1,// 0 提现支出 1 订单收入
						createTime:'2022.09.14 16:23'
					},
					{
						money:'-50',
						orderType:0,// 0 提现支出 1 订单收入
						createTime:'2022.09.14 16:23'
					},
					{
						money:'-50',
						orderType:0,// 0 提现支出 1 订单收入
						createTime:'2022.09.14 16:23'
					},
					{
						money:'-50',
						orderType:0,// 0 提现支出 1 订单收入
						createTime:'2022.09.14 16:23'
					},
					{
						money:'-50',
						orderType:0,// 0 提现支出 1 订单收入
						createTime:'2022.09.14 16:23'
					},
					{
						money:'-50',
						orderType:0,// 0 提现支出 1 订单收入
						createTime:'2022.09.14 16:23'
					},
					{
						money:'-510',
						orderType:0,// 0 提现支出 1 订单收入
						createTime:'2022.09.14 16:23'
					},
					{
						money:'-510',
						orderType:0,// 0 提现支出 1 订单收入
						createTime:'2022.09.14 16:23'
					},
					{
						money:'-510',
						orderType:0,// 0 提现支出 1 订单收入
						createTime:'2022.09.14 16:23'
					}
				]
			};
		},
		created() {
			let statusBarHeight = getApp().globalData.statusBarHeight; //高度
			this.statusBarHeight = statusBarHeight;
		},
		methods:{
			lower(){
				console.log('到底了')
			},
			toMine(){
				uni.switchTab({
					url:'/pages/my/index'
				})
			}
		}
	}
</script>
<style>
	page{
		background-color: #F7F8FB;
	}
</style>
<style lang="less" scoped>
.income{
	.topTool {
			width: 750rpx;
			height: 460rpx;
			position: relative;
			.topImg {
				width: 100%;
				height: 100%;
			}
			.tool{
				width: 100%;
				position: absolute;
				left: 0;
				z-index: 10;
				padding: 0 32rpx;
				box-sizing: border-box;
				.icon{
					width: 40rpx;
					height: 40rpx;
				}
			}
			.topTitle{
				position: absolute;
				left: 50%;
				z-index: 10;
				transform: translateX(-50%);
				font-size: 32rpx;
				color: #FFFFFF;
			}
		}
	.content{
		padding: 0 32rpx;
		z-index: 50;
		position: relative;
		.content_box{
			margin-top: -240rpx;
			height: 75vh;
			border-radius: 20rpx;
			overflow: hidden;
			.user-wallet{
				background-color: #FFFFFF;
				padding: 66rpx 54rpx 34rpx 54rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				.userInfo{
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 42rpx;
					padding-bottom: 46rpx;
					border-bottom: 1px solid #D8D8D8;
					.userInfo-left{
						color: #121212;
						font-size: 48rpx;
						display: flex;
						align-items: center;
						.userImage{
							width:80rpx;
							height:80rpx;
							border-radius: 50%;
							margin-right: 16rpx;
						}
					}
					.userInfo-right{
						font-size: 24rpx;
						color: #3D3D3D;
					}
				}
				
				.incomeList{
					.income_item{
						display: flex;
						align-items: center;
						justify-content: space-between;
						color: #3D3D3D;
						.income_content{
							margin-bottom: 32rpx;
							.content_title{
								font-size: 32rpx;
								font-weight: 500;
							}
							.content_time{
								font-size: 24rpx;
								transform: scale(0.8);
								transform-origin: left center;
								color: #979797;
							}
						}
						.content_money{
							font-size: 36rpx;
						}
						.content_money_light{
							color: #FD0000;
						}
					}
				}
			}
		}
		
	}
}

</style>
