import styled from 'styled-components';

const ImageViewer = styled.div`
  display: block;
  margin: 0;
  padding: 0;
  position: relative;
  width: 100%;
  /* width: 400px; */
  .outputLabel {
    font-size: 1rem;
    text-align: center;
    font-weight: bold;
    font-family: 'Open Sans';
    margin-top: 0;
    margin-bottom: 8px;
  }
  .outputImage {
    min-width: 350px;
    max-width: 400px;
    width: 100%;
    height: auto;
    padding: 0;
    /* max-width: 350px; */
    margin: 2px 5px;
    margin-top: 2px;
    border-radius: 8px;
    box-sizing: border-box;
    /* border: 10px solid red; */
    filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.3));
  }
  @media (max-width: 400px) {
    margin: auto;
    .outputImage {
      padding: 0;
      width: 350px;
      max-width: 100%;
      margin: 2px 5px;
      margin-top: 2px;
      border-radius: 8px;
      box-sizing: border-box;
      filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.3));
    }
  }
`;

export default ImageViewer;
