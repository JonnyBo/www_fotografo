class Cards extends MylsEditableObject {

	constructor(table, ext_id, view, mode, tHistory, viewMode, params) {
		super(table, ext_id, view, mode, tHistory, viewMode, params);
		this.type = 'cards';
		this.object = {};
	}

	async init() {
		const self = this;
		await super.init();
		this.dataSource.load();
		this.searchExpr = this.columns.getUsedFields(this.template, ['title', 'subtitle', 'text']);
		this.createObject();
		const positionColumn = this.columns.getColumnsByColumnType('position', true);
		$("#" + this.idn).data('mylsObject', this);
		this.toolbar.init();
		this.contextMenu = new ContextMenu(this);
		this.contextMenu.init(this.contextMenuData, '#' + this.idn + ' .dx-scrollview-content');
		this.afterInit();
	}

	getOptions() {
		const self = this;
		return {
			dataSource: this.dataSource,
			//showSelectionControls: true,
			pullRefreshEnabled: false,
			selectionMode: "single",
			searchEnabled: true,
			searchExpr: this.searchExpr,
			searchMode: 'contains',
			noDataText: app.translate.saveString('Пока в этом разделе нет данных. Чтобы внести информацию, воспользуйтесь кнопкой "Добавить"'),
			onContentReady: function (e) {
				self.contentReady(e);
			},
			onSelectionChanged: function (e) {
				self.selectionChanged(e);
			},
			onItemClick: function (e) {
				self.dblClick();
			},
			itemTemplate: function (data) {
				return self.getItemTemplate(data);
			},
			onItemContextMenu: function (e) {
				self.getItemContextMenu(e);
			},
		};
	}

	addMultiView(template, info) {
		const self = this;
		//ищем блоки для multi view
		let $tplm = $('<div data-dir="m"></div>');
		let $template = $(template);
		let $block = $('[data-dir="m"]', $template);

		if ($block != undefined) {
			let items = [];
			$.each($block.children('div'), function (index, el) {
				items.push({"html": el.innerHTML});
			});
			//подключаем multi view
			let id = this.idn + '_multiview-container_' + info.id;
			$block.attr("id", id);
			$block.empty();
			//$tplm.append('<div id="' + id + '"></div>');
			let multiView = $('#' + id, $template).dxMultiView(this.getMultiViewOptions(items)).dxMultiView("instance");
			if (items.length > 1) {
				$block.append('<div class="myls-mv-buttons d-flex justify-content-center"></div>');
				$.each(items, function (index, item) {
					$('.myls-mv-buttons', $block).append('<i id="' + id + '_' + index + '" class="myls-mv-button"/>');
					$(document.body).on('click', '#' + id + '_' + index, function (e) {
						self.activateMultiView(id, index, multiView);
					});
				});
				$('.myls-mv-button:first-child', $block).addClass('active');
			}
			template = $template.get(0);
		}
		return template;
	}

	activateMultiView(id, index, multiView) {
		$('#' + id + ' .myls-mv-button').removeClass('active');
		$('#' + id + '_' + index).addClass('active');
		multiView.option('selectedIndex', index);
	}

	getMultiViewOptions(items) {
		return {
			height: "auto",
			//dataSource: item,
			deferRendering: false,
			selectedIndex: 0,
			loop: false,
			animationEnabled: true,
			swipeEnabled: true,
			items: items,
			onSelectionChanged: function (e) {
				$('#' + id + ' .myls-mv-button').removeClass('active');
				$('#' + id + ' .myls-mv-button:nth-child(' + (e.component.option('selectedIndex') + 1) + ')').addClass('active');
			},
		};
	}

	createObject() {
		this.object = $("#" + this.idn).dxList(this.getOptions()).dxList('instance');
		app.objects[this.idn] = this;
	}

	resizeCards(item) {
		var width = $(item).width();
		for (var i = 12; i > 0; i--) {
			if (width >= 250 * i) {
				$(item).find(".dx-list-item").css('max-width', width / i + 'px');
				break;
			}
		}
	}

	contentReady(e) {
		$("#" + this.idn + " .dx-list-item").addClass("col d-flex align-items-stretch");
		$("#" + this.idn + " .dx-list-item-content").addClass("d-block");
		$("#" + this.idn + " .dx-scrollview-content").addClass("card-view d-flex align-items-stretch flex-wrap");
		this.resizeCards($("#" + this.idn));
		super.contentReady(e);
		$('#' + this.idn + '_totalCount').text(app.translate.saveString("Всего записей:") + ' ' + e.component.option('items').length);
		if (e.component.option('items').length > 0 && e.component.option('selectedItems').length == 0) {
			e.component.selectItem(0);
		}
	}

	selectionChanged(e) {
		this.toolbar.setEnabledToolbar();
	}

	getItemTemplate(data) {
		if (this.template && this.template.length != 0) {
			let item = [];
			item.template = '<div data-dir="v" class="card" data-id="'+ data.id +'">' + this.template + '</div>';
			item.dataType = 'block';
			let template = this.columns.getFormattedCellValue('', item, data);
			template = this.addMultiView(template, data);
			return template;
		} else {
			return this.getDefaultTemplate(data);
		}
	}

	getDefaultTemplate(data) {
		let result = $("<div>").addClass("card").attr('data-id', data.id);
		let item = this.columns.getItemValueByColumnType("image", data);
		if (item != "" && item != null)
			$(item).addClass("card-img-top").appendTo(result);
		let card = $('<div>').addClass("card-body").appendTo(result);
		item = this.columns.getItemValueByColumnType("title", data);
		if (item != "" && item != null)
			$('<h4>').addClass("card-title").html(item).appendTo(card);
		item = this.columns.getItemValueByColumnType("subtitle", data);
		if (item != "" && item != null)
			$('<h5>').addClass("card-subtitle").html(item).appendTo(card);
		// if (data.title != "")
		item = this.columns.getItemValueByColumnType("text", data);
		if (item != "" && item != null)
			$('<p>').addClass("card-text").html(item).appendTo(card);
		return result;
	}

	getItemContextMenu(e) {
		if (e.itemData !== undefined)
			this.contextMenu.show(e.itemData.id, e.itemData);
	}

	getCurrentId() {
		return this.object.option('selectedItemKeys')[0];
	}

	getSelectedRows() {
		return this.object.option('selectedItemKeys');
	}

	async refresh(changesOnly = true, useLoadPanel = true) {
		try {
			//await this.object.refresh(changesOnly);
			await this.dataSource.reload();

		} catch (error) {
			console.log(error);
		}
		this.toolbar.setEnabledToolbar();
		this.changed();
	}

	destroy() {
		super.destroy();
		$("#" + this.idn).data('mylsObject', null);
		app.destroyArray(this.searchExpr);
		this.close();
	}
}