import React, { ReactChildren, ReactChild } from 'react';
 
interface Props {
  animationDuration:number;
  isFinished:boolean;
  children: ReactChild | ReactChildren;
}

export const Container = ({ animationDuration, children, isFinished }:Props) => (
    <div
      className='pointer-events-none'
      style={{
        opacity: isFinished ? 0 : 1,
        transition: `opacity ${animationDuration}ms linear`,
      }}
    >
    {children}
    </div>
  );