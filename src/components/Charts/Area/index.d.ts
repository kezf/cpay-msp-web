import * as React from "react";
export interface AreaProps {
  title: React.ReactNode;
  color?: string;
  padding?: [number, number, number, number];
  height: number;
  borderColor?: string;
  line?: boolean;
  animate?: boolean;
  data: Array<{
    x: string;
    y: number;
  }>;
  autoLabel?: boolean;
  style?: React.CSSProperties;
}

export default class Bar extends React.Component<AreaProps, any> {}
