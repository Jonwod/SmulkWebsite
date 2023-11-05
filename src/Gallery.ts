import * as BABYLON from '@babylonjs/core';
import "@babylonjs/loaders/glTF";   // This is required to load glTF files (it has side effects)

function makePictureMaterial(texture: BABYLON.Texture) {
    let material: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("material", texture.getScene());
    // material.diffuseColor = BABYLON.Color3.Black();
    // material.specularColor = BABYLON.Color3.Black();
    material.emissiveColor = BABYLON.Color3.White();
    material.diffuseTexture = texture;
    return material;
}



class Gallery{
    private galleryBuilding: BABYLON.AbstractMesh = null;
    private interiorMeshes: BABYLON.AbstractMesh[] = [];
    private pillarMeshes: BABYLON.AbstractMesh[] = [];

    public getInteriorMeshes(): BABYLON.AbstractMesh[] {
        return this.interiorMeshes;
    }

    public getPillarMeshes(): BABYLON.AbstractMesh[] {
        return this.pillarMeshes;
    }

    constructor(scene:BABYLON.Scene, result: BABYLON.ISceneLoaderAsyncResult) {

        // Invert y on textures
        let photoTextures= [
            new BABYLON.Texture("assets/photos/jacc/jacc_A1.jpg", scene, false, false),
            new BABYLON.Texture("assets/photos/jacc/jacc_A2.jpg", scene, false, false),
            new BABYLON.Texture("assets/photos/jacc/jacc_R1.jpg", scene, false, false),
            new BABYLON.Texture("assets/photos/jacc/jacc_R2.jpg", scene, false, false),
            new BABYLON.Texture("assets/photos/jacc/jacc_J1.jpg", scene, false, false),
            new BABYLON.Texture("assets/photos/jacc/jacc_J2.jpg", scene, false, false),
            new BABYLON.Texture("assets/photos/jacc/jacc_wide1.jpg", scene, false, false),
        ];

        let galleryPalletMaterial = new BABYLON.StandardMaterial("material", scene);
        galleryPalletMaterial.diffuseTexture = new BABYLON.Texture("assets/ColorPallet.png", scene, false, false);
        galleryPalletMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        let redMaterial = new BABYLON.StandardMaterial("red", scene);
        redMaterial.diffuseColor = BABYLON.Color3.Red();

        let blackWhiteTexture = new BABYLON.Texture("assets/black_white.png", scene)

        let tempWallMaterial = new BABYLON.StandardMaterial("material", scene);
        tempWallMaterial.diffuseColor = BABYLON.Color3.White();
        tempWallMaterial.specularColor = BABYLON.Color3.Black();

        let whiteMarbleMaterial = new BABYLON.StandardMaterial("material", scene);
        whiteMarbleMaterial.diffuseColor = BABYLON.Color3.White();

        // Default material to pallet
        for(let i = 0; i < result.meshes.length; ++i) {
            result.meshes[i].material = galleryPalletMaterial;
        }

        for(let i = 0; i < result.meshes.length; ++i) {
            let mesh = result.meshes[i];
            let instancedMesh = <BABYLON.InstancedMesh>mesh;
            if(mesh.name.startsWith("PictureFrame")) {
                if(mesh.getClassName() == "InstancedMesh") {
                    // Convert instanced mesh to regular mesh
                    const newMesh = instancedMesh.sourceMesh.clone(mesh.name, mesh.parent);
                    newMesh.position = mesh.position.clone();
                    newMesh.rotation = mesh.rotation.clone(); // Make sure this is not rotationQuaternion instead
                    newMesh.scaling = mesh.scaling.clone();
                    newMesh.parent = mesh.parent;
                    mesh.dispose();
                    mesh = newMesh;

                    if(mesh.name.endsWith("primitive0")) {   // primitive0 is the frame
                        let frameMaterial = new BABYLON.StandardMaterial("material", mesh.getScene());
                        frameMaterial.diffuseTexture = blackWhiteTexture;
                        frameMaterial.diffuseColor = BABYLON.Color3.White();
                        frameMaterial.specularColor = BABYLON.Color3.Black();
                        mesh.material = frameMaterial;
                    }
                    else if(mesh.name.endsWith("primitive1")) { // primitive1 is the picture
                        let material;
                        if(mesh.name.startsWith("PictureFrame.002")) {
                            material = makePictureMaterial(photoTextures[4]);
                        } else if(mesh.name.startsWith("PictureFrame.003")) {
                            material = makePictureMaterial(photoTextures[1]);
                        } else if(mesh.name.startsWith("PictureFrame.004")) {
                            material = makePictureMaterial(photoTextures[2]);
                        } else if(mesh.name.startsWith("PictureFrame.006")) {
                            material = makePictureMaterial(photoTextures[3]);
                        } else if(mesh.name.startsWith("PictureFrame.007")) {
                            material = makePictureMaterial(photoTextures[5]);
                        }
                        mesh.material = material;
                    }
                }
                else
                {
                    console.log(mesh.name);
                    // This is a non-instanced mesh
                    if(mesh.name.endsWith("primitive0")) {   // primitive0 is the frame
                        let frameMaterial = new BABYLON.StandardMaterial("material", mesh.getScene());
                        frameMaterial.diffuseTexture = blackWhiteTexture;
                        frameMaterial.diffuseColor = BABYLON.Color3.White();
                        frameMaterial.specularColor = BABYLON.Color3.Black();
                        mesh.material = frameMaterial;
                    }
                    else if(mesh.name.endsWith("primitive1")) { // primitive1 is the picture
                        let photoTexture=  photoTextures[mesh.name.startsWith("PictureFrameWide") ? 6 : 0];
                        mesh.material =  makePictureMaterial(photoTexture);
                    }
                }
                this.interiorMeshes.push(mesh);
            }
            else if(mesh.name == "GalleryBuilding") {
                mesh.checkCollisions = false;
                this.galleryBuilding = mesh;
                mesh.material = whiteMarbleMaterial;
            }
            else if(mesh.name == "GalleryBuilding_Collision") {
                mesh.checkCollisions = true;
                mesh.isVisible = false;
            }
            else if(mesh.name.startsWith("OuterWall")) {
                mesh.material = galleryPalletMaterial;
            }
            else if(mesh.name.startsWith("TempWalls")) {
                mesh.material = tempWallMaterial;
            }
            else if(mesh.name.startsWith("Pillar")) {
                mesh.material = galleryPalletMaterial;
                this.pillarMeshes.push(mesh);
            }
            else {
                mesh.checkCollisions = true;

                // meshes.interiorMeshes.push(mesh);
            }
        }

        // Create spotlight
        let pointLight = new BABYLON.PointLight("galleryInteriorLight1", new BABYLON.Vector3(8, 3, 0), scene);
        pointLight.intensity = 0.8;
    }
}


export async function loadGalleryBuilding(scene: BABYLON.Scene): Promise<Gallery> {
    let result: BABYLON.ISceneLoaderAsyncResult = await BABYLON.SceneLoader.ImportMeshAsync("", "assets/", "ArtGallery.glb");
    return new Gallery(scene, result);
}
