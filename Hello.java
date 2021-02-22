
import java.sql.*;  
public class Hello {
  public static void main(String[] args){
       try{  
      Class.forName("com.mysql.cj.jdbc.Driver");  
      Connection con=DriverManager.getConnection(  
      "jdbc:mysql://localhost:3306/irsystemdb","root","123456");  
      Statement stmt=con.createStatement();  
      ResultSet rs=stmt.executeQuery("select * from doctors");  
      while(rs.next())  
      System.out.println(rs.getInt(1)+"  "+rs.getString(2)+"  "+rs.getString(3));  
      
      ResultSet res = stmt.executeQuery("select count(*) from doctors");
      while(res.next())
      System.out.println("count: "+ res.getInt(1));
      con.close();  
    }
      catch(Exception e){ System.out.println(e);}  
        
  }
}
