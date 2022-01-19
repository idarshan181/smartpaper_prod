import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const DynamicFeedback = dynamic(() => import('../src/components/Feedback'), {
  ssr: false
});
const Result = () => {
  const router = useRouter();
  const { url } = router.query;
  return <DynamicFeedback url={url} />;
};

export default Result;
