package com.unad.project_video_platform.service;

import com.unad.project_video_platform.entity.Category;
import com.unad.project_video_platform.repository.CategoryRepository;
import com.unad.project_video_platform.service.impl.ICategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService implements ICategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Integer id) {
        return categoryRepository.findById(id);
    }

    public Optional<Category> getCategoryByName(String categoryName) {
        return categoryRepository.findByCategoryName(categoryName);
    }

    @Transactional
    public Category createCategory(Category category) {
        validateCategory(category);

        if (categoryRepository.existsByCategoryName(category.getCategoryName())) {
            throw new IllegalArgumentException("Ya existe una categoria con el nombre: " + category.getCategoryName());
        }

        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Integer id, Category categoryDetails) {
        validateCategory(categoryDetails);

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada con id: " + id));

        if (!category.getCategoryName().equals(categoryDetails.getCategoryName())
                && categoryRepository.existsByCategoryName(categoryDetails.getCategoryName())) {
            throw new IllegalArgumentException(
                    "Ya existe una categoria con el nombre: " + categoryDetails.getCategoryName());
        }

        category.setCategoryName(categoryDetails.getCategoryName());
        category.setDescription(categoryDetails.getDescription());

        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Categoria no encontrada con id: " + id);
        }

        categoryRepository.deleteById(id);
    }

    public boolean existsByCategoryName(String categoryName) {
        return categoryRepository.existsByCategoryName(categoryName);
    }

    private void validateCategory(Category category) {
        if (category == null) {
            throw new IllegalArgumentException("La categoria es obligatoria");
        }

        if (category.getCategoryName() == null || category.getCategoryName().isBlank()) {
            throw new IllegalArgumentException("El nombre de la categoria es obligatorio");
        }

        category.setCategoryName(category.getCategoryName().trim());

        if (category.getDescription() != null) {
            category.setDescription(category.getDescription().trim());
        }
    }
}
