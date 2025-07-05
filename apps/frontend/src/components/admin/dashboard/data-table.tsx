"use client"


import * as React from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconCash,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  
  IconCircleCheckFilled,
  
  IconDotsVertical,
  
  IconLayoutColumns,
  
  IconPlus,
  IconTrendingDown,
  IconUsers,
  
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Tooltip } from "../../ui/tooltip"

export const schema = z.object({
  id: z.number(),
  name: z.string(),
  position: z.string(),
  department: z.string(),
  status: z.enum(["Active", "On Leave", "Terminated"]),
  salary: z.number(),
  email: z.string().email(),
  startDate: z.date(),
});

// Create a separate component for the drag handle



const columns: ColumnDef<z.infer<typeof schema>>[] = [
  // Drag handle remains same
  // Selection checkbox remains same
  {
    accessorKey: "name",
    header: "Employee Name",
    cell: ({ row }) => {
      return <TableCellViewer employee={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "position",
    header: "Position",
    cell: ({ row }) => (
      <div className="w-40">
        <Badge className="outline">
          {row.original.position}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      const statusColor = {
        Active: "bg-green-500 text-white",
        "On Leave": "bg-yellow-500 text-black",
        Terminated: "bg-red-500 text-white"
      }[status]
      
      return <Badge className={`${statusColor} hover:${statusColor}`}>{status}</Badge>
    },
  },
  {
    accessorKey: "salary",
    header: "Salary",
    cell: ({ row }) => (
      <div className="text-right">
        ${row.original.salary.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <a 
        href={`mailto:${row.original.email}`}
        className="hover:underline text-primary"
      >
        {row.original.email}
      </a>
    ),
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800">
  <IconDotsVertical className="h-4 w-4" />
</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit Profile</DropdownMenuItem>
          <DropdownMenuItem>Assign Role</DropdownMenuItem>
          <DropdownMenuItem>View Attendance</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900">
  Terminate Employment
</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

// Generate department distribution data
const departmentData = [
  { name: 'Engineering', value: 45 },
  { name: 'Sales', value: 25 },
  { name: 'Marketing', value: 15 },
  { name: 'Human Resources', value: 8 },
  { name: 'Finance', value: 7 },
  { name: 'Operations', value: 15 },
  { name: 'IT', value: 10 },
  { name: 'Support', value: 5 },
]

// Generate salary distribution data
const salaryData = [
  { range: '<50k', count: 12 },
  { range: '50-75k', count: 25 },
  { range: '75-100k', count: 35 },
  { range: '100-150k', count: 20 },
  { range: '150k+', count: 8 },
]

// Generate employment status trends (last 12 months)
const statusData = Array.from({ length: 12 }, (_, i) => {
  const baseDate = new Date()
  baseDate.setMonth(baseDate.getMonth() - i)
  return {
    month: baseDate.toLocaleString('default', { month: 'short' }),
    active: Math.floor(200 + Math.random() * 30 - i * 2),
    onLeave: Math.floor(5 + Math.random() * 3),
    terminated: Math.floor(2 + Math.random() * 1)
  }
}).reverse()

// Generate tenure analysis data
const tenureData = [
  { year: 2018, hires: 15, separations: 2 },
  { year: 2019, hires: 22, separations: 5 },
  { year: 2020, hires: 18, separations: 8 },
  { year: 2021, hires: 35, separations: 12 },
  { year: 2022, hires: 45, separations: 15 },
  { year: 2023, hires: 38, separations: 18 },
]

// Colors for pie chart
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#A28DFF', '#FF66C4', '#4ECDC4', '#FF6B6B'
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <Tabs
      defaultValue="employee-list"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="employee-list">
         
          <SelectContent>
            <SelectItem value="employee-list">Employee List</SelectItem>
            <SelectItem value="analytics">Analytics</SelectItem>
            
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="employee-list">Employee List</TabsTrigger>
          <TabsTrigger value="analytics">
            Analytics 
            
          </TabsTrigger>
          
          
        </TabsList>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="outline h-8 px-2 py-1 text-sm">
  <IconLayoutColumns />
  <span className="hidden lg:inline">Customize Columns</span>
  <span className="lg:hidden">Columns</span>
  <IconChevronDown />
</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value: boolean) =>
  column.toggleVisibility(!!value)
}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
  className="hidden lg:flex border border-gray-300 bg-white hover:bg-gray-100 h-8 px-2 py-1 text-sm"
  onClick={() => {
    setData((old) => [
      ...old,
      {
        id: Math.random(),
        name: "New Employee",
        position: "New Position",
        department: "New Department",
        status: "Active",
        salary: 0,
        email: "  ",
        startDate: new Date(),
      },
    ])
  }}
>
  <IconPlus className="size-4" />
</Button>
            
        </div>
      </div>
      <TabsContent
  value="employee-list"
  className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
>
  <div className="overflow-hidden rounded-lg border">
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      id={sortableId}
    >
      <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead 
                    key={header.id} 
                    colSpan={header.colSpan}
                    className={header.column.id === 'salary' ? 'text-right' : ''}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            <SortableContext
              items={dataIds}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows.map((row) => (
                <DraggableRow key={row.id} row={row} />
              ))}
            </SortableContext>
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </DndContext>
  </div>
  <div className="flex items-center justify-between px-4">
    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
      {table.getFilteredSelectedRowModel().rows.length} of{" "}
      {table.getFilteredRowModel().rows.length} row(s) selected.
    </div>
    <div className="flex w-full items-center gap-8 lg:w-fit">
      <div className="hidden items-center gap-2 lg:flex">
        <Label htmlFor="rows-per-page" className="text-sm font-medium">
          Rows per page
        </Label>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value: string) => {
  table.setPageSize(Number(value))
}}
        >
          <SelectTrigger className="w-20 text-sm py-1" id="rows-per-page">
  <SelectValue placeholder={table.getState().pagination.pageSize} />
</SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex w-fit items-center justify-center text-sm font-medium">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </div>
      <div className="ml-auto flex items-center gap-2 lg:ml-0">
        <Button
        
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>
          <IconChevronsLeft />
        </Button>
        <Button
  className="size-8"
  onClick={() => table.previousPage()}
  disabled={!table.getCanPreviousPage()}
>
  <span className="sr-only">Go to previous page</span>
  <IconChevronLeft />
</Button>
<Button
  className="size-8"
  onClick={() => table.nextPage()}
  disabled={!table.getCanNextPage()}
>
  <span className="sr-only">Go to next page</span>
  <IconChevronRight />
</Button>
        <Button
  className="hidden size-8 lg:flex"
  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
  disabled={!table.getCanNextPage()}
>
  <span className="sr-only">Go to last page</span>
  <IconChevronsRight />
</Button>
      </div>
    </div>
  </div>
</TabsContent>

<TabsContent value="analytics" className="flex flex-col px-4 lg:px-6">
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
    {/* Summary Cards */}
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Total Employees</h3>
          <p className="text-2xl font-bold">247</p>
        </div>
        <IconUsers className="size-6 text-primary" />
      </div>
    </div>

    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Active Employees</h3>
          <p className="text-2xl font-bold">214</p>
        </div>
        <IconCircleCheckFilled className="size-6 text-green-500" />
      </div>
    </div>

    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Avg. Salary</h3>
          <p className="text-2xl font-bold">$85k</p>
        </div>
        <IconCash className="size-6 text-blue-500" />
      </div>
    </div>

    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Turnover Rate</h3>
          <p className="text-2xl font-bold">4.2%</p>
        </div>
        <IconTrendingDown className="size-6 text-red-500" />
      </div>
    </div>
  </div>

  <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
    {/* Department Distribution */}
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold">Department Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={departmentData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {departmentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Salary Distribution */}
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold">Salary Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salaryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Employee Status Breakdown */}
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold">Employment Status</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="active"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              type="monotone"
              dataKey="onLeave"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
            <Area
              type="monotone"
              dataKey="terminated"
              stackId="1"
              stroke="#ffc658"
              fill="#ffc658"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Tenure Analysis */}
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold">Employee Tenure</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={tenureData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="hires"
              stroke="#8884d8"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="separations"
              stroke="#82ca9d"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
</TabsContent>
    </Tabs>
  )
}



function TableCellViewer({ employee }: { employee: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button className="text-left px-0 underline text-blue-600 hover:text-blue-800 bg-transparent shadow-none">
  {employee.name}
</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{employee.name}</DrawerTitle>
          <DrawerDescription>
            {employee.position} • {employee.department}
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Employment Status</Label>
              <p className="font-medium">{employee.status}</p>
            </div>
            <div>
              <Label>Start Date</Label>
              <p className="font-medium">
                {employee.startDate.toLocaleDateString()}
              </p>
            </div>
          </div>

          <Separator />

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  defaultValue={employee.position}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select defaultValue={employee.department}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="HR">Human Resources</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  defaultValue={employee.salary}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Employment Status</Label>
                <Select defaultValue={employee.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                    <SelectItem value="Terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </div>

        <DrawerFooter>
          <Button>Save Changes</Button>
          <DrawerClose asChild>
            <Button className="border border-gray-300 bg-white hover:bg-gray-100">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}