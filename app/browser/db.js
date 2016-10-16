'use strict';

const electron = require('electron');
const app = electron.app;
const ipcMain = electron.ipcMain;
const Datastore = require('nedb')
const path = require('path')

var constants = require ('../constants.js')

let db = {};
console.info(app.getPath('appData'))
db.torrents = new Datastore({ filename: path.join(app.getPath('appData'), 'lawd-reloaded', 'torrents.db'), autoload: true })

// Expose all the torrents store to the renderer process, return as nedb docs
ipcMain.on(constants.ACTION_GET_TORRENTS, function(event, arg) {
  db.torrents.find({}, function (err, docs) {
    event.returnValue = docs;
  });
});

// Insert a new torrent to datastore
ipcMain.on(constants.ACTION_ADD_TORRENT, function(event, doc) {
	db.torrents.insert(doc, function (err, newDoc) {
    event.returnValue = newDoc;
  });
});

// Insert a new torrent to datastore
ipcMain.on(constants.ACTION_UPDATE_TORRENT, function(event, doc) {
	// db.torrents.update({ _id: doc_id }, {}, function (err, numRemoved) {
  // 	event.returnValue = numRemoved;
	// });
	console.log('update called')
});

// Insert a new torrent to datastore
ipcMain.on(constants.ACTION_REMOVE_TORRENT, function(event, id) {
	db.torrents.remove({ _id: id }, {}, function (err, numRemoved) {
  	event.returnValue = numRemoved;
	});
});
