/**
 * View for showing video on player
 */

export default class Player {
   /**
   * Default constructor for setting the values
   *
   * @param {HTMLElement} element - The HTML element to bind/adopt
   * @param {String} [url=null] - Video source
   */
    constructor(element, url) {
        this.element = element;
        this.url = url;
    }

    render() {
        this.element.innerHTML = `
        <video autoplay controls>
          <source src="${this.url}" type="video/mp4">
          Video ei toimi tällä laitteella
        </video> 
        `;
        screen.orientation.lock('landscape');
    }
}
