//@ts-check
import {ActivityState} from '../logic/activity.js';
import {css, html, LitElement} from '../third_party/lit-element/lit-element.js';

export class ActivityStatePickerElement extends LitElement {
  constructor() {
    super();
    /** @type {ActivityState} */
    this.state = ActivityState.ACTIVE;
    this.callback = state => {};
  }

  static get properties() {
    return {state: {type: Object}};
  }

  stateChanged_(e) {
    console.log('state changed to ' + e.target.value);
    this.callback(ActivityState.fromString(e.target.value));
  }

  render() {
    return html`
      <select name="state" @change="${this.stateChanged_}">
        <option value="active"
            ?selected=${this.state == ActivityState.ACTIVE}>
          Active
        </option>
        <option value="high priority"
            ?selected=${this.state == ActivityState.HIGH_PRIORITY}>
          High priority
        </option>
        <option value="snoozed"
            ?selected=${this.state == ActivityState.SNOOZED}>
          Snoozed
        </option>
        <option value="completed"
            ?selected=${this.state == ActivityState.COMPLETED}>
          Completed
        </option>
      </select>
    `;
  }
}
customElements.define('activity-state-picker', ActivityStatePickerElement);
