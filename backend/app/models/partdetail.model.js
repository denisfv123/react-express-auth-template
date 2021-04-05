const mongoose = require("mongoose");

const PartDetails = mongoose.model(
  "PartDetails",
  new mongoose.Schema({
    partName: String,
    custPartNumber: String,
    showOnDrawingNumber: String,
    OrgPartNumber: String,
    engineeringChangeLevel: String,
    engineeringChangeLevelDated: Date,
    additionalEngineeringChanges: String,
    additionalEngineeringChangesDated: Date,
    safetyAndGovermentChanges: Boolean,
    purchaseOrderNo: String,
    Weight: Number,
    checkingAidNo: String,
    checkingAidEngineeringChangeLevel: String,
    checkingAidEngineeringChangeLevelDated: Date,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  })
);

module.exports = PartDetails;
