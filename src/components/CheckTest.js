import { createRef, useEffect, useState } from 'react';
import CustomPaper from '../styles/CustomPaper';
import { CustomButton, CustomInput, CustomLabel } from '../styles/CustomForm';
import Loader from './Loader';
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
import { getScanResult } from '../lib/api';
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
    formLoading: false
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
      isClearDisabled: true
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
    const { orgName, testImages } = state;
    setState(prevState => ({
      ...prevState,
      formLoading: true,
      isDisabled: true,
      isClearDisabled: true,
      loading: true,
      loadingMessage: 'Please wait we are getting results for you'
    }));
    await getScanResult(testName, testImages, orgName)
      .then(res => {
        const { output_res, input_res, success, error_message } =
          res?.data?.data;
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
            testImages: []
          }));
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
    }
    fetchTests();
  }, [router, state.orgName]);
  return (
    <CustomPaper>
      {state.isError ? <ErrorMessage error={state.error} /> : null}
      {state.loading ? <Loader loadingMessage={state.loadingMessage} /> : null}
      <Box
        component="form"
        aria-busy={state.formLoading}
        sx={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={handleSubmit}
        onReset={resetData}
      >
        {/* <CustomLabel label={`Select your assessment`} id="testName" /> */}
        <CustomLabel
          id="testNameLabel"
          htmlFor="testName"
          sx={{ marginBottom: '-10px' }}
        >
          Select your assessment
        </CustomLabel>
        {/* <CustomSelect name="testName" id="testName">
          <option value="grade12">Grade 12 Math Readiness Test</option>
          <option value="grade12">Grade 12 Math Readiness Test</option>
          <option value="grade12">Grade 12 Math Readiness Test</option>
          <option value="grade12">Grade 12 Math Readiness Test</option>
          <option value="grade12">Grade 12 Math Readiness Test</option>
          <option value="grade12">Grade 12 Math Readiness Test</option>
          {tests?.map(({ id, testName }, index) => (
            <option value={testName} key={index}>
              {testName}
            </option>
          ))}
        </CustomSelect> */}
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
        {/* <input
          type="file"
          accept="image/*"
          id="testImages"
          name="testImages"
          aria-label="Select photo(s)"
        /> */}
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
        {/* <CustomLabel
          label={`Select photo(s)`}
          id="testImages"
          htmlFor="testImages"
        >
          <Button variant="raised" component="span">
            Upload
          </Button>
        </CustomLabel> */}
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
            <Image
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
            />
          ))}
        </ImageViewer>
      ) : (
        <></>
      )}
    </CustomPaper>
  );
}
