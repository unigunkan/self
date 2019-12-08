//@ts-check

import {Activity} from './activity.js';
import * as Util from './util.js';

export class DataStore {
  constructor() {
    /** @type {Activity[]} */
    this.activities = [];
    /** @type {string[]} */
    this.tags = [];
  }

  static fromLocalStorage() {
    const storageDataStr = window.localStorage.getItem('data');
    if (storageDataStr) {
      return DataStore.fromJson(JSON.parse(storageDataStr));
    }
    return new DataStore();
  }

  /** @param {{activities: object, tags: object}} json */
  static fromJson(json) {
    const data = new DataStore();
    data.activities = json.activities.map(Activity.fromObject);
    data.tags = json.tags;
    return data;
  }

  /** @param {Activity} activity */
  addOrUpdateActivity(activity) {
    const index = this.activities.findIndex(a => a.id == activity.id);
    if (index == -1) {
      this.activities.push(activity);
    } else {
      this.activities[index] = activity;
    }
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    window.localStorage.setItem(
        'data-backup', window.localStorage.getItem('data'));
    window.localStorage.setItem('data', JSON.stringify(this));
  }

  download() {
    const fileName = `self_${Util.getDateString(new Date())}.json`;
    const indentation = 2;
    Util.downloadText(fileName, JSON.stringify(this, null, indentation));
  }
}

//@ts-ignore
window.data = DataStore.fromLocalStorage();
