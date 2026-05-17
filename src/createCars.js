import * as THREE from 'three'

export function createCars(scene) {
    const cars   = []
    const colors = [0xe03030, 0x3060e0, 0xf0c020, 0xf0f0f0, 0x30a030, 0xe08030]

    // 가로 도로
    for (let i = -3; i <= 3; i++) {
        const y = i * 30 - 15  // z → y (수평)
        cars.push(makeCar(scene, -100, y,      0.5,  0.3 + Math.random() * 0.3, 0, colors))
        cars.push(makeCar(scene,  100, y + 3,  0.5, -0.3 - Math.random() * 0.3, 0, colors))
    }

    // 세로 도로
    for (let i = -3; i <= 3; i++) {
        const x = i * 30 - 15
        cars.push(makeCar(scene, x,     -100, 0.5, 0,  0.3 + Math.random() * 0.3, colors))
        cars.push(makeCar(scene, x + 3,  100, 0.5, 0, -0.3 - Math.random() * 0.3, colors))
    }

    return cars
}

function makeCar(scene, x, y, z, dx, dy, colors) {
    const color = colors[Math.floor(Math.random() * colors.length)]
    const geo   = new THREE.BoxGeometry(4, 4, 2)  // Z가 높이
    const mat   = new THREE.MeshLambertMaterial({ color })
    const mesh  = new THREE.Mesh(geo, mat)
    mesh.position.set(x, y, z)
    scene.add(mesh)
    return { mesh, dx, dy }
}