import { type Signal, component$, useComputed$, useStylesScoped$ } from '@builder.io/qwik';
import { isImage } from '../utils/imageBool';

function formatDate(val: string, formatStr = 'dd-MM-yyyy') {
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  // You can use date-fns for various formats, or a custom formatter for 'DD-MM-YYYY'
  // return format(d, formatStr.replace('DD', 'dd').replace('YYYY', 'yyyy').replace('MM', 'MM'));
}

interface bodyProps {
  data: {
    [key: string]: string | number | null | undefined;
  }[];
  header: { key: string; label: string; type?: string; format?: string }[];
  pageNo: Signal<number>;
  postPerPage: Signal<number>;
  serverPagination?: boolean;
}

type cellType = {
  [key: string]: string | number | null | undefined;
}

export const TableBody = component$((props: bodyProps) => {
  useStylesScoped$(AppCSS);

const computedPosts = useComputed$(() => {
  if (props.serverPagination) {
    return props.data; // already paginated by backend
  }

  const start = props.pageNo.value * props.postPerPage.value;
  const end = start + parseInt(props.postPerPage.value.toString());

  return Array.isArray(props.data)
    ? props.data.slice(start, end)
    : [];
});


  return (
    <tbody>
      {computedPosts.value.map((cell: cellType, rowIdx) => (
        <tr key={cell.id || rowIdx}>
          {props.header.map((col, i) => {
            const val = cell[col.key];
            if (isImage(val)) {
              return (
                <td key={i}>
                  <img width={50} height={50} src={val as string} />
                </td>
              );
            } else if (col.type === 'date' && val) {
    // Default format if not specified
    const displayFormat = col.format || 'dd-MM-yyyy';
    return <td key={i}>{formatDate(val as string, displayFormat)}</td>;
  } else {
    return <td key={i}>{val == null ? '' : val.toString()}</td>;
  }
          })}
        </tr>
      ))}
    </tbody>
  );
});

export const AppCSS = `
  tbody {
    color: #0f172a;
    font-size: 15px;
    letter-spacing: 0.3px;
  }
  img {
    object-fit: cover;
  }
`;
