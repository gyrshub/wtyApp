<template>
	<!-- 底部导航栏 -->
	<view class="tarbar">
		<view class="tarbarItem" v-for="(item,index) in list" :key="index" @click="toPath(item.pagePath)">
			<image v-if="current == index" class="tarbarIcon" :src="item.selectedIconPath"></image>
			<image v-if="current != index" class="tarbarIcon" :src="item.iconPath"></image>
			<view :class="['name',{active:current == index}]">{{item.text}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			current:{
				type:Number,
				default:0
			}
		},
		data() {
			return {
				list: [
					{
						"text": "工作台",
						"pagePath": "/pages/index/index",
						"iconPath": "/static/icon-work-nor.png",
						"selectedIconPath": "/static/icon-work-pre.png"
					},
					{
						"text": "分销",
						"pagePath": "/pages/distribution/index",
						"iconPath": "/static/icon-mes-nor.png",
						"selectedIconPath": "/static/icon-mes-pre.png"
					},
					{
						"text": "订单",
						"pagePath": "/pages/order/index",
						"iconPath": "/static/icon-order-nor.png",
						"selectedIconPath": "/static/icon-order-pre.png"
					}
					// ,{
					// 	"text": "我的",
					// 	"pagePath": "/pages/my/index",
					// 	"iconPath": "/static/icon-user-nor.png",
					// 	"selectedIconPath": "/static/icon-user-pre.png"
					// }
				]
			};
		},
		methods:{
			toPath(url){
				let page = getCurrentPages()
				if('/'+page[page.length-1].route == url)return
				uni.switchTab({
					url:url
				})
			},
			changeIndex(index){
				this.$emit('changeIndex',index)
			}
		}
	}
</script>

<style lang="less" scoped>
.tarbar{
	width: 100%;
	height: 168rpx;
	display: flex;
	justify-content: space-around;
	background-color: #FFFFFF;
	padding-top: 16rpx;
	box-sizing: border-box;
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 50;
	box-shadow: 3px 4px 7px 2px rgba(100, 100, 100, 0.2);
	.tarbarItem{
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		.tarbarIcon{
			width: 72rpx;
			height: 72rpx;
			margin-bottom: 4rpx;
		}
		.name{
			font-size: 28rpx;
			color: rgb(153, 153, 153);
		}
		.active{
			color: #3173FF;
		}
	}
}
</style>
