const ipcRenderer = require('electron').ipcRenderer;

import _ from 'underscore';
import request from 'request';
import fs from 'fs';
import path from 'path';

let instance;
let downloadPath;
let queue = {};
let isDownloading = false;

export default class PlaylistDownloader {
  constructor() {
    this.downloadPath = ipcRenderer.sendSync('request-download-path');

    if(!fs.existsSync(this.downloadPath)) {
      fs.mkdirSync(this.downloadPath);
    }

    this.downloadEmitter = new DownloadEmitter();
  }

  static getInstance() {
    if(!instance) {
      instance = new PlaylistDownloader();
    }

    return instance;
  }

  getPlaylist(index) {
    return queue[Object.keys(queue)[index]];
  }

  addToQueue(playlist, cb) {
    const self =this;

    // Create a dir for this playlist (if does not exist)
    let dir = path.join(self.downloadPath, (playlist.id).toString());
    if(!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    playlist.dir = dir;

    // Add properties to track donwload progress on a given playlist
    playlist.downloadStarted = false;
    playlist.downloadProgress = 0;
    playlist.downloadedTracks = [];

    queue[playlist.id] = playlist;

    self.donwloadQueuedAction(playlist.id);

    cb();
  }

  shiftQueue() {
    let playlist = queue[Object.keys(queue)[0]];
    delete queue[playlist.id];
    console.info('shift called', queue)
  }

  downloadNext() {
    let self = this;

    // Pick the first playlist on the queue
    let playlist = self.getPlaylist(0);

    self.downloadEmitter.emit('playlist-download-started');

    let tracks = playlist.tracks;

    // Variables to track download progress, totalSize equals to sum of
    // playlist tracks size. Received increments itself with every track
    // filesize download.
    let totalSize = 0;
    let received = 0;

    tracks.forEach(function(track) {
      let options = {
        id: (track.id).toString(),
        file: track.file,
        dir: playlist.dir
      }

      self.downloadRequestWithRetry(options, 0,
        ((size) => {
          totalSize += size;
        }),
        ((data) => {
          received += data;
          let progress = Math.floor(received / totalSize * 100);

          self.downloadEmitter.emit('playlist-download-progress', playlist.id, progress);
        }),
        (() => {
          playlist.downloadedTracks.push(track.id);

          console.info(playlist.downloadedTracks.length, 'tracks downloaded');

          if(playlist.downloadedTracks.length == tracks.length) {
            self.downloadEmitter.emit('playlist-download-finish', playlist.id);
            self.downloadFinishedAction();
          }
        })
      );
    });
  }

  downloadRequestWithRetry(options, retry, started, progressed, finished) {
    let self = this;
    var filename = (options.id).toString();
    var writeStream = fs.createWriteStream(path.join(options.dir, filename));

    let hasErrors = false;
    request(options.file, {timeout: 15000})
    .on('response', function(data) {
      // Only init download started callback first time
      if(retry === 0) {
        started(parseInt(data.headers[ 'content-length' ]));
      }
    })
    .on('error', function(err) {
      // When an error occurs, re initiate download with retry incremented.
      // This supposes we are online. For offline / online switch,
      // see onlineUpdate() method.
      hasErrors = true;
       if(retry < 5 && navigator.onLine) {
        retry ++;
        self.downloadRequestWithRetry(options, retry, started, progressed, finished);
      }
    })
    .on('data', function(chunk) {
      progressed(chunk.length);
    })
    .on('end', function() {
      // This event occurs when timeout ends, means that a track is not downloaded
      // successfully, but ignored. This is always due to internet cut.
      if(!hasErrors) {
        finished();
      }
    })
    .pipe(writeStream);
  }

  donwloadQueuedAction() {
    const self = this;
    if(isDownloading) {

    }else {
      self.downloadNext();
      isDownloading = true;
    }
  }

  downloadFinishedAction() {
    const self = this;
    self.shiftQueue();
    if(_.isEmpty(queue)) {
      isDownloading = false;
    } else {
      self.downloadNext();
    }
  }

}

import EventEmitter from 'events';
class DownloadEmitter extends EventEmitter {}
