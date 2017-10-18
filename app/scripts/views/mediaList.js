/**
 * View for listing media that can be streamed or downloaded. Frontpage
 */
export default class MediaList {
  /**
   * Default constructor for setting the values
   *
   * @param {HTMLElement} element - The HTML element to bind/adopt
   * @param {Array<Object>} [mediaItems=null] - The array containing media items
   */
  constructor(element, mediaItems = null) {
    this.element = element;
    this.mediaItems = mediaItems;
    // this.supportsPUSH = false;
  }

  render() {
    this.element.innerHTML = '';
    this.mediaItems.forEach((media) => {
        this.element.innerHTML += `
          <a href="#details/${media.getId()}">
            <div class="mdc-card card-image">
              <h1 class="image-title">${media.getTitle()}</h1>
              <img src="${media.getImageUrl()}" class="program-image"
                onerror="this.onerror=null;this.src='images/no-image.jpg';">
            </div>
          </a>
        `;
    });

    // Attach the scroller - this is done after templating to permit the right behaviour
    // const tabBarScroller =
    //  new MDCTabBarScroller(document.querySelector('.mdc-tab-bar-scroller'));
  }
}
