class State {
  private edges: Map<string, State> = new Map();

  constructor(public name: string) {}

  public connect(to: State, action: string) {
    this.edges.set(action, to);
  }

  public next(action: string) {
    return this.edges.get(action) || this;
  }
}

export class StateMachine {
  private currentState: State;
  private nodes: Map<string, State> = new Map();

  constructor(initialState: string) {
    this.currentState = new State(initialState);
    this.nodes.set(initialState, this.currentState);
  }

  public addState(name: string) {
    const node = new State(name);
    this.nodes.set(name, node);
  }

  public createAction(from: string, to: string, action: string) {
    const fromNode = this.nodes.get(from);
    const toNode = this.nodes.get(to);
    if (!fromNode || !toNode) {
      throw new Error(
        `State(s) do not exist: "${from}" or "${to}", please make sure these states are already added.`,
      );
    }
    fromNode.connect(toNode, action);
  }

  public getState(): string {
    return this.currentState.name;
  }

  public dispatchAction(action: string): string {
    this.currentState = this.currentState.next(action);
    return this.currentState.name;
  }
}
