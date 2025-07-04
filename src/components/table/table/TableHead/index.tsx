import { type Signal, component$, useStylesScoped$ } from '@builder.io/qwik';
import { SortButton } from '../SortButton';

interface HeaderProps {
  header: {
    key: string;
    label: string;
  }[];
  sortOrder: Signal<string>;
  sortKey: Signal<string>;
}

type cellType = {
  [key: string]: string | number | null | undefined;
};

export const TableHead = component$((props: HeaderProps) => {
  useStylesScoped$(AppCSS);
  return (
    <thead>
      <tr>
        {props.header.map((cell: cellType, i) => {
          // Safely get keys and ensure we have the correct indices
          const keys = Object.keys(cell);
          const key1 = keys[0];
          const key2 = keys[1];

          // Check if both keys exist before accessing them
          if (key1 && key2) {
            return (
              <td key={i}>
                {cell[key2] !== undefined ? cell[key2] : ''}
                <SortButton
                  cellKey={cell[key1] !== undefined ? cell[key1] : ''}
                  sortOrder={props.sortOrder}
                  sortKey={props.sortKey}
                />
              </td>
            );
          } else {
            // Handle cases where keys are not found
            return <td key={i}></td>;
          }
        })}
      </tr>
    </thead>
  );
});

export const AppCSS = `
  td {
    position: relative;
    color: #64758b;
  }
`;
