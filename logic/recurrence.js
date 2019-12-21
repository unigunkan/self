//@ts-check

import * as Util from './util.js';

export class RecurrenceType {
  /** @param {string} name */
  constructor(name) {
    this.name = name;
  }

  /** @param {string} str */
  static fromString(str) {
    for (const value of RecurrenceType.values) {
      if (str == value.name) {
        return value;
      }
    }
    throw `Invalid RecurrenceType: "${name}"`;
  }
}
RecurrenceType.EVERY_DAY = new RecurrenceType('every day');
RecurrenceType.NEVER = new RecurrenceType('never');
RecurrenceType.CYCLE = new RecurrenceType('cycle');
RecurrenceType.BACKOFF = new RecurrenceType('backoff');
RecurrenceType.values = [
  RecurrenceType.EVERY_DAY, RecurrenceType.NEVER, RecurrenceType.CYCLE,
  RecurrenceType.BACKOFF
];

export class Recurrence {
  /** @param {RecurrenceType} type @param {Date?} nextDate */
  constructor(type, nextDate) {
    this.type = type;
    /** @type {Date?} */
    this.nextDate = nextDate;
  }

  /**
   *
   * @param {RecurrenceType} type
   * @param {number=} days
   */
  static create(type, days) {
    switch (type) {
      case RecurrenceType.EVERY_DAY:
        return new EveryDayRecurrence();
      case RecurrenceType.NEVER:
        return new NeverRecurrence();
      case RecurrenceType.CYCLE:
        return new CycleRecurrence(days);
      case RecurrenceType.BACKOFF:
        return new BackoffRecurrence(days);
      default:
        throw 'Invalid recurrence type';
    }
  }

  /** @param {object=} recurrence */
  static fromObject(recurrence) {
    if (!recurrence) {
      return null;
    }
    let nextDate;
    if (recurrence.nextDate) {
      nextDate = new Date(recurrence.nextDate);
    }
    switch (recurrence.type.name) {
      case RecurrenceType.EVERY_DAY.name:
        return new EveryDayRecurrence(nextDate);
      case RecurrenceType.NEVER.name:
        return new NeverRecurrence(nextDate);
      case RecurrenceType.CYCLE.name:
        return new CycleRecurrence(recurrence.daysInCycle, nextDate);
      case RecurrenceType.BACKOFF.name:
        return new BackoffRecurrence(recurrence.daysToBackoff, nextDate);
      default:
        throw 'Invalid recurrence type';
    }
  }

  onEntryAddedForToday() {
    throw new Error('Method not implemented.');
  }

  /** @returns {boolean} */
  shouldReactivateToday() {
    throw new Error('Method not implemented.');
  }

  /**
   * Number of days in cycle (or back-off).
   * @returns {number}
   */
  get days() {
    throw new Error('Method not implemented.');
  }
}

export class EveryDayRecurrence extends Recurrence {
  /** @param {Date?} nextDate */
  constructor(nextDate = null) {
    super(RecurrenceType.EVERY_DAY, nextDate);
  }

  onEntryAddedForToday() {
    this.nextDate = Util.getMidnightInDays(1);
  }

  shouldReactivateToday() {
    return true;
  }

  get days() {
    return 1;
  }
}

export class NeverRecurrence extends Recurrence {
  constructor(nextDate = null) {
    super(RecurrenceType.NEVER, nextDate);
  }

  onEntryAddedForToday() {
    this.nextDate = null;
  }

  shouldReactivateToday() {
    return false;
  }

  get days() {
    return 0;
  }
}

export class CycleRecurrence extends Recurrence {
  /** @param {number} daysInCycle @param {Date?} nextDate */
  constructor(daysInCycle, nextDate = Util.getMidnightToday()) {
    super(RecurrenceType.CYCLE, nextDate);
    this.daysInCycle = daysInCycle;
  }

  onEntryAddedForToday() {
    const today = Util.getMidnightToday();
    while (this.nextDate <= today) {
      this.nextDate.setDate(this.nextDate.getDate() + this.daysInCycle);
    }
  }

  shouldReactivateToday() {
    return this.nextDate <= Util.getMidnightToday();
  }

  get days() {
    return this.daysInCycle;
  }
}

export class BackoffRecurrence extends Recurrence {
  /** @param {number} daysToBackoff  @param {Date?} nextDate  */
  constructor(daysToBackoff, nextDate = Util.getMidnightToday()) {
    super(RecurrenceType.BACKOFF, nextDate);
    this.daysToBackoff = daysToBackoff;
  }

  onEntryAddedForToday() {
    this.nextDate = Util.getMidnightInDays(this.daysToBackoff);
  }

  shouldReactivateToday() {
    return this.nextDate <= Util.getMidnightToday();
  }

  get days() {
    return this.daysToBackoff;
  }
}

// Exposed for debugging.
//@ts-ignore
window.RecurrenceType = RecurrenceType;
//@ts-ignore
window.EveryDayRecurrence = EveryDayRecurrence;
//@ts-ignore
window.NeverRecurrence = NeverRecurrence;
//@ts-ignore
window.CycleRecurrence = CycleRecurrence;
//@ts-ignore
window.BackoffRecurrence = BackoffRecurrence;
