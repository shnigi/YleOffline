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
        <video id="player" autoplay controls>
          <source src="${this.url}" type="video/mp4">
          Video ei toimi tällä laitteella
        </video> 
        `;
        const player = document.getElementById('player');
        console.log(player);
        if (player.webkitRequestFullscreen)
          player.webkitRequestFullscreen();
        else
          console.log('cant fullscreen');
        player.play();
        //screen.orientation.lock('landscape');
    }
}
