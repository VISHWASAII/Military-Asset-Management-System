package com.Kristalball.Military.Asset.Management.System.Service;


import com.Kristalball.Military.Asset.Management.System.DataTransferObject.TransferDTO;
import com.Kristalball.Military.Asset.Management.System.Entities.AssertEntity;
import com.Kristalball.Military.Asset.Management.System.Entities.BaseEntity;
import com.Kristalball.Military.Asset.Management.System.Entities.TransferEntity;
import com.Kristalball.Military.Asset.Management.System.Mapper.TransferMapper;
import com.Kristalball.Military.Asset.Management.System.Repository.*;
import com.Kristalball.Military.Asset.Management.System.Specification.TransferSpecifications;
import com.Kristalball.Military.Asset.Management.System.Utls.AuthUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransferService {

    @Autowired
    private TransferRepository repo;

    @Autowired
    private BaseRepository baseRepo;

    @Autowired
    private AssetRepository assertRepo;

    @Autowired
    private AuditSerive auditService;

    @Autowired
    private PurchaseRepository purchaseRepo;

    @Autowired
    private AssignmentRepository assignmentRepo;

    @Autowired
    private ExpenditureRepository expenditureRepo;

    @Autowired
    private AuthUtils authUtils;

    @Autowired
    private AuditSerive auditSerive;

    public TransferEntity createTransfer(TransferEntity transferEntity, HttpServletRequest request){
        if (transferEntity.getToBaseId() == null) {
            throw new IllegalArgumentException("toBaseId cannot be null");
        }
        if (transferEntity.getFromBaseId() == null) {
            throw new IllegalArgumentException("fromBaseId cannot be null");
        }
        if (!baseRepo.existsById(transferEntity.getToBaseId())) {
            throw new IllegalArgumentException("Invalid toBaseId: " + transferEntity.getToBaseId());
        }
        if (!baseRepo.existsById(transferEntity.getFromBaseId())) {
            throw new IllegalArgumentException("Invalid fromBaseId: " + transferEntity.getFromBaseId());
        }

        //Managing the Transferring Of data's
        int available = purchaseRepo.sumQuantityByBaseIdAndAssertId(transferEntity.getFromBaseId(), transferEntity.getAssertId())
                + repo.sumQuantityByToBaseId(transferEntity.getFromBaseId(), transferEntity.getAssertId())
                - repo.sumQuantityByFromBaseId(transferEntity.getFromBaseId(), transferEntity.getAssertId())
                - assignmentRepo.sumQuantityByBaseIdAndAssertId(transferEntity.getFromBaseId(), transferEntity.getAssertId())
                - expenditureRepo.sumQuantityByBaseIdAndAssertId(transferEntity.getFromBaseId(), transferEntity.getAssertId());
        if(transferEntity.getQuantity()> available){
            throw new IllegalArgumentException("Not enough stock at source base");
        }
        String username = authUtils.getUsernameFromRequest(request);
        auditSerive.log("/Transfer", username, "CREATE", LocalDate.now());
        return repo.save(transferEntity);
    }

    public List<TransferEntity> getFilteredEntity(Long toBaseId, Long assertId, LocalDate transferDate, HttpServletRequest request){
        Specification<TransferEntity> spec = Specification.where(TransferSpecifications.hasToBaseId(toBaseId))
                .and(TransferSpecifications.hasAssertId(assertId))
                .and(TransferSpecifications.hasTransferDate(transferDate));
        String username = authUtils.getUsernameFromRequest(request);
        auditSerive.log("/Transfer", username, "READ", LocalDate.now());
        return repo.findAll(spec);
    }

    public List<TransferEntity> getListOfTransferEntity(HttpServletRequest request){
        String username = authUtils.getUsernameFromRequest(request);
        auditSerive.log("/Transfer", username, "READ", LocalDate.now());
        return repo.findAll();

    }
    public List<TransferDTO> getTransferDTO(HttpServletRequest request){
        String username = authUtils.getUsernameFromRequest(request);
        auditSerive.log("/Transfer", username, "CREATE", LocalDate.now());
        return repo.findAll()
                .stream()
                .filter(transfer -> transfer.getFromBaseId() != null && transfer.getToBaseId() != null)
                .map((transfer) -> {
                    BaseEntity fromBase = baseRepo.findById(transfer.getFromBaseId())
                            .orElseThrow(() -> new RuntimeException("Base ID Not Found: " + transfer.getFromBaseId()));
                    BaseEntity toBase = baseRepo.findById(transfer.getToBaseId())
                            .orElseThrow(() -> new RuntimeException("Base ID Not Found: " + transfer.getToBaseId()));
                    AssertEntity assertEntity = assertRepo.findById(transfer.getAssertId())
                            .orElseThrow(() -> new RuntimeException("Assert ID Not Found: " + transfer.getAssertId()));
                    return TransferMapper.getPurchaseDto.apply(transfer).apply(fromBase).apply(toBase).apply(assertEntity);
                })
                .collect(Collectors.toList());
    }
}
