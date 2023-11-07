import * as BABYLON from '@babylonjs/core';
import {loadLogo} from "./Logo";
import {loadGalleryBuilding} from "./Gallery";
import {FirstPersonWalker} from "./firstPersonWalker";

const BACKGROUND_GREEN = new BABYLON.Color3(0.81, 0.97, 0.68);

const canvas = <HTMLCanvasElement>document.getElementById('application');
const engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});

window.addEventListener('resize', function () {
    engine.resize();
});

console.log("Welcome to smulk.band");

let createScene = async function () {
    let scene = new BABYLON.Scene(engine);
    scene.clearColor = BACKGROUND_GREEN.toColor4();
    // const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0));
    // camera.attachControl(canvas, true);

    let ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 80, height: 40}, scene);
    let groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.50, 0.5).scale(2);
    groundMaterial.specularColor = BABYLON.Color3.Black();
    ground.material = groundMaterial;

    //
    let directionalLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-0.5, -0.7, 0.0), scene);
    directionalLight.position.y = 100;
    directionalLight.intensity = 0.8;

    // Add a hemispheric light
    // let hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    // hemiLight.intensity = 0.0;

    let hemiLight2 = new BABYLON.HemisphericLight("hemiLight2", new BABYLON.Vector3(0, -1, 0), scene);
    hemiLight2.intensity = 0.2;

    // Add a basic cube
    // const box = BABYLON.MeshBuilder.CreateBox("box", {});

    const logo = await loadLogo(scene);
    logo.position.x = 35;
    logo.position.z = 0;
    logo.position.y = 3;

    const gallery = await loadGalleryBuilding(scene);
    directionalLight.excludedMeshes.push(...(gallery.getInteriorMeshes()));

    const player = new FirstPersonWalker(canvas, scene, new BABYLON.Vector3(35, 4, -6));
    player.camera.setTarget(logo.position);

    scene.gravity = new BABYLON.Vector3(0, -1.15, 0);
    scene.collisionsEnabled = true;
    ground.checkCollisions = true;

    // ~~~~~~~~~~ Shadows ~~~~~~~~~~~
    const shadowGenerator = new BABYLON.ShadowGenerator(1024, directionalLight);
    shadowGenerator.useBlurCloseExponentialShadowMap = true;
    const pillars = gallery.getPillarMeshes();
    for(let pillar of pillars) {
        shadowGenerator.getShadowMap().renderList.push(pillar);
    }
    ground.receiveShadows = true;
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    return scene;
}

const divFps = document.getElementById("fps");
createScene().then(scene => {
    engine.runRenderLoop(() => {
        scene.render();
        divFps.innerHTML = engine.getFps().toFixed() + " fps";
    });
});