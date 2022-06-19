import { EditOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, UploadProps, Upload } from "antd";
import { RcFile, UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import React from "react";
import { useSelector } from "react-redux";
import ImgCrop from "antd-img-crop";
import styled from "styled-components";
import { BACKEND_URL, API_URL } from "../../constants";
import { useMe } from "../../hooks/useMe";
import { selectAuthToken } from "../../slices/authSlice";

const computeAvatarUrl = (url?: string) => {
  if (!url) {
    return "";
  }
  return `${BACKEND_URL}${url}`;
};

const ExistingAvatarWrapper = styled.div`
  position: relative;
`;

const EditIconWrapper = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--gray1);
`;

export const UploadAvatarButton = () => {
  const { me } = useMe();
  const token = useSelector(selectAuthToken);
  const [loading, setLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState<string | undefined>(
    computeAvatarUrl(me?.AvatarUrl)
  );
  const [showEditAvatarIcon, setShowEditAvatarIcon] = React.useState(false);

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const onChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      const accessUrl = info.file.response.Data;
      setImageUrl(computeAvatarUrl(accessUrl));
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const props: UploadProps = {
    name: "file",
    action: `${API_URL}/User/ChangeAvatar`,
    showUploadList: false,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    beforeUpload,
    onChange,
  };

  const existingAvatar = () => {
    if (loading) {
      return <LoadingOutlined></LoadingOutlined>;
    }
    return (
      <ExistingAvatarWrapper>
        <img
          src={imageUrl}
          alt="avatar"
          style={{ width: "100%" }}
          onMouseEnter={() => {
            setShowEditAvatarIcon(true);
          }}
          onMouseLeave={() => {
            setShowEditAvatarIcon(false);
          }}
        />
        {showEditAvatarIcon && (
          <EditIconWrapper>
            <EditOutlined style={{ fontSize: 25 }} />
          </EditIconWrapper>
        )}
      </ExistingAvatarWrapper>
    );
  };

  return (
    <ImgCrop
      rotate
      modalTitle="Crop image"
      modalOk="Upload"
      modalCancel="Cancel"
    >
      <Upload
        name="file"
        listType="picture-card"
        {...props}
        style={{ width: 40 }}
      >
        {imageUrl ? existingAvatar() : uploadButton}
      </Upload>
    </ImgCrop>
  );
};
