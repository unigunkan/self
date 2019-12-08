//@ts-check
//@ts-ignore
import {Button} from 'https://unpkg.com/@material/mwc-button?module';
//@ts-ignore
import {TextArea} from 'https://unpkg.com/@material/mwc-textarea?module';
//@ts-ignore
import {TextField} from 'https://unpkg.com/@material/mwc-textfield?module';
//@ts-ignore
import {css, html, LitElement} from 'https://unpkg.com/lit-element?module';

import {Activity, ActivityState} from '../logic/activity.js';
import {DataStore} from '../logic/local_datastore.js';
import {Recurrence, RecurrenceType} from '../logic/recurrence.js';


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
      <mwc-textfield value=${this.activity ? this.activity.name : ''}
          @input=${this.updateName_}
          fullwidth placeholder="name"></mwc-textfield>
      <mwc-textfield value=${this.activity ? this.activity.description : ''}
          @input=${this.updateDescription_} fullwidth placeholder="description">
      </mwc-textfield>
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
      <mwc-button label="Save" @click=${this.saveAndExitCallback}></mwc-button>
      <mwc-button label="Cancel" @click=${this.cancelCallback}></mwc-button>
    `;
  }
}
customElements.define('activity-editor', ActivityEditorElement);
