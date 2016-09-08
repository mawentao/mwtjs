/*
 * Simplified Chinese translation
 * By DavidHu
 * 09 April 2007
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">������...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} ѡ����";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "�ر�";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "����ֵ�Ƿ�";
}

Date.monthNames = [
   "һ��",
   "����",
   "����",
   "����",
   "����",
   "����",
   "����",
   "����",
   "����",
   "ʮ��",
   "ʮһ��",
   "ʮ����"
];

Date.dayNames = [
   "��",
   "һ",
   "��",
   "��",
   "��",
   "��",
   "��"
];

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "ȷ��",
      cancel : "ȡ��",
      yes    : "��",
      no     : "��"
   };
}

if(Ext.util.Format){
   Ext.util.Format.date = function(v, format){
      if(!v) return "";
      if(!(v instanceof Date)) v = new Date(Date.parse(v));
      return v.dateFormat(format || "y��m��d��");
   };
}

if(Ext.DatePicker){
   Ext.apply(Ext.DatePicker.prototype, {
      todayText         : "����",
      minText           : "��������С����֮ǰ",
      maxText           : "�������������֮��",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames        : Date.monthNames,
      dayNames          : Date.dayNames,
      nextText          : '���� (Control+Right)',
      prevText          : '���� (Control+Left)',
      monthYearText     : 'ѡ��һ���� (Control+Up/Down ���ı���)',
      todayTip          : "{0} (�ո��ѡ��)",
      format            : "y��m��d��",
      okText            : "ȷ��",
      cancelText        : "ȡ��"
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "��",
      afterPageText  : "ҳ�� {0} ҳ",
      firstText      : "��һҳ",
      prevText       : "ǰһҳ",
      nextText       : "��һҳ",
      lastText       : "���ҳ",
      refreshText    : "ˢ��",
      displayMsg     : "��ʾ {0} - {1}���� {2} ��",
      emptyMsg       : 'û��������Ҫ��ʾ'
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "�����������С������ {0}",
      maxLengthText : "�����������󳤶��� {0}",
      blankText     : "��������Ϊ������",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "�����������Сֵ�� {0}",
      maxText : "������������ֵ�� {0}",
      nanText : "{0} ������Ч��ֵ"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "����",
      disabledDatesText : "����",
      minText           : "������������ڱ����� {0} ֮��",
      maxText           : "������������ڱ����� {0} ֮ǰ",
      invalidText       : "{0} ����Ч������ - ������ϸ�ʽ�� {1}",
      format            : "y��m��d��"
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "����...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : '������������ǵ����ʼ���ַ����ʽ�磺 "user@example.com"',
      urlText      : '�������������URL��ַ����ʽ�磺 "http:/'+'/www.example.com"',
      alphaText    : '��������ֻ�ܰ����ַ���_',
      alphanumText : '��������ֻ�ܰ����ַ�,���ֺ�_'
   });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "����",
      sortDescText : "����",
      lockText     : "����",
      unlockText   : "������",
      columnsText  : "��"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "����",
      valueText  : "ֵ",
      dateFormat : "y��m��d��"
   });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "�϶����ı�ߴ�.",
      collapsibleSplitTip : "�϶����ı�ߴ�. ˫������."
   });
}
