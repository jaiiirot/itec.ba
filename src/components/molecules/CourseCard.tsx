import React from 'react';
import { Button } from '../atoms/Button';
import { ProgressBar } from '../atoms/ProgressBar';

interface CourseCardProps {
  title: string;
  description: string;
  progress: number;
  imageUrl: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({ title, description, progress, imageUrl }) => {
  return (
    <div className="bg-itec-bg rounded-xl p-3 flex flex-col gap-3 shadow-lg">
      <div className="w-full h-32 bg-itec-gray rounded-lg overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover opacity-80" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-itec-text">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <ProgressBar progress={progress} />
      <Button variant="primary" fullWidth>Continuar Cursada</Button>
    </div>
  );
};