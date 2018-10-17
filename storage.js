const _ = require('lodash');
const fs = require('fs');

const memory = [];

let id = 0;


class Storage {
    constructor() {
      this.storageFile = null;
      this.entries = this.storageFile;

      this.initStorage();
    }

    initStorage() {
      this.storageFile = fs.readFileSync(__dirname + '/memory.txt', {flag: 'a+'});
      this.entries = JSON.parse(this.storageFile.toString());
    }

    writeDataToFile() {
      const data = JSON.stringify(this.entries);
      fs.writeFileSync(__dirname + '/memory.txt', data);
    }

    create(entryData) {
      const item = {
        id: id,
        ...entryData,
      }
      this.entries.push(item);
      id++;

      this.writeDataToFile();
      return entryData;
    }

    read(id) {
      if(id) {
        return this.entries.find( entry => parseInt(entry.id) === parseInt(id));
      }
      return this.entries;
    }

    update(id, data) {
      const dataToBeUpdated = this.entries.find( entry => parseInt(entry.id) === parseInt(id));
      const indexOfEntry = this.entries.indexOf(dataToBeUpdated);
      const updatedData = {
        ...dataToBeUpdated,
        ...data,
      };

      this.entries[indexOfEntry] = updatedData;
      this.writeDataToFile();
      return updatedData;
    }

    delete(id) {
      _.remove(this.entries, (value, index) => {
        return value.id === parseInt(id);
      });
      this.writeDataToFile();
      return this.entries;
    }
}

module.exports = Storage;
