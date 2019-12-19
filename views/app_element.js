//@ts-check
import {Activity} from '../logic/activity.js';
import {DataStore} from '../logic/local_datastore.js';
import {css, html, LitElement} from '../third_party/lit-element/lit-element.js';
import {ActivityEditorElement} from './activity_editor_element.js';
import {ActivityListElement} from './activity_list_element.js';

export class SelfAppElement extends LitElement {
  constructor() {
    super();
    /** @type {DataStore} */
    //@ts-ignore
    this.data = window.data;
    /** @private {Activity} */
    this.selectedActivity_ = null;
    this.activities_ = this.data.activities;

    this.initializeActivities_();
  }

  // These properties are automatically observed for changes.
  static get properties() {
    return {
      data: {type: Object},
      selectedActivity_: {type: Object},
      activities_: {type: Array}
    };
  }

  static get styles() {
    return css``;
  }

  createActivity_() {
    this.selectedActivity_ = new Activity();
  }

  initializeActivities_() {
    for (const activity of this.data.activities) {
      activity.maybeReactivate();
    }
    this.data.activities.sort(Activity.compare);
    this.data.saveToLocalStorage();
  }

  refreshActivities_() {
    // We must reassign |activities_| in order for the change to be picked up by
    // LitElement. Also consider using shouldInvalidate().
    this.activities_ = [...this.data.activities];
  }

  saveActivity_() {
    this.data.addOrUpdateActivity(this.selectedActivity_);
    this.refreshActivities_();
    this.selectedActivity_ = null;
  }

  /** @param {string} activityId */
  selectActivity_(activityId) {
    this.selectedActivity_ = this.activities_.find(a => a.id == activityId);
  }

  /** @param {DataStore} data */
  setData_(data) {
    this.data = data;
    this.data.saveToLocalStorage();
    this.refreshActivities_();
  }

  /** @param {string} activityId @param {boolean} addEntry */
  toggleEntryForToday_(activityId, addEntry) {
    const activity = this.activities_.find(a => a.id == activityId);
    if (!activity) {
      return;
    }
    if (addEntry) {
      activity.addEntryForToday();
    } else {
      activity.removeEntryForToday();
    }
    this.data.addOrUpdateActivity(activity);
    this.refreshActivities_();
  }

  render() {
    return html`
      <link rel="stylesheet" href="third_party/milligram.css">
      <activity-list
          ?hidden=${!!this.selectedActivity_}
          .activities=${this.activities_}
          .checkboxCallback=${this.toggleEntryForToday_.bind(this)}
          .selectionCallback=${this.selectActivity_.bind(this)}>
      </activity-list>
      <activity-editor
          ?hidden=${!this.selectedActivity_}
          .activity=${this.selectedActivity_}
          .cancelCallback=${this.selectActivity_.bind(this, null)}
          .saveAndExitCallback=${this.saveActivity_.bind(this)}>
      </activity-editor>
      <button
          @click=${this.createActivity_.bind(this)}
          ?hidden=${!!this.selectedActivity_}>
        Add
      </button>
      <data-loader
          .data=${this.data}
          .uploadCallback=${this.setData_.bind(this)}>
      </data-loader>
    `;
  }
}
customElements.define('self-app', SelfAppElement);
