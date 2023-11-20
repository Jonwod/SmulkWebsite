import * as BABYLON from '@babylonjs/core';

export async function loadTownCenter(scene: BABYLON.Scene) {
    let result: BABYLON.ISceneLoaderAsyncResult = await BABYLON.SceneLoader.ImportMeshAsync("", "assets/", "TownCenter.glb");
    return new TownCenter(scene, result);
}

/**
 * Notes on the tree materials:
 * The leaves material uses the alpha channel of the albedo texture to determine transparency
 * (useAlphaFromAlbedoTexture = true)
 */


class TownCenter {
    private trees: BABYLON.AbstractMesh[] = [];

    constructor(scene: BABYLON.Scene, result: BABYLON.ISceneLoaderAsyncResult) {
        this.trees = result.meshes.filter((mesh => mesh.name.startsWith("Tree")));
        let treeLeaves = this.trees.filter(mesh => mesh.name.startsWith("Tree_Leaves"));
        treeLeaves.forEach(mesh => {
            let pbr = mesh.material as BABYLON.PBRMaterial;
            // pbr.albedoColor = BABYLON.Color3.FromHexString("#fd9f4d");
            // // pbr.alpha = 0.5;
            // // pbr.albedoTexture = null;
            // pbr.useAlphaFromAlbedoTexture = false;
            // pbr.alpha = 1;
            // pbr.emissiveColor = BABYLON.Color3.FromHexString("#fd9f4d");

            let stdMat = new BABYLON.StandardMaterial("std", scene);
            stdMat.emissiveColor = BABYLON.Color3.FromHexString("#fd9f4d").scale(0.5);
            stdMat.diffuseColor = BABYLON.Color3.FromHexString("#fd9f4d");
            stdMat.diffuseTexture = pbr.albedoTexture;
            stdMat.useAlphaFromDiffuseTexture = true;
            stdMat.specularColor = BABYLON.Color3.Black();
            // Make double sided
            stdMat.backFaceCulling = false;
            stdMat.twoSidedLighting = true;

            mesh.material = stdMat;
     });

    }
}

