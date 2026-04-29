package com.unad.project_video_platform.repository;

import com.unad.project_video_platform.entity.VideoStats;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VideoStatsRepository extends JpaRepository<VideoStats, Integer> {
    @Override
    @EntityGraph(attributePaths = {
            "user",
            "user.role",
            "content",
            "content.category",
            "content.createdBy",
            "content.createdBy.role",
            "content.materials"
    })
    List<VideoStats> findAll();

    Optional<VideoStats> findByUserIdAndContentIdAndPeriodYearAndPeriodMonth(
            Integer userId,
            Integer contentId,
            Integer periodYear,
            Integer periodMonth
    );

    @EntityGraph(attributePaths = {
            "user",
            "user.role",
            "content",
            "content.category",
            "content.createdBy",
            "content.createdBy.role",
            "content.materials"
    })
    List<VideoStats> findByContentId(Integer contentId);

    @EntityGraph(attributePaths = {
            "user",
            "user.role",
            "content",
            "content.category",
            "content.createdBy",
            "content.createdBy.role",
            "content.materials"
    })
    List<VideoStats> findByUserId(Integer userId);

    void deleteByContentId(Integer contentId);
}
