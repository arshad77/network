import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;

public class Client {
  public static void main(String[] args) throws IOException {
    URL url = new URL("https://dev97972.service-now.com/api/now/table/x_572191_itreq_trap");
    HttpURLConnection con = (HttpURLConnection)url.openConnection();
    con.setRequestMethod("POST");
    con.setRequestProperty("Content-Type", "application/json; utf-8");
    String userCredentials = "admin:jt3HVxgdZHZ8";
    String basicAuth = "Basic " + new String(Base64.getEncoder().encode(userCredentials.getBytes()));
    con.setRequestProperty ("Authorization", basicAuth);  
    con.setRequestProperty("Accept", "application/json");
    con.setDoOutput(true);
    String jsonInputString = "{\"errorindex\":\"0\",\"errorstatus\":\"failiure success\",\"id\":\"2133861152\",\"variablebindings\":\"[1.3.6.1.2.1.1.3.0 = 0:00:00.10, 1.3.6.1.6.3.1.1.4.1.0 = 1.3.6.1.4.1.12028.4.15.0.25, 1.3.6.1.4.1.12028.4.15.1.101 = 2, 1.3.6.1.4.1.12028.4.15.1.102 = 4, 1.3.6.1.4.1.12028.4.104 = 221.135.104.20, 1.3.6.1.4.1.12028.4.15.1.103 = Device: b4:5d:50:ca:65:a2 (221-135-104-20.sify.net) - https://172.29.22.130/ap_monitoring?id=280:Percent Memory Utilization >= 80% for 5 minutes. Notes: MEMORY UTILIZATION THRESHOLD ALERT.; 1.3.6.1.4.1.12028.4.104 = 221.135.104.20; 1.3.6.1.4.1.12028.4.117 = Top > TEST]\"}";
    try(OutputStream os = con.getOutputStream()) {
      byte[] input = jsonInputString.getBytes("utf-8");
      os.write(input, 0, input.length);			
    }
    try(BufferedReader br = new BufferedReader(
    new InputStreamReader(con.getInputStream(), "utf-8"))) {
      StringBuilder response = new StringBuilder();
      String responseLine = null;
      while ((responseLine = br.readLine()) != null) {
          response.append(responseLine.trim());
      }
      System.out.println(response.toString());
     }
  }
}
