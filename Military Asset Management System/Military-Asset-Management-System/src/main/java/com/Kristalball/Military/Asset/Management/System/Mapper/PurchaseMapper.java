package com.Kristalball.Military.Asset.Management.System.Mapper;

import com.Kristalball.Military.Asset.Management.System.DataTransferObject.PurchaseDTO;
import com.Kristalball.Military.Asset.Management.System.Entities.AssertEntity;
import com.Kristalball.Military.Asset.Management.System.Entities.BaseEntity;
import com.Kristalball.Military.Asset.Management.System.Entities.PurchaseEntity;

import java.util.function.Function;

public class PurchaseMapper {
    public static Function<PurchaseEntity, Function<BaseEntity, Function<AssertEntity, PurchaseDTO>>> getPurchaseDto =
            purchaseEntity -> baseEntity -> assertEntity -> {
                PurchaseDTO purchaseDTO = new PurchaseDTO();
                purchaseDTO.setId(purchaseEntity.getId());
                purchaseDTO.setBaseId(purchaseEntity.getBaseId());
                purchaseDTO.setAssertId(purchaseEntity.getAssertId());
                purchaseDTO.setQuantity(purchaseEntity.getQuantity());
                purchaseDTO.setPurchaseDate(purchaseEntity.getPurchaseDate());
                purchaseDTO.setBaseName(baseEntity != null ? baseEntity.getName() : null);
                purchaseDTO.setAssertName(assertEntity != null ? assertEntity.getName() : null);
                purchaseDTO.setType(assertEntity != null ? assertEntity.getType() : null);
                return purchaseDTO;
            };
}
