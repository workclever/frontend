import { EditableProTable, ProColumns } from "@ant-design/pro-components";
import React from "react";
import { Button } from "./primitives/Button";
import { Tooltip } from "./primitives/Tooltip";
import { PencilIcon, TrashIcon, XIcon } from "lucide-react";

type Props<T> = {
  title?: string;
  columns: ProColumns<T>[];
  dataSource: T[];
  create?: {
    triggerText: string;
    execute: (params: T) => void;
  };
  edit?: {
    triggerText: string;
    execute: (item: T, params: T) => void;
  };
  delete?: {
    triggerText: string;
    execute: (item: T) => void;
  };
};

export const CrudEditor = <T,>({
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
          <PencilIcon size={12} /> {edit?.triggerText}
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
    <div className="crud-editor">
      <EditableProTable
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        columns={computedColumns}
        tableStyle={{ padding: 0 }}
        style={{ padding: 0 }}
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (data["__entityType"] && data["__entityType"] === "NEW") {
              if (create?.execute) {
                create.execute(data as T);
              }
            } else {
              if (edit?.execute) {
                edit.execute(row as T, data as T);
              }
            }
          },
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onDelete: (_, row) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (row["__entityType"] && row["__entityType"] === "NEW") {
              return;
            }
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
              title={_delete?.triggerText || "Delete row?"}
              placement="bottom"
            >
              <Button danger ghost size="small">
                <TrashIcon size={12} />
              </Button>
            </Tooltip>
          ),
          cancelText: (
            <Tooltip title={"Cancel operation"} placement="bottom">
              <Button size="small">
                <XIcon size={12} />
              </Button>
            </Tooltip>
          ),
          actionRender: (_row, _config, defaultDom) => getActions(defaultDom),
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
    </div>
  );
};
