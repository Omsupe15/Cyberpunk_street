'use client';
import { RoadwaySurface } from './environment/RoadwaySurface';
import { RainParticles } from './environment/RainParticles';
import { SteamVents } from './environment/SteamVents';
import { MegastructureSkyline } from './environment/MegastructureSkyline';
import { OverheadCables } from './environment/OverheadCables';

export function StreetEnvironment() {
  return (
    <group>
      <RoadwaySurface />
      <MegastructureSkyline />
      <OverheadCables />
      <SteamVents />
      <RainParticles count={2500} />
    </group>
  );
}

