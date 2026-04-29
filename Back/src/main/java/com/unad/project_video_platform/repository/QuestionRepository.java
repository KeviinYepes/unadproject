package com.unad.project_video_platform.repository;

import com.unad.project_video_platform.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    List<Question> findByConversationIdOrderByCreatedAtAsc(Integer conversationId);

    List<Question> findByConversationIdInOrderByCreatedAtAsc(Collection<Integer> conversationIds);

    Integer countByConversationId(Integer conversationId);
}
