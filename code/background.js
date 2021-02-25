
let camera3D, scene, renderer, cube, cube1, cube2, cube3;
let dir = 0.01;
let mySound, mySound1, mySound2, mySound3;



init3D();

function init3D() {
    scene = new THREE.Scene();
    camera3D = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //CUBES
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    cube.position.x = 0
    scene.add(cube);
    mySound = createSoundObject("viola.mp3");
    cube.add(mySound);

    const material1 = new THREE.MeshBasicMaterial({ color: 0x20fcff });
    cube1 = new THREE.Mesh(geometry, material1);
    cube1.position.x = 50
    cube1.position.z = 50
    scene.add(cube1);
    mySound1 = createSoundObject("cello2.mp3");
    cube1.add(mySound1);

    const material2 = new THREE.MeshBasicMaterial({ color: 0xff2139 });
    cube2 = new THREE.Mesh(geometry, material2);
    cube2.position.x = -50
    cube2.position.z = 50
    scene.add(cube2);
    mySound2 = createSoundObject("harps.mp3");
    cube2.add(mySound2);

    const material3 = new THREE.MeshBasicMaterial({ color: 0xfeff03 });
    cube3 = new THREE.Mesh(geometry, material3);
    cube3.position.x = 0
    cube3.position.z = 100
    scene.add(cube3);
    mySound3 = createSoundObject("cello1.mp3");
    cube3.add(mySound3);

    // BACKGROUND
   let bgGeometery = new THREE.BoxGeometry(1300, 1300, 1300);
   // let bgGeometery = new THREE.CylinderGeometry(725, 725, 1000, 10, 10, true)
    bgGeometery.scale(-1, 1, 1);
    // has to be power of 2 like (4096 x 2048) or(8192x4096).  i think it goes upside down because texture is not right size
    let panotexture = new THREE.TextureLoader().load("armory.jpg");
    // var material = new THREE.MeshBasicMaterial({ map: panotexture, transparent: true,   alphaTest: 0.02,opacity: 0.3});
    let backMaterial = new THREE.MeshBasicMaterial({ map: panotexture });
    let back = new THREE.Mesh(bgGeometery, backMaterial);
    scene.add(back);

    moveCameraWithMouse();

    camera3D.position.z = 50;

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    // cube.scale.x += dir;
    // cube.scale.y += dir;
    // cube.scale.z += dir;
    // if (cube.scale.x > 4 || cube.scale.x < -4) {
    //     dir = -dir;
    // }
    renderer.render(scene, camera3D);
}

function createSoundObject(filename) {
    var audioLoader = new THREE.AudioLoader();
    var listener = new THREE.AudioListener();
    camera3D.add(listener);
    var sound1 = new THREE.PositionalAudio(listener);
    audioLoader.load(filename, function (buffer) {
        sound1.setBuffer(buffer);
        sound1.setRefDistance(100);
        sound1.play();
        console.log("play");
    });
    return sound1;
}







/////MOUSE STUFF

var onMouseDownMouseX = 0, onMouseDownMouseY = 0;
var onPointerDownPointerX = 0, onPointerDownPointerY = 0;
var lon = -90, onMouseDownLon = 0;
var lat = 0, onMouseDownLat = 0;
var isUserInteracting = false;


function moveCameraWithMouse() {
    document.addEventListener('keydown', onDocumentKeyDown, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('wheel', onDocumentMouseWheel, false);
    window.addEventListener('resize', onWindowResize, false);
    camera3D.target = new THREE.Vector3(0, 0, 0);
}

function onDocumentKeyDown(event) {
    if (event.key == "W") {
        direction.z += 1
    }
}

function onDocumentMouseDown(event) {
    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;
    isUserInteracting = true;
}

function onDocumentMouseMove(event) {
    if (isUserInteracting) {
        lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
        lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
        computeCameraOrientation();
    }
}

function onDocumentMouseUp(event) {
    isUserInteracting = false;
}

function onDocumentMouseWheel(event) {
    camera3D.fov += event.deltaY * 0.05;
    camera3D.updateProjectionMatrix();
}

function computeCameraOrientation() {
    lat = Math.max(- 30, Math.min(30, lat));  //restrict movement
    let phi = THREE.Math.degToRad(90 - lat);  //restrict movement
    let theta = THREE.Math.degToRad(lon);
    camera3D.target.x = 100 * Math.sin(phi) * Math.cos(theta);
    camera3D.target.y = 100 * Math.cos(phi);
    camera3D.target.z = 100 * Math.sin(phi) * Math.sin(theta);
    camera3D.lookAt(camera3D.target);
}


function onWindowResize() {
    camera3D.aspect = window.innerWidth / window.innerHeight;
    camera3D.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    console.log('Resized');
}

