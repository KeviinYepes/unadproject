package com.unad.project_video_platform.service.impl;

import com.unad.project_video_platform.dto.LoginRequest;
import com.unad.project_video_platform.dto.LoginResponse;
import com.unad.project_video_platform.dto.RecoverPasswordRequest;

public interface IAuthService {
    LoginResponse login(LoginRequest request);

    void sendPasswordRecoveryEmail(RecoverPasswordRequest request);
}
