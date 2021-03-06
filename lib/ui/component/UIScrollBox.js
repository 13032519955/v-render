// ========================================================
// 滚动加载
// @author shicy <shicy85@163.com>
// Create on 2018-04-12
// ========================================================

var Utils = require("../../util/Utils");
var UIView = require("../UIView");
var VRender = require("../../v-render");
var ScrollBoxRender = require("../../static/js/render/scrollbox");


var UIScrollBox = UIView.extend(module, {

	getScrollContainer: function () {
		return this.options.scroller;
	},
	setScrollContainer: function (value) {
		this.options.scroller = value;
	},

	getContentView: function () {
		return this.options.content || this.options.view;
	},
	setContentView: function (value) {
		this.options.content = value;
		delete this.options.view;
	},

	getLoadingText: function () {
		return this.options.loadingText;
	},
	setLoadingText: function (value) {
		this.options.loadingText = value;
	},

	getLoadingView: function () {
		return this.options.loadingView;
	},
	setLoadingView: function (value) {
		this.options.loadingView = value;
	},

	getRefreshPullText: function () {
		return this.options.refreshPullText;
	},
	setRefreshPullText: function (value) {
		this.options.refreshPullText = value;
	},

	getRefreshDropText: function () {
		return this.options.refreshDropText;
	},
	setRefreshDropText: function (value) {
		this.options.refreshDropText = value;
	},

	getRefreshLoadText: function () {
		return this.options.refreshLoadText;
	},
	setRefreshLoadText: function (value) {
		this.options.refreshLoadText = value;
	},

	getRefreshView: function () {
		return this.options.refreshView;
	},
	setRefreshView: function (value) {
		this.options.refreshView = value;
	},

	getTopDistance: function () {
		return this.options.topDistance;
	},
	setTopDistance: function (value) {
		this.options.topDistance = value;
	},

	getBottomDistance: function () {
		return this.options.bottomDistance;
	},
	setBottomDistance: function (value) {
		this.options.bottomDistance = value;
	},

	getBottomView: function () {
		return this.options.bottomView;
	},
	setBottomView: function (value) {
		this.options.bottomView = value;
	},

	getEmptyView: function () {
		return this.options.emptyView;
	},
	setEmptyView: function (value) {
		this.options.emptyView = value;
	},

	getRefreshFunction: function () {
		return this.options.refreshFunction;
	},
	setRefreshFunction: function (value) {
		this.options.refreshFunction = value;
	},

	getMoreFunction: function () {
		return this.options.moreFunction;
	},
	setMoreFunction: function (value) {
		this.options.moreFunction = value;
	},

	render: function (output) {
		UIScrollBox.__super__.render.call(this, output);
		var renderer = new ScrollBoxRender(this, this.options);
		renderer.render(VRender.$, this.$el);
	}

});
