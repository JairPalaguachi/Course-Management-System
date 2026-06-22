import { useRef, useState } from 'react';
import {
  Box, Button, CircularProgress, IconButton,
  LinearProgress, Typography,
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import ErrorOutlineIcon from '@mui/icons-material/Error';

import { uploadContentFile } from '../services/courseService';


const ACCEPT = {
  video: '.mp4,.webm,.mov,.avi',
  pdf:   '.pdf',
  image: '.jpg,.jpeg,.png,.webp,.gif',
};

const TEAL       = '#0f766e';
const TEAL_LIGHT = '#f0faf8';

/**
 * FileUploader
 *
 * Props:
 *   contentId  {number}    ID del SectionContent en la BD (obligatorio para subir)
 *   contentType {string}   'video' | 'pdf' | 'image'
 *   label       {string}   Nombre actual del contenido (se muestra como placeholder)
 *   onUploaded  {Function} Callback({ file_url, contentId }) cuando termina OK
 */
export default function FileUploader({ contentId, contentType, label, onUploaded }) {
  const inputRef              = useRef(null);
  const [progress, setProgress] = useState(0);
  const [status,   setStatus]   = useState('idle'); // idle | uploading | done | error
  const [errorMsg, setErrorMsg] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatus('uploading');
    setProgress(0);
    setErrorMsg('');

    try {
      const result = await uploadContentFile(contentId, file, (pct) => {
        setProgress(pct);
      });
      setStatus('done');
      onUploaded?.({ file_url: result.file_url, contentId });
    } catch (err) {
      setStatus('error');
      const detail = err.response?.data?.file?.[0]
        || err.response?.data?.detail
        || err.response?.data
        || 'Error al subir el archivo.';
      setErrorMsg(typeof detail === 'string' ? detail : JSON.stringify(detail));
    } finally {
      
      e.target.value = '';
    }
  };

  const reset = () => {
    setStatus('idle');
    setProgress(0);
    setFileName('');
    setErrorMsg('');
  };

  return (
    <Box sx={{ mt: 1 }}>
      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT[contentType] || '*'}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      
      {status === 'idle' && (
        <Button
          size="small"
          variant="outlined"
          startIcon={<AttachFileIcon />}
          onClick={() => inputRef.current?.click()}
          disabled={!contentId}
          sx={{
            textTransform: 'none', fontSize: 12,
            borderColor: '#cbd5e1', color: '#64748b', borderRadius: 2,
            '&:hover': { borderColor: TEAL, color: TEAL, background: TEAL_LIGHT },
          }}
        >
          {contentId ? `Subir ${contentType}` : 'Guarda el curso primero'}
        </Button>
      )}

      {/* Estado: subiendo → barra de progreso */}
      {status === 'uploading' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CircularProgress size={14} sx={{ color: TEAL, flexShrink: 0 }} />
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 11.5, color: '#64748b', mb: 0.25 }}>
              Subiendo {fileName}…
            </Typography>
            <LinearProgress variant="determinate" value={progress}
              sx={{ height: 4, borderRadius: 10,
                backgroundColor: '#e2e8f0',
                '& .MuiLinearProgress-bar': { backgroundColor: TEAL } }} />
          </Box>
          <Typography sx={{ fontSize: 11, color: '#64748b', flexShrink: 0 }}>
            {progress}%
          </Typography>
        </Box>
      )}

      
      {status === 'done' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon sx={{ fontSize: 16, color: TEAL }} />
          <Typography sx={{ fontSize: 12, color: TEAL, flex: 1 }}>
            {fileName} subido correctamente
          </Typography>
          <IconButton size="small" onClick={reset} sx={{ color: '#94a3b8' }}>
            <DeleteOutlineIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Box>
      )}

      
      {status === 'error' && (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <ErrorOutlineIcon sx={{ fontSize: 16, color: '#e11d48', mt: 0.1 }} />
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 12, color: '#e11d48' }}>{errorMsg}</Typography>
            <Button size="small" onClick={reset}
              sx={{ textTransform: 'none', fontSize: 11, color: TEAL, p: 0, mt: 0.25 }}>
              Intentar de nuevo
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}