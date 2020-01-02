//@ts-check
import {Activity, ActivityState} from '../logic/activity.js';
import {DataStore} from '../logic/local_datastore.js';
import {Recurrence, RecurrenceType} from '../logic/recurrence.js';
import {css, html, LitElement} from '../third_party/lit-element/lit-element.js';

/** @type {DataStore} */
//@ts-ignore
const data = window.data;

export class ActivityEditorElement extends LitElement {
  constructor() {
    super();
    /** @type {Activity?} */
    this.activity;
    this.cancelCallback = () => {};
    this.saveAndExitCallback = () => {};
  }

  // These properties are automatically observed for changes.
  static get properties() {
    return {activity: {type: Object}};
  }

  static get styles() {
    return css`
      .debug-info {
        background-color: black;
        font-family: 'Roboto Mono', Monaco, monospace;
      }

      input {
        color: white;
      }

      mwc-textarea, mwc-textfield {
        --mdc-text-field-fill-color: #111;
        --mdc-text-field-ink-color: white;
        --mdc-text-field-label-ink-color: grey;
        --mdc-theme-primary: white;
        color: white;
      }
    `;
  }

  getRecurrenceType() {
    return this.activity ? this.activity.recurrence.type :
                           RecurrenceType.EVERY_DAY;
  }

  updateName_(e) {
    this.activity.name = e.target.value;
  }

  updateDescription_(e) {
    this.activity.description = e.target.value;
  }

  /** @param {Date} date */
  updateNextDate_(date) {
    this.activity.recurrence.nextDate = date;
  }

  /** @param {ActivityState} state */
  updateState_(state) {
    this.activity.state = state;
  }

  /** @param {RecurrenceType} type @param {number} days */
  updateRecurrence_(type, days) {
    this.activity.recurrence = Recurrence.create(type, days);
  }

  render() {
    return html`
    <div>
      <link rel="stylesheet" href="third_party/milligram.css">
      <input .value=${this.activity ? this.activity.name : ''}
          placeholder="name" type="text" @input=${this.updateName_} />
      <input .value=${this.activity ? this.activity.description : ''}
          placeholder="description" type="text"
          @input=${this.updateDescription_} />
      <recurrence-picker
          .recurrence=${this.activity ? this.activity.recurrence.type : null}
          .days=${this.activity ? this.activity.recurrence.days : 0}
          .callback=${this.updateRecurrence_.bind(this)}>
      </recurrence-picker>
      <activity-state-picker
          .state=${this.activity ? this.activity.state : null}
          .callback=${this.updateState_.bind(this)}>
      </activity-state-picker>
      <div>
        <activity-date-picker
            .date=${this.activity ? this.activity.recurrence.nextDate : null}
            .callback=${this.updateNextDate_.bind(this)}>
        </activity-date-picker>
      </div>
      <button @click=${this.saveAndExitCallback}>Save</button>
      <button @click=${this.cancelCallback}>Cancel</button>
      <pre class="debug-info">${
        this.activity ? JSON.stringify(this.activity, null, 2) : ''}</pre>
    </div>
    `;
  }
}
customElements.define('activity-editor', ActivityEditorElement);
