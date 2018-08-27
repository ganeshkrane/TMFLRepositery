jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.utils.busydialog");
jQuery.sap.require("cus.crm.opportunity.util.schema");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("cus.crm.opportunity.util.Util");
sap.ui.controller("cus.crm.opportunity.CRM_OPPRTNTYExtension.view.S5Custom", {

	onAfterRendering: function() {
		var NextfollowDp = this.getView().byId("cusDatePickerNextFollowup");
		var TentDp = this.getView().byId("cusDatePickerTentative");
		var VisitDp = this.getView().byId("cusDatePickerVisit");

		$("#" + NextfollowDp.sId + "> Input").attr("readonly", "readonly");
		$("#" + TentDp.sId + "> Input").attr("readonly", "readonly");
		$("#" + VisitDp.sId + "> Input").attr("readonly", "readonly");

	},
	ResetFunc: function() {
		this.byId("cusLblCustomer").setVisible(true);
		this.byId("customer").setVisible(true);
		this.byId("applicantType").setVisible(false);
		this.byId("FirstName").setVisible(false);
		this.byId("LastName").setVisible(false);
		this.byId("cusFirstName").setVisible(true);
		this.byId("cusMiddleName").setVisible(true);
		this.byId("cusLastName").setVisible(true);
		this.byId("customerName").setVisible(true);
		this.byId("cusPhone").setVisible(true);
		this.byId("cusStd").setVisible(true);
		this.byId("cusMobile").setVisible(true);
		this.byId("tmlCustomer").setVisible(true);

		//////////////////////////////////
		this.byId("customer").setValue("");
		this.byId("cusFirstName").setValue("");
		this.byId("cusMiddleName").setValue("");
		this.byId("cusLastName").setValue("");
		this.byId("cusAdd1").setValue("");
		this.byId("cusAdd2").setValue("");
		this.byId("cusMobile").setValue("");
		this.byId("cusPinCode").setValue("");
		this.byId("cusDistrict").setValue("");
		this.byId("cusCity").setValue("");
		this.byId("cusState").setValue("");

		this.byId("cusPhone").setValue("");
		this.byId("cusStd").setValue("");

		this.byId("cusAdd3").setValue("");
		this.byId("cusState").setValue("");
		this.byId("cusFleetSize").setValue("");
		this.byId("cusSeg").setValue("");
		this.byId("cusFleetApp").setValue("");
		this.byId("cusFleetSize").setValue("");
		this.byId("cusDealerCVPV").setSelectedKey("");
		this.byId("cusDistchan").setSelectedKey("");
		this.byId("cusDealerCVPV").setValue("");
		this.byId("statusdropdown").setSelectedKey("");
		this.byId("leadType").setValue("");
		this.byId("cusRemark").setValue("");
		this.byId("cusDealerLocation").setValue("");
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
			pattern: "dd.MM.yyyy",
			UTC: false
		});
		this.byId("cusDatePickerVisit").setValue(dateFormat.format(new Date(), false));
		this.byId("cusDealerSelect").setValue("");
		this.byId("cusDealerLocation").setValue("");
		/////////// set value state error ///////////
		if (this.byId("applicantType").getVisible()) {
			this.byId("applicantType").setSelectedKey("");
			this.byId("applicantType").setValueState(sap.ui.core.ValueState.None);

		}

		this.byId("FirstName").setValueState(sap.ui.core.ValueState.None);
		this.byId("LastName").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusFirstName").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusMiddleName").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusLastName").setValueState(sap.ui.core.ValueState.None);

		this.byId("cusMobile").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusAdd1").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusAdd2").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusAdd3").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusPinCode").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusDealerCVPV").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusDistchan").setValueState(sap.ui.core.ValueState.None);
	},

	onCancel: function() {
		if (this._checkDataLoss()) {
			var c = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CONTINUE");
			var C = sap.m.MessageBox.Action.CANCEL;
			sap.m.MessageBox.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("DATA_LOSS"), {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("WARNING"),
				actions: [
					c,
					C
				],
				onClose: jQuery.proxy(function(a) {
					if (a == c) {
						var r = {};
						r.isConfirmed = true;
						this.datalossDismissed(r);
					} else if (a == C) {}
				}, this)
			});
		} else
			this.datalossDismissed({
				isConfirmed: true
			});
	},
	datalossDismissed: function(r) {
		if (r.isConfirmed === false)
			return;
		if (!this.followupOppt)
			var c = this.ContextPath;
		else
			var c = "Opportunities(guid'" + this.ContextPath + "')";
		if (!sap.ui.Device.system.phone && !this.fullScreen && !this.fullScreenFromTask && !this.newOpportunityFromAccount && !this.fullfollowupOppt &&
			!this.fullScreenFromLead) {
			if (c == " ") {
				c = "Opportunities";
			}
			this.oRouter.navTo("detail", {
				contextPath: c
			}, true);
		} else if (!sap.ui.Device.system.phone && (this.fullScreen || this.newOpportunityFromAccount)) {
			window.history.back();
		} else if (!sap.ui.Device.system.phone && (this.fullScreenFromTask || this.fullfollowupOppt || this.fullScreenFromLead)) {
			window.history.go(-1);
		} else
			this._navBack();
		this._clear_data();
		this._enableMasterFooter("");
		this.byId("customer").setValue("");
		this.byId("cusFirstName").setValue("");
		this.byId("cusLastName").setValue("");
		this.byId("cusAdd1").setValue("");
		this.byId("cusAdd2").setValue("");
		this.byId("cusMobile").setValue("");
		this.byId("cusPinCode").setValue("");
		this.byId("cusDistrict").setValue("");
		this.byId("cusCity").setValue("");
		this.byId("cusState").setValue("");
		this.byId("cusPhone").setValue("");
		this.byId("cusStd").setValue("");
		this.byId("applicantType").setSelectedKey("");
		this.byId("cusAdd3").setValue("");
		this.byId("cusState").setValue("");
		this.byId("cusFleetSize").setValue("");
		this.byId("cusSeg").setValue("");
		this.byId("cusFleetApp").setValue("");
		this.byId("cusFleetSize").setValue("");
		this.byId("cusDealerCVPV").setValue("");
		this.byId("cusDealerSelect").setValue("");
		this.byId("cusDealerLocation").setValue("");
		this.byId("cusDistchan").setValue("");
		this.byId("cusDatePickerNextFollowup").setValue("");
		this.byId("cusDatePickerTentative").setValue("");
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
			pattern: "dd.MM.yyyy",
			UTC: false
		});
		this.byId("cusDatePickerVisit").setValue(dateFormat.format(new Date(), false));
		//	this.byId("cusDatePickerVisit").setValue("");
		//	this.byId("cusDatePickerVisit").setValue("");
		this.byId("statusdropdown").setValue("");
		this.byId("statusdropdown").setSelectedKey("");
		this.byId("cusRemark").setValue("");
		this.byId("leadType").setValue("");

		this._custData.ZProduct.results = {};

		if (this.bBpDeterminationEnabled && this.bOrgDeterminationEnabled) {
			this.resetMultiDetermFlags();
		}
	},
	onSave: function() {
		var v = true;
		if (this.extHookOnSave) {
			v = this.extHookOnSave();
		}
		if (!v) {
			return;
		}

		if (this.byId("inputMainContact").getValue() !== "" && this.contactId === undefined) {
			this.showContactF4();
			return;
		}
		if (this.byId("inputMainContact").getValue() === "") {
			this.contactId = undefined;
		}

		this.dataConfirm({
			isConfirmed: true
		});

		this.byId("customer").setValue("");
		this.byId("cusFirstName").setValue("");
		this.byId("cusMiddleName").setValue("");
		this.byId("cusLastName").setValue("");
		this.byId("cusAdd1").setValue("");
		this.byId("cusAdd2").setValue("");
		this.byId("cusMobile").setValue("");
		this.byId("cusPinCode").setValue("");
		this.byId("cusDistrict").setValue("");
		this.byId("cusCity").setValue("");
		this.byId("cusState").setValue("");
		this.byId("cusPhone").setValue("");
		this.byId("cusStd").setValue("");
		this.byId("applicantType").setSelectedKey("");
		this.byId("cusAdd3").setValue("");
		this.byId("cusState").setValue("");
		this.byId("cusFleetSize").setValue("");
		this.byId("cusSeg").setValue("");
		this.byId("cusFleetApp").setValue("");
		this.byId("cusFleetSize").setValue("");
		this.byId("cusDealerCVPV").setValue("");
		this.byId("cusDealerSelect").setValue("");
		this.byId("cusDealerLocation").setValue("");
		this.byId("cusDistchan").setValue("");
		this.byId("cusDatePickerNextFollowup").setValue("");
		this.byId("cusDatePickerTentative").setValue("");
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
			pattern: "dd.MM.yyyy",
			UTC: false
		});
		this.getView().byId("cusDatePickerVisit").setValue(dateFormat.format(new Date(), false));

		this.byId("statusdropdown").setValue("");
		this.byId("statusdropdown").setSelectedKey("");
		this.byId("cusRemark").setValue("");

		this._custData.ZProduct.results = {};

		this.getView().getModel("controllers").getData().s2Controller;

		var a = this.getView().getModel("controllers").getData().s2Controller.getList().getBinding("items");

		a.refresh(true);

	},

	dataConfirm: function(r) {
		if (r.isConfirmed) {
			if (this.WinStatusCode === this.byId("statusdropdown").getSelectedKey()) {
				this.getView().byId("chanceofSuccess").setValue(100);
			}
			if (this.LostStatusCode === this.byId("statusdropdown").getSelectedKey()) {
				this.getView().byId("chanceofSuccess").setValue(0);
			}
			var u = "";
			var a = "";

			if (this.byId("statusdropdown").getSelectedKey() == "") {
				u = this.UserStatusCode;
				a = this.UserStatusText;
			} else {
				u = this.byId("statusdropdown").getSelectedKey();
				a = this.byId("statusdropdown").getSelectedItem().getText();
			}
			var s = this.byId("datePickerStartDate").getDateValue();
			var e = this.byId("datePickerCloseDate").getDateValue();
			var b = s.getFullYear() + "-" + (s.getMonth() + 1) + "-" + s.getDate() + "T00:00:00";
			var c = e.getFullYear() + "-" + (e.getMonth() + 1) + "-" + e.getDate() + "T00:00:00";
			var follDate;
			var tentDate;
			var visitDate;

			var follDatePicker = this.byId("cusDatePickerNextFollowup").getDateValue();
			if (follDatePicker != null) {
				follDate = follDatePicker.getFullYear() + "-" + (follDatePicker.getMonth() + 1) + "-" + follDatePicker.getDate() + "T00:00:00";
			}
			var tentDatePicker = this.byId("cusDatePickerTentative").getDateValue();
			if (tentDatePicker != null) {
				tentDate = tentDatePicker.getFullYear() + "-" + (tentDatePicker.getMonth() + 1) + "-" + tentDatePicker.getDate() + "T00:00:00";
			}
			var visitDatePicker = this.byId("cusDatePickerVisit").getDateValue();
			if (visitDatePicker != null) {
				visitDate = visitDatePicker.getFullYear() + "-" + (visitDatePicker.getMonth() + 1) + "-" + visitDatePicker.getDate() +
					"T00:00:00";
			}
			var d = "00000000-0000-0000-0000-000000000000";
			var m = this.getView().getModel();
			var t = this;
			if (this.followupOppt) {
				this.PredecessorGUID = this.ContextPath;
			} else if (this.fullScreen) {
				this.PredecessorGUID = this.appointmentGuid;
				this.accountId = this.AccountId;
			} else if (this.fullScreenFromTask) {
				this.PredecessorGUID = this.taskGuid;
			} else if (this.fullScreenFromLead) {
				this.PredecessorGUID = this.leadGuid;
				this.accountId = this.AccountId;
			} else {
				this.PredecessorGUID = null;
			}
			var ExstCusFlg = this.byId("CustSw_id").getState() ? "X" : "";
			var E = {
				Description: this.byId("desc").getValue(),
				ProcessType: this.processType,
				StartDate: b,
				ClosingDate: c,
				ExpectedSalesVolume: "0.00", // this.byId("volume").getValue(),
				SalesStageCode: this.byId("stagedropdown").getSelectedKey(),
				UserStatusCode: u,
				UserStatusText: a,
				PriorityCode: this.byId("priority_val").getSelectedKey(),
				PriorityText: this.byId("priority_val").getSelectedText(),
				ProspectName: this.byId("customer").getValue(),
				ProspectNumber: this.accountId,
				MainContactId: this.contactId,
				MainContactName: this.byId("inputMainContact").getValue(),
				ChanceOfSuccess: this.byId("chanceofSuccess").getValue(),
				ForecastRelevance: this.byId("Switch").getState(),
				CurrencyCode: this.byId("currency").getValue(),
				BPTYPE: this.byId("applicantType").getSelectedKey(),
				Sorg: this.byId("loanType").getSelectedKey(),
				NAMEFIRST: this.byId("cusFirstName").getValue(),
				NAMEMIDDLE: this.byId("cusMiddleName").getValue(),
				NAMELAST: this.byId("cusLastName").getValue(),
				ADDRESS1: this.byId("cusAdd1").getValue(),
				ADDRESS2: this.byId("cusAdd2").getValue(),
				ADDRESS3: this.byId("cusAdd3").getValue(),
				PHONE: this.byId("cusPhone").getValue(),
				TelExtens: this.byId("cusStd").getValue(),
				POST_CODE1: this.byId("cusPinCode").getValue(),
				DISTRICT: this.byId("cusDistrict").getValue(),
				CITY1: this.byId("cusCity").getValue(),
				REGION: this.byId("cusState").getValue(),
				MOBILE: this.byId("cusMobile").getValue(),
				CUSTSEGMENT: this.byId("cusSeg").getSelectedKey(),
				FLEETSIZE: this.byId("cusFleetSize").getSelectedKey(),
				FLEETAPPL: this.byId("cusFleetApp").getSelectedKey(),
				DEALERNAME: this.byId("cusDealerSelect").getSelectedKey(),
				DEALERLOC: this.byId("cusDealerLocation").getValue(),
				Branch: this.byId("cusDealerCVPV").getSelectedKey(),
				Zchannel: this.byId("cusDistchan").getSelectedKey(),
				LeadComment: this.byId("cusRemark").getValue(),
				Ztml: this.byId("tmlCustomer").getSelectedKey(),
				Zleadtype: this.byId("leadType").getSelectedKey(),
				Zzecus: ExstCusFlg,
				NEXTFOLLOWUP: follDate,
				TENTIVEDATE: tentDate,
				VISITDATE: visitDate,

				Guid: d,
				Statuses: [{
					HeaderGuid: d,
					StatusProfile: this.StatusProfile,
					UserStatusCode: u,
					UserStatusText: a,
					StatusOrderNumber: "01"
				}],
				Products: [],
				ZProduct: [],
				SalesTeam: []
			};

			if (parseFloat(this.sBackendVersion) >= 4) {
				E.SalesOrganization = this.acc_salesorgid;
				E.SalesOrganizationDescription = this.acc_salesorgdesc;
				E.DistributionChannel = this.acc_dischaid;
				E.DistributionChannelDescription = this.acc_dischadesc;
				E.Division = this.acc_divid;
				E.DivisionDescription = this.acc_divdesc;
			}
			if (parseFloat(this.sBackendVersion) >= 2) {
				if (this.byId("inputEmpResponsible_S5").getValue() !== "") {
					E["EmployeeResponsibleNumber"] = this.oSelectedEmployee.employeeID ? this.oSelectedEmployee.employeeID : this.EmployeeResponsibleNumber;
				} else {
					E["EmployeeResponsibleNumber"] = "";
				}
			}
			if (parseFloat(this.sBackendVersion) >= 3) {
				E["PredecessorGUID"] = this.PredecessorGUID;
			}

			var p = this.getView().byId("productBasket").getModel("json").getData().Products;
			var i = 0;
			if (p && p.length) {
				var f = p.length;
				var L;
				for (i = 0; i < f; i++) {
					L = p[i];
					var g = {
						HeaderGuid: d,
						ProcessingMode: "A",
						ProductGuid: L.ProductGuid,
						ProductId: L.ProductId,
						ProductName: L.ProductName,
						Quantity: L.Quantity,
						TotalExpectedNetValue: L.TotalExpectedNetValue,
						Unit: L.Unit
					};
					if (this.extHookExtendProductEntry) {
						this.extHookExtendProductEntry(g, L);
					}
					E.Products.push(g);
				}
			}

			var ProductTab = this.byId("idProdTable");
			var Items = ProductTab.getItems();
			if (Items.length > 0) {
				for (var i = 0; i < Items.length; i++) {
					var _saveingRecord = {
						"Guid": "00000000-0000-0000-0000-000000000001", //_zProduct.results[i].Guid,
						"RecordId": "00000000-0000-0000-0000-000000000001",
						// "OobjectId": _zProduct.results[i].OobjectId,
						"CategoryId": Items[i].getCells()[0].getSelectedKey(),
						"ProductId": Items[i].getCells()[1].getSelectedKey(),
						"Quantity": Items[i].getCells()[2].getValue()
					};
					E.ZProduct.push(_saveingRecord);
				}
			}
			var h;
			if (parseFloat(this.sBackendVersion) >= 4 && this.getView().byId("partnerBasket").getModel("json").getData().SalesTeam) {
				h = this.getView().byId("partnerBasket").getModel("json").getData().SalesTeam;
				if (h.length > 0) {
					if (this.followupOppt) {
						var n = new Array();
						var o = new Array();
						if (this.oldList.oData.hasOwnProperty("Competitor")) {
							for (var i = 0; i < this.oldList.oData["Competitor"].length; i++) {
								var g = {
									partner: "Competitor",
									name: this.oldList.oData["Competitor"][i].value,
									key: this.oldList.oData["Competitor"][i].key
								};
								o.push(g);
							}
						}
						var v = this.participantsF4MultiselectFragment.getModel("json").getProperty("/PartnerFunctions");
						for (var k = 0; k < v.length; k++) {
							if (this.oldList.oData[v[k].PartnerFunctionName])
								for (var i = 0; i < this.oldList.oData[v[k].PartnerFunctionName].length; i++) {
									if (this.deletedFromMain)
										if (this.deletedFromMain.oData[v[k].PartnerFunctionName])
											for (var j = 0; j < this.deletedFromMain.oData[v[k].PartnerFunctionName].length; j++) {
												if (this.deletedFromMain.oData[v[k].PartnerFunctionName][j].key == this.oldList.oData[v[k].PartnerFunctionName][i].key) {
													var g = {
														partner: v[k].PartnerFunctionName,
														name: this.deletedFromMain.oData[v[k].PartnerFunctionName][j].value,
														key: this.deletedFromMain.oData[v[k].PartnerFunctionName][j].key
													};
													n.push(g);
												}
											}
								}
						}
						for (var l = 0; l < h.length; l++) {
							for (var q = 0; q < n.length; q++) {
								if (h[l].PartnerFunction == n[q].partner && h[l].Key == n[q].key)
									n.splice(q, 1);
							}
						}
						if (!this.participantsF4MultiselectFragment.getModel("temp")) {
							this.participantsF4MultiselectFragment.setModel(new sap.ui.model.json.JSONModel(), "temp");
						}
						for (var i = 0; i < h.length; i++) {
							if (!this.participantsF4MultiselectFragment.getModel("temp").getProperty("/" + h[i].PartnerFunction)) {
								var g = {
									partner: h[i].PartnerFunction,
									name: h[i].Name,
									key: h[i].Key
								};
								this.participantsF4MultiselectFragment.getModel("temp").setProperty("/" + h[i].PartnerFunction, [g]);
							} else {
								var g = {
									partner: h[i].PartnerFunction,
									name: h[i].Name,
									key: h[i].Key
								};
								this.participantsF4MultiselectFragment.getModel("temp").getProperty("/" + h[i].PartnerFunction).push(g);
							}
						}
						for (var i = 0; i < n.length; i++) {
							if (!this.participantsF4MultiselectFragment.getModel("temp").getProperty("/" + n[i].partner)) {
								var g = {
									partner: n[i].partner,
									name: n[i].name,
									key: n[i].key
								};
								this.participantsF4MultiselectFragment.getModel("temp").setProperty("/" + n[i].partner, [g]);
							} else {
								var g = {
									partner: n[i].partner,
									name: n[i].name,
									key: n[i].key
								};
								this.participantsF4MultiselectFragment.getModel("temp").getProperty("/" + n[i].partner).push(g);
							}
						}
						for (var i = 0; i < v.length; i++) {
							if (this.oldList.oData[v[i].PartnerFunctionName])
								for (var j = 0; j < this.oldList.oData[v[i].PartnerFunctionName].length; j++) {
									if (this.participantsF4MultiselectFragment.getModel("temp").getProperty("/" + encodeURIComponent(v[i].PartnerFunctionName))) {
										for (var k = 0; k < this.participantsF4MultiselectFragment.getModel("temp").getProperty("/" + encodeURIComponent(v[i].PartnerFunctionName))
											.length; k++) {
											if (this.participantsF4MultiselectFragment.getModel("temp").getProperty("/" + encodeURIComponent(v[i].PartnerFunctionName))[k]
												.partner == v[i].PartnerFunctionName && this.participantsF4MultiselectFragment.getModel("temp").getProperty("/" +
													encodeURIComponent(v[i].PartnerFunctionName))[k].key == this.oldList.oData[v[i].PartnerFunctionName][j].key)
												this.participantsF4MultiselectFragment.getModel("temp").getProperty("/" + encodeURIComponent(v[i].PartnerFunctionName)).splice(
													k, 1);
										}
									}
								}
						}
						for (var i = 0; i < v.length; i++) {
							if (this.participantsF4MultiselectFragment.getModel("temp").getProperty("/" + encodeURIComponent(v[i].PartnerFunctionName)))
								for (var j = 0; j < this.participantsF4MultiselectFragment.getModel("temp").getProperty("/" + encodeURIComponent(v[i].PartnerFunctionName))
									.length; j++) {
									var g = {
										partner: this.participantsF4MultiselectFragment.getModel("temp").getProperty("/" + encodeURIComponent(v[i].PartnerFunctionName))[
											j].partner,
										name: this.participantsF4MultiselectFragment.getModel("temp").getProperty("/" + encodeURIComponent(v[i].PartnerFunctionName))[
											j].name,
										key: this.participantsF4MultiselectFragment.getModel("temp").getProperty("/" + encodeURIComponent(v[i].PartnerFunctionName))[
											j].key
									};
									o.push(g);
								}
						}
						for (var i = 0; i < o.length; i++) {
							for (var j = 0; j < h.length; j++) {
								if (o[i].partner == h[j].PartnerFunction && o[i].key == h[j].Key)
									h.splice(j, 1);
							}
						}
					}
					if (this.participantsF4MultiselectFragment.getModel("SelectedPartnerCategoryMainDelete"))
						this.participantsF4MultiselectFragment.getModel("SelectedPartnerCategoryMainDelete").destroy();
					if (this.participantsF4MultiselectFragment.getModel("temp"))
						this.participantsF4MultiselectFragment.getModel("temp").destroy();
					this.newItems = o;
					this.deletedItems = n;
				}
			} else {
				h = "";
			}
			if (h.length > 0) {
				var i = 0;
				var P = this.participantsF4MultiselectFragment.getModel("json").getProperty("/PartnerFunctions");
				if (P == undefined || P.length === 0) {
					P = this.partnerDeterminationMap[this.processType];
				}
				var w = this.participantsF4MultiselectFragment.getModel("PartnersBasedOnType");
				if (h && h.length) {
					var f = h.length;
					for (i = 0; i < f; i++) {
						var L = h[i];
						var x;
						for (var y = 0; y < P.length; y++) {
							if (P[y].PartnerFunctionName == L.PartnerFunction) {
								x = P[y].PartnerFunctionCode;
							}
						}
						var g = {
							HeaderGuid: d,
							PartnerFunctionCode: x,
							PartnerNumber: L.Key,
							PartnerName: L.Name,
							PartnerFunctionText: L.PartnerFunction
						};
						if (this.extHookExtendSalesItemEntry) {
							this.extHookExtendSalesItemEntry(g, L);
						}
						E.SalesTeam.push(g);
					}
				}
				var z = this.getView().byId("partnerBasket").getItems();
				for (var A = 0; A < z.length; A++) {
					this.getView().byId("partnerBasket").removeItem(z[A]);
					z[A].destroy();
				}
				this.participantsF4MultiselectFragment.getModel("json").getData().PartnerFunctions = this.partnerDeterminationMap[this.processType];
				var B = this.participantsF4MultiselectFragment.getModel("json").getProperty("/PartnerFunctions");
				for (var C = 0; C < B.length; C++) {
					if (this.participantsF4MultiselectFragment.getContent()[0].getPages()[0].getContent()[0].getItems()[C]) {
						this.participantsF4MultiselectFragment.getContent()[0].getPages()[0].getContent()[0].getItems()[C].setInfo(" ");
					}
				}
				this.participantsF4MultiselectFragment.getModel("json").destroy();
				if (this.participantsF4MultiselectFragment.getModel("PartnersBasedOnType")) {
					this.participantsF4MultiselectFragment.getModel("PartnersBasedOnType").destroy();
				}
				this.participantsF4MultiselectFragment.getModel("SelectedPartnerCategory").destroy();
				this.byId("partnerBasket").getModel("json").updateBindings();
			}
			if (this.extHookSaveOentry) {
				this.extHookSaveOentry(E);
			}
			m.refreshSecurityToken();
			this.setBtnEnabled("sv", false);
			sap.ca.ui.utils.busydialog.requireBusyDialog();
			var D = this;
			var m = this.getView().getModel();
			var F = [];
			var G = [];
			var H = this.followupOppt;
			var I = this.newItems;
			var J = this.deletedItems;
			if (!I)
				I = [];
			if (!J)
				J = [];
			var P = this.partnerDeterminationMap[this.processType];
			var t = this;
			var K = false;
			var M = this.sBackendVersion;
			var N;

			m.create("/Opportunities", E, null, function(O, Q) {
				var R = t.getView().getModel("controllers").getData().s2Controller;
				if (R) {
					R.opportunityID = O.Id;
				}
				if (H && (I.length > 0 || J.length > 0) && parseFloat(M) >= 4) {
					for (var i = 0; i < I.length; i++) {
						var S;
						for (var k = 0; k < P.length; k++) {
							if (P[k].PartnerFunctionName == I[i].partner)
								S = P[k].PartnerFunctionCode;
						}
						E = {
							HeaderGuid: O.Guid,
							PartnerNumber: I[i].key,
							PartnerFunctionCode: S
						};
						F.push(m.createBatchOperation("OpportunitySalesTeamSet", "POST", E, null));
					}
					for (var i = 0; i < J.length; i++) {
						var S;
						for (var k = 0; k < P.length; k++) {
							if (P[k].PartnerFunctionName == J[i].partner)
								S = P[k].PartnerFunctionCode;
						}
						E = {
							HeaderGuid: O.Guid,
							PartnerNumber: J[i].key,
							PartnerFunctionCode: S
						};
						var T = [
							"OpportunitySalesTeamSet(HeaderGuid=guid'",
							E.HeaderGuid,
							"',PartnerNumber='",
							E.PartnerNumber,
							"',PartnerFunctionCode='",
							E.PartnerFunctionCode,
							"')"
						].join("");
						G.push(m.createBatchOperation(T, "DELETE", null, null));
					}
					if (F.length > 0)
						m.addBatchChangeOperations(F);
					if (G.length > 0)
						m.addBatchChangeOperations(G);
					m.submitBatch(jQuery.proxy(function(X) {
						for (var j = 0; j < X.__batchResponses.length; j++) {
							switch (j) {
								case 0:
									if (X.__batchResponses[0]) {
										for (var i = 0; i < X.__batchResponses[0].__changeResponses.length; i++) {
											if (X.__batchResponses[0].__changeResponses[i].statusCode < 400) {
												K = true;
												N = X.__batchResponses[0].__changeResponses[i].statusText;
											}
										}
									}
									break;
								default:
									if (X.__batchResponses[1]) {
										for (var i = 0; i < X.__batchResponses[1].__changeResponses.length; i++) {
											if (X.__batchResponses[1].__changeResponses[i].statusCode < 400) {
												K = true;
												N = X.__batchResponses[0].__changeResponses[i].statusText;
											}
										}
									}
									break;
							}
						}
					}, t), jQuery.proxy(function(X) {
						t.handleErrors(X);
					}, t));
				}
				if (K)
					sap.m.MessageToast.show(N);
				if (!D.fullScreen && !D.fullScreenFromTask && !D.fullfollowupOppt && !D.newOpportunityFromAccount && !D.fullScreenFromLead)
					t._enableMasterFooter(Q.data.Guid);
				t.ContextPath = "Opportunities(guid'" + Q.data.Guid + "')";
				if (D.followupOppt || D.fullScreen || D.fullScreenFromTask || D.fullScreenFromLead) {
					sap.ui.getCore().getEventBus().publish("cus.crm.opportunity", "followUpOpportunityCreated", {
						contextPath: t.ContextPath
					});
					var U = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("followupsuccessful");
					sap.m.MessageToast.show(U, {
						closeOnBrowserNavigation: false
					});
				} else {
					sap.ui.getCore().getEventBus().publish("cus.crm.opportunity", "opportunityCreated");
					sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SAVE_SUCCESS"), {
						closeOnBrowserNavigation: false
					});
				}
				t._clear_data();
				if (t.bBpDeterminationEnabled && t.bOrgDeterminationEnabled) {
					t.resetMultiDetermFlags();
				}
				var V = false;
				if (t.extHookNavigateAfterCreate) {
					V = t.extHookNavigateAfterCreate(O, Q);
				}
				if (V) {
					sap.ca.ui.utils.busydialog.releaseBusyDialog();
					return;
				}
				sap.ca.ui.utils.busydialog.releaseBusyDialog();
				var W = t.ContextPath;
				if (!sap.ui.Device.system.phone && !D.fullScreen && !D.fullScreenFromTask && !D.fullScreenFromLead && !D.fullfollowupOppt && !D.newOpportunityFromAccount)
					t.oRouter.navTo("detail", {
						contextPath: W
					}, true);
				else if (!sap.ui.Device.system.phone && D.fullScreen) {
					t.oRouter.navTo("display", {
						contextPath: W
					}, true);
				} else if (!sap.ui.Device.system.phone && D.fullfollowupOppt) {
					t.oRouter.navTo("display", {
						contextPath: W
					}, true);
				} else if (!sap.ui.Device.system.phone && (D.fullScreenFromTask || D.fullScreenFromLead)) {
					t.oRouter.navTo("display", {
						contextPath: W
					}, true);
				} else if (!sap.ui.Device.system.phone && D.newOpportunityFromAccount) {
					t.oRouter.navTo("display", {
						contextPath: W
					}, true);
				} else if (sap.ui.Device.system.phone && (D.fullScreen || D.fullScreenFromTask || D.fullScreenFromLead || D.fullfollowupOppt || D.newOpportunityFromAccount)) {
					t.oRouter.navTo("display", {
						contextPath: W
					}, true);
				} else
					t._navBack();

			}, function(O) {
				t.displayResponseErrorMessage(O, sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SAVE_FAILED"));
				sap.ca.ui.utils.busydialog.releaseBusyDialog();
				t.setBtnEnabled("sv", true);
			});
		} else
			return;
	},
	/*		t.H = H;
			t.I = I;
			t.j = j;
			t.J = J;
			t.M = M;
			t.P = P;
			t.E = E;
			t.F = F;
			t.G = G;
			t.m = m;
			t.K = K;
			t.N = N;
			t.D = D;
			var readop = [];
			var createop = [];
			createop.push(m.createBatchOperation("/Opportunities", "POST", E));
			m.addBatchChangeOperations(createop);
			
			readop.push(m.createBatchOperation("/DuplicateSet", "GET"));
			m.addBatchReadOperations(readop);
			//var oReadOperation2 = m.createBatchOperation("/DuplicateSet", "GET");
			//var aReadOperations = [oReadOperation1,oReadOperation2];
			//	m.addBatchOperations(aReadOperations);

			//oModel.submitBatch(function(oData, oResponse, aErrorResponses) {
			m.submitBatch(function(O, Q) {
				//	m.create("/Opportunities", E, null, function(O, Q) {
				if (O.__batchResponses[1].response.statusCode === "400") {

					var json = new sap.ui.model.json.JSONModel();
					json.setData(O.__batchResponses[1].data);

					// this.DuplicateFragment = null;
					//  t.DuplicateFragment = new sap.ui.xmlfragment(t.createId("DuplicateTab"),"cus.crm.opportunity.CRM_OPPRTNTYExtension.view.DuplicateTab", this);
					if (!t.DuplicateFragment) {
						t.DuplicateFragment = new sap.ui.xmlfragment("cus.crm.opportunity.CRM_OPPRTNTYExtension.view.DuplicateTab", t);
						//	this.DuplicateFragment.setModel(json);

						sap.ui.getCore().byId("idDupliTable").setModel(json);
						t.DuplicateFragment.setModel(this.oI18nModel, "i18n");

						//	t.DuplicateFragment.addButton({
						// 		beginButton:new sap.m.Button({
						// 		text: "Cancel",
						// 		press: function (H,I,j,J,M,P,E,F,G,m,K,N,D,Q) {
						// 			t.DuplicateFragment.close();
						// 			var Fsave="X";
						// 			var CUSTOMERID="";
						// 			t.DuplucateMethod(H,I,j,J,M,p,E,F,G,m,K,N,D,Q,Fsave,CUSTOMERID);
						// 		}
						// 	}),
						// 	endButton:new sap.m.Button({
						// 		text: "Continue",
						// 		press: function (H,I,j,J,M,P,E,F,G,m,K,N,D,Q) {
						// 			t.DuplicateFragment.close();
						// 			var Fsave="X";
						// 			var CUSTOMERID=t.BPPartner;
						// 			t.DuplucateMethod(H,I,j,J,M,p,E,F,G,m,K,N,D,Q,Fsave,CUSTOMERID);
						// 		}
						// 	})
						// 	});

					}
					sap.ca.ui.utils.busydialog.releaseBusyDialog();
					t.DuplicateFragment.open();
				} else {
					var O = O.__batchResponses[0].data;
					var R = t.getView().getModel("controllers").getData().s2Controller;
					if (R) {
						R.opportunityID = O.Id;
					}
					if (H && (I.length > 0 || J.length > 0) && parseFloat(M) >= 4) {
						for (var i = 0; i < I.length; i++) {
							var S;
							for (var k = 0; k < P.length; k++) {
								if (P[k].PartnerFunctionName == I[i].partner)
									S = P[k].PartnerFunctionCode;
							}
							E = {
								HeaderGuid: O.Guid,
								PartnerNumber: I[i].key,
								PartnerFunctionCode: S
							};
							F.push(m.createBatchOperation("OpportunitySalesTeamSet", "POST", E, null));
						}
						for (var i = 0; i < J.length; i++) {
							var S;
							for (var k = 0; k < P.length; k++) {
								if (P[k].PartnerFunctionName == J[i].partner)
									S = P[k].PartnerFunctionCode;
							}
							E = {
								HeaderGuid: O.Guid,
								PartnerNumber: J[i].key,
								PartnerFunctionCode: S
							};
							var T = [
								"OpportunitySalesTeamSet(HeaderGuid=guid'",
								E.HeaderGuid,
								"',PartnerNumber='",
								E.PartnerNumber,
								"',PartnerFunctionCode='",
								E.PartnerFunctionCode,
								"')"
							].join("");
							G.push(m.createBatchOperation(T, "DELETE", null, null));
						}
						if (F.length > 0)
							m.addBatchChangeOperations(F);
						if (G.length > 0)
							m.addBatchChangeOperations(G);
						m.submitBatch(jQuery.proxy(function(X) {
							for (var j = 0; j < X.__batchResponses.length; j++) {
								switch (j) {
									case 0:
										if (X.__batchResponses[0]) {
											for (var i = 0; i < X.__batchResponses[0].__changeResponses.length; i++) {
												if (X.__batchResponses[0].__changeResponses[i].statusCode < 400) {
													K = true;
													N = X.__batchResponses[0].__changeResponses[i].statusText;
												}
											}
										}
										break;
									default:
										if (X.__batchResponses[1]) {
											for (var i = 0; i < X.__batchResponses[1].__changeResponses.length; i++) {
												if (X.__batchResponses[1].__changeResponses[i].statusCode < 400) {
													K = true;
													N = X.__batchResponses[0].__changeResponses[i].statusText;
												}
											}
										}
										break;
								}
							}
						}, t), jQuery.proxy(function(X) {
							t.handleErrors(X);
						}, t));
					}
					if (K)
						sap.m.MessageToast.show(N);
					if (!D.fullScreen && !D.fullScreenFromTask && !D.fullfollowupOppt && !D.newOpportunityFromAccount && !D.fullScreenFromLead)
						t._enableMasterFooter(Q.data.Guid);
					t.ContextPath = "Opportunities(guid'" + Q.data.Guid + "')";
					if (D.followupOppt || D.fullScreen || D.fullScreenFromTask || D.fullScreenFromLead) {
						sap.ui.getCore().getEventBus().publish("cus.crm.opportunity", "followUpOpportunityCreated", {
							contextPath: t.ContextPath
						});
						var U = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("followupsuccessful");
						sap.m.MessageToast.show(U, {
							closeOnBrowserNavigation: false
						});
					} else {
						sap.ui.getCore().getEventBus().publish("cus.crm.opportunity", "opportunityCreated");
						sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SAVE_SUCCESS"), {
							closeOnBrowserNavigation: false
						});
					}
					t._clear_data();
					if (t.bBpDeterminationEnabled && t.bOrgDeterminationEnabled) {
						t.resetMultiDetermFlags();
					}
					var V = false;
					if (t.extHookNavigateAfterCreate) {
						V = t.extHookNavigateAfterCreate(O, Q);
					}
					if (V) {
						sap.ca.ui.utils.busydialog.releaseBusyDialog();
						return;
					}
					sap.ca.ui.utils.busydialog.releaseBusyDialog();
					var W = t.ContextPath;
					if (!sap.ui.Device.system.phone && !D.fullScreen && !D.fullScreenFromTask && !D.fullScreenFromLead && !D.fullfollowupOppt && !D.newOpportunityFromAccount)
						t.oRouter.navTo("detail", {
							contextPath: W
						}, true);
					else if (!sap.ui.Device.system.phone && D.fullScreen) {
						t.oRouter.navTo("display", {
							contextPath: W
						}, true);
					} else if (!sap.ui.Device.system.phone && D.fullfollowupOppt) {
						t.oRouter.navTo("display", {
							contextPath: W
						}, true);
					} else if (!sap.ui.Device.system.phone && (D.fullScreenFromTask || D.fullScreenFromLead)) {
						t.oRouter.navTo("display", {
							contextPath: W
						}, true);
					} else if (!sap.ui.Device.system.phone && D.newOpportunityFromAccount) {
						t.oRouter.navTo("display", {
							contextPath: W
						}, true);
					} else if (sap.ui.Device.system.phone && (D.fullScreen || D.fullScreenFromTask || D.fullScreenFromLead || D.fullfollowupOppt || D
							.newOpportunityFromAccount)) {
						t.oRouter.navTo("display", {
							contextPath: W
						}, true);
					} else
						t._navBack();
				}

			}, function(O) {
				//	t.displayResponseErrorMessage(O, sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SAVE_FAILED"));
				sap.ca.ui.utils.busydialog.releaseBusyDialog();
				t.setBtnEnabled("sv", true);

				//	var sFilter1 = new sap.ui.model.Filter("Businesspartner", "EQ",t.BusPartnerId);
				t.oModel.read("/DuplicateSet", {
					success: jQuery.proxy(t._onPostalReadSuccess1, this),
					error: jQuery.proxy(t._onPostalReadError, this)
				});

			});
			
		} else
			return;
	},*/
	handleDetailPress: function(evt) {
		var obj = evt.getSource().getBindingContext().getObject();
		this.BPPartner = obj.BusinessPartner;
	},
	ItemPress: function(evt) {
		var obj = evt.getSource().getSelectedItem().getBindingContext().getObject();
		this.BPPartner = obj.Businesspartner;
		sap.ui.getCore().byId("ProceedDup_id").setVisible(true);
		//	sap.ui.getCore().byId("").setVisible(true);
	},
	DuplucateMethod: function(H, I, j, J, M, p, E, F, G, m, K, N, D, Fsave, CUSTOMERID) {
		var t = this;
		if (CUSTOMERID !== undefined) {
			E.CUSTOMERID = CUSTOMERID;
		}
		E.Fsave = Fsave;
		this.getView().getModel().create("/Opportunities", E, null, function(O, Q) {
			var R = t.getView().getModel("controllers").getData().s2Controller;
			if (R) {
				R.opportunityID = O.Id;
			}
			if (H && (I.length > 0 || J.length > 0) && parseFloat(M) >= 4) {
				for (var i = 0; i < I.length; i++) {
					var S;
					for (var k = 0; k < P.length; k++) {
						if (P[k].PartnerFunctionName == I[i].partner)
							S = P[k].PartnerFunctionCode;
					}
					E = {
						HeaderGuid: O.Guid,
						PartnerNumber: I[i].key,
						PartnerFunctionCode: S
					};
					F.push(m.createBatchOperation("OpportunitySalesTeamSet", "POST", E, null));
				}
				for (var i = 0; i < J.length; i++) {
					var S;
					for (var k = 0; k < P.length; k++) {
						if (P[k].PartnerFunctionName == J[i].partner)
							S = P[k].PartnerFunctionCode;
					}
					E = {
						HeaderGuid: O.Guid,
						PartnerNumber: J[i].key,
						PartnerFunctionCode: S
					};
					var T = [
						"OpportunitySalesTeamSet(HeaderGuid=guid'",
						E.HeaderGuid,
						"',PartnerNumber='",
						E.PartnerNumber,
						"',PartnerFunctionCode='",
						E.PartnerFunctionCode,
						"')"
					].join("");
					G.push(m.createBatchOperation(T, "DELETE", null, null));
				}
				if (F.length > 0)
					m.addBatchChangeOperations(F);
				if (G.length > 0)
					m.addBatchChangeOperations(G);
				m.submitBatch(jQuery.proxy(function(X) {
					for (var j = 0; j < X.__batchResponses.length; j++) {
						switch (j) {
							case 0:
								if (X.__batchResponses[0]) {
									for (var i = 0; i < X.__batchResponses[0].__changeResponses.length; i++) {
										if (X.__batchResponses[0].__changeResponses[i].statusCode < 400) {
											K = true;
											N = X.__batchResponses[0].__changeResponses[i].statusText;
										}
									}
								}
								break;
							default:
								if (X.__batchResponses[1]) {
									for (var i = 0; i < X.__batchResponses[1].__changeResponses.length; i++) {
										if (X.__batchResponses[1].__changeResponses[i].statusCode < 400) {
											K = true;
											N = X.__batchResponses[0].__changeResponses[i].statusText;
										}
									}
								}
								break;
						}
					}
				}, t), jQuery.proxy(function(X) {
					t.handleErrors(X);
				}, t));
			}
			if (K)
				sap.m.MessageToast.show(N);
			if (!D.fullScreen && !D.fullScreenFromTask && !D.fullfollowupOppt && !D.newOpportunityFromAccount && !D.fullScreenFromLead)
				t._enableMasterFooter(Q.data.Guid);
			t.ContextPath = "Opportunities(guid'" + Q.data.Guid + "')";
			if (D.followupOppt || D.fullScreen || D.fullScreenFromTask || D.fullScreenFromLead) {
				sap.ui.getCore().getEventBus().publish("cus.crm.opportunity", "followUpOpportunityCreated", {
					contextPath: t.ContextPath
				});
				var U = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("followupsuccessful");
				sap.m.MessageToast.show(U, {
					closeOnBrowserNavigation: false
				});
			} else {
				sap.ui.getCore().getEventBus().publish("cus.crm.opportunity", "opportunityCreated");
				sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SAVE_SUCCESS"), {
					closeOnBrowserNavigation: false
				});
			}
			t._clear_data();
			if (t.bBpDeterminationEnabled && t.bOrgDeterminationEnabled) {
				t.resetMultiDetermFlags();
			}
			var V = false;
			if (t.extHookNavigateAfterCreate) {
				V = t.extHookNavigateAfterCreate(O, Q);
			}
			if (V) {
				sap.ca.ui.utils.busydialog.releaseBusyDialog();
				return;
			}
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
			var W = t.ContextPath;
			if (!sap.ui.Device.system.phone && !D.fullScreen && !D.fullScreenFromTask && !D.fullScreenFromLead && !D.fullfollowupOppt && !D.newOpportunityFromAccount)
				t.oRouter.navTo("detail", {
					contextPath: W
				}, true);
			else if (!sap.ui.Device.system.phone && D.fullScreen) {
				t.oRouter.navTo("display", {
					contextPath: W
				}, true);
			} else if (!sap.ui.Device.system.phone && D.fullfollowupOppt) {
				t.oRouter.navTo("display", {
					contextPath: W
				}, true);
			} else if (!sap.ui.Device.system.phone && (D.fullScreenFromTask || D.fullScreenFromLead)) {
				t.oRouter.navTo("display", {
					contextPath: W
				}, true);
			} else if (!sap.ui.Device.system.phone && D.newOpportunityFromAccount) {
				t.oRouter.navTo("display", {
					contextPath: W
				}, true);
			} else if (sap.ui.Device.system.phone && (D.fullScreen || D.fullScreenFromTask || D.fullScreenFromLead || D.fullfollowupOppt || D.newOpportunityFromAccount)) {
				t.oRouter.navTo("display", {
					contextPath: W
				}, true);
			} else
				t._navBack();

		}, function(O) {
			t.displayResponseErrorMessage(O, sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SAVE_FAILED"));
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
			t.setBtnEnabled("sv", true);
		});

	},
	DuplicateContinue: function(evt) {
		var t = this;
		t.DuplicateFragment.close();
		var Fsave = "X";
		var CUSTOMERID = t.BPPartner;
		t.DuplicateFragment.close();
		t.DuplucateMethod(t.H, t.I, t.j, t.J, t.M, t.p, t.E, t.F, t.G, t.m, t.K, t.N, t.D, Fsave, CUSTOMERID);
	},
	DuplicateCancel: function(evt) {
		var t = this;
		t.DuplicateFragment.close();
		var Fsave = "X";
		var CUSTOMERID = undefined;
		//	t.DuplicateFragment.close();
		t.DuplucateMethod(t.H, t.I, t.j, t.J, t.M, t.p, t.E, t.F, t.G, t.m, t.K, t.N, t.D, Fsave, CUSTOMERID);

	},
	onPostalChange: function() {
		var _oItem = this.getView().byId("cusPinCode");

		var _sPostalCode = this.getView().byId("cusPinCode").getValue();
		if (_sPostalCode !== "")
			_oItem.setValueState("None");
		else
			_oItem.setValueState("Error");

		if (_sPostalCode !== "") {
			var sFilter1 = new sap.ui.model.Filter("PostCode1", "EQ", _sPostalCode);
			this.oModel.read("/Zpost_codeSet", {
				filters: [sFilter1],
				success: jQuery.proxy(this._onPostalReadSuccess, this),
				error: jQuery.proxy(this._onPostalReadError, this)
			});
		} else {
			// this.oModel.setProperty(this._sSelectedAddItemPath + "/City", "");
			// this.oModel.setProperty(this._sSelectedAddItemPath + "/District", "");
			// this.oModel.setProperty(this._sSelectedAddItemPath + "/Region", "");
		}

	},
	_onPostalReadSuccess: function(d, oResponse) {
		var json = new sap.ui.model.json.JSONModel(d.results);
		//this.byId("cusDistrict").setModel(json);
		this.byId("cusCity").setModel(json);
		var oItemTemplate = new sap.ui.core.ListItem({
			key: "{City1}",
			text: "{City1}"
		});
		this.byId("cusCity").bindAggregation("items", {
			path: "/",
			templateShareable: true,
			//filters: [_oFilter, _oFilter1],
			template: oItemTemplate
		});
		if (d.results.length === 0) {

			sap.m.MessageToast.show("Enter a valid pin code");
			this.getView().byId("cusDistrict").setValue("");
			this.getView().byId("cusCity").setValue("");
			this.getView().byId("cusState").setValue("");

			this.byId("cusCity").setEnabled(false);
			return;

		} else if (d.results.length === 1) {
			this.getView().byId("cusDistrict").setValue(d.results[0].City2);
			this.getView().byId("cusCity").setSelectedKey(d.results[0].City1);
			this.getView().byId("cusCity").setValueState("None");
			this.getView().byId("cusState").setValue(d.results[0].Region);

			this.byId("cusCity").setEnabled(false);

		} else {
			//F4Code
			this.getView().byId("cusDistrict").setValue(d.results[0].City2);
			this.getView().byId("cusCity").setSelectedKey("");
			this.getView().byId("cusState").setValue(d.results[0].Region);
			//	this.byId("cusDistrict").setEnabled(false);
			this.byId("cusCity").setEnabled(true);
		}
	},
	_onPostalReadError: function(oResponse) {

	},

	showAccountF4: function(e) {
		this.accountF4Fragment = null;
		this.accountF4Fragment = new sap.ui.xmlfragment(this.createId("accountF4"),
			"cus.crm.opportunity.CRM_OPPRTNTYExtension.view.AccountSelectDialogCustom", this);
		this.accountF4Fragment.setModel(this.oI18nModel, "i18n");
		var j = new sap.ui.model.json.JSONModel();
		this.accountF4Fragment.setModel(j);

		this.accountF4Fragment.open();

		var thataccF4 = this;
		this.accountF4Fragment.attachBrowserEvent("keydown", function(oEvent) {
			if (oEvent.keyCode === 27) {
				thataccF4.accountF4Fragment.close();
				thataccF4.accountF4Fragment.destroy();
			}

		});
	},

	onBPSearch: function() {

		var FirstName = this.accountF4Fragment.getContent()[0].mAggregations.content[0].getValue();
		var Lastname = this.accountF4Fragment.getContent()[0].mAggregations.content[1].getValue();
		var mobNum = this.accountF4Fragment.getContent()[0].mAggregations.content[2].getValue();
		var contractNumber = this.accountF4Fragment.getContent()[0].mAggregations.content[3].getValue();
		var rcNumber = this.accountF4Fragment.getContent()[0].mAggregations.content[4].getValue();
		var chassisNumber = this.accountF4Fragment.getContent()[0].mAggregations.content[5].getValue();
		var engineNumber = this.accountF4Fragment.getContent()[0].mAggregations.content[6].getValue();
		var partnerNumber = this.accountF4Fragment.getContent()[0].mAggregations.content[7].getValue();

		var l = this.accountF4Fragment.getContent()[1];

		var spath = "/ZBPF4SearchSet";

		var oFilter1 = new sap.ui.model.Filter("RCNumber", sap.ui.model.FilterOperator.EQ, rcNumber);
		var oFilter2 = new sap.ui.model.Filter("ChassisNumber", sap.ui.model.FilterOperator.EQ, chassisNumber);
		var oFilter3 = new sap.ui.model.Filter("NameFirst", sap.ui.model.FilterOperator.EQ, FirstName);
		var oFilter4 = new sap.ui.model.Filter("NameLast", sap.ui.model.FilterOperator.EQ, Lastname);

		var oFilter5 = new sap.ui.model.Filter("EngineNumber", sap.ui.model.FilterOperator.EQ, engineNumber);
		var oFilter6 = new sap.ui.model.Filter("Contract", sap.ui.model.FilterOperator.EQ, contractNumber);
		var oFilter7 = new sap.ui.model.Filter("Mobile", sap.ui.model.FilterOperator.EQ, mobNum);
		var oFilter8 = new sap.ui.model.Filter("Partner", sap.ui.model.FilterOperator.EQ, partnerNumber);

		var oFilters = [oFilter1, oFilter2, oFilter3, oFilter4, oFilter5, oFilter6, oFilter7, oFilter8];
		l.setModel(this.oModel);

		l.bindAggregation("items", spath,
			function(sId, oContext) {

				var oController = this;
				return new sap.m.ObjectListItem({

					title: oContext.getProperty("FullName") + " (" + oContext.getProperty("Partner") + ")",
					attributes: [new sap.m.ObjectAttribute({

						text: "{Mobile}"

					}), new sap.m.ObjectAttribute({

						text: "{Address} {City} {Country}"

					})],
					type: sap.m.ListType.Active

				});

			}, null, oFilters);

	},

	_refreshAccountList: function(s) {
		var f = [];
		if (s !== "") {
			f.push(new sap.ui.model.Filter(this.accountFilterName, sap.ui.model.FilterOperator.Contains, s));
		}
		if (!this.accountF4Fragment) {
			this.accountF4Fragment = new sap.ui.xmlfragment(this.createId("accountF4"),
				"cus.crm.opportunity.CRM_OPPRTNTYExtension.view.AccountSelectDialogCustom", this);
			var j = new sap.ui.model.json.JSONModel();
			this.accountF4Fragment.setModel(j);
			this.accountF4Fragment.setModel(this.oI18nModel, "i18n");
		}
		var l = this.accountF4Fragment.getContent()[1];
		l.setModel(this.oModel);
		l.bindAggregation("items", {
			path: "/AccountCollection",
			parameters: {
				expand: "MainAddress",
				select: "accountID,MainAddress/city,MainAddress/country,name1,fullName"
			},
			filters: f,
			template: this.accountF4Template
		});
		l.getBinding("items").attachDataReceived(jQuery.proxy(this._setAccountJsonModel), this);
	},
	_setAccountJsonModel: function(e) {
		var r = e.getParameter("data").results;
		if (r.length === 0) {
			this.accountF4Fragment.getContent()[1].setNoDataText(this.oResourceBundle.getText("NO_DATA_TEXT"));
		}
	},

	closeAccountF4: function(e) {
		this.accountF4Fragment.close();
		this.accountF4Fragment.destroy();
	},
	closeAccountToolbar: function(e) {
		var l = this.accountF4Fragment.getContent()[1];
		this.accountF4Fragment.getModel().setData({
			AccountCollection: []
		});
		l.setNoDataText(this.oResourceBundle.getText("LOADING_TEXT"));
		var s = "";
		this._refreshAccountList(s);
	},

	setAccount: function(e) {
		this.oSelectedAccount = e.getSource().getSelectedItem().getBindingContext().getObject();
		var a = this.oSelectedAccount.FullName;
		var b = this.oSelectedAccount.Partner;
		if (a && a !== "") {
			this.byId("customer").setValue(a);
			this.accountName = a;
		} else {
			this.byId("customer").setValue(b);
			this.accountName = b;
		}
		this.accountId = b;
		this._setAccountDetails(this.accountId);
		this.byId("customer").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusFirstName").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusLastName").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusAdd1").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusAdd2").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusAdd3").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusPinCode").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusMobile").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusPhone").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusStd").setValueState(sap.ui.core.ValueState.None);
		this.setEnabledUserField(false);
		this.byId("customer").setEnabled(true);
		this.accountF4Fragment.getContent()[1].removeSelections();
		this._triggerDetermination();
		this.accountF4Fragment.close();
		this.accountF4Fragment.destroy();
		this.enableSaveBtn();
		this._bindExistingAgreementNo(this.accountId);
	},
	_bindExistingAgreementNo: function(sBPNo) {
		if (this.byId("leadType").getSelectedKey() === "T" && this.byId("CustSw_id").getState()) {
			this.byId("addBusiAgreementNo_btnId").setEnabled(false);
			var oBusiAgreementTbl = this.byId("busiAggrements_tblId");
			var oFilter = [];
			oFilter.push(new sap.ui.model.Filter("Partner", sap.ui.model.FilterOperator.EQ, sBPNo));
			var oTemplate = new sap.m.ColumnListItem({
				cells: [new sap.m.Input({
					editable: false,
					type: "Text",
					value: "{Buag} - {Description}"
				}).addCustomData(new sap.ui.core.CustomData({
					key: "bAgreementKey",
					value: "{Buag}"
				}))]
			});
			this.oModel.read("/ZBUAGF4Set", {
				filters:oFilter,
				success: function(oData, oResponse) {
					oBusiAgreementTbl.setModel(new sap.ui.model.json.JSONModel(oData));
					oBusiAgreementTbl.bindAggregation("items", {
						path: "/results",
						template: oTemplate
					});
				},
				error: function(oError) {
					jQuery.sap.log.error(oError);
				}
			});
		}
	},
	_setAccountDetails: function(accId) {
		this.oModel.read("/ZAccountCollection(accountID='" + accId + "',Buag='')", null, null, true, jQuery.proxy(function(d, r) {
			if (d) {

				if (d.BpType === "2" || d.BpType === "3") {
					this.byId("customerName").setVisible(false);
					this.byId("cusFirstName").setVisible(false);
					this.byId("cusMiddleName").setVisible(false);
					this.byId("cusLastName").setVisible(false);
					this.byId("Name1").setVisible(true);
					this.byId("Name2").setVisible(true);
					this.byId("FirstName").setVisible(true);
					this.byId("LastName").setVisible(true);
					//	this.getView().byId("Name2").setRequired(true);
					if (d.BpType === "3") {
						this.byId("cusPhone").setVisible(false);
						this.byId("mob").setVisible(false);
						this.byId("cusStd").setVisible(false);
						this.byId("cusMobile").setVisible(false);
						//	this.getView().byId("Name2").setRequired(true);
					} else {
						this.byId("cusPhone").setVisible(true);
						this.byId("mob").setVisible(true);
						this.byId("cusStd").setVisible(true);
						this.byId("cusMobile").setVisible(true);

					}

				} else if (d.BpType === "" || d.BpType === "1") {
					this.byId("Name1").setVisible(false);
					this.byId("Name2").setVisible(false);
					this.byId("FirstName").setVisible(false);
					this.byId("LastName").setVisible(false);
					this.byId("customerName").setVisible(true);
					this.byId("cusFirstName").setVisible(true);
					this.byId("cusMiddleName").setVisible(true);
					this.byId("cusLastName").setVisible(true);
					this.byId("cusPhone").setVisible(true);
					this.byId("mob").setVisible(true);
					this.byId("cusStd").setVisible(true);
					this.byId("cusMobile").setVisible(true);
				}
				this.byId("cusFirstName").setValue(d.NameFirst);
				this.byId("cusLastName").setValue(d.NameLast);
				this.byId("FirstName").setValue(d.NameFirst);
				this.byId("LastName").setValue(d.NameLast);
				this.byId("cusMiddleName").setValue(d.NameMiddle);
				this.byId("cusAdd1").setValue(d.Address1);
				this.byId("cusAdd2").setValue(d.Address2);
				this.byId("cusAdd3").setValue(d.Address3);
				this.byId("cusMobile").setValue(d.Mobile);
				this.byId("cusPhone").setValue(d.Phone);
				this.byId("cusStd").setValue(d.TelExtens);
				this.byId("cusCity").setValue(d.City1);
				this.byId("cusDistrict").setValue(d.District);
				this.byId("cusState").setValue(d.Region);
				this.byId("cusPinCode").setValue(d.PostCode1);
				this.onPostalChange();
				this.BPTYPECheck = d.BpType;
				if (d.BpType == "3") {
					this.byId("cusPhone").setVisible(false);
					this.byId("cusStd").setVisible(false);
					this.byId("cusMobile").setVisible(false);
				} else {
					this.byId("cusPhone").setVisible(true);
					this.byId("cusMobile").setVisible(true);
					this.byId("cusStd").setVisible(true);
				}
			} else {
				this.accountId = "";
				this.byId("cusFirstName").setValue("");
				this.byId("cusLastName").setValue("");
				this.byId("cusAdd1").setValue("");
				this.byId("cusAdd2").setValue("");
				this.byId("cusAdd3").setValue("");
				this.byId("cusMobile").setValue("");
				this.byId("cusPhone").setValue("");
				this.byId("cusStd").setValue("");
				this.byId("cusCity").setValue("");
				this.byId("cusDistrict").setValue("");
				this.byId("cusState").setValue("");
				this.byId("cusPinCode").setValue("");
			}
		}, this), jQuery.proxy(function(e) {
			jQuery.sap.log.error("Read failed in S4->_setAccountDetails:" + e.response.body);
		}, this));

	},

	onAccountSuggestItemSelected: function(e) {
		var i = e.getParameter("selectedItem");
		var a = null;
		a = i.data("oAccount");
		this.accountName = a.fullName === "" ? a.accountID : a.fullName;
		this.accountId = a.accountID;
		this.byId("customer").setValue(this.accountName);
		this._setAccountDetails(this.accountId);
		this.setEnabledUserField(false);
		this.byId("customer").setEnabled(true);
		this._triggerDetermination();
		this.enableSaveBtn();
	},
	onAccountInputFieldChanged: function(e) {
		this.byId("customer").setValueState(sap.ui.core.ValueState.None);
		var a = e.getSource();
		var val = e.mParameters.value;
		var regexp = /^[a-zA-Z0-9 ]+$/;
		var res = regexp.test(val);
		if (res) {
			e.getSource().setValue(val);
		} else {
			val = val.slice(0, val.length - 1);
			//val = e.getSource()._lastValue;
			e.getSource().setValue(val);
		}
		this._setAccount(a.getValue());
		a.setShowSuggestion(true);
		a.setFilterSuggests(false);
		var c = function(A) {
			a.removeAllSuggestionItems();
			if (a.getValue().length > 0) {
				var i = 0;
				for (i in A) {
					var o = A[i];
					if (o.fullName.toUpperCase() == a.getValue().toUpperCase()) {
						this._setAccount(o.fullName);
					}
					var C = new sap.ui.core.CustomData({
						key: "oAccount",
						value: o
					});
					var I = new sap.ui.core.Item({
						text: o.fullName,
						customData: C
					});
					a.addSuggestionItem(I);
				}
			}
		};
		this._readAccount(a.getValue(), c);
	},
	_readAccount: function(s, c) {
		var t = this,
			m = this.getView().getModel();
		this.oModel.read(
			"/AccountCollection?$expand=MainAddress&$select=accountID,name1,name2,fullName,MainAddress/address,MainAddress/street,MainAddress/mobilePhone,MainAddress/phone,MainAddress/city,MainAddress/country",
			null, "$top=10&$filter=substringof(%27" + encodeURIComponent(s) + "%27,fullName)", true,
			function(d, r) {
				var a = jQuery.parseJSON(JSON.stringify(d));
				if (c)
					c.call(t, a.results);
			},
			function(e) {
				jQuery.sap.log.error("Read failed in S4->_readAccount:" + e.response.body);
			});
	},

	_checkDataLoss: function() {
		var t = {
			Description: this.byId("desc").getValue(),
			ExpectedSalesVolume: "0.00", //this.byId("volume").getValue(),
			CurrencyCode: this.byId("currency").getValue(),
			ChanceOfSuccess: this.byId("chanceofSuccess").getValue(),
			StartDate: this.byId("datePickerStartDate").getValue(),
			ClosingDate: this.byId("datePickerCloseDate").getValue(),
			AccountName: this.byId("customer").getValue(),
			MainContactName: this.byId("inputMainContact").getValue(),
			EmployeeRespName: this.byId("inputEmpResponsible_S5").getValue(),
			SalesStageCode: this.byId("stagedropdown").getSelectedKey(),
			UserStatusCode: this.byId("statusdropdown").getSelectedKey(),
			PriorityCode: this.byId("priority_val").getSelectedKey(),
			ForecastRelevance: this.byId("Switch").getState(),
			SalesOrg: this.byId("salesOrganization").getValue(),

			NAMEFIRST: this.byId("cusFirstName").getValue(),
			NAMELAST: this.byId("cusLastName").getValue(),
			ADDRESS1: this.byId("cusAdd1").getValue(),
			ADDRESS2: this.byId("cusAdd2").getValue(),
			ADDRESS3: this.byId("cusAdd3").getValue(),
			PHONE: this.byId("cusPhone").getValue(),
			TelExtens: this.byId("cusStd").getValue(),
			MOBILE: this.byId("cusMobile").getValue(),
			POST_CODE1: this.byId("cusPinCode").getValue(),
			CUSTSEGMENT: this.byId("cusSeg").getSelectedKey(),
			FLEETSIZE: this.byId("cusFleetSize").getSelectedKey(),
			FLEETAPPL: this.byId("cusFleetApp").getSelectedKey(),
			DEALERNAME: this.byId("cusDealerSelect").getSelectedKey(),
			DEALERLOC: this.byId("cusDealerLocation").getValue(),
			Zleadtype: this.byId("leadType").getSelectedKey()
		};
		var a = this.byId("productBasket").getModel("json").getData();
		var b = this.byId("partnerBasket").getModel("json").getData();
		this.jsontempEntry = JSON.stringify(t);
		this.jsontempProducts = JSON.stringify(a);
		this.jsontempPartners = JSON.stringify(b);
		if (this.jsonoldEntry !== this.jsontempEntry || this.jsonoldProducts !== this.jsontempProducts || this.jsonoldPartners !== this.jsontempPartners) {
			return true;
		}
	},

	extHookCustomInit: function(e) {
		// Place your hook implementation code here 
		this._custData = [];
		this._custData.ZProduct = [];
		this._custData.ZProduct.results = {};

		this._custJsonModel = new sap.ui.model.json.JSONModel(this._custData);
		this._custJsonModel.setSizeLimit(200);
		this.getView().setModel(this._custJsonModel, "custJson");
		var oData = [];
		oData.results = {};
		var json = new sap.ui.model.json.JSONModel(oData);
		this.byId("cusCity").setModel(json);
		this.byId("idProdTable").removeAllItems();
		this.byId("ProductButton11").setEnabled(false);
		this.byId("idProdTable").setVisible(true);
		this.byId("busiAggrements_tblId").setVisible(false);
		this.byId("addBusiAgreementNo_btnId").setEnabled(false);
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
			pattern: "dd.MM.yyyy",
			UTC: false
		});
		this.getView().byId("cusDatePickerVisit").setValue(dateFormat.format(new Date(), false));
		this.bindFleetSize();
		var t = this;
		this.byId("cusPinCode").onsapenter = function() {
			t.onPostalChange();
		};

		t.getView().byId("leadType").setValue("");
		this.oModel.read("/ZFLEET_APP_MASTSSet", null, [], true, jQuery.proxy(function(
			aData, b) {
			t._custData.ZFLEET_APP_MASTS = aData;
			t._custJsonModel.setData(t._custData);
			t._custJsonModel.updateBindings();
		}, this), jQuery.proxy(function(e) {
			this.handleErrors(e);
		}, this));

		this.oModel.read("/ZcustsegSet", null, [], true, jQuery.proxy(function(
			aData, b) {
			t._custData.Zcustseg = aData;
			t._custJsonModel.setData(t._custData);

			t._custJsonModel.updateBindings();
		}, this), jQuery.proxy(function(e) {
			this.handleErrors(e);
		}, this));

		this.oModel.read("/ZsalesofficeF4Set", null, [], true, jQuery.proxy(function(
			aData, b) {
			t._custData.ZsalesofficeF4Set = aData;
			t._custJsonModel.setData(t._custData);

			t._custJsonModel.updateBindings();
		}, this), jQuery.proxy(function(e) {
			this.handleErrors(e);
		}, this));

		this.oModel.read("/ZsorgF4Set", null, [], true, jQuery.proxy(function(
			aData, b) {
			t._custData.ZsorgF4Set = aData;
			t._custJsonModel.setData(t._custData);

			t._custJsonModel.updateBindings();
		}, this), jQuery.proxy(function(e) {
			this.handleErrors(e);
		}, this));

		this.oModel.read("/Zcrmc_distchanF4Set", null, [], true, jQuery.proxy(function(
			aData, b) {
			t._custData.Zcrmc_distchanF4Set = aData;
			t._custJsonModel.setData(t._custData);

			t._custJsonModel.updateBindings();
		}, this), jQuery.proxy(function(e) {
			this.handleErrors(e);
		}, this));

		this.oModel.read("/ZloanTypeF4Set", null, [], true, jQuery.proxy(function(
			aData, b) {
			//	aData.results.push({Attribute: "T", Attributetxt: "TopUp"})	;
			t._custData.ZloanTypeF4Set = aData;
			t._custJsonModel.setData(t._custData);

			t._custJsonModel.updateBindings();
		}, this), jQuery.proxy(function(e) {
			this.handleErrors(e);
		}, this));

		this.getView().byId("cusPhone").attachBrowserEvent("keypress", function(e) {
			var key_codes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 0, 8];
			if (!($.inArray(e.which, key_codes) >= 0)) {
				e.preventDefault();
			}
		});

		this.getView().byId("cusStd").attachBrowserEvent("keypress", function(e) {
			var key_codes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 0, 8];
			if (!($.inArray(e.which, key_codes) >= 0)) {
				e.preventDefault();
			}
		});

		this.getView().byId("cusMobile").attachBrowserEvent("keypress", function(e) {
			var key_codes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 0, 8];
			if (!($.inArray(e.which, key_codes) >= 0)) {
				e.preventDefault();
			}
		});
		this.getView().byId("cusPinCode").attachBrowserEvent("keypress", function(e) {
			var key_codes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 0, 8];
			if (!($.inArray(e.which, key_codes) >= 0)) {
				e.preventDefault();
			}
		});

		var fromDate = new Date();
		fromDate.setDate(fromDate.getDate() - 1);
		this.getView().byId("cusDatePickerNextFollowup").setMinDate(fromDate);
		this.getView().byId("cusDatePickerTentative").setMinDate(fromDate);
		this.getView().byId("cusDatePickerVisit").setMaxDate(new Date());
		this.ResetFunc();

	},
	extHookEnableSaveBtn: function(e) {
		this.setBtnEnabled("sv", true);
	},

	extHookOnSave: function() {
		// Place your hook implementation code here 
		if (this.validateCustomSavePage() === false) {
			sap.ca.ui.message.showMessageToast(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("MANDAT_FIELD"));
			return false;
		}
		var arr = ["7", "8", "9"];
		var FDigit = this.byId("cusMobile").getValue()[0];
		if ((this.byId("cusMobile").getValue().length < 10 && this.byId("cusMobile").getVisible() === true) || (arr.indexOf(FDigit) === -1 &&
				this.byId("cusMobile").getVisible() === true)) {
			this.byId("cusMobile").setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageToast.show("Enter Valid Mobile Number");
			return false;
		}
		var prodTab = this.byId("idProdTable");
		var Items = prodTab.getItems();
		if (Items.length === 0) {
			sap.m.MessageToast.show("Select atleast one Product and Variant");
			return false;
		} else {

			for (var i = 0; i < Items.length; i++) {
				if (Items[i].getCells()[0].getSelectedKey() === "") {
					Items[i].getCells()[0].setValueState("Error");
					return false;
				}
				if (Items[i].getCells()[1].getSelectedKey() === "") {
					Items[i].getCells()[1].setValueState("Error");
					return false;
				}
				if (Items[i].getCells()[2].getValue() === "") {
					Items[i].getCells()[2].setValueState("Error");
					return false;
				}
			}

		}
		return true;
	},
	extHookSaveOentry: function(E) {
		// Place your hook implementation code here 

	},
	validateProductRow: function() {
		var hasValid = false;
		var items = this.byId("idProdTable").getItems();
		for (var i = 0; i < items.length; i++) {

			var prod = items[i].mAggregations.cells[0].getSelectedKey();
			var varient = items[i].mAggregations.cells[1].getSelectedKey();
			var qty = items[i].mAggregations.cells[2].getValue();
			if (prod !== "") {
				items[i].mAggregations.cells[0].setValueState(sap.ui.core.ValueState.None);
			} else {
				hasValid = true;
				items[i].mAggregations.cells[0].setValueState(sap.ui.core.ValueState.Error);
			}
			if (varient !== "") {

				items[i].mAggregations.cells[1].setValueState(sap.ui.core.ValueState.None);
			} else {
				hasValid = true;
				items[i].mAggregations.cells[1].setValueState(sap.ui.core.ValueState.Error);
			}
			if (qty !== "") {
				items[i].mAggregations.cells[2].setValueState("None");
			} else {
				hasValid = true;
				items[i].mAggregations.cells[2].setValueState("Error");
			}

		}
		return hasValid;
	},
	bindFleetSize: function() {
		var _aData = [];
		_aData.results = [];
		for (var i = 0; i < 101; i++) {
			var record = {};
			if (i == 100) {
				record = {
					fSize: "Above 100"
				};
			} else {
				record = {
					fSize: i
				};
			}
			_aData.results.push(record);
		}
		var jModel = this.getView().getModel("custJson");
		jModel.oData.fleetSize = _aData;
		jModel.updateBindings();
	},
	/********************Product table functions********************/
	prdLivechange: function(evt) {
		var val = evt.getSource();
	},
	onComboCityChanged: function(evt) {
		evt.getSource().setValueState("None");
	},

	onProductChange: function(oEvent) {
		oEvent.getSource().setValueState("None");
		var _sProductKey = oEvent.getSource().getSelectedKey();
		this.PK = _sProductKey;
		oEvent.getSource().setSelectedKey(_sProductKey);
		var _selectedItem = oEvent.getSource().getParent();
		var _ind = this.byId("idProdTable").getItems().length;
		this._bindVariants(_sProductKey, _ind);
	},
	_bindVariants: function(sKey, _index) {
		var DC = this.byId("cusDealerCVPV").getSelectedKey();
		var SC = this.byId("cusDistchan").getSelectedKey();
		var _sPath = "/CategoryHelpSet('" + sKey + "')/ProductHelpSet?$filter=DistChan eq '" + SC + "' and SalesOffice eq '" + DC + "'";
		//	this.oModel.read("/ZBU_DESCRIPSet", null, ["$filter=Branch eq '" + b + "' and Zchannel eq '" + d + "'"], true,
		this._readVariants(_sPath, _index);
	},
	_readVariants: function(sPath, iIndex) {
		var t = this;
		this.oModel.read(sPath, null, null, true, jQuery.proxy(function(o, b) {
			//	var Varinput=t.byId("idProdTable").getItems()[t.Index].getCells()[1];
			var Varinput = t.temp1.getCells()[1];
			t.varinpt = Varinput;
			var json = new sap.ui.model.json.JSONModel(o.results);
			Varinput.setModel(json);
			var oItemTemplate = new sap.ui.core.ListItem({
				key: "{ProductId}",
				text: "{ShtextLarge}"
			});
			Varinput.bindAggregation("items", {
				path: "/",
				templateShareable: true,
				//filters: [_oFilter, _oFilter1],
				template: oItemTemplate
			});

			var _jModdel = t.getView().getModel("custJson");
			var _productData = _jModdel.oData.ZProduct.results;
			_productData[iIndex - 1].CategoryId = t.PK;
			_productData[iIndex - 1].relatedProducts = o.results;
			_jModdel.updateBindings();

		}, this), jQuery.proxy(function(E) {
			this.handleErrors(E);
		}, this));
	},
	_setProductCategoryData: function(jsonModel, bAddFirstProduct, aNewRecord) {
		this.oModel.read("/CategoryHelpSet", null, null, true, jQuery.proxy(function(o, r) {
			if (bAddFirstProduct) {

				aNewRecord.categoryData = r.data.results;
				jsonModel.oData.ZProduct.results = [];
				jsonModel.oData.ZProduct.results.push(aNewRecord);

			} else {
				var len = jsonModel.oData.ZProduct.results.length;
				for (var i = 0; i < len; i++) {
					jsonModel.oData.ZProduct.results[i].categoryData = r.data.results;
				}
			}

		}, this), jQuery.proxy(function(E) {
			this.handleErrors(E);
		}, this));
	},
	addProductTableRow: function(evt) {
		var _oProdTable = this.byId("idProdTable");
		this.ProdTab = _oProdTable;

		var jModel = this.getView().getModel("custJson");
		var _tableData = jModel.oData.ZProduct.results;
		var _catData = [];
		var newRowRecord = {
			"ObjectId": "",
			"Guid": "",
			"OobjectId": "",
			"CategoryId": "",
			"ProductId": "",
			"Quantity": "",
			"categoryData": _catData
		};
		if (_tableData !== undefined && _tableData !== null && _tableData.length > 0) {
			_catData = _tableData[0].categoryData;
			newRowRecord.categoryData = _catData;
			_tableData.push(newRowRecord);
			jModel.updateBindings();
		} else {
			this._setProductCategoryData(jModel, true, newRowRecord);
		}
		this.idProdTableColumnListItem = this.byId("idProdTableColumnListItem");
		var temp = this.idProdTableColumnListItem.clone();
		this.temp1 = temp;
		this.ProdTab.addItem(temp);
		var that = this;
		this.oModel.read("/CategoryHelpSet", null, null, false, jQuery.proxy(function(o, r) {

			var json = new sap.ui.model.json.JSONModel(o.results);
			var Prod = that.temp1.getCells()[0];
			Prod.setModel(json);
			var oItemTemplate = new sap.ui.core.ListItem({
				key: "{CategoryId}",
				text: "{CategoryText}"
			});
			Prod.bindAggregation("items", {
				path: "/",
				templateShareable: true,
				//filters: [_oFilter, _oFilter1],
				template: oItemTemplate
			});

		}, this), jQuery.proxy(function(E) {
			this.handleErrors(E);
		}, this));

	},
	deleteProductTableRow: function(oEvent) {
		var that = this;
		var d = that.getView().getModel("custJson").getData();
		var lineItem = oEvent.getSource().getParent();
		var Pkey = lineItem.getCells()[0].getSelectedKey();
		var Vkey = lineItem.getCells()[1].getSelectedKey();
		var Qty = lineItem.getCells()[2].getValue();
		var res = this.getView().getModel("custJson").oData.ZProduct.results;
		for (var i = 0; i < res.length; i++) {
			var resKey = res[i].CategoryId;
			//	var resKey=res[i].CategoryId;
			if (Pkey === resKey) {
				d.ZProduct.results.splice(i, 1);
				break;
			}
		}
		that.ProdTab.removeItem(lineItem);
		this.getView().getModel("custJson").updateBindings();
	},
	_onExistingCustSwich: function(oEvent) {

		if (oEvent.getParameter("state")) {
			this.setEnabledUserField(true);
			this.byId("cusLblCustomer").setVisible(true);
			this.byId("customer").setVisible(true);
			this.byId("applicantType").setVisible(false);
			this.byId("FirstName").setVisible(false);

			this.byId("LastName").setVisible(false);
			this.byId("cusFirstName").setVisible(true);
			this.byId("cusMiddleName").setVisible(true);
			this.byId("cusLastName").setVisible(true);
			this.byId("customerName").setVisible(true);
			this.byId("cusPhone").setVisible(true);
			this.byId("cusStd").setVisible(true);
			this.byId("cusMobile").setVisible(true);
			//this.byId("tmlCustomer").setVisible(false);
			this.byId("tmlCustomer").setVisible(true);

			//////////////////////////////////
			this.byId("customer").setValue("");
			this.byId("cusFirstName").setValue("");
			this.byId("cusMiddleName").setValue("");
			this.byId("cusLastName").setValue("");
			this.byId("cusAdd1").setValue("");
			this.byId("cusAdd2").setValue("");
			this.byId("cusMobile").setValue("");
			this.byId("cusPinCode").setValue("");
			this.byId("cusDistrict").setValue("");
			this.byId("cusCity").setSelectedKey("");
			this.byId("cusState").setValue("");

			this.byId("cusPhone").setValue("");
			this.byId("cusStd").setValue("");

			this.byId("cusAdd3").setValue("");
			this.byId("cusState").setValue("");
			this.byId("cusFleetSize").setSelectedKey("");
			this.byId("cusSeg").setSelectedKey("");
			this.byId("cusFleetApp").setSelectedKey("");
			this.byId("cusFleetSize").setSelectedKey("");
			this.byId("cusDealerCVPV").setSelectedKey("");
			this.byId("cusDistchan").setSelectedKey("");
			//this.byId("statusdropdown").setSelectedKey("");
			this.byId("cusRemark").setValue("");
			this.byId("cusDistchan").setSelectedKey("");
			this.byId("leadType").setSelectedKey("");
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd.MM.yyyy",
				UTC: false
			});
			this.byId("cusDatePickerVisit").setValue(dateFormat.format(new Date(), false));
			this.byId("cusDealerSelect").setValue("");
			this.byId("cusDealerLocation").setValue("");
			/////////// set value state error ///////////

		} else {
			this.setEnabledUserField(true);
			this.byId("cusLblCustomer").setVisible(false);
			this.byId("customer").setVisible(false);
			this.byId("tmlCustomer").setVisible(true);

			this.byId("customer").setValue("");
			this.byId("cusFirstName").setValue("");
			this.byId("cusMiddleName").setValue("");
			this.byId("cusLastName").setValue("");
			this.byId("cusAdd1").setValue("");
			this.byId("cusAdd2").setValue("");
			this.byId("cusMobile").setValue("");
			this.byId("cusPinCode").setValue("");
			this.byId("cusDistrict").setValue("");
			this.byId("cusCity").setSelectedKey("");
			this.byId("cusState").setValue("");
			this.byId("cusPhone").setValue("");
			this.byId("cusStd").setValue("");

			this.byId("cusAdd3").setValue("");
			this.byId("cusState").setValue("");
			this.byId("cusFleetSize").setSelectedKey("");
			this.byId("cusSeg").setSelectedKey("");
			this.byId("cusFleetApp").setSelectedKey("");
			this.byId("cusFleetSize").setSelectedKey("");

			this.byId("cusDealerSelect").setSelectedKey("");
			this.byId("cusDealerLocation").setValue("");
			this.byId("cusDealerCVPV").setSelectedKey("");
			this.byId("cusDistchan").setSelectedKey("");
			this.byId("cusDealerCVPV").setValue("");
			this.byId("cusDistchan").setValue("");
			//	this.byId("applicantType").setSelectedKey("1");
			this.byId("leadType").setValue("");
			this.byId("tmlCustomer").setSelectedKey("");

			this.byId("cusDatePickerNextFollowup").setValue("");
			this.byId("cusDatePickerTentative").setValue("");
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd.MM.yyyy",
				UTC: false
			});
			this.byId("cusDatePickerVisit").setValue(dateFormat.format(new Date(), false));

			//this.byId("statusdropdown").setValue("");
			//this.byId("statusdropdown").setSelectedKey("");
			this.byId("cusRemark").setValue("");

			this.byId("Name1").setVisible(false);

			this.byId("Name2").setVisible(false);
			this.byId("FirstName").setVisible(false);
			this.byId("LastName").setVisible(false);
			this.byId("customerName").setVisible(true);
			this.byId("cusFirstName").setVisible(true);
			this.byId("cusMiddleName").setVisible(true);
			this.byId("cusLastName").setVisible(true);
			this.byId("applicantType").setVisible(true);

			/////////// set value state error ///////////

			if (this.byId("applicantType").getVisible()) {
				this.byId("applicantType").setValueState(sap.ui.core.ValueState.None);
				this.byId("applicantType").setSelectedKey("");
			}

		}
		this.byId("ProductButton11").setEnabled(false);
		this.accountId = "";
		this.contactId = "";
		this.ProspectNumber = "";
		this.byId("leadType").setValueState(sap.ui.core.ValueState.None);

		if (this.byId("applicantType").getVisible()) {
			this.byId("applicantType").setSelectedKey("");
			this.byId("applicantType").setValueState(sap.ui.core.ValueState.None);

		}
		if (this.byId("customer").getVisible()) {
			this.byId("customer").setValue("");
			this.byId("customer").setValueState(sap.ui.core.ValueState.None);

		}
		if (this.byId("FirstName").getVisible()) {
			this.byId("FirstName").setValue("");
			this.byId("LastName").setValue("");
			this.byId("FirstName").setValueState(sap.ui.core.ValueState.None);
			this.byId("LastName").setValueState(sap.ui.core.ValueState.None);

		}
		if (this.byId("cusFirstName").getVisible()) {
			this.byId("cusFirstName").setValue("");
			this.byId("cusMiddleName").setValue("");
			this.byId("cusLastName").setValue("");
			this.byId("cusFirstName").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusMiddleName").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusLastName").setValueState(sap.ui.core.ValueState.None);

		}

		//	this.byId("statusdropdown").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusMobile").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusAdd1").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusAdd2").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusAdd3").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusPinCode").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusDealerCVPV").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusDistchan").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusCity").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusDealerSelect").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusPhone").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusStd").setValueState(sap.ui.core.ValueState.None);
		this.byId("tmlCustomer").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusFleetSize").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusFleetApp").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusSeg").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusDealerLocation").setValueState(sap.ui.core.ValueState.None);
		//	this.byId("statusdropdown").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusRemark").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusDatePickerNextFollowup").setValueState(sap.ui.core.ValueState.None);
		this.byId("cusDatePickerTentative").setValueState(sap.ui.core.ValueState.None);
		//this.byId("cusRemark").setValueState(sap.ui.core.ValueState.None);
		return true;
	},
	validateCustomSavePage: function() {
		var c = false;
		if (this.byId("cusFirstName").getValue() === "" && this.byId("cusFirstName").getVisible() === true) {
			this.byId("cusFirstName").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		//if (this.BPTYPECheck === "1") {
		if (this.byId("cusLastName").getValue() === "" && this.byId("cusLastName").getVisible() === true) {
			this.byId("cusLastName").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		//	}

		if (this.byId("customer").getValue() === "" && this.byId("customer").getVisible() === true) {
			this.byId("customer").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}

		if (this.byId("FirstName").getValue() === "" && this.byId("FirstName").getVisible() === true) {
			this.byId("FirstName").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		/*if (this.byId("LastName").getValue() === "" && this.byId("LastName").getVisible() === true) {
			this.byId("LastName").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}*/
		if (this.byId("cusAdd1").getValue() === "" && this.byId("cusAdd1").getVisible() === true) {
			this.byId("cusAdd1").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusAdd2").getValue() === "" && this.byId("cusAdd2").getVisible() === true) {
			this.byId("cusAdd2").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusAdd3").getValue() === "" && this.byId("cusAdd3").getVisible() === true) {
			this.byId("cusAdd3").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusPinCode").getValue() === "" && this.byId("cusPinCode").getVisible() === true) {
			this.byId("cusPinCode").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusCity").getSelectedKey() === "" && this.byId("cusCity").getVisible() === true) {
			this.byId("cusCity").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusMobile").getValue() === "" && this.byId("cusMobile").getVisible() === true) {
			c = true;
			this.byId("cusMobile").setValueState(sap.ui.core.ValueState.Error);

		}
		/*	if (this.byId("cusStd").getValue() === "" && this.byId("cusStd").getVisible() === true) {
				c = true;
				this.byId("cusStd").setValueState(sap.ui.core.ValueState.Error);

			}
			if (this.byId("cusPhone").getValue() === "" && this.byId("cusPhone").getVisible() === true) {
				c = true;
				this.byId("cusPhone").setValueState(sap.ui.core.ValueState.Error);

			}*/
		if (this.byId("applicantType").getVisible()) {
			if (this.byId("applicantType").getSelectedKey() === "") {
				this.byId("applicantType").setValueState(sap.ui.core.ValueState.Error);
				c = true;
			}
			/*if (this.byId("applicantType").getValue() !== "Individual") {
				if (this.byId("LastName").getValue() === "" && this.byId("LastName").getVisible() === true) {
					this.byId("LastName").setValueState(sap.ui.core.ValueState.Error);
					c = true;
				}
			} else {
				this.byId("LastName").setValueState(sap.ui.core.ValueState.None);

			}*/

		}
		if (this.byId("tmlCustomer").getVisible() === true) {
			if (this.byId("tmlCustomer").getValue() === "") {
				this.byId("tmlCustomer").setValueState(sap.ui.core.ValueState.Error);
				c = true;
			}

		}
		if (this.byId("cusFleetSize").getSelectedKey() === "") {
			this.byId("cusFleetSize").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusFleetApp").getSelectedKey() === "") {
			this.byId("cusFleetApp").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusSeg").getSelectedKey() === "") {
			this.byId("cusSeg").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusDealerCVPV").getSelectedKey() === "") {
			this.byId("cusDealerCVPV").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusDealerLocation").getValue() === "") {
			this.byId("cusDealerLocation").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("leadType").getSelectedKey() === "") {
			this.byId("leadType").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusDistchan").getSelectedKey() === "") {

			this.byId("cusDistchan").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusDealerSelect").getSelectedKey() === "") {

			this.byId("cusDealerSelect").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		/*	if (this.byId("statusdropdown").getSelectedKey() === "") {

			this.byId("statusdropdown").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}*/
		/*if (this.byId("cusRemark").getValue() === "") {
			this.byId("cusRemark").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}*/
		if (this.byId("cusDatePickerNextFollowup").getValue() === "" && this.byId("cusDatePickerNextFollowup").getVisible() === true) {
			this.byId("cusDatePickerNextFollowup").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusDatePickerTentative").getValue() === "" && this.byId("cusDatePickerTentative").getVisible() === true) {
			this.byId("cusDatePickerTentative").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusDatePickerVisit").getValue() === "" && this.byId("cusDatePickerVisit").getVisible() === true && this.byId(
				"cusDatePickerVisit").getEditable() === true) {
			this.byId("cusDatePickerVisit").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}

		if (this.accountName !== this.byId("customer").getValue()) {
			this.accountName = this.accountId;
		}

		if (this.validateProductRow() === true) {

			c = true;
		}
		if (c === true) {
			return false;
		}
		return true;
	},

	onMandatoryFieldChanged: function(e) {
		if (e.mParameters.id.indexOf("cusFirstName") > -1 || e.mParameters.id.indexOf("cusLastName") > -1 || e.mParameters.id.indexOf(
				"cusMiddleName") > -1 || e.mParameters.id.indexOf("FirstName") > -1 || e.mParameters.id.indexOf("LastName") > -1) {
			var val = e.mParameters.value;

			var val1 = val.replace(/\b[a-z]|\B[A-Z]/g, function(x) {
				return String.fromCharCode(x.charCodeAt(0) ^ 32);
			});
			if (this.byId("applicantType").getSelectedKey() !== "1") {
				val1 = val1.replace(/[^a-zA-Z0-9 ]/g, '');
			} else {
				val1 = val1.replace(/[^a-zA-Z ]/g, '');
			}

			e.getSource().setValue(val1);

		}
		if (e.mParameters.id.indexOf("cusAdd1") > -1 || e.mParameters.id.indexOf("cusAdd2") > -1 || e.mParameters.id.indexOf("cusAdd3") > -1) {
			var val = e.mParameters.value;
			var regexp = /^[a-zA-Z0-9-:/,() ]{1,40}$/;
			var res = regexp.test(val);
			if (res) {
				e.getSource().setValue(val);
			} else {
				val = val.slice(0, val.length - 1);
				//val = e.getSource()._lastValue;
				e.getSource().setValue(val);
			}
		}
		if (e.mParameters.id.indexOf("cusMobile") > -1) {
			var val = e.mParameters.value;
			//	var regexp = /^[789]\d{9}$/;
			//	var res = regexp.test(val);
			if (val.length === 1) {
				if (val === "7" || val === "8" || val === "9") {
					e.getSource().setValue(val);
				} else {
					val = val.slice(0, val.length - 1);
					//val = e.getSource()._lastValue;
					e.getSource().setValue(val);
				}

			} else {
				e.getSource().setValue(val);
			}
		}
		if (e.mParameters.id.indexOf("cusPinCode") > -1) {
			var val = e.mParameters.value;
			if (val.length === 6) {
				this.onPostalChange();
			} else {
				this.byId("cusDistrict").setValue("");
				this.byId("cusCity").setValue("");
				this.byId("cusState").setValue("");
				this.byId("cusCity").setEnabled(false);
			}
		}
		if (e.mParameters.id.indexOf("cusStd") > -1) {
			var val = e.mParameters.value;
			val = val.replace(/[^0-9 ]/g, '');
			var phoneMaxLen = 11 - val.length;
			this.byId("cusPhone").setMaxLength(phoneMaxLen);
			e.getSource().setValue(val);

		}
		e.getSource().setValueState(sap.ui.core.ValueState.None);
	},
	namechnge: function(evt) {
		if (evt.mParameters.id.indexOf("firstName") > -1 || evt.mParameters.id.indexOf("lastName") > -1) {
			var val = evt.mParameters.value;
			var val1 = val.replace(/\b[a-z]|\B[A-Z]/g, function(x) {
				return String.fromCharCode(x.charCodeAt(0) ^ 32);
			});
			val1.replace(/[^a-zA-Z ]/g, '');
			evt.getSource().setValue(val1);

		}
		evt.getSource().setValueState(sap.ui.core.ValueState.None);
	},
	Numchnge: function(evt) {
		var val = evt.mParameters.value;
		val = val.replace(/[^0-9a-zA-Z ]/g, '');

		if (evt.mParameters.id.indexOf("BusAggr") > -1) {
			var BugNum = val.replace(/[^0-9 ]/g, '');
			evt.getSource().setValue(BugNum);
			if (BugNum.length > 9) {
				this._setAccountDetailsbyBug(BugNum);
			}
		}
		evt.getSource().setValue(val);
		evt.getSource().setValueState("None");
	},
	MoNumchnge: function(evt) {
		var val = evt.mParameters.value;
		if (val.length <= 10) {
			evt.getSource().setValue(val);
		} else {
			//	val = evt.getSource()._lastValue;
			val = val.slice(0, val.length - 1);
			evt.getSource().setValue(val);
		}
	},
	setEnabledUserField: function(d) {
		this.byId("customer").setEnabled(d);
		this.byId("cusFirstName").setEnabled(d);
		this.byId("cusLastName").setEnabled(d);
		this.byId("FirstName").setEnabled(d);
		this.byId("LastName").setEnabled(d);
		this.byId("cusMiddleName").setEnabled(d);
		this.byId("cusAdd1").setEnabled(d);
		this.byId("cusAdd2").setEnabled(d);
		this.byId("cusAdd3").setEnabled(d);
		this.byId("cusMobile").setEnabled(d);
		this.byId("cusPhone").setEnabled(d);
		this.byId("cusStd").setEnabled(d);
		//this.byId("cusCity").setEnabled(d);
		//this.byId("cusDistrict").setEnabled(d);
		//this.byId("cusState").setEnabled(d);
		this.byId("cusPinCode").setEnabled(d);
	},

	onComboChanged: function(e) {
		if (e.mParameters.id.indexOf("Qty_Id") > -1) {
			var val = e.mParameters.value;
			e.getSource().setMaxLength(3);
			val = val.replace(/[^0-9 ]/g, '');
			e.getSource().setValue(val);
		}

		if (e.mParameters.id.indexOf("leadType") > -1) {
			var key = e.getSource().getSelectedKey();
			if (key === "T") {
				var bExistCust = this.byId("CustSw_id").getState();
				this.byId("applicantType").setVisible(!bExistCust);
				this.setEnabledUserField(false);
				this.byId("customer").setEnabled(bExistCust);
				this.byId("idProdTable").setVisible(false);
				this.byId("busiAggrements_tblId").setVisible(true);
			} else {
				//this.byId("customer").setVisible(true);
				if (this.byId("CustSw_id").getState() === false) {
					this.byId("applicantType").setVisible(true);
				}
				this.setEnabledUserField(true);
				this.byId("idProdTable").setVisible(true);
				this.byId("busiAggrements_tblId").setVisible(false);
			}

		}
		e.getSource().setValueState(sap.ui.core.ValueState.None);
	},
	onBranchChanged: function(e) {
		this.byId("cusDealerSelect").setSelectedItem(null);

		this.byId("cusDealerCVPV").setValueState(sap.ui.core.ValueState.None);
		this.branch = this.byId("cusDealerCVPV").getSelectedKey();
		this.distchannel = this.byId("cusDistchan").getSelectedKey();
		if (this.branch !== "" && this.distchannel !== "") {
			this.byId("ProductButton11").setEnabled(true);
		} else {
			this.byId("ProductButton11").setEnabled(false);
		}
		if (this.distchannel !== "") {
			this.onSourcingChanged(this.branch, this.distchannel);

		}

	},

	onDistchnChanged: function(e) {
		this.byId("cusDealerSelect").setSelectedItem(null);

		this.branch = this.byId("cusDealerCVPV").getSelectedKey();
		this.distchannel = this.byId("cusDistchan").getSelectedKey();
		this.byId("cusDistchan").setValueState(sap.ui.core.ValueState.None);
		if (this.branch !== "" && this.distchannel !== "") {
			this.byId("ProductButton11").setEnabled(true);
		} else {
			this.byId("ProductButton11").setEnabled(false);
		}
		if (this.branch !== "") {
			this.onSourcingChanged(this.branch, this.distchannel);
			var combo = this.getView().byId("cusDealerCVPV");
			$("#" + combo.sId + "> Input").attr("disabled", "disabled");
		}

	},
	onSourcingChanged: function(b, d) {
		var that = this;

		this._custJsonModel = this.getView().getModel("custJson");
		var _oFilter = new sap.ui.model.Filter("Branch", "EQ", b);
		var _oFilter1 = new sap.ui.model.Filter("Zchannel", "EQ", d);

		this.oModel.read("/ZBU_DESCRIPSet", null, ["$filter=Branch eq '" + b + "' and Zchannel eq '" + d + "'"], true,
			jQuery.proxy(function(
				aData, b) {
				that._custData.ZBU_DESCRIPSet = aData;
				that._custJsonModel.setData(that._custData);

				that._custJsonModel.updateBindings();

			}, this), jQuery.proxy(function(e) {
				that.handleErrors(e);

			}, this));

	},

	onApplicantChanged: function() {

		this.byId("applicantType").setValueState(sap.ui.core.ValueState.None);

		if (this.byId("applicantType").getSelectedKey() === "2" || this.byId("applicantType").getSelectedKey() === "3") {
			this.byId("customerName").setVisible(false);
			this.byId("cusFirstName").setVisible(false);
			this.byId("cusMiddleName").setVisible(false);
			this.byId("cusLastName").setVisible(false);
			this.byId("Name1").setVisible(true);
			this.byId("Name2").setVisible(true);
			this.byId("FirstName").setVisible(true);
			this.byId("LastName").setVisible(true);
			//	this.getView().byId("Name2").setRequired(true);
			if (this.byId("applicantType").getSelectedKey() === "3") {
				this.byId("cusPhone").setVisible(false);
				this.byId("mob").setVisible(false);
				this.byId("cusStd").setVisible(false);
				this.byId("cusMobile").setVisible(false);
				//	this.getView().byId("Name2").setRequired(true);
			} else {
				this.byId("cusPhone").setVisible(true);
				this.byId("mob").setVisible(true);
				this.byId("cusStd").setVisible(true);
				this.byId("cusMobile").setVisible(true);

			}

		} else if (this.byId("applicantType").getSelectedKey() === "" || this.byId("applicantType").getSelectedKey() === "1") {
			this.byId("Name1").setVisible(false);
			this.byId("Name2").setVisible(false);
			this.byId("FirstName").setVisible(false);
			this.byId("LastName").setVisible(false);
			this.byId("customerName").setVisible(true);
			this.byId("cusFirstName").setVisible(true);
			this.byId("cusMiddleName").setVisible(true);
			this.byId("cusLastName").setVisible(true);
			this.byId("cusPhone").setVisible(true);
			this.byId("mob").setVisible(true);
			this.byId("cusStd").setVisible(true);
			this.byId("cusMobile").setVisible(true);
		}
	},
	extHookGetHeaderFooterOptions: function(evt) {
		this.byId("Switch").setState(true);
	}
});