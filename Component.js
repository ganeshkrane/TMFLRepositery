jQuery.sap.declare("cus.crm.opportunity.CRM_OPPRTNTYExtension.Component");

// use the load function for getting the optimized preload file if present

	
	
	

sap.ui.component.load({
	name: "cus.crm.opportunity",
	// Use the below URL to run the extended application when SAP-delivered application is deployed on SAPUI5 ABAP Repository
	url: "/sap/bc/ui5_ui5/sap/CRM_OPPRTNTY"
	//new sap.ui.core.routing.HashChanger().replaceHash("");
		// we use a URL relative to our own component
		// extension application is deployed with customer namespace
			
});

this.cus.crm.opportunity.Component.extend("cus.crm.opportunity.CRM_OPPRTNTYExtension.Component", {
	metadata: {
		manifest: "json",
		"includes":["css/customStyle.css"]
	
	}
		/*init : function() {
			new sap.ui.core.routing.HashChanger().replaceHash("Opportunity-display");
		}*/
});