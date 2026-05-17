# 🏙️ GridCity

> CesiumJS + Three.js로 구현한 서울 실제 지도 위 Low-Poly 도시 시뮬레이션

![GridCity Demo](https://img.shields.io/badge/Three.js-black?logo=three.js)
![CesiumJS](https://img.shields.io/badge/CesiumJS-blue)
![Vite](https://img.shields.io/badge/Vite-purple?logo=vite)

## 🎯 핵심 기술

**CesiumJS와 Three.js의 WebGL 컨텍스트 공유**

두 라이브러리가 동일한 WebGL 컨텍스트를 공유하여
실제 위성지도 위에 Three.js 3D 오브젝트를 렌더링합니다.

Cesium (위성지도 + ECEF 좌표계)
└── Three.js (같은 WebGL 컨텍스트 공유)
├── 절차적 건물 생성
├── 도로망
└── 차량 애니메이션

## ✨ 기능

- 🌍 서울 실제 위성지도 위에 Low-Poly 도시 배치
- 🏢 절차적 건물 생성 (고층빌딩 / 저층 / 공원)
- 🚗 도로망 위 차량 애니메이션
- 📡 Cesium ENU 좌표계 → Three.js 변환

## 🛠 기술 스택

| 기술 | 역할 |
|------|------|
| CesiumJS | 위성지도, ECEF 좌표계, 지형 |
| Three.js | Low-Poly 3D 렌더링 |
| Vite | 빌드 도구 |

## 🚀 실행 방법

```bash
npm install
npm run dev
```

> Cesium Ion 토큰이 필요합니다. [ion.cesium.com](https://ion.cesium.com) 에서 무료 발급 후 `src/main.js`에 입력하세요.

## 📁 구조
