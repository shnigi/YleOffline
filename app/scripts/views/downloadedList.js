import * as _ from 'lodash';

/**
 * View for viewing downloaded videos.
 */
export default class DownloadedList {
  /**
   * Default constructor for setting the values
   *
   * @param {HTMLElement} element - The HTML element to bind/adopt
   * @param {Array<Object>} [mediaItems=null] - The array containing media items
   */
  constructor(element, mediaItems = null) {
    this.element = element;
    this.mediaItems = mediaItems;
  }

  /**
   * Render page.
   */
  render() {
    this.element.innerHTML = _.map(this.mediaItems, (media) => {
      return `<a href="#downloaded/${media.getId()}"><div class="mdc-card">
            <i class="material-icons">play arrow</i>
            <h5 class="image-title">${media.getTitle()}</h1>
          </div></a>`;
    }).join('');
   // this.mediaItems.forEach((media) => {
   //     this.element.innerHTML += `
   //       <a href="#downloaded/${media.getId()}"><div class="mdc-card">
   //         <i class="material-icons">play arrow</i>
   //         <h5 class="image-title">${media.getTitle()}</h1>
   //       </div></a>
   //     `;
   // });
  }
}