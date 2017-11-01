/**
 * ����һ��filed������
 */

require('./form.css');

MWT.Form = function(opt)
{
	this.listeners = {};
    var fields = [];
    var fieldcfgs;
	if (opt) {
		if (opt.fields) {
            fieldcfgs=opt.fields;
            initFields();
        }
	}
	
    function initFields() {
        fields = [];
		if (!fieldcfgs || fieldcfgs.length==0) return;
        var fd;
        for (var i=0; i<fieldcfgs.length; ++i) {
            var opt = fieldcfgs[i];
            switch (opt.type) {
                case 'image':
                    fd = new MWT.ImageUploadField(opt);
                    break;
                default:
                    fd = new MWT.TextField(opt);
                    break;
            }
            fields.push({
                name: opt.name,
                field: fd
            });
        }
    }

	// ����form
	this.create = function() {
        for (var i=0; i<fields.length; ++i) {
            fields[i].field.create();
        }
	};

    // ���field
    this.addField = function(name,fd) {
        if (this.getFieldByName(name)) return;
        fields.push({name:name,field:fd});
    };

    // ��ȡfield
    this.getField = function(idx) {
        return fields[idx].field;
    };

    // ����name��ȡfield
    this.getFieldByName = function(name) {
        for (var i=0; i<fields.length; ++i) {
            if (fields[i].name==name) return fields[i].field;
        }
        return null;
    };

    // ��ȡ������
    this.getData = function() {
        var data = {};
        for (var i=0; i<fields.length; ++i) {
            var fd = fields[i];
            data[fd.name] = fd.field.getValue();
        }
        return data;
    };

    // ���ñ�
    this.reset = function() {
        for (var i=0; i<fields.length; ++i) {
            fields[i].field.reset();
        }
    };

	// ��������
	this.set = function(data)
	{
        for (var i=0; i<fields.length; ++i) {
            var fd = fields[i];
            var nm = fd.name;
            if (isset(data[nm])) fd.field.setValue(data[nm]);
        }
	};
};

MWT.extends(MWT.Form, MWT.Event);
