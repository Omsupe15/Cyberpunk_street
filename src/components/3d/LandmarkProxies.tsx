'use client';
import { LANDMARKS } from '@/lib/constants';

export function LandmarkProxies() {
  return (
    <group>

      {/* 3. Landmark 1: Spaceship Cafe Proxy (Right, Z: -32) */}
      <group position={[7.5, 0, LANDMARKS.CAFE.z]}>
        {/* Cafe Main Structure */}
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[4, 5, 10]} />
          <meshStandardMaterial color="#202430" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Cantilevered Ship Hull */}
        <mesh position={[-1.5, 3.2, 0]} rotation={[0, 0, -0.1]}>
          <coneGeometry args={[1.5, 6, 8]} />
          <meshStandardMaterial color="#2A2F3D" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Dual Plasma Thrusters */}
        <mesh position={[-1.2, 2.0, -2]}>
          <cylinderGeometry args={[0.35, 0.45, 1.2, 16]} />
          <meshBasicMaterial color="#FFAA00" />
        </mesh>
        <mesh position={[-1.2, 2.0, 2]}>
          <cylinderGeometry args={[0.35, 0.45, 1.2, 16]} />
          <meshBasicMaterial color="#FFAA00" />
        </mesh>
        {/* Holographic Coffee Mug Sign */}
        <mesh position={[-2.2, 5.0, 0]}>
          <torusGeometry args={[0.7, 0.15, 16, 32]} />
          <meshBasicMaterial color="#00F3FF" wireframe />
        </mesh>
        <pointLight position={[-2, 2.5, 0]} color="#FFAA00" intensity={3.5} distance={15} />
      </group>

      {/* 4. Landmark 2: Star Clothing Store Proxy (Left, Z: -70) */}
      <group position={[-7.5, 0, LANDMARKS.STAR.z]}>
        {/* Boutique Main Structure */}
        <mesh position={[0, 3, 0]}>
          <boxGeometry args={[4, 6, 12]} />
          <meshStandardMaterial color="#1a1824" roughness={0.2} metalness={0.7} />
        </mesh>
        {/* Glass Showroom Windows */}
        <mesh position={[1.8, 2.2, 0]}>
          <planeGeometry args={[10, 4]} />
          <meshStandardMaterial color="#8A2BE2" roughness={0.1} transparent opacity={0.6} />
        </mesh>
        {/* Constellation Canopy */}
        <mesh position={[1.2, 4.5, 0]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[3, 0.3, 11]} />
          <meshBasicMaterial color="#00F3FF" wireframe />
        </mesh>
        {/* Wireframe Mannequins */}
        <mesh position={[1.0, 1.6, -2]}>
          <coneGeometry args={[0.4, 1.8, 6]} />
          <meshBasicMaterial color="#8A2BE2" wireframe />
        </mesh>
        <mesh position={[1.0, 1.6, 2]}>
          <coneGeometry args={[0.4, 1.8, 6]} />
          <meshBasicMaterial color="#00F3FF" wireframe />
        </mesh>
        <pointLight position={[2, 2.5, 0]} color="#8A2BE2" intensity={4} distance={15} />
      </group>

      {/* 5. Landmark 3: Debris Pawn Shop Proxy (Left, Z: -110) */}
      <group position={[-7.0, 0, LANDMARKS.PAWN.z]}>
        {/* Grungy Salvage Den */}
        <mesh position={[0, 2.2, 0]}>
          <boxGeometry args={[4, 4.5, 9]} />
          <meshStandardMaterial color="#1e221d" roughness={0.9} metalness={0.5} />
        </mesh>
        {/* Security Shutter */}
        <mesh position={[1.8, 1.8, 0]}>
          <planeGeometry args={[7, 3.2]} />
          <meshStandardMaterial color="#2c3028" roughness={0.8} />
        </mesh>
        {/* Salvaged Wire Cages & CRTs */}
        <mesh position={[1.5, 0.6, -2.5]}>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshBasicMaterial color="#05FFA1" wireframe />
        </mesh>
        <mesh position={[1.5, 0.7, 2.5]}>
          <boxGeometry args={[1.4, 1.4, 1.4]} />
          <meshBasicMaterial color="#FFAA00" wireframe />
        </mesh>
        {/* Blinking Hazard Beacon */}
        <mesh position={[1.5, 3.8, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="#05FFA1" />
        </mesh>
        <pointLight position={[2, 2.0, 0]} color="#05FFA1" intensity={3.5} distance={12} />
      </group>

      {/* 6. Landmark 4: Nova Motel Proxy (Right, Z: -152) */}
      <group position={[8.0, 0, LANDMARKS.MOTEL.z]}>
        {/* Towering Stasis Motel Facade */}
        <mesh position={[0, 7.5, 0]}>
          <boxGeometry args={[4.5, 15, 11]} />
          <meshStandardMaterial color="#1f1825" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Towering Vertical Neon Sign */}
        <mesh position={[-2.2, 8.5, 0]}>
          <boxGeometry args={[0.3, 11, 1.8]} />
          <meshBasicMaterial color="#FF0055" />
        </mesh>
        {/* Hexagonal Stasis Pod Windows */}
        {[-3, -1, 1, 3].map((zOffset, i) => (
          <mesh key={i} position={[-2.1, 4.0, zOffset]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.65, 6]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
        ))}
        {/* Exterior Elevator Shaft Proxy */}
        <mesh position={[-1.8, 8.0, -4.5]}>
          <cylinderGeometry args={[0.6, 0.6, 14, 8]} />
          <meshBasicMaterial color="#00F3FF" wireframe />
        </mesh>
        <pointLight position={[-2.5, 8.0, 0]} color="#FF0055" intensity={5} distance={20} />
      </group>

      {/* 7. Ambient Street Light Posts */}
      {[-15, -45, -90, -135].map((zPos, index) => (
        <group key={index}>
          <mesh position={[-4.5, 2.5, zPos]}>
            <cylinderGeometry args={[0.06, 0.08, 5, 8]} />
            <meshStandardMaterial color="#333" metalness={0.8} />
          </mesh>
          <mesh position={[-4.5, 5.0, zPos]}>
            <boxGeometry args={[0.5, 0.15, 0.3]} />
            <meshBasicMaterial color="#00F3FF" />
          </mesh>
          <pointLight position={[-4.5, 4.8, zPos]} color="#00F3FF" intensity={1.5} distance={10} />

          <mesh position={[4.5, 2.5, zPos]}>
            <cylinderGeometry args={[0.06, 0.08, 5, 8]} />
            <meshStandardMaterial color="#333" metalness={0.8} />
          </mesh>
          <mesh position={[4.5, 5.0, zPos]}>
            <boxGeometry args={[0.5, 0.15, 0.3]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
          <pointLight position={[4.5, 4.8, zPos]} color="#FFAA00" intensity={1.5} distance={10} />
        </group>
      ))}
    </group>
  );
}

