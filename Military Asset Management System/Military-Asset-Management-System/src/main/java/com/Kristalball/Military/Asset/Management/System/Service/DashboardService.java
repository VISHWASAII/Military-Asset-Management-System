package com.Kristalball.Military.Asset.Management.System.Service;

import com.Kristalball.Military.Asset.Management.System.Entities.DashboardEntity;
import com.Kristalball.Military.Asset.Management.System.Entities.PurchaseEntity;
import com.Kristalball.Military.Asset.Management.System.Entities.TransferEntity;
import com.Kristalball.Military.Asset.Management.System.Repository.AssignmentRepository;
import com.Kristalball.Military.Asset.Management.System.Repository.ExpenditureRepository;
import com.Kristalball.Military.Asset.Management.System.Repository.PurchaseRepository;
import com.Kristalball.Military.Asset.Management.System.Repository.TransferRepository;
import com.Kristalball.Military.Asset.Management.System.Utls.AuthUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
    @Autowired private PurchaseRepository purchaseRepo;
    @Autowired private TransferRepository transferRepo;
    @Autowired private AssignmentRepository assignmentRepo;
    @Autowired private ExpenditureRepository expenditureRepo;
    @Autowired private AuthUtils authUtils;
    @Autowired private AuditSerive auditSerive;

    Logger logger = LoggerFactory.getLogger(DashboardService.class);


   public DashboardEntity getDashBoard(Long baseId, LocalDate startDate, LocalDate endDate, String equipmentType, HttpServletRequest request){

       logger.info("working"+baseId+ startDate +endDate+ equipmentType);

       int openingBalance = purchaseRepo.sumQuantityByBaseIdAndAssetTypeBefore(baseId, equipmentType, startDate)
               + transferRepo.sumQuantityByToBaseIdBefore(baseId, equipmentType, startDate)
               - transferRepo.sumQuantityByFromBaseIdBefore(baseId, equipmentType, startDate)
               - assignmentRepo.sumQuantityByBaseIdAndAssetTypeBefore(baseId, equipmentType, startDate)
               - expenditureRepo.sumQuantityByBaseIdAndAssetTypeBefore(baseId, equipmentType, startDate);

       logger.info("THis is the value of Opening Balance" + String.valueOf(openingBalance));
       // Part 2: Net Movement
       int purchases = purchaseRepo.sumQuantityByBaseIdAndAssetType(baseId, equipmentType, startDate, endDate);
       int transfersIn = transferRepo.sumQuantityByToBaseId(baseId, equipmentType, startDate, endDate);
       int transfersOut = transferRepo.sumQuantityByFromBaseId(baseId, equipmentType, startDate, endDate);
       int netMovement = purchases + transfersIn - transfersOut;

       logger.info("THis is the value of Net Movement" + String.valueOf(netMovement));
       // Part 3: Closing Balance
       int closingBalance = openingBalance + netMovement;
       logger.info("THis is the value of closing Balance" + String.valueOf(closingBalance));

       // Part 4: Assigned
       int assigned = assignmentRepo.sumQuantityByBaseIdAndAssetType(baseId, equipmentType, startDate, endDate);
       logger.info("THis is the value of assignment" + String.valueOf(assigned));

       // Part 5: Expended
       int expended = expenditureRepo.sumQuantityByBaseIdAndAssetType(baseId, equipmentType, startDate, endDate);
       logger.info("THis is the value of expended" + String.valueOf(expended));

       List<PurchaseEntity> purchaseDetails = purchaseRepo.findByBaseIdAndAssetType(baseId, equipmentType, startDate, endDate);
       List<TransferEntity> transferInDetails = transferRepo.findByToBaseId(baseId, equipmentType, startDate, endDate);
       List<TransferEntity> transferOutDetails = transferRepo.findByFromBaseId(baseId, equipmentType, startDate, endDate);

       String username = authUtils.getUsernameFromRequest(request);
       auditSerive.log("/Dashboard", username, "READ", LocalDate.now());


       return new DashboardEntity(openingBalance, netMovement, closingBalance, assigned, expended,
               purchaseDetails != null ? purchaseDetails : Collections.emptyList(),
               transferInDetails != null ? transferInDetails : Collections.emptyList(),
               transferOutDetails != null ? transferOutDetails : Collections.emptyList());
   }
}
