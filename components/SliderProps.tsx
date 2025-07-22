"use client";

import { SliderSong } from "./ui/slider"; // atau sesuaikan path kalau berbeda

interface CustomSliderProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  step?: number;
}

const SliderSlider: React.FC<CustomSliderProps> = ({
  value,
  onChange,
  max = 1,
  step = 0.01,
}) => {
  return (
    <SliderSong
      value={[value]}
      onValueChange={(v) => onChange(v[0])}
      max={max}
      step={step}
    />
  );
};

export default SliderSlider;