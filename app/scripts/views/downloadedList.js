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
   *
   * The cards should show the program name, episode number and
   * episode length.
   */
  render() {
    let html = `
    <section>
      <ul class="listaus">
      `;
      this.mediaItems.forEach((episode) => {
        html += `
        <li>
          <span class="lLeft">
            <span class="lTitle">${episode.title}</span>
            <span class="lDur">Kesto ${episode.duration}min ${episode.downloaded}</span>
          </span>
          <span class="lRight">
            
              <i class="material-icons media-control-buttons arial-label="Stream">
                delete_forever
              </i>
              <i class="material-icons media-control-buttons" arial-label="Stream">
                play_circle_filled
              </i>
            
          </span>
        </li>
        <hr>
        `;
        });
      html += `
        </ul>
      </section>
    `;
    this.element.innerHTML = html;
  }
}
