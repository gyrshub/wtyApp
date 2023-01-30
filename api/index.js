// const commonUrl = `http://192.168.31.45:7074`
const commonUrl = `https://b.zunyu.ltd/web-api`

// post请求封装
function postRequest(url, data) {
	var promise = new Promise((resolve, reject) => {
		var that = this;
		var postData = data;
		uni.showNavigationBarLoading();
		uni.request({
			url: commonUrl + url,
			data: postData,
			method: "POST",
			header: {
				"content-type": "application/json",
				token: uni.getStorageSync("token") || '',
			},
			success: function(res) {
				uni.hideNavigationBarLoading()
				//返回什么就相应的做调整
				if (res.data.code == 200) {
					resolve(res.data);
				} else if (res.data.code == 401) {
					uni.removeStorageSync('id')
					uni.reLaunch({
						url: '/pages/login/index'
					})
				}else if (res.data.code == 500) {
					uni.showToast({
						title:res.data.msg || "服务器错误",
						icon:"none"
					})
					resolve(res.data);
				} else {
					uni.showToast({
						title: res.data.msg || "服务器错误",
						icon: "none",
					});
					resolve(res.data);
				}
			},
			error: function(e) {
				uni.hideNavigationBarLoading()
				reject("网络出错");
			},
		});
	});
	return promise;
}


// get请求封装
function getRequest(url, data) {
	var promise = new Promise((resolve, reject) => {
		var that = this;
		var postData = data;
		// uni.showNavigationBarLoading();
		uni.request({
			url: commonUrl + url,
			data: postData,
			method: "GET",
			dataType: "json",
			header: {
				"content-type": "application/json",
				"Accept": "application/json",
				"Authorization": "Bearer" + ' ' + uni.getStorageSync("token"),
				token: uni.getStorageSync("token") || '',
			},
			success: function(res) {
				// uni.hideNavigationBarLoading()
				if (res.data.code == 200) {
					resolve(res.data);
				} else if (res.data.code == 401) {
					uni.removeStorageSync('id')
					uni.reLaunch({
						url: '/pages/login/index'
					})
				}else if (res.data.code == 500) {
					uni.showToast({
						title:res.data.msg || "服务器错误",
						icon:"none"
					})
					resolve(res.data);
				} else {
					uni.showToast({
						title: res.data.msg || "服务器错误",
						icon: "none",
					});
					resolve(res.data);
				}
			},
			error: function(e) {
				// uni.hideNavigationBarLoading()
				reject("网络出错");
			},
		});
	});
	return promise;
}

function dELETERequest(url, data) {
	var promise = new Promise((resolve, reject) => {
		var that = this;
		var postData = data;
		uni.showNavigationBarLoading();
		uni.request({
			url: commonUrl + url,
			data: postData,
			method: "DELETE",
			header: {
				"content-type": "application/json",
				token: uni.getStorageSync("token") || '',
			},
			success: function(res) {
				uni.hideNavigationBarLoading()
				//返回什么就相应的做调整
				if (res.data.code == 200) {
					resolve(res.data);
				} else if (res.data.code == 401) {
					uni.removeStorageSync('id')
					uni.reLaunch({
						url: '/pages/login/index'
					})
				}else if (res.data.code == 500) {
					uni.showToast({
						title:res.data.msg || "服务器错误",
						icon:"none"
					})
					resolve(res.data);
				} else {
					uni.showToast({
						title: res.data.msg || "服务器错误",
						icon: "none",
					});
					resolve(res.data);
				}
			},
			error: function(e) {
				uni.hideNavigationBarLoading()
				reject("网络出错");
			},
		});
	});
	return promise;
}

module.exports = {
	post: postRequest,
	get: getRequest,
	delete:dELETERequest
};
