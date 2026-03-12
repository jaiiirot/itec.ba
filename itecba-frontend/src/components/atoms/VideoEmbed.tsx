import React from 'react';

interface VideoEmbedProps {
  videoId: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ videoId }) => {
  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-itec-gray">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};