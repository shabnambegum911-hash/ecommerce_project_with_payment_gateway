package com.telusko.ecom_proj.util;

import java.util.regex.Pattern;

public class ValidationUtil {

    private static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
    private static final String USERNAME_PATTERN = "^[a-zA-Z0-9_]{3,20}$";
    private static final String PHONE_PATTERN = "^[0-9]{10}$";

    private static final Pattern emailPattern = Pattern.compile(EMAIL_PATTERN);
    private static final Pattern usernamePattern = Pattern.compile(USERNAME_PATTERN);
    private static final Pattern phonePattern = Pattern.compile(PHONE_PATTERN);

    public static boolean isValidEmail(String email) {
        return email != null && emailPattern.matcher(email).matches();
    }

    public static boolean isValidUsername(String username) {
        return username != null && usernamePattern.matcher(username).matches();
    }

    public static boolean isValidPhone(String phone) {
        return phone != null && phonePattern.matcher(phone).matches();
    }

    public static boolean isValidPassword(String password) {
        // Minimum 8 characters: at least one uppercase, one lowercase, one digit, one special char
        if (password == null || password.length() < 8) {
            return false;
        }
        return password.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");
    }

    public static boolean isNotEmpty(String value) {
        return value != null && !value.trim().isEmpty();
    }

}
