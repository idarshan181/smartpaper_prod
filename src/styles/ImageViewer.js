import styled from "styled-components";

const ImageViewer = styled.div`
  margin: 10px auto;
  .output-label {
    font-size: 1.2rem;
    text-align: center;
  }
  .output-image {
    width: 300px;
    max-width: 350px;
    margin: 10px 5px 20px;
    border-radius: 8px;
    box-sizing: border-box;
    filter: drop-shadow(9px 9px 9px rgba(0, 0, 0, 0.3));
  }
  @media (max-width: 400px) {
    margin: auto;
    .output-image {
      width: 100%;
      max-width: 100%;
      margin: 10px 5px 20px;
      border-radius: 8px;
      box-sizing: border-box;
      filter: drop-shadow(9px 9px 9px rgba(0, 0, 0, 0.3));
    }
  }
`;

export default ImageViewer;
