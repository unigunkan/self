//@ts-check
//@ts-ignore
import * as Util from '../logic/util.js';
import {css, html, LitElement} from '../third_party/lit-element/lit-element.js';

export class ActivityDatePickerElement extends LitElement {
  constructor() {
    super();
    /** @type {Date?} */
    this.date;
    this.callback = date => {};
  }

  static get properties() {
    return {date: {type: Object}};
  }

  dateChanged_(e) {
    this.callback(Util.getMidnightFromString(e.target.value));
  }

  render() {
    return html`
      <input type="date"
             value=${this.date ? Util.getDateString(this.date) : ''}
             @input=${this.dateChanged_} />
    `;
  }
}
customElements.define('activity-date-picker', ActivityDatePickerElement);
