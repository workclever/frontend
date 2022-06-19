import { EuiMarkdownFormat } from "@elastic/eui";

export const EditorToRenderer: React.FC<{
  value: string;
  onClick?: () => void;
}> = ({ value, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{ width: "100%", height: "100%", cursor: "text" }}
    >
      <EuiMarkdownFormat>{value}</EuiMarkdownFormat>
    </div>
  );
};
