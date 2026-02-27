package com.unad.project_video_platform.service;

import com.unad.project_video_platform.dto.LoginRequest;
import com.unad.project_video_platform.dto.LoginResponse;
import com.unad.project_video_platform.entity.User;
import com.unad.project_video_platform.repository.UserRepository;
import com.unad.project_video_platform.security.JwtService;
import com.unad.project_video_platform.service.impl.IAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements IAuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials: Email or password incorrect"));

        if (request.getDocumentNumber() == null
            || !request.getDocumentNumber().equals(user.getDocumentNumber())) {
            throw new IllegalArgumentException("Invalid credentials: Email or password incorrect");
        }

        String roleName = user.getRole() != null ? user.getRole().getRoleName() : "USER";
        String token = jwtService.generateToken(user.getEmail(), roleName);

        return new LoginResponse(token, "Bearer", roleName, user.getId());
    }
}
