package com.unad.project_video_platform.repository;

import com.unad.project_video_platform.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Integer> {
    Optional<Conversation> findFirstByContentIdOrderByCreatedAtAsc(Integer contentId);

    List<Conversation> findByContentIdOrderByCreatedAtDesc(Integer contentId);

    List<Conversation> findAllByOrderByCreatedAtDesc();
}
