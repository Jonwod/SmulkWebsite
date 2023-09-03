import * as BABYLON from '@babylonjs/core';
import {InteractableBehavior} from "./behaviors/interactableBehavior";

export class FirstPersonWalker {
    camera: BABYLON.FreeCamera;
    // mesh: BABYLON.Mesh;
    mouseRotateRate: number = 0.003;
    private _forwardInput: number;
    private _rightInput: number;
    private _tickObserver;

    constructor(canvas: HTMLCanvasElement, scene: BABYLON.Scene, location: BABYLON.Vector3) {
        this.camera = new BABYLON.UniversalCamera("camera1", location, scene);
        this.camera.attachControl(canvas, true);
        let that = this;

        this.camera.setTarget(new BABYLON.Vector3(0, 1, 1));
        // document.addEventListener('mousemove', (e) => {that._mouseMoveHandler(e)}, false);
        this.camera.applyGravity = true;
        this.camera.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);
        this.camera.checkCollisions = true;

        this.camera.minZ = 0.01;

        // Add WASD controls to the camera
        this.camera.keysUp = this.camera.keysUp.concat([87]); // W
        this.camera.keysDown = this.camera.keysDown.concat([83]); // S
        this.camera.keysLeft = this.camera.keysLeft.concat([65]); // A
        this.camera.keysRight = this.camera.keysRight.concat([68]); // D

        this.camera.speed = 0.1;

        this._tickObserver = scene.onBeforeRenderObservable.add(() => {that._update()});

        scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    that._interact(pointerInfo);
                    break;
            }
        });
    }


    private _enableMovement() {
        this.camera.speed = 0.1;
    }

    private _disableMovement() {
            this.camera.speed = 0;
    }


    movementInput(input: BABYLON.Vector3) {

    }


    // private _lastMousePosition: {x: number, y: number} = {x: NaN, y: NaN};

    // private _mouseMoveHandler(event: MouseEvent) {
    //     // The problem is that this doesn't work in callback
    //     if(event.buttons >= 0) {
    //         if(!isNaN(this._lastMousePosition.x)) {
    //             const dx = event.clientX - this._lastMousePosition.x;
    //             this.camera.rotation.y += dx * this.mouseRotateRate;
    //         }
    //         if(!isNaN(this._lastMousePosition.y)) {
    //             const dy = event.clientY - this._lastMousePosition.y;
    //             // this.camera.rotation.
    //             // this.pitch += dy * this.mouseRotateRate;
    //         }
    //
    //         this._lastMousePosition = {x: event.clientX, y: event.clientY};
    //
    //     } else {
    //         this._lastMousePosition = {x: NaN, y: NaN};
    //     }
    // }

    // ~~~~~~~~~~~ Interactions ~~~~~~~~~~~
    private _interactionRange: number = 3;
    private _hoveredInteractable: InteractableBehavior = null;

    private _update() {
        let result = this.camera.getScene().pickWithRay(this.camera.getForwardRay(this._interactionRange));
        if(result.hit && result.distance < this._interactionRange) {
            const interaction = <InteractableBehavior>result.pickedMesh.getBehaviorByName('interactableBehavior');
            if(interaction != this._hoveredInteractable) {
                if(this._hoveredInteractable) {
                    this._hoveredInteractable.hideInteractionDisplayName();
                }

                if(interaction && interaction.isInteractable()) {
                    this._hoveredInteractable = interaction;
                    if (this._hoveredInteractable) {
                        this._hoveredInteractable.showInteractionDisplayName();
                    }
                }
            }
        }
        else {
            if(this._hoveredInteractable) {
                this._hoveredInteractable.hideInteractionDisplayName();
                this._hoveredInteractable = null;
            }
        }
    }


    public enterSitMode() {
        this.camera.checkCollisions = false;
        this.camera.applyGravity = false;
        this._disableMovement();
    }


    private _interact(evt: BABYLON.PointerInfo) {
        if(this._hoveredInteractable) {
            this._hoveredInteractable.interact(this);
            this._hoveredInteractable.hideInteractionDisplayName();
            this._hoveredInteractable = null;
        }
    }


}