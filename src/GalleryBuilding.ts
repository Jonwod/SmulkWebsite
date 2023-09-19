import * as BABYLON from '@babylonjs/core';
import "@babylonjs/loaders/glTF";   // This is required to load glTF files (it has side effects)

function makePictureMaterial(texture: BABYLON.Texture) {
    let material = new BABYLON.StandardMaterial("material", texture.getScene());
    // material.diffuseColor = BABYLON.Color3.Black();
    // material.specularColor = BABYLON.Color3.Black();
    material.emissiveColor = BABYLON.Color3.White();
    material.diffuseTexture = texture;
    return material;
}

export async function loadGalleryBuilding(scene: BABYLON.Scene) {
    let result = await BABYLON.SceneLoader.ImportMeshAsync("", "assets/", "ArtGallery.glb");

    let photoTextures= [
        new BABYLON.Texture("assets/photos/jacc/jacc_A1.jpg", scene),
        new BABYLON.Texture("assets/photos/jacc/jacc_A2.jpg", scene),
        new BABYLON.Texture("assets/photos/jacc/jacc_R1.jpg", scene),
        new BABYLON.Texture("assets/photos/jacc/jacc_R2.jpg", scene),
        new BABYLON.Texture("assets/photos/jacc/jacc_J1.jpg", scene),
        new BABYLON.Texture("assets/photos/jacc/jacc_J2.jpg", scene)
    ];

    let blackWhiteTexture = new BABYLON.Texture("assets/black_white.png", scene);

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
                        material = makePictureMaterial(photoTextures[3]);
                    } else if(mesh.name.startsWith("PictureFrame.003")) {
                        material = makePictureMaterial(photoTextures[1]);
                    } else if(mesh.name.startsWith("PictureFrame.004")) {
                        material = makePictureMaterial(photoTextures[2]);
                    } else if(mesh.name.startsWith("PictureFrame.005")) {
                        material = makePictureMaterial(photoTextures[0]);
                    } else if(mesh.name.startsWith("PictureFrame.006")) {
                        material = makePictureMaterial(photoTextures[4]);
                    } else if(mesh.name.startsWith("PictureFrame.007")) {
                        material = makePictureMaterial(photoTextures[5]);
                    }

                    mesh.material = material;
                }
            }
        }
    }
    return result.meshes[0];
}
