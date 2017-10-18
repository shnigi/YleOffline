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
    //this.supportsPUSH = false;
  }

  /**
   * Render page.
   *
   * @return {HTMLElement} The rendered element
   */
  render() {
    this.element.innerHTML = '';
    this.mediaItems.forEach((media) => {
        this.element.innerHTML += `
          <a href="#${media.getId()}"><div class="mdc-card card-image">
            <h1 class="image-title">${media.getTitle()}</h1>
            <img src="${media.getImageUrl()}" style="width:100%;">
          </div></a>
        `;
    });

    // Attach the scroller - this is done after templating to permit the right behaviour
    // const tabBarScroller =
    //  new MDCTabBarScroller(document.querySelector('.mdc-tab-bar-scroller'));
  }

}