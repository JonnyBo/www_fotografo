class MylsEditableObject extends MylsObject {

	constructor(table, ext_id, view, mode, tHistory, viewMode, params) {
		super(table, ext_id, view, mode, tHistory, viewMode, params);
		this.updatedValues = {};
		this.rawData = {};
		this.rawValues = {};
		this.updatedExtId = [];
		this.updatedExtField = [];
		this.deps = {};
	}

	async update(key, values) {
		this.updatedValues = values;
		await this.save(key);
		this.changed();
		this.toolbar.setEnabledToolbar();
	}

	async insert(values) {
		this.rawData = this.rawValues[values['id']];
		this.updatedValues = values;
		try {
			await this.save(values['id']);
			this.changed();
			this.toolbar.setEnabledToolbar();
			Promise.resolve();
		} catch (error) {
			Promise.reject();
		}
	}

	// Особая обработка лукапов со своими апдейтами
	async updateLookups() {
		let self = this;
		$.each(this.columns.columns, async function (index, item) {
			if (item.dataType == 'lookup' && item.updateConditions) {
				await self.processUpdateLookup(item);//????????????используем только для объектов?
			}
		});
	}

	async processUpdateLookup(column) {
		const self = this;
		const updValues = {};
		$.each(column.updateConditions, function (_, item) {
			updValues[item] = self.updatedValues[item] ? self.updatedValues[item] : self.rawData[item];
		});
		const updParams = {};
		updParams.id = column.id;
		updParams.isTabler = this.tableInfo.isTabler;
		updParams.params = JSON.stringify(updValues);
		try {
			await app.processData('frame/updatelookup', 'post', updParams);
		} catch (error) {
			await this.processResult(error);
		}

		// Удаляем из массива значений проадейченный лукапом только в том случае,
		// когда у таблицы нет специального апдейта
		if (!this.tableInfo.updParams.length)
			this.updatedValues[column.dataField] = undefined;
	}

	createUpdatedValues(key) {
		const self = this;
		// Создаем массив измененных значений только
		const updateArr = {};

		let updParams = 'updParams';
		if (this.mode == 'ins')
			updParams = 'insConParams';

		// Если у таблицы специальный апдейт через процедуру, то собираем для него значения
		if (this.tableInfo.hasOwnProperty(updParams) && this.tableInfo[updParams].length) {
			getUpdateProcArr();
		} else
			getUpdateArr();

		if (this.mode == 'ins') {
			updateArr[this.updatedExtField[key]] = this.updatedExtId[key];
		}

		if (Object.keys(updateArr).length != 0) {
			this.columns.convertFromDateTimeColumns(updateArr);
			this.columns.solveFloatProblem(updateArr);
			this.columns.solveBooleanProblem(updateArr);
		}

		if (this.tableData.hasOwnProperty('manual_updated')) {
			updateArr['manual_updated'] = 1;
		}
		return updateArr;

		function getUpdateProcArr() {
			$.each(self.tableInfo[updParams], function (_, item) {
				updateArr[item] = self.updatedValues[item] !== undefined ? self.updatedValues[item] : self.rawData[item];
			});
			app.addConfigParams(updateArr);
		}

		function getUpdateArr() {
			$.each(self.rawData, function (index, value) {
				const column = self.columns.columns[index];
				if (column) {
					if (value != self.updatedValues[index] && (column.useColumn || column.allowEditing)) {
						updateArr[index] = self.updatedValues[index];
					}

					// Если столбец был скрыт зависимостями, то обнуляем его данные
					if (self.updatedValues.hasOwnProperty(column.dataField) && column.hasOwnProperty('toClear') && column.toClear && self.updatedValues[index]) {
						if (column.dataType == 'boolean')
							updateArr[index] = 0;
						else
							updateArr[index] = null;
					}
				}
			});
		}
	}

	getUpdatePromise(updateArr, ext_id) {
		let updParams = 'updParams';
		if (this.mode == 'ins')
			updParams = 'insConParams';

		const params = {
			table: this.table,
			ext_id: ext_id ? ext_id : this.ext_id,
			data: JSON.stringify(updateArr),
			type: this.mode,
			isTabler: this.tableInfo.isTabler !== undefined ? this.tableInfo.isTabler : 0
		};

		if (this.tableInfo.hasOwnProperty(updParams) && this.tableInfo[updParams].length) {
			params.params = JSON.stringify(updateArr);
			return app.processData('frame/updateproc', 'post', params);
		} else {
			params.data = JSON.stringify(updateArr);
			return app.processData('frame/update', 'post', params);
		}
	}

	destroy() {
		super.destroy();
		app.destroyArray(this.updatedExtId);
		app.destroyArray(this.updatedExtField);
		app.destroyArray(this.rawValues);
		app.destroyArray(this.updatedValues);
		app.destroyArray(this.rawData);
		app.destroyArray(this.deps);
	}

	validate() {
		return true;
	}

	disableButtons() {

	}

	createAllValues(updateArr) {
		const self = this;
		// Создаем массив текущих значений, объединяя все данные из rawData и updateArr
		const currentValues = $.extend({}, this.rawData, updateArr);
		this.columns.solveBooleanProblem(currentValues);
		this.columns.convertFromDateTimeColumns(currentValues);

		return currentValues;
	}

	async save(key) {
		const self = this;
		return new Promise(async (resolve, reject) => {
			if (!await self.validate()) {
				reject();
			} else {
				self.disableButtons(true);
				const updateArr = self.createUpdatedValues(key);
				const currentValues = self.createAllValues(updateArr);

				// Проверяем введенные данные
				try {
					await self.checkData(currentValues);
					await self.updateLookups();
					// Если все ок, то продолжаем сохранение формы
					await self.saveData(updateArr, key);
					await self.additionalSave();
					// А теперь запускаем закрывающую процедуру
					await self.execCloseProc(currentValues);
					resolve();
				} catch (error) {
					await self.processResult(error);
					self.disableButtons(false);
					reject();
				}
			}
		});
	}

	async additionalSave() {

	}

	execCloseProc(data) {
		return this.execDataProcedure('closeProc', 'form/closeproc', data);
	}

	execCancelProc(data) {
		return this.execDataProcedure('cancelProc', 'form/cancelproc', data);
	}

	execDataProcedure(procedureName, url, data) {
		const self = this;
		return new Promise(async (resolve, reject) => {
			if (!self.tableInfo[procedureName] || !self.tableInfo[procedureName].length) {
				resolve();
				return;
			}
			const postParams = this.getPostParams(data, self.tableInfo[procedureName]);
			try {
				const result = await app.processData(url, 'post', postParams);
				//await self.processResult(result);
				resolve();
			} catch (error) {
				await self.processResult(error);
				reject();
			}
		});
	}

	async saveData(updateArr, key) {
		const promise = this.getUpdatePromise(updateArr, key);
		try {
			const result = await promise;
			this.processResult(result);
		} catch (error) {
			this.processResult(error);
		} finally {
			if (this.tableInfo.refreshAll) {
				this.refresh(false);
			}
		}
	}

	checkData(data) {
		const self = this;
		return new Promise(async (resolve, reject) => {
			if (!self.tableInfo.checkProc || !self.tableInfo.checkProc.length) {
				resolve();
				return;
			}

			const postParams = this.getPostParams(data, self.tableInfo.checkProc);
			try {
				let msg = await app.processData('frame/checkdata', 'post', postParams);
				if (msg.success && !msg.success[0].error_msg) {
					resolve();
					return;
				} else {
					if (!msg.error && msg.success[0].error_type == 1) {
						const result = await app.dialog.confirm(this.idn, msg.success[0].error_msg, 'Предупреждение', 'Сохранить', 'Отменить', 'myls-msg-warning');
						if (result) resolve();
						else reject();
						return;
					} else {
						await app.dialog.showError(self.idn, msg.error ? msg.error : msg.success[0].error_msg);
						reject();
					}
				}
			} catch (error) {
				await self.processResult(error);
				reject();
			}
		});
	}

	getPostParams(data, procedure) {
		const postParams = {'table': this.table};
		const params = {};
		$.each(procedure, function (index, item) {
			params[item] = null;
			if (data[item] !== null && data[item] !== undefined) {
				params[item] = data[item];
			}
		});
		app.addConfigParams(params);
		postParams.params = JSON.stringify(params);
		return postParams;
	}

	setFieldVisible(object, column, isVisible) {

	}

	setFieldCaption(object, column, caption) {

	}

	setFieldValidation(object, column, rules) {

	}

	setFieldValue(object, column, value) {

	}

	setFieldEditable(object, column, result) {

	}

	async prepareInsert(params, justInsert) {
		let data = await app.processData('frame/tabledata', 'post', this.prepareTableData(-1, 'ins'));
		this.updatedExtId[data[0]['id']] = data['ext_id'];
		this.updatedExtField[data[0]['id']] = data['ext_field'];
		this.rawValues[data['ext_id']] = app.cloneObject(data[0]);
		data = data[0];

		// Проходим по истории и добавляем, если необходимо, внешние ключи
		this.passHistoryValues(data);
		this.columns.setDefaultValues(data);
		// Проставляем значения, пришедшие в параметрах
		this.passParamsValues(data, params);

		if (!justInsert) {
			this.object.on('initNewRow', function (e) {
				e.data = data;
			});
			this.object.addRow();
		}
		return data;
	}

	afterInit() {
		super.afterInit();
		this.createFileUploader();
	}

	getDocumentOptions() {
		const self = this;
		const column = this.columns.getColumnsByColumnType('fileurl', true);
		const params = this.getImageParams(column);
		let count = 0;
		let url = "documents/fileupload";
		if (params)
			url += "?params="+params;
		return {
			multiple: true,
			uploadMode: "instantly",
			uploadUrl: url,
			name: "documentFiles",
			showFileList: false,
			onProgress: function (e) {
				self.progressBar.position(e.component.option('progress'));
			},
			onUploadStarted: function (e) {
				self.progressBar.init(100 + e.component.option("value").length, false);
			},
			onUploadError: function (e) {
				count = count + 1;
				self.progressBar.position(100 + count);
			},
			onUploaded: async function (e) {
				//self.progressBar.position(100);
				await self.documentUploaded(e);
				count = count + 1;
				self.progressBar.position(100 + count);
				if (100 + e.component.option("value").length == 100 + count) {
					e.component.option("value", []);
					count = 0;
				}
			},
		};
	}

	getImageParams(column) {
		if (column && column.dataType  == 'image') {
			if (column.columnType)
				return JSON.stringify(column.columnType);
		}
		return false;
	}

	async documentUploaded(e) {
		const filename = $.parseJSON(e.request.response);
		if (filename !== '') {
			// Если обработчик файла находится на сервере
			if (this.tableInfo.docProc[0] != '=') {
				const docParams = {fileaddr: filename};
				await app.processData(this.tableInfo.docProc, 'GET', docParams);
			} else if (this.tableInfo.docProc == '=loadfiles') {
				let params = {};
				params[this.columns.getColumnsByColumnType('file', true).dataField] = e.file.name;
				params[this.columns.getColumnsByColumnType('fileurl', true).dataField] = filename;

				if (this.tableInfo.formId) {
					//const mode = this.mode;
					this.mode = 'ins';
					let data = await this.prepareInsert(params, true);
					await this.insert(data);
					this.mode = 'sel';
				} else {
					await this.editRecord(-1, this.tHistory, 'ins', params);
				}
			}
		}
	}

	createFileUploader() {
		if (this.tableInfo.docProc && this.tableInfo.a == 1) {
			const pbId = this.idn + '_progressbar';
			$('#' + this.idn).prepend('<div id="' + this.idn + '_file-uploader"></div>');
			$("#" + this.idn + "_file-uploader").after('<div id="' + pbId + '"/>');
			$("#" + this.idn + "_file-uploader").dxFileUploader(this.getDocumentOptions()).dxFileUploader('instance');
			$("#" + this.idn + '_file-uploader .dx-fileuploader-button').addClass("dx-button-default dx-button-mode-outlined");
			$("#" + this.idn + '_file-uploader .dx-fileuploader-button').removeClass("dx-button-normal dx-button-mode-contained");
		}
	}

}