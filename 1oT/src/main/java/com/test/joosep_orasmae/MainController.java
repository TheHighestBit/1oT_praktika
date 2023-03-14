package com.test.joosep_orasmae;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.StringReader;
import java.util.HashMap;
import java.util.Map;

@RestController
public class MainController {
    /**
     * Returns the weather data from the Estonian weather service.
     * @return A map with the weather data
     * @throws Exception
     */
    @GetMapping("/get_data")
    public Map<String, Map<String, String>> getData() throws Exception {
        Map<String, Map<String, String>> data = new HashMap<>(); //date -> weather_data

        RestTemplate restTemplate = new RestTemplate();

        String url = "https://www.ilmateenistus.ee/ilma_andmed/xml/forecast.php?lang=eng";

        String response = restTemplate.getForObject(url, String.class);

        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        InputSource is = new InputSource(new StringReader(response));
        Document doc = builder.parse(is);

        // Extract the data from the XML
        NodeList nodes = doc.getElementsByTagName("forecast");

        for (int i = 0; i < nodes.getLength(); i++) {
            Node node = nodes.item(i);

            if (node.getNodeType() == Node.ELEMENT_NODE) {
                Map<String, String> weather_data = new HashMap<>();
                Element element = (Element) node; //Forecast element

                String date = element.getAttribute("date"); //This will be the key in the response object

                dataForTag("night", weather_data, element);
                dataForTag("day", weather_data, element);

                data.put(date, weather_data);
            }
        }

        return data;
    }

    /**
     * Extracts the data for a given tag from the given element and adds it to the given map.
     * @param tag The tag to extract data from (day/night)
     * @param weather_data The map to add the data to
     * @param element The element to extract the data from
     * @return The map with the data added
     */
    private void dataForTag(String tag, Map<String, String> weather_data, Element element) {
        //I'm choosing to encode weather data in strings, since nesting maps would get very messy very quickly. Does add complexity to the frontend though.

        //Extracting the data
        Node data_node = element.getElementsByTagName(tag).item(0); //Each forecast has exactly 1 night element

        if (data_node.getNodeType() == Node.ELEMENT_NODE) {
            Element data_element = (Element) data_node;

            //These fields exist on all night/day elements
            weather_data.put(tag + "_phenomenon", data_element.getElementsByTagName("phenomenon").item(0).getTextContent());
            weather_data.put(tag + "_tempmin", data_element.getElementsByTagName("tempmin").item(0).getTextContent());
            weather_data.put(tag + "_tempmax", data_element.getElementsByTagName("tempmax").item(0).getTextContent());
            weather_data.put(tag + "_text", data_element.getElementsByTagName("text").item(0).getTextContent());

            //Get place data
            NodeList places = data_element.getElementsByTagName("place");
            for (int j = 0; j < places.getLength(); j++) {
                Node place_node = places.item(j);
                if (place_node.getNodeType() == Node.ELEMENT_NODE) {
                    Element place_element = (Element) place_node;
                    String place_name = tag + "_place_" + place_element.getElementsByTagName("name").item(0).getTextContent();

                    weather_data.put(place_name + "_phenomenon", place_element.getElementsByTagName("phenomenon").item(0).getTextContent());

                    //Nights have tempmins and days have tempmaxes
                    if (tag.equals("night"))
                        weather_data.put(place_name + "_tempin", place_element.getElementsByTagName("tempmin").item(0).getTextContent());
                    else if (tag.equals("day")) {
                        weather_data.put(place_name + "_tempax", place_element.getElementsByTagName("tempmax").item(0).getTextContent());
                    }
                }
            }

            //Get wind data
            NodeList winds = data_element.getElementsByTagName("wind");
            for (int j = 0; j < winds.getLength(); j++) {
                Node wind_node = winds.item(j);
                if (wind_node.getNodeType() == Node.ELEMENT_NODE) {
                    Element wind_element = (Element) wind_node;
                    String wind_name = tag + "_wind_" + wind_element.getElementsByTagName("name").item(0).getTextContent();

                    weather_data.put(wind_name + "_direction", wind_element.getElementsByTagName("direction").item(0).getTextContent());
                    weather_data.put(wind_name + "_speedmin", wind_element.getElementsByTagName("speedmin").item(0).getTextContent());
                    weather_data.put(wind_name + "_speedmax", wind_element.getElementsByTagName("speedmax").item(0).getTextContent());
                }
            }

            //Get data for the sea and Peipsi
            NodeList sea = data_element.getElementsByTagName("sea");
            NodeList peipsi = data_element.getElementsByTagName("peipsi");

            if (sea.getLength() > 0) {
                Node sea_node = sea.item(0);
                if (sea_node.getNodeType() == Node.ELEMENT_NODE) {
                    Element sea_element = (Element) sea_node;
                    weather_data.put(tag + "_sea", sea_element.getTextContent());
                }
            }

            if (peipsi.getLength() > 0) {
                Node peipsi_node = peipsi.item(0);
                if (peipsi_node.getNodeType() == Node.ELEMENT_NODE) {
                    Element peipsi_element = (Element) peipsi_node;
                    weather_data.put(tag + "_peipsi", peipsi_element.getTextContent());
                }
            }
        }
    }
}
