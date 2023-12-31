import * as BABYLON from '@babylonjs/core';
import {InteractableBehavior} from "./behaviors/interactableBehavior";
import {isTouchScreenDevice} from "./lib/platform";

export class FirstPersonWalker {
    camera: BABYLON.FreeCamera;
    // mesh: BABYLON.Mesh;
    mouseRotateRate: number = 0.003;
    height: number = 1.8;
    private _forwardInput: number;
    private _rightInput: number;
    private _tickObserver;
    private _capsuleHeight: number = 1.4;

    constructor(canvas: HTMLCanvasElement, scene: BABYLON.Scene, location: BABYLON.Vector3) {
        if(isTouchScreenDevice()) {
            this.camera = new BABYLON.VirtualJoysticksCamera("playerCamera", location, scene);
        } else {
            this.camera = new BABYLON.UniversalCamera("playerCamera", location, scene);
        }
        // Add WASD controls to the camera
        this.camera.keysUp = this.camera.keysUp.concat([87]); // W
        this.camera.keysDown = this.camera.keysDown.concat([83]); // S
        this.camera.keysLeft = this.camera.keysLeft.concat([65]); // A
        this.camera.keysRight = this.camera.keysRight.concat([68]); //

        // set fov
        this.camera.fov = 1.2;
        this.camera.attachControl(canvas, true);
        let that = this;

        this.camera.setTarget(new BABYLON.Vector3(0, 1, 1));
        // document.addEventListener('mousemove', (e) => {that._mouseMoveHandler(e)}, false);
        this.camera.applyGravity = false;
        this.camera.ellipsoid = new BABYLON.Vector3(0.5, this._capsuleHeight / 2.0, 0.5);
        this.camera.checkCollisions = true;

        this.camera.minZ = 0.01;

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


    // ~~~~~~~~~~~ Interactions ~~~~~~~~~~~
    private _interactionRange: number = 3;
    private _hoveredInteractable: InteractableBehavior = null;

    private _vy: number = 0;

    private _update() {
        let dt = this.camera.getScene().deltaTime;
        if(typeof dt == 'undefined') {  // It's undefined on the first frame...
            return;
        }
        dt =  dt / 1000.0

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

        let floor = this._raycastFloor();
        const maxAllowableDip = this.height - this._capsuleHeight;
        if(floor != null) {
            this._vy = 0;
            const targetY = floor.y + this.height;
            let yDiff = targetY - this.camera.position.y;
            if(yDiff > 0) {
                if(yDiff > maxAllowableDip) {
                    this.camera.position.y = floor.y + this.height - maxAllowableDip;
                    yDiff = maxAllowableDip;
                }
            } else {

            }
            const ySpeed = 2;
            this.camera.position.y += Math.sign(yDiff) * Math.min(Math.abs(yDiff), ySpeed * dt);
        }
        else {
            this._vy += dt * -9.8;
            this.camera.position.y += this._vy * dt;
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

    private _raycastFloor(): BABYLON.Vector3 {
        const start = this.camera.position.clone();
        const ray = new BABYLON.Ray(start, new BABYLON.Vector3(0, -1, 0), 100);
        let predicate = function(mesh) {
            return mesh.checkCollisions && mesh.isEnabled;
        }
        const result = this.camera.getScene().pickWithRay(ray, predicate);
        if(result.hit) {
            return result.pickedPoint;
        } else {
            return null;
        }
    }
}