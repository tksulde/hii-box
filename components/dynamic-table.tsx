/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Trash2,
  Pencil,
  Search,
  X,
  ChevronDown,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export type ModalType = "add" | "edit" | "delete" | "deleteMultiple" | null;

export interface FilterOption {
  label: string;
  value: unknown;
}

export interface ColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  filterOptions?: FilterOption[];
  render?: (value: unknown, item: DataItem) => React.ReactNode;
}

interface DynamicTableProps {
  data: DataItem[];
  columns: ColumnDef[];
  onAdd?: (item: DataItem) => Promise<void> | void;
  onEdit?: (item: DataItem) => Promise<void> | void;
  onDelete?: (id: number) => Promise<void> | void;
  onDeleteMultiple?: (ids: number[]) => Promise<void> | void;
  onFilterChange?: (field: string, value: string) => Promise<void> | void;
  initialFormData?: DataItem;
  renderFormFields?: (
    formData: DataItem,
    handleChange: (field: string, value: unknown) => void,
    type: "add" | "edit"
  ) => React.ReactNode;
  isLoading?: boolean;
  title?: string;
  description?: string;
  showSearch?: boolean;
  showFilters?: boolean;
  showActions?: boolean;
  emptyMessage?: string;
  itemsPerPage?: number;
}

interface TableSkeletonProps {
  columns: ColumnDef[];
  itemsPerPage: number;
  showActions: boolean;
}

interface HeaderSkeletonProps {
  showSearch: boolean;
  showFilters: boolean;
  showActions: boolean;
}

