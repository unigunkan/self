//@ts-check

import {NeverRecurrence, Recurrence, RecurrenceType} from './recurrence.js';
import * as Util from './util.js';

/** @param {string?} str @returns {Date?} */
function nullOrDate(str) {
  if (!str) {
    return null;
  }
  return new Date(str);
}

function generateId() {
  return Math.random().toString(36).substr(2);
}

export class ActivityState {
  constructor(name) {
    /** @type {string} */
    this.name = name;
  }

  /** @param {ActivityState} s1 @param {ActivityState} s2 @returns {number} */
  static compare(s1, s2) {
    if (s1 == s2) {
      return 0;
    }
    switch (s1) {
      case ActivityState.HIGH_PRIORITY:
        return -1;
      case ActivityState.ACTIVE:
        switch (s2) {
          case ActivityState.SNOOZED:
          case ActivityState.COMPLETED:
            return -1;
          default:
            return 1;
        }
      case ActivityState.SNOOZED:
        switch (s2) {
          case ActivityState.COMPLETED:
            return -1;
          default:
            return 1;
        }
      case ActivityState.COMPLETED:
        return 1;
    }
  }

  /** @param {{name: string}} obj */
  static fromObject(obj) {
    for (const value of ActivityState.values) {
      if (obj.name == value.name) {
        return value;
      }
    }
    throw `Invalid ActivityState: "${obj.name}"`;
  }

  /** @param {string} str */
  static fromString(str) {
    for (const value of ActivityState.values) {
      if (str == value.name) {
        return value;
      }
    }
    throw `Invalid ActivityState: "${str}"`;
  }

  toString() {
    return this.name;
  }
}
ActivityState.ACTIVE = new ActivityState('active');
ActivityState.HIGH_PRIORITY = new ActivityState('high priority');
// Shown in deactivated state. May be snoozed indefinitely.
ActivityState.SNOOZED = new ActivityState('snoozed');
// Hidden from lists. Shows up when searched for it.
ActivityState.COMPLETED = new ActivityState('completed');
ActivityState.values = [
  ActivityState.ACTIVE, ActivityState.HIGH_PRIORITY, ActivityState.SNOOZED,
  ActivityState.COMPLETED
];

export class Activity {
  constructor(id = generateId()) {
    /** @type {string} */
    this.id = id;
    /** @type {string} */
    this.name = '';
    /** @type {string} */
    this.description = '';
    /** @type {Date[]} Completion dates in order from earliest to latest */
    this.entries = [];
    /** @type {string[]} */
    this.tags = [];
    /** @type {Date?} */
    this.dateCreated = null;
    /** @type {Date?} */
    this.dateCompleted = null;
    /** @type {ActivityState} */
    this.state = ActivityState.ACTIVE;
    /** @type {Recurrence} */
    this.recurrence = new NeverRecurrence();
  }

  /** @param {Activity} a1 @param {Activity} a2 @returns {number} */
  static compare(a1, a2) {
    if (a1.state == ActivityState.ACTIVE && a2.state != ActivityState.ACTIVE) {
      return -1;
    }
    if (a1.state != ActivityState.ACTIVE && a2.state == ActivityState.ACTIVE) {
      return 1;
    }
    if (a1.hasEntryForToday() != a2.hasEntryForToday()) {
      // Give priority to the one with an entry for today.
      return Number(a2.hasEntryForToday()) - Number(a1.hasEntryForToday());
    }
    if (a1.state != a2.state) {
      return ActivityState.compare(a1.state, a2.state);
    }
    const a1Date = a1.getLastEntryOrCreationDate_();
    const a2Date = a2.getLastEntryOrCreationDate_();
    return (a2Date ? a2Date.getTime() : 0) - (a1Date ? a1Date.getTime() : 0);
  }

  /**
   * @param {{id: string,
   *          name: string,
   *          description: string,
   *          entries: string[],
   *          tags: string[],
   *          dateCreated: string,
   *          dateCompleted: string?,
   *          state: object,
   *          recurrence: object}} obj
   */
  static fromObject(obj) {
    const activity = new Activity('placeholder');
    activity.id = obj.id;
    activity.name = obj.name;
    activity.entries = obj.entries.map(e => new Date(e));
    activity.tags = obj.tags;
    activity.dateCreated = nullOrDate(obj.dateCreated);
    activity.dateCompleted = nullOrDate(obj.dateCompleted);
    activity.state = ActivityState.fromObject(obj.state);
    activity.recurrence =
        Recurrence.fromObject(obj.recurrence) || new NeverRecurrence();
    return activity;
  }

  hasEntryForToday() {
    if (this.entries.length == 0) {
      return false;
    }
    return this.entries[this.entries.length - 1].getTime() ==
        Util.getMidnightToday().getTime();
  }

  addEntryForToday() {
    if (!this.hasEntryForToday()) {
      this.entries.push(Util.getMidnightToday());
    }
    this.recurrence.onEntryAddedForToday();
    this.state = ActivityState.SNOOZED;
  }

  removeEntryForToday() {
    if (this.hasEntryForToday()) {
      this.entries.pop();
    }
    this.state = ActivityState.ACTIVE;
  }

  /** Sets state to active depending on the recurrence. */
  maybeReactivate() {
    if (this.state == ActivityState.SNOOZED && !this.hasEntryForToday() &&
        this.recurrence.shouldReactivateToday()) {
      this.state = ActivityState.ACTIVE;
    }
  }

  getLastEntryOrCreationDate_() {
    if (this.entries.length != 0) {
      return this.entries[this.entries.length - 1];
    }
    return this.dateCreated;
  }
}

// Exposed for debugging.
//@ts-ignore
window.ActivityState = ActivityState;
//@ts-ignore
window.Activity = Activity;
