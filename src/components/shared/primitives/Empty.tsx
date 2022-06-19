import { Empty as AntdEmpty } from "antd";

type Props = {
  children: any;
};

export const Empty: React.FC<Props> = ({ children }) => (
  <AntdEmpty description={children} />
);
