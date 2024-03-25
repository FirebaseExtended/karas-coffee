import React from 'react';

export type DotsProps = {};

const bouncingStyle = `
.bouncing-loader {
  display: flex;
  justify-content: center;
}

.bouncing-loader > div {
  width: 4px;
  height: 4px;
  margin: 3px 6px;
  border-radius: 50%;
  background-color: white;
  opacity: 1;
  animation: bouncing-loader 0.6s infinite alternate;
}

@keyframes bouncing-loader {
  to {
    opacity: 0.1;
    transform: translateY(-16px);
  }
}

.bouncing-loader > div:nth-child(2) {
  animation-delay: 0.2s;
}

.bouncing-loader > div:nth-child(3) {
  animation-delay: 0.4s;
}
`;

export function AnimatedDots(props: DotsProps) {
  return (
    <div className="bouncing-loader">
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
