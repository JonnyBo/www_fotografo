class Charts extends MylsObject {

	constructor(table, ext_id, view, mode, tHistory, viewMode, params) {
		super(table, ext_id, view, mode, tHistory, viewMode, params);
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
		this.chartType = 'bar';
		this.element = 'dxChart';
		this.rNum = 0;
	}

	async init() {
		await super.init();
		if (this.tableInfo.view !== '') {
			//тип диаграммы
			this.chartType = this.tableInfo.view;
			this.element = this.arrTypes[this.tableInfo.view];
		}
		this.setSeries();
		this.argument = this.columns.getColumnsByColumnType('argument', true).dataField;

		this.chartView = new ChartView(this.table, this.chartType, this.viewMode, this.series, this.argument, this.idn, false, this.toolbar, this.columns, this.template);

		if (this.element == 'dxVectorMap')
			await this.fillDataSources();
		else
			this.datas[this.table] = await this.createDatas(this.table);

		this.object = await this.chartView.init(this.datas[this.table]);

		//this.createObject();
		$("#" + this.idn).data('mylsObject', this);
		this.showToolbar();
		this.object.render();
		if (this.template && this.template.report.length > 0) {
			this.showReport();
		}

	}

	setSeries() {
		const self = this;
		this.series = [];
		$.each(this.columns.getColumnsByColumnType('serie', false), function (index, item) {
			self.series.push({valueField: item.dataField, name: item.caption, summaryType: item.summaryType});
		});
	}

	fillDataSources() {
		const self = this;
		if (self.template && self.template.report.length > 0) {
			$.each(self.template.report, function (index, item) {
				self.pivotSel.push({
					'id': index,
					'name': item.hasOwnProperty("@attributes") ? item['@attributes'].caption : item['attributes'].caption,
				});
				let tableId = item.hasOwnProperty("@attributes") ? item['@attributes'].tableId : item['attributes'].tableId;
				if (!tableId) {
					tableId = self.table;
				}
				if (!self.dataSources.hasOwnProperty(tableId)) {
					//self.dataSources[tableId] = self.createDataSource(tableId);
					self.datas[tableId] = self.createDatas(tableId);
				}
			});
		} else {
			//self.dataSources[self.table] = self.createDataSource(self.table);
			self.datas[self.table] = self.createDatas(self.table);
		}
	}

	async createDatas(tableId) {
		if (this.datas && this.datas.hasOwnProperty(tableId))
			return this.datas[tableId];
		else {
			let params = this.prepareTableData();
			params.filter = JSON.stringify(this.dataSource.mylsFilter);
			const result = await app.processData('frame/tabledata', 'post', this.prepareTableData());
			this.datas[tableId] = this.chartView.processData(result);
			return this.datas[tableId];
		}
	}

	showToolbar() {
		//console.log(this.toolbar);
		//if (this.viewMode != 'compact') {

		if ((this.template && this.template.report.length > 0) || this.viewMode != 'compact' || this.columns.getColumnsByColumnType('filter', true)) {
			this.toolbar.init();
			if (this.pivotSel.length > 0) {
				const self = this;
				let items = this.toolbar.object.option('items');
				items.push({
					widget: "dxSelectBox",
					name: 'selectRow',
					locateInMenu: 'auto',
					options: {
						elementAttr: {
							toolbarrole: "always",
						},
						dataSource: this.pivotSel,
						displayExpr: "name",
						valueExpr: "id",
						value: 0,
						width: 250,
						onValueChanged: function (e) {
							self.rNum = e.value;
							self.showReport();
						}
					},
					location: "center"
				});
				this.toolbar.object.option('items', items);
			}
		}
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

	async showReport() {
		const list = this.template.report[this.rNum];
		let tableId = list.hasOwnProperty("@attributes") ? list['@attributes'].tableId : list['attributes'].tableId;
		if (!tableId) {
			tableId = this.table;
		}
		//await this.dataSources[tableId].load();

		this.datas[tableId] = await this.createDatas(tableId);

		//await this.refresh(true, true, this.dataSources[tableId]);
		await this.refresh(true, true, this.datas[tableId]);
		this.dataSource = this.dataSources[tableId];
		this.changed();
	}

	updateMap(dataSource) {
		//console.log(this.dataSources);
		let series = [];
		$.each(this.columns.getColumnsByColumnType('serie', false), function (index, item) {
			series.push({valueField: item.dataField, name: item.caption});
		});
		let currentSerie = series[this.rNum];
		let elements = this.object.getLayers()[0].getElements();
		let argument = this.columns.getColumnsByColumnType('argument', true).dataField;
		//let mapData = this.getMapValues(argument, currentSerie.valueField, dataSource.items());
		let mapData = this.chartView.getMapValues(argument, currentSerie.valueField, dataSource);
		let maxValue = this.chartView.getMapMax(mapData);
		let groupField = this.chartView.getGroupFields(maxValue);
		$.each(elements, function (_, element) {
			const name = element.attribute('name');
			element.attribute(argument, undefined);
			for (let key in mapData) {
				if (name == key) {
					element.attribute(argument, mapData[key]);
				}
			}
		});
		this.object.option("layers.colorGroups", groupField);
	}

	async refresh(changesOnly = true, useLoadPanel = true, dataSource) {
		super.refresh(changesOnly, useLoadPanel);
		if (this.element == 'dxVectorMap') {
			this.updateMap(dataSource);
		} else /*if (this.element == 'dxFunnel' || this.element == 'dxPieChart')*/ {
			let params = this.prepareTableData();
			params.filter = JSON.stringify(this.dataSource.mylsFilter);
			const result = await app.processData('frame/tabledata', 'post', params);
			this.datas[this.table] = this.chartView.processData(result);
			this.object.option('dataSource', this.datas[this.table]);
		} /*else {
			this.object.refresh();
		}*/
	}

	destroy() {
		super.destroy();
		$("#" + this.idn).data('mylsObject', null);
		app.destroyArray(this.dataSources);
		app.destroyArray(this.pivotSel);
		app.destroyArray(this.datas);
		app.destroyArray(this.arrTypes);
		app.destroyArray(this.series);
		this.close();
	}

}