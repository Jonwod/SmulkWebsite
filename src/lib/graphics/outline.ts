import * as BABYLON from '@babylonjs/core';


let highlightLayer: BABYLON.HighlightLayer = null;


export async function addOutline(mesh: BABYLON.Mesh) {
    const scene = mesh.getScene();
    if(highlightLayer == null) {
        highlightLayer = new BABYLON.HighlightLayer("outline", scene, {isStroke: true, mainTextureFixedSize: 2048});
    }

    highlightLayer.addMesh(mesh, BABYLON.Color3.Black());
    highlightLayer.blurHorizontalSize = 0.25;
    highlightLayer.blurVerticalSize = 0.25;

    //
    // let outlineMat = new BABYLON.StandardMaterial("blackOutline", mesh.getScene());
    // outlineMat.diffuseColor = BABYLON.Color3.Black();

    // let nodeMaterial = await BABYLON.NodeMaterial.ParseFromFileAsync("basicToonShader", "src/lib/graphics/flatBlackMaterial.json", mesh.getScene());
    // // nodeMaterial.sideOrientation = BABYLON.Material.CounterClockWiseSideOrientation;
    // nodeMaterial.cullBackFaces = false;
    //
    // let m2 = mesh.clone();
    // m2.checkCollisions = false;
    // m2.parent = mesh;
    // m2.material = nodeMaterial;
    // m2.position = BABYLON.Vector3.Zero();
    //
    // // get bounding box
    // let boundingInfo = mesh.getBoundingInfo();
    //
    // m2.scaling.x *= 1.1;
    // m2.scaling.y *= 1.1;
    // m2.scaling.z *= 1.1;
}