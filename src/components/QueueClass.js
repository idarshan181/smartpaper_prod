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

  addToQueue() {
    for (const i = 0; i < this.totalRequests; i++) {
      this.scanRequests.push(
        getScanResult(
          this.testName,
          [this.images[i]],
          this.orgName,
          this.school,
          this.grade,
          this.rollNo,
          this.subject
        )
        // i
      );
      console.log("this.scanRequests.length",this.scanRequests.length)
    }
    console.log("scan request array: - ",this.scanRequests, "image file", this.images);
    this.processParallel(this.scanRequests);
  }

  async processParallel(scanRequests) {
    await Promise.all(scanRequests).then(response => {
      console.log(response);
      dispatchEvent(ImageQueue.COMPLETE);
    });
  }
}
