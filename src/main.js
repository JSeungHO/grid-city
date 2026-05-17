import * as THREE from 'three'
import { createCity }  from './createCity.js'
import { createRoads } from './createRoads.js'
import { createCars }  from './createCars.js'

// 기본 설정
const scene    = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 5000)
const renderer = new THREE.WebGLRenderer({ antialias: true })

renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
renderer.shadowMap.enabled = true

document.body.appendChild(renderer.domElement)

scene.background = new THREE.Color(0x87ceeb)
camera.position.set(100, 150, 100)
camera.lookAt(0, 0, 0)

// 조명
const ambient  = new THREE.AmbientLight(0xffffff, 0.6)
const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
dirLight.position.set(200, 300, 100)

dirLight.castShadow = true
dirLight.position.set(100, 200, 100)  // 더 멀리
dirLight.shadow.mapSize.width  = 2048
dirLight.shadow.mapSize.height = 2048
dirLight.shadow.camera.near = 0.5
dirLight.shadow.camera.far  = 500
dirLight.shadow.camera.left   = -200
dirLight.shadow.camera.right  =  200
dirLight.shadow.camera.top    =  200
dirLight.shadow.camera.bottom = -200

scene.add(ambient)
scene.add(dirLight)

// 도시 조립
createRoads(scene)
createCity(scene)
const cars = createCars(scene)

// 애니메이션
let angle = 0

function animate() {
    requestAnimationFrame(animate)

    // 카메라 회전
    angle += 0.003  // 속도 (클수록 빠름)
    camera.position.x = Math.cos(angle) * 180
    camera.position.z = Math.sin(angle) * 180
    camera.position.y = 150
    camera.lookAt(0, 0, 0)  // 항상 도시 중심을 바라봄

    // 차량 이동 (기존 코드)
    cars.forEach(car => {
        car.mesh.position.x += car.dx
        car.mesh.position.z += car.dz

        if (car.mesh.position.x >  100) car.mesh.position.x = -100
        if (car.mesh.position.x < -100) car.mesh.position.x =  100
        if (car.mesh.position.z >  100) car.mesh.position.z = -100
        if (car.mesh.position.z < -100) car.mesh.position.z =  100
    })


    renderer.render(scene, camera)
}



animate()