import { useMemo } from "react";
import CustomReactTable from "./CustomReactTable";
import { CustomTable } from "@/styles/CustomTable";


export default function MockTable() {
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'first_name',
          },
          {
            Header: 'Last Name',
            accessor: 'last_name',
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age',
          },
        ],
      },
    ],
    []
  )
  
  const data1 = useMemo(() =>  
  [
    {
      first_name: "john",
      last_name: "smith"
    },
    {
      first_name: "martin",
      last_name: "dawson"
    },
    {
      first_name: "martin",
      last_name: "dawson"
    }
  ], []
  )
  return (
    <div>
      <CustomTable>
        <CustomReactTable columns={columns} data={data1}></CustomReactTable>
      </CustomTable>
    </div>
  )
}
