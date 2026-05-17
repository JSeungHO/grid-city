import * as THREE from 'three'

export function createRoads(scene) {
    // 바닥 — XY 평면 (Z가 위)
    const floorGeo = new THREE.PlaneGeometry(210, 210)
    const floorMat = new THREE.MeshLambertMaterial({ color: 0x444444 })
    const floor    = new THREE.Mesh(floorGeo, floorMat)
    // PlaneGeometry는 기본이 XY 평면이라 회전 필요 없음!
    scene.add(floor)

    // 가로 도로 — X축 방향
    for (let x = -3; x <= 3; x++) {
        const geo  = new THREE.BoxGeometry(6, 210, 0.2)  // X,Y로 뻗고 Z가 두께
        const mat  = new THREE.MeshLambertMaterial({ color: 0x333333 })
        const road = new THREE.Mesh(geo, mat)
        road.position.set(x * 30 - 15, 0, 0.1)  // Z가 높이
        scene.add(road)
    }

    // 세로 도로 — Y축 방향
    for (let y = -3; y <= 3; y++) {
        const geo  = new THREE.BoxGeometry(210, 6, 0.2)
        const mat  = new THREE.MeshLambertMaterial({ color: 0x333333 })
        const road = new THREE.Mesh(geo, mat)
        road.position.set(0, y * 30 - 15, 0.1)
        scene.add(road)
    }
}