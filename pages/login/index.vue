<template>
	<view class="login">
		<view style="font-weight: bold;margin-top: 100rpx;">
			<view style="font-size: 64rpx;">您好，</view>
			<view style="font-size: 32rpx;">{{content}}</view>
		</view>
		<view style="margin-top: 40rpx;">
			<input class="uni-input" v-model="form.account" type="text" placeholder="请输入账号" />
			<input class="uni-input" v-model="form.password" password type="text" placeholder="请输入密码" />
			<button class="login_btn" type="primary" @click="toLogin">登录</button>
		</view>
		<view class="attention">
			登录代表同意<text style="color: #2066E0;">《服务协议》</text>及<text
				style="color: #2066E0;">《隐私协议》</text>登陆前请阅读
		</view>
	</view>
</template>

<script>
	import smCrypto from '../../api/smCrypto.js'
	export default {
		data() {
			return {
				content: '欢迎进入文涛扬商户后台',
				form: {
					account: '',
					password: ''
				},
				flag:false,
				privacyText: '',
				userAgreementText: ''
			}
		},
		onLoad() {
			uni.removeStorageSync('token')
			uni.removeStorageSync('userDetail')
			uni.removeStorageSync('menu')
		},
		methods: {
			async toLogin(){
				let that = this
				if(!this.form.account){
					uni.showToast({
						title:'请输入账号',
						icon:'none'
					})
					return
				}
				if(!this.form.password){
					uni.showToast({
						title:'请输入密码',
						icon:'none'
					})
					return
				}
				uni.showLoading({
					title:'正在登录...',
					mask:true
				})
				const loginData = {
					account: this.form.account,
					// 密码进行SM2加密，传输过程中看到的只有密文，后端存储使用hash
					password: smCrypto.doSm2Encrypt(this.form.password)
				}
				let res = await that.$API.post('/auth/b/doLogin',loginData)
				// console.log('登录结果',res)
				if (res.code == 200) {
					uni.hideLoading();
					uni.setStorageSync('token', res.data)
					let getDetail = await that.$get('/auth/b/getLoginUser')
					// console.log('获取用户详情',getDetail)
					uni.setStorageSync('userDetail', JSON.stringify(getDetail.data))
					let menu = await that.$get('/sys/userCenter/loginMenu')
					// console.log('获取登录菜单',menu)
					if(menu.data[0].title === '商家'){
						uni.hideLoading()
						uni.setStorageSync('menu', JSON.stringify(menu.data[0]))
						uni.showToast({
							title:'登录成功',
							icon:'none',
							mask:true,
							success() {
								setTimeout(()=>{
									uni.switchTab({
										url: '/pages/index/index'
									})
								},1500)
							}
						})
					}else{
						uni.hideLoading()
						uni.showToast({
							title:'本用户不是商家角色无法进入',
							icon:'none'
						})
					}		
				} else {
					uni.hideLoading();
					uni.showToast({
						title:'登录失败',
						icon:"none",
						mask:true,
					})
				}
			}
		}
	}
</script>
<style lang="less" scoped>
	.login {
		display: flex;
		flex-direction: column;
		padding: 0 64rpx;
		box-sizing: border-box;
		height: 100vh;
		position: relative;
		.uni-input{
			padding-top: 60rpx;
			padding-bottom: 20rpx;
			border-bottom: 1px solid #B6BDBD;
		}
		.login_btn{
			padding: 12rpx 0;
			font-size: 36rpx;
			font-weight: bold;
			margin-top: 104rpx;
			background-color: rgb(26, 102, 255);
		}
		.attention{
			width: 420rpx;
			font-size: 26rpx;
			text-align: center;
			position: fixed;
			left: 50%;
			bottom: 5%;
			transform: translate(-50%,-50%);
		}
	}
	
	.rule {
		width: 80vw;
		height: 60vh;
		padding: 10rpx 20rpx;
		box-sizing: border-box;
	}
	
	.ruleTitle {
		text-align: center;
		font-weight: bold;
		margin: 20rpx 0;
	}
	
	.ruleButton {
		width: 50%;
		text-align: center;
		padding: 20rpx;
		border-radius: 20rpx;
		font-size: 32rpx;
		background-color: #707070;
		color: #ffffff;
	}
	.ruleText{
		height: 60%;
		overflow-y: auto;
		margin-bottom: 40rpx;
	}
	.ruleButton:active {
		background-color: #5f5f5f;
		color: #eeeeee;
	}
</style>
