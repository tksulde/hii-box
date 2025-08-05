/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCallback, useState, useEffect } from "react";
import {
  get_request,
  post_request,
  patch_request,
  delete_request,
} from "@/services/crud";
import { Input } from "@/components/ui/input";
import DynamicTable, { ColumnDef } from "@/components/dynamic-table";
import { toast } from "sonner";
import Image from "next/image";

export default function SupportedNFTCollectionsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [supportedNFTCollections, setSupportedNFTCollections] = useState<
    SupportedNFTCollection[]
  >([]);
  const [actionLoading, setActionLoading] = useState(false);
  // const [currentFilter, setCurrentFilter] = useState<string | null>(null);

  const initialSupportedNFTCollection: SupportedNFTCollection = {
    id: 0,
    collection_name: "",
    collection_address: "",
    description: "",
    image_url: "",
    website_url: "",
    created_at: "",
    updated_at: "",
  };

  const columns: ColumnDef[] = [
    {
      key: "collection_name",
      label: "Collection Name",
      sortable: true,
      filterable: true,
    },
    {
      key: "collection_address",
      label: "Collection Address",
      sortable: true,
      render: (value: unknown) =>
        value
          ? String(value).substring(0, 5) +
            "..." +
            String(value).substring(String(value).length - 7)
          : "--",
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
      render: (value: unknown) =>
        value ? String(value).substring(0, 50) + "..." : "--",
    },
    {
      key: "image_url",
      label: "Image",
      render: (value: unknown) =>
        value ? (
          <Image src={String(value)} alt="Collection" className="h-10 w-10" />
        ) : (
          "--"
        ),
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
      const res = await get_request("/dashboard/supported-nft-collections");
      setSupportedNFTCollections(res.data);
    } catch (error) {
      console.error("Error fetching supported NFT collections:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  console.log(supportedNFTCollections);

  const handleAdd = useCallback(
    async (supported_nft_collection: any) => {
      setActionLoading(true);
      try {
        // Validate collection_address format
        const { collection_address, collection_name } =
          supported_nft_collection;
        if (!collection_address.startsWith("0x")) {
          toast("Error", {
            description: "Collection address must start with '0x'",
            duration: 3000,
          });
          return;
        }
        if (!collection_name || !collection_address) {
          toast("Error", {
            description: "Collection name and address are required",
            duration: 3000,
          });
          return;
        }

        const response = await post_request(
          "/dashboard/supported-nft-collections",
          supported_nft_collection,
          {
            "Content-Type": "application/json",
          }
        );

        // Refresh the supportedNFTCollections list
        if (response.status === 201) {
          getData();

          toast("Success", {
            description: "New supported nft collection created successfully",
          });
          return response.data;
        } else {
          toast("Error", {
            description:
              response.data.detail ||
              "Error creating new supported nft collection",
            duration: 3000,
          });
          return response.data;
        }
      } catch (error: any) {
        console.error("Error adding supported_nft_collection:", error);
        toast("Error", {
          description:
            error.message || "Error creating new supported nft collection",
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
    async (supported_nft_collection: any) => {
      setActionLoading(true);
      try {
        // // Validate collection_address format
        // if (!supported_nft_collection.collection_address?.includes("@")) {
        //   throw new Error("Please enter a valid collection_address address");
        // }
        const {
          id,
          collection_address,
          collection_name,
          description,
          image_url,
          website_url,
        } = supported_nft_collection;

        const patchData = {
          id,
          collection_name,
          collection_address,
          description,
          image_url,
          website_url,
        };

        if (!collection_address.startsWith("0x")) {
          toast("Error", {
            description: "Collection address must start with '0x'",
            duration: 3000,
          });
          return;
        }
        if (!collection_name || !collection_address) {
          toast("Error", {
            description: "Collection name and address are required",
            duration: 3000,
          });
          return;
        }

        const response = await patch_request(
          "/dashboard/supported-nft-collections",
          supported_nft_collection.id!,
          patchData,
          "application/json"
        );
        if (response.status === 200) {
          toast("Success", {
            description: "Supported NFT Collection updated successfully",
          });

          // Refresh the supportedNFTCollections list
          getData();

          return response.data;
        } else {
          toast("Error", {
            description:
              response.data.detail ||
              "Failed to update supported nft collection",
            duration: 3000,
          });

          return response.data;
        }
      } catch (error: any) {
        console.error("Error updating supported_nft_collection:", error);
        toast("Error", {
          description:
            error.message || "Failed to update supported nft collection",
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
        const response = await delete_request(
          "/dashboard/supported-nft-collections",
          id
        );
        if (response.status == 200) {
          getData();
          toast("Success", {
            description: "Supported NFT Collection deleted successfully",
          });
        } else {
          toast("Error", {
            description: response.data.detail || "",
            duration: 3000,
          });
        }
      } catch (error: any) {
        console.error("Error deleting supported_nft_collection:", error);

        toast("Error", {
          description:
            error.message || "Failed to delete supported nft collection",
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
        // Perform delete operations for all ids in parallel
        const deletePromises = ids.map((id) =>
          delete_request("/dashboard/supported-nft-collections", id)
            .then((response) => {
              if (response.status !== 200) {
                throw new Error(
                  `Failed to delete supported_nft_collection with ID: ${id}`
                );
              }
            })
            .catch((error) => {
              console.error(
                `Error deleting supported_nft_collection with ID: ${id}`,
                error
              );
              throw error;
            })
        );

        await Promise.all(deletePromises);

        getData();

        toast("Success", {
          description: "Supported NFT collections deleted successfully",
        });
      } catch (error: any) {
        console.error(
          "Error deleting multiple supported NFT collections:",
          error
        );
        toast("Error", {
          description:
            error.message || "Failed to delete supported nft collections",
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
      const baseUrl = "/dashboard/supported-nft-collections";
      let url = baseUrl;
      if (value) {
        const params = new URLSearchParams();
        params.append(field, value);
        url = `${baseUrl}?${params.toString()}`;
      }
      const res = await get_request(url);
      setSupportedNFTCollections(res.data);
    } catch (error) {
      console.error("Error applying filter:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const renderFormFields = (
    formData: any,
    handleChange: (field: string, value: unknown) => void
  ) => {
    return (
      <div className="py-4">
        <div className="flex gap-4 items-center mb-4">
          <label htmlFor="collection_address" className="font-medium w-1/4">
            Collection Address
          </label>
          <Input
            id="collection_address"
            type="text"
            className="flex-1"
            value={formData.collection_address || ""}
            onChange={(e) => handleChange("collection_address", e.target.value)}
          />
        </div>
        <div className="flex gap-4 items-center mb-4">
          <label htmlFor="collection_name" className="font-medium w-1/4">
            Collection Name
          </label>
          <Input
            id="collection_name"
            type="text"
            className="flex-1"
            value={formData.collection_name || ""}
            onChange={(e) => handleChange("collection_name", e.target.value)}
          />
        </div>
        <div className="flex gap-4 items-center mb-4">
          <label htmlFor="description" className="font-medium w-1/4">
            Description
          </label>
          <Input
            id="description"
            type="text"
            className="flex-1"
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>
        <div className="flex gap-4 items-center mb-4">
          <label htmlFor="image_url" className="font-medium w-1/4">
            Image URL
          </label>
          <Input
            id="image_url"
            type="text"
            className="flex-1"
            value={formData.image_url || ""}
            onChange={(e) => handleChange("image_url", e.target.value)}
          />
          {formData.image_url && (
            <Image
              src={formData.image_url}
              alt="Collection"
              className="w-16 h-16 object-cover rounded"
              width={64}
              height={64}
            />
          )}
        </div>
        <div className="flex gap-4 items-center mb-4">
          <label htmlFor="website_url" className="font-medium w-1/4">
            Website URL
          </label>
          <Input
            id="website_url"
            type="text"
            className="flex-1"
            value={formData.website_url || ""}
            onChange={(e) => handleChange("website_url", e.target.value)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Supported NFT Collections</h1>
        <p className="text-gray-500">
          Here you can manage your supported NFT collections.
        </p>
      </div>
      <div className="rounded-md border p-6">
        <DynamicTable
          data={supportedNFTCollections}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDeleteMultiple={handleDeleteMultiple}
          onFilterChange={handleFilterChange}
          initialFormData={initialSupportedNFTCollection}
          renderFormFields={renderFormFields}
          isLoading={isLoading || actionLoading}
          title="Supported NFT collections"
          description="Manage supported NFT collections"
          showSearch={true}
          showFilters={true}
          showActions={true}
          emptyMessage="No supported NFT collections found. Click 'Add New' to create a supported NFT collection."
        />
      </div>
    </div>
  );
}
