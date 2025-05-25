package com.Kristalball.Military.Asset.Management.System.Service;

import com.Kristalball.Military.Asset.Management.System.Entities.AssertEntity;
import com.Kristalball.Military.Asset.Management.System.Repository.AssetRepository;
import com.Kristalball.Military.Asset.Management.System.Utls.AuthUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssertService {

    @Autowired
    AssetRepository repo;

    @Autowired
    AuthUtils authUtils;

    @Autowired
    AuditSerive auditSerive;

    public List<AssertEntity> getAssetEntity(HttpServletRequest  request){
        String username = authUtils.getUsernameFromRequest(request);
        auditSerive.log("/Assignment", username, "CREATE", LocalDate.now());
       return  repo.findAll();
    }
}
