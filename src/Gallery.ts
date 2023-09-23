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


interface GalleryBuildingMeshes {
    root: BABYLON.AbstractMesh;
    galleryBuilding: BABYLON.AbstractMesh;
    interiorMeshes: BABYLON.AbstractMesh[];
}

export async function loadGalleryBuilding(scene: BABYLON.Scene):
    Promise<GalleryBuildingMeshes>  {
    let result = await BABYLON.SceneLoader.ImportMeshAsync("", "assets/", "ArtGallery.glb");
    let meshes: GalleryBuildingMeshes = {
        root: result.meshes[0],
        galleryBuilding: null,
        interiorMeshes: []
    }

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


    let blackWhiteTexture = new BABYLON.Texture("assets/black_white.png", scene)

    let tempWallMaterial = new BABYLON.StandardMaterial("material", scene);
    tempWallMaterial.diffuseColor = BABYLON.Color3.White();
    tempWallMaterial.specularColor = BABYLON.Color3.Black();

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
            meshes.interiorMeshes.push(mesh);
        }
        else if(mesh.name == "GalleryBuilding") {
            mesh.checkCollisions = true;
            meshes.galleryBuilding = mesh;
        }
        else {
            mesh.checkCollisions = true;
            mesh.material = tempWallMaterial;
            meshes.interiorMeshes.push(mesh);
        }
    }

    // Create spotlight
    let pointLight = new BABYLON.PointLight("galleryInteriorLight1", new BABYLON.Vector3(8, 3, 0), scene);
    pointLight.intensity = 0.8;

    return meshes;
}
