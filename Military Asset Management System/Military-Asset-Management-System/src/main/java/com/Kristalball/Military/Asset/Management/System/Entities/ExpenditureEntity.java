package com.Kristalball.Military.Asset.Management.System.Entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "expenditure")
public class ExpenditureEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long baseId;
    private Long assertId;
    private Integer quantity;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate expenditureDate;
}
