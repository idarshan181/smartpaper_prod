import { createRef, useEffect, useState } from "react";
import CustomPaper from "../styles/CustomPaper";
import { CustomButton, CustomInput, CustomLabel } from "../styles/CustomForm";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import useForm from "../lib/useForm";
import { CustomFileInput } from "../styles/CustomFileInput";
import { useRouter } from "next/router";
import axios from "axios";
import ImageViewer from "../styles/ImageViewer";
import Image from "next/image";
export default function CheckTest() {
  const [state, setState] = useState({
    orgName: "",
    imageLabel: "",
    imageSource: [],
    imageAdded: false,
    loading: false,
    loadingMessage: "",
    isError: false,
    errorMessage: "",
    resultFetched: false,
    result: {
      correct: 0,
      incorrect: 0,
      percentage: 0,
    },
    studentResult: [],
    testImages: [],
    isDisabled: true,
    isClearDisabled: true,
    tests: [],
    inputImage: createRef(),
  });
  const { inputs, handleChange, resetForm, clearForm } = useForm({
    testName: "",
    version: "v1",
  });
  const handleFileChange = async (e) => {
    setState((prevState) => ({
      ...prevState,
      imageAdded: false,
      resultFetched: false,
      imageLabel: "",
      isDisabled: true,
      isClearDisabled: true,
    }));
    const { files } = e.target;
    if (files.length === 0) {
      setState((prevState) => ({
        ...prevState,
        testImages: [],
        imageLabel: "",
        imageAdded: false,
        imageSource: [],
        isDisabled: true,
        isClearDisabled: true,
      }));
    } else {
      const fileList = Object.values(files);

      const source = await Promise.all(
        fileList.map(async (file) => URL.createObjectURL(file))
      );

      /* const source = await Promise.all(
      fileList.map(async (file) => encodeImageFileAsURL(file).then(res => res))
    ) */
      setState((prevState) => ({
        ...prevState,
        testImages: [...prevState.testImages, files[0]],
        imageAdded: true,
        resultFetched: false,
        imageSource: [...prevState.imageSource, ...source],
        imageLabel: "Your Work",
        isDisabled: false,
        isClearDisabled: false,
      }));
    }
  };
  const resetData = (e) => {
    e.preventDefault();
    // document.getElementById("image-input").value = "";
    resetForm();
    state.inputImage.current.value = "";
    setState((prevState) => ({
      ...prevState,
      testImages: [],
      imageLabel: "",
      imageAdded: false,
      imageSource: [],
      isDisabled: true,
      isClearDisabled: true,
      resultFetched: false,
      isError: false,
      errorMessage: "",
      result: {
        correct: 0,
        incorrect: 0,
        percentage: 0,
      },
      loading: false,
      loadingMessage: "",
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit");
  };
  const router = useRouter();
  useEffect(() => {
    if (typeof router.query.orgName === "undefined" && state.orgName === "") {
      router.push("/");
    }
    setState((prevState) => ({
      ...prevState,
      orgName: router.query.orgName,
      loading: true,
      loadingMessage: "Fetching Assessments",
    }));
    async function fetchTests() {
      await axios
        .get("https://api.smartpaperapp.com/api/smartpaper/allAssessments")
        .then((res) => {
          setState((prevState) => ({
            ...prevState,
            loading: false,
            loadingMessage: "",
            tests: res.data.data,
          }));
        })
        .catch((e) => {
          setState((prevState) => ({
            ...prevState,
            loading: false,
            loadingMessage: "",
            isError: true,
            error: {
              message: err.message,
            },
          }));
          setTimeout(() => {
            setState((prevState) => ({
              ...prevState,
              isError: false,
            }));
          }, 2000);
        });
    }
    fetchTests();
  }, []);
  return (
    <CustomPaper>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        onSubmit={handleSubmit}
        onReset={resetData}
      >
        {/* <CustomLabel label={`Select your assessment`} id="testName" /> */}
        <CustomLabel id="testNameLabel" htmlFor="testName">
          <b> Select your assessment</b>
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
          <b>Select photo(s)</b>
        </CustomLabel>
        <CustomFileInput
          ref={state.inputImage}
          type="file"
          accept="image/*"
          id="testImages"
          name="testImages"
          aria-label="Select photo(s)"
          style={{ padding: "15px 20px" }}
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
            width: "200px",
            height: "50px",
            fontSize: "18px",
            lineHeight: "20px",
            textTransform: "none",
            alignSelf: "center",
            borderRadius: "8px",
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
            width: "200px",
            height: "50px",
            fontSize: "18px",
            lineHeight: "20px",
            textTransform: "none",
            alignSelf: "center",
            mt: "8px",
            mb: "8px",
            borderRadius: "8px",
            color: "theme.palette.error.main",
          }}
        >
          Clear Data
        </Button>
      </Box>
      {state.imageAdded ? (
        <ImageViewer>
          {state.imageLabel !== "" ? (
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
