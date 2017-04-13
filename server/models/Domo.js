const _ = require('underscore');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let DomoModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		set: setName,
		default: 'Mysterious Stranger',
	},
	class: {
		type: String,
		required: true,
		trim: true,
		default: 'Vagrant',
	},
	title: {
		type: String,
		required: true,
		trim: true,
		default: 'The Bland',
	},
	stats: {
		fortitude: {
			type: Number,
			min: 1,
			required: true,
			default: 1,
		},
		cunning: {
			type: Number,
			min: 1,
			required: true,
			default: 1,
		},
		treachery: {
			type: Number,
			min: 1,
			required: true,
			default: 1,
		},
		hp: {
			type: Number,
			min: 0,
			required: true,
			default: 10,
		},
	},

	inventory: {
		backpack: [],
		equipped: [],
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
});

DomoSchema.statics.ToAPI = (doc) => ({
	name: doc.name,
	title: doc.title,
	stats: doc.stats,
	inventory: doc.inventory,

});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
	const search = {
		owner: convertId(ownerId),
	};

	return DomoModel.find(search).select('name title class stats inventory').exec(callback);
};

DomoSchema.statics.updateDomo = (doc, callback) => {
	return callback;
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;