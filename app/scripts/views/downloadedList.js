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
            <span class="lTitle">${episode.title}</span>`;
        if (episode.duration !== ' ') {
          html += `<span class="lDur">Kesto ${episode.duration} min</span>`;
        }
         html += `</span>
          <span class="lRight">
          <a href="#delete/${episode.id}"><i class="material-icons media-control-buttons arial-label="Stream">delete_forever</i></a>`;
            if (episode.downloaded)
              html += `<a href="#localStream/${episode.id}"><i class="material-icons media-control-buttons" arial-label="Stream">play_circle_filled</i></a>`;
            else
              html += `<img src="../../images/loading.gif" class="loadingIcon" />`;            
          html += `</span>
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
