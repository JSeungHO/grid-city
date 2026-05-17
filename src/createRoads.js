import * as THREE from 'three'

export function createRoads(scene) {
    // 바닥
    const floorGeo = new THREE.PlaneGeometry(210, 210)
    const floorMat = new THREE.MeshLambertMaterial({ color: 0x444444 })
    const floor    = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    scene.add(floor)

    // 가로 도로
    for (let x = -3; x <= 3; x++) {
        const geo  = new THREE.BoxGeometry(6, 0.2, 210)
        const mat  = new THREE.MeshLambertMaterial({ color: 0x333333 })
        const road = new THREE.Mesh(geo, mat)
        road.position.set(x * 30 - 15, 0.1, 0)
        scene.add(road)
    }

    // 세로 도로
    for (let z = -3; z <= 3; z++) {
        const geo  = new THREE.BoxGeometry(210, 0.2, 6)
        const mat  = new THREE.MeshLambertMaterial({ color: 0x333333 })
        const road = new THREE.Mesh(geo, mat)
        road.position.set(0, 0.1, z * 30 - 15)
        scene.add(road)
    }
}