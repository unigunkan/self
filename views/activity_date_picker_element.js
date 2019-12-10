//@ts-check
//@ts-ignore
import {css, html, LitElement} from 'https://unpkg.com/lit-element@2.2.1/lit-element.js?module';
import * as Util from '../logic/util.js';

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
