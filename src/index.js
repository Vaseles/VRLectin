import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";
import { VRButton } from "./VRButton.js";
// import abi from "./abi/metaverse.json" assert {type: "json"};

//Event
window.addEventListener("resize", onWindowResize);

//
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xA47E3B);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//Control
const controls = new OrbitControls(camera, renderer.domElement);

//VR
const vrButton = VRButton.createButton(renderer);
document.body.appendChild(vrButton);
renderer.xr.enabled = true;

//Light
const ambientLight = new THREE.AmbientLight(0xbda355);
const directionalLight = new THREE.DirectionalLight(0xffffff);
ambientLight.add(directionalLight);
scene.add(ambientLight);

const textureLoader = new THREE.TextureLoader();

//Ground
const groundTexture = textureLoader.load("src/textures/plitka.jpg");
groundTexture.repeat.set(1000, 1000);
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.encoding = THREE.sRGBEncoding;
const groundGeometry = new THREE.PlaneGeometry(16000, 16000);
const groundMaterial = new THREE.MeshPhongMaterial({map: groundTexture});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.rotateX(-Math.PI/2);
scene.add(groundMesh);

//Box
const boxTexture = textureLoader.load("src/textures/list.jpg");
const boxGeometry = new THREE.BoxGeometry(30, 30, 5);
const boxMaterial = new THREE.MeshPhongMaterial({map: boxTexture});
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.translateY(15).translateZ(-15).translateX(10).rotateY(-10)
scene.add(boxMesh);

camera.translateZ(30).translateY(4);

const cupTexture = textureLoader.load("src/textures/pot.jpg");
const cupGeometry = new THREE.BoxGeometry(6, 6, 6);
const cupMaterial = new THREE.MeshPhongMaterial({map: cupTexture});
const cupMesh = new THREE.Mesh(cupGeometry, cupMaterial);
cupMesh.translateY(3).translateZ(-10).translateX(-10).rotateY(5)
scene.add(cupMesh);

const treeTexture = textureLoader.load("src/textures/leaves.jpg");
const treeGeometry = new THREE.CylinderBufferGeometry(5, 5, 5,5);
const treeMaterial = new THREE.MeshPhongMaterial({map: treeTexture});
const treeMesh = new THREE.Mesh(treeGeometry, treeMaterial);
treeMesh.translateY(14).translateZ(-10).translateX(-10).rotateY(5)
scene.add(treeMesh);

const stickTexture = textureLoader.load("src/textures/bark.jpg");
const stickGeometry = new THREE.BoxGeometry(1, 10, 1);
const stickMaterial = new THREE.MeshPhongMaterial({map: stickTexture});
const stickMesh = new THREE.Mesh(stickGeometry, stickMaterial);
stickMesh.translateY(10).translateZ(-10).translateX(-10).rotateY(5)
scene.add(stickMesh);

function animate() {

    nfts.forEach((nft) => {
        // nft.rotateX(0.005);
        // nft.rotateY(0.01);
    });

    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// const web3 = new Web3(Web3.givenProvider || "wss://rinkeby.infura.io/ws/v3/1fabcf12b3e24d3d9fb2c2cf8dd9ebcd");


const nfts = [];
let items;

if (Web3.givenProvider == null) {    
    items = await contract.methods.items().call();
    console.log(items);
} else {
    const accounts = await web3.eth.requestAccounts();
    console.log(accounts[0]);
    items = await contract.methods.owners().call({from: accounts[0]});
}

items.forEach((item) => {
    let geometry;

    switch (item.itemType) {
        case "1": //Box
            geometry = new THREE.BoxGeometry(item.width, item.height, item.depth);
            break;
        case "2": //Cone
            geometry = new THREE.ConeGeometry(item.radius, item.height, item.radialSegments);
            break;
        case "3": //Cylinder
            geometry = new THREE.CylinderGeometry(item.radius, item.radiusBottom, item.height, item.radialSegments);
            break;
    }

    const texture = textureLoader.load("src/textures/" + item.texture);
    const material = new THREE.MeshPhongMaterial({map: texture});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.translateX(item.x).translateY(item.y).translateZ(item.z);
    nfts.push(mesh);
    scene.add(mesh);
});