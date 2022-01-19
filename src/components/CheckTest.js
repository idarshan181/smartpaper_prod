/* eslint-disable react-hooks/exhaustive-deps */
import { createRef, useEffect, useState } from 'react';
import CustomPaper from '../styles/CustomPaper';
import { CustomButton, CustomInput, CustomLabel } from '../styles/CustomForm';
import Loader from './Loader';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  LinearProgress,
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

const DynamicFeedback = dynamic(() => import('./Feedback'), {
  ssr: false
});
export default function CheckTest() {
  const [state, setState] = useState({
    orgName: '',
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
    pageMetadata: []
  });
  const { inputs, handleChange, resetForm, clearForm } = useForm({
    testName: '',
    version: 'v1'
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

      /* const source = await Promise.all(
      fileList.map(async (file) => encodeImageFileAsURL(file).then(res => res))
    ) */
      // imageSource: [...prevState.imageSource, ...source], to Append new Image
      setState(prevState => ({
        ...prevState,
        testImages: [...prevState.testImages, files[0]],
        imageAdded: true,
        resultFetched: false,
        imageSource: [...source],
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
    const { testName } = inputs;
    const { orgName, testImages, tests } = state;
    setState(prevState => ({
      ...prevState,
      formLoading: true,
      isDisabled: true,
      isClearDisabled: true,
      loading: true,
      loadingMessage: 'Please wait we are getting results for you'
    }));
    const pageIds = tests.find(test => test.testName === testName).pageId;
    const pageMeta = await getPageMetadata(pageIds).then(
      res => res.data.pageDetails[0]
    );
    await getScanResult(testName, testImages, orgName)
      .then(res => {
        const { output_res, input_res, success, error_message } =
          res?.data?.data;
        console.log(res.data.data);
        if (success !== false) {
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
            pageMetadata: pageMeta
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
        console.log(err);
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
    if (typeof router.query.orgName === 'undefined' && state.orgName === '') {
      router.push('/');
    }
    setState(prevState => ({
      ...prevState,
      orgName: router.query.orgName,
      loading: true,
      loadingMessage: 'Fetching Assessments'
    }));

    fetchAllTests()
      .then(res => {
        console.log('tests', res.data.data);
        setState(prevState => ({
          ...prevState,
          loading: false,
          loadingMessage: '',
          tests: res.data.data
        }));
      })
      .catch(err => {
        console.log('error', err);
        setState(prevState => ({
          ...prevState,
          loading: false,
          loadingMessage: '',
          isError: true,
          error: {
            message: err.message
          }
        }));
        setTimeout(() => {
          setState(prevState => ({
            ...prevState,
            isError: false
          }));
        }, 2000);
      });
    /* async function fetchTests() {
      console.log('fetching tests');
      await axios
        .get('https://api.smartpaperapp.com/api/smartpaper/allAssessments')
        .then(res => {
          console.log('tests', res.data.data);
          setState(prevState => ({
            ...prevState,
            loading: false,
            loadingMessage: '',
            tests: res.data.data
          }));
        })
        .catch(e => {
          console.log('error', e);
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
    fetchTests(); */
  }, []);
  return (
    <CustomPaper>
      <Head>
        <title>Smart Paper | Scan Assessment</title>
      </Head>
      {state.isError ? <ErrorMessage error={state.error} /> : null}
      {state.loading ? <Loader loadingMessage={state.loadingMessage} /> : null}
      <Box
        component="form"
        aria-busy={state.formLoading}
        sx={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={handleSubmit}
        onReset={resetData}
      >
        <CustomLabel
          id="testNameLabel"
          htmlFor="testName"
          sx={{ marginBottom: '-10px' }}
        >
          Select your assessment
        </CustomLabel>

        <Select
          labelId="testNameLabel"
          id="testName"
          name="testName"
          value={inputs.testName}
          input={<CustomInput />}
          onChange={handleChange}
          label="Select your assessment"
        >
          {state.tests?.map(({ id, testName }, index) => (
            <MenuItem sx={{ fontSize: 14 }} value={testName} key={index}>
              {testName}
            </MenuItem>
          ))}
        </Select>

        <CustomLabel id="fileName" name="fileName" htmlFor="testImages">
          Select photo(s)
        </CustomLabel>
        <CustomFileInput
          ref={state.inputImage}
          type="file"
          accept="image/*"
          id="testImages"
          name="testImages"
          aria-label="Select photo(s)"
          style={{ padding: '15px 20px' }}
          onChange={handleFileChange}
        />

        <CustomButton
          type="submit"
          fullWidth
          variant="contained"
          disabled={!(state.testImages.length > 0 && inputs.testName)}
          sx={{
            width: '200px',
            height: '40px',
            fontSize: '18px',
            lineHeight: '20px',
            textTransform: 'none',
            alignSelf: 'center',
            borderRadius: '8px'
          }}
        >
          Submit
        </CustomButton>
        <Button
          type="reset"
          disabled={state.isClearDisabled}
          variant="outlined"
          color="error"
          fullWidth
          sx={{
            width: '200px',
            height: '40px',
            fontSize: '18px',
            lineHeight: '20px',
            textTransform: 'none',
            alignSelf: 'center',
            mt: '8px',
            mb: '8px',
            borderRadius: '8px',
            color: 'theme.palette.error.main'
          }}
        >
          Clear Data
        </Button>
      </Box>
      {state.imageAdded ? (
        <ImageViewer>
          {state.imageLabel !== '' ? (
            <Typography htmlFor="output" className="outputLabel">
              {state.imageLabel}
            </Typography>
          ) : (
            <></>
          )}
          {state?.imageSource.map((source, index) => (
            <DynamicFeedback
              className="outputImage"
              key={index}
              url={source}
              width={350}
              height={500}
              metadata={state.pageMetadata || []}
            />
          ))}
        </ImageViewer>
      ) : (
        <></>
      )}
    </CustomPaper>
  );
}

{
  /* <Image
  src={source}
  alt={`Your Work - ${index}`}
  id="output"
  key={index}
  loading="lazy"
  width="100%"
  height="100%"
  layout="responsive"
  objectFit="contain"
  className="outputImage"
/>; */
}
