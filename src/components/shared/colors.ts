import { sample } from "lodash";

// see below
export type PresetColor = string;

export const presetToHexMap: { [key: PresetColor]: string } = {
  magenta: "var(--pink9)",
  red: "var(--red9)",
  orange: "var(--orange9)",
  gold: "var(--gold9)",
  lime: "var(--lime9)",
  green: "var(--green9)",
  cyan: "var(--cyan9)",
  blue: "var(--blue9)",
  purple: "var(--purple9)",
};

export const colors: PresetColor[] = Object.values(presetToHexMap);
export const randomColor = () => sample(colors);
