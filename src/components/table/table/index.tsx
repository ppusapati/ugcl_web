import {
  component$,
  useStylesScoped$,
  useSignal,
  useStore,
  $,
  useVisibleTask$,
  useStyles$
} from '@builder.io/qwik';
import { Pagination } from './Pagination';
import { sortData } from '../utils/sortData';
import { searchData } from '../utils/searchedData';
import { TableHead } from './TableHead';
import { Header } from './Header';
import { TableBody } from './Body';

interface TableProps<T = any> {
  header: {
    key: keyof T;
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
  onPageChange$?: (page: number, limit: number) => Promise<T[]>;

  enableSearch?: boolean;
  enableSort?: boolean;
}

export const P9ETable = component$(
  <T extends { [key: string]: string | number | null | undefined }>(
    props: TableProps<T>
  ) => {
    useStyles$(`table {
      border-collapse: collapse;
      width: 100%;
      overflow-x-auto; w-full;
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
    const pageNo = useSignal(0);
    const postPerPage = useSignal(props.defaultLimit ?? 100);
    const totalPosts = useSignal(props.data?.length ?? 0);
    const searchBy = useSignal(defaultKey);
    const searchInp = useSignal('');
    const prevSearch = useSignal(false);
    const loading = useSignal(false);
    const totalCountSignal = useSignal(props.totalCount ?? 0);

    const finalData = useStore<{ items: T[] }>({
      items: Array.isArray(props.data) ? props.data : []
    });

    const sortedData = $(() =>
      sortData({
        data: props.data,
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
        data: props.data,
        pageNo,
        sortKey,
        sortOrder,
        totalPosts,
        searchBy,
        searchInp,
        prevSearch
      })
    );

    // 🔁 Server Pagination: Only track pageNo
    useVisibleTask$(async ({ track }) => {
      if (!props.serverPagination) return;
      track(() => pageNo.value);

      if (props.onPageChange$) {
        loading.value = true;
        const result = await props.onPageChange$(pageNo.value, postPerPage.value);
        finalData.items = result;
        console.log('Page:', pageNo.value, 'Data:', result, 'Total:', props.totalCount);
       totalCountSignal.value = props.totalCount ?? result.length;
        loading.value = false;
      }
    });

    // 🧠 Client Pagination/Sorting/Search: Track all
    useVisibleTask$(async ({ track }) => {
  if (props.serverPagination) return;

  track(() => props.data);
  track(() => sortKey.value);
  track(() => sortOrder.value);
  track(() => searchInp.value);
  track(() => searchBy.value);
  track(() => pageNo.value);
  track(() => postPerPage.value);

  loading.value = true;

  if (props.enableSearch && searchInp.value !== '') {
    finalData.items = await searchedData();
  } else if (props.enableSort) {
    finalData.items = (await sortedData()) as T[];
  } else {
    finalData.items = props.data;
  }

  totalPosts.value = finalData.items?.length ?? 0;
  loading.value = false;
});

    const isEmpty = () =>
      !finalData.items || !Array.isArray(finalData.items) || finalData.items.length === 0;

    return (
      <div class="table-cont overflow-x-auto w-full">
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
          totalPosts={props.serverPagination ? totalCountSignal : totalPosts}
        />

        {loading.value ? (
          <div class="text-sm text-center text-gray-500 my-4">Loading...</div>
        ) : isEmpty() ? (
          <div class="text-sm text-center text-red-500 my-4">No records found.</div>
        ) : (
          <>
            <table class='min-w-max w-full'>
              <TableHead
                header={props.header.map((h) => ({
                  key: String(h.key),
                  label: h.label
                }))}
                sortOrder={sortOrder}
                sortKey={sortKey}
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
  serverPagination={props.serverPagination}
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
          totalPosts={props.serverPagination ? totalCountSignal : totalPosts}
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
