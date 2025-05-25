package com.Kristalball.Military.Asset.Management.System.Controller;

import com.Kristalball.Military.Asset.Management.System.Entities.BaseEntity;
import com.Kristalball.Military.Asset.Management.System.Service.BaseService;
import com.fasterxml.jackson.databind.ser.Serializers;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/base")
public class BaseController {

    @Autowired
    BaseService service;

    @GetMapping("/getListOfBase")
    public ResponseEntity<List<BaseEntity>> getListOfBaseEntity( HttpServletRequest request){
        List<BaseEntity> getListofBases = service.getListOfBaseEntity(request);
        return new ResponseEntity<>(getListofBases, HttpStatus.OK);
    }
}
