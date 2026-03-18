package com.telusko.ecom_proj.util;

import com.telusko.ecom_proj.dto.ApiResponse;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ApiResponseUtil {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

    public static <T> ApiResponse<T> success(T data, String message, HttpStatus status) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setStatus(status.value());
        response.setMessage(message);
        response.setData(data);
        response.setTimestamp(LocalDateTime.now().format(formatter));
        return response;
    }

    public static <T> ApiResponse<T> success(T data) {
        return success(data, "Success", HttpStatus.OK);
    }

    public static <T> ApiResponse<T> error(String message, HttpStatus status) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setStatus(status.value());
        response.setMessage(message);
        response.setData(null);
        response.setTimestamp(LocalDateTime.now().format(formatter));
        return response;
    }

}
