package com.Kristalball.Military.Asset.Management.System.Service;

import com.Kristalball.Military.Asset.Management.System.DataTransferObject.ExpendituresDTO;
import com.Kristalball.Military.Asset.Management.System.Entities.AssertEntity;
import com.Kristalball.Military.Asset.Management.System.Entities.BaseEntity;
import com.Kristalball.Military.Asset.Management.System.Entities.ExpenditureEntity;
import com.Kristalball.Military.Asset.Management.System.Mapper.ExpenditureMapper;
import com.Kristalball.Military.Asset.Management.System.Mapper.PurchaseMapper;
import com.Kristalball.Military.Asset.Management.System.Repository.*;
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
public class ExpenditureService {

    @Autowired
    private ExpenditureRepository repo;

    @Autowired
    private BaseRepository baseRepo;

    @Autowired
    private AssetRepository assertRepo;

    @Autowired
    private AssignmentRepository assignmentRepo;

    @Autowired
    private TransferRepository transferRepo;

    @Autowired
    private PurchaseRepository purchaseRepo;

    @Autowired
    private  ExpenditureRepository expenditureRepo;

    @Autowired
    private AuthUtils authUtils;

    @Autowired
    private AuditSerive auditSerive;

    public ExpenditureEntity createExpenditure(ExpenditureEntity expenditure, HttpServletRequest request){
        String username = authUtils.getUsernameFromRequest(request);
        auditSerive.log("/Expenditure", username, "CREATE", LocalDate.now());
        return repo.save(expenditure);
    }

    public List<ExpenditureEntity> getListOfExpenditure(HttpServletRequest request){
        String username = authUtils.getUsernameFromRequest(request);
        auditSerive.log("/Expenditure", username, "CREATE", LocalDate.now());
        return repo.findAll();
    }

    public ExpenditureEntity addExpenditure(ExpenditureEntity expenditure, HttpServletRequest request) {
        if (expenditure.getBaseId() == null || expenditure.getAssertId() == null) {
            throw new IllegalArgumentException("Base ID or Asset ID cannot be null");
        }
        if (!baseRepo.existsById(expenditure.getBaseId())) {
            throw new IllegalArgumentException("Invalid base ID");
        }
        if (!assertRepo.existsById(expenditure.getAssertId())) {
            throw new IllegalArgumentException("Invalid asset ID");
        }
        if (expenditure.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
        int available = purchaseRepo.sumQuantityByBaseIdAndAssertId(expenditure.getBaseId(), expenditure.getAssertId())
                + transferRepo.sumQuantityByToBaseId(expenditure.getBaseId(), expenditure.getAssertId())
                - transferRepo.sumQuantityByFromBaseId(expenditure.getBaseId(), expenditure.getAssertId())
                - repo.sumQuantityByBaseIdAndAssertId(expenditure.getBaseId(), expenditure.getAssertId())
                - expenditureRepo.sumQuantityByBaseIdAndAssertId(expenditure.getBaseId(), expenditure.getAssertId());

        if (expenditure.getQuantity() > available) {
            throw new IllegalArgumentException("Not enough stock at base");
        }
        String username = authUtils.getUsernameFromRequest(request);
        auditSerive.log("/Expenditure", username, "CREATE", LocalDate.now());
        ExpenditureEntity saved = expenditureRepo.save(expenditure);
        return saved;
    }

    public List<ExpendituresDTO> getExpenditureDTO(HttpServletRequest request){
        return repo.findAll()
                .stream()
                .filter(expenditure -> expenditure.getBaseId() != null && expenditure.getAssertId() != null)
                .map( (expenditure) -> {
                    BaseEntity base = baseRepo.findById(expenditure.getBaseId())
                            .orElseThrow(() -> new RuntimeException("Base ID Not Found: " + expenditure.getBaseId()));
                    AssertEntity assertEntity = assertRepo.findById(expenditure.getAssertId())
                            .orElseThrow(() -> new RuntimeException("Assert ID Not Found: " + expenditure.getAssertId()));
                    String username = authUtils.getUsernameFromRequest(request);
                    auditSerive.log("/Assignment", username, "READ", LocalDate.now());
                    return ExpenditureMapper.getAssignmentDto.apply(expenditure).apply(base).apply(assertEntity);
                })
                .collect(Collectors.toList());
    }
}
