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

export const ColorMap = {
  magenta: magenta[3],
  red: red[3],
  orange: orange[3],
  gold: gold[3],
  lime: lime[3],
  green: green[3],
  cyan: cyan[3],
  blue: blue[3],
  purple: purple[3],
};

export const colors: PresetColor[] = Object.values(ColorMap);
export const randomColor = () => sample(colors);
