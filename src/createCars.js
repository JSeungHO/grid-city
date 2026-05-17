import * as THREE from 'three'

export function createCars(scene) {
    const cars   = []
    const colors = [0xe03030, 0x3060e0, 0xf0c020, 0xf0f0f0, 0x30a030, 0xe08030]

    // 가로 도로 (-3 ~ 3) 마다 차량 2대씩
    for (let i = -3; i <= 3; i++) {
        const z = i * 30 - 15

        // 왼→오
        cars.push(makeCar(scene, -100, 1, z,      0.3 + Math.random() * 0.3, 0, colors))
        // 오→왼
        cars.push(makeCar(scene,  100, 1, z + 3, -0.3 - Math.random() * 0.3, 0, colors))
    }

    // 세로 도로 (-3 ~ 3) 마다 차량 2대씩
    for (let i = -3; i <= 3; i++) {
        const x = i * 30 - 15

        // 위→아래
        cars.push(makeCar(scene, x,     1, -100, 0, 0.3 + Math.random() * 0.3, colors))
        // 아래→위
        cars.push(makeCar(scene, x + 3, 1,  100, 0,-0.3 - Math.random() * 0.3, colors))
    }

    return cars
}

function makeCar(scene, x, y, z, dx, dz, colors) {
    const color = colors[Math.floor(Math.random() * colors.length)]
    const geo   = new THREE.BoxGeometry(4, 2, 2)
    const mat   = new THREE.MeshLambertMaterial({ color })
    const mesh  = new THREE.Mesh(geo, mat)
    mesh.position.set(x, y, z)
    scene.add(mesh)
    return { mesh, dx, dz }
}