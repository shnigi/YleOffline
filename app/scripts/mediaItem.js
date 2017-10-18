/**
 * Model class for videos that can be downloaded for offline use
 */
export default class MediaItem {
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
        return this.json.itemTitle.fi || this.json.itemTitle.sv || this.json.itemTitle.und;
    }

    getImageUrl() {
      if (this.json.partOfSeries) {
        const image = this.json.partOfSeries.coverImage ||
                      this.json.partOfSeries.image;
        return `http://images.cdn.yle.fi/image/upload/${image.id}.jpg`;
      }
      if (this.json.image || this.json.coverImage) {
        const image = this.json.image ||
                      this.json.coverImage;
        return `http://images.cdn.yle.fi/image/upload/${image.id}.jpg`;
      }
      return 'images/no-image.jpg';
    }

    getDescription() {
        return this.json.description.fi || this.json.description.sv;
    }

    getDuration() {
        const durationString = this.json.publicationEvent
        .map((e) => {
          if (!e.media || !e.media.available) {
            return null;
          }

          return e.media.duration;
        })
        .find((dur) => dur !== null);
        let times = durationString.match(/\d+/g);
        times = times.map(parseInt);
        if (durationString.indexOf('H') !== -1) {
            if (durationString.indexOf('M') !== -1) {
                if (durationString.indexOf('S') !== -1) {
                    return times[0] * 60 + times[1] + ((times[2] > 30) ? 1 : 0);
                } else {
                    return times[0] * 60 + times[1];
                }
            } else {
                return times[0] * 60;
            }
        } else {
            if (durationString.indexOf('M') !== -1) {
                if (durationString.indexOf('S') !== -1) {
                    return times[0] + ((times[1] > 30) ? 1 : 0);
                } else {
                    return times[0];
                }
            }
        }
        return null;
    }
}
