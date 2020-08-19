class AppToolbar {
	constructor() {
		this.object = {};
	}

	async init() {
		this.allSearchLookupDataSource = this.getAllSearchLookupDataSource();
		this.toolbarItems = [];
		this.setMainToolbarItems();
		this.getAllIcons(app.appInfo.menu);
		this.createObject();
	}

	createObject() {
		this.object = $("#toolbar").dxToolbar({
			items: this.toolbarItems
		}).dxToolbar('instance');
	}

	setMainToolbarItems() {
		this.toolbarItems.push({
			widget: "dxButton",
			location: "before",
			cssClass: "menu-button",
			options: {

				icon: "menu",
				onClick: function () {
					app.drawer.toggle();
				}
			}
		});
		this.getLogo();
		this.getAllSearchLookup();
		this.getToolbarMenu();
	}

	getLogo() {
		if (app.appInfo.device.deviceType !== 'phone') {
			let logoItem = {
				location: "before",
				cssClass: "mylsTitle",
				cssStyle: "mylsTitle",
			};
			if (logo.app == 'img') {
				logoItem.html = '<div><img src="' + logo.logoImg + '"></div>';
			} else
				logoItem.text = siteName;
			this.toolbarItems.push(logoItem);
		}
	}

	getAllIcons(item) {
		for (let idx in item) {
			if (item[idx].objectType != 'menuGroup' && app.appInfo.tables[item[idx].id] && app.appInfo.tables[item[idx].id].iconName && app.appInfo.tables[item[idx].id].showInToolbar) {
				//let self = this;
				this.toolbarItems.push({
					widget: "dxButton",
					locateInMenu: 'auto',
					options: {
						elementAttr: {
							class: "myls-main-toolbar-icon"
						},
						icon: app.appInfo.tables[item[idx].id].iconName,
						hint: item[idx].text,
						//visible: !isEdit,
						onClick: function (e) {
							let url = "#" + app.getIdn(item[idx].objectType, item[idx].id, '', item[idx].objectView);
							app.openTabFromUrl(url);
						}
					},
					location: "center",
				});
			}
			if (item[idx].items) {
				this.getAllIcons(item[idx].items);
			}
		}
	}

	getTopMenuItems() {
		let langs = app.getLanguages();
		let items = [{
			id: "help",
			name: app.translate.saveString("Помощь"),
			linkOut: 'https://www.manula.com/manuals/myls/myls-school-knowledge-base/1/ru/topic/myls-school-how-to-work',
		}];
		if (langs.length > 1) {
			items.push({
				id: "lang",
				name: app.translate.saveString("Язык"),
				items: langs,
			});
		}
		items.push({
			id: "3_2",
			name: app.translate.saveString("Выход"),
			link: 'logout',
		});
		return [{
			id: "2",
			html: '<div class="myls-notifications" style="position: relative; margin-right: 10px;"><i class="fa fa-bell-o"></i><span class="myls-count-notifications">0</span></div>',
			notification: true,
		}, {
			id: "3",
			//html: '<i id="logout" class="dx-icon-runner"></i>',
			icon: '/img/blank-avatar.svg',
			items: items
		}];
	}

	getAllSearchLookupDataSource() {
		return new DevExpress.data.DataSource({
			paginate: false,
			group: "category",
			store: new DevExpress.data.CustomStore({
					key: "id",
					loadMode: "raw",
					cacheRawData: false,
					load: async function (loadOptions) {
						let params = {'lang': app.config.lang};
						let result = await app.processData('frame/getallsearchlookup', 'post', params);
						return result;
					},
				}
			)
		});
	}

	getAllSearchLookup() {
		if (app.appInfo.allSearchLookup) {
			const self = this;
			this.toolbarItems.push({
				widget: "dxSelectBox",
				location: "after",
				options: {
					width: 240,
					displayExpr: 'item',
					grouped: true,
					dataSource: this.allSearchLookupDataSource,
					closeOnOutsideClick: true,
					showClearButton: true,
					buttons: ['clear', 'dropDown'],
					searchExpr: 'item',
					searchEnabled: true,
					placeholder: app.translate.saveString("Искать в приложении"),
					valueExpr: 'id',
					keyExpr: 'id',
					acceptCustomValue: false,
					dropDownButtonTemplate: function () {
						return $("<span class='dx-icon-search myls-allsearch-icon'></span>");
					},
					onValueChanged: async function (data) {
						let dd = await self.allSearchLookupDataSource.store().byKey(data.value);
						await app.openPopup(dd.form_id, dd.ext_id, 'form', 'upd', []);
					}
				}
			});
		}
	}

	getToolbarMenu() {
		this.toolbarItems.push({
			widget: "dxMenu",
			location: "after",
			cssClass: "user-menu",
			options: {
				dataSource: this.getTopMenuItems(),
				hideSubmenuOnMouseLeave: false,
				SubmenuDirection: 'LeftOrTop',
				displayExpr: "name",
				cssClass: "user-menu",
				onItemClick: function (data) {
					let item = data.itemData;
					if (item.link) {
						window.location.href = item.link;
					}
					if (item.linkOut) {
						window.open(item.linkOut);
					}
					if (item.lang) {
						app.translate.changeLocale(item.lang);
					}
					if (item.notification) {
						app.openTabFromUrl(app.getIdn('grid', app.config.notification, undefined, 'tab'));
					}
				}
			}
		});
	}

	destroy() {
		app.destroyArray(this.allSearchLookupDataSource);
		app.destroyArray(this.toolbarItems);
		this.object = null;
	}

}