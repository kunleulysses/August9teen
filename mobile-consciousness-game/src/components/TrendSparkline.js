import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function TrendSparkline({ data = [], width = 240, height = 60, color = '#8E44AD' }) {
  if (!Array.isArray(data) || data.length < 2) return <View style={{ width, height }} />;
  const xs = data.map((d, i) => i);
  const ys = data.map((d) => Number(d.y || 0));
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanY = maxY - minY || 1;
  const stepX = (width - 2) / (xs.length - 1);
  const points = xs.map((x, i) => ({ x: 1 + i * stepX, y: 1 + (1 - ((ys[i] - minY) / spanY)) * (height - 2) }));
  const d = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  return (
    <Svg width={width} height={height}>
      <Path d={d} fill="none" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

