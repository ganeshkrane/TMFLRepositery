jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.utils.busydialog");
jQuery.sap.require("sap.ca.ui.DatePicker");
jQuery.sap.require("sap.m.SelectDialog");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("cus.crm.opportunity.util.Formatter");
jQuery.sap.require("cus.crm.opportunity.util.schema");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("cus.crm.opportunity.util.Util");
sap.ui.controller("cus.crm.opportunity.CRM_OPPRTNTYExtension.view.S4Custom", {

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
					} else if (a == C) {

					}
				}, this)
			});
		} else {
			this.datalossDismissed({
				isConfirmed: true
			});
		}
		this.oModel.clearBatch();
	},

	pageNeedsUpdate: function() {
		this.oModel.clearBatch();
		var n = parseFloat(this.sBackendVersion);
		var e = null;
		if (n >= 4) {
			e = {
				sETag: null
			};
		}
		if (this.WinStatusCode === this.byId("userStatus").getSelectedKey()) {
			this.getView().byId("chanceOfSuccess").setValue(100);
		}
		if (this.LostStatusCode === this.byId("userStatus").getSelectedKey()) {
			this.getView().byId("chanceOfSuccess").setValue(0);
		}
		this.requestNumber = 0;
		this.bBasketUpdate = false;
		this.changeSetMapping = {
			HEADER: "",
			CONTACT: "",
			EMPLOYEE: "",
			STATUS: "",
			BASKET: ""
		};
		var c = [];
		var h = this.headerGuid;
		var b = this.byId("productBasketEdit").getModel("json").getData();
		var m = this.oModel;
		var t = this;
		c = [];
		this.changeSetMapping.CUSTOM_UPDATE_REQUEST = "";
		this.requestNumber = 0;
		if (this.extHookCheckDeltaAndFrameRequests) {
			this.extHookCheckDeltaAndFrameRequests(c);
		}
		var a = {
			Guid: h,
			Description: this.byId("description").getValue(),
			ExpectedSalesVolume: this.FormatvolumeValue.toString(),
			CurrencyCode: this.byId("currency").getValue(),
			ChanceOfSuccess: this.byId("chanceOfSuccess").getValue(),
			StartDate: this.getDateTimeStampFromDatePicker(this.byId("datePickerStartDate")),
			ClosingDate: this.getDateTimeStampFromDatePicker(this.byId("datePickerEndDate")),
			SalesStageCode: this.byId("stages").getSelectedKey(),
			UserStatusCode: this.byId("userStatus").getSelectedKey(),
			PriorityCode: this.byId("priority").getSelectedKey(),
			ForecastRelevance: this.byId("switch").getState()
		};
		var d = {};
		var k;
		var f = false;
		for (k in a) {
			switch (k) {
				case "Guid":
					d[k] = a[k];
					break;
				case "StartDate":
				case "ClosingDate":
					if (!this._areDatesSame(this.HeaderObject[k], a[k])) {
						d[k] = a[k];
						f = true;
					}
					break;
				case "ChanceOfSuccess":
					if (Number(this.HeaderObject[k]) !== Number(a[k])) {
						d[k] = a[k];
						f = true;
					}
					break;
				case "ExpectedSalesVolume":
					if (this.HeaderObject[k] !== a[k]) {
						d[k] = a[k];
						if (!d.hasOwnProperty("CurrencyCode")) {
							d["CurrencyCode"] = a["CurrencyCode"];
						}
						f = true;
					}
					break;
				default:
					if (this.HeaderObject[k] !== a[k]) {
						d[k] = a[k];
						f = true;
					}
			}
		}
		if (this._hasUserStatusChanged() || this._hasMainContactChanged() || this._hasEmployeeChanged()) {
			f = true;
		}
		if (this.extHookAddCustomHeaderFields) {
			var g = this.extHookAddCustomHeaderFields(d);
			f = f || g;
		}
		if (f === true) {
			this.changeSetMapping.HEADER = this.requestNumber;
			this.requestNumber++;
			c.push(m.createBatchOperation("Opportunities(guid'" + h + "')", "MERGE", d, e));
		} else {
			this.changeSetMapping.HEADER = "";
		}
		if (this._hasUserStatusChanged()) {
			this.changeSetMapping.STATUS = this.requestNumber;
			this.requestNumber++;
			var d;
			var s;
			var j, l;
			s = this.StatusProfile;
			d = {
				HeaderGuid: h,
				StatusProfile: s,
				UserStatusCode: this.byId("userStatus").getSelectedKey()
			};
			c.push(m.createBatchOperation("OpportunityStatuses(StatusProfile='" + s + "',UserStatusCode='" + this.byId("userStatus").getSelectedKey() +
				"',HeaderGuid=guid'" + h + "')", "MERGE", d, e));
		} else {
			this.changeSetMapping.STATUS = "";
		}
		if (!this._isContactFilledProperly()) {
			return;
		}
		if (this._hasMainContactChanged()) {
			var u = "";
			var p = {};
			if (this.byId("inputMainContact").getValue() === "") {
				u = "OpportunitySalesTeamSet(PartnerNumber='" + "" + "',PartnerFunctionCode='00000015',HeaderGuid=guid'" + this.headerGuid + "')";
				p = {
					HeaderGuid: this.headerGuid,
					PartnerFunctionCode: "00000015",
					PartnerNumber: "",
					MainPartner: true
				};
			} else {
				u = "OpportunitySalesTeamSet(PartnerNumber='" + this.oSelectedContact.contactID +
					"',PartnerFunctionCode='00000015',HeaderGuid=guid'" + this.headerGuid + "')";
				p = {
					HeaderGuid: this.headerGuid,
					PartnerFunctionCode: "00000015",
					PartnerNumber: this.oSelectedContact.contactID,
					MainPartner: true
				};
			}
			this.changeSetMapping.CONTACT = this.requestNumber;
			this.requestNumber++;
			c.push(m.createBatchOperation(u, "MERGE", p, e));
		} else {
			this.changeSetMapping.CONTACT = "";
		}
		if (parseFloat(this.sBackendVersion) >= 2) {
			if (this._hasEmployeeChanged()) {
				var u;
				var p = {};
				if (this.byId("inputEmpResponsible").getValue() === "") {
					u = "OpportunitySalesTeamSet(PartnerNumber='" + "',PartnerFunctionCode='00000014',HeaderGuid=guid'" + this.headerGuid + "')";
					p = {
						HeaderGuid: this.headerGuid,
						PartnerFunctionCode: "00000014",
						PartnerNumber: "",
						MainPartner: true
					};
				} else {
					u = "OpportunitySalesTeamSet(PartnerNumber='" + this.oSelectedEmployee.employeeID +
						"',PartnerFunctionCode='00000014',HeaderGuid=guid'" + this.headerGuid + "')";
					p = {
						HeaderGuid: this.headerGuid,
						PartnerFunctionCode: "00000014",
						PartnerNumber: this.oSelectedEmployee.employeeID,
						MainPartner: true
					};
				}
				this.changeSetMapping.EMPLOYEE = this.requestNumber;
				this.requestNumber++;
				c.push(m.createBatchOperation(u, "MERGE", p, e));
			} else
				this.changeSetMapping.EMPLOYEE = "";
		}
		var i;
		for (i = 0; i < this.deleteBuffer.length; i++) {
			e = null;
			if (parseFloat(this.sBackendVersion) >= 4) {
				e = {
					sETag: this.deleteBuffer[i].__metadata.etag
				};
			}
			this.bBasketUpdate = true;
			var d = {
				HeaderGuid: this.deleteBuffer[i].HeaderGuid,
				ItemGuid: this.deleteBuffer[i].ItemGuid,
				ProductGuid: this.deleteBuffer[i].ProductGuid,
				ProductId: this.deleteBuffer[i].ProductId,
				ProcessingMode: "D"
			};
			if (this.extHookAddCustomColumnsForProductDelete) {
				this.extHookAddCustomColumnsForProductDelete(d, this.deleteBuffer[i]);
			}
			c.push(m.createBatchOperation("OpportunityProducts(HeaderGuid=guid'" + this.deleteBuffer[i].HeaderGuid + "',ItemGuid=guid'" + this.deleteBuffer[
				i].ItemGuid + "')", "MERGE", d, e));
		}
		var b = this.byId("productBasketEdit").getModel("json").getData();
		var o = this.byId("productBasketEdit").getItems();
		var i, q = 0,
			j;
		if (b.Products)
			q = b.Products.length;
		for (i = 0; i < q; i++) {
			if (b.Products[i].Backend === "X") {
				var O = this.BackendProducts[b.Products[i].ItemGuid];
				var N = b.Products[i];
				var v = false;
				var e = null;
				if (parseFloat(this.sBackendVersion) >= 4) {
					e = {
						sETag: b.Products[i].__metadata.etag
					};
				}
				if (this.extHookCheckDeltaOnProductEntry) {
					v = this.extHookCheckDeltaOnProductEntry(O, N);
				}
				var d = {
					HeaderGuid: b.Products[i].HeaderGuid,
					ItemGuid: b.Products[i].ItemGuid,
					ProductGuid: b.Products[i].ProductGuid,
					ProcessingMode: "B"
				};
				if (O.Quantity !== N.Quantity) {
					this.bBasketUpdate = true;
					v = true;
					d["Quantity"] = N.Quantity;
				}
				if (O.TotalExpectedNetValue !== N.TotalExpectedNetValue) {
					this.bBasketUpdate = true;
					v = true;
					d["TotalExpectedNetValue"] = N.TotalExpectedNetValue;
				}
				if (this.extHookAddCustomColumnsForProductModify) {
					this.extHookAddCustomColumnsForProductModify(d, N);
				}
				if (v == true) {
					c.push(m.createBatchOperation("OpportunityProducts(HeaderGuid=guid'" + b.Products[i].HeaderGuid + "',ItemGuid=guid'" + b.Products[i]
						.ItemGuid + "')", "MERGE", d, e));
				}
			} else if (b.Products[i].Backend === "") {
				this.bBasketUpdate = true;
				var d = {
					HeaderGuid: b.Products[i].HeaderGuid,
					ItemGuid: "00000000-0000-0000-0000-000000000001",
					ProductGuid: b.Products[i].ProductGuid,
					ProductId: b.Products[i].ProductId,
					Quantity: b.Products[i].Quantity === "" ? "0" : b.Products[i].Quantity,
					TotalExpectedNetValue: b.Products[i].TotalExpectedNetValue === "" ? "0" : b.Products[i].TotalExpectedNetValue,
					Unit: b.Products[i].Unit,
					ProcessingMode: "A"
				};
				if (this.extHookAddCustomColumnsForProductCreate) {
					this.extHookAddCustomColumnsForProductCreate(d, b.Products[i]);
				}
				c.push(m.createBatchOperation("OpportunityProducts", "POST", d, null));
			}
		}
		if (this.bBasketUpdate === true) {
			this.changeSetMapping.BASKET = this.requestNumber;
			this.requestNumber++;
		} else
			this.changeSetMapping.BASKET = "";
		if (c.length > 0) {
			m.addBatchChangeOperations(c);
			return true;
		}
		return false;
	},
	onEditSave: function() {

		var m = this.oModel;
		m.setRefreshAfterChange(false);
		if (!this.oApplicationFacade.getApplicationModel("Back")) {
			cus.crm.opportunity.util.Util.initBackModel(this);
		}
		if (this.validateDates() === false)
			return;
		if (this.validateEditPage() === false) {
			sap.ca.ui.message.showMessageToast(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("MANDAT_FIELD"));
			return;
		}
		if (this.validateCurrency() === true) {
			sap.m.MessageBox.show(this.currencyMessage, {
				icon: sap.m.MessageBox.Icon.WARNING,
				title: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("WARNING"),
				actions: [
					sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CONTINUE"),
					sap.m.MessageBox.Action.CANCEL
				],
				onClose: jQuery.proxy(function(a) {
					if (a == "Continue") {
						var r = {};
						r.isConfirmed = true;
						this.dataConfirm(r);
					} else if (a == "CANCEL") {}
				}, this)
			});
		} else {
			this.dataConfirm({
				isConfirmed: true
			});
		}

		this.getView().getModel("controllers").getData().s2Controller;

		var a = this.getView().getModel("controllers").getData().s2Controller.getList().getBinding("items");

		a.refresh(true);
	},
	dataConfirm: function(r) {
		if (r.isConfirmed) {
			var m = this.oModel;

			if (this._checkDataLoss()) {
				var t = this;
				this.pageNeedsUpdate();
				if (this.requestNumber > 0) {
					this.setBtnEnabled("saveButton", false);
					sap.ca.ui.utils.busydialog.requireBusyDialog();
					var x = m.submitBatch(function(R) {
						t.handleBatchResponses(R);
					}, function(e) {
						sap.ca.ui.utils.busydialog.releaseBusyDialog();
						t.setBtnEnabled("saveButton", true);
						sap.ca.ui.message.showMessageBox({
							type: sap.ca.ui.message.Type.ERROR,
							message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SAVE_FAILED")
						});
					}, true);
				}
			} else {
				this.datalossDismissed({
					isConfirmed: true
				});
				this.oModel.clearBatch();
			}
		}
	},

	onSourcingChanged: function(b, d) {
		var that = this;

		this._custJsonModel = this.getView().getModel("custJson");

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
	handleBatchResponses: function(r) {
		var s = [];
		var a;
		var h = false;
		var S = false;
		var p = false;
		var f = false;
		var b = false;
		var e = "";
		this.bEmployeeUpdateSuccess = false;
		var l = r.__batchResponses.length;
		sap.ca.ui.utils.busydialog.releaseBusyDialog();
		if (r.__batchResponses[0].hasOwnProperty("__changeResponses")) {
			if (this.extHookHandleResponsesForCustomUpdates) {
				this.extHookHandleResponsesForCustomUpdates(r);
			}
			if (this.changeSetMapping.HEADER !== "") {
				a = r.__batchResponses[0].__changeResponses[this.changeSetMapping.HEADER];
				if (parseInt(a.statusCode) >= 400) {
					s.push(a.statusText);
					f = true;
					e += JSON.parse(a.response.body).error.message.value + "\n";
					if (parseInt(a.statusCode) === 412) {
						b = true;
					}
				} else {
					this.HeaderObject.Description = this.byId("description").getValue();
					this.HeaderObject.StartDate = this.byId("datePickerStartDate").getDateValue();
					this.HeaderObject.ClosingDate = this.byId("datePickerEndDate").getDateValue();
					this.HeaderObject.SalesStageDescription = this.byId("stages").getSelectedItem().getText();
					this.HeaderObject.SalesStageCode = this.byId("stages").getSelectedKey();
					if (this.byId("priority").getSelectedItem()) {
						this.HeaderObject.PriorityText = this.byId("priority").getSelectedItem().getText();
					} else {
						this.HeaderObject.PriorityText = "";
					}

					this.HeaderObject.PriorityCode = this.byId("priority").getSelectedKey();
					this.HeaderObject.ExpectedSalesVolume = this.byId("expectedSalesVolume").getValue();
					this.HeaderObject.ChanceOfSuccess = this.byId("chanceOfSuccess").getValue();
					this.HeaderObject.CurrencyCode = this.byId("currency").getValue();
					this.HeaderObject.ForecastRelevance = this.byId("switch").getState();
					h = true;
					p = true;
				}
			}
			if (this.changeSetMapping.STATUS !== "") {
				a = r.__batchResponses[0].__changeResponses[this.changeSetMapping.STATUS];
				if (parseInt(a.statusCode) < 400) {
					this.HeaderObject.UserStatusCode = this.byId("userStatus").getSelectedKey();
					this.HeaderObject.UserStatusText = this.byId("userStatus").getSelectedItem().getText();
					S = true;
					p = true;
				} else {
					s.push(a.statusText);
					f = true;
					e += JSON.parse(a.response.body).error.message.value + "\n";
					if (parseInt(a.statusCode) === 412) {
						b = true;
					}
				}
			}
			if (this.changeSetMapping.CONTACT !== "") {
				a = r.__batchResponses[0].__changeResponses[this.changeSetMapping.CONTACT];
				if (parseInt(a.statusCode) >= 400) {
					s.push(a.statusText);
					f = true;
					e += JSON.parse(a.response.body).error.message.value + "\n";
					if (parseInt(a.statusCode) === 412) {
						b = true;
					}
				} else {
					p = true;
					this.HeaderObject.MainContactId = this.oSelectedContact.contactID;
					this.HeaderObject.MainContactName = this.oSelectedContact.fullName;
				}
			}
			if (parseFloat(this.oVersioningModel.getData().BackendSchemaVersion) >= 2) {
				if (this.changeSetMapping.EMPLOYEE !== "") {
					a = r.__batchResponses[0].__changeResponses[this.changeSetMapping.EMPLOYEE];
					if (parseInt(a.statusCode) >= 400) {
						s.push(a.statusText);
						f = true;
						e += JSON.parse(a.response.body).error.message.value + "\n";
						this.oSelectedEmployee.employeeID = this.HeaderObject.EmployeeResponsibleNumber;
						this.oSelectedEmployee.fullName = this.HeaderObject.EmployeeResponsibleName;
						if (parseInt(a.statusCode) === 412) {
							b = true;
						}
					} else {
						p = true;
						this.HeaderObject.EmployeeResponsibleNumber = this.oSelectedEmployee.employeeID;
						this.HeaderObject.EmployeeResponsibleName = this.oSelectedEmployee.fullName;
						this.byId("inputMainContact").setValue(this.HeaderObject.EmployeeResponsibleName);
						this.bEmployeeUpdateSuccess = true;
					}
				}
			}
			if (this.changeSetMapping.BASKET !== "") {
				var i;
				var l = r.__batchResponses[0].__changeResponses.length;
				for (i = this.changeSetMapping.BASKET; i < l; i++) {
					a = r.__batchResponses[0].__changeResponses[i];
					if (parseInt(a.statusCode) >= 400) {
						s.push(a.statusText);
						f = true;
						e += JSON.parse(a.response.body).error.message.value + "\n";
						if (parseInt(a.statusCode) === 412) {
							b = true;
						}
					} else
						p = true;
				}
			}
			if (b === true) {
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("MSG_CONFLICTING_DATA")
				}, jQuery.proxy(function() {
					this._refreshOpportunity();
				}, this));
				return;
			}
			if (p && f) {
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PARTIAL_SAVE"),
					details: e
				}, function() {});
				return;
			}
			if (!p && f) {
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SAVE_FAILED"),
					details: e
				}, function() {});
				return;
			}
		} else {
			if (this._is412Error(r)) {
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("MSG_CONFLICTING_DATA")
				}, jQuery.proxy(function() {
					this._refreshOpportunity();
				}, this));
				return;
			}
			p = true;
			f = true;
			var d;
			var c = JSON.parse(r.__batchResponses[0].response.body).error;
			if (c.innererror && c.innererror.errordetails) {
				var g = c.innererror.errordetails;
				for (var i = 0; i < g.length; i++) {
					if (g[i].message.length > 0) {
						if (d == null)
							d = g[i].message;
						else
							d += "\n" + g[i].message;
					}
				}
			}
			if (d == null) {
				d = c.message.value;
			}
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: this.oI18nModel.getResourceBundle().getText("SAVE_FAILED"),
				details: d
			}, function() {});
			this.setBtnEnabled("saveButton", true);
			return;
		}
		if (h || S)
			this.refreshHeaderList();
		if (f) {
			this.bSuccessSave = false; {
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SAVE_FAILED"),
					details: e
				}, function() {});
			}
		} else {
			this.bSuccessSave = true;
			var j = "Opportunities(guid'" + this.headerGuid + "')";
			sap.ui.getCore().getEventBus().publish("cus.crm.opportunity", "opportunityChanged", {
				contextPath: j
			});
			sap.m.MessageToast.show(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("OPP_SAVED"), {
				closeOnBrowserNavigation: false
			});
			this.bNavOnUpdate = true;
			this._navToDetailPage(j);
		}
		cus.crm.opportunity.util.Util.refreshHeaderETag(this.sPath, this);
	},

	validateEditPage: function() {
		var c = false;
		if (this.byId("cusFirstName").getValue() === "" && this.byId("cusFirstName").getVisible() === true && this.byId("cusFirstName").getEditable() ===
			true) {
			this.byId("cusFirstName").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusLastName").getValue() === "" && this.byId("cusLastName").getVisible() === true && this.byId("cusLastName").getEditable() ===
			true) {
			this.byId("cusLastName").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusExistingCustomer").getValue() === "" && this.byId("cusExistingCustomer").getVisible() === true && this.byId(
				"cusExistingCustomer").getEditable() === true) {
			this.byId("cusExistingCustomer").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("FirstName").getValue() === "" && this.byId("FirstName").getVisible() === true && this.byId("FirstName").getEditable() ===
			true) {
			this.byId("FirstName").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("LastName").getValue() === "" && this.byId("LastName").getVisible() === true && this.byId("LastName").getEditable() ===
			true) {
			this.byId("LastName").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusAdd1").getValue() === "" && this.byId("cusAdd1").getVisible() === true && this.byId("cusAdd1").getEditable() ===
			true) {
			this.byId("cusAdd1").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusAdd2").getValue() === "" && this.byId("cusAdd2").getVisible() === true && this.byId("cusAdd2").getEditable() ===
			true) {
			this.byId("cusAdd2").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusAdd3").getValue() === "" && this.byId("cusAdd3").getVisible() === true && this.byId("cusAdd3").getEditable() ===
			true) {
			this.byId("cusAdd3").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusPinCode").getValue() === "" && this.byId("cusPinCode").getVisible() === true && this.byId("cusPinCode").getEditable() ===
			true) {
			this.byId("cusPinCode").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusMobile").getValue() === "" && this.byId("cusMobile").getVisible() === true && this.byId("cusMobile").getEditable() ===
			true) {
			this.byId("cusMobile").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("tmlCustomer").getValue() === "" && this.byId("tmlCustomer").getVisible() === true) {
			this.byId("tmlCustomer").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("leadType").getValue() === "") {
			this.byId("leadType").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("applicantType").getValue() === "" && this.byId("applicantType").getVisible() === true && this.byId(
				"applicantType").getEditable() === true) {
			this.byId("applicantType").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusDatePickerNextFollowup").getValue() === "" && this.byId("cusDatePickerNextFollowup").getVisible() === true && this.byId(
				"cusDatePickerNextFollowup").getEditable() === true) {
			this.byId("cusDatePickerNextFollowup").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusDatePickerTentative").getValue() === "" && this.byId("cusDatePickerTentative").getVisible() === true && this.byId(
				"cusDatePickerTentative").getEditable() === true) {
			this.byId("cusDatePickerTentative").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusDatePickerVisit").getValue() === "" && this.byId("cusDatePickerVisit").getVisible() === true && this.byId(
				"cusDatePickerVisit").getEditable() === true) {
			this.byId("cusDatePickerVisit").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusDealerCVPV").getValue() === "") {

			this.byId("cusDealerCVPV").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.byId("cusDistchan").getValue() === "") {

			this.byId("cusDistchan").setValueState(sap.ui.core.ValueState.Error);
			c = true;
		}
		if (this.accountName !== this.byId("cusExistingCustomer").getValue()) {
			this.accountName = this.accountId;
		}

		if (this.validateProductRow()) {
			c = true;
		}
		if (c === true) {
			return false;
		}
		return true;
	},
	onMandatoryFieldChanged: function(e) {
		e.getSource().setValueState(sap.ui.core.ValueState.None);
	},

	onPostalChange: function(oEvent) {
		var _oItem = this.byId("cusPinCode");
		var _sPostalCode = _oItem.getValue();

		this._sSelectedAddItemPath = _oItem.getBindingContext().getPath();
		//_sPostalCode = this.oModel.getProperty(this._sSelectedAddItemPath + "/PostlCod1");
		if (_sPostalCode !== "") {
			oEvent.getSource().setValueState("None");
		} else {
			oEvent.getSource().setValueState("Error");
		}

		if (_sPostalCode !== "") {

			var sFilter1 = new sap.ui.model.Filter("PostCode1", "EQ", _sPostalCode);
			this.oModel.read("/PCBaseDataSet", {
				filters: [sFilter1],
				success: jQuery.proxy(this._onPostalReadSuccess, this),
				error: jQuery.proxy(this._onPostalReadError, this)
			});
		} else {
			this.oModel.setProperty(this._sSelectedAddItemPath + "/City", "");
			this.oModel.setProperty(this._sSelectedAddItemPath + "/District", "");
			this.oModel.setProperty(this._sSelectedAddItemPath + "/Region", "");
		}

	},
	_onPostalReadSuccess: function(oData, oResponse) {
		this.oModel.setProperty(this._sSelectedAddItemPath + "/Country", "IN"); //oData.results[0].Country);
		if (oData.results && oData.results.length > 0) {
			this.oModel.setProperty(this._sSelectedAddItemPath + "/City", oData.results[0].City1);
			this.oModel.setProperty(this._sSelectedAddItemPath + "/District", oData.results[0].City2);
			this.oModel.setProperty(this._sSelectedAddItemPath + "/Region", oData.results[0].Region);

		} else {
			this.oModel.setProperty(this._sSelectedAddItemPath + "/City", "");
			this.oModel.setProperty(this._sSelectedAddItemPath + "/District", "");
			this.oModel.setProperty(this._sSelectedAddItemPath + "/Region", "");
		}
	},

	_onPostalReadError: function(oResponse) {},
	onComboChanged: function(e) {
		e.getSource().setValueState(sap.ui.core.ValueState.None);
	},

	onBranchChanged: function() {
		this.byId("cusDealerSelect").setSelectedItem(null);
		this.byId("cusDealerCVPV").setValueState(sap.ui.core.ValueState.None);
		this.branch = this.byId("cusDealerCVPV").getSelectedKey();
		this.distchannel = this.byId("cusDistchan").getSelectedKey();

		if (this.distchannel !== "") {
			this.onSourcingChanged(this.branch, this.distchannel);
		}
	},

	onDistchnChanged: function() {
		this.byId("cusDealerSelect").setSelectedItem(null);
		this.branch = this.byId("cusDealerCVPV").getSelectedKey();
		this.distchannel = this.byId("cusDistchan").getSelectedKey();
		this.byId("cusDistchan").setValueState(sap.ui.core.ValueState.None);
		if (this.branch !== "") {
			this.onSourcingChanged(this.branch, this.distchannel);
		}

	},

	validateCurrency: function() {
		return false;
	},
	validateDates: function() {

		return true;
	},

	getDateTimeStampFromDatePicker: function(d) {
		var l = $("#" + d.getIdForLabel()).val();
		if (l === "" || l === undefined) {
			return null;
		}
		var c = this.oDateFormatter.parse(l);
		var dateVal = "";
		var y, m, a;
		if (c !== null) {
			y = c.getFullYear();
			m = c.getMonth();
			a = c.getDate();
			dateVal = new Date(Date.UTC(y, m, a));
		} else if (c !== "") {
			y = l.split('.')[2];
			m = l.split('.')[1];
			a = l.split('.')[0];
			dateVal = new Date(Date.UTC(y, m, a));
		} else {
			dateVal = null;
		}
		return dateVal;
	},

	_checkDataLoss: function() {
		var h = this.headerGuid;
		var t = {
			Guid: h,
			Description: this.byId("description").getValue(),
			ExpectedSalesVolume: this.FormatvolumeValue.toString(),
			CurrencyCode: this.byId("currency").getValue(),
			ChanceOfSuccess: this.byId("chanceOfSuccess").getValue(),
			StartDate: this.getDateTimeStampFromDatePicker(this.byId("datePickerStartDate")),
			ClosingDate: this.getDateTimeStampFromDatePicker(this.byId("datePickerEndDate")),
			SalesStageCode: this.byId("stages").getSelectedKey(),
			UserStatusCode: this.byId("userStatus").getSelectedKey(),
			PriorityCode: this.byId("priority").getSelectedKey(),
			ForecastRelevance: this.byId("switch").getState()
		};
		var k;
		var e = {};
		for (k in t) {
			switch (k) {
				case "StartDate":
				case "ClosingDate":
					if (!this._areDatesSame(this.HeaderObject[k], t[k])) {
						return true;
					}
					break;
				case "ChanceOfSuccess":
					if (Number(this.HeaderObject[k]) !== Number(t[k])) {
						return true;
					}
					break;
				case "ExpectedSalesVolume":
					if (this.HeaderObject[k] !== t[k]) {
						return true;
					}
				default:
					if (this.HeaderObject[k] !== t[k]) {
						return true;
					}
			}
		}

		if (this.extHookAddCustomHeaderFields) {
			var v = this.extHookAddCustomHeaderFields(e);
			if (v) {
				return true;
			}
		}
		if (this.userStatusCode !== this.byId("userStatus").getSelectedKey()) {
			return true;
		}
		if (this.HeaderObject.MainContactId !== this.oSelectedContact.contactID || this.HeaderObject.MainContactName !== this.byId(
				"inputMainContact").getValue()) {
			return true;
		}
		if (parseFloat(this.sBackendVersion) >= 2) {
			if (this.HeaderObject.EmployeeResponsibleNumber !== this.oSelectedEmployee.employeeID || this.HeaderObject.EmployeeResponsibleName !==
				this.byId("inputEmpResponsible").getValue()) {
				return true;
			}
		}
		if (this.deleteBuffer.length > 0) {
			return true;
		}
		var b = this.byId("productBasketEdit").getModel("json").getData();
		var l = 0;
		if (b.Products) {
			l = b.Products.length;
		}
		for (var i = 0; i < l; i++) {
			if (b.Products[i].Backend === "X") {
				var o = this.BackendProducts[b.Products[i].ItemGuid];
				var n = b.Products[i];
				var v = false;
				if (o.Quantity !== n.Quantity) {
					return true;
				}
				if (o.TotalExpectedNetValue !== n.TotalExpectedNetValue) {
					return true;
				}
				if (this.extHookCheckDeltaOnProductEntry) {
					v = this.extHookCheckDeltaOnProductEntry(o, n);
					if (v) {
						return true;
					}
				}
			} else {
				return true;
			}
		}
		return false;
	},

	extHookBindAdditionalFields: function(a) {
		this._custData = [];
		this._custJsonModel = new sap.ui.model.json.JSONModel(this._custData);
		this._custJsonModel.setSizeLimit(200);
		this.getView().setModel(this._custJsonModel, "custJson");
		var t = this;
		this.oModel.read(this.sPath, null, ["$expand=Statuses,ZProduct,ZFLEET_APP_MASTS,Zcustseg"], true, jQuery.proxy(function(
			aData, b) {
			t._custData = aData;
			if (t._custData.BPTYPE == "3") {
				this.byId("cusPhone").setVisible(false);
				this.byId("cusStd").setVisible(false);
				this.byId("cusMobile").setVisible(false);
				this.byId("mob").setVisible(false);

			} else {
				this.byId("cusPhone").setVisible(true);
				this.byId("cusStd").setVisible(true);
				this.byId("cusMobile").setVisible(true);
				this.byId("mob").setVisible(true);

			}
			t._custJsonModel.setData(aData);
			t.bindFleetSize();
			//	t.onPostalChange();
			var a = t._custJsonModel.getData();

			t._branch = a.Branch;
			t._distchn = a.DistributionChannel;
			if (t._distchn !== "" && t._branch !== "") {
				t.onSourcingChanged(t._branch, t._distchn);

			}
			this._setProductCategoryData(t._custJsonModel, false, []);
		}, this), jQuery.proxy(function(e) {
			this.handleErrors(e);
		}, this));

		this.getView().byId("cusPhone").attachBrowserEvent("keypress", function(e) {
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

	},
	extHookCheckDeltaAndFrameRequests: function(c) {
		//Create/update batch
		var e = {
			sETag: null
		};
		var jModel = this.getView().getModel("custJson");
		var _tableData = jModel.oData.ZProduct.results;
		var tab = this.byId("idProdTable");
		var Items = tab.getItems();

		if (Items.length > 0) {
			for (var i = 0; i < Items.length; i++) {
				var d = {
					// ObjectId: _tableData[i].ObjectId,
					Guid: _tableData[i].Guid,
					RecordId: _tableData[i].RecordId,
					CategoryId: Items[i].getCells()[0].getSelectedKey(),
					ProductId: Items[i].getCells()[1].getSelectedKey(),
					Quantity: Items[i].getCells()[2].getValue()
				};
				c.push(this.oModel.createBatchOperation("ZProductSet(RecordId=guid'" + _tableData[i].RecordId + "')", "MERGE", d, e));
			}
		}

	},
	extHookAddCustomHeaderFields: function(e) {

		e.CUSTOMERID = this.byId("cusExistingCustomer").getValue();
		e.Description = this.byId("cusFirstName").getValue() + " " + this.byId("cusLastName").getValue();
		e.BPTYPE = this.byId("applicantType").getSelectedKey();
		e.Ztml = this.byId("tmlCustomer").getSelectedKey();
		e.Sorg = this.byId("loanType").getSelectedKey();
		e.NAMEFIRST = this.byId("cusFirstName").getValue();
		e.NAMELAST = this.byId("cusLastName").getValue();
		e.ADDRESS1 = this.byId("cusAdd1").getValue();
		e.ADDRESS2 = this.byId("cusAdd2").getValue();
		e.ADDRESS3 = this.byId("cusAdd3").getValue();
		e.POST_CODE1 = this.byId("cusPinCode").getValue();
		e.PHONE = this.byId("cusPhone").getValue();
		e.DISTRICT = this.byId("cusDistrict").getValue();
		e.CITY1 = this.byId("cusCity").getValue();
		e.REGION = this.byId("cusState").getValue();
		e.TelExtens = this.byId("cusStd").getValue();
		e.MOBILE = this.byId("cusMobile").getValue();
		e.CUSTSEGMENT = this.byId("cusSeg").getSelectedKey();
		e.FLEETSIZE = this.byId("cusFleetSize").getSelectedKey();
		e.FLEETAPPL = this.byId("cusFleetApp").getSelectedKey();
		e.DEALERNAME = this.byId("cusDealerSelect").getSelectedKey();
		e.DEALERLOC = this.byId("cusDealerLocation").getValue();
		e.Branch = this.byId("cusDealerCVPV").getSelectedKey();
		e.Zchannel = this.byId("cusDistchan").getSelectedKey();
		e.NEXTFOLLOWUP = this.getDateTimeStampFromDatePicker(this.byId("cusDatePickerNextFollowup"));
		e.TENTIVEDATE = this.getDateTimeStampFromDatePicker(this.byId("cusDatePickerTentative"));
		e.VISITDATE = this.getDateTimeStampFromDatePicker(this.byId("cusDatePickerVisit"));
		e.LeadComment = this.byId("cusRemark").getValue();
		e.Zleadtype = this.byId("leadType").getValue();
		return true;
	},
	extHookValidateAdditionalFields: function() {

	},
	validateProductRow: function() {
		var hasValid = false;
		var items = this.byId("idProdTable").getItems();
		for (var i = 0; i < items.length; i++) {
			var prod = items[i].mAggregations.cells[0].getSelectedKey();
			var varient = items[i].mAggregations.cells[1].getSelectedKey();
			var qty = items[i].mAggregations.cells[2].getValue();
			/*	if (prod !== "") {
					items[i].mAggregations.cells[0].setValueState("None");
				} else {
					hasValid = false;
					items[i].mAggregations.cells[0].setValueState("Error");
				}*/
			if (varient !== "") {
				items[i].mAggregations.cells[1].setValueState("None");
			} else {
				hasValid = true;
				items[i].mAggregations.cells[1].setValueState("Error");
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
	/********************Account search help code********************/
	_onExistingCustSwich: function(oEvent) {
		// this.byId("ProductButton11").setEnabled(false);
		if (oEvent.getParameter("state")) {

			this.byId("cusLblCustomer").setVisible(true);
			this.byId("cusExistingCustomer").setVisible(true);
			this.byId("Name1").setVisible(false);
			this.byId("Name2").setVisible(false);
			this.byId("cusFirstName").setEditable(false);
			this.byId("cusMiddleName").setEditable(false);
			this.byId("cusLastName").setEditable(false);

			this.byId("applicantType").setEditable(false);
			this.byId("cusMobile").setEditable(false);
			this.byId("cusPhone").setEditable(false);
			this.byId("cusStd").setEditable(false);
			this.byId("cusPinCode").setEditable(false);
			this.byId("cusAdd3").setEditable(false);
			this.byId("cusAdd2").setEditable(false);
			this.byId("cusAdd1").setEditable(false);
			this.byId("cusExistingCustomer").setEditable(false);
			this.byId("FirstName").setVisible(false);
			this.byId("LastName").setVisible(false);
			this.byId("tmlCustomer").setVisible(false);

			if (this.byId("applicantType").getSelectedKey() == "3") {
				this.byId("cusPhone").setVisible(false);
				this.byId("cusStd").setVisible(false);
				this.byId("cusMobile").setVisible(false);
				this.byId("mob").setVisible(false);
				this.byId("Name1").setVisible(true);
				this.byId("Name2").setVisible(true);
			} else {
				this.byId("cusPhone").setVisible(true);
				this.byId("cusStd").setVisible(true);
				this.byId("cusMobile").setVisible(true);
				this.byId("mob").setVisible(true);

			}
			///////////////////////////////////////////////////
			this.byId("cusExistingCustomer").setValue("");
			this.byId("cusFirstName").setValue("");
			this.byId("cusMiddleName").setValue("");
			this.byId("cusLastName").setValue("");
			this.byId("cusAdd1").setValue("");
			this.byId("cusAdd2").setValue("");
			this.byId("cusMobile").setValue("");
			this.byId("cusPinCode").setValue("");
			this.byId("cusPhone").setValue("");
			this.byId("cusStd").setValue("");
			this.byId("applicantType").setSelectedKey("");
			this.byId("cusAdd3").setValue("");
			this.byId("cusState").setValue("");
			this.byId("cusFleetSize").setValue("");
			this.byId("cusSeg").setValue("");
			this.byId("cusFleetApp").setValue("");
			this.byId("cusFleetSize").setValue("");
			this.byId("cusDealerCVPV").setSelectedKey("");
			this.byId("cusDistchan").setSelectedKey("");
			this.byId("cusDealerCVPV").setValue("");
			this.byId("cusDistchan").setValue("");
			this.byId("cusDealerSelect").setValue("");
			this.byId("cusDealerLocation").setValue("");
			this.byId("leadType").setValue("");

			/////////// set value state error ///////////

			this.byId("applicantType").setValueState(sap.ui.core.ValueState.None);
			this.byId("FirstName").setValueState(sap.ui.core.ValueState.None);

			this.byId("LastName").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusFirstName").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusMiddleName").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusLastName").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusExistingCustomer").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusMobile").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusAdd1").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusAdd2").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusAdd3").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusPinCode").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusDealerCVPV").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusDistchan").setValueState(sap.ui.core.ValueState.None);

		} else {

			this.accountId = "";
			this.byId("cusLblCustomer").setVisible(false);
			this.byId("cusExistingCustomer").setVisible(false);
			this.byId("tmlCustomer").setVisible(true);

			this.byId("cusFirstName").setEditable(true);
			this.byId("cusMiddleName").setEditable(true);
			this.byId("cusLastName").setEditable(true);
			this.byId("applicantType").setEditable(true);
			this.byId("cusMobile").setEditable(true);
			this.byId("cusPhone").setEditable(true);
			this.byId("cusStd").setEditable(true);
			this.byId("cusPinCode").setEditable(true);
			this.byId("cusAdd3").setEditable(true);
			this.byId("cusAdd2").setEditable(true);
			this.byId("cusAdd1").setEditable(true);
			this.byId("cusExistingCustomer").setEditable(true);
			this.byId("cusExistingCustomer").setValue("");
			this.byId("cusFirstName").setValue("");
			this.byId("cusMiddleName").setValue("");
			this.byId("cusLastName").setValue("");
			this.byId("cusAdd1").setValue("");
			this.byId("cusAdd2").setValue("");
			this.byId("cusAdd3").setValue("");
			this.byId("cusMobile").setValue("");
			this.byId("cusPhone").setValue("");
			this.byId("cusStd").setValue("");
			this.byId("cusPinCode").setValue("");
			this.byId("cusState").setValue("");
			this.byId("cusFleetSize").setValue("");
			this.byId("cusSeg").setValue("");
			this.byId("cusFleetApp").setValue("");
			this.byId("cusFleetSize").setValue("");

			this.byId("cusDealerSelect").setValue("");
			this.byId("cusDealerLocation").setValue("");
			this.byId("applicantType").setSelectedKey("");
			this.byId("cusDatePickerNextFollowup").setValue("");
			this.byId("cusDatePickerTentative").setValue("");
			this.byId("cusDatePickerVisit").setValue("");
			this.byId("cusRemark").setValue("");
			this.byId("cusDealerCVPV").setSelectedKey("");
			this.byId("cusDistchan").setSelectedKey("");
			this.byId("cusDealerCVPV").setValue("");
			this.byId("cusDistchan").setValue("");
			this.byId("leadType").setValue("");

			this.byId("Name1").setVisible(false);
			this.byId("Name2").setVisible(false);
			this.byId("FirstName").setVisible(false);

			this.byId("LastName").setVisible(false);
			this.byId("customerName").setVisible(true);
			this.byId("cusFirstName").setVisible(true);
			this.byId("cusMiddleName").setVisible(true);
			this.byId("cusLastName").setVisible(true);
			this.byId("cusPhone").setVisible(true);
			this.byId("cusStd").setVisible(true);
			this.byId("cusMobile").setVisible(true);
			//this.getView().getModel().refresh(true);
			/////////// set value state error ///////////

			this.byId("applicantType").setValueState(sap.ui.core.ValueState.None);
			this.byId("FirstName").setValueState(sap.ui.core.ValueState.None);
			this.byId("LastName").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusFirstName").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusMiddleName").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusLastName").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusExistingCustomer").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusMobile").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusAdd1").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusAdd2").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusAdd3").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusPinCode").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusDealerCVPV").setValueState(sap.ui.core.ValueState.None);
			this.byId("cusDistchan").setValueState(sap.ui.core.ValueState.None);

		}
	},
	onAccountSuggestItemSelected: function(e) {
		var i = e.getParameter("selectedItem");
		var a = null;
		a = i.data("oAccount");
		this.accountName = a.fullName === "" ? a.accountID : a.fullName;
		this.accountId = a.accountID;
		this.byId("cusExistingCustomer").setValue(this.accountId);
		this._setAccountDetails(this.accountId);
	},
	onAccountInputFieldChanged: function(e) {
		this.byId("cusExistingCustomer").setValueState(sap.ui.core.ValueState.None);
		var a = e.getSource();
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
	_setAccount: function(a) {
		var b = this.getView().byId("cusExistingCustomer");
		if (b)
			b.setValue(a);
		if (a === "") {
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
			this.byId("cusState").setValue("");
			this.byId("cusPinCode").setValue("");
		}
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
	showAccountF4: function(e) {
		this.accountF4Fragment = null;
		this.accountF4Fragment = new sap.ui.xmlfragment(this.createId("accountF4"), "cus.crm.opportunity.view.AccountSelectDialog", this);
		this.accountF4Fragment.setModel(this.oI18nModel, "i18n");
		var j = new sap.ui.model.json.JSONModel();
		this.accountF4Fragment.setModel(j);
		this.accountF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText("LOADING_TEXT"));
		var t = this.accountF4Fragment.getContent()[0].getInfoToolbar();
		var a = t.getContent()[0];
		t.setVisible(false);
		this.accountF4Fragment.open();
		if (this.bBpDeterminationEnabled) {
			t.setVisible(true);
			a.setText(this.oResourceBundle.getText("DETERM_FILTER"));
			var m = this._prepareHeaderF4Model();
			if (m.Account && m.Account.length > 0) {
				this.accountF4Fragment.getSubHeader().getContentLeft()[0].setValue("");
				this.accountF4Fragment.getModel().setData({
					AccountCollection: m.Account
				});
			} else {
				this.accountF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText("NO_DATA_TEXT"));
			}
		} else {
			var s = this.byId("cusExistingCustomer").getValue();
			var T = s.split("/");
			var b = T[0].replace(/\s+$/, "");
			this.accountF4Fragment.getSubHeader().getContentLeft()[0].setValue(b);
			this._refreshAccountList(b);
		}
	},
	closeAccountF4: function(e) {
		this.accountF4Fragment.close();
		this.accountF4Fragment.destroy();
	},
	searchAccount: function(e) {
		var v = e.getParameter("query");
		var t = this.accountF4Fragment.getContent()[0].getInfoToolbar();
		t.setVisible(false);
		this.accountF4Fragment.getModel().setData({
			AccountCollection: []
		});
		this.accountF4Fragment.getContent()[0].setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText(
			"LOADING_TEXT"));
		this._refreshAccountList(v);
	},
	liveSearchAccount: function(e) {
		var t = e.getParameters().newValue;
		var s = this.accountF4Fragment.getSubHeader().getContentLeft()[0];
		if (t.length === 0 || t.length > 3) {
			s.fireSearch({
				query: t
			});
		}
	},
	_refreshAccountList: function(s) {
		this.accountF4Template = new sap.m.ObjectListItem({
			title: "{parts : ['fullName','name1','accountID'],formatter : 'cus.crm.opportunity.util.Formatter.formatAccountF4Title'}"
		}).addAttribute(new sap.m.ObjectAttribute({
			text: "{parts : [{path : 'accountID'},{path : 'MainAddress/city'},{path : 'MainAddress/country'}],formatter : 'cus.crm.opportunity.util.Formatter.formatAccountF4Description'}"
		}));
		var f = [];
		if (s !== "") {
			f.push(new sap.ui.model.Filter("fullName", sap.ui.model.FilterOperator.Contains, s));
		}
		if (!this.accountF4Fragment) {
			this.accountF4Fragment = new sap.ui.xmlfragment(this.createId("accountF4"), "cus.crm.opportunity.view.AccountSelectDialog", this);
			var j = new sap.ui.model.json.JSONModel();
			this.accountF4Fragment.setModel(j);
			this.accountF4Fragment.setModel(this.oI18nModel, "i18n");
		}
		var l = this.accountF4Fragment.getContent()[0];
		l.setModel(this.oModel);
		l.bindAggregation("items", {
			path: "/AccountCollection",
			parameters: {
				expand: "MainAddress",
				select: "accountID,name1,name2,fullName,MainAddress/address,MainAddress/street,MainAddress/mobilePhone,MainAddress/phone,MainAddress/city,MainAddress/country"
			},
			filters: f,
			template: this.accountF4Template
		});
		l.getBinding("items").attachDataReceived(jQuery.proxy(this._setAccountJsonModel), this);
	},
	_setAccountJsonModel: function(e) {
		if (e.getParameter("data") !== null && e.getParameter("data") !== undefined) {
			var r = e.getParameter("data").results;
			if (r.length === 0) {
				this.accountF4Fragment.getContent()[0].setNoDataText(this.oResourceBundle.getText("NO_DATA_TEXT"));
			}
		}
	},
	setAccount: function(e) {
		this.oSelectedAccount = e.getSource().getSelectedItem().getBindingContext().getObject();
		var a = this.oSelectedAccount.fullName;
		var b = this.oSelectedAccount.accountID;
		if (a && a !== "") {
			this.byId("cusExistingCustomer").setValue(a);
			this.accountName = a;
		} else {
			this.byId("cusExistingCustomer").setValue(b);
			this.accountName = b;
		}
		this.byId("cusExistingCustomer").setValue(b);

		this.accountId = b;
		this._setAccountDetails(this.accountId);
		this.byId("cusExistingCustomer").setValueState(sap.ui.core.ValueState.None);
		this.accountF4Fragment.getContent()[0].removeSelections();

		this.accountF4Fragment.close();
		this.accountF4Fragment.destroy(); //this.enableSaveBtn();
	},
	_setAccountDetails: function(accId) {
		this.oModel.read("/ZAccountCollection(accountID='" + accId + "')", null, null, true, jQuery.proxy(function(d, r) {
			if (d) {
				this.byId("cusFirstName").setValue(d.NameFirst);
				this.byId("cusLastName").setValue(d.NameLast);
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
				this.byId("applicantType").setSelectedKey(d.BpType);
				if (d.BpType == "3") {
					this.byId("cusPhone").setVisible(false);
					this.byId("cusStd").setVisible(false);
					this.byId("cusMobile").setVisible(false);
				} else {
					this.byId("cusPhone").setVisible(true);
					this.byId("cusStd").setVisible(true);
					this.byId("cusMobile").setVisible(true);
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
				this.byId("cusState").setValue("");
				this.byId("cusPinCode").setValue("");
			}
		}, this), jQuery.proxy(function(e) {
			jQuery.sap.log.error("Read failed in S4->_setAccountDetails:" + e.response.body);
		}, this));

	},
	/********************END Account search help code********************/

	/********************Product table functions********************/
	onProductChange: function(oEvent) {

		var _selectedItem = oEvent.getSource().getParent();
		var Items = this.byId("idProdTable").getItems();
		for (var i = 0; i < Items.length; i++) {
			if (Items[i] === _selectedItem) {
				var _ind = i;
			}
		}
		var _sProductKey = oEvent.getSource().getSelectedKey();
		this.PK = _sProductKey;
		oEvent.getSource().setSelectedKey(_sProductKey);
		this._bindVariants(_sProductKey, _ind);
	},
	_bindVariants: function(sKey, _index, ProdId, Qty) {
		var DC = this.byId("cusDealerCVPV").getSelectedKey();
		var SC = this.byId("cusDistchan").getSelectedKey();
		var _sPath = "/CategoryHelpSet('" + sKey + "')/ProductHelpSet?$filter=DistChan eq '" + SC + "' and SalesOffice eq '" + DC + "'";
		this._readVariants(_sPath, _index, ProdId, Qty, sKey);
	},
	_readVariants: function(sPath, iIndex, ProdId, Qty, sKey) {
		this.ProdKey = sKey;
		this.ProdVal = ProdId;
		this.Qtyval = Qty;
		this.Index = iIndex;

		var t = this; //this.Index=-1;
		this.oModel.read(sPath, null, null, false, jQuery.proxy(function(o, b) {
			var _jModdel = t.getView().getModel("custJson");
			var _productData = _jModdel.oData.ZProduct.results;
			_productData[t.Index].relatedProducts = o.results;
			_productData[t.Index].CategoryId = t.ProdKey;
			_jModdel.updateBindings();
			var Varinput = t.temp1.getCells()[1];
			var tab = t.byId("idProdTable");

			if (t.Index !== undefined) {
				Varinput = tab.getItems()[t.Index].getCells()[1];
			}

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
				template: oItemTemplate
			});

			if (t.ProdKey !== "" && t.ProdVal !== "") {
				if (t.Index !== undefined) {
					tab.getItems()[t.Index].getCells()[0].setSelectedKey(t.ProdKey);
					tab.getItems()[t.Index].getCells()[1].setSelectedKey(t.ProdVal);
					tab.getItems()[t.Index].getCells()[2].setValue(t.Qtyval);
				} else {
					t.temp1.getCells()[0].setSelectedKey(t.ProdKey);
					t.temp1.getCells()[1].setSelectedKey(t.ProdVal);
					t.temp1.getCells()[2].setValue(t.Qtyval);
				}
			}
		}, this), jQuery.proxy(function(E) {
			this.handleErrors(E);
		}, this));

	},
	_setProductCategoryData: function(jsonModel, bAddFirstProduct, aNewRecord) {
		var t = this;
		this.oModel.read("/CategoryHelpSet", null, null, true, jQuery.proxy(function(o, r) {
			if (bAddFirstProduct) {

				aNewRecord.categoryData = r.data.results;
				jsonModel.oData.ZProduct.results = [];
				jsonModel.oData.ZProduct.results.push(aNewRecord);

				t.idProdTableColumnListItem = this.byId("idProdTableColumnListItem");
				var temp = t.idProdTableColumnListItem.clone();
				t.temp1 = temp;
				t.ProdTab = t.byId("idProdTable");
				t.ProdTab.addItem(temp);
				var json = new sap.ui.model.json.JSONModel(o.results);

				var Prod = t.temp1.getCells()[0];
				Prod.setModel(json);
				var oItemTemplate = new sap.ui.core.ListItem({
					key: "{CategoryId}",
					text: "{CategoryText}"
				});
				Prod.bindAggregation("items", {
					path: "/",
					templateShareable: true,
					template: oItemTemplate
				});
			} else {
				var len = jsonModel.oData.ZProduct.results.length;
				this.ProdTab = t.byId("idProdTable");
				this.ProdTab.removeAllItems();
				var json = new sap.ui.model.json.JSONModel(r.data.results);
				for (var i = 0; i < len; i++) {
					jsonModel.oData.ZProduct.results[i].categoryData = r.data.results;
					t.idProdTableColumnListItem = this.byId("idProdTableColumnListItem");
					t.temp1 = t.idProdTableColumnListItem.clone();
					t.ProdTab.addItem(t.temp1);
					var catId = jsonModel.oData.ZProduct.results[i].CategoryId;
					var ProdId = jsonModel.oData.ZProduct.results[i].ProductId;
					var Qty = jsonModel.oData.ZProduct.results[i].Quantity;

					var Prod = t.temp1.getCells()[0];
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
					t.temp1.getCells()[2].setValue(Qty);
					if (catId !== null && catId !== "") {

						t._bindVariants(catId, i, ProdId, Qty);
					} else {
						t.ProdTab.removeItem(t.temp1);
					}
				}
			}
			jsonModel.updateBindings();
		}, this), jQuery.proxy(function(E) {
			this.handleErrors(E);
		}, this));
	},
	addProductTableRow: function(evt) {

		var _oProdTable = this.byId("idProdTable");
		var jModel = this.getView().getModel("custJson");
		var _tableData = jModel.oData.ZProduct.results;
		var _catData = [];
		var newRowRecord = {
			"Guid": this.headerGuid, //"",
			"RecordId": "00000000-0000-0000-0000-000000000001",
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
			this.ProdTab = _oProdTable;
			this.idProdTableColumnListItem = this.byId("idProdTableColumnListItem");
			this.temp1 = this.idProdTableColumnListItem.clone();
			this.ProdTab.addItem(this.temp1);
			var json = new sap.ui.model.json.JSONModel(_catData);
			var Prod = this.temp1.getCells()[0];
			Prod.setModel(json);
			var oItemTemplate = new sap.ui.core.ListItem({
				key: "{CategoryId}",
				text: "{CategoryText}"
			});
			Prod.bindAggregation("items", {
				path: "/",
				templateShareable: true,
				template: oItemTemplate
			});
		} else {
			this._setProductCategoryData(jModel, true, newRowRecord);
		}
	},
	deleteProductTableRow: function(oEvent) {
		var that = this;
		var table=this.getView().byId("idProdTable");
		var d = that.getView().getModel("custJson").getData();
		var lineItem = oEvent.getSource().getParent();
		var Pkey = lineItem.getCells()[0].getSelectedKey();
		var res = this.getView().getModel("custJson").oData.ZProduct.results;
		for (var i = 0; i < res.length; i++) {
			var resKey = res[i].CategoryId;
			if (Pkey === resKey) {
				d.ZProduct.results.splice(i, 1);
				break;
			}
		}
		table.removeItem(lineItem);
		this.getView().getModel("custJson").updateBindings();
	},
	QtyChange:function(e){
		var val = e.mParameters.value;
			val = val.replace(/[^0-9 ]/g, '');
			e.getSource().setValue(val);
			e.getSource().setValueState("None");
	},

	/********************END Product table functions********************/
	onApplicantChanged: function() {

		this.byId("applicantType").setValueState(sap.ui.core.ValueState.None);
		if (this.byId("applicantType").getSelectedKey() === "2" || this.byId("applicantType").getSelectedKey() === "3") {

			this.byId("customerName").setVisible(false);
			this.byId("cusFirstName").setVisible(false);
			this.byId("cusLastName").setVisible(false);
			this.byId("Name1").setVisible(true);
			this.byId("Name2").setVisible(true);
			this.byId("FirstName").setVisible(true);
			this.byId("LastName").setVisible(true);
			if (this.byId("applicantType").getSelectedKey() === "3") {
				this.byId("cusPhone").setVisible(false);
				this.byId("cusStd").setVisible(false);
				this.byId("cusMobile").setVisible(false);
				this.byId("mob").setVisible(false);
			} else {
				this.byId("cusPhone").setVisible(true);
				this.byId("cusStd").setVisible(true);
				this.byId("cusMobile").setVisible(true);
				this.byId("mob").setVisible(true);
			}
		} else if (this.byId("applicantType").getSelectedKey() === "" || this.byId("applicantType").getSelectedKey() === "1") {
			this.byId("Name1").setVisible(false);
			this.byId("Name2").setVisible(false);
			this.byId("FirstName").setVisible(false);
			this.byId("LastName").setVisible(false);
			this.byId("customerName").setVisible(true);
			this.byId("cusFirstName").setVisible(true);
			this.byId("cusLastName").setVisible(true);
			this.byId("cusPhone").setVisible(true);
			this.byId("cusStd").setVisible(true);
			this.byId("cusMobile").setVisible(true);
			this.byId("mob").setVisible(true);
		}

	}
});