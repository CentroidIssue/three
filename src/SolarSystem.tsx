import React, { useEffect } from 'react'
import dat from 'dat.gui';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { earthImg, jupiterImg, marsImg, mercuryImg, neptuneImg, plutoImg, saturnImg, starsImg, sunImg, uranusImg, venusImg } from './constant';

export class OrbitClass extends THREE.Object3D {
  orbits: { [key: string]: THREE.Mesh } = {};
  inclination: number = 0;
  speed: number = 0;
  distance: number = 0;

  constructor(name: string) {
    super();
    this.name = name;
  }

  showOrbit() {
    this.hideOrbit();
    this.children.forEach(child => {
      if (child instanceof OrbitClass) {
        child.showOrbit();
        const geometry = new THREE.TorusGeometry(child.position.x, 0.2, 100, 100);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);
        this.orbits[mesh.uuid] = mesh;
        mesh.rotation.x = Math.PI / 2;
      }
    });
  }

  hideOrbit() {
    this.children.forEach(child => {
      if (child instanceof OrbitClass) {
        child.hideOrbit();
      }
      if (this.orbits[child.uuid]) {
        this.remove(child);
      }

    });
    this.orbits = {};
  }

  setDistance(distance: number) {
    this.distance = distance;
    this.position.x = distance;
  }

  setInclination(inclination: number) {
    this.inclination = inclination;
    this.rotation.z = inclination;
  }

  setSpeed(speed: number) {
    this.speed = speed;
  }

  animate(time: number, speed: number = 1, distance: number) {
    for (const key in this.orbits) {
      const oldGeometry = this.orbits[key].geometry as THREE.TorusGeometry;
      const geometry = new THREE.TorusGeometry(oldGeometry.parameters.radius, 0.5 * distance, 100, 100);
      this.orbits[key].geometry = geometry;
    }
    this.children.forEach(child => {
      if (child instanceof OrbitClass) {
        child.animate(time, speed, distance);
      }

      this.rotateY(this.speed * speed);
    });
  }
}


export class SolarSystemClass extends THREE.Object3D {
  constructor() {
    super();
  }
}

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;
let moveSpeedUD = 0;
let moveSpeedLR = 0;
let moveSpeedFB = 0;

const textures: THREE.Texture[] = [];

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const starsTexture = cubeTextureLoader.load([
  starsImg,
  starsImg,
  starsImg,
  starsImg,
  starsImg,
  starsImg,
])

const sunTexture = textureLoader.load(sunImg);
const mercuryTexture = textureLoader.load(mercuryImg);
const venusTexture = textureLoader.load(venusImg);
const earthTexture = textureLoader.load(earthImg);
const marsTexture = textureLoader.load(marsImg);
const jupiterTexture = textureLoader.load(jupiterImg);
const saturnTexture = textureLoader.load(saturnImg);
const uranusTexture = textureLoader.load(uranusImg);
const neptuneTexture = textureLoader.load(neptuneImg);
const plutoTexture = textureLoader.load(plutoImg);
const saturnRingTexture = textureLoader.load(saturnImg);

textures.push(
  sunTexture,
  mercuryTexture,
  venusTexture,
  earthTexture,
  marsTexture,
  jupiterTexture,
  saturnTexture,
  uranusTexture,
  neptuneTexture,
  plutoTexture,
  saturnRingTexture
)

textures.forEach(texture => {
  texture.colorSpace = THREE.SRGBColorSpace;
});

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);

const gui = new dat.GUI();

const options = {
  "showOrbit": () => {
    solarSystem.showOrbit();
  },
  "hideOrbit": () => {
    solarSystem.hideOrbit();
  },
  "speed": 1,
  "speedUp": () => {
    if (options.speed <= 1000000000) 
    options.speed *= 10;
  },
  "speedDown": () => {
    if (options.speed >= 10)
    options.speed /= 10;
  }
}

gui.add(options, "showOrbit");
gui.add(options, "hideOrbit");
gui.add(options, "speed").listen();
gui.add(options, "speedUp");
gui.add(options, "speedDown");

