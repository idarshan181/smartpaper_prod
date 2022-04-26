import React from 'react'
import { useGlobalFilter,  useTable, useSortBy } from 'react-table'

export default function CustomReactTable({ columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
    } = useTable({
        columns,
        data
    },
    useGlobalFilter,
    useSortBy)

    const { globalFilter } = state;

  return (
    <table {...getTableProps}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                {column.isSorted ? (column.isSortedDesc ? "↓":"↑"): ""}
                </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()} >
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>
                  {cell.render('Cell')}
                  </td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
