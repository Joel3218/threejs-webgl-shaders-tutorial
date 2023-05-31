import { vertexShader1, fragmentShader1, vertexShader2, fragmentShader2, fragmentShader3} from './utils/shaders';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { initGUI } from './utils/gui';

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa8def0);

// CAMERA
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 3;
camera.position.z = 5;
camera.position.x = -3;

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// ORBIT CAMERA CONTROLS
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true
orbitControls.minDistance = 1
orbitControls.maxDistance = 15
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05 // prevent camera below ground
orbitControls.minPolarAngle = Math.PI / 4        // prevent top down view
orbitControls.update();

const layer01 = new THREE.TextureLoader().load('/textures/layer01.png');
layer01.wrapS = layer01.wrapT = THREE.RepeatWrapping;

const layer02 = new THREE.TextureLoader().load('/textures/layer02.png');
layer02.wrapS = layer02.wrapT = THREE.RepeatWrapping;

const layer03 = new THREE.TextureLoader().load('/textures/Spiral galaxy.png');
layer03.wrapS = layer03.wrapT = THREE.RepeatWrapping;

const layer04 = new THREE.TextureLoader().load('/textures/terrainTexture.jpg');
layer04.wrapS = layer04.wrapT = THREE.RepeatWrapping;

const layer05 = new THREE.TextureLoader().load('/textures/hi.jpg');
layer04.wrapS = layer04.wrapT = THREE.RepeatWrapping;

const textureLayer01 = {
    colorMap: layer01,
    flowDirection: new THREE.Vector2(0.7, -0.5),
    flowSpeed: 0.00008,
    repeat: new THREE.Vector2(1,1)
}

const textureLayer02 = {
    colorMap: layer02,
    flowDirection: new THREE.Vector2(-0.7, 0.7),
    flowSpeed: 0.00005,
    repeat: new THREE.Vector2(2,2)
}

const textureLayer03 = {
    colorMap: layer03,
    flowDirection: new THREE.Vector2(-0.7, 0.7),
    flowSpeed: 0.00005,
    repeat: new THREE.Vector2(3,3)
}
const textureLayer04 = {
    colorMap: layer04,
    flowDirection: new THREE.Vector2(-0.7, 0.7),
    flowSpeed: 0.00005,
    repeat: new THREE.Vector2(2,2)
}

const textureLayer05 = {
    colorMap: layer05,
    flowDirection: new THREE.Vector2(-0.7, 0.7),
    flowSpeed: 0.00005,
    repeat: new THREE.Vector2(2,2)
}

const uniforms = {
    textureLayer01: {
        value: textureLayer01
    },
    textureLayer02: {
        value: textureLayer03
    },
    time: {
        value: 1.0
    },
};
const uniforms1 = {
    textureLayer01: {
        value: textureLayer02
    },
    textureLayer02: {
        value: textureLayer04
    },
    time: {
        value: 1.0
    },
};
const uniforms2 = {
    textureLayer01: {
        value: textureLayer03
    },
    textureLayer02: {
        value: textureLayer05
    },
    time: {
        value: 1.0
    },
};



// MORPH OBJECT
const mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(2, 2, 2, 256), new THREE.RawShaderMaterial( {
    uniforms: uniforms,
    vertexShader: vertexShader1,
    fragmentShader: fragmentShader1,
    side: THREE.DoubleSide,
    transparent: true,
} ));
scene.add(mesh);

const mesh2 = new THREE.Mesh(new THREE.BoxBufferGeometry(2, 3, 3, 256), new THREE.RawShaderMaterial( {
    uniforms: uniforms1,
    vertexShader: vertexShader1,
    fragmentShader: fragmentShader1,
    side: THREE.DoubleSide,
    transparent: true,
} ));
mesh2.position.set(3.5,1,1)
scene.add(mesh2);

const mesh3 = new THREE.Mesh(new THREE.SphereGeometry(2, 3, 3, 256), new THREE.RawShaderMaterial( {
    uniforms: uniforms2,
    vertexShader: vertexShader2,
   fragmentShader: fragmentShader2,
    side: THREE.DoubleSide,
    transparent: true,
} ));
mesh3.position.set(-3.5,1,1)
scene.add(mesh3);

const boxGeometry = new THREE.BoxGeometry(2,2,2,2,2,2)
const boxMaterial = new THREE.ShaderMaterial({
    wireframe: true,
    vertexShader:`
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, sin(position.z) + position.y, position.z, 1.0);
    }
    `,
    fragmentShader:`
    void main() {
        gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }
    `,
});
const boxMesh = new  THREE.Mesh(boxGeometry,boxMaterial);
boxMesh.position.set(8,1,1)
scene.add(boxMesh);

// ANIMATE
function animate() {
    uniforms.time.value = performance.now();
    uniforms1.time.value = performance.now();
    uniforms2.time.value = performance.now();
    orbitControls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
document.body.appendChild(renderer.domElement);
animate();

// RESIZE HANDLER
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

initGUI(uniforms);
initGUI(uniforms1);
initGUI(uniforms2);