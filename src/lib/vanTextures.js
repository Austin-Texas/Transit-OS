import * as THREE from "three";

// High-resolution material maps for the van model: oak cabinetry, upholstery,
// vinyl plank flooring, headliner felt and the painted body. They are served
// from the app's public media storage with an open CORS policy, so the canvas
// textures can be used without tainting the WebGL context.
const BASE = "https://media.base44.com/images/public/6afa3d27af32e7eb7d4b7f76";

export const VAN_TEXTURES = {
  oak: `${BASE}/8c1a98ad9_generated_image.png`,
  fabric: `${BASE}/2f26d94eb_generated_image.png`,
  floor: `${BASE}/748d18a97_generated_image.png`,
  headliner: `${BASE}/881b43107_generated_image.png`,
  paint: `${BASE}/79f975616_generated_image.png`,
};

const loader = new THREE.TextureLoader();
loader.setCrossOrigin("anonymous");

// Resolves with whatever loaded. A map that fails is simply left out, so the
// stage keeps its wireframe look instead of breaking.
export function loadVanTextures(renderer) {
  const anisotropy = Math.max(1, Math.min(8, renderer?.capabilities?.getMaxAnisotropy?.() ?? 1));
  return Promise.all(
    Object.entries(VAN_TEXTURES).map(([key, url]) =>
      loader
        .loadAsync(url)
        .then((texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.anisotropy = anisotropy;
          return [key, texture];
        })
        .catch(() => [key, null])
    )
  ).then((entries) => Object.fromEntries(entries.filter(([, texture]) => texture)));
}