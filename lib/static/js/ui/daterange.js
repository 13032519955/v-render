// ========================================================
// 日期范围选择框
// @author shicy <shicy85@163.com>
// Create on 2016-12-24
// ========================================================

(function (isFront) {
	if (isFront && VRender.Component.DateRange)
		return ;

	///////////////////////////////////////////////////////
	var Utils = isFront ? VRender.Utils : require(__vrender__).Utils;
	var HolderBase = (isFront ? VRender.Component : require("./base")).HolderBase;

	var cn_month = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];

	var getFormatDate = function (date, dateFormat) {
		if (Utils.isFunction(dateFormat))
			return dateFormat(date);
		if (Utils.isBlank(dateFormat))
			dateFormat = "yyyy-MM-dd";
		return Utils.toDateString(date, dateFormat);
	};

	var formatQuickDates = function (quickDates) {
		var results = [];
		Utils.each(Utils.toArray(quickDates), function (data) {
			if (Utils.isNotBlank(data)) {
				if (typeof data !== "object")
					data = {value: data};
				data.value = parseInt(data && data.value) || 0;
				if (data.value > 0)
					results.push(data);
			}
		});
		return results;
	};

	var getDateRangeLabel = function (start, end, dateFormat) {
		if (start && end) {
			return getFormatDate(start, dateFormat) + " 至 " + getFormatDate(end, dateFormat);
		}
		return "";
	};

	///////////////////////////////////////////////////////
	var Holder = function (options) {
		HolderBase.call(this, options);
		this.setStartDate(this.options.start);
		this.setEndDate(this.options.end);
		this.setMinDate(this.options.min);
		this.setMaxDate(this.options.max);
		this.setPrompt(this.options.prompt);
		this.setDateFormat(this.options.format || this.options.dataFormat);
		this.setQuickDates(this.options.quickDates);
		this.setQuickDefault(this.options.quickDef);
		this.setQuickDropdwn(this.options.dropdown);
	};
	var _Holder = Holder.prototype = new HolderBase();

	_Holder.render = function ($, target) {
		target.addClass("ui-daterange");

		var start = this.getStartDate();
		var end = this.getEndDate();

		var quickDates = formatQuickDates(this.getQuickDates());
		var quickDefault = this.getQuickDefalut();

		if (quickDates && quickDates.length > 0 && quickDefault > 0) {
			var match = Utils.index(quickDates, function (tmp) {
				return tmp.value === quickDefault;
			});
			if (match >= 0) {
				start = new Date();
				end = new Date();
				if (quickDefault > 1)
					start.setDate(start.getDate() - quickDefault - 1);
			}
		}

		if (start && !end)
			end = new Date(start.getTime());
		if (end && !start)
			start = new Date(end.getTime());

		if (start && end) {
			target.attr("data-start", Utils.toDateString(start, "yyyy/MM/dd"));
			target.attr("data-end", Utils.toDateString(end, "yyyy/MM/dd"));
		}

		renderQuickDates.call(this, $, target, quickDates, quickDefault);
		renderDateInput.call(this, $, target, start, end);

		if (this.isQuickDropdown())
			target.addClass("tools-dropdown");

		var minDate = this.getMinDate();
		if (minDate)
			target.attr("data-min", Utils.toDateString(minDate, "yyyy/MM/dd"));

		var maxDate = this.getMaxDate();
		if (maxDate)
			target.attr("data-max", Utils.toDateString(maxDate, "yyyy/MM/dd"));

		return this;
	};

	// ====================================================
	_Holder.getStartDate = function () {
		return Utils.isBlank(this.d_start) ? null : Utils.toDate(this.d_start);
	};
	_Holder.setStartDate = function (value) {
		this.d_start = value;
	};

	_Holder.getEndDate = function () {
		return Utils.isBlank(this.d_end) ? null : Utils.toDate(this.d_end);
	};
	_Holder.setEndDate = function (value) {
		this.d_end = value;
	};

	_Holder.getMinDate = function () {
		return Utils.isBlank(this.d_max) ? null : Utils.toDate(this.d_max);
	};
	_Holder.setMinDate = function (value) {
		this.d_max = value;
	};

	_Holder.getMaxDate = function () {
		return Utils.isBlank(this.d_min) ? null : Utils.toDate(this.d_min);
	};
	_Holder.setMaxDate = function (value) {
		this.d_min = value;
	};

	_Holder.getDateFormat = function () {
		return this.d_format;
	};
	_Holder.setDateFormat = function (value) {
		this.d_format = value;
	};

	_Holder.getPrompt = function () {
		return this.d_prompt;
	};
	_Holder.setPrompt = function (value) {
		this.d_prompt = value;
	};

	_Holder.getQuickDates = function () {
		return this.d_quickdates;
	};
	_Holder.setQuickDates = function (value) {
		this.d_quickdates = value;
	};

	_Holder.getQuickDefalut = function () {
		return parseInt(this.d_quickdef) || 0;
	};
	_Holder.setQuickDefault = function (value) {
		this.d_quickdef = value;
	};

	_Holder.isQuickDropdown = function () {
		return Utils.isTrue(this.d_dropdown);
	};
	_Holder.setQuickDropdwn = function (bool) {
		this.d_dropdown = bool;
	};

	// ====================================================
	var renderQuickDates = function ($, target, quickDates, quickDefault) {
		if (quickDates && quickDates.length > 0) {
			var self = this;
			var items = $("<div class='tools'></div>").prependTo(target);
			Utils.each(quickDates, function (data) {
				var value = parseInt(data && data.value) || 0;
				var item = $("<div class='item'></div>").appendTo(items);
				item.attr("data-val", value);
				item.text(Utils.isBlank(data.label) ? ("最近" + value + "天") : data.label);
				if (quickDefault == value)
					item.addClass("selected");
			});
		}
	};

	var renderDateInput = function ($, target, start, end) {
		var iptTarget = $("<div class='ipt'></div>").appendTo(target);
		var input = $("<input type='text' readonly='readonly'/>").appendTo(iptTarget);
		iptTarget.append("<button class='clear'></button>");

		var prompt = this.getPrompt();
		if (Utils.isNotBlank(prompt))
			iptTarget.append("<span class='prompt'>" + prompt + "</span>");

		var dateFormat = this.getDateFormat();
		var dateRange = getDateRangeLabel(start, end, dateFormat);

		input.val(dateRange);

		if (!isFront && dateFormat) {
			if (Utils.isFunction(dateFormat))
				target.write("<div class='format format-fn'>" + escape(dateFormat) + "</div>");
			else
				target.write("<div class='format'>" + dateFormat + "</div>");
		}

		if (Utils.isNotBlank(dateRange))
			target.addClass("has-val");
	};

	// ====================================================
	if (!isFront)
		return module.exports = Holder;

	///////////////////////////////////////////////////////
	var Component = VRender.Component;

	var UIDateRange = Component.DateRange = function (view, options) {
		if (this.init(view, options) !== this)
			return Component.get(view);

		var self = this;
		this.$el.tap(".ipt", function (e) { iptClickHandler.call(self, e); });
		this.$el.tap(".ipt > .clear", function (e) { clearBtnHandler.call(self, e); }, true);
		this.$el.tap(".tools > .item", function (e) { quickBtnHandler.call(self, e); });
		this.$el.tap(".picker header button", function (e) { pickerMonthHandler.call(self, e); }, true);
		this.$el.tap(".picker footer .ui-btn", function (e) { pickerButtonHandler.call(self, e); }, true);
		this.$el.tap(".picker tbody td", function (e) { pickerDateHandler.call(self, e); }, true);
		this.$el.on("mouseenter", function (e) { pickerMouseHandler.call(self, e); });
		this.$el.on("mouseleave", function (e) { pickerMouseHandler.call(self, e); });
	};
	var _UIDateRange = UIDateRange.prototype = new Component.base();

	UIDateRange.find = function (view) {
		return Component.find(view, ".ui-daterange", UIDateRange);
	};

	UIDateRange.create = function (options) {
		var target = Component.create(options);
		var holder = new Holder(options).render($, target);
		return new UIDateRange(target, options, holder);
	};

	// ====================================================
	_UIDateRange.getDateRange = function (format) {
		var start = this.getStartDate();
		var end = this.getEndDate();
		var range = {start: null, end: null};
		if (start && end) {
			range.start = Utils.toDate(Utils.toDateString(start, "yyyy-MM-dd 00:00:00"));
			range.end = Utils.toDate(Utils.toDateString(end, "yyyy-MM-dd 13:59:59"));
			if (Utils.isNotBlank(format)) {
				range.start = Utils.toDateString(range.start, format);
				range.end = Utils.toDateString(range.end, format);
			}
		}
		return range;
	};
	_UIDateRange.setDateRange = function (start, end, trigger) {
		start = Utils.toDate(start);
		end = Utils.toDate(end);
		// start = start || end;
		// end = end || start;
		if (start && end) {
			start = Utils.toDateString(start, "yyyy/MM/dd");
			end = Utils.toDateString(end, "yyyy/MM/dd");
			if (start > end)
				start = end = null;
		}

		this.$el.attr("data-start", (start || ""));
		this.$el.attr("data-end", (end || ""));
		this.$el.find(".tools > .selected").removeClass("selected");

		renderDateRangeLabel.call(this);
		renderPickerDate.call(this);

		if (trigger)
			this.trigger("change", this.getDateRange());
	};
	_UIDateRange.setQuickDateRange = function (value, trigger) {
		value = parseInt(value) || 0;
		var item = Utils.find(this.$el.children(".tools").children(), function (temp) {
			return parseInt(temp.attr("data-val")) === value;
		});

		if (item && item.length > 0) {
			item.addClass("selected").siblings().removeClass("selected");

			var start = new Date(), end = new Date();
			if (value > 1)
				start.setDate(start.getDate() - value + 1);

			this.$el.attr("data-start", Utils.toDateString(start, "yyyy/MM/dd"));
			this.$el.attr("data-end", Utils.toDateString(end, "yyyy/MM/dd"));
			renderDateRangeLabel.call(this);
			renderPickerDate.call(this);
		}

		if (trigger)
			this.trigger("change", this.getDateRange());
	};

	_UIDateRange.getStartDate = function () {
		return Utils.toDate(this.$el.attr("data-start"));
	};
	_UIDateRange.setStartDate = function (value, trigger) {
		this.setDateRange(value, this.getEndDate(), trigger);
	};

	_UIDateRange.getEndDate = function () {
		return Utils.toDate(this.$el.attr("data-end"));
	};
	_UIDateRange.setEndDate = function (value, trigger) {
		this.setDateRange(this.getStartDate(), value, trigger);
	};

	_UIDateRange.getMinDate = function () {
		return Utils.toDate(this.$el.attr("data-min"));
	};
	_UIDateRange.setMinDate = function (value) {
		var date = Utils.toDate(value);
		if (date)
			this.$el.attr("data-min", Utils.toDateString(date, "yyyy/MM/dd"));
		else
			this.$el.removeAttr("data-min");
		renderPickerDate.call(this);
	};

	_UIDateRange.getMaxDate = function () {
		return Utils.toDate(this.$el.attr("data-max"));
	};
	_UIDateRange.setMaxDate = function (value) {
		var date = Utils.toDate(value);
		if (date)
			this.$el.attr("data-max", Utils.toDateString(date, "yyyy/MM/dd"));
		else
			this.$el.removeAttr("data-max");
		renderPickerDate.call(this);
	};

	_UIDateRange.getDateFormat = function () {
		if (this.hasOwnProperty("_dateFormat"))
			return this._dateFormat;
		if (this.options.hasOwnProperty("format"))
			return this.options.format;
		if (this.options.hasOwnProperty("dateFormat"))
			return this.options.dateFormat;
		var format = this.$el.children(".format").text();
		if (format && this.$el.children(".format-fn").length > 0) {
			format = (new Function("var Utils=VRender.Utils;return (" + 
				unescape(format) + ");"))();
		}
		this.$el.children(".format").remove();
		return this._dateFormat = format;
	};
	_UIDateRange.setDateFormat = function (value) {
		this._dateFormat = value;
		this.$el.children(".format").remove();
		this.setDateRange(this.getStartDate(), this.getEndDate());
	};

	_UIDateRange.setQuickDates = function (dates, defVal, trigger) {
		this.$el.children(".tools").remove();
		renderQuickDates(formatQuickDates(dates), defVal);

		var selectedItem = this.$el.children(".tools").children(".selected");
		if (trigger) {
			if (selectedItem.length > 0)
				selectedItem.tap();
			else 
				this.trigger("change", this.getDateRange());
		}
		else if (selectedItem.length > 0) {
			this.setQuickDateRange(selectedItem.attr("data-val"));
		}
	};

	// ====================================================
	var iptClickHandler = function (e) {
		if (!this.picker) {
			this.picker = createDatePicker(this.$el.children(".ipt"));
			renderPickerDate.call(this, this.getStartDate(), this.getEndDate());
		}

		if (this.$el.is(".show-picker"))
			return ;
		this.$el.addClass("show-picker").removeClass("show-before").removeClass("show-right");

		var pickerOffset = this.picker.offset();
		var pickerRight = pickerOffset.left + this.picker.width();
		var pickerBottom = pickerOffset.top + this.picker.height();
		var documentRight = $(window).width() + $("body").scrollLeft();
		var documentBottom = $(window).height() + $("body").scrollTop();
		if (pickerRight > documentRight)
			this.$el.addClass("show-right");
		if (pickerBottom > documentBottom)
			this.$el.addClass("show-before");
	};

	var quickBtnHandler = function (e) {
		this.setQuickDateRange($(e.currentTarget).attr("data-val"), true);
	};

	var pickerMonthHandler = function (e) {
		var btn = $(e.currentTarget);
		var table = btn.parent().parent();

		var attrName = "data-" + (table.is(".table-s") ? "start" : "end");
		var date = Utils.toDate(this.picker.attr(attrName));
		date.setMonth(date.getMonth() + (btn.is(".prev") ? -1 : 1));
		this.picker.attr(attrName, Utils.toDateString(date, "yyyy/MM/01"));

		var year = date.getFullYear(), month = date.getMonth();
		renderTable.call(this, table, year, month);
	};

	var pickerDateHandler = function (e) {
		var item = $(e.currentTarget);
		if (item.is(".disabled"))
			return ;
		var date = Utils.toDate(item.attr("data-dt"));
		if (this.bFirstMark) {
			this.bFirstMark = false;
			if (date.getTime() > this.markStart.getTime())
				this.markEnd = date;
			else 
				this.markStart = date;
			renderPickerDate.call(this);
		}
		else {
			this.bFirstMark = true;
			this.markStart = this.markEnd = date;
			renderPickerDate.call(this);
		}
	};

	var pickerButtonHandler = function (e) {
		this.$el.removeClass("show-picker");
		if ($(e.currentTarget).attr("name") === "submit") {
			var start = this.markStart || this.getStartDate();
			var end = this.markEnd || this.getEndDate();
			this.markStart = this.markEnd = null;
			this.setDateRange(start, end, true);
		}
		else {
			this.markStart = this.markEnd = null;
			renderPickerDate.call(this);
		}
		this.bFirstMark = false;
	};

	var clearBtnHandler = function (e) {
		this.setDateRange(null, null, true);
		return false;
	};

	var pickerMouseHandler = function (e) {
		var target = this.$el;
		if (e.type === "mouseenter") {
			var timerId = parseInt(target.attr("timerid"));
			if (timerId) {
				clearTimeout(timerId);
				target.removeAttr("timerid");
			}
		}
		else /*if (e.type === "mouseleave")*/ {
			var timerId = setTimeout(function () {
				target.find(".picker .ui-btn[name='cancel']").click();
			}, 1500);
			target.attr("timerid", timerId);
		}
	};

	// ====================================================
	var renderDateRangeLabel = function () {
		var label = getDateRangeLabel(this.getStartDate(), this.getEndDate(), 
			this.getDateFormat());
		this.$el.find(".ipt input").val(label);
		if (Utils.isBlank(label))
			this.$el.removeClass("has-val");
		else
			this.$el.addClass("has-val");
	};

	var createDatePicker = function (target) {
		var picker = $("<div class='picker'></div>").appendTo(target);

		var content = $("<div class='content'></div>").appendTo(picker);
		var tables = $("<div class='table table-s'></div>" +
			"<div class='table table-e'></div>").appendTo(content);
		tables.append("<header><label></label><button class='prev'>" +
			"</button><button class='next'></button></header>");
		var table = $("<table><thead></thead><tbody></tbody></table>").appendTo(tables);
		table.children("thead").append("<tr><th>日</th><th>一</th><th>二</th>" +
			"<th>三</th><th>四</th><th>五</th><th>六</th></tr>"); 

		var footer = $("<footer></footer>").appendTo(picker);
		footer.append("<div class='values'><span class='start'></span> - " +
			"<span class='end'></span></div>");
		var btns = $("<div class='btns'></div>").appendTo(footer);
		VRender.Component.Button.create({target: btns, label: "确定", type: "ok", name: "submit"});
		VRender.Component.Button.create({target: btns, label: "取消", type: "cancel", name: "cancel"});

		return picker;
	};

	var renderPickerDate = function (pickerStart, pickerEnd) {
		var picker = this.picker;
		if (picker) {
			pickerStart = pickerStart || Utils.toDate(picker.attr("data-start")) || this.getStartDate();
			pickerEnd = pickerEnd || Utils.toDate(picker.attr("data-end")) || this.getEndDate() || new Date();
			if (!pickerStart) {
				pickerStart = new Date(pickerEnd.getFullYear(), pickerEnd.getMonth() - 1, 1);
			}

			var pickerStartYear = pickerStart.getFullYear();
			var pickerStartMonth = pickerStart.getMonth();
			var pickerStartTime = pickerStartYear * 100 + pickerStartMonth;

			var pickerEndYear = pickerEnd.getFullYear();
			var pickerEndMonth = pickerEnd.getMonth();
			var pickerEndTime = pickerEndYear * 100 + pickerEndMonth;

			if (pickerStartTime == pickerEndTime) {
				pickerStart.setMonth(pickerStartMonth - 1);
				pickerStartYear = pickerStart.getFullYear();
				pickerStartMonth = pickerStart.getMonth();
			}
			else if (pickerStartTime > pickerEndTime) {
				var date = pickerStart, year = pickerStartYear, month = pickerStartMonth;
				pickerStart = pickerEnd;
				pickerEnd = date;
				pickerStartYear = pickerEndYear;
				pickerEndYear = year;
				pickerStartMonth = pickerEndMonth;
				pickerEndMonth = month;
			}

			picker.attr("data-start", Utils.toDateString(pickerStart, "yyyy/MM/01"));
			picker.attr("data-end", Utils.toDateString(pickerEnd, "yyyy/MM/01"));

			renderTable.call(this, picker.find(".table-s"), pickerStartYear, pickerStartMonth);
			renderTable.call(this, picker.find(".table-e"), pickerEndYear, pickerEndMonth);

			var markStart = this.markStart || this.getStartDate();
			markStart = markStart ? Utils.toDateString(markStart, "yyyy-MM-dd") : "";
			picker.find("footer .start").text(markStart);

			var markEnd = this.markEnd || this.getEndDate();
			markEnd = markEnd ? Utils.toDateString(markEnd, "yyyy-MM-dd") : "";
			picker.find("footer .end").text(markEnd);
		}
	};

	var renderTable = function (target, year, month) {
		target.find("header > label").text(year + "年 " + cn_month[month] + "月");
		target.attr("data-year", year).attr("data-month", month);

		var dt = new Date(year, month, 1);
		dt.setDate(1 - dt.getDay());

		var dt0 = new Date(); // today
		var t0 = dt0.getFullYear() * 10000 + dt0.getMonth() * 100 + dt0.getDate();

		var start = this.markStart || this.getStartDate(), ts = 0;
		if (start)
			ts = start.getFullYear() * 10000 + start.getMonth() * 100 + start.getDate();
		var end = this.markEnd || this.getEndDate(), te = 0;
		if (end)
			te = end.getFullYear() * 10000 + end.getMonth() * 100 + end.getDate();

		var min = this.getMinDate(), tmin = 0;
		if (min)
			tmin = min.getFullYear() * 10000 + min.getMonth() * 100 + min.getDate();
		var max = this.getMaxDate(), tmax = 21001231;
		if (max)
			tmax = max.getFullYear() * 10000 + max.getMonth() * 100 + max.getDate();

		var tbody = target.find("tbody").empty();
		while (true) {
			var tr = $("<tr></tr>").appendTo(tbody);
			for (var i = 0; i < 7; i++) {
				var _y = dt.getFullYear(), _m = dt.getMonth(), _d = dt.getDate();
				var _t = _y * 10000 + _m * 100 + _d;
				var td = $("<td></td>").appendTo(tr);
				td.append("<span>" + _d + "</span>");
				td.attr("data-dt", (_y + "/" + (_m + 1) + "/" + _d));
				if (_m !== month || _t < tmin || _t > tmax)
					td.addClass("disabled");
				else {
					if (_t === t0)
						td.addClass("today");
					if (_t >= ts && _t <= te)
						td.addClass("selected");
					if (_t === ts)
						td.addClass("start");
					if (_t === te)
						td.addClass("end");
				}
				dt.setDate(_d + 1);
			}
			if (dt.getMonth() > month || dt.getFullYear() > year)
				break;
		}

		checkMonthBtnVisible.call(this);
	};

	var checkMonthBtnVisible = function () {
		var start = Utils.toDate(this.picker.attr("data-start"));
		var end = Utils.toDate(this.picker.attr("data-end"));
		start.setMonth(start.getMonth() + 1);
		if (start.getMonth() === end.getMonth()) {
			this.picker.find(".table-s .next").hide();
			this.picker.find(".table-e .prev").hide();
		}
		else {
			this.picker.find(".table-s .next").show();
			this.picker.find(".table-e .prev").show();
		}
	};

	// ====================================================
	Component.register(".ui-daterange", UIDateRange);

})(typeof VRender !== "undefined");