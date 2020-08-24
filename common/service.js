/**
 * @version 3.0.4
 * @Author lu-ch
 * @Email webwork.s@qq.com
 * 文档: https://www.quanzhan.co/luch-request/
 * github: https://github.com/lei-mu/luch-request
 * DCloud: http://ext.dcloud.net.cn/plugin?id=392
 * HBuilderX: beat-2.7.14 alpha-2.8.0
 */
import Request from '@/utils/luch-request/index.js'

// 获取storage中token
const getTokenStorage = () => {
	let token = ''
	try {
		token = uni.getStorageSync('userid')
	} catch (e) {
		//TODO handle the exception
	}
	return token
}



const test = new Request()
/**
 * 修改全局配置示例
 const test = new Request({
	header: {a:1}, // 举例
	baseURL: 'https://www.fastmock.site/mock/26243bdf9062eeae2848fc67603bda2d/luchrequest',
	validateStatus: (statusCode) => { // statusCode 必存在。此处示例为全局默认配置
		return statusCode >= 200 && statusCode < 300
	}
})
 test.config.baseURL = 'https://www.fastmock.site/mock/26243bdf9062eeae2848fc67603bda2d/luchrequest'
 **/

test.setConfig((config) => { /* 设置全局配置 */
	config.baseURL = 'https://www.fastmock.site/mock/26243bdf9062eeae2848fc67603bda2d/luchrequest'
	config.header = {
		...config.header,
		a: 1, // 演示
		b: 2 // 演示
	}
	config.custom = {
		// auth: false, // 是否传token
		// loading: false // 是否使用loading
	}
	return config
})

test.interceptors.request.use((config) => { /* 请求之前拦截器。可以使用async await 做异步操作  */
	config.header = {
		...config.header,
		a: 3 // 演示
	}
	/**
	 * custom {Object} - 自定义参数
	 */
	// if (config.custom.auth) {
	//   config.header.token = '123456'
	// }
	// if (config.custom.loading) {
	//   uni.showLoading()
	// }
	/*
	if (!token) { // 如果token不存在，return Promise.reject(config) 会取消本次请求
	  return Promise.reject(config)
	}
	*/
	return config
}, (config) => {
	return Promise.reject(config)
})


test.interceptors.response.use((response) => { /* 请求之后拦截器。可以使用async await 做异步操作  */
	// if (response.config.custom.loading) {
	//    uni.hideLoading()
	//  }
	if (response.data.code !== 200) { // 服务端返回的状态码不等于200，则reject()
		return Promise.reject(response)
	}
	return response
}, (response) => { // 请求错误做点什么。可以使用async await 做异步操作
	// if (response.config.custom.loading) {
	//    uni.hideLoading()
	//  }
	return Promise.reject(response)
})


const http = new Request()


function refreshToken() {
	// token接口获取token值
	return http.post('app_login_hongniang')
}

// 给实例添加一个setToken方法，用于登录后方便将最新token动态添加到header，同时将token保存在localStorage中
http.setToken = (token) => {
	http.config.header['userid'] = token
	uni.setStorageSync('userid', token)
}

let requests = [] // 存储无token的请求队列
let isRefreshing = false //正在刷新token


http.setConfig((config) => { /* 设置全局配置 */
	config.baseURL = 'https://quan001.y.netsun.com/Cards/' /* 根域名不同 */
	config.header = {
		...config.header,
		'content-type': 'application/x-www-form-urlencoded',
		// #ifdef APP-PLUS
		'qid': 3,
		// #endif
	}
	return config
})


http.interceptors.request.use((config) => { /* 请求之前拦截器。可以使用async await 做异步操作 */
	const token = getTokenStorage()
	config.header = {
		...config.header,
		'userid': token
	}
	// 登录接口和刷新token接口绕过
	if (config.url.indexOf('app_login_hongniang') >= 0) {
		return config
	}
	if (!token) {
		// 立即刷新token
		if (!isRefreshing) {
			console.log('刷新token ing')
			isRefreshing = true
			refreshToken().then(res => {
				console.log('获取token成功，存入头部',res)
				const {
					userid
				} = res.data
				http.setToken(userid)
				console.log('刷新token成功，执行队列')
				requests.forEach(cb => cb(userid))
				// 执行完成后，清空队列
				requests = []
			}).catch(res => {
				console.error('refresh token error: ', res)
			}).finally(() => {
				isRefreshing = false
			})
		}
		return new Promise(resolve => {
			requests.push((token) => {
				// 因为config中的token是旧的，所以刷新token后要将新token传进来
				config.header['userid'] = token
				resolve(config)
			})
		})

	}
	/*
	 if (!token) { // 如果token不存在，return Promise.reject(config) 会取消本次请求
	   return Promise.reject(config)
	 }
	 */
	return config
}, (config) => {
	return Promise.reject(config)
})


http.interceptors.response.use(async (response) => { /* 请求之后拦截器。可以使用async await 做异步操作  */
	// if (response.data.code !== 200) { // 服务端返回的状态码不等于200，则reject()
	//   return Promise.reject(response)
	// }
	return response
}, (response) => { // 请求错误做点什么。可以使用async await 做异步操作
	console.log(response)
	return Promise.reject(response)
})

export {
	http,
	test
}
