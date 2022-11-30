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
    u_bottomColor: { value: new THREE.Color(0.350513, 0.123577, 0.061322) },
    u_lightDirection: { value: new THREE.Vector3(0.0, 1.0, 0.0) },
  },
});

const customTreeMaterial = new THREE.ShaderMaterial({
  vertexShader: rockVertexShader,
  fragmentShader: rockFragmentShader,
  uniforms: {
    ...THREE.UniformsUtils.merge([THREE.UniformsLib['fog']]),
    u_topColor: { value: new THREE.Color(0.820976, 0.545676, 0.487842) },
    u_bottomColor: { value: new THREE.Color(0.100513, 0.043577, 0.000322) },
    u_lightDirection: { value: new THREE.Vector3(0.0, 1.0, 0.0) },
  },
});

customRockMaterial.fog = true;
customTreeMaterial.fog = true;

const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0xa04b27,
  metalness: 0,
  roughness: 1,
});

const createGround = () => {
  const geometry = new THREE.PlaneGeometry(200, 400);
  const mesh = new THREE.Mesh(geometry, groundMaterial);
  mesh.receiveShadow = true;
  mesh.rotateX(-Math.PI / 2);
  mesh.position.y = -1;
  mesh.position.z = -100;
  return mesh;
};

const assignRockBGMaterial = (grp: THREE.Object3D<THREE.Event>) => {
  grp.children.forEach((c: THREE.Object3D<THREE.Event>) => {
    if (c.name.includes('Ground')) {
      grp.remove(c);
      (c as any).geometry.dispose();
      (c as any).material.dispose();
      (c as any) = undefined;
      return;
    } else if (c.name.includes('Circle')) {
      (c as any).material = customTreeMaterial;
    } else {
      (c as any).material = customRockMaterial;
    }
    assignRockBGMaterial(c);
  });
};

export class Background {
  public bgPool: Array<THREE.Group> = [];
  public ground = createGround();

  constructor(public model: THREE.Group) {
    const bgCopy = model.clone(true);
    this.bgPool = [model, bgCopy];
    this.setup();
  }

  public init(core: Core) {
    core.add(...this.bgPool, this.ground);
  }

  public setup() {
    this.bgPool[0].position.y -= 1;
    this.bgPool[0].position.z = 0;
    assignRockBGMaterial(this.bgPool[0]);

    this.bgPool[1].position.y -= 1;
    this.bgPool[1].position.z = -200;
    assignRockBGMaterial(this.bgPool[1]);
  }

  public reset() {
    this.bgPool[0].position.y = -1;
    this.bgPool[0].position.z = 0;

    this.bgPool[1].position.y = -1;
    this.bgPool[1].position.z = -200;
  }

  public update(deltaT: number, paused = false) {
    if (paused) return;
    const bg1 = this.bgPool[0];
    const bg2 = this.bgPool[1];
    bg1.position.z += 0.25;
    if (bg1.position.z > 110) {
      bg1.position.z = -290;
    }

    bg2.position.z += 0.25;
    if (bg2.position.z > 110) {
      bg2.position.z = -290;
    }
  }
}