// Sets orbit control to move the camera around
const controls = new PointerLockControls(camera, renderer.domElement);

document.body.addEventListener('click', () => {
  controls.lock();
});

controls.addEventListener('lock', () => {
  console.log('Pointer lock enabled');
});

controls.addEventListener('unlock', () => {
  console.log('Pointer lock disabled');
});

// Camera positioning
camera.position.set(-90, 140, 140);
camera.lookAt(0, 0, 0);

scene.background = starsTexture;

const onKeyDown = (event: KeyboardEvent) => {
  console.log("key down", event.key)
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
      moveForward = true;
      break;
    case 'ArrowDown':
    case 's':
      moveBackward = true;
      break;
    case 'ArrowLeft':
    case 'a':
      moveLeft = true;
      break;
    case 'ArrowRight':
    case 'd':
      moveRight = true;
      break;
    case 'Shift':
      moveDown = true;
      break;
    case ' ':
      moveUp = true;
      break;

  }
};

const onKeyUp = (event: KeyboardEvent) => {
  console.log("Keyup: ", event.key);
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
      moveForward = false;
      break;
    case 'ArrowDown':
    case 's':
      moveBackward = false;
      break;
    case 'ArrowLeft':
    case 'a':
      moveLeft = false;
      break;
    case 'ArrowRight':
    case 'd':
      moveRight = false;
      break;
    case 'Shift':
      moveDown = false;
      break;
    case ' ':
      moveUp = false;
      break;
  }
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);


const animate = (time: number) => {
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  direction.y = 0;

  direction.normalize(); // this ensures consistent movements in all directions
  const direction1 = new THREE.Vector3(-direction.z, 0, direction.x);
  if (moveLeft && moveRight) {
    moveSpeedLR = 0;
  }
  else if (moveRight && moveSpeedLR < 200) {
    moveSpeedLR += 1;
  }
  else if (moveLeft && moveSpeedLR > -100) {
    moveSpeedLR -= 1;
  }
  else if (moveSpeedLR != 0){
    moveSpeedLR = moveSpeedLR < 0 ? moveSpeedLR + 4 : moveSpeedLR - 4;
    if (Math.abs(moveSpeedLR) < 4) {
      moveSpeedLR = 0;
    }
  }

  if (moveForward && moveBackward) {
    moveSpeedFB = 0;
  }
  else if (moveForward && moveSpeedFB < 500) {
    moveSpeedFB += 1;
  }
  else if (moveBackward && moveSpeedFB > -500) {
    moveSpeedFB -= 1;
  }
  else if (moveSpeedFB != 0){
    moveSpeedFB = moveSpeedFB < 0 ? moveSpeedFB + 4 : moveSpeedFB - 4;
    if (Math.abs(moveSpeedFB) < 4) {
      moveSpeedFB = 0;
    }
  }

  if (moveUp && moveDown) {
    moveSpeedUD = 0;
  }
  else if (moveUp && moveSpeedUD < 500) {
    moveSpeedUD += 1
  }
  else if (moveDown && moveSpeedUD > -500) {
    moveSpeedUD -= 1;
  }
  else if (moveSpeedUD != 0){
    moveSpeedUD = moveSpeedUD < 0 ? moveSpeedUD + 4 : moveSpeedUD - 4;
    if (Math.abs(moveSpeedUD) < 4) {
      moveSpeedUD = 0;
    }
  }

  camera.position.y += moveSpeedUD / 20;
  camera.position.x += (moveSpeedFB * direction.x + moveSpeedLR * direction1.x) / 100;
  camera.position.z += (moveSpeedFB * direction.z + moveSpeedLR * direction1.z) / 100;

  solarSystem.animate(time, options.speed, camera.position.distanceTo(solarSystem.position) / 1000);
  renderer.render(scene, camera);
}

const axesHelper = new THREE.AxesHelper(200);
scene.add(axesHelper);

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const ambientLight = new THREE.AmbientLight(0x333333, 10);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1000000, 1200);
pointLight.shadow.mapSize.width = 1920;
pointLight.shadow.mapSize.height = 1920;
pointLight.castShadow = true;
scene.add(pointLight);

