import {
  EuiMarkdownEditor,
  EuiMarkdownEditorProps,
  EuiMarkdownParseError,
} from "@elastic/eui";
import React from "react";

type Props = {
  showToolbar: boolean;
  value?: string;
  onChange?: (newValue: string) => void;
  height?: number;
  initialViewMode: EuiMarkdownEditorProps["initialViewMode"];
};

export const AppEditor: React.FC<Props> = ({
  value,
  onChange,
  height = 350,
  initialViewMode,
}) => {
  const [_value, setValue] = React.useState(value || "");
  const [messages, setMessages] = React.useState([]);

  const _onChange = (e: string) => {
    setValue(e);
    onChange && onChange(e);
  };

  const onParse = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error: EuiMarkdownParseError | null, { messages }: any) => {
      setMessages(error ? [error] : messages);
    },
    []
  );

  return (
    <EuiMarkdownEditor
      aria-label="Editor"
      placeholder="Type something..."
      value={_value}
      onChange={_onChange}
      height={height}
      onParse={onParse}
      errors={messages}
      readOnly={false}
      initialViewMode={initialViewMode}
    />
  );
};
