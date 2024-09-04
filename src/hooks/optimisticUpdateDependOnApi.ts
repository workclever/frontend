import { BaseOutput } from "@app/types/BaseOutput";
import { flatten } from "lodash";
import { AnyAction } from "redux-saga";

type HttpUpdateType = () => {
  unwrap: () => Promise<BaseOutput<unknown>>;
};

export const optimisticUpdateDependOnApi = async (
  httpUpdate: HttpUpdateType,
  ...stateUpdates: (() => AnyAction[])[]
) => {
  const patchCollections = flatten(stateUpdates.map((update) => update()));
  if (patchCollections.length === 0) {
    return;
  }

  try {
    const output = await httpUpdate().unwrap();
    if (!output.Succeed) {
      patchCollections.forEach((patch) => patch.undo());
    }
  } catch (e) {
    console.log("undoing patchCollections because of error", e);
    patchCollections.forEach((patch) => patch.undo());
  }
};
