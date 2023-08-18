import * as BABYLON from '@babylonjs/core';
import "@babylonjs/loaders/glTF";   // This is required to load glTF files (it has side effects)

export async function loadLogo(scene: BABYLON.Scene) {
    let result = await BABYLON.SceneLoader.ImportMeshAsync("", "../assets/exports/", "SmulkLogo.glb");
    let root = result.meshes[0];

    let blackMaterial = new BABYLON.StandardMaterial("white", scene);
    blackMaterial.diffuseColor = BABYLON.Color3.Black();

    let redMaterial = new BABYLON.StandardMaterial("red", scene);
    redMaterial.diffuseColor = BABYLON.Color3.Red();

    // Load texture from /assets/textures/black_white.png
    let blackWhiteTexture = new BABYLON.Texture("../assets/exports/black_white.png", scene);

    let colors = {
        "S": BABYLON.Color3.FromHexString("#c54365"),
        "M": BABYLON.Color3.FromHexString("#fbaf6c"),
        "U": BABYLON.Color3.FromHexString("#fd9f4d"),
        "L": BABYLON.Color3.FromHexString("#fed8b9"),
        "K": BABYLON.Color3.FromHexString("#eb7e4d"),
    };

    for(let i = 0; i < root.getChildMeshes().length; i++) {
        let letterMaterialStandard = new BABYLON.StandardMaterial("letterMaterialStandard" + i, scene);
        letterMaterialStandard.diffuseColor = BABYLON.Color3.Black();// colors[root.getChildMeshes()[i].name[0]];
        letterMaterialStandard.diffuseTexture = blackWhiteTexture;
        letterMaterialStandard.specularColor = BABYLON.Color3.Black();
        letterMaterialStandard.emissiveColor = colors[root.getChildMeshes()[i].name[0]];
        // letterMaterialStandard.

        let letterMaterialPBR = new BABYLON.PBRMaterial("letterMaterial" + i, scene);
        letterMaterialPBR.metallic = 0;
        letterMaterialPBR.roughness = 0.6;
        letterMaterialPBR.albedoTexture = blackWhiteTexture;
        letterMaterialPBR.albedoColor = colors[root.getChildMeshes()[i].name[0]];
        root.getChildMeshes()[i].material = letterMaterialStandard;
    }

    return root;
}