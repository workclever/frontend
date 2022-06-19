import { flatten } from "lodash";

export const optimisticUpdateDependOnApi = async (
  httpUpdate: any,
  ...stateUpdates: any[]
) => {
  // first optimisticly update state
  const patchCollections = flatten(stateUpdates.map((update) => update()));
  if (patchCollections.length === 0) {
    return;
  }
  // then the DB via api
  try {
    const output = await httpUpdate().unwrap();
    // if the request has error, revert the update
    if (!output.Succeed) {
      patchCollections.map((patch) => patch.undo());
    }
  } catch (e) {
    patchCollections.map((patch) => patch.undo());
  }
};
