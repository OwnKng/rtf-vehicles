import * as THREE from "three"

interface boxProps {
  width: number
  height: number
  depth: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}

const vertexShader = `
    varying vec2 vUv; 
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
        vUv = uv; 
    }
`

const fragmentShader = `
    varying vec2 vUv; 

    void main() {
        float color = step(0.497, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

        if(color == 0.0) discard;

        gl_FragColor = vec4(vec3(0.125, 0.64, 0.95), 0.05); 
    }
`

const Box = ({
  width = 1,
  height = 1,
  depth = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: boxProps) => (
  <mesh position={position} rotation={rotation}>
    <boxBufferGeometry args={[width, height, depth]} />
    <shaderMaterial
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      transparent={true}
      side={THREE.DoubleSide}
    />
  </mesh>
)

export default Box
