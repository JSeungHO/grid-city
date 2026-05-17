import * as THREE from 'three'

export function createCity(scene) {
    const colors = [
        0xc8d8e8, 0xe8d4a0, 0xa0c8e8, 0xe8a0a0, 0xa0e8a0,
    ]

    for (let x = -2; x <= 2; x++) {
        for (let y = -2; y <= 2; y++) {  // z → y (수평면)

            // 잔디 — XY 평면에 배치, Z가 위
            const grassGeo = new THREE.BoxGeometry(20, 20, 0.5)  // Z가 두께
            const grassMat = new THREE.MeshLambertMaterial({ color: 0x5a8c5a })
            const grass    = new THREE.Mesh(grassGeo, grassMat)
            grass.position.set(x * 30, y * 30, 0.25)  // Z가 높이
            scene.add(grass)

            const type = Math.floor(Math.random() * 3)

            if (type === 0) {
                const height = 20 + Math.random() * 40
                const color  = colors[Math.floor(Math.random() * colors.length)]
                const geo    = new THREE.BoxGeometry(10, 10, height)  // Z가 높이
                const mat    = new THREE.MeshLambertMaterial({ color })
                const mesh   = new THREE.Mesh(geo, mat)
                mesh.position.set(x * 30, y * 30, height / 2)  // Z가 위
                scene.add(mesh)

            } else if (type === 1) {
                const count = 2 + Math.floor(Math.random() * 2)
                for (let i = 0; i < count; i++) {
                    const height = 5 + Math.random() * 15
                    const color  = colors[Math.floor(Math.random() * colors.length)]
                    const geo    = new THREE.BoxGeometry(7, 7, height)
                    const mat    = new THREE.MeshLambertMaterial({ color })
                    const mesh   = new THREE.Mesh(geo, mat)
                    mesh.position.set(
                        x * 30 + (Math.random() - 0.5) * 10,
                        y * 30 + (Math.random() - 0.5) * 10,
                        height / 2
                    )
                    scene.add(mesh)
                }

            } else {
                // 나무
                const trunkGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 6)
                const trunkMat = new THREE.MeshLambertMaterial({ color: 0x8b5e3c })
                const trunk    = new THREE.Mesh(trunkGeo, trunkMat)
                trunk.rotation.x = Math.PI / 2  // 세우기
                trunk.position.set(x * 30, y * 30, 2)
                scene.add(trunk)

                const leafGeo = new THREE.ConeGeometry(5, 8, 6)
                const leafMat = new THREE.MeshLambertMaterial({ color: 0x3a8c3a })
                const leaf    = new THREE.Mesh(leafGeo, leafMat)
                leaf.rotation.x = Math.PI / 2
                leaf.position.set(x * 30, y * 30, 8)
                scene.add(leaf)
            }
        }
    }
}