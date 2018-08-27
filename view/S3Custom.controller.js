jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ca.ui.model.type.FileSize");
jQuery.sap.require("cus.crm.opportunity.util.schema");
jQuery.sap.require("cus.crm.opportunity.util.Formatter");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("cus.crm.opportunity.util.Util");
jQuery.sap.require("cus.crm.opportunity.util.Constants");
sap.ui.controller("cus.crm.opportunity.CRM_OPPRTNTYExtension.view.S3Custom", {
	onAfterRendering: function(evt) {
		//	var fleet = this.byId("opportunityFleet_Application_Text");
		// this.byId("fileupload").setFileType(["png", "jpg", "jpeg", "doc", "bit",
		//              "docx", "xls", "xlsx", "txt", "tif", "ppt", "pptx"
		//          ]);
	},

	_loadVersionSpecificUI: function(b) {
		if (parseFloat(b) >= 2) {
			this._loadWave4UI();
			if (!this.fullScreenMode) {
				this.oHeaderFooterOptions = this.oHeaderFooterOptions4UI;
			} else {
				this.oHeaderFooterOptions = this.oHeaderFooterOptions4UI;
			}
		} else {
			this._loadWave3UI();
			this.oHeaderFooterOptions = this.oHeaderFooterOptions3UI;
		}
		if (parseFloat(b) >= 5) {
			this._loadWave8UI();
		}
	},

	extendHeaderFooterOptions: function(h) {
		if (h.buttonList.length < 3) {
			var t = this;
			var customBtn = {
				/*"oProdBtn": {*/
				sI18nBtnTxt: "VIEW_ADD_PRODUCT",
				onBtnPressed: function(e) {
					t.onAddProduct();
				},
				bEnabled: true
			};
			h.buttonList.push(customBtn);
		}
	},

	onAddProduct: function() {
		this._oComponent = this.getOwnerComponent();
		if (this._oComponent.getComponentData() !== undefined) {
			if (this._oComponent.getComponentData().startupParameters.NavPage !== undefined) {
				this._sNavPage = this._oComponent.getComponentData().startupParameters.NavPage[0];
			}
		}
		var data = this.byId("opportunityHeader").getModel("json").getData();
		var oppId = data.Id;
		var semObj = "ZCRMNEEDANALYSIS";
		var action = "display";
		var navigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
		navigationService.toExternal({
			target: {
				semanticObject: semObj,
				action: action
			},
			params: {
				"ObjectId": oppId,
				"NavPage": this._sNavPage
			}
		});
	},

	navigateDocHistory: function(e) {
		var t = e.getSource().getText();
		var O = "";
		var g = "";
		for (var i = 0; i < this.newResult.length; i++) {
			if (t == this.newResult[i].TransactionId) {
				O = this.newResult[i].ObjectType;
				g = this.newResult[i].Guid;
				break;
			}
		}
		var f = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
		this.oCrossAppNavigator = f && f("CrossApplicationNavigation");
		var n = undefined;
		if (O === "BUS2000111") {
			n = {
				target: {
					semanticObject: "Opportunity",
					action: "manageOpportunity&/display/" + this.oConstants.OPP_END_POINT + "(guid'" + g + "')"
				}
			};
		} else if (O === "BUS2000125") {
			n = {
				target: {
					semanticObject: "Task",
					action: "manageTasks&/taskOverview/" + this.oConstants.TASK_END_POINT + "(guid'" + g + "')"
				}
			};
		} else if (O === "BUS2000126") {
			n = {
				target: {
					semanticObject: "Appointment",
					action: "myAppointments"
				},
				appSpecificRoute: [
					"&",
					"appointment",
					g
				].join("/")
			};
		} else if (O === "BUS2000108") {
			n = {
				target: {
					semanticObject: "Lead",
					action: "manageLead&/display/" + this.oConstants.LEAD_END_POINT + "(guid'" + g + "')"
				}
			};
		}
		if (this.extHookGetExtendedAppDetailsGeneral) {
			n = this.extHookGetExtendedAppDetailsGeneral(n);
		}
		if (this.oCrossAppNavigator) {
			this.oCrossAppNavigator.toExternal(n);
		}
	},

	_handleAddNote: function(e) {
		var t = e.getParameter("value");
		if (t) {
			var a = this;
			var m = this.getView().getModel();
			var h = this.byId("info").getModel("json").getData().Guid;
			var E = {
				HeaderGuid: h,
				Content: t
			};
			m.create("/OpportunityNotesSet", E, null, jQuery.proxy(function() {
				var a = this;
				m.read(a.sPath, null, ["$expand=Notes"], true, function(o, r) {
					a.byId("listItem").setModel(new sap.ui.model.json.JSONModel({
						OpportunityNotesSet: o.Notes.results
					}), "json");
					a.byId("listItem").getModel().updateBindings();
				});
			}, this), function(M) {
				a.displayResponseErrorMessage(M, sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("SAVE_FAILED"));
			});
			a.byId("listItem").getModel().updateBindings();
		}
	},
	OnuploadBefore: function(evt) {
		/* var fileupload = this.byId("UploadCollection");
        var ext = evt.getParameters("filename");
        var ext1 = ext.fileName;
        var extn = ext1.substring(ext1.lastIndexOf(".") + 1,
            ext1.length);
        extn = extn.toLowerCase();
        if (type.indexOf(extn) == -1) {
            this.onTypeMissmatch();
        }*/
	},
	onTypeMissmatch: function(evt) {
		var msg = "File Type not supported";
		sap.m.MessageBox.show(msg, {
			title: "Error",
			icon: sap.m.MessageBox.Icon.ERROR,
			styleClass: "sapUiSizeCompact",
			onClose: function(evt) {}
		}).addStyleClass("sapUiSizeCompact");
	},
	bindInfoAndProducts: function(d, s) {
		var e = [
			this.oConstants.OPP_END_POINT,
			this.oConstants.DOCUMENT_ITEM_END_POINT,
			this.oConstants.DOC_APPLICATION_LOG_NAVIGATION
		];
		d = this.oConstantsFactory.mappingPropertyByEntities(d, e);
		this.d = d;
		var i = this.byId("info");
		var p = this.byId("Product_Tab");
		var j = this.getView().getModel("json");
		var D = j.oData;
		if (!this.isOffline) {
			var a = this.byId("S3_Header");
			this.transactionType = a.getModel("json").getData().ProcessType;
		}
		if (p) {
			if (d[this.oConstants.DOCUMENT_ITEM_END_POINT] !== undefined) {
				D.Products = d[this.oConstants.DOCUMENT_ITEM_END_POINT].results;
				D.ProductsNum = d[this.oConstants.DOCUMENT_ITEM_END_POINT].results.length;
			}

		}
		var t = this;
		/*	this.oModel.read("/ZsalesofficeF4Set", null, [], true, jQuery.proxy(function(
				aData, b) {
				t.d.ZsalesofficeF4Set = aData;
				//t._custJsonModel.setData(t._custData);
			//	t._custJsonModel.updateBindings();
			}, this), jQuery.proxy(function(e) {
				this.handleErrors(e);
			}, this));*/

		this.oModel.read("/ZBU_DESCRIPSet", null, ["$filter=Branch eq '" + d.Branch + "' and Zchannel eq '" + d.DistributionChannel + "'"],
			false,
			jQuery.proxy(function(
				aData, b) {
				t.d.ZBU_DESCRIPSet = aData;
			}, this), jQuery.proxy(function(e) {
				t.handleErrors(e);
			}, this));
		j.updateBindings();
		if (this.isOffline) {
			this.byId("Product_Tab").getBinding("items").sort(new sap.ui.model.Sorter(this.oConstants.SORT_PRODUCT_BY_ITEM_GUID, false, false));
		}

		if (d[this.oConstants.CHANGE_DOC_END_POINT] && d[this.oConstants.CHANGE_DOC_END_POINT].results) {
			if (d.ChangeDocs.results.length === 0) {
				this.byId("log").setVisible(false);
			} else {
				this.byId("log").setVisible(true);
			}
		}
		if (d.Competitors && d.Competitors.results) {
			if (d.Competitors.results.length === 0) {
				this.byId("tab_competitor").setVisible(false);
			} else {
				this.byId("tab_competitor").setVisible(true);
			}
		}
		if (!this.extHookErrMsgLazyLoad || !this.extHookErrMsgLazyLoad()) {
			this.sBackendVersion = cus.crm.opportunity.util.schema._getServiceSchemaVersion(this.oModel, "Opportunity");
			if (this.sBackendVersion >= 4) {
				if (d[this.oConstants.DOC_APPLICATION_LOG_NAVIGATION] && d[this.oConstants.DOC_APPLICATION_LOG_NAVIGATION].results) {
					if (d[this.oConstants.DOC_APPLICATION_LOG_NAVIGATION].results.length === 0) {
						this.setBtnEnabled("errorMsg", false);
					} else {
						this.setBtnEnabled("errorMsg", true);
						var L = this.showErrorMsgFragment.getContent()[0];
						if (L && L.getModel("json")) {
							L.getModel("json").setData({
								OpportunityLogSet: d[this.oConstants.DOC_APPLICATION_LOG_NAVIGATION].results
							});
							var o = d[this.oConstants.DOC_APPLICATION_LOG_NAVIGATION].results.length;
							var m = this.oResourceBundle.getText("ERROR_MESSAGE_TITLE", o);
							this.showErrorMsgFragment.setTitle(m);
						}
					}
				}
			}
		}
		this._custData = [];
		this._custJsonModel = new sap.ui.model.json.JSONModel(this._custData);
		this._custJsonModel.setSizeLimit(200);
		this.getView().setModel(this._custJsonModel, "json");
		var t = this;
		this.oModel.read(this.sPath, null, ["$expand=ZFLEET_APP_MASTS,Zcustseg"], true, jQuery.proxy(function(
			aData, b) {
			t._custData = aData;
			t._custJsonModel.setData(aData);

		}, this), jQuery.proxy(function(e) {
			this.handleErrors(e);
		}, this));

		if (s) {
			this.setDefaultTabToInfo();
		}
		this.bindS3Header(d);
	}
});