'use strict';

const electron = require('electron');
const app = electron.app;
const ipcMain = electron.ipcMain;
const Datastore = require('nedb')
const path = require('path')

var constants = require ('../constants.js')

let db = {};
db.torrents = new Datastore({ filename: path.join(app.getPath('appData'), 'torrents.db'), autoload: true })

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
