import * as THREE from "./three.module.js"
import { OrbitControls } from './OrbitControls.js';
import { GLTFLoader } from "./GLTFLoader.js"
import { VRButton } from './VRButton.js';



//console.log(navigator.xr);
//checkForXRSupport();
function checkForXRSupport() {
    // Check to see if there is an XR device available that supports immersive VR
    // presentation (for example: displaying in a headset). If the device has that
    // capability the page will want to add an "Enter VR" button to the page (similar to
    // a "Fullscreen" button) that starts the display of immersive VR content.
    navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        if (supported) {
            var enterXrBtn = document.createElement("button");
            enterXrBtn.innerHTML = "Enter VR";
            enterXrBtn.addEventListener("click", beginXRSession);
            document.body.appendChild(enterXrBtn);
        } else {
            console.log("Session not supported: ");
        }
    });
}



let scene, renderer, fov, aspect, near, far, camera, light, loader, controls, geometry, texture, material, plane
function init() {
    //scene set up
    scene = new THREE.Scene();

    //camera set up
    fov = 100;
    aspect = window.innerWidth / window.innerHeight;
    near = 0.1;
    far = 5000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 50);


    //light set up bro
    light = new THREE.AmbientLight(0x404040, 10);
    scene.add(light);


    //renderer set up
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //vr button
    document.body.appendChild(VRButton.createButton(renderer));
    renderer.xr.enabled = true;
    // Load a glTF resource
    loader = new GLTFLoader();
    loader.load(
        // resource URL
        './test1.glb',
        // called when the resource is loaded
        function (gltf) {
            gltf.scene.position.set(0, 0, 0)
            gltf.scene.scale.set(5, 5, 5)
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

    //Add BDC photo
    geometry = new THREE.PlaneGeometry(20, 20, 20);
    texture = new THREE.TextureLoader().load('./image.png')
    material = new THREE.MeshBasicMaterial({ map: texture });
    plane = new THREE.Mesh(geometry, material);
    plane.position.set(10, 10, 0)
    scene.add(plane)

    //orbit controls
    controls = new OrbitControls(camera, renderer.domElement);



}




function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
}
window.addEventListener('resize', onWindowResize, false)
init()
var animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};
animate()

renderer.setAnimationLoop(function () {

    renderer.render(scene, camera);

});