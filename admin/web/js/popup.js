class Popup {

	constructor(table, ext_id, type, mode, tHistory, params, modal = false, buttons = [], saveFunction = false) {
		this.type = type;
		this.view = 'popup';
		this.table = table;
		this.ext_id = ext_id;
		this.mode = mode;
		this.tHistory = tHistory;
		this.params = params;
		this.width = 0;
		this.height = 0;
		this.buttons = [];
		this.popupContent = [];
		this.title = '';
		this.idn = app.getIdn(this.type, this.table, this.ext_id, this.view) + '-popup';
		this.modal = modal;
		this.btns = buttons;
		this.saveFunction = saveFunction;
	}

	async init() {
		const self = this;
		return new Promise(async (resolve) => {
			let index = app.bottomTabs.findIndex(self.idn);
			if (index === -1) {
				self.createPopupHtml();
				self.setPopupButtons();
				await self.createObject();
			}
			if (!this.modal)
				app.bottomTabs.createTab(self);
			resolve();
		});
	}

	createPopupHtml() {
		let idx = app.getIdn(this.type, this.table, this.ext_id, this.view);
		this.popupContainer = $("<div />").attr('id', idx).addClass("myls-form-container");
		this.popup = $('<div id="' + this.idn + '"></div>');
		if (this.type !== 'form') {
			this.popupContainer.addClass('gridContainer');
			this.width = $(window).width() * 0.75;
			this.height = $(window).height() * 0.75;
		}
	}

	setPopupButtons() {
		const self = this;
		let idx = app.getIdn(this.type, this.table, this.ext_id, this.view);
		//if (this.type == 'form') {
		if (this.btns.length == 0) {
			this.buttons = [{
				location: "after"
			}];
			this.buttons.push(this.getButtonInfo(idx));
			this.buttons.push(this.getButtonOK(idx));
			if (this.mode == 'ins') {
				this.buttons.push(this.getButtonSaveAndAdd(idx));
			}
			this.buttons.push(this.getButtonCancel(idx));
			//this.buttons.push(this.getButtonNext(idx));
			if (app.appInfo.device.deviceType !== 'phone') {
				this.buttons.push(this.getButtonCollapse(idx));
				this.buttons.push(this.getButtonFullscreen(idx));
				this.buttons.push(this.getButtonClose(idx));
			}
		} else {
			$.each(this.btns, function (index, item) {
				if (item == 'info')
					self.buttons.push(self.getButtonInfo(idx));
				if (item == 'ok')
					self.buttons.push(self.getButtonOK(idx));
				if (item == 'save' && self.mode == 'ins')
					self.buttons.push(self.getButtonSaveAndAdd(idx));
				if (item == 'cancel')
					self.buttons.push(self.getButtonCancel(idx));
				if (item == 'collapse')
					self.buttons.push(self.getButtonCollapse(idx));
				if (item == 'fullscreen')
					self.buttons.push(self.getButtonFullscreen(idx));
				if (item == 'close')
					self.buttons.push(self.getButtonClose(idx));
				/*if (item == 'next')
					self.buttons.push(self.getButtonNext(idx));*/
			});
		}
		/*
		if (!this.modal)
			this.buttons.push(this.getButtonCollapse(idx));
		this.buttons.push(this.getButtonFullscreen(idx));
		this.buttons.push(this.getButtonClose(idx));

		 */
	}

	getButtonInfo(idx) {
		return {
			widget: "dxButton",
			toolbar: "bottom",
			location: "before",
			options: {
				text: "?",
				type: "default",
				stylingMode: "outlined",
				elementAttr: {
					id: idx + '_info-button',
					class: "myls-info-btn"
				},
			}
		};
	}

	getButtonOK(idx) {
		const self = this;
		let options;
		if (this.saveFunction) {
			options = {
				widget: "dxButton",
				toolbar: "bottom",
				location: "after",
				options: {
					text: app.translate.saveString("Выбрать"),
					type: "success",
					stylingMode: "outlined",
					elementAttr: {id: idx + '_save-button'},
				},
				onClick: async function (e) {
					await self.saveFunctionExecute();
				}
			};
		} else {
			options = {
				widget: "dxButton",
				toolbar: "bottom",
				location: "after",
				options: {
					text: app.translate.saveString("OK"),
					type: "success",
					stylingMode: "outlined",
					elementAttr: {id: idx + '_save-button'},
				}
			};
		}
		return options;
	}

	async saveFunctionExecute() {
		const th = this.tHistory[this.tHistory.length - 1];
		if (th) {
			const object = $('#' + th.idn).data('mylsObject');
			if (object) {
				const rows = this.mylsObject.getSelectedRows();
				const id = th.extId;
				await app.processData('frame/processselect', 'POST', {
					func: this.saveFunction,
					id: id,
					rows: JSON.stringify(rows)
				});
				object.refresh(true);
			}
		}
		this.popup.remove();
	}

	getButtonSaveAndAdd(idx) {
		return {
			widget: "dxButton",
			toolbar: "bottom",
			location: "after",
			options: {
				text: app.translate.saveString('Сохранить и добавить'),
				type: "success",
				stylingMode: "outlined",
				elementAttr: {id: idx + '_saveadd-button'},
			}
		};
	}

	getButtonNext(idx) {
		return {
			widget: "dxButton",
			toolbar: "bottom",
			location: "after",
			options: {
				text: app.translate.saveString('►'),
				type: "success",
				stylingMode: "outlined",
				elementAttr: {id: idx + '_next-button'},
			}
		};
	}

	getButtonCancel(idx) {
		const self = this;
		return {
			widget: "dxButton",
			toolbar: "bottom",
			location: "after",
			options: {
				text: app.translate.saveString('Отмена'),
				type: "default",
				stylingMode: "outlined",
				elementAttr: {id: idx + '_cancel-button'},
				onClick: function (e) {
					self.popup.remove();
					//Promise.reject();
				}
			}
		};
	}

	getButtonCollapse(idx) {
		const self = this;
		return {
			widget: "dxButton",
			toolbar: "top",
			location: "after",
			options: {
				icon: "collapse",
				type: "normal",
				stylingMode: "text",
				elementAttr: {
					id: idx + 'collapse-button',
					class: "myls-collapse-btn"
				},
				onClick: function (e) {
					e.event.stopPropagation();
					self.object.hide();
				}
			}
		};
	}

	getButtonFullscreen(idx) {
		const self = this;
		return {
			widget: "dxButton",
			toolbar: "top",
			location: "after",
			options: {
				icon: "fullscreen",
				type: "normal",
				stylingMode: "text",
				elementAttr: {
					id: idx + '_fullscreen-button',
					class: "myls-fullscreen-btn"
				},
				onClick: function (e) {
					if (self.object.option('fullScreen')) {
						self.object.option('fullScreen', false);
					} else {
						self.object.option('fullScreen', true);
					}
				}
			}
		};
	}

	getButtonClose(idx) {
		const self = this;
		return {
			widget: "dxButton",
			toolbar: "top",
			location: "after",
			options: {
				icon: "close",
				type: "normal",
				stylingMode: "text",
				elementAttr: {
					id: idx + '_close-button',
					class: "myls-close-btn"
				},
				onClick: function (e) {
					self.popup.remove();
					//Promise.reject();
				}
			}
		};
	}

	getPopupOptions() {
		const self = this;
		return {
			width: self.width,
			height: self.height,
			contentTemplate: function () {
				return self.popupContainer;
			},
			onHidden: function (e) {
				//$popup.remove();
			},
			onDisposing: function (e) {
				//убираем соотв. вкладку
				if (!self.modal) {
					app.bottomTabs.closeTab(self.idn);
					app.clearUrl();
				}
				self.destroy();

			},
			toolbarItems: this.buttons,
			showTitle: true,
			title: app.translate.saveString("Information"),
			visible: false,
			//dragEnabled: true,
			closeOnOutsideClick: false,
			//resizeEnabled: true,
			maxSize: "100%",
			maxHeight: "100%",
			showCloseButton: false,
			shading: this.modal,
		};
	}

	async createObject() {
		const self = this;
		if ($('#' + this.idn).length === 0) {
			$('.app-container').after(this.popup);
			this.object = this.popup.addClass("myls-form").dxPopup(this.getPopupOptions()).dxPopup("instance");
			this.activate();
			if (!this.modal)
				app.bottomTabs.createObject();
			this.mylsObject = app.getObject(this.table, this.ext_id, this.view, this.type, this.mode, this.tHistory, null, this.params);
			this.mylsObject.popup = this;
			await this.mylsObject.init();
			if (this.mylsObject && !this.modal)
				app.updateUrl(this.mylsObject.idn);
			else
				this.updateModalTitle();
		}
	}

	activate() {
		if (this.object) {
			const animation = this.object.option('animation');
			this.object.option('animation', null);
			this.object.hide();
			this.object.show();
			$("#" + this.idn + " .dx-popup-normal").css('opacity', '1');
			this.object.option('animation', animation);
		}
	}

	changeTitle(title) {
		this.title = title;
		this.object.option('title', title);
		app.bottomTabs.changeTitle(this);
	}

	updateModalTitle() {
		if (this.object)
			this.object.option('title', this.mylsObject.tableInfo.name);
	}

	destroy() {
		this.popup.remove();
		this.popupContainer = null;
		this.popup = null;
		app.destroyArray(this.tHistory);
		this.mylsObject = null;
		this.object = null;
	}

}