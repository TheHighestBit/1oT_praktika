package com.test.joosep_orasmae;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.FileWriter;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Map;

@Component
public class AverageTemp {
    private final WeatherService weatherService = new WeatherService();

    /**
     * Calculates the average temperature for the hour and writes it to a file.
     */
    @Scheduled(cron = "0 0 * * * ?")
    public void calculateAverageTemp() {
        try {
            int minTemp = 0;
            int minLocations = 0;
            int maxTemp = 0;
            int maxLocations = 0;

            Map<String, Map<String, String>> data = weatherService.getData();
            Object[] dates = data.keySet().toArray();
            Arrays.sort(dates);

            Map<String, String> dayData = data.get(dates[0]);

            for (Map.Entry<String, String> entry : dayData.entrySet()) {
                if (entry.getKey().contains("tempmin")) {
                    minTemp += Integer.parseInt(entry.getValue());
                    minLocations++;
                } else if (entry.getKey().contains("tempmax")) {
                    maxTemp += Integer.parseInt(entry.getValue());
                    maxLocations++;
                }
            }

            FileWriter writer = new FileWriter("average_temp.txt", true);
            writer.write(dates[0] + " " + LocalTime.now().toString() + " - Average Min temp: " + minTemp / minLocations + " - Average Max temp: " + maxTemp / maxLocations + "\n");
            writer.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
