package com.Kristalball.Military.Asset.Management.System.Controller;

import com.Kristalball.Military.Asset.Management.System.DataTransferObject.AssignmentDTO;
import com.Kristalball.Military.Asset.Management.System.Entities.AssignmentEntity;
import com.Kristalball.Military.Asset.Management.System.Repository.AuditLogRepository;
import com.Kristalball.Military.Asset.Management.System.Service.AssignmentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/assignment")
@RequiredArgsConstructor
public class AssignmentController {

    @Autowired
    private AssignmentService service;

    @PostMapping("/createAssignment")
    public ResponseEntity<AssignmentEntity> createAssignment(@RequestBody AssignmentEntity assignment, HttpServletRequest request){
        assignment.setAssignmentDate(LocalDate.now());
        AssignmentEntity getCreatedAssignment = service.createAssignment(assignment, request);

        return new ResponseEntity<>(getCreatedAssignment, HttpStatus.CREATED);
    }

    @GetMapping("/getAssignment")
    public ResponseEntity<List<AssignmentEntity>> getListOfAssignment(HttpServletRequest request){
        List<AssignmentEntity> getListOfAssignment = service.getListOfAssignment(request);
        return new ResponseEntity<>(getListOfAssignment, HttpStatus.OK);
    }

    @GetMapping("/getAssignmentDTO")
    public ResponseEntity<List<AssignmentDTO>> getAssignmentDTO(HttpServletRequest request){
        List<AssignmentDTO> getListOfAssignmentDTO =  service.getListOfAssignmentDTO(request);
        return new ResponseEntity<>(getListOfAssignmentDTO, HttpStatus.OK);
    }

    @PostMapping("/addAssignment")
    public ResponseEntity<AssignmentEntity> getAssignmentEntity(@RequestBody AssignmentEntity assignment, HttpServletRequest request){
        AssignmentEntity getAssignmentEntity = service.addAssignment(assignment, request);
        return new ResponseEntity<>(getAssignmentEntity, HttpStatus.CREATED);
    }
}
