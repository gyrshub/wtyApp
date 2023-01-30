<script>
	export default {
		globalData: {
		    test: false,
		    statusBarHeight: 0,
			current:0,
			innerAudioContext:''
		  },
		created() {
			let that = this;
			 wx.getSystemInfo({//GetSystemInfo函数用于获取当前系统的信息。
			      success(res) {
			        that.$options.globalData.statusBarHeight = res.statusBarHeight;
			        //model中包含着设备信息
			        const model = res.model;
			        // console.log("手机信息res----" + res.model, res);
			        if (/iPhone X/i.test(model)) {
			          that.$options.globalData.test = true;
			        } else if (/iPhone 11/i.test(model)) {
			          that.$options.globalData.test = true;
			        } else if (
			          /iphone\sx/i.test(model) ||
			          (/iphone/i.test(model) && /unknown/.test(model)) ||
			          /iphone\s11/.test(model)
			        ) {
			          that.$options.globalData.test = true;
			        } else {
			          that.$options.globalData.test = false;
			        }
			      },
			    });
		},
		onLaunch: function(options) {
			// console.log('App Launch',options)
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style lang="less" >
	/*每个页面公共css */
	image{
		image-rendering: -moz-crisp-edges;
		image-rendering: -o-crisp-edges;
		image-rendering: -webkit-optimize-contrast;
		image-rendering: crisp-edges;
		-ms-interpolation-mode: nearest-neighbor;
	}
	.model{
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		animation: 1.9s modelshow ease normal;
		.model_box{
			width: 300rpx;
			height: 300rpx;
			background-color: rgba(178, 178, 178,0.75);
			border-radius: 15px;
			.model_img{
				width: 100%;
				height: 100%;
			}
		}
	}
	@keyframes modelshow {
		0% {
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		65% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
				
	@-webkit-keyframes modelshow {
		0% {
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		65% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	.tarbarHeight{
		height: 180rpx;
	}
	
	::-webkit-scrollbar {
	    display: none;
	    width: 0 !important;
	    height: 0 !important;
	    -webkit-appearance: none;
	    background: transparent;
	    color: transparent;
	  }
</style>
