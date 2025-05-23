package com.Kristalball.Military.Asset.Management.System.Service;

import com.Kristalball.Military.Asset.Management.System.Entities.AuditLogEntity;
import com.Kristalball.Military.Asset.Management.System.Repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditSerive {

    @Autowired
    private AuditLogRepository auditRepo;
    public AuditLogEntity log(String endpoint, String username, String action, LocalDate date){
        AuditLogEntity createLogs = new AuditLogEntity( endpoint, username, action,  date);
        return auditRepo.save(createLogs);
    }
}
