import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Core } from '../../core/Core';
import { Bindings } from '../../core/inputs/Bindings';
import { StateMachine } from '../../core/StateMachine';

const flameMaterial = new THREE.MeshStandardMaterial({
  color: 0x721324,
  metalness: 0,
  roughness: 0.5,
  emissive: 0xa50505,
  emissiveIntensity: 15,
});

const assignFlameMaterial = (grp: THREE.Object3D<THREE.Event>) => {
  grp.children.forEach((c: THREE.Object3D<THREE.Event>) => {
    if ((c as THREE.Mesh).isMesh) {
      const mesh = c as THREE.Mesh;
      if (mesh.name.includes('Fire')) {
        mesh.material = flameMaterial;
      }
    }
    assignFlameMaterial(c);
  });
};

const activateShadows = (grp: THREE.Object3D<THREE.Event>) => {
  grp.children.forEach((c: THREE.Object3D<THREE.Event>) => {
    c.castShadow = true;
    activateShadows(c);
  });
};

interface GameState {
  velocity: {
    x: number;
    z: number;
  };
  lives: number;
}

export class Car {
  private gltf: GLTF;

  public mixer: THREE.AnimationMixer;
  public model: THREE.Group;
  public actions: Array<THREE.AnimationAction>;

  private rays: Array<THREE.Raycaster> = [];
  private initialPosition: THREE.Vector3;

  private state: GameState = {
    velocity: {
      x: 0,
      z: 0,
    },
    lives: 3,
  };

  private _state: StateMachine;

  constructor(model: GLTF) {
    this.gltf = model;
    this.model = model.scene;
    this.initialPosition = model.scene.position.clone();
    const { mixer, actions } = this.setupModel();
    this.mixer = mixer;
    this.actions = actions;
    this.setupRays();
    this._state = this.setupStateMachine();
  }

  public init(core: Core) {
    core.add(this.model);
  }

  public playAnimations() {
    this.actions.forEach((a, i) => (i == 1 ? null : a.play()));
  }

  public stopAnimations() {
    this.actions.forEach((a, i) => (i == 1 ? null : a.stop()));
  }

  public reset() {
    this.model.rotation.set(0, 0, 0);
    this.model.position.copy(new THREE.Vector3(0, 1, 2));
  }

  public checkCollisions(
    objects: Array<THREE.Object3D>,
  ): Array<THREE.Intersection<THREE.Object3D<THREE.Event>>> {
    return this.rays
      .map((ray) => {
        const intersects = ray.intersectObjects(objects);
        return intersects;
      })
      .flatMap((x) => x);
  }

  public update(deltaT: number, paused = false) {
    this.mixer.update(deltaT / 1000);
    if (paused) {
      return;
    }
    const stateValue = this._state.getState();

    if (stateValue.includes('left')) {
      this.model.position.x -= 0.2;
      if (this.model.position.x < -7) {
        this.model.position.x = -7;
      }
    }
    if (stateValue.includes('right')) {
      this.model.position.x += 0.2;
      if (this.model.position.x > 7) {
        this.model.position.x = 7;
      }
    }
    if (stateValue.includes('forward')) {
      this.model.position.z -= 0.1;
      if (this.model.position.z < -3) {
        this.model.position.z = -3;
      }
    }
    if (stateValue.includes('backward')) {
      this.model.position.z += 0.1;
      if (this.model.position.z > 3) {
        this.model.position.z = 3;
      }
    }
  }

  private setupModel() {
    this.model.scale.x = 1.25;
    this.model.scale.y = 1.25;
    this.model.scale.z = 1.25;
    this.model.position.y += 1.25;
    const mixer = new THREE.AnimationMixer(this.model);
    const actions = this.gltf.animations.map((a) => mixer.clipAction(a));
    assignFlameMaterial(this.model);
    activateShadows(this.model);
    return { mixer, actions };
  }

  private setupRays() {
    this.rays.push(
      // Front facing ray Left
      new THREE.Raycaster(
        this.model.position,
        new THREE.Vector3(-0.25, 0, -1),
        0,
        2,
      ),
      // Front facing ray Right
      new THREE.Raycaster(
        this.model.position,
        new THREE.Vector3(0.25, 0, -1),
        0,
        2,
      ),
      // Back side Left
      new THREE.Raycaster(
        this.model.position,
        new THREE.Vector3(-0.25, 0, 1),
        0,
        1.5,
      ),
      // Back side Right
      new THREE.Raycaster(
        this.model.position,
        new THREE.Vector3(0.25, 0, 1),
        0,
        1.5,
      ),
    );
  }

