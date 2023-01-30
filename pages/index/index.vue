<template>
	<page-meta :page-style="'overflow:'+(showOrder || showModel?'hidden':'visible')"></page-meta>
	<view class="home">
		<view :style="{ height:statusBarHeight + 10 + 'px',backgroundColor:'#fff' }"></view>
		<view class="title">
			<view class="merchantName">
				{{merchantInfo.merchantName}}
			</view>
			<view class="linkStatus">
			<!-- 	<view class="audio">
					<audio ref="music" src="/static/music/orderMusic.mp3" controls></audio>
				</view> -->
				<view :class="['circle',{light:linkStatus == 1}]"></view>
				{{linkStatus == 0?'未连接':'已连接'}}
			</view>
		</view>
		<view class="home_content">
			<view class="merchant_info">
				<image class="info_bg" src="../../static/bg.png"></image>
				<view class="monthyMoney">
					<view class="hidewhile">本月收入(元)</view>
					<view style="font-size: 48rpx;margin-top: 24rpx;">{{merchantInfo.monthyMoney}}</view>
				</view>
				<view class="income">
					<view class="income_item">
						<view class="hidewhile">今日接单</view>
						<view style="margin-top: 12rpx;font-size: 32rpx;">{{merchantInfo.today}}</view>
					</view>
					<!-- <view class="income_item">
						<view class="hidewhile">昨日新增会员</view>
						<view style="margin-top: 12rpx;font-size: 32rpx;">{{merchantInfo.addUser}}</view>
					</view> -->
					<view class="income_item">
						<view class="hidewhile">7日订单量</view>
						<view style="margin-top: 12rpx;font-size: 32rpx;">{{merchantInfo.sevenOrder}}</view>
					</view>
				</view>
			</view>
			
			<view class="order">
				<view class="order_item">
					<view class="order_number">{{merchantInfo.totalOrder}}</view>
					<view class="order_text">总订单</view>
				</view>
				<view class="order_item">
					<view class="order_number">{{merchantInfo.income}}</view>
					<view class="order_text">店铺收入</view>
				</view>
				<view class="order_item">
					<view class="order_number">{{merchantInfo.privateUser}}</view>
					<view class="order_text">私域用户</view>
				</view>
				<view class="order_item">
					<view class="order_number">{{merchantInfo.rate}}</view>
					<view class="order_text">复购率(%)</view>
				</view>
			</view>
			
			<view class="tool">
				<view class="item_title">常用工具</view>
				<view class="toolList">
					<view class="tool_item" v-for="(item,index) in toolList" :key="index" @click="toTool(item)">
						<image class="tool_icon" :src="item.image"></image>
						<view class="circle" v-if="item.number > 0">{{item.number >=100?'99':item.number}}</view>
						<view>
							{{item.name}}
						</view>
					</view>
				</view>
			</view>
			
			<view class="grayline" v-if="merchantInfo.merchantType != 0"></view>
			
			<view class="verification" v-if="merchantInfo.merchantType != 0">
				<view class="item_title">核销功能</view>
				<view class="verification_content">
					<input v-model="verifiy" class="verification_input" type="number" placeholder="请输入核销码" >
					<view class="verification_btn" @click="verificateOrder">
						确认核销
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
		<view class="tarbarHeight"></view>
		<tarbar :current='0'></tarbar>
		<view class="model" v-if="showModel">
			<view class="model_box">
				<image class="model_img" src="../../static/sumbit.png"></image>
			</view>
		</view>
		
		<view class="orderModel" v-if="showOrder" @click="closeShow">
			<view class="couponList">
				<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltolower="getMoreOrder"
					style="height: 40vh;">
					<view style="font-weight: bold;font-size: 32rpx;text-align: center;">
						核销订单
					</view>
					<view class="notOrder" v-if="orderList.length == 0">
						暂无相应订单
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
										<view class="order_mess">预留信息：{{item.nickName}} {{item.phone}}</view>
									</view>
									<view class="info_right">
										<view style="color: #3B3D3D;">结算价</view>
										<view class="price">{{item.realTotalMoney}}</view>
									</view>
								</view>
							</view>
						</view>
						<view class="confirm" @click.stop="confirmOrder(item)">
							{{merchantType == 0?'确认订单':'核销订单'}}
						</view>
					</view>
				</scroll-view>
				<view style="margin-top: 40rpx;">
					<u-button text="确定" color="linear-gradient(90deg, #FFAA65 0%, #FB8146 100%)" shape="circle"
						@click="confirmCoupon"></u-button>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import tarbar from '@/component/tarbar/tarbar.vue'
	export default {
		data() {
			return {
				showModel:false,
				showOrder:false,
				orderList:[],
				merchantInfo:{
					id:'',
					merchantName:'商家名称',
					monthyMoney:0,// 本月收入
					addUser:0,// 昨日新增用户
					sevenOrder:0,// 7天订单
					today:0,// 今日订单
					income:0,// 总营收
					totalOrder:0,// 总订单
					privateUser:0,//私域用户
					rate:0, // 复购率
					merchantType:1,// 商家类型 0 酒店 其余非酒店
				},
				queryForm:{
					pageNo:1,
					pageSize:10,
					orderState:20
				},
				verifiy:'',
				toolList:[
					{
						name:'活动申请',
						path:'',
						image:'../../static/apply.png',
						number:0,
					},
					{
						name:'订单确定',
						path:'/pages/order/checkOrder',
						image:'../../static/order.png',
						number:0,
					},
					{
						name:'评价回复',
						path:'',
						image:'../../static/start.png',
						number:0,
					}
				],
				socketTask:'',
				openTimer:'',// 登录定时器
				timer:'',// 心跳定时器
				isClose:false,
				linkStatus:0,// 0 websocket未接通 1已接通
				statusBarHeight:0,
				innerAudioContext:'',
				total:10,
				overContent:true,
				notFirst:0
			}
		},
		created() {
			let statusBarHeight = getApp().globalData.statusBarHeight; //高度
			this.statusBarHeight = statusBarHeight;
			this.innerAudioContext = uni.createInnerAudioContext()
			this.innerAudioContext.src = '/static/music/orderMusic.mp3'
			this.innerAudioContext.autoplay = false
			uni.hideTabBar()
		},
		beforeDestroy() {
			// console.log('我要被关闭了！')
			this.isClose = true
			// 存在websocket便关闭websocket
			if(this.socketTask){
				this.socketTask.close();
			}
			// 清除连接websocket的定时器
			if(this.openTimer){
				clearTimeout(this.openTimer)
			}
			this.openTimer = ''
			this.socketTask = ''
		},
		onShow() {
			if(this.notFirst == 1){
				this.getOrderList()
			}else if(this.notFirst == 0){
				console.log('aaa',this.notFirst)
				this.getUser()
			}
		},
		components:{
			tarbar
		},
		methods: {
			async getUser(){
				let res = await this.$get('/merchant/info')
				console.log('结果',res)
				setTimeout(()=>{
					this.notFirst == 0
				}, 1000);
				if(res.code == 200){
					this.notFirst = 1
					this.merchantInfo.merchantName = res.data.merchantName
					this.merchantInfo.merchantType = res.data.merchantType
					this.merchantInfo.id = res.data.id
					this.toolList[1].name = res.data.merchantType == 0 ? '订单确认' : '订单核销'
					this.queryForm.orderState = res.data.merchantType == 0 ? 20 : 30
					this.connectWS()
					this.getOrderList()
				}
			},
			// 获取核销/确认订单数量
			async getOrderList(){
				let res = await this.$get('/merchant/order/page',{
					current:this.queryForm.pageNo,
					size:1,
					merchantId:this.merchantInfo.id,
					orderState:this.queryForm.orderState,
				})
				// console.log('订单数量',res)
				if(res.code == 200){
					this.toolList[1].number = res.data.total
				}
				this.getMerchantData()
			},
			// 获取商家数据表格
			async getMerchantData(){
				let res = await this.$get('/merchant/data/board/detail',{
					merchantId:this.merchantInfo.id
				})
				// console.log('商家数据表格',res)
				if(res.code == 200){
					this.merchantInfo.totalOrder = res.data.orderTotalNum
					this.merchantInfo.income = res.data.merchantTotalRevenue / 100
					this.merchantInfo.rate = res.data.repurchaseRate
					this.merchantInfo.privateUser = res.data.totalUserNum
				}
				this.getOrderData()
			},
			// 获取订单数据
			async getOrderData(){
				let res = await this.$get('/merchant/order/data',{
					merchantId:this.merchantInfo.id
				})
				// console.log('获取订单数据',res)
				if(res.code == 200){
					this.merchantInfo.monthyMoney = res.data.monthlyIncome / 100
					this.merchantInfo.today = res.data.todayOrderNum
					this.merchantInfo.sevenOrder = res.data.sevenDayOrderNum
				}
			},
			// 连接webSocket
			connectWS(){
				let that = this
				if(this.linkStatus === 0){
					this.socketTask = uni.connectSocket({
						// url: 'ws://192.168.31.45:7074/merchant/order/ws/'+ this.merchantInfo.id,// 本地websocket
						url: 'wss://b.zunyu.ltd/wss-api/merchant/order/ws/'+ this.merchantInfo.id,// 在线websocket
					  success() {
					  	// console.log('WebSocket开始连接！')
					  },
					  fail(err) {
					  	// console.log('报错',err)
					  }
					});
					// websocket 连接方法
					this.socketTask.onOpen(()=>{
						// console.log('WebSocket连接打开了');
						that.linkStatus = 1
						that.heart()
					})
					this.socketTask.onMessage((res)=>{
						// console.log('收到服务器内容',res.data)
						if(res.data == 'OK'){
							uni.showToast({
								title:'新订单来了',
								icon:'none'
							})
							that.innerAudioContext.play()
							that.getOrderList()
						}
					})
					
					this.socketTask.onError((res)=>{
						// console.log('WebSocket连接打开失败,请检查',res)
						this.openTimer = setTimeout(()=>{
							that.reconnect()
						},5000)
					})
					
					this.socketTask.onClose((e)=>{
						// console.log('WebSocket连接关闭')
						clearInterval(that.timer)
						that.timer = ''
						if(!that.isClose){
							that.reconnect()
						}
					})
				}
			},
			// 重新连接websocket
			reconnect(){
				// console.log('断线重连');
				this.socketTask = '';
				this.linkStatus = 0
				this.connectWS()
			},
			sendSocketMessage(){
				return new Promise((reslove, reject)=>{
					this.socketTask.send({
						data:'心跳监测',
						success(res){
							// 发送成功
							reslove(res)
						},
						fail(res){
							// 发送失败
							reject(res)
						},
					})
				})
			},
			heart(){
				let that = this
				clearInterval(this.timer);
				this.timer = '';
				this.timer = setInterval(()=>{
					that.sendSocketMessage().then(res =>{
						// console.log('心跳成功');
					}).catch(res => {
						// console.log('发送失败');
					})
				},45000)
			},
			toTool(item){
				if(item.path == '/pages/order/checkOrder'){
					uni.navigateTo({
						url:item.path + '?merchantType=' + this.merchantInfo.merchantType + '&id=' + this.merchantInfo.id
					})
				}else if(item.path){
					uni.navigateTo({
						url:item.path
					})
				}else{
					uni.showToast({
						title:'功能维护中',
						icon:'none'
					})
				}
			},
			// 获取核销订单
			async verificateOrder(){
				if(this.verifiy == ''){
					uni.showToast({
						title:'请输入核销码',
						icon:'none',
					})
					return
				}
				this.showOrder = true
				let res = await this.$get('/merchant/order/page',{
					current:this.queryForm.pageNo,
					size:10,
					merchantId:this.merchantInfo.id,
					orderState:this.queryForm.orderState,
					writeOffCode:this.verifiy
				})
				// console.log('核销订单',res)
				if(res.code == 200){
					this.total = res.data.total
					this.overContent = true;
					res.data.records.map(d=>{
						if(d.contactPhone){
							d.guestName = d.guestName.substring(0, 1) + '**'
							d.contactPhone = d.contactPhone.substring(0, 3) + "****" + d.contactPhone.substr(d.contactPhone.length-4);
						}
						d.phone = d.phone.substring(0, 3) + "****" + d.phone.substr(d.phone.length-4);
						d.realTotalMoney = d.realTotalMoney / 100 + '元'
						d.createTime = d.createTime.substring(0,d.createTime.length-3)
						if(this.merchantType == 0){
							d.showTime = this.calculateTime(d.startTime,d.endTime).timeStr
						}
					})
					this.orderList = this.orderList.concat(res.data.records)
				}else{
					this.queryForm.pageNo--
					this.overContent = true
				}
			},
			getMoreOrder(){
				// 触底的时候请求数据，即为上拉加载更多
				let allTotal = this.queryForm.pageNo * 10
				if (allTotal < this.total && this.overContent) {
					this.overContent = false;
					this.queryForm.pageNo++;
					this.verificateOrder();
				}
			},
			confirmOrder(item){
				uni.showModal({
					title:'温馨提示',
					content: '是否核销订单？',
					success: async (res)=> {
						if(res.confirm){
							let result = await this.$post('/merchant/order/writeOff',{
								id:item.id,
								merchantId:this.merchantInfo.id,
								writeOffCode:this.verifiy
							})
							if(result.code == 200){
								this.showModel = true
								this.overContent = true
								this.queryForm.pageNo = 1
								this.orderList = []
								this.getOrderList();
								setTimeout(()=>{
									this.showModel = false
								},1800)
								this.closeShow()
							}
						}
					}
				})
			},
			closeShow(){
				this.showOrder = false
				this.total = 20
				this.overContent = true,
				this.queryForm.pageNo = 1
				this.orderList = []
				this.verifiy = ''
			},
			loginOut(){
				uni.showModal({
					title:'温馨提示',
					content:'确定退出登录',
					success:async (res) => {
						if(res.confirm){
							let res = await this.$get('/auth/b/doLogout')
							if(res.code == 200){
								uni.redirectTo({
									url:'/pages/login/index'
								})
							}
						}
					}
				})
			},
		}
	}
