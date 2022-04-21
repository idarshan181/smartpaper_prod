/* eslint-disable no-case-declarations */
import { tests } from '../../../../data';

export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      res.status(200).json(tests);
      break;
    case 'POST':
      const { school, grade, subject } = req.body;
      const test = tests.filter(
        ele =>
          ele.school === school &&
          ele.grade === grade &&
          ele.subject === subject
      );
      if (test.length > 0) {
        res.status(200).json(test);
      } else {
        res.status(404).send({ message: 'No test found' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
