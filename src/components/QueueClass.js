import { getScanResult } from '@/libs/api';

export class ImageQueue {
  static SUCCESS = 'success';
  static FAILURE = 'failure';
  static COMPLETE = 'complete';

  images = [];
  testName;
  orgName;
  school;
  grade;
  rollNo;
  subject;

  processedRequests = 0;
  totalRequests = undefined;
  scanRequests = [];
  constructor(testName, testImages, orgName, school, grade, rollNo, subject) {
    this.images = testImages;
    this.testName = testName;
    this.orgName = orgName;
    this.school = school;
    this.grade = grade;
    this.rollNo = rollNo;
    this.subject = subject;
    const totalImages = testImages.length;
    console.log('my class in queue class', totalImages);
  }

  start() {
    this.totalRequests = this.images.length;
    this.addToQueue(this.images);
  }

  addToQueue = () => {
    this.images.forEach(image => {
      this.scanRequests.push(
        getScanResult(
          this.testName,
          [image],
          this.orgName,
          this.school,
          this.grade,
          this.rollNo,
          this.subject
        )
      );
    });
    console.log(
      'scan request array: - ',
      this.scanRequests,
      'image file',
      this.images
    );

    this.processParallel(this.scanRequests);
  };

  async processParallel(scanRequests) {
    const start = performance.now();
    scanRequests.forEach(async (request, id) => {
      await request.then(response => {
        console.log(`Response - ${id}`, response);
      });
    });

    /* await Promise.all(scanRequests).then(response => {
      console.log(response);
      // dispatchEvent(ImageQueue.COMPLETE);
    }); */
    const end = performance.now();
    console.log(`Time taken ${end - start}`);
  }
}
