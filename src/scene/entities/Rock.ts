import * as THREE from 'three';
import { Core } from '../../core/Core';

import rockVertexShader from './../../shaders/rocks/vertex.glsl';
import rockFragmentShader from './../../shaders/rocks/fragment.glsl';

const customRockMaterial = new THREE.ShaderMaterial({
  vertexShader: rockVertexShader,
  fragmentShader: rockFragmentShader,
  uniforms: {
    ...THREE.UniformsUtils.merge([THREE.UniformsLib['fog']]),
    u_topColor: { value: new THREE.Color(0.820976, 0.545676, 0.487842) },
    u_bottomColor: { value: new THREE.Color(0.250513, 0.003577, 0.051322) },
    u_lightDirection: { value: new THREE.Vector3(0.0, 1.0, 0.0) },
  },
});
customRockMaterial.fog = true;

const rockMaterial = new THREE.MeshStandardMaterial({
  color: 0x000000,
});
const rockGeometry = new THREE.BoxGeometry(2, 3, 2, 3, 3, 3);

export class Rock {
  public model: THREE.Object3D<THREE.Event>;

  constructor(model?: THREE.Object3D<THREE.Event>, private index = 0) {
    if (model) {
      this.model = model.clone(true);
      this.model.children.forEach((c) => {
        (c as any).material = customRockMaterial;
      });
      (this.model as any).material = customRockMaterial;
      this.model.scale.x = 1;
      this.model.scale.y = 1;
      this.model.scale.z = 1;
      this.model.position.y = -1;
    } else {
      this.model = new THREE.Mesh(rockGeometry, rockMaterial);
      this.model.scale.y = 1;
      this.model.scale.z = 1;
      this.model.scale.z = 1;
    }
    this.model.castShadow = true;
    this.generatePosition();
  }

  public init(core: Core) {
    core.add(this.model);
  }

  public update(deltaT: number, paused = false) {
    if (paused) return;
    this.model.position.z += 0.25;

    if (this.model.position.z > 10) {
      this.generatePosition();
    }
  }

  public reset() {
    this.generatePosition();
  }

  private generatePosition() {
    this.model.position.z = (Math.random() * 10 + (65 + 10 * this.index)) * -1;
    this.model.position.x = Math.random() * 14 - 7;
    this.model.rotateY(Math.random() * 2 * Math.PI);
  }
}
