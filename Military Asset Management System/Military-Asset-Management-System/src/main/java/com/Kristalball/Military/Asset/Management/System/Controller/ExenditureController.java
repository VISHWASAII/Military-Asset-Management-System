package com.Kristalball.Military.Asset.Management.System.Controller;

import com.Kristalball.Military.Asset.Management.System.DataTransferObject.ExpendituresDTO;
import com.Kristalball.Military.Asset.Management.System.Entities.ExpenditureEntity;
import com.Kristalball.Military.Asset.Management.System.Service.ExpenditureService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/expenditure")
@RequiredArgsConstructor
public class ExenditureController {

    @Autowired
    private ExpenditureService service;

    @PostMapping("/createExpenditure")
    public ResponseEntity<ExpenditureEntity> createExpenditure(@RequestBody ExpenditureEntity expenditure, HttpServletRequest request){
        expenditure.setExpenditureDate(LocalDate.now());
        ExpenditureEntity getExpenditureEntity = service.createExpenditure(expenditure, request);
        return new ResponseEntity<>(getExpenditureEntity, HttpStatus.CREATED);
    }

    @GetMapping("/getExpenditure")
    public ResponseEntity<List<ExpenditureEntity>> getListOfEntity(HttpServletRequest request){
        List<ExpenditureEntity> getListOfExpenditure = service.getListOfExpenditure(request);
        return new ResponseEntity<>(getListOfExpenditure, HttpStatus.OK);
    }

    @GetMapping("/getExpenditureDTO")
    public ResponseEntity<List<ExpendituresDTO>> getExpenditureDTO(HttpServletRequest request){
        List<ExpendituresDTO> getListOfExpenditureDTO = service.getExpenditureDTO(request);
        return new ResponseEntity<>(getListOfExpenditureDTO, HttpStatus.OK);
    }

    @PostMapping("/addExpenditure")
    public  ResponseEntity<ExpenditureEntity> addExpenditure(@RequestBody ExpenditureEntity expenditure, HttpServletRequest request){
        ExpenditureEntity getExpenditureEntity = service.addExpenditure(expenditure, request);
        return new ResponseEntity<>(getExpenditureEntity, HttpStatus.CREATED);
    }
}