const solarSystem = new OrbitClass("Solar System");
scene.add(solarSystem);

const sunGeo = new THREE.SphereGeometry(10, 32, 32);
const sumMat = new THREE.MeshBasicMaterial({ map: sunTexture });
const sunMesh = new THREE.Mesh(sunGeo, sumMat);
const sun = new OrbitClass("Sun");
sun.add(sunMesh);
solarSystem.add(sun);
sun.setInclination(0);
sun.setSpeed(0.01 / 25.05);


const mercuryOrbit = new OrbitClass("Mercury Orbit");
const mercuryGeo = new THREE.SphereGeometry(0.3, 32, 32);
const mercuryMat = new THREE.MeshStandardMaterial({ map: mercuryTexture });
const mercuryMesh = new THREE.Mesh(mercuryGeo, mercuryMat);
const mercury = new OrbitClass("Mercury");
solarSystem.add(mercuryOrbit);
mercuryOrbit.add(mercury);
mercury.add(mercuryMesh);
mercury.setDistance(34);
mercuryOrbit.setSpeed(0.01 / 87.97);
mercury.setSpeed(0.01 / 58.6);
mercury.setInclination(2.04 / 180 * Math.PI);
mercuryOrbit.setInclination(3.38 / 180 * Math.PI);
mercuryMesh.castShadow = true;
mercuryMesh.receiveShadow = true;

const saturnOrbit = new OrbitClass("Saturn Orbit");
const saturnGeo = new THREE.SphereGeometry(9, 32, 32);
const saturnMat = new THREE.MeshStandardMaterial({ map: saturnTexture });
const saturnMesh = new THREE.Mesh(saturnGeo, saturnMat);
const saturn = new OrbitClass("Saturn");
const saturnRingGeo = new THREE.TorusGeometry(13, 1, 32);
const saturnRingMat = new THREE.MeshStandardMaterial({ map: saturnRingTexture, side: THREE.DoubleSide });
const saturnRingMesh = new THREE.Mesh(saturnRingGeo, saturnRingMat);
const saturnRing = new OrbitClass("Saturn Ring");
solarSystem.add(saturnOrbit);
saturnOrbit.add(saturn);
saturn.add(saturnMesh);
saturn.setDistance(1000);
saturn.add(saturnRing);
saturnRing.rotation.x = Math.PI / 2;
saturnRing.add(saturnRingMesh);
saturn.setInclination(26.73 / 180 * Math.PI);
saturn.setSpeed(0.01 / 10.7 * 24);
saturnOrbit.setInclination(5.51 / 180 * Math.PI);
saturnOrbit.setSpeed(0.01 / 10755.70);
saturnMesh.castShadow = true;
saturnMesh.receiveShadow = true;
saturnRingMesh.castShadow = true;
saturnRingMesh.receiveShadow = true;

const jupiterOrbit = new OrbitClass("Jupiter Orbit");
const jupiterGeo = new THREE.SphereGeometry(10, 32, 32);
const jupiterMat = new THREE.MeshStandardMaterial({ map: jupiterTexture });
const jupiterMesh = new THREE.Mesh(jupiterGeo, jupiterMat);
const jupiter = new OrbitClass("Jupiter");
solarSystem.add(jupiterOrbit);
jupiterOrbit.add(jupiter);
jupiter.add(jupiterMesh);
jupiter.setDistance(540);
jupiter.setInclination(3.13 / 180 * Math.PI);
jupiter.setSpeed(0.01 / 9.925 * 24);
jupiterOrbit.setInclination(6.09 / 180 * Math.PI);
jupiterOrbit.setSpeed(0.01 / 4332.59);
jupiterMesh.castShadow = true;
jupiterMesh.receiveShadow = true;

