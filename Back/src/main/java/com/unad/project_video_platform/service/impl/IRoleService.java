package com.unad.project_video_platform.service.impl;

import com.unad.project_video_platform.entity.Role;

import java.util.List;
import java.util.Optional;

public interface IRoleService {

    /**
     * Obtiene todos los roles
     */
    List<Role> getAllRoles();

    /**
     * Obtiene un rol por ID
     */
    Optional<Role> getRoleById(Integer id);

    /**
     * Obtiene un rol por nombre
     */
    Optional<Role> getRoleByName(String roleName);

    /**
     * Crea un nuevo rol
     */
    Role createRole(Role role);

    /**
     * Actualiza un rol existente
     */
    Role updateRole(Integer id, Role roleDetails);

    /**
     * Elimina un rol por ID
     */
    void deleteRole(Integer id);

    /**
     * Verifica si existe un rol por nombre
     */
    boolean existsByRoleName(String roleName);
}
