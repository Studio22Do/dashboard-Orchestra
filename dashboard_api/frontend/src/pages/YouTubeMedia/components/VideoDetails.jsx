import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VideoDetails = ({ videoId, setError }) => {
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [error, setLocalError] = useState(null);

  useEffect(() => {
    if (!videoId) return;
    setLoading(true);
    setLocalError(null);
    setVideoData(null);
    axios.get('/api/youtube/video/details-and-formats', { params: { videoId } })
      .then(res => setVideoData(res.data))
      .catch(err => {
        setLocalError(err.response?.data?.error || 'Error al obtener detalles');
        setError && setError(err.response?.data?.error || 'Error al obtener detalles');
      })
      .finally(() => setLoading(false));
  }, [videoId, setError]);

  if (!videoId) {
    return <div className="text-gray-500 my-8">Selecciona un video para ver los detalles.</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-4">
      {loading && <div className="text-center my-8">Cargando detalles...</div>}
      {error && <div className="text-red-500 my-8">{error}</div>}
      {videoData && (
        <>
          <img src={videoData.thumbnail_url} alt={videoData.title} className="w-full rounded mb-4" />
          <h2 className="text-2xl font-bold mb-2">{videoData.title}</h2>
          <p className="text-gray-600 mb-2">{videoData.channel.title}</p>
          <p className="text-gray-500 mb-4 whitespace-pre-line">{videoData.description}</p>
          <div className="mb-4">
            <span className="font-semibold">Vistas:</span> {videoData.views} &nbsp;
            <span className="font-semibold">Likes:</span> {videoData.likes}
          </div>
          <h3 className="text-lg font-semibold mb-2">Opciones de descarga</h3>
          <ul>
            {videoData.formats.map((f, i) => (
              <li key={i} className="flex items-center justify-between mb-2">
                <span>
                  {f.qualityLabel} - {f.container?.toUpperCase()} - {f.hasAudio && f.hasVideo ? 'Video+Audio' : f.hasVideo ? 'Solo Video' : 'Solo Audio'}
                </span>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  download
                >
                  Descargar
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default VideoDetails; 