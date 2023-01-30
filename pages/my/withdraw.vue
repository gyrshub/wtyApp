<template>
	<view class="withdraw">
		<view class="topTool">
			<image class="topImg" src="https://jiudian-1313125514.cos.ap-guangzhou.myqcloud.com/jiudianxiangmu%2Fwallet-bg.png"></image>
			<view class="tool" :style="	{ top:statusBarHeight + 10 + 'px' }">
				<image class="icon" src="/static/white_back.png" @click="toMine"></image>
			</view>
			<view class="topTitle" :style="	{ top:statusBarHeight + 10 + 'px' }">申请提现</view>
		</view>
		
		<view class="content">
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
				<view class="input_box">
					<span style="font-size: 72rpx;margin-right: 20rpx;">￥</span>
					<input class="input_style" type="number" placeholder="提现金额最少50元起">
				</view>
				<view class="input_btn">
					申请提现
				</view>
			</view>
			
			<view class="annotation">
				<view class="annotation-title">
					<view class="annotation-text">
						提现规则:
					</view>
					<view class="underline"></view>
				</view>
				<view class="annotation-item">1.提现金额需满足或大于50元。</view>
				<view class="annotation-item">2.提现额度的结算方式是现金结算。</view>
				<view class="annotation-item">3.提现到账时间为48小时之内。</view>
				<view class="annotation-item">4.提现到自己的实名账户内。</view>
			</view>
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
				}
			};
		},
		created() {
			let statusBarHeight = getApp().globalData.statusBarHeight; //高度
			this.statusBarHeight = statusBarHeight;
		},
		methods:{
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
.withdraw{
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
		.user-wallet{
			background-color: #FFFFFF;
			border-radius: 20rpx;
			margin-top: -240rpx;
			padding: 66rpx 54rpx 34rpx 54rpx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			.userInfo{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 64rpx;
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
			
			.input_box{
				border-bottom: 1px solid #D8D8D8;
				display: flex;
				align-items: flex-end;
				.input_style{
					width: 60%;
					text-align: center;
					padding: 10rpx 20rpx;
				}
			}
			.input_btn{
				width: 250rpx;
				text-align: center;
				border-radius: 60rpx;
				font-size: 48rpx;
				color: #FFFFFF;
				background-color: #3173FF;
				padding: 4rpx 60rpx;
				margin-top: 16rpx;
				align-self: center;
			}
		}
		.annotation{
			margin-top: 48rpx;
			color: #707070;
			font-size: 26rpx;
			.annotation-title{
				font-size: 28rpx;
				color: #121212;
				position: relative;
				.annotation-text{
					position: relative;
					z-index: 10;
				}
				.underline{
					width: 100rpx;
					height: 12rpx;
					background-color: #3173FF;
					border-radius: 20rpx;
					position: absolute;
					left: 8rpx;
					bottom: 4rpx;
					z-index: 8;
				}
			}
			.annotation-item{
				padding-left: 20rpx;
				margin-top: 28rpx;
			}
		}
	}
}

</style>
