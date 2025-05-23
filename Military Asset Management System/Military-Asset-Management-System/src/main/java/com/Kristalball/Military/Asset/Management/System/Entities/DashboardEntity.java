package com.Kristalball.Military.Asset.Management.System.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardEntity {
    private int openingBalance;
    private int netMovement;
    private int closingBalance;
    private int assigned;
    private int expended;
    private List<PurchaseEntity> purchaseDetails;
    private List<TransferEntity> transferInDetails;
    private List<TransferEntity> transferOutDetails;
}
