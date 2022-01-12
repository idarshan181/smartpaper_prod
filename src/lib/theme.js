import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4545b9",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: "Open Sans",
    // htmlFontSize: 10,
    fontSize: 10,
  },
  MuiInputLabel: {
    color: "#f30000",
  },
});

export default theme;
