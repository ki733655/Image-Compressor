import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  Slider,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import CompressIcon from "@mui/icons-material/Compress";
import imageCompression from "browser-image-compression";
import { useTheme } from "@mui/material/styles";

const ImageCompressor = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [compressedFileSize, setCompressedFileSize] = useState(null);
  const [quality, setQuality] = useState(0.8);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const theme = useTheme();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setCompressedImage(null);
      setCompressedFileSize(null);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false); // Reset drag-over state
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setCompressedImage(null);
      setCompressedFileSize(null);
    } else {
      alert("Please drop a valid image file.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true); // Highlight drop area
  };

  const handleDragLeave = () => {
    setIsDragOver(false); // Remove highlight when leaving
  };

  const handleQualityChange = (event, newValue) => {
    setQuality(newValue);
  };

  const compressImage = async () => {
    if (!selectedImage) {
      alert("Please select an image to compress.");
      return;
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      initialQuality: quality,
    };

    setLoading(true);
    try {
      const compressedFile = await imageCompression(selectedImage, options);
      const compressedFileUrl = URL.createObjectURL(compressedFile);
      setCompressedImage(compressedFileUrl);
      setCompressedFileSize((compressedFile.size / 1024).toFixed(2));
    } catch (error) {
      console.error("Error compressing image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2vw",
        // height: "100vh",
        borderRadius: "2vh",
        boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
        overflow: "auto",
        bgcolor: theme.palette.background.default,
        border: isDragOver ? "2px solid #3f51b5" : "1px dashed #ccc",
        p: 2,
        cursor: "pointer",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 800,
          width: "100%",
          p: 3,
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              textAlign="center"
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Drag and drop an image here, or click to upload.
              </Typography>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
                color="secondary"
              >
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
              </Button>
              {selectedImage && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  {selectedImage.name}
                </Typography>
              )}
            </Box>

            <Typography
              variant="body1"
              gutterBottom
              sx={{ mt: 3 }}
              color="text.primary"
            >
              Compression Quality: {Math.round(quality * 100)}%
            </Typography>
            <Slider
              value={quality}
              min={0.1}
              max={1.0}
              step={0.1}
              onChange={handleQualityChange}
              valueLabelDisplay="auto"
              sx={{ color: "primary.main", mt: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={compressImage}
              disabled={!selectedImage || loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <CompressIcon />
              }
              sx={{ mt: 3 }}
            >
              Compress Image
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                border: "1px dashed #ccc",
                borderRadius: 2,
                p: 2,
                textAlign: "center",
                minHeight: 250,
                bgcolor: "#f8f9fa",
              }}
            >
              {selectedImage ? (
                <CardMedia
                  component="img"
                  image={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  sx={{
                    maxWidth: "100%",
                    maxHeight: 200,
                    objectFit: "contain",
                    mb: 2,
                  }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Upload or drag and drop an image to preview here.
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {compressedImage && (
        <Box
          sx={{
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 2,
            textAlign: "center",
            width: "40vw",
          }}
        >
          <Typography variant="h6" color="success.main" gutterBottom>
            Compressed Image
          </Typography>
          <CardMedia
            component="img"
            image={compressedImage}
            alt="Compressed"
            sx={{
              maxWidth: "100%",
              maxHeight: 300,
              objectFit: "contain",
              mb: 2,
            }}
          />
          <Box
            flexDirection="column"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
          >
            <Button
              variant="contained"
              color="success"
              startIcon={<DownloadIcon />}
              href={compressedImage}
              download="compressed_image.jpg"
              sx={{ mr: 2 }}
            >
              Download Image
            </Button>
            {compressedFileSize && (
              <Typography
                variant="body2"
                color="text.secondary"
                display="block"
              >
                File Size: {compressedFileSize} KB
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ImageCompressor;
