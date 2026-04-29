package com.unad.project_video_platform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionRequest {
    private Integer contentId;
    private Integer userId;
    private String title;
    private String description;
}
