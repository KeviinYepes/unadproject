package com.unad.project_video_platform.repository;

import com.unad.project_video_platform.entity.VideoStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VideoStatsRepository extends JpaRepository<VideoStats, Integer> {
    Optional<VideoStats> findByUserIdAndContentIdAndPeriodYearAndPeriodMonth(
            Integer userId,
            Integer contentId,
            Integer periodYear,
            Integer periodMonth
    );

    List<VideoStats> findByContentId(Integer contentId);

    List<VideoStats> findByUserId(Integer userId);
}
