package com.Kristalball.Military.Asset.Management.System.Utls;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthUtils {

    @Autowired
    private final JwtUtil jwtUtil;

    public String getUsernameFromRequest(HttpServletRequest request){
        return jwtUtil.extractUsername(request.getHeader("Authorization").substring(7));
    }

}