  public setupBindings(bindings: Bindings) {
    bindings.bindKey(
      'w',
      () => {
        this._state.dispatchAction('move-forward');
      },
      () => {
        if (this._state.getState() === 'forward') {
          this._state.dispatchAction('stop-accelerating');
        } else if (this._state.getState().includes('forward')) {
          this._state.dispatchAction('stop-accelerating-forward');
        }
      },
    );
    bindings.bindKey(
      'a',
      () => {
        this._state.dispatchAction('move-left');
      },
      () => {
        if (this._state.getState() === 'left') {
          this._state.dispatchAction('stop-accelerating');
        } else if (this._state.getState().includes('left')) {
          this._state.dispatchAction('stop-accelerating-left');
        }
      },
    );
    bindings.bindKey(
      's',
      () => {
        this._state.dispatchAction('move-backward');
      },
      () => {
        if (this._state.getState() === 'backward') {
          this._state.dispatchAction('stop-accelerating');
        } else if (this._state.getState().includes('backward')) {
          this._state.dispatchAction('stop-accelerating-backward');
        }
      },
    );
    bindings.bindKey(
      'd',
      () => {
        this._state.dispatchAction('move-right');
      },
      () => {
        if (this._state.getState() === 'right') {
          this._state.dispatchAction('stop-accelerating');
        } else if (this._state.getState().includes('right')) {
          this._state.dispatchAction('stop-accelerating-right');
        }
      },
    );
  }

  private setupStateMachine(): StateMachine {
    const stateMachine = new StateMachine('idle');
    stateMachine.addState('left');
    stateMachine.addState('right');
    stateMachine.addState('forward');
    stateMachine.addState('backward');

    stateMachine.addState('left-forward');
    stateMachine.addState('left-backward');

    stateMachine.addState('right-forward');
    stateMachine.addState('right-backward');

    stateMachine.createAction('idle', 'left', 'move-left');
    stateMachine.createAction('idle', 'right', 'move-right');
    stateMachine.createAction('idle', 'forward', 'move-forward');
    stateMachine.createAction('idle', 'backward', 'move-backward');

    stateMachine.createAction('left', 'right', 'move-right');
    stateMachine.createAction('right', 'left', 'move-left');
    stateMachine.createAction('forward', 'backward', 'move-backward');
    stateMachine.createAction('backward', 'forward', 'move-forward');

    stateMachine.createAction('left', 'idle', 'stop-accelerating');
    stateMachine.createAction('right', 'idle', 'stop-accelerating');
    stateMachine.createAction('backward', 'idle', 'stop-accelerating');
    stateMachine.createAction('forward', 'idle', 'stop-accelerating');
    stateMachine.createAction('left-forward', 'idle', 'stop-accelerating');
    stateMachine.createAction('left-backward', 'idle', 'stop-accelerating');
    stateMachine.createAction('right-forward', 'idle', 'stop-accelerating');
    stateMachine.createAction('right-backward', 'idle', 'stop-accelerating');

    stateMachine.createAction('left-forward', 'idle', 'stop-accelerating');
    stateMachine.createAction('left-backward', 'idle', 'stop-accelerating');
    stateMachine.createAction('right-forward', 'idle', 'stop-accelerating');
    stateMachine.createAction('right-backward', 'idle', 'stop-accelerating');

    stateMachine.createAction('left', 'left-backward', 'move-backward');
    stateMachine.createAction('left', 'left-forward', 'move-forward');
    stateMachine.createAction('right', 'right-backward', 'move-backward');
    stateMachine.createAction('right', 'right-forward', 'move-forward');

    stateMachine.createAction('backward', 'left-backward', 'move-left');
    stateMachine.createAction('forward', 'left-forward', 'move-left');
    stateMachine.createAction('backward', 'right-backward', 'move-right');
    stateMachine.createAction('forward', 'right-forward', 'move-righ');

    stateMachine.createAction(
      'left-forward',
      'left',
      'stop-accelerating-forward',
    );
    stateMachine.createAction(
      'left-backward',
      'left',
      'stop-accelerating-backward',
    );
    stateMachine.createAction(
      'right-forward',
      'idle',
      'stop-accelerating-forward',
    );
    stateMachine.createAction(
      'right-backward',
      'idle',
      'stop-accelerating-backward',
    );

    stateMachine.createAction(
      'left-forward',
      'forward',
      'stop-accelerating-left',
    );
    stateMachine.createAction(
      'left-backward',
      'backward',
      'stop-accelerating-left',
    );
    stateMachine.createAction(
      'right-forward',
      'forward',
      'stop-accelerating-right',
    );
    stateMachine.createAction(
      'right-backward',
      'backward',
      'stop-accelerating-right',
    );

    return stateMachine;
  }
}
