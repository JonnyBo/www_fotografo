class ChartView {
	constructor(table, chartType, viewMode, series, argument, idn, forGrid = false, toolbar = {}, columns = []) {
		//super(table, ext_id, view, mode, tHistory, viewMode, params);
		this.type = 'chart';
		this.pivotSel = [];
		this.dataSources = {};
		this.datas = {};
		this.arrTypes = {
			'bar': 'dxChart',
			'area': 'dxChart',
			'doughnut': 'dxPieChart',
			'map': 'dxVectorMap',
			'funnel': 'dxFunnel'
		};

		this.element = this.arrTypes[chartType];
		this.idn = idn;
		this.table = table;
		this.viewMode = viewMode;
		//this.params = params;
		//this.dataSource = dataSource;
		this.forGrid = forGrid;
		this.columns = columns;
		this.toolbar = toolbar;

		this.chartType = chartType;
		this.series = series;
		this.argument = argument;
		this.sortField = this.columns.columns[argument]['sortField'];
		if (!this.sortField)
			this.sortField = this.argument;
		/*else
			this.sortField = this.sortField.dataField;*/
		//this.template = template;
	}

	async init(data) {

		if (this.forGrid)
			this.dataSource = this.processData(data);
		else
			this.dataSource = data;

		await this.createObject();
		//$("#" + this.idn).data('mylsObject', this);

		//this.showToolbar();

		//if (this.template && this.template.report.length > 0) {
		//this.showReport();
		//}

		return this.object;

	}

	repaint(data) {
		if (this.forGrid)
			this.dataSource = this.processData(data);
		//не создавать объект
		//this.object
		//console.log(this.dataSource);
		this.createObject();
	}

	async createObject() {
		switch (this.element) {
			case 'dxVectorMap':
				this.object = await this.showVectorMap();
				break;
			case 'dxChart':
				this.object = this.showChart();
				break;
			case 'dxPieChart':
				this.object = this.showPieChart();
				break;
			case 'dxFunnel':
				this.object = this.showFunnel();
				break;
		}
	}

	render() {
		this.object.render();
	}

	showChart() {
		let chart = '';
		let $charContainer = $("#" + this.idn).append('');

		if (this.viewMode == 'compact')
			chart = $charContainer.dxChart(this.getCompactChartOptions()).dxChart("instance");
		else {
			//if ($charContainer.length == 0)
			//	$charContainer = $('<div class="myls-chart-container h-100"></div>').appendTo("#" + this.idn);
			$charContainer = $('<div class="myls-chart-container flex-grow-1"></div>').appendTo("#" + this.idn);
			chart = $charContainer.dxChart(this.getChartOptions()).dxChart("instance");
		}
		return chart;
	}

	showPieChart() {
		let $charContainer = $("#" + this.idn);
		if (this.viewMode != 'compact') {
			//if ($charContainer.length == 0)
			$charContainer = $('<div class="myls-chart-container h-100"></div>').appendTo("#" + this.idn);
		}
		const chart = $charContainer.dxPieChart(this.getPieChartOptions()).dxPieChart("instance");
		return chart;
	}

	showFunnel() {
		let $charContainer = $("#" + this.idn);
		if (this.viewMode != 'compact') {
			//if ($charContainer.length == 0)
			$charContainer = $('<div class="myls-chart-container h-100"></div>').appendTo("#" + this.idn);
		}
		const chart = $charContainer.dxFunnel(this.getFunnelOptions()).dxFunnel("instance");
		return chart;
	}

	getMapValues(country, value, data) {
		let result = [];
		$.each(data, function (index, item) {
			if (item[country] !== null) {
				if (result[item[country]]) {
					result[item[country]] += item[value];
				} else {
					result[item[country]] = item[value];
				}
			}
		});
		return result;
	}

	getMapMax(mapData) {
		let values = [];
		for (let key in mapData) {
			values.push(mapData[key]);
		}
		let maxValue = Math.floor(Math.max.apply(null, values));
		let digit = parseInt(maxValue.toString()[0]);
		return (digit + 1) * Math.pow(10, String(maxValue).length - 1);
	}

	getGroupFields(maxValue) {
		if (maxValue < 10)
			maxValue = 10;
		let groupField = [];
		for (let i = 0; i <= maxValue; i = i + maxValue / 10) {
			groupField.push(parseInt(i));
		}
		return groupField;
	}

	async showVectorMap() {
		const self = this;
		//this.fillDataSources();
		let $charContainer = $("#" + this.idn);
		//if ($charContainer.length == 0)
		$charContainer = $('<div class="myls-chart-container h-100"></div>').appendTo("#" + this.idn);
		const chart = $charContainer.dxVectorMap(this.getVectorMapOptions()).dxVectorMap("instance");
		//this.dataSource = this.dataSources[this.table];

		return chart;
	}

	getVectorMapOptions() {
		const self = this;
		let mapData = this.getMapValues(this.argument, this.series[0].valueField, this.dataSource);
		let maxValue = this.getMapMax(mapData);
		let groupField = this.getGroupFields(maxValue);
		return {
			bounds: [-180, 85, 180, -60],
			layers: {
				name: "areas",
				dataSource: DevExpress.viz.map.sources.world,
				palette: "Violet",
				colorGroups: groupField,
				colorGroupingField: this.argument,
				customize: function (elements) {
					self.customize(elements, mapData);
				}
			},
			legends: [{
				source: {layer: "areas", grouping: "color"},
				customizeText: function (arg) {
					return DevExpress.localization.formatNumber(arg.start, "#,##0") + " - " + DevExpress.localization.formatNumber(arg.end, "#,##0");
				}
			}],
			tooltip: {
				enabled: true,
				customizeTooltip: function (arg) {
					if (arg.attribute(self.argument)) {
						return {text: arg.attribute("name") + ": " + DevExpress.localization.formatNumber(arg.attribute(self.argument), "#,##0")};
					}
				}
			}
		};
	}

	getChartOptions() {
		const self = this;
		return {
			palette: "soft",
			dataSource: this.dataSource,
			commonSeriesSettings: {
				argumentField: this.argument,
				type: this.chartType
			},
			series: this.series,
			margin: {
				bottom: 20
			},
			legend: {
				verticalAlignment: "top",
				horizontalAlignment: "center"
			},
			"export": {
				enabled: false
			},
			"valueAxis": {
				autoBreaksEnabled: false,
			},
			tooltip: {
				enabled: true,
				customizeTooltip: function (pointInfo) {
					return {html: "<div class='chart-tooltip'><div class='chart-value'>" + self.formatNumber(pointInfo.value) + "</div><div class='chart-serie'>" + pointInfo.argumentText + "</div></div>"};
				}
			},
			onDisposing: function (e) {
			}
		};
	}

	formatNumber(cellValue) {
		if (cellValue !== null && cellValue !== '' && cellValue !== undefined) {
			try {
				const format = "#,##0.00";
				cellValue = DevExpress.localization.formatNumber(cellValue, format);
			} catch (e) {

			}
		}
		return cellValue;
	}

	getFunnelOptions() {
		return {
			palette: "soft",
			dataSource: this.dataSource,
			argumentField: this.argument,
			valueField: "item",
			margin: {
				bottom: 20
			},
			tooltip: {
				enabled: true,
				format: "fixedPoint"
			},
			item: {
				border: {
					visible: true
				}
			},
			label: {
				visible: true,
				position: "outside",
				backgroundColor: "none",
				customizeText: function (e) {
					return "<span class='mylsThemeLargeFont mylsMainFont'>" +
						e.percentText +
						"</span><br/>" +
						e.item.argument;
				}
			},
			sortData: false,
			"export": {
				enabled: false
			},
			onDisposing: function (e) {
			}
		};
	}

	getCompactChartOptions() {
		const self = this;
		return {
			palette: "pastel",
			dataSource: this.dataSource,
			commonSeriesSettings: {
				ignoreEmptyPoints: true,
				argumentField: this.argument,
				type: this.chartType,
				valueField: 'item',
			},
			commonAxisSettings: {
				visible: false,
				tick: {
					visible: false,
				},
				label: {
					visible: false,
				},
			},
			seriesTemplate: {
				nameField: this.argument,
			},
			legend: {
				visible: false,
			},
			"export": {
				enabled: false
			},
			"valueAxis": {
				autoBreaksEnabled: false,
			},
			tooltip: {
				enabled: true,
				customizeTooltip: function (pointInfo) {
					return {html: "<div class='chart-tooltip'><div class='chart-value'>" + self.formatNumber(pointInfo.value) + "</div><div class='chart-serie'>" + pointInfo.argumentText + "</div></div>"};
				}
			},
			onDisposing: function (e) {
			},

		};
	}

	getPieChartOptions() {
		const topNColumn = this.columns.getColumnsByColumnType('topn', true);
		let topN = null;
		if (topNColumn)
			topN = topNColumn.dataField;
		let options = {};
		if (this.viewMode == 'compact')
			options = this.getCompactChartOptions();
		else
			options = this.getChartOptions();

		if (topN) {
			options.commonSeriesSettings.smallValuesGrouping = {
				mode: "topN",
				topCount: 10
			};
		}
		options.legend = {visible: false};
		options.resolveLabelOverlapping = 'shift';
		options.commonSeriesSettings.label = {
			visible: true,
			connector: {
				visible: true,
				width: 0.5
			},
			position: "columns",
			customizeText: function (arg) {
				return arg.argument + " (" + arg.percentText + ")";
			}
		};
		return options;
	}

	processData(data) {
		const self = this;

		data = this.removeNull(data);
		//сортируем массив по заданному полю
		let sortField = String(this.sortField).trim().toLowerCase();
		let sortDir = 'asc';
		if (String(sortField).indexOf(' ') != -1)
		 {
		 	let words = String(sortField).split(' ');
		 	sortField = words[0];
		 	sortDir = words[1];
		 }
		data.sort((prev, next) => (prev[sortField] < next[sortField] && sortDir == 'asc') ? -1 : 1);

		let out = [];
		let old = '';
		let k = 0;
		for (let key in data) {
			if (old != data[key][this.argument]) {
				if (key > 0)
					k++;
				out[k] = {};
				out[k][this.argument] = data[key][this.argument];
				for (let i of this.series) {
					if (i.summaryType == 'count') {
						if (data[key][i.valueField] !== undefined)
							out[k][i.valueField] = 1;
						else
							out[k][i.valueField] = 0;
					} else {
						out[k][i.valueField] = data[key][i.valueField];
					}
				}
				old = data[key][this.argument];
			} else {
				for (let i of this.series) {
					//сумма
					if (i.summaryType == 'sum')
						out[k][i.valueField] = out[k][i.valueField] + data[key][i.valueField];
					//максимум
					if (i.summaryType == 'max') {
						if (data[key][i.valueField] > out[k][i.valueField]) {
							out[k][i.valueField] = data[key][i.valueField];
						}
					}
					//минимум
					if (i.summaryType == 'min') {
						if (data[key][i.valueField] < out[k][i.valueField]) {
							out[k][i.valueField] = data[key][i.valueField];
						}
					}
					//количество
					if (i.summaryType == 'count') {
						if (data[key][i.valueField] !== undefined) {
							out[k][i.valueField]++;
						}
					}
				}
			}
		}
		return out;
	}

	removeNull(data) {
		//удаляем значения равные null
		for (let i = data.length - 1; i >= 0; --i) {
			if (data[i][this.argument] == null) {
				data.splice(i, 1);
			}
		}
		return data;
	}

	customize(elements, mapData) {
		const self = this;
		$.each(elements, function (_, element) {
			const name = element.attribute('name');
			for (let key in mapData) {
				if (name == key) {
					element.attribute(self.argument, mapData[key]);
				}
			}
		});
	}

}