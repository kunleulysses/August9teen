import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';

/**
 * PixelSpriteAnimator
 * Renders a frame from a sprite sheet by translating the sheet within a clipped container.
 * props:
 * - src: string (sprite sheet URL)
 * - frameWidth, frameHeight: number (intrinsic frame size in pixels)
 * - frames: number (total frames)
 * - columns: number (frames per row)
 * - fps: number (default 6)
 * - size: number (display size)
 */
export default function PixelSpriteAnimator({ src, frameWidth, frameHeight, frames, columns, fps = 6, size = 120 }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const interval = Math.max(50, Math.floor(1000 / Math.max(1, fps)));
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % Math.max(1, frames || 1));
    }, interval);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [fps, frames]);

  const col = Math.max(1, columns || (frames || 1));
  const fw = Math.max(1, frameWidth || size);
  const fh = Math.max(1, frameHeight || size);
  const sheetW = fw * col;
  const x = (index % col) * fw;
  const y = Math.floor(index / col) * fh;
  const scaleX = size / fw;
  const scaleY = size / fh;

  return (
    <View style={[styles.clip, { width: size, height: size }]}> 
      <Image
        source={{ uri: src }}
        style={{
          width: sheetW * scaleX,
          height: fh * Math.ceil((frames || 1) / col) * scaleY,
          transform: [
            { translateX: -x * scaleX },
            { translateY: -y * scaleY },
          ],
        }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
});

