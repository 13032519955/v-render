// ========================================================
// 列表
// @author shicy <shicy85@163.com>
// Create on 2018-01-07
// ========================================================

(function (backend) {
	if (!backend && VRender.Component.Render.listview)
		return ;

	var Utils = backend ? require(__vrender__).Utils : VRender.Utils;
	var ListRenderer = backend ? require("./_base").ListRenderer : VRender.Component.Render._list;
	var UIButton = backend ? require("../../../ui/component/UIButton") : VRender.Component.Button;

	///////////////////////////////////////////////////////
	var Renderer = function (context, options) {
		ListRenderer.call(this, context, options);
	};
	var _Renderer = Renderer.prototype = new ListRenderer();

	// options: titleField, descField
	Renderer.itemRenderer_simple = function (options) {
		var _options = {style: "ui-listview-item1", title: null, desc: null};
		if (typeof options === "string") {
			_options.title = options;
			_options.desc = arguments && arguments[1];
		}
		else if (options) {
			_options.title = options.titleField;
			_options.desc = options.descField;
		}
		return Renderer.itemRendererFunction.call(this, _options);
	};

	// options: iconField, titleField, descField, defaultIconUrl
	Renderer.itemRenderer_icon = function (options) {
		var _options = {style: "ui-listview-item2", icon: null, title: null, desc: null};
		if (typeof options == "string") {
			_options.icon = options;
			_options.title = arguments && arguments[1];
			_options.desc = arguments && arguments[2];
		}
		else if (options) {
			_options.icon = options.iconField;
			_options.title = options.titleField;
			_options.desc = options.descField;
			_options.defIcon = options.defaultIconUrl;
		}
		// if (Utils.isNull(_options.desc))
		// 	_options.desc = ""; // 不使用可选字段
		return Renderer.itemRendererFunction.call(this, _options);
	};

	// options: buttons, titleField, descField
	Renderer.itemRenderer_button = function (options) {
		var _options = {style: "ui-listview-item3", buttons: null, title: null, desc: null};
		if (typeof options == "string") {
			_options.title = options;
			_options.desc = arguments && arguments[1];
		}
		else if (Utils.isArray(options)) {
			_options.buttons = options;
			_options.title = arguments && arguments[1];
			_options.desc = arguments && arguments[2];
		}
		else if (options) {
			_options.buttons = options.buttons;
			_options.title = options.titleField;
			_options.desc = options.descField;
		}
		// if (Utils.isNull(_options.desc))
		// 	_options.desc = "";
		return Renderer.itemRendererFunction.call(this, _options);
	};

	// options: iconField, buttons, titleField, descField
	Renderer.itemRenderer_icon_button = function (options) {
		var _options = {style: "ui-listview-item4", buttons: null, icon: null, title: null, desc: null};
		if (typeof options == "string") {
			_options.icon = options;
			_options.buttons = arguments && arguments[1];
			_options.title = arguments && arguments[2];
			_options.desc = arguments && arguments[3];
		}
		else if (Utils.isArray(options)) {
			_options.buttons = options;
			_options.title = arguments && arguments[1];
			_options.desc = arguments && arguments[2];
		}
		else if (options) {
			_options.icon = options.iconField;
			_options.buttons = options.buttons;
			_options.title = options.titleField;
			_options.desc = options.descField;
		}
		// if (Utils.isNull(_options.desc))
		// 	_options.desc = "";
		return Renderer.itemRendererFunction.call(this, _options);
	};

	Renderer.itemRendererFunction = function (options) {
		var func = function ($, item, data, index) {
			var opt = options || {};

			var self = this;
			var getValue = function (field, optFields) {
				if (Utils.isNotNull(field))
					return data && data[field];
				if (data && optFields) {
					for (var i in optFields) {
						var _field = optFields[i];
						if (Utils.isNotBlank(_field) && data.hasOwnProperty(_field))
							return data[_field];
					}
				}
				if (field == "title") {
					if (Utils.isFunction(self.getDataLabel))
						return self.getDataLabel(data, index);
				}
			};

			var item = $("<div></div>").addClass(opt.style);

			if (opt.hasOwnProperty("icon")) {
				var iconUrl = getValue(opt.icon, ["icon", "image", "img"]);
				var image = $("<img class='icon'/>").appendTo(item);
				image.attr("src", (Utils.trimToEmpty(iconUrl) || opt.defIcon || null));
			}

			var content = $("<div class='content'></div>").appendTo(item);
			var title = getValue(opt.title, ["title"]);
			$("<div class='title'></div>").appendTo(content).html(title || "&nbsp;");

			var description = getValue(opt.desc, ["desc", "description", "remark"]);
			if (Utils.isNotBlank(description))
				$("<div class='desc'></div>").appendTo(content).html(description);

			if (opt.hasOwnProperty("buttons")) {
				var btnbar = $("<div class='btnbar'></div>").appendTo(item);
				Utils.each(Utils.toArray(opt.buttons), function (data) {
					if (typeof VRender === "undefined") { // 服务端
						new UIButton(self.context, data).render(btnbar);
					}
					else { // 前端
						UIButton.create(Utils.extend({}, data, {target: btnbar}));
					}
				});
			}

			return item;
		};

		func._state = 1;
		func._data = JSON.stringify(options);
		return func;
	};

	// ====================================================
	_Renderer.render = function ($, target) {
		target.addClass("ui-listview");
		if (this.isChkboxVisible())
			target.addClass("show-chkbox");

		target.append("<ul></ul>");
		ListRenderer.render.call(this, $, target);
		renderPaginator.call(this, $, target);
		renderEmptyView.call(this, $, target);
		renderLoadView.call(this, $, target);

		return this;
	};

	_Renderer.isChkboxVisible = function () {
		return Utils.isTrue(this.options.chkbox);
	};

	_Renderer.getPaginator = function () {
		return this.options.paginator || this.options.pager;
	};

	_Renderer.getItemContainer = function ($, target) {
		return target.children("ul");
	};

	_Renderer.renderOneItem = function ($, item, data, index, bSelected) {
		renderOneItem.call(this, $, item, data, index, bSelected);
	};

	// ====================================================
	var renderOneItem = function ($, item, data, index, bSelected) {
		var container = $("<div class='box'></div>").appendTo(item);
		ListRenderer.renderOneItem.call(this, $, item, container, data, index, bSelected);

		if (this.isChkboxVisible()) {
			item.prepend("<span class='chkbox'></span>");
		}
	};

	var renderPaginator = function ($, target) {
		if (backend) {
			ListRenderer.renderPager.call(this, target, this.getPaginator());
		}
	};

	var renderEmptyView = function ($, target) {
		var container = $("<div class='listview-empty'></div>").appendTo(target);
		var emptyView = null;
		if (this.options.hasOwnProperty("emptyView")) {
			emptyView = this.options.emptyView;
			if (emptyView) {
				if (Utils.isFunction(emptyView.render))
					emptyView.render(container);
				else 
					container.append(emptyView);
			}
		}
		else {
			emptyView = $("<div class='listview-emptydef'></div>").appendTo(container);
			var emptyText = this.options.emptyText || this.options.empty;
			emptyText = Utils.isNull(emptyText) ? "没有数据" : Utils.trimToEmpty(emptyText);
			if (emptyText)
				$("<p></p>").appendTo(emptyView).html(emptyText);
		}
	};

	var renderLoadView = function ($, target) {
		var container = $("<div class='listview-load'></div>").appendTo(target);
		var loadView = this.options.loadingView;
		if (loadView) {
			if (Utils.isFunction(loadView.render))
				loadView.render(container);
			else
				container.append(loadView);
		}
		else {
			var loadView = $("<div class='listview-loaddef'></div>").appendTo(container);
			var loadText = this.options.loadingText;
			loadText = Utils.isNull(loadText) ? "正在加载.." : Utils.trimToEmpty(loadText);
			if (loadText)
				$("<p></p>").appendTo(loadView).html(loadText);
		}
	};

	///////////////////////////////////////////////////////
	if (backend) {
		module.exports = Renderer;
	}
	else {
		Renderer.renderOneItem = renderOneItem;
		VRender.Component.Render.listview = Renderer;
	}

})(typeof VRender === "undefined");