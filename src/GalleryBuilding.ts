import * as BABYLON from '@babylonjs/core';
import "@babylonjs/loaders/glTF";   // This is required to load glTF files (it has side effects)


export async function loadGalleryBuilding(scene: BABYLON.Scene) {
    let result = await BABYLON.SceneLoader.ImportMeshAsync("", "assets/exports/", "ArtGallery.glb");
    let root = result.meshes[0];

    return root;
}