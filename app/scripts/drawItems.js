
/**
 * drawItems - description
 *
 * @param  {type} item description
 */
export async function drawItems(item) {
  const programsView = document.getElementById('programs');
  const image = item.image || item.coverImage || undefined;
   if (image !== undefined ) {
      const imageUrl = `http://images.cdn.yle.fi/image/upload/${image.id}.jpg`;
      const itemTitle = item.itemTitle.fi || item.itemTitle.sv;
      programsView.innerHTML += `
      <a href="#${item.id}">
        <div class="mdc-card card-image">
          <h1 class="image-title">${itemTitle}</h1>
          <img src="${imageUrl}" class="program-image"
            onerror="this.onerror=null;this.src='images/no-image.jpg';">
        </div>
      </a>
      `;
    } else {
      const imageUrl = 'images/no-image.jpg';
      const itemTitle = item.itemTitle.fi || item.itemTitle.sv;
      programs.innerHTML += `
      <a href="#${item.id}">
        <div class="mdc-card card-image">
          <h1 class="image-title">${itemTitle}</h1>
          <img src="${imageUrl}" class="program-image"
            onerror="this.onerror=null;this.src='images/no-image.jpg';">
        </div>
      </a>
      `;
    }
};
