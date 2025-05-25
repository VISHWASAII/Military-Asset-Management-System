package com.Kristalball.Military.Asset.Management.System.Controller;


import com.Kristalball.Military.Asset.Management.System.DataTransferObject.TransferDTO;
import com.Kristalball.Military.Asset.Management.System.Entities.TransferEntity;
import com.Kristalball.Military.Asset.Management.System.Repository.TransferRepository;
import com.Kristalball.Military.Asset.Management.System.Service.TransferService;
import com.Kristalball.Military.Asset.Management.System.Specification.TransferSpecifications;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/transfer")
@RequiredArgsConstructor
public class TransferController {

    @Autowired
    TransferService service;

    @PostMapping("/createTransfer")
    public ResponseEntity<TransferEntity> createTransfer(@RequestBody TransferEntity transferEntity, HttpServletRequest request){
        transferEntity.setTransferDate(LocalDate.now());
        TransferEntity transferedData = service.createTransfer(transferEntity, request);
        return new ResponseEntity<>(transferedData, HttpStatus.CREATED);
    }

    @GetMapping("/filterTransfer")
    public ResponseEntity<List<TransferEntity>> filterTransfer(
            @RequestParam(required = false) Long toBaseId,
            @RequestParam(required = false) Long assertId,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate transferDate,
            HttpServletRequest request
    ){
       List<TransferEntity> getFilteredList = service.getFilteredEntity(toBaseId, assertId, transferDate, request);
        return new ResponseEntity<>(getFilteredList, HttpStatus.OK);
    }

    @GetMapping("getTransfer")
    public ResponseEntity<List<TransferEntity>> getTransferEntity(HttpServletRequest request){
        List<TransferEntity> getTransferEntity = service.getListOfTransferEntity(request);
        return new ResponseEntity<>(getTransferEntity, HttpStatus.OK);
    }

    @GetMapping("/getTransferDTO")
    public ResponseEntity<List<TransferDTO>> getListOfTransferDto(HttpServletRequest request){
        List<TransferDTO> getListOfTransferDTO = service.getTransferDTO(request);
        return new ResponseEntity<>(getListOfTransferDTO, HttpStatus.OK);
    }

    @PostMapping("/addTransfer")
    public ResponseEntity<?> getCreatedTransaction(@RequestBody TransferEntity transfer, HttpServletRequest request) {
        try {
            transfer.setTransferDate(LocalDate.now());
            TransferEntity createdTransfer = service.createTransfer(transfer, request);
            return new ResponseEntity<>(createdTransfer, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {

            return new ResponseEntity<>("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
