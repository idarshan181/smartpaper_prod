/* eslint-disable react-hooks/exhaustive-deps */
import { createRef, useEffect, useState } from 'react';
import CustomPaper from '../styles/CustomPaper';
import {
  CustomButton,
  CustomInput,
  CustomLabel,
  Input
} from '../styles/CustomForm';
import Loader from './Loader';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import {
  Box,
  Button,
  Container,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import useForm from '../lib/useForm';
import { CustomFileInput } from '../styles/CustomFileInput';
import { useRouter } from 'next/router';
import axios from 'axios';
import ImageViewer from '../styles/ImageViewer';
import Image from 'next/image';
import ErrorMessage from './ErrorMessage';
import { fetchAllTests, getPageMetadata, getScanResult } from '../lib/api';
import Canvas from './Canvas';
import Link from 'next/link';

const DynamicFeedback = dynamic(() => import('./Feedback'), {
  ssr: false
});

export default function CheckTest() {
  const [state, setState] = useState({
    orgName: 'LearnSense Pilot',
    imageLabel: '',
    imageSource: [],
    imageAdded: false,
    loading: false,
    loadingMessage: '',
    isError: false,
    error: {
      message: ''
    },
    resultFetched: false,
    result: {
      correct: 0,
      incorrect: 0,
      percentage: 0
    },
    studentResult: [],
    testImages: [],
    isDisabled: true,
    isClearDisabled: true,
    tests: [],
    inputImage: createRef(),
    formLoading: false,
    pageMetadata: [],
    ans: []
  });
  const { inputs, handleChange, resetForm, clearForm } = useForm({
    subject: 'Maths',
    grade: '3-A',
    chapter: '',
    testName: '',
    school: 'Krushnanagar Primary School, Randheja',
    rollNo: ''
  });

  const handleFileChange = async e => {
    setState(prevState => ({
      ...prevState,
      imageAdded: false,
      resultFetched: false,
      imageLabel: '',
      isDisabled: true,
      isClearDisabled: true,
      pageMetadata: []
    }));
    const { files } = e.target;
    if (files.length === 0) {
      setState(prevState => ({
        ...prevState,
        testImages: [],
        imageLabel: '',
        imageAdded: false,
        imageSource: [],
        isDisabled: true,
        isClearDisabled: true
      }));
    } else {
      const fileList = Object.values(files);

      const source = await Promise.all(
        fileList.map(async file => URL.createObjectURL(file))
      );
      // imageSource: [...prevState.imageSource, ...source], to Append new Image
      // testImages: [...prevState.testImages, files[0]],
      setState(prevState => ({
        ...prevState,
        testImages: [...prevState.testImages, ...files],
        imageAdded: true,
        resultFetched: false,
        imageSource: [...prevState.imageSource, ...source],
        imageLabel: 'Your Work',
        isDisabled: false,
        isClearDisabled: false
      }));
    }
  };
  const resetData = e => {
    e.preventDefault();
    // document.getElementById("image-input").value = "";
    resetForm();
    clearForm();
    state.inputImage.current.value = '';
    setState(prevState => ({
      ...prevState,
      testImages: [],
      imageLabel: '',
      imageAdded: false,
      imageSource: [],
      isDisabled: true,
      isClearDisabled: true,
      resultFetched: false,
      isError: false,
      error: {
        message: ''
      },
      result: {
        correct: 0,
        incorrect: 0,
        percentage: 0
      },
      loading: false,
      loadingMessage: ''
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const { testName, school, grade, rollNo, subject } = inputs;
    const { orgName, testImages, tests } = state;
    setState(prevState => ({
      ...prevState,
      formLoading: true,
      isDisabled: true,
      isClearDisabled: true,
      loading: true,
      loadingMessage: 'Please wait we are getting results for you'
    }));
    const pageIds = tests
      .filter(test => test.testName === testName)
      .map(page => page.pageId)
      .flat();
    const pageMeta = await getPageMetadata(pageIds).then(
      res => res.data.pageDetails
    );
    await getScanResult(
      testName,
      testImages,
      orgName,
      school,
      grade,
      rollNo,
      subject
    )
      .then(response => {
        const {
          output_res,
          input_res,
          crops_res,
          res,
          success,
          error_message
        } = response?.data?.data;
        if (success !== false) {
          let ans = [];
          for (let i = 0; i < pageIds.length; i++) {
            let x = res.filter(obj => obj.pageNo === i);
            ans.push(x);
          }

          setState(prevState => ({
            ...prevState,
            loading: false,
            formLoading: false,
            loadingMessage: '',
            imageLabel: 'Your Result',
            imageSource: output_res,
            isDisabled: true,
            isClearDisabled: false,
            testImages: [],
            resultFetched: true,
            ans: ans
            // pageMetadata: pageMeta
          }));
          /* setTimeout(() => {
            router.push({
              pathname: '/result',
              query: {
                url: output_res[0]
              }
            });
          }, 5000); */
        } else {
          setState(prevState => ({
            ...prevState,
            formLoading: false,
            loading: false,
            loadingMessage: '',
            isError: true,
            error: {
              message: error_message
            },
            resultFetched: false,
            imageLabel: '',
            isDisabled: false,
            isClearDisabled: false
          }));
          setTimeout(() => {
            setState(prevState => ({
              ...prevState,
              isError: false,
              error: {
                message: ''
              }
            }));
          }, 4000);
        }
      })
      .catch(err => {
        const { response } = err;
        setState(prevState => ({
          ...prevState,
          formLoading: false,
          loading: false,
          loadingMessage: '',
          isError: true,
          error: {
            message: 'Error in fetching results, please try again'
          },
          resultFetched: false,
          imageLabel: '',
          isDisabled: false,
          isClearDisabled: false
        }));
        setTimeout(() => {
          setState(prevState => ({
            ...prevState,
            isError: false,
            error: {
              message: ''
            }
          }));
        }, 4000);
      });
  };
  const router = useRouter();
  useEffect(() => {
    async function fetchTests() {
      await axios
        .get('https://api.smartpaperapp.com/api/smartpaper/allAssessments')
        .then(res => {
          setState(prevState => ({
            ...prevState,
            loading: false,
            loadingMessage: '',
            tests: res.data.data
          }));
        })
        .catch(e => {
          setState(prevState => ({
            ...prevState,
            loading: false,
            loadingMessage: '',
            isError: true,
            error: {
              message: e.message
            }
          }));
          setTimeout(() => {
            setState(prevState => ({
              ...prevState,
              isError: false
            }));
          }, 2000);
        });
    }
    fetchTests();
    return null;
  }, []);
  /* useEffect(() => {
    const { school, grade, subject } = inputs;
    if (school.length > 0 && grade.length > 0 && subject.length > 0) {
      axios
        .post('/api/tests', {
          school: school,
          grade: grade,
          subject: subject
        })
        .then(res => {
          setState(prevState => ({
            ...prevState,
            tests: res.data
          }));
        })
        .catch(err => {
          const { message } = err.response.data;
          setState(prevState => ({
            ...prevState,
            tests: [],
            isError: true,
            error: {
              message: message
            }
          }));
          setTimeout(() => {
            setState(prevState => ({
              ...prevState,
              isError: false,
              error: {
                message: ''
              }
            }));
          }, 5000);
        });
    }
    return null;
  }, [inputs.school, inputs.grade, inputs.subject]); */
  return (
    <Container
      sx={{
        marginTop: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Head>
        <title> mySmartPaper&trade; | Scan Assessment</title>
      </Head>
      {state.loading ? <Loader loadingMessage={state.loadingMessage} /> : null}
      <Box
        component="main"
        maxWidth="xs"
        sx={{
          marginTop: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CustomPaper elevation={3}>
          {state.isError ? <ErrorMessage error={state.error} /> : null}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: 3,
              mb: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={12}>
                <CustomLabel id="schoolLabel" htmlFor="school" required>
                  School
                </CustomLabel>

                <Select
                  labelId="schoolLabel"
                  id="school"
                  name="school"
                  required
                  value={inputs.school}
                  input={<CustomInput fullWidth placeholder="School Name" />}
                  onChange={handleChange}
                  label="School Name"
                >
                  {[
                    'Krushnanagar Primary School, Randheja',
                    'LearnSense Academy'
                  ].map((school, index) => (
                    <MenuItem sx={{ fontSize: 14 }} value={school} key={index}>
                      {school}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomLabel id="testNameLabel" htmlFor="testName" required>
                  Grade - Division
                </CustomLabel>

                <Select
                  labelId="testNameLabel"
                  id="grade"
                  name="grade"
                  value={inputs.grade}
                  required
                  input={<CustomInput fullWidth />}
                  onChange={handleChange}
                >
                  <MenuItem sx={{ fontSize: 14 }} value="3-A">
                    3 - A
                  </MenuItem>
                  <MenuItem sx={{ fontSize: 14 }} value="3-B">
                    3 - B
                  </MenuItem>
                  <MenuItem sx={{ fontSize: 14 }} value="4-A">
                    4 - A
                  </MenuItem>
                  <MenuItem sx={{ fontSize: 14 }} value="4-B">
                    4 - B
                  </MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomLabel
                  id="rollNoLabel"
                  name="rollNoLabel"
                  htmlFor="rollNo"
                  required
                >
                  Roll No
                </CustomLabel>
                <CustomInput
                  margin="dense"
                  required
                  fullWidth
                  name="rollNo"
                  label="Roll No"
                  id="rollNo"
                  value={inputs.rollNo}
                  inputProps={{
                    inputMode: 'numeric'
                  }}
                  autoComplete="rollno"
                  aria-errormessage="my-helper-text"
                  onChange={handleChange}
                  placeholder="Roll No"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomLabel id="subjectLabel" htmlFor="subject" required>
                  Subject
                </CustomLabel>

                <Select
                  labelId="subjectLabel"
                  id="subject"
                  required
                  name="subject"
                  value={inputs.subject}
                  input={<CustomInput fullWidth />}
                  onChange={handleChange}
                >
                  {['Maths', 'Gujarati', 'English'].map((subject, index) => (
                    <MenuItem sx={{ fontSize: 14 }} value={subject} key={index}>
                      {subject}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomLabel id="testNameLabel" htmlFor="testName" required>
                  Assignment
                </CustomLabel>

                <Select
                  labelId="testNameLabel"
                  id="testName"
                  name="testName"
                  required
                  value={inputs.testName}
                  input={<CustomInput fullWidth placeholder="Test Name" />}
                  onChange={handleChange}
                >
                  {['Ch-12-HW-1-Page-1-3', 'Ch-12-HW-2-Page-8-10'].map(
                    (testName, index) => (
                      <MenuItem
                        sx={{ fontSize: 14 }}
                        value={testName}
                        key={index}
                      >
                        {testName}
                      </MenuItem>
                    )
                  )}
                  {/* {state.tests?.map(({ id, testName }, index) => (
                    <MenuItem
                      sx={{ fontSize: 14 }}
                      value={testName}
                      key={index}
                    >
                      {testName}
                    </MenuItem>
                  ))} */}
                </Select>
              </Grid>
            </Grid>
            <CustomButton
              type="submit"
              fullWidth
              variant="contained"
              disabled={!(state.testImages.length > 0 && inputs.testName)}
              sx={{
                width: '150px',
                height: '36px',
                fontSize: '16px',
                lineHeight: '20px',
                textTransform: 'none',
                alignSelf: 'center',
                marginTop: '8px',
                borderRadius: '8px'
              }}
            >
              Submit
            </CustomButton>
            <Button
              type="reset"
              // disabled={state.isClearDisabled}
              variant="outlined"
              color="error"
              fullWidth
              sx={{
                width: '150px',
                height: '36px',
                fontSize: '16px',
                // lineHeight: '20px',
                textTransform: 'none',
                alignSelf: 'center',
                borderRadius: '8px',
                marginTop: '8px',
                color: 'theme.palette.error.main'
              }}
              onClick={resetData}
            >
              Clear Data
            </Button>
            {
              <Typography variant="body1" gutterBottom sx={{ mt: 1, mb: 2 }}>
                Total pages : {state.imageSource.length}
              </Typography>
            }
          </Box>
          {state.imageAdded && (
            <ImageViewer>
              {state.imageLabel && (
                <Typography htmlFor="output" className="outputLabel">
                  {state.imageLabel}
                </Typography>
              )}
              {state.resultFetched
                ? state.imageSource.map((source, index) => (
                    <DynamicFeedback
                      className="outputImage"
                      key={index}
                      url={source}
                      width={350}
                      height={500}
                      metadata={state.ans[index] || []}
                    />
                  ))
                : state.imageSource.map((source, index) => (
                    <Image
                      src={source}
                      alt={`Your Work - ${index}`}
                      id="output"
                      key={index}
                      loading="lazy"
                      width={2}
                      height={3}
                      layout="responsive"
                      objectFit="contain"
                      className="outputImage"
                    />
                  ))}
            </ImageViewer>
          )}
          <label htmlFor="testImages" style={{ alignSelf: 'center' }}>
            <Input
              accept="image/*"
              id="testImages"
              name="testImages"
              multiple
              type="file"
              ref={state.inputImage}
              aria-label="Select photo(s)"
              style={{ padding: '15px 20px' }}
              onChange={handleFileChange}
            />
            <CustomButton
              fullWidth
              variant="contained"
              component="span"
              sx={{
                width: '150px',
                height: '36px',
                fontSize: '16px',
                lineHeight: '20px',
                textTransform: 'none',
                alignSelf: 'center',
                marginTop: '8px',
                mb: 2,
                borderRadius: '8px'
              }}
            >
              + Add Page
            </CustomButton>
          </label>
          <CustomButton
            fullWidth
            variant="contained"
            disabled={!(state.testImages.length > 0 && inputs.testName)}
            sx={{
              width: '150px',
              height: '36px',
              fontSize: '16px',
              lineHeight: '20px',
              textTransform: 'none',
              alignSelf: 'center',
              marginBottom: '8px',
              borderRadius: '8px'
            }}
            onClick={handleSubmit}
          >
            Submit
          </CustomButton>
        </CustomPaper>
      </Box>
    </Container>
  );
}
