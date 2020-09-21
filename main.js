import * as THREE from "./three.module.js"
import { OrbitControls } from './OrbitControls.js';
import { GLTFLoader } from "./GLTFLoader.js"
import { VRButton } from './VRButton.js';

var scene, renderer, fov, aspect, near, far, camera, light, loader, controls, geometry, texture, material, plane
function init() {

    scene = new THREE.Scene();


    renderer = new THREE.WebGLRenderer();

    fov = 100;
    aspect = window.innerWidth / window.innerHeight;  // the canvas default
    near = 0.1;
    far = 5000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    // camera.position.set(0, 10, 200)

    light = new THREE.AmbientLight(0x404040, 10); // soft white light
    scene.add(light);
    loader = new GLTFLoader();
    controls = new OrbitControls(camera, renderer.domElement);


    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.xr.enabled = true;
    camera.position.set(0, 5, 10);

    // Load a glTF resource
    loader.load(
        // resource URL
        './test1.glb',
        // called when the resource is loaded
        function (gltf) {
            gltf.scene.position.set(0, 0, 0)
            scene.add(gltf.scene);



        },
        // called while loading is progressing
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },
        // called when loading has errors
        function (error) {

            console.log('An error happened');

        }
    );

    geometry = new THREE.PlaneGeometry(10, 10, 10);
    texture = new THREE.TextureLoader().load('./image.png')
    material = new THREE.MeshBasicMaterial({ map: texture });
    plane = new THREE.Mesh(geometry, material);
    plane.position.set(10, 5, 0)
    scene.add(plane)

    document.body.appendChild(VRButton.createButton(renderer));

}


function render() {

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}
function animate() {

    renderer.setAnimationLoop(render);

}
requestAnimationFrame(render);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)

}
window.addEventListener("resize", onWindowResize)

init()
render()