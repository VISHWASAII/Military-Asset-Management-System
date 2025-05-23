package com.Kristalball.Military.Asset.Management.System.Controller;

import com.Kristalball.Military.Asset.Management.System.DataTransferObject.PurchaseDTO;
import com.Kristalball.Military.Asset.Management.System.Entities.PurchaseEntity;
import com.Kristalball.Military.Asset.Management.System.Service.PurchaseService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/purchase")
@RequiredArgsConstructor
public class PurchaseController {

    @Autowired
    private PurchaseService service;

    @PostMapping("/createPurchase")
    public ResponseEntity<PurchaseEntity> createPurchase(@RequestBody PurchaseEntity purchase, HttpServletRequest request){
        purchase.setPurchaseDate(LocalDate.now());
        PurchaseEntity purchasedEntity = service.checkPurchase(purchase, request);
      return new ResponseEntity<>(purchasedEntity, HttpStatus.CREATED);
    }

    @GetMapping("/getAllPurchases")
    public ResponseEntity<List<PurchaseEntity>> getAllPurchases(HttpServletRequest request){
        List<PurchaseEntity> getAllPurchases = service.fetchPurchases(request);
        return new ResponseEntity<>(getAllPurchases, HttpStatus.OK);
    }

    @GetMapping("/getListOfPurchaseDTO")
    public ResponseEntity<List<PurchaseDTO>> getListOfPurchaseDTO(HttpServletRequest request){
        List<PurchaseDTO> getListOfPurchaseDto = service.getPurchaseDto(request);
        return new ResponseEntity<>(getListOfPurchaseDto, HttpStatus.OK);
    }
}
