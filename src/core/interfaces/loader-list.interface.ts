import { AudioLoader, CubeTextureLoader, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

export interface LoaderList {
  cube: CubeTextureLoader;
  gltf: GLTFLoader;
  texture: TextureLoader;
  audio: AudioLoader;
  rgbe: RGBELoader;
}
