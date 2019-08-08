package database;

import java.net.URI;
import java.net.URISyntaxException;
import java.sql.*;

public class DBConnection {
    private Connection connection;
    public PreparedStatement preparedStatement;
    public ResultSet resultSet;

    public void setDriverManager() {
        try {
            Driver driver = new com.mysql.cj.jdbc.Driver();
            DriverManager.registerDriver(driver);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void setConnection() {
        try {
            String connectionString = "jdbc:postgresql://ec2-54-221-198-156.compute-1.amazonaws.com:5432/d2682ruo391s06";
            String user = "jjbvjvubykzvyw";
            String password = "03463411841b7304f57b12533016d23dbe5c5698790dd14a3bc3ab4319214de7";
            Class.forName("org.postgresql.Driver");
            connection = DriverManager.getConnection(connectionString, user, password);
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    public void setPreparedStatement(String query) {
        try {
            preparedStatement = connection.prepareStatement(query);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void getResultSet() {
        try {
            resultSet = preparedStatement.executeQuery();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void closeConnection() {
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public void disableChecksForForeignKey() {
        try {
            preparedStatement = connection.prepareStatement(SQLQuery.foreignKeyChecks);
            preparedStatement.execute();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}