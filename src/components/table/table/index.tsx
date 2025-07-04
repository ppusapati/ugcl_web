import {
  component$,
  useStylesScoped$,
  useSignal,
  useStore,
  $,
  useResource$,
  useTask$,
  useStyles$,
  QRL
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

    // Extract serializable props
    const serverPagination = props.serverPagination;
    const enableSearch = props.enableSearch;
    const enableSort = props.enableSort;
    const totalCount = props.totalCount;
    const data = props.data;
console.log("props dfdfdfData: ", data)
    const finalData = useStore<{ items: T[] }>({
      items: Array.isArray(props.data) ? props.data : []
    });
console.log("Final Data: ", finalData); 
console.log('Final Data items:', [...finalData.items]); 
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

    // Use useResource$ for server pagination - this handles async operations properly
    const serverDataResource = useResource$(async ({ track }) => {
      if (!serverPagination || !onPageChangeQrl) {
        return null;
      }
      
      const currentPage = track(() => pageNo.value);
      const currentLimit = track(() => postPerPage.value);
      
      try {
        const result = await onPageChangeQrl(currentPage, currentLimit);
        console.log('Page:', currentPage, 'Data:', result, 'Total:', totalCount);
        return result;
      } catch (error) {
        console.error('Error fetching page data:', error);
        throw error;
      }
    });

    // Update finalData when server data changes
    useTask$(async ({ track }) => {
      if (!serverPagination) return;

    console.log('✅ rows arrived', [...finalData.items]); 
      
      const resourceValuePromise = track(() => serverDataResource.value);
      
      if (resourceValuePromise) {
        const resourceValue = await resourceValuePromise;
        if (resourceValue) {
          finalData.items = resourceValue;
          totalCountSignal.value = totalCount ?? resourceValue.length;
        }
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
          totalPosts={serverPagination ? totalCountSignal : totalPosts}
        />

        {isLoading ? (
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