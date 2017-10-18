/**
 * View for showing media item's details
 */
export default class MediaDetails {
    /**
     * Default constructor for setting the values
     *
     * @param {HTMLElement} element - The HTML element to bind/adopt
     * @param {Array<Object>} [mediaItem=null] - Media item to show
     */
    constructor(element, mediaItem = null) {
      this.element = element;
      this.mediaItem = mediaItem;
      // this.supportsPUSH = false;
    }

    render() {
      this.element.innerHTML = `
        <div class="mdc-card card-image">
          <h2 class="image-title">${this.mediaItem.getTitle()}</h2>
          <img src="${this.mediaItem.getImageUrl()}" style="width:100%;">
        </div>
      `;

      // Attach the scroller - this is done after templating to permit the right behaviour
      // const tabBarScroller =
      //  new MDCTabBarScroller(document.querySelector('.mdc-tab-bar-scroller'));
    }
  }
