/**
 * View for showing media item's details
 */
export default class MediaDetails {
    constructor(element, media = null) {
      this.element = element;
      this.media = media;
      // this.supportsPUSH = false;
    }

    render() {
        let progImage = 'images/no-image.jpg';
        console.log('this', this.media);
        if (this.media.program.image || this.media.program.coverImage) {
          const imageId = this.media.program.image.id ||
                        this.media.program.coverImage.id;
          progImage = `http://images.cdn.yle.fi/image/upload/${imageId}.jpg`;
        }
        const progTitle = this.media.program.title.fi || this.media.program.title.sv;
        const progDescription = this.media.program.description.fi ||
                                this.media.program.description.sv || '';
        let html = `
        <div class="mdc-card card-image">
          <i class="material-icons back-arrow" id="goBack">arrow_back</i>
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
                <a href="#download/${episode.getId()}/${episode.getMediaId()}">
                  <i class="material-icons media-control-buttons" arial-label="Download">
                    file_download
                  </i>
                </a>
                <a href="#">
                  <i class="material-icons media-control-buttons" arial-label="Stream">
                    play_circle_filled
                  </i>
                </a>
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
