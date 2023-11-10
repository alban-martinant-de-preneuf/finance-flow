import styled, { keyframes } from "styled-components";

const BlobAnimation = () => {
  return (
    <div className="blob">
      <Blob />
      <Blob2 />
    </div>
  );
};

const moveBlob1 = keyframes`
  0% {
    transform: translate(530px, -240px) rotate(90deg);
    border-radius: 24% 76% 35% 65% / 27% 36% 64% 73%;
  }
  50% {
    transform: translate(0px, 0px) rotate(20deg);
    border-radius: 76% 24% 33% 67% / 68% 55% 45% 32%;
  }
  100% {
    transform: translate(530px, 240px) rotate(90deg);
    border-radius: 24% 76% 35% 65% / 27% 36% 64% 73%;
  }
  `;

const moveBlob2 = keyframes`
  0% {
    transform: translate(-530px, 240px) rotate(-90deg);
    border-radius: 51% 49% 58% 42% / 34% 78% 22% 66%;
  }
  50% {
    transform: translate(0px, 0px) rotate(-20deg);
    border-radius: 22% 78% 73% 27% / 68% 31% 69% 32%;
  }
  100% {
    transform: translate(-530px, -240px) rotate(-90deg);
    border-radius: 51% 49% 58% 42% / 34% 78% 22% 66%;
  }
  `;

const Blob = styled.div`
  position: absolute;
  z-index: 1;
  width: 500px;
  height: 500px;
  background: linear-gradient(
    180deg,
    rgba(250, 217, 107, 1) 0%,
    rgba(173, 134, 243, 1) 76%,
    rgba(173, 134, 243, 1) 100%
  );
  filter: blur(15px);
  transition: 1s cubic-bezier(0.07, 0.8, 0.16, 1);
   mix-blend-mode: multiply; 
  animation: ${moveBlob1} 10s ease infinite alternate;


  //au hover sur le blob on change sa taille
  &:hover {
    width: 520px;
    height: 520px;
    filter: blur(30px);
    box-shadow: inset 0 0 0 200px rgba(255, 255, 255, 0.6),
      inset 100px 100px 0 0px #fad96b, inset 200px 200px 0 0px #784ba0,
      inset 300px 300px 0 0px #ad86f3;
  }
`;

const Blob2 = styled(Blob)`
background: linear-gradient(
  -180deg,
  rgba(250, 217, 107, 1) 0%,
  rgba(173, 134, 243, 1) 76%,
  rgba(173, 134, 243, 1) 100%
);
  animation: ${moveBlob2} 15s infinite alternate;
`;

export default BlobAnimation;


