package com.unad.project_video_platform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ContentViewSummary {
    private Integer contentId;
    private Long totalViews;
}
