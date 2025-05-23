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
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "assignment")
public class AssignmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long baseId;
    private Long assertId;
    private Long personnelId;
    private Integer quantity;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate assignmentDate;
}
