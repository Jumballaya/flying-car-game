const html = (distance: number, luggage: number) => `
<div class="game-over-container">
  <h1>Game Over</h1>
  <h2>You traveled ${distance} yards</h2>
  <h2>And picked up ${luggage} ${
  luggage === 1 ? 'piece' : 'pieces'
} of luggage</h2>
  <h3>Press [Space] to try again</h3>
</div>
`;

export class GameOverScreen {
  public activate(distance: number, luggage: number) {
    const old = document.body.querySelector('.game-over-container');
    if (old) old.remove();
    document.body.appendChild(this.markup(distance, luggage));
  }

  public deactivate() {
    const old = document.body.querySelector('.game-over-container');
    if (old) old.remove();
  }

  private markup(distance: number, luggage: number) {
    const parser = new DOMParser();
    return parser
      .parseFromString(html(distance, luggage), 'text/html')
      .querySelector('.game-over-container') as HTMLDivElement;
  }
}
