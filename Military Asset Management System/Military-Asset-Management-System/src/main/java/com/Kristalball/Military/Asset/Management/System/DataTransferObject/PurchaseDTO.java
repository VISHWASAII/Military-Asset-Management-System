package com.Kristalball.Military.Asset.Management.System.DataTransferObject;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseDTO {

    private Long id;
    private Long baseId;
    private Long assertId;
    private Integer quantity;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate purchaseDate;
    private String BaseName;
    private String AssertName;
    private String type;
}
