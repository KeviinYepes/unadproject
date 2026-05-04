package com.unad.project_video_platform.service;

import com.unad.project_video_platform.dto.LocalUploadResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalContentMaterialStorageService {

    private final Path uploadDirectory;

    public LocalContentMaterialStorageService(
            @Value("${app.storage.materials-path:uploads/materials}") String materialsPath) {
        this.uploadDirectory = Paths.get(materialsPath).toAbsolutePath().normalize();
    }

    public LocalUploadResult savePdf(MultipartFile file) {
        try {
            Files.createDirectories(uploadDirectory);

            String storedFileName = UUID.randomUUID() + ".pdf";
            Path target = uploadDirectory.resolve(storedFileName).normalize();

            if (!target.startsWith(uploadDirectory)) {
                throw new IllegalArgumentException("Nombre de archivo invalido");
            }

            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            String url = "/api/content/materials/" + storedFileName;
            return new LocalUploadResult(storedFileName, url);
        } catch (Exception e) {
            throw new RuntimeException("No se pudo guardar el PDF localmente: " + e.getMessage(), e);
        }
    }

    public Resource loadAsResource(String storedFileName) {
        try {
            Path file = resolveStoredFile(storedFileName);
            Resource resource = new UrlResource(file.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("Material no encontrado");
            }

            return resource;
        } catch (MalformedURLException e) {
            throw new RuntimeException("Material no encontrado", e);
        }
    }

    public void delete(String storedFileName) {
        if (storedFileName == null || storedFileName.isBlank()) {
            return;
        }

        try {
            Files.deleteIfExists(resolveStoredFile(storedFileName));
        } catch (Exception ignored) {
        }
    }

    private Path resolveStoredFile(String storedFileName) {
        Path file = uploadDirectory.resolve(storedFileName).normalize();
        if (!file.startsWith(uploadDirectory)) {
            throw new IllegalArgumentException("Nombre de archivo invalido");
        }
        return file;
    }
}
