import { Button } from '@mui/material';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import CustomDialog from '../components/CustomDialog';

const DynamicFeedback = dynamic(() => import('../components/Feedback'), {
  ssr: false
});
export default function Comp() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const metadata = [
    {
      id: '61f80583f646bd7483d30027',
      isCorrect: false,
      isBlank: true,
      queNo: 0,
      studentId: '7d4c208c-d1a5-4bd2-a70b-359be1522e2a',
      correctAnswer: ['A'],
      studentAnswer: '',
      testName: 'New_subjective_test',
      sessionId: 'b08041a6-9ef8-4148-a43c-0ec450a56939',
      qType: 'practice_character_english',
      color: [50, 50, 50],
      ansNo: 0,
      coOrds: {
        x: 795,
        y: 70,
        h: 41,
        w: 56
      },
      school: 'School 3',
      grade: '4-A',
      subject: 'Maths',
      rollNo: '0',
      cropsURL: [''],
      createdAt: '2022-01-31T15:51:26.718184'
    },
    {
      id: '61f80583f646bd7483d30028',
      isCorrect: false,
      isBlank: false,
      queNo: 1,
      studentId: '7d4c208c-d1a5-4bd2-a70b-359be1522e2a',
      correctAnswer: ['C'],
      studentAnswer: 'B',
      testName: 'New_subjective_test',
      sessionId: 'b08041a6-9ef8-4148-a43c-0ec450a56939',
      qType: 'practice_character_english',
      color: [255, 229, 0],
      ansNo: 0,
      coOrds: {
        x: 793,
        y: 166,
        h: 41,
        w: 56
      },
      school: 'School 3',
      grade: '4-A',
      subject: 'Maths',
      rollNo: '0',
      cropsURL: [''],
      createdAt: '2022-01-31T15:51:26.718197'
    }
  ];
  return (
    <DynamicFeedback
      className="outputImage"
      url="https://smartpaper-crops.s3.ap-south-1.amazonaws.com/7d4c208c-d1a5-4bd2-a70b-359be1522e2a/output-0.png"
      width={500}
      height={715}
      metadata={metadata}
    />
  );
}

{
  /* <div>
    <CustomDialog
      open={open}
      onClose={handleClose}
      title={'Student Answer'}
    ></CustomDialog>
    <Button onClick={handleClickOpen}>Open Dialog</Button>
  </div> */
}
