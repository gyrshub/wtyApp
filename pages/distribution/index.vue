<template>
	<view class="distribution">
		<view :style="{ height:statusBarHeight + 10 + 'px',backgroundColor:'#fff' }"></view>
		<view class="title">分销码</view>
		<view class="distribution_content">
			<image class="background_img" src="../../static/distribution_bg.png"></image>
			<view style="font-size: 36rpx;color: #fff;">欢迎进入我的店铺</view>
			<view class="code">
				<view class="merchant">
					<image class="merchant_img" :src="distributionDetail.merchantPicture"></image>
					<view class="merchant_info">
						<view class="merchant_name">{{distributionDetail.merchantName}}</view>
						<view style="display: flex;align-items: center;margin: 8rpx 0 16rpx 0;">
							<image class="icon" src="../../static/icon1.png"></image>
							<view>管理员</view>
						</view>
						<view class="info_bottom">
							<view>店铺评分：{{distributionDetail.score}}</view>
							<view>我的会员：{{totalNumber}}</view>
						</view>
					</view>
				</view>
				<view class="code_content">
					<image class="code_img" :src="distributionDetail.merchantQrCode"></image>
					<view style="font-size: 28rpx;margin: 32rpx 0 34rpx 0;">
						优惠下单，尽享福利
					</view>
					<!-- <view class="save_btn" @click="savePhoto">
						保存到相册
					</view> -->
				</view>
			</view>
			
		</view>
		<tarbar :current='1'></tarbar>
	</view>
</template>

<script>
	import tarbar from '@/component/tarbar/tarbar.vue'
	export default {
		data() {
			return {
				statusBarHeight: 0,
				distributionDetail:{
					id:'',
					merchantName:'商家名',
					score:'5.0',
					merchantQrCode:'',
					merchantPicture:''
				},
				totalNumber:0,
			};
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
		methods:{
			async getUser(){
				let res = await this.$get('/merchant/info')
				// console.log('结果',res)
				if(res.code == 200){
					res.data.score = res.data.score?res.data.score.toFixed(1) : '5.0'
					this.distributionDetail = res.data
					this.getMerchantData()
				}
			},
			// 获取商家数据表格
			async getMerchantData(){
				let res = await this.$get('/merchant/data/board/detail',{
					merchantId:this.distributionDetail.id
				})
				if(res.code == 200){
					this.totalNumber = res.data.totalUserNum
				}
			},
		}
	}
</script>

<style lang="less" scoped>
.distribution{
	padding: 0 40rpx;
	box-sizing: border-box;
	.title{
		text-align: center;
		padding: 24rpx 0;
		background-color: #ffffff;
		font-size: 34rpx;
	}
	.distribution_content{
		font-size: 24rpx;
		color: #959699;
		padding: 30rpx 40rpx;
		box-sizing: border-box;
		position: relative;
		.background_img{
			width: 100%;
			height: 100%;
			position: absolute;
			left: 0;
			top: 0;
			z-index: -1;
		}
		.code{
			padding: 24rpx 20rpx 60rpx 20rpx;
			box-sizing: border-box;
			background-color: #ffffff;
			border-radius: 20rpx;
			margin-top: 40rpx;
			.merchant{
				display: flex;
				border-bottom: 1px dotted #EBEEF1;
				padding: 34rpx 20rpx;
				box-sizing: border-box;
				position: relative;
				&::before{
					content: '';
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					background-color: rgb(22, 99, 255);
					position: absolute;
					bottom: -20rpx;
					left: -40rpx;
				}
				&::after{
					content: '';
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					background-color: rgb(49, 115, 255);
					position: absolute;
					bottom: -20rpx;
					right: -40rpx;
				}
				.merchant_img{
					width: 96rpx;
					height: 96rpx;
					flex-shrink: 0;
					border-radius: 50%;
					margin-right: 24rpx;
				}
				.merchant_info{
					flex: 1;
					overflow: hidden;
					.merchant_name{
						font-size: 32rpx;
						color: #2F2F30;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					.icon{
						width: 24rpx;
						height: 24rpx;
						margin-right: 12rpx;
					}
					.info_bottom{
						display: flex;
						justify-content: space-between;
					}
				}
			}
			.code_content{
				display: flex;
				flex-direction: column;
				align-items: center;
				.code_img{
					width: 328rpx;
					height: 328rpx;
					margin-top: 46rpx;
				}
				.save_btn{
					font-size: 32rpx;
					border: 1px solid #1A66FF;
					color: #1A66FF;
					padding: 20rpx 80rpx;
				}
			}
		}
	}
}
</style>
