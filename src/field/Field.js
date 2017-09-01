/**
 * Field
 **/
require('./Field.css');
MWT.Field=function(opt)
{
    this.listeners={};
    this.render=null;
    this.id="";
    this.value="";
    this.defaultValue="";
    this.cls="mwt-field";
    this.style="";

    this.construct=function(opt){
		if (opt){
			if(isset(opt.render)) this.render=opt.render;
			if(isset(opt.id)) this.id=opt.id;
			if(isset(opt.value)) this.value=opt.value;
			if(isset(opt.style)) this.style=opt.style;
			if(isset(opt.cls)) this.cls=opt.cls;
			this.defaultValue=this.value;
		}
    };

    this.getId=function(){return this.id;};
    this.getValue=function(){
        if (!this.validate()) {
            throw new Error('validate fail');
        } else {
		    return this.value;
        }
    };
    this.reset=function(){
        this.value=this.defaultValue;
        this.setValue(this.defaultValue);
    };
    this.validate=function(){
        return true;
    };
};
MWT.extends(MWT.Field, MWT.Event);

require('./TextField.js');
require('./SelectField.js');
require('./RadiobtnField.js');

require('./DatepickerField.js');
require('./DaterangepickerField.js');



