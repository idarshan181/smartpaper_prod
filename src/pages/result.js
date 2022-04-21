/* eslint-disable no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { Button } from '@mui/material';
import axios from 'axios';
import dynamic from 'next/dynamic';
import useSWR from 'swr';

const DynamicFeedback = dynamic(() => import('../components/Feedback'), {
  ssr: false
});

const fetcher = async args => {
  const {
    url,
    data: { school, grade, subject }
  } = args;
  await axios.post(url, { school, grade, subject }).then(res => {
    return res.data;
  });
};

function Result() {
  const getTest = () => {
    axios
      .post('/api/tests', {
        school: 'School 1',
        grade: '3-A',
        subject: 'Maths'
      })
      .then(res => {});
  };
  const { data, error } = useSWR(
    {
      url: '/api/tests',
      data: {
        school: 'School 1',
        grade: '3-A',
        subject: 'Maths'
      }
    },
    fetcher
  );
  return (
    <div>
      <Button onClick={getTest}>Get Data</Button>
    </div>
  );
}

export default Result;
