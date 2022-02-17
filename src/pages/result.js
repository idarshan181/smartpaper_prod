import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from 'axios';
import { Button } from '@mui/material';
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
  /* if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  if (data) {
    return (
      <ul>
        {data.map((t, i) => (
          <li key={t.id}>
            <Link href="/tests/[id]" as={`/test/${t.id}`}>
              <a>{`Test ${t.id}`}</a>
            </Link>
          </li>
        ))}
      </ul>
    );
  } */
  return (
    <div>
      <Button onClick={getTest}>Get Data</Button>
    </div>
  );
}

export default Result;
