
#include <fog_pars_vertex>
varying vec3 v_normal;

void main() {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  v_normal = normal;
}