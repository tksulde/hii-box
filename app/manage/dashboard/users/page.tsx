"use client";
import { useCallback, useState, useEffect } from "react";
import {
  get_request,
  post_request,
  patch_request,
  delete_request,
} from "@/services/crud";
import { Input } from "@/components/ui/input";
import DynamicTable, {
  ColumnDef,
  FilterOption,
} from "@/components/dynamic-table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function UsersPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);

  const initialUser: User = {
    id: "",
    email: "",
    role: "",
    is_verified: false,
    created_at: "",
    updated_at: "",
  };

  const columns: ColumnDef[] = [
    { key: "email", label: "Email", sortable: true, searchable: true },
    {
      key: "role",
      label: "Role",
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ] as FilterOption[],
      render: (value: unknown) => {
        const role = String(value).toLowerCase();
        const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);
        return (
          <Badge variant={role === "admin" ? "default" : "secondary"}>
            {capitalizedRole}
          </Badge>
        );
      },
    },
    {
      key: "created_at",
      label: "Created At",
      sortable: true,
      render: (value: unknown) =>
        value ? new Date(String(value)).toLocaleDateString() : "--",
    },
    {
      key: "updated_at",
      label: "Updated At",
      sortable: true,
      render: (value: unknown) =>
        value ? new Date(String(value)).toLocaleDateString() : "--",
    },
  ];

  const getData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await get_request("/dashboard/user");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  console.log(users);

  const handleAdd = useCallback(
    async (newUser: any) => {
      setActionLoading(true);
      try {
        // Validate email format
        if (!newUser.email?.includes("@")) {
          throw new Error("Please enter a valid email address");
        }

        const response = await post_request("/dashboard/user", newUser, {
          "Content-Type": "application/json",
        });

        // Refresh the users list
        if (response.status === 200) {
          getData();

          toast("Амжилттай", {
            description: "Хэрэглэгч амжилттай нэмэгдлээ",
          });
          return response.data;
        } else {
          toast("Алдаа", {
            description:
              response.data.detail || "Хэрэглэгч нэмэхэд алдаа гарлаа",
            duration: 3000,
          });
          return response.data;
        }
      } catch (error: any) {
        console.error("Error adding user:", error);
        toast("Алдаа", {
          description: error.message || "Хэрэглэгч нэмэхэд алдаа гарлаа",
          duration: 3000,
        });
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    [getData]
  );

  const handleEdit = useCallback(
    async (user: any) => {
      setActionLoading(true);
      try {
        // Validate email format
        if (!user.email?.includes("@")) {
          throw new Error("Please enter a valid email address");
        }
        const { id, email, activation_expires } = user;

        const activationDate = new Date(activation_expires);
        if (isNaN(activationDate.getTime())) {
          throw new Error("Invalid activation expiration date.");
        }

        const patchData = {
          id,
          email,
          activation_expires,
        };

        const response = await patch_request(
          "/dashboard/user",
          user.id!,
          patchData,
          "application/json"
        );
        if (response.status === 200) {
          toast("Амжилттай", {
            description: "Хэрэглэгч амжилттай засагдлаа",
          });

          // Refresh the users list
          getData();

          return response.data;
        } else {
          toast("Алдаа", {
            description:
              response.data.detail || "Хэрэглэгч засах үед алдаа гарлаа",
            duration: 3000,
          });

          return response.data;
        }
      } catch (error: any) {
        console.error("Error updating user:", error);
        toast("Алдаа", {
          description: error.message || "Хэрэглэгч засах үед алдаа гарлаа",
          duration: 3000,
        });
        throw error;
      } finally {
        setActionLoading(false);
      }
    },
    [getData]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setActionLoading(true);
      try {
        const response = await delete_request("/dashboard/user", id);
        if (response.status == 200) {
          getData();
          toast("Амжилттай", {
            description: "Хэрэглэгч амжилттай устгагдлаа",
          });
        } else {
          toast("Алдаа", {
            description:
              response.data.detail || "Хэрэглэгч засах үед алдаа гарлаа",
            duration: 3000,
          });
        }
      } catch (error: any) {
        console.error("Error deleting user:", error);

        toast("Алдаа", {
          description: error.message || "Хэрэглэгч устгах үед алдаа гарлаа",
          duration: 3000,
        });
      } finally {
        setActionLoading(false);
      }
    },
    [getData]
  );

  const handleDeleteMultiple = useCallback(
    async (ids: string[]) => {
      setActionLoading(true);
      try {
        // Perform delete operations for all ids in parallel
        const deletePromises = ids.map((id) =>
          delete_request("/dashboard/user", id)
            .then((response) => {
              if (response.status !== 200) {
                throw new Error(`Failed to delete user with ID: ${id}`);
              }
            })
            .catch((error) => {
              console.error(`Error deleting user with ID: ${id}`, error);
              throw error;
            })
        );

        await Promise.all(deletePromises);

        getData();

        toast("Амжилттай", {
          description: "Хэрэглэгч амжилттай устгагдлаа",
        });
      } catch (error: any) {
        console.error("Error deleting multiple users:", error);
        toast("Алдаа", {
          description: error.message || "Хэрэглэгч устгах үед алдаа гарлаа",
          duration: 3000,
        });
      } finally {
        setActionLoading(false);
      }
    },
    [getData]
  );

  const handleFilterChange = async (field: string, value: string) => {
    setCurrentFilter(value || null);
    setActionLoading(true);
    try {
      const baseUrl = "/dashboard/user";
      let url = baseUrl;
      if (value) {
        const params = new URLSearchParams();
        params.append(field, value);
        url = `${baseUrl}?${params.toString()}`;
      }
      const res = await get_request(url);
      setUsers(res.data);
    } catch (error) {
      console.error("Error applying filter:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const renderFormFields = (
    formData: any,
    handleChange: (field: string, value: unknown) => void,
    type: "add" | "edit"
  ) => {
    return (
      <div className="py-4">
        <div className="flex gap-4 items-center mb-4">
          <label htmlFor="email" className="font-medium w-1/4">
            Email
          </label>
          <Input
            id="email"
            type="email"
            className="flex-1"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-gray-500">Here you can manage your users.</p>
      </div>
      <div className="rounded-md border p-6">
        <DynamicTable
          data={users}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDeleteMultiple={handleDeleteMultiple}
          onFilterChange={handleFilterChange}
          initialFormData={initialUser}
          renderFormFields={renderFormFields}
          isLoading={isLoading || actionLoading}
          title="Users"
          description="Manage system users and their roles"
          showSearch={true}
          showFilters={true}
          showActions={true}
          emptyMessage="No users found. Click 'Add New' to create a user."
        />
      </div>
    </div>
  );
}
