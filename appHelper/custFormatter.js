/*sap.ui.define([], function() {
	"use strict";
	return {
		formatStatus: function(sStatus) {
			debugger;
			return sStatus;
		}
	};

});*/

jQuery.sap.declare("appHelper.custFormatter");

appHelper.custFormatter = {
	
timestampformat: function(date){
	var n = date.toDateString();
	var time = date.toLocaleTimeString();
return n+" "+time;

},
volumeFormatter1:function(val1){
	if(val1!=="" && val1!=="0.00"){
		return val1;
	}
},
	formatStatus: function(sStatus) {

		if (sStatus != null) {
			if (sStatus.toLowerCase() === "open") {
				this.addStyleClass("cssOpen");
			
			} else if (sStatus.toLowerCase() === "warm") {
				this.addStyleClass("cssWarm");
			
			} else if (sStatus.toLowerCase() === "cold") {
				this.addStyleClass("cssCold");
			
			}
			else if (sStatus.toLowerCase() === "hot") {
				this.addStyleClass("cssHot");
			
			}
			else {
				this.addStyleClass("cssDrop");
			
			}

		}
		return sStatus;
	}
};