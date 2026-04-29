package com.unad.project_video_platform.dto;

import com.unad.project_video_platform.entity.Conversation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ForumConversationResponse {
    private Conversation conversation;
    private List<Integer> participantIds;
    private Integer questionCount;
}
