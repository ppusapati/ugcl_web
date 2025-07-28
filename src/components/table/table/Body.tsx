import { type Signal, component$, useComputed$, useStylesScoped$ } from '@builder.io/qwik';
import { extractImageUrls, isImage } from '../utils/imageBool';

function formatDate(val: string, formatStr = 'dd-MM-yyyy') {
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return formatStr
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', String(year));
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
  return Array.isArray([...props.data])
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
             const urls = extractImageUrls(val);
   return (
      <td key={i}>
        {urls.map((src, index) =>
          <img
            key={index}
            src={src}
            width={50}
            height={50}
            alt="photo"
            style={{ marginRight: '4px', borderRadius: '4px' }}
          />
        )}
      </td>
    );
} else if (col.type === 'date' && val) {
  const displayFormat = col.format || 'dd-MM-yyyy';
  return <td key={i}>{formatDate(val as string, displayFormat)}</td>;
} else {
  return <td class='w-25' key={i}>{val == null ? '' : val.toString()}</td>;
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
