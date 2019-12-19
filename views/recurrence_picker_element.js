//@ts-check
import {Recurrence, RecurrenceType} from '../logic/recurrence.js';
import {css, html, LitElement} from '../third_party/lit-element/lit-element.js';

export class RecurrencePickerElement extends LitElement {
  constructor() {
    super();
    /** @type {RecurrenceType} */
    this.recurrence = RecurrenceType.NEVER;
    this.days = 0;
    this.callback = (recurrence, days) => {};
  }

  static get properties() {
    return {
      recurrence: {type: Object},
      days: {type: Number},
      callback: {type: Object}
    };
  }

  static get styles() {
    return css`
      input, select {
        color: white;
      }
    `;
  }

  recurrenceChanged_(e) {
    this.recurrence = RecurrenceType.fromString(e.target.value);
    this.callback(this.recurrence, this.days);
  }

  daysChanged_(e) {
    this.days = Number(e.target.value);
    this.callback(this.recurrence, this.days);
  }

  render() {
    return html`
      <link rel="stylesheet" href="third_party/milligram.css">
      <select name="recurrence" @change=${this.recurrenceChanged_}>
        <option value="never"
            ?selected=${this.recurrence == RecurrenceType.NEVER}>
          Never repeat
        </option>
        <option value="every day"
            ?selected=${this.recurrence == RecurrenceType.EVERY_DAY}>
          Repeat every day
        </option>
        <option value="cycle"
            ?selected=${this.recurrence == RecurrenceType.CYCLE}>
          Repeat every
        </option>
        <option value="backoff"
            ?selected=${this.recurrence == RecurrenceType.BACKOFF}>
          Backoff by
        </option>
      </select>
      <input type="number" value=${this.days}
          @input=${this.daysChanged_} /> days
    `;
  }
}
customElements.define('recurrence-picker', RecurrencePickerElement);
