import * as THREE from 'three';
import { Core } from '../../core/Core';

export const lights = (core: Core, helpersOn = false) => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

  const pointLight = new THREE.PointLight(0xffffff, 0.33);
  pointLight.position.x = 10;
  pointLight.position.y = 25;
  pointLight.position.z = 10;
  pointLight.castShadow = true;
  pointLight.intensity = 10;
  pointLight.shadow.mapSize.set(1024, 1024);
  if (helpersOn) {
    const helper1 = new THREE.PointLightHelper(pointLight, 5);
    const camHelper1 = new THREE.CameraHelper(pointLight.shadow.camera);
    core.add(helper1, camHelper1);
  }

  const pointLight2 = new THREE.PointLight(0xffffff, 0.33);
  pointLight2.position.x = -10;
  pointLight2.position.y = 25;
  pointLight2.position.z = -10;
  pointLight2.castShadow = true;
  pointLight2.intensity = 10;
  pointLight2.shadow.mapSize.set(1024, 1024);
  if (helpersOn) {
    const camHelper2 = new THREE.CameraHelper(pointLight2.shadow.camera);
    const helper2 = new THREE.PointLightHelper(pointLight2, 5);
    core.add(helper2, camHelper2);
  }

  const pointLight3 = new THREE.PointLight(0xffffff, 0.33);
  pointLight3.position.x = -10;
  pointLight3.position.y = 25;
  pointLight3.position.z = 10;
  pointLight3.castShadow = true;
  pointLight3.intensity = 10;
  pointLight3.shadow.mapSize.set(1024, 1024);
  if (helpersOn) {
    const camHelper3 = new THREE.CameraHelper(pointLight3.shadow.camera);
    const helper3 = new THREE.PointLightHelper(pointLight3, 5);
    core.add(helper3, camHelper3);
  }

  const pointLight4 = new THREE.PointLight(0xffffff, 0.33);
  pointLight4.position.x = 10;
  pointLight4.position.y = 25;
  pointLight4.position.z = -10;
  pointLight4.castShadow = true;
  pointLight4.intensity = 10;
  pointLight4.shadow.mapSize.set(1024, 1024);
  if (helpersOn) {
    const camHelper4 = new THREE.CameraHelper(pointLight4.shadow.camera);
    const helper4 = new THREE.PointLightHelper(pointLight4, 5);
    core.add(helper4, camHelper4);
  }

  return [ambientLight, pointLight, pointLight2, pointLight3, pointLight4];
};
