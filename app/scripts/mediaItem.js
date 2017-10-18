/**
 * Model class for videos that can be downloaded for offline use
 */
export default class ChannelGuide {
    /**
     * Constructor
     * @param {JSON} json - json object that contains properties that this object has
     */
    constructor(json) {
        this.json = json;
    }

    getId() {
        return this.json.id;
    }

    getMediaId() {
        return this.json.publicationEvent
        .map((e) => {
          if (!e.media || !e.media.available) {
            return null;
          }

          return e.media.id;
        })
        .find((id) => id !== null);
    }

    getTitle() {
        return this.json.itemTitle.fi || this.json.itemTitle.sv;
    }

    getImageUrl() {
        if (!this.json.partOfSeries) {
          return 'images/no-image.jpg';
        }
        if (!this.json.partOfSeries.coverImage && !this.json.partOfSeries.image) {
          return 'images/no-image.jpg';
        }
        const itemId = this.json.partOfSeries.coverImage.id ||
            this.json.partOfSeries.image.id;
        return `http://images.cdn.yle.fi/image/upload/${itemId}.jpg`;
    }
}
