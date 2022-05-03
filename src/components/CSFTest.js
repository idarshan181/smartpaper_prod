/* eslint-disable no-const-assign */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import Head from 'next/head';
import Image from 'next/image';
import { createRef, useMemo, useState } from 'react';
import Resizer from 'react-image-file-resizer';

import useForm from '@/libs/useForm';

import { CSFTestNames } from '@/data/csf';

import {
  CustomButton,
  CustomInput,
  CustomLabel,
  Input
} from '@/styles/CustomForm';
import CustomPaper from '@/styles/CustomPaper';
import ImageViewer from '@/styles/ImageViewer';
import CustomTable from '@/styles/CustomTable';

import ErrorMessage from './ErrorMessage';
import Loader from './Loader';
import { ImageQueue } from './QueueClass';
import { Table } from './CustomTable';
import { Upload } from '@mui/icons-material';

const resizeFile = file =>
  new Promise(resolve => {
    Resizer.imageFileResizer(
      file, //file name
      720, //max width
      1280, //ht
      'jpeg', //format
      50, //quality
      0, //rotation
      uri => {
        resolve(uri);
      },
      'file',
      720,
      1280
    );
  });

export default function CSFTest() {
  const upLoad = (img) => {
    setState(prevState => ([prevState.imgData, img]))
    document.getElementById("changeImage").click();
  }
  const replaceImage = (e) => {
    console.log(e)
  }
  const columns = useMemo(
    () => [
      
      {
        Header: 'Correct',
        accessor: 'count_correct',
        style: {
          // fontWeight: 'bolder',
          fontSize: '13px',
          color: 'deep-green',
        },
      },
      {
        Header: 'Incorrect',
        accessor: 'count_incorrect',
        style: {
          // fontWeight: 'bolder',
          fontSize: '13px',
          color: 'red'
        }
      },
      {
        Header: '% correct',
        accessor: 'pct_correct_checked',
        Cell: props => props.value+"%",
        style: {
          // fontWeight: 'bolder',
          fontSize: '13px',
        },
      },
      {
        Header: 'Blank',
        accessor: 'count_blank',
        style: {
          // fontWeight: 'bolder',
          fontSize: '13px',
        },
      },
      {
        Header: '% total correct',
        accessor: 'pct_correct_total',
        Cell: props => props.value + "%",
        style: {
          // fontWeight: 'bolder',
          fontSize: '13px',
        },
      }
    ],
    []
  );
  const data = useMemo(
    () => [
      {
        count_blank: 1,
        count_correct: 3,
        count_incorrect: 9,
        pct_correct_checked: 25,
        pct_correct_total: 23.1
      },
      {
        count_blank: 2,
        count_correct: 5,
        count_incorrect: 3,
        pct_correct_checked: 40,
        pct_correct_total: 40.1
      }
    ],
    []
  );
  
  const [state, setState] = useState({
    orgName: 'CSF',
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
    studentResult: [],
    testImages: [],
    isDisabled: true,
    isClearDisabled: true,
    inputImage: createRef(),
    resultImages: [],
    testResult: [],
    imgData: null,
  });
  const { inputs, handleChange, resetForm, clearForm } = useForm({
    school: '',
    testName: 'Demo MCQ 1',
    rollNo: '',
    grade: '',
    subject: ''
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
      // Note:  Just to show it in the image component
      const fileList = Object.values(files);
      fileList.map(async (file, id) => {
        // console.log(`original-${id}`, file);
        await resizeFile(file)
          .then(res => {
            // console.log(`using image resizer-${id}`, res);
            const blob = URL.createObjectURL(res);
            setState(prevState => ({
              ...prevState,
              imageSource: [...prevState.imageSource, blob],
              testImages: [...prevState.testImages, res]
            }));
          })
          .catch(err => console.log(err));
      });
      // imageSource: [...prevState.imageSource, ...source], to Append new Image
      // testImages: [...prevState.testImages, files[0]],
      //note: testImages will be sent to backend
      setState(prevState => ({
        ...prevState,
        imageAdded: true,
        resultFetched: false,
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
      resultImages: [],
      loading: false,
      loadingMessage: '',
      testResult: []
    }));
  };

  const updateState = (res, requestId) => {
    console.log(
      `Res from queue class - ${requestId}`,
      res,
      new Date().toLocaleTimeString('en-US')
    );
    setState(prevState => ({
      ...prevState,
      loading: false,
      loadingMessage: '',
      imageLabel: 'Your Result',
      resultImages: [...prevState.resultImages, ...res.data.data.output_res],
      isDisabled: true,
      isClearDisabled: false,
      testImages: [],
      resultFetched: true,
      testResult: [...prevState.testResult, res.data.data.test_result[0]]
    }));
  };
  const data1 = useMemo(() => state.testResult, [state.testResult])
  const handleError = (err, requestId) => {
    console.log(
      `Error from queue class - ${requestId}`,
      err,
      new Date().toLocaleTimeString('en-US')
    );
  };
  const handleSubmit = async e => {
    e.preventDefault();

    const { testName, school, grade, rollNo, subject } = inputs;
    const { orgName, testImages } = state;
    setState(prevState => ({
      ...prevState,
      isDisabled: true,
      isClearDisabled: true,
      resultImages: [],
      loading: true,
      loadingMessage: 'Please wait we are getting results for you'
    }));
    const imageQ = new ImageQueue(
      testName,
      testImages,
      orgName,
      school,
      grade,
      rollNo,
      subject,
      updateState,
      handleError
    );
    imageQ.start();
    setTimeout(() => {
      setState(prevState => ({
        ...prevState,
        isDisabled: true,
        isClearDisabled: true,
        loading: false,
        loadingMessage: ''
      }));
    }, 6000);
    /* await getScanResult(
      testName,
      testImages,
      orgName,
      school,
      grade,
      rollNo,
      subject
    )
      .then(response => {
        console.log({ response });
        const {
          output_res,
          input_res,
          crops_res,
          res,
          success,
          error_message
        } = response?.data?.data;
        if (success !== false) {
          setState(prevState => ({
            ...prevState,
            loading: false,
            loadingMessage: '',
            imageLabel: 'Your Result',
            imageSource: output_res,
            isDisabled: true,
            isClearDisabled: false,
            testImages: [],
            resultFetched: true
          }));
        } else {
          setState(prevState => ({
            ...prevState,
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
          window.scrollTo(0, 0);
          setTimeout(() => {
            setState(prevState => ({
              ...prevState,
              isError: false,
              error: {
                message: ''
              }
            }));
          }, 60000);
        }
      })
      .catch(err => {
        setState(prevState => ({
          ...prevState,
          formLoading: false,
          loading: false,
          loadingMessage: '',
          isError: true,
          error: {
            message: err.response.data.detail
          },
          resultFetched: false,
          imageLabel: '',
          isDisabled: false,
          isClearDisabled: false
        }));
        window.scrollTo(0, 0);
        setTimeout(() => {
          setState(prevState => ({
            ...prevState,
            isError: false,
            error: {
              message: ''
            }
          }));
        }, 60000);
      }); */
  };

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
      {state.loading && <Loader loadingMessage={state.loadingMessage} />}
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
              <Grid item xs={12} sm={12}>
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
                  {CSFTestNames.map((testName, index) => (
                    <MenuItem
                      sx={{ fontSize: 14 }}
                      value={testName}
                      key={index}
                    >
                      {testName}
                    </MenuItem>
                  ))}
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
                ? state.resultImages.map((source, index) => (
                    <Image
                      className="outputImage"
                      key={index}
                      src={source}
                      width={350}
                      height={500}
                      layout="responsive"
                      objectFit="contain"
                      alt={`output-${index}`}
                      loading="eager"
                      priority
                      onClick={() => upLoad(source)}
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
          <input id="changeImage" hidden type="file" onChange={(e) => replaceImage(e)}/>
          <label htmlFor="testImages" style={{ alignSelf: 'center' }}>
            <Input
              accept="image/*"
              id="testImages"
              name="testImages"
              type="file"
              multiple
              ref={state.inputImage}
              aria-label="Select photo(s)"
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
          {state.resultFetched && (
            <div>
            <CustomTable>
              <Table columns={columns} data={data1} getHeaderProps={column => ({
                style:{
                  color: "black",
                }
              })}
              />
            </CustomTable>
            </div>
          )}
        </CustomPaper>
      </Box>
    </Container>
  );
}
