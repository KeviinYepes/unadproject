package com.unad.project_video_platform.dto;

import lombok.Data;

@Data
public class VideoStatsRequest {
    private Integer userId;
    private Integer contentId;
    private Integer watchTimeSeconds;
    private Boolean countView;
}
