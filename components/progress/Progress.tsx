import { useNProgress } from '@tanem/react-nprogress';
import { Bar } from './Bar';
import { Container } from './Container';

interface Props {
  isAnimating: boolean;
}

export default function Progress({ isAnimating }:Props){
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  });

  return (
    <Container animationDuration={animationDuration} isFinished={isFinished}>
      <Bar animationDuration={animationDuration} progress={progress} />
    </Container>
  );
};