import * as BABYLON from '@babylonjs/core';
import {addOutline} from "../lib/graphics/outline";

export async function loadTestMonke(scene) {
    let monke: BABYLON.ISceneLoaderAsyncResult = await BABYLON.SceneLoader.ImportMeshAsync("", "assets/", "monke.glb");
    monke.meshes[0].position.x = 35;
    monke.meshes[0].position.z = -10;
    monke.meshes[0].position.y = 2;

    console.log(monke.meshes.length);

    let nodeMaterial = await BABYLON.NodeMaterial.ParseFromFileAsync("basicToonShader", "assets/node_materials/basicToonShader.json", scene);

    monke.meshes[1].material = nodeMaterial;

    let asMesh = monke.meshes[1] as BABYLON.Mesh;
    addOutline(asMesh);

    return monke.meshes[0];
}