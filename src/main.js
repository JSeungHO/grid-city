import * as THREE from 'three'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { createCity }  from './createCity.js'
import { createRoads } from './createRoads.js'
import { createCars }  from './createCars.js'

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZWE2MjQzMy0wM2IwLTQ0YzUtYmI1YS0wNzZiMDdiNzI1ZDciLCJpZCI6MTg4MTk4LCJpYXQiOjE3MDQ1NDkxMTB9.ncmZPDlHSvO9WExgA6o6KAOeAXZiYNbJ64rLEYFYIfk'

const viewer = new Cesium.Viewer('cesiumContainer', {
    // terrain: Cesium.Terrain.fromWorldTerrain(),
    baseLayerPicker: false, geocoder: false, homeButton: false,
    sceneModePicker: false, navigationHelpButton: false,
    animation: false, timeline: false,
})

const gl = viewer.scene.context._gl
const threeRenderer = new THREE.WebGLRenderer({ canvas: viewer.canvas, context: gl, antialias: false })
threeRenderer.autoClear = false

const threeScene  = new THREE.Scene()
const threeCamera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1e10)
threeCamera.matrixAutoUpdate = false

threeScene.add(new THREE.AmbientLight(0xffffff, 0.6))
const dir = new THREE.DirectionalLight(0xffffff, 1.0)
dir.position.set(1, 1, 0.5)
threeScene.add(dir)

const SEOUL_LON = 126.978
const SEOUL_LAT = 37.566

// ── 도시를 원점에 생성 ────────────────────────
const cityGroup = new THREE.Group()
createRoads(cityGroup)
createCity(cityGroup)
const cars = createCars(cityGroup)
threeScene.add(cityGroup)

// ── 서울 ECEF 좌표 ────────────────────────────
const seoulECEF = Cesium.Cartesian3.fromDegrees(SEOUL_LON, SEOUL_LAT, 0)

viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(SEOUL_LON, SEOUL_LAT, 300),
    orientation: {
        heading: Cesium.Math.toRadians(45),
        pitch:   Cesium.Math.toRadians(-45),
        roll: 0,
    },
    duration: 2,
    complete: () => {
        window._debugged = false  // 도착 후 다시 찍기
        console.log('카메라 방향(direction):', viewer.camera.direction)
        console.log('cityGroup 방향으로부터 카메라까지:', {
            x: -3045753 - (-3044800),
            y: 4045082 - 4043816,
            z: 3868592 - 3867372
        })
    }
})

viewer.scene.postRender.addEventListener(() => {
    const vm = viewer.camera.viewMatrix
    threeCamera.matrixWorldInverse.set(
        vm[0], vm[4], vm[8],  vm[12],
        vm[1], vm[5], vm[9],  vm[13],
        vm[2], vm[6], vm[10], vm[14],
        vm[3], vm[7], vm[11], vm[15]
    )
    threeCamera.matrixWorld.copy(threeCamera.matrixWorldInverse).invert()
    const fov    = Cesium.Math.toDegrees(viewer.camera.frustum.fovy ?? Math.PI / 3)
    const aspect = viewer.canvas.clientWidth / viewer.canvas.clientHeight
    threeCamera.fov    = fov
    threeCamera.aspect = aspect
    threeCamera.near   = 1
    threeCamera.far    = 1e10
    threeCamera.updateProjectionMatrix()

    // ── cityGroup ENU 배치 ──────────────────────
    const enu = Cesium.Transforms.eastNorthUpToFixedFrame(seoulECEF)
    const s = 1  // 스케일 1 (Three.js 단위 = 미터)

    cityGroup.matrixAutoUpdate = false
    cityGroup.matrix.set(
        enu[0]*s, enu[4]*s, enu[8]*s,  enu[12],
        enu[1]*s, enu[5]*s, enu[9]*s,  enu[13],
        enu[2]*s, enu[6]*s, enu[10]*s, enu[14],
        enu[3],   enu[7],   enu[11],   enu[15]
    )
    cityGroup.updateMatrixWorld(true)

// 확인용
//     console.log('cityGroup translation:', enu[12], enu[13], enu[14])

    // ── 차량 이동 ─────────────────────────────────
    cars.forEach(car => {
        car.mesh.position.x += car.dx
        car.mesh.position.z += car.dz
        if (car.mesh.position.x >  100) car.mesh.position.x = -100
        if (car.mesh.position.x < -100) car.mesh.position.x =  100
        if (car.mesh.position.z >  100) car.mesh.position.z = -100
        if (car.mesh.position.z < -100) car.mesh.position.z =  100
    })

    threeRenderer.resetState()
    threeRenderer.render(threeScene, threeCamera)
    if (!window._debugged) {
        window._debugged = true

        // Cesium 카메라 실제 위치
        const cesiumPos = viewer.camera.positionWC
        console.log('Cesium 카메라 ECEF:', cesiumPos.x, cesiumPos.y, cesiumPos.z)

        // Three.js 카메라 위치
        const threePos = new THREE.Vector3().setFromMatrixPosition(threeCamera.matrixWorld)
        console.log('Three 카메라 위치:', threePos.x, threePos.y, threePos.z)
    }
})