//@ts-check
//@ts-ignore
import {css, html, LitElement} from 'https://unpkg.com/lit-element?module';

export class ActivityDatePickerElement extends LitElement {
  constructor() {
    super();
    /** @type {Date?} */
    this.date = null;
    this.callback = date => {};
  }

  static get properties() {
    return {date: {type: Object}};
  }

  dateChanged_(e) {
    console.log('date changed to ' + e.target.value);
    this.callback(e.target.value);
  }

  render() {
    return html`
      <input type="date" @input=${this.dateChanged_} />
    `;
  }
}
customElements.define('activity-date-picker', ActivityDatePickerElement);
