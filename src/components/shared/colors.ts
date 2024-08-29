import {
  blue,
  cyan,
  gold,
  green,
  lime,
  magenta,
  orange,
  purple,
  red,
} from "@ant-design/colors";
import { sample } from "lodash";

// see below
export type PresetColor = string;

export const presetToHexMap: { [key: PresetColor]: string } = {
  magenta: String(magenta.primary),
  red: String(red.primary),
  orange: String(orange.primary),
  gold: String(gold.primary),
  lime: String(lime.primary),
  green: String(green.primary),
  cyan: String(cyan.primary),
  blue: String(blue.primary),
  purple: String(purple.primary),
};

export const colors: PresetColor[] = Object.values(presetToHexMap);
export const randomColor = () => sample(colors);
