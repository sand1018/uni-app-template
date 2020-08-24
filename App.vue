<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')


		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	page {
		font-family: -apple-system, SF UI Text, Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei, WenQuanYi Micro Hei, sans-serif;
	}
</style>

<style lang="scss">
	@import './colorui/main.scss';

	/*每个页面公共css */
	/* #ifndef APP-PLUS-NVUE */
	page {
		background: #fff;

	}

	image {
		margin: 0;
		padding: 0;
	}

	button {
		border-radius: 0;
		border: nonel;
		background-color: transparent;
		padding: 0;
		line-height: normal;
		font-size: 28rpx;
		overflow: visible;
		margin: 0;
	}

	button::after {
		border: none;
		border-radius: 0;
	}

	::-webkit-scrollbar {
		width: 0px;
		/* 滚动条宽度为0 */
		height: 0px;
		/* 滚动条高度为0 */
		display: transparent;
		/* 滚动条隐藏 */
	}

	/* #endif */
</style>
