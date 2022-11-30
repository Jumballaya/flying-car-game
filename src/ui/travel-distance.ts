const html = `
<div class="travel-distance-container">
  <h2 class="digital">🚙<span id="yards">0</span></h2>
</div>
`;

export class TravelDistance {
  public activate() {
    const old = document.body.querySelector('.travel-distance-container');
    if (old) old.remove();
    document.body.appendChild(this.markup());
  }

  public deactivate() {
    const old = document.body.querySelector('.travel-distance-container');
    if (old) old.remove();
  }

  public updateDistance(distanceInFeet: number) {
    const el = document.body.querySelector('#yards');
    if (el) {
      el.innerHTML = distanceInFeet.toString();
    }
  }

  private markup() {
    const parser = new DOMParser();
    return parser
      .parseFromString(html, 'text/html')
      .querySelector('.travel-distance-container') as HTMLDivElement;
  }
}
