import dynamic from 'next/dynamic';

const TeacherPortalFrame = dynamic(
  () => import('../components/TeacherPortal'),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

function Teacher() {
  return <TeacherPortalFrame />;
}

export default Teacher;
