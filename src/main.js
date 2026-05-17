import * as THREE from 'three'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { createCity }  from './createCity.js'
import { createRoads } from './createRoads.js'
import { createCars }  from './createCars.js'

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZWE2MjQzMy0wM2IwLTQ0YzUtYmI1YS0wNzZiMDdiNzI1ZDciLCJpZCI6MTg4MTk4LCJpYXQiOjE3MDQ1NDkxMTB9.ncmZPDlHSvO9WExgA6o6KAOeAXZiYNbJ64rLEYFYIfk'

const viewer = new Cesium.Viewer('cesiumContainer', {
    terrain: Cesium.Terrain.fromWorldTerrain(),
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
    destination: Cesium.Cartesian3.fromDegrees(SEOUL_LON, SEOUL_LAT, 2000),
    orientation: {
        heading: Cesium.Math.toRadians(45),
        pitch:   Cesium.Math.toRadians(-45),
        roll: 0,
    },
    duration: 2,
})

viewer.scene.postRender.addEventListener(() => {
    // ── 카메라 동기화 ───────────────────────────
    const civm = viewer.camera.inverseViewMatrix
    threeCamera.matrixWorld.set(
        civm[0], civm[4], civm[8],  civm[12],
        civm[1], civm[5], civm[9],  civm[13],
        civm[2], civm[6], civm[10], civm[14],
        civm[3], civm[7], civm[11], civm[15]
    )
    threeCamera.matrixWorldInverse.copy(threeCamera.matrixWorld).invert()

    const fov    = Cesium.Math.toDegrees(viewer.camera.frustum.fovy ?? Math.PI / 3)
    const aspect = viewer.canvas.clientWidth / viewer.canvas.clientHeight
    threeCamera.fov    = fov
    threeCamera.aspect = aspect
    threeCamera.near   = 1
    threeCamera.far    = 1e10
    threeCamera.updateProjectionMatrix()

    // ── cityGroup을 서울 ENU 기준으로 배치 ───────
    // 카메라 위치를 기준점으로 ECEF 변환
    const enu = Cesium.Transforms.eastNorthUpToFixedFrame(seoulECEF)
    cityGroup.matrixAutoUpdate = false
    cityGroup.matrix.set(
        enu[0], enu[4], enu[8],  enu[12],
        enu[1], enu[5], enu[9],  enu[13],
        enu[2], enu[6], enu[10], enu[14],
        enu[3], enu[7], enu[11], enu[15]
    )
    cityGroup.matrixWorld.copy(cityGroup.matrix)

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
})