</script>

<style lang="less" scoped>
.home{
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
		.linkStatus{
			font-size: 24rpx;
			color: #3D3D3D;
			transform: scale(0.8);
			transform-origin: left center;
			display: flex;
			align-items: center;
			.audio{
				width: 10rpx;
				height: 10rpx;
				overflow: hidden;
				border-radius: 50%;
			}
			.circle{
				width: 20rpx;
				height: 20rpx;
				border-radius: 50%;
				background-color: #b5b5b5;
				margin-right: 10rpx;
			}
			.light{
				background-color: #00C676;
			}
		}
	}
	
	.home_content{
		padding: 0 24rpx;
		box-sizing: border-box;
		.merchant_info{
			position: relative;
			color: #FFFFFF;
			padding: 40rpx;
			box-sizing: border-box;
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
			.monthyMoney{
				font-size: 28rpx;
			}
			.income{
				margin-top: 40rpx;
				font-size: 24rpx;
				display: flex;
				.income_item{
					flex: 1;
					box-sizing: border-box;
					&:not(:last-child){
						margin-right: 10rpx;
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
				width: 25%;
				padding: 0;
				flex-shrink: 0;
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
					word-break: break-all;
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
					position: relative;
					.tool_icon{
						width: 50rpx;
						height: 50rpx;
						margin-bottom: 24rpx;
					}
					.circle{
						width: 36rpx;
						height: 36rpx;
						font-size: 24rpx;
						border-radius: 50%;
						background-color: #F00;
						color: #FFFFFF;
						display: flex;
						justify-content: center;
						align-items: center;
						position: absolute;
						right: 22%;
						top: -20%;
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
		.verification{
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
.couponList {
	width: 90%;
	height: 54vh;
	padding: 40rpx 32rpx;
	background-color: #F5F5F5;
	box-sizing: border-box;
}
.notOrder{
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
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
</style>
