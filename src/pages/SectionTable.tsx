"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState, useMemo } from "react";

// Flatten and clean object
const flattenObject = (obj: any): Record<string, any> => {
  let result: Record<string, any> = {};

  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    let value = obj[key];

    if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      result = { ...result, ...flattenObject(value) };
    } else {
      result[key] = value;
    }
  }

  // Map userId or user_id to user.email
  const user = obj.userId || obj.user_id;
  result["user.email"] = user?.email || "Not Applicable";

  // Token field → isLoggedIn
  if (result.token !== undefined) {
    result.isLoggedIn = result.token ? "Yes" : "No";
    delete result.token;
  }

  // Format dates
  if (result.createdAt) result.createdAt = new Date(result.createdAt).toLocaleString();
  if (result.updatedAt) result.updatedAt = new Date(result.updatedAt).toLocaleString();

  // Remove unwanted fields
  delete result._id;
  delete result.userId;
  delete result.user_id;
  delete result.firstName;

  return result;
};

export default function SectionTable({ title, data }: { title: string; data: any[] }) {
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const perPage = 5;

  const flattenedData = useMemo(() => data.map(flattenObject), [data]);

  // Unique headers for table
  const tableHeaders = useMemo(() => {
    if (flattenedData.length === 0) return [];
    const allKeys = new Set<string>();
    flattenedData.forEach((item) => Object.keys(item).forEach(k => allKeys.add(k)));
    return Array.from(allKeys);
  }, [flattenedData]);

  const sortedData = useMemo(() => {
    if (!sortField) return flattenedData;
    return [...flattenedData].sort((a, b) => {
      const aValue = a[sortField] ?? "Not Applicable";
      const bValue = b[sortField] ?? "Not Applicable";
      if (aValue === bValue) return 0;
      return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });
  }, [flattenedData, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / perPage);
  const currentPageData = sortedData.slice((page - 1) * perPage, page * perPage);

  const handleHeaderClick = (header: string) => {
    if (sortField === header) setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else setSortField(header);
    setPage(1);
  };

  const formatHeader = (header: string) =>
    header.split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');

  let lastRowValues: Record<string, any> = {};

  return (
    <Card className="shadow-lg border border-gray-200 rounded-lg overflow-hidden mb-6">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <CardTitle className="text-xl font-bold text-gray-800 flex justify-between items-center">
          <span>{title}</span>
          <span className="text-sm font-normal text-gray-500">
            {sortedData.length} record{sortedData.length !== 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {sortedData.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg">No records found</p>
          </div>
        ) : (
          <>
            <Table className="min-w-full table-auto border border-gray-200">
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  {tableHeaders.map((header) => (
                    <TableHead
                      key={header}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleHeaderClick(header)}
                    >
                      <div className="flex items-center">
                        {formatHeader(header)}
                        {sortField === header && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200">
                {currentPageData.map((item, idx) => {
                  const row = { ...item };
                  // Replace repeated values with Not Applicable
                  tableHeaders.forEach(h => {
                    if (!row[h]) row[h] = "Not Applicable";
                    else if (lastRowValues[h] === row[h]) row[h] = "Not Applicable";
                    else lastRowValues[h] = row[h];
                  });
                  return (
                    <TableRow key={idx} className="hover:bg-gray-50">
                      {tableHeaders.map(header => (
                        <TableCell
                          key={header}
                          className="px-4 py-3 text-sm text-gray-700 break-words max-w-xs"
                          title={row[header]?.toString()}
                        >
                          {typeof row[header] === "boolean"
                            ? row[header] ? "Yes" : "No"
                            : Array.isArray(row[header])
                              ? row[header].join(", ") || "Not Applicable"
                              : row[header]?.toString() || "Not Applicable"}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * perPage + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(page * perPage, sortedData.length)}</span> of{" "}
                  <span className="font-medium">{sortedData.length}</span> results
                </div>
                <Pagination className="m-0">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage(Math.max(1, page - 1))}
                        className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        aria-disabled={page === 1}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <span className="px-2 text-sm font-medium">{page} / {totalPages}</span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        aria-disabled={page === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
