package com.unad.project_video_platform.service.impl;

import com.unad.project_video_platform.dto.VideoStatsRequest;
import com.unad.project_video_platform.entity.VideoStats;

import java.util.List;

public interface IVideoStatsService {
    VideoStats recordStats(VideoStatsRequest request);

    List<VideoStats> getAllStats();

    List<VideoStats> getStatsByContent(Integer contentId);

    List<VideoStats> getStatsByUser(Integer userId);
}
