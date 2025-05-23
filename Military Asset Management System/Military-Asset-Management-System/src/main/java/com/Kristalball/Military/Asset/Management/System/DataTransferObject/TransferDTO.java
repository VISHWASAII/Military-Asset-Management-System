package com.Kristalball.Military.Asset.Management.System.DataTransferObject;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TransferDTO {

    private Long id;
    private Long fromBaseId;
    private Long toBaseId;
    private Long assertId;
    private Integer quantity;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate transferDate;
    private String fromBaseName;
    private String toBaseName;
    private String asserName;
    private String type;
}
