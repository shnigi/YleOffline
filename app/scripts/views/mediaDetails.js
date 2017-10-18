/**
 * View for showing media item's details
 */
export default class MediaDetails {
    /**
     * Default constructor for setting the values
     *
     * @param {HTMLElement} element - The HTML element to bind/adopt
     * @param {JSON} [media=null] - Program details + array of episode details
     */
    constructor(element, media = null) {
      this.element = element;
      this.media = media;
      //this.supportsPUSH = false;
    }

    /**
     * Render page.
     *
     */
    render() {
        let progImage = 'images/no-image.jpg';
        if (this.media.program.image || this.media.program.coverImage) {
          const imageId = this.media.program.image.id ||
                        this.media.program.coverImage.id;
          progImage = `http://images.cdn.yle.fi/image/upload/${imageId}.jpg`;
        }
        const progTitle = this.media.program.title.fi || this.media.program.title.sv;
        const progDescription = this.media.program.description.fi || this.media.program.description.sv || '';
        let html = `
        <div class="mdc-card card-image">
          <h2 class="image-title">${progTitle}</h2>
          <img src="${progImage}" style="width:100%;">
        </div>
        <div class="mdc-list">
          ${progDescription}
        </div>
        <section>
          <ul class="listaus">
          `;
          this.media.episodes.forEach((episode) => {
            html += `
            <li>
              <span class="lLeft">
                <span class="lTitle">${episode.getTitle()}</span>
                <span class="lDur">Kesto ${episode.getDuration()}min</span>
              </span>
              <span class="lRight">
                <a href="#download/${episode.getId()}/${episode.getMediaId()}"><i class="material-icons btnGray" arial-label="Download">file_download</i></a>
                <a href="#stream/{id}"><i class="material-icons btnGreen" arial-label="Stream">play_circle_filled</i></a>
              </span>
            </li>      
            `;
            });
          html += `
            </ul>
          </section>
        `;
        this.element.innerHTML = html;

      // Attach the scroller - this is done after templating to permit the right behaviour
      // const tabBarScroller =
      //  new MDCTabBarScroller(document.querySelector('.mdc-tab-bar-scroller'));
    }
}
