import { Alert, AlertTitle, Box } from '@mui/material';
import PropTypes from 'prop-types';

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
          {error.message.replace('GraphQL error: ', '')}
        </p>
      </Alert>
    ));
  }
  return (
    <Box sx={{ mb: 0,mt:2 }}>
      <Alert variant="outlined" severity="error">
        <AlertTitle>Error!</AlertTitle>
        <p
          data-test="graphql-error"
          style={{
            fontSize: '12px',
            margin: '0',
            fontWeight: '400'
          }}
        >
          {error.message.replace('GraphQL error: ', '')}
        </p>
      </Alert>
    </Box>
  );
};

ErrorMessage.defaultProps = {
  error: {}
};

ErrorMessage.propTypes = {
  error: PropTypes.object
};

export default ErrorMessage;
