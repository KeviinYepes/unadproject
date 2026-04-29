package com.unad.project_video_platform.repository;

import com.unad.project_video_platform.entity.ContentMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContentMaterialRepository extends JpaRepository<ContentMaterial, Integer> {

    List<ContentMaterial> findByContentIdOrderByPositionAscIdAsc(Integer contentId);
}
