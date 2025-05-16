import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import "./App.css"

const CELL_SIZE = 1;
const GRID_SIZE = 20;
const CUBE_COUNT = 140;

const getRandomCellPosition = (): [number, number, number] => {
  const halfGrid = GRID_SIZE / 2;
  const x = Math.floor((Math.random() * GRID_SIZE) - halfGrid) * CELL_SIZE;
  const z = Math.floor((Math.random() * GRID_SIZE) - halfGrid) * CELL_SIZE;
  return [x, 0, z];
};

const Cubes = () => {
  const positions = useMemo(() => {
    const stackMap = new Map<string, number>();
    const pos: [number, number, number][] = [];

    for (let i = 0; i < CUBE_COUNT; i++) {
      const [x, , z] = getRandomCellPosition();
      const key = `${x},${z}`;
      const stack = stackMap.get(key) || 0;
      const y = CELL_SIZE / 2 + stack * CELL_SIZE;

      pos.push([x, y, z]);
      stackMap.set(key, stack + 1);
    }

    return pos;
  }, []);

  const cubeSize = CELL_SIZE * 0.95;

  return (
    <>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
          <meshStandardMaterial color="#888888" />
        </mesh>
      ))}
    </>
  );
};

function App() {
  return (
    <div className="canvas-wrapper">
      <Canvas
      shadows
      camera={{ position: [10, 6, 0], fov: 50 }}
      style={{ width: "100vw", height: "100vh", background: "#0c0f1a" }}
    >
      <fog attach="fog" args={["#000", 10, 50]} />
      <ambientLight intensity={0.05} />

      <directionalLight
        position={[-20, 10, -20]}
        intensity={2.5}
        color="#fff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={100}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      <OrbitControls autoRotate autoRotateSpeed={1.2} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      <Cubes />
    </Canvas>
    </div>
    
  );
}

export default App;