const earthOrbit = new OrbitClass("Earth Orbit");
const earth = new OrbitClass("Earth");
const earthGeo = new THREE.SphereGeometry(1, 32, 32);
const earthMat = new THREE.MeshStandardMaterial({ map: earthTexture });
const earthMesh = new THREE.Mesh(earthGeo, earthMat);
solarSystem.add(earthOrbit);
earthOrbit.add(earth);
earth.add(earthMesh);
earthOrbit.setInclination(7.155 / 180 * Math.PI);
earthOrbit.setSpeed(0.01 / 365);
earth.setSpeed(0.01);
earth.setDistance(100);
earth.setInclination(23.44 / 180 * Math.PI);
earthMesh.castShadow = true;
earthMesh.receiveShadow = true;

const marsOrbit = new OrbitClass("Mars Orbit");
const mars = new OrbitClass("Mars");
const marsGeo = new THREE.SphereGeometry(0.53, 32, 32);
const marsMat = new THREE.MeshStandardMaterial({ map: marsTexture });
const marsMesh = new THREE.Mesh(marsGeo, marsMat);
solarSystem.add(marsOrbit);
marsOrbit.add(mars);
mars.add(marsMesh);
marsOrbit.setInclination(5.65 / 180 * Math.PI);
marsOrbit.setSpeed(0.01 / 687);
mars.setSpeed(0.01 / 1.03);
mars.setDistance(167);
mars.setInclination(25.19 / 180 * Math.PI);
marsMesh.castShadow = true;
marsMesh.receiveShadow = true;

const venusOrbit = new OrbitClass("Venus Orbit");
const venus = new OrbitClass("Venus");
const venusGeo = new THREE.SphereGeometry(0.95, 32, 32);
const venusMat = new THREE.MeshStandardMaterial({ map: venusTexture });
const venusMesh = new THREE.Mesh(venusGeo, venusMat);
solarSystem.add(venusOrbit);
venusOrbit.add(venus);
venus.add(venusMesh);
venusOrbit.setInclination(3.86 / 180 * Math.PI);
venusOrbit.setSpeed(0.01 / 225);
venus.setSpeed(0.01 / 243);
venus.setDistance(72);
venus.setInclination(177.36 / 180 * Math.PI);
venusMesh.castShadow = true;
venusMesh.receiveShadow = true;

const neptuneOrbit = new OrbitClass("Neptune Orbit");
const neptune = new OrbitClass("Neptune");
const neptuneGeo = new THREE.SphereGeometry(3.9, 32, 32);
const neptuneMat = new THREE.MeshStandardMaterial({ map: neptuneTexture });
const neptuneMesh = new THREE.Mesh(neptuneGeo, neptuneMat);
solarSystem.add(neptuneOrbit);
neptuneOrbit.add(neptune);
neptune.add(neptuneMesh);
neptuneOrbit.setInclination(6.43 / 180 * Math.PI);
neptuneOrbit.setSpeed(0.01 / 60190);
neptune.setSpeed(0.01 / 16.11 * 24);
neptune.setDistance(3000);
neptune.setInclination(28.32 / 180 * Math.PI);
neptuneMesh.castShadow = true;
neptuneMesh.receiveShadow = true;

const uranusOrbit = new OrbitClass("Uranus Orbit");
const uranus = new OrbitClass("Uranus");
const uranusGeo = new THREE.SphereGeometry(4, 32, 32);
const uranusMat = new THREE.MeshStandardMaterial({ map: uranusTexture });
const uranusMesh = new THREE.Mesh(uranusGeo, uranusMat);
solarSystem.add(uranusOrbit);
uranusOrbit.add(uranus);
uranus.add(uranusMesh);
uranusOrbit.setInclination(6.48 / 180 * Math.PI);
uranusOrbit.setSpeed(0.01 / 30688);
uranus.setSpeed(0.01 / 0.718);
uranus.setDistance(2000);
uranus.setInclination(97.77 / 180 * Math.PI);
uranusMesh.castShadow = true;
uranusMesh.receiveShadow = true;


const SolarSystem = () => {


  useEffect(() => {


  }, []);


  return (
    <div>

    </div>
  )
}

export default SolarSystem