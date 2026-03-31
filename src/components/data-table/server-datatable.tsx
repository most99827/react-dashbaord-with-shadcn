import { Search, ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react"
import { useEffect, useMemo, useState, type ReactNode } from "react"

import axiosInstance from "@/api/axios"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Primitive = string | number | boolean | null | undefined
type FilterValue = Primitive | Primitive[]
type FilterData = Record<string, FilterValue>

type ApiEnvelope<T> = {
  success: boolean
  status_code: number
  message: string
  data: T
}

export type ServerDataTableColumn<TData extends Record<string, unknown>> = {
  data: keyof TData | null
  title: string
  className?: string
  headerClassName?: string
  render?: (row: TData) => ReactNode
  sortable?: boolean
}

type PaginatedResponse<TData> = {
  data: TData[]
  total: number
  current_page: number
  per_page: number
  last_page: number
  from: number
  to: number
}

type ServerDataTableProps<TData extends Record<string, unknown>> = {
  prefix: string
  columns: Array<ServerDataTableColumn<TData>>
  title?: string
  searchPlaceholder?: string
  initialPageSize?: number
  toolbar?: ReactNode
  filterData?: FilterData
  refreshKey?: number
}

const appendFilterParams = (params: URLSearchParams, filterData: FilterData = {}) => {
  Object.entries(filterData).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== "") params.append(key, String(item))
      })
      return
    }
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value))
  })
}

export function ServerDataTable<TData extends Record<string, unknown>>({
  prefix,
  columns,
  title = "Datatable",
  searchPlaceholder = "Search...",
  initialPageSize = 10,
  toolbar,
  filterData,
  refreshKey = 0,
}: ServerDataTableProps<TData>) {
  const [rows, setRows] = useState<TData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(initialPageSize)
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [meta, setMeta] = useState<PaginatedResponse<TData> | null>(null)

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    })
    if (searchQuery.trim()) params.set("search", searchQuery.trim())
    if (sortBy) {
      params.set("sort_by", sortBy)
      params.set("sort_dir", sortDir)
    }
    appendFilterParams(params, filterData)
    return params.toString()
  }, [page, limit, searchQuery, sortBy, sortDir, filterData])

  const load = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.get<ApiEnvelope<PaginatedResponse<TData>>>(`${prefix}?${queryString}`)
      const payload = response.data.data
      setRows(payload.data ?? [])
      setMeta(payload)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to load data.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString, refreshKey])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchQuery(searchInput)
                  setPage(1)
                }
              }}
              placeholder={searchPlaceholder}
              className="w-56 pl-9"
            />
          </div>
          {toolbar}
        </div>
      </div>

      {error ? <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm">{error}</div> : null}
      {isLoading ? <div className="text-sm text-muted-foreground">Loading...</div> : null}

      {!isLoading && !error ? (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead 
                      key={column.title} 
                      className={column.headerClassName}
                    >
                      {column.sortable !== false && column.data ? (
                        <div 
                          className="flex items-center gap-1 cursor-pointer select-none hover:text-foreground"
                          onClick={() => {
                            if (sortBy === String(column.data)) {
                              setSortDir(sortDir === "asc" ? "desc" : "asc")
                            } else {
                              setSortBy(String(column.data))
                              setSortDir("asc")
                            }
                            setPage(1)
                          }}
                        >
                          {column.title}
                          {sortBy === String(column.data) ? (
                            sortDir === "asc" ? (
                              <ArrowUp className="w-3 h-3" />
                            ) : (
                              <ArrowDown className="w-3 h-3" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-50" />
                          )}
                        </div>
                      ) : (
                        column.title
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length ? (
                  rows.map((row, idx) => (
                    <TableRow key={String((row as any).id ?? idx)}>
                      {columns.map((column) => (
                        <TableCell key={`${column.title}-${idx}`} className={column.className}>
                          {column.render
                            ? column.render(row)
                            : column.data
                              ? String(row[column.data] ?? "")
                              : null}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-20 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {meta ? `Showing ${meta.from || (rows.length > 0 ? 1 : 0)} to ${meta.to || rows.length} of ${meta.total || rows.length}` : ""}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground">Rows per page</p>
                <Select
                  value={String(limit)}
                  onValueChange={(value) => {
                    setLimit(Number(value))
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={String(limit)} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 25, 50, 100].map((pageSize) => (
                      <SelectItem key={pageSize} value={String(pageSize)}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Pagination className="w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if ((meta?.current_page ?? 1) > 1) setPage((p) => p - 1)
                      }}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      {meta?.current_page ?? page}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if ((meta?.current_page ?? 1) < (meta?.last_page ?? 1)) setPage((p) => p + 1)
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