// Skeleton Components
const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns,
  itemsPerPage,
  showActions,
}) => (
  <div className="border rounded-md overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow>
          {showActions && (
            <TableHead className="w-12">
              <Skeleton className="h-4 w-4 mx-auto" />
            </TableHead>
          )}
          {columns.map((column) => (
            <TableHead key={column.key}>
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-20" />
                {column.sortable && <Skeleton className="h-4 w-4" />}
              </div>
            </TableHead>
          ))}
          {showActions && (
            <TableHead className="w-24">
              <Skeleton className="h-4 w-16" />
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <TableRow key={index}>
            {showActions && (
              <TableCell>
                <Skeleton className="h-4 w-4 mx-auto" />
              </TableCell>
            )}
            {columns.map((column) => (
              <TableCell key={column.key}>
                <Skeleton className="h-8 w-full max-w-32" />
              </TableCell>
            ))}
            {showActions && (
              <TableCell>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const HeaderSkeleton: React.FC<HeaderSkeletonProps> = ({
  showSearch,
  showFilters,
  showActions,
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div className="flex items-center gap-2">
      {showActions && <Skeleton className="h-9 w-20" />}
      {showFilters && <Skeleton className="h-9 w-16" />}
    </div>
    {showSearch && (
      <div className="relative w-full sm:w-auto">
        <Skeleton className="h-9 w-full sm:w-64" />
      </div>
    )}
  </div>
);

const PaginationSkeleton: React.FC = () => (
  <div className="flex justify-between items-center mt-4">
    <Skeleton className="h-4 w-48" />
    <div className="flex items-center gap-2">
      <Skeleton className="h-8 w-8" />
      <Skeleton className="h-8 w-8" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-8" />
      <Skeleton className="h-8 w-8" />
    </div>
  </div>
);

// Sub-components
interface TableHeaderComponentProps {
  columns: ColumnDef[];
  sortConfig: { key: string; direction: "asc" | "desc" | null };
  handleSort: (key: string) => void;
  showActions: boolean;
  onDelete: ((id: number) => Promise<void> | void) | undefined;
  paginatedData: DataItem[];
  selectedRows: number[];
  handleSelectAll: () => void;
  isLoading: boolean;
}

const TableHeaderComponent: React.FC<TableHeaderComponentProps> = ({
  columns,
  sortConfig,
  handleSort,
  showActions,
  onDelete,
  paginatedData,
  selectedRows,
  handleSelectAll,
  isLoading,
}) => (
  <TableHeader>
    <TableRow>
      {onDelete && showActions && (
        <TableHead className="w-12">
          <Checkbox
            checked={
              paginatedData.length > 0 &&
              paginatedData.every((row) => selectedRows.includes(row.id))
            }
            className="flex justify-center"
            onCheckedChange={handleSelectAll}
            disabled={paginatedData.length === 0 || isLoading}
          />
        </TableHead>
      )}
      {columns.map((column) => (
        <TableHead
          key={column.key}
          className={`${column.sortable ? "cursor-pointer select-none" : ""}`}
          onClick={() => column.sortable && handleSort(column.key)}
        >
          <div className="flex items-center gap-1">
            {column.label}
            {column.sortable && (
              <div className="flex flex-col">
                <ChevronDown
                  className={`h-4 w-4 ${
                    sortConfig.key === column.key
                      ? sortConfig.direction === "asc"
                        ? "text-blue-500"
                        : sortConfig.direction === "desc"
                        ? "text-blue-500 rotate-180"
                        : "text-gray-300"
                      : "text-gray-300"
                  }`}
                />
              </div>
            )}
          </div>
        </TableHead>
      ))}
      {showActions && <TableHead className="w-24">Actions</TableHead>}
    </TableRow>
  </TableHeader>
);

interface TableBodyComponentProps {
  paginatedData: DataItem[];
  columns: ColumnDef[];
  showActions: boolean;
  onDelete: ((id: number) => Promise<void> | void) | undefined;
  onEdit: ((item: DataItem) => Promise<void> | void) | undefined;
  selectedRows: number[];
  handleSelectRow: (id: number) => void;
  openModal: (type: ModalType, row?: DataItem) => void;
  isLoading: boolean;
}

const TableBodyComponent: React.FC<TableBodyComponentProps> = ({
  paginatedData,
  columns,
  showActions,
  onDelete,
  onEdit,
  selectedRows,
  handleSelectRow,
  openModal,
  isLoading,
}) => (
  <TableBody>
    {paginatedData.length === 0 ? (
      <TableRow>
        <TableCell
          colSpan={columns.length + (showActions ? 2 : 0)}
          className="text-center py-8 text-gray-500"
        >
          No matching items found.
        </TableCell>
      </TableRow>
    ) : (
      paginatedData.map((row) => (
        <TableRow key={row.id}>
          {onDelete && showActions && (
            <TableCell>
              <Checkbox
                className="flex justify-center"
                checked={selectedRows.includes(row.id)}
                onCheckedChange={() => handleSelectRow(row.id)}
                disabled={isLoading}
              />
            </TableCell>
          )}
          {columns.map((column) => (
            <TableCell key={column.key} className="py-3">
              {column.render
                ? column.render(row[column.key], row)
                : row[column.key] != null
                ? String(row[column.key])
                : ""}
            </TableCell>
          ))}
          {showActions && (
            <TableCell>
              <div className="flex gap-2">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openModal("edit", row)}
                    disabled={isLoading}
                    className="text-gray-600 hover:text-blue-500"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openModal("delete", row)}
                    disabled={isLoading}
                    className="text-gray-600 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          )}
        </TableRow>
      ))
    )}
  </TableBody>
);

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  filteredData: DataItem[];
  itemsPerPage: number;
  handlePageChange: (page: number) => void;
  isLoading: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  filteredData,
  itemsPerPage,
  handlePageChange,
  isLoading,
}) => (
  <div className="flex justify-between items-center mt-4">
    <div className="text-sm text-gray-500">
      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
      {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
      {filteredData.length} items
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1 || isLoading}
        className="text-gray-600"
      >
        First
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="text-gray-600"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="text-gray-600"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages || isLoading}
        className="text-gray-600"
      >
        Last
      </Button>
    </div>
  </div>
);

interface FilterControlsProps {
  columns: ColumnDef[];
  activeFilters: Record<string, unknown>;
  handleFilterChange: (field: string, value: unknown) => void;
  clearAllFilters: () => void;
  isLoading: boolean;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  columns,
  activeFilters,
  handleFilterChange,
  clearAllFilters,
  isLoading,
}) => {
  const filterableColumns = columns.filter(
    (col) => col.filterable && col.filterOptions
  );
  const activeFilterCount = Object.keys(activeFilters).length;

  if (filterableColumns.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 rounded-full bg-blue-500 w-5 h-5 text-xs flex items-center justify-center text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="space-y-4">
          <div className="font-medium text-sm">Filter by</div>
          {filterableColumns.map((column) => (
            <div key={column.key} className="space-y-1">
              <label className="text-xs font-medium">{column.label}</label>
              <Select
                value={activeFilters[column.key]?.toString() || "_any"}
                onValueChange={(value) =>
                  handleFilterChange(
                    column.key,
                    value === "_any" ? null : value
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_any">Any</SelectItem>
                  {column.filterOptions?.map((option) => (
                    <SelectItem
                      key={String(option.value)}
                      value={String(option.value)}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-gray-600"
              onClick={clearAllFilters}
            >
              Clear all filters
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface ModalContentProps {
  modalType: ModalType;
  title: string;
  error: string | null;
  processing: boolean;
  isLoading: boolean;
  editFormData: DataItem;
  handleEditFormChange: (field: string, value: unknown) => void;
  renderFormFields?: (
    formData: DataItem,
    handleChange: (field: string, value: unknown) => void,
    type: "add" | "edit"
  ) => React.ReactNode;
  columns: ColumnDef[];
  closeModal: () => void;
  handleAddNew: () => Promise<void>;
  handleSaveEdit: () => Promise<void>;
  handleDelete: () => Promise<void>;
  handleDeleteSelected: () => Promise<void>;
  selectedRows: number[];
}

const ModalContent: React.FC<ModalContentProps> = ({
  modalType,
  title,
  error,
  processing,
  isLoading,
  editFormData,
  handleEditFormChange,
  renderFormFields,
  columns,
  closeModal,
  handleAddNew,
  handleSaveEdit,
  handleDelete,
  handleDeleteSelected,
  selectedRows,
}) => {
  const renderDefaultFormFields = () => (
    <div className="grid gap-4 py-4">
      {columns.map((column) => (
        <div key={column.key} className="flex gap-4 items-center">
          <label htmlFor={column.key} className="text-right font-medium w-1/3">
            {column.label}
          </label>
          <Input
            id={column.key}
            className="w-2/3"
            value={(editFormData[column.key] as string) || ""}
            onChange={(e) => handleEditFormChange(column.key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );

  switch (modalType) {
    case "add":
      return (
        <>
          <DialogHeader>
            <DialogTitle>Add New {title.slice(0, -1)}</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new{" "}
              {title.toLowerCase().slice(0, -1)}
            </DialogDescription>
          </DialogHeader>
          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
          {renderFormFields
            ? renderFormFields(editFormData, handleEditFormChange, "add")
            : renderDefaultFormFields()}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeModal}
              disabled={processing || isLoading}
              className="text-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddNew}
              disabled={processing || isLoading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {processing || isLoading ? "Processing..." : "Add"}
            </Button>
          </DialogFooter>
        </>
      );
    case "edit":
      return (
        <>
          <DialogHeader>
            <DialogTitle>Edit {title.slice(0, -1)}</DialogTitle>
            <DialogDescription>
              Make changes to the selected {title.toLowerCase().slice(0, -1)}
            </DialogDescription>
          </DialogHeader>
          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
          {renderFormFields
            ? renderFormFields(editFormData, handleEditFormChange, "edit")
            : renderDefaultFormFields()}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeModal}
              disabled={processing || isLoading}
              className="text-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={processing || isLoading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {processing || isLoading ? "Processing..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </>
      );
    case "delete":
      return (
        <>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this{" "}
              {title.toLowerCase().slice(0, -1)}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={closeModal}
              disabled={processing || isLoading}
              className="text-gray-600"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={processing || isLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              {processing || isLoading ? "Processing..." : "Delete"}
            </Button>
          </DialogFooter>
        </>
      );
    case "deleteMultiple":
      return (
        <>
          <DialogHeader>
            <DialogTitle>Confirm Multiple Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedRows.length}{" "}
              {selectedRows.length === 1
                ? title.toLowerCase().slice(0, -1)
                : title.toLowerCase()}
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={closeModal}
              disabled={processing || isLoading}
              className="text-gray-600"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
              disabled={processing || isLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              {processing || isLoading
                ? "Processing..."
                : `Delete ${selectedRows.length} ${
                    selectedRows.length === 1 ? title.slice(0, -1) : title
                  }`}
            </Button>
          </DialogFooter>
        </>
      );
    default:
      return null;
  }
};

const DynamicTable: React.FC<DynamicTableProps> = ({
  data: initialData,
  columns,
  onAdd,
  onEdit,
  onDelete,
  onDeleteMultiple,
  onFilterChange,
  initialFormData = { id: 0 }, // Default to an empty DataItem
  renderFormFields,
  isLoading = false,
  title = "Items",
  // description = "Manage your items",
  showSearch = true,
  showFilters = true,
  showActions = true,
  // emptyMessage = 'No items found. Click "Add New" to create one.',
  itemsPerPage = 10,
}) => {
  const [filteredData, setFilteredData] = useState<DataItem[]>(initialData);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editFormData, setEditFormData] = useState<DataItem>(initialFormData);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>(
    {}
  );
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({ key: "", direction: null });
  const [currentPage, setCurrentPage] = useState(1);

  // Memoized paginated data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Search handler
  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      if (!term.trim()) {
        setFilteredData(initialData);
        return;
      }

      const lowercasedTerm = term.toLowerCase();
      const searchableColumns = columns.filter(
        (col) => col.searchable !== false
      );
      const filtered = initialData.filter((item) =>
        searchableColumns.some((column) => {
          const value = item[column.key];
          return (
            value != null &&
            String(value).toLowerCase().includes(lowercasedTerm)
          );
        })
      );
      setFilteredData(filtered);
    },
    [initialData, columns]
  );

  // Filter handler
  const handleFilterChange = useCallback(
    async (field: string, value: unknown) => {
      const newFilters = { ...activeFilters, [field]: value };
      if (value == null || value === "") delete newFilters[field];
      setActiveFilters(newFilters);

      // Client-side filtering
      let result = [...initialData];
      Object.entries(newFilters).forEach(([filterField, filterValue]) => {
        result = result.filter((item) => {
          const itemValue = item[filterField];
          if (itemValue == null) return false;
          if (typeof filterValue === "boolean")
            return itemValue === filterValue;
          return (
            String(itemValue).toLowerCase() ===
            String(filterValue).toLowerCase()
          );
        });
      });
      setFilteredData(result);

      // Server-side filtering
      if (onFilterChange) {
        setProcessing(true);
        try {
          // Build filter query string with & support
          const filterParts: string[] = [];

          Object.entries(newFilters).forEach(([filterField, filterValue]) => {
            if (
              filterValue !== null &&
              filterValue !== undefined &&
              filterValue !== ""
            ) {
              if (
                filterField === "created_at" ||
                filterField === "updated_at"
              ) {
                // Handle date filters
                const now = new Date();
                const fromDate = new Date();
                switch (filterValue) {
                  case "24h":
                    fromDate.setHours(now.getHours() - 24);
                    break;
                  case "7d":
                    fromDate.setDate(now.getDate() - 7);
                    break;
                  case "30d":
                    fromDate.setDate(now.getDate() - 30);
                    break;
                  case "all":
                    return; // Skip adding this filter
                  default:
                    return; // Skip unknown date filter values
                }
                // Add date range filter
                filterParts.push(
                  `${filterField}:${fromDate.toISOString()},${now.toISOString()}`
                );
              } else {
                // Add regular field:value filter
                filterParts.push(`${filterField}:${String(filterValue)}`);
              }
            }
          });

          // Join filters with & operator
          const filterQuery = filterParts.join("&");

          // Always call onFilterChange with the complete filter string
          await onFilterChange("filter_query", filterQuery);
        } catch (err) {
          console.error("Error applying filter:", err);
        } finally {
          setProcessing(false);
        }
      }
    },
    [activeFilters, initialData, onFilterChange]
  );

  // Sort handler
  const handleSort = useCallback(
    (key: string) => {
      const column = columns.find((col) => col.key === key);
      if (!column?.sortable) return;

      setSortConfig((prev) => {
        const direction =
          prev.key === key
            ? prev.direction === "asc"
              ? "desc"
              : prev.direction === "desc"
              ? null
              : "asc"
            : "asc";

        if (direction === null) {
          setFilteredData(initialData);
          return { key, direction: null };
        }

        const sorted = [...filteredData].sort((a, b) => {
          if (a[key] == null) return direction === "asc" ? -1 : 1;
          if (b[key] == null) return direction === "asc" ? 1 : -1;
          if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
          if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
          return 0;
        });

        setFilteredData(sorted);
        return { key, direction };
      });
    },
    [columns, filteredData, initialData]
  );

  // Clear filters
  const clearAllFilters = useCallback(async () => {
    setActiveFilters({});
    setFilteredData(initialData);
    if (onFilterChange) {
      setProcessing(true);
      try {
        await onFilterChange("", "");
      } catch (err) {
        console.error("Error clearing filters:", err);
      } finally {
        setProcessing(false);
      }
    }
  }, [initialData, onFilterChange]);

  // Modal handlers
  const openModal = useCallback(
    (type: ModalType, row?: DataItem) => {
      setError(null);
      setModalType(type);
      if (type === "edit" && row) {
        setEditFormData(row);
        setCurrentId(row.id);
      } else if (type === "add") {
        setEditFormData(initialFormData);
      } else if (type === "delete" && row) {
        setCurrentId(row.id);
      }
      setModalOpen(true);
    },
    [initialFormData]
  );

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalType(null);
    setEditFormData(initialFormData);
    setCurrentId(null);
    setError(null);
  }, [initialFormData]);

  // Row selection handlers
  const handleSelectRow = useCallback((id: number) => {
    if (id == null) return;
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    const currentPageIds = paginatedData.map((row) => row.id);
    setSelectedRows((prev) => {
      const allSelected = currentPageIds.every((id) => prev.includes(id));
      return allSelected
        ? prev.filter((id) => !currentPageIds.includes(id))
        : Array.from(new Set([...prev, ...currentPageIds]));
    });
  }, [paginatedData]);

  // CRUD handlers
  const handleAddNew = useCallback(async () => {
    if (!onAdd) return;
    setProcessing(true);
    setError(null);
    try {
      await onAdd(editFormData);
      closeModal();
    } catch (err: any) {
      setError(err.message || "Error adding item");
    } finally {
      setProcessing(false);
    }
  }, [onAdd, editFormData, closeModal]);

  const handleSaveEdit = useCallback(async () => {
    if (!onEdit) return;
    setProcessing(true);
    setError(null);
    try {
      await onEdit(editFormData);
      closeModal();
    } catch (err: any) {
      setError(err.message || "Error updating item");
    } finally {
      setProcessing(false);
    }
  }, [onEdit, editFormData, closeModal]);

  const handleDelete = useCallback(async () => {
    if (!onDelete || !currentId) return;
    setProcessing(true);
    setError(null);
    try {
      await onDelete(currentId);
      setSelectedRows((prev) => prev.filter((id) => id !== currentId));
      closeModal();
    } catch (err: any) {
      setError(err.message || "Error deleting item");
    } finally {
      setProcessing(false);
    }
  }, [onDelete, currentId, closeModal]);

  const handleDeleteSelected = useCallback(async () => {
    if (!onDeleteMultiple) return;
    setProcessing(true);
    setError(null);
    try {
      const rowsToDelete = selectedRows.filter((id) =>
        paginatedData.some((row) => row.id === id)
      );
      await onDeleteMultiple(rowsToDelete);
      setSelectedRows((prev) =>
        prev.filter((id) => !rowsToDelete.includes(id))
      );
      closeModal();
    } catch (err: any) {
      setError(err.message || "Error deleting items");
    } finally {
      setProcessing(false);
    }
  }, [onDeleteMultiple, selectedRows, paginatedData, closeModal]);

  const handleEditFormChange = (field: string, value: unknown) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Update filtered data when initialData changes
  useEffect(() => {
    setFilteredData(initialData);
    handleSearch(searchTerm);
  }, [initialData, handleSearch, searchTerm]);

  // Reset page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData]);

  if (isLoading && initialData.length === 0) {
    return (
      <div className="space-y-4">
        <HeaderSkeleton
          showSearch={showSearch}
          showFilters={showFilters}
          showActions={showActions}
        />
        <TableSkeleton
          columns={columns}
          itemsPerPage={itemsPerPage}
          showActions={showActions && !!(onEdit || onDelete)}
        />
        <PaginationSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          {onAdd && showActions && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => openModal("add")}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          )}
          {showFilters && (
            <FilterControls
              columns={columns}
              activeFilters={activeFilters}
              handleFilterChange={handleFilterChange}
              clearAllFilters={clearAllFilters}
              isLoading={isLoading}
            />
          )}
          {onDeleteMultiple && showActions && selectedRows.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => openModal("deleteMultiple")}
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedRows.length})
            </Button>
          )}
        </div>
        {showSearch && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search..."
              className="pl-8 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={isLoading}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full"
                onClick={() => handleSearch("")}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeaderComponent
            columns={columns}
            sortConfig={sortConfig}
            handleSort={handleSort}
            showActions={showActions}
            onDelete={onDelete}
            paginatedData={paginatedData}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            isLoading={isLoading}
          />
          <TableBodyComponent
            paginatedData={paginatedData}
            columns={columns}
            showActions={showActions}
            onDelete={onDelete}
            onEdit={onEdit}
            selectedRows={selectedRows}
            handleSelectRow={handleSelectRow}
            openModal={openModal}
            isLoading={isLoading}
          />
        </Table>
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        filteredData={filteredData}
        itemsPerPage={itemsPerPage}
        handlePageChange={setCurrentPage}
        isLoading={isLoading}
      />

      <Dialog
        open={modalOpen}
        onOpenChange={(open) => !processing && setModalOpen(open)}
      >
        <DialogContent>
          <ModalContent
            modalType={modalType}
            title={title}
            error={error}
            processing={processing}
            isLoading={isLoading}
            editFormData={editFormData}
            handleEditFormChange={handleEditFormChange}
            renderFormFields={renderFormFields}
            columns={columns}
            closeModal={closeModal}
            handleAddNew={handleAddNew}
            handleSaveEdit={handleSaveEdit}
            handleDelete={handleDelete}
            handleDeleteSelected={handleDeleteSelected}
            selectedRows={selectedRows}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DynamicTable;
