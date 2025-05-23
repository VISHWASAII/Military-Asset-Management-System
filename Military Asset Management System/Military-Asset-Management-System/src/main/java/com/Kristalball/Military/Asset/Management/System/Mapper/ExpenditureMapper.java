package com.Kristalball.Military.Asset.Management.System.Mapper;

import com.Kristalball.Military.Asset.Management.System.DataTransferObject.AssignmentDTO;
import com.Kristalball.Military.Asset.Management.System.DataTransferObject.ExpendituresDTO;
import com.Kristalball.Military.Asset.Management.System.Entities.AssertEntity;
import com.Kristalball.Military.Asset.Management.System.Entities.AssignmentEntity;
import com.Kristalball.Military.Asset.Management.System.Entities.BaseEntity;
import com.Kristalball.Military.Asset.Management.System.Entities.ExpenditureEntity;

import java.util.function.Function;

public class ExpenditureMapper {

    public static Function<ExpenditureEntity, Function<BaseEntity, Function<AssertEntity, ExpendituresDTO>>> getAssignmentDto =
            ExpenditureEntity -> baseEntity -> assertEntity -> {
                ExpendituresDTO expenditureDTO = new ExpendituresDTO();
                expenditureDTO.setId(ExpenditureEntity.getId());
                expenditureDTO.setBaseId(ExpenditureEntity.getBaseId());
                expenditureDTO.setAssertId(ExpenditureEntity.getAssertId());
                expenditureDTO.setQuantity(ExpenditureEntity.getQuantity());
                expenditureDTO.setExpenditureDate(ExpenditureEntity.getExpenditureDate());
                expenditureDTO.setBaseName(baseEntity != null ? baseEntity.getName() : null);
                expenditureDTO.setAssertName(assertEntity != null ? assertEntity.getName() : null);
                expenditureDTO.setType(assertEntity != null ? assertEntity.getType() : null);
                return expenditureDTO;
            };
}
