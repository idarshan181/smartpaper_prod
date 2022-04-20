import axios from 'axios';
const FormData = require('form-data');

const encodeImageFileAsURL = async file =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      const base64data = reader.result;
      resolve(base64data);
    };
  });

const getScanResult = async (
  testName,
  testImages,
  orgName,
  school,
  grade,
  rollNo,
  subject
) => {
  const url = `https://api.smartpaperapp.com/api/smartpaper/scanAssessment-form?school=${school}&grade=${grade}&rollNo=${rollNo}&subject=${subject}`;
  
  const formData = new FormData();
  formData.append('testName', testName);
  formData.append('orgName', orgName);
  testImages.map((image) => {
    formData.append('testImages', image);
  });

  const result = await axios.post(url, formData, {
    headers: {
      ...formData.getHeaders
    }
  });
  return result;
};

const getPageMetadata = async pageIds => {
  const result = await axios.post(
    'https://prod.paperflowapp.com/authoring-page-metadata/pagemetadata/getPageMetadataDetails',
    {
      pageIds: pageIds
    }
  );
  return result;
};

const fetchAllTests = async () => {
  const result = await axios.get(
    'https://api.smartpaperapp.com/api/smartpaper/allAssessments'
  );
  return result;
};

export { encodeImageFileAsURL, fetchAllTests,getPageMetadata, getScanResult };
