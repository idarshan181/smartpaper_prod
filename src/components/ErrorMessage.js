import { Alert, AlertTitle } from "@mui/material";
import PropTypes from "prop-types";
const ErrorMessage = ({ error }) => {
  if (!error || !error.message) return null;
  if (
    error.networkError &&
    error.networkError.result &&
    error.networkError.result.errors.length
  ) {
    return error.networkError.result.errors.map((error, i) => (
      <Alert variant="outlined" key={i} severity="error">
        <AlertTitle>Error!</AlertTitle>
        <p data-test="graphql-error">
          {error.message.replace("GraphQL error: ", "")}
        </p>
      </Alert>
    ));
  }
  return (
    <Alert variant="outlined" severity="error">
      <AlertTitle>Error!</AlertTitle>
      <p data-test="graphql-error">
        {error.message.replace("GraphQL error: ", "")}
      </p>
    </Alert>
  );
};

ErrorMessage.defaultProps = {
  error: {},
};

ErrorMessage.propTypes = {
  error: PropTypes.object,
};

export default ErrorMessage;
