//@ts-check
import {Activity, ActivityState} from '../logic/activity.js';
import {css, html, LitElement} from '../third_party/lit-element/lit-element.js';

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
      .checkbox {
        height: 20px;
        margin-right: 10px;
        width: 20px;
      }

      .disabled {
        color: grey;
      }

      li {
        align-items: center;
        display: flex;
        padding: 10px;
      }

      ul {
        list-style-type: none;
        padding: 0;
      }
    `;
  }

  onCheckboxClicked_(id, event) {
    this.checkboxCallback(id, event.currentTarget.checked);
    event.stopPropagation();
  }

  /** @param {Activity} activity */
  createActivityListItem_(activity) {
    return html`
      <li @click=${() => this.selectionCallback(activity.id)}
          .activity=${activity}
          class="${activity.state == ActivityState.ACTIVE ? '' : 'disabled'}">
        <input type="checkbox"
            class="checkbox"
            @click=${e => this.onCheckboxClicked_(activity.id, e)}
            .checked=${activity.hasEntryForToday()} />
        ${activity.name}
      </li>
    `;
  }

  render() {
    return html`
      <ul>
        ${this.activities.map(a => this.createActivityListItem_(a))}
      </ul>
    `;
  }
}
customElements.define('activity-list', ActivityListElement);
