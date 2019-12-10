//@ts-check
//@ts-ignore
import {Checkbox} from 'https://unpkg.com/@material/mwc-checkbox@0.11.1/mwc-checkbox.js?module';
//@ts-ignore
import {css, html, LitElement} from 'https://unpkg.com/lit-element@2.2.1/lit-element.js?module';

import {Activity, ActivityState} from '../logic/activity.js';

export class ActivityListElement extends LitElement {
  constructor() {
    super();
    /** @type {Activity[]} */
    this.activities = [];
    this.checkboxCallback = (id, addEntry) => {};
    this.selectionCallback = id => {};
  }

  // These properties are automatically observed for changes.
  static get properties() {
    return {activities: {type: Array}};
  }

  static get styles() {
    return css`
      .disabled {
        color: grey;
      }

      li {
        padding: 15px;
      }
    `;
  }

  onCheckboxClicked_(id, event) {
    this.checkboxCallback(id, !event.currentTarget.checked);
    event.stopPropagation();
  }

  /** @param {Activity} activity */
  createActivityListItem_(activity) {
    return html`
      <li @click=${() => this.selectionCallback(activity.id)}
          .activity=${activity}
          class="${activity.state == ActivityState.ACTIVE ? '' : 'disabled'}">
        <mwc-checkbox @click=${e => this.onCheckboxClicked_(activity.id, e)}
            .checked=${activity.hasEntryForToday()}>
        </mwc-checkbox>
        ${activity.name}
      </li>
    `;
  }

  render() {
    return html`
      ${this.activities.map(a => this.createActivityListItem_(a))}
    `;
  }
}
customElements.define('activity-list', ActivityListElement);
