class MylsLocalization{constructor(translate){this.translate=translate;this.translateOld={};this.mode='development';}
async getTranslate(){const self=this;let translate=await app.processData("site/loadtranslate","post");DevExpress.localization.loadMessages(translate);if(translate!=''){this.translate=translate;this.translateOld=app.cloneObject(this.translate);}
setInterval(()=>self.saveFileTranslate(),60000);}
saveString(str){if(!str)return'';str=str.trim();if(str!=''){let hash=CryptoJS.MD5(str.toLowerCase());$.each(this.translate,(index,item)=>{if(!item.hasOwnProperty(hash)){item[hash]=str;}});return this.translate[app.config.lang][hash];}
return'';}
saveTranslateColumns(columns){let self=this;$.each(columns,(_,col)=>{$.each(col.columns,(index,item)=>{if(item.caption!=''){item.caption=self.saveString(item.caption);}});});DevExpress.localization.loadMessages(this.translate);}
saveTranslateTableInfo(table){let self=this;$.each(table,function(_,info){if(typeof info==='object'&&info.hasOwnProperty('name')&&info.name!=''){info.name=self.saveString(info.name);}});DevExpress.localization.loadMessages(this.translate);}
saveTranslateContextMenu(menus){let self=this;$.each(menus,function(_,menu){$.each(menu,function(index,item){if(item.text!=''){item.text=self.saveString(item.text);}
if(item.title!=''){item.title=self.saveString(item.title);}});});DevExpress.localization.loadMessages(this.translate);}
saveTranslateMenu(menu){let self=this;$.each(menu,function(index,item){item.key=self.saveString(item.key);if(item.items.length>0){$.each(item.items,function(i,el){if(el.text!=''){el.text=self.saveString(el.text);}
if(el.title!=''){el.title=self.saveString(el.title);}});}});DevExpress.localization.loadMessages(this.translate);}
saveTranslateForm(form){for(var key in form){if(form[key].hasOwnProperty('label')){if(form[key].label['text']!=''){form[key].label['text']=this.saveString(form[key].label['text']);}}
if(form[key].hasOwnProperty('caption')){if(form[key].caption!=''){form[key].caption=this.saveString(form[key].caption);}}
if(form[key].hasOwnProperty('editorOptions')&&form[key].editorOptions.hasOwnProperty('text')){if(form[key].editorOptions.text!=''){form[key].editorOptions.text=this.saveString(form[key].editorOptions.text);}}
if(form[key].hasOwnProperty('placeholder')){if(form[key].caption!=''){form[key].caption=this.saveString(form[key].placeholder);}}}
DevExpress.localization.loadMessages(this.translate);}
saveTranslateBlock(template){const self=this;$('[role=caption], [role=postcaption]',$(template)).each(function(i,el){if($(el).text()!=''){let str=self.saveString($(el).text());$(el).text(str);}});DevExpress.localization.loadMessages(this.translate);}
saveFileTranslate(){if(this.mode=='development'){const self=this;let array={};$.each(this.translate,(lang,items)=>{$.each(items,(index,item)=>{if(!self.translateOld[lang]||!self.translateOld[lang][index]){if(!array[lang])array[lang]={};array[lang][index]=item;}});});if(Object.keys(array).length)
app.processData("site/savetranslate",'post',{data:array});this.translateOld=app.cloneObject(this.translate);}}
async changeLocale(data){app.config.lang=data;app.allowSaveSetting=true;await app.saveSettings();window.location.href='/';}
async changeLocaleForm(data){app.config.lang=data;app.allowSaveSetting=true;await app.saveSettings();DevExpress.localization.locale(app.config.lang);auth.changeLocaleForm();}
setLocale(locale){app.config.lang=locale;app.saveSettings();}
destroy(){app.destroyArray(this.translate);}};;class AppCore{constructor(){this.config={lang:'en',company_id:1};this.allowSaveSetting=false;this.translate=new MylsLocalization();}
processData(url,method,data){if(data===null||data===undefined)data='';try{return new Promise((resolve,reject)=>{$.ajax({url:url,method:method,data:(data),success:function(result){if(result){result=$.parseJSON(result);if(result)
if(result.error&&result.error!==''){reject(result);}else if(result.logout){window.location.href='logout';}else{resolve(result);}
else{resolve();}}else{resolve();}},error:function(object,type,error){if(object.responseText=='{"logout":true}')
window.location.href='logout';console.log(error);reject(error);}});});}catch(e){return Promise.reject(e.message);}}
async getSettings(){let setting=await this.processData('site/settings','POST',null);this.processSettings(setting);}
processSettings(setting){this.config=setting;this.config.lang=this.config.lang?this.config.lang:"en";this.config.company_id=this.config.company_id?this.config.company_id:1;this.config.client_id=this.config.client_id?this.config.client_id:null;DevExpress.localization.locale(this.config.lang);}
setSettings(){this.allowSaveSetting=true;}
saveSettings(){if(this.allowSaveSetting){this.allowSaveSetting=false;if('bottomTabs'in app){this.config.popups=[];for(let item of app.bottomTabs.panelContent){if(this.parseUrl(item.idn).ext_id!==-1){this.config.popups.push({idn:item.idn,tHistory:JSON.stringify(item.mylsObject.tHistory),id:item.mylsObject.table});}}}
this.processData('site/settings','POST',{'data':this.config});}}
getUrlParameter(name){name=name.replace(/[\[]/,'\\[').replace(/[\]]/,'\\]');var regex=new RegExp('[\\?&]'+name+'=([^&#]*)');var results=regex.exec(location.href);return results===null?'':decodeURIComponent(results[1].replace(/\+/g,'    '));}
parseUrl(url){const grid=url.replace(/#/g,'');const arrurl=grid.split(/\-|\_/);const type=arrurl[0];const table=arrurl[1];let ext_id=arrurl[2];let objView=arrurl[3];if(arrurl[2]=='popup'||arrurl[2]=='tab'){ext_id='';objView=arrurl[2];}else{ext_id=arrurl[2];}
if(arrurl[2]==''&&arrurl[3]==1){ext_id=-1;objView=arrurl[4];}
return{type,table,ext_id,objView};}
create_UUID(){let dt=new Date().getTime();let uuid='gxxxxxxxx'.replace(/[xy]/g,function(c){const r=(dt+Math.random()*16)%16|0;dt=Math.floor(dt / 16);return(c=='x'?r:(r&0x3|0x8)).toString(16);});return uuid;}
hasValue(object){return object!=''&&object!==null&&object!==undefined;}
cloneObject(obj){return obj?JSON.parse(JSON.stringify(obj)):undefined;}};;class App extends AppCore{constructor(){super();this.appInfo={};this.menu=new Menu();this.toolbar=new AppToolbar();this.topTabs=new TopTabs();this.bottomTabs=new BottomTabs();this.drawer={};this.objects={};this.cntToolTip=0;this.colCaches=[];this.patterns={'phone':/((\+([0-9](\ |\-)?){11,15})|(([0-9](\ |\-)?){5,15}))(\ ?\#[0-9]{2,4})?/i,'phone_form':/^((\+([0-9](\ |\-)?){11,15})|(([0-9](\ |\-)?){5,15}))(\ ?\#[0-9]{2,4})?$/i,'mail':/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i,'mail_form':/^([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)$/i,'url':/(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?/i,'url_form':/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i};this.currentHash='';this.objectTypes=['grid','tree','cards','documents','dashboard','scheduler','chart','pivot','draglist','twowaygrid','kanban'];}
async init(){const self=this;await this.initData();this.appInfo.device=DevExpress.devices.current();this.createDrawer();this.topTabs.init();this.toolbar.init();this.initQuickActions();this.initDialog();if(window.location.hash!==''){this.currentHash=window.location.hash;}
try{await Promise.all([this.openOldTabs(),this.openOldPopups()]);}catch(e){console.log(e);}
if(this.config.client_id){this.getNotifications();setInterval(function(){self.getNotifications();},60000);}else{$('.myls-notifications').css('display','none');}}
async initData(){let currentHash='';if(localStorage.getItem('currentHash')){currentHash=localStorage.getItem('currentHash');localStorage.setItem('currentHash','');}
if(window.location.hash!==''){currentHash=window.location.hash;}
const loadSettings=this.getSettings();const appSettings=this.getAppSettings();if(await this.shouldLoadStructure()){await Promise.all([this.getIfAllsearchLookupExists(),loadSettings,appSettings,this.translate.getTranslate()]);this.openLoadPanel("main");await Promise.all([this.getAllSettings(),this.getAllTablesInfo(),this.getAllColumns(),this.getAllContextMenu()]);await Promise.all([this.getAllTemplates(),this.getQuickActions(),this.getMenu()]);this.closeLoadPanel('main');this.translate.saveFileTranslate();window.localStorage.setItem('appInfo',JSON.stringify(this.appInfo));window.localStorage.setItem('app.translate',JSON.stringify(this.translate.translate));window.localStorage.setItem('appInfo.date',new Date());}
await Promise.all([loadSettings,appSettings]);}
initDialog(){this.dialog=new Dialog();}
async getAppSettings(){let appSettings=await this.processData('site/getappsettings','POST',null);if(appSettings){this.appInfo.useFilter=appSettings.useFilter;this.appInfo.tablesWhenEmpty=appSettings.tablesWhenEmpty;}}
initQuickActions(){const self=this;if(this.appInfo.quickActions&&this.appInfo.quickActions.length){$.each(this.appInfo.quickActions,function(index,item){$(".app-container").append("<div id='action-"+index+"'></div>");$("#action-"+index).dxSpeedDialAction({label:app.translate.saveString(item.text),icon:item.icon,index:item.index,onClick:function(){app.openPopup(item.table_id,-1,'form','ins',[]);}}).dxSpeedDialAction("instance");});}}
createDrawer(){this.drawer=$("#drawer").dxDrawer({opened:($(window).width()<='1024')?false:true,position:'before',closeOnOutsideClick:($(window).width()<='1024')?true:false,template:()=>{this.menu.init();return this.menu.object.element();}}).dxDrawer("instance");}
setDrawerOptions(){this.drawer.option("opened",($(window).width()<='1024'?false:this.drawer.option('opened')));}
async getIfAllsearchLookupExists(){let result=await app.processData('frame/allsearchlookupexists','post',[]);this.appInfo.allSearchLookup=result;}
async getAllTablesInfo(){if(!this.appInfo.tables){let tableInfo=await this.processData('frame/getalltablesinfo','get');this.appInfo.tables=tableInfo;this.translate.saveTranslateTableInfo(tableInfo);}}
async getAllSettings(){if(!this.appInfo.setting){let setting=await this.processData('frame/getallsettings','get');this.appInfo.setting=setting;}}
async getAllTemplates(){if(!this.appInfo.templates){let templates=await this.processData('frame/getalltemplates','get');this.appInfo.templates=templates;this.translate.saveTranslateTableInfo(templates);}}
async getAllContextMenu(){if(!this.appInfo.contextMenu){let menus=await this.processData('menu/getallcontextmenu','get');this.translate.saveTranslateContextMenu(menus);this.appInfo.contextMenu=menus;}}
async getAllColumns(){if(!this.appInfo.columns){let columns=await this.processData('frame/getallcols','get');this.appInfo.columns=columns;this.translate.saveTranslateColumns(columns);}}
async getQuickActions(){if(!this.appInfo.quickActions){let quickActions=await this.processData('menu/getquickactions','get');this.appInfo.quickActions=quickActions;}}
async getMenu(){if(!this.appInfo.menu){let menu=await this.processData('menu/getmenu','get');this.translate.saveTranslateMenu(menu);this.appInfo.menu=menu;}}
openLoadPanel(idn){const loadPanel=$('#'+idn+'-loadpanel').dxLoadPanel({position:{of:"#"+idn,at:"center center"},visible:false,showIndicator:true,showPane:false,message:this.translate.saveString('Загрузка'),container:'#'+idn+'-loadpanel',closeOnOutsideClick:false,indicatorSrc:"img/loader.svg"}).dxLoadPanel("instance");if(loadPanel)
loadPanel.show();}
closeLoadPanel(idn){const loadPanel=$('#'+idn+'-loadpanel').dxLoadPanel().dxLoadPanel("instance");if(loadPanel)
loadPanel.hide();}
closeAllLoadPanel(idn){const loadPanel=$('.dx-loadpanel').dxLoadPanel().dxLoadPanel("instance");if(loadPanel)
loadPanel.hide();}
getLanguages(){let self=this;let langItems=[];$.each(languages,function(index,item){langItems.push({lang:item.code,name:self.translate.saveString(item.name),selected:self.config.lang==item.code?true:false,});});return langItems;}
getRealObjectType(type){switch(type){case'documentcards':case'documents':return'grid';break;default:return type;}}
getObject(table,ext_id,view,type,mode,tHistory,viewMode,params){let object;if(!ext_id)
ext_id=undefined;switch(this.getRealObjectType(type)){case'dashboard':object=new Dashboard(table,ext_id,view,mode,tHistory,viewMode,params);break;case'form':object=new Form(table,ext_id,view,mode,tHistory,viewMode,params);break;case'grid':object=new Grid(table,ext_id,view,mode,tHistory,viewMode,params);break;case'tree':object=new Tree(table,ext_id,view,mode,tHistory,viewMode,params);break;case'cards':object=new Cards(table,ext_id,view,mode,tHistory,viewMode,params);break;case'scheduler':object=new Scheduler(table,ext_id,view,mode,tHistory,viewMode,params);break;case'chart':object=new Charts(table,ext_id,view,mode,tHistory,viewMode,params);break;case'pivot':object=new Pivot(table,ext_id,view,mode,tHistory,viewMode,params);break;case'kanban':object=new Kanban(table,ext_id,view,mode,tHistory,viewMode,params);break;case'draglist':object=new DragList(table,ext_id,view,mode,tHistory,viewMode,params);break;case'twowaygrid':object=new TwoWayGrid(table,ext_id,view,mode,tHistory,viewMode,params);break;case'htmleditor':object=new HtmlEditor(table,ext_id,view,mode,tHistory,viewMode,params);break;case'codeeditor':object=new CodeEditor(table,ext_id,view,mode,tHistory,viewMode,params);break;case'layout':object=new Layout(table,ext_id,view,mode,tHistory,viewMode,params);break;}
if(object===undefined){console.log('Определение класса типа '+type+' отсутствует.');}
return object;}
async openPopup(table,id,type,mode,tHistory,params){let popup=new Popup(table,id,'form',mode,tHistory,params);let index=this.bottomTabs.findIndex(popup.idn);if(index===-1){await popup.init();}else{popup=this.bottomTabs.activateTab(index);}
return popup;}
openTabFromUrl(url,tHistory=[],title=''){const param=this.parseUrl(url);if(param.table==undefined){app.dialog.showError(undefined,app.translate.saveString('Ошибка! Такого адреса - '+url+' - нет!'));}
if(param.objView=='popup'){this.openPopup(param.table,param.ext_id,param.type,'upd',tHistory);}else{if(this.topTabs.createTab(param.table,param.type,param.ext_id,tHistory,false,title)){let object=this.getObject(param.table,param.ext_id,param.objView,param.type,'sel',tHistory);object.init();}}}
updateUrl(url){const currentUrlParts=window.location.href.split("#");if(url!==currentUrlParts[1]){window.location.hash=url;}}
clearUrl(){window.location.hash='';history.pushState("",document.title,window.location.pathname);}
getIdn(type,table,ext_id,view){if(!type){console.log('Не задан тип объекта');return false;}
let idn=this.getRealObjectType(type)+'-'+table;if(ext_id!==undefined&&ext_id!==''&&ext_id!==null){idn=idn+'-'+ext_id;}
idn=idn+'_'+view;return idn;}
replaceAll(str,find,replace){const re=new RegExp(find,'g');if(typeof str=='string')
return str.replace(re,replace);else
return str;}
isDate(date){const regex=/^\d{4}-\d{2}-\d{2}$/;return regex.exec(date)!==null;}
addHistory(extField,extId,idn,tHistory,mode){let tHistoryClone=[];if(tHistory)
tHistoryClone=tHistory.slice();if(extField){let curValues={};curValues.extId=extId;curValues.extField=extField;curValues.idn=idn;curValues.tableId=this.parseUrl(idn).table;if(mode=='updAll'){curValues.refreashAll=true;mode='upd';}
curValues.mode=mode;tHistoryClone.push(curValues);}
return tHistoryClone;}
arrayUnique(arr){let result=arr.filter(function(elem){return elem!=null;});return result.filter((e,i,a)=>a.indexOf(e)==i);}
prepareStorage(data){if('allowedPageSizes'in data)
delete data['allowedPageSizes'];if('filterPanel'in data)
delete data['filterPanel'];if('filterValue'in data)
delete data['filterValue'];if('pageIndex'in data)
delete data['pageIndex'];if('pageSize'in data)
delete data['pageSize'];if('focusedRowKey'in data)
delete data['focusedRowKey'];if('searchText'in data)
delete data['searchText'];if('selectedRowKeys'in data)
delete data['selectedRowKeys'];if(data.hasOwnProperty('columns')){for(let item of data.columns){if('filterValues'in item)
delete item['filterValues'];}}}
removeNullFromArray(obj){const self=this;Object.keys(obj).forEach(function(key){if(obj[key]&&typeof obj[key]==='object')
self.removeNullFromArray(obj[key]);else if(obj[key]==null)
delete obj[key];});}
removeEmptyFromArray(arr){let newArray=[];for(let i=0;i<arr.length;i++){if(!$.isEmptyObject(arr[i])){newArray.push(arr[i]);}}
return newArray;}
convertFromDateTime(date){if(!date)return null;const regex=/\d{4}-\d{2}-\d{2}((T|\ )\d{2}:\d{2}:\d{2})?/g;if(String(date).search(regex)==-1)
date=DevExpress.localization.formatDate(new Date(date),'yyyy-MM-ddTHH:mm:ssx');date=date.slice(0,19).replace('T',' ');return date;}
getJsDate(date,setComma,column){if(!date)return date;const regex=/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/g;if(String(date).search(regex)==0)
date=this.convertDateTime(date);if(setComma&&column&&column.dataType!=='lookup')date="\'"+date+"\'";return date;}
convertDateTime(date){if(!date)return date;date=date.indexOf(' ')==-1?date:(date.replace(/\s/,'T')+this.getTimeZone(String(date).substr(0,10)));return date;}
getTimeZone(date){const d=new Date(date);const z=d.getTimezoneOffset();const hours=Math.floor(Math.abs(z)/ 60);const minutes=Math.abs(z)%60;let zone=(hours<10?'0'+hours:hours)+':'+(minutes<10?'0'+minutes:minutes);zone=(z<0?'+':'-')+zone;return zone;}
findInArray(text,items){let isFind=-1;const searchText=text.trim();$.each(items,function(index,item){if(item.trim().toLowerCase()==searchText.toLowerCase()){isFind=index;return false;}});return isFind;}
getObjectContainer(idx){return'<div id="'+idx+'" class="gridContainer"></div><div id="'+idx+'-context-menu" class="context-menu"></div><div id="'+idx+'-loadpanel"></div>';}
async openOldTabs(){const self=this;return new Promise((resolve)=>{if(self.config.tabs){if(self.config.tabs.length>0){let oldSel=self.config.selTabs;$.each(self.config.tabs,function(index,item){let tHistory=JSON.parse(item.tHistory);const table=self.parseUrl(item.idn).table;if(self.appInfo.tables[table]){self.openTabFromUrl(item.idn,tHistory);}});if(oldSel!==undefined&&self.topTabs.panelContent.length>oldSel){self.topTabs.object.option("selectedIndex",oldSel);self.updateUrl(self.config.tabs[oldSel].idn);}}}else if(self.appInfo.tablesWhenEmpty){let tables=String(self.appInfo.tablesWhenEmpty).split(',');$.each(tables,(index,item)=>{const idn=self.getIdn(this.appInfo.tables[item].tableType,item,'','tab');self.openTabFromUrl(idn,null);});}
resolve();});}
openOldPopups(){const self=this;return new Promise((resolve)=>{if(self.config.popups!==null&&self.config.popups!==undefined){if(self.config.popups.length>0){$.each(self.config.popups,function(index,item){let tHistory=JSON.parse(item.tHistory);const table=self.parseUrl(item.idn).table;if(self.appInfo.tables[table]){self.openTabFromUrl(item.idn,tHistory);}});}}
resolve();});}
getConfigParam(param){switch(param){case':lang':return this.config.lang;break;case':company_id':return this.config.company_id;break;case':__user_client_id__':case':user_client_id':return this.config.client_id;break;case':user_id':return this.config.user_id;break;default:return null;}}
addConfigParams(params){params.lang=this.config.lang;params.company_id=this.config.company_id;params.__user_client_id__=this.config.client_id;params.user_id=this.config.user_id;}
getNotifications(){$.ajax({url:'site/notifications',type:'post',cache:false,success:function(result){let data=null;if(result!='')
data=$.parseJSON(result);if(data&&data>0){$('.myls-notifications .myls-count-notifications').text(data);}else
$('.myls-notifications .myls-count-notifications').text("");}});}
destroyArray(arr){$.each(arr,function(index,item){item=null;});arr=null;}
isEqual(obj1,obj2){return JSON.stringify(obj1)===JSON.stringify(obj2);}
async shouldLoadStructure(){let lastDate=await this.processData('site/getstructurelastdate','POST',null);if(lastDate&&lastDate.value){lastDate=new Date(this.convertDateTime(lastDate.value));let localLastDate=new Date(window.localStorage.getItem('appInfo.date'));if(lastDate>=localLastDate)return true;const appInfo=JSON.parse(window.localStorage.getItem('appInfo'));const translate=JSON.parse(window.localStorage.getItem('app.translate'));if(!appInfo||!translate)return true;this.appInfo=appInfo;this.translate.translate=translate;}else
return true;return false;}};;class Menu{constructor(){this.object={};}
init(){this.createObject();this.object=this.object.dxList('instance');}
createObject(){let siteMenu=app.appInfo.menu;let $list=$("<div>").width(230).addClass("panel-list");this.object=$list.dxList(this.getOptions(siteMenu));}
getOptions(siteMenu){let self=this;return{dataSource:siteMenu,grouped:true,collapsibleGroups:true,itemTemplate:function(data,_,element){self.createItemMenu(data,element);},hoverStateEnabled:false,focusStateEnabled:false,activeStateEnabled:false,width:'230px',onContentReady:function(e){self.allMenuCollaps(e);}};}
createItemMenu(data,element){let url=app.getIdn(data.objectType,data.id,'',data.objectView);if(app.appInfo.tables[data.id])
if(!app.appInfo.tables[data.id].iconName)
element.append($("<a>").text(data.text).attr("href",'#'+url).addClass("myls-no-image"));else{element.append($("<a>").html('<img src="'+app.appInfo.tables[data.id].iconName+'" class="myls-menu-icon">'+data.text).attr("href",'#'+url));}}
allMenuCollaps(e){setTimeout(function(){let items=e.component.option("items");for(let i=0;i<items.length;i++)
e.component.collapseGroup(i);},100);}
destroy(){this.object=null;}};;class AppToolbar{constructor(){this.object={};}
async init(){this.allSearchLookupDataSource=this.getAllSearchLookupDataSource();this.toolbarItems=[];this.setMainToolbarItems();this.getAllIcons(app.appInfo.menu);this.createObject();}
createObject(){this.object=$("#toolbar").dxToolbar({items:this.toolbarItems}).dxToolbar('instance');}
setMainToolbarItems(){this.toolbarItems.push({widget:"dxButton",location:"before",cssClass:"menu-button",options:{icon:"menu",onClick:function(){app.drawer.toggle();}}});this.getLogo();this.getAllSearchLookup();this.getToolbarMenu();}
getLogo(){if(app.appInfo.device.deviceType!=='phone'){let logoItem={location:"before",cssClass:"mylsTitle",cssStyle:"mylsTitle",};if(logo.app=='img'){logoItem.html='<div><img src="'+logo.logoImg+'"></div>';}else
logoItem.text=siteName;this.toolbarItems.push(logoItem);}}
getAllIcons(item){for(let idx in item){if(item[idx].objectType!='menuGroup'&&app.appInfo.tables[item[idx].id]&&app.appInfo.tables[item[idx].id].iconName&&app.appInfo.tables[item[idx].id].showInToolbar){this.toolbarItems.push({widget:"dxButton",locateInMenu:'auto',options:{elementAttr:{class:"myls-main-toolbar-icon"},icon:app.appInfo.tables[item[idx].id].iconName,hint:item[idx].text,onClick:function(e){let url="#"+app.getIdn(item[idx].objectType,item[idx].id,'',item[idx].objectView);app.openTabFromUrl(url);}},location:"center",});}
if(item[idx].items){this.getAllIcons(item[idx].items);}}}
getTopMenuItems(){let langs=app.getLanguages();let items=[{id:"help",name:app.translate.saveString("Помощь"),linkOut:'https://www.manula.com/manuals/myls/myls-school-knowledge-base/1/ru/topic/myls-school-how-to-work',}];if(langs.length>1){items.push({id:"lang",name:app.translate.saveString("Язык"),items:langs,});}
items.push({id:"3_2",name:app.translate.saveString("Выход"),link:'logout',});return[{id:"2",html:'<div class="myls-notifications" style="position: relative; margin-right: 10px;"><i class="fa fa-bell-o"></i><span class="myls-count-notifications">0</span></div>',notification:true,},{id:"3",icon:'/img/blank-avatar.svg',items:items}];}
getAllSearchLookupDataSource(){return new DevExpress.data.DataSource({paginate:false,group:"category",store:new DevExpress.data.CustomStore({key:"id",loadMode:"raw",cacheRawData:false,load:async function(loadOptions){let params={'lang':app.config.lang};let result=await app.processData('frame/getallsearchlookup','post',params);return result;},})});}
getAllSearchLookup(){if(app.appInfo.allSearchLookup){const self=this;this.toolbarItems.push({widget:"dxSelectBox",location:"after",options:{width:240,displayExpr:'item',grouped:true,dataSource:this.allSearchLookupDataSource,closeOnOutsideClick:true,showClearButton:true,buttons:['clear','dropDown'],searchExpr:'item',searchEnabled:true,placeholder:app.translate.saveString("Искать в приложении"),valueExpr:'id',keyExpr:'id',acceptCustomValue:false,dropDownButtonTemplate:function(){return $("<span class='dx-icon-search myls-allsearch-icon'></span>");},onValueChanged:async function(data){let dd=await self.allSearchLookupDataSource.store().byKey(data.value);await app.openPopup(dd.form_id,dd.ext_id,'form','upd',[]);}}});}}
getToolbarMenu(){this.toolbarItems.push({widget:"dxMenu",location:"after",cssClass:"user-menu",options:{dataSource:this.getTopMenuItems(),hideSubmenuOnMouseLeave:false,SubmenuDirection:'LeftOrTop',displayExpr:"name",cssClass:"user-menu",onItemClick:function(data){let item=data.itemData;if(item.link){window.location.href=item.link;}
if(item.linkOut){window.open(item.linkOut);}
if(item.lang){app.translate.changeLocale(item.lang);}
if(item.notification){app.openTabFromUrl(app.getIdn('grid',app.config.notification,undefined,'tab'));}}}});}
destroy(){app.destroyArray(this.allSearchLookupDataSource);app.destroyArray(this.toolbarItems);this.object=null;}};;class TopTabs{constructor(){this.panelContent=[];this.object={};}
init(){this.createObject();}
createTab(table,type,ext_id,tHistory=[],old=false,title=''){let isNew=false;let idn=app.getIdn(type,table,ext_id,'tab');let selTab=this.panelContent.findIndex((value,index)=>{return(value.idn===idn);});if(selTab===-1){this.panelContent.push({'title':title?title:app.appInfo.tables[table].name,'html':app.getObjectContainer(idn),'idn':idn,'tHistory':JSON.stringify(tHistory)});this.object.option('items',this.panelContent);selTab=this.panelContent.length-1;if(old){selTab=app.config.selTabs;}
isNew=true;app.config.tabs=this.panelContent;app.setSettings();}
if(selTab!==-1){this.object.option('selectedIndex',selTab);}
return isNew;}
createObject(){this.object=$("#tabpanel-container").dxTabPanel({repaintChangesOnly:true,showNavButtons:true,deferRendering:false,swipeEnabled:false,noDataText:'',itemTitleTemplate:function(itemData,itemIndex,element){element.text(itemData.title);element.append($("<i>").addClass('dx-icon dx-icon-close').attr('data-tab',itemData.idn));},onSelectionChanged:function(e){app.config.selTabs=e.component.option("selectedIndex");app.setSettings();if(e.addedItems.length>0)
app.updateUrl(e.addedItems[0].idn);},}).dxTabPanel("instance");}
closeTab(idn){const self=this;$.each(this.panelContent,function(index,value){if(value.idn==idn){self.panelContent.splice(index,1);return false;}});this.object.option('items',this.panelContent);if($("#"+idn).data('mylsObject'))
$("#"+idn).data('mylsObject').destroy();app.config.tabs=this.panelContent;if(this.panelContent.length==0){app.clearUrl();app.config.tabs=null;}
app.setSettings();}
destroy(){app.destroyArray(this.panelContent);this.object=null;}};;class Columns{constructor(columns,idn,mylsObject){this.columns=columns.columns;this.summary=columns.summaries;this.idn=idn;this.setSummaryFormat();this.setSummaryFields();this.colCaches=[];this.mylsObject=mylsObject;}
getColumnsByColumnType(type,first=false){let column=null;if(!first)
column=[];$.each(this.columns,function(_,item){if(item.columnType!=null){if($.isArray(item.columnType)){$.each(item.columnType,function(i,el){if($.type(el)=='object'){if(type in el){if(first){column=item;return false;}else{column.push(item);}}}else{if(el==type){if(first){column=item;return false;}else{column.push(item);}}}});}else{if(item.columnType==type){if(first){column=item;return false;}else{column.push(item);}}}}});return column;}
getColumnTypeItem(type,item){let params=null;if(item.columnType!=null&&$.isArray(item.columnType)){$.each(item.columnType,function(i,el){if($.type(el)=='object'){if(type in el){params=el[type];return;}}});}
return params;}
getFilterColumns(){let fcolumns=[];$.each(this.columns,function(index,item){if((item.hasOwnProperty('useColumn')&&item.useColumn)&&item.dataType!='block'&&item.dataType!='image'){fcolumns.push(item);}});return fcolumns;}
getUsedColumns(){let fcolumns={};$.each(this.columns,function(index,item){if((item.hasOwnProperty('useColumn')&&item.useColumn)){fcolumns[index]=item;if(item.usedInBlock||!item.visible)
item.showInColumnChooser=false;}});return fcolumns;}
setUsedColumns(item){if(item.usedColumns){const self=this;$.each(item.usedColumns,function(index,item){self.columns[item].usedInBlock=true;});}}
convertDateTimeColumns(data){let self=this;$.each(this.columns,function(index,item){if((item.dataType=='time'||item.dataType=='datetime'||item.dataType=='date')&&data&&data[item.dataField]){data[item.dataField]=app.convertDateTime(data[item.dataField]);}});return data;}
convertFromDateTimeColumns(data){const self=this;$.each(this.columns,function(index,item){if((item.dataType=='time'||item.dataType=='datetime'||item.dataType=='date')&&data&&data[item.dataField]){data[item.dataField]=self.convertFromDateTime(data[item.dataField]);if(item.dataType=='date')
data[item.dataField]=data[item.dataField].slice(0,10);}});return data;}
convertFromDateTime(date){if(!date)return null;const regex=/\d{4}-\d{2}-\d{2}((T|\ )\d{2}:\d{2}:\d{2})?/g;if(String(date).search(regex)==-1)
date=DevExpress.localization.formatDate(new Date(date),'yyyy-MM-ddTHH:mm:ssx');date=date.slice(0,19).replace('T',' ');return date;}
getUsedFields(template,columnTypes=null){let cols=[];if(template&&template.length){const regexp=/\$([\w_]+)\$/gi;cols=template.match(regexp);$.each(cols,function(index,item){cols[index]=item.substring(1,item.length-1);});}else if(columnTypes&&columnTypes.length){let self=this;$.each(columnTypes,function(_,item){let column=self.getColumnsByColumnType(item,true);if(column){if(column.dataType=='block'){cols=cols.concat(self.getUsedFields(column.template));}else{if(column.hasOwnProperty('columns')){cols=cols.concat(column.columns);}else{cols.push(column.dataField);}}}});}
return cols;}
setColorToCell(item,result,info){let style='',colorClass='';if(info&&info.data){if(info.data[item.dataField+'__bgcolor']){colorClass=$.Color(info.data[item.dataField+'__bgcolor']).contrastColor();style+='background-color:'+info.data[item.dataField+'__bgcolor']+';';result='<span style="'+style+'" class="myls-colored-value '+colorClass+'">'+result+'</span>';}
if(info.data[item.dataField+'__color']){style+='color:'+info.data[item.dataField+'__color']+';';result='<span style="'+style+'">'+result+'</span>';}
if(info.data[item.dataField+'__class']){result='<span class="'+info.data[item.dataField+'__class']+'">'+result+'</span>';}}
return result;}
getFormattedCellValue(cellValue,item,info){const self=this;let infoData=info.data?info.data:info;if(item.dataType==='image'){return formatImage();}
if(item.dataType==='url'){return formatUrl();}
if(item.dataType==='color'){return formatColor();}
if(item.dataType==='date'){return formatDate();}
if(item.dataType==='number'){return formatNumber();}
if(item.dataType==='string'){return formatString();}
if(item.dataType==='lookup'&&!item.editor){return formatLookup();}
if(item.dataType==='block'||(item.template&&(item.dataType!='lookup'||(item.dataType=='lookup'&&item.editor)))){return formatBlock();}
return cellValue;function formatImage(){if(cellValue!==null&&cellValue!==''&&cellValue!==undefined){return"<span class='myls-field-image'><img src='files/"+cellValue+"'></span>";}else{return cellValue;}}
function formatUrl(){if(cellValue!==null&&cellValue!==''&&cellValue!==undefined){const href=infoData[item.extField];return"<a class='myls-grid-url' href='/site/download?file="+href+"'>"+cellValue+"</a>";}else{return cellValue;}}
function formatColor(){if(cellValue!==null&&cellValue!==''&&cellValue!==undefined){return"<span class='myls-grid-column-color "+$.Color(cellValue).contrastColor()+"' style='background-color: "+cellValue+"'></span>";}else{return cellValue;}}
function formatDate(){if(cellValue!==null&&cellValue!==''&&cellValue!==undefined){try{cellValue=DevExpress.localization.formatDate(new Date(cellValue),item.format);cellValue=this.setColorToCell(item,cellValue,info);return cellValue;}catch(e){return cellValue;}}}
function formatNumber(){if(cellValue!==null&&cellValue!==''&&cellValue!==undefined){try{let format="#,##0";if(item.format.precision>0){format+='.'+'0'.repeat(item.format.precision);}
cellValue=DevExpress.localization.formatNumber(cellValue,format);return self.setColorToCell(item,cellValue,info);}catch(e){return cellValue;}}}
function formatString(){if(cellValue!==null&&cellValue!==''&&cellValue!==undefined){let result=cellValue,currPattern='';if(item.pattern=='email'){result='<span id="'+app.cntToolTip+'_'+item.dataField+'" class="myls-tooltip" data-href="mailto:'+cellValue+'" data-type="email">'+cellValue+'</span>';}
if(item.pattern=='phone'){result='<span id="'+app.cntToolTip+'_'+item.dataField+'" class="myls-tooltip" data-href="tel:'+cellValue+'" data-type="tel">'+cellValue+'</span>';}
if(item.pattern=='url'){let prefix='';if(cellValue.indexOf("://")==-1)
prefix="http://";result='<span id="'+app.cntToolTip+'_'+item.dataField+'" class="myls-tooltip" data-href="'+prefix+cellValue+'" data-type="globe">'+cellValue+'</span>';}
if(item.extFormId&&item.extFormField){const uuid=app.create_UUID();self.mylsObject.dependencies.init(self.mylsObject,infoData);self.mylsObject.dependencies.doCondition(item.extFormId).then((extFormId)=>{if(extFormId){const idn=app.getIdn(app.appInfo.tables[extFormId].tableType,extFormId,infoData[item.extFormField],'popup');$(`#${uuid}`).attr('data-url',idn);}});result=`<span class="myls-open-object-container"><span class="myls-open-object_text"> ${cellValue}</span><i id="${uuid}" class="dx-icon-edit myls-open-object" data-idn="${self.idn}"></i></span>`;}
result=app.replaceAll(result,'__idn__',self.idn);app.cntToolTip++;result=self.setColorToCell(item,result,info);return result;}else{return cellValue;}}
function formatLookup(){let result=cellValue;if(item.extFormId&&item.extFormField){result='<span class="myls-open-object-container"><span class="myls-open-object_text"> '+cellValue+'</span><i class="dx-icon-edit myls-open-object" data-ext-id="'+infoData[item.extFormField]+'" data-table="'+item.extFormId+'" data-id="'+infoData['id']+'" data-view="popup" data-type="form" data-title="Редактировать '+cellValue+'" data-idn="'+idn+'"></i></span>';result=self.setColorToCell(item,result,info);return result;}else{result=self.setColorToCell(item,result,info);return result;}}
function formatBlock(){let emptyFields=[];const regExp=/\$([\w_]+)\$/gi;item.template=item.template.replace('$__idn__$',self.idn);let template=item.template.replace(regExp,function(pattern,m){let value=infoData[m]!==undefined&&infoData[m]!==null?infoData[m]:'';if(value===''){emptyFields.push(m);}else{if(item.dataType==='block'||item.dataType==='string')
value=self.getFormattedCellValue(value,self.columns[m],info);if((item.dataType=='lookup'||item.dataType=='list')&&app.isDate(value)){value=DevExpress.localization.formatDate(new Date(value),'dd.MM.yyyy');}}
return value;});app.translate.saveTranslateBlock(template);if(emptyFields.length){let selectors=[];for(let i=0,l=emptyFields.length;i<l;i++){selectors.push('*[data-field='+emptyFields[i]+']');selectors.push('*[data-for='+emptyFields[i]+']');selectors.push('*[prev-delimiter-field='+emptyFields[i]+']');selectors.push('*[delimiter-field='+emptyFields[i]+']');}
selectors=selectors.join(', ');let $tpl=$(template);$(selectors,$tpl).each(function(){$(this).remove();template=$tpl.get(0);});$tpl=$(template);$('span[role="field-set"], div',$tpl).each(function(){if($.trim($(this).text())==''&&!$(this).hasClass('fa')&&!$.contains(this,$('img',$(this)).get(0)))
$(this).remove();});$('*[role="data-delimiter"]:last-child',$tpl).each(function(){if($.trim($(this).text())==''&&!$(this).hasClass('fa'))
$(this).remove();});template=$tpl.get(0);}
return template.outerHTML?template.outerHTML:template;}}
getItemValueByColumnType(type,data){const column=this.getColumnsByColumnType(type,true);if(column){return this.getFormattedCellValue(data[column.dataField],column,data);}else{return null;}}
processCellTemplates(){const self=this;$.each(this.columns,function(index,item){self.setCellTemplates(item);self.setUsedColumns(item);if(item.sortField){item.calculateSortValue=item.sortField;}});}
setCellTemplates(item){const self=this;if(item.dataType==='image'){templateImage();}
if(item.dataType==='url'){templateUrl();}
if(item.dataType==='color'){templateColor();}
if(item.dataType==='tagbox'){templateTagBox();}
if(item.dataType=='boolean'){templateBoolean();}
if(item.dataType==='string'){templateString();}
if(item.dataType==='number'){templateNumber();}
if(item.dataType==='lookup'){templateLookup();}
if(item.dataType==='date'){templateDate('dd.MM.yyyy',"yyyy-MM-dd");}
if(item.dataType==='datetime'){templateDate('dd.MM.yyyy HH:mm',"yyyy-MM-ddTHH:mm:ssx");}
if(item.dataType==='time'){templateDate('HH:mm',"yyyy-MM-ddTHH:mm:ssx");}
if(item.dataType==='block'&&item.template!==''){templateBlock();}
function templateImage(){item.cellTemplate=function(element,info){$(element).html(self.getFormattedCellValue(info.text,item,info));};item.allowFiltering=false;item.allowSorting=false;}
function templateUrl(){item.cellTemplate=function(element,info){$(element).html(self.getFormattedCellValue(info.text,item,info));};}
function templateColor(){item.cellTemplate=function(element,info){$(element).html(self.getFormattedCellValue(info.text,item,info));};item.headerFilter={dataSource:function(data){data.dataSource.postProcess=function(results){$.each(results,function(index,filterItem){const value=filterItem.text;filterItem.template=function(){return"<div style='width: 20px; height: 20px; background-color: "+value+"'></div>";};});return results;};}};item.allowSorting=false;}
function templateTagBox(){item.cellTemplate=function(element,info){$(element).html(self.getFormattedCellValue(info.text,item,info));};item.headerFilter={dataSource:function(data){data.dataSource.postProcess=function(results){let newResults=[];$.each(results,function(index,filterItem){let values=filterItem.text.split(',');$.each(values,function(index,value){value=value.trim();let exists=false;$.each(newResults,function(index,r){if(r.text==value){exists=true;}});if(!exists){newResults.push({text:value,value:[[item.dataField,'startsWith',value+','],'or',[item.dataField,'endsWith',', '+value],'or',[item.dataField,'contains',', '+value+','],'or',[item.dataField,'=',value]]});}});});newResults=newResults.sort(function(a,b){if(a.text<b.text){return-1;}
if(a.text>b.text){return 1;}
return 0;});return newResults;};}};item.allowSorting=false;}
function templateBoolean(){item.falseText=app.translate.saveString("Нет");item.trueText=app.translate.saveString("Да");}
function templateString(){item.cellTemplate=function(element,info){$(element).html(self.getFormattedCellValue(info.text,item,info));};}
function templateNumber(){item.cellTemplate=function(element,info){$(element).html(self.getFormattedCellValue(info.text,item,info));};}
function templateLookup(){item.lookup={dataSource:self.mylsObject.initLookupDataSource(item),valueExpr:'id',displayExpr:'item',};item.cellTemplate=function(element,info){$(element).html(self.getFormattedCellValue(info.text,item,info));};}
function templateDate(format,serialFormat){if(!item.editorOptions)item.editorOptions=[];item.dataType='date';item.format=format;item.editorOptions.dateSerializationFormat=serialFormat;item.editorOptions.useMaskBehavior=true;item.editorOptions.type=item.dataType;item.cellTemplate=function(element,info){$(element).html(self.getFormattedCellValue(info.data[info.column.dataField],item,info));};}
function templateBlock(){if(item.usedColumns.length>0){item.headerFilter={dataSource:function(data){data.dataSource.postProcess=function(results){let newResults=[];$.each(self.mylsObject.dataSource.items(),function(index,filterItem){$.each(item.usedColumns,function(index,value){if(filterItem[value]!=null){let val=filterItem[value];let exists=false;$.each(newResults,function(index,r){if(r.text==val){exists=true;}});if(!exists){newResults.push({text:val,value:[[value,'=',val]]});}}});});newResults=Array.from(new Set(newResults));let numArr=[];let strArr=[];for(let item of newResults){if(typeof(item.text)=='number'){numArr.push(item);}else{strArr.push(item);}}
numArr.sort((a,b)=>a.text-b.text);strArr.sort((prev,next)=>{if(prev.text<next.text)return-1;if(prev.text<next.text)return 1;});let resultArray=numArr.concat(strArr);return resultArray;};}};}
if(!item.sortField)
item.allowSorting=false;item.cellTemplate=function(element,info){$(element).html(self.getFormattedCellValue(info.text,item,info));};}}
setSummaryFormat(){if(this.summary&&this.summary.length>0){$.each(this.summary,function(index,item){item.displayFormat="{0}";});}}
setSummaryFields(){const self=this;if(this.summary&&this.summary.length>0){$.each(this.columns,function(index,item){if(item.footerField){const sumItem=getSummaryItem(item.footerField);if(sumItem)
sumItem.showInColumn=index;}});}
function getSummaryItem(dataField){let sumItem=null;$.each(self.summary,(index,item)=>{if(item.column==dataField){sumItem=item;return;}});return sumItem;}}
setColumnsByTypeVisible(component,type,isVisible){$.each(this.columns,function(index,item){if(item.dataType===type){component.columnOption(item.dataField,"visible",isVisible);}});}
getTableDataByColumns(data){let rawData={};if(data){$.each(this.columns,function(index,item){if(data.hasOwnProperty(index)&&!item.customSave)
rawData[index]=data[index];});}
return rawData;}
setDefaultValues(data){$.each(this.columns,function(index,item){if(item.defaultValue!==undefined&&item.defaultValue!=null&&item.defaultValue[0]!='='){if(item.defaultValue[0]==':'){data[item.dataField]=app.getConfigParam(item.defaultValue);}else if(item.dataType=='lookup')
data[item.dataField]=parseInt(item.defaultValue,10);else
data[item.dataField]=item.defaultValue;}});}
setDataToColumns(data){$.each(this.columns,function(index,item){if(data.hasOwnProperty(index)){item.value=data[index];}});}
solveFloatProblem(updateArr){const self=this;$.each(updateArr,function(index){if(self.columns[index]&&self.columns[index].dataType&&self.columns[index].dataType&&self.columns[index].dataType=='number'&&self.columns[index].format.precision>0&&updateArr[index]){updateArr[index]=updateArr[index].toString();}});}
solveBooleanProblem(updateArr){const self=this;$.each(updateArr,function(index,item){if(self.columns[index]&&self.columns[index].dataType=='boolean')updateArr[index]=updateArr[index]?1:0;});}
getFieldPath(column){let path=column.dataField;if(column.path)
path=column.path+path;return path;}
isObject(field){return app.objectTypes.indexOf(this.columns[field].dataType)==-1?false:true;}
setDataDependenciesFromObject(column,params){const self=this;if(params&&!column.dataConditions)
column.dataConditions=[];$.each(params,(field)=>{field=field.substring(1);if(self.columns[field]){column.dataConditions.push(field);if(!self.columns[field].dependencies)
self.columns[field].dependencies={};if(!self.columns[field].dependencies.data)
self.columns[field].dependencies.data=[];self.columns[field].dependencies.data.push(column.dataField);}});}
destroy(){this.destroyEditors();app.destroyArray(this.columns);app.destroyArray(this.summary);app.destroyArray(this.colCaches);app.mylsObject=null;}
destroyEditors(){$.each(this.columns,(index,item)=>{if(item.editor&&item.dataType=='html'){item.editor.destroy();}});}
getColumnsForGrid(){let result={};let columns=this.getUsedColumns();let keysSorted=Object.keys(columns).sort((a,b)=>columns[a].parentId-columns[b].parentId);for(let i of keysSorted){if(columns[i].parentId&&columns[i].hasOwnProperty('columnId')){let index=Object.keys(columns).find(key=>columns[key].columnId===columns[i].parentId);if(index!==undefined){if(!columns[index].hasOwnProperty('columns')){columns[index].columns=[];}
columns[index].columns.push(columns[i]);}}else{result[i]=columns[i];}}
result.__lastColumn__={width:"auto",cssClass:'last-column',visibleIndex:100000,cellTemplate:function(container){}};return result;}
getColumnTypeParameters(param){const paramsArray={};if(!Array.isArray(param))
return paramsArray;param.forEach(item=>{let values=item.split('=');if(values.length>1)
paramsArray[values[0]]=values[1];else
paramsArray[0]=values[0];});return paramsArray;}};;class MylsObject{constructor(table,ext_id,view,mode,tHistory,viewMode,params={}){this.idn='';this.table=table;this.ext_id=ext_id;this.view=view;this.type=undefined;this.mode=mode;this.tHistory=tHistory;this.viewMode=viewMode;this.object={};this.params=params;this.tableData={};this.promise=new Promise(function(resolve,reject){this.close=resolve;}.bind(this));}
async init(){this.idn=app.getIdn(this.type,this.table,this.ext_id,this.view);this.initData();this.dependencies=new Dependencies(this);this.setDefaultExtId();this.selParams=await this.getSelParams();this.dataSource=this.createDataSource();$("#"+this.idn).addClass('mylscompact');this.initToolbar();this.initFilter();this.initProgressBar();}
afterInit(){this.createChart();}
setDefaultExtId(){if(this.tableInfo.idField=='company_id'&&(this.ext_id===null||this.ext_id===undefined))
this.ext_id=app.config.company_id;}
initData(){this.tableInfo=this.getTableInfo();this.tableColumns=this.getTableColumns();this.contextMenuData=this.getContextMenu();this.template=this.getTemplate();this.columns=new Columns(this.tableColumns,this.idn,this);}
initProgressBar(){this.progressBar=new ProgressBar(this);}
initToolbar(){this.toolbar=new Toolbar(this);}
initFilter(){this.filter=new Filter(this);}
getTableInfo(){return app.cloneObject(app.appInfo.tables[this.table]);}
getContextMenu(){if(app.appInfo.contextMenu[this.table])
return app.cloneObject(app.appInfo.contextMenu[this.table]);else
return null;}
getTableColumns(){return app.cloneObject(app.appInfo.columns[this.table]);}
getTemplate(){if(app.appInfo.templates[this.table])
return app.cloneObject(app.appInfo.templates[this.table]);else
return null;}
refreshRow(ext_id,mode){const self=this;return new Promise((resolve,reject)=>{if(self.object&&self.dataSource){const store=self.dataSource.store();app.openLoadPanel(self.idn);$.ajax({url:'frame/tablerow',type:'get',data:{'id':self.table,'extId':ext_id},success:function(data){data=JSON.parse(data)[0];if(mode=='ins'){store.push([{type:"insert",data:data}]);}else
store.push([{type:"update",data:data,key:ext_id}]);app.closeLoadPanel(self.idn);self.changed();self.toolbar.updateFilterList();resolve();},error:async function(error){await app.dialog.showError(self.idn,error);reject();}});}else{resolve();}});}
async getSelParams(){let selParams={};if(this.tableInfo.selParams){let self=this;$.each(this.tableInfo.selParams,function(_,item){if(item!='table_date'&&item!='end_date')
selParams[':'+item]=null;});await this.setTableDates(selParams);}
return selParams;}
async setTableDates(selParams){let tableDates={};const tableDatesColumn=this.columns.getColumnsByColumnType("table_dates",true);if(app.hasValue(tableDatesColumn)){tableDates=await this.loadLookupData(tableDatesColumn);if(tableDates&&tableDates[0]){tableDates=tableDates[0];}}else{let curDate=new Date();let date30=new Date();date30.setDate(date30.getDate()-30);if(app.findInArray('table_date',this.tableInfo.selParams)!==-1&&app.findInArray('end_date',this.tableInfo.selParams)!==-1){tableDates.table_date=this.convertFromDateTime(date30).slice(0,10);tableDates.end_date=this.convertFromDateTime(curDate).slice(0,10);}else{tableDates.table_date=this.convertFromDateTime(curDate).slice(0,10);tableDates.end_date=this.convertFromDateTime(curDate).slice(0,10);}}
if(app.hasValue(tableDates.table_date))
selParams[':table_date']=tableDates.table_date;if(app.hasValue(tableDates.end_date))
selParams[':end_date']=tableDates.end_date;}
findInDataSource(text,items,field='item'){const self=this;const searchText=text.trim().toLowerCase();return items.findIndex((item)=>{if(item[field]&&String(item[field]).trim().toLowerCase()==searchText){return true;}
if(item.hasOwnProperty('items'))
return self.findInDataSource(text,item.items,field='item');});}
convertFromDateTime(date){if(!date)return null;const regex=/\d{4}-\d{2}-\d{2}((T|\ )\d{2}:\d{2}:\d{2})?/g;if(String(date).search(regex)==-1)
date=DevExpress.localization.formatDate(new Date(date),'yyyy-MM-ddTHH:mm:ssx');date=date.slice(0,19).replace('T',' ');return date;}
async processResult(res){if(!res)return;if(res.error&&res.error!=''){await app.dialog.showError(this.idn,res.error);}else if(res.success){if(res.success.error_msg&&res.success.error_type){res=res.success;res.error_msg=app.replaceAll(res.error_msg,'__idn__',this.idn);if(res.error_type==1){await app.dialog.showWarning(this.idn,res.error_msg);}else{await app.dialog.showError(this.idn,res.error_msg);}}}else if(typeof res=='string'){await app.dialog.showError(this.idn,res);}else await app.dialog.showError(this.idn,res.toString());}
async processDelete(key){try{let data=await app.processData("frame/delete?table="+this.table+"&extId="+key+"&lang="+app.config.lang,"DELETE");this.processResult(data);}catch(e){this.processResult(e);}
this.changed();}
prepareTableData(ext_id,mode){let params={};params.table=this.table;params.extId=ext_id?ext_id:this.ext_id;params.mode=mode?mode:this.mode;params.isTabler=this.tableInfo.isTabler!==undefined?this.tableInfo.isTabler:0;app.addConfigParams(params);this.passParamsToSelParams();if(this.selParams){params.selParams=JSON.stringify(this.selParams);}
return params;}
createDataSource(){let self=this;if(!this.selParams)
this.selParams={};let ds=new DevExpress.data.DataSource({reshapeOnPush:true,paginate:false,mylsFilter:[],postProcess:function(data){$.each(data,function(index,item){self.columns.convertDateTimeColumns(item);});return data;},store:new DevExpress.data.CustomStore({key:"id",loadMode:'raw',remove:function(key){return self.processDelete(key);},load:async function(loadOptions){let params=self.prepareTableData();params.filter=JSON.stringify(ds.mylsFilter);app.openLoadPanel(self.idn);let result=await app.processData('frame/tabledata','POST',params);self.tableData=result;app.closeLoadPanel(self.idn);self.changed();self.showTotal();return result;},update:async(key,values)=>{self.rawData=self.tableData.filter(item=>item.id==key)[0];self.update(key,values);},insert:(values)=>{return self.insert(values);},})});ds.selParams=this.selParams;return ds;}
getElement(e){let element='';if(e.hasOwnProperty("element"))
element=e.element;else if(e.hasOwnProperty("NAME"))
element=e.element();else
element=e;return element;}
contentReady(e){if(this.type!='scheduler')
this.lockObject(false);}
processDblClick(){if(this.tableInfo.e==1&&this.mode!=='ins'){const id=this.getCurrentId();this.editRecord(id,app.addHistory(this.tableInfo.idField,id,this.idn,this.tHistory,'upd'),'upd');}}
processInsert(){this.editRecord(-1,app.addHistory(this.tableInfo.idField,-1,this.idn,this.tHistory,'ins'),'ins');}
async editInline(){console.log(`${this.idn} - Нет режима инлайн редактирования`);}
editRecord(id,tHistory,mode,params){const self=this;return new Promise(async(resolve)=>{try{await self.saveDataIfInsert(mode,tHistory);if(self.tableInfo.formId){await app.openPopup(self.tableInfo.formId,id,'form',mode,tHistory,params);app.config.selTabs=app.topTabs.object.option("selectedIndex");app.setSettings();}else{self.mode=mode;await self.editInline(params);}}catch(e){}
resolve();});}
saveDataIfInsert(mode,tHistory){const self=this;return new Promise(async(resolve,reject)=>{if(mode=='ins'&&tHistory.length>1){const idn=tHistory[tHistory.length-2].idn;const mylsObject=$(`#${idn}`).data('mylsObject');if(mylsObject&&mylsObject.type=='form'){let confirmed=true;if(mylsObject.hasUncommitedData())
confirmed=app.dialog.confirm(self.idn,app.translate.saveString('Для корректной работы необходимо сохранить данные формы.<br>Продолжить?'),app.translate.saveString('Подтвержение'));if(await confirmed){try{mylsObject.updatedValues=mylsObject.tableData;await mylsObject.save(mylsObject.ext_id);tHistory[tHistory.length-1].mode='upd';resolve();}catch(error){reject();}}else reject();}else resolve();}else resolve();});}
async refresh(changesOnly=true,useLoadPanel=true){this.changed();}
getCurrentId(){return undefined;}
getSelectedRows(){return[];}
async sendStorageRequest(storageKey,dataType,method,data,table){const self=this;return new Promise((resolve,reject)=>{let storageRequestSettings={url:"site/"+storageKey,method:method,dataType:dataType,success:function(data){resolve(data);},fail:function(error){reject();}};storageRequestSettings.data={'table':table};if(data){storageRequestSettings.data={'table':table,'data':JSON.stringify(data)};}
$.ajax(storageRequestSettings);});}
async getParams(arr){let params={};for(let key in arr){if(arr[key]=="ext_id")
params[arr[key]]=this.ext_id;else
params[arr[key]]=await this.getFieldValue(arr[key]);}
return params;}
async getFieldValue(field,toDB){let value=null;value=app.getConfigParam(':'+field);if(value!==null)return this.prepareValue(value,field,toDB);const complexField=field.split('.');field=complexField[0];if(this.columns.columns.hasOwnProperty(field)){if(complexField.length==1){if(this.columns.columns[field].editor)
value=this.columns.columns[field].editor.option("value");else
value=this.tableData[field];}else
if(this.columns.columns[field].dataType=='lookup'&&this.columns.columns[field].editor){value=await this.getLookupValue(field,complexField[1]);}else
if(this.columns.isObject(field)){if(complexField[1]==='changed')
value=true;}}
if(!value&&complexField.length==1){const reverseHistory=this.tHistory.slice(0,this.tHistory.length-1);$.each(reverseHistory.reverse(),function(index,item){if(item.extField!==undefined&&field==item.extField&&item.extId!==undefined){value=item.extId;}});}
return this.prepareValue(value,field,toDB);}
async getLookupValue(field,param){try{const data=await this.columns.columns[field].editor.getDataSource().store().byKey(this.tableData[field]);return data[param];}catch(error){return null;}}
prepareValue(value,field,toDB){if(value!==null&&value!==undefined&&this.columns.columns[field]){switch(this.columns.columns[field].dataType){case'boolean':value=value?1:0;break;case'time':case'datetime':value=toDB?app.convertFromDateTime(value):app.getJsDate(value,false,this.columns.columns[field]);if(toDB)
value="\'"+value+"\'";break;case'date':value=toDB?app.convertFromDateTime(value):app.getJsDate(value,false,this.columns.columns[field]);if(toDB)
value="\'"+value.slice(0,10)+"\'";break;default:value=$.isNumeric(value)?parseFloat(value):"\'"+value+"\'";}}
if(value===undefined)
value=null;return value;}
async loadLookupData(column){let params={};if(column.hasOwnProperty('dataConditions')&&this.tableInfo)
params=await this.getParams(column.dataConditions);app.addConfigParams(params);params={'id':column.id,'params':params,'selParams':this.selParams};params.isTabler=column.isTabler!==undefined?column.isTabler:(this.tableInfo.isTabler!==undefined?this.tableInfo.isTabler:0);const jpParams=JSON.stringify(params);if((column.dataType=='lookup'||column.dataType=='tagbox')&&((column.dataParams&&column.dataParams==jpParams&&column.editor))){return column.editor.getDataSource().items();}else{if(column.editor&&column.editor.NAME!=='dxButtonGroup')
column.editor.getDataSource().store().clearRawDataCache();column.dataParams=jpParams;return app.processData('form/getlookup','post',params);}}
lookupAfterLoad(column){if(column.loadIndicator&&column.dropDownButton){column.dropDownButton.show();column.loadIndicator.option("visible",false);}}
initLookupDataSource(column,form,deps){const self=this;let ds={paginate:true,pageSize:30,store:new DevExpress.data.CustomStore({key:"id",loadMode:"raw",load:function(loadOptions){if(column.toCache&&app.colCaches[column.id]){return app.colCaches[column.id];}else{if(column.loadIndicator&&column.dropDownButton){column.dropDownButton.hide();column.loadIndicator.option("visible",true);}
let result=self.loadLookupData(column);column.loadPromise=result;result.then((values)=>{if(column.toCache&&!app.colCaches[column.id]){app.colCaches[column.id]=values;}
column.items=values;self.lookupAfterLoad(column);});return result;}},})};return ds;}
lockObject(lock=false){try{this.object.option('disabled',lock);}catch(e){}}
async deleteRowById(keys){this.progressBar.init(keys.length);for(let i=0;i<keys.length;i++){try{await this.dataSource.store().remove(keys[i]);this.progressBar.step();}catch(e){await app.dialog.showError(this.idn,e.message);break;}}
this.progressBar.remove();this.lockObject();if(this.type=='cards')
this.refresh();}
getCheckParent(items,id){const currParent=items[id].parent_id;let parentIndex=false;if((currParent==undefined)||(currParent==null)){return items[id];}else{$.each(items,function(index,item){if(item.id==currParent){parentIndex=index;}});}
if(parentIndex!==false){if(items[parentIndex].selected==true){if(items[parentIndex].parent_id!==null){return this.getCheckParent(items,parentIndex);}else{return items[parentIndex];}}else{return items[id];}}}
dblClick(){let prevClickTime=this.lastClickTime;this.lastClickTime=new Date();if(prevClickTime&&(this.lastClickTime-prevClickTime<300)){this.processDblClick();}}
destroy(){this.tHistory=null;this.object=null;this.params=null;this.tableData=null;this.selParams=null;this.dataSource=null;if(this.toolbar)
this.toolbar.destroy();if(this.filter)
this.filter.destroy();if(this.progressBar)
this.progressBar.destroy();if(this.columns)
this.columns.destroy();this.toolbar=null;this.filter=null;this.progressBar=null;}
passParamsValues(tableData,params){const self=this;params=params?params:this.params;$.each(params,function(index,item){if(tableData.hasOwnProperty(index)){if(self.columns.columns[index].dataType=='lookup')
tableData[index]=parseInt(item,10);else
tableData[index]=item;}});}
passHistoryValues(tableData){const self=this;let reverseHistory=this.tHistory.slice(0,this.tHistory.length);$.each(reverseHistory.reverse(),async function(index,item){if(item.extField!==undefined&&tableData.hasOwnProperty(item.extField)&&item.extId!==undefined&&tableData[item.extField]==null){tableData[item.extField]=item.extId;if(self.columns.columns[item.extField]&&self.columns.columns[item.extField].form){await self.execChangeProcedure(self.columns.columns[item.extField],item.extId);self.dependencies.init(self.columns.columns[item.extField].form,tableData);self.dependencies.process(item.extField);}}});}
passParamsToSelParams(){const self=this;$.each(this.params,function(index,item){if(self.selParams.hasOwnProperty(':'+index)){self.selParams[':'+index]=item;}});}
async setParams(params){let changed=false;const self=this;$.each(this.params,function(index,item){if(app.hasValue(params[index])&&item!==params[index]){self.params[index]=params[index];changed=true;}});if(changed)
await this.refresh();}
changed(){}
hasUncommitedData(){return false;}
initBottomToolbar(){const self=this;$('#'+this.idn+' .myls-bottom-toolbar').remove();$('#'+this.idn).append('<div class="myls-bottom-toolbar"></div>');const bToolbar=$('#'+this.idn+' .myls-bottom-toolbar').dxToolbar({items:[{location:'before',locateInMenu:'never',template:function(){return $(`<div class='toolbar-label' id='${self.idn}_totalCount'></div>`);}},{location:'before',locateInMenu:'never',visible:false,cssClass:'myls-total-selected dx-state-invisible mylsThemeBlue',template:function(){return $(`<div class='toolbar-label' id='${self.idn}_totalSelected'></div>`);}},{location:'before',locateInMenu:'never',visible:false,cssClass:'myls-total-id dx-state-invisible mylsThemeGreen',template:function(){return $(`<div class='toolbar-label' id='${self.idn}_totalId'></div>`);}}],}).dxToolbar("instance");}
showSelected(selected){const $e=$(`#${this.idn}_totalSelected`);if(selected>0){$e.closest('.myls-total-selected').removeClass('dx-state-invisible');$e.text(app.translate.saveString("Выделено:")+' '+selected);}else{$e.closest('.myls-total-selected').addClass('dx-state-invisible');$e.text();}}
showId(id){const $e=$(`#${this.idn}_totalId`);if(id){$e.closest('.myls-total-id').removeClass('dx-state-invisible');$e.text('ID: '+id);}else{$e.closest('.myls-total-id').addClass('dx-state-invisible');$e.text();}}
showTotal(){$(`#${this.idn}_totalCount`).text(app.translate.saveString("Всего записей:")+' '+this.dataSource._totalCount);}
repaint(){}
createChart(){const self=this;if(this.template&&this.template.hasOwnProperty('report')){const chartId=this.idn+'_chart';$('#'+this.idn).before('<div id="'+chartId+'"></div>');this.series=[];this.chartType=this.template.report.attributes.type;$.each(this.template.report.serie,function(index,item){self.series.push({valueField:self.columns.columns[item].dataField,name:self.columns.columns[item].caption,summaryType:self.columns.columns[item].summaryType});});this.argument=self.columns.columns[this.template.report.argument.field].dataField;this.viewMode='';this.chartView=new ChartView(this.table,this.template.report.attributes.type,this.viewMode,this.series,this.argument,chartId,true,this.toolbar,this.columns);this.chartView.init(this.tableData);}}};;class MylsEditableObject extends MylsObject{constructor(table,ext_id,view,mode,tHistory,viewMode,params){super(table,ext_id,view,mode,tHistory,viewMode,params);this.updatedValues={};this.rawData={};this.rawValues={};this.updatedExtId=[];this.updatedExtField=[];this.deps={};}
async update(key,values){this.updatedValues=values;await this.save(key);this.changed();this.toolbar.setEnabledToolbar();}
async insert(values){this.rawData=this.rawValues[values['id']];this.updatedValues=values;try{await this.save(values['id']);this.changed();this.toolbar.setEnabledToolbar();Promise.resolve();}catch(error){Promise.reject();}}
async updateLookups(){let self=this;$.each(this.columns.columns,async function(index,item){if(item.dataType=='lookup'&&item.updateConditions){await self.processUpdateLookup(item);}});}
async processUpdateLookup(column){const self=this;const updValues={};$.each(column.updateConditions,function(_,item){updValues[item]=self.updatedValues[item]?self.updatedValues[item]:self.rawData[item];});const updParams={};updParams.id=column.id;updParams.isTabler=this.tableInfo.isTabler;updParams.params=JSON.stringify(updValues);try{await app.processData('frame/updatelookup','post',updParams);}catch(error){await this.processResult(error);}
if(!this.tableInfo.updParams.length)
this.updatedValues[column.dataField]=undefined;}
createUpdatedValues(key){const self=this;const updateArr={};let updParams='updParams';if(this.mode=='ins')
updParams='insConParams';if(this.tableInfo.hasOwnProperty(updParams)&&this.tableInfo[updParams].length){getUpdateProcArr();}else
getUpdateArr();if(this.mode=='ins'){updateArr[this.updatedExtField[key]]=this.updatedExtId[key];}
if(Object.keys(updateArr).length!=0){this.columns.convertFromDateTimeColumns(updateArr);this.columns.solveFloatProblem(updateArr);this.columns.solveBooleanProblem(updateArr);}
if(this.tableData.hasOwnProperty('manual_updated')){updateArr['manual_updated']=1;}
return updateArr;function getUpdateProcArr(){$.each(self.tableInfo[updParams],function(_,item){updateArr[item]=self.updatedValues[item]!==undefined?self.updatedValues[item]:self.rawData[item];});app.addConfigParams(updateArr);}
function getUpdateArr(){$.each(self.rawData,function(index,value){const column=self.columns.columns[index];if(column){if(value!=self.updatedValues[index]&&(column.useColumn||column.allowEditing)){updateArr[index]=self.updatedValues[index];}
if(self.updatedValues.hasOwnProperty(column.dataField)&&column.hasOwnProperty('toClear')&&column.toClear&&self.updatedValues[index]){if(column.dataType=='boolean')
updateArr[index]=0;else
updateArr[index]=null;}}});}}
getUpdatePromise(updateArr,ext_id){let updParams='updParams';if(this.mode=='ins')
updParams='insConParams';const params={table:this.table,ext_id:ext_id?ext_id:this.ext_id,data:JSON.stringify(updateArr),type:this.mode,isTabler:this.tableInfo.isTabler!==undefined?this.tableInfo.isTabler:0};if(this.tableInfo.hasOwnProperty(updParams)&&this.tableInfo[updParams].length){params.params=JSON.stringify(updateArr);return app.processData('frame/updateproc','post',params);}else{params.data=JSON.stringify(updateArr);return app.processData('frame/update','post',params);}}
destroy(){super.destroy();app.destroyArray(this.updatedExtId);app.destroyArray(this.updatedExtField);app.destroyArray(this.rawValues);app.destroyArray(this.updatedValues);app.destroyArray(this.rawData);app.destroyArray(this.deps);}
validate(){return true;}
disableButtons(){}
createAllValues(updateArr){const self=this;const currentValues=$.extend({},this.rawData,updateArr);this.columns.solveBooleanProblem(currentValues);this.columns.convertFromDateTimeColumns(currentValues);return currentValues;}
async save(key){const self=this;return new Promise(async(resolve,reject)=>{if(!await self.validate()){reject();}else{self.disableButtons(true);const updateArr=self.createUpdatedValues(key);const currentValues=self.createAllValues(updateArr);try{await self.checkData(currentValues);await self.updateLookups();await self.saveData(updateArr,key);await self.additionalSave();await self.execCloseProc(currentValues);resolve();}catch(error){await self.processResult(error);self.disableButtons(false);reject();}}});}
async additionalSave(){}
execCloseProc(data){return this.execDataProcedure('closeProc','form/closeproc',data);}
execCancelProc(data){return this.execDataProcedure('cancelProc','form/cancelproc',data);}
execDataProcedure(procedureName,url,data){const self=this;return new Promise(async(resolve,reject)=>{if(!self.tableInfo[procedureName]||!self.tableInfo[procedureName].length){resolve();return;}
const postParams=this.getPostParams(data,self.tableInfo[procedureName]);try{const result=await app.processData(url,'post',postParams);resolve();}catch(error){await self.processResult(error);reject();}});}
async saveData(updateArr,key){const promise=this.getUpdatePromise(updateArr,key);try{const result=await promise;this.processResult(result);}catch(error){this.processResult(error);}finally{if(this.tableInfo.refreshAll){this.refresh(false);}}}
checkData(data){const self=this;return new Promise(async(resolve,reject)=>{if(!self.tableInfo.checkProc||!self.tableInfo.checkProc.length){resolve();return;}
const postParams=this.getPostParams(data,self.tableInfo.checkProc);try{let msg=await app.processData('frame/checkdata','post',postParams);if(msg.success&&!msg.success[0].error_msg){resolve();return;}else{if(!msg.error&&msg.success[0].error_type==1){const result=await app.dialog.confirm(this.idn,msg.success[0].error_msg,'Предупреждение','Сохранить','Отменить','myls-msg-warning');if(result)resolve();else reject();return;}else{await app.dialog.showError(self.idn,msg.error?msg.error:msg.success[0].error_msg);reject();}}}catch(error){await self.processResult(error);reject();}});}
getPostParams(data,procedure){const postParams={'table':this.table};const params={};$.each(procedure,function(index,item){params[item]=null;if(data[item]!==null&&data[item]!==undefined){params[item]=data[item];}});app.addConfigParams(params);postParams.params=JSON.stringify(params);return postParams;}
setFieldVisible(object,column,isVisible){}
setFieldCaption(object,column,caption){}
setFieldValidation(object,column,rules){}
setFieldValue(object,column,value){}
setFieldEditable(object,column,result){}
async prepareInsert(params,justInsert){let data=await app.processData('frame/tabledata','post',this.prepareTableData(-1,'ins'));this.updatedExtId[data[0]['id']]=data['ext_id'];this.updatedExtField[data[0]['id']]=data['ext_field'];this.rawValues[data['ext_id']]=app.cloneObject(data[0]);data=data[0];this.passHistoryValues(data);this.columns.setDefaultValues(data);this.passParamsValues(data,params);if(!justInsert){this.object.on('initNewRow',function(e){e.data=data;});this.object.addRow();}
return data;}
afterInit(){super.afterInit();this.createFileUploader();}
getDocumentOptions(){const self=this;const column=this.columns.getColumnsByColumnType('fileurl',true);const params=this.getImageParams(column);let count=0;let url="documents/fileupload";if(params)
url+="?params="+params;return{multiple:true,uploadMode:"instantly",uploadUrl:url,name:"documentFiles",showFileList:false,onProgress:function(e){self.progressBar.position(e.component.option('progress'));},onUploadStarted:function(e){self.progressBar.init(100+e.component.option("value").length,false);},onUploadError:function(e){count=count+1;self.progressBar.position(100+count);},onUploaded:async function(e){await self.documentUploaded(e);count=count+1;self.progressBar.position(100+count);if(100+e.component.option("value").length==100+count){e.component.option("value",[]);count=0;}},};}
getImageParams(column){if(column&&column.dataType=='image'){if(column.columnType)
return JSON.stringify(column.columnType);}
return false;}
async documentUploaded(e){const filename=$.parseJSON(e.request.response);if(filename!==''){if(this.tableInfo.docProc[0]!='='){const docParams={fileaddr:filename};await app.processData(this.tableInfo.docProc,'GET',docParams);}else if(this.tableInfo.docProc=='=loadfiles'){let params={};params[this.columns.getColumnsByColumnType('file',true).dataField]=e.file.name;params[this.columns.getColumnsByColumnType('fileurl',true).dataField]=filename;if(this.tableInfo.formId){this.mode='ins';let data=await this.prepareInsert(params,true);await this.insert(data);this.mode='sel';}else{await this.editRecord(-1,this.tHistory,'ins',params);}}}}
createFileUploader(){if(this.tableInfo.docProc&&this.tableInfo.a==1){const pbId=this.idn+'_progressbar';$('#'+this.idn).prepend('<div id="'+this.idn+'_file-uploader"></div>');$("#"+this.idn+"_file-uploader").after('<div id="'+pbId+'"/>');$("#"+this.idn+"_file-uploader").dxFileUploader(this.getDocumentOptions()).dxFileUploader('instance');$("#"+this.idn+'_file-uploader .dx-fileuploader-button').addClass("dx-button-default dx-button-mode-outlined");$("#"+this.idn+'_file-uploader .dx-fileuploader-button').removeClass("dx-button-normal dx-button-mode-contained");}}};;class Toolbar{constructor(object){this.currentFilter=[];this.table=object.table;this.ext_id=object.ext_id;this.view=object.view;this.type=object.type;this.mode=object.mode;this.tHistory=object.tHistory;this.items=[];this.mylsObject=object;this.btns={};}
createObject(){$("#"+this.mylsObject.idn).prepend('<div class="dx-datagrid-header-panel"></div>');$("#"+this.mylsObject.idn+" .dx-datagrid-header-panel").append('<div role="toolbar"></div>');this.object=$("#"+this.mylsObject.idn+" [role=toolbar]").dxToolbar({items:this.items,}).dxToolbar("instance");$(document.body).on('click','#'+this.mylsObject.idn+' .dx-datagrid-filter-panel-left',function(){$('#'+this.mylsObject.idn+'_popupContainer').dxPopup("show");});}
async init(e){this.isEdit=false;this.currentFilter=[];if(e){const obj=e.component;this.isEdit=obj.option('editing').mode=='batch';this.items=e.toolbarOptions.items;this.object=e;this.getOptions();}else{this.createObject();this.object.option('items',this.getOptions());}
this.editMode();}
createAddButton(){if(this.mylsObject.tableInfo.a==1&&!this.toolbarButtonExists("buttonAdd")){this.items.push({widget:"dxButton",name:'buttonAdd',locateInMenu:'never',options:this.getAddBtnOptions(),location:"before",});}}
createEditButton(){if(this.mylsObject.tableInfo.e==1&&!this.toolbarButtonExists("buttonEdit")){this.items.push({widget:"dxButton",name:'buttonEdit',locateInMenu:'never',options:this.getEditBtnOptions(),location:"before",});}}
createDeleteButton(){if(this.mylsObject.tableInfo.d==1){this.items.push({widget:"dxButton",name:'buttonDelete',locateInMenu:'never',options:this.getDeleteBtnOptions(),location:"before",});}}
createRefreshButton(){this.items.push({widget:"dxButton",name:'buttonRefresh',locateInMenu:'never',options:this.getRefreshBtnOptions(),location:"before",});}
createImportButton(){if(this.mylsObject.tableInfo.a==1&&this.mylsObject.tableInfo.import!==undefined){this.items.push({widget:"dxButton",name:'buttonImport',locateInMenu:'auto',options:this.getImportBtnOptions(),location:"before",});}}
createFilterButton(){if(this.type!=='chart'&&app.appInfo.useFilter!=0){this.items.push({widget:"dxButton",name:'buttonSearch',locateInMenu:'never',options:this.getFilterBtnOptions(),location:"before",});}}
createAdminButton(){if(this.type=='grid'||this.type=='tree'){this.items.push({widget:"dxButton",name:'buttonAdmin',locateInMenu:'auto',options:this.getAdminBtnOptions(),location:"before"});}}
createGridSortButton(){this.positionColumn=this.mylsObject.columns.getColumnsByColumnType('position',true);if((this.type=='grid'||this.type=='cards')&&this.positionColumn&&this.mylsObject.tableInfo.e==1){this.items.push({widget:"dxButton",name:'buttonGridSort',locateInMenu:'never',options:this.getGridSortBtnOptions(),location:"before",});this.createExitButton();}}
createFilterFields(){const self=this;let filterColumns=this.mylsObject.columns.getColumnsByColumnType('filter',false);let isLoadSelectBoxData=[];if(filterColumns.length>0){$.each(filterColumns,function(i,item){isLoadSelectBoxData[item.dataField]=false;self.items.push({widget:"dxSelectBox",name:'tableFilter',locateInMenu:'auto',options:self.getFilterFieldsOptions(item,isLoadSelectBoxData),location:"center"});});}}
createDateFilter(){let curDate=new Date();let date30=new Date();date30.setDate(date30.getDate()-30);if(this.mylsObject.tableInfo.selParams&&app.findInArray('table_date',this.mylsObject.tableInfo.selParams)!==-1){this.items.push(this.getStartDateBox());}
if(this.mylsObject.tableInfo.selParams&&app.findInArray('end_date',this.mylsObject.tableInfo.selParams)!==-1&&app.findInArray('table_date',this.mylsObject.tableInfo.selParams)!==-1){this.items.push({text:" − ",location:"center"});}
if(this.mylsObject.tableInfo.selParams&&app.findInArray('end_date',this.mylsObject.tableInfo.selParams)!==-1){this.items.push(this.getEndDateBox());}}
getStartDateBox(){const self=this;return{widget:"dxDateBox",name:'tableDate',locateInMenu:'auto',options:{showClearButton:true,width:125,value:this.mylsObject.selParams[':table_date'],onValueChanged:function(e){self.dateValueChanged(':table_date',e);}},location:"center"};}
getEndDateBox(){let curDate=new Date();const self=this;return{widget:"dxDateBox",name:'tableDate',locateInMenu:'auto',options:{width:125,value:this.mylsObject.selParams[':end_date'],showClearButton:true,onValueChanged:function(e){self.dateValueChanged(':end_date',e);}},location:"center"};}
getOptions(){this.createAddButton();this.createEditButton();this.createDeleteButton();this.createRefreshButton();this.createImportButton();this.createFilterButton();this.createFilterFields();this.createDateFilter();this.createGridSortButton();return this.items;}
toolbarButtonExists(name){return this.items.find((item)=>{return item.name==name;})!==undefined;}
requiredField(item){let isRequired=false;if($.isArray(item.columnType)){$.each(item.columnType,function(i,el){if($.type(el)=='object'){if('filter'in el){if($.inArray('required',el.filter)!=-1){isRequired=true;return false;}}}});}
return isRequired;}
async selectValueChanged(e,field){let tableData=this.mylsObject.dataSource;let filter=[];if(e.component.option('value')!==null){this.currentFilter[field]=[field,'=',e.component.option('value')];}else{delete this.currentFilter[field];}
let out=[];for(let prop in this.currentFilter){if(out.length>0&&this.currentFilter[prop].length>0){out.push('and');}
if(this.currentFilter[prop].length>0)
out.push(this.currentFilter[prop]);}
filter.push(out);if(filter[0].length==0){filter=null;}
tableData.mylsFilter=filter;this.mylsObject.refresh();}
dateValueChanged(dateParam,e){if(this.mylsObject&&this.mylsObject.dataSource){let ds=this.mylsObject.dataSource;if(!ds.selParams)
ds.selParams={};if(e.value)
ds.selParams[dateParam]=app.convertFromDateTime(e.value).slice(0,10);else
ds.selParams[dateParam]=null;this.mylsObject.refresh(false);}}
editMode(){const self=this;const obj=this.mylsObject.object;if(!obj||!Object.keys(obj).length)return;if(this.mylsObject.type==='grid'||this.mylsObject.type==='tree'){let isEdit=obj.option('editing').mode=='batch';$.each(this.items,function(index,item){if(item.name=='saveButton'||item.name=='revertButton'){item.location='before';item.sortIndex=20;item.visible=isEdit;if(isEdit&&item.hasNewOnClick===undefined){item.hasNewOnClick=true;if(item.name=='saveButton'){item.options.onClick=function(e){obj.canFinishEdit=true;obj.saveEditData().done(function(){if(obj.canFinishEdit){self.exitFromEditing();}});};}
if(item.name=='revertButton'){item.options.onClick=async function(e){if(await app.dialog.confirm(self.mylsObject.idn,app.translate.saveString('Отменить все изменения?'),app.translate.saveString('Подтверждение'))){obj.cancelEditData();self.exitFromEditing();}};}}}
if(item.name=='revertButton'){item.options.disabled=false;}
if(item.name=='addRowButton'){item.visible=false;}
self.disableButtons(isEdit,'edit',index);});}}
showEditButtons(mode){if(this.mylsObject.type==='grid'||this.mylsObject.type==='tree'){this.mylsObject.object.option('editing').allowUpdating=mode==='batch'&&this.mylsObject.tableInfo.e===1;this.mylsObject.object.option('editing').allowAdding=mode==='batch'&&this.mylsObject.tableInfo.a===1;this.mylsObject.object.option('editing').allowDeleting=mode==='batch'&&this.mylsObject.tableInfo.d===1;}}
disableButtons(isEdit,type,index){$.each(this.btns,function(name,item){if(name=='edit'||name=='delete'||name=='refresh'||name=='filter'||(type=='edit'&&name=='gridSort')||(type=='sort'&&name=='add')){item.option('visible',!isEdit);item.visible=!isEdit;if(index)
item.sortIndex=index;}});}
exitFromEditing(e){const obj=this.mylsObject.object;if(this.type=='grid'){obj.beginUpdate();obj.option('editing',{mode:'row'});obj.option("focusedRowEnabled",true);obj.endUpdate();}
console.log(this.type);this.isEdit=false;this.mylsObject.mode='sel';this.showEditButtons('row');if(this.type=='cards'){this.btns.exitBtn.option('visible',false);this.btns.gridSort.option('icon',this.getSortedIcon());$('#'+this.mylsObject.idn+' .dx-scrollview-content.card-view').sortable('destroy');this.mylsObject.refresh();this.disableButtons(false,'sort');}}
getSortedIcon(){return'img/sort.svg?v=1';}
getExitBtnOptions(){const self=this;return{icon:"img/revert.svg?v=1",elementAttr:{toolbarrole:"always",buttonrole:"exit",},visible:(this.positionColumn&&this.mylsObject.tableInfo.e==1)?false:true,onInitialized:e=>{self.btns.exitBtn=e.component;},onClick:function(e){e.event.stopPropagation();self.exitFromEditing(e);}};}
createExitButton(){if(!this.toolbarButtonExists("exit")){this.items.push({widget:"dxButton",name:'buttonExit',locateInMenu:'auto',options:this.getExitBtnOptions(),location:"before"});}}
getAddBtnOptions(){const self=this;return{icon:"img/insert.svg?v=1",elementAttr:{toolbarrole:"always",buttonrole:"add",},onClick:function(e){e.event.stopPropagation();self.mylsObject.processInsert();},onInitialized:(e)=>{self.btns.add=e.component;}};}
getEditBtnOptions(disable=true){const self=this;return{elementAttr:{toolbarrole:"focused",buttonrole:"edit",},icon:"img/edit.svg?v=1",visible:!this.isEdit,disabled:disable,onClick:function(e){e.event.stopPropagation();self.mylsObject.processDblClick();},onInitialized:(e)=>{self.btns.edit=e.component;}};}
getDeleteBtnOptions(disable=true){const self=this;return{elementAttr:{toolbarrole:"focused",buttonrole:"delete",},visible:!this.isEdit,icon:"img/delete.svg?v=1",disabled:disable,onClick:async function(e){e.event.stopPropagation();let id=self.mylsObject.getCurrentId();let keys=self.mylsObject.getSelectedRows();let params=self.getDeleteOptions(id,keys);let dialogResult=await app.dialog.custom(app.translate.saveString("Вы действительно хотите удалить запись(и)?"),app.translate.saveString('Удаление'),params,'myls-msg-error');if(dialogResult===1){keys=[id];}
if(dialogResult!==0){await self.mylsObject.deleteRowById(keys);}},onInitialized:(e)=>{self.btns.delete=e.component;}};}
getDeleteOptions(id,keys){let params=[{text:"Удалить текущую",type:'danger',tabIndex:1,result:1}];if((keys.length==1&&id!=keys[0])||keys.length>1){params.push({text:app.translate.saveString("Удалить отмеченные"),type:'danger',tabIndex:2,stylingMode:'outlined',result:2});}
params.push({text:app.translate.saveString("Отменить"),type:'default',stylingMode:'outlined',tabIndex:0,result:0});return params;}
getRefreshBtnOptions(){const self=this;return{elementAttr:{toolbarrole:"always",buttonrole:"refresh",},icon:"/img/refresh.svg?v=1",visible:!self.isEdit,onClick:async function(e){self.mylsObject.refresh();self.updateFilterList();},onInitialized:(e)=>{self.btns.refresh=e.component;}};}
async updateFilterList(){const self=this;let filterColumns=self.mylsObject.columns.getColumnsByColumnType('filter',false);let isLoadSelectBoxData=[];$.each(filterColumns,function(index,item){isLoadSelectBoxData[item.dataField]=false;self.filterFieldsInitialized(isLoadSelectBoxData,item,item.filterObject);});}
getImportBtnOptions(){const self=this;return{elementAttr:{toolbarrole:"always",buttonrole:"import",},text:"Import",visible:!this.isEdit,onClick:function(e){self.createImportPopup();},onInitialized:(e)=>{self.btns.import=e.component;}};}
createImportPopup(){if(this.type=='grid'||this.mylsObject.type==='tree'){$("#"+this.mylsObject.idn).append('<div id="'+this.mylsObject.idn+'_popupContainer"></div>');$("#"+this.mylsObject.idn+'_popupContainer').append('<div id="'+this.mylsObject.idn+'_fileUploader"></div>');if(this.mylsObject.tableInfo.import!==undefined){$("#"+this.mylsObject.idn+'_popupContainer').append('<div id="'+this.mylsObject.idn+'_list"></div>');$("#"+this.mylsObject.idn+"_list").dxDataGrid({dataSource:this.mylsObject.tableInfo.import,});}
$("#"+this.mylsObject.idn+'_popupContainer').append('<div id="'+this.mylsObject.idn+'_error"></div>');this.importFilename='';$('#'+this.mylsObject.idn+'_fileUploader').dxFileUploader(this.getImportFileUploadOptions()).dxFileUploader("instance");let popup=$('#'+this.mylsObject.idn+'_popupContainer').dxPopup({title:"Popup Title",toolbarItems:[{location:"after"},this.getPopupButtonOK(),this.getPopupButtonCancel(),],});popup.dxPopup("instance").show();}}
getPopupButtonCancel(){return{widget:"dxButton",toolbar:"bottom",location:"after",options:{text:app.translate.saveString("Отмена"),onClick:function(e){$('#'+this.mylsObject.idn+'_popupContainer').dxPopup("instance").hide();}}};}
getPopupButtonOK(){const self=this;return{widget:"dxButton",toolbar:"bottom",location:"after",options:{text:app.translate.saveString("Ok"),onClick:function(e){self.fileImport();}}};}
fileImport(){const self=this;if(this.filename!==''){$.ajax({type:"POST",cache:false,url:"frame/importfromfiles",data:{files:self.filename,table_id:self.table},success:function(data){let res=$.parseJSON(data);if(res.type=='error'){$('#'+self.mylsObject.idn+'_error').html(res.data);}
if(res.type=='success'){$('#'+self.mylsObject.idn+'_error').html(res.data);}
self.mylsObject.refresh(false);}});}else{$('#'+self.mylsObject.idn+'_error').text(app.translate.saveString('Нет файлов для импорта'));}}
getImportFileUploadOptions(){const self=this;return{multiple:false,allowedFileExtensions:[".csv",".xls",".xlsx"],uploadMode:"instantly",uploadUrl:"frame/uploadfile?field="+this.mylsObject.idn+'_fileUploader',name:this.mylsObject.idn+'_fileUploader',minFileSize:10,onUploaded:function(e){let res=$.parseJSON(e.request.response);if(res=='error'){$('#'+self.mylsObject.idn+'_error').html('<p class="error_str">'+saveString('Ошибка! Файл не загружен!')+'</p>');}else{self.filename=res;$('#'+self.mylsObject.idn+'_error').text('');}},};}
getFilterBtnOptions(){const self=this;return{elementAttr:{toolbarrole:"always",buttonrole:"search",},icon:"img/filter.svg?v=1",onClick:function(e){self.mylsObject.filter.init(e);},onInitialized:(e)=>{self.btns.filter=e.component;}};}
getAdminBtnOptions(){const self=this;return{elementAttr:{toolbarrole:"always",buttonrole:"admin",},icon:"preferences",onClick:function(e){let state=self.mylsObject.object.state();app.prepareStorage(state);$.ajax({url:"frame/tablesetting",method:'post',data:{'table':this.table,'state':JSON.stringify(state)},success:function(data){console.log('ok');},fail:function(error){console.log(error);}});},onInitialized:(e)=>{self.btns.admin=e.component;}};}
getGridSortBtnOptions(disable=true){const self=this;return{elementAttr:{toolbarrole:"focused",buttonrole:"gridsort",class:'',},icon:this.getSortedIcon(),disabled:disable,onInitialized:(e)=>{self.btns.gridSort=e.component;},onClick:function(e){let cls=e.component.option('icon');if(cls.indexOf('sort')!=-1){self.startOrdered(e);self.disableButtons(true,'sort');self.btns.exitBtn.option('visible',true);}else{self.saveOrdered(e);self.disableButtons(false,'sort');self.btns.exitBtn.option('visible',false);}}};}
startOrdered(e){const self=this;e.component.option('icon','img/save.svg?v=1');if(self.type=='grid'){self.mylsObject.object.clearSorting();self.mylsObject.object.columnOption(this.positionColumn.dataField,"sortOrder",'asc');}
self.createExitButton();setTimeout(function(){if(self.type=='cards')
$('#'+self.mylsObject.idn+' .dx-scrollview-content.card-view').sortable();if(self.type=='grid')
$('#'+self.mylsObject.idn+' .dx-datagrid-table tbody').sortable();},1000);}
async saveOrdered(e){const self=this;let itemNodes=[];let positionGrid;if(this.type=='grid'){$('#'+self.mylsObject.idn+' .dx-row').each(function(index,item){let id=$(this).attr('data-id');if(id!==undefined)
itemNodes.push(id);});positionGrid={table:self.table,dataField:this.positionColumn.dataField,data:JSON.stringify(itemNodes)};}
if(this.type=='cards'){const positionColumn=this.mylsObject.columns.getColumnsByColumnType('position',true);$('#'+self.mylsObject.idn+' .dx-list-item').each(function(index,item){let id=$(this).find('.card').attr('data-id');itemNodes.push(id);});positionGrid={table:self.table,dataField:positionColumn.dataField,data:JSON.stringify(itemNodes)};}
await app.processData('frame/updateposition','POST',positionGrid);await this.mylsObject.refresh();e.component.option('icon',this.getSortedIcon());if(self.type=='grid')
$('#'+self.mylsObject.idn+' .dx-datagrid-table tbody').sortable('destroy');if(self.type=='cards')
$('#'+self.mylsObject.idn+' .dx-scrollview-content.card-view').sortable('destroy');}
getFilterFieldsOptions(item,isLoadSelectBoxData){const self=this;return{dataSource:[],displayExpr:item.dataField,valueExpr:item.dataField,showSelectionControls:false,placeholder:item.caption,showClearButton:false,buttons:["clear","dropDown"],width:item.width,elementAttr:{class:'mylsThemeFont11'},onInitialized:async function(e){await self.filterFieldsInitialized(isLoadSelectBoxData,item,e);item.filterObject=e;},onValueChanged:function(e){self.filterFieldsValueChanged(item,e);}};}
filterFieldsValueChanged(item,e){if(this.requiredField(item)){let selItems=e.component.option('items');if(selItems.length>0){if(e.component.option('value')==null){e.component.option('value',selItems[0][item.dataField]);}}}
this.selectValueChanged(e,item.dataField);}
async filterFieldsInitialized(isLoadSelectBoxData,item,e){if(isLoadSelectBoxData[item.dataField]===false){let filterParams=this.mylsObject.columns.getColumnTypeItem('filter',item);let params=this.mylsObject.columns.getColumnTypeParameters(filterParams);let itemData=await app.processData('frame/get-filter-string-data','post',{table:this.table,field:item.dataField,extId:this.ext_id,selParams:this.mylsObject.dataSource.selParams,params:params,});isLoadSelectBoxData[item.dataField]=true;app.removeNullFromArray(itemData);itemData=app.removeEmptyFromArray(itemData);this.mylsObject.object.beginUpdate();e.component.option('dataSource',itemData);if(this.requiredField(item)){await this.mylsObject.dataSource.load();if(itemData.length>0){if(e.component.option('value')==null){e.component.option('value',itemData[0][item.dataField]);}
e.component.option('value',itemData[0][item.dataField]);}
this.mylsObject.object.endUpdate();}else{e.component.option('showClearButton',true);this.mylsObject.object.endUpdate();}}}
setEnabledToolbar(){const curId=this.mylsObject.getCurrentId();const focused=curId==0||curId===undefined?false:true;const element=this.mylsObject.object.element();$.each(element.find('[toolbarrole=always]'),function(index,item){$(item).dxButton("instance").option("disabled",false);});$.each(element.find('[toolbarrole=focused]'),function(index,item){$(item).dxButton("instance").option("disabled",!focused);});}
destroy(){this.mylsObject=null;this.object=null;app.destroyArray(this.items);}};;class Dialog{constructor(){}
async custom(text,title,params,addClass='myls-msg-info'){return new Promise((resolve,reject)=>{const $popupContainer=$("<div />").addClass("popup "+addClass).appendTo($("#popup_error"));let buttons=[{location:"after"}];$.each(params,function(index,value){buttons.push({widget:"dxButton",toolbar:"bottom",location:"center",options:{text:value.text,type:value.type,stylingMode:"outlined",tabIndex:value.tabIndex,onClick:function(e){customPopup.hide();resolve(value.result===undefined?true:value.result);}}});});const customPopup=$popupContainer.dxPopup(this.getOptions(title,text,buttons)).dxPopup("instance");customPopup.show();});}
getOptions(title,message,items){return{width:"auto",height:"auto",maxWidth:app.appInfo.device.deviceType=='phone'?"90%":"50%",maxHeight:app.appInfo.device.deviceType=='phone'?"90%":"50%",contentTemplate:function(){return $("<div />").append($('<p>'+message.toString()+'</p>'));},toolbarItems:items,showTitle:true,title:title,visible:false,dragEnabled:app.appInfo.device.deviceType=='phone'?false:true,closeOnOutsideClick:true,showCloseButton:false,};}
showError(idn,error){if(idn){app.closeLoadPanel(idn);}
return this.custom(error,app.translate.saveString('Ошибка'),[{text:app.translate.saveString('OK'),type:'success'}],'myls-msg-error');}
showWarning(idn,message){if(idn){app.closeLoadPanel(idn);}
return this.custom(message,app.translate.saveString('Предупреждение'),[{text:app.translate.saveString('OK'),type:'success'}],'myls-msg-warning');}
showInfo(idn,message){if(idn){app.closeLoadPanel(idn);}
return this.custom(message,app.translate.saveString('Информация'),[{text:app.translate.saveString('OK'),type:'success'}],'myls-msg-info');}
confirm(idn,message,title=app.translate.saveString('Подтверждение'),textBtnYes=app.translate.saveString('Да'),textBtnNo=app.translate.saveString('Нет'),addClass='myls-msg-info'){if(idn){app.closeLoadPanel(idn);}
return this.custom(message,title,[{text:textBtnYes,type:'success',tabIndex:1,result:true},{text:textBtnNo,type:'default',tabIndex:2,result:false}],addClass);}
destroy(){}};;class ProgressBar{constructor(object){this.mylsObject=object;}
init(max,locked=true){if(this.object){this.object.option("max",max);}else{this.pbId=this.mylsObject.idn+'_progressbar';$('#'+this.mylsObject.idn).after('<div id="'+this.pbId+'"/>');let inProgress=true;this.mylsObject.lockObject(locked);const self=this;this.object=$('#'+this.pbId).dxProgressBar({min:0,max:max,value:0,visible:true,showStatus:false,width:"400px",maxWidth:"50%",elementAttr:{class:"dx-loadpanel-content myls-center-screen",},onComplete:function(e){self.mylsObject.lockObject();self.mylsObject.refresh();self.remove();},}).dxProgressBar("instance");$("#"+this.pbId).css('z-index','100');}}
step(){this.object.option('value',this.object.option('value')+1);}
position(value){this.object.option('value',value);}
show(){}
hide(){}
remove(){if(this.object)
this.object.dispose();$('#'+this.pbId).remove();this.object=null;}
destroy(){this.mylsObject=null;this.object=null;}};;class Filter{constructor(object){this.currentFilter=[];this.table=object.table;this.ext_id=object.ext_id;this.view=object.view;this.type=object.type;this.mode=object.mode;this.tHistory=object.tHistory;this.selParams=object.selParams;this.mylsObject=object;this.resultArray=[];this.filterObjects=[];this.filter=[];}
init(e){this.button=e;this.allTableData=[];this.cols=this.mylsObject.columns.getFilterColumns();this.dateArray=this.getDateArray();this.arrMonth=[app.translate.saveString('Январь'),app.translate.saveString('Февраль'),app.translate.saveString('Март'),app.translate.saveString('Апрель'),app.translate.saveString('Май'),app.translate.saveString('Июнь'),app.translate.saveString('Июль'),app.translate.saveString('Август'),app.translate.saveString('Сентябрь'),app.translate.saveString('Октябрь'),app.translate.saveString('Ноябрь'),app.translate.saveString('Декабрь')];this.arrQuarter=[app.translate.saveString('I квартал'),app.translate.saveString('II квартал'),app.translate.saveString('III квартал'),app.translate.saveString('IV квартал')];this.createPopupContainer();this.createScrollContainer();this.createDefaultFilter();this.openFilter();}
async processFilter(){const self=this;this.filter=[];$.each(this.filterObjects,function(index,elem){const checkBox=$('#'+elem.widget.element().attr('id')+'_checkbox').dxCheckBox('instance');if(checkBox.option('value')){if(elem.radio.option('value')){let term='=';if(elem.radio.option('value')==1){self.processNoEmpty(elem);}
if(elem.radio.option('value')==2){term='is distinct from';}
if(elem.radio.option('value')==3){self.processContains(elem,self.filter);}
if(elem.widget.NAME=='dxTagBox'){self.processTagBox(elem,term,self.filter);}
if(elem.widget.NAME=='dxRangeSelector'){self.processRangeSelector(elem);}
if(elem.widget.NAME=='dxSelectBox'){self.processSelectBox(elem);}
if(elem.widget.NAME=='dxSwitch'){self.processSwitch(elem);}}else{self.processEmpty(elem);}}});if(this.filter.length==0){this.filter=null;}
if(this.filter==null){this.button.element.removeClass('myls-filter-active');}else{this.button.element.addClass('myls-filter-active');}
console.log(this.filter);if(this.filter!==null){}
this.mylsObject.dataSource.mylsFilter=this.filter;this.mylsObject.refresh();this.popup.hide();}
async processDefaultFilter(){this.filter=$('#'+this.mylsObject.idn+'_mylsFilter').dxFilterBuilder('instance').getFilterExpression();if(this.filter.length==0){this.filter=null;}
if(this.filter==null){this.button.element.removeClass('myls-filter-active');}else{this.button.element.addClass('myls-filter-active');}
this.mylsObject.dataSource.mylsFilter=this.filter;this.mylsObject.refresh();this.popup.hide();}
processEmpty(elem){let out=[];out.push([elem.column.dataField,'is',null]);if(out.length>0){if(filter.length>0){filter.push('and');}
filter.push(out);}}
processSwitch(elem){let out=[];out.push([elem.column.dataField,'=',elem.widget.option('value')?1:0]);if(out.length>0){if(this.filter.length>0){this.filter.push('and');}
this.filter.push(out);}}
processSelectBox(elem){if(elem.widget.option('value')!=null&&elem.widget.option('value')!=undefined){if(Object.keys(elem.widget.option('value')).length>0){let out=[];sessionStorage.setItem(elem.column.dataField,elem.widget.option('value').id);if(elem.widget.option('value').start!=undefined)
out.push([elem.column.dataField,'>=',DevExpress.localization.formatDate(elem.widget.option('value').start,'yyyy-MM-dd')]);if(elem.widget.option('value').start!=undefined&&elem.widget.option('value').end!=undefined)
out.push('and');if(elem.widget.option('value').end!=undefined)
out.push([elem.column.dataField,'<=',DevExpress.localization.formatDate(elem.widget.option('value').end,'yyyy-MM-dd')]);if(out.length>0){if(this.filter.length>0){this.filter.push('and');}
this.filter.push(out);}}}}
processRangeSelector(elem){if(elem.widget.option('value').length>0){let out=[];out.push([elem.column.dataField,'>=',elem.widget.option('value')[0]]);out.push('and');out.push([elem.column.dataField,'<=',elem.widget.option('value')[1]]);if(out.length>0){if(this.filter.length>0){this.filter.push('and');}
this.filter.push(out);}}}
processTagBox(elem,term){if(elem.widget.option('value').length>0){let out=[];$.each(elem.widget.option('value'),function(index,arr){if(out.length>0){if(term=='=')
out.push('or');else
out.push('and');}
if(elem.column.dataType=='tagbox')
out.push([[elem.column.dataField,'like',arr+'%,'],'or',[elem.column.dataField,'like',', %'+arr],'or',[elem.column.dataField,'containing',', '+arr+','],'or',[elem.column.dataField,'=',arr]]);else if(term=='containing')
out.push([elem.column.dataField.toLowerCase(),term,arr]);else
out.push([elem.column.dataField,term,arr]);});if(out.length>0){if(this.filter.length>0){this.filter.push('and');}
this.filter.push(out);}}}
processContains(elem){if(elem.option('value')){let out=[];out.push([elem.column.dataField.toLowerCase(),'containing',elem.option('value')]);if(out.length>0){if(this.filter.length>0){this.filter.push('and');}
this.filter.push(out);}}}
processNoEmpty(elem){let out=[];out.push([elem.column.dataField,'is not',null]);if(out.length>0){if(this.filter.length>0){this.filter.push('and');}
this.filter.push(out);}}
getPopupOptions(){const self=this;let toolbarItems=[{location:"after"}];toolbarItems.push(this.getButtonApply());toolbarItems.push(this.getButtonClear());toolbarItems.push(this.getButtonCancel());toolbarItems.push(this.getButtonClose());return{title:app.translate.saveString("Фильтр"),width:"700px",height:"75%",showCloseButton:false,toolbarItems:toolbarItems}}
getButtonApply(){const self=this;return{widget:"dxButton",toolbar:"bottom",location:"center",options:{text:app.translate.saveString("Применить"),type:"success",stylingMode:"outlined",onClick:function(e2){self.processDefaultFilter();}}}}
getButtonClear(){const self=this;return{widget:"dxButton",toolbar:"bottom",location:"center",options:{text:app.translate.saveString("Очистить"),type:"clear",stylingMode:"outlined",onClick:async function(e2){self.clearDefaultFilter();}}}}
clearFilter(){$.each(this.filterObjects,function(index,elem){if(elem.widget.NAME=='dxRangeSelector'){elem.widget.option('value',[]);}else if(elem.widget.NAME=='dxSwitch'){elem.widget.option('value',false);}else{elem.widget.option('value','');}
sessionStorage.removeItem(elem.column.dataField);});this.mylsObject.dataSource.mylsFilter=null;this.button.element.removeClass('myls-filter-active');this.mylsObject.refresh();this.popup.hide();}
clearDefaultFilter(){this.mylsObject.dataSource.mylsFilter=null;this.filter=null;this.button.element.removeClass('myls-filter-active');this.mylsObject.refresh();this.popup.hide();}
getButtonCancel(){const self=this;return{widget:"dxButton",toolbar:"bottom",location:"center",options:{text:app.translate.saveString("Закрыть"),type:"cancel",stylingMode:"outlined",onClick:function(e2){self.popup.hide();}}}}
getButtonClose(){const self=this;return{widget:"dxButton",toolbar:"top",location:"after",options:{icon:"close",type:"normal",stylingMode:"text",elementAttr:{id:this.mylsObject.idn+'_close-button',class:"myls-close-btn"},onClick:function(e){self.popup.hide();}}}}
openFilter(){this.popup=$('#'+this.mylsObject.idn+'_popupContainer').dxPopup(this.getPopupOptions()).dxPopup("instance");this.popup.show();}
createPopupContainer(){if($('#'+this.mylsObject.idn+'_popupContainer').length===0){$("#"+this.mylsObject.idn).append('<div id="'+this.mylsObject.idn+'_popupContainer"><div id="'+this.mylsObject.idn+'_scrollView"><div class="myls-filters"></div></div></div>');}}
createScrollContainer(){$('#'+this.mylsObject.idn+'_scrollView').dxScrollView({scrollByContent:true,scrollByThumb:true,showScrollbar:"onScroll",}).dxScrollView("instance");}
createFilter(){const self=this;let idx;$.each(this.cols,function(index,item){let itemData=[];if(item.dataType=='string'||item.dataType=='tagbox'){idx=self.createFilterElement(item,'tagbox',false);}
if(item.dataType=='number'){idx=self.createFilterElement(item,'range',true);}
if(item.dataType=='date'){idx=self.createFilterElement(item,'date',true);}
if(item.dataType=='color'){idx=self.createFilterElement(item,'tagbox',false,'myls-filter-color');}
if(item.dataType=='boolean'){idx=self.createFilterElement(item,'switch',false);if(!self.issetFilterObject(item)){self.filterObjects.push({'column':item,'widget':$("#"+idx).dxSwitch({}).dxSwitch('instance'),'radio':$('#'+idx+'_radio').dxRadioGroup('instance'),});}}});}
createDefaultFilter(){const $filter='<div id="'+this.mylsObject.idn+'_mylsFilter"></div>';$('#'+this.mylsObject.idn+'_popupContainer .myls-filters').append($filter);$('#'+this.mylsObject.idn+'_mylsFilter').dxFilterBuilder({fields:this.cols,value:this.filter});}
createFilterElement(item,type,addFields,addClass){const idx=this.mylsObject.idn+'_'+item.dataField+'_'+type;if($('#'+idx+'_label').length==0){const $filter=$('<div class="myls-filter d-flex"><div id="'+idx+'_checkbox" class="myls-left-col"></div><div class="myls-right-col"></div></div>');$('.myls-right-col',$filter).append('<div id="'+idx+'_label" class="myls-filter-label">'+app.translate.saveString(item.caption)+'</div><div id="'+idx+'_radio" class="myls-filter-radio"></div><div id="'+idx+'" class="myls-filter-field '+addClass+'"></div>');if(addFields){$('.myls-right-col',$filter).append('<div class="myls-filter-block d-flex"><div id="'+idx+'_start" class="myls-filter-field"></div><div id="'+idx+'_end" class="myls-filter-field"></div></div>');}
$('#'+this.mylsObject.idn+'_popupContainer .myls-filters').append($filter);if(type=='range'){$("#"+idx).css('height','80px');}
this.addfilterCheckbox(idx,item);this.addfilterRadio(idx,item);}
return idx;}
checkboxValueChanged(idx,item,data){let radioGroup=$('#'+idx+'_radio').dxRadioGroup('instance');if(data.value){radioGroup.option('visible',true);if(radioGroup.option('value')==null)
radioGroup.option('value',1);data.element.closest('.myls-filter').addClass('active');if(item.dataType=='string'||item.dataType=='tagbox'){this.getStringFilter(idx,item);}
if(item.dataType=='color'){this.getColorFilter(idx,item);}
if(item.dataType=='number'){this.getNumberFilter(idx,item);}
if(item.dataType=='date'){this.getDateFilter(idx,item);}}else{radioGroup.option('visible',false);data.element.closest('.myls-filter').removeClass('active');}}
addfilterCheckbox(idx,item){const self=this;$('#'+idx+'_checkbox').dxCheckBox({value:false,onValueChanged:function(data){self.checkboxValueChanged(idx,item,data);}}).dxCheckBox('instance');}
radioValueChanged(idx,data){if(data.value){data.element.closest('.myls-filter').addClass('active');}else{data.element.closest('.myls-filter').removeClass('active');}
if(data.value==3){if($('#'+idx+'_contain').length==0){$('#'+idx).before('<div id="'+idx+'_contain" class="myls-filter-field"></div>');$('#'+idx+'_contain').dxTextBox({placeholder:app.translate.saveString("ведите текст...")}).dxTextBox('instance');}else{$('#'+idx+'_contain').show();}
$("#"+idx).hide();}else{$('#'+idx+'_contain').hide();$("#"+idx).show();}}
addfilterRadio(idx,item){const self=this;let radioItems=[{id:0,text:app.translate.saveString('Пустое'),},{id:1,text:app.translate.saveString('Не пустое'),}];if(item.dataType=='string'){radioItems.push({id:2,text:app.translate.saveString('Кроме'),});radioItems.push({id:3,text:app.translate.saveString('Содержит'),});}
if(item.dataType=='color'){radioItems.push({id:2,text:app.translate.saveString('Кроме'),});}
$('#'+idx+'_radio').dxRadioGroup({dataSource:radioItems,valueExpr:'id',displayExpr:'text',layout:"horizontal",visible:false,onValueChanged:function(data){self.radioValueChanged(idx,data);}}).dxRadioGroup("instance");}
async getFilterData(item){if(!this.allTableData[item.dataField]){let url='frame/get-filter-string-data';if(item.dataType=='number'){url='frame/get-filter-number-data';}
if(item.dataType=='date'){url='frame/get-filter-string-data';}
let itemData=await app.processData(url,'post',{table:this.table,field:item.dataField,extId:this.ext_id,selParams:this.selParams});this.allTableData[item.dataField]=itemData;}}
async getStringFilter(idx,item){await this.getFilterData(item);const dataAll=this.allTableData[item.dataField];if(!this.issetFilterObject(item)){this.filterObjects.push({'column':item,'widget':$("#"+idx).dxTagBox({dataSource:dataAll,displayExpr:item.dataField,valueExpr:item.dataField,searchEnabled:true,showSelectionControls:true,}).dxTagBox('instance'),'radio':$('#'+idx+'_radio').dxRadioGroup('instance'),'text':$('#'+idx+'_contain').dxTextBox('instance'),});}}
async getColorFilter(idx,item){await this.getFilterData(item);let dataAll=this.allTableData[item.dataField];app.removeNullFromArray(dataAll);dataAll=app.removeEmptyFromArray(dataAll);if(!this.issetFilterObject(item)){this.filterObjects.push({'column':item,'widget':$("#"+idx).dxTagBox(this.getTagBoxOptions(dataAll,item)).dxTagBox('instance'),'radio':$('#'+idx+'_radio').dxRadioGroup('instance'),});}}
getTagBoxOptions(dataAll,item){return{dataSource:dataAll,displayExpr:item.dataField,valueExpr:item.dataField,searchEnabled:false,showSelectionControls:true,itemTemplate:function(tagData){if(tagData[item.dataField]!=null){if(tagData[item.dataField].charAt(0)=='#')
return"<div style='width: 20px; height: 20px; background-color: "+tagData[item.dataField]+"'></div>";else
return"<div style='width: 20px; height: 20px;'>"+tagData[item.dataField]+"</div>";}},tagTemplate:function(tagData){if(tagData[item.dataField]!=null){if(tagData[item.dataField].charAt(0)=='#')
return"<div style='width: 20px; height: 20px; background-color: "+tagData[item.dataField]+"'></div>";else
return"<div style='height: 20px;'>"+tagData[item.dataField]+"</div>";}}};}
async getNumberFilter(idx,item){let startObj;let endObj;await this.getFilterData(item);let allData=this.allTableData[item.dataField][0];if(!this.issetFilterObject(item)){this.filterObjects.push({'column':item,'widget':$("#"+idx).dxRangeSelector(this.getRangeSelectorOptions(allData,idx)).dxRangeSelector('instance'),'radio':$('#'+idx+'_radio').dxRadioGroup('instance'),});startObj=this.createStartObject(allData,idx);endObj=this.createEndObject(allData,idx);}else{startObj=$("#"+idx+'_start').dxNumberBox("instance");endObj=$("#"+idx+'_end').dxNumberBox("instance");}
if(item.format.precision!==undefined&&item.format.precision!="0"){var format='#,##0';format+='.'+'0'.repeat(item.format.precision);startObj.option('format',format);endObj.option('format',format);}
if(item.format.precision===undefined||item.format.precision=="0"){var format='#,##0';startObj.option('format',format);endObj.option('format',format);}}
createStartObject(allData,idx){return $("#"+idx+'_start').dxNumberBox({value:parseFloat(allData.min),showSpinButtons:true,onValueChanged:function(data){let sliderObj=$("#"+idx).dxRangeSelector('instance');sliderObj.option('value',[data.value,sliderObj.option('value')[1]]);}}).dxNumberBox("instance");}
createEndObject(allData,idx){return $("#"+idx+'_end').dxNumberBox({value:parseFloat(allData.max),showSpinButtons:true,onValueChanged:function(data){let sliderObj=$("#"+idx).dxRangeSelector('instance');sliderObj.option('value',[sliderObj.option('value')[0],data.value]);}}).dxNumberBox("instance");}
getRangeSelectorOptions(allData,idx){return{scale:{startValue:parseFloat(allData.min),endValue:parseFloat(allData.max),minorTick:{visible:false,},},size:{width:617},onValueChanged:function(data){let start=$("#"+idx+'_start').dxNumberBox('instance');let end=$("#"+idx+'_end').dxNumberBox('instance');start.option('value',data.value[0]);end.option('value',data.value[1]);}}}
addMonthYear(addMonth,item){const self=this;if(addMonth.length>0){addMonth=app.arrayUnique(addMonth.sort());let nn=this.resultArray[item.dataField].length;$.each(addMonth,function(ind,arr){let newDate=new Date(arr);++nn;self.resultArray[item.dataField].push({'id':nn,'name':self.arrMonth[newDate.getMonth()]+' '+newDate.getFullYear(),'start':newDate,'end':new Date(newDate.getFullYear(),newDate.getMonth()+1,0,23,59,59)});});}}
addQuarterYear(addQuarter,item){const self=this;if(addQuarter.length>0){addQuarter=app.arrayUnique(addQuarter.sort());let nn=this.resultArray[item.dataField].length;$.each(addQuarter,function(ind,arr){let newDate=new Date(arr);const quarter=Math.floor(newDate.getMonth()/ 3);++nn;self.resultArray[item.dataField].push({'id':nn,'name':self.arrQuarter[quarter]+' '+newDate.getFullYear(),'start':newDate,'end':new Date(newDate.getFullYear(),newDate.getMonth()+3,0,23,59,59)});});}}
addYears(addYear,item){const self=this;if(addYear.length>0){addYear=app.arrayUnique(addYear.sort());let nn=this.resultArray[item.dataField].length;$.each(addYear,function(ind,arr){let newDate=new Date(arr);++nn;self.resultArray[item.dataField].push({'id':nn,'name':newDate.getFullYear(),'start':newDate,'end':new Date(newDate.getFullYear()+1,0,0,23,59,59)});});}}
async getDateFilter(idx,item){const self=this;await this.getFilterData(item);let dataAll=this.allTableData[item.dataField];this.resultArray[item.dataField]=this.dateArray.slice(0);let addMonth=[];let addQuarter=[];let addYear=[];$.each(dataAll,function(i,a){if(a!=null){let date=new Date(a[item.dataField]);addMonth.push(new Date(date.getFullYear(),date.getMonth(),1).getTime());const quarter=3*Math.floor(date.getMonth()/ 3);addQuarter.push(new Date(date.getFullYear(),quarter,1).getTime());addYear.push(new Date(date.getFullYear(),1,1).getTime());}});self.addMonthYear(addMonth,item);self.addQuarterYear(addQuarter,item);self.addYears(addYear,item);let currValue=sessionStorage.getItem(item.dataField);let lastValue=null;if(currValue!=null){lastValue=self.resultArray[item.dataField][currValue];}
if(!this.issetFilterObject(item)){this.filterObjects.push({'column':item,'widget':$("#"+idx).dxSelectBox(this.getSelectBoxOptions(lastValue,idx,item)).dxSelectBox('instance'),'radio':$('#'+idx+'_radio').dxRadioGroup('instance'),});this.createStartDataBox(idx,item);this.createEndDataBox(idx,item);}}
createStartDataBox(idx,item){const self=this;$("#"+idx+'_start').dxDateBox({displayFormat:"shortdate",type:"date",readOnly:true,showClearButton:true,buttons:["clear","dropDown"],onValueChanged:function(data){$.each(self.resultArray[item.dataField],function(index,arr){if(arr.id==0){arr.start=data.value;return false;}});}}).dxDateBox('instance');}
createEndDataBox(idx,item){const self=this;$("#"+idx+'_end').dxDateBox({displayFormat:"shortdate",type:"date",readOnly:true,showClearButton:true,buttons:["clear","dropDown"],onValueChanged:function(data){$.each(self.resultArray[item.dataField],function(index,arr){if(arr.id==0){arr.end=data.value;return false;}});}}).dxDateBox('instance');}
getSelectBoxOptions(lastValue,idx,item){return{dataSource:this.resultArray[item.dataField],displayExpr:"name",keyExpr:"id",value:lastValue,onValueChanged:function(data){if(data.value!=null){let startObj=$("#"+idx+'_start').dxDateBox('instance');let endObj=$("#"+idx+'_end').dxDateBox('instance');startObj.option('value',data.value.start);endObj.option('value',data.value.end);if(data.value.id==0){startObj.option('readOnly',false);endObj.option('readOnly',false);}else{startObj.option('readOnly',true);endObj.option('readOnly',true);}}},}}
issetFilterObject(column){let result=false;for(let i=0;i<this.filterObjects.length;i++){if(this.filterObjects[i].column.dataField==column.dataField){result=true;break;}}
return result;}
getCurrentWeek(){let fdWeek=new Date();let cdWeek=new Date();let dia=fdWeek.getDay();if(dia==0)
dia=7;let prevWeekEnd=new Date();prevWeekEnd.setTime(fdWeek.setUTCHours(-((dia)*24)));let prevWeekStart=new Date();prevWeekStart.setTime(fdWeek.setUTCHours(-((dia+6)*24)));let currWeekStart=new Date();currWeekStart.setTime(cdWeek.setUTCHours(-((dia-1)*24)));let currWeekEnd=new Date();currWeekEnd.setTime(cdWeek.setUTCHours((8-dia)*24));const out={prevWeekEnd:prevWeekEnd,prevWeekStart:prevWeekStart,currWeekStart:currWeekStart,currWeekEnd:currWeekEnd};return out;}
getCurrentMonth(){let fdMonth=new Date();const year=fdMonth.getFullYear();const month=fdMonth.getMonth();const startCurrMonth=new Date(year,month,1);const endCurrMonth=new Date(year,month+1,0,23,59,59);const startPrevMonth=new Date(year,month-1,1);const endPrevMonth=new Date(year,month,0,23,59,59);const out={startCurrMonth:startCurrMonth,endCurrMonth:endCurrMonth,startPrevMonth:startPrevMonth,endPrevMonth:endPrevMonth};return out;}
getCurrentYear(){let fdYear=new Date();const year=fdYear.getFullYear();const startCurrYear=new Date(year,0,1);const endCurrYear=new Date(year+1,0,0,23,59,59);const startPrevYear=new Date(year-1,0,1);const endPrevYear=new Date(year,0,0,23,59,59);const out={startCurrYear:startCurrYear,endCurrYear:endCurrYear,startPrevYear:startPrevYear,endPrevYear:endPrevYear};return out;}
getCurrentQuarter(){let fdQuarter=new Date();const year=fdQuarter.getFullYear();const month=fdQuarter.getMonth();const quarter=3*Math.floor(month / 3);const startCurrQuarter=new Date(year,quarter,1);const endCurrQuarter=new Date(year,quarter+3,0,23,59,59);const startPrevQuarter=new Date(year,quarter-3,1);const endPrevQuarter=new Date(year,quarter,0,23,59,59);const out={startCurrQuarter:startCurrQuarter,endCurrQuarter:endCurrQuarter,startPrevQuarter:startPrevQuarter,endPrevQuarter:endPrevQuarter};return out;}
getDateArray(){const now=new Date();const month=this.getCurrentMonth();const week=this.getCurrentWeek();const year=this.getCurrentYear();const quarter=this.getCurrentQuarter();return[{'id':0,'name':app.translate.saveString("Выбрать период"),'start':now,'end':now},{'id':1,'name':app.translate.saveString("Сегодня"),'start':new Date(now.getFullYear(),now.getMonth(),now.getDate()),'end':new Date(now.getFullYear(),now.getMonth(),now.getDate(),23,59,59)},{'id':2,'name':app.translate.saveString("Вчера"),'start':new Date(now.getFullYear(),now.getMonth(),now.getDate()-1),'end':new Date(now.getFullYear(),now.getMonth(),now.getDate()-1,23,59,59)},{'id':3,'name':app.translate.saveString("Эта неделя"),'start':week.currWeekStart,'end':week.currWeekEnd},{'id':4,'name':app.translate.saveString("Прошлая неделя"),'start':week.prevWeekStart,'end':week.prevWeekEnd},{'id':5,'name':app.translate.saveString("Этот месяц"),'start':month.startCurrMonth,'end':month.endCurrMonth},{'id':6,'name':app.translate.saveString("Прошлый месяц"),'start':month.startPrevMonth,'end':month.endPrevMonth},{'id':7,'name':app.translate.saveString("Этот квартал"),'start':quarter.startCurrQuarter,'end':quarter.endCurrQuarter},{'id':8,'name':app.translate.saveString("Прошлый квартал"),'start':quarter.startPrevQuarter,'end':quarter.endPrevQuarter},{'id':9,'name':app.translate.saveString("Этот год"),'start':year.startCurrYear,'end':year.endCurrYear},{'id':10,'name':app.translate.saveString("Прошлый год"),'start':year.startPrevYear,'end':year.endPrevYear}];}
destroy(){app.destroyArray(this.mylsObject);app.destroyArray(this.resultArray);app.destroyArray(this.filterObjects);app.destroyArray(this.allTableData);app.destroyArray(this.cols);app.destroyArray(this.dateArray);this.popup=null;}};;class Cards extends MylsEditableObject{constructor(table,ext_id,view,mode,tHistory,viewMode,params){super(table,ext_id,view,mode,tHistory,viewMode,params);this.type='cards';this.object={};}
async init(){const self=this;await super.init();this.dataSource.load();this.searchExpr=this.columns.getUsedFields(this.template,['title','subtitle','text']);this.createObject();const positionColumn=this.columns.getColumnsByColumnType('position',true);$("#"+this.idn).data('mylsObject',this);this.toolbar.init();this.contextMenu=new ContextMenu(this);this.contextMenu.init(this.contextMenuData,'#'+this.idn+' .dx-scrollview-content');this.afterInit();}
getOptions(){const self=this;return{dataSource:this.dataSource,pullRefreshEnabled:false,selectionMode:"single",searchEnabled:true,searchExpr:this.searchExpr,searchMode:'contains',noDataText:app.translate.saveString('Пока в этом разделе нет данных. Чтобы внести информацию, воспользуйтесь кнопкой "Добавить"'),onContentReady:function(e){self.contentReady(e);},onSelectionChanged:function(e){self.selectionChanged(e);},onItemClick:function(e){self.dblClick();},itemTemplate:function(data){return self.getItemTemplate(data);},onItemContextMenu:function(e){self.getItemContextMenu(e);},};}
addMultiView(template,info){const self=this;let $tplm=$('<div data-dir="m"></div>');let $template=$(template);let $block=$('[data-dir="m"]',$template);if($block!=undefined){let items=[];$.each($block.children('div'),function(index,el){items.push({"html":el.innerHTML});});let id=this.idn+'_multiview-container_'+info.id;$block.attr("id",id);$block.empty();let multiView=$('#'+id,$template).dxMultiView(this.getMultiViewOptions(items)).dxMultiView("instance");if(items.length>1){$block.append('<div class="myls-mv-buttons d-flex justify-content-center"></div>');$.each(items,function(index,item){$('.myls-mv-buttons',$block).append('<i id="'+id+'_'+index+'" class="myls-mv-button"/>');$(document.body).on('click','#'+id+'_'+index,function(e){self.activateMultiView(id,index,multiView);});});$('.myls-mv-button:first-child',$block).addClass('active');}
template=$template.get(0);}
return template;}
activateMultiView(id,index,multiView){$('#'+id+' .myls-mv-button').removeClass('active');$('#'+id+'_'+index).addClass('active');multiView.option('selectedIndex',index);}
getMultiViewOptions(items){return{height:"auto",deferRendering:false,selectedIndex:0,loop:false,animationEnabled:true,swipeEnabled:true,items:items,onSelectionChanged:function(e){$('#'+id+' .myls-mv-button').removeClass('active');$('#'+id+' .myls-mv-button:nth-child('+(e.component.option('selectedIndex')+1)+')').addClass('active');},};}
createObject(){this.object=$("#"+this.idn).dxList(this.getOptions()).dxList('instance');app.objects[this.idn]=this;}
resizeCards(item){var width=$(item).width();for(var i=12;i>0;i--){if(width>=250*i){$(item).find(".dx-list-item").css('max-width',width / i+'px');break;}}}
contentReady(e){$("#"+this.idn+" .dx-list-item").addClass("col d-flex align-items-stretch");$("#"+this.idn+" .dx-list-item-content").addClass("d-block");$("#"+this.idn+" .dx-scrollview-content").addClass("card-view d-flex align-items-stretch flex-wrap");this.resizeCards($("#"+this.idn));super.contentReady(e);$('#'+this.idn+'_totalCount').text(app.translate.saveString("Всего записей:")+' '+e.component.option('items').length);if(e.component.option('items').length>0&&e.component.option('selectedItems').length==0){e.component.selectItem(0);}}
selectionChanged(e){this.toolbar.setEnabledToolbar();}
getItemTemplate(data){if(this.template&&this.template.length!=0){let item=[];item.template='<div data-dir="v" class="card" data-id="'+data.id+'">'+this.template+'</div>';item.dataType='block';let template=this.columns.getFormattedCellValue('',item,data);template=this.addMultiView(template,data);return template;}else{return this.getDefaultTemplate(data);}}
getDefaultTemplate(data){let result=$("<div>").addClass("card").attr('data-id',data.id);let item=this.columns.getItemValueByColumnType("image",data);if(item!=""&&item!=null)
$(item).addClass("card-img-top").appendTo(result);let card=$('<div>').addClass("card-body").appendTo(result);item=this.columns.getItemValueByColumnType("title",data);if(item!=""&&item!=null)
$('<h4>').addClass("card-title").html(item).appendTo(card);item=this.columns.getItemValueByColumnType("subtitle",data);if(item!=""&&item!=null)
$('<h5>').addClass("card-subtitle").html(item).appendTo(card);item=this.columns.getItemValueByColumnType("text",data);if(item!=""&&item!=null)
$('<p>').addClass("card-text").html(item).appendTo(card);return result;}
getItemContextMenu(e){if(e.itemData!==undefined)
this.contextMenu.show(e.itemData.id,e.itemData);}
getCurrentId(){return this.object.option('selectedItemKeys')[0];}
getSelectedRows(){return this.object.option('selectedItemKeys');}
async refresh(changesOnly=true,useLoadPanel=true){try{await this.dataSource.reload();}catch(error){console.log(error);}
this.toolbar.setEnabledToolbar();this.changed();}
destroy(){super.destroy();$("#"+this.idn).data('mylsObject',null);app.destroyArray(this.searchExpr);this.close();}};;class Grid extends MylsEditableObject{constructor(table,ext_id,view,mode,tHistory,viewMode,params){super(table,ext_id,view,mode,tHistory,viewMode,params);this.type='grid';this.masterDetail={};}
async init(){const self=this;await super.init();this.columns.processCellTemplates();await this.dataSource.load();this.curState=JSON.stringify({});this.isReadField=this.columns.getColumnsByColumnType("is_read",true);this.createMasterDetail();this.usedColumns=this.columns.getUsedColumns();this.usedColumns.__lastColumn__={width:"auto",cssClass:'last-column',visibleIndex:100000,cellTemplate:function(container){}};this.createObject();$("#"+this.idn).data('mylsObject',this);this.contextMenu=new ContextMenu(this);this.contextMenu.init(this.contextMenuData,'#'+this.idn+' .dx-datagrid-content');this.initBottomToolbar();this.afterInit();}
createObject(){this.object=$("#"+this.idn).dxDataGrid(this.getOptions()).dxDataGrid('instance');}
getOptions(){const self=this;return{dataSource:this.dataSource,columns:this.columns.getColumnsForGrid(),summary:{totalItems:this.columns.summary,},sorting:{mode:"multiple"},editing:{refreshMode:"reshape",selectTextOnEditStart:true,startEditAction:"click",useIcons:true},scrolling:{mode:"virtual",rowRenderingMode:"virtual",preloadEnabled:true,showScrollbar:"always",},focusedRowEnabled:true,focusedRowIndex:0,headerFilter:{visible:true,allowSearch:true,dataSource:function(data){console.log(data);}},selection:{mode:"multiple",showCheckBoxesMode:"always",},renderAsync:false,export:{enabled:true,fileName:app.appInfo.tables[this.table].name,allowExportSelectedData:false,customizeExcelCell:function(options){self.customizeExcelCell(options);}},repaintChangesOnly:true,searchPanel:{visible:app.appInfo.device.deviceType=='phone'?false:true},wordWrapEnabled:true,showColumnLines:true,showRowLines:false,rowAlternationEnabled:true,columnResizingMode:'widget',allowColumnResizing:true,allowColumnReordering:true,columnAutoWidth:false,dateSerializationFormat:"yyyy-MM-ddTHH:mm:ssx",loadPanel:{enabled:false},canFinishEdit:true,columnChooser:{enabled:true},onContentReady:function(e){self.gridContentReady(e);},onContextMenuPreparing:function(e){if(e.row!==undefined)
self.contextMenu.show(e.row.key,e.row.data);},onRowDblClick:function(e){e.event.stopPropagation();self.processDblClick(e);},onToolbarPreparing:function(e){self.toolbar.init(e);},onExporting:function(e){e.component.beginUpdate();self.columns.setColumnsByTypeVisible(e.component,'image',false);},onExported:function(e){self.columns.setColumnsByTypeVisible(e.component,'image',true);e.component.endUpdate();},onRowValidating:function(e){if(!e.isValid)e.component.canFinishEdit=false;},onDataErrorOccurred:function(e){e.component.canFinishEdit=false;},onSelectionChanged:function(e){self.selectionChanged(e);},stateStoring:{enabled:true,type:"custom",savingTimeout:500,customLoad:function(){const data=app.appInfo.setting[self.table];if(data&&data.columns){let columns=[];$.each(data.columns,function(index,item){if(item){if(!item['width']){item['width']=100;}
if(!item['dataField']){item.visibleIndex=10000;columns.push(item);}else if(self.usedColumns[item.dataField]&&self.usedColumns[item.dataField].visible){columns.push(item);}}});data.columns=columns;}
return data;},customSave:function(state){self.customSave(state);}},masterDetail:this.masterDetail,onEditorPreparing:function(e){self.editorPreparing(e);},onRowPrepared:function(e){self.rowPrepared(e);if(e.data!==undefined)
e.rowElement.attr('data-id',e.data.id);},onFocusedRowChanged:function(e){self.focusedRowChanged(e);self.toolbar.setEnabledToolbar();},};}
focusedRowChanged(e){this.setReadToRow(e);if(e.row&&e.row.rowType=='data'&&e.row.data.hasOwnProperty('id')){this.showId(e.row.data.id);}}
setReadToRow(e){if(this.isReadField&&e.row&&e.row.rowType=='data'&&!e.row.data[this.isReadField.dataField]){let store=this.object.getDataSource().store();let data={};data[this.isReadField.dataField]=1;store.push([{type:"update",data:data,key:e.row.data['id']}]);let params={};params.table=this.table;params.ext_id=e.row.data['id'];params.type='upd';params.data=JSON.stringify(data);app.processData('frame/update','post',params);const focusedRow=e.rowIndex;this.object.option('focusedRowIndex',focusedRow);}}
rowPrepared(e){if(this.isReadField&&e.rowType=='data'&&!e.data[this.isReadField.dataField]){e.rowElement.addClass('mylsThemeBold');}
if(e.rowType=='data'&&e.data['row__class']){e.rowElement.addClass(e.data['row__class']);}
if(e.rowType=='data'&&e.data['row__color']){e.rowElement.css('color',e.data['row__color']);}
if(e.rowType=='data'&&e.data['row__bgcolor']){e.rowElement.css('background_color',e.data['row__bgcolor']);}}
editorPreparing(e){const self=this;if(e.parentType==="dataRow"&&e.dataField)
if(this.columns.columns[e.dataField]&&this.columns.columns[e.dataField].dataType==='lookup'&&this.columns.columns[e.dataField].template)
e.editorOptions.itemTemplate=function(data){self.columns.columns[e.dataField].editor=1;const value=self.columns.getFormattedCellValue(null,self.columns.columns[e.dataField],data);self.columns.columns[e.dataField].editor=null;return value;};}
customSave(state){app.prepareStorage(state);const cState=JSON.stringify(state);if(this.curState!=cState){this.sendStorageRequest("storage","json","POST",state,this.table);app.appInfo.setting[this.table]=state;window.localStorage.setItem('appInfo',JSON.stringify(app.appInfo));this.curState=cState;}}
selectionChanged(e){const countSelected=e.component.getSelectedRowKeys().length;this.showSelected(countSelected);}
gridContentReady(e){if(e.component.option('editing.mode')=='row'){this.contentReady(e);}
let dataSource=e.component.getDataSource();if(dataSource!=undefined){$('#'+this.idn+'_totalCount').text(app.translate.saveString("Всего записей:")+' '+dataSource._totalCount);}
if(this.template&&this.template.hasOwnProperty('report')){this.chartView.repaint(this.tableData);}}
customizeExcelCell(options){let gridCell=options.gridCell;if(!gridCell){return;}
if(gridCell.rowType==="data"){if(gridCell.column.dataType==="block"){this.excelCellBlock(gridCell,options);}
if(gridCell.column.dataType==="boolean"){this.excelCellBoolean(gridCell,options);}}}
excelCellBoolean(gridCell,options){if(gridCell.value==1){options.value=DevExpress.localization.formatMessage("myls-yes");}else{options.value=DevExpress.localization.formatMessage("myls-no");}}
excelCellBlock(gridCell,options){let currElem=this.columns.getFormattedCellValue(gridCell.value,gridCell.column,gridCell.data);let $elem=$('<div>');$elem.attr('data-dir','v');$elem.append(currElem);let currData='';$($elem).each(function(){var delimer="\n";if($.trim($(this).text())!=='')
currData+=$(this).text()+delimer;});options.value=currData;}
createMasterDetail(){let newMenu=[];const self=this;$.each(this.contextMenuData,function(index,item){if(item.isInner==1){const param=app.parseUrl(item.url);self.masterDetail={enabled:true,template:function(container,option){self.templateMasterdetail(item,param,option,container);},};}else
newMenu.push(item);});this.contextMenuData=newMenu;}
templateMasterdetail(item,param,option,container){const idn=app.getIdn(item.objectType,param.table,option.data[item.extIdField],'tabs');container.addClass('myls-master-detail-container');container.append('<div class="myls-master-detail-caption">'+item.text+'</div>');container.append(app.getObjectContainer(idn));const object=app.getObject(param.table,option.data[item.extIdField],'tabs',item.objectType,'sel',app.addHistory(item.extIdField,option.data[item.extIdField],idn,this.tHistory,'sel'),'compact');object.init();}
getCurrentId(){return this.object.option('focusedRowKey');}
getSelectedRows(){return this.object.getSelectedRowKeys();}
async refresh(changesOnly=true,useLoadPanel=true){try{await this.dataSource.reload();}catch(error){console.log(error);}
this.toolbar.setEnabledToolbar();this.changed();}
destroy(){super.destroy();$("#"+this.idn).data('mylsObject',null);app.destroyArray(this.masterDetail);app.destroyArray(this.usedColumns);this.curState=null;this.close();}
showEditButtons(mode){this.object.option('editing').allowUpdating=mode=='batch'&&this.tableInfo.e==1;this.object.option('editing').allowAdding=mode=='batch'&&this.tableInfo.a==1;this.object.option('editing').allowDeleting=mode=='batch'&&this.tableInfo.d==1;}
async editInline(params){const self=this;return new Promise(async(resolve)=>{self.object.beginUpdate();self.showEditButtons('batch');if(self.object.option("editing").mode!='batch'){self.object.option('editing',{mode:"batch",selectTextOnEditStart:true,startEditAction:"click",});self.object.option("focusedRowEnabled",false);}
if(self.mode=='ins'){await self.prepareInsert(params,false);}
self.object.endUpdate();resolve();});}
hasUncommitedData(){return this.object.hasEditData();}
repaint(){this.object.repaint();}};;class Tree extends Grid{constructor(table,ext_id,view,mode,tHistory,viewMode,params){super(table,ext_id,view,mode,tHistory,viewMode,params);this.type='tree';}
createObject(){this.object=$("#"+this.idn).dxTreeList(this.getOptions()).dxTreeList('instance');}
getOptions(){let options=super.getOptions();options.keyExpr="id";options.parentIdExpr="parent_id";options.dataSource=this.dataSource.store();return options;}
async refresh(changesOnly=true,useLoadPanel=true){this.object.refresh();}};;class Charts extends MylsObject{constructor(table,ext_id,view,mode,tHistory,viewMode,params){super(table,ext_id,view,mode,tHistory,viewMode,params);this.type='chart';this.pivotSel=[];this.dataSources={};this.datas={};this.arrTypes={'bar':'dxChart','area':'dxChart','doughnut':'dxPieChart','map':'dxVectorMap','funnel':'dxFunnel'};this.chartType='bar';this.element='dxChart';this.rNum=0;}
async init(){await super.init();if(this.tableInfo.view!==''){this.chartType=this.tableInfo.view;this.element=this.arrTypes[this.tableInfo.view];}
this.setSeries();this.argument=this.columns.getColumnsByColumnType('argument',true).dataField;this.chartView=new ChartView(this.table,this.chartType,this.viewMode,this.series,this.argument,this.idn,false,this.toolbar,this.columns,this.template);if(this.element=='dxVectorMap')
await this.fillDataSources();else
this.datas[this.table]=await this.createDatas(this.table);this.object=await this.chartView.init(this.datas[this.table]);$("#"+this.idn).data('mylsObject',this);this.showToolbar();this.object.render();if(this.template&&this.template.report.length>0){this.showReport();}}
setSeries(){const self=this;this.series=[];$.each(this.columns.getColumnsByColumnType('serie',false),function(index,item){self.series.push({valueField:item.dataField,name:item.caption,summaryType:item.summaryType});});}
fillDataSources(){const self=this;if(self.template&&self.template.report.length>0){$.each(self.template.report,function(index,item){self.pivotSel.push({'id':index,'name':item.hasOwnProperty("@attributes")?item['@attributes'].caption:item['attributes'].caption,});let tableId=item.hasOwnProperty("@attributes")?item['@attributes'].tableId:item['attributes'].tableId;if(!tableId){tableId=self.table;}
if(!self.dataSources.hasOwnProperty(tableId)){self.datas[tableId]=self.createDatas(tableId);}});}else{self.datas[self.table]=self.createDatas(self.table);}}
async createDatas(tableId){if(this.datas&&this.datas.hasOwnProperty(tableId))
return this.datas[tableId];else{let params=this.prepareTableData();params.filter=JSON.stringify(this.dataSource.mylsFilter);const result=await app.processData('frame/tabledata','post',this.prepareTableData());this.datas[tableId]=this.chartView.processData(result);return this.datas[tableId];}}
showToolbar(){if((this.template&&this.template.report.length>0)||this.viewMode!='compact'||this.columns.getColumnsByColumnType('filter',true)){this.toolbar.init();if(this.pivotSel.length>0){const self=this;let items=this.toolbar.object.option('items');items.push({widget:"dxSelectBox",name:'selectRow',locateInMenu:'auto',options:{elementAttr:{toolbarrole:"always",},dataSource:this.pivotSel,displayExpr:"name",valueExpr:"id",value:0,width:250,onValueChanged:function(e){self.rNum=e.value;self.showReport();}},location:"center"});this.toolbar.object.option('items',items);}}}
customize(elements,mapData){const self=this;$.each(elements,function(_,element){const name=element.attribute('name');for(let key in mapData){if(name==key){element.attribute(self.argument,mapData[key]);}}});}
async showReport(){const list=this.template.report[this.rNum];let tableId=list.hasOwnProperty("@attributes")?list['@attributes'].tableId:list['attributes'].tableId;if(!tableId){tableId=this.table;}
this.datas[tableId]=await this.createDatas(tableId);await this.refresh(true,true,this.datas[tableId]);this.dataSource=this.dataSources[tableId];this.changed();}
updateMap(dataSource){let series=[];$.each(this.columns.getColumnsByColumnType('serie',false),function(index,item){series.push({valueField:item.dataField,name:item.caption});});let currentSerie=series[this.rNum];let elements=this.object.getLayers()[0].getElements();let argument=this.columns.getColumnsByColumnType('argument',true).dataField;let mapData=this.chartView.getMapValues(argument,currentSerie.valueField,dataSource);let maxValue=this.chartView.getMapMax(mapData);let groupField=this.chartView.getGroupFields(maxValue);$.each(elements,function(_,element){const name=element.attribute('name');element.attribute(argument,undefined);for(let key in mapData){if(name==key){element.attribute(argument,mapData[key]);}}});this.object.option("layers.colorGroups",groupField);}
async refresh(changesOnly=true,useLoadPanel=true,dataSource){super.refresh(changesOnly,useLoadPanel);if(this.element=='dxVectorMap'){this.updateMap(dataSource);}else{let params=this.prepareTableData();params.filter=JSON.stringify(this.dataSource.mylsFilter);const result=await app.processData('frame/tabledata','post',params);this.datas[this.table]=this.chartView.processData(result);this.object.option('dataSource',this.datas[this.table]);}}
destroy(){super.destroy();$("#"+this.idn).data('mylsObject',null);app.destroyArray(this.dataSources);app.destroyArray(this.pivotSel);app.destroyArray(this.datas);app.destroyArray(this.arrTypes);app.destroyArray(this.series);this.close();}};;class ChartView{constructor(table,chartType,viewMode,series,argument,idn,forGrid=false,toolbar={},columns=[]){this.type='chart';this.pivotSel=[];this.dataSources={};this.datas={};this.arrTypes={'bar':'dxChart','area':'dxChart','doughnut':'dxPieChart','map':'dxVectorMap','funnel':'dxFunnel'};this.element=this.arrTypes[chartType];this.idn=idn;this.table=table;this.viewMode=viewMode;this.forGrid=forGrid;this.columns=columns;this.toolbar=toolbar;this.chartType=chartType;this.series=series;this.argument=argument;this.sortField=this.columns.columns[argument]['sortField'];if(!this.sortField)
this.sortField=this.argument;}
async init(data){if(this.forGrid)
this.dataSource=this.processData(data);else
this.dataSource=data;await this.createObject();return this.object;}
repaint(data){if(this.forGrid)
this.dataSource=this.processData(data);this.createObject();}
async createObject(){switch(this.element){case'dxVectorMap':this.object=await this.showVectorMap();break;case'dxChart':this.object=this.showChart();break;case'dxPieChart':this.object=this.showPieChart();break;case'dxFunnel':this.object=this.showFunnel();break;}}
render(){this.object.render();}
showChart(){let chart='';let $charContainer=$("#"+this.idn).append('');if(this.viewMode=='compact')
chart=$charContainer.dxChart(this.getCompactChartOptions()).dxChart("instance");else{$charContainer=$('<div class="myls-chart-container flex-grow-1"></div>').appendTo("#"+this.idn);chart=$charContainer.dxChart(this.getChartOptions()).dxChart("instance");}
return chart;}
showPieChart(){let $charContainer=$("#"+this.idn);if(this.viewMode!='compact'){$charContainer=$('<div class="myls-chart-container h-100"></div>').appendTo("#"+this.idn);}
const chart=$charContainer.dxPieChart(this.getPieChartOptions()).dxPieChart("instance");return chart;}
showFunnel(){let $charContainer=$("#"+this.idn);if(this.viewMode!='compact'){$charContainer=$('<div class="myls-chart-container h-100"></div>').appendTo("#"+this.idn);}
const chart=$charContainer.dxFunnel(this.getFunnelOptions()).dxFunnel("instance");return chart;}
getMapValues(country,value,data){let result=[];$.each(data,function(index,item){if(item[country]!==null){if(result[item[country]]){result[item[country]]+=item[value];}else{result[item[country]]=item[value];}}});return result;}
getMapMax(mapData){let values=[];for(let key in mapData){values.push(mapData[key]);}
let maxValue=Math.floor(Math.max.apply(null,values));let digit=parseInt(maxValue.toString()[0]);return(digit+1)*Math.pow(10,String(maxValue).length-1);}
getGroupFields(maxValue){if(maxValue<10)
maxValue=10;let groupField=[];for(let i=0;i<=maxValue;i=i+maxValue / 10){groupField.push(parseInt(i));}
return groupField;}
async showVectorMap(){const self=this;let $charContainer=$("#"+this.idn);$charContainer=$('<div class="myls-chart-container h-100"></div>').appendTo("#"+this.idn);const chart=$charContainer.dxVectorMap(this.getVectorMapOptions()).dxVectorMap("instance");return chart;}
getVectorMapOptions(){const self=this;let mapData=this.getMapValues(this.argument,this.series[0].valueField,this.dataSource);let maxValue=this.getMapMax(mapData);let groupField=this.getGroupFields(maxValue);return{bounds:[-180,85,180,-60],layers:{name:"areas",dataSource:DevExpress.viz.map.sources.world,palette:"Violet",colorGroups:groupField,colorGroupingField:this.argument,customize:function(elements){self.customize(elements,mapData);}},legends:[{source:{layer:"areas",grouping:"color"},customizeText:function(arg){return DevExpress.localization.formatNumber(arg.start,"#,##0")+" - "+DevExpress.localization.formatNumber(arg.end,"#,##0");}}],tooltip:{enabled:true,customizeTooltip:function(arg){if(arg.attribute(self.argument)){return{text:arg.attribute("name")+": "+DevExpress.localization.formatNumber(arg.attribute(self.argument),"#,##0")};}}}};}
getChartOptions(){const self=this;return{palette:"soft",dataSource:this.dataSource,commonSeriesSettings:{argumentField:this.argument,type:this.chartType},series:this.series,margin:{bottom:20},legend:{verticalAlignment:"top",horizontalAlignment:"center"},"export":{enabled:false},"valueAxis":{autoBreaksEnabled:false,},tooltip:{enabled:true,customizeTooltip:function(pointInfo){return{html:"<div class='chart-tooltip'><div class='chart-value'>"+self.formatNumber(pointInfo.value)+"</div><div class='chart-serie'>"+pointInfo.argumentText+"</div></div>"};}},onDisposing:function(e){}};}
formatNumber(cellValue){if(cellValue!==null&&cellValue!==''&&cellValue!==undefined){try{const format="#,##0.00";cellValue=DevExpress.localization.formatNumber(cellValue,format);}catch(e){}}
return cellValue;}
getFunnelOptions(){return{palette:"soft",dataSource:this.dataSource,argumentField:this.argument,valueField:"item",margin:{bottom:20},tooltip:{enabled:true,format:"fixedPoint"},item:{border:{visible:true}},label:{visible:true,position:"outside",backgroundColor:"none",customizeText:function(e){return"<span class='mylsThemeLargeFont mylsMainFont'>"+
e.percentText+"</span><br/>"+
e.item.argument;}},sortData:false,"export":{enabled:false},onDisposing:function(e){}};}
getCompactChartOptions(){const self=this;return{palette:"pastel",dataSource:this.dataSource,commonSeriesSettings:{ignoreEmptyPoints:true,argumentField:this.argument,type:this.chartType,valueField:'item',},commonAxisSettings:{visible:false,tick:{visible:false,},label:{visible:false,},},seriesTemplate:{nameField:this.argument,},legend:{visible:false,},"export":{enabled:false},"valueAxis":{autoBreaksEnabled:false,},tooltip:{enabled:true,customizeTooltip:function(pointInfo){return{html:"<div class='chart-tooltip'><div class='chart-value'>"+self.formatNumber(pointInfo.value)+"</div><div class='chart-serie'>"+pointInfo.argumentText+"</div></div>"};}},onDisposing:function(e){},};}
getPieChartOptions(){const topN=this.columns.getColumnsByColumnType('topn',true).dataField;let options={};if(this.viewMode=='compact')
options=this.getCompactChartOptions();else
options=this.getChartOptions();if(topN){options.commonSeriesSettings.smallValuesGrouping={mode:"topN",topCount:10};}
options.legend={visible:false};options.resolveLabelOverlapping='shift';options.commonSeriesSettings.label={visible:true,connector:{visible:true,width:0.5},position:"columns",customizeText:function(arg){return arg.argument+" ("+arg.percentText+")";}};return options;}
processData(data){const self=this;data=this.removeNull(data);let sortField=String(this.sortField).trim().toLowerCase();let sortDir='asc';if(String(sortField).indexOf(' ')!=-1){let words=String(sortField).split(' ');sortField=words[0];sortDir=words[1];}
data.sort((prev,next)=>(prev[sortField]<next[sortField]&&sortDir=='asc')?-1:1);let out=[];let old='';let k=0;for(let key in data){if(old!=data[key][this.argument]){if(key>0)
k++;out[k]={};out[k][this.argument]=data[key][this.argument];for(let i of this.series){if(i.summaryType=='count'){if(data[key][i.valueField]!==undefined)
out[k][i.valueField]=1;else
out[k][i.valueField]=0;}else{out[k][i.valueField]=data[key][i.valueField];}}
old=data[key][this.argument];}else{for(let i of this.series){if(i.summaryType=='sum')
out[k][i.valueField]=out[k][i.valueField]+data[key][i.valueField];if(i.summaryType=='max'){if(data[key][i.valueField]>out[k][i.valueField]){out[k][i.valueField]=data[key][i.valueField];}}
if(i.summaryType=='min'){if(data[key][i.valueField]<out[k][i.valueField]){out[k][i.valueField]=data[key][i.valueField];}}
if(i.summaryType=='count'){if(data[key][i.valueField]!==undefined){out[k][i.valueField]++;}}}}}
return out;}
removeNull(data){for(let i=data.length-1;i>=0;--i){if(data[i][this.argument]==null){data.splice(i,1);}}
return data;}
customize(elements,mapData){const self=this;$.each(elements,function(_,element){const name=element.attribute('name');for(let key in mapData){if(name==key){element.attribute(self.argument,mapData[key]);}}});}};;class DragList extends MylsObject{constructor(table,ext_id,view,mode,tHistory,viewMode,params){super(table,ext_id,view,mode,tHistory,viewMode,params);this.type='draglist';this.fromOnlyOneGroup=true;}
async init(){const self=this;super.init();this.dataColumn=this.columns.getColumnsByColumnType('data',true);this.groupColumn=this.columns.getColumnsByColumnType('group',true);this.dataDS=new DevExpress.data.DataSource(this.initLookupDataSource(this.dataColumn,null,null));await this.dataDS.load();this.searchExpr=this.columns.getUsedFields(this.template,['title','subtitle','text']);this.createObject();$("#"+this.idn).data('mylsObject',this);this.toolbar.init();}
createObject(){this.object=$("#"+this.idn).dxList(this.getOptions()).dxList('instance');}
getOptions(){const self=this;return{dataSource:this.dataSource,dataDS:this.dataDS,pullRefreshEnabled:false,selectionMode:"single",searchEnabled:true,indicateLoading:false,searchExpr:this.searchExpr,searchMode:'contains',noDataText:app.translate.saveString('Пока в этом разделе нет данных. Чтобы внести информацию, воспользуйтесь кнопкой "Добавить"'),onContentReady:function(e){self.draglistContentReady(e);},onSelectionChanged:function(e){self.toolbar.setEnabledToolbar();},itemTemplate:function(data){return self.getItemtemplate(self,data);},onItemContextMenu:function(e){},onItemClick:function(e){},};}
getItemtemplate(self,data){let template="";if(self.template&&self.template.length!=0){let item=[];item.template='<div data-dir="v" class="card draglist">'+self.template+'</div>';item.dataType='block';template=this.columns.getFormattedCellValue('',item,data);}
template=this.addList($(template),data);return template;}
draglistContentReady(e){$("#"+this.idn+" .dx-list-item").addClass("col d-flex align-items-stretch");$("#"+this.idn+" .dx-list-item-content").addClass("d-block");$("#"+this.idn+" .dx-scrollview-content").addClass("card-view d-flex align-items-stretch flex-wrap");this.resizeCards($("#"+this.idn));this.contentReady(e);$('#'+this.idn+'_totalCount').text(app.translate.saveString("Всего записей:")+' '+e.component.option('items').length);}
resizeCards(item){const width=$(item).width();for(let i=12;i>0;i--){if(width>=250*i){$(item).find(".dx-list-item").css('max-width',width / i+'px');break;}}}
addList(template,info){const self=this;const id=this.idn+'_list-container_'+info.id;let $list=$("<div id='"+id+"' class='draglist-list'/>").appendTo($(template));let listData=[];$.each(this.dataDS.items(),function(index,item){if(item.group_id==info.id){listData.push(item);}});this.createCards(listData,$list,info);template=$(template).get(0);return template;}
getSortableOptions(itemData){const self=this;return{group:this.idn,moveItemOnDrop:true,data:itemData,allowReordering:false,onDragStart:function(e){self.selectCard(e.itemElement,true);if(!self.tableInfo.e||self.tableInfo.e!==1){e.cancel=true;}else{$("#"+self.idn+' .sortable-cards').addClass('dragging');}},onDragEnd:async function(e){if(e.fromComponent!==e.toComponent){const checkedItems=self.getSelectedItems();await self.updateValues(e);await self.refresh();setTimeout(function(){self.selectCheckbox(checkedItems);},5000);}
$("#"+self.idn+' .sortable-cards').removeClass('dragging');},dragTemplate:function(e){const $container=$("<div/>");if(self.fromOnlyOneGroup){const group_id=self.getCurrentGroup(e.itemElement);if(group_id!==null){$.each(self.getSelectedItems(group_id),(_,item)=>{self.createCard(item,$container);});}}else{$.each(self.getSelectedItems(),(_,item)=>{self.createCard(item,$container);});}
return $container;}};}
getCurrentGroup(item){const id=$(item).closest('.dx-card').attr('data-id');const itemIndex=this.findInDataSource(id,this.dataDS.items(),'id');if(itemIndex!==-1){const currentItem=this.dataDS.items()[itemIndex];return currentItem.group_id;}
return null;}
selectCheckbox(items){for(let item of items){console.log(item);const $checkbox=$('.dx-card[data-id="'+item.id+'"]').find('.myls-card-checkbox').dxCheckBox('instance');console.log($checkbox.option('value'));$checkbox.option('value',true);$checkbox.repaint();console.log($checkbox.option('value'));}}
createCards(data,$list,itemData){const self=this;let $scroll=$("<div>").appendTo($list);let $items=$("<div>").appendTo($scroll);data.forEach(function(item){self.createCard(item,$items);});$scroll.addClass("scrollable-list").dxScrollView({direction:"vertical",showScrollbar:"always"});$items.addClass("sortable-cards").dxSortable(this.getSortableOptions(itemData));}
createCard(data,$items){const self=this;let $item=$("<div>").addClass("dx-card d-flex flex-row dx-theme-text-color dx-theme-background-color").appendTo($items);$item.attr("data-id",data.id);$item.itemData=data;$item.on("dxclick",(e)=>{});$item.append(this.createCheckBox());$item.append(this.columns.getFormattedCellValue('',this.dataColumn,data));}
createCheckBox(){const self=this;return $('<div class="myls-card-checkbox">').dxCheckBox({value:false,onValueChanged:function(e){self.selectCard(e.element,e.value);}});}
selectCard(card,select){const $card=$(card);const $parent=$card.closest('.dx-card');const $checkbox=$parent.find('.myls-card-checkbox').dxCheckBox('instance');const id=$parent.attr('data-id');try{const itemIndex=this.findInDataSource(id,this.dataDS.items(),'id');if(itemIndex!==-1){const item=this.dataDS.items()[itemIndex];$checkbox.option('value',select);$parent.toggleClass('card-selected');item.selected=select;item['__from_group']=item.group_id;if(select){item.selected=select;$parent.removeClass('card-selected');$parent.addClass('card-selected');}
if(select===false){$parent.removeClass('card-selected');}}}catch(error){console.log(error);}}
getSelectedItems(group_id){return this.dataDS.items().filter((item)=>item.selected&&(item.group_id==group_id||!group_id));}
async updateValues(e){const self=this;if(!this.tableInfo.updParams||!this.tableInfo.updParams.length){return Promise.resolve();}
let currentItem;if(this.fromOnlyOneGroup){const $parent=$(e.itemElement).closest('.dx-card');const id=$parent.attr('data-id');const itemIndex=self.findInDataSource(id,self.dataDS.items(),'id');if(itemIndex!==-1){currentItem=self.dataDS.items()[itemIndex];}}
const items=self.getSelectedItems();this.progressBar.init(items.length);let postParams={'table':this.tableInfo.tableId};for(let item of items){try{let params=this.setUpdateParams(item,e.toData[self.groupColumn.dataField]);postParams.params=JSON.stringify(params);if(this.fromOnlyOneGroup&&currentItem){if(currentItem.group_id==item.group_id){let result=await app.processData('frame/updateproc','post',postParams);this.processResult(result);this.progressBar.step();}}else{let result=await app.processData('frame/updateproc','post',postParams);this.processResult(result);this.progressBar.step();}}catch(error){this.processResult(error);this.progressBar.step();}}
this.progressBar.remove();}
setUpdateParams(e,toGroup){const self=this;let params={};$.each(this.tableInfo.updParams,function(index,item){params[item]=null;switch(item){case'id':params[item]=e.ext_id;break;case'from_group':params[item]=e['__from_group'];break;case'to_group':params[item]=toGroup;break;}});$.each(this.selParams,function(index,item){params[index.substring(1)]=item;});app.addConfigParams(params);return params;}
getCurrentId(){return this.object.option('selectedItemKeys')[0];}
getSelectedRows(){return this.object.option('selectedItemKeys');}
async refresh(changesOnly=true,useLoadPanel=true){super.refresh(changesOnly,useLoadPanel);await this.object.option("dataDS").reload();await this.object.reload();this.toolbar.setEnabledToolbar();}
destroy(){super.destroy();$("#"+this.idn).data('mylsObject',null);this.dataDS=null;this.close();}};;class Scheduler extends MylsObject{constructor(table,ext_id,view,mode,tHistory,viewMode,params){super(table,ext_id,view,mode,tHistory,viewMode,params);this.type='scheduler';}
async init(){await super.init();this.textColumn=this.columns.getColumnsByColumnType("text",true);this.startDateColumn=this.columns.getColumnsByColumnType("start_date",true);this.endDateColumn=this.columns.getColumnsByColumnType("end_date",true);this.minTimeColumn=this.columns.getColumnsByColumnType("min_time",true);this.maxTimeColumn=this.columns.getColumnsByColumnType("max_time",true);this.schedulerLimitsColumn=this.columns.getColumnsByColumnType("schedule_limits",true);if(this.schedulerLimitsColumn){this.schedulerLimits=await this.loadLookupData(this.schedulerLimitsColumn);if(this.schedulerLimits&&this.schedulerLimits[0]){this.schedulerLimits=this.schedulerLimits[0];}}
this.minTime=8;this.maxTime=21;this.dataSource.paginate(false);this.createObject();$("#"+this.idn).data('mylsObject',this);this.toolbar.init();}
createObject(){let options=this.getOptions();this.object=$("#"+this.idn).dxScheduler(options).dxScheduler('instance');}
getOptions(){const self=this;const options={dataSource:self.dataSource,keyExpr:"id",allDayExpr:self.columns.getColumnsByColumnType("all_day",true).dataField,startDateExpr:self.startDateColumn.dataField,endDateExpr:self.endDateColumn.dataField,textExpr:self.textColumn.dataField,recurrenceRuleExpr:self.columns.getColumnsByColumnType("repeate_rule",true).dataField,recurrenceExceptionExpr:self.columns.getColumnsByColumnType("recurrence_exception",true).dataField,views:self.tableInfo.view.split(','),currentView:self.tableInfo.view.split(',')[0],startDayHour:self.minTime,endDayHour:self.maxTime,editing:{allowAdding:false,allowUpdating:false,allowDragging:false,allowResizing:false,allowDeleting:false,},dateSerializationFormat:"yyyy-MM-ddTHH:mm:ssx",onContentReady:function(e){self.scheduleContentReady(e);},onAppointmentRendered:function(e){self.appointmentRendered(e);},onAppointmentDblClick:function(e){self.appointmentDblClick(e);},onAppointmentClick:function(e){self.appointmentClick(e);self.toolbar.setEnabledToolbar();},onCellClick:function(){self.id=undefined;self.toolbar.setEnabledToolbar();},appointmentTemplate:function(e){return self.appointmentTemplate(e);},onAppointmentFormOpening:function(e){e.cancel=true;},appointmentTooltipTemplate:function(e){return self.appointmentTooltipTemplate(e);},};if(this.schedulerLimits){let d=new Date();if(this.schedulerLimits['start_date']){options.min=new Date(this.schedulerLimits['start_date']);if(d<options.min)
options.currentDate=options.min;}
if(this.schedulerLimits['end_date']){options.max=new Date(this.schedulerLimits['end_date']);if(d>options.max)
options.currentDate=options.max;}
if(this.schedulerLimits['min_time'])
options.startDayHour=this.schedulerLimits['min_time'];if(this.schedulerLimits['max_time'])
options.endDayHour=this.schedulerLimits['max_time'];}
return options;}
appointmentRendered(e){const column=this.columns.getColumnsByColumnType("color",true);if(column){e.appointmentElement[0].style.backgroundColor=e.appointmentData[column.dataField];if(e.appointmentData[column.dataField]){const colorClass=$.Color(e.appointmentData[column.dataField]).contrastColor();e.appointmentElement[0].classList.add(colorClass);}}}
appointmentTooltipTemplate(e){if(this.textColumn.dataType=="block"){let result=this.columns.getFormattedCellValue(null,this.textColumn,e.appointmentData);this.object.selectedId=e.appointmentData.id;result=$("<div class='myls-scheduler-tooltip d-flex p-3 justify-content-between'>"+"           <div class='myls-scheduler-tooltip-data text-left'> "+result+"                <div class='myls-scheduler-tooltip-time'>"+e.appointmentData[this.startDateColumn.dataField].slice(11,16)+" - "+e.appointmentData[this.endDateColumn.dataField].slice(11,16)+"                </div>"+"           </div>"+"           <div class='myls-scheduler-tooltip-buttons'><div id='"+this.idn+"_edit_btn'></div><div id='"+this.idn+"_delete_btn'></div>"+"</div>"+"</div>");this.addEditBtn(e,result);this.addDeleteBtn(e,result);$(result).on("dxclick",function(e1){e1.stopPropagation();});return result;}else return"item";}
addDeleteBtn(e,result){if(this.tableInfo.d==1&&e.appointmentData.id>0){const btn=$("<div>").dxButton(this.toolbar.getDeleteBtnOptions(false));$(result).find("#"+this.idn+'_delete_btn').append(btn);}}
addEditBtn(e,result){if(this.tableInfo.e==1&&e.appointmentData.id>0){const btn=$("<div>").dxButton(this.toolbar.getEditBtnOptions(false));$(result).find("#"+this.idn+'_edit_btn').append(btn);}}
appointmentTemplate(e){if(this.textColumn.dataType=="block"){let result=this.columns.getFormattedCellValue(null,this.textColumn,e.appointmentData);result+="<div>"+e.appointmentData[this.startDateColumn.dataField].slice(11,16)+" - "+e.appointmentData[this.endDateColumn.dataField].slice(11,16)+"</div>";return result;}else return"item";}
appointmentClick(e){e.cancel=true;if(e.component.myTimeout){clearTimeout(e.component.myTimeout);}
e.component.myTimeout=setTimeout(function(){e.component.showAppointmentTooltip(e.appointmentData,e.appointmentElement,e.targetedAppointmentData);},300);this.id=e.appointmentData.id;}
appointmentDblClick(e){e.cancel=true;if(e.component.myTimeout){clearTimeout(e.component.myTimeout);}
this.object.hideAppointmentTooltip();this.processDblClick();}
scheduleContentReady(e){this.contentReady(e);const d=new Date();if(this.object.getEndViewDate()>=d&&this.object.getStartViewDate()<=d)
this.object.scrollToTime(d.getHours(),d.getMinutes(),d);}
getCurrentId(){return this.id;}
getSelectedRows(){if(this.id)
return[this.id];else return[];}
async refresh(changesOnly=true,useLoadPanel=true){super.refresh(changesOnly,useLoadPanel);await this.dataSource.reload();this.toolbar.setEnabledToolbar();}
destroy(){super.destroy();$("#"+this.idn).data('mylsObject',null);this.close();}};;class Pivot extends MylsObject{constructor(table,ext_id,view,mode,tHistory,viewMode,params){super(table,ext_id,view,mode,tHistory,viewMode,params);this.type='pivot';this.dataSources={};this.pivotSel=[];this.datas={};}
async init(){await super.init();this.fillDataSources();this.showToolbar();this.options=this.getOptions();this.getOptions();this.showReport(0);$("#"+this.idn).data('mylsObject',this);}
getOptions(){return{allowSortingBySummary:true,allowFiltering:true,showBorders:true,showColumnGrandTotals:true,showRowGrandTotals:true,showRowTotals:false,showColumnTotals:false,fieldChooser:{enabled:true,height:400},fieldPanel:{showColumnFields:true,showDataFields:true,showFilterFields:true,showRowFields:true,allowFieldDragging:true,visible:true},scrolling:{mode:"virtual"},};}
fillDataSources(){if(!this.template){let rows=this.columns.getColumnsByColumnType('row');let columns=this.columns.getColumnsByColumnType('column');let datas=this.columns.getColumnsByColumnType('data');this.template={};this.template={report:[{attributes:{caption:'XXX'},row:{field:this.getDataField(rows)},column:{field:this.getDataField(columns)},data:{field:this.getDataField(datas)}}]};}
if(!$.isArray(this.template.report)){let arrStr=[];arrStr[0]=this.template.report;this.template.report=arrStr;}
if(this.template.report.length>0){const self=this;$.each(this.template.report,function(index,item){self.pivotSel.push({'id':index,'name':item.hasOwnProperty("@attributes")?item['@attributes'].caption:item['attributes'].caption,});let tableId=item.hasOwnProperty("@attributes")?item['@attributes'].tableId:item['attributes'].tableId;if(!tableId){tableId=self.table;}
if(!self.dataSources.hasOwnProperty(tableId)){self.dataSources[tableId]=self.getDataSource(tableId);}});}}
getDataField(arr){let result=[];for(let rr of arr){result.push(rr.dataField);}
return result;}
getDataSource(tableId){const self=this;return{fields:self.tableColumns.columns,store:new DevExpress.data.CustomStore({key:"id",loadMode:"raw",load:async function(loadOptions){if(self.datas.hasOwnProperty(tableId))
return self.datas[tableId];else{let result=await app.processData('frame/tabledata','post',self.prepareTableData());self.datas[tableId]=result;return result;}},})};}
createChart(){if($("#"+this.idn+'-chartContainer').length==0){$("#"+this.idn).append('<div id="'+this.idn+'-chartContainer" class="chart-container"></div>');$("#"+this.idn+'-chartContainer').append("<div id='"+this.idn+"_chart' class='myls-pivot-chart'>");}}
getChartOptions(){return{commonSeriesSettings:{type:"bar"},tooltip:{enabled:true,customizeTooltip:function(pointInfo){return{html:"<div class='chart-tooltip'><div class='chart-value'>"+pointInfo.valueText+"</div><div class='chart-serie'>"+pointInfo.seriesName+"</div></div>"};}},size:{height:$("#"+this.idn+'-chartContainer').innerHeight()},adaptiveLayout:{width:500},onDisposing:function(e){}}}
getChart(){this.createChart();this.objectChart=$("#"+this.idn+"_chart").dxChart(this.getChartOptions()).dxChart("instance");return this.objectChart;}
showToolbar(){this.toolbar.init();if(this.template.report.length>1){const self=this;let items=this.toolbar.object.option('items');items.push({widget:"dxSelectBox",name:'selectRow',locateInMenu:'auto',options:{elementAttr:{toolbarrole:"always",},dataSource:this.pivotSel,displayExpr:"name",valueExpr:"id",value:0,width:250,onValueChanged:function(e){self.showReport(e.value);}},location:"center"});this.toolbar.object.option('items',items);}}
removePivotGrid(){if($("#"+this.idn+'-pivotContainer').length){$("#"+this.idn+'-pivotContainer').dxPivotGrid("instance").dispose();$("#"+this.idn+'-pivotContainer').remove();}}
createPivotGrid(chartType){let pivotGrid=false;$("#"+this.idn+"_chart").dxChart('dispose');$("#"+this.idn+'-chartContainer').remove();if(chartType!==undefined){let pivotGridChart=this.getChart();pivotGrid=this.createReport();pivotGridChart.option('commonSeriesSettings.type',chartType);pivotGrid.bindChart(pivotGridChart,{dataFieldsDisplayMode:"splitPanes",alternateDataFields:false});}else{pivotGrid=this.createReport();}
this.object=pivotGrid;}
showReport(rNum){const list=$.isArray(this.template.report)?this.template.report[rNum]:this.template.report;let tableId=list.hasOwnProperty("@attributes")?list['@attributes'].tableId:list['attributes'].tableId;if(!tableId){tableId=this.table;}
const chartType=list.hasOwnProperty("@attributes")?list['@attributes'].chart:list['attributes'].chart;this.options.dataSource=this.dataSources[tableId];this.dataSource=this.dataSources[tableId];this.dataSource.store.load();this.setAreas(list);this.removePivotGrid();this.createPivotGrid(chartType);}
createReport(){$("#"+this.idn).append('<div id="'+this.idn+'-pivotContainer" class="pivot-container"></div>');return $("#"+this.idn+'-pivotContainer').dxPivotGrid(this.options).dxPivotGrid("instance");}
setAreas(list){const self=this;if(this.options.dataSource.fields){$.each(this.options.dataSource.fields,function(_,item){item['area']=undefined;});}
if($.isArray(list.row.field))
$.each(list.row.field,function(_,item){self.options.dataSource.fields[item.toLowerCase()]['area']='row';});else
this.options.dataSource.fields[list.row.field.toLowerCase()]['area']='row';if($.isArray(list.column.field))
$.each(list.column.field,function(_,item){self.options.dataSource.fields[item.toLowerCase()]['area']='column';});else
this.options.dataSource.fields[list.column.field.toLowerCase()]['area']='column';if($.isArray(list.data.field))
$.each(list.data.field,function(_,item){self.options.dataSource.fields[item.toLowerCase()]['area']='data';});else
this.options.dataSource.fields[list.data.field.toLowerCase()]['area']='data';}
async refresh(changesOnly=true,useLoadPanel=true){super.refresh(changesOnly,useLoadPanel);await this.object.getDataSource().reload();this.toolbar.setEnabledToolbar();}
destroy(){super.destroy();$("#"+this.idn).data('mylsObject',null);app.destroyArray(this.dataSources);app.destroyArray(this.pivotSel);app.destroyArray(this.datas);app.destroyArray(this.options);this.objectChart=null;this.close();}};;class Kanban extends MylsObject{constructor(table,ext_id,view,mode,tHistory,viewMode,params){super(table,ext_id,view,mode,tHistory,viewMode,params);this.type='kanban';this.groups=[];this.container=$('#'+this.idn);}
async init(){await super.init();this.container.addClass('myls-kanban');this.group_col=this.columns.getColumnsByColumnType('group',true);this.cell_col=this.columns.getColumnsByColumnType('data',true);this.tableData=await app.processData('/kanban/tabledata','post',this.prepareTableData());const self=this;$.each(this.tableData,function(index,item){self.groups.push(item[self.group_col.dataField]);});this.groups=app.arrayUnique(groups);this.createKanban();this.createObject();}
createObject(){this.object={object:this.container,columns:this.columns.columns,tableInfo:this.tableInfo,menu:this.menu,type:'kanban',tHistory:this.tHistory,idn:this.idn,};$("#"+this.idn).data('mylsObject',this);}
createKanban(){const self=this;self.groups.forEach(function(group){self.createCols(group);});this.container.addClass("scrollable-board").dxScrollView({direction:"horizontal",showScrollbar:"always"});this.container.addClass("sortable-lists").dxSortable({filter:".list",itemOrientation:"horizontal",handle:".list-title",moveItemOnDrop:true});}
createCols(group){const self=this;const $list=$("<div>").addClass("list").appendTo(this.container);$("<div>").addClass("list-title").addClass("dx-theme-text-color").text(group).appendTo($list);let Data=this.tableData.filter(function(task){return task[self.group_col.dataField]===group});this.createCards(Data,$list);}
createCards(data,$list){const self=this;let $scroll=$("<div>").appendTo($list);let $items=$("<div>").appendTo($scroll);data.forEach(function(task){self.createCard(task,$items);});$scroll.addClass("scrollable-list").dxScrollView({direction:"vertical",showScrollbar:"always"});$items.addClass("sortable-cards").dxSortable({group:this.idn,moveItemOnDrop:true});}
createCard(task,$items){let $item=$("<div>").addClass("card").addClass("dx-card").addClass("dx-theme-text-color").addClass("dx-theme-background-color").appendTo($items);let cell=task[this.cell_col.dataField];$("<div>").addClass("card-priority").addClass("priority-"+this.cell_col.dataField).appendTo($item);$("<div>").addClass("card-subject").text(this.cell_col.caption).appendTo($item);$("<div>").addClass("card-assignee").text(cell).appendTo($item);}
destroy(){super.destroy();$("#"+this.idn).data('mylsObject',null);this.container=null;app.destroyArray(this.groups);this.close();}};;class Dashboard extends MylsObject{constructor(table,ext_id,view,mode,tHistory,viewMode,params){super(table,ext_id,view,mode,tHistory,viewMode,params);this.type='dashboard';this.dataSources={};this.objList=[];this.objFrames=[];this.allowSaveStorage=false;this.ext_id='';this.dashboardObjects=[];}
async init(){await super.init();this.oldFrames=await this.sendStorageRequest("storage","json","GET",false,this.table,[]);let tableTpl=JSON.parse(this.template);this.createlayout();this.frame=$('#'+this.idn+' .myls-dashboard-layout');this.fillConfig(tableTpl,this.frame);const self=this;$.each(this.objList,function(index,m){self.initItemDashboard(m);});$("#"+this.idn).data('mylsObject',this);}
async initItemDashboard(m){const self=this;let object;if(m.tableId){const addidn=app.getIdn(app.appInfo.tables[m.tableId].tableType,m.tableId,this.ext_id,'dashboard');$('#'+this.idn+'_'+m.dataField).append('<div id="'+addidn+'" class="myls-dashboard-item-inner"></div>');object=app.getObject(m.tableId,this.ext_id,'dashboard',app.appInfo.tables[m.tableId].tableType,this.mode,this.tHistory,'');object.init();}else if(m.dataType=='card'){let $tpl=await this.addCardContainer(m);if($tpl.find('object').length){const field=$tpl.find('object').attr('fieldname');object=app.getObject(self.columns.columns[field].tableId,'','dashboard',app.appInfo.tables[self.columns.columns[field].tableId].tableType,'upd',[],'compact');object.init();}}
this.dashboardObjects.push(object);}
async addCardContainer(m){let tableData=await this.loadLookupData(m);let template=this.columns.getFormattedCellValue('',m,tableData[0]);let $tpl=$(template);if($tpl.find('object').length){const field=$tpl.find('object').attr('fieldname');const idnObj=app.getIdn(app.appInfo.tables[this.columns.columns[field].tableId].tableType,this.columns.columns[field].tableId,'','dashboard');$tpl.find('object').attr("id",idnObj);template=$tpl.get(0);}
const $cardContainer=$("#"+this.idn+'_'+m.dataField);$cardContainer.append(template);$cardContainer.addClass('myls-dashboard-card');return $tpl;}
createlayout(){$('#'+this.idn).append('<div class="myls-dashboard-layout" data-table="'+this.table+'"></div>');$('#'+this.idn).dxScrollView({direction:"vertical",});}
createFrame(html,title,isClosable,dataField){let out='<div class="myls-frame" data-id="'+dataField+'">';out+='<div class="myls-frame-header">';out+='<div class="myls-frame-title">'+title;if(isClosable){out+='<i class="dx-icon dx-icon-close" data-tab="'+dataField+'"></i>';}
out+='</div>';out+='</div>';out+='<div class="myls-frame-body">'+html+'</div>';out+='</div>';return out;}
addFrame(type){let $html=$('<div class="myls-dashboard-'+type+'"></div>');this.frame.append($html);return $html;}
fillConfig(conf,frame){const self=this;$.each(conf,function(_,item){if(item.type!=='component'){let frame_new=self.createNewFrame(item);self.fillConfig(item.content,frame_new);}
if(item.hasOwnProperty("type")&&item.type=='component'){const column=self.getColumn(item,frame);if($.inArray(column.dataField,self.oldFrames)!==-1){let fff=frame.find('.myls-frame[data-id='+column.dataField+']');fff.hide(500,function(){if($('#bottomFrameTabs').length>0){}else{this.createBottomFrameTabs();}
self.addBottomFrameTab(fff);self.saveCurrentFrames();});}}});}
getColumn(item,frame){const column=this.columns.columns[item.componentName];if(item.hasOwnProperty("isClosable"))
item.isClosable=item.isClosable=='true'?true:false;else
item.isClosable=true;item.componentName='layout';item.title=app.translate.saveString(item.title?item.title:column.caption);item.componentState={'html':column.tableId?app.getObjectContainer(app.getIdn(app.appInfo.tables[column.tableId].tableType,column.tableId,this.ext_id,'dashboard')):'<div id="'+this.idn+'_'+column.dataField+'" class="h-100"></div>'};const htmlFrame=this.createFrame(item.componentState.html,item.title,item.isClosable,column.dataField);let frameItem=$(htmlFrame).appendTo(frame);if(item.style){frameItem.attr('style',item.style);}
if(item.class){frameItem.addClass(item.class);}
this.objList.push(column);this.objFrames.push(column.dataField);return column;}
createNewFrame(item){let frame_new=this.addFrame(item.type);if(item.style){frame_new.attr('style',item.style);}
if(item.class){frame_new.addClass(item.class);}
return frame_new;}
createBottomFrameTabs(){const self=this;if($('#bottomFrameTabs_'+table).length==0){$('#'+this.idn).prepend('<div id="bottomFrameTabs_'+this.table+'" class="bottom-dashbord-tabs"></div>');$("#bottomFrameTabs_"+this.table).dxTabs({noDataText:'',itemTemplate:function(itemData,itemIndex,element){element.text(itemData.text);},onItemClick:function(e){$('.myls-dashboard-layout').find('.myls-frame[data-id='+e.itemData.id+']').show(0,function(){self.closeBottomFrameTab(e.itemData.id);$(window).trigger('resize');self.saveCurrentFrames();});}}).dxTabs("instance");}}
addBottomFrameTab(currentFrame){let bottomFrameTabs=$('#bottomFrameTabs_'+this.table).dxTabs('instance');let tabItems=bottomFrameTabs.option('items');let isItem=false;$.each(tabItems,function(index,i){if(i.id==currentFrame.attr('data-id')){isItem=index;return false;}});if(isItem!==false){bottomFrameTabs.option('selectedIndex',isItem);}else{tabItems.push({id:currentFrame.attr('data-id'),text:currentFrame.find('.myls-frame-title').text(),});bottomFrameTabs.option('items',tabItems);this.saveCurrentFrames();}}
closeBottomFrameTab(id){if($('#bottomFrameTabs_'+this.table).length>0){let bottomFrameTabs=$('#bottomFrameTabs_'+this.table).dxTabs('instance');let tabItems=bottomFrameTabs.option('items');$.each(tabItems,function(index,i){if(i.id==id){tabItems.splice(index,1);if(tabItems.length>0){bottomFrameTabs.option('items',tabItems);}else{$('#bottomFrameTabs_'+table).remove();}
return false;}});this.saveCurrentFrames();}}
saveCurrentFrames(){const self=this;this.oldFrames=[];$(".myls-frame").each(function(index,item){if($(this).is(':hidden')){const idnx=$(this).attr('data-id');if($.inArray(idnx,self.oldFrames)===-1)
self.oldFrames.push(idnx);}});this.allowSaveStorage=true;}
destroy(){super.destroy();$("#"+this.idn).data('mylsObject',null);app.destroyArray(this.objList);app.destroyArray(this.objFrames);app.destroyArray(this.dataSources);app.destroyArray(this.oldFrames);app.destroyArray(this.dashboardObjects);this.frame=null;this.close();}};;class Form extends MylsEditableObject{constructor(table,ext_id,view,mode,tHistory,viewMode,params){super(table,ext_id,view,mode,tHistory,viewMode,params);this.type='form';this.popup=null;this.customFormObjects=['tagbox','treeview','image','colorbox','buttongroup','html','file','code'];this.objectValues={};this.initialMode=this.mode;this.forms=[];this.arrObjects=[];this.objectValues={};this.tableData={'0':[]};this.saveBtn={};this.saveAddBtn={};this.cancelBtn={};this.saveAndAdd=false;this.rawMode=this.mode;if(this.mode==='updins')
this.mode='upd';this.tData;this.idn=app.getIdn(this.type,this.table,this.ext_id,this.view);}
async init(){console.time(this.idn);this.formCreated=false;this.initData();this.dependencies=new Dependencies(this);this.selParams=await this.getSelParams();this.dataSource=this.createDataSource();this.loadPromise=this.getData();$("#"+this.idn).addClass("invisible");await Promise.all([this.loadPromise,this.setPopup(),this.createForm()]);this.dependencies=new Dependencies(this);this.dependencies.init(this,this.tableData);await Promise.all([this.setPopupTitle(),this.setDataToForm(),this.showFormButtons()]);this.afterLoad();console.timeEnd(this.idn);$("#"+this.idn).data('mylsObject',this);}
async getData(ext_id){const self=this;return new Promise(async(resolve,reject)=>{try{if(this.mode!='setup'){this.tData=app.processData('form/tabledata','post',this.prepareTableData(ext_id));}else this.tData={'0':[]};this.tableData=await this.tData;if(this.mode=='ins'){this.ext_id=this.tableData['ext_id'];this.updatedExtId[this.ext_id]=this.tableData['ext_id'];this.updatedExtField[this.ext_id]=this.tableData['ext_field'];}else{if(this.ext_id===undefined||this.ext_id===null)this.ext_id=this.tableData[0]['id'];this.updatedExtId[this.ext_id]=this.ext_id;this.updatedExtField[this.ext_id]=this.tableData['ext_field'];}
this.tableData=this.tableData[0];this.columns.convertDateTimeColumns(this.tableData);this.rawData=this.columns.getTableDataByColumns(this.tableData);if(this.mode=='ins'){if(this.tHistory.length&&this.updatedExtField[this.ext_id]==this.tHistory[this.tHistory.length-1].extField){this.tHistory[this.tHistory.length-1].extId=this.updatedExtId[this.ext_id];}
this.passHistoryValues(this.tableData);this.columns.setDefaultValues(this.tableData);this.passParamsValues(this.tableData);}
resolve();}catch(error){reject();}});}
async setPopup(){if(this.popup){if(this.template[0].width){this.popup.object.option("width",this.template[0].width);}
if(this.template[0].height){this.popup.object.option("height",this.template[0].height);}
if(this.tableInfo.name){let title=app.translate.saveString(this.tableInfo.name);this.popup.changeTitle(title);}
let infoBtn=$("#"+this.idn+"_info-button").dxButton({onClick:function(e){window.open(e.component.linkOut);}}).dxButton('instance');if(!this.tableInfo.description){infoBtn.option("visible",false);}else{infoBtn.linkOut=this.tableInfo.description;}}}
async afterLoad(){if(!this.saveAndAdd)
this.columns.setDataToColumns(this.tableData);await this.openFormDependencies();$("#"+this.idn).removeClass("invisible");this.firstData=app.cloneObject(this.tableData);}
async setPopupTitle(){if(this.popup){if(this.tableInfo.titleField&&this.tableData[this.tableInfo.titleField]){let title=this.popup.object.option("title");title+=' '+this.tableData[this.tableInfo.titleField];this.popup.changeTitle(title);}}}
async createForm(){const self=this;if(this.template[0].formtype=='tabs'){let tabs=[];$.each(this.template[0].items,function(index,value){tabs.push({'title':app.translate.saveString(value.title),'html':'<div id="'+self.idn+'-tab_'+index+'" class="myls-form-container"></div>'});});this.tabPanel=$("#"+this.idn).dxTabPanel({items:tabs,selectedIndex:0,repaintChangesOnly:true,showNavButtons:true,onSelectionChanged:(e)=>{if(!self.formCreated)return;const itemIndex=e.component.option('selectedIndex');const tabId=self.idn+'-tab_'+itemIndex;if($('#'+tabId).children().length===0)
self.processTab(self.template[0].items[itemIndex],tabId,self.template[0].items[itemIndex].tabcontent,itemIndex);}}).dxTabPanel('instance');$.each(self.template[0].items,function(index,value){self.tabPanel.option('selectedIndex',index);const tabId=self.idn+'-tab_'+index;if(value.tabcontent=='form'||index===0)
self.processTab(value,tabId,value.tabcontent,index);});this.tabPanel.option('selectedIndex',0);}else{this.processTab(self.template[0],this.idn,'form',null);}
this.formCreated=true;$('#'+this.idn+' .dx-box-flex[style*="flex-direction: row"] > .dx-box-item').addClass(' myls-flex-grow-1');}
async processTab(form,tabId,tabcontent,tabIndex){if(tabcontent=='object'){const column=this.columns.columns[form.items[0].dataField];let idx=app.getIdn(form.items[0].objectType,column.tableId,this.tableData[column.extField],'popup');if($("#"+tabId).is("#"+idx)){let i=0;while(i<10){if(!$("#"+tabId).is("#"+idx+i)){idx=idx+i;break;}
i++;}}
const selParams=this.getSelParamsForObject(column.tableId);$("#"+tabId).append(app.getObjectContainer(idx));let obj=app.getObject(column.tableId,this.tableData[column.extField],"popup",form.items[0].objectType,'sel',app.addHistory(column.extTargetField?column.extTargetField:column.extField,this.tableData[column.extField],this.idn,this.tHistory,this.initialMode),'compact',selParams);this.initExternalObject(obj,column,tabIndex);this.columns.setDataDependenciesFromObject(column,obj.selParams);column.editor=obj;column.customEditor=true;column.customSave=true;}
if(tabcontent=='form'){$("#"+tabId).append('<div id="'+tabId+'-scroll"></div>');$("#"+tabId+'-scroll').append('<div id="'+tabId+'-scroll_content"></div>');let addForm=$("#"+tabId+'-scroll_content').dxForm({items:[],readOnly:false,showColonAfterLabel:true,labelLocation:"top",colCount:1,}).dxForm("instance");addForm.mylsInit=true;addForm.mylsTab=tabIndex;if(form.items!==undefined){this.processFormItemsFormats(form.items,"",addForm);this.processFormItemsTemplates(form.items,tabId,addForm,tabIndex);}
addForm.option("items",form.items);$("#"+tabId+'-scroll_content .myls-all-space-height').closest('.dx-box-item').addClass('myls-flex-grow-1');$("#"+tabId+'-scroll_content .dx-field-item.h-100').closest('.dx-item.dx-box-item').addClass("h-100");this.forms.push(addForm);const scrollViewWidget=$("#"+tabId+'-scroll').dxScrollView({scrollByContent:true,scrollByThumb:true,showScrollbar:"always",}).dxScrollView("instance");}}
async initExternalObject(obj,column,tabIndex){const self=this;obj.changed=()=>{self.fieldChanged(column);};await obj.init();obj.formTabIndex=tabIndex;this.arrObjects.push(obj);}
async processFormItemsTemplates(form,tabId,formObj,tabIndex){const self=this;$.each(form,function(key,item){if(item.hasOwnProperty("label")&&item.label.hasOwnProperty("text")&&item.label.text=='')
item.label.visible=false;if(item.hasOwnProperty("objectType")){if(app.objectTypes.indexOf(item.objectType)!=-1){item.template=function(itemData,itemElement){self.createObjectTemplate(itemData,item,itemElement,tabIndex);};}
if(item.objectType=='image'||item.objectType=='file'){item.template=function(itemData,itemElement){self.createFileTemplate(itemData,itemElement,tabId,item,item.objectType);};}
if(item.objectType=='treeview'){item.template=function(itemData,itemElement){const column=self.columns.columns[itemData.dataField];if(column!==undefined){column.element=$(itemElement).closest('.dx-item');const idnf=tabId+'_'+itemData.dataField+'_treeview';itemElement.append('<div id="'+idnf+'" class="myls-treeView"></div>');self.initTreeView(idnf,column);}};}
if(item.objectType=='colorbox'){item.template=function(itemData,itemElement){self.createColorBoxTemplate(itemData,tabId,itemElement);};}
if(item.objectType=='tagbox'){item.template=function(itemData,itemElement){const column=self.columns.columns[itemData.dataField];if(column!==undefined){column.element=$(itemElement).closest('.dx-item');const idnf=tabId+'_'+itemData.dataField+'_tagbox';itemElement.append('<div id="'+idnf+'" class="tagBox"></div>');self.initTagBox(idnf,column,item,formObj);}};}
if(item.objectType=='buttongroup'){item.template=function(itemData,itemElement){const column=self.columns.columns[itemData.dataField];if(column!==undefined){const idnf=tabId+'_'+itemData.dataField+'_buttongroup';itemElement.append('<div id="'+idnf+'" class="buttonGroup"></div>');column.element=$(itemElement).closest('.dx-item');self.initButtonGroup(idnf,column,item);}};}
if(item.objectType=='label'){item.template=function(itemData,itemElement){itemElement.append('<div>'+item.text+'</div>');};}
if(item.objectType=='button'){item.template=function(itemData,itemElement){const column=self.columns.columns[itemData.dataField];if(column)
column.element=$(itemElement).closest('.dx-item');self.initButton(itemElement,column,item);};}
if(item.objectType=='html'){item.template=function(itemData,itemElement){const idnf=tabId+'_'+itemData.dataField+'_html';const column=self.columns.columns[itemData.dataField];column.element=$(itemElement).closest('.dx-item');itemElement.append('<div id="'+idnf+'" class="myls-html"></div>');self.initHtml(idnf,column,item);};}
if(item.objectType=='code'){item.template=function(itemData,itemElement){const idnf=tabId+'_'+itemData.dataField+'_code';const column=self.columns.columns[itemData.dataField];column.element=$(itemElement).closest('.dx-item');itemElement.append('<div id="'+idnf+'" class="myls-code"></div>');self.initCodeEditor(idnf,column,item);};}}
if(item.hasOwnProperty("items"))
self.processFormItemsTemplates(item.items,tabId,formObj,tabIndex);if(item.hasOwnProperty("tabs"))
self.processFormItemsTemplates(item.tabs,tabId,formObj,tabIndex);});}
async createColorBoxTemplate(itemData,tabId,itemElement){const self=this;await this.loadPromise;const column=this.columns.columns[itemData.dataField];if(column!==undefined){column.element=$(itemElement).closest('.dx-item');column.customEditor=true;const idnf=tabId+'_'+itemData.dataField+'_colorbox';const value=(this.tableData[column.dataField]==null)?'':this.tableData[column.dataField];itemElement.append('<input id="'+idnf+'" class="myls-colorbox" type="text" value="'+value+'" />');let palette=[];for(let i=20;i<=90;i+=8){let p=[];$.each(['hsl 5 99','hsl 21 98','hsl 36 98','hsl 47 97','hsl 60 99','hsl 73 67','hsl 95 56','hsl 197 49','hsl 224 99','hsl 251 71','hsl 286 99','hsl 334 81'],function(index,item){p.push(item+' '+i);});palette.push(p);}
column.editor=$('#'+idnf);$('#'+idnf).spectrum({showPalette:true,allowEmpty:true,showSelectionPalette:true,maxSelectionSize:22,palette:palette,change:function(color){column.changed=true;if(color)
self.tableData[column.dataField]=color.toHexString();else
self.tableData[column.dataField]=null;if(self.saveBtn)
self.saveBtn.option('disabled',false);}});}}
processFormItemsFormats(form,path,formObj){const self=this;let curPath=path;app.translate.saveTranslateForm(form);$.each(form,function(key,it){if(form[key].hasOwnProperty("items")||form[key].hasOwnProperty("tabs")){if(form[key].itemType&&form[key].itemType=='group'){form[key].name=app.create_UUID();curPath=path+form[key].name+'.';}}else if(form[key].hasOwnProperty("editorType")||form[key].hasOwnProperty("objectType")){const column=self.columns.columns[form[key].dataField];form[key].visible=true;if(column){column.visible=true;column.form=formObj;const validationRules=self.dependencies.getValidationRules(column);if(validationRules){form[key].validationRules=validationRules;column.validationRules=JSON.stringify(validationRules);}else
column.validationRules=JSON.stringify([]);}
if(column&&path)
column.path=path;if(form[key].hasOwnProperty("editorType")){form[key].editorOptions.readOnly=!column.allowEditing;if(form[key].editorType=='dxTextBox'){if(column.pattern&&self.tableData[column.dataField]!=''&&self.tableData[column.dataField]!=null){if(!form[key].editorOptions.buttons)
form[key].editorOptions.buttons=[];self.addButtons(form[key].editorOptions.buttons,['clear',self.getButtonLink(column,self.tableData[column.dataField])]);}
form[key].editorOptions.onInitialized=function(e){self.initializeEditor(e,column);};form[key].editorOptions.onDisposing=function(e){self.disposeEditor(column);};form[key].editorOptions.onValueChanged=function(e){if(e.value)
e.component.option('value',e.value.trim());self.setPatternButtons(column,e);};}
if(form[key].editorType=='dxNumberBox'){form[key].editorOptions.onInitialized=function(e){self.initializeEditor(e,column,'myls-form-number');let buttons=[];self.addButtons(buttons,['clear']);e.component.option('buttons',buttons);};form[key].editorOptions.onDisposing=function(e){self.disposeEditor(column);};if(column.format.precision!==undefined&&column.format.precision!="0"){form[key].editorOptions.format='#,##0';form[key].editorOptions.format+='.'+'0'.repeat(column.format.precision);}
if(column.format.precision===undefined||column.format.precision=="0"){form[key].editorOptions.format='#,##0';}
if(column.format.postCaption!==undefined){form[key].editorOptions.format+=column.format.postCaption;}}
if(form[key].editorType=='dxTextArea'){form[key].editorOptions.onInitialized=function(e){self.initializeEditor(e,column);};form[key].editorOptions.onDisposing=function(e){self.disposeEditor(column);};}
if(form[key].editorType=='dxCheckBox'){form[key].editorOptions.onInitialized=function(e){self.initializeEditor(e,column);};form[key].editorOptions.onDisposing=function(e){self.disposeEditor(column);};}
if(form[key].editorType=='dxRadioGroup'){if(column!==undefined){if(column.id!==undefined&&column.id!==null){self.initRadioGroup(form[key],column,formObj);}}}
if(form[key].editorType=='dxSelectBox'){if(column!==undefined){if(column.id!==undefined&&column.id!==null){self.initSelectBox(form[key],column,formObj);}}}
if(form[key].editorType=='dxLookup'){form[key].editorType='dxSelectBox';if(column!==undefined){if(column.id!==undefined&&column.id!==null){self.initLookup(form[key],column,formObj);}}}
if(form[key].editorType=='dxTagBox'){if(column!==undefined){if(column.id!==undefined&&column.id!==null){form[key].name=column.dataField;}}}
if(form[key].editorType=='dxDateBox'){form[key].editorOptions.onInitialized=function(e){let addClass='myls-form-date';if(form[key].dataType=='datetime')
addClass='myls-form-datetime';if(form[key].dataType=='time')
addClass='myls-form-time';self.initializeEditor(e,column,addClass);};form[key].editorOptions.onDisposing=function(e){self.disposeEditor(column);};}
if(form[key].editorType=='dxDateBox'&&form[key].dataType=='date'){form[key].editorOptions.displayFormat='dd.MM.y';form[key].editorOptions.dateSerializationFormat='yyyy-MM-dd';form[key].editorOptions.type='date';}
if(form[key].editorType=='dxDateBox'&&form[key].dataType=='datetime'){form[key].editorOptions.displayFormat='dd.MM.y HH:mm';form[key].editorOptions.dateSerializationFormat="yyyy-MM-ddTHH:mm:ssx";form[key].editorOptions.type='datetime';}
if(form[key].editorType=='dxDateBox'&&form[key].dataType=='time'){form[key].editorOptions.displayFormat='HH:mm';form[key].editorOptions.dateSerializationFormat="yyyy-MM-ddTHH:mm:ssx";form[key].editorOptions.type='time';}}}
if(form[key].hasOwnProperty("items")){self.processFormItemsFormats(form[key].items,curPath,formObj);}
if(form[key].hasOwnProperty("tabs")){self.processFormItemsFormats(form[key].tabs,curPath,formObj);}});}
async createObjectTemplate(itemData,item,itemElement,tabIndex){const self=this;const column=this.columns.columns[itemData.dataField];if(column!==undefined){column.element=$(itemElement).closest('.dx-item');this.loadPromise.then(()=>{const ext_id=self.tableData[column.extField];const tableId=column.tableId;const idnObject=app.getIdn(item.objectType,tableId,ext_id,'popup');itemElement.append(app.getObjectContainer(idnObject));if(item.hasOwnProperty("height")){$('#'+idnObject).css("height",item.height);}
const selParams=self.getSelParamsForObject(tableId);let obj=app.getObject(tableId,ext_id,"popup",item.objectType,'sel',app.addHistory(column.extTargetField?column.extTargetField:column.extField,ext_id,self.idn,self.tHistory,self.initialMode),'compact',selParams);self.initExternalObject(obj,column,tabIndex).then(()=>{self.columns.setDataDependenciesFromObject(column,obj.selParams);});column.editor=obj;column.customEditor=true;column.customSave=true;});}}
getSelParamsForObject(tableId){const selParams={};for(let param of app.appInfo.tables[tableId].selParams){if(this.tableData.hasOwnProperty(param)){selParams[param]=this.tableData[param];}}
return selParams;}
createFileTemplate(itemData,itemElement,tabId,item,fileType){const self=this;const idn=tabId+'_'+item.dataField+'_file';const column=self.columns.columns[itemData.dataField];column.element=$(itemElement).closest('.dx-item');column.elementIdn=idn;const params=this.getImageParams(column);let url="documents/fileupload?field="+idn;if(params)
url+="&params="+params;this.loadPromise.then(()=>{column.objectType=fileType;itemElement.append(`<div id="${idn}"  class="myls-form-file-container" myls-field="${item.dataField}"><div id="${tabId}_${item.dataField}_fileuploader"></div><div id="selected-files"></div></div>`);column.editor=$("#"+idn+'uploader').dxFileUploader({multiple:false,accept:fileType==='image'?'image/*':'*',uploadMode:"instantly",uploadUrl:url,name:idn,showFileList:false,onUploaded:fileUploaded,}).dxFileUploader("instance");$("#"+tabId+'_'+item.dataField+'_fileuploader .dx-fileuploader-button').addClass("order-1 mt-2 d-block dx-button-default dx-button-mode-outlined");$("#"+tabId+'_'+item.dataField+'_fileuploader .dx-fileuploader-button').removeClass("dx-button-normal dx-button-mode-contained");$("#"+tabId+'_'+item.dataField+'_fileuploader .dx-fileuploader-input-wrapper').addClass("d-flex flex-column p-0 mt-2 border-0");$("#"+tabId+'_'+item.dataField+'_fileuploader .dx-fileuploader-input-container').addClass('d-flex justify-content-center');$("#"+tabId+'_'+item.dataField+'_fileuploader .dx-fileuploader-input').addClass('d-none');$("#"+tabId+'_'+item.dataField+'_fileuploader .dx-fileuploader-input-label').addClass("d-none");self.refreshFileTemplate(column);});function fileUploaded(e){const filename=$.parseJSON(e.request.response);if(filename!==''){self.tableData[$('#'+idn).attr('myls-field')]=filename;if(column.extField){if(app.hasValue(self.columns.columns[column.extField]))
self.setFieldValue(null,self.columns.columns[column.extField],e.file.name);}
self.refreshFileTemplate(column);}}}
getFileTemplate(column){if(!this.tableData)return null;const filename=this.tableData[column.dataField];const idn=column.elementIdn;if(filename){if(column.objectType==='image'){return`<img class="myls-field-image"  src="files/${filename}" /><div id="${idn}-buttonDeleteFile"></div>`;}
if(column.objectType==='file'){return`<a href="files/${filename}" target="_blank" id="${idn}-link"  class="myls-field-image"><img class="myls-form-file-image" id="${idn}-image" src="img/document.svg"/></a><div id="${idn}-buttonDeleteFile"></div>`;}}else
return`<img  id="${idn}-image" src="img/file_empty.svg" class="myls-empty-image"/>`;}
refreshFileTemplate(column){const idn=column.elementIdn;$('#'+idn+' .myls-field-image').remove();$('#'+idn+' .myls-empty-image').remove();$('#'+idn+'-link').remove();$('#'+idn+'-buttonDeleteFile').remove();$("#"+idn+'uploader .dx-fileuploader-input-container').append(this.getFileTemplate(column));this.createFileDeleteButton(column);}
createFileDeleteButton(column){const self=this;if(this.tableData&&this.tableData[column.dataField])
$('#'+column.elementIdn+'-buttonDeleteFile').dxButton({icon:"clear",onClick:function(){self.tableData[column.dataField]=null;if(column.extField){self.tableData[column.extField]=null;self.setFieldValue(null,self.columns.columns[column.extField],null);}
self.refreshFileTemplate(column);}});}
async initTreeView(item,column,form){const self=this;const data=this.initLookupDataSource(column,form,this.deps);const syncTreeViewSelection=function(treeView,value){if(!value){treeView.unselectAll();return;}
value.forEach(function(key){treeView.selectItem(key);});};const dropdown=$("#"+item).dxDropDownBox({valueExpr:"id",displayExpr:"item",dataSource:data,contentTemplate:function(e){let value=e.component.option("value");const treeview=$('<div id="'+item+'_treeview"></div>').dxTreeView({dataSource:e.component.option("dataSource"),dataStructure:"plain",showCheckBoxesMode:"selectAll",parentIdExpr:"parent_id",keyExpr:"id",displayExpr:"item",valueExpr:"item",onContentReady:function(args){syncTreeViewSelection(args.component,value);},onInitialized:function(e){self.initializeEditor(e,column);column.editor=dropdown;},onDisposing:function(e){self.disposeEditor(column);},onSelectionChanged:function(et){column.changed=true;let tags=[];let items=et.component.option('items');$.each(items,function(index,item){if(item.selected==true){tags.push(self.getCheckParent(items,index));}});var curr='';var res=[];$.each(tags,function(index,item){if(item.id!==curr){res.push(item.id);curr=item.id;}});res=res.filter(function(item,pos){return res.indexOf(item)==pos;});e.component.option("value",res);column.changed=true;self.validateCustomEditor(e,column);}});return treeview;}}).dxDropDownBox('instance');column.editor=dropdown;column.customSave=true;}
initLookupValues(column){let params={};let v=[];if(column.hasOwnProperty('dependencies')&&column.dependencies.hasOwnProperty('data')&&this.tableData)
params=this.getParams(column.dependencies.data,this.tableData);if(column.hasOwnProperty('extField'))
params['ext_id']=this.tableData[column.extField];app.addConfigParams(params);return app.processData('form/getlookupvalues','post',{'id':column.id,'params':JSON.stringify(params),'isTabler':this.tableInfo.isTabler});}
initializeEditor(e,column,addClass){column.editor=e.component;column.element=$(e.element).closest('.dx-item');if(addClass&&column.element){$(column.element).addClass(addClass);}
if(DEBUG)
console.log(`initialize ${column.dataField}`);}
disposeEditor(column){column.editor=null;if(DEBUG)
console.log(`dispose ${column.dataField}`);}
validateCustomEditor(e,column){let isValid=true;if(!column||!e)return isValid;if(column.toClear)return true;if(column.required){if(column.required[0]!='='||(column.required[0]=='=')){let isEmpty=false;const component=(e.component)?e.component:e;switch(column.dataType){case'tagbox':isEmpty=component.option('value').length==0;break;case'buttongroup':isEmpty=component.option('selectedItemKeys').length==0;break;default:isEmpty=component.option('value')!==null&&component.option('value')!==undefined&&component.option('value')!=='';}
if(isEmpty){component.option({validationError:{message:app.translate.saveString("Поле необходимо заполнить")},isValid:false});isValid=false;}else
component.option({isValid:true});}}
return isValid;}
initTagBox(item,column,formItem,form){const self=this;column.customEditor=true;column.customSave=true;column.editor=$("#"+item).dxTagBox({dataSource:this.initLookupDataSource(column,form,this.deps),value:[],displayExpr:'item',valueExpr:'id',acceptCustomValue:column.canAdd,searchEnabled:true,showSelectionControls:true,showClearButton:true,showDropDownButton:true,onOpened:getTagboxOnOpened,onKeyUp:getTagboxOnKeyUp,onFocusOut:(e)=>{if(column.canAdd){const text=e.component.option('text');if(text){const isFind=self.findInDataSource(text,e.component.option('items'));if(isFind==-1)
self.addNewLookupItem(e,column,text);}}},onValueChanged:function(e){column.changed=true;self.setButtonsVisible(e,column);self.validateCustomEditor(e,column);},onInitialized:function(e){self.initializeEditor(e,column);e.component.option('buttons',self.getLookupButtons(e,column));},onDisposing:function(e){self.disposeEditor(column);},dropDownButtonTemplate:(data,element)=>{self.getDropDownButtonTemplate(data,element,column);},onContentReady:(e)=>{self.initAddButton(e,column);},onCustomItemCreating:(e)=>{self.getOnCustomItemCreating(e,column);}}).dxTagBox('instance');setTagboxItemTemplate();setTagboxTagTemplate();if(formItem.grouped){column.editor.option('grouped',true);column.editor.getDataSource().group("category");column.editor.getDataSource().paginate(false);}
function getTagboxOnOpened(e){let toolbarItems=[];toolbarItems.push({location:"center",toolbar:"bottom",html:'<span class="myls-lookup-cancel">'+app.translate.saveString("Закрыть")+'</span></div>',onClick:function(el){e.component.option('text','');e.component.close(self.ext_id);}});if(column.canAdd){toolbarItems.push({location:"before",toolbar:"bottom",html:'<span class="myls-lookup-addnewvalue hidden" id="'+self.idn+'_'+column.id+'_linkadd"></span>',onClick:async function(el){await self.addNewLookupItem(e,column,e.component.option('text').toString().trim());}});}
e.component._popup.option("toolbarItems",toolbarItems);}
function setTagboxItemTemplate(){if(column.template){column.editor.option('itemTemplate',function(data){return self.columns.getFormattedCellValue(null,column,data);});}else column.editor.option('itemTemplate',function(data){if(data.hasOwnProperty('color')&&data.color!==null&&data.color!==undefined)
return`<span class='myls-colored-value ${$.Color(data.color).contrastColor()}' style='background-color: ${data.color}'>${data.item}</span>`;else return data.item;});}
function setTagboxTagTemplate(){column.editor.option('tagTemplate',function(data){if(data.hasOwnProperty('color')&&data.color!==null&&data.color!==undefined)
return $("<div />").addClass("dx-tag-content").css('background-color',data.color).append($("<span />").text(data.item).addClass($.Color(data.color).contrastColor()),$("<div />").addClass("dx-tag-remove-button"));else return $("<div />").addClass("dx-tag-content").append($("<span />").text(data.item),$("<div />").addClass("dx-tag-remove-button"));});}
function getTagboxOnKeyUp(e){self.setButtonsVisible(e,column);}}
updateTagBox(){const self=this;const result=[];$.each(this.columns.columns,function(index,item){if((item.dataType=='tagbox'||item.dataType=='treeview'||item.dataType=='buttongroup')&&item.changed){var params={};params.id=item.id;params.ext_id=self.tableData[item.extField];params.isTabler=self.tableInfo.isTabler;if(item.oldValues===undefined)item.oldValues=[];params.oldValues=JSON.stringify(item.oldValues);if(item.dataType=='buttongroup')
params.values=JSON.stringify(item.editor.option('selectedItemKeys'));else
params.values=JSON.stringify(item.editor.option('value'));result.push(app.processData('form/updatetagbox','post',params));}});return result;}
async addNewLookupItem(e,column,searchText){const self=this;if(searchText&&column.canAdd&&!column.adding){column.adding=true;if(await app.dialog.confirm(this.idn,app.translate.saveString('Добавить новое значение')+' "'+searchText+'"?',app.translate.saveString('Новое значение'))){const values={'item':searchText};e.component.close();if(column.extFormId){await self.editInExternalForm(column,-1,'ins',searchText);}else{this.inlineAddNewValue(column,values,e);}}else
e.component.option("value",null);e.component.close();column.adding=false;}}
inlineAddNewValue(column,values,e){const self=this;if(column.insertConditions&&column.insertConditions.length>1){$.each(column.insertConditions,function(_,item){if(item!=='item'){values[item]=self.getFieldValue(item);}});}
$.ajax({type:"post",cache:false,url:"form/insertlookup",data:({'id':column.id,'params':values,'isTabler':this.tableInfo.isTabler}),success:function(data){var res=$.parseJSON(data);if(Object.keys(res).length!==0){self.reloadColumn(column);if(e.component.NAME=='dxSelectBox'){e.component.option("value",res[Object.keys(res)[0]]);}else{const opt=e.component.option("value");opt.pop();opt.push(res[Object.keys(res)[0]]);e.component.option("value",opt);}
e.component.close();}}});}
getExtFormParams(extFormField,searchText){const self=this;let params={};const re=/\s*,\s*/;const parts=extFormField.split(re);$.each(parts,(index,item)=>{const re=/\s*=>\s*/;const fields=item.split(re);if(fields.length==2){params[fields[1]]=self.tableData[fields[0]];}
if(fields.length==1){params[fields[0]]=searchText;}});return params;}
async initButtonGroup(item,column){const self=this;column.customEditor=true;column.customSave=true;column.element=$(item).closest('.dx-item');column.editor=$("#"+item).dxButtonGroup({items:[],keyExpr:"id",stylingMode:"outlined",selectionMode:"multiple",selectedItemKeys:[],onSelectionChanged:function(e){column.changed=true;self.validateCustomEditor(e,column);},onInitialized:function(e){self.initializeEditor(e,column);},onDisposing:function(e){self.disposeEditor(column);}}).dxButtonGroup('instance');let items=await self.loadLookupData(column);$.each(items,function(index,el){el.text=el.item;el.type='success';});if(!column.toClear)
column.editor.option("items",items);}
async initButton(item,column,form){const self=this;$(item).dxButton({stylingMode:"outlined",text:form.caption,type:"default",elementAttr:{class:"myls-form-button"+(form.cssClass?" "+form.cssClass:'')},onClick:function(){self.dependencies.init(null,self.tableData);if(form.openForm&&form.openForm.tableId){self.buttonOpenForm(form);}
if(form.openReport&&form.openReport.reportId){self.buttonOpenReport(form);}
if(form.execProc&&form.execProc.proc){self.buttonExecProc(form);}
if(form.sendUserInvitation){self.buttonRegUser(form);}}});}
async buttonOpenReport(form){const self=this;try{await this.save(this.ext_id);const params={};const pr=[];if(form.openReport.params){$.each(form.openReport.params,async function(index,param){const promise=self.dependencies.doCondition('='+param);pr.push(promise);params[index]=await promise;});await Promise.all(pr);}
const data={};data['id']=form.openReport.reportId;data['params']=params;window.location.href='site/pdf?id='+form.openReport.reportId+'&params='+JSON.stringify(params);}catch(error){this.disableButtons(false);}}
async buttonOpenForm(form){try{await this.save(this.ext_id);if(form.openForm.extId){const extId=await this.dependencies.doCondition(form.openForm.extId);if(extId){await app.openPopup(form.openForm.tableId,extId,'form','updins',app.addHistory(null,extId,this.idn,this.tHistory,'upd'));}else{await app.dialog.showError(this.idn,app.translate.saveString(form.openForm.errorMsg));}}}catch(error){this.processResult(error);this.disableButtons(false);}}
async buttonRegUser(form){try{await this.save(this.ext_id);const result=await app.processData('site/regbyuserurl','get',{'user_id':this.ext_id});if(result&&result.success){await app.dialog.showInfo(this.idn,app.translate.saveString('Приглашение отправлено пользователю на почту'));}}catch(error){this.processResult(error);this.disableButtons(false);}}
async buttonExecProc(form){try{await this.save(this.ext_id);if(form.execProc.proc){const proc=await this.dependencies.doCondition(`='${form.execProc.proc}'`,undefined,false);if(proc){const result=await app.processData('form/getdbdata','post',{'proc':proc,'geterror':true});this.processResult(result);if(form.execProc.reload=='reload'){this.reloadData('upd');}}else{await app.dialog.showError(this.idn,app.translate.saveString('Не указана процедура'));}}}catch(error){this.processResult(error);this.disableButtons(false);}}
async openFormDependencies(){const self=this;let pr=[];if(DEBUG)
console.time('openFormDependencies');this.setRequiredClass();pr=[];$.each(self.columns.columns,async(_,column)=>{if(column.form){self.dependencies.init(column.form,self.tableData);pr.push(self.dependencies.setFieldVisible(column));pr.push(self.dependencies.setFieldCaption(column));pr.push(self.dependencies.setFieldEditable(column));if(self.mode=='ins'||self.mode=='updins'){pr.push(self.dependencies.setFieldValue(column));}}});await Promise.all(pr);if(DEBUG)
console.timeEnd('openFormDependencies');}
addButtons(buttons,btnArr){if(buttons){$.each(btnArr,function(index,item){if(item)
buttons.push(item);});}}
getButtonLink(column,data){let pref='',icon='';if(column.pattern=='url'){pref='';icon='globe';}
if(column.pattern=='email'){pref='mailto:';icon='email';}
if(column.pattern=='phone'){pref='tel:';icon='tel';}
if(pref==''&&icon=='')
return null;const btn={location:"after",name:"Link",elementAttr:{class:"myls-editor-btn"},options:{dataField:data,icon:icon,pref:pref,onClick:function(e){if(e.component.option('dataField')!=''){if(column.pattern=='url'){const pattern=/^((http|https|ftp):\/\/)/;let url=e.component.option('pref')+e.component.option('dataField');if(!pattern.test(url)){url="http://"+url;}
window.open(url,'_blank');}else{window.location.href=e.component.option('pref')+e.component.option('dataField');}}}}};return btn;}
setPatternButtons(column,e){let buttons=['clear'];const value=this.tableData[column.dataField]?this.tableData[column.dataField].trim():this.tableData[column.dataField];if(column.pattern&&value){let currPattern='';switch(column.pattern){case'email':currPattern=app.patterns.mail_form;break;case'phone':currPattern=app.patterns.phone_form;break;case'url':currPattern=app.patterns.url_form;break;}
if(currPattern){const currRes=currPattern.test(value);if(currRes){buttons.push(this.getButtonLink(column,value));}}}
e.component.option('buttons',buttons);}
initLookup(item,column,form){const self=this;item.editorOptions.dataSource=this.initLookupDataSource(column,form,this.deps);item.editorOptions.showPopupTitle=false;item.editorOptions.dropDownOptions={showTitle:false}
if(item.grouped){item.editorOptions.grouped=true;item.editorOptions.dataSource.group="category";item.editorOptions.dataSource.paginate=false;}
setLookupItemTemplate();item.editorOptions.dropDownButtonTemplate=(data,element)=>{self.getDropDownButtonTemplate(data,element,column);};item.editorOptions.fieldTemplate=getLookupFieldTemplate;item.editorOptions.closeOnOutsideClick=true;item.editorOptions.showClearButton=true;item.editorOptions.displayExpr='item';item.editorOptions.searchExpr='item';item.editorOptions.searchEnabled=true;item.editorOptions.valueExpr='id';item.editorOptions.keyExpr='id';if(column.canAdd){item.editorOptions.acceptCustomValue=true;item.editorOptions.onCustomItemCreating=(e)=>{self.getOnCustomItemCreating(e,column);};}
item.editorOptions.onInitialized=function(e){e.component.option('buttons',self.getLookupButtons(e,column));self.initializeEditor(e,column);};item.editorOptions.onDisposing=function(e){self.disposeEditor(column);};item.editorOptions.onValueChanged=function(e){self.setButtonsVisible(e,column);};item.editorOptions.onItemClick=(e)=>{self.initAddButton(e,column,e.itemData.item);};item.editorOptions.onOptionChanged=function(e){if(e.name==="text"||e.name==='selectedItem'){self.initMoreButton(e,column);const customAddBtn=e.component.getButton("Add");if(customAddBtn)customAddBtn.mylsCurrValue=e.value;}};item.editorOptions.onContentReady=function(e){self.initAddButton(e,column);};function getLookupFieldTemplate(selectedItem,container){let template=$("<div class='d-flex'/>").append(selectedItem&&selectedItem.hasOwnProperty('color')?$(`<span class="myls-lookup-color  flex-grow-0" style="background-color:${selectedItem.color}"/>`):'',$("<div class='myls-lookup-textbox flex-grow-1'/>"));let value=null;if(selectedItem)value=selectedItem.item;template.find(".myls-lookup-textbox").dxTextBox({value:value});container.append(template);}
function setLookupItemTemplate(){if(column.template){item.editorOptions.itemTemplate=function(data){return self.columns.getFormattedCellValue(null,column,data);};}else item.editorOptions.itemTemplate=function(data){if(data.hasOwnProperty('color')&&data.color!==null&&data.color!==undefined)
return`<span class='myls-colored-value ${$.Color(data.color).contrastColor()}' style='background-color: ${data.color}'>${data.item}</span>`;else return data.item;};}}
getOnCustomItemCreating(e,column){if(!e.customItem){e.customItem=e.text;}
if(e.text){const isFind=this.findInDataSource(e.text,column.items);if(isFind==-1)
this.addNewLookupItem(e,column,e.text);}}
getLookupButtons(e,column){const btns=['clear'];if(column.canAdd)btns.push(this.getAddButtonOptions(e,column));if(column.extFormId)btns.push(this.getMoreButtonOptions(e,column));btns.push('dropDown');return btns;}
getDropDownButtonTemplate(data,element,column){const $loadIndicator=$("<div>").dxLoadIndicator({visible:false}),$dropDownButton=$("<div>",{class:"dx-dropdowneditor-icon"});$(element).append($loadIndicator,$dropDownButton);column.loadIndicator=$loadIndicator.dxLoadIndicator('instance');column.dropDownButton=$dropDownButton;}
setButtonsVisible(e,column){this.initMoreButton(e,column);this.initAddButton(e,column);}
initMoreButton(e,column){let customBtn=e.component.getButton("More");if(customBtn){customBtn.option("visible",false);if(column.extFormId){const currValue=e.component.option('value');customBtn.mylsCurrValue=currValue;if(currValue){customBtn.option("visible",true);}}}}
initAddButton(e,column,currText=''){const customAddBtn=e.component.getButton("Add");const customMoreBtn=e.component.getButton("More");if(customAddBtn||customMoreBtn){if(customAddBtn){customAddBtn.option("visible",false);}
if(customMoreBtn)
customMoreBtn.option("visible",false);if(!currText)currText=e.component.option("text");if(currText&&typeof currText=='string')
currText=currText.trim();else
currText=undefined;let isFind=-1;if(currText)
isFind=this.findInDataSource(currText,column.items);if(customAddBtn){customAddBtn.option("visible",currText&&(isFind===-1)&&column.canAdd);customAddBtn.mylsCurrValue=currText;}
if(customMoreBtn)
customMoreBtn.option("visible",currText&&(isFind!==-1));}}
initRadioGroup(item,column,form){const self=this;item.editorOptions.dataSource=this.initLookupDataSource(column,form,this.deps);item.editorOptions.displayExpr='item';item.editorOptions.onInitialized=function(e){self.initializeEditor(e,column);};item.editorOptions.onDisposing=function(e){self.disposeEditor(column);};}
initSelectBox(item,column,form){const self=this;item.editorOptions.dataSource=this.initLookupDataSource(column,form,this.deps);if(item.grouped){item.editorOptions.grouped=true;item.editorOptions.dataSource.group="category";item.editorOptions.dataSource.paginate=false;}
item.editorOptions.displayExpr='item';item.editorOptions.onInitialized=function(e){self.initializeEditor(e,column);};item.editorOptions.onDisposing=function(e){self.disposeEditor(column);};if(column.template){item.editorOptions.itemTemplate=function(data){return self.columns.getFormattedCellValue(null,column,data);};}}
async initCodeEditor(idnf,column,form){column.customEditor=true;column.customSave=false;if(column.editor)column.editor.destroy();if(column.columnType&&$.isArray(column.columnType)){let test=this.columns.getColumnTypeItem('test',column);let lang=this.columns.getColumnTypeItem('lang',column);let objTest=this.columns.getColumnTypeParameters(test);let objLang=this.columns.getColumnTypeParameters(lang);$('#'+idnf).css('min-height','300px');column.editor=await ace.edit(idnf);column.editor.setTheme("ace/theme/tomorrow");column.editor.getSession().setMode({path:"ace/mode/"+objLang[0],inline:true});this.setCustomEditorsValue(column,this.tableData[column.dataField]);const options=this.getTestButtonOptions(idnf,column.editor,objTest.url);this.addButtonTest(idnf,options);}}
addButtonTest(idnf,options){console.log($('#'+idnf+'-mylsTestButton').length);if($('#'+idnf+'-mylsTestButton').length==0){$('#'+idnf).after('<div id="'+idnf+'-mylsTestButton"></div>');$('#'+idnf+'-mylsTestButton').dxButton(options);}}
createTestInfo(idnf){$('#'+idnf+'-mylsTestButton').after('<div id="'+idnf+'-info"></div>');}
getTestButtonOptions(idnf,editor,url){const self=this;return{stylingMode:"outlined",text:app.translate.saveString("Тестировать"),type:"default",onClick:async function(){const result=await app.processData(url,'POST',{code:editor.getValue()});if($('#'+idnf+'-info').length==0)
self.createTestInfo(idnf);if(result.success)
$('#'+idnf+'-info').addClass('success').text(result.success);if(result.error)
$('#'+idnf+'-info').addClass('error').text(result.error);}}}
async initHtml(idnf,column,form){column.customEditor=true;column.customSave=false;try{if(column.editor)column.editor.destroy();column.editor=await ClassicEditor.create(document.querySelector('#'+idnf),this.getHtmlOptions(column));this.setCustomEditorsValue(column,this.tableData[column.dataField]);}catch(error){console.log(error);}}
getHtmlOptions(column){return{toolbar:{items:['undo','redo','|','heading','fontBackgroundColor','fontColor','fontSize','fontFamily','alignment','|','bold','underline','italic','|','link','bulletedList','numberedList','todoList','|','indent','outdent','|','imageUpload','blockQuote','insertTable','mediaEmbed','|','horizontalLine','specialCharacters','strikethrough','subscript','superscript','|','removeFormat','pageBreak']},language:'en',image:{toolbar:['imageTextAlternative','imageStyle:full','imageStyle:side']},table:{contentToolbar:['tableColumn','tableRow','mergeTableCells','tableCellProperties','tableProperties']},licenseKey:'CJMDDP619.DYZ815RDE608',sidebar:{container:document.querySelector('.sidebar')},};}
getAddButtonOptions(e,column,currValue){const self=this;return{location:"after",name:"Add",elementAttr:{class:"myls-editor-btn"},options:{icon:"img/insert.svg",visible:false,onClick:function(el){self.addNewLookupItem(e,column,el.component.mylsCurrValue);el.element.remove();}}};}
getMoreButtonOptions(e,column,currValue){const self=this;return{location:"after",name:"More",elementAttr:{class:"myls-editor-btn"},options:{icon:'more',visible:false,onClick:async function(el){await self.editInExternalForm(column,el.component.mylsCurrValue,'upd');}}};}
async editInExternalForm(column,extId,mode,text){let formId=column.extFormId;if(column.extFormId[0]=='='){this.dependencies.init(column.form,this.tableData);formId=await this.dependencies.doCondition(column.extFormId);}
let params={};if(column.extFormField){let formField=column.extFormField;if(column.extFormField[0]=='='){formField=doCondition(column.extFormField);}
params=this.getExtFormParams(formField,text);}
const popup=await app.openPopup(formId,extId,'form',mode,app.addHistory(column.dataField,extId,this.idn,this.tHistory,mode),params);extId=await popup.mylsObject.promise;await this.reloadColumn(column);if(mode==='ins'&&extId){column.editor.option('value',extId);}}
async reloadColumn(column){const self=this;column.editor.getDataSource().store().clearRawDataCache();column.dataParams=null;await column.editor.getDataSource().load();column.editor.repaint();if(column.dependencies&&column.dependencies.data)
$.each(column.dependencies.data,function(index,field){self.columns.columns[field].dataParams=null;});this.dependencies.init(column.form,this.tableData);await this.dependencies.process(column.dataField);}
getExtFormParams(extFormField,searchText){const self=this;const params={};const re=/\s*,\s*/;const parts=extFormField.split(re);$.each(parts,function(index,item){const re=/\s*=>\s*/;const fields=item.split(re);if(fields.length==2){params[fields[1]]=self.tableData[fields[0]];}
if(fields.length==1){params[fields[0]]=searchText;}});return params;}
async setDataToForm(saveAndAdd){const self=this;$.each(this.forms,function(_,item){item.option('formData',self.tableData);item.on("fieldDataChanged",e=>{self.fieldChanged(e);});});this.setCustomEditorsValues();}
setCustomEditorsValues(){const self=this;$.each(this.columns.columns,async(_,item)=>{if(item.editor){switch(item.dataType){case'tagbox':case'treeview':case'buttongroup':const values=await self.loadTagBoxValues(item);self.setCustomEditorsValue(item,values);break;case'html':case'code':self.setCustomEditorsValue(item,self.tableData[item.dataField]);break;}}
if(item.objectType=='file'||item.objectType=='image'){this.refreshFileTemplate(item);}});}
clearObjectsValues(){$.each(this.columns.columns,function(index,item){if(item.editor){switch(item.dataType){case'tagbox':case'treeview':item.editor.option('value',[]);break;case'buttongroup':item.editor.option('selectedItemKeys',[]);break;case'html':item.editor.setData(null);break;case'code':item.editor.setValue(null);break;}}});}
loadTagBoxValues(column){const self=this;return new Promise(async(resolve,reject)=>{let values=[];if(self.objectValues.hasOwnProperty(column.dataField)){values=self.objectValues[column.dataField];resolve(values);}else{const options=await self.initLookupValues(column);$.each(options,function(index,item){values.push(item.id);});column.oldValues=values.slice();resolve(values);}});}
setCustomEditorsValue(item,values){const self=this;if(item.editor)
switch(item.dataType){case'tagbox':case'treeview':item.editor.option("value",values);break;case'buttongroup':item.editor.option("selectedItemKeys",values);break;case'colorbox':item.editor.spectrum('option','color',values);item.editor.spectrum('set',values);break;case'html':if(values)
item.editor.setData(values);item.editor.model.document.on('change:data',(evt,data)=>{self.tableData[item.dataField]=item.editor.getData();});break;case'code':if(values)
item.editor.setValue(values);item.editor.session.on('change',function(delta){self.tableData[item.dataField]=item.editor.getValue();});break;}
item.changed=false;}
getCustomEditorsValues(){const self=this;$.each(this.columns.columns,function(index,item){if(item.editor)
switch(item.dataType){case'tagbox':case'treeview':self.objectValues[item.dataField]=item.editor.option('value');break;case'buttongroup':self.objectValues[item.dataField]=item.editor.option('selectedItemKeys');break;case'colorbox':self.objectValues[item.dataField]=item.editor.spectrum('option','color');break;case'html':self.objectValues[item.dataField]=item.editor.getData();break;case'code':self.objectValues[item.dataField]=item.editor.getValue();break;}});}
fieldChanged(e){this.getCustomEditorsValues();this.removeFromDeps(e.dataField);const column=this.columns.columns[e.dataField];if(column.value!=e.value||this.columns.isObject(e.dataField)){this.execChangeProcedure(column,e.value);column.editMode='edit';this.dependencies.init(column.form,this.tableData);this.dependencies.process(e.dataField);}
this.columns.columns[e.dataField].value=e.value;}
async execChangeProcedure(column,newValue){if(column.changeFieldProc){let proc=app.replaceAll(column.changeFieldProc,':__new__',this.prepareValue(newValue,column.dataField,true));proc=app.replaceAll(proc,':__old__',this.prepareValue(column.value,column.dataField,true));this.dependencies.init(null,this.tableData);const result=await this.dependencies.doCondition(proc);if(result!='')
await this.processResult({success:{error_msg:result,error_type:1}});}}
removeFromDeps(field){const self=this;$.each(this.deps,function(index,item){if(index.indexOf(":"+field)!=-1){delete self.deps[index];}});}
disableButtons(disable){if(this.saveBtn)
this.saveBtn.option('disabled',disable);if(this.saveAddBtn)
this.saveAddBtn.option('disabled',disable);if(this.cancelBtn)
this.cancelBtn.option('disabled',disable);}
async showFormButtons(){const self=this;this.saveBtn=$("#"+this.idn+"_save-button").dxButton('instance');this.saveAddBtn=$("#"+this.idn+"_saveadd-button").dxButton('instance');this.cancelBtn=$("#"+this.idn+"_cancel-button").dxButton('instance');this.closeBtn=$("#"+this.idn+"_close-button").dxButton('instance');if(this.saveBtn!==undefined){this.saveBtn.on('click',async(e)=>{try{await self.saveBtnClick();}catch(e){}});}
if(this.saveAddBtn!==undefined&&this.mode=='ins'){this.saveAddBtn.on('click',async(e)=>{try{await self.saveAddBtnClick();}catch(e){}});}
if(this.cancelBtn!==undefined){this.cancelBtn.option('onClick',async()=>{try{await self.cancelBtnClick();}catch(e){}});}
if(this.closeBtn!==undefined){this.closeBtn.option('onClick',async(e)=>{e.event.stopPropagation();try{await self.cancelBtnClick();}catch(e){}});}}
async cancelBtnClick(){if(this.hasUncommitedData()){if(!await app.dialog.confirm(this.idn,app.translate.saveString('На форме есть <b class="mylsThemeRed">несохраненные данные</b>.<br>Вы уверены, что хотите выйти?'),app.translate.saveString('Подтверждение'),app.translate.saveString('Да'),app.translate.saveString('Нет'),'myls-msg-warning'))
return;}
const currentValues=this.createAllValues([]);try{await this.execCancelProc(currentValues);if(this.rawMode==='updins'||this.rawMode==='ins'){await this.processDelete(this.ext_id);}}catch(error){this.processResult(error);}
this.destroy();}
async saveAddBtnClick(){this.saveAndAdd=true;await this.saveBtnClick();}
async saveBtnClick(){try{await this.save(this.ext_id);await this.refreshAndClose();}finally{this.disableButtons(false);this.saveAndAdd=false;}}
async save(key){this.updatedValues=this.tableData;return super.save(key);}
saveData(updateArr){const self=this;return new Promise(async(resolve,reject)=>{if(Object.keys(updateArr).length!=0){const update=self.getUpdatePromise(updateArr,self.ext_id);try{const data=await update;await self.processResult(data);if(self.saveAndAdd)self.mode='ins';else
self.mode='upd';resolve();}catch(error){await self.processResult(error);reject();}finally{self.disableButtons(false);}}else{self.disableButtons(false);resolve();}});}
async refreshAndClose(){let refresh;const th=this.tHistory[this.tHistory.length-1];if(th){const object=$('#'+th.idn).data('mylsObject');if(object){if(this.tableInfo.refreshAll||(th.refreashAll)){refresh=object.refresh(true);}else{refresh=object.refreshRow(this.ext_id,this.initialMode);}}}
if(this.popup&&!this.saveAndAdd){await refresh;}
this.close(this.ext_id);if(this.saveAndAdd){await this.reloadData('ins');}else{this.destroy();}}
async reloadData(mode){const ext_id=mode=='ins'?-1:this.ext_id;const loadData=app.processData('form/tabledata','post',this.prepareTableData(ext_id,mode));this.tableData=await loadData;this.saveAndAdd=mode=='ins'?true:false;this.clearObjectsValues();if(this.mode=='ins'){this.ext_id=this.tableData['ext_id'];this.updatedExtId[this.ext_id]=this.tableData['ext_id'];this.updatedExtField[this.ext_id]=this.tableData['ext_field'];}else{if(this.ext_id===undefined||this.ext_id===null)this.ext_id=this.tableData[0]['id'];this.updatedExtId[this.ext_id]=this.ext_id;this.updatedExtField[this.ext_id]=this.tableData['ext_field'];}
this.tableData=this.tableData[0];this.columns.convertDateTimeColumns(this.tableData);this.rawData=this.columns.getTableDataByColumns(this.tableData);if(this.mode=='ins'){if(this.tHistory.length&&this.updatedExtField[this.ext_id]==this.tHistory[this.tHistory.length-1].extField){this.tHistory[this.tHistory.length-1].extId=this.updatedExtId[this.ext_id];}
this.passHistoryValues(this.tableData);this.columns.setDefaultValues(this.tableData);this.passParamsValues(this.tableData);}
this.afterLoad();this.setDataToForm(true);this.saveAndAdd=false;this.disableButtons(false);}
async validate(){const self=this;let isValid=true;let promises=[];$.each(this.forms,function(index,value){promises.push(self.validateForm(value));});let result=await Promise.all(promises);$.each(this.forms,function(index,value){isValid=result[index];if(!isValid){if(value.mylsTab!==null)
$("#"+self.idn).dxTabPanel('instance').option("selectedIndex",value.mylsTab);return false;}});$.each(this.columns.columns,function(index,item){if(self.customFormObjects.indexOf(item.dataType)!==-1){if(!self.validateCustomEditor(item.editor,item))
isValid=false;}});return isValid;}
validateForm(form){const self=this;return new Promise(async(resolve,reject)=>{try{const res=form.validate();let isValid=res?true:res;if(res.status=='pending'){const result=await res.complete;isValid=result.isValid;}
resolve(isValid);}catch(error){reject(error);}});}
async saveObjects(){var result=[];$.each(this.arrObjects,function(index,item){if(item.saveFunction){result.push(item.saveFunction());}});return result;}
createAllValues(updateArr){let currentValues=super.createAllValues(updateArr);$.each(this.columns.columns,function(index,item){if((item.dataType=='tagbox'||item.dataType=='treeview')){currentValues[index]=item.editor&&item.editor.option('value').length?item.editor.option('value').join():null;}
if(item.dataType=='buttongroup'){currentValues[index]=item.editor&&item.editor.option('selectedItemKeys').length?item.editor.option('selectedItemKeys').join():null;}});return currentValues;}
additionalSave(){const self=this;return new Promise(async(resolve,reject)=>{try{const uResult=self.updateTagBox();const oResult=self.saveObjects();await Promise.all(uResult.concat(oResult));resolve();}catch(error){reject(error);}});}
destroy(){super.destroy();this.popup.destroy();this.popup=null;$("#"+this.idn).data('mylsObject',null);app.destroyArray(this.customFormObjects);app.destroyArray(this.rawData);app.destroyArray(this.objectValues);app.destroyArray(this.forms);app.destroyArray(this.arrObjects);app.destroyArray(this.objectValues);app.destroyArray(this.tableData);app.destroyArray(this.saveBtn);app.destroyArray(this.saveAddBtn);app.destroyArray(this.cancelBtn);app.destroyArray(this.tData);app.destroyArray(this.firstData);this.close();}
setFieldVisible(form,column,isVisible){if(!column.form||!column.element)return;if(isVisible)
$(column.element).removeClass('d-none');else
$(column.element).addClass('d-none');column.visible=isVisible;}
setFieldCaption(form,column,caption){if(!column.form||!column.element)return;$(column.element).find('.dx-field-item-label-text').text(caption.text);}
setFieldValidation(form,column,rules){if(!column.form)return;let path=this.columns.getFieldPath(column);if(!column.customEditor&&column.form&&column.form.itemOption(path)&&(!column.validationRules||column.validationRules!==JSON.stringify(rules)))
column.form.itemOption(path,"validationRules",rules);column.validationRules=JSON.stringify(rules);this.setRequiredClass();}
setRequiredClass(){$.each(this.columns.columns,async(_,column)=>{if(column.element){$(column.element).removeClass('myls-required');if(column.setRequiredClass){$(column.element).addClass('myls-required');}}});}
setFieldValue(object,column,value){if(!column.customEditor){if(!object)object=column.form;object.updateData(column.dataField,value);}else{this.setCustomEditorsValue(column,value);}
this.tableData[column.dataField]=value;}
setFieldEditable(object,column,result){if(!column.customEditor){let editor=column.editor;if(!editor){editor=object.getEditor(column.dataField);if(editor)column.editor=editor;}
if(editor){editor.option("readOnly",!result);}}}
refreshRow(){}
hasUncommitedData(){if(!app.isEqual(this.tableData,this.firstData))
return true;else
for(let object of this.arrObjects){if(object.hasUncommitedData()){this.tabPanel.option('selectedIndex',object.formTabIndex);return true;}}
return false;}};;class Popup{constructor(table,ext_id,type,mode,tHistory,params,modal=false,buttons=[],saveFunction=false){this.type=type;this.view='popup';this.table=table;this.ext_id=ext_id;this.mode=mode;this.tHistory=tHistory;this.params=params;this.width=0;this.height=0;this.buttons=[];this.popupContent=[];this.title='';this.idn=app.getIdn(this.type,this.table,this.ext_id,this.view)+'-popup';this.modal=modal;this.btns=buttons;this.saveFunction=saveFunction;}
async init(){const self=this;return new Promise(async(resolve)=>{let index=app.bottomTabs.findIndex(self.idn);if(index===-1){self.createPopupHtml();self.setPopupButtons();await self.createObject();}
if(!this.modal)
app.bottomTabs.createTab(self);resolve();});}
createPopupHtml(){let idx=app.getIdn(this.type,this.table,this.ext_id,this.view);this.popupContainer=$("<div />").attr('id',idx).addClass("myls-form-container");this.popup=$('<div id="'+this.idn+'"></div>');if(this.type!=='form'){this.popupContainer.addClass('gridContainer');this.width=$(window).width()*0.75;this.height=$(window).height()*0.75;}}
setPopupButtons(){const self=this;let idx=app.getIdn(this.type,this.table,this.ext_id,this.view);if(this.btns.length==0){this.buttons=[{location:"after"}];this.buttons.push(this.getButtonInfo(idx));this.buttons.push(this.getButtonOK(idx));if(this.mode=='ins'){this.buttons.push(this.getButtonSaveAndAdd(idx));}
this.buttons.push(this.getButtonCancel(idx));if(app.appInfo.device.deviceType!=='phone'){this.buttons.push(this.getButtonCollapse(idx));this.buttons.push(this.getButtonFullscreen(idx));this.buttons.push(this.getButtonClose(idx));}}else{$.each(this.btns,function(index,item){if(item=='info')
self.buttons.push(self.getButtonInfo(idx));if(item=='ok')
self.buttons.push(self.getButtonOK(idx));if(item=='save'&&self.mode=='ins')
self.buttons.push(self.getButtonSaveAndAdd(idx));if(item=='cancel')
self.buttons.push(self.getButtonCancel(idx));if(item=='collapse')
self.buttons.push(self.getButtonCollapse(idx));if(item=='fullscreen')
self.buttons.push(self.getButtonFullscreen(idx));if(item=='close')
self.buttons.push(self.getButtonClose(idx));});}}
getButtonInfo(idx){return{widget:"dxButton",toolbar:"bottom",location:"before",options:{text:"?",type:"default",stylingMode:"outlined",elementAttr:{id:idx+'_info-button',class:"myls-info-btn"},}};}
getButtonOK(idx){const self=this;let options;if(this.saveFunction){options={widget:"dxButton",toolbar:"bottom",location:"after",options:{text:app.translate.saveString("Выбрать"),type:"success",stylingMode:"outlined",elementAttr:{id:idx+'_save-button'},},onClick:async function(e){await self.saveFunctionExecute();}};}else{options={widget:"dxButton",toolbar:"bottom",location:"after",options:{text:app.translate.saveString("OK"),type:"success",stylingMode:"outlined",elementAttr:{id:idx+'_save-button'},}};}
return options;}
async saveFunctionExecute(){const th=this.tHistory[this.tHistory.length-1];if(th){const object=$('#'+th.idn).data('mylsObject');if(object){const rows=this.mylsObject.getSelectedRows();const id=th.extId;await app.processData('frame/processselect','POST',{func:this.saveFunction,id:id,rows:JSON.stringify(rows)});object.refresh(true);}}
this.popup.remove();}
getButtonSaveAndAdd(idx){return{widget:"dxButton",toolbar:"bottom",location:"after",options:{text:app.translate.saveString('Сохранить и добавить'),type:"success",stylingMode:"outlined",elementAttr:{id:idx+'_saveadd-button'},}};}
getButtonNext(idx){return{widget:"dxButton",toolbar:"bottom",location:"after",options:{text:app.translate.saveString('►'),type:"success",stylingMode:"outlined",elementAttr:{id:idx+'_next-button'},}};}
getButtonCancel(idx){const self=this;return{widget:"dxButton",toolbar:"bottom",location:"after",options:{text:app.translate.saveString('Отмена'),type:"default",stylingMode:"outlined",elementAttr:{id:idx+'_cancel-button'},onClick:function(e){self.popup.remove();}}};}
getButtonCollapse(idx){const self=this;return{widget:"dxButton",toolbar:"top",location:"after",options:{icon:"collapse",type:"normal",stylingMode:"text",elementAttr:{id:idx+'collapse-button',class:"myls-collapse-btn"},onClick:function(e){e.event.stopPropagation();self.object.hide();}}};}
getButtonFullscreen(idx){const self=this;return{widget:"dxButton",toolbar:"top",location:"after",options:{icon:"fullscreen",type:"normal",stylingMode:"text",elementAttr:{id:idx+'_fullscreen-button',class:"myls-fullscreen-btn"},onClick:function(e){if(self.object.option('fullScreen')){self.object.option('fullScreen',false);}else{self.object.option('fullScreen',true);}}}};}
getButtonClose(idx){const self=this;return{widget:"dxButton",toolbar:"top",location:"after",options:{icon:"close",type:"normal",stylingMode:"text",elementAttr:{id:idx+'_close-button',class:"myls-close-btn"},onClick:function(e){self.popup.remove();}}};}
getPopupOptions(){const self=this;return{width:self.width,height:self.height,contentTemplate:function(){return self.popupContainer;},onHidden:function(e){},onDisposing:function(e){if(!self.modal){app.bottomTabs.closeTab(self.idn);app.clearUrl();}
self.destroy();},toolbarItems:this.buttons,showTitle:true,title:app.translate.saveString("Information"),visible:false,closeOnOutsideClick:false,maxSize:"100%",maxHeight:"100%",showCloseButton:false,shading:this.modal,};}
async createObject(){const self=this;if($('#'+this.idn).length===0){$('.app-container').after(this.popup);this.object=this.popup.addClass("myls-form").dxPopup(this.getPopupOptions()).dxPopup("instance");this.activate();if(!this.modal)
app.bottomTabs.createObject();this.mylsObject=app.getObject(this.table,this.ext_id,this.view,this.type,this.mode,this.tHistory,null,this.params);this.mylsObject.popup=this;await this.mylsObject.init();if(this.mylsObject&&!this.modal)
app.updateUrl(this.mylsObject.idn);else
this.updateModalTitle();}}
activate(){if(this.object){const animation=this.object.option('animation');this.object.option('animation',null);this.object.hide();this.object.show();$("#"+this.idn+" .dx-popup-normal").css('opacity','1');this.object.option('animation',animation);}}
changeTitle(title){this.title=title;this.object.option('title',title);app.bottomTabs.changeTitle(this);}
updateModalTitle(){if(this.object)
this.object.option('title',this.mylsObject.tableInfo.name);}
destroy(){this.popup.remove();this.popupContainer=null;this.popup=null;app.destroyArray(this.tHistory);this.mylsObject=null;this.object=null;}};;class BottomTabs{constructor(){this.panelContent=[];this.object={};}
init(){this.createObject();}
createObject(){const self=this;if($('#bottomPopupTabs').length==0){$('#content').prepend('<div id="bottomPopupTabs" ></div>');this.object=$("#bottomPopupTabs").dxTabs({noDataText:'',itemTemplate:function(itemData,itemIndex,element){element.text(itemData.text);element.append($("<i>").addClass('dx-icon dx-icon-close').attr('data-tab',itemData.idn));},onItemClick:function(e){let idnPopup=e.itemData.idn;self.activateTabByIdn(idnPopup);}}).dxTabs("instance");}}
activateTabByIdn(idn){let index=this.findIndex(idn);if(index!==-1){this.activateTab(index);}
app.updateUrl(idn);}
createTab(popup){let index=this.findIndex(popup.idn);if(index!==-1){this.activateTab(index);}else{this.panelContent.push({idn:popup.idn,text:popup.title,mylsObject:popup,});this.object.option('items',this.panelContent);this.object.option('selectedIndex',this.panelContent.length-1);app.setSettings();}}
activateTab(index){this.object.option('selectedIndex',index);this.panelContent[index].mylsObject.activate();return this.panelContent[index].mylsObject;}
changeTitle(popup){let index=this.findIndex(popup.idn);if(index!==-1){this.panelContent[index].text=popup.title;this.object.option('items',this.panelContent);}}
closeTab(idn){let index=this.findIndex(idn);if(index!==-1){this.panelContent.splice(index,1);if(this.panelContent.length>0){this.object.option('items',this.panelContent);}else{$('#bottomPopupTabs').remove();}
$('#'+idn).remove();if($("#"+idn).data('mylsObject'))
$("#"+idn).data('mylsObject').destroy();app.setSettings();}}
findIndex(idn){return this.panelContent.findIndex((item)=>{if(item.idn==idn){return true;}});}
destroy(){app.destroyArray(this.panelContent);this.object=null;}};;class TwoWayGrid extends MylsObject{constructor(table,ext_id,view,mode,tHistory,viewMode,params){super(table,ext_id,view,mode,tHistory,viewMode,params);this.type='twowaygrid';this.dataColumn={};this.columnColumn={};this.rowsColumn=[];this.searchColumns=[];this.newDataSource=[];this.out=[];}
async init(){await super.init();this.dataSource.load();this.setColumnsData();this.setNewDataSource();this.createObject();$("#"+this.idn).data('mylsObject',this);}
createObject(){this.object=$("#"+this.idn).dxDataGrid(this.getOptions()).dxDataGrid('instance');}
getOptions(){const self=this;return{dataSource:this.out,onCellPrepared:function(e){self.cellPreppared(e);},onCellClick:function(e){self.cellClick(e);},editing:{mode:"batch",allowUpdating:true,selectTextOnEditStart:true,startEditAction:"click"},showBorders:true,paging:{pageSize:20},pager:{showPageSizeSelector:true,allowedPageSizes:[5,10,20],showInfo:true},columns:this.rowsColumn}}
cellClick(e){const self=this;$.each(this.dataSource.item(),function(index,item){if(item.client_id==e.data.client_id&&item[self.columnColumn.dataField]==e.column.caption){console.log(item);}});}
cellPreppared(e){if(e.rowType=='data'&&e.column.columnType=='columnData'&&e.value===undefined){e.cellElement.html('');}}
setColumnsData(){const self=this;$.each(this.columns.columns,function(index,item){if(item.columnType=='data'){self.dataColumn=item;}
if(item.columnType=='column'){self.columnColumn=item;}
if(item.columnType=='row'){self.rowsColumn.push(item);self.searchColumns.push(item.dataField);}});}
setNewDataSource(){const self=this;if(!$.isEmptyObject(this.columnColumn)){this.setRowColumns();if(this.rowsColumn.length>0){this.getNewDataSource();this.sortNewDataSource();let oldObj={};for(let dd in this.newDataSource){let isEqual=true;$.each(this.searchColumns,function(i,item){if(oldObj[item]!=self.newDataSource[dd][item]){oldObj=self.newDataSource[dd];isEqual=false;return false;}});if(isEqual){Object.assign(self.out[self.out.length-1],self.newDataSource[dd]);}else{self.out.push(self.newDataSource[dd]);}}}}}
sortNewDataSource(){const self=this;this.newDataSource.sort((prev,next)=>{for(let col in self.rowsColumn){let field=self.rowsColumn[col].dataField;if(prev[field]<next[field]){return 1;}
if(prev[field]>next[field]){return-1;}}
return 0;});}
getNewDataSource(){const self=this;$.each(this.dataSource.items(),function(index,item){let row={};$.each(self.rowsColumn,function(i,it){if(item[it.dataField]){row[it.dataField]=item[it.dataField];}
if(it.columnType=='columnData'){if(item[self.columnColumn.dataField]==it.caption)
row[it.dataField]=item[self.dataColumn.dataField];}});self.newDataSource.push(row);});}
setRowColumns(){const self=this;let datas=[];$.each(this.dataSource.items(),function(index,item){if(item[self.columnColumn.dataField]!==null){datas.push(item[self.columnColumn.dataField]);}});datas=datas.filter(function(item,pos){return datas.indexOf(item)==pos;});$.each(datas,function(index,item){self.rowsColumn.push({dataField:self.columnColumn.dataField+index,caption:item,width:100,visible:true,columnType:'columnData',fixed:false,allowEditing:true,useColumn:1,dataType:self.dataColumn.dataType,});});}
destroy(){super.destroy();$("#"+this.idn).data('mylsObject',null);app.destroyArray(this.dataColumn);app.destroyArray(this.columnColumn);app.destroyArray(this.rowsColumn);app.destroyArray(this.searchColumns);app.destroyArray(this.newDataSource);app.destroyArray(this.out);this.close();}};;class Dependencies{constructor(mylsObject){this.mylsObject=mylsObject;this.columns=mylsObject.columns;}
destroy(){this.mylsObject=null;this.columns=null;}
init(object,tableData){this.object=object;this.tableData=tableData;}
process(dataField){if(DEBUG)
console.log("process ",dataField);const column=this.columns.columns[dataField];if(column&&column.dependencies){this.doVisibleDependencies(column);if(column.dependencies.caption)
this.doCaptionDependencies(column);if(column.dependencies.value){this.doValueDependencies(column);}
if(column.dependencies.data){this.doDataDependencies(column);}
if(column.dependencies.edit){this.doEditDependencies(column);}}}
doVisibleDependencies(column){const self=this;return new Promise(async resolve=>{if(column.dependencies.visible){let pr=[];$.each(column.dependencies.visible,function(index,field){const targetColumn=self.columns.columns[field];pr.push(self.setFieldVisible(targetColumn));});await Promise.all(pr);}
resolve();});}
async setFieldVisible(column){const self=this;return new Promise(async resolve=>{const visibleCondition=column.visibleCondition;if(visibleCondition){if(DEBUG){console.time("setFieldVisible "+column.dataField);}
const result=await self.doCondition(visibleCondition,column);if(column.toClear===undefined||column.toClear===result){self.mylsObject.setFieldVisible(self.object,column,result);column.toClear=!result;}
if(DEBUG){console.timeEnd("setFieldVisible "+column.dataField);}
resolve(result);}
resolve(true);});}
async doCondition(cond,column,saveToDeps=true){const self=this;return new Promise(async(resolve,reject)=>{const condTmp=cond;if(cond[0]!='='){if(cond[0]===":")cond=app.getConfigParam(cond);if(column)
if(cond!==null)cond=self.mylsObject.prepareValue(cond,column.dataField);resolve(cond);}else{if(self.mylsObject.deps.hasOwnProperty(cond)){resolve(self.mylsObject.deps[cond]);}else{if(DEBUG)
console.log("doCondition ",cond);try{await setComplexParamValues();await setDBParamValues(column);cond=cond.substring(1);cond=eval(cond);if(condTmp.indexOf("$db.")==-1&&saveToDeps)
self.mylsObject.deps[condTmp]=cond;resolve(cond);}catch(error){await self.mylsObject.processResult(error);reject();}}}});function setComplexParamValues(){return new Promise((resolve)=>{const regExp=/\:_*([a-zA-Z]\w*(\.[a-zA-Z]\w*)?)/gi;const fields=cond.match(regExp);const pr=[];$.each(fields,async function(index,item){const field=item.substring(1);const getFieldValue=self.mylsObject.getFieldValue(field,true);pr.push(getFieldValue);let value=await getFieldValue;if(value===undefined||value===null)value='null';const re=new RegExp(item,"g");cond=cond.replace(re,value);});Promise.all(pr).then(()=>resolve());});}
function setDBParamValues(column){const dbRegExp=/\$db\.\w+(\(.*\))?/gi;const fields=cond.match(dbRegExp);const pr=[];$.each(fields,function(index,item){const field=item.substring(4);self.mylsObject.deps[item]=null;const result=self.getValueFromDB(field,item,column);result.then((data)=>{if(data){cond=cond.replace(data.item,data.value);}});pr.push(result);});return Promise.all(pr);}}
async getValueFromDB(field,item,column){return new Promise(async(resolve,reject)=>{try{const result=await app.processData('form/getdbdata','post',{'proc':field});let value=result.success.result;if(column){switch(column.dataType){case'number':value=Number(value);break;case'date':case'time':case'datetime':case'string':value=app.getJsDate(value,true,column);}}
resolve({item:item,value:value});}catch(error){await this.mylsObject.processResult(error);reject();}});}
doCaptionDependencies(column){const self=this;$.each(column.dependencies.caption,function(index,field){if(DEBUG)
console.log("doCaptionDependencies ",field);const targetColumn=self.columns.columns[field];self.setFieldCaption(targetColumn);});}
async setFieldCaption(column){if(DEBUG){console.time("setFieldCaption "+column.dataField);}
const parts=column.caption.split('@');if(parts.length>1){const rule='='+parts[0].substr(2,parts[0].length-3);if(rule){const result=await this.doCondition(rule,column);const caption={text:app.translate.saveString(result?parts[1].substr(1,parts[1].length-2):parts[2].substr(1,parts[2].length-2))};this.mylsObject.setFieldCaption(this.object,column,caption);}}
if(DEBUG){console.timeEnd("setFieldCaption "+column.dataField);}}
async doValidationDependencies(column){const self=this;$.each(column.dependencies.restrictions,async function(index,field){const targetColumn=self.columns.columns[field];await self.setFieldValidation(targetColumn);});}
async setFieldValidation(column){const self=this;let allRules=await this.setFieldRequired(column);allRules=this.setFieldRestrictions(column,allRules);this.mylsObject.setFieldValidation(this.object,column,allRules);}
async setFieldRequired(column){const self=this;return new Promise(async(resolve)=>{if(column.required){if(DEBUG){console.time("setFieldRequired "+column.dataField);}
const result=await self.doCondition(column.required,column);const rules=self.getValidationRules(column,result);if(DEBUG){console.timeEnd("setFieldRequired "+column.dataField);}
resolve(rules);}else resolve([]);});}
setFieldRestrictions(column,allRules){const self=this;if(column.restrictions){if(DEBUG){console.time("setFieldRestrictions "+column.dataField);}
const parts=column.restrictions.split('@');if(parts.length==2){const rule='='+parts[0].substr(1,parts[0].length-2);const msg=parts[1].substr(1,parts[1].length-2);const rules=[{type:'async',message:msg,ignoreEmptyValue:false,validationCallback:function(e){if(column.dataType=='datetime'){column.editor.option("value",e.value);}
self.mylsObject.removeFromDeps(column.dataField);return self.doCondition(rule,column);}}];return allRules.concat(rules);}
if(DEBUG){console.timeEnd("setFieldRestrictions "+column.dataField);}}
return allRules;}
async doValueDependencies(column){const self=this;const pr=[];$.each(column.dependencies.value,function(index,field){const targetColumn=self.columns.columns[field];self.setFieldValue(targetColumn);});}
async setFieldValue(column){if(DEBUG){console.time("setFieldValue "+column.dataField);}
const vd=column.defaultValue;if(vd){const result=await this.doCondition(vd,column);this.mylsObject.setFieldValue(this.object,column,result);}
if(DEBUG){console.timeEnd("setFieldValue "+column.dataField);}}
doDataDependencies(column){const self=this;const pr=[];$.each(column.dependencies.data,async function(index,field){const targetColumn=self.columns.columns[field];self.setFieldData(targetColumn);});}
setFieldData(column){if(column.dataType=='lookup'){const lookup=column.editor;if(lookup){lookup.getDataSource().store().clearRawDataCache();lookup.getDataSource().load();}}
if(this.mylsObject.columns.isObject(column.dataField)){column.editor.setParams(this.tableData);}}
doEditDependencies(column){const self=this;const pr=[];$.each(column.dependencies.edit,async function(index,field){const targetColumn=self.columns.columns[field];self.setFieldEditable(targetColumn);});}
async setFieldEditable(column){if(DEBUG){console.time("setFieldEditable "+column.dataField);}
const vd=column.editCondition;if(vd){const result=await this.doCondition(vd,column);this.mylsObject.setFieldEditable(this.object,column,result);}
if(DEBUG){console.timeEnd("setFieldEditable "+column.dataField);}}
getValidationRules(column,result){const self=this;let rules=[];if(column&&((column.hasOwnProperty("required")&&app.hasValue(column.required))||(column.hasOwnProperty("pattern")&&app.hasValue(column.pattern)))){if(column.hasOwnProperty("required")&&app.hasValue(column.required)){column.setRequiredClass=false;$(column.element).removeClass('myls-required');if(column.required.charAt(0)!='='||result){column.setRequiredClass=true;rules.push({type:'async',message:app.translate.saveString('Поле должно быть заполнено'),ignoreEmptyValue:false,validationCallback:async function(e){return new Promise(async(resolve,reject)=>{if(column.toClear){resolve();return;}
const result=await self.doCondition(column.required,column);if(result!=undefined)
if(e.value==null||e.value===undefined||e.value==='')
reject();else
resolve();else
resolve();});}});}}
if(column.hasOwnProperty("pattern")&&app.hasValue(column.pattern)){if(column.pattern.charAt(0)!='='){switch(column.pattern.toLowerCase()){case'email':ruleEmail();break;case'phone':rulePhone();break;case'url':ruleUrl();break;}}else{let pattern=column.pattern.substring(1);if(pattern.charAt(0)!='^'){pattern='^'+pattern;}
if(pattern.charAt(pattern.length-1)!='$'){pattern=pattern+'$';}
rules.push({type:"pattern",pattern:pattern});}}}
return rules;function ruleEmail(){rules.push({type:"email"});column.mode="email";}
function rulePhone(){rules.push({type:"custom",validationCallback:function(e){return String(e.value).search(app.patterns.phone_form)>=0;},ignoreEmptyValue:true,message:app.translate.saveString('Внесенное значение не является допустимым форматом телефона')});column.mode="tel";}
function ruleUrl(){rules.push({type:"custom",validationCallback:function(e){return String(e.value).search(app.patterns.url_form)>=0;},ignoreEmptyValue:true,message:app.translate.saveString('Внесенное значение не является допустимым форматом url')});column.mode="url";}}};;class HtmlEditor extends MylsObject{constructor(table,ext_id,view,mode,tHistory,viewMode,params){super(table,ext_id,view,mode,tHistory,viewMode,params);this.type='htmleditor';}
async init(){super.init();this.editorIdn=app.getIdn('htmleditor',this.table,this.ext_id,this.view);this.createObject();}
createObject(){$('#'+this.idn).append('<div id="'+this.editorIdn+'-toolbar"></div><div id="'+this.editorIdn+'-editor" class="gridContainer"></div>');this.object=DecoupledEditor.create(document.querySelector('#'+this.editorIdn+'-editor')).then(editor=>{const toolbarContainer=document.querySelector('#'+this.editorIdn+'-toolbar');toolbarContainer.appendChild(editor.ui.view.toolbar.element);}).catch(error=>{console.error(error);});}};;class ContextMenu{constructor(object){this.mylsObject=object;}
destroy(){this.mylsObject=null;}
init(menu,target){$("#"+this.mylsObject.idn+"-context-menu").dxContextMenu({dataSource:menu,width:200,target:target,});}
show(ext_id,data){const self=this;$("#"+this.mylsObject.idn+"-context-menu").dxContextMenu({onItemClick:function(elem){if(elem.itemData.isSelect==1){let popup=new Popup(elem.itemData.targetObject,'',elem.itemData.objectType,'upd',app.addHistory(elem.itemData.extIdField,data[elem.itemData.extIdField],self.mylsObject.idn,self.mylsObject.tHistory),[],true,['ok','cancel','fullscreen','close'],elem.itemData.selectFunc);popup.init();}else{if(!elem.itemData.items){let tblTitle=elem.itemData.title;if(elem.itemData.titleField!==''){tblTitle=elem.itemData.title+' '+data[elem.itemData.titleField];}
const url=app.getIdn(elem.itemData.objectType,elem.itemData.targetObject,ext_id,elem.itemData.objectView);app.openTabFromUrl(url,app.addHistory(elem.itemData.extIdField,ext_id,self.mylsObject.idn,self.mylsObject.tHistory),tblTitle);}}},});}};;class Layout extends MylsObject{constructor(table,ext_id,view,mode,tHistory,viewMode,params){super(table,ext_id,view,mode,tHistory,viewMode,params);this.type='layout';this.arrObjects=[];this.layoutColumns=[];}
async init(){const self=this;await super.init();this.template=JSON.parse(this.getTemplate());await this.createObject();}
async createObject(){const self=this;let savedState=await this.sendStorageRequest("storage","json","GET",false,this.table,[]);let template=this.template;if(savedState!==null&&savedState!==2){template=savedState.content;}
this.object=new GoldenLayout(this.getOptions(template),$('#'+this.idn));this.fillConfig(template,this.object);this.object.on('stackCreated',function(stack){if(isNaN(stack.config.width)||stack.config.width=='NaN')
delete stack.config.width;});this.object.config.mylsExtId=this.ext_id;this.object.config.mylsTHistory=this.tHistory;this.object.config.mylsMode=this.mode;resizeSensor.create($('#'+this.idn)[0],()=>this.object.updateSize($('#'+this.idn).width(),$('#'+this.idn).height()));this.object.init();this.createFramesObjects(template);this.object.config.mylsCanCreate=true;this.object.on('stateChanged',function(){self.saveCurrentFrames(self.object.toConfig());});}
getOptions(template){return{content:template};}
fillConfig(conf){const self=this;$.each(conf,function(_,item){if(item&&item.type!=='component'){self.fillConfig(item.content);}
if(item&&item.hasOwnProperty("type")&&item.type=='component'){const column=self.getColumn(item);column.idn=app.getIdn(app.appInfo.tables[column.tableId].tableType,column.tableId,self.ext_id,'layout');item.componentState={label:column.dataField};self.object.registerComponent(column.dataField,function(container,state){container.getElement().html(column.tableId?app.getObjectContainer(column.idn):'<div id="'+self.idn+'_'+column.dataField+'" class="h-100"></div>');});}});}
getColumn(item){const column=this.columns.columns[item.componentName];if(item.hasOwnProperty("isClosable"))
item.isClosable=item.isClosable=='true'?true:false;else
item.isClosable=true;item.title=app.translate.saveString(item.title?item.title:column.caption);return column;}
async saveCurrentFrames(state){state=app.replaceAll(state,',"width":null','');await this.sendStorageRequest("storage","json","POST",state,this.table);Promise.resolve();}
createFramesObjects(conf,activeItemIndex=0){const self=this;$.each(conf,function(index,item){if(item&&item.hasOwnProperty("type")){if(item.hasOwnProperty('activeItemIndex'))
activeItemIndex=item.activeItemIndex;if(item.type!=='component'){self.createFramesObjects(item.content,activeItemIndex);}else{if(index==activeItemIndex){const column=self.columns.columns[item.componentName];const object=app.getObject(column.tableId,self.ext_id,'layout',app.appInfo.tables[column.tableId].tableType,self.mode,self.tHistory);object.init();}}}});}};;const app=new App();const DEBUG=false;$(async()=>{await app.init();});DevExpress.ui.dxLoadIndicator.defaultOptions({options:{indicatorSrc:'img/loader.svg'}});let autoComplete="off";const userAgent=detect.parse(navigator.userAgent);if(userAgent.browser.family=="Chrome")
autoComplete="new";if(userAgent.browser.family=="Safari")
autoComplete="false";DevExpress.ui.dxTextBox.defaultOptions({options:{onContentReady:function(info){$(info.element).find("input").attr("autocomplete",autoComplete);},}});DevExpress.ui.dxDateBox.defaultOptions({device:{deviceType:"desktop"},options:{useMaskBehavior:true,pickerType:"calendar",adaptivityEnabled:true,showDropDownButton:false,calendarOptions:{showTodayButton:true,}}},{device:{deviceType:"phone"},options:{useMaskBehavior:true,pickerType:"calendar",adaptivityEnabled:true,showDropDownButton:false,calendarOptions:{showTodayButton:true,}}});DevExpress.ui.dxPopup.defaultOptions({device:{deviceType:"desktop"},options:{dragEnabled:true,fullScreen:false,resizeEnabled:true,}},{device:{deviceType:"phone"},options:{dragEnabled:false,fullScreen:true,resizeEnabled:false,}});DevExpress.ui.dxSelectBox.defaultOptions({options:{onContentReady:function(info){$(info.element).find("input").attr("autocomplete","false");},}});DevExpress.config({editorStylingMode:'underlined'});$.Color.fn.contrastColor=function(){var r=this._rgba[0],g=this._rgba[1],b=this._rgba[2];return(((r*299)+(g*587)+(b*144))/ 1000)>=131.5?"myls-color-black":"myls-color-white";};setInterval(function(){app.saveSettings();},5000);$(document.body).on('click','.panel-list .dx-item-content a',function(){const url=$(this).attr('href');app.openTabFromUrl(url);});$(document.body).on('click','#tabpanel .dx-item .dx-item-content .dx-icon-close',function(){const idn=$(this).attr('data-tab');app.topTabs.closeTab(idn);});$(document.body).on('click','#bottomPopupTabs .dx-item .dx-item-content .dx-icon-close',function(){const idn=$(this).attr('data-tab');app.bottomTabs.closeTab(idn);});$(document.body).on('click','.dx-popup .dx-popup-title',function(){const idnPopup=$(this).parents(".dx-popup").attr('id');app.bottomTabs.activateTabByIdn(idnPopup);});$(document.body).on('click','.myls-tooltip',function(){const id=$(this).attr('id');let target='';let url=$(this).attr('data-href');const type=$(this).attr('data-type');const info=$(this).text();if(url.indexOf("tel:")==-1&&url.indexOf("mailto:")==-1){target='target="_blank"';}
app.tooltip.option('contentTemplate','<a href="'+url+'" '+target+'><i class="dx-icon-'+type+'"></i> '+info+'</a>');app.tooltip.show('#'+id);});$(document.body).on('click','.myls-open-object',function(e){e.stopPropagation();const table=$(e.target).attr('data-table');const ext_id=$(e.target).attr('data-ext-id');const type=$(e.target).attr('data-type');const view=$(e.target).attr('data-view');let url=app.getIdn(type,table,ext_id,view);app.openTabFromUrl(url);});$(window).on('resize',()=>{app.setDrawerOptions();});;