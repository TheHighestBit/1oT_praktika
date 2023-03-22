package com.test.joosep_orasmae;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class MainController {
    /**
     * Returns the weather data from the Estonian weather service.
     * @return A map with the weather data
     * @throws Exception
     */
    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/get_data")
    public ResponseEntity<Map<String, Map<String, String>>> getData() throws Exception {
        System.out.println("Data request received");
        WeatherService weatherService = new WeatherService();
        Map<String, Map<String, String>> data = weatherService.getData();

        return ResponseEntity.ok(data);
    }
}
