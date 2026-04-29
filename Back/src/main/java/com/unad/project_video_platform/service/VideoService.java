package com.unad.project_video_platform.service;

import com.unad.project_video_platform.entity.Video;
import com.unad.project_video_platform.repository.CategoryRepository;
import com.unad.project_video_platform.repository.UserRepository;
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

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    public Optional<Video> getVideoById(Integer id) {
        return videoRepository.findById(id);
    }

    @Transactional
    public Video createVideo(Video video) {
        validateVideo(video);
        hydrateReferences(video);
        return videoRepository.save(video);
    }

    @Transactional
    public Video updateVideo(Integer id, Video videoDetails) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contenido no encontrado con id: " + id));

        validateVideo(videoDetails);
        hydrateReferences(videoDetails);

        video.setUrlVideo(videoDetails.getUrlVideo());
        video.setTitle(videoDetails.getTitle());
        video.setDescription(videoDetails.getDescription());
        video.setCategory(videoDetails.getCategory());
        video.setCreatedBy(videoDetails.getCreatedBy());

        return videoRepository.save(video);
    }

    @Transactional
    public void deleteVideo(Integer id) {
        if (!videoRepository.existsById(id)) {
            throw new RuntimeException("Contenido no encontrado con id: " + id);
        }
        videoRepository.deleteById(id);
    }

    private void validateVideo(Video video) {
        if (video == null) {
            throw new IllegalArgumentException("El contenido es obligatorio");
        }
        if (video.getUrlVideo() == null || video.getUrlVideo().isBlank()) {
            throw new IllegalArgumentException("La URL del video es obligatoria");
        }
        if (video.getTitle() == null || video.getTitle().isBlank()) {
            throw new IllegalArgumentException("El titulo es obligatorio");
        }
        if (video.getCategory() == null || video.getCategory().getId() == null) {
            throw new IllegalArgumentException("La categoria es obligatoria");
        }
        if (video.getCreatedBy() == null || video.getCreatedBy().getId() == null) {
            throw new IllegalArgumentException("El usuario creador es obligatorio");
        }

        video.setUrlVideo(video.getUrlVideo().trim());
        video.setTitle(video.getTitle().trim());
        if (video.getDescription() != null) {
            video.setDescription(video.getDescription().trim());
        }
    }

    private void hydrateReferences(Video video) {
        video.setCategory(
                categoryRepository.findById(video.getCategory().getId())
                        .orElseThrow(() -> new RuntimeException(
                                "Categoria no encontrada con id: " + video.getCategory().getId())));

        video.setCreatedBy(
                userRepository.findById(video.getCreatedBy().getId())
                        .orElseThrow(() -> new RuntimeException(
                                "Usuario creador no encontrado con id: " + video.getCreatedBy().getId())));
    }
}
