package com.Kristalball.Military.Asset.Management.System.Specification;

import com.Kristalball.Military.Asset.Management.System.Entities.TransferEntity;
import org.springframework.data.jpa.domain.Specification;


import java.time.LocalDate;

public class TransferSpecifications {
    public static Specification<TransferEntity> hasToBaseId(Long toBaseId) {
        return (root, query, cb) -> toBaseId == null ? null : cb.equal(root.get("toBaseId"), toBaseId);
    }
    public static Specification<TransferEntity> hasAssertId(Long assertId) {
        return (root, query, cb) -> assertId == null ? null : cb.equal(root.get("assertId"), assertId);
    }
    public static Specification<TransferEntity> hasTransferDate(LocalDate transferDate) {
        return (root, query, cb) -> transferDate == null ? null : cb.equal(root.get("transferDate"), transferDate);
    }
}
