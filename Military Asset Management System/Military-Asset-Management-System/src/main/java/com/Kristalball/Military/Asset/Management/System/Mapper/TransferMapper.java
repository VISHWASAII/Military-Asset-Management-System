package com.Kristalball.Military.Asset.Management.System.Mapper;

import com.Kristalball.Military.Asset.Management.System.DataTransferObject.PurchaseDTO;
import com.Kristalball.Military.Asset.Management.System.DataTransferObject.TransferDTO;
import com.Kristalball.Military.Asset.Management.System.Entities.AssertEntity;
import com.Kristalball.Military.Asset.Management.System.Entities.BaseEntity;
import com.Kristalball.Military.Asset.Management.System.Entities.PurchaseEntity;
import com.Kristalball.Military.Asset.Management.System.Entities.TransferEntity;

import java.util.function.Function;

public class TransferMapper {

    public static Function<TransferEntity, Function<BaseEntity, Function<BaseEntity, Function<AssertEntity, TransferDTO>>>> getPurchaseDto =
            TransferEntity -> baseEntity -> baseEntity1 -> assertEntity -> {
               TransferDTO transferDTO = new TransferDTO();
               transferDTO.setId(TransferEntity.getId());
               transferDTO.setFromBaseId(TransferEntity.getFromBaseId());
               transferDTO.setToBaseId(TransferEntity.getToBaseId());
               transferDTO.setAssertId(TransferEntity.getAssertId());
               transferDTO.setQuantity(TransferEntity.getQuantity());
               transferDTO.setTransferDate(TransferEntity.getTransferDate());
               transferDTO.setFromBaseName(baseEntity != null ? baseEntity.getName() : null);
               transferDTO.setToBaseName(baseEntity != null ? baseEntity.getName() : null);
               transferDTO.setAsserName(assertEntity != null ? assertEntity.getName() : null);
               transferDTO.setType(assertEntity != null ? assertEntity.getType() : null);
               return transferDTO;
            };
}
