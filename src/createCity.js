import * as THREE from 'three'

export function createCity(scene) {

    // 건물 색상 목록
    const colors = [
        0xc8d8e8,  // 회색
        0xe8d4a0,  // 베이지
        0xa0c8e8,  // 파란색
        0xe8a0a0,  // 붉은색
        0xa0e8a0,  // 연두색
    ]

    for (let x = -2; x <= 2; x++) {
        for (let z = -2; z <= 2; z++) {

            // 잔디
            const grassGeo = new THREE.BoxGeometry(20, 0.5, 20)
            const grassMat = new THREE.MeshLambertMaterial({ color: 0x5a8c5a })
            const grass    = new THREE.Mesh(grassGeo, grassMat)
            grass.position.set(x * 30, 0.25, z * 30)
            scene.add(grass)

            // 블록 타입 랜덤 결정
            const type = Math.floor(Math.random() * 3)

            if (type === 0) {
                // 고층 빌딩 1개
                const height = 20 + Math.random() * 40
                const color  = colors[Math.floor(Math.random() * colors.length)]
                const geo    = new THREE.BoxGeometry(10, height, 10)
                const mat    = new THREE.MeshLambertMaterial({ color })
                const mesh   = new THREE.Mesh(geo, mat)
                mesh.position.set(x * 30, height / 2, z * 30)
                scene.add(mesh)

            } else if (type === 1) {
                // 낮은 건물 2~3개
                const count = 2 + Math.floor(Math.random() * 2)
                for (let i = 0; i < count; i++) {
                    const height = 5 + Math.random() * 15
                    const color  = colors[Math.floor(Math.random() * colors.length)]
                    const geo    = new THREE.BoxGeometry(7, height, 7)
                    const mat    = new THREE.MeshLambertMaterial({ color })
                    const mesh   = new THREE.Mesh(geo, mat)
                    mesh.position.set(
                        x * 30 + (Math.random() - 0.5) * 10,
                        height / 2,
                        z * 30 + (Math.random() - 0.5) * 10
                    )
                    scene.add(mesh)
                }

            } else {
                // 공원 — 나무
                const trunkGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 6)
                const trunkMat = new THREE.MeshLambertMaterial({ color: 0x8b5e3c })
                const trunk    = new THREE.Mesh(trunkGeo, trunkMat)
                trunk.position.set(x * 30, 2, z * 30)
                scene.add(trunk)

                const leafGeo = new THREE.ConeGeometry(5, 8, 6)
                const leafMat = new THREE.MeshLambertMaterial({ color: 0x3a8c3a })
                const leaf    = new THREE.Mesh(leafGeo, leafMat)
                leaf.position.set(x * 30, 8, z * 30)
                scene.add(leaf)
            }
        }
    }
}