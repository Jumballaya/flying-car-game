const html = `
<div class="luggage-count-container">
  <h2>🧳 <span id="luggage">0</span>
</div>
`;

export class LuggageCount {
  public activate() {
    const old = document.body.querySelector('.luggage-count-container');
    if (old) old.remove();
    document.body.appendChild(this.markup());
  }

  public deactivate() {
    const old = document.body.querySelector('.luggage-count-container');
    if (old) old.remove();
  }

  public updateCount(count: number) {
    const el = document.body.querySelector('#luggage');
    if (el) {
      el.innerHTML = count.toString();
    }
  }

  private markup() {
    const parser = new DOMParser();
    return parser
      .parseFromString(html, 'text/html')
      .querySelector('.luggage-count-container') as HTMLDivElement;
  }
}
