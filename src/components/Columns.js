export const test_page4_1 = [
  {
    Header: 'Index',
    id: 'row',
    maxWidth: 50,
    filterable: false,
    Cell: row => {
      return <div>{row.row.index + 1 + '.'}</div>;
    },
    style: {
      fontSize: '13px'
    }
  },
  {
    Header: 'Roll No.',
    accessor: row => row[2],
    collapse: false,
    style: {
      fontSize: '13px',
      minWidth: 70
    }
  },
  {
    Header: 'Correct',
    accessor: row => row[0].count_correct,
    collapse: true,
    style: {
      fontSize: '13px',
      color: 'green'
    }
  },
  {
    Header: 'Incorrect',
    accessor: row => row[0].count_incorrect,
    collapse: true,
    style: {
      fontSize: '13px',
      color: 'red'
    }
  },
  {
    Header: '% correct',
    accessor: row => row[0].pct_correct_checked,
    Cell: props => props.value + '%',
    collapse: true,
    style: {
      // fontWeight: 'bolder',
      fontSize: '13px',
      minWidth: 90
    }
  },
  {
    Header: 'Blank',
    accessor: row => row[0].count_blank,
    collapse: true,
    style: {
      fontSize: '13px',
      maxWidth: 400,
      minWidth: 80
    }
  },
  {
    Header: '% total correct',
    collapse: true,
    accessor: row => row[0].pct_correct_total,
    Cell: props => props.value + '%',
    style: {
      fontSize: '13px',
      width: '100px',
      maxWidth: 400,
      minWidth: 120
    }
  },
  {
    Header: 'Result Image',
    accessor: row => row[1],
    Cell: e => (
      <a href={e.value} target="_blank" rel="noreferrer">
        {`View Result`}
      </a>
    ),
    style: {
      fontSize: '13px',
      maxWidth: 1000,
      minWidth: 150
    }
  }
];

export const DemoMCQ = [
  {
    Header: 'Index',
    id: 'row',
    maxWidth: 50,
    filterable: false,
    Cell: row => {
      return <div>{row.row.index + 1 + '.'}</div>;
    },
    style: {
      fontSize: '13px'
    }
  },
  {
    Header: 'Correct',
    accessor: row => row[0].count_correct,
    collapse: true,
    style: {
      fontSize: '13px',
      color: 'green'
    }
  },
  {
    Header: 'Incorrect',
    accessor: row => row[0].count_incorrect,
    collapse: true,
    style: {
      fontSize: '13px',
      color: 'red'
    }
  },
  {
    Header: '% correct',
    accessor: row => row[0].pct_correct_checked,
    Cell: props => props.value + '%',
    collapse: true,
    style: {
      // fontWeight: 'bolder',
      fontSize: '13px',
      minWidth: 90
    }
  },
  {
    Header: 'Blank',
    accessor: row => row[0].count_blank,
    collapse: true,
    style: {
      fontSize: '13px',
      maxWidth: 400,
      minWidth: 80
    }
  },
  {
    Header: '% total correct',
    collapse: true,
    accessor: row => row[0].pct_correct_total,
    Cell: props => props.value + '%',
    style: {
      fontSize: '13px',
      width: '100px',
      maxWidth: 400,
      minWidth: 120
    }
  },
  {
    Header: 'Result Image',
    accessor: row => row[1],
    Cell: e => (
      <a href={e.value} target="_blank" rel="noreferrer">
        {`View Result`}
      </a>
    ),
    style: {
      fontSize: '13px',
      maxWidth: 1000,
      minWidth: 150
    }
  }
];
