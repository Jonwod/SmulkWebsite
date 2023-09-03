import * as BABYLON from '@babylonjs/core';


export class InteractableBehavior implements BABYLON.Behavior<BABYLON.Mesh> {
    name: string = "interactableBehavior";

    private _text3D;
    private _mesh: BABYLON.Mesh;

    constructor(interactionDisplayName: string, displayNameFont) {
        this._interactionDisplayName = interactionDisplayName;
        this._text3D = BABYLON.MeshBuilder.CreateText(interactionDisplayName + " (3D TEXT)", interactionDisplayName, displayNameFont, {
            size: 0.35,
            resolution: 64,
            depth: 0.1
        });
        this._text3D.isPickable = false;
        this._text3D.isVisible = false;
    }

    private _interactionDisplayName: string;

    public getInteractionDisplayName(): string {
        return this._interactionDisplayName;
    }

    public showInteractionDisplayName(): void {
        this._text3D.isVisible = true;
    }

    public hideInteractionDisplayName(): void {
        this._text3D.isVisible = false;
    }

    public isInteractable(): boolean {
        return true;
    }

    public interact(interactor: any): void {
        console.log("Interacted with " + this._interactionDisplayName);
    }

    public getMesh(): BABYLON.Mesh {
        return this._mesh;
    }

    init(): void {

    }
    attach(target: BABYLON.Mesh): void {
        this._text3D.setParent(target);
        this._text3D.position = target.position.add(new BABYLON.Vector3(0, 0.5, 3));
        this._text3D.rotation = new BABYLON.Vector3(0, Math.PI, 0);
        this._mesh = target;
    }
    detach(): void {

    }
}