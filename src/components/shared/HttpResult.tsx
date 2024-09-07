import { SerializedError } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { Alert } from "./primitives/Alert";
import { BaseOutput } from "../../types/BaseOutput";

type Props = {
  error?:
    | {
        data: BaseOutput<unknown>;
      }
    | SerializedError;
  result?: BaseOutput<unknown>;
};

export const HttpResult: React.FC<Props> = ({ error, result }) => {
  if (result && result.Succeed) {
    return <Alert message={"Successful operation"} type={"success"} />;
  }

  if (!error) {
    return null;
  }

  if ("data" in error && error.data) {
    return <Alert message={error.data.Message} type={"error"} />;
  }

  return (
    <Alert
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      message={error.error || "Unexpected error happened"}
      type={"error"}
    />
  );
};
