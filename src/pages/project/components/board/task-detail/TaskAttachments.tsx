import { TaskType } from "@app/types/Project";
import { Upload, message, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/lib/upload";
import { API_URL, BACKEND_URL } from "@app/constants";
import { selectAuthToken } from "@app/slices/auth/authSlice";
import { useSelector } from "react-redux";
import { useListTaskAttachmentsQuery } from "@app/services/api";
import { UploadFile } from "antd/lib/upload/interface";
import { TaskDetailBlock } from "./TaskDetailBlock";
import { Button } from "@app/components/shared/primitives/Button";

export const TaskAttachments: React.FC<{ task: TaskType }> = ({ task }) => {
  const token = useSelector(selectAuthToken);
  const { data: attachments, refetch } = useListTaskAttachmentsQuery(task.Id);
  const attachmentsData = attachments?.Data || [];

  const props: UploadProps = {
    name: "file",
    action: `${API_URL}/Task/UploadTaskAttachmentInput?taskId=${task.Id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    showUploadList: {
      showRemoveIcon: false,
    },
    onChange(info: UploadChangeParam) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} uploaded successfully`);
        refetch();
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} upload failed.`);
      }
    },
  };

  const defaultFileList: UploadFile[] = attachmentsData.map((r) => ({
    name: r.Name,
    uid: r.AttachmentUrl,
    url: `${BACKEND_URL}${r.AttachmentUrl}`,
  }));

  return (
    <TaskDetailBlock
      title="Attachments"
      showPlusIcon={false}
      defaultExpanded={defaultFileList.length > 0}
    >
      <Upload
        key={defaultFileList.length}
        {...props}
        defaultFileList={defaultFileList}
      >
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </TaskDetailBlock>
  );
};
