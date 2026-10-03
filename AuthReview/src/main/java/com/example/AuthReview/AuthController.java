package com.example.AuthReview;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService,
                          JwtService jwtService,
                          UserRepository userRepository) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return authService.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {

        User existingUser =
                userRepository.findByUsername(user.getUsername())
                        .orElse(null);

        if (existingUser == null) {
            return "User not found";
        }

        boolean valid = authService.checkPassword(
                user.getPassword(),
                existingUser.getPassword()
        );

        if (!valid) {
            return "Invalid username or password";
        }

        return jwtService.generateToken(
                existingUser.getUsername(),
                existingUser.getRole()
        );
    }
}