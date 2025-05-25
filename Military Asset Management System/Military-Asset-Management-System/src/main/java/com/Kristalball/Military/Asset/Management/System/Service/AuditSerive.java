package com.Kristalball.Military.Asset.Management.System.Service;

import com.Kristalball.Military.Asset.Management.System.Entities.AuditLogEntity;
import com.Kristalball.Military.Asset.Management.System.Repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditSerive {

    @Autowired
    private AuditLogRepository auditRepo;
    public AuditLogEntity log(String endpoint, String username, String action, LocalDate date){
        AuditLogEntity createLogs = new AuditLogEntity( endpoint, username, action,  date);
        return auditRepo.save(createLogs);
    }

    public List<AuditLogEntity> getListOfLogs(){
        return auditRepo.findAll();
    }
}
