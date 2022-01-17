import styled from 'styled-components'

const ImageViewer = styled.div`
  display: block;
  margin-top: 10px;
  position: relative;
  width: 350px;
  .outputLabel {
    font-size: 1rem;
    text-align: center;
    font-weight: bold;
    font-family: 'Open Sans';
    margin-top: 8px;
    margin-bottom: 8px;
  }
  .outputImage {
    width: 350px;
    height: auto;
    /* max-width: 350px; */
    margin: 8px 5px 12px;
    border-radius: 8px;
    box-sizing: border-box;
    filter: drop-shadow(9px 9px 9px rgba(0, 0, 0, 0.3));
  }
  @media (max-width: 400px) {
    margin: auto;
    .outputImage {
      width: 350px;
      max-width: 100%;
      margin: 10px 5px 12px;
      border-radius: 8px;
      box-sizing: border-box;
      filter: drop-shadow(9px 9px 9px rgba(0, 0, 0, 0.3));
    }
  }
`

export default ImageViewer
