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
          <h1 class="image-title">${this.mediaItem.getTitle()}</h1>
          <img src="${this.mediaItem.getImageUrl()}" style="width:100%;">
        </div>
        <div class="mdc-list">
          ${this.mediaItem.getDescription()}
        </div>
        <ul class="mdc-list mdc-list--two-line mdc-list--avatar-list two-line-avatar-text-icon-demo msgs-list">
          <li class="mdc-list-item ">
              <span class="mdc-list-item__text">
                Jakso
                <span class="mdc-list-item__text__secondary">Kesto 45min</span>
              </span>
              <span class="mdc-list-item__end-detail">
                <a href="#download"><i class="material-icons btnGray" arial-label="Download">file_download</i></a>
                <a href="#stream"><i class="material-icons btnGreen" arial-label="Stream">play_circle_filled</i></a>
              </span>  
          </li>
        </ul>
      `;

      // Attach the scroller - this is done after templating to permit the right behaviour
      // const tabBarScroller =
      //  new MDCTabBarScroller(document.querySelector('.mdc-tab-bar-scroller'));
    }
  }
