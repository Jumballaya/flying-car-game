const html = `
<div class="start-menu-container">
  <h1>Start Game</h1>
  <h2>Click [Space] to start</h2>
  <h2>Click [Escape] to pause</h2>
</div>
`;

export class StartScreen {
  public activate() {
    const old = document.body.querySelector('.start-menu-container');
    if (old) old.remove();
    document.body.appendChild(this.markup());
  }

  public deactivate() {
    const old = document.body.querySelector('.start-menu-container');
    if (old) old.remove();
  }

  private markup() {
    const parser = new DOMParser();
    return parser
      .parseFromString(html, 'text/html')
      .querySelector('.start-menu-container') as HTMLDivElement;
  }
}
