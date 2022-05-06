import styled from 'styled-components';

const TableStyles = styled.div`
  /* This is required to make the table full-width */
  display: block;
  max-width: 100%;
  margin-bottom: 10px;
  /* This will make the table scrollable when it gets too small */
  .tableWrap {
    display: block;
    max-width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    border-bottom: 1px solid black;
    border-left: 1px solid black;
    border-right: 1px solid black;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  table {
    /* Make sure the inner table is always as wide as needed */
    width: 100%;
    border-spacing: 0;
    border-radius: 8px;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th {
      margin: 0;
      padding: 0.5rem;
      background-color: #20469b;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      /* height: 10px; */ /*doesnt work*/
      text-align: center;
      :last-child {
        border-right: 0;
      }
    }

    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      /* Each cell should grow equally */
      width: 1%;
      /* But "collapsed" cells should be as small as possible */
      &.collapse {
        width: 0.0000000001%;
      }

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;
export default TableStyles;
