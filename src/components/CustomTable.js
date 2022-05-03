/* eslint-disable react/jsx-key */
import { useSortBy, useTable } from 'react-table';

import TableStyles from '@/styles/TableStyles';
// import { useSortBy } from "react-table/dist/react-table.development";

const defaultPropGetter = () => ({});
export const Table = ({
  columns,
  data,
  getHeaderProps = defaultPropGetter,
  getColumnprops = defaultPropGetter,
  getRowProps = defaultPropGetter,
  getCellProps = defaultPropGetter
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data
      },
      useSortBy
    );
  return (
    <TableStyles>
      <div className='tableWrap'>
      <table {...getTableProps}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps([column.getSortByToggleProps(), {
                  className: column.className,
                  style: column.style
                },
                getColumnprops(column),
                getHeaderProps(column
                )])}>
                  {column.render('Header')}
                  {column.isSorted ? (column.isSortedDesc ? '↓' : '↑') : ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps(getRowProps(row))}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps([
                      {
                        className: cell.column.className,
                        style: cell.column.style
                      },
                      getColumnprops(cell.column),
                      getCellProps(cell)
                    ])}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      </TableStyles>
  );
};
