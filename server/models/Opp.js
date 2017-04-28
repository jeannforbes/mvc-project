/*
* Main model/schema for the Opportunity object, containing...
*   Name
*   Date
*   Info
*   Contact (Phone, Email, Other)
*   Responses
*   Owner
*   CreatedData
*/

const _ = require('underscore');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let OppModel = {};

const convertId = mongoose.Types.ObjectId;
const setString = (name) => _.escape(name).trim();

const OppSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setString,
    default: 'No event name given',
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  info: {
    type: String,
    set: setString,
    required: true,
    trim: true,
    default: 'No description given',
  },
  phone: {
      type: String,
      set: setString,
      required: false,
      default: 'No phone number provided',
    },
  email: {
    type: String,
    set: setString,
    required: false,
    default: 'No email provided',
  },
  other: {
    type: String,
    set: setString,
    required: false,
    default: '',
  },
  rsvps: {
    type: Array,
    required: true,
    default: [],
  },
  bookmarks: {
    type: Array,
    required: true,
    default: [],
  },
   owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
  uniqueId: {
    type: Number,
    required: true,
    default: new Date().valueOf(),
  },
});

OppSchema.statics.ToAPI = (doc) => ({
  name: doc.name,
  date: doc.date,
  info: doc.info,
  phone: doc.phone,
  email: doc.email,
  other: doc.other,
  rsvps: [],
  bookmarks: [],
  uniqueId: doc.uniqueId,
});

OppSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return OppModel.find(search).select('name date info phone email other rsvps').exec(callback);
};

OppSchema.statics.addBookmark = (uId, ownerId, callback) => {

  const updatedOpp = OppModel.updateOne( 
    {uniqueId: uId},
    { $addToSet : {bookmarks: ownerId }, }
  ).exec(callback);

  return updatedOpp;
};

OppSchema.statics.addRSVP = (uId, ownerId, callback) => {

  const updatedOpp = OppModel.updateOne( 
    {uniqueId: uId},
    { $addToSet : {rsvps: ownerId }, }
  ).exec(callback);

  return updatedOpp;
};

OppSchema.statics.deleteOpp = (ownerId, callback) => {
  const search = {
    owner: ownerId,
  };

  return OppModel.find(search).remove().exec(callback);
};

OppModel = mongoose.model('Opp', OppSchema);

module.exports.OppModel = OppModel;
module.exports.OppSchema = OppSchema;
