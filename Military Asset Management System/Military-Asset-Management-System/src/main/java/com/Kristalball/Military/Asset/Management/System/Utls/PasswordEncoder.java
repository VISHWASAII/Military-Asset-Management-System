package com.Kristalball.Military.Asset.Management.System.Utls;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordEncoder {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("admin hash: " + encoder.encode("Admin123!"));
        System.out.println("officer hash: " + encoder.encode("Commander123!"));
        System.out.println("soldier hash: " + encoder.encode("Logistics123!"));
    }
}
