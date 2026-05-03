package com.unad.project_video_platform.repository;

import com.unad.project_video_platform.entity.Conversation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Integer> {
    @EntityGraph(attributePaths = {
            "content",
            "content.category",
            "content.createdBy",
            "content.createdBy.role",
            "content.materials",
            "createdBy",
            "createdBy.role"
    })
    Optional<Conversation> findFirstByContentIdOrderByCreatedAtAsc(Integer contentId);

    @EntityGraph(attributePaths = {
            "content",
            "content.category",
            "content.createdBy",
            "content.createdBy.role",
            "content.materials",
            "createdBy",
            "createdBy.role"
    })
    List<Conversation> findByContentIdOrderByCreatedAtDesc(Integer contentId);

    @EntityGraph(attributePaths = {
            "content",
            "content.category",
            "content.createdBy",
            "content.createdBy.role",
            "content.materials",
            "createdBy",
            "createdBy.role"
    })
    List<Conversation> findAllByOrderByCreatedAtDesc();

    void deleteByContentId(Integer contentId);
}
