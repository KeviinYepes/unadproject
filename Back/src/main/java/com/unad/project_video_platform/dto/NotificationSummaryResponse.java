package com.unad.project_video_platform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationSummaryResponse {
    private Integer contentQuestionCount;
    private Integer answerCount;
    private Integer total;
    private List<NotificationItemResponse> items;
}
