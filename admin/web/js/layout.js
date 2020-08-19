class Layout extends MylsObject {

	constructor(table, ext_id, view, mode, tHistory, viewMode, params) {
		super(table, ext_id, view, mode, tHistory, viewMode, params);
		this.type = 'layout';
		this.arrObjects = [];
		this.layoutColumns = [];
	}

	async init() {
		const self = this;
		await super.init();
		this.template = JSON.parse(this.getTemplate());
		//this.getTypeTabs();
		await this.createObject();
	}

	async createObject() {
		const self = this;
		let savedState = await this.sendStorageRequest("storage", "json", "GET", false, this.table, []);
		let template = this.template;
		if (savedState !== null && savedState !== 2) {
			//savedState = JSON.parse(savedState);
			template = savedState.content;
		}
		this.object = new GoldenLayout(this.getOptions(template), $('#' + this.idn));
		this.fillConfig(template, this.object);

		this.object.on('stackCreated', function (stack) {
			if (isNaN(stack.config.width) || stack.config.width == 'NaN')
				delete stack.config.width;
		});
		this.object.config.mylsExtId = this.ext_id;
		this.object.config.mylsTHistory = this.tHistory;
		this.object.config.mylsMode = this.mode;

		resizeSensor.create($('#' + this.idn)[0], () => this.object.updateSize($('#' + this.idn).width(), $('#' + this.idn).height()));
		this.object.init();
		this.createFramesObjects(template);

		this.object.config.mylsCanCreate = true;

		this.object.on('stateChanged', function () {
			//let state = JSON.stringify(self.object.toConfig());
			self.saveCurrentFrames(self.object.toConfig());
		});
	}

	getOptions(template) {
		return {
			content: template
		};
	}

	fillConfig(conf) {
		const self = this;
		$.each(conf, function (_, item) {
			if (item && item.type !== 'component') {
				self.fillConfig(item.content);
			}
			if (item && item.hasOwnProperty("type") && item.type == 'component') {
				const column = self.getColumn(item);
				column.idn = app.getIdn(app.appInfo.tables[column.tableId].tableType, column.tableId, self.ext_id, 'layout');
				item.componentState = {label: column.dataField};
				self.object.registerComponent(column.dataField, function (container, state) {
					container.getElement().html(column.tableId ? app.getObjectContainer(column.idn) : '<div id="' + self.idn + '_' + column.dataField + '" class="h-100"></div>');
				});
			}
		});
	}

	getColumn(item) {
		const column = this.columns.columns[item.componentName];
		if (item.hasOwnProperty("isClosable"))
			item.isClosable = item.isClosable == 'true' ? true : false;
		else
			item.isClosable = true;
		item.title = app.translate.saveString(item.title ? item.title : column.caption);
		return column;
	}

	async saveCurrentFrames(state) {
		state = app.replaceAll(state, ',"width":null', '');
		await this.sendStorageRequest("storage", "json", "POST", state, this.table);
		Promise.resolve();
	}

	createFramesObjects(conf, activeItemIndex = 0) {
		const self = this;
		$.each(conf, function (index, item) {
			if (item && item.hasOwnProperty("type")) {
				if (item.hasOwnProperty('activeItemIndex'))
					activeItemIndex = item.activeItemIndex;
				if (item.type !== 'component') {
					self.createFramesObjects(item.content, activeItemIndex);
				} else {
					if (index == activeItemIndex) {
						const column = self.columns.columns[item.componentName];
						const object = app.getObject(column.tableId, self.ext_id, 'layout', app.appInfo.tables[column.tableId].tableType, self.mode, self.tHistory);
						object.init();
					}
				}
			}
		});
	}

}