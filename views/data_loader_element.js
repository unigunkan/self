//@ts-check
//@ts-ignore
import {css, html, LitElement} from 'https://unpkg.com/lit-element?module';
import {DataStore} from '../logic/local_datastore.js';
import * as Util from '../logic/util.js';

export class DataLoaderElement extends LitElement {
  constructor() {
    super();
    /** @type {DataStore} */
    this.data;
    this.uploadCallback = data => {};
  }

  static get styles() {
    return css`
      :host {
        display: block;
        margin: 20px;
      }
    `;
  }

  downloadData() {
    this.data.download();
  }

  async uploadData(event) {
    /** @type {FileList} */
    //@ts-ignore
    const files = event.target.files;
    if (files.length == 0) {
      return;
    }
    const dataJson = await Util.parseJsonFile(files.item(0));
    //@ts-ignore
    this.uploadCallback(DataStore.fromJson(dataJson));
  }

  render() {
    return html`
      <label>
        <input
            type="file"
            id="file-picker"
            style="display: none"
            @change=${this.uploadData} />
        Upload data
      </label>
      <mwc-button @click=${this.downloadData}>Download data</mwc-button>
    `;
  }
}
customElements.define('data-loader', DataLoaderElement);
