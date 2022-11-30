
varying vec3 v_normal;

uniform vec3 u_topColor;
uniform vec3 u_bottomColor;
uniform vec3 u_lightDirection;

#include <fog_pars_fragment>

void main() {
  // vec3 u_topColor = vec3(0.820976, 0.545676, 0.487842);
  // vec3 u_bottomColor = vec3(0.350513, 0.123577, 0.061322);
  // vec3 u_lightDirection = vec3(0.0, 1.0, 0.0);

  vec3 light = normalize(u_lightDirection);
  float lightFactor = max(0.0, dot(v_normal, light));

  gl_FragColor = vec4(mix(u_bottomColor, u_topColor, lightFactor), 1.0);

  #ifdef USE_FOG
    #ifdef USE_LOGDEPTHBUF_EXT
      float depth = gl_FragDepthEXT / gl_FragCoord.w;
    #else
      float depth = gl_FragCoord.z / gl_FragCoord.w;
    #endif
    float fogFactor = smoothstep(fogNear, fogFar, depth);
    gl_FragColor = vec4(mix(gl_FragColor.rgb, fogColor, fogFactor), 1.0);
  #endif
}