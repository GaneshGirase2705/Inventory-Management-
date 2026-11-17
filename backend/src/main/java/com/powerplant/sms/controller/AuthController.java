package com.powerplant.sms.controller;

import com.powerplant.sms.dto.AuthRequest;
import com.powerplant.sms.dto.AuthResponse;
import com.powerplant.sms.dto.UserDto;
import com.powerplant.sms.model.User;
import com.powerplant.sms.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        User user = authService.getCurrentUser();
        UserDto dto = UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .department(user.getDepartment().name())
                .employeeId(user.getEmployeeId())
                .build();
        return ResponseEntity.ok(dto);
    }
}
