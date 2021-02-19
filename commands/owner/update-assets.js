const Command = require('../../structures/Command');
const Database = require('../../util/db');
const Storage = require('../../util/storage');
const path = require('path');
const fs = require('fs');
const storage = new Storage();
const db = new Database();

const dirPath = path.join(__dirname, '../../assets/json');

module.exports = class UpdateAssetsComand extends Command {
  constructor(client) {
    super(client, {
      name : 'update-assets',
      aliases : [ 'update-assets', 'update-asts' ],
      group : 'util',
      memberName : 'update-assets',
      description : 'Update DB Asset List.',
      details : 'Only the bot owner(s) may use this command.',
      guarded : true,
      ownerOnly : true,
    });
  }

  run(msg) {
    fs.readdir(dirPath, function(err, files) {
      if (err) {
        this.client.logger.error('Unable to scan directory: ' + err);
      }

      files.forEach(function(file) {
        // Update assets table
        db.createDocument('assets', {
          asset_name : file,
          asset_desc : 'Hello',
          asset_link : 'http://google.com',
        },
                          true);

        // Update storage bucket
        storage.uploadFile(file).then(
            (res) => { this.client.logger.info('Uploaded File'); });
      });
    });
    return msg.say('Reloaded the DB assets table and storage buckets.');
  }
};
