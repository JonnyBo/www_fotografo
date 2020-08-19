class CodeEditor extends MylsObject {

    constructor(table, ext_id, view, mode, tHistory, viewMode, params) {
        super(table, ext_id, view, mode, tHistory, viewMode, params);
        this.type = 'codeeditor';
    }

    async init() {
        super.init();
        this.editorIdn = app.getIdn('codeeditor', this.table, this.ext_id, this.view);
        this.createObject();
        //$("#" + this.idn).data('mylsObject', this);
    }

    createObject() {
        console.log(this.idn);
        $('#' + this.idn).append('<div id="' + this.editorIdn + '-toolbar"></div><div id="' + this.editorIdn + '-editor" class="gridContainer"></div>');
        this.object = ace.edit(this.editorIdn+"-editor");
        this.object.setTheme("ace/theme/monokai");
        this.object.session.setMode("ace/mode/php");
    }

}