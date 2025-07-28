import { Signal, component$, useStylesScoped$, $, useComputed$ } from '@builder.io/qwik';

interface pageProps {
  pageNo: Signal<number>,
  postPerPage: Signal<number>,
  totalPosts: Signal<number>,
  onChange$?: (page: number, limit: number) => void;
}

export const Pagination = component$((props: pageProps) => {
  useStylesScoped$(AppCSS);

  const totalPage = useComputed$(() => {
    return Math.ceil((props.totalPosts.value / props.postPerPage.value)) || 1;
  });

  const changePosts = $((e: any) => {
    const newLimit = +e.target.value;
    props.postPerPage.value = newLimit;
    props.pageNo.value = 0;
    props.onChange$ && props.onChange$(0, newLimit);
  });

  const changePageNo = $((e: any) => {
    const newPage = +e.target.value;
    props.pageNo.value = newPage;
    props.onChange$ && props.onChange$(newPage, props.postPerPage.value);
  });

  const decPage = $(() => {
    if (props.pageNo.value !== 0) {
      props.pageNo.value--;
      props.onChange$ && props.onChange$(props.pageNo.value, props.postPerPage.value);
    }
  });

  const incPage = $(() => {
    if (props.pageNo.value < totalPage.value - 1) {
      props.pageNo.value++;
      props.onChange$ && props.onChange$(props.pageNo.value, props.postPerPage.value);
    }
  });

  const setFirstPage = $(() => {
    if (props.pageNo.value !== 0) {
      props.pageNo.value = 0;
      props.onChange$ && props.onChange$(0, props.postPerPage.value);
    }
  });

  const setLastPage = $(() => {
    if (props.pageNo.value !== totalPage.value - 1) {
      props.pageNo.value = totalPage.value - 1;
      props.onChange$ && props.onChange$(props.pageNo.value, props.postPerPage.value);
    }
  });

  return (
    <div class='page-cont'>
      <div class='post-select'>
        <div>Rows per page</div>
        <select onInput$={changePosts} value={props.postPerPage.value}>
          <option>10</option>
          <option>20</option>
          <option>30</option>
          <option>40</option>
          <option>50</option>
          <option>100</option>
            <option>150</option>
              <option>200</option>
                <option>500</option>
                  <option>1000</option>
        </select>
      </div>
      <div>
        <div class='select-page'>
          Page <input onInput$={changePageNo} value={props.pageNo.value} type='number' min={0} max={totalPage.value-1} /> of {totalPage.value}
        </div>
      </div>
      <div class='btn-cont'>
        <button disabled={props.pageNo.value === 0} onClick$={setFirstPage}>
          {/* ...SVG... */}
          &lt;&lt;
        </button>
        <button onClick$={decPage}>&lt;</button>
        <button onClick$={incPage}>&gt;</button>
        <button disabled={props.pageNo.value === totalPage.value-1} onClick$={setLastPage}>
          {/* ...SVG... */}
          &gt;&gt;
        </button>
      </div>
    </div>
  );
});

export const AppCSS = `
  .post-select { display: flex; align-items: center; gap: 10px; }
  select { outline: none; width: 50px; height: 30px; border: 1px solid #e2e8f0; border-radius: 8px; }
  select:focus { outline: 2px solid #19b6f6; }
  .select-page>input { outline: none; border: 1px solid #e2e8f0; width: 50px; height: 30px; border-radius: 8px; font-size: 14px; }
  .select-page>input:focus { outline: 2px solid #19b6f6; }
  .btn-cont>button:focus { outline: 2px solid #19b6f6; }
  .page-cont { display: flex; justify-content: flex-end; align-items: center; gap: 40px; }
  .btn-cont { height: 80px; display: flex; align-items: center; gap: 10px; }
  button { height: fit-content; background: transparent; border: 1px solid #e2e8f0; cursor: pointer; border-radius: 8px; display: flex; justify-content: center; align-items: center; }
  button:disabled { cursor: not-allowed; }
  button:hover { background: #f8f9fb; }
`;
