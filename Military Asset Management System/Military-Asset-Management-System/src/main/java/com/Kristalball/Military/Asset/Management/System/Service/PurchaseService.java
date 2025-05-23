package com.Kristalball.Military.Asset.Management.System.Service;

import com.Kristalball.Military.Asset.Management.System.DataTransferObject.PurchaseDTO;
import com.Kristalball.Military.Asset.Management.System.Entities.AssertEntity;
import com.Kristalball.Military.Asset.Management.System.Entities.BaseEntity;
import com.Kristalball.Military.Asset.Management.System.Entities.PurchaseEntity;
import com.Kristalball.Military.Asset.Management.System.Mapper.PurchaseMapper;
import com.Kristalball.Military.Asset.Management.System.Repository.AssetRepository;
import com.Kristalball.Military.Asset.Management.System.Repository.BaseRepository;
import com.Kristalball.Military.Asset.Management.System.Repository.PurchaseRepository;
import com.Kristalball.Military.Asset.Management.System.Utls.AuthUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PurchaseService {

    @Autowired
    private PurchaseRepository repo;

    @Autowired
    private BaseRepository baseRepo;

    @Autowired
    private AssetRepository assertRepo;

    @Autowired
    private AuthUtils authUtils;

    @Autowired
    private AuditSerive auditSerive;

    public PurchaseEntity checkPurchase(PurchaseEntity purchase, HttpServletRequest request){
        String username = authUtils.getUsernameFromRequest(request);
        auditSerive.log("/Purchase", username, "CREATE", LocalDate.now());
        return repo.save(purchase);
    }

    public List<PurchaseEntity> fetchPurchases(HttpServletRequest request){
        String username = authUtils.getUsernameFromRequest(request);
        auditSerive.log("/Assignment", username, "READ", LocalDate.now());
        return repo.findAll();
    }

    public List<PurchaseDTO> getPurchaseDto(HttpServletRequest request) {

        String username = authUtils.getUsernameFromRequest(request);
        auditSerive.log("/Assignment", username, "READ", LocalDate.now());
        return repo.findAll()
                .stream()
                .filter(purchase -> purchase.getBaseId() != null && purchase.getAssertId() != null)
                .map(purchase -> {
                    BaseEntity base = baseRepo.findById(purchase.getBaseId())
                            .orElseThrow(() -> new RuntimeException("Base ID Not Found: " + purchase.getBaseId()));
                    AssertEntity assertEntity = assertRepo.findById(purchase.getAssertId())
                            .orElseThrow(() -> new RuntimeException("Assert ID Not Found: " + purchase.getAssertId()));
                    return PurchaseMapper.getPurchaseDto.apply(purchase).apply(base).apply(assertEntity);
                })
                .collect(Collectors.toList());
    }

}
