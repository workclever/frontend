import { ModalForm, ProForm, ProFormSelect } from "@ant-design/pro-components";
import { HttpResult } from "@app/components/shared/HttpResult";
import {
  useGetAllRolesQuery,
  useGetUserRolesQuery,
  useAddUserToRolesMutation,
} from "@app/services/api";
import { BasicUserOutput } from "@app/types/Project";

type FormValuesType = {
  UserId: number;
  Roles: string[];
};

export const EditRolesModal: React.FC<{
  editingUser: BasicUserOutput;
  onExit: () => void;
}> = ({ editingUser, onExit }) => {
  const { data: allRoles } = useGetAllRolesQuery(null);
  const allRolesData = allRoles?.Data || [];

  const { data: userRoles, isSuccess: isUserRolesLoaded } =
    useGetUserRolesQuery(editingUser.Id);
  const userRolesData = userRoles?.Data || [];

  const [
    addUserToRoles,
    { data: addUserToRolesResult, error: addUserToRolesError },
  ] = useAddUserToRolesMutation();

  const onFinish = async (values: FormValuesType) => {
    await addUserToRoles({
      UserId: editingUser.Id,
      Roles: values.Roles,
    });
  };

  if (!isUserRolesLoaded) {
    return null;
  }

  return (
    <ModalForm<FormValuesType>
      title={`Edit roles of ${editingUser.Email}`}
      visible
      autoFocusFirstInput
      modalProps={{
        width: 400,
        cancelText: "Cancel",
        okText: "Save",
        onCancel: onExit,
      }}
      onFinish={async (values) => {
        onFinish(values);
      }}
    >
      <ProForm.Group>
        <ProFormSelect
          name="Roles"
          label="Select roles"
          fieldProps={{
            mode: "multiple",
          }}
          width="md"
          rules={[
            {
              required: false,
              message: "Select roles for user",
              type: "array",
            },
          ]}
          options={allRolesData.map((r) => ({
            label: r.Name,
            value: r.Name,
          }))}
          initialValue={userRolesData}
        />
      </ProForm.Group>
      <HttpResult error={addUserToRolesError} result={addUserToRolesResult} />
    </ModalForm>
  );
};
