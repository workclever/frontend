import {
  CloseCircleOutlined,
  DeleteFilled,
  EditOutlined,
} from "@ant-design/icons";
import { EditableProTable, ProColumns } from "@ant-design/pro-components";
import { TableProps } from "antd";
import React from "react";
import { BaseOutput } from "../../types/BaseOutput";
import { Button } from "./primitives/Button";
import { Title } from "./primitives/Title";
import { Tooltip } from "./primitives/Tooltip";

type Props<T> = {
  title?: string;
  columns: ProColumns<T>[];
  dataSource: TableProps<T>["dataSource"];
  create?: {
    triggerText: string;
    execute: (params: any) => void;
  };
  edit?: {
    modalTitle: string;
    execute: (item: T, params: any) => void;
  };
  delete?: {
    modalTitle: string;
    execute: (item: T) => void;
  };
  result?: BaseOutput<any>;
};

export const CrudEditor = <T,>({
  title,
  columns,
  dataSource,
  create,
  edit,
  delete: _delete,
}: Props<T>) => {
  const [editableKeys, setEditableRowKeys] = React.useState<React.Key[]>([]);
  const isCreateSupported = !!create;
  // const isEditSupported = !!edit;
  const isDeleteSupported = !!_delete;

  const computedColumns: ProColumns<T>[] = React.useMemo(() => {
    // TOOD: clone
    const newColumns = columns || [];
    newColumns.push({
      title: "Action",
      valueType: "option",
      render: (_, record, _1, action) => [
        <span
          key="editable"
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            action?.startEditable?.(record["Id"]);
          }}
          style={{ cursor: "pointer" }}
        >
          <EditOutlined /> {edit?.modalTitle}
        </span>,
      ],
    });
    return newColumns as ProColumns<T>[];
  }, [columns, edit]);

  const getActions = (defaultDom: {
    save: React.ReactNode;
    delete: React.ReactNode;
    cancel: React.ReactNode;
  }) => {
    const doms = [];
    if (isCreateSupported) {
      doms.push(defaultDom.save);
      doms.push(defaultDom.cancel);
    }
    if (isDeleteSupported) {
      doms.push(defaultDom.delete);
    }
    return doms;
  };

  return (
    <>
      {title && <Title level={5}>{title}</Title>}
      <EditableProTable
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        columns={computedColumns}
        tableStyle={{ padding: 0 }}
        rowKey="Id"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        value={dataSource}
        size="small"
        editable={{
          type: "multiple",
          editableKeys,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onSave: (_, data, row) => {
            console.log("values", data);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (data["__entityType"] && data["__entityType"] === "NEW") {
              if (create?.execute) {
                create.execute(data);
              }
            } else {
              if (edit?.execute) {
                edit.execute(row as T, data);
              }
            }
          },
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onDelete: (_, row) => {
            if (_delete?.execute) {
              _delete.execute(row as T);
            }
          },
          onChange: setEditableRowKeys,
          deletePopconfirmMessage: "Are you sure to delete this item?",
          onlyOneLineEditorAlertMessage:
            "Only one row can be edited at same time",
          onlyAddOneLineAlertMessage: "You can add one row at a time",
          saveText: (
            <Button type="primary" size="small">
              Save
            </Button>
          ),
          deleteText: (
            <Tooltip
              title={_delete?.modalTitle || "Delete row?"}
              placement="bottom"
            >
              <Button danger ghost size="small">
                <DeleteFilled />
              </Button>
            </Tooltip>
          ),
          cancelText: (
            <Tooltip title={"Cancel operation"} placement="bottom">
              <Button size="small">
                <CloseCircleOutlined />
              </Button>
            </Tooltip>
          ),
          actionRender: (row, config, defaultDom) => getActions(defaultDom),
        }}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        recordCreatorProps={
          isCreateSupported
            ? {
                creatorButtonText: create?.triggerText,
                position: "bottom",
                record: () => ({
                  Id: "-",
                  __entityType: "NEW",
                }),
              }
            : undefined
        }
      />
    </>
  );
};
