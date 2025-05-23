package com.Kristalball.Military.Asset.Management.System.Entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "audit_log")
public class AuditLogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String endPoint;
    private String username;
    private String action;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate assignmentDate;

    public AuditLogEntity(String endpoint, String username, String action, LocalDate assignmentDate) {
        this.endPoint = endpoint;
        this.username = username;
        this.action = action;
        this.assignmentDate = assignmentDate;
    }
}
