package com.unad.project_video_platform.service;

import com.unad.project_video_platform.entity.Video;
import com.unad.project_video_platform.repository.VideoRepository;
import com.unad.project_video_platform.service.impl.IVideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class VideoService implements IVideoService {

    @Autowired
    private VideoRepository videoRepository;

    /**
     * Obtiene todos los videos
     */
    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    /**
     * Obtiene un video por ID
     */
    public Optional<Video> getVideoById(Integer id) {
        return videoRepository.findById(id);
    }

    /**
     * Crea un nuevo video
     */
    @Transactional
    public Video createVideo(Video video) {
        validateVideo(video);
        return videoRepository.save(video);
    }

    /**
     * Actualiza un video existente
     */
    @Transactional
    public Video updateVideo(Integer id, Video videoDetails) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video no encontrado con id: " + id));

        validateVideo(videoDetails);

        video.setUrl(videoDetails.getUrl());
        video.setTitle(videoDetails.getTitle());
        video.setDescription(videoDetails.getDescription());
        video.setCategory(videoDetails.getCategory());

        return videoRepository.save(video);
    }

    /**
     * Elimina un video por ID
     */
    @Transactional
    public void deleteVideo(Integer id) {
        if (!videoRepository.existsById(id)) {
            throw new RuntimeException("Video no encontrado con id: " + id);
        }
        videoRepository.deleteById(id);
    }

    private void validateVideo(Video video) {
        if (video == null) {
            throw new IllegalArgumentException("El video es obligatorio");
        }
        if (video.getUrl() == null || video.getUrl().isBlank()) {
            throw new IllegalArgumentException("La url es obligatoria");
        }
        if (video.getTitle() == null || video.getTitle().isBlank()) {
            throw new IllegalArgumentException("El título es obligatorio");
        }
    }
}
