import * as THREE from 'three';
import './styles/main.css';
import { Core } from './core/Core';
import { Rock } from './scene/entities/Rock';
import { Car } from './scene/entities/Car';
import { Background } from './scene/environment/Background';
import { lights } from './scene/environment/lights';
import { PauseScreen } from './ui/pause-screen';
import { TravelDistance } from './ui/travel-distance';
import { StartScreen } from './ui/start-screen';
import { GameOverScreen } from './ui/game-over-screen';
import { EntityPool } from './scene/entities/EntityPool';
import { Luggage } from './scene/entities/Luggage';
import { LuggageCount } from './ui/luggage-display';

const publicPath = process?.env?.PUBLIC_PATH || '/';

const state = {
  core: new Core(),
  velocity: 0,
  lives: 3,
  distance: 0,
  points: 0,
  started: false,
  running: false,
  gameOver: false,
};

const extractItems = (
  grp: THREE.Object3D<THREE.Event>,
): Array<THREE.Object3D<THREE.Event>> => {
  return grp.children
    .map((c: THREE.Object3D<THREE.Event>) => {
      if (c.children.length) {
        return [c, ...c.children.map(extractItems)];
      }
      return [c];
    })
    .flatMap((x) => x)
    .flatMap((x) => x)
    .filter((c) => {
      return c.position.x > -10 && c.position.x < 10;
    });
};

// Main function
const main = async () => {
  // Setup Globals
  const mainFog = new THREE.Fog(0x541d28, 1, 45);
  state.core.setFog(mainFog);
  state.core.setBackgroundColor(new THREE.Color(0x541d28));

  // Get Models
  const carModel = await state.core.loader.loadGltf(
    'flying-car',
    `${publicPath}models/flying-car.glb`,
  );
  const rockModel = await state.core.loader.loadGltf('rock', 'models/rock.glb');
  const environmentModel = await state.core.loader.loadGltf(
    'background',
    `${publicPath}models/background.glb`,
  );
  const suitcase1Model = await state.core.loader.loadGltf(
    'suitcase1',
    `${publicPath}models/suitcase1.glb`,
  );
  const suitcase2Model = await state.core.loader.loadGltf(
    'suitcase2',
    `${publicPath}models/suitcase2.glb`,
  );

  const suitcase1 = suitcase1Model.scene.children[0];
  suitcase1Model.scene.children[0].children.forEach((c) => {
    c.castShadow = true;
  });
  const suitcase2 = suitcase2Model.scene.children[0];
  suitcase2.castShadow = true;
  suitcase1.position.y = 1;
  suitcase2.position.y = 1;

  // Create UI
  const startScreen = new StartScreen();
  const pauseScreen = new PauseScreen();
  const travelDistance = new TravelDistance();
  const gameOverScreen = new GameOverScreen();
  const luggageCount = new LuggageCount();

  // startScreen.activate();
  gameOverScreen.activate(123, 14);

  // Create Objects and initialize them

  // Rock Pool
  let rockIndex = 0;
  const rockPool = new EntityPool(
    Rock,
    () => [rockModel.scene.children[0], rockIndex++],
    15,
  );

  state.core.add(...rockPool.meshes);

  // Luggage Pool
  let luggageIndex = 0;
  const luggagePool = new EntityPool(
    Luggage,
    () => [luggageIndex % 2 === 0 ? suitcase1 : suitcase2, luggageIndex++],
    10,
  );

  state.core.add(...luggagePool.meshes);

  // Player
  const player = new Car(carModel);
  player.init(state.core);
  player.playAnimations();

  // Background
  const bg = new Background(environmentModel.scene);
  bg.init(state.core);

  // Lights
  const sceneLights = lights(state.core, false);
  state.core.add(...sceneLights);

  // List of hittable objects
  const hittables = [
    ...rockPool.meshes,
    ...extractItems(bg.bgPool[0]),
    ...extractItems(bg.bgPool[1]),
  ];

  // Set up bindings
  state.core.bindings.bindKey('Escape', () => {
    if (!state.started || state.gameOver) return;
    state.running = !state.running;
    if (state.running) {
      pauseScreen.deactivate();
      state.core.controls.startPlayerMode();
    } else {
      pauseScreen.activate();
      state.core.controls.startOrbitMode();
    }
  });
  state.core.bindings.bindKey(' ', () => {
    if (state.started === false) {
      state.started = true;
      state.running = true;
      travelDistance.activate();
      luggageCount.activate();
      state.core.controls.startPlayerMode();
      startScreen.deactivate();
      gameOverScreen.deactivate();
    }
    if (state.started && state.gameOver) {
      state.points = 0;
      state.distance = 0;
      state.lives = 3;
      rockPool.forEach((r) => r.reset());
      luggagePool.forEach((l) => l.reset());
      player.reset();
      bg.reset();
      state.core.controls.startPlayerMode();
      state.gameOver = false;
      state.running = true;
      gameOverScreen.deactivate();
      travelDistance.activate();
      luggageCount.activate();
    }
  });
  player.setupBindings(state.core.bindings);

  // Game Loop
  state.core.loop((deltaT: number) => {
    const playerPos = player.model.position;
    state.core.controls.update(playerPos);

    if (!state.gameOver) {
      player.update(deltaT, !state.running);
      luggagePool.forEach((l) => l.update(deltaT, !state.running));
      rockPool.forEach((r) => r.update(deltaT, !state.running));
      bg.update(deltaT, !state.running);
    }

    if (state.running) {
      state.distance += 0.25;
      travelDistance.updateDistance(Math.round(state.distance));
      luggageCount.updateCount(state.points);

      const luggageIntersects = player.checkCollisions(luggagePool.meshes);
      if (luggageIntersects.length > 0) {
        state.points += 1;
      }
      luggageIntersects.forEach((i) => {
        luggagePool.entities
          .find((l) => {
            const same = l.model.id === i.object.id;
            const parent = l.model.id === i.object.parent?.id;
            return same || parent;
          })
          ?.reset();
      });

      const intersects = player.checkCollisions(hittables);
      if (intersects.length) {
        state.gameOver = true;
        state.running = false;
        gameOverScreen.activate(state.distance, state.points);
        luggageCount.deactivate();
        travelDistance.deactivate();
      }
    }
  });
};

main();
