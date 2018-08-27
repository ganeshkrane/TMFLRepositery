/*
 * Copyright (C) 2009-2017 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("cus.crm.opportunity.util.Formatter");
jQuery.sap.require("sap.ca.ui.utils.busydialog");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseMasterController");
jQuery.sap.require("cus.crm.opportunity.util.schema");
jQuery.sap.require("cus.crm.opportunity.util.Util");
jQuery.sap.require("cus.crm.opportunity.util.Constants");
jQuery.sap.require("cus.crm.opportunity.CRM_OPPRTNTYExtension.appHelper.custFormatter");
sap.ui.controller("cus.crm.opportunity.CRM_OPPRTNTYExtension.view.S2Custom", {
	sorting1: function(e) {
		//new comment to check for git
		var c = this.oResourceBundle.getText('CLSDATE');
		var a = this.oResourceBundle.getText('ACT');
		var s = this.oResourceBundle.getText('STAT');
		var n = this.oResourceBundle.getText('Next_Followup');
		var v = this.oResourceBundle.getText('Visit_Date');

		this.sortingDailogFragment.getSortItems()[0].setText(c);
		this.sortingDailogFragment.getSortItems()[1].setText(a);
		this.sortingDailogFragment.getSortItems()[2].setText(s);
		this.sortingDailogFragment.getSortItems()[3].setText(n);
		this.sortingDailogFragment.getSortItems()[4].setText(v);
		this.sortingDailogFragment.setSortDescending(true);
		this.sortingDailogFragment.open();
	},

	applySort: function(k) {
		var s, o;
		if (k === this.oConstants.OPP_PROPS.CLOSING_DATE || k === this.oConstants.OPP_PROPS.PROSPECT_NAME || k === this.oConstants.OPP_PROPS.USER_STS_TEXT ||
			k === "VISITDATE" || k === "NEXTFOLLOWUP" || k === "StartDate") {
			if (this.sortingDailogFragment.getSortDescending() === true) {
				s = new sap.ui.model.Sorter(k, true, false);
			} else {
				s = new sap.ui.model.Sorter(k, false, false);
			}
		} else {
			s = new sap.ui.model.Sorter(k, false, false);
		}
		if (this.isOffline) {
			var S = new sap.ui.model.Sorter(this.oConstants.OPP_PROPS.GUID, false, false);
			o = [s, S];
		} else {
			o = [s];
		}
		this.getView().byId('list').getBinding("items").aSorters = [];
		this.getView().byId('list').getBinding("items").aSorters = o;
		this.getView().byId('list').getBinding("items").sort(o);
	},

	extHookAddExtraAttributes: function(o) {
		if (o) {
			o.push("NEXTFOLLOWUP");
			o.push("TENTIVEDATE");
			o.push("VISITDATE");
		}

		this.sortingDailogFragment = this.isOffline ? new sap.ui.xmlfragment(this.createId("show_Sort_Fragment"),
			'cus.crm.opportunity.view.SortingDialog_Offline', this) : new sap.ui.xmlfragment(this.createId("show_Sort_Fragment"),
			'cus.crm.opportunity.CRM_OPPRTNTYExtension.view.SortingDialog1', this);
	},

	extHookGetHeaderFooterOptions: function(oOptions) {
		var that = this;
		this.getList().onAfterRendering = function(e) {
			if (sap.m.List.prototype.onAfterRendering) {
				sap.m.List.prototype.onAfterRendering.apply(this, arguments);
			}

			if (this.getItems().length > 0) {
				var _oBinding = this.getBinding("items");
				var aSorters = [new sap.ui.model.Sorter("ClosingDate", true, false)];
				_oBinding.sort(aSorters);
			}
		};

		if (that.getOwnerComponent()._oViews._oViews["cus.crm.opportunity.view.S5"]) {
			var thatS5 = that.getOwnerComponent()._oViews._oViews["cus.crm.opportunity.view.S5"];
			thatS5.byId("CustSw_id").setState(true);
			thatS5.byId("cusLblCustomer").setVisible(true);
			thatS5.byId("customer").setVisible(true);
			thatS5.byId("applicantType").setVisible(false);
			thatS5.byId("FirstName").setVisible(false);
			thatS5.byId("LastName").setVisible(false);
			thatS5.byId("cusFirstName").setVisible(true);
			thatS5.byId("cusMiddleName").setVisible(true);
			thatS5.byId("cusLastName").setVisible(true);
			thatS5.byId("customerName").setVisible(true);
			thatS5.byId("cusPhone").setVisible(true);
			thatS5.byId("cusStd").setVisible(true);
			thatS5.byId("cusMobile").setVisible(true);
			thatS5.byId("tmlCustomer").setVisible(false);

			//////////////////////////////////
			thatS5.byId("customer").setValue("");
			thatS5.byId("cusFirstName").setValue("");
			thatS5.byId("cusMiddleName").setValue("");
			thatS5.byId("cusLastName").setValue("");
			thatS5.byId("cusAdd1").setValue("");
			thatS5.byId("cusAdd2").setValue("");
			thatS5.byId("cusMobile").setValue("");
			thatS5.byId("cusPinCode").setValue("");
			thatS5.byId("cusDistrict").setValue("");
			thatS5.byId("cusCity").setSelectedKey("");
			thatS5.byId("cusState").setValue("");

			thatS5.byId("cusPhone").setValue("");
			thatS5.byId("cusStd").setValue("");

			thatS5.byId("cusAdd3").setValue("");
			thatS5.byId("cusState").setValue("");
			thatS5.byId("cusFleetSize").setSelectedKey("");
			thatS5.byId("cusSeg").setSelectedKey("");
			thatS5.byId("cusFleetApp").setSelectedKey("");
			thatS5.byId("cusFleetSize").setSelectedKey("");
			thatS5.byId("cusDealerCVPV").setSelectedKey("");
			//thatS5.byId("statusdropdown").setSelectedKey("");
			thatS5.byId("cusDistchan").setSelectedKey("");
			thatS5.byId("cusDealerCVPV").setSelectedKey("");
			thatS5.byId("cusDistchan").setSelectedKey("");
			thatS5.byId("leadType").setSelectedKey("");
			thatS5.byId("cusDatePickerNextFollowup").setValue("");
			//	thatS5.byId("statusdropdown").setSelectedKey("");
			thatS5.byId("cusDatePickerTentative").setValue("");
			thatS5.byId("cusRemark").setValue("");
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd.MM.yyyy",
				UTC: false
			});
			thatS5.byId("cusDatePickerVisit").setValue(dateFormat.format(new Date(), false));
			thatS5.byId("cusDealerSelect").setValue("");
			thatS5.byId("cusDealerLocation").setValue("");
			/////////// set value state error ///////////
			if (thatS5.byId("applicantType").getVisible()) {
				thatS5.byId("applicantType").setSelectedKey("");
				thatS5.byId("applicantType").setValueState(sap.ui.core.ValueState.None);

			}

			thatS5.byId("FirstName").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("LastName").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("cusFirstName").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("cusMiddleName").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("cusLastName").setValueState(sap.ui.core.ValueState.None);
			//	thatS5.byId("statusdropdown").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("cusMobile").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("cusAdd1").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("cusAdd2").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("cusAdd3").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("cusPinCode").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("cusDealerCVPV").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("cusDistchan").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("customer").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("cusCity").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("cusPhone").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("cusStd").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("cusFleetSize").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("cusSeg").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("cusFleetApp").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("cusDealerLocation").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("cusDealerSelect").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("leadType").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("cusDatePickerNextFollowup").setValueState(sap.ui.core.ValueState.None);
			//	thatS5.byId("statusdropdown").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("cusDatePickerTentative").setValueState(sap.ui.core.ValueState.None);
			thatS5.byId("cusRemark").setValueState(sap.ui.core.ValueState.None);
			//Added By Bajrang on 11.07.2018 for clearing Product Table
			thatS5.byId("ProductButton11").setEnabled(false);
			thatS5.byId("idProdTable").removeAllItems();
			thatS5.byId("idProdTable").unbindAggregation("items");
			//Added By Bajrang on 11.07.2018 for clearing Product Table
		}
	}

});