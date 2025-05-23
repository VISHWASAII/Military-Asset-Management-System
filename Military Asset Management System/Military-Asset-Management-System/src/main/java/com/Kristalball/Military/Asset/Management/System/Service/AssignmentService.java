package com.Kristalball.Military.Asset.Management.System.Service;

import com.Kristalball.Military.Asset.Management.System.DataTransferObject.AssignmentDTO;
import com.Kristalball.Military.Asset.Management.System.Entities.AssertEntity;
import com.Kristalball.Military.Asset.Management.System.Entities.AssignmentEntity;
import com.Kristalball.Military.Asset.Management.System.Entities.BaseEntity;
import com.Kristalball.Military.Asset.Management.System.Mapper.AssignmentMapper;
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
public class AssignmentService {

    @Autowired
    private AssignmentRepository repo;

    @Autowired
    private BaseRepository baseRepo;

    @Autowired
    private AssetRepository assertRepo;

    @Autowired
    private AuditSerive auditSerive;

    @Autowired
    private PurchaseRepository purchaseRepo;

    @Autowired
    private TransferRepository transferRepo;

    @Autowired
    private ExpenditureRepository expenditureRepo;

    @Autowired
    private AuthUtils authUtils;

    public AssignmentEntity createAssignment(AssignmentEntity assignment, HttpServletRequest request){
        String username = authUtils.getUsernameFromRequest(request);
        auditSerive.log("/Assignment", username, "CREATE", LocalDate.now());
        return repo.save(assignment);
    }

    public List<AssignmentEntity> getListOfAssignment(HttpServletRequest request) {
        String username = authUtils.getUsernameFromRequest(request);
        auditSerive.log("/Assignment", username, "READ", LocalDate.now());
        return repo.findAll();
    }

    public AssignmentEntity addAssignment(AssignmentEntity assignment, HttpServletRequest request){
        if (assignment.getBaseId() == null || assignment.getAssertId() == null) {
            throw new IllegalArgumentException("Base ID or Asset ID cannot be null");
        }

        if (!baseRepo.existsById(assignment.getBaseId())) {
            throw new IllegalArgumentException("Invalid base ID");
        }

        if (!assertRepo.existsById(assignment.getAssertId())) {
            throw new IllegalArgumentException("Invalid asset ID");
        }
        if (assignment.getQuantity() <= 0) throw new IllegalArgumentException("Quantity must be positive");
        int available = purchaseRepo.sumQuantityByBaseIdAndAssertId(assignment.getBaseId(), assignment.getAssertId())
                + transferRepo.sumQuantityByToBaseId(assignment.getBaseId(), assignment.getAssertId())
                - transferRepo.sumQuantityByFromBaseId(assignment.getBaseId(), assignment.getAssertId())
                - repo.sumQuantityByBaseIdAndAssertId(assignment.getBaseId(), assignment.getAssertId())
                - expenditureRepo.sumQuantityByBaseIdAndAssertId(assignment.getBaseId(), assignment.getAssertId());
        if(assignment.getQuantity() > available){
            throw new IllegalArgumentException("Not enough stock at base");
        }
        String username = authUtils.getUsernameFromRequest(request);
        auditSerive.log("/Assignment", username, "CREATE", LocalDate.now());
        return repo.save(assignment);
    }

    public List<AssignmentDTO> getListOfAssignmentDTO(HttpServletRequest request){
        String username = authUtils.getUsernameFromRequest(request);
        auditSerive.log("/Assignment", username, "READ", LocalDate.now());
        return repo.findAll()
                .stream()
                .filter(assignment -> assignment.getBaseId() != null && assignment.getAssertId() != null)
                .map(assignment -> {
                    BaseEntity base = baseRepo.findById(assignment.getBaseId())
                            .orElseThrow(() -> new RuntimeException("Base ID Not Found: " + assignment.getBaseId()));
                    AssertEntity assertEntity = assertRepo.findById(assignment.getAssertId())
                            .orElseThrow(() -> new RuntimeException("Assert ID Not Found: " + assignment.getAssertId()));
                    return AssignmentMapper.getAssignmentDto.apply(assignment).apply(base).apply(assertEntity);
                })
                .collect(Collectors.toList());
    }
}
