package com.Kristalball.Military.Asset.Management.System.Controller;

import com.Kristalball.Military.Asset.Management.System.Entities.AssertEntity;
import com.Kristalball.Military.Asset.Management.System.Service.AssertService;
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
@RequestMapping("/asset")
public class AssetController {

    @Autowired
    private AssertService service;

    @GetMapping("/getListOfAsset")
    public ResponseEntity<List<AssertEntity>> getListOfAssert( HttpServletRequest request){
        List<AssertEntity> getListOfAssertEntity = service.getAssetEntity(request);
        return new ResponseEntity<>(getListOfAssertEntity, HttpStatus.OK);
    }
}
