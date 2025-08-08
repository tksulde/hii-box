/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCallback, useState, useEffect } from "react";
import {
  get_request,
  patch_request,
  delete_request,
  post_request,
} from "@/services/crud";
import { Input } from "@/components/ui/input";
import DynamicTable, { ColumnDef } from "@/components/dynamic-table";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SocialTasksPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [socialTasks, setSocialTasks] = useState<SocialTask[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  const initialSocialTask: SocialTask = {
    id: 0,
    task_type: "",
    link: "",
    platform: "",
    reward_key_count: 0,
  };

  const columns: ColumnDef[] = [
    {
      key: "platform",
      label: "Platform",
      sortable: true,
    },
    {
      key: "task_type",
      label: "Task Type",
      sortable: true,
    },
    {
      key: "link",
      label: "Link",
      sortable: true,
      render: (value: unknown) => (
        <a href={String(value)} target="_blank" rel="noopener noreferrer">
          {String(value)}
        </a>
      ),
    },
    { key: "reward_key_count", label: "Reward Key Count", sortable: true },
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
      const res = await get_request("/dashboard/social-tasks");
      setSocialTasks(res.data);
    } catch (error) {
      console.error("Error fetching social tasks:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleAdd = useCallback(
    async (social_task: any) => {
      setActionLoading(true);
      try {
        // Validate collection_address format
        const { task_type, reward_key_count, link, platform } = social_task;
        if (!task_type || !reward_key_count || !link || !platform) {
          toast("Error", {
            description: "All fields are required",
            duration: 3000,
          });
          return;
        }

        const response = await post_request(
          "/dashboard/social-tasks",
          social_task,
          {
            "Content-Type": "application/json",
          }
        );

        if (response.status === 201) {
          getData();

          toast("Success", {
            description: "New social task created successfully",
          });
          return response.data;
        } else {
          toast("Error", {
            description:
              response.data.detail || "Error creating new social task",
            duration: 3000,
          });
          return response.data;
        }
      } catch (error: any) {
        console.error("Error adding social task:", error);
        toast("Error", {
          description: error.message || "Error creating new social task",
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
    async (social_task: any) => {
      setActionLoading(true);
      try {
        const { id, task_type, reward_key_count, link, platform } = social_task;

        const patchData = {
          id,
          task_type,
          reward_key_count,
          link,
          platform,
        };

        const response = await patch_request(
          "/dashboard/social-tasks",
          social_task.id!,
          patchData,
          "application/json"
        );
        if (response.status === 200) {
          toast("Success", {
            description: "Social Task updated successfully",
          });

          getData();

          return response.data;
        } else {
          toast("Error", {
            description:
              response.data.detail ||
              "An error occurred while updating the social_task",
            duration: 3000,
          });

          return response.data;
        }
      } catch (error: any) {
        console.error("Error updating social task:", error);
        toast("Error", {
          description:
            error.message || "An error occurred while updating the social task",
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
    async (id: number) => {
      setActionLoading(true);
      try {
        const response = await delete_request("/dashboard/social-tasks", id);
        if (response.status == 200) {
          getData();
          toast("Success", {
            description: "Social Task deleted successfully",
          });
        } else {
          toast("Error", {
            description:
              response.data.detail ||
              "An error occurred while updating the social task",
            duration: 3000,
          });
        }
      } catch (error: any) {
        console.error("Error deleting social task:", error);

        toast("Error", {
          description:
            error.message || "An error occurred while deleting the social task",
          duration: 3000,
        });
      } finally {
        setActionLoading(false);
      }
    },
    [getData]
  );

  const handleDeleteMultiple = useCallback(
    async (ids: number[]) => {
      setActionLoading(true);
      try {
        const deletePromises = ids.map((id) =>
          delete_request("/dashboard/social-tasks", id)
            .then((response) => {
              if (response.status !== 200) {
                throw new Error(`Failed to delete social task with ID: ${id}`);
              }
            })
            .catch((error) => {
              console.error(`Error deleting social task with ID: ${id}`, error);
              throw error;
            })
        );

        await Promise.all(deletePromises);

        getData();

        toast("Success", {
          description: "Social Task deleted successfully",
        });
      } catch (error: any) {
        console.error("Error deleting multiple socialTasks:", error);
        toast("Error", {
          description:
            error.message || "An error occurred while deleting the social task",
          duration: 3000,
        });
      } finally {
        setActionLoading(false);
      }
    },
    [getData]
  );

  const handleFilterChange = async (field: string, value: string) => {
    // setCurrentFilter(value || null);
    setActionLoading(true);
    try {
      const baseUrl = "/dashboard/social-tasks";
      let url = baseUrl;
      if (value) {
        const params = new URLSearchParams();
        params.append(field, value);
        url = `${baseUrl}?${params.toString()}`;
      }
      const res = await get_request(url);
      setSocialTasks(res.data);
    } catch (error) {
      console.error("Error applying filter:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const renderFormFields = (
    formData: any,
    handleChange: (field: string, value: unknown) => void
    // type: "add" | "edit"
  ) => {
    return (
      <div className="py-4">
        <div className="flex gap-4 items-center mb-4">
          <label htmlFor="platform" className="font-medium w-1/4">
            Platform
          </label>
          <Input
            id="platform"
            type="text"
            className="flex-1"
            value={formData.platform || ""}
            onChange={(e) => handleChange("platform", e.target.value)}
          />
        </div>
        <div className="flex gap-4 items-center mb-4">
          <label htmlFor="link" className="font-medium w-1/4">
            Link
          </label>
          <Input
            id="link"
            type="url"
            className="flex-1"
            value={formData.link || ""}
            onChange={(e) => handleChange("link", e.target.value)}
          />
        </div>
        <div className="flex gap-4 items-center mb-4">
          <label htmlFor="task_type" className="font-medium w-1/4">
            Task Type
          </label>
          <Select
            value={formData.task_type || ""}
            onValueChange={(value) => handleChange("task_type", value)}
            required
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a Task Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="follow">Follow</SelectItem>
              <SelectItem value="retweet">Retweet</SelectItem>
              <SelectItem value="comment">Comment</SelectItem>
              <SelectItem value="join">Join</SelectItem>
              <SelectItem value="visit">Visit</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4 items-center mb-4">
          <label htmlFor="reward_key_count" className="font-medium w-1/4">
            Reward Key Count
          </label>
          <Input
            id="reward_key_count"
            type="number"
            className="flex-1"
            value={formData.reward_key_count || ""}
            onChange={(e) => handleChange("reward_key_count", e.target.value)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">SocialTasks</h1>
        <p className="text-gray-500">Here you can manage your socialTasks.</p>
      </div>
      <div className="rounded-md border p-6">
        <DynamicTable
          data={socialTasks}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDeleteMultiple={handleDeleteMultiple}
          onFilterChange={handleFilterChange}
          initialFormData={initialSocialTask}
          renderFormFields={renderFormFields}
          isLoading={isLoading || actionLoading}
          title="Social Tasks"
          description="Manage system socialTasks and their roles"
          showSearch={true}
          showFilters={true}
          showActions={true}
          emptyMessage="No socialTasks found. Click 'Add New' to create a social task."
        />
      </div>
    </div>
  );
}
