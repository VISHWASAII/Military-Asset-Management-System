package com.Kristalball.Military.Asset.Management.System.Mapper;

import com.Kristalball.Military.Asset.Management.System.DataTransferObject.AssignmentDTO;
import com.Kristalball.Military.Asset.Management.System.DataTransferObject.PurchaseDTO;
import com.Kristalball.Military.Asset.Management.System.Entities.AssertEntity;
import com.Kristalball.Military.Asset.Management.System.Entities.AssignmentEntity;
import com.Kristalball.Military.Asset.Management.System.Entities.BaseEntity;
import com.Kristalball.Military.Asset.Management.System.Entities.PurchaseEntity;

import java.util.function.Function;

public class AssignmentMapper {

    public static Function<AssignmentEntity, Function<BaseEntity, Function<AssertEntity, AssignmentDTO>>> getAssignmentDto =
            AssignmentEntity -> baseEntity -> assertEntity -> {
                AssignmentDTO assignmentDTO = new AssignmentDTO();
                assignmentDTO.setId(AssignmentEntity.getId());
                assignmentDTO.setBaseId(AssignmentEntity.getBaseId());
                assignmentDTO.setAssertId(AssignmentEntity.getAssertId());
                assignmentDTO.setPersonnelId(AssignmentEntity.getPersonnelId());
                assignmentDTO.setQuantity(AssignmentEntity.getQuantity());
                assignmentDTO.setAssignmentDate(AssignmentEntity.getAssignmentDate());
                assignmentDTO.setBaseName(baseEntity != null ? baseEntity.getName() : null);
                assignmentDTO.setAssertName(assertEntity != null ? assertEntity.getName() : null);
                assignmentDTO.setType(assertEntity != null ? assertEntity.getType() : null);
                return assignmentDTO;
            };
}
