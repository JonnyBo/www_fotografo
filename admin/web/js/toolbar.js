class Toolbar {

	constructor(object) {
		this.currentFilter = [];
		this.table = object.table;
		this.ext_id = object.ext_id;
		this.view = object.view;
		this.type = object.type;
		this.mode = object.mode;
		this.tHistory = object.tHistory;
		this.items = [];
		this.mylsObject = object;
		this.btns = {};
	}

	createObject() {
		$("#" + this.mylsObject.idn).prepend('<div class="dx-datagrid-header-panel"></div>');
		$("#" + this.mylsObject.idn + " .dx-datagrid-header-panel").append('<div role="toolbar"></div>');
		//initToolbar(undefined, items, tableInfo, table, ext_id, 'cards', tHistory, columns);
		this.object = $("#" + this.mylsObject.idn + " [role=toolbar]").dxToolbar({
			items: this.items,
		}).dxToolbar("instance");
		$(document.body).on('click', '#' + this.mylsObject.idn + ' .dx-datagrid-filter-panel-left', function () {
			$('#' + this.mylsObject.idn + '_popupContainer').dxPopup("show");
		});
	}

	//инициализация тулбара
	async init(e) {
		this.isEdit = false;
		this.currentFilter = [];

		if (e /*this.type == 'grid' || this.type == 'tree'*/) {
			const obj = e.component;
			this.isEdit = obj.option('editing').mode == 'batch';
			//obj.option('editing').useIcons = true;
			this.items = e.toolbarOptions.items;
			this.object = e;
			this.getOptions();
		} else {
			this.createObject();
			this.object.option('items', this.getOptions());
		}

		this.editMode();
	}

	createAddButton() {
		if (this.mylsObject.tableInfo.a == 1 && !this.toolbarButtonExists("buttonAdd")) {
			this.items.push({
				widget: "dxButton",
				name: 'buttonAdd',
				locateInMenu: 'never',
				options: this.getAddBtnOptions(),
				location: "before",
				//text:app.translate.saveString("Добавить"),
				//showText:'inMenu'
			});
		}
	}

	createEditButton() {
		if (this.mylsObject.tableInfo.e == 1 && !this.toolbarButtonExists("buttonEdit") /*&& this.type !== 'scheduler'*/) {
			this.items.push({
				widget: "dxButton",
				name: 'buttonEdit',
				locateInMenu: 'never',
				//disabled: true,
				options: this.getEditBtnOptions(),
				location: "before",
				//text:app.translate.saveString("Редактировать"),
				//showText:'inMenu'
			});
		}
	}

	createDeleteButton() {
		if (this.mylsObject.tableInfo.d == 1/* && this.type !== 'scheduler'*/) {
			this.items.push({
				widget: "dxButton",
				name: 'buttonDelete',
				locateInMenu: 'never',
				//disabled: true,
				options: this.getDeleteBtnOptions(),
				location: "before",
				//text:app.translate.saveString("Удалить"),
				//showText:'inMenu'
			});
		}
	}

	createRefreshButton() {
		this.items.push({
			widget: "dxButton",
			name: 'buttonRefresh',
			locateInMenu: 'never',
			options: this.getRefreshBtnOptions(),
			location: "before",
			//text:app.translate.saveString("Обновить"),
			//showText:'inMenu'
		});
	}

	createImportButton() {
		if (this.mylsObject.tableInfo.a == 1 && this.mylsObject.tableInfo.import !== undefined) {
			this.items.push({
				widget: "dxButton",
				name: 'buttonImport',
				locateInMenu: 'auto',
				options: this.getImportBtnOptions(),
				location: "before",
				//text:app.translate.saveString("Ипортировать"),
				//showText:'inMenu'
			});
		}
	}

	createFilterButton() {
		if (this.type !== 'chart' && app.appInfo.useFilter != 0) {
			this.items.push({
				widget: "dxButton",
				name: 'buttonSearch',
				locateInMenu: 'never',
				options: this.getFilterBtnOptions(),
				location: "before",
				//text:app.translate.saveString("Фильтр"),
				//showText:'inMenu'
			});
		}
	}

	createAdminButton() {
		if (this.type == 'grid' || this.type == 'tree') {
			this.items.push({
				widget: "dxButton",
				name: 'buttonAdmin',
				locateInMenu: 'auto',
				options: this.getAdminBtnOptions(),
				location: "before"
			});
		}
	}

	createGridSortButton() {
		this.positionColumn = this.mylsObject.columns.getColumnsByColumnType('position', true);
		//if (positionColumn  && this.tableInfo.e == 1)
		//$('#' + this.idn + ' .dx-scrollview-content.card-view').sortable();
		if ((this.type == 'grid' || this.type == 'cards') && this.positionColumn && this.mylsObject.tableInfo.e == 1) {
			this.items.push({
				widget: "dxButton",
				name: 'buttonGridSort',
				locateInMenu: 'never',
				options: this.getGridSortBtnOptions(),
				location: "before",
				//text:app.translate.saveString("Сортировать по позиции"),
				//showText:'inMenu'
			});
			this.createExitButton();
		}
	}

	createFilterFields() {
		const self = this;
		let filterColumns = this.mylsObject.columns.getColumnsByColumnType('filter', false);
		let isLoadSelectBoxData = [];
		if (filterColumns.length > 0) {
			$.each(filterColumns, function (i, item) {
				isLoadSelectBoxData[item.dataField] = false;
				self.items.push({
					widget: "dxSelectBox",
					name: 'tableFilter',
					locateInMenu: 'auto',
					options: self.getFilterFieldsOptions(item, isLoadSelectBoxData),
					location: "center"
				});
			});
		}
	}

	createDateFilter() {
		let curDate = new Date();
		let date30 = new Date();
		date30.setDate(date30.getDate() - 30);
		if (this.mylsObject.tableInfo.selParams && app.findInArray('table_date', this.mylsObject.tableInfo.selParams) !== -1) {
			this.items.push(this.getStartDateBox());
		}
		if (this.mylsObject.tableInfo.selParams && app.findInArray('end_date', this.mylsObject.tableInfo.selParams) !== -1 && app.findInArray('table_date', this.mylsObject.tableInfo.selParams) !== -1) {
			this.items.push({
				text: " − ",
				location: "center"
			});
		}
		if (this.mylsObject.tableInfo.selParams && app.findInArray('end_date', this.mylsObject.tableInfo.selParams) !== -1) {
			this.items.push(this.getEndDateBox());
		}
	}

	getStartDateBox() {
		const self = this;
		return {
			widget: "dxDateBox",
			name: 'tableDate',
			locateInMenu: 'auto',
			options: {
				showClearButton: true,
				width: 125,
				value: this.mylsObject.selParams[':table_date'],
				onValueChanged: function (e) {
					self.dateValueChanged(':table_date', e);
				}
			},
			location: "center"
		};
	}

	getEndDateBox() {
		let curDate = new Date();
		const self = this;
		return {
			widget: "dxDateBox",
			name: 'tableDate',
			locateInMenu: 'auto',
			options: {
				width: 125,
				value: this.mylsObject.selParams[':end_date'],
				showClearButton: true,
				onValueChanged: function (e) {
					self.dateValueChanged(':end_date', e);
				}
			},
			location: "center"
		};
	}

	getOptions() {
		// кнопка Добавить
		this.createAddButton();
		// кнопка Редактировать
		this.createEditButton();
		// кнопка Удалить
		this.createDeleteButton();
		// кнопка Обновить
		this.createRefreshButton();
		//кнопка Импорт
		this.createImportButton();
		//кнопка Фильтр
		this.createFilterButton();
		//кнопка Админского сохранения
		//this.createAdminButton();//----------------------------------------- Временно прикрыл, чтобы никто не нажал
		//поля быстрой фильтрации
		this.createFilterFields();
		//фильтр по дате
		this.createDateFilter();
		//кнопка сортировки грида
		this.createGridSortButton();
		return this.items;
	}

	toolbarButtonExists(name) {
		return this.items.find((item) => {
			return item.name == name;
		}) !== undefined;
	}

	requiredField(item) {
		let isRequired = false;
		if ($.isArray(item.columnType)) {
			$.each(item.columnType, function (i, el) {
				if ($.type(el) == 'object') {
					if ('filter' in el) {
						if ($.inArray('required', el.filter) != -1) {
							isRequired = true;
							return false;
						}
					}
				}
			});
		}
		return isRequired;
	}

	async selectValueChanged(e, field) {
		let tableData = this.mylsObject.dataSource;
		let filter = [];
		if (e.component.option('value') !== null) {
			//this.currentFilter[field] = [[field, 'like', e.component.option('value') + '%,'], 'or', [field, 'like', ', %' + e.component.option('value')], 'or', [field, 'containing', ', ' + e.component.option('value') + ','], 'or', [field, '=', e.component.option('value')]];
			this.currentFilter[field] = [field, '=', e.component.option('value')];
		} else {
			delete this.currentFilter[field];
		}
		let out = [];
		for (let prop in this.currentFilter) {
			if (out.length > 0 && this.currentFilter[prop].length > 0) {
				out.push('and');
			}
			//console.log(prop);
			if (this.currentFilter[prop].length > 0)
				out.push(this.currentFilter[prop]);
		}
		filter.push(out);

		if (filter[0].length == 0) {
			filter = null;
		}
		tableData.mylsFilter = filter;
		//console.log(filter);
		this.mylsObject.refresh();
	}

	dateValueChanged(dateParam, e) {
		//let obj = getCurrentObj(e, type);
		if (this.mylsObject && this.mylsObject.dataSource) {
			let ds = this.mylsObject.dataSource;
			if (!ds.selParams)
				ds.selParams = {};
			if (e.value)
				ds.selParams[dateParam] = app.convertFromDateTime(e.value).slice(0, 10);
			else
				ds.selParams[dateParam] = null;
			this.mylsObject.refresh(false);
		}
	}

	editMode() {
		const self = this;
		const obj = this.mylsObject.object;
		if (!obj || !Object.keys(obj).length) return;

		if (this.mylsObject.type === 'grid' || this.mylsObject.type === 'tree') {
			let isEdit = obj.option('editing').mode == 'batch';

			/*if (isEdit) {
				this.createExitButton();
			}*/

			$.each(this.items, function (index, item) {
				if (item.name == 'saveButton' || item.name == 'revertButton') {
					item.location = 'before';
					item.sortIndex = 20;
					item.visible = isEdit;
					if (isEdit && item.hasNewOnClick === undefined) {
						item.hasNewOnClick = true;
						if (item.name == 'saveButton') {
							item.options.onClick = function (e) {
								obj.canFinishEdit = true;
								obj.saveEditData().done(function () {
									if (obj.canFinishEdit) {
										self.exitFromEditing();
									}
								});
							};
						}
						if (item.name == 'revertButton') {
							item.options.onClick = async function (e) {
								if (await app.dialog.confirm(self.mylsObject.idn, app.translate.saveString('Отменить все изменения?'), app.translate.saveString('Подтверждение'))) {
									obj.cancelEditData();
									self.exitFromEditing();
								}
							};
						}
					}
				}
				if (item.name == 'revertButton') {
					item.options.disabled = false;
				}
				if (item.name == 'addRowButton') {
					item.visible = false;
				}
				self.disableButtons(isEdit, 'edit', index);
			});
		}
	}

	showEditButtons(mode) {
		if (this.mylsObject.type === 'grid' || this.mylsObject.type === 'tree') {
			this.mylsObject.object.option('editing').allowUpdating = mode === 'batch' && this.mylsObject.tableInfo.e === 1;
			this.mylsObject.object.option('editing').allowAdding = mode === 'batch' && this.mylsObject.tableInfo.a === 1;
			this.mylsObject.object.option('editing').allowDeleting = mode === 'batch' && this.mylsObject.tableInfo.d === 1;
		}
	}

	disableButtons(isEdit, type, index) {
		$.each(this.btns, function (name, item) {
			if (name == 'edit' || name == 'delete' || name == 'refresh' || name == 'filter'
				|| (type == 'edit' && name == 'gridSort') || (type == 'sort' && name == 'add')) {
				item.option('visible', !isEdit);
				item.visible = !isEdit;
				if (index)
					item.sortIndex = index;
				//item.option('sortIndex', !isEdit);
			}
		});
		//this.object.repaint();
	}

	exitFromEditing(e) {
		const obj = this.mylsObject.object;
		if (this.type == 'grid') {
			obj.beginUpdate();
			obj.option('editing', {
				mode: 'row'
			});
			obj.option("focusedRowEnabled", true);
			obj.endUpdate();
		}
		console.log(this.type);
		this.isEdit = false;
		this.mylsObject.mode = 'sel';
		this.showEditButtons('row');
		if (this.type == 'cards') {
			//e.component.option('visible', false);
			this.btns.exitBtn.option('visible', false);
			this.btns.gridSort.option('icon', this.getSortedIcon());
			$('#' + this.mylsObject.idn + ' .dx-scrollview-content.card-view').sortable('destroy');
			this.mylsObject.refresh();
			this.disableButtons(false, 'sort');
		}

	}

	getSortedIcon() {
		return 'img/sort.svg?v=1';
	}

	getExitBtnOptions() {
		const self = this;
		return {
			icon: "img/revert.svg?v=1",
			elementAttr: {
				toolbarrole: "always",
				buttonrole: "exit",
			},
			visible: (this.positionColumn && this.mylsObject.tableInfo.e == 1) ? false : true,
			onInitialized: e => {
				self.btns.exitBtn = e.component;
			},
			onClick: function (e) {
				e.event.stopPropagation();
				self.exitFromEditing(e);
			}
		};
	}

	createExitButton() {
		if (!this.toolbarButtonExists("exit")) {
			this.items.push({
				widget: "dxButton",
				name: 'buttonExit',
				locateInMenu: 'auto',
				//disabled: true,
				options: this.getExitBtnOptions(),
				location: "before"
			});
		}
	}

	getAddBtnOptions() {
		const self = this;
		return {
			icon: "img/insert.svg?v=1",
			elementAttr: {
				toolbarrole: "always",
				buttonrole: "add",
			},
			onClick: function (e) {
				e.event.stopPropagation();
				self.mylsObject.processInsert();
			},
			onInitialized:(e) => {
				self.btns.add = e.component;
			}
		};
	}

	getEditBtnOptions(disable = true) {
		const self = this;
		return {
			elementAttr: {
				toolbarrole: "focused",
				buttonrole: "edit",
			},
			icon: "img/edit.svg?v=1",
			visible: !this.isEdit,
			disabled: disable,
			onClick: function (e) {
				e.event.stopPropagation();
				self.mylsObject.processDblClick();
			},
			onInitialized:(e) => {
				self.btns.edit = e.component;
			}
		};
	}

	getDeleteBtnOptions(disable = true) {
		const self = this;
		return {
			elementAttr: {
				toolbarrole: "focused",
				buttonrole: "delete",
			},
			visible: !this.isEdit,
			icon: "img/delete.svg?v=1",
			disabled: disable,
			onClick: async function (e) {
				//проверка отмеченных строк
				e.event.stopPropagation();
				let id = self.mylsObject.getCurrentId();
				let keys = self.mylsObject.getSelectedRows();
				// Кнопка по-умолчанию для диалога для любой ситуации
				let params = self.getDeleteOptions(id, keys);
				let dialogResult = await app.dialog.custom(app.translate.saveString("Вы действительно хотите удалить запись(и)?"), app.translate.saveString('Удаление'), params, 'myls-msg-error');
				if (dialogResult === 1) {
					keys = [id];
				}
				// Если не отмена, то вызываем функцию удаления
				if (dialogResult !== 0) {
					await self.mylsObject.deleteRowById(keys);
				}
			},
			onInitialized:(e) => {
				self.btns.delete = e.component;
			}
		};
	}

	getDeleteOptions(id, keys) {
		let params = [
			{
				text: "Удалить текущую",
				type: 'danger',
				tabIndex: 1,
				result: 1
			}];
		//текущая не совпадает с выделенной или несколько выделенных
		// Добавляем кнопку выбора выделенных строк
		if ((keys.length == 1 && id != keys[0]) || keys.length > 1) {
			params.push({
				text: app.translate.saveString("Удалить отмеченные"),
				type: 'danger',
				tabIndex: 2,
				stylingMode: 'outlined',
				result: 2
			});
		}
		// Добавляем кнопку отмены
		params.push({
			text: app.translate.saveString("Отменить"),
			type: 'default',
			stylingMode: 'outlined',
			tabIndex: 0,
			result: 0
		});
		return params;
	}

	getRefreshBtnOptions() {
		const self = this;
		return {
			elementAttr: {
				toolbarrole: "always",
				buttonrole: "refresh",
			},
			icon: "/img/refresh.svg?v=1",
			visible: !self.isEdit,
			onClick: async function (e) {
				self.mylsObject.refresh();
				self.updateFilterList();
			},
			onInitialized:(e) => {
				self.btns.refresh = e.component;
			}
		};
	}

	async updateFilterList() {
		const self = this;
		let filterColumns = self.mylsObject.columns.getColumnsByColumnType('filter', false);
		let isLoadSelectBoxData = [];
		$.each(filterColumns, function (index, item) {
			isLoadSelectBoxData[item.dataField] = false;
			self.filterFieldsInitialized(isLoadSelectBoxData, item, item.filterObject);
		});
	}

	getImportBtnOptions() {
		const self = this;
		return {
			elementAttr: {
				toolbarrole: "always",
				buttonrole: "import",
			},
			text: "Import",
			visible: !this.isEdit,
			onClick: function (e) {
				//открываем попап с полем ввода файла
				self.createImportPopup();
			},
			onInitialized:(e) => {
				self.btns.import = e.component;
			}
		};
	}

	createImportPopup() {
		if (this.type == 'grid' || this.mylsObject.type === 'tree') {
			$("#" + this.mylsObject.idn).append('<div id="' + this.mylsObject.idn + '_popupContainer"></div>');
			$("#" + this.mylsObject.idn + '_popupContainer').append('<div id="' + this.mylsObject.idn + '_fileUploader"></div>');//добавляем fileupload
			if (this.mylsObject.tableInfo.import !== undefined) {
				$("#" + this.mylsObject.idn + '_popupContainer').append('<div id="' + this.mylsObject.idn + '_list"></div>');
				$("#" + this.mylsObject.idn + "_list").dxDataGrid({
					dataSource: this.mylsObject.tableInfo.import,
				});
			}
			$("#" + this.mylsObject.idn + '_popupContainer').append('<div id="' + this.mylsObject.idn + '_error"></div>');//добавляем поле длля ошибок
			this.importFilename = '';
			$('#' + this.mylsObject.idn + '_fileUploader').dxFileUploader(this.getImportFileUploadOptions()).dxFileUploader("instance");

			let popup = $('#' + this.mylsObject.idn + '_popupContainer').dxPopup({
				title: "Popup Title",
				toolbarItems: [{
					location: "after"
				},
					this.getPopupButtonOK(),
					this.getPopupButtonCancel(),
				],
			});
			popup.dxPopup("instance").show();
		}
	}

	getPopupButtonCancel() {
		return {
			widget: "dxButton",
			toolbar: "bottom",
			location: "after",
			options: {
				text: app.translate.saveString("Отмена"),
				onClick: function (e) {
					$('#' + this.mylsObject.idn + '_popupContainer').dxPopup("instance").hide();
				}
			}
		};
	}

	getPopupButtonOK() {
		const self = this;
		return {
			widget: "dxButton",
			toolbar: "bottom",
			location: "after",
			options: {
				text: app.translate.saveString("Ok"),
				onClick: function (e) {
					//импортируем
					self.fileImport();
				}
			}
		};
	}

	fileImport() {
		const self = this;
		if (this.filename !== '') {
			$.ajax({
				type: "POST",
				cache: false,
				url: "frame/importfromfiles",
				data: {files: self.filename, table_id: self.table},
				success: function (data) {
					let res = $.parseJSON(data);
					if (res.type == 'error') {
						$('#' + self.mylsObject.idn + '_error').html(res.data);
					}
					if (res.type == 'success') {
						$('#' + self.mylsObject.idn + '_error').html(res.data);
					}
					//обновляем таблицу
					self.mylsObject.refresh(false);
				}
			});
		} else {
			//нет файлов
			$('#' + self.mylsObject.idn + '_error').text(app.translate.saveString('Нет файлов для импорта'));
		}
	}

	getImportFileUploadOptions() {
		const self = this;
		return {
			multiple: false,
			allowedFileExtensions: [".csv", ".xls", ".xlsx"],
			uploadMode: "instantly",
			uploadUrl: "frame/uploadfile?field=" + this.mylsObject.idn + '_fileUploader',
			name: this.mylsObject.idn + '_fileUploader',
			minFileSize: 10,
			onUploaded: function (e) {
				let res = $.parseJSON(e.request.response);
				if (res == 'error') {
					$('#' + self.mylsObject.idn + '_error').html('<p class="error_str">' + saveString('Ошибка! Файл не загружен!') + '</p>');
				} else {
					self.filename = res;
					$('#' + self.mylsObject.idn + '_error').text('');
				}
			},
		};
	}

	getFilterBtnOptions() {
		const self = this;
		return {
			elementAttr: {
				toolbarrole: "always",
				buttonrole: "search",
			},
			icon: "img/filter.svg?v=1",
			onClick: function (e) {
				self.mylsObject.filter.init(e);
			},
			onInitialized:(e) => {
				self.btns.filter = e.component;
			}
		};
	}

	getAdminBtnOptions() {
		const self = this;
		return {
			elementAttr: {
				toolbarrole: "always",
				buttonrole: "admin",
			},
			icon: "preferences",
			onClick: function (e) {
				let state = self.mylsObject.object.state();
				app.prepareStorage(state);
				$.ajax({
					url: "frame/tablesetting",
					method: 'post',
					data: {'table': this.table, 'state': JSON.stringify(state)},
					success: function (data) {
						console.log('ok');
					},
					fail: function (error) {
						console.log(error);
					}
				});
			},
			onInitialized:(e) => {
				self.btns.admin = e.component;
			}
		};
	}

	getGridSortBtnOptions(disable = true) {
		const self = this;
		return {
			elementAttr: {
				toolbarrole: "focused",
				buttonrole: "gridsort",
				class: '',
			},
			icon: this.getSortedIcon(),
			disabled: disable,
			onInitialized:(e) => {
				self.btns.gridSort = e.component;
			},
			onClick: function (e) {
				let cls = e.component.option('icon');
				if (cls.indexOf('sort') != -1) {
					self.startOrdered(e);
					self.disableButtons(true, 'sort');
					self.btns.exitBtn.option('visible', true);
				} else {
					self.saveOrdered(e);
					self.disableButtons(false, 'sort');
					self.btns.exitBtn.option('visible', false);
				}
			}
		};
	}

	startOrdered(e) {
		const self = this;
		e.component.option('icon', 'img/save.svg?v=1');
		if (self.type == 'grid') {
			self.mylsObject.object.clearSorting();
			self.mylsObject.object.columnOption(this.positionColumn.dataField, "sortOrder", 'asc');
		}
		self.createExitButton();
		setTimeout(function () {
			if (self.type == 'cards')
				$('#' + self.mylsObject.idn + ' .dx-scrollview-content.card-view').sortable();
			if (self.type == 'grid')
				$('#' + self.mylsObject.idn + ' .dx-datagrid-table tbody').sortable();
		}, 1000);
	}

	async saveOrdered(e) {
		const self = this;
		//меняем иконку на кнопке на сортировать и сохраняем изменения
		let itemNodes = [];
		let positionGrid;
		if (this.type == 'grid') {

			$('#' + self.mylsObject.idn + ' .dx-row').each(function (index, item) {
				let id = $(this).attr('data-id');
				if (id !== undefined)
					itemNodes.push(id);
			});
			positionGrid = {
				table: self.table,
				dataField: this.positionColumn.dataField,
				data: JSON.stringify(itemNodes)
			};
		}
		if (this.type == 'cards') {
			const positionColumn = this.mylsObject.columns.getColumnsByColumnType('position', true);
			$('#' + self.mylsObject.idn + ' .dx-list-item').each(function (index, item) {
				let id = $(this).find('.card').attr('data-id');
				itemNodes.push(id);
			});
			positionGrid = {table: self.table, dataField: positionColumn.dataField, data: JSON.stringify(itemNodes)};
			//app.processData('frame/updateposition', 'POST', positionCards);
		}

		await app.processData('frame/updateposition', 'POST', positionGrid);
		await this.mylsObject.refresh();
		e.component.option('icon', this.getSortedIcon());
		if (self.type == 'grid')
			$('#' + self.mylsObject.idn + ' .dx-datagrid-table tbody').sortable('destroy');
		if (self.type == 'cards')
			$('#' + self.mylsObject.idn + ' .dx-scrollview-content.card-view').sortable('destroy');
	}

	getFilterFieldsOptions(item, isLoadSelectBoxData) {
		const self = this;
		return {
			dataSource: [],
			displayExpr: item.dataField,
			valueExpr: item.dataField,
			//searchEnabled: true,
			showSelectionControls: false,
			placeholder: item.caption,
			showClearButton: false,
			buttons: ["clear", "dropDown"],
			width: item.width,
			elementAttr: {
				class: 'mylsThemeFont11'
			},
			onInitialized: async function (e) {
				await self.filterFieldsInitialized(isLoadSelectBoxData, item, e);
				item.filterObject = e;
			},
			onValueChanged: function (e) {
				self.filterFieldsValueChanged(item, e);
			}
		};
	}

	filterFieldsValueChanged(item, e) {
		if (this.requiredField(item)) {
			let selItems = e.component.option('items');
			if (selItems.length > 0) {
				if (e.component.option('value') == null) {
					e.component.option('value', selItems[0][item.dataField]);
				}
			}
		}
		this.selectValueChanged(e, item.dataField);
	}

	async filterFieldsInitialized(isLoadSelectBoxData, item, e) {
		if (isLoadSelectBoxData[item.dataField] === false) {
			let filterParams = this.mylsObject.columns.getColumnTypeItem('filter', item);
			let params = this.mylsObject.columns.getColumnTypeParameters(filterParams);
			let itemData = await app.processData('frame/get-filter-string-data', 'post', {
				table: this.table,
				field: item.dataField,
				extId: this.ext_id,
				selParams: this.mylsObject.dataSource.selParams,
				params: params,
			});
			isLoadSelectBoxData[item.dataField] = true;
			app.removeNullFromArray(itemData);
			itemData = app.removeEmptyFromArray(itemData);

			this.mylsObject.object.beginUpdate();
			e.component.option('dataSource', itemData);
			if (this.requiredField(item)) {
				await this.mylsObject.dataSource.load();
				if (itemData.length > 0) {
					if (e.component.option('value') == null) {
						e.component.option('value', itemData[0][item.dataField]);
					}
					e.component.option('value', itemData[0][item.dataField]);
				}
				this.mylsObject.object.endUpdate();
			} else {
				e.component.option('showClearButton', true);
				this.mylsObject.object.endUpdate();
			}
		}
	}

	setEnabledToolbar() {
		const curId = this.mylsObject.getCurrentId();
		const focused = curId == 0 || curId === undefined ? false : true;
		const element = this.mylsObject.object.element();
		$.each(element.find('[toolbarrole=always]'), function (index, item) {
			$(item).dxButton("instance").option("disabled", false);
		});
		$.each(element.find('[toolbarrole=focused]'), function (index, item) {
			$(item).dxButton("instance").option("disabled", !focused);
		});
	}

	destroy() {
		this.mylsObject = null;
		this.object = null;
		app.destroyArray(this.items);
	}

}