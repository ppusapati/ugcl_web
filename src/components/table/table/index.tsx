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
import { Header } from './Header';
import { TableBody } from './Body';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

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

export const P9ETable = component$(
  <T extends { [key: string]: string | number | null | undefined }>(
    props: TableProps<T>
  ) => {
    const onPageChangeQrl = props.onPageChange$;
    useStyles$(`table {
      border-collapse: collapse;
      width: 100%;
      overflow-x-auto; w-full;
      table-layout: fixed;
    }
    td {
      padding: 1rem;
      border: 1px solid #e2e8f0;
    }
    tr:hover {
      background: #f8f9fb;
    }`);
    useStylesScoped$(AppCSS);

    const defaultKey = Array.isArray(props.header) && props.header.length > 0
      ? String(props.header[0].key)
      : '';

    const sortOrder = useSignal('asc');
    const sortKey = useSignal(defaultKey);
    const pageNo = useSignal(-1);
    const postPerPage = useSignal(props.defaultLimit ?? 100);
    const totalPosts = useSignal(props.data?.length ?? 0);
    const searchBy = useSignal(defaultKey);
    const searchInp = useSignal('');
    const prevSearch = useSignal(false);
    const loading = useSignal(false);
    const totalCountSignal = useSignal(props.totalCount ?? 0);

    // Extract serializable props
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
    // Use useResource$ for server pagination - this handles async operations properly
    const serverDataResource = useResource$(async ({ track }) => {
      if (!serverPagination || !onPageChangeQrl) return null;

      const currentPage = track(() => pageNo.value);
      const currentLimit = track(() => postPerPage.value);

      // ✅ Track selectedForm to re-trigger fetch when it changes
      track(() => props.selectedForm); // even if unused, must be tracked
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
      if (!rowsPromise) return;            // startup – nothing to do yet

      const rows = await rowsPromise;      // C. wait exactly ONCE per fetch

      if (Array.isArray(rows)) {           // D. got the real array
        finalData.items = rows;     // table now has rows ✔
        totalCountSignal.value = totalCount ?? rows.length;
      }
    });


    // Handle loading state from resource
    const isLoading = serverPagination ? serverDataResource.loading : loading.value;

    // 🧠 Client Pagination/Sorting/Search: Track all
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

  const doc = new jsPDF({ orientation: 'landscape' });

  const tableHeaders = headers.map(h => h.label);

  const tableRows = data.map(row =>
    headers.map(h => {
      let val = row[h.key];
      if (Array.isArray(val)) {
        val = val.join(', ');
      }
      if (val == null) return '';
      return String(val).replace(/[\r\n]+/g, ' ').trim(); // ✅ Replace all line breaks with space
    })
  );

  autoTable(doc, {
    head: [tableHeaders],
    body: tableRows,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak',
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

      <div class="table-cont overflow-x-auto w-full shadow-md rounded-lg">

       <div class="flex justify-between items-center px-4 py-2 gap-2">
  {props.header?.length > 0 && (
    <div class="flex gap-2">
      <button
        onClick$={() =>
          downloadCSV(
            finalData.items,
            props.header.map((h) => ({ key: String(h.key), label: h.label }))
          )
        }
        class="px-3 py-1 bg-success-600 text-white rounded text-sm hover:bg-success-700"
      >

        CSV
      </button>
      <button
        onClick$={() =>
          downloadExcel(
            finalData.items,
            props.header.map((h) => ({ key: String(h.key), label: h.label }))
          )
        }
        class="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
      >
        Excel
      </button>
      <button
        onClick$={() =>
          downloadPDF(
            finalData.items,
            props.header.map((h) => ({ key: String(h.key), label: h.label }))
          )
        }
        class="px-3 py-1 bg-accent-600 text-white rounded text-sm hover:bg-accent-700"
      >
        PDF
      </button>
    </div>
  )}
</div>

        <Header
          headers={props.header.map((h) => ({
            key: String(h.key),
            label: h.label
          }))}
          searchBy={searchBy}
          searchInp={searchInp}
          title={props.title}
          headerImg={props.headerImg}
        />

        <Pagination
          pageNo={pageNo}
          postPerPage={postPerPage}
          totalPosts={serverPagination ? totalCountSignal : totalPosts}
        />

        {isLoading ? (
          <div class="text-sm text-center text-gray-500 my-4">Loading...</div>
        ) : isEmpty() ? (
          <div class="text-sm text-center text-red-500 my-4">No records found.</div>
        ) : (
          <>
            <table class='min-w-max m-5 w-full'>
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

            <div class="text-xs text-gray-500 mt-2 text-right">
              Showing {finalData.items.length} items | Page: {pageNo.value + 1}
            </div>
          </>
        )}

        <Pagination
          pageNo={pageNo}
          postPerPage={postPerPage}
          totalPosts={serverPagination ? totalCountSignal : totalPosts}
        />
      </div>
    );
  }
);

export const AppCSS = `
  .table-cont {
    width: 100%;
  }
`;