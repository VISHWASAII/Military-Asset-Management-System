package com.Kristalball.Military.Asset.Management.System.Service;


import com.Kristalball.Military.Asset.Management.System.Entities.BaseEntity;
import com.Kristalball.Military.Asset.Management.System.Repository.BaseRepository;
import com.Kristalball.Military.Asset.Management.System.Utls.AuthUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BaseService {

    @Autowired
    BaseRepository repo;

    @Autowired
    AuthUtils authUtils;

    @Autowired
    AuditSerive auditSerive;

    public List<BaseEntity> getListOfBaseEntity(HttpServletRequest request){
        String username = authUtils.getUsernameFromRequest(request);
        auditSerive.log("/Assignment", username, "CREATE", LocalDate.now());
        return repo.findAll();
    }
}
