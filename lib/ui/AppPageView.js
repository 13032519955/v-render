// ========================================================
// 为移动端设计网页视图，引入了适用于移动端的脚本和样式
// @author shicy <shicy85@163.com>
// Create on 2016-11-06
// ========================================================

var PageView = require("./PageView");


var AppPageView = PageView.extend(module, {
	renderBody: function (body) {
		AppPageView.__super__.renderBody.call(this, body);
		body.addClass("render-as-mobile");
	},

	doFileImport: function () {
		this.import("/VRender.core.js?v=1611071212", {group: false});
		this.import("/VRender.front.mobile.css", {group: false});
		this.import("/VRender.front.mobile.js", {group: false});
	}
});