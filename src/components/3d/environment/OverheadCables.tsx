'use client';
import { useMemo } from 'react';
import * as THREE from 'three';

interface CableSpec {
  start: [number, number, number];
  mid: [number, number, number];
  end: [number, number, number];
  hasBox?: boolean;
}

export function OverheadCables() {
  const cableGeometries = useMemo(() => {
    const specs: CableSpec[] = [
      { start: [-12, 8.5, 0], mid: [0, 7.2, 1], end: [12, 8.2, 2], hasBox: true },
      { start: [-12, 7.8, -18], mid: [0, 6.4, -19], end: [12, 7.5, -20] },
      { start: [-12, 9.2, -38], mid: [0, 7.6, -37], end: [12, 8.9, -36], hasBox: true },
      { start: [-12, 8.0, -58], mid: [0, 6.7, -59], end: [12, 8.1, -60] },
      { start: [-12, 9.5, -78], mid: [0, 7.8, -77], end: [12, 9.0, -76], hasBox: true },
      { start: [-12, 8.2, -98], mid: [0, 6.9, -99], end: [12, 8.4, -100] },
      { start: [-12, 9.0, -120], mid: [0, 7.5, -119], end: [12, 8.8, -118], hasBox: true },
      { start: [-12, 8.4, -142], mid: [0, 7.0, -143], end: [12, 8.2, -144] },
      { start: [-12, 9.8, -162], mid: [0, 8.1, -161], end: [12, 9.4, -160], hasBox: true },
    ];

    return specs.map((spec) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(...spec.start),
        new THREE.Vector3(...spec.mid),
        new THREE.Vector3(...spec.end),
      ]);
      return {
        geom: new THREE.TubeGeometry(curve, 24, 0.02, 6, false),
        mid: spec.mid,
        hasBox: spec.hasBox,
      };
    });
  }, []);

  return (
    <group>
      {cableGeometries.map((c, idx) => (
        <group key={idx}>
          {/* Main Sagging Cable Tube (Matte Industrial Conduit) */}
          <mesh geometry={c.geom}>
            <meshStandardMaterial color="#22293c" roughness={0.85} metalness={0.2} />
          </mesh>

          {/* Hanging Electrical Transformer Box */}
          {c.hasBox && (
            <group position={[c.mid[0] + 0.8, c.mid[1] - 0.25, c.mid[2]]}>
              <mesh>
                <boxGeometry args={[0.35, 0.5, 0.35]} />
                <meshStandardMaterial color="#2a3348" roughness={0.8} metalness={0.25} />
              </mesh>
              {/* Blinking Power Indicator */}
              <mesh position={[0, -0.15, 0.18]}>
                <sphereGeometry args={[0.035, 8, 8]} />
                <meshBasicMaterial color="#00e5ff" />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
  );
}
