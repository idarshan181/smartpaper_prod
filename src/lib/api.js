import axios from 'axios'
const FormData = require('form-data')

const encodeImageFileAsURL = async file =>
  new Promise(resolve => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function () {
      const base64data = reader.result
      resolve(base64data)
    }
  })

const getScanResult = async (testName, testImages, orgName) => {
  const url = `https://api.smartpaperapp.com/api/smartpaper/scanAssessment-form`
  const formData = new FormData()

  formData.append('testName', testName)
  formData.append('orgName', orgName)
  formData.append('testImages', testImages[0])

  const result = await axios.post(url, formData, {
    headers: {
      ...formData.getHeaders
    }
  })
  return result
}

export { encodeImageFileAsURL, getScanResult }
