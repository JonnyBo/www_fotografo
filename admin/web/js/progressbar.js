class ProgressBar {

    constructor(object) {
        this.mylsObject = object;
    }

    init(max, locked = true) {
        //const idn = $(this.mylsObject.getElement(element)).attr("id");
        if (this.object) {
            this.object.option("max", max);
        } else {
            this.pbId = this.mylsObject.idn + '_progressbar';
            $('#' + this.mylsObject.idn).after('<div id="' + this.pbId + '"/>');
            let inProgress = true;
            this.mylsObject.lockObject(locked);
            const self = this;
            this.object = $('#' + this.pbId).dxProgressBar({
                min: 0,
                max: max,
                value: 0,
                visible: true,
                showStatus: false,
                width: "400px",
                maxWidth: "50%",
                elementAttr: {
                    class: "dx-loadpanel-content myls-center-screen",
                },
                onComplete: function (e) {
                    self.mylsObject.lockObject();
                    //this.visible = false;
                    self.mylsObject.refresh();
                    self.remove();
                },

            }).dxProgressBar("instance");
            $("#" + this.pbId).css('z-index', '100');
        }
    }

    step() {
        this.object.option('value', this.object.option('value') + 1);
    }

    position(value) {
        this.object.option('value', value);
    }

    show() {

    }

    hide() {

    }

    remove() {
        if (this.object)
            this.object.dispose();
        $('#' + this.pbId).remove();
        this.object = null;
    }

    destroy() {
        this.mylsObject = null;
        this.object = null;
    }

}