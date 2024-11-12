import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/9.png')

// Particles
// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 3000

const positions = new Float32Array(count * 3)
for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
}
particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    color: "#ff88cc",
    transparent: true,
    alphaMap: particleTexture,
    depthTest: false,
    blending: THREE.AdditiveBlending
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

// Przenieś deklarację elapsedTime na zewnątrz funkcji tick
let elapsedTime = 0.0;

// Parametry dla GUI
const params = {
    elapsedTime: 0.0,
    timeSpeed: 1.0, 
};

// Dodanie kontrolek do GUI
gui.add(params, 'elapsedTime', 0, 10).onChange((value) => {
    elapsedTime = value;
});

gui.add(params, 'timeSpeed', 0, 5); // Kontrolka do zmiany prędkości czasu

const tick = () => {
    // Zwiększanie elapsedTime na podstawie timeSpeed
    const deltaTime = clock.getDelta();
    elapsedTime += deltaTime * params.timeSpeed;

    // Aktualizacja cząstek
    for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = particlesGeometry.attributes.position.array[i3]
        const z = particlesGeometry.attributes.position.array[i3 + 2]

        particlesGeometry.attributes.position.array[i3 + 1] = ((Math.sin(x + elapsedTime)  * Math.cos(z + elapsedTime)))
    }
    particlesGeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()
