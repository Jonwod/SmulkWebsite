import {InteractableBehavior} from "./interactableBehavior";
import * as BABYLON from '@babylonjs/core';
import {FirstPersonWalker} from "../firstPersonWalker";



export class SeatBehavior extends InteractableBehavior {
    private _isSatIn: boolean = false;

    interact(interactor: any): void {
        const player = <FirstPersonWalker>interactor;

        const framerate = 30;
        const duration = 2;
        const sitLocation = this.getMesh().position.add(new BABYLON.Vector3(0, 1.5, 0));
        const sitRotation = this.getMesh().rotation;
        const cameraPosAnim = new BABYLON.Animation("SitAnim", "position", framerate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        const posKeys = [];
        posKeys.push({
            frame: 0,
            value: player.camera.position
        });
        posKeys.push({
            frame: duration * framerate,
            value: sitLocation
        });
        cameraPosAnim.setKeys(posKeys);
        // interactor.camera.animations.push(cameraPosAnim);

        const cameraRotAnim = new BABYLON.Animation("SitAnim", "rotation", framerate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        const rotKeys = [];
        rotKeys.push({
            frame: 0,
            value: player.camera.rotation
        });
        rotKeys.push({
            frame: duration * framerate,
            value: sitRotation
        });

        cameraRotAnim.setKeys(rotKeys);

        interactor.enterSitMode();
        this._isSatIn = true;
        const that = this;
        interactor.camera.getScene().beginDirectAnimation(player.camera, [cameraPosAnim, cameraRotAnim],0, duration * framerate, false, 1, () => {
            interactor.camera.animations.pop();
            interactor.camera.position = sitLocation;
            interactor.camera.rotation = sitRotation;
            interactor.camera.attachControl(player.camera.getScene().getEngine().getRenderingCanvas(), true);
        });
    }

    public isInteractable(): boolean {
        return !this._isSatIn;
    }
}
