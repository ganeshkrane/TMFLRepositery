jQuery.sap.declare("cus.crm.opportunity.CRM_OPPRTNTYExtension.util.Formatter");
cus.crm.opportunity.CRM_OPPRTNTYExtension.util.Formatter = {

	timestampformat: function(date) {
		var n = date.toDateString();
		var time = date.toLocaleTimeString();
		return n + " " + time;

	},
	notesDateFormatter: function(v) {
		if (v === "" || v === null || v === undefined) return "";
		if (!(v instanceof Date)) {
			v = new Date(v);
		}
		v.setMinutes(v.getTimezoneOffset());
		var l = "en-IN";
		var f = sap.ca.ui.model.format.DateFormat.getDateInstance({
			pattern:"dd MMM yyyy hh:mm",
			UTC:true,
			oLocale:l
		}, l);
		return f.format(v);
	}
}