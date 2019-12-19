//@ts-check
import {DataStore} from '../logic/local_datastore.js';
import * as Util from '../logic/util.js';
import {css, html, LitElement} from '../third_party/lit-element/lit-element.js';

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
      <link rel="stylesheet" href="third_party/milligram.css">
      <label>
        <input
            type="file"
            id="file-picker"
            style="display: none"
            @change=${this.uploadData} />
        <button>Upload data</button>
      </label>
      <button @click=${this.downloadData}>Download data</button>
    `;
  }
}
customElements.define('data-loader', DataLoaderElement);
