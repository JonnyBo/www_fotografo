class CodeEditorTest extends CodeEditor {

    constructor(table, ext_id, view, mode, tHistory, viewMode, params) {
        super(table, ext_id, view, mode, tHistory, viewMode, params);
        this.type = 'codeeditor';
    }

    async init() {
        super.init();
        //this.editorIdn = app.getIdn('aceeditortest', this.table, this.ext_id, this.view);
        //this.createObject();
        //$("#" + this.idn).data('mylsObject', this);
        this.createTestButton();
    }
/*
    createObject() {
        console.log(this.idn);
        $('#' + this.idn).append('<div id="' + this.editorIdn + '-toolbar"></div><div id="' + this.editorIdn + '-editor" class="gridContainer"></div>');
        this.object = ace.edit(this.editorIdn+"-editor");
        this.object.setTheme("ace/theme/monokai");
        this.object.session.setMode("ace/mode/php");
    }
*/
    createTestButton() {
        $('#' + this.editorIdn + '-toolbar').append('<div id="mylsTestButton"></div>');
        $('#mylsTestButton').dxButton(this.getTestButtonOptions());
    }

    createInfo() {
        $('#' + this.idn).append('<div id="' + this.editorIdn + '-info"></div>');
    }

    getTestButtonOptions() {
        const self = this;
        return {
            stylingMode: "contained",
            text: "Тестировать",
            type: "normal",
            width: 120,
            onClick: async function() {
                const result = await app.processData('site/test-code', 'POST', {code: self.object.getValue()});
                if ($('#'+self.editorIdn+'-info').length == 0)
                    self.createInfo();
                if (result.success)
                    $('#'+self.editorIdn+'-info').addClass('success').text(result.success);
                if (result.error)
                    $('#'+self.editorIdn+'-info').addClass('error').text(result.error);
            }
        }
    }

}