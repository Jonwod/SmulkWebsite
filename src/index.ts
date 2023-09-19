import * as BABYLON from '@babylonjs/core';
import {loadLogo} from "./Logo";
import {loadGalleryBuilding} from "./Gallery";
import {FirstPersonWalker} from "./firstPersonWalker";

const BACKGROUND_GREEN = new BABYLON.Color3(0.81, 0.97, 0.68);

const canvas = <HTMLCanvasElement>document.getElementById('application');
const engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});


let createScene = async function () {
    let scene = new BABYLON.Scene(engine);
    scene.clearColor = BACKGROUND_GREEN.toColor4();

    // const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0));
    // camera.attachControl(canvas, true);

    let ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 80, height: 40}, scene);
    let groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.50, 0.5).scale(2);
    ground.material = groundMaterial;

    //
    let directionalLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(0, -0.1, 0.5), scene);
    directionalLight.position.y = 100;
    directionalLight.intensity = 0.8;

    // Add a hemispheric light
    let hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.1;


    // Add a basic cube
    // const box = BABYLON.MeshBuilder.CreateBox("box", {});

    const logo = await loadLogo(scene);
    logo.position.x = 28;
    logo.position.z = 10;
    logo.position.y = 3;

    const galleryMeshes = await loadGalleryBuilding(scene);
    directionalLight.excludedMeshes.push(...galleryMeshes.interiorMeshes);

    const player = new FirstPersonWalker(canvas, scene, new BABYLON.Vector3(0, 2, 4));

    scene.gravity = new BABYLON.Vector3(0, -1.15, 0);
    scene.collisionsEnabled = true;
    ground.checkCollisions = true;

    return scene;
}


createScene().then(scene => {
    engine.runRenderLoop(() => {
        scene.render();
    });
});