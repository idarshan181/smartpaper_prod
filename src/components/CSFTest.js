/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-const-assign */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorOutline } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Grid,
  LinearProgress,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import Head from 'next/head';
import Image from 'next/image';
import { createRef, useMemo, useState } from 'react';
import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

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

import { test_page4_1 } from './Columns';
import { ResetDialog } from './CustomDialog';
import { Table } from './CustomTable';
import ErrorImageComponent from './ErrorImageComponent';
import ErrorMessage from './ErrorMessage';
import { resizeFile } from './ImageHandling';
import Loader from './Loader';
import { ImageQueue } from './QueueClass';

export default function CSFTest() {
  // const columns = useMemo(() => DemoMCQ, []);
  const columns = useMemo(() => test_page4_1, []);
  const tempElement = useRef();
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
    errorProps: [],
    totalErrorImages: 0,
    resultFetched: false,
    studentResult: [],
    testImages: [],
    isDisabled: true,
    isClearDisabled: true,
    inputImage: createRef(),
    resultImages: [],
    testResult: [],
    progressStatus: 0,
    totalImages: 0,
    open: false,
    requestArray: []
  });
  const { inputs, handleChange, resetForm, clearForm } = useForm({
    school: '',
    testName: 'Demo MCQ 3',
    rollNo: '',
    grade: '',
    subject: ''
  });

  const handleFileChange = async e => {
    setState(prevState => ({
      ...prevState,
      imageAdded: false,
      imageLabel: '',
      isDisabled: true,
      isClearDisabled: true,
      pageMetadata: []
    }));
    const { files } = e.target;
    if (files.length === 0) {
      setState(prevState => ({
        ...prevState,
        // testImages: [],
        imageLabel: '',
        imageAdded: true,
        // imageSource: [],
        isDisabled: false,
        isClearDisabled: false
      }));
    } else {
      // Note:  Just to show it in the image component
      const fileList = Object.values(files);
      fileList.map(async (file, id) => {
        console.log(`original-${id}`, state.inputImage.current.height);

        await resizeFile(file).then(res => {
          const blob = URL.createObjectURL(res);
          console.log(`blob`, blob);
          setState(prevState => ({
            ...prevState,
            imageSource: [...prevState.imageSource, blob], //.blob
            testImages: [...prevState.testImages, res], //.res {img: file, id:int}
            totalImages: prevState.totalImages
          }));
        });
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
      errorProps: [],
      totalErrorImages: 0,
      loading: false,
      loadingMessage: '',
      testResult: [],
      progressStatus: 0,
      open: false
      // errorImage: '',
    }));
  };
  const updateState = (res, requestNo) => {
    console.log(
      `Res from queue class - ${requestNo}`,
      res.data.data.rollNo,
      new Date().toLocaleTimeString('en-US')
    );
    // console.log('request array updateState: uno ', state.requestArray);
    setState(prevState => ({
      ...prevState,
      loading: false,
      loadingMessage: '',
      imageLabel: 'Your Result',
      resultImages: [...prevState.resultImages, ...res.data.data.output_res],
      isDisabled: true,
      isClearDisabled: false,
      testImages: [],
      imageSource: [],
      resultFetched: true,
      testResult: [
        ...prevState.testResult,
        [
          ...res.data.data.test_result,
          ...res.data.data.output_res,
          res.data.data.rollNo
        ]
      ],
      progressStatus: requestNo,
      totalImages: state.testImages.length
    }));
  };

  const handleError = (err, requestNo) => {
    // console.log(
    //   `Error from queue class - ${requestNo}`,
    //   err.response.data,
    //   new Date().toLocaleTimeString('en-US')
    // );
    const testImageIndex = err.response.data.detail.imageIndex;
    const errorId = err.response.data.detail.requestId;
    // console.log('request state : ', state.testResult);
    let tempErrorProps = {
      ['errorId']: errorId,
      ['errorImageIndex']: testImageIndex
    };
    // console.log('temp props', tempErrorProps);
    setState(prevState => ({
      ...prevState,
      loading: false,
      loadingMessage: '',
      testImages: [],
      imageSource: [],
      isError: true,
      errorProps: [...prevState.errorProps, tempErrorProps],
      totalErrorImages: prevState.totalErrorImages + 1,
      error: {
        message: err.response.data.detail.detail
      },
      progressStatus: requestNo
    }));
  };
  const data = useMemo(() => state.testResult, [state.testResult]);

  const handleSubmit = async e => {
    e.preventDefault();
    const { testName, school, grade, rollNo, subject } = inputs;
    const { orgName, testImages, imageSource } = state;
    // console.log("testImage, imsource", state.imageSource, state.testImages)
    let tempReqArray = testImages.map((image, id) => {
      let obj = {};
      obj['requestId'] = uuidv4();
      // obj['testImages'] = image;
      obj['orgName'] = orgName;
      obj['testName'] = testName;
      obj['testImages'] = image;
      obj['imageSource'] = imageSource[id];
      return obj;
    });
    // console.log('state after map :', state.requestArray);
    setState(prevState => ({
      ...prevState,
      requestArray: [...tempReqArray],
      isError: false,
      errorProps: [],
      totalErrorImages: 0,
      isDisabled: true,
      isClearDisabled: true,
      loading: true,
      loadingMessage: 'Please wait we are getting results for you'
    }));
    const imageQ = new ImageQueue(
      tempReqArray,
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
  };

  // const errorComponent = () => {
  //   let errImages = [];
  //   // console.log('error props', state.errorProps);
  //   state.errorProps.map(element => {
  //     errImages.push(
  //       state.requestArray.find(
  //         errImgElement => errImgElement.requestId === element.errorId
  //       )
  //     );
  //   });
  //   // console.log('error images', errImages[0].imageSource);
  //   return errImages.map((errImage, id) => (
  //     // console.log(errImage.imageSource)
  //     <Image
  //       key={id}
  //       src={errImage.imageSource}
  //       alt={`error image ${id}`}
  //       className="outputImage"
  //       width={2}
  //       height={3}
  //       layout="responsive"
  //       objectFit="contain"
  //     />
  //   ));
  // };
  const handleClickOpen = () => {
    setState(prevState => ({
      ...prevState,
      open: true
    }));
    console.log('test result', state.testResult);
  };
  const handleClose = () => {
    setState(prevState => ({
      ...prevState,
      open: false
    }));
  };
  const deleteErrorComponent = errorCompProp => {
    // console.log('first delete error: ', errorCompProp, state.errorProps);
    const temp = state.errorProps.filter(
      errorProp => errorProp.errorId !== errorCompProp.requestId
    );
    const temp2 = state.errorProps.findIndex(
      element => element.errorId === errorCompProp.requestId
    );
    state.errorProps.splice(temp2, 1);
    // console.log('temp err prop', temp);
    // console.log('temp2 err prop', temp2);
    // console.log("new state", state.errorProps);
    setState(prevState => ({
      ...prevState,
      errorProps: [...temp]
    }));
    if (temp.length < 1) {
      setState(prevState => ({
        ...prevState,
        isError: false
      }));
    }
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
            {
              <Typography variant="body1" gutterBottom sx={{ mt: 1, mb: 2 }}>
                Total pages : {state.imageSource.length}
              </Typography>
            }
          </Box>

          {state.imageAdded && (
            <ImageViewer>
              {state.testResult.length > 0 && (
                <TableStyles>
                  {/* {state.imageLabel && (
                    <Typography htmlFor="output" className="outputLabel">
                      {state.imageLabel}
                    </Typography>
                  )} */}
                  <h3> Results</h3>
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
              {state.resultFetched ? (
                <div>
                  {/* {state.resultImages.map((source, index) => (
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
                      onClick={() => upLoad(state.resultImages[index])}
                    />
                  ))} */}
                  <Box
                    sx={{
                      mb: 2
                    }}
                  >
                    <Typography variant="h6" component="div" textAlign="center">
                      {state.progressStatus}/{state.totalImages}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(state.progressStatus / state.totalImages) * 100}
                      sx={{ height: 7 }}
                    ></LinearProgress>
                  </Box>
                </div>
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
                      onClick={() => {
                        console.log('ref', state.inputImage);
                      }}
                  />
                ))
              )}
            </ImageViewer>
          )}
          {state.isError && (
            <ImageViewer>
              <Typography variant="h5" textAlign="center">
                Error Image count: {`no. ${state.totalErrorImages}`}
              </Typography>
              {state.isError ? <ErrorMessage error={state.error} /> : null}
              {/* {errorComponent()} */}
              <ErrorImageComponent
                requestArray={state.requestArray}
                errorProps={state.errorProps}
                deleteErrorImg={deleteErrorComponent}
              />

              {/* <Image
                src={state.errorImage}
                alt={`error image`}
                className="outputImage"
                width={2}
                height={3}
                layout="responsive"
                objectFit="contain"
              ></Image> */}
            </ImageViewer>
          )}

          {/* table styles was here */}
          <Box
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              position: 'sticky',
              bottom: 0,
              backgroundColor: '#ffffff7f',
              width: '100%'
            }}
          >
            <ResetDialog
              open={state.open}
              onClose={handleClose}
              onReset={resetData}
            />
            <Button
              variant="outlined"
              color="error"
              startIcon={<ErrorOutline />}
              sx={{
                width: '150px',
                height: '36px',
                fontSize: '16px',
                lineHeight: '20px',
                textTransform: 'none',
                alignSelf: 'center',
                // marginTop: '8px',
                borderRadius: '8px',
                mr: 1
              }}
              onClick={handleClickOpen}
            >
              Clear
            </Button>
            <label htmlFor="testImages">
              <Input
                accept="image/*"
                id="testImages"
                name="testImages"
                type="file"
                multiple
                ref={state.inputImage}
                // ref={tempElement}
                aria-label="Select photo(s)"
                onChange={handleFileChange}
              />
              <CustomButton
                variant="contained"
                component="span"
                sx={{
                  width: '106px',
                  height: '36px',
                  fontSize: '16px',
                  lineHeight: '20px',
                  textTransform: 'none',
                  alignSelf: 'center',
                  // marginTop: '8px',
                  borderRadius: '8px',
                  mr: 1,
                  mb: 0.41
                }}
              >
                + Add
              </CustomButton>
            </label>
            <CustomButton
              variant="contained"
              type="submit"
              disabled={!(state.testImages.length > 0 && inputs.testName)}
              sx={{
                width: '150px',
                height: '36px',
                fontSize: '16px',
                lineHeight: '20px',
                textTransform: 'none',
                alignSelf: 'center',
                // marginTop: '8px',
                borderRadius: '8px'
              }}
              onClick={handleSubmit}
            >
              Submit
            </CustomButton>
          </Box>
        </CustomPaper>
      </Box>
    </Container>
  );
}
