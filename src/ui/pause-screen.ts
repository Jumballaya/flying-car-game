const html = `
<div class="pause-menu-container">
  <h1>Paused</h1>
  <h2>Click [Escape] to unpause</h2>
</div>
`;

export class PauseScreen {
  public activate() {
    const old = document.body.querySelector('.pause-menu-container');
    if (old) old.remove();
    document.body.appendChild(this.markup());
  }

  public deactivate() {
    const old = document.body.querySelector('.pause-menu-container');
    if (old) old.remove();
  }

  private markup() {
    const parser = new DOMParser();
    return parser
      .parseFromString(html, 'text/html')
      .querySelector('.pause-menu-container') as HTMLDivElement;
  }
}
