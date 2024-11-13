import React from 'react'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { earthImg, jupiterImg, marsImg, mercuryImg, neptuneImg, plutoImg, saturnImg, starsImg, sunImg, uranusImg, venusImg } from './constant';

const Planet = () => {
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

  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  
  // Sets orbit control to move the camera around
  const orbit = new OrbitControls(camera, renderer.domElement);
  

  // Camera positioning
  camera.position.set(-90, 140, 140);
  orbit.update();

  scene.background = starsTexture;

  const animate = (time: number) => {
    sun.rotateY(0.004);
    mercury.rotateY(0.004);
    mercuryOrbit.rotateY(0.004);
    saturn.rotateY(0.004);
    saturnOrbit.rotateY(0.001);
    earth.rotateY(0.01);
    earthOrbit.rotateY(0.01 / 365);
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

  const pointLight = new THREE.PointLight(0xffffff, 10000, 300);
  scene.add(pointLight);

  const solarSystem = new THREE.Group();
  scene.add(solarSystem);

  const sunGeo = new THREE.SphereGeometry(10, 32, 32);
  const sumMat = new THREE.MeshBasicMaterial({map: sunTexture});
  const sun = new THREE.Mesh(sunGeo, sumMat);
  solarSystem.add(sun);

  const mercuryOrbit = new THREE.Object3D();
  const mercuryGeo = new THREE.SphereGeometry(3.2, 32, 32);
  const mercuryMat = new THREE.MeshStandardMaterial({map: mercuryTexture});
  const mercury = new THREE.Mesh(mercuryGeo, mercuryMat);
  mercuryOrbit.add(mercury);
  mercury.position.set(28, 0, 0);
  solarSystem.add(mercuryOrbit);

  const saturnOrbit = new THREE.Object3D();
  const saturnGeo = new THREE.SphereGeometry(10, 32, 32);
  const saturnMat = new THREE.MeshStandardMaterial({map: saturnTexture});
  const saturn = new THREE.Mesh(saturnGeo, saturnMat);
  const saturnRingGeo = new THREE.RingGeometry(15, 20, 32);
  const saturnRingMat = new THREE.MeshBasicMaterial({map: saturnRingTexture, side: THREE.DoubleSide});
  const saturnRing = new THREE.Mesh(saturnRingGeo, saturnRingMat);
  solarSystem.add(saturnOrbit);
  saturnOrbit.add(saturn);
  saturn.position.set(138, 0, 0);
  saturn.add(saturnRing);
  saturn.rotation.z = 26.73 / 180 * Math.PI;
  saturnRing.rotation.x = Math.PI / 2;

  const earthOrbit = new THREE.Object3D();
  const earthGeo = new THREE.SphereGeometry(5, 32, 32);
  const earthMat = new THREE.MeshStandardMaterial({map: earthTexture});
  const earth = new THREE.Mesh(earthGeo, earthMat);
  solarSystem.add(earthOrbit);
  earthOrbit.add(earth);
  const earthOrbitShow = new THREE.RingGeometry(50, 50.1, 100);
  const earthOrbitMat = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
  const earthOrbitShow1 = new THREE.Mesh(earthOrbitShow, earthOrbitMat);
  earthOrbit.add(earthOrbitShow1);
  earthOrbitShow1.rotation.x = Math.PI / 2;
  earthOrbit.rotation.z = 7.155 / 180 * Math.PI;
  earth.position.set(50, 0, 0);
  earth.rotation.z = 23.44 / 180 * Math.PI;

  return (
    <div>

    </div>
  )
}

export default Planet