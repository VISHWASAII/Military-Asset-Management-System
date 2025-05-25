package com.Kristalball.Military.Asset.Management.System.Controller;

import com.Kristalball.Military.Asset.Management.System.Entities.AuditLogEntity;
import com.Kristalball.Military.Asset.Management.System.Service.AuditSerive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/audit")
public class AuditController {

    @Autowired
    AuditSerive serive;

    @GetMapping("/getListOfAudit")
    public ResponseEntity<List<AuditLogEntity>> getListfOfLogs(){
        List<AuditLogEntity> getListOfAuditLog = serive.getListOfLogs();
        return new ResponseEntity<>(getListOfAuditLog, HttpStatus.OK);
    }
}
