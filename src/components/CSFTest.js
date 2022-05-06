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

// import Resizer from 'react-image-file-resizer';
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
import TableStyles from '@/styles/TableStyles';

import { Table } from './CustomTable';
import ErrorMessage from './ErrorMessage';
import { resizeFile } from './ImageResize';
import Loader from './Loader';
import { ImageQueue } from './QueueClass';

export default function CSFTest() {
  const columns = useMemo(
    () => [
      {
        Header: 'No.',
        id: 'row',
        maxWidth: 50,
        filterable: false,
        Cell: row => {
          return <div>{row.row.index + 1+"."}</div>;
        },
        style: {
          fontSize: '13px'
        }
      },
      {
        Header: 'Correct',
        accessor: row => row[0].count_correct,
        collapse: true,
        style: {
          fontSize: '13px',
          color: 'green'
        }
      },
      {
        Header: 'Incorrect',
        accessor: row => row[0].count_incorrect,
        collapse: true,
        style: {
          fontSize: '13px',
          color: 'red'
        }
      },
      {
        Header: '% correct',
        accessor: row => row[0].pct_correct_checked,
        Cell: props => props.value + '%',
        collapse: true,
        style: {
          // fontWeight: 'bolder',
          fontSize: '13px',
          width: '200px',
          maxWidth: 400,
          minWidth: 100
        }
      },
      {
        Header: 'Blank',
        accessor: row => row[0].count_blank,
        collapse: true,
        style: {
          fontSize: '13px',
          maxWidth: 400,
          minWidth: 80
        }
      },
      {
        Header: '% total correct',
        collapse: true,
        accessor: row => row[0].pct_correct_total,
        Cell: props => props.value + '%',
        style: {
          fontSize: '13px',
          width: '100px',
          maxWidth: 400,
          minWidth: 120
        }
      },
      {
        Header: 'Result Img Link',
        accessor: row => row[1],
        Cell: e => (
          <a href={e.value} target="_blank" rel="noreferrer">
            {' '}
            {e.value}{' '}
          </a>
        ),
        style: {
          fontSize: '13px',
          width: '100px',
          maxWidth: 1000,
          minWidth: 720
        }
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
    testResult: []
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
              imageSource: [...prevState.imageSource, blob], //.blob
              testImages: [...prevState.testImages, res] //.res
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
  const upLoad = img => {
    setState(prevState => ({
      ...prevState,
      imgData: img
    }));
    // console.log("image obj: - ",img)
    // console.log('test result', state.testResult);
    // document.getElementById('changeImage').click();
  };
  const replaceImage = e => {
    console.log(e);
  };
  const resetData = e => {
    e.preventDefault();
    resetForm();
    state.inputImage.current.value = '';

    setState(prevState => ({
      ...prevState,
      testImages: [],
      imageLabel: '',
      imageAdded: false,
      imageSource: [],
      resultImages: [],
      isDisabled: true,
      isClearDisabled: true,
      resultFetched: false,
      isError: false,
      error: {
        message: ''
      },
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
    // console.log("test result: ", res.data.data.test_result[0], "output result image: ",res.data.data.output_res);
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
      testResult: [
        ...prevState.testResult,
        [...res.data.data.test_result, ...res.data.data.output_res]
      ]
    }));
    // console.log("state test result: ", state.testResult)
  };
  const data = useMemo(() => state.testResult, [state.testResult]);
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
              {state.resultFetched ? (
                // ? state.resultImages.map((source, index) => (
                //     <Image
                //       className="outputImage"
                //       key={index}
                //       src={source}
                //       width={350}
                //       height={500}
                //       layout="responsive"
                //       objectFit="contain"
                //       alt={`output-${index}`}
                //       loading="eager"
                //       priority
                //       onClick={() => upLoad(state.resultImages[index])}
                //     />
                //   ))
                <></>
              ) : (
                // console.log('output received')
                state.imageSource.map((source, index) => (
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
                    onClick={() => upLoad(source)}
                  />
                ))
              )}
            </ImageViewer>
          )}
          <input
            id="changeImage"
            hidden
            type="file"
            onChange={e => replaceImage(e)}
          />
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
            <TableStyles>
              <Table
                columns={columns}
                data={data}
                getHeaderProps={column => ({
                  style: {
                    color: 'white'
                  }
                })}
              />
            </TableStyles>
          )}
        </CustomPaper>
      </Box>
    </Container>
  );
}
