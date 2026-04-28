package com.unad.project_video_platform.service.impl;

import com.unad.project_video_platform.entity.Category;

import java.util.List;
import java.util.Optional;

public interface ICategoryService {
    List<Category> getAllCategories();

    Optional<Category> getCategoryById(Integer id);

    Optional<Category> getCategoryByName(String categoryName);

    Category createCategory(Category category);

    Category updateCategory(Integer id, Category categoryDetails);

    void deleteCategory(Integer id);

    boolean existsByCategoryName(String categoryName);
}
