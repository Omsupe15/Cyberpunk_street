'use client';
import { RoadwaySurface } from './environment/RoadwaySurface';
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
    </group>
  );
}
