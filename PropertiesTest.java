public class PropertiesTest {
  public static void main(String[] args) {
    System.out.println("Hi "+ System.getProperty("user.name","user")+" welcome!");
    System.out.println(System.getProperty("java.runtime.version"));
    System.out.println("+++++++++++++++++++++++++++++++++");
    System.out.println(System.getProperty("java.vendor"));
  }
}
