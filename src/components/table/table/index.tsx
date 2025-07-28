import {
  component$,
  useStylesScoped$,
  useSignal,
  useStore,
  $,
  useResource$,
  useTask$,
  useStyles$,
  QRL,
  useVisibleTask$
} from '@builder.io/qwik';
import { Pagination } from './Pagination';
import { sortData } from '../utils/sortData';
import { searchData } from '../utils/searchedData';
import { TableHead } from './TableHead';
import { TableBody } from './Body';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Search } from './Search';

interface TableProps<T = any> {
  header: {
    key: keyof T & string;
    label: string;
    type?: string;
    format?: string;
  }[];
  data: T[];
  title: string;
  headerImg?: string;
  defaultLimit?: number;
  serverPagination?: boolean;
  totalCount?: number;
  selectedForm?: string;
  onPageChange$?: QRL<(page: number, limit: number) => Promise<T[]>>;
  enableSearch?: boolean;
  enableSort?: boolean;
}

export const pickPdfFormat = (numColumns: number) => {
  if (numColumns <= 4) return 'a5';
  if (numColumns <= 8) return 'a4';
  if (numColumns <= 14) return 'a3';
  if (numColumns <= 20) return 'a2';
  return 'a1';
};

export const P9ETable = component$(
  <T extends { [key: string]: string | number | null | undefined }>(
    props: TableProps<T>
  ) => {
    const onPageChangeQrl = props.onPageChange$;
    
    useStyles$(`
      .professional-table {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .table-container {
        // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 16px;
        padding: 2px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      }
      
      .table-inner {
        background: white;
        border-radius: 14px;
        overflow: hidden;
      }
      
      .table-header {
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        border-bottom: 1px solid #e2e8f0;
      }
      
      .export-buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      
      .export-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .export-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      .export-btn:active {
        transform: translateY(0);
      }
      
      .csv-btn {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
      }
      
      .excel-btn {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
      }
      
      .pdf-btn {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
      }
      
      .stats-container {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
      }
      
      .stat-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: rgba(99, 102, 241, 0.1);
        color: #4f46e5;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
      }
      
      .data-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        background: white;
      }
      
      .data-table th {
        // background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        padding: 16px 20px;
        text-align: left;
        font-weight: 600;
        font-size: 13px;
        color: #374151;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 2px solid #e5e7eb;
        position: sticky;
        top: 0;
        z-index: 10;
      }
      
      .data-table th:first-child {
        border-top-left-radius: 0;
      }
      
      .data-table th:last-child {
        border-top-right-radius: 0;
      }
      
      .data-table td {
        padding: 16px 20px;
        border-bottom: 1px solid #f3f4f6;
        font-size: 14px;
        color: #374151;
        vertical-align: middle;
      }
      
      .data-table tbody tr {
        transition: all 0.2s ease;
      }
      
      .data-table tbody tr:hover {
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        transform: scale(1.001);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      }
      
      .data-table tbody tr:nth-child(even) {
        background: #fafbfc;
      }
      
      .data-table tbody tr:nth-child(even):hover {
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      }
      
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        background: white;
      }
      
      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e5e7eb;
        border-top: 3px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 16px;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        background: white;
        color: #6b7280;
      }
      
      .empty-icon {
        font-size: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
      }
      
      .footer-stats {
        padding: 16px 20px;
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        border-top: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
        color: #6b7280;
      }
      
      .scroll-indicator {
        position: sticky;
        right: 0;
        background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 30%);
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #9ca3af;
        font-size: 18px;
      }
    `);

    useStylesScoped$(AppCSS);

    const defaultKey = Array.isArray(props.header) && props.header.length > 0
      ? String(props.header[0].key)
      : '';

    const sortOrder = useSignal('asc');
    const sortKey = useSignal(defaultKey);
    const pageNo = useSignal(0);
    const postPerPage = useSignal(props.defaultLimit ?? 100);
    const totalPosts = useSignal(props.data?.length ?? 0);
    const searchBy = useSignal(defaultKey);
    const searchInp = useSignal('');
    const prevSearch = useSignal(false);
    const loading = useSignal(false);
    const totalCountSignal = useSignal(props.totalCount ?? 0);

    const serverPagination = props.serverPagination;
    const enableSearch = props.enableSearch;
    const enableSort = props.enableSort;
    const totalCount = props.totalCount;
    const data = props.data;
    
    const finalData = useStore<{ items: T[] }>({
      items: Array.isArray(props.data) ? props.data : []
    });

    const sortedData = $(() =>
      sortData({
        data: data,
        tableData: finalData.items,
        sortKey,
        sortOrder,
        totalPosts,
        prevSearch,
        searchBy
      })
    );

    const searchedData = $(() =>
      searchData({
        data: data,
        pageNo,
        sortKey,
        sortOrder,
        totalPosts,
        searchBy,
        searchInp,
        prevSearch
      })
    );

    useVisibleTask$(() => { pageNo.value = 0; });

    const serverDataResource = useResource$(async ({ track }) => {
      if (!serverPagination || !onPageChangeQrl) return null;

      const currentPage = track(() => pageNo.value);
      const currentLimit = track(() => postPerPage.value);
      track(() => props.selectedForm);
      
      try {
        const result = await onPageChangeQrl(currentPage, currentLimit);
        return result;
      } catch (error) {
        console.error('Error fetching page data:', error);
        throw error;
      }
    });

    useTask$(async ({ track }) => {
      if (!serverPagination) return;

      const rowsPromise = track(() => serverDataResource.value);
      if (!rowsPromise) return;

      const rows = await rowsPromise;

      if (Array.isArray(rows)) {
        finalData.items = rows;
        totalCountSignal.value = totalCount ?? rows.length;
      }
    });

    const isLoading = serverPagination ? serverDataResource.loading : loading.value;

    useTask$(async ({ track }) => {
      if (serverPagination) return;

      track(() => data);
      track(() => sortKey.value);
      track(() => sortOrder.value);
      track(() => searchInp.value);
      track(() => searchBy.value);
      track(() => pageNo.value);
      track(() => postPerPage.value);

      loading.value = true;

      try {
        if (enableSearch && searchInp.value !== '') {
          finalData.items = await searchedData();
        } else if (enableSort) {
          finalData.items = (await sortedData()) as T[];
        } else {
          finalData.items = data;
        }

        totalPosts.value = finalData.items?.length ?? 0;
      } catch (error) {
        console.error('Error processing data:', error);
      } finally {
        loading.value = false;
      }
    });

    const isEmpty = () =>
      !finalData.items || !Array.isArray(finalData.items) || finalData.items.length === 0;

    const downloadCSV = $((
      data: { [key: string]: string | number | null | undefined | any[] }[],
      headers: { key: string; label: string }[]
    ) => {
      if (!data.length || !headers.length) {
        alert('No data to export');
        return;
      }

      const csvHeader = headers.map((h) => `"${h.label}"`).join(',');
      const csvRows = data.map((row) =>
        headers
          .map((h) => {
            const val = row[h.key];
            if (Array.isArray(val)) {
              return `"${val.join(';')}"`;
            }
            return `"${(val ?? '').toString().replace(/"/g, '""')}"`
          })
          .join(',')
      );

      const csvContent = [csvHeader, ...csvRows].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${Date.now()}_table_export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    const downloadExcel = $((data: any[], headers: { key: string; label: string }[]) => {
      if (!data.length || !headers.length) {
        alert('No data to export');
        return;
      }

      const mappedData = data.map(row => {
        const newRow: Record<string, any> = {};
        headers.forEach(h => {
          const val = row[h.key];
          newRow[h.label] = Array.isArray(val) ? val.join(';') : val ?? '';
        });
        return newRow;
      });

      const worksheet = XLSX.utils.json_to_sheet(mappedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, `${Date.now()}_table_export.xlsx`);
    });

    const downloadPDF = $((data: any[], headers: { key: string; label: string }[]) => {
      if (!data.length || !headers.length) {
        alert('No data to export');
        return;
      }

      const format = pickPdfFormat(headers.length);
      const doc = new jsPDF({ 
        orientation: 'landscape', 
        unit: 'pt', 
        format: format === undefined ? 'a4' : format, 
        putOnlyUsedFonts: true, 
        floatPrecision: 16 
      });

      const tableHeaders = headers.map(h => h.label);
      const tableRows = data.map(row =>
        headers.map(h => {
          let val = row[h.key];
          if (Array.isArray(val)) {
            val = val.join(', ');
          }
          if (val == null) return '';
          return String(val).replace(/[\r\n]+/g, ' ').trim();
        })
      );

      const columnStyles: { [key: number]: { cellWidth: number } } = {};
      for (let i = 0; i < tableHeaders.length; i++) {
        columnStyles[i] = { cellWidth: 100 };
      }

      autoTable(doc, {
        head: [tableHeaders],
        body: tableRows,
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: 'ellipsize',
          halign: 'left',
          valign: 'middle',
        },
        headStyles: {
          fillColor: [22, 160, 133],
          textColor: 255,
        },
        theme: 'striped',
        margin: { top: 20 },
        didDrawPage: (data) => {
          doc.setFontSize(10);
          doc.text('Exported Table Report', data.settings.margin.left, 10);
        }
      });

      doc.save(`${Date.now()}_table_export.pdf`);
    });

    const colWidths = useStore<Record<string, string>>({});
    const onResizeStart$ = $((e: MouseEvent, key: string) => {
      const startX = e.clientX;
      const target = e.target as HTMLElement;
      const startWidth = target.parentElement?.offsetWidth || 0;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const newWidth = startWidth + (moveEvent.clientX - startX);
        colWidths[key] = `${newWidth}px`;
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });

    return (
      <div class="professional-table">
        <div class="table-container drop-shadow">
          <div class="table-inner">
            {/* Header Section */}
            <div class="table-header">
              <div class="flex justify-between items-center p-6">
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-2">
                    <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span class="text-white font-bold text-sm">📊</span>
                    </div>
                    <div>
                      <h2 class="text-xl font-bold text-gray-800">{props.title}</h2>
                      <div class="stats-container mt-1">
                        <span class="stat-badge">
                          📄 {serverPagination ? totalCountSignal.value : totalPosts.value} records
                        </span>
                        <span class="stat-badge">
                          📋 {props.header?.length || 0} columns
                        </span>
                        <span class="stat-badge">
                          📑 Page {pageNo.value + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Export Buttons */}
                {props.header?.length > 0 && (
                  <div class="export-buttons">
                    <button
                      onClick$={() =>
                        downloadCSV(
                          finalData.items,
                          props.header.map((h) => ({ key: String(h.key), label: h.label }))
                        )
                      }
                      class="export-btn csv-btn"
                    >
                      📊 CSV
                    </button>
                    <button
                      onClick$={() =>
                        downloadExcel(
                          finalData.items,
                          props.header.map((h) => ({ key: String(h.key), label: h.label }))
                        )
                      }
                      class="export-btn excel-btn"
                    >
                      📈 Excel
                    </button>
                    <button
                      onClick$={() =>
                        downloadPDF(
                          finalData.items,
                          props.header.map((h) => ({ key: String(h.key), label: h.label }))
                        )
                      }
                      class="export-btn pdf-btn"
                    >
                      📄 PDF
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Top Pagination */}
            <div class="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <Search headers={props.header} searchBy={searchBy} searchInp={searchInp} />
              <Pagination
                pageNo={pageNo}
                postPerPage={postPerPage}
                totalPosts={serverPagination ? totalCountSignal : totalPosts}
                // onPageChange$ = {props.onPageChange$(page, limit)}
                // onChange$={(page, limit) => {
                //   if (props.onPageChange$) props.onPageChange$(page, limit);
                // }}
              />
            </div>

            {/* Table Content */}
            <div class="overflow-x-auto">
              {isLoading ? (
                <div class="loading-container">
                  <div class="loading-spinner"></div>
                  <div class="text-gray-600 font-medium">Loading data...</div>
                  <div class="text-gray-400 text-sm mt-1">Please wait while we fetch your records</div>
                </div>
              ) : isEmpty() ? (
                <div class="empty-state">
                  <div class="empty-icon">📊</div>
                  <div class="text-lg font-semibold text-gray-700 mb-2">No Data Available</div>
                  <div class="text-gray-500">No records match your current filters</div>
                </div>
              ) : (
                <table class="data-table">
                  <TableHead
                    header={props.header.map((h) => ({
                      key: String(h.key),
                      label: h.label
                    }))}
                    sortOrder={sortOrder}
                    sortKey={sortKey}
                    colWidths={colWidths}
                    onResizeStart$={onResizeStart$}
                  />
                  <TableBody
                    data={finalData.items}
                    pageNo={pageNo}
                    postPerPage={postPerPage}
                    header={props.header.map((h) => ({
                      key: String(h.key),
                      label: h.label,
                      type: h.type,
                      format: h.format
                    }))}
                    serverPagination={serverPagination}
                  />
                </table>
              )}
            </div>

            {/* Footer */}
            {!isEmpty() && !isLoading && (
              <div class="footer-stats">
                <div class="flex items-center gap-4">
                  <span>Showing {finalData.items.length} of {serverPagination ? totalCountSignal.value : totalPosts.value} entries</span>
                </div>
                <div class="flex items-center gap-2 text-xs">
                  <span class="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Data loaded successfully</span>
                </div>
              </div>
            )}

            {/* Bottom Pagination */}
            {!isEmpty() && !isLoading && (
              <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <Pagination
                  pageNo={pageNo}
                  postPerPage={postPerPage}
                  totalPosts={serverPagination ? totalCountSignal : totalPosts}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export const AppCSS = `
  .table-cont {
    width: 100%;
  }
`;